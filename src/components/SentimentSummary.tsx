import { SentimentData } from "@/lib/types/asset-types";
import SentimentGauge from "./SentimentGauge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import { getSentimentLabel } from "@/lib/sentiment-utils";

interface SentimentSummaryProps {
  data: SentimentData;
}

const SentimentSummary = ({ data }: SentimentSummaryProps) => {
  const { currentSentiment, historicalSentiment } = data;
  
  // Calculeaza trendul sentimentului  (compara sentimentul average din ultimele 7 zile cu cele 7 zile anterioare)
  const last7Days = historicalSentiment.slice(-7);
  const previous7Days = historicalSentiment.slice(-14, -7);
  
  const avgLast7 = last7Days.length > 0 ? last7Days.reduce((sum, item) => sum + item.score, 0) / last7Days.length : 0;
  const avgPrevious7 = previous7Days.length > 0 ? previous7Days.reduce((sum, item) => sum + item.score, 0) / previous7Days.length : 0;
  
  const sentimentTrend = avgLast7 - avgPrevious7;
  const sentimentTrendLabel = getSentimentLabel(sentimentTrend);
  
  // cel mai recent volum
  const latestVolume = historicalSentiment.length > 0 ? historicalSentiment[historicalSentiment.length - 1].volume : 0;
  
  // volum mediu
  const avgVolume = historicalSentiment.length > 0 ? historicalSentiment.reduce((sum, item) => sum + item.volume, 0) / historicalSentiment.length : 1; // Avoid division by zero
  const volumeChange = avgVolume !== 0 ? ((latestVolume - avgVolume) / avgVolume) * 100 : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Current Sentiment</CardTitle>
          <CardDescription>Overall market sentiment</CardDescription>
        </CardHeader>
        <CardContent>
          <SentimentGauge sentiment={currentSentiment} size="lg" />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">7-Day Trend</CardTitle>
          <CardDescription>Compared to previous week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {sentimentTrend > 0 ? 
                <TrendingUp className="text-green-500" /> : 
                sentimentTrend < 0 ? <TrendingDown className="text-red-500" /> : null
              }
              <span className={sentimentTrend > 0 ? "text-green-500" : sentimentTrend < 0 ? "text-red-500" : ""}>
                {sentimentTrendLabel}
              </span>
            </div>
            <span className="font-medium">
              {sentimentTrend > 0 ? "+" : ""}{Math.round(sentimentTrend * 100)}%
            </span>
          </div>
          
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${sentimentTrend >= 0 ? 'bg-green-500' : 'bg-red-500'}`} 
              style={{ width: `${Math.min(Math.abs(sentimentTrend) * 200, 100)}%` }} // Multiplier can be adjusted
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">News Volume</CardTitle>
          <CardDescription>Articles mentioning this asset</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-primary" />
              <span className="text-primary">
                {latestVolume} articles
              </span>
            </div>
            <span className={volumeChange >= 0 ? "text-green-500" : "text-red-500"}>
              {volumeChange >= 0 ? 
                <ArrowUp className="inline h-4 w-4" /> : 
                <ArrowDown className="inline h-4 w-4" />
              }
              {Math.abs(Math.round(volumeChange))}%
            </span>
          </div>
          
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500" 
              style={{ width: `${Math.min(avgVolume > 0 ? (latestVolume / avgVolume) * 50 : 0, 100)}%` }} // Adjusted width calculation
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentSummary;
