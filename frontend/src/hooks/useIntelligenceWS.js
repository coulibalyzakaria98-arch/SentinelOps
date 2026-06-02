import { useEffect, useRef } from 'react';

export function useIntelligenceWS(onMessage) {
  const ws = useRef(null);

  useEffect(() => {
    // 🛠️ [Prototype Mode] Real-time WebSocket disabled
    console.log('📡 Tactical Link: Simulated (Prototype Mode Active)');
    
    // Optional: Simulate a periodic update
    const interval = setInterval(() => {
      if (onMessage) {
        onMessage({
          type: 'INTEL_UPDATE',
          data: { message: "Analyse spectrale en cours...", confidence: 0.98 }
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [onMessage]);

  return null;
}
