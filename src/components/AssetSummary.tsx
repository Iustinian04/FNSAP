
import { Asset } from "@/lib/mock-data";
import { 
  formatPriceChange, 
  formatPriceChangePercent,
  getPriceChangeClass
} from "@/lib/sentiment-utils";
import { usePriceUpdates } from "@/hooks/use-price-updates";

interface AssetSummaryProps {
  asset: Asset;
}

const AssetSummary = ({ asset }: AssetSummaryProps) => {
  // foloseste hook-ul pentru actualizarea preturilor
  const updatedAsset = usePriceUpdates(asset) || asset;
  
  const { symbol, name, type, currentPrice, priceChange, priceChangePercent } = updatedAsset;
  const priceChangeClass = getPriceChangeClass(priceChange);
  
  const formatPrice = (price: number) => {
    
    if (type === 'forex') {
      return price.toFixed(4);
    }
    // Crypto poate avea multe decimale
    if (type === 'crypto') {
      return price > 100 ? price.toFixed(2) : price.toFixed(4);
    }
    // Formatare standard pentru actiuni si indici
    return price.toFixed(2);
  };
  
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 p-4 border rounded-lg bg-card">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{symbol}</h2>
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
            {type.toUpperCase()}
          </span>
        </div>
        <p className="text-muted-foreground">{name}</p>
      </div>
      
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">Current Price</span>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold">${formatPrice(currentPrice)}</span>
          <span className={`${priceChangeClass}`}>
            {formatPriceChange(priceChange)} ({formatPriceChangePercent(priceChangePercent)})
          </span>
        </div>
      </div>
    </div>
  );
};

export default AssetSummary;
