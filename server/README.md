# Backend Migration Guide

This document describes how to implement the 3 proxy endpoints on your own server so the frontend can be fully decoupled from Supabase/Lovable Cloud.

## Quick Start

1. Set `VITE_API_BASE_URL` in the frontend `.env` to your server URL (e.g. `https://api.yourserver.com`)
2. Implement the 3 endpoints below
3. Set up a PostgreSQL `api_cache` table (see `schema.sql`)
4. Store `DEXTOOLS_API_KEY` as an environment variable on your server

---

## Endpoints

### 1. `GET /dextools-proxy?path=<path>`

Proxies requests to the DexTools v2 API (`https://public-api.dextools.io/trial/v2`).

**Query Parameters:**
- `path` (required): The DexTools API path, e.g. `/ranking/solana/hotpools`

**Server Logic:**
1. Check `api_cache` table for a cached response matching `path`
2. If cache is fresh (within TTL), return cached `body` with `X-Cache: HIT`
3. If cache is stale or missing, fetch from DexTools with `X-API-Key` header
4. On success (2xx), save to cache and return
5. On 429 (rate limit), save a cooldown marker (`__429__<path>`) and serve stale data if available
6. Implement exponential backoff (3 retries) for 429 errors

**TTL by path pattern:**
| Pattern | TTL |
|---|---|
| `/ranking/*` | 120s |
| `/token/*/price`, `/token/*/info`, `/token/*` | 90s |
| `/pool/*/price`, `/pool/*/liquidity` | 90s |
| `/pool/*` | 60s |
| Default | 60s |

**Headers sent to DexTools:**
```
X-API-Key: <DEXTOOLS_API_KEY>
Accept: application/json
```

**Response:** Pass through the DexTools JSON response body.

---

### 2. `GET /coingecko-proxy?page=<n>&per_page=<n>`

Proxies requests to the CoinGecko free markets endpoint.

**Query Parameters:**
- `page` (default: 1): Page number
- `per_page` (default: 100): Results per page

**Server Logic:**
1. Cache key: `coingecko-markets-p${page}-pp${perPage}`
2. Check `api_cache` for fresh data (TTL: 120s)
3. If stale, fetch from: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=1h,24h,7d,30d`
4. On 429, serve stale cache if available
5. On success, save to cache

**Response:** Array of CoinGecko coin objects:
```json
[
  {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "image": "https://...",
    "current_price": 67000,
    "market_cap": 1300000000000,
    "total_volume": 25000000000,
    "price_change_percentage_24h": 2.5,
    "price_change_percentage_1h_in_currency": 0.3,
    "price_change_percentage_7d_in_currency": 5.1,
    "price_change_percentage_30d_in_currency": 12.0,
    "market_cap_rank": 1,
    "fully_diluted_valuation": 1400000000000
  }
]
```

---

### 3. `GET /crypto-global`

Returns aggregated global crypto market data from multiple sources.

**Data Sources:**
1. CoinGecko Global: `https://api.coingecko.com/api/v3/global`
2. Fear & Greed Index: `https://api.alternative.me/fng/?limit=1`
3. ETH Gas (Blocknative or Etherscan fallback)

**Response Schema:**
```json
{
  "fearGreed": { "value": 72, "classification": "Greed" },
  "btcDominance": 54.2,
  "ethDominance": 17.8,
  "totalMarketCap": 2500000000000,
  "marketCapChange24h": 1.5,
  "ethGas": 25
}
```

---

## Database: `api_cache` Table

See `schema.sql` for the DDL. This table caches API responses to avoid rate limits.

| Column | Type | Description |
|---|---|---|
| `path` | TEXT PRIMARY KEY | Cache key (API path or custom key) |
| `body` | TEXT NOT NULL | Cached JSON response body |
| `status` | INTEGER DEFAULT 200 | HTTP status code of cached response |
| `cached_at` | TIMESTAMPTZ DEFAULT now() | When this entry was last updated |

---

## Services That Do NOT Need Migration

These frontend services connect directly to public APIs or run client-side:

| Service | Why No Migration Needed |
|---|---|
| `dexscreenerApi.ts` | Direct HTTPS to `api.dexscreener.com` (free, no key) |
| `pumpPortalService.ts` | WebSocket to `wss://pumpportal.fun/api/data` (free, no key) |
| `viralDetectionService.ts` | Pure client-side clustering logic, no API calls |

---

## Finding TODOs in the Codebase

Search for these markers to find every point that needs backend work:

- `MIGRATION:` — Lines changed to decouple from Supabase
- `TODO(backend):` — Placeholder/mock data that should be replaced with real server data
