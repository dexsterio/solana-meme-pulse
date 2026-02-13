

# Fix DexTools API Integration - Complete Overhaul

## Problem
The current API integration is completely broken:
1. The CORS proxy (`corsproxy.io`) is failing on every request
2. The API response mapping is wrong - hotpools returns pool metadata only (no price/volume)
3. Token logos are not being fetched
4. Header name is incorrect (`x-api-key` should be `X-API-Key`)

## Root Cause Analysis from API Spec

The DexTools API has a specific data structure:

- **`/v2/ranking/solana/hotpools`** returns `RankedPool[]` with: rank, address, exchangeName, creationTime, mainToken (address/symbol/name), sideToken - but NO price, volume, or variations
- **`/v2/ranking/solana/gainers`** returns `GainersLosersPool[]` with: same as above PLUS price, price24h, variation24h
- **`/v2/pool/solana/{poolAddress}/price`** returns `PoolPrice` with: price, priceChain, volume5m/1h/6h/24h, buys/sells, variation5m/1h/6h/24h - THIS is where the real data lives
- **`/v2/token/solana/{tokenAddress}`** returns `TokenDescription` with: name, symbol, **logo** URL, description, socialInfo
- **`/v2/token/solana/{tokenAddress}/info`** returns `TokenFinancialInfo` with: mcap, fdv, holders, circulatingSupply
- **`/v2/pool/solana?sort=creationTime&order=desc&from=...&to=...`** for New Pairs

## Solution

### 1. Fix CORS - Try multiple proxy services (`dextoolsApi.ts`)
Replace the single `corsproxy.io` proxy with a fallback chain:
- Try `https://api.allorigins.win/raw?url=` first
- Fallback to `https://corsproxy.io/?url=`  
- Fallback to direct call (in case DexTools allows it)

### 2. Correct API header (`dextoolsApi.ts`)
Change header from `x-api-key` to `X-API-Key` per the OpenAPI spec security scheme.

### 3. Implement proper multi-step data fetching (`dextoolsApi.ts`)

For **Trending (hotpools)**:
1. Call `/v2/ranking/solana/hotpools` to get pool list with addresses
2. For each pool, call `/v2/pool/solana/{address}/price` to get price, volume, variations, buys/sells
3. For each mainToken, call `/v2/token/solana/{mainToken.address}` to get logo URL
4. Combine all data into Token interface

For **Gainers**:
1. Call `/v2/ranking/solana/gainers` (already includes price + variation24h)
2. Enrich with pool price endpoint for full variation data (5m, 1h, 6h)
3. Fetch token logos

For **New Pairs**:
1. Call `/v2/pool/solana?sort=creationTime&order=desc&from={24hAgo}&to={now}`
2. Enrich with price data and token logos

For **Token Detail**:
1. Call `/v2/token/solana/{address}` for metadata + logo + socials
2. Call `/v2/token/solana/{address}/info` for mcap, fdv, holders
3. Call `/v2/token/solana/{address}/price` for price variations

### 4. Rate limiting and batching (`dextoolsApi.ts`)
The trial plan has rate limits. Implement:
- Batch pool price requests (max 5-10 concurrent)
- Cache token logos (they don't change often)
- Only fetch detailed price data for visible pools (first 20)

### 5. Update Token interface (`mockTokens.ts`)
Add `logoUrl` field (string URL) alongside existing `logo` emoji fallback.

### 6. Remove mock data dependency
- Remove `mockTokens` array from being used as placeholder data
- Show proper loading skeleton instead
- Keep `mockTokens.ts` only for the Token interface and format utilities

### 7. Update components
- **TokenTable.tsx**: Display actual token logo image (from logoUrl) instead of colored squares
- **TrendingBar.tsx**: Show token logo images
- **StatsBar.tsx**: Aggregate real volume/txns from pool price data

## Technical Details

### File changes:

**`src/services/dextoolsApi.ts`** - Complete rewrite:
- Multi-proxy CORS bypass with fallback
- Correct `X-API-Key` header
- `fetchHotPools()`: fetch ranking + enrich with pool prices + token logos
- `fetchGainers()`: fetch gainers + enrich with full price data
- `fetchNewPairs()`: fetch recent pools sorted by creation time
- `fetchTokenDetails()`: full token info with metadata, price, financials
- Rate-limited batch fetcher for pool prices
- Response caching for logos

**`src/data/mockTokens.ts`**:
- Add `logoUrl?: string` to Token interface
- Keep format utilities
- Remove or keep mockTokens array only as type reference (not for display)

**`src/hooks/useTokens.ts`**:
- Add `fetchNewPairs` to category switch
- Remove mockTokens as placeholderData
- Add proper error handling with retry

**`src/components/TokenTable.tsx`**:
- Replace colored square icons with `<img>` for token logo (with emoji fallback)

**`src/components/TrendingBar.tsx`**:
- Show real token logo images

**`src/pages/Index.tsx`**:
- Add loading skeleton
- Remove mock data fallback display

**`src/pages/TokenDetail.tsx`**:
- Use live `fetchTokenDetails()` instead of finding in mockTokens array

## Data Flow

```text
User opens page
  --> useTokens('trending') fires
    --> fetchHotPools()
      --> GET /v2/ranking/solana/hotpools (pool list with addresses)
      --> For top 20 pools: GET /v2/pool/solana/{addr}/price (price + volume + variations)
      --> For top 20 tokens: GET /v2/token/solana/{tokenAddr} (logo + metadata)
      --> Combine into Token[] and return
    --> Display in TokenTable with real logos, prices, volumes
```

