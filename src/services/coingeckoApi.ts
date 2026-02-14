/**
 * ============================================================================
 * COINGECKO API SERVICE
 * ============================================================================
 * MIGRATION: This service calls your backend at ENDPOINTS.COINGECKO_PROXY
 * and ENDPOINTS.CRYPTO_GLOBAL. No Supabase auth headers are sent.
 *
 * Required server endpoints:
 *   GET /coingecko-proxy?page=1&per_page=100  → CoinGecko markets data
 *   GET /crypto-global                        → Fear & Greed, BTC dom, gas
 *
 * See server/README.md for response schemas.
 * ============================================================================
 */
import { Token } from '@/data/mockTokens';
import { ENDPOINTS } from '@/config/api';

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

export async function fetchCryptoMarket(pages = 1): Promise<Token[]> {
  const allTokens: Token[] = [];

  for (let page = 1; page <= pages; page++) {
    // MIGRATION: Uses centralized ENDPOINTS config instead of Supabase URL
    const url = `${ENDPOINTS.COINGECKO_PROXY}?page=${page}&per_page=100`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        // MIGRATION: No 'Authorization' header needed — your server handles auth
      },
    });

    if (!response.ok) {
      console.error(`CoinGecko page ${page} failed:`, response.status);
      break;
    }

    const coins: CoinGeckoToken[] = await response.json();
    allTokens.push(...coins.map((c, i) => mapToToken(c, (page - 1) * 100 + i)));

    // Delay between pages to avoid rate limits
    if (page < pages) await new Promise(r => setTimeout(r, 1500));
  }

  return allTokens;
}

export async function fetchCryptoGlobal(): Promise<CryptoGlobalData> {
  // MIGRATION: Uses centralized ENDPOINTS config instead of Supabase URL
  const url = ENDPOINTS.CRYPTO_GLOBAL;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      // MIGRATION: No 'Authorization' header needed — your server handles this
    },
  });

  if (!response.ok) throw new Error(`crypto-global failed: ${response.status}`);
  return response.json();
}
