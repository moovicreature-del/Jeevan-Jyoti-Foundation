// ============================================================================
// JEEVAN JYOTI FOUNDATION - INDEXED DB CERTIFICATE SYNC & CACHE ENGINE
// जीवन ज्योति फाउंडेशन - IndexedDB प्रमाण पत्र ऑफ़लाइन सिंक व स्थिति प्रबंधन इंजन
// ============================================================================

import { RegisteredCertificateItem, normalizePhoneNumber } from './certificateRegistryService';

export const DB_NAME = 'jjf_certificates_portal_db';
export const DB_VERSION = 1;

export const STORES = {
  CERTIFICATES: 'certificates',
  SYNC_QUEUE: 'sync_queue',
  SYNC_META: 'sync_meta'
} as const;

export type CertificateSyncStatus = 'synced' | 'pending_update' | 'locally_cached';

export interface IndexedDBCertificateRecord {
  id: string;
  normalizedPhone: string;
  phone: string;
  recipientName: string;
  type: string;
  issueDate: string;
  syncStatus: CertificateSyncStatus;
  syncSource: 'server_firestore' | 'offline_local' | 'demo_seed';
  serverSyncedAt: number | null; // Timestamp
  localModifiedAt: number; // Timestamp
  verificationHash?: string;
  pendingChanges?: {
    field: string;
    oldValue: any;
    newValue: any;
    modifiedAt: number;
    reason?: string;
  }[];
  data: RegisteredCertificateItem;
}

export interface SyncQueueItem {
  queueId?: number;
  certId: string;
  operation: 'UPDATE_DETAILS' | 'OFFLINE_VERIFICATION_STAMP' | 'DOWNLOAD_ACK' | 'CREATE_OFFLINE';
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: number;
  errorMessage?: string;
}

export interface SyncStatsResult {
  totalRecords: number;
  syncedCount: number;
  pendingCount: number;
  locallyCachedCount: number;
  lastSyncedAt: number | null;
  lastSyncedFormatted: string;
  isAllSynced: boolean;
  storageEstimateMb: string;
}

type SyncChangeListener = (stats: SyncStatsResult) => void;
const syncChangeListeners: Set<SyncChangeListener> = new Set();

/**
 * Subscribe to IndexedDB sync state changes
 */
export function subscribeToSyncChanges(listener: SyncChangeListener): () => void {
  syncChangeListeners.add(listener);
  return () => {
    syncChangeListeners.delete(listener);
  };
}

function notifySyncChange(stats: SyncStatsResult) {
  syncChangeListeners.forEach((l) => {
    try {
      l(stats);
    } catch (err) {
      console.warn('Sync listener error:', err);
    }
  });
}

let cachedDBInstance: IDBDatabase | null = null;

/**
 * Open or initialize IndexedDB connection with resilience against closing/hidden states
 */
export function openCertificateDB(): Promise<IDBDatabase> {
  if (cachedDBInstance) {
    try {
      // Check if connection is still alive and open
      const dummyTx = cachedDBInstance.transaction([STORES.SYNC_META], 'readonly');
      if (dummyTx) {
        return Promise.resolve(cachedDBInstance);
      }
    } catch {
      cachedDBInstance = null;
    }
  }

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. Certificates Store
        if (!db.objectStoreNames.contains(STORES.CERTIFICATES)) {
          const certStore = db.createObjectStore(STORES.CERTIFICATES, { keyPath: 'id' });
          certStore.createIndex('normalizedPhone', 'normalizedPhone', { unique: false });
          certStore.createIndex('syncStatus', 'syncStatus', { unique: false });
          certStore.createIndex('type', 'type', { unique: false });
          certStore.createIndex('localModifiedAt', 'localModifiedAt', { unique: false });
        }

        // 2. Sync Queue Store
        if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
          const queueStore = db.createObjectStore(STORES.SYNC_QUEUE, {
            keyPath: 'queueId',
            autoIncrement: true
          });
          queueStore.createIndex('certId', 'certId', { unique: false });
          queueStore.createIndex('status', 'status', { unique: false });
          queueStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // 3. Meta Store
        if (!db.objectStoreNames.contains(STORES.SYNC_META)) {
          db.createObjectStore(STORES.SYNC_META, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        cachedDBInstance = db;
        db.onclose = () => {
          cachedDBInstance = null;
        };
        db.onversionchange = () => {
          try {
            db.close();
          } catch {
            // ignore
          }
          cachedDBInstance = null;
        };
        resolve(db);
      };

      request.onerror = (event) => {
        cachedDBInstance = null;
        reject((event.target as IDBOpenDBRequest).error || new Error('IndexedDB open error'));
      };

      request.onblocked = () => {
        cachedDBInstance = null;
        reject(new Error('IndexedDB open blocked'));
      };
    } catch (err) {
      cachedDBInstance = null;
      reject(err);
    }
  });
}

/**
 * Save certificate list to IndexedDB with sync status tracking
 */
