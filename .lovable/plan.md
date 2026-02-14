
# Migration-Ready Codebase: Remove Supabase Dependencies & Add Developer Comments

## Overview

This plan will systematically go through every file that depends on Supabase/Lovable Cloud and either replace those dependencies with configurable API endpoints or add clear migration comments. The goal is to make it trivial for your developer to point the app at your own server.

---

## Current Supabase Dependencies (What Needs to Change)

The app uses Supabase in exactly **4 places**:

| Dependency | File(s) | Purpose |
|---|---|---|
| **Edge Function: `dextools-proxy`** | `src/services/dextoolsApi.ts` | Proxies DexTools API calls with caching |
| **Edge Function: `coingecko-proxy`** | `src/services/coingeckoApi.ts` | Proxies CoinGecko API calls with caching |
| **Edge Function: `crypto-global`** | `src/services/coingeckoApi.ts` | Fetches Fear & Greed, BTC dominance, gas |
| **Database table: `api_cache`** | Used inside edge functions | Caches API responses to avoid rate limits |

Everything else (DexScreener, PumpPortal WebSocket, viral detection) is **already independent** and talks directly to external APIs or runs client-side.

---

## Implementation Plan

### 1. Create `src/config/api.ts` -- Central API Configuration

A single config file where your developer sets the base URL of your own backend server. All service files will import from here instead of reading `VITE_SUPABASE_URL`.

```text
// src/config/api.ts
//
// MIGRATION: Point API_BASE_URL to your own server.
// Your server needs to implement 3 endpoints:
//   POST /api/dextools-proxy?path=...   (proxies DexTools v2 API)
//   GET  /api/coingecko-proxy?page=...  (proxies CoinGecko markets)
//   GET  /api/crypto-global             (returns fear/greed, BTC dom, gas)
//
// Example: const API_BASE_URL = 'https://api.yourserver.com';
```

### 2. Modify `src/services/dextoolsApi.ts`

- Replace `VITE_SUPABASE_URL` + `/functions/v1/dextools-proxy` with `API_BASE_URL` + `/api/dextools-proxy`
- Remove the `apikey` header (your server handles auth)
- Add detailed comments explaining what each endpoint expects and returns
- Document the expected response format for each DexTools proxy call

### 3. Modify `src/services/coingeckoApi.ts`

- Replace `VITE_SUPABASE_URL` + `/functions/v1/coingecko-proxy` with `API_BASE_URL` + `/api/coingecko-proxy`
- Replace `VITE_SUPABASE_URL` + `/functions/v1/crypto-global` with `API_BASE_URL` + `/api/crypto-global`
- Remove `Authorization: Bearer ...` header
- Add comments documenting the expected response JSON schema for each endpoint

### 4. Convert Edge Functions to Standalone Server Docs

Create `server/README.md` with complete documentation on how to implement the 3 proxy endpoints on your own server, including:
- Exact request/response formats
- Caching strategy (TTLs, stale-on-error)
- Rate limit handling with 429 markers
- Required API keys (DEXTOOLS_API_KEY)
- SQL schema for the `api_cache` table (portable, works on any Postgres)

### 5. Create `server/endpoints/` Reference Implementations

Move the edge function logic into standalone Node.js/Express-compatible files (as reference):
- `server/endpoints/dextools-proxy.ts` -- reference implementation
- `server/endpoints/coingecko-proxy.ts` -- reference implementation  
- `server/endpoints/crypto-global.ts` -- reference implementation
- `server/endpoints/schema.sql` -- The `api_cache` table DDL for any Postgres database

These are NOT runnable files in the Vite app -- they are documentation/reference for your developer.

### 6. Add Comments Throughout Services

Add `// MIGRATION:` and `// TODO(backend):` comments to every file that has backend-related logic:

