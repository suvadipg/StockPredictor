
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';
import { StockDataPoint } from '../types';

interface StockChartProps {
  data: StockDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/90 border border-gray-700 p-3 rounded-lg shadow-xl backdrop-blur-md">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        <p className="text-emerald-400 font-mono font-bold text-lg">
          ${payload[0].value.toFixed(2)}
        </p>
        <p className="text-gray-500 text-[10px] mt-1">
          Vol: {(payload[0].payload.volume / 1000000).toFixed(2)}M
        </p>
      </div>
    );
  }
  return null;
};

const StockChart: React.FC<StockChartProps> = ({ data }) => {
  const minPrice = Math.min(...data.map(d => d.low)) * 0.98;
  const maxPrice = Math.max(...data.map(d => d.high)) * 1.02;

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280" 
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(str) => {
              const d = new Date(str);
              return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis 
            domain={[minPrice, maxPrice]} 
            stroke="#6b7280" 
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(val) => `$${val.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#10b981" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
