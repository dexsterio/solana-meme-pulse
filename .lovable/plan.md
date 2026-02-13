

# Edge Function Proxy for DexTools API

## Problem
DexTools API requires an `X-API-Key` header but does not support CORS. All CORS proxy attempts fail because they either don't forward the API key header or DexTools rejects the proxied request (403 Forbidden). The only reliable solution is a server-side proxy.

## Solution
Create a Supabase Edge Function (`dextools-proxy`) that:
1. Receives requests from the frontend with the desired DexTools endpoint path
2. Forwards them to `https://public-api.dextools.io/trial/v2/` with the API key server-side
3. Returns the response with proper CORS headers

Then update the frontend `dextoolsApi.ts` to call the edge function instead of CORS proxies.

## Implementation

### 1. Store API key as a secret
Use the secrets tool to securely store `DEXTOOLS_API_KEY` so the edge function can access it via `Deno.env.get()`.

### 2. Create Edge Function: `supabase/functions/dextools-proxy/index.ts`
- Accept GET requests with a `path` query parameter (e.g., `?path=/ranking/solana/hotpools`)
- Forward to DexTools API with the `X-API-Key` header from the secret
- Return JSON response with CORS headers
- Handle errors gracefully

### 3. Update `supabase/config.toml`
- Add `[functions.dextools-proxy]` with `verify_jwt = false` (public endpoint, no auth needed)

### 4. Rewrite `src/services/dextoolsApi.ts`
- Remove all CORS proxy logic (codetabs, corsproxy, allorigins)
- Remove hardcoded API key from frontend code
- Replace `apiFetch()` to call the edge function URL with `?path=` parameter
- Keep all the existing enrichment logic (fetchHotPools, fetchGainers, fetchNewPairs, fetchTokenDetails) intact

## Technical Details

### Edge Function (simple proxy)
```text
GET /functions/v1/dextools-proxy?path=/ranking/solana/hotpools
  --> Server fetches: https://public-api.dextools.io/trial/v2/ranking/solana/hotpools
      with header X-API-Key from Deno.env
  --> Returns JSON to client with CORS headers
```

### Files to create/modify:
- **Create** `supabase/functions/dextools-proxy/index.ts` - The proxy edge function
- **Create/Update** `supabase/config.toml` - JWT verification disabled for this function
- **Modify** `src/services/dextoolsApi.ts` - Replace proxy chain with single edge function call, remove API key from frontend

### Security
- API key stored as Supabase secret (not in frontend code)
- Edge function is a simple passthrough proxy - no sensitive logic exposed
- No JWT required since this is public data (same as DexScreener)

