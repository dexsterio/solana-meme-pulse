import { useEffect, useRef, useState, useCallback } from 'react';
import { Token } from '@/data/mockTokens';

const WS_URL = 'wss://pumpportal.fun/api/data';
const MAX_TOKENS = 50;
const METADATA_TIMEOUT = 5000;

interface PumpPortalTokenEvent {
  signature: string;
  mint: string;
  traderPublicKey: string;
  txType: string;
  initialBuy: number;
  bondingCurveKey: string;
  vTokensInBondingCurve: number;
  vSolInBondingCurve: number;
  marketCapSol: number;
  name: string;
  symbol: string;
  uri: string;
}

// Fetch metadata (logo) from token URI with timeout
async function fetchTokenMetadata(uri: string): Promise<{ image: string } | null> {
  if (!uri) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), METADATA_TIMEOUT);

    // Handle IPFS URIs
    let fetchUrl = uri;
    if (uri.startsWith('ipfs://')) {
      fetchUrl = `https://ipfs.io/ipfs/${uri.slice(7)}`;
    }

    const res = await fetch(fetchUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;

    const meta = await res.json();
    let image = meta?.image || meta?.imageUrl || '';

    // Convert IPFS image URIs
    if (image.startsWith('ipfs://')) {
      image = `https://ipfs.io/ipfs/${image.slice(7)}`;
    }

    return image ? { image } : null;
  } catch {
    return null;
  }
}

function calcSolPrice(): number {
  // Approximate SOL price — will be refined if we have it elsewhere
  return 180;
}

function mapEventToToken(event: PumpPortalTokenEvent, logoUrl: string, index: number): Token {
  const solPrice = calcSolPrice();
  const mcapUsd = (event.marketCapSol || 0) * solPrice;
  const priceUsd = event.vTokensInBondingCurve > 0
    ? (event.vSolInBondingCurve / event.vTokensInBondingCurve) * solPrice
    : 0;
  // initialBuy is in token amount, not SOL — compute volume from it
  const volumeUsd = event.initialBuy > 0 && event.vTokensInBondingCurve > 0
    ? (event.initialBuy / event.vTokensInBondingCurve) * event.vSolInBondingCurve * solPrice
    : 0;

  return {
    id: event.mint,
    rank: index + 1,
    name: event.name || 'Unknown',
    ticker: event.symbol || '???',
    logo: '',
    logoUrl,
    address: event.mint,
    poolAddress: event.bondingCurveKey || '',
    price: priceUsd,
    priceSOL: event.vTokensInBondingCurve > 0
      ? event.vSolInBondingCurve / event.vTokensInBondingCurve
      : 0,
    age: 'just now',
    txns: 1,
    volume: volumeUsd,
    makers: 1,
    change5m: 0,
    change1h: 0,
    change6h: 0,
    change24h: 0,
    liquidity: (event.vSolInBondingCurve || 0) * solPrice,
    mcap: mcapUsd,
    fdv: mcapUsd,
    buys24h: 1,
    sells24h: 0,
    exchangeName: 'pump.fun',
  } as Token;
}

export function usePumpPortalNewTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();
  const mountedRef = useRef(true);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!mountedRef.current) return;
        setIsConnected(true);
        console.log('PumpPortal WS connected');

        // Subscribe to new token creation events
        ws.send(JSON.stringify({ method: 'subscribeNewToken' }));
      };

      ws.onmessage = async (event) => {
        if (!mountedRef.current) return;
        try {
          const data: PumpPortalTokenEvent = JSON.parse(event.data);

          // Only process token creation events
          if (!data.mint || !data.name) return;

          // Fetch metadata for logo
          const metadata = await fetchTokenMetadata(data.uri);

          // ONLY add if we have a logo
          if (!metadata?.image) return;

          if (!mountedRef.current) return;

          const token = mapEventToToken(data, metadata.image, 0);

          setTokens((prev) => {
            // Deduplicate by mint address
            if (prev.some((t) => t.id === token.id)) return prev;

            const updated = [token, ...prev].slice(0, MAX_TOKENS);
            // Re-rank
            return updated.map((t, i) => ({ ...t, rank: i + 1 }));
          });
        } catch {
          // Ignore malformed messages
        }
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        setIsConnected(false);
        console.log('PumpPortal WS disconnected, reconnecting in 3s...');
        reconnectTimer.current = setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.warn('PumpPortal WS error:', err);
        ws.close();
      };
    } catch (err) {
      console.error('PumpPortal WS connection failed:', err);
      reconnectTimer.current = setTimeout(connect, 5000);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  return { tokens, isConnected };
}
