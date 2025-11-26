import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell
} from 'recharts';
import { Exhibition } from '../../types';

interface CostChartProps {
  data: Exhibition[];
}

export const CostChart: React.FC<CostChartProps> = ({ data }) => {
  // Sort data by competitors for the first chart
  const competitorsData = [...data].sort((a, b) => b.competitors - a.competitors);

  // Prepare Scatter data (Cost vs Competitors)
  const scatterData = data.map(item => ({
    name: item.name,
    x: item.competitors,
    y: item.totalCostTWD,
    z: item.recommendation
  }));

  const formatCurrency = (value: number) => 
    `${(value / 10000).toFixed(0)}萬`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
      {/* Chart 1: The Battlefield (Competitor Density) */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col">
        <h3 className="text-xl font-semibold mb-4 text-slate-100 flex items-center justify-between">
            <span>⚔️ Competitive Density</span>
            <span className="text-sm font-normal text-slate-400">Rivals count per event</span>
        </h3>
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={competitorsData} margin={{ left: 40, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" stroke="#cbd5e1" domain={[0, 12]} />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#cbd5e1" 
                width={120} 
                tick={{fontSize: 12}}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f8fafc' }}
                cursor={{fill: '#334155', opacity: 0.4}}
              />
              <Bar dataKey="competitors" name="Competitors" fill="#f59e0b" radius={[0, 4, 4, 0]}>
                {competitorsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.competitors >= 8 ? '#ef4444' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Strategic Matrix (Cost vs Impact) */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col">
        <h3 className="text-xl font-semibold mb-4 text-slate-100 flex items-center justify-between">
            <span>💰 Cost vs. Competition</span>
            <span className="text-sm font-normal text-slate-400">Bubble size = Rating</span>
        </h3>
        <div className="flex-1 min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid stroke="#334155" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Competitors" 
                stroke="#cbd5e1" 
                label={{ value: 'Competitors', position: 'bottom', offset: 0, fill: '#94a3b8' }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Cost" 
                unit=" TWD" 
                stroke="#cbd5e1" 
                tickFormatter={formatCurrency}
              />
              <ZAxis type="number" dataKey="z" range={[100, 500]} name="Rating" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }} 
                content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                        <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl">
                        <p className="font-bold text-white mb-1">{data.name}</p>
                        <p className="text-sm text-slate-300">Cost: NT${data.y.toLocaleString()}</p>
                        <p className="text-sm text-slate-300">Rivals: {data.x}</p>
                        <p className="text-sm text-yellow-400">Rating: {data.z} Stars</p>
                        </div>
                    );
                    }
                    return null;
                }}
              />
              <Scatter name="Exhibitions" data={scatterData} fill="#3b82f6">
                {scatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.y > 1000000 ? '#f43f5e' : entry.x > 8 ? '#10b981' : '#3b82f6'} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};