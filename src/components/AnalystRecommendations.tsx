import { SentimentData } from "@/lib/types/asset-types";
import SentimentGauge from "./SentimentGauge";
import { Badge } from "@/components/ui/badge";

interface AnalystRecommendationsProps {
  data: SentimentData;
}

const AnalystRecommendations = ({ data }: AnalystRecommendationsProps) => {
  const { analysisProviders } = data;
  
  const getRecommendationColor = (recommendation?: string) => {
    if (!recommendation) return "text-muted-foreground";
    switch (recommendation.toLowerCase()) {
      case 'buy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'sell':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Analyst Recommendations</h3>
      
      <div className="grid gap-4">
        {analysisProviders.map((provider, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 border rounded-lg bg-card"
          >
            <div>
              <h4 className="font-medium">{provider.name}</h4>
              <div className="mt-1">
                <SentimentGauge 
                  sentiment={provider.sentiment}
                  size="sm" 
                  showConfidence={false}
                />
              </div>
            </div>
            
            {provider.recommendation && (
              <Badge className={getRecommendationColor(provider.recommendation)}>
                {provider.recommendation}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalystRecommendations;
