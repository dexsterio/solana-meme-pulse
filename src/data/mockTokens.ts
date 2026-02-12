export interface Token {
  id: string;
  rank: number;
  name: string;
  ticker: string;
  logo: string;
  address: string;
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

const logos = [
  '🐸', '🐶', '🐱', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮',
  '🐷', '🐵', '🐔', '🐧', '🐦', '🦅', '🦇', '🐝', '🐛', '🦋',
];

export const mockTokens: Token[] = [
  { id: '1', rank: 1, name: 'PEPE', ticker: 'PEPE', logo: logos[0], address: '5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhdK8PSWmrRC', price: 0.00001234, priceSOL: 0.0000000892, age: '2h', txns: 15420, volume: 2450000, makers: 3200, change5m: 2.5, change1h: 8.3, change6h: 45.2, change24h: 128.5, liquidity: 890000, mcap: 12400000, fdv: 12400000, website: 'https://pepe.sol', twitter: 'https://twitter.com/pepesol', telegram: 'https://t.me/pepesol', boosts: 48 },
  { id: '2', rank: 2, name: 'BONK', ticker: 'BONK', logo: logos[1], address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', price: 0.00002891, priceSOL: 0.000000209, age: '15d', txns: 42100, volume: 8920000, makers: 8900, change5m: -0.8, change1h: 3.2, change6h: -5.1, change24h: 12.3, liquidity: 4500000, mcap: 89200000, fdv: 89200000, twitter: 'https://twitter.com/bonk_inu' },
  { id: '3', rank: 3, name: 'WIF', ticker: 'WIF', logo: logos[2], address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', price: 0.000892, priceSOL: 0.00000645, age: '3d', txns: 28300, volume: 5670000, makers: 5400, change5m: 1.2, change1h: -2.1, change6h: 15.8, change24h: -8.4, liquidity: 2300000, mcap: 45600000, fdv: 45600000, website: 'https://wif.sol', twitter: 'https://twitter.com/wif', boosts: 24 },
  { id: '4', rank: 4, name: 'MYRO', ticker: 'MYRO', logo: logos[3], address: 'HhJpBhRRn4g56VsyLuT8DL5Bv31HkXqsrahTTUCZeZg4', price: 0.0456, priceSOL: 0.00033, age: '7d', txns: 18700, volume: 3240000, makers: 4100, change5m: -1.5, change1h: 5.7, change6h: -12.3, change24h: 34.2, liquidity: 1800000, mcap: 34500000, fdv: 34500000, telegram: 'https://t.me/myro' },
  { id: '5', rank: 5, name: 'POPCAT', ticker: 'POPCAT', logo: logos[4], address: '7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr', price: 0.00345, priceSOL: 0.0000249, age: '1d', txns: 9800, volume: 1890000, makers: 2800, change5m: 4.2, change1h: 12.5, change6h: 67.8, change24h: 234.5, liquidity: 670000, mcap: 8900000, fdv: 8900000, boosts: 72 },
  { id: '6', rank: 6, name: 'MOODENG', ticker: 'MOODENG', logo: logos[5], address: 'ED5nyyWEzpPPiWimP8vYm7sD7TD3LAt3Q3gRTWHzPJBY', price: 0.0123, priceSOL: 0.0000889, age: '5h', txns: 6700, volume: 980000, makers: 1900, change5m: -3.2, change1h: -8.5, change6h: 22.1, change24h: 56.7, liquidity: 450000, mcap: 5600000, fdv: 5600000, twitter: 'https://twitter.com/moodeng' },
  { id: '7', rank: 7, name: 'GOAT', ticker: 'GOAT', logo: logos[6], address: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump', price: 0.00089, priceSOL: 0.00000643, age: '12h', txns: 5400, volume: 780000, makers: 1500, change5m: 0.5, change1h: 1.8, change6h: -3.2, change24h: -15.6, liquidity: 340000, mcap: 3400000, fdv: 3400000 },
  { id: '8', rank: 8, name: 'PNUT', ticker: 'PNUT', logo: logos[7], address: '2qEHjDLDLbuBgRYvsxhc5D6uDWAivNFZGan56P1tpump', price: 0.234, priceSOL: 0.00169, age: '30m', txns: 3200, volume: 560000, makers: 890, change5m: 15.6, change1h: 45.2, change6h: 89.3, change24h: 456.7, liquidity: 230000, mcap: 2300000, fdv: 2300000, boosts: 128 },
  { id: '9', rank: 9, name: 'BOME', ticker: 'BOME', logo: logos[8], address: 'ukHH6c7mMyiWCf1b9pnWe25TSpkDDt3H5pQZgZ74J82', price: 0.0067, priceSOL: 0.0000484, age: '2d', txns: 12100, volume: 2100000, makers: 3400, change5m: -0.3, change1h: 2.1, change6h: 8.9, change24h: 23.4, liquidity: 1200000, mcap: 15600000, fdv: 15600000 },
  { id: '10', rank: 10, name: 'SLERF', ticker: 'SLERF', logo: logos[9], address: '7BgBvyjrZX1YKz4oh9mjb8ZScatkkwb8DzFx7LoiVkM3', price: 0.089, priceSOL: 0.000643, age: '4d', txns: 8900, volume: 1560000, makers: 2700, change5m: -2.1, change1h: -4.5, change6h: -18.9, change24h: -32.1, liquidity: 780000, mcap: 8900000, fdv: 8900000 },
  { id: '11', rank: 11, name: 'TRUMP', ticker: 'TRUMP', logo: logos[10], address: '6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN', price: 0.00234, priceSOL: 0.0000169, age: '8h', txns: 4300, volume: 670000, makers: 1200, change5m: 8.9, change1h: 22.3, change6h: 56.7, change24h: 189.2, liquidity: 290000, mcap: 4500000, fdv: 4500000, boosts: 36 },
  { id: '12', rank: 12, name: 'FWOG', ticker: 'FWOG', logo: logos[11], address: 'A8C3xuqscfmyLrte3VwSixPaHy8BeyPBtfnxHfjhpump', price: 0.000456, priceSOL: 0.0000033, age: '6h', txns: 2800, volume: 340000, makers: 780, change5m: -5.6, change1h: -12.3, change6h: 5.6, change24h: -8.9, liquidity: 180000, mcap: 2100000, fdv: 2100000 },
  { id: '13', rank: 13, name: 'PONKE', ticker: 'PONKE', logo: logos[12], address: '5z3EqYQo9HiCEs3R84RCDMu2n7anpDMxRhd00PSWmrRC', price: 0.0345, priceSOL: 0.000249, age: '10d', txns: 15600, volume: 3400000, makers: 4500, change5m: 0.2, change1h: 1.5, change6h: -2.3, change24h: 5.6, liquidity: 1500000, mcap: 23400000, fdv: 23400000 },
  { id: '14', rank: 14, name: 'RETARDIO', ticker: 'RETARDIO', logo: logos[13], address: '6ogzHhzdrQr9Pgv6hZ2MNze7UrzBMAFyBBWUYp1Fhitx', price: 0.00789, priceSOL: 0.0000570, age: '3h', txns: 1900, volume: 230000, makers: 560, change5m: 12.3, change1h: 34.5, change6h: 123.4, change24h: 567.8, liquidity: 120000, mcap: 1200000, fdv: 1200000, boosts: 96 },
  { id: '15', rank: 15, name: 'SIGMA', ticker: 'SIGMA', logo: logos[14], address: '5SVG3T9CNQsm2kEwMbPaErLP3CTnCmJUgPFfR5jCpump', price: 0.000123, priceSOL: 0.000000889, age: '45m', txns: 890, volume: 89000, makers: 340, change5m: 25.6, change1h: 67.8, change6h: 234.5, change24h: 890.1, liquidity: 56000, mcap: 560000, fdv: 560000, boosts: 200 },
  { id: '16', rank: 16, name: 'MICHI', ticker: 'MICHI', logo: logos[15], address: '5mbK36SZ7J19An8jFochhQS4of8g6BwUjbeCSxBSoWdp6', price: 0.0567, priceSOL: 0.00041, age: '6d', txns: 7200, volume: 1230000, makers: 2100, change5m: -1.2, change1h: -3.4, change6h: 8.9, change24h: 15.6, liquidity: 890000, mcap: 12300000, fdv: 12300000 },
  { id: '17', rank: 17, name: 'GIGA', ticker: 'GIGA', logo: logos[16], address: '63LfDmNb3MQ8mw9MtZ2To9bEA2M71kZUUGq5tiJxcqj9', price: 0.0234, priceSOL: 0.000169, age: '9d', txns: 6100, volume: 890000, makers: 1800, change5m: 0.8, change1h: 2.3, change6h: -5.6, change24h: 8.9, liquidity: 670000, mcap: 8900000, fdv: 8900000 },
  { id: '18', rank: 18, name: 'MEW', ticker: 'MEW', logo: logos[17], address: 'MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5', price: 0.00456, priceSOL: 0.0000330, age: '14d', txns: 19800, volume: 4560000, makers: 6700, change5m: -0.5, change1h: 1.2, change6h: 3.4, change24h: -2.1, liquidity: 2300000, mcap: 34500000, fdv: 34500000 },
  { id: '19', rank: 19, name: 'DEGEN', ticker: 'DEGEN', logo: logos[18], address: 'Hb2HDX6tnRfw5j442npy3dbGbpv2BXWE8FJhQ9oJpump', price: 0.000067, priceSOL: 0.000000484, age: '20m', txns: 450, volume: 34000, makers: 180, change5m: 45.6, change1h: 123.4, change6h: 456.7, change24h: 1234.5, liquidity: 23000, mcap: 230000, fdv: 230000, boosts: 320 },
  { id: '20', rank: 20, name: 'NEIRO', ticker: 'NEIRO', logo: logos[19], address: 'neiro4SPxtMJBE1u1bmMkWA57mFhkjJA8KGJaKxfpump', price: 0.00123, priceSOL: 0.00000889, age: '1d', txns: 3400, volume: 560000, makers: 890, change5m: -8.9, change1h: -15.6, change6h: 12.3, change24h: 34.5, liquidity: 230000, mcap: 3400000, fdv: 3400000 },
];

export function generateMockTransactions(tokenId: string): Transaction[] {
  const token = mockTokens.find(t => t.id === tokenId);
  if (!token) return [];

  const txns: Transaction[] = [];
  const now = Date.now();

  for (let i = 0; i < 30; i++) {
    const isBuy = Math.random() > 0.45;
    const usd = Math.random() * 5000 + 10;
    const tokenAmount = usd / token.price;
    const sol = usd / 138;

    txns.push({
      id: `tx-${i}`,
      date: new Date(now - i * 60000 * Math.random() * 10).toISOString(),
      type: isBuy ? 'buy' : 'sell',
      usd,
      tokenAmount,
      sol,
      price: token.price * (1 + (Math.random() - 0.5) * 0.02),
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
  if (price < 0.00001) return `$${price.toExponential(2)}`;
  if (price < 0.01) return `$${price.toFixed(6)}`;
  if (price < 1) return `$${price.toFixed(4)}`;
  return `$${price.toFixed(2)}`;
}

export function formatCompact(num: number): string {
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
  return num.toFixed(0);
}
