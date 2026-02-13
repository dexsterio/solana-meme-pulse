import { Token } from '@/data/mockTokens';

const BASE = 'https://api.dexscreener.com';

function calcAge(ts: number | undefined): string {
  if (!ts) return '?';
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  return `${Math.floor(days / 30)}mo`;
}

function mapPairToToken(pair: any, i: number): Token {
  return {
    id: pair.baseToken?.address || `ds-${i}`,
    rank: i + 1,
    name: pair.baseToken?.name || 'Unknown',
    ticker: pair.baseToken?.symbol || '???',
    logo: '',
    logoUrl: pair.info?.imageUrl || '',
    address: pair.baseToken?.address || '',
    poolAddress: pair.pairAddress || '',
    price: parseFloat(pair.priceUsd || '0'),
    priceSOL: parseFloat(pair.priceNative || '0'),
    age: calcAge(pair.pairCreatedAt),
    txns: (pair.txns?.h24?.buys ?? 0) + (pair.txns?.h24?.sells ?? 0),
    volume: pair.volume?.h24 ?? 0,
    makers: pair.txns?.h24?.buys ?? 0,
    change5m: pair.priceChange?.m5 ?? 0,
    change1h: pair.priceChange?.h1 ?? 0,
    change6h: pair.priceChange?.h6 ?? 0,
    change24h: pair.priceChange?.h24 ?? 0,
    liquidity: pair.liquidity?.usd ?? 0,
    mcap: pair.marketCap ?? pair.fdv ?? 0,
    fdv: pair.fdv ?? 0,
    buys24h: pair.txns?.h24?.buys ?? 0,
    sells24h: pair.txns?.h24?.sells ?? 0,
    exchangeName: pair.dexId || '',
    website: pair.info?.websites?.[0]?.url,
    twitter: pair.info?.socials?.find((s: any) => s.type === 'twitter')?.url,
    telegram: pair.info?.socials?.find((s: any) => s.type === 'telegram')?.url,
  } as Token;
}

export async function fetchTrendingTokens(): Promise<Token[]> {
  // Use token-boosts/top for trending tokens, filter to Solana
  const res = await fetch(`${BASE}/token-boosts/top/v1`);
  if (!res.ok) throw new Error(`DexScreener error ${res.status}`);
  const boosts: any[] = await res.json();

  // Filter Solana tokens and get their addresses
  const solanaTokens = boosts.filter((b: any) => b.chainId === 'solana').slice(0, 15);
  if (solanaTokens.length === 0) throw new Error('No Solana trending tokens');

  // Fetch pair data for these tokens
  const addresses = solanaTokens.map((b: any) => b.tokenAddress).join(',');
  const pairsRes = await fetch(`${BASE}/latest/dex/tokens/${addresses}`);
  if (!pairsRes.ok) throw new Error(`DexScreener pairs error ${pairsRes.status}`);
  const pairsData = await pairsRes.json();

  // Get best Solana pair per token
  const pairs: any[] = pairsData.pairs || [];
  const seen = new Set<string>();
  const uniquePairs: any[] = [];
  for (const pair of pairs) {
    if (pair.chainId !== 'solana') continue;
    const addr = pair.baseToken?.address;
    if (addr && !seen.has(addr)) {
      seen.add(addr);
      uniquePairs.push(pair);
    }
  }

  return uniquePairs.slice(0, 10).map((p, i) => mapPairToToken(p, i));
}

export async function fetchTopByVolume(): Promise<Token[]> {
  // Search for popular Solana tokens by volume
  const res = await fetch(`${BASE}/latest/dex/search?q=SOL`);
  if (!res.ok) throw new Error(`DexScreener search error ${res.status}`);
  const data = await res.json();
  const pairs: any[] = (data.pairs || []).filter((p: any) => p.chainId === 'solana');

  // Sort by volume descending
  pairs.sort((a: any, b: any) => (b.volume?.h24 ?? 0) - (a.volume?.h24 ?? 0));

  const seen = new Set<string>();
  const uniquePairs: any[] = [];
  for (const pair of pairs) {
    const addr = pair.baseToken?.address;
    if (addr && !seen.has(addr)) {
      seen.add(addr);
      uniquePairs.push(pair);
    }
  }

  return uniquePairs.slice(0, 10).map((p, i) => mapPairToToken(p, i));
}

export async function fetchGainersDexScreener(): Promise<Token[]> {
  // Search and sort by 24h price change
  const res = await fetch(`${BASE}/latest/dex/search?q=SOL`);
  if (!res.ok) throw new Error(`DexScreener error ${res.status}`);
  const data = await res.json();
  const pairs: any[] = (data.pairs || []).filter(
    (p: any) => p.chainId === 'solana' && (p.priceChange?.h24 ?? 0) > 0
  );

  pairs.sort((a: any, b: any) => (b.priceChange?.h24 ?? 0) - (a.priceChange?.h24 ?? 0));

  const seen = new Set<string>();
  const uniquePairs: any[] = [];
  for (const pair of pairs) {
    const addr = pair.baseToken?.address;
    if (addr && !seen.has(addr)) {
      seen.add(addr);
      uniquePairs.push(pair);
    }
  }

  return uniquePairs.slice(0, 10).map((p, i) => mapPairToToken(p, i));
}

export async function fetchNewPairsDexScreener(): Promise<Token[]> {
  // Search for recent Solana pairs
  const res = await fetch(`${BASE}/latest/dex/search?q=SOL`);
  if (!res.ok) throw new Error(`DexScreener error ${res.status}`);
  const data = await res.json();
  const pairs: any[] = (data.pairs || []).filter((p: any) => p.chainId === 'solana');

  // Sort by creation time descending
  pairs.sort((a: any, b: any) => (b.pairCreatedAt ?? 0) - (a.pairCreatedAt ?? 0));

  const seen = new Set<string>();
  const uniquePairs: any[] = [];
  for (const pair of pairs) {
    const addr = pair.baseToken?.address;
    if (addr && !seen.has(addr)) {
      seen.add(addr);
      uniquePairs.push(pair);
    }
  }

  return uniquePairs.slice(0, 10).map((p, i) => mapPairToToken(p, i));
}

export async function fetchTokenDetailsDexScreener(tokenAddress: string): Promise<Token | null> {
  try {
    const res = await fetch(`${BASE}/latest/dex/tokens/${tokenAddress}`);
    if (!res.ok) return null;
    const data = await res.json();
    const pairs: any[] = (data.pairs || []).filter((p: any) => p.chainId === 'solana');
    if (pairs.length === 0) return null;

    // Pick pair with highest volume
    pairs.sort((a: any, b: any) => (b.volume?.h24 ?? 0) - (a.volume?.h24 ?? 0));
    return mapPairToToken(pairs[0], 0);
  } catch {
    return null;
  }
}
