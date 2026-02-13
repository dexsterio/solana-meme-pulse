

# Server-Side Cache System for DexTools API

## Problem
Every frontend page/component triggers its own API calls to DexTools through the edge function. A single category fetch (e.g., hotpools) makes ~15 sequential API calls (1 listing + 5 price + 5 logo + extras). With the DexTools trial plan limit of ~30 req/min, this causes constant 429 rate limit errors.

## Solution: Two-Layer Caching

### Layer 1: Edge Function Server-Side Cache
Add an in-memory cache inside the `dextools-proxy` edge function. Every DexTools response is cached by its path with a configurable TTL (time-to-live). When a request comes in:
- If the path is in cache and not expired, return the cached response instantly (zero DexTools API calls)
- If expired or missing, fetch from DexTools, cache the result, then return it

Cache TTLs:
- Rankings (hotpools, gainers, losers): 120 seconds
- Token info/price: 90 seconds  
- Pool price/liquidity: 90 seconds
- New pairs listing: 60 seconds

### Layer 2: Frontend Shared Data Store
Create a centralized `TokenDataProvider` (React Context) that fetches data once and shares it across all components (TrendingBar, TokenTable, TokenGrid, StatsBar, etc.). This eliminates duplicate fetches from different components rendering at the same time.

## Files to Modify

### 1. `supabase/functions/dextools-proxy/index.ts`
- Add a `Map<string, { data: string; timestamp: number }>` in-memory cache
- Before calling DexTools, check if the path has a valid cached entry
- Add a `Cache-Control` response header so the browser also knows the data is cacheable
- Add a `X-Cache: HIT` or `X-Cache: MISS` header for debugging
- Add cache size limit (max 200 entries) with LRU-style eviction

### 2. `src/services/dextoolsApi.ts`
- Remove the client-side throttle delay (`MIN_DELAY_MS`) since the edge function cache handles rate protection
- Keep the 429 error handling as a safety net
- Remove `logoCache` and `tokenInfoCache` (server-side cache replaces them)

### 3. `src/hooks/useTokens.ts`
- Keep `staleTime: 90_000` and `refetchInterval: 120_000` (matches server cache TTL)
- These settings already prevent React Query from re-fetching too aggressively

### 4. `src/pages/Index.tsx`
- No changes needed -- TrendingBar already receives tokens as props from the same query, so no duplicate fetches

### 5. `src/pages/TokenDetail.tsx`
- No changes needed -- uses its own query for a single token detail, which will benefit from edge function cache

## Technical Details

### Edge Function Cache Implementation
```text
In-memory Map stored at module level (persists across requests within the same edge function instance):

cache = Map<path, { body: string, status: number, cachedAt: number }>

On each request:
  1. Check cache[path]
  2. If exists AND (now - cachedAt) < TTL -> return cached body (X-Cache: HIT)
  3. Else -> fetch from DexTools, store in cache, return (X-Cache: MISS)
  4. If cache.size > 200 -> delete oldest entries

TTL logic by path pattern:
  /ranking/* -> 120s
  /token/*/price -> 90s
  /token/*/info -> 90s
  /token/* -> 90s
  /pool/*/price -> 90s
  /pool/*/liquidity -> 90s
  /pool/* (new pairs) -> 60s
```

### Request Flow After Implementation
```text
Before (per category load):
  Frontend -> Edge Fn -> DexTools (x15 calls) = 15 API hits

After (per category load, warm cache):
  Frontend -> Edge Fn -> Cache HIT (x15 calls) = 0 API hits
  
After (cold cache, first load):
  Frontend -> Edge Fn -> DexTools (x15 calls) = 15 API hits
  Then cached for 90-120s for ALL subsequent users/tabs/pages
```

### Impact
- First load: same as before (15 DexTools calls)
- All subsequent loads within 90-120s: zero DexTools calls
- Multiple browser tabs, page navigation back and forth: zero extra calls
- TokenDetail page for a token already seen in listing: cache HIT on token info/price
- Estimated reduction: 80-95% fewer DexTools API calls

