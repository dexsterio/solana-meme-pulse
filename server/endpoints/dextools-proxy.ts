/**
 * ============================================================================
 * REFERENCE IMPLEMENTATION: DexTools Proxy Endpoint
 * ============================================================================
 *
 * This is a reference Express/Node.js implementation of the DexTools proxy.
 * Adapt it to your framework (Express, Fastify, Hono, etc.).
 *
 * Environment variables needed:
 *   - DEXTOOLS_API_KEY: Your DexTools API key
 *   - DATABASE_URL: PostgreSQL connection string (for api_cache table)
 *
 * Original logic from: supabase/functions/dextools-proxy/index.ts
 * ============================================================================
 */

import { Router, Request, Response } from 'express'; // Adapt to your framework
// import { Pool } from 'pg'; // Use your preferred Postgres client

const DEXTOOLS_BASE = 'https://public-api.dextools.io/trial/v2';

// const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * TTL in seconds based on the DexTools path pattern.
 * Rankings change slowly → longer TTL. Pool prices change fast → shorter TTL.
 */
function getTTLSeconds(path: string): number {
  if (path.includes('/ranking/'))              return 120;
  if (path.match(/\/token\/[^/]+\/price/))     return 90;
  if (path.match(/\/token\/[^/]+\/info/))      return 90;
  if (path.match(/\/token\//))                 return 90;
  if (path.match(/\/pool\/[^/]+\/price/))      return 90;
  if (path.match(/\/pool\/[^/]+\/liquidity/))  return 90;
  if (path.includes('/pool/'))                 return 60;
  return 60;
}

/**
 * Fetch from DexTools with exponential backoff on 429 (rate limit).
 * Returns { body, status }.
 */
async function fetchWithRetry(
  url: string,
  apiKey: string,
  maxRetries = 3
): Promise<{ body: string; status: number }> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: { 'X-API-Key': apiKey, Accept: 'application/json' },
    });

    if (response.status === 429 && attempt < maxRetries - 1) {
      const retryAfter = response.headers.get('Retry-After');
      const waitMs = retryAfter
        ? parseInt(retryAfter, 10) * 1000
        : Math.pow(2, attempt + 1) * 2000 + Math.random() * 1000;
      await new Promise((r) => setTimeout(r, waitMs));
      continue;
    }

    const body = await response.text();
    return { body, status: response.status };
  }

  return { body: JSON.stringify({ message: 'Max retries exceeded' }), status: 429 };
}

/**
 * GET /dextools-proxy?path=/ranking/solana/hotpools
 *
 * 1. Check api_cache for fresh data
 * 2. If stale/missing, fetch from DexTools
 * 3. On 429, serve stale data if available + set 120s cooldown marker
 * 4. On success, cache and return
 */
// const router = Router();
// router.get('/dextools-proxy', async (req: Request, res: Response) => {
//   const path = req.query.path as string;
//   if (!path) return res.status(400).json({ error: 'Missing path parameter' });
//
//   const apiKey = process.env.DEXTOOLS_API_KEY;
//   if (!apiKey) return res.status(500).json({ error: 'DEXTOOLS_API_KEY not configured' });
//
//   const ttl = getTTLSeconds(path);
//
//   // Step 1: Check cache
//   const cacheResult = await pool.query(
//     'SELECT body, status, cached_at FROM api_cache WHERE path = $1',
//     [path]
//   );
//   const cached = cacheResult.rows[0] || null;
//
//   // Step 2: Check 429 cooldown marker
//   const markerResult = await pool.query(
//     'SELECT cached_at FROM api_cache WHERE path = $1',
//     [`__429__${path}`]
//   );
//   const marker = markerResult.rows[0] || null;
//
//   if (marker) {
//     const markerAge = (Date.now() - new Date(marker.cached_at).getTime()) / 1000;
//     if (markerAge < 120) {
//       // In cooldown — serve stale if available
//       if (cached && cached.status >= 200 && cached.status < 300) {
//         return res.set('X-Cache', 'STALE').json(JSON.parse(cached.body));
//       }
//       return res.status(429).json({ error: 'Rate limited', retryAfter: Math.ceil(120 - markerAge) });
//     }
//   }
//
//   // Step 3: Serve fresh cache
//   if (cached && cached.status >= 200 && cached.status < 300) {
//     const age = (Date.now() - new Date(cached.cached_at).getTime()) / 1000;
//     if (age < ttl) {
//       return res.set('X-Cache', 'HIT').json(JSON.parse(cached.body));
//     }
//   }
//
//   // Step 4: Fetch from DexTools
//   const { body, status } = await fetchWithRetry(`${DEXTOOLS_BASE}${path}`, apiKey);
//
//   if (status >= 200 && status < 300) {
//     await pool.query(
//       `INSERT INTO api_cache (path, body, status, cached_at) VALUES ($1, $2, $3, NOW())
//        ON CONFLICT (path) DO UPDATE SET body = $2, status = $3, cached_at = NOW()`,
//       [path, body, status]
//     );
//     return res.set('X-Cache', 'MISS').json(JSON.parse(body));
//   }
//
//   if (status === 429) {
//     // Save cooldown marker
//     await pool.query(
//       `INSERT INTO api_cache (path, body, status, cached_at) VALUES ($1, '429', 429, NOW())
//        ON CONFLICT (path) DO UPDATE SET body = '429', status = 429, cached_at = NOW()`,
//       [`__429__${path}`]
//     );
//     // Serve stale if available
//     if (cached && cached.status >= 200 && cached.status < 300) {
//       return res.set('X-Cache', 'STALE').json(JSON.parse(cached.body));
//     }
//     return res.status(429).json(JSON.parse(body));
//   }
//
//   return res.status(status).json(JSON.parse(body));
// });
//
// export default router;
