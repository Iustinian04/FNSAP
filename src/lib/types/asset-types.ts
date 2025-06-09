
export type Asset = {
  symbol: string;
  name: string;
  type: 'stock' | 'index' | 'forex' | 'crypto' | 'commodity';
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  market?: string;
};

export type SentimentScore = {
  overall: number; // de la -1 la 1 (negativ la positiv)
  confidence: number; // de la 0 la 1
};

export type NewsArticle = {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: SentimentScore;
  summary: string;
};

export type SentimentData = {
  asset: Asset;
  currentSentiment: SentimentScore;
  historicalSentiment: Array<{
    date: string;
    score: number;
    volume: number;
  }>;
  relatedNews: NewsArticle[];
  analysisProviders: Array<{
    name: string;
    sentiment: SentimentScore;
    recommendation?: string;
  }>;
};
