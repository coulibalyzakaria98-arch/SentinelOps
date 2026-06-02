import { offlineStorage } from './offlineStorage';
import { reportApi } from './api';

export const syncService = {
  isSyncing: false,
  statusListeners: [],

  subscribe(callback) {
    this.statusListeners.push(callback);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== callback);
    };
  },

  notify(status) {
    this.statusListeners.forEach(l => l(status));
  },

  async syncPendingReports() {
    // 🛠️ [Prototype Mode] Sync disabled
    return;
  },

  startAutoSyncListener() {
    // 🛠️ [Prototype Mode] Auto-sync listener disabled
  }
};
