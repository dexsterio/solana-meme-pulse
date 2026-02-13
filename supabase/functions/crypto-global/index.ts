import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const [globalRes, fngRes] = await Promise.all([
      fetch('https://api.coingecko.com/api/v3/global', {
        headers: { 'Accept': 'application/json' },
      }),
      fetch('https://api.alternative.me/fng/?limit=1'),
    ]);

    const globalData = await globalRes.json();
    const fngData = await fngRes.json();

    const g = globalData?.data || {};
    const fng = fngData?.data?.[0] || { value: '50', value_classification: 'Neutral' };

    const result = {
      fearGreed: {
        value: parseInt(fng.value, 10) || 50,
        classification: fng.value_classification || 'Neutral',
      },
      btcDominance: g.market_cap_percentage?.btc ?? 0,
      ethDominance: g.market_cap_percentage?.eth ?? 0,
      totalMarketCap: g.total_market_cap?.usd ?? 0,
      marketCapChange24h: g.market_cap_change_percentage_24h_usd ?? 0,
      ethGas: 0, // CoinGecko doesn't provide gas; we approximate or skip
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
