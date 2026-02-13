import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const CACHE_TTL_MS = 120_000; // 2 minutes

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const page = url.searchParams.get('page') || '1';
    const perPage = url.searchParams.get('per_page') || '100';
    const cacheKey = `coingecko-markets-p${page}-pp${perPage}`;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Check cache
    const { data: cached } = await supabase
      .from('api_cache')
      .select('body, cached_at, status')
      .eq('path', cacheKey)
      .maybeSingle();

    const now = Date.now();
    const cachedAge = cached ? now - new Date(cached.cached_at).getTime() : Infinity;

    if (cached && cachedAge < CACHE_TTL_MS && cached.status === 200) {
      return new Response(cached.body, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
        status: 200,
      });
    }

    // Fetch from CoinGecko
    const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=1h,24h,7d,30d`;

    const response = await fetch(apiUrl, {
      headers: { 'Accept': 'application/json' },
    });

    if (response.status === 429) {
      // Rate limited — serve stale cache if available
      if (cached && cached.status === 200) {
        console.log(`CoinGecko 429 for page ${page}, serving stale cache (age: ${Math.round(cachedAge / 1000)}s)`);
        return new Response(cached.body, {
          headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'STALE' },
          status: 200,
        });
      }
      // No cache available at all
      const errBody = await response.text();
      return new Response(errBody, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 429,
      });
    }

    const body = await response.text();

    if (response.ok) {
      // Save to cache
      await supabase.from('api_cache').upsert({
        path: cacheKey,
        body,
        status: 200,
        cached_at: new Date().toISOString(),
      }, { onConflict: 'path' });
    }

    return new Response(body, {
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'X-Cache': 'MISS' },
      status: response.status,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
