import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const EmergencyButton = ({ onTrigger }) => {
  const [isExpanding, setIsExpanding] = useState(false);

  const handlePress = () => {
    setIsExpanding(true);

    // Haptic feedback for mobile devices (Vibration API)
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]); 
    }

    // Delay to allow the animation to feel "physical" before switching view
    setTimeout(() => {
      setIsExpanding(false);
      onTrigger();
    }, 800);
  };

  return (
    <div className="relative flex items-center justify-center">
      
      {/* Tactical Expansion Rings */}
      {isExpanding && (
        <>
          <div className="absolute w-32 h-32 rounded-full bg-red-600/40 animate-ping" />
          <div className="absolute w-48 h-48 rounded-full bg-red-600/10 animate-pulse" />
        </>
      )}

      {/* Main Tactical Button */}
      <button
        onClick={handlePress}
        className={`
          relative z-10 w-24 h-24 rounded-full
          bg-red-600 text-white shadow-[0_0_40px_rgba(230,57,70,0.4)]
          flex flex-col items-center justify-center
          border-8 border-slate-900
          transition-all duration-300 ease-out
          active:scale-90
          ${isExpanding ? 'scale-125 bg-red-500' : 'scale-100 hover:scale-105 panic-glow'}
        `}
      >
        <AlertTriangle size={38} strokeWidth={2.5} />
        <span className="text-[10px] font-black uppercase mt-1 italic tracking-tighter">Report</span>
      </button>
    </div>
  );
};

export default EmergencyButton;
