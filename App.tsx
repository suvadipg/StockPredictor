
import React, { useState, useEffect, useCallback } from 'react';
import { Search, TrendingUp, TrendingDown, Info, ShieldAlert, Zap } from 'lucide-react';
import StockChart from './components/StockChart';
import AnalysisPanel from './components/AnalysisPanel';
import { generateHistoricalData, getQuickQuote } from './services/stockData';
import { analyzeStock } from './services/geminiService';
import { StockDataPoint, PredictionResult, StockQuote } from './types';

const POPULAR_SYMBOLS = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'BTC'];

const App: React.FC = () => {
  const [symbol, setSymbol] = useState('NVDA');
  const [inputValue, setInputValue] = useState('');
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [historicalData, setHistoricalData] = useState<StockDataPoint[]>([]);
  const [analysis, setAnalysis] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (stockSymbol: string) => {
    try {
      setLoading(true);
      setError(null);
      setAnalysis(null);

      // 1. Fetch Price Data
      const data = generateHistoricalData(stockSymbol);
      const currentQuote = getQuickQuote(stockSymbol);
      
      setHistoricalData(data);
      setQuote(currentQuote);

      // 2. Perform AI Analysis
      const result = await analyzeStock(stockSymbol, data);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(symbol);
  }, []); // Run once on mount

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newSymbol = inputValue.toUpperCase();
      setSymbol(newSymbol);
      fetchData(newSymbol);
      setInputValue('');
    }
  };

  const handleQuickSelect = (sym: string) => {
    setSymbol(sym);
    fetchData(sym);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <nav className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <TrendingUp className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">AlphaInsight</h1>
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Quantum AI Engine</span>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search ticker (e.g. AAPL, BTC, NVDA)..."
              className="w-full bg-gray-900/50 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
            />
          </div>
        </form>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex items-center space-x-1 text-[10px] text-gray-500 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-800">
            <Zap className="w-3 h-3 text-amber-500" />
            <span>MODEL: GEMINI 3 PRO</span>
          </div>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Market Banner */}
        <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
          {POPULAR_SYMBOLS.map(sym => (
            <button
              key={sym}
              onClick={() => handleQuickSelect(sym)}
              className={`flex-none px-4 py-2 rounded-xl border transition-all ${
                symbol === sym 
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' 
                : 'bg-gray-900/40 border-gray-800 text-gray-400 hover:border-gray-700'
              }`}
            >
              <span className="text-xs font-bold font-mono">{sym}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Main Chart Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-3xl p-8 border-gray-800/50 relative overflow-hidden">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-bold text-white font-mono mb-1">{symbol}</h2>
                  <p className="text-gray-500 text-sm font-medium">{quote?.name || 'Loading asset...'}</p>
                </div>
                {quote && (
                  <div className="text-right">
                    <div className="text-3xl font-bold font-mono tracking-tighter">${quote.price.toFixed(2)}</div>
                    <div className={`flex items-center justify-end text-sm font-bold ${quote.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {quote.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePercent}%)
                    </div>
                  </div>
                )}
              </div>

              <StockChart data={historicalData} />

              {/* Data Grid */}
              <div className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-800/50">
                {[
                  { label: 'Market Cap', val: '$2.84T' },
                  { label: 'P/E Ratio', val: '28.4' },
                  { label: 'Div Yield', val: '1.2%' },
                  { label: 'Volume', val: quote ? `${(Math.random() * 50).toFixed(1)}M` : '-' }
                ].map((item, idx) => (
                  <div key={idx}>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">{item.label}</p>
                    <p className="text-sm font-mono text-gray-300">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prediction/Analysis Section */}
            <div className="glass rounded-3xl p-8 border-gray-800/50">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white">AI Quantitative Analysis</h3>
                  <p className="text-gray-500 text-xs">Deep learning multi-modal prediction model</p>
                </div>
                <div className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-lg border border-blue-500/30">
                  REAL-TIME
                </div>
              </div>

              {error ? (
                <div className="p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start space-x-3">
                  <ShieldAlert className="text-rose-500 w-6 h-6 flex-shrink-0" />
                  <div>
                    <h4 className="text-rose-400 font-bold text-sm">Analysis Failed</h4>
                    <p className="text-rose-300/70 text-xs mt-1">{error}</p>
                  </div>
                </div>
              ) : (
                <AnalysisPanel result={analysis} loading={loading} />
              )}
            </div>
          </div>

          {/* Sidebar / Sentiment */}
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6 border-gray-800/50">
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest flex items-center">
                < Zap className="w-4 h-4 mr-2 text-amber-400" /> Recent Market Sentiment
              </h4>
              <div className="space-y-4">
                {[
                  { title: "Institutional Accumulation", value: 84, color: "bg-emerald-500" },
                  { title: "Retail Interest", value: 62, color: "bg-emerald-500" },
                  { title: "Macro Stability", value: 45, color: "bg-amber-500" },
                  { title: "Regulatory Risk", value: 12, color: "bg-rose-500" }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-gray-400">{item.title}</span>
                      <span className="text-gray-300 font-mono">{item.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color} transition-all duration-1000`} 
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-6 border-gray-800/50 bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
              <h4 className="text-sm font-bold text-white mb-4">Market Heatmap View</h4>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-lg ${i % 3 === 0 ? 'bg-emerald-500/40' : i % 2 === 0 ? 'bg-rose-500/40' : 'bg-gray-800'} border border-white/5 flex items-center justify-center text-[10px] font-bold`}
                  >
                    {['AAPL', 'MSFT', 'META', 'AMZN', 'GOOG', 'TSLA', 'AMD', 'INTC', 'NFLX'][i]}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-gray-500 mt-4 text-center">Relative performance across major indices</p>
            </div>

            <div className="p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center space-x-3 mb-3">
                <ShieldAlert className="text-emerald-500 w-5 h-5" />
                <h4 className="text-sm font-bold text-emerald-400">Trading Alert</h4>
              </div>
              <p className="text-xs text-emerald-300/80 leading-relaxed">
                Volitility expansion detected on lower timeframes. AI predicts a potential short-term breakout for {symbol} within the next 48 trading hours.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Search - Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 glass border-t border-white/10 z-50">
        <form onSubmit={handleSearch} className="flex gap-2">
           <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ticker symbol..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl py-2 px-4 text-sm focus:outline-none"
            />
            <button type="submit" className="bg-emerald-500 text-white p-2 rounded-xl">
              <Search className="w-5 h-5" />
            </button>
        </form>
      </div>
    </div>
  );
};

export default App;
