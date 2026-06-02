import React from 'react';
import { useOffline } from '../../contexts/OfflineContext';

const SyncIndicator = () => {
  const { isOnline, isSyncing, pendingCount, lastSync } = useOffline();
  
  if (!isOnline && pendingCount === 0) {
    return (
      <div className="flex items-center gap-2 text-slate-400">
        <div className="w-2 h-2 bg-slate-500 rounded-full" />
        <span className="text-xs">Hors ligne</span>
      </div>
    );
  }
  
  if (isSyncing) {
    return (
      <div className="flex items-center gap-2 text-blue-400">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
        <span className="text-xs">Synchronisation...</span>
      </div>
    );
  }
  
  if (pendingCount > 0) {
    return (
      <div className="flex items-center gap-2 text-yellow-400">
        <div className="w-2 h-2 bg-yellow-400 rounded-full" />
        <span className="text-xs">{pendingCount} en attente</span>
      </div>
    );
  }
  
  if (lastSync) {
    return (
      <div className="flex items-center gap-2 text-green-400">
        <div className="w-2 h-2 bg-green-400 rounded-full" />
        <span className="text-xs">Synchro {lastSync.toLocaleTimeString()}</span>
      </div>
    );
  }
  
  return null;
};

export default SyncIndicator;
