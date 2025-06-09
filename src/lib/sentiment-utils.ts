
import { SentimentScore } from './types/asset-types';
import { format, formatDistanceToNow } from 'date-fns';

// Converts numerical sentiment score (-1 to 1) to a readable label
export const getSentimentLabel = (score: number): 'Positive' | 'Neutral' | 'Negative' => {
  if (score > 0.2) return 'Positive';
  if (score < -0.2) return 'Negative';
  return 'Neutral';
};

// Returns the CSS class based on the sentiment score
export const getSentimentClass = (score: number): string => {
  if (score > 0.2) return 'sentiment-positive';
  if (score < -0.2) return 'sentiment-negative';
  return 'sentiment-neutral';
};

// Format sentiment score as a percentage
export const formatSentimentScore = (score: number): string => {
  // Convert -1 to 1 scale to 0 to 100
  const percentage = Math.round(((score + 1) / 2) * 100);
  return `${percentage}%`;
};

// Format confidence score as a percentage
export const formatConfidenceScore = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`;
};

// Get the sentiment emoji
export const getSentimentEmoji = (score: number): string => {
  if (score > 0.6) return '🔥'; // Very positive
  if (score > 0.2) return '📈'; // Positive
  if (score < -0.6) return '📉'; // Very negative
  if (score < -0.2) return '⚠️'; // Negative
  return '〰️'; // Neutral
};

// Format date from ISO string
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
};

// Format time from ISO string
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'h:mm a');
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

// Format price change with + or - sign
export const formatPriceChange = (change: number): string => {
  return change >= 0 ? `+${change.toFixed(2)}` : `${change.toFixed(2)}`;
};

// Format price change percent with + or - sign
export const formatPriceChangePercent = (changePercent: number): string => {
  return changePercent >= 0 ? `+${changePercent.toFixed(2)}%` : `${changePercent.toFixed(2)}%`;
};

// Get CSS class for price change
export const getPriceChangeClass = (change: number): string => {
  return change >= 0 ? 'sentiment-positive' : 'sentiment-negative';
};
