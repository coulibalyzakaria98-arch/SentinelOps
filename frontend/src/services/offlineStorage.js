import Dexie from 'dexie';

// Base de données IndexedDB
class OfflineDatabase extends Dexie {
  constructor() {
    super('SentinelOpsDB');
    
    this.version(41).stores({
      reports: '++id, uuid, timestamp, synced, retryCount, damage_level, crisis_type',
      queue: '++id, type, payload, timestamp, retryCount, lastAttempt',
      images: 'uuid, data, size, mimeType'
    });
  }
}

const db = new OfflineDatabase();

// Fonctions utilitaires
const saveReportOffline = async (report, imageFile = null) => {
  try {
    const uuid = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    const reportWithMeta = {
      uuid,
      ...report,
      timestamp: new Date().toISOString(),
      synced: false,
      retryCount: 0,
      createdAt: Date.now()
    };
    
    if (imageFile) {
      const reader = new FileReader();
      const imageData = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(imageFile);
      });
      await db.images.put({ uuid, data: imageData, size: imageFile.size, mimeType: imageFile.type });
      reportWithMeta.hasImage = true;
    }
    
    await db.reports.add(reportWithMeta);
    await addToQueue('REPORT', reportWithMeta);
    
    console.log('[OfflineStorage] Report saved:', uuid);
    return { success: true, uuid, report: reportWithMeta };
  } catch (error) {
    console.error('[OfflineStorage] Error saving report:', error);
    return { success: false, error };
  }
};

const addToQueue = async (type, payload) => {
  try {
    return await db.queue.add({ type, payload, timestamp: Date.now(), retryCount: 0, lastAttempt: null });
  } catch (error) {
    console.error('[OfflineStorage] Error adding to queue:', error);
    return null;
  }
};

const getUnsyncedReports = async () => {
  try {
    // Use a more robust approach to avoid IndexedDB key validation issues
    const allReports = await db.reports.toArray();
    return allReports.filter(report => report.synced === false || report.synced === 0 || report.synced === null || report.synced === undefined);
  } catch (error) {
    console.error('[OfflineStorage] Error fetching unsynced reports:', error);
    return [];
  }
};

const getOfflineImage = async (uuid) => {
  if (!uuid) return null;
  try {
    return await db.images.get(uuid);
  } catch (error) {
    console.error('[OfflineStorage] Error fetching image:', error);
    return null;
  }
};

const markAsSynced = async (uuid) => {
  if (!uuid) return false;
  try {
    await db.reports.update(uuid, { synced: true, syncedAt: new Date().toISOString() });
    return true;
  } catch (error) {
    console.error('[OfflineStorage] Error marking as synced:', error);
    return false;
  }
};

const getPendingCount = async () => {
  try {
    // Use a more robust query that handles different data types
    const allReports = await db.reports.toArray();
    return allReports.filter(report => report.synced === false || report.synced === 0 || report.synced === null || report.synced === undefined).length;
  } catch (error) {
    console.error('[OfflineStorage] Error counting pending reports:', error);
    return 0;
  }
};

const getQueue = async () => {
  try {
    return await db.queue.orderBy('timestamp').toArray();
  } catch (error) {
    console.error('[OfflineStorage] Error fetching queue:', error);
    return [];
  }
};

const deleteLocalReport = async (uuid) => {
  if (!uuid) return false;
  try {
    await db.reports.delete(uuid);
    await db.images.delete(uuid);
    // Delete from queue by filtering in JavaScript to avoid nested query issues
    const queueItems = await db.queue.toArray();
    const itemsToDelete = queueItems.filter(item => item.payload && item.payload.uuid === uuid);
    await db.queue.bulkDelete(itemsToDelete.map(item => item.id));
    return true;
  } catch (error) {
    console.error('[OfflineStorage] Error deleting report:', error);
    return false;
  }
};

const cleanupOldReports = async () => {
  try {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const oldReports = await db.reports
      .where('timestamp')
      .below(new Date(thirtyDaysAgo).toISOString())
      .toArray();
    
    for (const report of oldReports) {
      await deleteLocalReport(report.uuid);
    }
    
    return oldReports.length;
  } catch (error) {
    console.error('[OfflineStorage] Error cleaning up:', error);
    return 0;
  }
};

const clearAllData = async () => {
  try {
    await db.reports.clear();
    await db.queue.clear();
    await db.images.clear();
    console.log('[OfflineStorage] All data cleared');
    return true;
  } catch (error) {
    console.error('[OfflineStorage] Error clearing data:', error);
    return false;
  }
};

const getStorageUsage = async () => {
  try {
    const [reports, images, queue] = await Promise.all([
      db.reports.toArray(),
      db.images.toArray(),
      db.queue.toArray()
    ]);
    
    return {
      reports: reports.length,
      images: images.length,
      queue: queue.length,
      estimatedSize: JSON.stringify(reports).length + images.reduce((acc, img) => acc + (img.data?.length || 0), 0)
    };
  } catch (error) {
    console.error('[OfflineStorage] Error calculating storage usage:', error);
    return { reports: 0, images: 0, queue: 0, estimatedSize: 0 };
  }
};

// EXPORT GROUPÉ UNIQUE (Style Pro recommandé)
export {
  saveReportOffline,
  addToQueue,
  getUnsyncedReports,
  getOfflineImage,
  markAsSynced,
  getPendingCount,
  getQueue,
  deleteLocalReport,
  cleanupOldReports,
  getStorageUsage,
  clearAllData
};

// Export objet pour compatibilité
export const offlineStorage = {
  saveReportOffline,
  addToQueue,
  getUnsyncedReports,
  getOfflineImage,
  markAsSynced,
  getPendingCount,
  getQueue,
  deleteLocalReport,
  cleanupOldReports,
  getStorageUsage,
  clearAllData
};

export default db;
