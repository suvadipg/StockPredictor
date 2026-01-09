
import { StockDataPoint, StockQuote } from '../types';

export const generateHistoricalData = (symbol: string, days: number = 30): StockDataPoint[] => {
  const data: StockDataPoint[] = [];
  let currentPrice = symbol === 'AAPL' ? 190 : symbol === 'TSLA' ? 170 : 150;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    const volatility = currentPrice * 0.02;
    const change = (Math.random() - 0.48) * volatility; // Slightly bullish bias
    const open = currentPrice;
    const high = open + Math.random() * volatility;
    const low = open - Math.random() * volatility;
    currentPrice = open + change;

    data.push({
      date: date.toISOString().split('T')[0],
      price: Number(currentPrice.toFixed(2)),
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      volume: Math.floor(Math.random() * 10000000) + 1000000
    });
  }
  return data;
};

export const getQuickQuote = (symbol: string): StockQuote => {
  const price = Math.random() * 200 + 50;
  const change = (Math.random() - 0.5) * 10;
  return {
    symbol: symbol.toUpperCase(),
    name: `${symbol.toUpperCase()} Inc.`,
    price: Number(price.toFixed(2)),
    change: Number(change.toFixed(2)),
    changePercent: Number(((change / price) * 100).toFixed(2)),
    lastUpdated: new Date().toLocaleTimeString()
  };
};
