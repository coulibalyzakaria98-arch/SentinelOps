import React, { useState } from 'react';
import { FileDown, FileJson, FileSpreadsheet, ShieldCheck, Loader2 } from 'lucide-react';
import { exportService } from '../../services/exportService';
import { reportApi } from '../../services/api';

const ExportPanel = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const [stats, reports] = await Promise.all([
        reportApi.getStats(),
        reportApi.getAll()
      ]);
      exportService.generateUNSitrep(stats, reports);
    } catch (e) {
      console.error("🚨 SITREP Generation Failure:", e);
    } finally {
      setIsExporting(false);
    }
  };

  const formats = [
    { id: 'csv', label: 'Dataset CSV', icon: <FileSpreadsheet size={16} />, desc: 'Pour tableurs et SIG' },
    { id: 'json', label: 'Intelligence JSON', icon: <FileJson size={16} />, desc: 'Pour intégration API' },
    { id: 'pdf', label: 'Rapport PDF (ONU)', icon: <FileDown size={16} />, desc: 'Format institutionnel', primary: true }
  ];

  return (
    <div className="space-y-4">
      {formats.map((format) => (
        <button 
          key={format.id} 
          onClick={format.id === 'pdf' ? handleExportPDF : undefined}
          disabled={isExporting}
          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all group ${
            format.primary 
              ? 'bg-blue-600/10 border-blue-500/30 hover:bg-blue-600/20' 
              : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.06]'
          }`}
        >
           <div className="flex items-center gap-4 text-left">
              <div className={`p-2 rounded-lg bg-slate-900 group-hover:scale-110 transition-transform ${format.primary ? 'text-blue-400' : 'text-slate-400'}`}>
                 {isExporting && format.id === 'pdf' ? <Loader2 size={16} className="animate-spin" /> : format.icon}
              </div>
              <div>
                 <p className="text-xs font-black text-white uppercase tracking-tight">{format.label}</p>
                 <p className="text-[10px] text-slate-500 font-medium italic mt-0.5">{format.desc}</p>
              </div>
           </div>
           <div className={`transition-colors ${format.primary ? 'text-blue-500 group-hover:text-blue-400' : 'text-slate-700 group-hover:text-slate-500'}`}>
              <FileDown size={16} />
           </div>
        </button>
      ))}

      <div className="mt-6 p-4 rounded-xl bg-blue-600/5 border border-blue-500/10 flex items-center gap-3">
         <ShieldCheck size={20} className="text-blue-500" />
         <p className="text-[10px] text-slate-400 font-medium leading-relaxed uppercase tracking-tighter">
           Toutes les données sont hachées (SHA-256) pour garantir l'intégrité du rapport final.
         </p>
      </div>
    </div>
  );
};

export default ExportPanel;
