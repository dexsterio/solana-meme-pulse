import { Token } from '@/data/mockTokens';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const EDGE_FN_URL = `${SUPABASE_URL}/functions/v1/dextools-proxy`;

// Simple in-memory cache for token logos
const logoCache = new Map<string, string>();
const tokenInfoCache = new Map<string, { mcap: number; fdv: number; holders: number }>();

// Simple sequential queue to throttle API calls (DexTools trial: ~30 req/min)
let lastRequestTime = 0;
const MIN_DELAY_MS = 2200; // ~27 requests/min max

async function apiFetch(endpoint: string): Promise<any> {
  // Throttle: ensure minimum delay between requests
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_DELAY_MS) {
    await new Promise(r => setTimeout(r, MIN_DELAY_MS - elapsed));
  }
  lastRequestTime = Date.now();

  const url = `${EDGE_FN_URL}?path=${encodeURIComponent(endpoint)}`;
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    if (res.status === 429) {
      // Wait longer on rate limit, then throw
      await new Promise(r => setTimeout(r, 10_000));
      throw new Error('Rate limited');
    }
    const text = await res.text();
    console.warn(`Edge function ${res.status} for ${endpoint}:`, text);
    throw new Error(`API error ${res.status}`);
  }
  return await res.json();
}

function calcAge(creationTime: string | undefined): string {
  if (!creationTime) return '?';
  const created = new Date(creationTime);
  const diff = Date.now() - created.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  return `${months}mo`;
}

// Batch helper: run promises with concurrency limit
async function batchPromises<T>(
  items: T[],
  fn: (item: T) => Promise<void>,
  concurrency = 5
): Promise<void> {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
    while (queue.length > 0) {
      const item = queue.shift()!;
      try {
        await fn(item);
      } catch (e) {
        // Individual failures are ok, we'll have partial data
        console.warn('Batch item failed:', e);
      }
    }
  });
  await Promise.all(workers);
}

// Fetch token logo (with cache)
async function fetchTokenLogo(tokenAddress: string): Promise<string> {
  if (logoCache.has(tokenAddress)) return logoCache.get(tokenAddress)!;
  try {
    const data = await apiFetch(`/token/solana/${tokenAddress}`);
    const logo = data?.data?.logo || '';
    if (logo) logoCache.set(tokenAddress, logo);
    return logo;
  } catch {
    return '';
  }
}

// Fetch token financial info (mcap, fdv) with cache
async function fetchTokenFinancialInfo(tokenAddress: string): Promise<{ mcap: number; fdv: number; holders: number }> {
  if (tokenInfoCache.has(tokenAddress)) return tokenInfoCache.get(tokenAddress)!;
  try {
    const data = await apiFetch(`/token/solana/${tokenAddress}/info`);
    const info = {
      mcap: data?.data?.mcap ?? 0,
      fdv: data?.data?.fdv ?? 0,
      holders: data?.data?.holders ?? 0,
    };
    tokenInfoCache.set(tokenAddress, info);
    return info;
  } catch {
    return { mcap: 0, fdv: 0, holders: 0 };
  }
}

// Fetch pool price data (the richest endpoint)
async function fetchPoolPrice(poolAddress: string): Promise<any> {
  try {
    const data = await apiFetch(`/pool/solana/${poolAddress}/price`);
    return data?.data || null;
  } catch {
    return null;
  }
}

// Fetch pool liquidity
async function fetchPoolLiquidity(poolAddress: string): Promise<number> {
  try {
    const data = await apiFetch(`/pool/solana/${poolAddress}/liquidity`);
    return data?.data?.liquidity ?? 0;
  } catch {
    return 0;
  }
}

/**
 * TRENDING / HOT POOLS
 * 1. GET /ranking/solana/hotpools -> RankedPool[] (rank, address, mainToken, sideToken, creationTime)
 * 2. For each pool: GET /pool/solana/{address}/price -> PoolPrice (price, volume, variations, buys, sells)
 * 3. For each token: GET /token/solana/{address} -> logo
 * 4. For each pool: GET /pool/solana/{address}/liquidity -> liquidity
 * 5. For each token: GET /token/solana/{address}/info -> mcap, fdv
 */
