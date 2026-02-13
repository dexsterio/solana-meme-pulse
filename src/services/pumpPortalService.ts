import { Token } from '@/data/mockTokens';

const WS_URL = 'wss://pumpportal.fun/api/data';
const MAX_TOKENS = 50;
const METADATA_TIMEOUT = 5000;
const RECONNECT_DELAY = 3000;

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
  pool?: string;
}

type Listener = (tokens: Token[]) => void;

// --- Helpers ---

function detectPlatform(event: PumpPortalTokenEvent): string {
  if (event.pool === 'bonk' || event.pool === 'letsbonk') return 'letsbonk.fun';
  if (event.pool === 'pump') return 'pump.fun';
  if (event.uri?.includes('bonk') || event.uri?.includes('letsbonk')) return 'letsbonk.fun';
  return 'pump.fun';
}

async function fetchTokenMetadata(uri: string): Promise<{ image: string } | null> {
  if (!uri) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), METADATA_TIMEOUT);
    let fetchUrl = uri;
    if (uri.startsWith('ipfs://')) {
      fetchUrl = `https://ipfs.io/ipfs/${uri.slice(7)}`;
    }
    const res = await fetch(fetchUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const meta = await res.json();
    let image = meta?.image || meta?.imageUrl || '';
    if (image.startsWith('ipfs://')) {
      image = `https://ipfs.io/ipfs/${image.slice(7)}`;
    }
    return image ? { image } : null;
  } catch {
    return null;
  }
}

function calcSolPrice(): number {
  return 180;
}

function mapEventToToken(event: PumpPortalTokenEvent, logoUrl: string, index: number): Token {
  const solPrice = calcSolPrice();
  const mcapUsd = (event.marketCapSol || 0) * solPrice;
  const priceUsd = event.vTokensInBondingCurve > 0
    ? (event.vSolInBondingCurve / event.vTokensInBondingCurve) * solPrice
    : 0;
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
    exchangeName: detectPlatform(event),
  } as Token;
}

// --- Singleton State ---

let tokens: Token[] = [];
let connected = false;
let ws: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<Listener>();

function notifyListeners() {
  const snapshot = [...tokens];
  listeners.forEach((fn) => fn(snapshot));
}

function addToken(token: Token) {
  if (tokens.some((t) => t.id === token.id)) return;
  tokens = [token, ...tokens].slice(0, MAX_TOKENS).map((t, i) => ({ ...t, rank: i + 1 }));
  notifyListeners();
}

function connect() {
  if (ws?.readyState === WebSocket.OPEN) return;

  try {
    const socket = new WebSocket(WS_URL);
    ws = socket;

    socket.onopen = () => {
      connected = true;
      notifyListeners();
      console.log('[PumpPortal] WS connected');
      socket.send(JSON.stringify({ method: 'subscribeNewToken' }));
    };

    socket.onmessage = async (event) => {
      try {
        const data: PumpPortalTokenEvent = JSON.parse(event.data);
        if (!data.mint || !data.name) return;

        const metadata = await fetchTokenMetadata(data.uri);
        if (!metadata?.image) return;

        const token = mapEventToToken(data, metadata.image, 0);
        addToken(token);
      } catch {
        // ignore malformed
      }
    };

    socket.onclose = () => {
      connected = false;
      notifyListeners();
      console.log('[PumpPortal] WS disconnected, reconnecting...');
      reconnectTimer = setTimeout(connect, RECONNECT_DELAY);
    };

    socket.onerror = (err) => {
      console.warn('[PumpPortal] WS error:', err);
      socket.close();
    };
  } catch (err) {
    console.error('[PumpPortal] connection failed:', err);
    reconnectTimer = setTimeout(connect, RECONNECT_DELAY * 2);
  }
}

// --- Public API ---

export function getTokens(): Token[] {
  return [...tokens];
}

export function isConnected(): boolean {
  return connected;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Call once at app startup to begin collecting tokens */
export function initPumpPortalService() {
  if (ws) return; // already initialized
  connect();
}
