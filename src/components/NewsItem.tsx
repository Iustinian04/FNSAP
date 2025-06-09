
import { NewsArticle } from "@/lib/types/asset-types";
import { formatDate, formatTime, formatRelativeTime, getSentimentClass, getSentimentEmoji } from "@/lib/sentiment-utils";
import { ExternalLink, BarChart2 } from "lucide-react";

interface NewsItemProps {
  article: NewsArticle;
}

const NewsItem = ({ article }: NewsItemProps) => {
  const { title, source, url, publishedAt, sentiment, summary } = article;
  const sentimentClass = getSentimentClass(sentiment.overall);
  const sentimentEmoji = getSentimentEmoji(sentiment.overall);
  
  // Alpha Vantage
  const parseAlphaVantageDate = (dateString: string) => {
    if (dateString.includes('T') && dateString.length === 15) {
      // Format: YYYYMMDDTHHMMSS
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const hour = dateString.substring(9, 11);
      const minute = dateString.substring(11, 13);
      const second = dateString.substring(13, 15);
      
      return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
    }
    return new Date(dateString);
  };

  const parsedDate = parseAlphaVantageDate(publishedAt);
  
  // Extrage simbolul din titlu
  const extractSymbol = (title: string) => {
    const symbolMatch = title.match(/\b([A-Z]{1,5})\b/);
    return symbolMatch ? symbolMatch[1] : undefined;
  };
  
  const symbol = extractSymbol(title);
  
  const getFinancialUrl = (symbol: string | undefined) => {
    if (!symbol) return "#";
    return `https://finance.yahoo.com/quote/${symbol}/holders`;
  };

  return (
    <div className="border rounded-lg p-3 hover:shadow-md transition-shadow news-item">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-sm leading-tight">{title}</h3>
        <span className="text-lg ml-2 flex-shrink-0" aria-hidden="true">
          {sentimentEmoji}
        </span>
      </div>
      
      {summary && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {summary}
        </p>
      )}
      
      <div className="flex justify-between items-center text-xs">
        <div>
          <span className="font-medium">{source}</span>
          <span className="text-muted-foreground ml-2">
            {formatDate(parsedDate.toISOString())} • {formatTime(parsedDate.toISOString())}
          </span>
          <span className="text-muted-foreground ml-2">
            ({formatRelativeTime(parsedDate.toISOString())})
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={sentimentClass}>
            Sentiment: {Math.round(((sentiment.overall + 1) / 2) * 100)}%
          </span>
          
          {symbol && (
            <a 
              href={getFinancialUrl(symbol)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80"
              title="View financial data"
            >
              <BarChart2 size={14} />
            </a>
          )}
          
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80"
            title="Read full article"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t text-xs">
        <span className="text-muted-foreground">
          Relevance: {Math.round(sentiment.confidence * 100)}%
        </span>
      </div>
    </div>
  );
};

export default NewsItem;