export async function fetchHotPools(): Promise<Token[]> {
  const data = await apiFetch('/ranking/solana/hotpools');
  const pools: any[] = data?.data || [];
  if (pools.length === 0) throw new Error('No hotpools data');

  const limit = Math.min(pools.length, 10);
  const topPools = pools.slice(0, limit);

  // Prepare token data structure
  const tokens: Token[] = topPools.map((pool, i) => ({
    id: pool.mainToken?.address || pool.address || `pool-${i}`,
    rank: pool.rank ?? i + 1,
    name: pool.mainToken?.name || 'Unknown',
    ticker: pool.mainToken?.symbol || '???',
    logo: '',
    logoUrl: '',
    address: pool.mainToken?.address || '',
    poolAddress: pool.address || '',
    price: 0,
    priceSOL: 0,
    age: calcAge(pool.creationTime),
    txns: 0,
    volume: 0,
    makers: 0,
    change5m: 0,
    change1h: 0,
    change6h: 0,
    change24h: 0,
    liquidity: 0,
    mcap: 0,
    fdv: 0,
    buys24h: 0,
    sells24h: 0,
    buyVolume24h: 0,
    sellVolume24h: 0,
    exchangeName: pool.exchangeName || '',
  }));

  // Enrich sequentially with pool price data (most important)
  // Only enrich first 5 to stay within rate limits
  for (const token of tokens.slice(0, 5)) {
    const poolAddr = (token as any).poolAddress;
    if (!poolAddr) continue;
    try {
      const priceData = await fetchPoolPrice(poolAddr);
      if (priceData) {
        token.price = priceData.price ?? 0;
        token.priceSOL = priceData.priceChain ?? 0;
        token.change5m = priceData.variation5m ?? 0;
        token.change1h = priceData.variation1h ?? 0;
        token.change6h = priceData.variation6h ?? 0;
        token.change24h = priceData.variation24h ?? 0;
        token.volume = priceData.volume24h ?? 0;
        token.txns = (priceData.buys24h ?? 0) + (priceData.sells24h ?? 0);
        token.makers = token.txns;
        (token as any).buys24h = priceData.buys24h ?? 0;
        (token as any).sells24h = priceData.sells24h ?? 0;
      }
    } catch { /* skip on error */ }
  }

  // Fetch logos sequentially for first 5
  for (const token of tokens.slice(0, 5)) {
    if (!token.address) continue;
    try {
      (token as any).logoUrl = await fetchTokenLogo(token.address);
    } catch { /* skip */ }
  }

  return tokens;
}

/**
 * GAINERS
 * GET /ranking/solana/gainers -> GainersLosersPool[] (includes price, price24h, variation24h)
 * Enrich with pool price for full variations + token logos
 */
export async function fetchGainers(): Promise<Token[]> {
  const data = await apiFetch('/ranking/solana/gainers');
  const pools: any[] = data?.data || [];
  if (pools.length === 0) throw new Error('No gainers data');

  const limit = Math.min(pools.length, 10);
  const topPools = pools.slice(0, limit);

  const tokens: Token[] = topPools.map((pool, i) => ({
    id: pool.mainToken?.address || pool.address || `gainer-${i}`,
    rank: pool.rank ?? i + 1,
    name: pool.mainToken?.name || 'Unknown',
    ticker: pool.mainToken?.symbol || '???',
    logo: '',
    logoUrl: '',
    address: pool.mainToken?.address || '',
    poolAddress: pool.address || '',
    price: pool.price ?? 0,
    priceSOL: 0,
    age: calcAge(pool.creationTime),
    txns: 0,
    volume: 0,
    makers: 0,
    change5m: 0,
    change1h: 0,
    change6h: 0,
    change24h: pool.variation24h ?? 0,
    liquidity: 0,
    mcap: 0,
    fdv: 0,
    exchangeName: pool.exchangeName || '',
  }));

  // Sequential enrichment for first 5
  for (const token of tokens.slice(0, 5)) {
    const poolAddr = (token as any).poolAddress;
    if (!poolAddr) continue;
    try {
      const priceData = await fetchPoolPrice(poolAddr);
      if (priceData) {
        token.price = priceData.price ?? token.price;
        token.priceSOL = priceData.priceChain ?? 0;
        token.change5m = priceData.variation5m ?? 0;
        token.change1h = priceData.variation1h ?? 0;
        token.change6h = priceData.variation6h ?? 0;
        token.change24h = priceData.variation24h ?? token.change24h;
        token.volume = priceData.volume24h ?? 0;
        token.txns = (priceData.buys24h ?? 0) + (priceData.sells24h ?? 0);
        token.makers = token.txns;
      }
    } catch { /* skip */ }
  }
  for (const token of tokens.slice(0, 5)) {
    if (!token.address) continue;
    try { (token as any).logoUrl = await fetchTokenLogo(token.address); } catch { /* skip */ }
  }

  return tokens;
}

/**
 * LOSERS
 */
export async function fetchLosers(): Promise<Token[]> {
  const data = await apiFetch('/ranking/solana/losers');
  const pools: any[] = data?.data || [];
  if (pools.length === 0) throw new Error('No losers data');

  const limit = Math.min(pools.length, 10);
  const topPools = pools.slice(0, limit);

  const tokens: Token[] = topPools.map((pool, i) => ({
    id: pool.mainToken?.address || pool.address || `loser-${i}`,
    rank: pool.rank ?? i + 1,
    name: pool.mainToken?.name || 'Unknown',
    ticker: pool.mainToken?.symbol || '???',
    logo: '',
    logoUrl: '',
    address: pool.mainToken?.address || '',
    poolAddress: pool.address || '',
    price: pool.price ?? 0,
    priceSOL: 0,
    age: calcAge(pool.creationTime),
    txns: 0,
    volume: 0,
    makers: 0,
    change5m: 0,
    change1h: 0,
    change6h: 0,
    change24h: pool.variation24h ?? 0,
    liquidity: 0,
    mcap: 0,
    fdv: 0,
    exchangeName: pool.exchangeName || '',
  }));

  for (const token of tokens.slice(0, 5)) {
    const poolAddr = (token as any).poolAddress;
    if (!poolAddr) continue;
    try {
      const priceData = await fetchPoolPrice(poolAddr);
      if (priceData) {
        token.price = priceData.price ?? token.price;
        token.priceSOL = priceData.priceChain ?? 0;
        token.change5m = priceData.variation5m ?? 0;
        token.change1h = priceData.variation1h ?? 0;
        token.change6h = priceData.variation6h ?? 0;
        token.change24h = priceData.variation24h ?? token.change24h;
        token.volume = priceData.volume24h ?? 0;
        token.txns = (priceData.buys24h ?? 0) + (priceData.sells24h ?? 0);
        token.makers = token.txns;
      }
    } catch { /* skip */ }
  }
  for (const token of tokens.slice(0, 5)) {
    if (!token.address) continue;
    try { (token as any).logoUrl = await fetchTokenLogo(token.address); } catch { /* skip */ }
  }

  return tokens;
}