- **`src/services/pumpPortalService.ts`** -- Already standalone (WebSocket to pumpportal.fun). Add comment: "No migration needed -- connects directly to PumpPortal WebSocket."
- **`src/services/dexscreenerApi.ts`** -- Already standalone (direct HTTP to DexScreener). Add comment: "No migration needed -- free public API, no proxy required."
- **`src/services/viralDetectionService.ts`** -- Already standalone (client-side logic). Add comment: "No migration needed -- pure client-side clustering."
- **`src/data/mockTokens.ts`** -- Add comments explaining the Token interface and that `generateMockTransactions` should be replaced with real transaction data from your backend.
- **`src/components/PriceChart.tsx`** -- Add comment: "TODO(backend): Replace mock price data with real OHLCV candle data from your server."
- **`src/components/TransactionList.tsx`** -- Add comment: "TODO(backend): Replace generateMockTransactions() with real transaction feed from your server."
- **`src/components/TradingPanel.tsx`** -- Add comment: "TODO(backend): Connect wallet integration and order execution to your trading backend."
- **`src/components/TokenInfoPanel.tsx`** -- Add comments on which data points (holders, top traders, audit info) need real backend endpoints.

### 7. Remove/Decouple Supabase Client

- **`src/integrations/supabase/client.ts`** -- Add comment at top: "MIGRATION: This file can be deleted entirely. No frontend code should import from here after migration."
- **`src/integrations/supabase/types.ts`** -- Same comment.
- The only import of the Supabase client is inside edge functions (server-side). The frontend never imports it directly.

### 8. Update `.env` with Migration Notes

Add a new env var `VITE_API_BASE_URL` that defaults to the current Supabase URL but can be changed to any server URL. Add comments explaining each variable.

---

## Files to Create/Modify

| File | Action | Description |
|---|---|---|
| `src/config/api.ts` | **Create** | Central API config with `API_BASE_URL` |
| `src/services/dextoolsApi.ts` | **Modify** | Use `API_BASE_URL`, remove Supabase headers, add migration comments |
| `src/services/coingeckoApi.ts` | **Modify** | Use `API_BASE_URL`, remove Supabase auth, add migration comments |
| `src/services/dexscreenerApi.ts` | **Modify** | Add "no migration needed" comments |
| `src/services/pumpPortalService.ts` | **Modify** | Add "no migration needed" comments |
| `src/services/viralDetectionService.ts` | **Modify** | Add "no migration needed" comments |
| `src/data/mockTokens.ts` | **Modify** | Add comments on Token interface and mock data replacement |
| `src/components/PriceChart.tsx` | **Modify** | Add TODO comments for real OHLCV data |
| `src/components/TransactionList.tsx` | **Modify** | Add TODO comments for real transaction feed |
| `src/components/TradingPanel.tsx` | **Modify** | Add TODO comments for wallet + trading backend |
| `src/components/TokenInfoPanel.tsx` | **Modify** | Add TODO comments for real holder/audit data |
| `src/hooks/useTokens.ts` | **Modify** | Add comments explaining data flow |
| `server/README.md` | **Create** | Complete backend migration guide |
| `server/endpoints/dextools-proxy.ts` | **Create** | Reference Express endpoint (from edge function) |
| `server/endpoints/coingecko-proxy.ts` | **Create** | Reference Express endpoint (from edge function) |
| `server/endpoints/crypto-global.ts` | **Create** | Reference Express endpoint (from edge function) |
| `server/endpoints/schema.sql` | **Create** | Postgres `api_cache` table DDL |

---

## What Your Developer Gets

After this change, your developer will:

1. **See `VITE_API_BASE_URL`** in `.env` -- change it to your server URL
2. **Read `server/README.md`** for a complete guide on what endpoints to implement
3. **Copy reference implementations** from `server/endpoints/` to bootstrap their Express/Fastify/whatever server
4. **Search for `TODO(backend):`** across the codebase to find every placeholder that needs real data
5. **Search for `MIGRATION:`** to find every Supabase-specific line that was changed

The app will continue to work with the current Supabase setup until your developer switches `VITE_API_BASE_URL` to the new server.
