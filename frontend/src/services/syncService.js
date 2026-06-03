import { syncManager } from './syncManager';

export const syncService = {
  isSyncing: false,
  statusListeners: [],

  subscribe(callback) {
    return syncManager.onSync(callback);
  },

  async syncPendingReports() {
    return await syncManager.syncAll();
  },

  startAutoSyncListener() {
    console.log('[SyncService] Auto-sync listener started');
    syncManager.checkAndSync();
    
    // Check every 2 minutes
    setInterval(() => {
      syncManager.checkAndSync();
    }, 120000);
  }
};
