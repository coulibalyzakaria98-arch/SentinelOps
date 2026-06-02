import { getUnsyncedReports, markAsSynced, getOfflineImage, getQueue, addToQueue } from './offlineStorage';
import { API_BASE_URL } from '../config';

class SyncManager {
  constructor() {
    this.isSyncing = false;
    this.listeners = [];
    this.maxRetries = 5;
    this.baseDelay = 1000; // 1 seconde
    this.maxDelay = 60000; // 60 secondes
  }
  
  // Ajouter un listener d'événements
  onSync(callback) {
    this.listeners.push(callback);
  }
  
  // Notifier les listeners
  notify(event, data) {
    this.listeners.forEach(cb => cb({ event, data }));
  }
  
  // Calculer le délai de backoff exponentiel
  getBackoffDelay(retryCount) {
    const delay = Math.min(this.baseDelay * Math.pow(2, retryCount), this.maxDelay);
    // Ajouter un jitter aléatoire
    return delay * (0.8 + Math.random() * 0.4);
  }
  
  // Synchroniser un rapport individuel
  async syncReport(report) {
    try {
      let imageData = null;
      if (report.hasImage) {
        const image = await getOfflineImage(report.uuid);
        if (image) {
          imageData = image.data;
        }
      }
      
      const formData = new FormData();
      formData.append('damage_level', report.damage_level);
      formData.append('infrastructure_type', report.infrastructure_type);
      formData.append('crisis_type', report.crisis_type);
      formData.append('latitude', report.latitude);
      formData.append('longitude', report.longitude);
      formData.append('description', report.description || '');
      formData.append('timestamp', report.timestamp);
      
      if (imageData) {
        const blob = await fetch(imageData).then(r => r.blob());
        formData.append('photo', blob, 'report.jpg');
      }
      
      const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      await markAsSynced(report.uuid);
      
      this.notify('REPORT_SYNCED', { uuid: report.uuid, serverId: result.id });
      return { success: true, uuid: report.uuid };
      
    } catch (error) {
      console.error(`[SyncManager] Error syncing report ${report.uuid}:`, error);
      
      // Mettre à jour le compteur de tentatives
      report.retryCount = (report.retryCount || 0) + 1;
      
      if (report.retryCount >= this.maxRetries) {
        this.notify('SYNC_FAILED', { uuid: report.uuid, error: error.message });
        return { success: false, permanent: true };
      }
      
      // Réinsérer dans la queue avec backoff
      const delay = this.getBackoffDelay(report.retryCount);
      setTimeout(() => this.syncReport(report), delay);
      
      return { success: false, retry: true, delay };
    }
  }
  
  // Synchroniser tous les rapports
  async syncAll() {
    if (this.isSyncing) {
      console.log('[SyncManager] Already syncing...');
      return;
    }
    
    this.isSyncing = true;
    this.notify('SYNC_START', null);
    
    try {
      const unsynced = await getUnsyncedReports();
      console.log(`[SyncManager] Found ${unsynced.length} unsynced reports`);
      
      let successCount = 0;
      let failCount = 0;
      
      for (const report of unsynced) {
        const result = await this.syncReport(report);
        if (result.success) {
          successCount++;
        } else if (result.permanent) {
          failCount++;
        }
        
        // Petit délai entre chaque envoi pour éviter la surcharge
        await new Promise(r => setTimeout(r, 500));
      }
      
      this.notify('SYNC_COMPLETE', { success: successCount, failed: failCount });
      
    } catch (error) {
      console.error('[SyncManager] Sync error:', error);
      this.notify('SYNC_ERROR', { error: error.message });
    } finally {
      this.isSyncing = false;
    }
  }
  
  // Vérifier et déclencher la synchronisation
  checkAndSync() {
    if (navigator.onLine) {
      console.log('[SyncManager] Online detected, starting sync...');
      this.syncAll();
    } else {
      console.log('[SyncManager] Offline, sync deferred');
    }
  }
  
  // Obtenir le statut actuel
  getStatus() {
    return {
      isSyncing: this.isSyncing,
      isOnline: navigator.onLine
    };
  }
}

export const syncManager = new SyncManager();

// Écouter les événements de connexion
window.addEventListener('online', () => {
  console.log('[SyncManager] Network online');
  syncManager.checkAndSync();
});

window.addEventListener('offline', () => {
  console.log('[SyncManager] Network offline');
});
