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

// Deduplicate pairs by base token address, keeping highest volume
function dedupeByToken(pairs: any[], limit: number): any[] {
  const seen = new Set<string>();
  const result: any[] = [];
  for (const pair of pairs) {
    if (pair.chainId !== 'solana') continue;
    const addr = pair.baseToken?.address;
    if (addr && !seen.has(addr)) {
      seen.add(addr);
      result.push(pair);
      if (result.length >= limit) break;
    }
  }
  return result;
}

export async function fetchTrendingTokens(): Promise<Token[]> {
  const res = await fetch(`${BASE}/token-boosts/top/v1`);
  if (!res.ok) throw new Error(`DexScreener error ${res.status}`);
  const boosts: any[] = await res.json();

  const solanaTokens = boosts.filter((b: any) => b.chainId === 'solana').slice(0, 60);
  if (solanaTokens.length === 0) throw new Error('No Solana trending tokens');

  // Batch addresses in groups of 30 (API limit)
  const allPairs: any[] = [];
  for (let i = 0; i < solanaTokens.length; i += 30) {
    const batch = solanaTokens.slice(i, i + 30);
    const addresses = batch.map((b: any) => b.tokenAddress).join(',');
    const pairsRes = await fetch(`${BASE}/latest/dex/tokens/${addresses}`);
    if (pairsRes.ok) {
      const pairsData = await pairsRes.json();
      allPairs.push(...(pairsData.pairs || []));
    }
  }

  return dedupeByToken(allPairs, 50).map((p, i) => mapPairToToken(p, i));
}

export async function fetchTopByVolume(): Promise<Token[]> {
  const queries = ['SOL', 'USDC SOL', 'meme solana', 'pump solana'];
  const allPairs: any[] = [];

  const results = await Promise.all(
    queries.map(q => fetch(`${BASE}/latest/dex/search?q=${encodeURIComponent(q)}`).then(r => r.ok ? r.json() : { pairs: [] }))
  );
  for (const data of results) {
    allPairs.push(...(data.pairs || []).filter((p: any) => p.chainId === 'solana'));
  }

  allPairs.sort((a: any, b: any) => (b.volume?.h24 ?? 0) - (a.volume?.h24 ?? 0));
  return dedupeByToken(allPairs, 50).map((p, i) => mapPairToToken(p, i));
}

export async function fetchGainersDexScreener(): Promise<Token[]> {
  const queries = ['SOL', 'USDC SOL', 'meme solana', 'pump solana'];
  const allPairs: any[] = [];

  const results = await Promise.all(
    queries.map(q => fetch(`${BASE}/latest/dex/search?q=${encodeURIComponent(q)}`).then(r => r.ok ? r.json() : { pairs: [] }))
  );
  for (const data of results) {
    allPairs.push(...(data.pairs || []).filter((p: any) => p.chainId === 'solana' && (p.priceChange?.h24 ?? 0) > 0));
  }

  allPairs.sort((a: any, b: any) => (b.priceChange?.h24 ?? 0) - (a.priceChange?.h24 ?? 0));
  return dedupeByToken(allPairs, 50).map((p, i) => mapPairToToken(p, i));
}

export async function fetchNewPairsDexScreener(): Promise<Token[]> {
  const queries = ['SOL', 'USDC SOL', 'meme solana', 'pump solana'];
  const allPairs: any[] = [];

  const results = await Promise.all(
    queries.map(q => fetch(`${BASE}/latest/dex/search?q=${encodeURIComponent(q)}`).then(r => r.ok ? r.json() : { pairs: [] }))
  );
  for (const data of results) {
    allPairs.push(...(data.pairs || []).filter((p: any) => p.chainId === 'solana'));
  }

  allPairs.sort((a: any, b: any) => (b.pairCreatedAt ?? 0) - (a.pairCreatedAt ?? 0));
  return dedupeByToken(allPairs, 50).map((p, i) => mapPairToToken(p, i));
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
