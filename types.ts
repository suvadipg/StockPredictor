
export interface StockDataPoint {
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

export interface PredictionResult {
  summary: string;
  prediction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number;
  targetPrice: number;
  timeframe: string;
  keyFactors: string[];
  sources: { title: string; url: string }[];
  technicalAnalysis: string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}
