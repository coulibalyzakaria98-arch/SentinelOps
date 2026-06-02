import React from 'react';
import { Camera } from 'lucide-react';

const FloatingActionButton = ({ onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-50 group active:scale-95 transition-transform"
      aria-label={label}
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
        
        {/* Main button */}
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-full shadow-[0_15px_40px_rgba(31,119,210,0.4)] transition-all duration-300 border border-white/20">
          <div className="flex items-center gap-3 px-6 py-4">
            <Camera size={24} className="text-white animate-pulse" />
            <span className="text-sm font-black uppercase tracking-[0.15em] text-white hidden md:inline-block">
              {label || "Nouveau signalement"}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default FloatingActionButton;
