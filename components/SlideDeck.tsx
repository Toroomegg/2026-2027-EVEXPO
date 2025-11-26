import React, { useState, useMemo, useEffect } from 'react';
import { Exhibition, SummaryType } from '../types';
import { generateExecutiveSummary } from '../services/geminiService';
import { CostChart } from './charts/CostChart';
import { RegionalChart } from './charts/RegionalChart';
import { ProductStrategyChart } from './charts/ProductStrategyChart';
import { TechBuyerChart } from './charts/TechBuyerChart';
import { ImpactAnalysisChart } from './charts/ImpactAnalysisChart';
import { CompetitorGapChart } from './charts/CompetitorGapChart';
import { 
  ChevronLeft, 
  ChevronRight, 
  BrainCircuit,
  Loader2,
  Target,
  TrendingUp,
  Map,
  ShieldAlert,
  Star,
  CheckCircle2,
  DollarSign,
  Zap,
  Cpu,
  ArrowUpDown,
  Filter,
  BarChart2,
  Crosshair
} from 'lucide-react';

interface SlideDeckProps {
  data: Exhibition[];
}

export const SlideDeck: React.FC<SlideDeckProps> = ({ data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [summary, setSummary] = useState<SummaryType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // State for SWOT Slide
  const [swotId, setSwotId] = useState<string>(data[0]?.id || '');

  // State for Budget Table
  const [sortConfig, setSortConfig] = useState<{ key: keyof Exhibition | 'cost' | 'scores', direction: 'asc' | 'desc' } | null>(null);
  const [selectedBudgetIds, setSelectedBudgetIds] = useState<Set<string>>(new Set(data.map(d => d.id)));

  // Sorting Logic (Moved to Top Level to fix Hook Error #310)
  const sortedData = useMemo(() => {
      let sortableItems = [...data];
      if (sortConfig !== null) {
          sortableItems.sort((a, b) => {
              let aValue: any = a[sortConfig.key as keyof Exhibition];
              let bValue: any = b[sortConfig.key as keyof Exhibition];
              
              if (sortConfig.key === 'scores') {
                  aValue = a.productScores?.inverter || 0;
                  bValue = b.productScores?.inverter || 0;
              }

              if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
              if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
              return 0;
          });
      }
      return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key: keyof Exhibition | 'cost' | 'scores') => {
      let direction: 'asc' | 'desc' = 'asc';
      if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
          direction = 'desc';
      }
      setSortConfig({ key, direction });
  };

  const toggleSelection = (id: string) => {
      const newSet = new Set(selectedBudgetIds);
      if(newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setSelectedBudgetIds(newSet);
  }

  const selectedTotal = data
      .filter(d => selectedBudgetIds.has(d.id))
      .reduce((acc, c) => acc + c.totalCostTWD, 0);

  const totalBudgetTWD = data.reduce((acc, curr) => acc + curr.totalCostTWD, 0);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    const result = await generateExecutiveSummary(data);
    setSummary(result);
    setIsGenerating(false);
  };

  const slides = [
    // Slide 1: Cover
    {
      title: "Title",
      render: () => (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-900">
          <div className="p-6 bg-blue-600 rounded-full bg-opacity-20 mb-6 border border-blue-500/30 shadow-[0_0_50px_rgba(37,99,235,0.3)]">
             <Target size={80} className="text-blue-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            2026/2027 車用展會<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">戰略評估</span>
          </h1>
          <h2 className="text-2xl md:text-3xl text-slate-400 font-light tracking-widest uppercase">
            精準打擊 & 預算效益分析
          </h2>
          <div className="mt-12 p-8 border-t border-slate-700/50 w-full max-w-2xl">
            <div className="flex justify-between items-center text-left">
                <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider">Total Est. Budget</p>
                    <p className="text-4xl font-mono font-bold text-white mt-1">
                    NT$ {(totalBudgetTWD / 1000000).toFixed(2)}M
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-slate-500 uppercase tracking-wider">Events Targeted</p>
                    <p className="text-4xl font-mono font-bold text-blue-400 mt-1">
                    {data.length}
                    </p>
                </div>
            </div>
          </div>
        </div>
      )
    },
    // Slide 2: Situation Analysis (Charts)
    {
      title: "Competitive Landscape",
      render: () => (
        <div className="h-full flex flex-col">
          <div className="mb-6 border-l-4 border-amber-500 pl-6">
            <h2 className="text-3xl font-bold text-white">現況分析：主戰場分佈</h2>
            <p className="text-slate-400 mt-2">競爭對手密集度 (>8家) 與 成本效益矩陣</p>
          </div>
          <div className="flex-1">
            <CostChart data={data} />
          </div>
        </div>
      )
    },
    // Slide 3: Regional Analysis
    {
      title: "Regional Strategy",
      render: () => (
        <div className="h-full flex flex-col">
          <div className="mb-6 border-l-4 border-indigo-500 pl-6">
            <h2 className="text-3xl font-bold text-white">區域戰略佈局 (Regional Strategy)</h2>
            <p className="text-slate-400 mt-2">三大區域預算配置與競爭態勢</p>
          </div>
          <div className="flex-1 overflow-hidden">
            <RegionalChart data={data} />
          </div>
        </div>
      )
    },
    // Slide 4: Inverter Strategy
    {
        title: "Inverter Strategy",
        render: () => (
            <div className="h-full flex flex-col">
                 <div className="mb-6 border-l-4 border-emerald-500 pl-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                           <Zap className="text-emerald-400" fill="currentColor"/>
                           Inverter 市場：最高效益點與戰略成本
                        </h2>
                        <p className="text-slate-400 mt-2">Priority 1 產品線：尋找高 Inverter 需求且成本合理的甜蜜點</p>
                    </div>
                </div>
                <div className="flex-1 grid grid-cols-12 gap-8">
                     <div className="col-span-8 h-full">
                         <ProductStrategyChart data={data} />
                     </div>
                     <div className="col-span-4 flex flex-col justify-center space-y-6">
                        <div className="bg-slate-800/80 p-6 rounded-xl border-l-4 border-emerald-500">
                             <h3 className="text-lg font-bold text-white mb-2">🏆 High Value Targets</h3>
                             <p className="text-slate-300 text-sm leading-relaxed mb-3">
                                <span className="text-white font-bold">IZB</span> 與 <span className="text-white font-bold">EV Tech Expo EU</span> 位於最佳效益區 (Score {'>'} 4, Cost {'<'} 80萬)。
                             </p>
                             <div className="text-emerald-400 text-sm font-bold">建議：投入主力業務團隊。</div>
                        </div>

                         <div className="bg-slate-800/80 p-6 rounded-xl border-l-4 border-yellow-500">
                             <h3 className="text-lg font-bold text-white mb-2">⭐ Premium Investment</h3>
                             <p className="text-slate-300 text-sm leading-relaxed mb-3">
                                <span className="text-white font-bold">Battery Show NA</span> 成本較高 (123萬)，但在 Inverter 領域具備統治級影響力 (Score 5)。
                             </p>
                             <div className="text-yellow-400 text-sm font-bold">建議：以技術展示為主，證明高單價合理性。</div>
                        </div>
                     </div>
                </div>
            </div>
        )
    },
    // Slide 5: Tech Layout
    {
        title: "Future Tech Layout",
        render: () => (
            <div className="h-full flex flex-col">
                 <div className="mb-6 border-l-4 border-indigo-500 pl-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                           <Cpu className="text-indigo-400"/>
                           ADAS/Zonal 戰場：未來佈局與決策者觸及
                        </h2>
                        <p className="text-slate-400 mt-2">Priority 2/3：鎖定高層決策者與架構工程師</p>
                    </div>
                </div>
                 <div className="flex-1 grid grid-cols-12 gap-8">
                     <div className="col-span-8 h-full">
                         <TechBuyerChart data={data} />
                     </div>
                     <div className="col-span-4 flex flex-col justify-center space-y-6">
                        <div className="bg-slate-800/80 p-6 rounded-xl border-l-4 border-indigo-500">
                             <h3 className="text-lg font-bold text-white mb-2">🚀 Executive Reach (C-Level)</h3>
                             <p className="text-slate-300 text-sm leading-relaxed mb-3">
                                <span className="text-white font-bold">CES</span> 與 <span className="text-white font-bold">IAA Mobility</span> 雖然成本高，但能接觸到定義未來 5 年架構的 Global OEM 高層。
                             </p>
                             <div className="text-indigo-400 text-sm font-bold">定位：品牌技術力展示 (Branding)。</div>
                        </div>

                         <div className="bg-slate-800/80 p-6 rounded-xl border-l-4 border-blue-500">
                             <h3 className="text-lg font-bold text-white mb-2">🛠️ Engineering Influence</h3>
                             <p className="text-slate-300 text-sm leading-relaxed mb-3">
                                <span className="text-white font-bold">IZB</span> 與 <span className="text-white font-bold">Auto Shanghai</span> 聚集了大量實際執行採購與驗證的工程師。
                             </p>
                             <div className="text-blue-400 text-sm font-bold">定位：規格鎖定與訂單轉化 (Conversion)。</div>
                        </div>
                     </div>
                </div>
            </div>
        )
    },
    // Slide 6: Market Impact & Exposure
    {
        title: "Market Impact",
        render: () => (
            <div className="h-full flex flex-col">
                <div className="mb-6 border-l-4 border-fuchsia-500 pl-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                           <BarChart2 className="text-fuchsia-400"/>
                           市場影響力與曝光度分析
                        </h2>
                        <p className="text-slate-400 mt-2">品牌聲量 (Brand Awareness) vs. 產品適合度 (Product Fit)</p>
                    </div>
                </div>
                <div className="flex-1">
                    <ImpactAnalysisChart data={data} />
                </div>
            </div>
        )
    },
    // Slide 7: Competitor Intelligence (NEW)
    {
        title: "Competitor Intelligence",
        render: () => (
            <div className="h-full flex flex-col">
                <div className="mb-6 border-l-4 border-sky-500 pl-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                           <Crosshair className="text-sky-400"/>
                           競爭情報與成長缺口 (Growth Gaps)
                        </h2>
                        <p className="text-slate-400 mt-2">利用 <span className="text-rose-400 font-bold">ADAS 既有優勢</span> 滲透 Inverter 市場的戰略路徑</p>
                    </div>
                </div>
                <div className="flex-1">
                    <CompetitorGapChart data={data} />
                </div>
            </div>
        )
    },
    // Slide 8: Deep Dive SWOT
    {
        title: "Deep Dive",
        render: () => {
             const selectedSwot = data.find(d => d.id === swotId) || data[0];
             
             return (
             <div className="h-full flex flex-col">
                <div className="mb-6 border-l-4 border-blue-500 pl-6 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold text-white">重點展會 SWOT 全解析</h2>
                        <p className="text-slate-400 mt-2">針對每一場展會的戰略優劣勢分析</p>
                    </div>
                    
                    {/* Event Selector */}
                    <div className="flex items-center gap-3">
                        <label className="text-slate-400 text-sm">Select Event:</label>
                        <select 
                            value={swotId}
                            onChange={(e) => setSwotId(e.target.value)}
                            className="bg-slate-800 text-white border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none min-w-[200px]"
                        >
                            {data.map(d => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex-1 flex gap-8">
                     {/* Left: Summary Card */}
                     <div className="w-1/3 bg-slate-800 rounded-2xl p-8 border border-slate-700 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <Target size={200} />
                        </div>
                        
                        <h3 className="text-3xl font-bold text-white mb-2">{selectedSwot.name}</h3>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="bg-blue-900/50 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-800">{selectedSwot.location}</span>
                            <span className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm">Competitors: {selectedSwot.competitors}</span>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs text-slate-500 uppercase tracking-wider font-bold">Target Buyer</label>
                                <p className="text-xl text-indigo-400 font-medium">{selectedSwot.buyerType}</p>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2">
                                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                                    <div className="text-xs text-slate-500 mb-1">Inverter</div>
                                    <div className="text-emerald-400 font-bold text-xl">{selectedSwot.productScores?.inverter || '-'}</div>
                                </div>
                                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                                    <div className="text-xs text-slate-500 mb-1">ADAS</div>
                                    <div className="text-blue-400 font-bold text-xl">{selectedSwot.productScores?.adas || '-'}</div>
                                </div>
                                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                                    <div className="text-xs text-slate-500 mb-1">Zonal</div>
                                    <div className="text-purple-400 font-bold text-xl">{selectedSwot.productScores?.zonal || '-'}</div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-slate-500 uppercase tracking-wider font-bold">Est. Cost</label>
                                <p className="text-2xl text-white font-mono">NT$ {(selectedSwot.totalCostTWD/10000).toFixed(0)}萬</p>
                            </div>
                        </div>
                     </div>

                     {/* Right: SWOT Grid */}
                     <div className="w-2/3 grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-5 rounded-xl border-t-4 border-emerald-500 hover:bg-slate-800 transition-colors">
                            <h4 className="font-bold text-emerald-400 mb-3 flex items-center gap-2">STRENGTH (優勢)</h4>
                            <ul className="list-disc pl-4 space-y-2 text-slate-300 text-sm">
                                {selectedSwot.swot?.strengths.map((s, i) => <li key={i}>{s}</li>) || <li>No data available</li>}
                            </ul>
                        </div>
                        <div className="bg-slate-800/50 p-5 rounded-xl border-t-4 border-red-500 hover:bg-slate-800 transition-colors">
                            <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">WEAKNESS (劣勢)</h4>
                             <ul className="list-disc pl-4 space-y-2 text-slate-300 text-sm">
                                {selectedSwot.swot?.weaknesses.map((s, i) => <li key={i}>{s}</li>) || <li>No data available</li>}
                            </ul>
                        </div>
                        <div className="bg-slate-800/50 p-5 rounded-xl border-t-4 border-blue-500 hover:bg-slate-800 transition-colors">
                            <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">OPPORTUNITY (機會)</h4>
                             <ul className="list-disc pl-4 space-y-2 text-slate-300 text-sm">
                                {selectedSwot.swot?.opportunities.map((s, i) => <li key={i}>{s}</li>) || <li>No data available</li>}
                            </ul>
                        </div>
                        <div className="bg-slate-800/50 p-5 rounded-xl border-t-4 border-amber-500 hover:bg-slate-800 transition-colors">
                            <h4 className="font-bold text-amber-400 mb-3 flex items-center gap-2">THREAT (威脅)</h4>
                             <ul className="list-disc pl-4 space-y-2 text-slate-300 text-sm">
                                {selectedSwot.swot?.threats.map((s, i) => <li key={i}>{s}</li>) || <li>No data available</li>}
                            </ul>
                        </div>
                     </div>
                </div>
             </div>
        )}
    },
    // Slide 9: Strategy Recommendation
    {
        title: "Strategy",
        render: () => {
            const mustGo = data.filter(d => d.recommendation === 5);
            const niceToHave = data.filter(d => d.recommendation === 3 || d.recommendation === 4);
            
            return (
                <div className="h-full flex flex-col">
                    <div className="mb-6 border-l-4 border-purple-500 pl-6">
                        <h2 className="text-3xl font-bold text-white">策略建議</h2>
                        <p className="text-slate-400 mt-2">資源分配優先級矩陣</p>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="bg-gradient-to-br from-emerald-900/40 to-slate-800 rounded-xl p-6 border border-emerald-500/30">
                             <div className="flex items-center gap-3 mb-6">
                                 <div className="p-3 bg-emerald-500 rounded-lg text-white font-bold shadow-lg">Must Go</div>
                                 <h3 className="text-xl font-semibold text-emerald-100">核心戰略必選</h3>
                             </div>
                             <ul className="space-y-4">
                                 {mustGo.map(item => (
                                     <li key={item.id} className="bg-slate-900/60 p-4 rounded-lg flex justify-between items-center">
                                         <div>
                                            <div className="font-bold text-white text-lg">{item.name}</div>
                                            <div className="text-slate-400 text-sm">{item.location}</div>
                                         </div>
                                         <div className="text-emerald-400 font-mono font-bold">
                                             {(item.totalCostTWD/10000).toFixed(0)}萬
                                         </div>
                                     </li>
                                 ))}
                             </ul>
                             <div className="mt-6 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-emerald-200 text-sm">
                                 💡 這些展會直接對應 Inverter 高需求與高競爭力的戰場。
                             </div>
                         </div>

                         <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700">
                             <div className="flex items-center gap-3 mb-6">
                                 <div className="p-3 bg-blue-600 rounded-lg text-white font-bold shadow-lg">Nice to Have</div>
                                 <h3 className="text-xl font-semibold text-blue-100">戰術性補充 / 觀察</h3>
                             </div>
                             <div className="overflow-auto max-h-[400px] pr-2 custom-scrollbar">
                                <ul className="space-y-3">
                                    {niceToHave.slice(0, 5).map(item => (
                                        <li key={item.id} className="bg-slate-800 p-3 rounded-lg flex justify-between items-center border border-slate-700">
                                            <div>
                                                <div className="font-medium text-slate-200">{item.name}</div>
                                                <div className="text-slate-500 text-xs flex gap-2">
                                                    <span>{item.recommendation}★</span>
                                                    <span>{item.competitors} Rivals</span>
                                                </div>
                                            </div>
                                            <div className="text-slate-400 font-mono text-sm">
                                                {(item.totalCostTWD/10000).toFixed(0)}萬
                                            </div>
                                        </li>
                                    ))}
                                    {niceToHave.length > 5 && (
                                        <li className="text-center text-slate-500 text-sm pt-2">
                                            + {niceToHave.length - 5} more events...
                                        </li>
                                    )}
                                </ul>
                             </div>
                             <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-200 text-sm">
                                 💡 根據 ADAS/Zonal 的研發進度與 Q3 營收動態調整。
                             </div>
                         </div>
                    </div>
                </div>
            );
        }
    },
    // Slide 10: Executive Summary (AI)
    {
      title: "Executive Summary",
      render: () => (
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-white border-l-4 border-blue-500 pl-4">Executive Summary (AI)</h2>
            <button 
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 rounded-lg transition-colors font-medium text-white shadow-lg shadow-blue-500/20"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : <BrainCircuit />}
              {summary ? "Regenerate Analysis" : "Generate Strategic Insights"}
            </button>
          </div>
          
          <div className="flex-1 bg-slate-800/50 rounded-2xl p-8 border border-slate-700 relative overflow-hidden backdrop-blur-sm">
            {!summary && !isGenerating && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                <BrainCircuit size={64} className="mb-4 text-slate-700" />
                <p className="text-lg">AI Ready to Analyze Competition & Budget</p>
                <p className="text-sm opacity-60">Click top right button</p>
              </div>
            )}
            
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center text-blue-400 bg-slate-900/50 z-10">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 size={48} className="animate-spin" />
                  <p className="animate-pulse text-lg">Analyzing Competitor Density...</p>
                </div>
              </div>
            )}

            {summary && !isGenerating && (
              <div className="space-y-8 animate-fade-in h-full flex flex-col">
                <div>
                  <h3 className="text-lg text-blue-400 font-bold mb-2 uppercase tracking-wide flex items-center gap-2">
                    <Map size={18}/> Global Overview
                  </h3>
                  <p className="text-xl text-slate-200 leading-relaxed font-light">{summary.overview}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                  <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                     <h3 className="text-lg text-emerald-400 font-bold mb-4 flex items-center gap-2">
                       <Target size={18}/> Strategic Recommendations
                     </h3>
                     <ul className="space-y-4">
                       {summary.strategicRecommendations.map((rec, i) => (
                         <li key={i} className="flex gap-3 text-slate-300">
                           <span className="text-emerald-500 font-bold mt-1">✓</span>
                           <span className="leading-snug">{rec}</span>
                         </li>
                       ))}
                     </ul>
                  </div>
                  
                  <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                     <h3 className="text-lg text-amber-400 font-bold mb-4 flex items-center gap-2">
                        <ShieldAlert size={18}/> Risk Assessment
                     </h3>
                     <p className="text-slate-300 leading-relaxed border-l-2 border-amber-500/30 pl-4">
                        {summary.budgetRisk}
                     </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    },
    // Slide 11: Budget Table
    {
      title: "Budget Table",
      render: () => {
        return (
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-6 border-l-4 border-blue-500 pl-4">
              <div>
                  <h2 className="text-3xl font-bold text-white">年度預算總表 (Budget Overview)</h2>
                  <p className="text-slate-400 text-sm mt-1">Select events to simulate total budget scenarios</p>
              </div>
              <div className="flex items-center gap-4 bg-slate-800 p-3 rounded-lg border border-slate-700">
                  <span className="text-slate-400 text-sm">Selected Scenario:</span>
                  <span className={`text-2xl font-mono font-bold ${selectedTotal > 6000000 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      NT$ {(selectedTotal/1000000).toFixed(2)}M
                  </span>
                  <span className="text-slate-500 text-xs">/ {(totalBudgetTWD/1000000).toFixed(2)}M Total</span>
              </div>
          </div>

          <div className="flex-1 overflow-auto bg-slate-800 rounded-xl border border-slate-700 custom-scrollbar relative">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-950 sticky top-0 z-10 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-10 text-center">
                    <input 
                        type="checkbox" 
                        checked={selectedBudgetIds.size === data.length}
                        onChange={() => {
                            if(selectedBudgetIds.size === data.length) setSelectedBudgetIds(new Set());
                            else setSelectedBudgetIds(new Set(data.map(d => d.id)));
                        }}
                        className="rounded border-slate-600 bg-slate-800"
                    />
                  </th>
                  <th onClick={() => requestSort('name')} className="p-4 font-semibold text-slate-400 border-b border-slate-700 cursor-pointer hover:text-white">Event <ArrowUpDown size={12} className="inline ml-1"/></th>
                  <th onClick={() => requestSort('buyerType')} className="p-4 font-semibold text-slate-400 border-b border-slate-700 cursor-pointer hover:text-white">Target Buyer <ArrowUpDown size={12} className="inline ml-1"/></th>
                  <th onClick={() => requestSort('competitors')} className="p-4 font-semibold text-slate-400 border-b border-slate-700 text-center cursor-pointer hover:text-white">Rivals</th>
                  <th onClick={() => requestSort('scores')} className="p-4 font-semibold text-slate-400 border-b border-slate-700 text-center cursor-pointer hover:text-white">Scores (I/A/Z)</th>
                  <th onClick={() => requestSort('totalCostTWD')} className="p-4 font-semibold text-slate-400 border-b border-slate-700 text-right cursor-pointer hover:text-white">Cost (TWD) <ArrowUpDown size={12} className="inline ml-1"/></th>
                  <th onClick={() => requestSort('recommendation')} className="p-4 font-semibold text-slate-400 border-b border-slate-700 text-center cursor-pointer hover:text-white">Rec.</th>
                  <th onClick={() => requestSort('status')} className="p-4 font-semibold text-slate-400 border-b border-slate-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 text-sm">
                {sortedData.map((item) => (
                  <tr key={item.id} className={`hover:bg-slate-700/50 transition-colors ${selectedBudgetIds.has(item.id) ? 'bg-blue-900/10' : 'opacity-60'}`}>
                    <td className="p-4 text-center">
                        <input 
                            type="checkbox" 
                            checked={selectedBudgetIds.has(item.id)}
                            onChange={() => toggleSelection(item.id)}
                            className="rounded border-slate-600 bg-slate-800"
                        />
                    </td>
                    <td className="p-4 font-bold text-white">
                        {item.name}
                        <div className="text-xs text-slate-500 font-normal">{item.location} | {item.date}</div>
                    </td>
                    <td className="p-4 text-indigo-300">{item.buyerType}</td>
                    <td className="p-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded ${item.competitors >= 8 ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-slate-400'}`}>
                            {item.competitors}
                        </span>
                    </td>
                    <td className="p-4 text-center font-mono text-xs">
                        <span className="text-emerald-400 font-bold" title="Inverter">{item.productScores?.inverter || '-'}</span>
                        <span className="text-slate-600 mx-1">/</span>
                        <span className="text-blue-400" title="ADAS">{item.productScores?.adas || '-'}</span>
                        <span className="text-slate-600 mx-1">/</span>
                        <span className="text-purple-400" title="Zonal">{item.productScores?.zonal || '-'}</span>
                    </td>
                    <td className="p-4 text-right text-slate-200 font-mono">
                      ${item.totalCostTWD.toLocaleString()}
                    </td>
                    <td className="p-4 text-center">
                       <div className="flex justify-center text-yellow-500">
                           {[...Array(item.recommendation)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                       </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${item.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 
                          item.status === 'Planned' ? 'bg-blue-500/20 text-blue-400' : 
                          'bg-amber-500/20 text-amber-400'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
      }
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-full w-full bg-slate-950 text-white flex flex-col p-4 md:p-6 relative overflow-hidden">
        {/* Background Ambient */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 rounded-full blur-[100px]" />
        </div>

       {/* Header / Controls */}
       <div className="relative z-10 flex justify-between items-center mb-4 shrink-0">
          <div className="flex items-center gap-4">
             <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                StrategyDeck
             </div>
             <div className="h-6 w-px bg-slate-700" />
             <div className="text-sm text-slate-400 font-mono">
                {slides[currentSlide].title}
             </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-sm text-slate-500 font-mono mr-4">
                 {currentSlide + 1} <span className="text-slate-700">/</span> {slides.length}
             </div>
             <div className="flex gap-2">
                <button 
                    onClick={prevSlide}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700 hover:border-slate-600 group"
                >
                    <ChevronLeft className="text-slate-400 group-hover:text-white" size={20} />
                </button>
                <button 
                    onClick={nextSlide}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700 hover:border-slate-600 group"
                >
                    <ChevronRight className="text-slate-400 group-hover:text-white" size={20} />
                </button>
             </div>
          </div>
       </div>

       {/* Main Content Area */}
       <div className="relative z-10 flex-1 overflow-hidden bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800/50 shadow-2xl">
          <div className="absolute inset-0 p-6 md:p-8 overflow-auto custom-scrollbar">
             {slides[currentSlide].render()}
          </div>
       </div>

       {/* Progress Dots */}
       <div className="relative z-10 flex justify-center gap-2 mt-4 shrink-0">
          {slides.map((_, idx) => (
             <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-blue-500 w-8' : 'bg-slate-800 w-2 hover:bg-slate-700'}`}
             />
          ))}
       </div>
    </div>
  );
};