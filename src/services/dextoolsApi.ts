import { Token } from '@/data/mockTokens';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const EDGE_FN_URL = `${SUPABASE_URL}/functions/v1/dextools-proxy`;

// No client-side throttle needed — server-side cache handles rate protection

async function apiFetch(endpoint: string): Promise<any> {
  const url = `${EDGE_FN_URL}?path=${encodeURIComponent(endpoint)}`;
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    if (res.status === 429) {
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

// Fetch pool price data
async function fetchPoolPrice(poolAddress: string): Promise<any> {
  try {
    const data = await apiFetch(`/pool/solana/${poolAddress}/price`);
    return data?.data || null;
  } catch {
    return null;
  }
}

// Fetch token logo
async function fetchTokenLogo(tokenAddress: string): Promise<string> {
  try {
    const data = await apiFetch(`/token/solana/${tokenAddress}`);
    return data?.data?.logo || '';
  } catch {
    return '';
  }
}

// Helper: enrich tokens with price data and logos (parallel since server cache handles throttling)
async function enrichTokens(tokens: Token[]): Promise<void> {
  const enrichLimit = Math.min(tokens.length, 5);
  const toEnrich = tokens.slice(0, enrichLimit);

  // Fetch all price data in parallel — server cache will serve HITs instantly
  const pricePromises = toEnrich.map(async (token) => {
    const poolAddr = (token as any).poolAddress;
    if (!poolAddr) return;
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
      (token as any).buys24h = priceData.buys24h ?? 0;
      (token as any).sells24h = priceData.sells24h ?? 0;
    }
  });

  const logoPromises = toEnrich.map(async (token) => {
    if (!token.address) return;
    (token as any).logoUrl = await fetchTokenLogo(token.address);
  });

  await Promise.allSettled([...pricePromises, ...logoPromises]);
}

function mapPoolToToken(pool: any, i: number, idPrefix: string): Token {
  return {
    id: pool.mainToken?.address || pool.address || `${idPrefix}-${i}`,
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
    buys24h: 0,
    sells24h: 0,
    buyVolume24h: 0,
    sellVolume24h: 0,
    exchangeName: pool.exchangeName || '',
  } as Token;
}

export async function fetchHotPools(): Promise<Token[]> {
  const data = await apiFetch('/ranking/solana/hotpools');
  const pools: any[] = data?.data || [];
  if (pools.length === 0) throw new Error('No hotpools data');

  const tokens = pools.slice(0, 10).map((p, i) => mapPoolToToken(p, i, 'pool'));
  await enrichTokens(tokens);
  return tokens;
}

export async function fetchGainers(): Promise<Token[]> {
  const data = await apiFetch('/ranking/solana/gainers');
  const pools: any[] = data?.data || [];
  if (pools.length === 0) throw new Error('No gainers data');

  const tokens = pools.slice(0, 10).map((p, i) => mapPoolToToken(p, i, 'gainer'));
  await enrichTokens(tokens);
  return tokens;
}

export async function fetchLosers(): Promise<Token[]> {
  const data = await apiFetch('/ranking/solana/losers');
  const pools: any[] = data?.data || [];
  if (pools.length === 0) throw new Error('No losers data');

  const tokens = pools.slice(0, 10).map((p, i) => mapPoolToToken(p, i, 'loser'));
  await enrichTokens(tokens);
  return tokens;
}

export async function fetchNewPairs(): Promise<Token[]> {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const from = dayAgo.toISOString();
  const to = now.toISOString();

  const data = await apiFetch(`/pool/solana?sort=creationTime&order=desc&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&pageSize=20`);
  const pools: any[] = data?.data?.results || data?.data || [];
  if (pools.length === 0) throw new Error('No new pairs data');

  const tokens = pools.slice(0, 10).map((p: any, i: number) => mapPoolToToken(p, i, 'new'));
  await enrichTokens(tokens);
  return tokens;
}

export async function fetchTokenDetails(tokenAddress: string): Promise<Token | null> {
  try {
    // Parallel fetches — server cache handles rate limiting
    const [descData, infoData, priceData] = await Promise.all([
      apiFetch(`/token/solana/${tokenAddress}`),
      apiFetch(`/token/solana/${tokenAddress}/info`),
      apiFetch(`/token/solana/${tokenAddress}/price`),
    ]);

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
