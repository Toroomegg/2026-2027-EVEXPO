import React, { useState } from 'react';
import { Exhibition } from '../types';
import { Trash2, Save, Plus } from 'lucide-react';

interface DataEditorProps {
  data: Exhibition[];
  onSave: (newData: Exhibition[]) => void;
  onClose: () => void;
}

export const DataEditor: React.FC<DataEditorProps> = ({ data, onSave, onClose }) => {
  const [localData, setLocalData] = useState<Exhibition[]>(data);

  const handleChange = (id: string, field: keyof Exhibition, value: any) => {
    setLocalData(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleScoreChange = (id: string, scoreField: 'inverter' | 'adas' | 'zonal', value: number) => {
    setLocalData(prev => prev.map(item => {
        if(item.id === id) {
            return {
                ...item,
                productScores: {
                    ...item.productScores,
                    [scoreField]: value
                }
            }
        }
        return item;
    }));
  };

  const handleAdd = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setLocalData(prev => [
      ...prev,
      {
        id: newId,
        name: 'New Exhibition',
        location: '',
        region: 'Other',
        date: '2027-01',
        year: 2027,
        totalCostTWD: 0,
        competitors: 0,
        recommendation: 3,
        status: 'Planned',
        notes: '',
        productScores: { inverter: 3, adas: 3, zonal: 3 },
        buyerType: 'General',
        mediaReach: 5,
        swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] }
      }
    ]);
  };

  const handleDelete = (id: string) => {
    setLocalData(prev => prev.filter(item => item.id !== id));
  };

  const handleSave = () => {
    onSave(localData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-7xl max-h-[90vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Edit Exhibition Data</h2>
          <div className="flex gap-4">
             <button onClick={onClose} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
             <button 
                onClick={handleSave} 
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors"
             >
                <Save size={18} /> Save Changes
             </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="space-y-4">
            {localData.map((item) => (
              <div key={item.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Row 1: Basic Info */}
                    <div className="md:col-span-3">
                        <label className="text-xs text-slate-500 mb-1 block">Event Name</label>
                        <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="md:col-span-2">
                         <label className="text-xs text-slate-500 mb-1 block">Buyer Type</label>
                         <input
                            type="text"
                            value={item.buyerType}
                            onChange={(e) => handleChange(item.id, 'buyerType', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-indigo-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs text-slate-500 mb-1 block">Date</label>
                        <input
                                type="month"
                                value={item.date}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    handleChange(item.id, 'date', val);
                                    handleChange(item.id, 'year', parseInt(val.split('-')[0]) || 2026);
                                }}
                                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-xs text-slate-500 mb-1 block">Cost (TWD)</label>
                        <input
                            type="number"
                            value={item.totalCostTWD}
                            onChange={(e) => handleChange(item.id, 'totalCostTWD', parseFloat(e.target.value) || 0)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                     <div className="md:col-span-2">
                        <label className="text-xs text-slate-500 mb-1 block">Status</label>
                        <select
                            value={item.status}
                            onChange={(e) => handleChange(item.id, 'status', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="Confirmed">Confirmed</option>
                            <option value="Planned">Planned</option>
                            <option value="Under Review">Under Review</option>
                             <option value="Dropped">Dropped</option>
                        </select>
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                         <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 p-2">
                            <Trash2 size={20} />
                        </button>
                    </div>

                    {/* Row 2: Scores & Media Reach */}
                    <div className="md:col-span-4 grid grid-cols-4 gap-2 bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
                         <div className="col-span-1">
                            <label className="text-xs text-emerald-400 mb-1 block text-center">Inv (P1)</label>
                            <input type="number" min="1" max="5" value={item.productScores.inverter} onChange={(e) => handleScoreChange(item.id, 'inverter', +e.target.value)} className="w-full bg-slate-800 border-none text-center text-white rounded"/>
                         </div>
                         <div className="col-span-1">
                            <label className="text-xs text-blue-400 mb-1 block text-center">ADAS</label>
                            <input type="number" min="1" max="5" value={item.productScores.adas} onChange={(e) => handleScoreChange(item.id, 'adas', +e.target.value)} className="w-full bg-slate-800 border-none text-center text-white rounded"/>
                         </div>
                         <div className="col-span-1">
                            <label className="text-xs text-purple-400 mb-1 block text-center">Zonal</label>
                            <input type="number" min="1" max="5" value={item.productScores.zonal} onChange={(e) => handleScoreChange(item.id, 'zonal', +e.target.value)} className="w-full bg-slate-800 border-none text-center text-white rounded"/>
                         </div>
                         <div className="col-span-1 border-l border-slate-700 pl-2">
                            <label className="text-xs text-amber-400 mb-1 block text-center">Media</label>
                            <input 
                                type="number" 
                                min="1" 
                                max="10" 
                                value={item.mediaReach} 
                                onChange={(e) => handleChange(item.id, 'mediaReach', +e.target.value)} 
                                className="w-full bg-slate-800 border-none text-center text-amber-200 font-bold rounded"
                            />
                         </div>
                    </div>
                    <div className="md:col-span-8">
                        <label className="text-xs text-slate-500 mb-1 block">Notes</label>
                        <input
                            type="text"
                            value={item.notes}
                            onChange={(e) => handleChange(item.id, 'notes', e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Strategy notes..."
                        />
                    </div>
                </div>
              </div>
            ))}
            
            <button 
                onClick={handleAdd}
                className="w-full py-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
                <Plus /> Add Exhibition
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};