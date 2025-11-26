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

export const TechBuyerChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) return <div>No Data</div>;

  // Heuristic Mapping for Buyer Quality to Number for Charting
  const getBuyerScore = (type: string) => {
    if (!type) return 4;
    if (type.includes('OEM') && (type.includes('Global') || type.includes('Sourcing'))) return 9;
    if (type.includes('Tier 1')) return 7.5;
    if (type.includes('Engineer')) return 6;
    if (type.includes('Commercial') || type.includes('Logistics')) return 5;
    return 4;
  };

  // 1. Calculate Base Coordinates & Grouping
  // We identify items that share roughly the same X/Y to resolve collisions
  const baseItems = data.map(item => {
    const adas = item.productScores?.adas || 0;
    const zonal = item.productScores?.zonal || 0;
    return {
      ...item,
      baseX: getBuyerScore(item.buyerType),
      baseY: (adas + zonal) / 2
    };
  });

  const groupedItems: Record<string, typeof baseItems> = {};
  
  baseItems.forEach(item => {
    const key = `${item.baseX}-${item.baseY}`;
    if (!groupedItems[key]) groupedItems[key] = [];
    groupedItems[key].push(item);
  });

  // 2. Resolve Collisions (Spread out items with same coordinates)
  const scatterData: any[] = [];
  const spreadFactor = 0.5; // How far apart to spread items at same coord

  Object.values(groupedItems).forEach(group => {
    const count = group.length;
    group.forEach((item, index) => {
        // If there are multiple items at this spot, spread them around the baseX
        // e.g. 2 items: -0.25, +0.25
        // e.g. 3 items: -0.5, 0, +0.5
        let offset = 0;
        if (count > 1) {
            offset = (index - (count - 1) / 2) * spreadFactor;
        }

        scatterData.push({
            name: item.name,
            buyerType: item.buyerType,
            x: item.baseX + offset,
            y: item.baseY,
            z: (item.competitors || 1) * 10
        });
    });
  });

  return (
    <div className="h-full w-full bg-slate-800/50 rounded-xl p-4 border border-slate-700 relative">
      <h3 className="text-xl font-bold text-indigo-400 mb-2 absolute top-4 left-6 z-10">
        Future Tech (ADAS/Zonal) vs. Buyer Power
      </h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 50, right: 30, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          
          <XAxis 
            type="number" 
            dataKey="x" 
            name="Buyer Quality" 
            stroke="#94a3b8" 
            domain={[3, 10.5]}
            tick={false}
          >
            <Label value="Buyer Influence (Engineers → Global Executives)" offset={0} position="bottom" fill="#94a3b8" />
          </XAxis>
          
          <YAxis 
            type="number" 
            dataKey="y" 
            name="Tech Fit" 
            stroke="#94a3b8"
            domain={[1, 6]}
            ticks={[1, 2, 3, 4, 5]}
          >
             <Label value="ADAS/Zonal Tech Fit (Avg Score)" angle={-90} position="left" fill="#94a3b8" />
          </YAxis>
          
          <ZAxis type="number" dataKey="z" range={[100, 600]} name="Competitors" />
          
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload;
                return (
                  <div className="bg-slate-900 border border-slate-600 p-3 rounded shadow-xl">
                    <p className="font-bold text-white">{d.name}</p>
                    <p className="text-sm text-indigo-300">Target: {d.buyerType}</p>
                    <p className="text-sm text-slate-300">Tech Fit Score: {d.y}</p>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* Strategic Zones */}
          <ReferenceLine y={4} stroke="#64748b" strokeDasharray="3 3" />
          <ReferenceLine x={7} stroke="#64748b" strokeDasharray="3 3" />
          
          {/* Moved label up slightly to Y=5.8 */}
          <ReferenceLine y={5.8} x={8.5} stroke="none">
             <Label value="High Tech / High Influence" position="center" fill="#818cf8" fontWeight="bold" fontSize={14} />
          </ReferenceLine>
          
          <ReferenceLine y={5.8} x={4.5} stroke="none">
             <Label value="Tech Showcase (Niche)" position="center" fill="#94a3b8" fontSize={12} />
          </ReferenceLine>

          <Scatter name="Exhibitions" data={scatterData} fill="#818cf8">
            {scatterData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.y > 4 && entry.x > 8 ? '#818cf8' : entry.y < 3 ? '#94a3b8' : '#6366f1'} 
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};