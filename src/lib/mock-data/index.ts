
import { Asset, SentimentData, NewsArticle } from '../types/asset-types';
import { techStocks, modernTechStocks, enterpriseTechStocks } from './tech-stocks';
import { financialStocks } from './financial-stocks';
import { healthcareStocks } from './healthcare-stocks';
import { consumerStocks } from './consumer-stocks';
import { energyStocks, industrialStocks } from './energy-industrial-stocks';
import { europeanStocks, asianStocks } from './international-stocks';
import { usMarketIndices, globalMarketIndices } from './market-indices';
import { majorForexPairs, minorForexPairs, exoticForexPairs, emergingMarketForexPairs } from './forex-pairs';
import { cryptocurrencies } from './cryptocurrencies';
import { energyCommodities, metalCommodities, agriculturalCommodities } from './commodities';
import { generateMockNews, generateMockSentimentData } from './sentiment-generator';

// Combina toate assets-urile mock intr-un singur array
export const mockAssets: Asset[] = [
  ...techStocks,
  ...modernTechStocks,
  ...enterpriseTechStocks,
  ...financialStocks,
  ...healthcareStocks,
  ...consumerStocks,
  ...energyStocks,
  ...industrialStocks,
  ...europeanStocks,
  ...asianStocks,
  ...usMarketIndices,
  ...globalMarketIndices,
  ...majorForexPairs,
  ...minorForexPairs,
  ...exoticForexPairs,
  ...emergingMarketForexPairs,
  ...cryptocurrencies,
  ...energyCommodities,
  ...metalCommodities,
  ...agriculturalCommodities,
];

// Cautareaza assets in functie de simbol sau nume
export const searchAssets = (query: string): Asset[] => {
  if (!query) return [];
  
  const lowercaseQuery = query.toLowerCase();
  return mockAssets.filter(asset => 
    asset.symbol.toLowerCase().includes(lowercaseQuery) || 
    asset.name.toLowerCase().includes(lowercaseQuery)
  );
};

// 
export {
  techStocks,
  modernTechStocks,
  enterpriseTechStocks,
  financialStocks,
  healthcareStocks,
  consumerStocks,
  energyStocks,
  industrialStocks,
  europeanStocks,
  asianStocks,
  usMarketIndices,
  globalMarketIndices,
  majorForexPairs,
  minorForexPairs,
  exoticForexPairs,
  emergingMarketForexPairs,
  cryptocurrencies,
  energyCommodities,
  metalCommodities,
  agriculturalCommodities,
  generateMockNews,
  generateMockSentimentData
};

export type { Asset, SentimentData, NewsArticle };
