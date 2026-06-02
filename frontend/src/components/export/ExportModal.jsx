import React, { useState } from 'react';

const ExportModal = ({ isOpen, onClose, onExport, isExporting }) => {
  const [options, setOptions] = useState({
    format: 'pdf',
    orientation: 'landscape',
    includeTimestamp: true,
    includeFooter: true,
    quality: 'high'
  });

  const handleExport = () => {
    onExport(options);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-xl w-full max-w-md mx-4 overflow-hidden shadow-2xl border border-slate-700">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Exporter le rapport</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Options */}
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Format</label>
            <select
              value={options.format}
              onChange={(e) => setOptions({ ...options, format: e.target.value })}
              className="w-full bg-slate-700 rounded-lg p-2 text-white"
            >
              <option value="pdf">PDF (.pdf)</option>
              <option value="csv">CSV (.csv)</option>
              <option value="json">JSON (.json)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Orientation</label>
            <div className="flex gap-2">
              <button
                onClick={() => setOptions({ ...options, orientation: 'portrait' })}
                className={`flex-1 py-2 rounded-lg transition ${
                  options.orientation === 'portrait'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Portrait
              </button>
              <button
                onClick={() => setOptions({ ...options, orientation: 'landscape' })}
                className={`flex-1 py-2 rounded-lg transition ${
                  options.orientation === 'landscape'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Paysage
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Qualité</label>
            <select
              value={options.quality}
              onChange={(e) => setOptions({ ...options, quality: e.target.value })}
              className="w-full bg-slate-700 rounded-lg p-2 text-white"
            >
              <option value="draft">Brouillon (fichier léger)</option>
              <option value="standard">Standard</option>
              <option value="high">Haute qualité</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeTimestamp}
                onChange={(e) => setOptions({ ...options, includeTimestamp: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-300">Inclure l'horodatage</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={options.includeFooter}
                onChange={(e) => setOptions({ ...options, includeFooter: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-300">Inclure le pied de page</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-slate-700 rounded-lg text-slate-300 hover:bg-slate-600 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 py-2 bg-blue-600 rounded-lg text-white font-medium hover:bg-blue-500 transition disabled:opacity-50"
          >
            {isExporting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Export...
              </span>
            ) : (
              'Exporter'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
