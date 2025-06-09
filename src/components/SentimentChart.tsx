import { useMemo } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  BarChart,
  Bar
} from "recharts";
import { SentimentData } from "@/lib/types/asset-types";

interface SentimentChartProps {
  data: SentimentData;
}

const SentimentChart = ({ data }: SentimentChartProps) => {
  const chartData = useMemo(() => {
    // Formatul data pentru chart-uri
    return data.historicalSentiment.map(item => ({
      date: item.date.split('T')[0].split('-').slice(1).join('/'), // Format as MM/DD
      score: item.score,
      volume: item.volume,
      
      sentiment: ((item.score + 1) / 2) * 100, 
    }));
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-medium">Sentiment Trend (30 Days)</h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38A169" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#38A169" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="negativeSentimentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E53E3E" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#E53E3E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis 
              dataKey="date" 
              tickLine={false}
              tick={{ fontSize: 12 }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              domain={[0, 100]} 
              tickCount={6} 
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number) => [`${Math.round(value)}%`, "Sentiment"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <ReferenceLine y={50} stroke="#718096" strokeDasharray="3 3" />
            <Area 
              type="monotone" 
              dataKey="sentiment" 
              stroke="#38A169" 
              fill="url(#sentimentGradient)" 
              activeDot={{ r: 8 }}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="h-40 w-full">
        <h4 className="text-sm font-medium mb-2 text-muted-foreground">News Volume</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
            <XAxis 
              dataKey="date" 
              tickLine={false}
              tick={{ fontSize: 10 }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} articles`, "Volume"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Bar dataKey="volume" fill="#60A5FA" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentChart;
