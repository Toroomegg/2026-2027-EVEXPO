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
  Label,
  ReferenceLine
} from 'recharts';
import { Exhibition } from '../../types';

interface Props {
  data: Exhibition[];
}

export const ImpactAnalysisChart: React.FC<Props> = ({ data }) => {
  // Defensive check: Ensure data exists
  if (!data || data.length === 0) return <div>No Data Available</div>;

  // Scatter Data: Media Reach vs Competitors
  const scatterData = data.map(item => ({
    name: item.name,
    x: item.competitors || 0,
    y: item.mediaReach || 0,
    z: item.recommendation || 3
  }));

  // Heatmap Data: Products
  const sortedByExposure = [...data].sort((a, b) => (b.mediaReach || 0) - (a.mediaReach || 0));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* LEFT: Brand Battlefield (Scatter) */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex flex-col relative">
        <h3 className="text-xl font-bold text-amber-400 mb-2">
          Brand Battlefield
        </h3>
        <p className="text-xs text-slate-400 mb-4">Competitor Density vs. Brand Exposure (Media Reach)</p>
        
        <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Competitors" 
                    stroke="#94a3b8" 
                    domain={[4, 12]}
                >
                    <Label value="Competitor Density" offset={0} position="bottom" fill="#94a3b8" />
                </XAxis>
                <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Media Reach" 
                    stroke="#94a3b8"
                    domain={[0, 11]}
                >
                    <Label value="Media / Brand Exposure (1-10)" angle={-90} position="left" fill="#94a3b8" />
                </YAxis>
                <ZAxis type="number" dataKey="z" range={[80, 400]} />
                
                <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                            <div className="bg-slate-900 border border-slate-600 p-3 rounded shadow-xl">
                                <p className="font-bold text-white">{d.name}</p>
                                <p className="text-sm text-amber-400">Media Reach: {d.y}</p>
                                <p className="text-sm text-slate-300">Competitors: {d.x}</p>
                            </div>
                        );
                        }
                        return null;
                    }}
                />
                
                {/* Quadrant Lines */}
                <ReferenceLine y={7.5} stroke="#64748b" strokeDasharray="3 3" />
                <ReferenceLine x={8} stroke="#64748b" strokeDasharray="3 3" />

                {/* Labels */}
                <ReferenceLine x={10} y={10.5} stroke="none">
                    <Label value="BRAND WAR (High Noise)" position="center" fill="#f43f5e" fontSize={12} fontWeight="bold" />
                </ReferenceLine>
                <ReferenceLine x={5} y={10.5} stroke="none">
                    <Label value="Blue Ocean Branding" position="center" fill="#3b82f6" fontSize={12} fontWeight="bold" />
                </ReferenceLine>
                 <ReferenceLine x={10} y={1} stroke="none">
                    <Label value="Sourcing Hub (B2B Pure)" position="center" fill="#10b981" fontSize={12} fontWeight="bold" />
                </ReferenceLine>

                <Scatter name="Exhibitions" data={scatterData} fill="#f59e0b">
                    {scatterData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.y > 8 ? '#f43f5e' : entry.x > 9 ? '#f59e0b' : '#3b82f6'} />
                    ))}
                </Scatter>
            </ScatterChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* RIGHT: Product Suitability Heatmap */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 flex flex-col overflow-hidden">
        <h3 className="text-xl font-bold text-blue-400 mb-2">
          Product Exposure Heatmap
        </h3>
        <p className="text-xs text-slate-400 mb-4">Suitability Score (1-5) by Product Line</p>

        <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-sm text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-700 text-slate-400">
                        <th className="py-2 pl-2">Event</th>
                        <th className="py-2 text-center text-emerald-400">Inverter</th>
                        <th className="py-2 text-center text-indigo-400">ADAS</th>
                        <th className="py-2 text-center text-purple-400">Zonal</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedByExposure.map(item => {
                        const scores = item.productScores || { inverter: 0, adas: 0, zonal: 0 };
                        return (
                        <tr key={item.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                            <td className="py-3 pl-2 font-medium text-slate-200">
                                {item.name}
                                <span className="block text-[10px] text-slate-500">{item.mediaReach || 0}/10 Reach</span>
                            </td>
                            {/* Inverter Cell */}
                            <td className="p-1">
                                <div 
                                    className={`h-8 w-full rounded flex items-center justify-center font-bold text-xs
                                    ${scores.inverter === 5 ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 
                                      scores.inverter === 4 ? 'bg-emerald-500/60 text-emerald-50' :
                                      scores.inverter === 3 ? 'bg-emerald-500/30 text-emerald-200' :
                                      'bg-slate-800 text-slate-600'}`}
                                >
                                    {scores.inverter}
                                </div>
                            </td>
                            {/* ADAS Cell */}
                             <td className="p-1">
                                <div 
                                    className={`h-8 w-full rounded flex items-center justify-center font-bold text-xs
                                    ${scores.adas === 5 ? 'bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 
                                      scores.adas === 4 ? 'bg-indigo-500/60 text-indigo-50' :
                                      scores.adas === 3 ? 'bg-indigo-500/30 text-indigo-200' :
                                      'bg-slate-800 text-slate-600'}`}
                                >
                                    {scores.adas}
                                </div>
                            </td>
                            {/* Zonal Cell */}
                             <td className="p-1">
                                <div 
                                    className={`h-8 w-full rounded flex items-center justify-center font-bold text-xs
                                    ${scores.zonal === 5 ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 
                                      scores.zonal === 4 ? 'bg-purple-500/60 text-purple-50' :
                                      scores.zonal === 3 ? 'bg-purple-500/30 text-purple-200' :
                                      'bg-slate-800 text-slate-600'}`}
                                >
                                    {scores.zonal}
                                </div>
                            </td>
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};