/**
 * ============================================================================
 * CENTRAL API CONFIGURATION
 * ============================================================================
 *
 * MIGRATION: Change VITE_API_BASE_URL in your .env file to point to your
 * own backend server. The app will then route all proxy requests there
 * instead of the current Supabase Edge Functions.
 *
 * Your server needs to implement these 3 endpoints:
 *
 *   1. GET /dextools-proxy?path=<dextools_v2_path>
 *      - Proxies requests to DexTools v2 API (https://public-api.dextools.io/trial/v2)
 *      - Requires DEXTOOLS_API_KEY on the server side
 *      - Should implement DB caching with stale-on-error (see server/README.md)
 *
 *   2. GET /coingecko-proxy?page=<n>&per_page=<n>
 *      - Proxies CoinGecko /coins/markets endpoint
 *      - No API key needed (free tier), but needs caching to avoid rate limits
 *
 *   3. GET /crypto-global
 *      - Returns aggregated global crypto data:
 *        { fearGreed: { value, classification }, btcDominance, ethDominance,
 *          totalMarketCap, marketCapChange24h, ethGas }
 *
 * Example .env:
 *   VITE_API_BASE_URL=https://api.yourserver.com
 *
 * Fallback: If VITE_API_BASE_URL is not set, uses the current Supabase URL
 * (for backwards compatibility during migration).
 * ============================================================================
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export const ENDPOINTS = {
  /** Proxies DexTools v2 API. Query param: ?path=/ranking/solana/hotpools etc. */
  DEXTOOLS_PROXY: `${API_BASE_URL}/dextools-proxy`,

  /** Proxies CoinGecko markets. Query params: ?page=1&per_page=100 */
  COINGECKO_PROXY: `${API_BASE_URL}/coingecko-proxy`,

  /** Returns global crypto stats (Fear & Greed, BTC dominance, ETH gas). */
  CRYPTO_GLOBAL: `${API_BASE_URL}/crypto-global`,
};

export default API_BASE_URL;