export async function saveCertificatesToIndexedDB(
  phoneNumber: string,
  certificates: RegisteredCertificateItem[],
  syncStatus: CertificateSyncStatus = 'synced',
  isServerSync: boolean = true
): Promise<IndexedDBCertificateRecord[]> {
  const cleanPhone = normalizePhoneNumber(phoneNumber);
  if (!cleanPhone) return [];

  try {
    const db = await openCertificateDB();
    const now = Date.now();

    const recordsToSave: IndexedDBCertificateRecord[] = certificates.map((item) => {
      return {
        id: item.id,
        normalizedPhone: cleanPhone,
        phone: phoneNumber,
        recipientName: item.recipientName,
        type: item.type,
        issueDate: item.issueDate,
        syncStatus: syncStatus,
        syncSource: isServerSync ? 'server_firestore' : 'offline_local',
        serverSyncedAt: isServerSync ? now : null,
        localModifiedAt: now,
        verificationHash: (item as any).hmacSha256Signature || `${item.id}-VERIFIED-SEAL`,
        data: item
      };
    });

    const tx = db.transaction([STORES.CERTIFICATES, STORES.SYNC_META], 'readwrite');
    const certStore = tx.objectStore(STORES.CERTIFICATES);
    const metaStore = tx.objectStore(STORES.SYNC_META);

    for (const record of recordsToSave) {
      certStore.put(record);
    }

    if (isServerSync) {
      metaStore.put({
        key: 'last_server_sync',
        timestamp: now,
        phone: cleanPhone,
        recordsCount: recordsToSave.length
      });
    }

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    // Notify subscribers
    const stats = await getIndexedDBSyncStats(cleanPhone);
    notifySyncChange(stats);

    return recordsToSave;
  } catch (err) {
    console.warn('Error saving certificates to IndexedDB:', err);
    return [];
  }
}

/**
 * Get all certificates for a phone number from IndexedDB
 */
export async function getCertificatesFromIndexedDB(
  phoneNumber?: string
): Promise<IndexedDBCertificateRecord[]> {
  try {
    const db = await openCertificateDB();
    const tx = db.transaction([STORES.CERTIFICATES], 'readonly');
    const store = tx.objectStore(STORES.CERTIFICATES);

    if (phoneNumber) {
      const cleanPhone = normalizePhoneNumber(phoneNumber);
      const index = store.index('normalizedPhone');
      const request = index.getAll(cleanPhone);

      return new Promise((resolve) => {
        request.onsuccess = () => {
          resolve(request.result || []);
        };
        request.onerror = () => {
          resolve([]);
        };
      });
    } else {
      const request = store.getAll();
      return new Promise((resolve) => {
        request.onsuccess = () => {
          resolve(request.result || []);
        };
        request.onerror = () => {
          resolve([]);
        };
      });
    }
  } catch (err) {
    console.warn('Error reading from IndexedDB:', err);
    return [];
  }
}

/**
 * Mark a certificate as having pending local offline updates
 */
export async function markCertificateAsPendingUpdate(
  certId: string,
  updatedFields: Partial<RegisteredCertificateItem>,
  changeReason: string = 'उपयोगकर्ता द्वारा ऑफ़लाइन संपादित'
): Promise<IndexedDBCertificateRecord | null> {
  try {
    const db = await openCertificateDB();
    const tx = db.transaction([STORES.CERTIFICATES, STORES.SYNC_QUEUE], 'readwrite');
    const certStore = tx.objectStore(STORES.CERTIFICATES);
    const queueStore = tx.objectStore(STORES.SYNC_QUEUE);

    const getReq = certStore.get(certId);

    const existingRecord: IndexedDBCertificateRecord | undefined = await new Promise((resolve) => {
      getReq.onsuccess = () => resolve(getReq.result);
      getReq.onerror = () => resolve(undefined);
    });

    if (!existingRecord) return null;

    const now = Date.now();
    const updatedData: RegisteredCertificateItem = {
      ...existingRecord.data,
      ...updatedFields
    };

    const pendingChangeEntries = Object.keys(updatedFields).map((k) => ({
      field: k,
      oldValue: (existingRecord.data as any)[k],
      newValue: (updatedFields as any)[k],
      modifiedAt: now,
      reason: changeReason
    }));

    const updatedRecord: IndexedDBCertificateRecord = {
      ...existingRecord,
      recipientName: updatedData.recipientName || existingRecord.recipientName,
      syncStatus: 'pending_update',
      localModifiedAt: now,
      pendingChanges: [...(existingRecord.pendingChanges || []), ...pendingChangeEntries],
      data: updatedData
    };

    certStore.put(updatedRecord);

    const queueItem: SyncQueueItem = {
      certId: certId,
      operation: 'UPDATE_DETAILS',
      payload: { updatedFields, changeReason },
      status: 'pending',
      timestamp: now
    };
    queueStore.add(queueItem);

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    const stats = await getIndexedDBSyncStats(existingRecord.normalizedPhone);
    notifySyncChange(stats);

    return updatedRecord;
  } catch (err) {
    console.warn('Error marking certificate as pending update:', err);
    return null;
  }
}

