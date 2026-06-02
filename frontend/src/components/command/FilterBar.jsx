import React from 'react';
import { Filter, Search, Grid, List as ListIcon } from 'lucide-react';

const FilterBar = ({ filters, onChange }) => {
  const crisisTypes = [
    { id: 'all', label: 'Tout' },
    { id: 'fire', label: 'Incendies' },
    { id: 'flood', label: 'Inondations' },
    { id: 'infra', label: 'Infrastructures' }
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
           <Filter size={16} />
        </div>
        <div className="flex bg-slate-800 p-1 rounded-xl border border-white/5">
           {crisisTypes.map((type) => (
             <button
               key={type.id}
               onClick={() => onChange({ ...filters, type: type.id })}
               className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                 (filters.type || 'all') === type.id 
                   ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                   : 'text-slate-500 hover:text-slate-300'
               }`}
             >
               {type.label}
             </button>
           ))}
        </div>
      </div>

      <div className="flex items-center gap-4 flex-1 max-w-md">
         <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              placeholder="RECHERCHER UN SECTEUR OU UNE ALERTE..."
              className="w-full bg-slate-800/50 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/30 outline-none transition-all"
            />
         </div>
         
         <div className="flex bg-slate-800 p-1 rounded-xl border border-white/5">
            <button className="p-1.5 rounded-lg bg-slate-700 text-white"><Grid size={14} /></button>
            <button className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"><ListIcon size={14} /></button>
         </div>
      </div>
    </div>
  );
};

export default FilterBar;
