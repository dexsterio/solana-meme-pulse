export interface Token {
  id: string;
  rank: number;
  name: string;
  ticker: string;
  logo: string;
  logoUrl?: string;
  address: string;
  poolAddress?: string;
  price: number;
  priceSOL: number;
  age: string;
  txns: number;
  volume: number;
  makers: number;
  change5m: number;
  change1h: number;
  change6h: number;
  change24h: number;
  liquidity: number;
  mcap: number;
  fdv: number;
  website?: string;
  twitter?: string;
  telegram?: string;
  boosts?: number;
  exchangeName?: string;
  buys24h?: number;
  sells24h?: number;
  buyVolume24h?: number;
  sellVolume24h?: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'buy' | 'sell';
  usd: number;
  tokenAmount: number;
  sol: number;
  price: number;
  maker: string;
  txn: string;
}

export function generateMockTransactions(tokenId: string): Transaction[] {
  const txns: Transaction[] = [];
  const now = Date.now();

  for (let i = 0; i < 30; i++) {
    const isBuy = Math.random() > 0.45;
    const usd = Math.random() * 5000 + 10;
    const sol = usd / 138;

    txns.push({
      id: `tx-${i}`,
      date: new Date(now - i * 60000 * Math.random() * 10).toISOString(),
      type: isBuy ? 'buy' : 'sell',
      usd,
      tokenAmount: usd / 0.001,
      sol,
      price: 0.001 * (1 + (Math.random() - 0.5) * 0.02),
      maker: `${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
      txn: Math.random().toString(36).substring(2, 12),
    });
  }

  return txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function formatNumber(num: number): string {
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
  return `$${num.toFixed(2)}`;
}

export function formatPrice(price: number): string {
  if (price === 0) return '$0.00';
  if (price >= 1) return `$${price.toFixed(2)}`;
  if (price >= 0.01) return `$${price.toFixed(4)}`;
  // Subscript notation for very small prices: $0.0₄5554
  const str = price.toFixed(20);
  const match = str.match(/^0\.(0+)/);
  if (match) {
    const zeroCount = match[1].length;
    // Get significant digits after the zeros
    const significant = str.slice(2 + zeroCount, 2 + zeroCount + 4);
    if (zeroCount >= 2) {
      const subscriptDigits = '₀₁₂₃₄₅₆₇₈₉';
      const sub = String(zeroCount).split('').map(d => subscriptDigits[parseInt(d)]).join('');
      return `$0.0${sub}${significant}`;
    }
    return `$${price.toFixed(zeroCount + 4)}`;
  }
  return `$${price.toFixed(6)}`;
}

export function formatCompact(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toFixed(0);
}