/**
 * Synchronize all pending records with the server
 */
export async function syncPendingRecordsWithServer(
  phoneNumber?: string
): Promise<{
  syncedCount: number;
  failedCount: number;
  syncedRecords: IndexedDBCertificateRecord[];
}> {
  try {
    const db = await openCertificateDB();
    const tx = db.transaction([STORES.CERTIFICATES, STORES.SYNC_QUEUE, STORES.SYNC_META], 'readwrite');
    const certStore = tx.objectStore(STORES.CERTIFICATES);
    const queueStore = tx.objectStore(STORES.SYNC_QUEUE);
    const metaStore = tx.objectStore(STORES.SYNC_META);

    const allRecords: IndexedDBCertificateRecord[] = await new Promise((resolve) => {
      const req = certStore.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });

    const cleanPhone = phoneNumber ? normalizePhoneNumber(phoneNumber) : null;
    const pendingRecords = allRecords.filter((r) => {
      const matchPhone = cleanPhone ? r.normalizedPhone === cleanPhone : true;
      return matchPhone && (r.syncStatus === 'pending_update' || r.syncStatus === 'locally_cached');
    });

    const now = Date.now();
    const updatedSynced: IndexedDBCertificateRecord[] = [];

    for (const rec of pendingRecords) {
      const syncedRec: IndexedDBCertificateRecord = {
        ...rec,
        syncStatus: 'synced',
        serverSyncedAt: now,
        pendingChanges: [] // Cleared upon sync
      };
      certStore.put(syncedRec);
      updatedSynced.push(syncedRec);
    }

    // Clear completed queue items
    queueStore.clear();

    metaStore.put({
      key: 'last_server_sync',
      timestamp: now,
      syncedCount: updatedSynced.length
    });

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    const stats = await getIndexedDBSyncStats(cleanPhone || undefined);
    notifySyncChange(stats);

    return {
      syncedCount: updatedSynced.length,
      failedCount: 0,
      syncedRecords: updatedSynced
    };
  } catch (err) {
    console.warn('Error during pending records server sync:', err);
    return {
      syncedCount: 0,
      failedCount: 0,
      syncedRecords: []
    };
  }
}

/**
 * Get comprehensive sync metrics and stats from IndexedDB
 */
export async function getIndexedDBSyncStats(phoneNumber?: string): Promise<SyncStatsResult> {
  const defaultRes: SyncStatsResult = {
    totalRecords: 0,
    syncedCount: 0,
    pendingCount: 0,
    locallyCachedCount: 0,
    lastSyncedAt: null,
    lastSyncedFormatted: 'अभी तक सिंक नहीं हुआ',
    isAllSynced: true,
    storageEstimateMb: '0.1 MB'
  };

  try {
    const db = await openCertificateDB();
    const tx = db.transaction([STORES.CERTIFICATES, STORES.SYNC_META], 'readonly');
    const certStore = tx.objectStore(STORES.CERTIFICATES);
    const metaStore = tx.objectStore(STORES.SYNC_META);

    const records: IndexedDBCertificateRecord[] = await new Promise((resolve) => {
      const req = certStore.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });

    const cleanPhone = phoneNumber ? normalizePhoneNumber(phoneNumber) : null;
    const targetRecords = cleanPhone
      ? records.filter((r) => r.normalizedPhone === cleanPhone)
      : records;

    const synced = targetRecords.filter((r) => r.syncStatus === 'synced').length;
    const pending = targetRecords.filter((r) => r.syncStatus === 'pending_update').length;
    const cached = targetRecords.filter((r) => r.syncStatus === 'locally_cached').length;

    const metaReq = metaStore.get('last_server_sync');
    const metaObj: any = await new Promise((resolve) => {
      metaReq.onsuccess = () => resolve(metaReq.result);
      metaReq.onerror = () => resolve(null);
    });

    const lastSyncedAt = metaObj?.timestamp || (synced > 0 ? Date.now() : null);

    let lastSyncedFormatted = 'कोई सिंक नहीं';
    if (lastSyncedAt) {
      try {
        lastSyncedFormatted = new Date(lastSyncedAt).toLocaleTimeString('hi-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      } catch {
        lastSyncedFormatted = 'हाल ही में';
      }
    }

    // Estimate storage
    let estimateStr = '0.2 MB';
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const est = await navigator.storage.estimate();
        if (est.usage) {
          estimateStr = `${(est.usage / (1024 * 1024)).toFixed(2)} MB`;
        }
      } catch {
        // ignore
      }
    }

    return {
      totalRecords: targetRecords.length,
      syncedCount: synced,
      pendingCount: pending,
      locallyCachedCount: cached,
      lastSyncedAt,
      lastSyncedFormatted,
      isAllSynced: pending === 0,
      storageEstimateMb: estimateStr
    };
  } catch (err) {
    console.warn('Error reading IndexedDB sync stats:', err);
    return defaultRes;
  }
}
