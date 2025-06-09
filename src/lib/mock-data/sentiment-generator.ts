
import { SentimentData, NewsArticle, Asset } from '../types/asset-types';


export const generateMockNews = (symbol: string): NewsArticle[] => {
  const baseArticles: NewsArticle[] = [
    {
      id: '1',
      title: `${symbol} Sees Unexpected Growth in Emerging Markets`,
      source: 'Financial Times',
      url: '#',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), 
      sentiment: { overall: 0.75, confidence: 0.82 },
      summary: `${symbol} reported stronger than expected growth in emerging markets, particularly in Southeast Asia and Latin America regions.`,
    },
    {
      id: '2',
      title: `Analysts Downgrade ${symbol} Amid Supply Chain Concerns`,
      source: 'Wall Street Journal',
      url: '#',
      publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), 
      sentiment: { overall: -0.62, confidence: 0.78 },
      summary: `Multiple analysts have downgraded ${symbol} citing ongoing supply chain disruptions that could impact revenue for the next two quarters.`,
    },
    {
      id: '3',
      title: `${symbol} Announces New Partnership with Tech Giant`,
      source: 'Bloomberg',
      url: '#',
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      sentiment: { overall: 0.88, confidence: 0.91 },
      summary: `${symbol} has entered into a strategic partnership expected to drive innovation and create new revenue streams.`,
    },
    {
      id: '4',
      title: `Regulatory Investigation Targets ${symbol}'s Business Practices`,
      source: 'Reuters',
      url: '#',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
      sentiment: { overall: -0.81, confidence: 0.86 },
      summary: `Regulators have launched an investigation into ${symbol}'s business practices following allegations of anti-competitive behavior.`,
    },
    {
      id: '5',
      title: `${symbol} Reports Mixed Quarterly Results`,
      source: 'CNBC',
      url: '#',
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), 
      sentiment: { overall: 0.12, confidence: 0.65 },
      summary: `${symbol}'s quarterly results showed revenue above expectations but earnings per share slightly below analyst estimates.`,
    },
  ];

  // Valorile sentimentului si increderii sunt ajustate aleator pentru a simula variatii realiste
  return baseArticles.map(article => {
    const sentimentVariation = (Math.random() * 0.2) - 0.1;
    const confidenceVariation = (Math.random() * 0.15) - 0.075;
    
    return {
      ...article,
      sentiment: {
        overall: Math.max(-1, Math.min(1, article.sentiment.overall + sentimentVariation)),
        confidence: Math.max(0, Math.min(1, article.sentiment.confidence + confidenceVariation)),
      }
    };
  });
};

export const generateMockSentimentData = (symbol: string, asset: Asset): SentimentData => {
  
  const overallSentiment = (Math.random() * 2) - 1; // -1 to 1
  
  const historicalSentiment = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    
    // Creare unui trend realist de sentiment cu o mica variatie
    const baseScore = overallSentiment + ((i / 30) * (Math.random() - 0.5));
    const score = Math.max(-1, Math.min(1, baseScore));
    
    // Variaza produsul stirilor
    const volume = Math.floor(Math.random() * 100) + 5;
    
    return {
      date: date.toISOString().split('T')[0],
      score,
      volume,
    };
  });
  
  // analysis providers
  const analysisProviders = [
    {
      name: 'Goldman Sachs',
      sentiment: { 
        overall: Math.max(-1, Math.min(1, overallSentiment + ((Math.random() - 0.5) * 0.4))), 
        confidence: 0.75 + (Math.random() * 0.2) 
      },
      recommendation: Math.random() > 0.5 ? 'Buy' : (Math.random() > 0.5 ? 'Hold' : 'Sell'),
    },
    {
      name: 'Morgan Stanley',
      sentiment: { 
        overall: Math.max(-1, Math.min(1, overallSentiment + ((Math.random() - 0.5) * 0.4))), 
        confidence: 0.75 + (Math.random() * 0.2) 
      },
      recommendation: Math.random() > 0.5 ? 'Buy' : (Math.random() > 0.5 ? 'Hold' : 'Sell'),
    },
    {
      name: 'JP Morgan',
      sentiment: { 
        overall: Math.max(-1, Math.min(1, overallSentiment + ((Math.random() - 0.5) * 0.4))), 
        confidence: 0.75 + (Math.random() * 0.2) 
      },
      recommendation: Math.random() > 0.5 ? 'Buy' : (Math.random() > 0.5 ? 'Hold' : 'Sell'),
    },
    {
      name: 'Citigroup',
      sentiment: { 
        overall: Math.max(-1, Math.min(1, overallSentiment + ((Math.random() - 0.5) * 0.4))), 
        confidence: 0.75 + (Math.random() * 0.2) 
      },
      recommendation: Math.random() > 0.5 ? 'Buy' : (Math.random() > 0.5 ? 'Hold' : 'Sell'),
    },
  ];
  
  return {
    asset,
    currentSentiment: { 
      overall: overallSentiment, 
      confidence: 0.7 + (Math.random() * 0.25) 
    },
    historicalSentiment,
    relatedNews: generateMockNews(symbol),
    analysisProviders,
  };
};
