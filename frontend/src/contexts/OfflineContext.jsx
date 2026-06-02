import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { saveReportOffline, getPendingCount, getQueue, getStorageUsage } from '../services/offlineStorage'; // Corrected path
import { syncManager } from '../services/syncManager'; // Corrected path

const OfflineContext = createContext(null);

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [queue, setQueue] = useState([]);
  const [storageUsage, setStorageUsage] = useState({ reports: 0, images: 0, queue: 0 });
  const [lastSync, setLastSync] = useState(null);
  
  const [currentConflict, setCurrentConflict] = useState(null);
  
  const refreshStats = useCallback(async () => {
    try {
      const count = await getPendingCount();
      const queueData = await getQueue();
      const usage = await getStorageUsage();
      
      setPendingCount(count);
      setQueue(queueData);
      setStorageUsage(usage);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  }, []);

  const resolveConflict = useCallback(async (resolution) => {
    console.log(`[OfflineContext] Resolving conflict with: ${resolution}`);
    // Logic to update storage and notify syncManager would go here
    setCurrentConflict(null);
    await refreshStats();
  }, [refreshStats]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleOnline = () => {
      setIsOnline(true);
      syncManager.checkAndSync();
    };
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  useEffect(() => {
    const handleSyncEvent = ({ event, data }) => {
      switch (event) {
        case 'SYNC_START':
          setIsSyncing(true);
          break;
        case 'SYNC_COMPLETE':
          setIsSyncing(false);
          setLastSync(new Date());
          refreshStats();
          break;
        case 'SYNC_ERROR':
          setIsSyncing(false);
          break;
        case 'SYNC_CONFLICT':
          setCurrentConflict(data);
          break;
        case 'REPORT_SYNCED':
          refreshStats();
          break;
        default:
          break;
      }
    };
    
    syncManager.onSync(handleSyncEvent);
    refreshStats();
    
    const interval = setInterval(refreshStats, 30000);
    
    return () => clearInterval(interval);
  }, [refreshStats]);
  
  const forceSync = () => {
    if (isOnline && !isSyncing) {
      syncManager.syncAll();
    }
  };
  
  const saveOffline = async (report, image) => {
    const result = await saveReportOffline(report, image);
    await refreshStats();
    return result;
  };
  
  return (
    <OfflineContext.Provider value={{
      isOnline,
      isSyncing,
      pendingCount,
      queue,
      storageUsage,
      lastSync,
      currentConflict,
      forceSync,
      saveOffline,
      refreshStats,
      resolveConflict,
      setConflict: setCurrentConflict
    }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
};
