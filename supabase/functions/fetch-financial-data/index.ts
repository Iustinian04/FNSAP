
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allow any origin
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const YAHOO_FINANCE_API_BASE_URL = "https://yfapi.net/v6/finance/quote"; // Common endpoint for yfapi.net

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const symbol = url.searchParams.get('symbol');

    if (!symbol) {
      return new Response(JSON.stringify({ error: 'Symbol parameter is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get("YAHOO_FINANCE_API_KEY");
    if (!apiKey) {
      console.error("YAHOO_FINANCE_API_KEY is not set in environment variables.");
      return new Response(JSON.stringify({ error: 'API key is not configured on the server.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(`${YAHOO_FINANCE_API_BASE_URL}?symbols=${symbol}`, {
      method: 'GET',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Yahoo Finance API error for symbol ${symbol}: ${response.status} ${errorData}`);
      return new Response(JSON.stringify({ error: `Failed to fetch data from Yahoo Finance API: ${errorData}` }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    // yfapi.net returns data in `quoteResponse.result` array
    if (data.quoteResponse && data.quoteResponse.result && data.quoteResponse.result.length > 0) {
        // We return the first result, as we are querying for one symbol
      return new Response(JSON.stringify(data.quoteResponse.result[0]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      console.error(`Unexpected data structure from Yahoo Finance API for symbol ${symbol}:`, data);
      return new Response(JSON.stringify({ error: 'Unexpected data structure from Yahoo Finance API.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error("Error in Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message || 'An unexpected error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
