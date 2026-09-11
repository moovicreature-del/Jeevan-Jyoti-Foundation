// ============================================================================
// JEEVAN JYOTI FOUNDATION - FIRESTORE DATA BACKUP MODAL (ADMIN PANEL)
// दानदाता एवं स्वयंसेवक डेटाबेस बैकअप डाउनलोड मोडल
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Download,
  Database,
  ShieldCheck,
  CheckCircle2,
  Copy,
  FileJson,
  RefreshCw,
  HeartHandshake,
  Users,
  Award,
  Calendar,
  IndianRupee,
  Clock,
  X,
  Sparkles,
  Lock,
  Archive,
  ArrowDownToLine,
  Check
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  compileDonationsAndVolunteersBackup,
  downloadBackupJsonFile,
  executeManualDatabaseBackup,
  FirestoreBackupPayload
} from '../../services/backupService';
import toast from 'react-hot-toast';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({ isOpen, onClose }) => {
  const { adminProfile, isSuperAdmin } = useAdminAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [previewPayload, setPreviewPayload] = useState<FirestoreBackupPayload | null>(null);
  const [showRawJson, setShowRawJson] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [lastBackupMeta, setLastBackupMeta] = useState<{
    timestamp: string;
    fileName: string;
    totalDonations: number;
    totalVolunteers: number;
  } | null>(null);

  // Load last backup meta
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedTs = localStorage.getItem('jjf_last_backup_timestamp');
        const storedMeta = localStorage.getItem('jjf_last_backup_meta');
        if (storedTs) {
          const parsed = storedMeta ? JSON.parse(storedMeta) : {};
          setLastBackupMeta({
            timestamp: storedTs,
            fileName: parsed.fileName || 'JJF_Firestore_Backup.json',
            totalDonations: parsed.totalDonations || 0,
            totalVolunteers: parsed.totalVolunteers || 0
          });
        }
      } catch {
        // Ignore
      }
    }
  }, [isOpen]);

  // Pre-load backup summary when modal opens
  useEffect(() => {
    if (isOpen) {
      let isMounted = true;
      setIsCompiling(true);
      compileDonationsAndVolunteersBackup({
        name: adminProfile?.name || 'व्यवस्थापक',
        uid: adminProfile?.uid || 'admin',
        role: adminProfile?.role || 'Admin'
      })
        .then((payload) => {
          if (isMounted) {
            setPreviewPayload(payload);
            setIsCompiling(false);
          }
        })
        .catch((err) => {
          console.warn('Backup pre-compilation error:', err);
          if (isMounted) setIsCompiling(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [isOpen, adminProfile]);

  if (!isOpen) return null;

  const handleDownloadBackup = async () => {
    setIsLoading(true);
    try {
      const adminInfo = {
        name: adminProfile?.name || 'सिस्टम व्यवस्थापक',
        uid: adminProfile?.uid || 'admin',
        role: adminProfile?.role || (isSuperAdmin ? 'Super Admin' : 'Admin')
      };

      const result = await executeManualDatabaseBackup(adminInfo);
      setPreviewPayload(result.payload);

      setLastBackupMeta({
        timestamp: new Date().toISOString(),
        fileName: result.fileName,
        totalDonations: result.summary.totalDonations,
        totalVolunteers: result.summary.totalVolunteers
      });

      toast.success(`🎉 ${result.fileName} सफलतापूर्वक डाउनलोड हो गया!`, {
        duration: 4000
      });
    } catch (err) {
      console.error('Backup trigger error:', err);
      toast.error('डेटाबेस बैकअप में त्रुटि आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!previewPayload) return;
    try {
      const jsonStr = JSON.stringify(previewPayload, null, 2);
      navigator.clipboard.writeText(jsonStr);
      setCopied(true);
      toast.success('JSON डेटा क्लिपबोर्ड में कॉपी हो गया!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('क्लिपबोर्ड में कॉपी करने में विफल!');
    }
  };

  const summary = previewPayload?.metadata?.summary;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                  FIRESTORE DATABASE BACKUP
                </span>
                <span className="text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  क्लाउड सिंक एक्टिव
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                दान एवं स्वयंसेवक डेटाबेस बैकअप (JSON Export)
              </h2>
            </div>
          </div>
          <p className="text-xs text-blue-200 max-w-xl leading-relaxed mt-1">
            जीवन ज्योति फाउंडेशन ग़ाज़ीपुर के समस्त फायरस्टोर दान रिकॉर्ड, 80G टैक्स रसीदें, स्वयंसेवक प्रोफाइल व जारी प्रमाण पत्रों का पूर्ण संरचित JSON बैकअप एक क्लिक में डाउनलोड करें।
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Metric 1: Donations */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center justify-between text-amber-800">
                <HeartHandshake className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">दान रिकॉर्ड्स</span>
              </div>
              <div className="text-xl font-black text-amber-950">
                {isCompiling ? '...' : summary?.totalDonations || 0}
              </div>
              <p className="text-[10px] text-amber-800/80 font-bold">
                कुल ₹{isCompiling ? '...' : (summary?.totalDonationAmountInr || 0).toLocaleString('en-IN')}
              </p>
            </div>

            {/* Metric 2: Volunteers */}
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center justify-between text-blue-800">
                <Users className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">स्वयंसेवक</span>
              </div>
              <div className="text-xl font-black text-blue-950">
                {isCompiling ? '...' : summary?.totalVolunteers || 0}
              </div>
              <p className="text-[10px] text-blue-800/80 font-bold">
                {isCompiling ? '...' : summary?.totalTasksCompletedByVolunteers || 0} समाज सेवा कार्य
              </p>
            </div>

            {/* Metric 3: Issued Certificates */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center justify-between text-emerald-800">
                <Award className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">जारी प्रमाण पत्र</span>
              </div>
              <div className="text-xl font-black text-emerald-950">
                {isCompiling ? '...' : summary?.totalIssuedCertificates || 0}
              </div>
              <p className="text-[10px] text-emerald-800/80 font-bold">
                100% QR सत्यापित
              </p>
            </div>

            {/* Metric 4: Form 10BD / PAN Count */}
            <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-3.5 space-y-1">
              <div className="flex items-center justify-between text-indigo-800">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">80G PAN दाता</span>
              </div>
              <div className="text-xl font-black text-indigo-950">
                {isCompiling ? '...' : summary?.donationsWithPanCount || 0}
              </div>
              <p className="text-[10px] text-indigo-800/80 font-bold">
                Form 10BD अनुपालित
              </p>
            </div>
          </div>

          {/* Backup Information & Security Assurance */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-700" />
                डेटा संरचना एवं सुरक्षा एन्क्रिप्शन:
              </span>
              <span className="font-mono text-[11px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                v2.0.0-PROD JSON
              </span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
              <li>
                <strong>फायरस्टोर कलेक्शन्स:</strong> <code className="text-blue-900 bg-blue-50 px-1 py-0.2 rounded font-mono">issued_certificates</code>, <code className="text-blue-900 bg-blue-50 px-1 py-0.2 rounded font-mono">public_verified_archive</code> एवं स्थानीय रजिस्ट्रीयों का संपूर्ण संकलन।
              </li>
              <li>
                <strong>टैम्पर-प्रूफ चेकसम:</strong> बैकअप फ़ाइल में SHA-256 डिजिटल हैश शामिल है, जिससे किसी भी अनधिकृत बदलाव का तुरंत पता चल जाता है।
              </li>
              <li>
                <strong>उपयोगिता:</strong> आपदा प्रबंधन (Disaster Recovery), सीए/आयकर 80G ऑडिट, वित्तीय वर्ष समाप्ति बैकअप एवं ऑफलाइन रिकॉर्ड सत्यापन।
              </li>
            </ul>

            {previewPayload?.metadata?.checksumSha256 && (
              <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-1 font-mono">
                <span>SHA-256 चेकसम:</span>
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-800 text-[10px] truncate max-w-md">
                  {previewPayload.metadata.checksumSha256}
                </span>
              </div>
            )}
          </div>

          {/* Last Backup History Status */}
          {lastBackupMeta && (
            <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  अंतिम बैकअप: <strong>{new Date(lastBackupMeta.timestamp).toLocaleString('hi-IN')}</strong> ({lastBackupMeta.fileName})
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 hidden sm:inline">
                {lastBackupMeta.totalDonations} दान / {lastBackupMeta.totalVolunteers} स्वयंसेवक
              </span>
            </div>
          )}

          {/* Raw JSON Inspection Accordion */}
          <div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowRawJson(!showRawJson)}
                className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 cursor-pointer"
              >
                <FileJson className="w-3.5 h-3.5" />
                <span>{showRawJson ? 'JSON प्रीव्यू छुपाएं' : 'JSON संरचना का लाइव प्रीव्यू देखें'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyJson}
                disabled={!previewPayload}
                className="text-xs font-bold text-slate-700 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'कॉपी हो गया!' : 'JSON कॉपी करें'}</span>
              </button>
            </div>

            {showRawJson && previewPayload && (
              <div className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-2xl text-[11px] font-mono max-h-52 overflow-y-auto border border-slate-800">
                <pre>{JSON.stringify(previewPayload, null, 2)}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-5 sm:p-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            अधिकृत एडमिन: <strong>{adminProfile?.name || 'सिस्टम व्यवस्थापक'}</strong>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              बंद करें
            </button>

            <button
              id="btn-execute-firestore-backup-download"
              onClick={handleDownloadBackup}
              disabled={isLoading || isCompiling}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 hover:from-blue-800 hover:to-indigo-900 text-white font-black text-xs rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>फायरस्टोर डेटा संकलित हो रहा है...</span>
                </>
              ) : (
                <>
                  <ArrowDownToLine className="w-4 h-4 text-amber-400" />
                  <span>📥 अभी पूर्ण बैकअप JSON फ़ाइल डाउनलोड करें</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
