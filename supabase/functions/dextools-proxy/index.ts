import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const DEXTOOLS_BASE = 'https://public-api.dextools.io/trial/v2';

// ── TTL in seconds by path pattern ──
function getTTLSeconds(path: string): number {
  if (path.includes('/ranking/'))              return 120;
  if (path.match(/\/token\/[^/]+\/price/))     return 90;
  if (path.match(/\/token\/[^/]+\/info/))      return 90;
  if (path.match(/\/token\//))                 return 90;
  if (path.match(/\/pool\/[^/]+\/price/))      return 90;
  if (path.match(/\/pool\/[^/]+\/liquidity/))  return 90;
  if (path.includes('/pool/'))                 return 60;
  return 60;
}

// ── Rate limiter: simple in-memory tracker (best-effort, resets on cold start) ──
let lastDexToolsRequest = 0;
const MIN_GAP_MS = 2200;

async function throttledFetch(url: string, apiKey: string): Promise<{ body: string; status: number }> {
  const now = Date.now();
  const wait = MIN_GAP_MS - (now - lastDexToolsRequest);
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastDexToolsRequest = Date.now();

  const response = await fetch(url, {
    headers: { 'X-API-Key': apiKey, 'accept': 'application/json' },
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
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const url = new URL(req.url);
  const path = url.searchParams.get('path');
  if (!path) {
    return new Response(JSON.stringify({ error: 'Missing path parameter' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── Init Supabase client for DB cache ──
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const ttlSeconds = getTTLSeconds(path);

  // ── Check DB cache ──
  try {
    const { data: cached } = await supabase
      .from('api_cache')
      .select('body, status, cached_at')
      .eq('path', path)
      .maybeSingle();

    if (cached) {
      const age = (Date.now() - new Date(cached.cached_at).getTime()) / 1000;
      // Use shorter TTL for error responses (429)
      const effectiveTTL = cached.status === 429 ? 60 : ttlSeconds;
      if (age < effectiveTTL) {
        const remaining = Math.ceil(ttlSeconds - age);
        console.log(`CACHE HIT: ${path} (${remaining}s remaining)`);
        return new Response(cached.body, {
          status: cached.status,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-Cache': 'HIT',
            'X-Cache-TTL': `${remaining}`,
            'Cache-Control': `public, max-age=${remaining}`,
          },
        });
      }
    }
  } catch (e) {
    console.warn('Cache read error:', e);
  }

  // ── Cache MISS: fetch from DexTools ──
  try {
    const targetUrl = `${DEXTOOLS_BASE}${path}`;
    console.log(`CACHE MISS: ${path} -> fetching from DexTools`);

    const { body, status } = await throttledFetch(targetUrl, apiKey);

    // Cache successful responses AND 429s (to prevent hammering)
    if (status >= 200 && status < 300) {
      try {
        await supabase
          .from('api_cache')
          .upsert({
            path,
            body,
            status,
            cached_at: new Date().toISOString(),
          }, { onConflict: 'path' });
      } catch (e) {
        console.warn('Cache write error:', e);
      }
    } else if (status === 429) {
      // Cache 429 for 60s to stop retries from hitting DexTools
      try {
        await supabase
          .from('api_cache')
          .upsert({
            path,
            body,
            status,
            cached_at: new Date().toISOString(),
          }, { onConflict: 'path' });
        console.log(`Cached 429 for ${path} (60s cooldown)`);
      } catch (e) {
        console.warn('Cache write error (429):', e);
      }
    }

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
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
