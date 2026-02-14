/**
 * ============================================================================
 * REFERENCE IMPLEMENTATION: CoinGecko Proxy Endpoint
 * ============================================================================
 *
 * Proxies CoinGecko /coins/markets with DB caching (2 min TTL).
 * On 429 rate limit, serves stale cached data.
 *
 * Environment variables needed:
 *   - DATABASE_URL: PostgreSQL connection string
 *
 * No API key needed — uses CoinGecko free tier.
 *
 * Original logic from: supabase/functions/coingecko-proxy/index.ts
 * ============================================================================
 */

// import { Router, Request, Response } from 'express';
// import { Pool } from 'pg';

const CACHE_TTL_MS = 120_000; // 2 minutes

/**
 * GET /coingecko-proxy?page=1&per_page=100
 *
 * Returns: Array of CoinGecko coin market objects
 * Response format: see server/README.md for full schema
 *
 * Caching:
 *   - Cache key: "coingecko-markets-p{page}-pp{perPage}"
 *   - TTL: 2 minutes
 *   - On 429: serve stale cache if available
 */

// const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// const router = Router();
//
// router.get('/coingecko-proxy', async (req: Request, res: Response) => {
//   const page = req.query.page || '1';
//   const perPage = req.query.per_page || '100';
//   const cacheKey = `coingecko-markets-p${page}-pp${perPage}`;
//
//   // Check cache
//   const { rows } = await pool.query(
//     'SELECT body, cached_at, status FROM api_cache WHERE path = $1',
//     [cacheKey]
//   );
//   const cached = rows[0] || null;
//   const cachedAge = cached ? Date.now() - new Date(cached.cached_at).getTime() : Infinity;
//
//   if (cached && cachedAge < CACHE_TTL_MS && cached.status === 200) {
//     return res.set('X-Cache', 'HIT').json(JSON.parse(cached.body));
//   }
//
//   // Fetch from CoinGecko
//   const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=1h,24h,7d,30d`;
//   const response = await fetch(apiUrl, { headers: { Accept: 'application/json' } });
//
//   if (response.status === 429 && cached && cached.status === 200) {
//     return res.set('X-Cache', 'STALE').json(JSON.parse(cached.body));
//   }
//
//   const body = await response.text();
//
//   if (response.ok) {
//     await pool.query(
//       `INSERT INTO api_cache (path, body, status, cached_at) VALUES ($1, $2, 200, NOW())
//        ON CONFLICT (path) DO UPDATE SET body = $2, status = 200, cached_at = NOW()`,
//       [cacheKey, body]
//     );
//   }
//
//   return res.status(response.status).set('X-Cache', 'MISS').send(body);
// });
//
// export default router;
