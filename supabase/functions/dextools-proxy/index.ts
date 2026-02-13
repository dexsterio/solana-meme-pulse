import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const DEXTOOLS_BASE = 'https://public-api.dextools.io/trial/v2';
const MAX_CACHE_SIZE = 200;

// ── In-memory cache (persists across requests within the same edge function instance) ──
interface CacheEntry {
  body: string;
  status: number;
  cachedAt: number;
}

const cache = new Map<string, CacheEntry>();

// ── TTL logic by path pattern (in milliseconds) ──
function getTTL(path: string): number {
  if (path.includes('/ranking/'))           return 120_000; // rankings: 2 min
  if (path.match(/\/token\/[^/]+\/price/))  return 90_000;  // token price: 90s
  if (path.match(/\/token\/[^/]+\/info/))   return 90_000;  // token info: 90s
  if (path.match(/\/token\//))              return 90_000;  // token metadata: 90s
  if (path.match(/\/pool\/[^/]+\/price/))   return 90_000;  // pool price: 90s
  if (path.match(/\/pool\/[^/]+\/liquidity/)) return 90_000; // pool liquidity: 90s
  if (path.includes('/pool/'))              return 60_000;  // new pairs: 60s
  return 60_000; // default: 60s
}

// ── LRU-style eviction: remove oldest entries when cache exceeds max size ──
function evictIfNeeded(): void {
  if (cache.size <= MAX_CACHE_SIZE) return;
  
  // Find and remove the oldest entries
  const entriesToRemove = cache.size - MAX_CACHE_SIZE + 20; // remove 20 extra for headroom
  const sorted = [...cache.entries()].sort((a, b) => a[1].cachedAt - b[1].cachedAt);
  for (let i = 0; i < entriesToRemove && i < sorted.length; i++) {
    cache.delete(sorted[i][0]);
  }
}

// ── Rate limiter: queue requests to DexTools to avoid 429s ──
let lastDexToolsRequest = 0;
const MIN_GAP_MS = 2200; // ~27 req/min

async function throttledFetch(url: string, apiKey: string): Promise<{ body: string; status: number }> {
  const now = Date.now();
  const wait = MIN_GAP_MS - (now - lastDexToolsRequest);
  if (wait > 0) {
    await new Promise(r => setTimeout(r, wait));
  }
  lastDexToolsRequest = Date.now();

  const response = await fetch(url, {
    headers: {
      'X-API-Key': apiKey,
      'accept': 'application/json',
    },
  });

  const body = await response.text();
  return { body, status: response.status };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const apiKey = Deno.env.get('DEXTOOLS_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'DEXTOOLS_API_KEY not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(req.url);
  const path = url.searchParams.get('path');
  if (!path) {
    return new Response(JSON.stringify({ error: 'Missing path parameter' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── Check cache ──
  const cached = cache.get(path);
  const ttl = getTTL(path);
  
  if (cached && (Date.now() - cached.cachedAt) < ttl) {
    const ttlRemaining = Math.ceil((ttl - (Date.now() - cached.cachedAt)) / 1000);
    console.log(`CACHE HIT: ${path} (${ttlRemaining}s remaining)`);
    return new Response(cached.body, {
      status: cached.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'X-Cache': 'HIT',
        'X-Cache-TTL': `${ttlRemaining}`,
        'Cache-Control': `public, max-age=${ttlRemaining}`,
      },
    });
  }

  // ── Cache MISS: fetch from DexTools ──
  try {
    const targetUrl = `${DEXTOOLS_BASE}${path}`;
    console.log(`CACHE MISS: ${path} -> fetching from DexTools`);

    const { body, status } = await throttledFetch(targetUrl, apiKey);

    // Only cache successful responses
    if (status >= 200 && status < 300) {
      cache.set(path, { body, status, cachedAt: Date.now() });
      evictIfNeeded();
    }

    const ttlSeconds = Math.ceil(ttl / 1000);
    return new Response(body, {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'X-Cache': 'MISS',
        'X-Cache-TTL': `${ttlSeconds}`,
        'Cache-Control': status < 300 ? `public, max-age=${ttlSeconds}` : 'no-cache',
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Proxy error:', msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
