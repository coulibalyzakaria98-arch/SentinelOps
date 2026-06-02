import React, { useState } from 'react';

const ExportButton = ({ onExport, isExporting, progress, variant = 'primary' }) => {
  const [showMenu, setShowMenu] = useState(false);

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500',
    secondary: 'bg-slate-700 hover:bg-slate-600',
    outline: 'border border-slate-600 hover:bg-slate-700'
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isExporting}
        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${variants[variant]} disabled:opacity-50`}
      >
        {isExporting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Export {progress}%</span>
          </>
        ) : (
          <>
            <span>📄</span>
            <span>Exporter</span>
            <span className="text-xs">▼</span>
          </>
        )}
      </button>

      {showMenu && !isExporting && (
        <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
          <div className="p-1">
            <button
              onClick={() => {
                onExport('dashboard');
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition flex items-center gap-2"
            >
              <span>📊</span> Dashboard complet
            </button>
            <button
              onClick={() => {
                onExport('map');
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition flex items-center gap-2"
            >
              <span>🗺️</span> Carte uniquement
            </button>
            <button
              onClick={() => {
                onExport('alerts');
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition flex items-center gap-2"
            >
              <span>🚨</span> Alertes critiques
            </button>
            <div className="border-t border-slate-700 my-1" />
            <button
              onClick={() => {
                onExport('analytics');
                setShowMenu(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition flex items-center gap-2"
            >
              <span>📈</span> Données analytiques
            </button>
          </div>
        </div>
      )}

      {/* Barre de progression */}
      {isExporting && progress > 0 && progress < 100 && (
        <div className="absolute -bottom-6 left-0 right-0 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default ExportButton;
