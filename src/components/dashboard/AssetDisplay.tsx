
import React from 'react';
import AssetSummary from "@/components/AssetSummary";
import { Asset, SentimentData, NewsArticle } from "@/lib/types/asset-types"; 
import SentimentSummary from "@/components/SentimentSummary";
import SentimentChart from "@/components/SentimentChart";
import AnalystRecommendations from "@/components/AnalystRecommendations";
import NewsItem from "@/components/NewsItem";
import LoadingIndicator from '@/components/feedback/LoadingIndicator'; // For inline loading state

interface AssetDisplayProps {
  asset: Asset;
  sentimentData: SentimentData | null;
}

const AssetDisplay: React.FC<AssetDisplayProps> = ({ asset, sentimentData }) => {
  return (
    <div className="space-y-6">
      <AssetSummary asset={asset} />
      
      {sentimentData ? (
        <>
          <SentimentSummary data={sentimentData} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 border rounded-lg p-4 bg-card">
              <SentimentChart data={sentimentData} />
            </div>
            <div className="border rounded-lg p-4 bg-card">
              <AnalystRecommendations data={sentimentData} />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Recent News Articles</h3>
              {/* Optional: Add a link to a dedicated news page or filter options */}
            </div>
            {sentimentData.relatedNews && sentimentData.relatedNews.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2"> {/* Display news in 2 columns on medium screens */}
                {sentimentData.relatedNews.map((article: NewsArticle) => (
                  <NewsItem key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="p-4 border rounded-lg bg-card text-muted-foreground text-center">
                <p>No recent news articles found for {asset.symbol}.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-4 border rounded-lg bg-card text-muted-foreground text-center space-y-2">
           <LoadingIndicator /> {/* Removed message prop */}
           <p>{`Loading sentiment analysis and news for ${asset.symbol}...`}</p> {/* Message displayed as separate p tag */}
           <p className="text-sm">Displaying latest market data.</p>
        </div>
      )}
    </div>
  );
};

export default AssetDisplay;

