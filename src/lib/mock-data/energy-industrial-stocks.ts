
import { Asset } from "../types/asset-types";

// US Energy Stocks
export const energyStocks: Asset[] = [
  {
    symbol: 'XOM',
    name: 'Exxon Mobil Corporation',
    type: 'stock',
    currentPrice: 119.87,
    priceChange: 1.23,
    priceChangePercent: 1.04,
    market: 'NYSE',
  },
  {
    symbol: 'CVX',
    name: 'Chevron Corporation',
    type: 'stock',
    currentPrice: 157.23,
    priceChange: 0.87,
    priceChangePercent: 0.56,
    market: 'NYSE',
  },
  {
    symbol: 'EOG',
    name: 'EOG Resources, Inc.',
    type: 'stock',
    currentPrice: 125.76,
    priceChange: 2.14,
    priceChangePercent: 1.73,
    market: 'NYSE',
  },
  {
    symbol: 'COP',
    name: 'ConocoPhillips',
    type: 'stock',
    currentPrice: 115.38,
    priceChange: 0.96,
    priceChangePercent: 0.84,
    market: 'NYSE',
  },
];

// US Industrial Stocks
export const industrialStocks: Asset[] = [
  {
    symbol: 'GE',
    name: 'General Electric Company',
    type: 'stock',
    currentPrice: 171.69,
    priceChange: 1.45,
    priceChangePercent: 0.85,
    market: 'NYSE',
  },
  {
    symbol: 'CAT',
    name: 'Caterpillar Inc.',
    type: 'stock',
    currentPrice: 352.41,
    priceChange: 3.21,
    priceChangePercent: 0.92,
    market: 'NYSE',
  },
  {
    symbol: 'BA',
    name: 'The Boeing Company',
    type: 'stock',
    currentPrice: 187.24,
    priceChange: -1.87,
    priceChangePercent: -0.99,
    market: 'NYSE',
  },
  {
    symbol: 'MMM',
    name: '3M Company',
    type: 'stock',
    currentPrice: 106.45,
    priceChange: 0.34,
    priceChangePercent: 0.32,
    market: 'NYSE',
  },
  {
    symbol: 'HON',
    name: 'Honeywell International Inc.',
    type: 'stock',
    currentPrice: 203.76,
    priceChange: 1.24,
    priceChangePercent: 0.61,
    market: 'NYSE',
  },
];
