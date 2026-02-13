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
    const [globalRes, fngRes, gasRes] = await Promise.allSettled([
      fetch('https://api.coingecko.com/api/v3/global', {
        headers: { 'Accept': 'application/json' },
      }),
      fetch('https://api.alternative.me/fng/?limit=1'),
      fetch('https://api.blocknative.com/gasprices/blockprices', {
        headers: { 'Accept': 'application/json' },
      }),
    ]);

    const globalData = globalRes.status === 'fulfilled' ? await globalRes.value.json() : {};
    const fngData = fngRes.status === 'fulfilled' ? await fngRes.value.json() : {};

    let ethGas = 0;
    if (gasRes.status === 'fulfilled' && gasRes.value.ok) {
      try {
        const gasData = await gasRes.value.json();
        ethGas = gasData?.blockPrices?.[0]?.estimatedPrices?.[0]?.price ?? 0;
      } catch { /* ignore */ }
    }

    // Fallback: try etherscan free endpoint
    if (ethGas === 0) {
      try {
        const ethRes = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle');
        if (ethRes.ok) {
          const ethData = await ethRes.json();
          ethGas = parseFloat(ethData?.result?.ProposeGasPrice || '0');
        }
      } catch { /* ignore */ }
    }

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
      ethGas,
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
