import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Exhibition } from '../../types';
import { MapPin, TrendingUp, Users, Globe } from 'lucide-react';

interface RegionalChartProps {
  data: Exhibition[];
}

export const RegionalChart: React.FC<RegionalChartProps> = ({ data }) => {
  const regions = ['Europe', 'North America', 'Asia', 'Other'];
  // Colors: Indigo (EU), Blue (NA), Emerald (Asia), Gray (Other)
  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#94a3b8']; 

  const regionData = regions.map(r => {
    const items = data.filter(d => d.region === r);
    return {
      name: r,
      value: items.reduce((acc, c) => acc + c.totalCostTWD, 0),
      count: items.length,
      competitors: items.reduce((acc, c) => acc + c.competitors, 0),
      events: items
    };
  }).filter(d => d.count > 0);

  const totalBudget = data.reduce((acc, c) => acc + c.totalCostTWD, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Chart Section */}
      <div className="lg:col-span-5 bg-slate-800 rounded-xl p-6 border border-slate-700 flex flex-col relative">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
           <div className="p-1.5 bg-indigo-500/20 rounded text-indigo-400"><TrendingUp size={16}/></div>
           Budget Share by Region
        </h3>
        <div className="flex-1 min-h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `NT$ ${(value/10000).toFixed(0)}萬 (${((value/totalBudget)*100).toFixed(1)}%)`}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px' }}
                itemStyle={{ color: '#f1f5f9' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle"/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Central Stat */}
        <div className="absolute inset-0 top-10 flex items-center justify-center pointer-events-none">
            <div className="text-center">
                <div className="text-3xl font-bold text-white">{data.length}</div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Events</div>
            </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="lg:col-span-7 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
        {regionData.map((region, idx) => (
          <div key={region.name} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 hover:bg-slate-800 hover:border-slate-600 transition-all group">
            <div className="flex justify-between items-start mb-3">
               <div className="flex items-center gap-3">
                   <div className="w-1.5 h-12 rounded-full" style={{backgroundColor: COLORS[idx]}}></div>
                   <div>
                       <h4 className="font-bold text-lg text-white leading-tight flex items-center gap-2">
                         {region.name}
                         {region.name === 'Europe' && <Globe size={14} className="text-indigo-400"/>}
                       </h4>
                       <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin size={10} /> {region.count} Major Events
                       </span>
                   </div>
               </div>
               <div className="text-right">
                   <div className="text-xl font-mono font-bold text-slate-200">
                       {(region.value/10000).toFixed(0)}<span className="text-sm text-slate-500">萬</span>
                   </div>
                   <div className="text-xs text-slate-500">{(region.value/totalBudget*100).toFixed(0)}% of Total</div>
               </div>
            </div>
            
            <div className="flex gap-4 mb-3">
                 <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/50 px-2.5 py-1.5 rounded-lg border border-slate-700/50">
                    <Users size={12} className="text-amber-400"/>
                    <span className="text-slate-200 font-bold">{region.competitors}</span> Total Rivals
                 </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/50 px-2.5 py-1.5 rounded-lg border border-slate-700/50">
                    <TrendingUp size={12} className="text-emerald-400"/>
                    <span className="text-slate-200 font-bold">{(region.value / region.count / 10000).toFixed(0)}萬</span> Avg. Cost/Event
                 </div>
            </div>

            <div className="mt-2 pt-3 border-t border-slate-700/50">
               <div className="flex flex-wrap gap-2">
                 {region.events.sort((a,b) => b.recommendation - a.recommendation).map(e => (
                   <span 
                        key={e.id} 
                        className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-default select-none
                        ${e.recommendation >= 5 
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-medium' 
                            : 'bg-slate-700/30 border-slate-600 text-slate-400'}`}
                   >
                     {e.name}
                     {e.recommendation >= 5 && <span className="ml-1 text-emerald-400">★</span>}
                   </span>
                 ))}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};