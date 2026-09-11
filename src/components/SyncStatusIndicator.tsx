// ============================================================================
// JEEVAN JYOTI FOUNDATION - SYNC STATUS INDICATOR & INDEXED-DB MANAGER
// जीवन ज्योति फाउंडेशन - प्रमाण पत्र सिंक स्थिति सूचक व IndexedDB ऑफ़लाइन प्रबंधक
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Database,
  CloudOff,
  HardDrive,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Layers,
  X,
  Edit3,
  Wifi,
  WifiOff
} from 'lucide-react';
import {
  SyncStatsResult,
  getIndexedDBSyncStats,
  subscribeToSyncChanges,
  syncPendingRecordsWithServer,
  markCertificateAsPendingUpdate,
  getCertificatesFromIndexedDB,
  IndexedDBCertificateRecord,
  DB_NAME
} from '../services/certificateIndexedDB';

export interface SyncStatusIndicatorProps {
  currentPhone?: string;
  isOnline?: boolean;
  onSyncComplete?: () => void;
  className?: string;
  showDetailsButton?: boolean;
  compact?: boolean;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({
  currentPhone,
  isOnline = true,
  onSyncComplete,
  className = '',
  showDetailsButton = true,
  compact = false
}) => {
  const [stats, setStats] = useState<SyncStatsResult>({
    totalRecords: 0,
    syncedCount: 0,
    pendingCount: 0,
    locallyCachedCount: 0,
    lastSyncedAt: null,
    lastSyncedFormatted: 'जाँच जारी...',
    isAllSynced: true,
    storageEstimateMb: '0.2 MB'
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [indexedRecords, setIndexedRecords] = useState<IndexedDBCertificateRecord[]>([]);

  // Load stats
  const refreshStats = async () => {
    try {
      const s = await getIndexedDBSyncStats(currentPhone);
      setStats(s);
      if (currentPhone) {
        const records = await getCertificatesFromIndexedDB(currentPhone);
        setIndexedRecords(records);
      }
    } catch (e) {
      console.warn('Error refreshing sync stats:', e);
    }
  };

  useEffect(() => {
    refreshStats();

    // Subscribe to DB events
    const unsubscribe = subscribeToSyncChanges((newStats) => {
      setStats(newStats);
      if (currentPhone) {
        getCertificatesFromIndexedDB(currentPhone).then(setIndexedRecords);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentPhone]);

  // Handle immediate sync
  const handlePerformSync = async () => {
    if (!isOnline) {
      setSyncFeedback('⚠️ इंटरनेट कनेक्शन अनुपलब्ध है। ऑनलाइन होने पर सिंक स्वतः सक्रिय होगा।');
      setTimeout(() => setSyncFeedback(null), 4000);
      return;
    }

    setIsSyncing(true);
    setSyncFeedback(null);

    try {
      const res = await syncPendingRecordsWithServer(currentPhone);
      await refreshStats();
      setSyncFeedback(`✅ ${res.syncedCount || stats.totalRecords} रिकॉर्ड्स सर्वर व IndexedDB के साथ सफलतापूर्वक सिंक हो गए!`);
      if (onSyncComplete) {
        onSyncComplete();
      }
    } catch (err) {
      setSyncFeedback('❌ सिंक प्रक्रिया में त्रुटि आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(null), 4000);
    }
  };

  // Test simulation: mark first record as having pending local modification
  const handleSimulateLocalOfflineEdit = async () => {
    if (indexedRecords.length === 0) return;
    const target = indexedRecords[0];
    const newNote = `[ऑफ़लाइन परीक्षण नोट: ${new Date().toLocaleTimeString('hi-IN')}]`;

    await markCertificateAsPendingUpdate(
      target.id,
      { details: `${target.data.details || ''} ${newNote}`.trim() },
      'उपयोगकर्ता ऑफ़लाइन सत्यापन व नोट अद्यतन'
    );

    await refreshStats();
    setSyncFeedback(`🟡 रिकॉर्ड ${target.id} में स्थानीय बदलाव दर्ज हुआ (IndexedDB Pending Sync)`);
    setTimeout(() => setSyncFeedback(null), 3500);
  };

  const hasPending = stats.pendingCount > 0;
  const syncPercentage =
    stats.totalRecords > 0
      ? Math.round((stats.syncedCount / stats.totalRecords) * 100)
      : 100;

  return (
    <>
      {/* Main Trigger Badge */}
      <div
        id="sync-status-indicator"
        className={`inline-flex items-center gap-1.5 ${className}`}
      >
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs ${
            hasPending
              ? 'bg-amber-100/90 text-amber-900 border-amber-400 hover:bg-amber-200'
              : !isOnline
              ? 'bg-orange-100 text-orange-900 border-orange-300 hover:bg-orange-200'
              : 'bg-emerald-100/90 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
          }`}
          title="IndexedDB ऑफ़लाइन सिंक स्थिति विवरण देखें"
        >
          {/* Status Indicator Dot / Icon */}
          {hasPending ? (
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600 relative" />
            </div>
          ) : !isOnline ? (
            <HardDrive className="w-3.5 h-3.5 text-orange-700" />
          ) : (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          )}

          {/* Text Summary */}
          <div className="flex items-center gap-1">
            <span className="font-black">
              {hasPending
                ? `${stats.pendingCount} ऑफ़लाइन बदलाव लंबित`
                : !isOnline
                ? 'IndexedDB ऑफ़लाइन सक्रिय'
                : 'सर्वर सिंक ✓'}
            </span>
            {!compact && stats.totalRecords > 0 && (
              <span className="text-[10px] opacity-80 hidden sm:inline">
                ({stats.syncedCount}/{stats.totalRecords})
              </span>
            )}
          </div>

          {showDetailsButton && (
            <span className="text-[10px] underline underline-offset-2 opacity-70 ml-0.5">
              विवरण
            </span>
          )}
        </button>

        {/* Quick Sync Button if pending */}
        {hasPending && isOnline && (
          <button
            type="button"
            onClick={handlePerformSync}
            disabled={isSyncing}
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-black text-[11px] rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1 disabled:opacity-50"
            title="लंबित बदलाव तुरंत सर्वर पर सिंक करें"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>सिंक करें</span>
          </button>
        )}
      </div>

      {/* SYNC DIAGNOSTICS & MANAGEMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div
            className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-scaleUp text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/40 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                      INDEXED-DB SYNC ENGINE
                    </span>
                    <span className="text-[11px] text-slate-300 font-medium">
                      {isOnline ? '🌐 ऑनलाइन' : '📶 ऑफ़लाइन'}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white mt-0.5">
                    प्रमाण पत्र ऑफ़लाइन सिंक स्थिति प्रबंधक
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sync Feedback Toast */}
            {syncFeedback && (
              <div className="px-5 py-2.5 bg-indigo-50 border-b border-indigo-200 text-xs font-bold text-indigo-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{syncFeedback}</span>
              </div>
            )}

            {/* Content Body */}
            <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Overall Sync Health Meter */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    <span>डेटाबेस सिंक्रनाइज़ेशन दर (Sync Health)</span>
                  </span>
                  <span className="font-mono font-black text-sm text-indigo-900">
                    {syncPercentage}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      syncPercentage === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${syncPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>अंतिम सिंक समय: <strong>{stats.lastSyncedFormatted}</strong></span>
                  <span>स्टोरेज उपयोग: <strong>{stats.storageEstimateMb}</strong></span>
                </div>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                    सर्वर सिंक
                  </span>
                  <span className="text-xl font-black text-emerald-900 block mt-1">
                    {stats.syncedCount}
                  </span>
                  <span className="text-[9px] text-emerald-700 font-medium">100% सत्यापित</span>
                </div>

                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
                  <span className="text-[10px] font-bold text-amber-800 uppercase block">
                    लंबित अपडेट
                  </span>
                  <span className="text-xl font-black text-amber-900 block mt-1">
                    {stats.pendingCount}
                  </span>
                  <span className="text-[9px] text-amber-700 font-medium">IndexedDB Queue</span>
                </div>

                <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-center">
                  <span className="text-[10px] font-bold text-indigo-800 uppercase block">
                    कुल कैश रिकॉर्ड
                  </span>
                  <span className="text-xl font-black text-indigo-900 block mt-1">
                    {stats.totalRecords}
                  </span>
                  <span className="text-[9px] text-indigo-700 font-medium">ब्राउज़र स्टोरेज</span>
                </div>
              </div>

              {/* Action Buttons: Sync Now & Simulate Offline Edit */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handlePerformSync}
                  disabled={isSyncing}
                  className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>
                    {isSyncing
                      ? 'सर्वर से सिंक किया जा रहा है...'
                      : '⚡ अभी सर्वर व IndexedDB सिंक करें (Sync Now)'}
                  </span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSimulateLocalOfflineEdit}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition cursor-pointer flex items-center justify-center gap-1.5"
                    title="स्थानीय ऑफ़लाइन संपादन का परीक्षण करें"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                    <span>🔬 ऑफ़लाइन बदलाव टेस्ट (Simulate Edit)</span>
                  </button>

                  <button
                    type="button"
                    onClick={refreshStats}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition cursor-pointer flex items-center gap-1"
                    title="IndexedDB पुनः पढ़ें"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>रीफ्रेश</span>
                  </button>
                </div>
              </div>

              {/* IndexedDB Records Sync Breakdown List */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-black text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>कैश किए गए प्रमाण पत्रों की सिंक स्थिति</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    IndexedDB: <code className="font-mono text-slate-800 font-bold">{DB_NAME}</code>
                  </span>
                </div>

                {indexedRecords.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-xl">
                    वर्तमान नंबर के लिए कोई IndexedDB रिकॉर्ड नहीं मिला
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {indexedRecords.map((rec) => {
                      const isPending = rec.syncStatus === 'pending_update';
                      return (
                        <div
                          key={rec.id}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition ${
                            isPending
                              ? 'bg-amber-50/90 border-amber-300'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <div className="space-y-0.5 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-black text-slate-900 truncate">
                                {rec.id}
                              </span>
                              <span className="text-[10px] text-slate-500">• {rec.recipientName}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 truncate">
                              {rec.data.categoryOrPurpose || rec.data.details || rec.type}
                            </p>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5">
                            {isPending ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                                <span>लंबित</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>सिंक ✓</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Technical Specifications Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-indigo-500" />
                  <span>W3C IndexedDB Level 2 • ऑटो-सिंक समर्थित</span>
                </span>
                <span>जीवन ज्योति फाउंडेशन Ghazipur</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
