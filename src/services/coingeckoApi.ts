import { Token } from '@/data/mockTokens';

interface CoinGeckoToken {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
  market_cap_rank: number;
  fully_diluted_valuation?: number;
}

export interface CryptoGlobalData {
  fearGreed: { value: number; classification: string };
  btcDominance: number;
  ethDominance: number;
  totalMarketCap: number;
  marketCapChange24h: number;
  ethGas: number;
}

function mapToToken(coin: CoinGeckoToken, index: number): Token {
  return {
    id: coin.id,
    rank: coin.market_cap_rank || index + 1,
    name: coin.name,
    ticker: coin.symbol.toUpperCase(),
    logo: '',
    logoUrl: coin.image,
    address: coin.id,
    price: coin.current_price || 0,
    priceSOL: (coin.current_price || 0) / 140,
    age: '-',
    txns: 0,
    volume: coin.total_volume || 0,
    makers: 0,
    change5m: 0,
    change1h: coin.price_change_percentage_1h_in_currency || 0,
    change6h: 0,
    change24h: coin.price_change_percentage_24h || 0,
    change7d: coin.price_change_percentage_7d_in_currency || 0,
    change30d: coin.price_change_percentage_30d_in_currency || 0,
    liquidity: 0,
    mcap: coin.market_cap || 0,
    fdv: coin.fully_diluted_valuation || coin.market_cap || 0,
  };
}

export async function fetchCryptoMarket(pages = 3): Promise<Token[]> {
  const allTokens: Token[] = [];

  for (let page = 1; page <= pages; page++) {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/coingecko-proxy?page=${page}&per_page=100`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`CoinGecko page ${page} failed:`, response.status);
      break;
    }

    const coins: CoinGeckoToken[] = await response.json();
    allTokens.push(...coins.map((c, i) => mapToToken(c, (page - 1) * 100 + i)));
  }

  return allTokens;
}

export async function fetchCryptoGlobal(): Promise<CryptoGlobalData> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/crypto-global`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) throw new Error(`crypto-global failed: ${response.status}`);
  return response.json();
}
