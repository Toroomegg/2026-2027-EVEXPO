import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
  Label
} from 'recharts';
import { Exhibition } from '../../types';

interface Props {
  data: Exhibition[];
}

export const CompetitorGapChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return <div>No Data</div>;

  // 1. Visibility Index Data (Media Reach per Competitor)
  // Higher is better: High Media Reach / Low Competitors = High Visibility Chance
  const visibilityData = data.map(item => ({
    name: item.name,
    // Formula: (Media Score * 10) / Competitors. 
    // Example: Media 8 / 4 Comps = 20 (Great). Media 8 / 12 Comps = 6.6 (Bad).
    index: ((item.mediaReach || 1) * 1.5) / (Math.max(item.competitors, 1) * 0.2), 
    rawMedia: item.mediaReach,
    rawComp: item.competitors
  })).sort((a, b) => b.index - a.index);

  // 2. Attack (Inverter) vs Defend (ADAS) Matrix
  const strategyData = data.map(item => ({
    name: item.name,
    x: item.competitors, // Market Saturation
    y: item.productScores?.inverter || 0, // Growth Target (Attack)
    z: item.productScores?.adas || 0, // Current Strength (Defend/Leverage)
    cost: item.totalCostTWD
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      
      {/* LEFT: Visibility Index (Where can we be seen?) */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 flex flex-col">
        <h3 className="text-xl font-bold text-sky-400 mb-1">
          📢 Visibility Opportunity Index
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Where can our NEW Inverter product stand out? (High Media / Low Rivals)
        </p>
        
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={visibilityData.slice(0, 8)} // Top 8 opportunities
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#94a3b8" 
                width={140} 
                tick={{fontSize: 11}}
              />
              <Tooltip
                cursor={{fill: '#334155', opacity: 0.2}}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-600 p-3 rounded shadow-xl">
                        <p className="font-bold text-white">{d.name}</p>
                        <p className="text-sm text-sky-400 font-bold">Visibility Score: {d.index.toFixed(1)}</p>
                        <div className="mt-1 pt-1 border-t border-slate-700 text-xs text-slate-400">
                           <div>Media Reach: {d.rawMedia}/10</div>
                           <div>Competitors: {d.rawComp}</div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="index" name="Visibility Score" radius={[0, 4, 4, 0]} barSize={20}>
                {visibilityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index < 3 ? '#38bdf8' : '#475569'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 bg-sky-500/10 border border-sky-500/20 p-2 rounded text-xs text-sky-200">
           💡 <strong>Top Ranked:</strong> Best chance for Inverter brand building. Less noise, high attention.
        </div>
      </div>

      {/* RIGHT: Attack vs Defend Matrix */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 flex flex-col relative">
        <h3 className="text-xl font-bold text-rose-400 mb-1">
          ⚔️ Attack vs. Leverage Matrix
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Using ADAS Strength (Color) to Sell Inverter (Y-Axis)
        </p>

        <div className="flex-1">
           <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Competitors" 
                stroke="#94a3b8"
                domain={[3, 13]} 
              >
                <Label value="Competitor Density (Difficulty)" offset={-10} position="bottom" fill="#64748b" fontSize={11}/>
              </XAxis>
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Inverter Score" 
                stroke="#94a3b8"
                domain={[1, 5.5]}
              >
                 <Label value="Inverter Potential (Attack Target)" angle={-90} position="left" fill="#64748b" fontSize={11}/>
              </YAxis>
              <ZAxis type="number" dataKey="z" range={[50, 400]} name="ADAS Strength" />
              
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-slate-600 p-3 rounded shadow-xl">
                        <p className="font-bold text-white mb-1">{d.name}</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                            <span className="text-emerald-400">Target (Inverter): {d.y}/5</span>
                            <span className="text-rose-400">Leverage (ADAS): {d.z}/5</span>
                            <span className="text-slate-400 col-span-2 mt-1">Competitors: {d.x}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Quadrant Lines */}
              <ReferenceLine y={3.5} stroke="#64748b" strokeDasharray="3 3" />
              <ReferenceLine x={8} stroke="#64748b" strokeDasharray="3 3" />

              {/* Labels */}
              <ReferenceLine x={5.5} y={5.2} stroke="none">
                 <Label value="BLUE OCEAN BREAKOUT" position="center" fill="#38bdf8" fontSize={11} fontWeight="bold"/>
              </ReferenceLine>
               <ReferenceLine x={11} y={5.2} stroke="none">
                 <Label value="CROSS-SELL WARZONE" position="center" fill="#fb7185" fontSize={11} fontWeight="bold"/>
              </ReferenceLine>

              <Scatter name="Events" data={strategyData}>
                {strategyData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.z >= 4 ? '#fb7185' : '#94a3b8'} // Red/Pink if ADAS is strong (Leverage), Grey if weak
                    fillOpacity={0.8}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
           <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-rose-400 block"></span>
               <span className="text-slate-300">Strong ADAS Leverage (High Chance to Cross-sell)</span>
           </div>
           <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-slate-400 block"></span>
               <span className="text-slate-500">Low Leverage</span>
           </div>
        </div>
      </div>
    </div>
  );
};