import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  Label
} from 'recharts';
import { Exhibition } from '../../types';

interface Props {
  data: Exhibition[];
}

export const ProductStrategyChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return <div>No Data</div>;

  // Filter relevant fields
  const scatterData = data.map(item => ({
    name: item.name,
    x: item.totalCostTWD,
    y: item.productScores?.inverter || 0,
    z: 100 // Constant size for visibility
  }));

  const formatCurrency = (value: number) => 
    `${(value / 10000).toFixed(0)}萬`;

  return (
    <div className="h-full w-full bg-slate-800/50 rounded-xl p-4 border border-slate-700 relative">
      <h3 className="text-xl font-bold text-emerald-400 mb-2 absolute top-4 left-6 z-10">
        Inverter (P1) Value Matrix
      </h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 50, right: 30, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Cost" 
            unit=" TWD" 
            stroke="#94a3b8" 
            tickFormatter={formatCurrency}
            domain={[400000, 1500000]}
          >
            <Label value="Estimated Cost (TWD)" offset={0} position="bottom" fill="#94a3b8" />
          </XAxis>
          
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Inverter Score" 
            stroke="#94a3b8"
            domain={[1, 6]} // Extended domain to make room for labels at top
            ticks={[1, 2, 3, 4, 5]}
          >
             <Label value="Inverter Strategic Fit (1-5)" angle={-90} position="left" fill="#94a3b8" />
          </YAxis>
          
          <ZAxis type="number" dataKey="z" range={[100, 100]} />
          
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload;
                return (
                  <div className="bg-slate-900 border border-slate-600 p-3 rounded shadow-xl">
                    <p className="font-bold text-white">{d.name}</p>
                    <p className="text-sm text-emerald-400">Inverter Score: {d.y}/5</p>
                    <p className="text-sm text-slate-300">Cost: NT${(d.x/10000).toFixed(0)}萬</p>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* Quadrant Lines */}
          <ReferenceLine y={3.5} stroke="#64748b" strokeDasharray="3 3" />
          <ReferenceLine x={900000} stroke="#64748b" strokeDasharray="3 3" />

          {/* Quadrant Labels - Positioned at the very top (Y=6) to avoid overlap */}
          <ReferenceLine y={6} x={650000} stroke="none">
            <Label value="TARGET ZONE (High Value)" position="insideTop" fill="#10b981" fontSize={14} fontWeight="bold" />
          </ReferenceLine>
          
          <ReferenceLine y={6} x={1200000} stroke="none">
            <Label value="Strategic Investment (High Cost)" position="insideTop" fill="#f59e0b" fontSize={12} fontWeight="bold" />
          </ReferenceLine>

          {/* Low Value Label */}
          <ReferenceLine y={1.5} x={1200000} stroke="none">
             <Label value="Avoid (Low Value/High Cost)" position="center" fill="#ef4444" fontSize={12} />
          </ReferenceLine>

          <Scatter name="Exhibitions" data={scatterData} fill="#3b82f6">
            {scatterData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.y >= 4 && entry.x < 850000 ? '#10b981' : entry.x > 1000000 ? '#ef4444' : '#60a5fa'} 
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};