/**
 * NEW PAIRS
 * GET /pool/solana?sort=creationTime&order=desc&from={24hAgo}&to={now}
 */
export async function fetchNewPairs(): Promise<Token[]> {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const from = dayAgo.toISOString();
  const to = now.toISOString();

  const data = await apiFetch(`/pool/solana?sort=creationTime&order=desc&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&pageSize=20`);
  const pools: any[] = data?.data?.results || data?.data || [];
  if (pools.length === 0) throw new Error('No new pairs data');

  const limit = Math.min(pools.length, 10);
  const topPools = pools.slice(0, limit);

  const tokens: Token[] = topPools.map((pool: any, i: number) => ({
    id: pool.mainToken?.address || pool.address || `new-${i}`,
    rank: i + 1,
    name: pool.mainToken?.name || 'Unknown',
    ticker: pool.mainToken?.symbol || '???',
    logo: '',
    logoUrl: '',
    address: pool.mainToken?.address || '',
    poolAddress: pool.address || '',
    price: 0,
    priceSOL: 0,
    age: calcAge(pool.creationTime),
    txns: 0,
    volume: 0,
    makers: 0,
    change5m: 0,
    change1h: 0,
    change6h: 0,
    change24h: 0,
    liquidity: 0,
    mcap: 0,
    fdv: 0,
    exchangeName: pool.exchangeName || '',
  }));

  for (const token of tokens.slice(0, 5)) {
    const poolAddr = (token as any).poolAddress;
    if (!poolAddr) continue;
    try {
      const priceData = await fetchPoolPrice(poolAddr);
      if (priceData) {
        token.price = priceData.price ?? 0;
        token.priceSOL = priceData.priceChain ?? 0;
        token.change5m = priceData.variation5m ?? 0;
        token.change1h = priceData.variation1h ?? 0;
        token.change6h = priceData.variation6h ?? 0;
        token.change24h = priceData.variation24h ?? 0;
        token.volume = priceData.volume24h ?? 0;
        token.txns = (priceData.buys24h ?? 0) + (priceData.sells24h ?? 0);
        token.makers = token.txns;
      }
    } catch { /* skip */ }
  }
  for (const token of tokens.slice(0, 5)) {
    if (!token.address) continue;
    try { (token as any).logoUrl = await fetchTokenLogo(token.address); } catch { /* skip */ }
  }

  return tokens;
}

/**
 * TOKEN DETAILS
 * 1. GET /token/solana/{address} -> metadata, logo, socialInfo
 * 2. GET /token/solana/{address}/info -> mcap, fdv, holders
 * 3. GET /token/solana/{address}/price -> price, variations
 */
export async function fetchTokenDetails(tokenAddress: string): Promise<Token | null> {
  try {
    // Sequential to avoid rate limits
    const descData = await apiFetch(`/token/solana/${tokenAddress}`);
    const infoData = await apiFetch(`/token/solana/${tokenAddress}/info`);
    const priceData = await apiFetch(`/token/solana/${tokenAddress}/price`);

    const desc = descData?.data || {};
    const info = infoData?.data || {};
    const price = priceData?.data || {};

    return {
      id: tokenAddress,
      rank: 0,
      name: desc.name || 'Unknown',
      ticker: desc.symbol || '???',
      logo: '',
      logoUrl: desc.logo || '',
      address: tokenAddress,
      price: price.price ?? 0,
      priceSOL: price.priceChain ?? 0,
      age: calcAge(desc.creationTime),
      txns: info.transactions ?? 0,
      volume: 0,
      makers: 0,
      change5m: price.variation5m ?? 0,
      change1h: price.variation1h ?? 0,
      change6h: price.variation6h ?? 0,
      change24h: price.variation24h ?? 0,
      liquidity: 0,
      mcap: info.mcap ?? 0,
      fdv: info.fdv ?? 0,
      website: desc.socialInfo?.website || undefined,
      twitter: desc.socialInfo?.twitter || undefined,
      telegram: desc.socialInfo?.telegram || undefined,
    } as Token;
  } catch (err) {
    console.error('Failed to fetch token details:', err);
    return null;
  }
}
