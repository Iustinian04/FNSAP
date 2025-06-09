
import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { symbol } = await req.json();
    
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    const alphaVantageApiKey = Deno.env.get('ALPHA_VANTAGE_API_KEY');
    
    if (!alphaVantageApiKey) {
      throw new Error('Alpha Vantage API key not configured');
    }

    // Fetch news and sentiment data from Alpha Vantage
    const newsUrl = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${symbol}&apikey=${alphaVantageApiKey}&limit=20`;
    
    console.log('Fetching news for symbol:', symbol);
    console.log('API key configured:', !!alphaVantageApiKey);
    
    const response = await fetch(newsUrl);
    const data = await response.json();
    
    console.log('Alpha Vantage response status:', response.status);
    console.log('Alpha Vantage response data keys:', Object.keys(data));
    
    if (data.Note || data['Error Message']) {
      console.error('Alpha Vantage API error:', data.Note || data['Error Message']);
      throw new Error(data.Note || data['Error Message'] || 'API limit reached or invalid request');
    }

    // Transform the data to match our NewsArticle interface
    const transformedNews = data.feed ? data.feed.map((article: any, index: number) => ({
      id: `${symbol}-${index}-${Date.now()}`,
      title: article.title,
      source: article.source,
      url: article.url,
      publishedAt: article.time_published,
      sentiment: {
        overall: parseFloat(article.overall_sentiment_score || '0'),
        confidence: parseFloat(article.relevance_score || '0.5')
      },
      summary: article.summary || article.title
    })) : [];

    console.log(`Transformed ${transformedNews.length} news articles for ${symbol}`);

    // Get alternative stocks based on symbol
    const getAlternativeStock = (symbol: string) => {
      const alternatives: Record<string, { symbol: string, name: string }> = {
        "AAPL": { symbol: "MSFT", name: "Microsoft Corporation" },
        "MSFT": { symbol: "AAPL", name: "Apple Inc." },
        "GOOGL": { symbol: "META", name: "Meta Platforms Inc." },
        "META": { symbol: "GOOGL", name: "Alphabet Inc." },
        "TSLA": { symbol: "F", name: "Ford Motor Company" },
        "F": { symbol: "TSLA", name: "Tesla Inc." },
        "AMZN": { symbol: "WMT", name: "Walmart Inc." },
        "WMT": { symbol: "AMZN", name: "Amazon.com Inc." },
        "NVDA": { symbol: "AMD", name: "Advanced Micro Devices Inc." },
        "AMD": { symbol: "NVDA", name: "NVIDIA Corporation" },
        "NFLX": { symbol: "DIS", name: "The Walt Disney Company" },
        "DIS": { symbol: "NFLX", name: "Netflix Inc." },
        "JPM": { symbol: "BAC", name: "Bank of America Corporation" },
        "BAC": { symbol: "JPM", name: "JPMorgan Chase & Co." },
        "V": { symbol: "MA", name: "Mastercard Incorporated" },
        "MA": { symbol: "V", name: "Visa Inc." },
        "JNJ": { symbol: "PFE", name: "Pfizer Inc." },
        "PFE": { symbol: "JNJ", name: "Johnson & Johnson" },
        "XOM": { symbol: "CVX", name: "Chevron Corporation" },
        "CVX": { symbol: "XOM", name: "Exxon Mobil Corporation" },
        "EURUSD": { symbol: "GBPUSD", name: "British Pound/US Dollar" },
        "GBPUSD": { symbol: "EURUSD", name: "Euro/US Dollar" },
        "USDJPY": { symbol: "EURJPY", name: "Euro/Japanese Yen" },
        "EURJPY": { symbol: "USDJPY", name: "US Dollar/Japanese Yen" },
        "BTC": { symbol: "ETH", name: "Ethereum" },
        "ETH": { symbol: "BTC", name: "Bitcoin" },
        "GLD": { symbol: "SLV", name: "iShares Silver Trust" },
        "SLV": { symbol: "GLD", name: "SPDR Gold Trust" }
      };
      
      return alternatives[symbol] || { symbol: "SPY", name: "SPDR S&P 500 ETF Trust" };
    };

    const alternativeStock = getAlternativeStock(symbol);

    return new Response(JSON.stringify({
      success: true,
      news: transformedNews,
      alternativeStock,
      symbol,
      newsCount: transformedNews.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-news-data function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      news: [],
      alternativeStock: null,
      symbol: null
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
