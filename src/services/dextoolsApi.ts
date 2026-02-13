import { Token } from '@/data/mockTokens';

const API_KEY = 'Cn5a0ucAiY1dP2KIuykwRa22bzBBQDq61cA7Xy9O';
const BASE_URL = 'https://public-api.dextools.io/trial/v2';
const CORS_PROXY = 'https://corsproxy.io/?url=';

async function apiFetch(endpoint: string) {
  const url = `${CORS_PROXY}${encodeURIComponent(`${BASE_URL}${endpoint}`)}`;
  const res = await fetch(url, {
    headers: {
      'x-api-key': API_KEY,
      'accept': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`DexTools API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data;
}

function calcAge(creationTime: string | number | undefined): string {
  if (!creationTime) return '?';
  const created = new Date(typeof creationTime === 'number' ? creationTime * 1000 : creationTime);
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

const logos = ['🐸', '🐶', '🐱', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐵', '🐔', '🐧', '🐦', '🦅', '🦇', '🐝', '🐛', '🦋'];

function mapPoolToToken(pool: any, index: number): Token {
  const pair = pool.pair || pool;
  const mainToken = pair?.mainToken || pair?.baseToken || {};
  const sideToken = pair?.sideToken || pair?.quoteToken || {};
  const price = pair?.price ?? pool?.price ?? 0;
  const priceVariation = pair?.priceVariation || pool?.priceVariation || {};
  
  return {
    id: mainToken?.address || `token-${index}`,
    rank: index + 1,
    name: mainToken?.name || mainToken?.symbol || 'Unknown',
    ticker: mainToken?.symbol || '???',
    logo: logos[index % logos.length],
    address: mainToken?.address || '',
    price: typeof price === 'number' ? price : parseFloat(price) || 0,
    priceSOL: 0,
    age: calcAge(pair?.creationTime || pool?.creationTime),
    txns: pair?.txCount24h ?? pair?.txns24h ?? pool?.txns24h ?? 0,
    volume: pair?.volume24h ?? pool?.volume24h ?? 0,
    makers: pair?.makers24h ?? pool?.makers ?? 0,
    change5m: priceVariation?.m5 ?? 0,
    change1h: priceVariation?.h1 ?? 0,
    change6h: priceVariation?.h6 ?? 0,
    change24h: priceVariation?.h24 ?? 0,
    liquidity: pair?.liquidity ?? pool?.liquidity ?? 0,
    mcap: pair?.fdv ?? pair?.mcap ?? pool?.fdv ?? 0,
    fdv: pair?.fdv ?? pool?.fdv ?? 0,
  };
}

export async function fetchHotPools(): Promise<Token[]> {
  const data = await apiFetch('/ranking/solana/hotpools');
  const pools = data?.data || [];
  return pools.map((pool: any, i: number) => mapPoolToToken(pool, i));
}

export async function fetchGainers(): Promise<Token[]> {
  const data = await apiFetch('/ranking/solana/gainers');
  const pools = data?.data || [];
  return pools.map((pool: any, i: number) => mapPoolToToken(pool, i));
}

export async function fetchLosers(): Promise<Token[]> {
  const data = await apiFetch('/ranking/solana/losers');
  const pools = data?.data || [];
  return pools.map((pool: any, i: number) => mapPoolToToken(pool, i));
}

export async function fetchTokenDetails(address: string): Promise<Token | null> {
  try {
    const data = await apiFetch(`/token/solana/${address}`);
    if (data?.data) {
      return mapPoolToToken(data.data, 0);
    }
    return null;
  } catch {
    return null;
  }
}
