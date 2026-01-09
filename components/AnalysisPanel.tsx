
import React from 'react';
import { PredictionResult } from '../types';

interface AnalysisPanelProps {
  result: PredictionResult | null;
  loading: boolean;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center space-y-4 animate-pulse">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 font-medium">AlphaInsight AI is analyzing market signals...</p>
        <p className="text-gray-600 text-sm">Reasoning through historical data & global news...</p>
      </div>
    );
  }

  if (!result) return null;

  const sentimentColor = result.prediction === 'BULLISH' ? 'text-emerald-400' : result.prediction === 'BEARISH' ? 'text-rose-400' : 'text-amber-400';
  const sentimentBg = result.prediction === 'BULLISH' ? 'bg-emerald-400/10' : result.prediction === 'BEARISH' ? 'bg-rose-400/10' : 'bg-amber-400/10';

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`${sentimentBg} ${sentimentColor} px-4 py-1.5 rounded-full text-xs font-bold tracking-wider border border-current`}>
            {result.prediction} OUTLOOK
          </div>
          <div className="text-xs text-gray-500">
            Confidence: <span className="text-gray-300 font-mono">{result.confidence}%</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Target Price (30d)</p>
          <p className="text-2xl font-bold font-mono text-emerald-400">${result.targetPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="glass p-5 rounded-2xl border-gray-800/50">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
            <span className="mr-2 text-emerald-500">◆</span> Executive Summary
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed italic">
            "{result.summary}"
          </p>
        </section>

        <section className="glass p-5 rounded-2xl border-gray-800/50">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
            <span className="mr-2 text-emerald-500">◆</span> Key Catalysts
          </h3>
          <ul className="space-y-2">
            {result.keyFactors.map((factor, i) => (
              <li key={i} className="text-sm text-gray-400 flex items-start">
                <span className="text-emerald-500 mr-2">•</span> {factor}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="glass p-5 rounded-2xl border-gray-800/50">
        <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
          <span className="mr-2 text-emerald-500">◆</span> Technical Breakdown
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed font-mono bg-gray-950/50 p-3 rounded-lg border border-gray-800">
          {result.technicalAnalysis}
        </p>
      </section>

      {result.sources.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Verification Sources</h3>
          <div className="flex flex-wrap gap-2">
            {result.sources.map((source, i) => (
              <a 
                key={i} 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded transition-colors"
              >
                {source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title}
              </a>
            ))}
          </div>
        </section>
      )}

      <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
        <p className="text-[10px] text-gray-600 uppercase tracking-tighter">
          Powered by Gemini 3 Pro • Real-time Search Grounding Enabled
        </p>
        <p className="text-[10px] text-rose-500/50 italic">
          Disclaimer: AI analysis is experimental. Not financial advice.
        </p>
      </div>
    </div>
  );
};

export default AnalysisPanel;
