
import { SentimentScore } from "@/lib/types/asset-types";
import { 
  getSentimentLabel, 
  getSentimentClass, 
  formatSentimentScore,
  formatConfidenceScore 
} from "@/lib/sentiment-utils";

interface SentimentGaugeProps {
  sentiment: SentimentScore;
  size?: 'sm' | 'md' | 'lg';
  showConfidence?: boolean;
}

const SentimentGauge = ({ 
  sentiment, 
  size = 'md',
  showConfidence = true
}: SentimentGaugeProps) => {
  const { overall, confidence } = sentiment;
  const sentimentLabel = getSentimentLabel(overall);
  const sentimentClass = getSentimentClass(overall);
  
  // Converteste de la -1 la 1 scala 
    const gaugePosition = ((overall + 1) / 2) * 100;
  
  
  const getSize = () => {
    switch(size) {
      case 'sm': return { height: 'h-1.5', text: 'text-sm', width: 'w-24' };
      case 'lg': return { height: 'h-3', text: 'text-lg', width: 'w-full' };
      default: return { height: 'h-2', text: 'text-base', width: 'w-48' };
    }
  };
  
  const sizeStyle = getSize();

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className={`font-medium ${sentimentClass} ${sizeStyle.text}`}>
          {sentimentLabel}
        </span>
        <span className="text-sm text-muted-foreground">
          {formatSentimentScore(overall)}
        </span>
      </div>
      
      <div className={`${sizeStyle.width} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${sizeStyle.height}`}>
        <div 
          className={`h-full ${overall > 0 ? 'bg-green-500' : 'bg-red-500'}`} 
          style={{ width: `${Math.abs(gaugePosition - 50) + 50}%`, marginLeft: overall > 0 ? '50%' : `${gaugePosition}%` }}
        />
      </div>
      
      {showConfidence && (
        <div className="flex justify-end mt-1">
          <span className="text-xs text-muted-foreground">
            Confidence: {formatConfidenceScore(confidence)}
          </span>
        </div>
      )}
    </div>
  );
};

export default SentimentGauge;
