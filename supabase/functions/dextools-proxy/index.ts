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

// ── Fetch with exponential backoff on 429 ──
async function fetchWithRetry(url: string, apiKey: string, maxRetries = 3): Promise<{ body: string; status: number }> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: { 'X-API-Key': apiKey, 'accept': 'application/json' },
    });

    if (response.status === 429) {
      if (attempt < maxRetries - 1) {
        const retryAfter = response.headers.get('Retry-After');
        const waitMs = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : Math.pow(2, attempt + 1) * 2000 + Math.random() * 1000;
        console.log(`429 on attempt ${attempt + 1}, waiting ${Math.round(waitMs / 1000)}s...`);
        await new Promise(r => setTimeout(r, waitMs));
        continue;
      }
    }

    const body = await response.text();
    return { body, status: response.status };
  }

  return { body: JSON.stringify({ message: 'Max retries exceeded' }), status: 429 };
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
  let cached: { body: string; status: number; cached_at: string } | null = null;
  try {
    // Fetch both the main cache entry and the 429 marker in parallel
    const [mainResult, markerResult] = await Promise.all([
      supabase.from('api_cache').select('body, status, cached_at').eq('path', path).maybeSingle(),
      supabase.from('api_cache').select('cached_at').eq('path', `__429__${path}`).maybeSingle(),
    ]);
    cached = mainResult.data;
    const marker429 = markerResult.data;

    // Check if we're in a 429 cooldown period (120s)
    if (marker429) {
      const markerAge = (Date.now() - new Date(marker429.cached_at).getTime()) / 1000;
      if (markerAge < 120) {
        // In cooldown — serve stale good data if available
        if (cached && cached.status >= 200 && cached.status < 300) {
          console.log(`RATE LIMITED but serving STALE data for ${path} (cooldown ${Math.ceil(120 - markerAge)}s left)`);
          return new Response(cached.body, {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'STALE' },
          });
        }
        console.log(`RATE LIMITED: ${path} — no stale data (cooldown ${Math.ceil(120 - markerAge)}s left)`);
        return new Response(JSON.stringify({ error: 'Rate limited, please wait', retryAfter: Math.ceil(120 - markerAge) }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': `${Math.ceil(120 - markerAge)}` },
        });
      }
    }

    // Fresh successful data → serve it
    if (cached && cached.status >= 200 && cached.status < 300) {
      const age = (Date.now() - new Date(cached.cached_at).getTime()) / 1000;
      if (age < ttlSeconds) {
        const remaining = Math.ceil(ttlSeconds - age);
        console.log(`CACHE HIT: ${path} (${remaining}s remaining)`);
        return new Response(cached.body, {
          status: cached.status,
          headers: {
            ...corsHeaders, 'Content-Type': 'application/json',
            'X-Cache': 'HIT', 'X-Cache-TTL': `${remaining}`,
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

    const { body, status } = await fetchWithRetry(targetUrl, apiKey);

    if (status >= 200 && status < 300) {
      // Success → cache it (overwrites any previous entry including 429s)
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
      return new Response(body, {
        status,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-Cache': 'MISS',
          'X-Cache-TTL': `${ttlSeconds}`,
          'Cache-Control': `public, max-age=${ttlSeconds}`,
        },
      });
    }

    if (status === 429) {
      console.log(`DexTools 429 for ${path} — saving cooldown marker`);
      // Save 429 marker ONLY if there's no existing good data
      // If good data exists (even stale), keep it and just add a cooldown marker
      const markerPath = `__429__${path}`;
      try {
        await supabase
          .from('api_cache')
          .upsert({
            path: markerPath,
            body: '429',
            status: 429,
            cached_at: new Date().toISOString(),
          }, { onConflict: 'path' });
      } catch (e) {
        console.warn('429 marker write error:', e);
      }

      // If we have stale good data, serve it instead of the 429
      if (cached && cached.status >= 200 && cached.status < 300) {
        console.log(`Serving STALE data for ${path} (was ${Math.ceil((Date.now() - new Date(cached.cached_at).getTime()) / 1000)}s old)`);
        return new Response(cached.body, {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'X-Cache': 'STALE',
          },
        });
      }

      // No good data at all → return 429
      return new Response(body, {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '120' },
      });
    }

    // Other errors
    return new Response(body, {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Proxy error:', msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
