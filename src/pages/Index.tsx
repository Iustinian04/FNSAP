import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import SearchBar from "@/components/SearchBar";
import { mockAssets } from "@/lib/mock-data"; 
import { Asset as AssetType, SentimentData } from "@/lib/types/asset-types";
import { generateMockSentimentData } from "@/lib/mock-data/sentiment-generator"; // Import for mock data generation

import PageHeader from "@/components/layout/PageHeader";
import DashboardIntroduction from "@/components/dashboard/DashboardIntroduction";
import LoadingIndicator from "@/components/feedback/LoadingIndicator";
import EmptyState from "@/components/feedback/EmptyState";
import AssetDisplay from "@/components/dashboard/AssetDisplay";
import PageFooter from "@/components/layout/PageFooter";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { toast } = useToast();
  const { user, signOut, loading: authLoading } = useAuth();
  const [selectedAsset, setSelectedAsset] = useState<AssetType | null>(null);
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [alternativeStock, setAlternativeStock] = useState<{ symbol: string, name: string } | null>(null);

  const handleSelectAsset = async (assetFromSearch: AssetType) => {
    setIsLoadingData(true);
    setSelectedAsset(null);
    setSentimentData(null);
    setAlternativeStock(null);

    toast({
      title: `Loading data for ${assetFromSearch.symbol}`,
      description: "Fetching real-time market data and news...",
    });

    try {
      // Fetch financial data
      const { data: apiData, error: financialError } = await supabase.functions.invoke('fetch-financial-data', {
        body: { symbol: assetFromSearch.symbol }
      });

      if (financialError) {
        throw new Error(`Financial data error: ${financialError.message}`);
      }
      
      if (apiData.error) {
        throw new Error(`API Error: ${apiData.error}`);
      }

      const newAssetData: AssetType = {
        symbol: apiData.symbol || assetFromSearch.symbol,
        name: apiData.shortName || assetFromSearch.name,
        type: assetFromSearch.type,
        currentPrice: apiData.regularMarketPrice || 0,
        priceChange: apiData.regularMarketChange || 0,
        priceChangePercent: apiData.regularMarketChangePercent || 0,
        market: apiData.fullExchangeName || assetFromSearch.market,
      };
      setSelectedAsset(newAssetData);

      // Fetch real news data
      const { data: newsData, error: newsError } = await supabase.functions.invoke('fetch-news-data', {
        body: { symbol: newAssetData.symbol }
      });

      if (newsError) {
        console.error("News fetch error:", newsError);
        toast({
          title: "News API Error",
          description: "Using mock data for news and sentiment analysis.",
          variant: "destructive",
        });
        // Fall back to mock data if news API fails
        const mockSentiment = generateMockSentimentData(newAssetData.symbol, newAssetData);
        setSentimentData(mockSentiment);
      } else if (newsData.success && newsData.news && newsData.news.length > 0) {
        // Use real news data
        const avgSentiment = newsData.news.reduce((sum: number, article: any) => sum + article.sentiment.overall, 0) / newsData.news.length;
        
        const realSentimentData: SentimentData = {
          asset: newAssetData,
          currentSentiment: { 
            overall: avgSentiment, 
            confidence: 0.85 
          },
          historicalSentiment: generateMockSentimentData(newAssetData.symbol, newAssetData).historicalSentiment,
          relatedNews: newsData.news,
          analysisProviders: generateMockSentimentData(newAssetData.symbol, newAssetData).analysisProviders,
        };
        setSentimentData(realSentimentData);
        setAlternativeStock(newsData.alternativeStock);
        
        toast({
          title: `Real-time data loaded for ${newAssetData.symbol}`,
          description: `Found ${newsData.newsCount} recent news articles with live sentiment analysis.`,
        });
      } else {
        // No news found, use mock data
        console.log("No news found for symbol, using mock data");
        toast({
          title: `Data loaded for ${newAssetData.symbol}`,
          description: "No recent news found. Using sample sentiment data.",
        });
        const mockSentiment = generateMockSentimentData(newAssetData.symbol, newAssetData);
        setSentimentData(mockSentiment);
      }

    } catch (err: any) {
      console.error("Failed to fetch data:", err);
      toast({
        title: 'Error fetching data',
        description: err.message || "Could not load data from the API. Using mock data.",
        variant: 'destructive',
      });
      // Fallback to showing the initially searched asset and its mock sentiment
      setSelectedAsset(assetFromSearch); 
      const mockSentimentOnError = generateMockSentimentData(assetFromSearch.symbol, assetFromSearch);
      setSentimentData(mockSentimentOnError);
    } finally {
      setIsLoadingData(false);
    }
  };

  const loadDefaultAsset = () => {
    if (mockAssets.length > 0) {
      const defaultAsset = mockAssets[0] as AssetType;
      handleSelectAsset(defaultAsset);
    }
  };

  useEffect(() => {
    if (user && !selectedAsset && !isLoadingData && !sentimentData) { // Ensure sentimentData is also not set
      loadDefaultAsset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoadingData, selectedAsset, sentimentData]); // Added selectedAsset and sentimentData to deps to cover edge cases

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Verifying authentication...</p>
      </div>
    );
  }
  
  if (!user) {
     return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader user={user} signOut={signOut} />

      <main className="container py-6 space-y-6 flex-grow">
        <section>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
            <DashboardIntroduction />
            <div className="w-full md:w-auto max-w-md">
              <SearchBar onSelectAsset={handleSelectAsset as (asset: any) => void} />
            </div>
          </div>

          {isLoadingData && <LoadingIndicator />}

          {!isLoadingData && !selectedAsset && (
            <EmptyState 
              loadDefaultAsset={loadDefaultAsset} 
              defaultAssetSymbol={mockAssets.length > 0 ? (mockAssets[0] as AssetType).symbol : undefined} 
            />
          )}
          
          {!isLoadingData && selectedAsset && (
            <div className="space-y-6">
              <AssetDisplay asset={selectedAsset} sentimentData={sentimentData} />
              {alternativeStock && (
                <div className="p-4 border rounded-lg bg-card">
                  <h3 className="text-lg font-medium mb-2">Alternative Investment</h3>
                  <p className="text-muted-foreground">
                    Consider: <span className="font-medium">{alternativeStock.symbol} ({alternativeStock.name})</span>
                  </p>
                  <button
                    onClick={() => handleSelectAsset({ 
                      symbol: alternativeStock.symbol, 
                      name: alternativeStock.name, 
                      type: 'stock',
                      currentPrice: 0,
                      priceChange: 0,
                      priceChangePercent: 0 
                    } as AssetType)}
                    className="mt-2 text-primary hover:underline"
                  >
                    View {alternativeStock.symbol}
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <PageFooter />
    </div>
  );
};

export default Index;
