
import { useState, useEffect } from "react";
import { Asset } from "@/lib/mock-data";

// Creeza preturi aleatorii care sa simuleze preturi pentru activele financiare
export function usePriceUpdates(initialAsset: Asset | null) {
  const [asset, setAsset] = useState<Asset | null>(initialAsset);
  
  useEffect(() => {
    setAsset(initialAsset);
  }, [initialAsset]);

  useEffect(() => {
    if (!asset) return;
    
    // ipdate la un interval de timp
    const interval = setInterval(() => {
      setAsset(prevAsset => {
        if (!prevAsset) return null;
        
        // miscari pentru preturi 
        const volatility = prevAsset.type === 'forex' ? 0.0002 : 
                          prevAsset.type === 'crypto' ? 0.005 : 0.002;
        
        const randomChange = (Math.random() - 0.5) * 2 * volatility * prevAsset.currentPrice;
        const newPrice = prevAsset.currentPrice + randomChange;
        
        // Calculeaza noul pret si procentul de schimbare
        const newPriceChange = prevAsset.priceChange + randomChange;
        const newChangePercent = (newPriceChange / (prevAsset.currentPrice - prevAsset.priceChange)) * 100;
        
        return {
          ...prevAsset,
          currentPrice: newPrice,
          priceChange: newPriceChange,
          priceChangePercent: newChangePercent
        };
      });
    }, 2500 + Math.random() * 2000); // Interval intre 2.5 si 4.5 secunde
    
    return () => clearInterval(interval);
  }, [asset]);
  
  return asset;
}
