import React, { useState, useEffect } from 'react';
import { SlideDeck } from './components/SlideDeck';
import { DataEditor } from './components/DataEditor';
import { INITIAL_EXHIBITIONS, Exhibition } from './types';
import { Settings, Edit3 } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<Exhibition[]>(INITIAL_EXHIBITIONS);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Data Migration / Integrity Check
  useEffect(() => {
    const isValid = data.every(item => 
      item.productScores && 
      typeof item.productScores.inverter === 'number' &&
      typeof item.mediaReach === 'number'
    );

    if (!isValid) {
      console.warn("Detected outdated data structure. Resetting to initial state.");
      setData(INITIAL_EXHIBITIONS);
    }
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col relative">
      {/* Top Utility Bar (Hidden in Print Mode) */}
      <div className="absolute top-4 right-4 z-40 print-hide flex gap-2">
        <button 
          onClick={() => setIsEditorOpen(true)}
          className="bg-slate-800/80 backdrop-blur text-white px-4 py-2 rounded-full border border-slate-600 hover:bg-slate-700 transition-all flex items-center gap-2 shadow-lg text-sm"
        >
          <Edit3 size={14} /> Edit Data
        </button>
      </div>

      <SlideDeck data={data} />

      {isEditorOpen && (
        <DataEditor 
          data={data}
          onSave={(newData) => setData(newData)}
          onClose={() => setIsEditorOpen(false)}
        />
      )}
    </div>
  );
};

export default App;