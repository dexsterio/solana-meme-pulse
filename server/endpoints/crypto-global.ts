/**
 * ============================================================================
 * REFERENCE IMPLEMENTATION: Crypto Global Endpoint
 * ============================================================================
 *
 * Aggregates global crypto market data from 3 sources:
 *   1. CoinGecko /global — BTC/ETH dominance, total market cap
 *   2. Alternative.me Fear & Greed Index
 *   3. Blocknative / Etherscan — ETH gas price
 *
 * No API keys needed (all free endpoints).
 * Consider adding caching (e.g. 60s TTL) to avoid rate limits.
 *
 * Original logic from: supabase/functions/crypto-global/index.ts
 * ============================================================================
 */

// import { Router, Request, Response } from 'express';
//
// const router = Router();
//
// router.get('/crypto-global', async (_req: Request, res: Response) => {
//   const [globalRes, fngRes, gasRes] = await Promise.allSettled([
//     fetch('https://api.coingecko.com/api/v3/global', { headers: { Accept: 'application/json' } }),
//     fetch('https://api.alternative.me/fng/?limit=1'),
//     fetch('https://api.blocknative.com/gasprices/blockprices', { headers: { Accept: 'application/json' } }),
//   ]);
//
//   const globalData = globalRes.status === 'fulfilled' ? await globalRes.value.json() : {};
//   const fngData = fngRes.status === 'fulfilled' ? await fngRes.value.json() : {};
//
//   let ethGas = 0;
//   if (gasRes.status === 'fulfilled' && gasRes.value.ok) {
//     try {
//       const gasData = await gasRes.value.json();
//       ethGas = gasData?.blockPrices?.[0]?.estimatedPrices?.[0]?.price ?? 0;
//     } catch { /* ignore */ }
//   }
//
//   // Fallback: Etherscan free endpoint
//   if (ethGas === 0) {
//     try {
//       const ethRes = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle');
//       if (ethRes.ok) {
//         const ethData = await ethRes.json();
//         ethGas = parseFloat(ethData?.result?.ProposeGasPrice || '0');
//       }
//     } catch { /* ignore */ }
//   }
//
//   const g = globalData?.data || {};
//   const fng = fngData?.data?.[0] || { value: '50', value_classification: 'Neutral' };
//
//   /**
//    * Response schema — this is what the frontend expects:
//    * {
//    *   fearGreed:        { value: number, classification: string }
//    *   btcDominance:     number (percentage, e.g. 54.2)
//    *   ethDominance:     number (percentage, e.g. 17.8)
//    *   totalMarketCap:   number (USD)
//    *   marketCapChange24h: number (percentage)
//    *   ethGas:           number (Gwei)
//    * }
//    */
//   res.json({
//     fearGreed: {
//       value: parseInt(fng.value, 10) || 50,
//       classification: fng.value_classification || 'Neutral',
//     },
//     btcDominance: g.market_cap_percentage?.btc ?? 0,
//     ethDominance: g.market_cap_percentage?.eth ?? 0,
//     totalMarketCap: g.total_market_cap?.usd ?? 0,
//     marketCapChange24h: g.market_cap_change_percentage_24h_usd ?? 0,
//     ethGas,
//   });
// });
//
// export default router;
