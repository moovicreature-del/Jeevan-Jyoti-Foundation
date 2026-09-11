import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Smartphone,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Download,
  FileText,
  Award,
  UserCheck,
  Heart,
  Sparkles,
  Search,
  Printer,
  Share2,
  RefreshCw,
  ArrowRight,
  Eye,
  Check,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Filter,
  Wifi,
  WifiOff,
  Database,
  HardDrive,
  History,
  Clock,
  Edit3,
  CloudOff,
  Cloud,
  Info
} from 'lucide-react';
import {
  RegisteredCertificateItem,
  CertificateCategoryType,
  getCertificatesByPhone,
  isDummyCertificate,
  normalizePhoneNumber,
  getAllRegisteredCertificates,
  verifyCertificateWithServerQR,
  ServerVerificationResult,
  ServerVerificationSeal
} from '../services/certificateRegistryService';
import {
  savePhoneCertificatesToOfflineCache,
  getOfflineCachedCertificates,
  getAllOfflineCachedPhoneSummaries,
  hasOfflineCachedCertificates,
  CachedPhoneSession,
  CachedPhoneSummary
} from '../services/offlineCertificateCache';
import {
  saveCertificatesToIndexedDB,
  getCertificatesFromIndexedDB,
  markCertificateAsPendingUpdate,
  syncPendingRecordsWithServer,
  IndexedDBCertificateRecord,
  CertificateSyncStatus
} from '../services/certificateIndexedDB';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import { exportElementAsJpg, exportElementAsPdf, directPrintElement } from '../utils/exportImage';
import { Volunteer, DonationRecord, TaskRecord, FestivalGreetingRecord } from '../types';
import { FOUNDATION_INFO } from '../data/foundationData';
import { BrandLogo } from './common/BrandLogo';
import { CertificateVerificationQR } from './CertificateVerificationQR';
import { ShaileshPradhanSignature, NgoRoundSeal } from './DigitalSignature';
import { RoyalFourCorners, RoyalCenterFlourish } from './common/RoyalCertificateBorder';
import { OfficialVerifiedBadge } from './common/OfficialVerifiedBadge';

interface DownloadCertificatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreviewVolunteerCert: (vol: Volunteer) => void;
  onPreviewIdCard: (vol: Volunteer) => void;
  onPreviewDonationCert: (don: DonationRecord) => void;
  onPreviewTaskCert: (task: TaskRecord) => void;
  onPreviewFestivalCert: (fest: FestivalGreetingRecord) => void;
  initialPhone?: string;
}

export const DownloadCertificatesModal: React.FC<DownloadCertificatesModalProps> = ({
  isOpen,
  onClose,
  onPreviewVolunteerCert,
  onPreviewIdCard,
  onPreviewDonationCert,
  onPreviewTaskCert,
  onPreviewFestivalCert,
  initialPhone = ''
}) => {
  // Wizard steps: 'phone' -> 'otp' -> 'list'
  const [step, setStep] = useState<'phone' | 'otp' | 'list'>('phone');
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || '8052361666');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Network & Offline Cache States
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [cachedSessionInfo, setCachedSessionInfo] = useState<CachedPhoneSession | null>(null);
  const [offlineRecentPhones, setOfflineRecentPhones] = useState<CachedPhoneSummary[]>([]);
  const [isResyncing, setIsResyncing] = useState<boolean>(false);

  // OTP states
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Certificates list states
  const [certificates, setCertificates] = useState<RegisteredCertificateItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgressMsg, setDownloadProgressMsg] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // IndexedDB Record Sync Tracking States
  const [indexedRecordsMap, setIndexedRecordsMap] = useState<Record<string, IndexedDBCertificateRecord>>({});
  const [editingOfflineItem, setEditingOfflineItem] = useState<RegisteredCertificateItem | null>(null);
  const [offlineEditNote, setOfflineEditNote] = useState<string>('');
  const [offlineEditRecipientName, setOfflineEditRecipientName] = useState<string>('');

  // Server QR Verification Inspection & Security Seal Modal States
  const [inspectingVerification, setInspectingVerification] = useState<ServerVerificationResult | null>(null);
  const [isVerifyingCardId, setIsVerifyingCardId] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Refresh IndexedDB record map
  const refreshIndexedDbMap = async (phoneToQuery?: string) => {
    try {
      const cleanPhone = normalizePhoneNumber(phoneToQuery || phoneNumber);
      if (!cleanPhone) return;
      const records = await getCertificatesFromIndexedDB(cleanPhone);
      const map: Record<string, IndexedDBCertificateRecord> = {};
      records.forEach((r) => {
        map[r.id] = r;
      });
      setIndexedRecordsMap(map);
    } catch (err) {
      console.warn('Error fetching records from IndexedDB:', err);
    }
  };

  // Hidden export render reference
  const hiddenVolunteerCertRef = useRef<HTMLDivElement>(null);
  const hiddenIdCardRef = useRef<HTMLDivElement>(null);
  const hiddenDonationCertRef = useRef<HTMLDivElement>(null);
  const hiddenTaskCertRef = useRef<HTMLDivElement>(null);
  const hiddenFestivalCertRef = useRef<HTMLDivElement>(null);

  // Active item being exported offscreen
  const [activeExportItem, setActiveExportItem] = useState<RegisteredCertificateItem | null>(null);

  // Listen for online/offline connectivity changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      const activePhone = initialPhone && initialPhone.length >= 10 ? normalizePhoneNumber(initialPhone) : phoneNumber;
      setPhoneNumber(activePhone);
      setPhoneError(null);
      setOtpError(null);
      setOtp(['', '', '', '']);
      setOtpLoading(false);
      setResendTimer(30);
      setCanResend(false);
      setDownloadProgressMsg(null);
      setDownloadingId(null);
      setIsResyncing(false);
      setEditingOfflineItem(null);

      // Load cached phone summaries from localStorage
      const summaries = getAllOfflineCachedPhoneSummaries();
      setOfflineRecentPhones(summaries);

      // Check if current phone has cached certificates
      const cached = getOfflineCachedCertificates(activePhone);
      if (cached) {
        setCachedSessionInfo(cached);
      } else {
        setCachedSessionInfo(null);
      }

      refreshIndexedDbMap(activePhone);
      setStep('phone');
    }
  }, [isOpen, initialPhone]);

  // Timer countdown for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, step, resendTimer]);

  if (!isOpen) return null;

  // Quick preset phone numbers
  const handleQuickNumberSelect = (num: string) => {
    setPhoneNumber(num);
    setPhoneError(null);
    const clean = normalizePhoneNumber(num);
    const cached = getOfflineCachedCertificates(clean);
    if (cached) {
      setCachedSessionInfo(cached);
    } else {
      setCachedSessionInfo(null);
    }
  };

  // Mandatory OTP flow when selecting any number or cached session
  const handleSelectNumberAndSendOtp = (targetPhone?: string) => {
    const clean = normalizePhoneNumber(targetPhone || phoneNumber);
    if (!clean || clean.length < 10) {
      setPhoneError('⚠️ कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें (e.g. 8052361666)');
      return;
    }

    setPhoneNumber(clean);
    setPhoneError(null);
    setOtp(['', '', '', '']);
    setOtpError(null);
    setResendTimer(30);
    setCanResend(false);
    const cached = getOfflineCachedCertificates(clean);
    setCachedSessionInfo(cached);
    setStep('otp');

    setTimeout(() => {
      document.getElementById('dl-otp-input-0')?.focus();
    }, 100);
  };

  // Force re-sync with server & refresh local offline cache
  const handleResyncWithServer = async () => {
    setIsResyncing(true);
    try {
      const clean = normalizePhoneNumber(phoneNumber);
      const records = getCertificatesByPhone(clean);
      if (records.length > 0) {
        const saved = savePhoneCertificatesToOfflineCache(clean, records, 'online_synced');
        await syncPendingRecordsWithServer(clean);
        await saveCertificatesToIndexedDB(clean, records, 'synced', true);
        setCachedSessionInfo(saved);
      }
      setCertificates(records);
      await refreshIndexedDbMap(clean);
      setOfflineRecentPhones(getAllOfflineCachedPhoneSummaries());
      setDownloadProgressMsg('✅ सर्वर से डेटा सिंक सम्पन्न!');
      setTimeout(() => setDownloadProgressMsg(null), 3500);
    } catch (e) {
      console.warn('Resync warning:', e);
    } finally {
      setIsResyncing(false);
    }
  };

  // Open Offline Edit Modal
  const handleOpenOfflineEditModal = (item: RegisteredCertificateItem) => {
    setEditingOfflineItem(item);
    setOfflineEditNote(item.details || item.categoryOrPurpose || '');
    setOfflineEditRecipientName(item.recipientName || '');
  };

  // Save Offline Edit to IndexedDB as 'pending_update'
  const handleSaveOfflineEdit = async () => {
    if (!editingOfflineItem) return;
    const certId = editingOfflineItem.id;
    const updatedName = offlineEditRecipientName.trim() || editingOfflineItem.recipientName;
    const updatedDetails = offlineEditNote.trim();

    // 1. Mark in IndexedDB as pending_update
    await markCertificateAsPendingUpdate(
      certId,
      {
        recipientName: updatedName,
        details: updatedDetails
      },
      'ऑफ़लाइन संपादन व नोट अद्यतन'
    );

    // 2. Update local state
    setCertificates((prev) =>
      prev.map((c) => (c.id === certId ? { ...c, recipientName: updatedName, details: updatedDetails } : c))
    );

    // 3. Refresh IndexedDB record map
    await refreshIndexedDbMap(phoneNumber);

    setDownloadProgressMsg(`🟡 प्रमाण पत्र ${certId} में स्थानीय बदलाव IndexedDB में सुरक्षित हुआ (लंबित सिंक)`);
    setTimeout(() => setDownloadProgressMsg(null), 3500);
    setEditingOfflineItem(null);
  };

  // Step 1: Send OTP
  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPhoneError(null);

    const clean = normalizePhoneNumber(phoneNumber);
    if (!clean || clean.length < 10) {
      setPhoneError('⚠️ कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें (e.g. 8052361666)');
      return;
    }

    setPhoneNumber(clean);
    const cached = getOfflineCachedCertificates(clean);
    if (cached) {
      setCachedSessionInfo(cached);
    }

    setResendTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '']);
    setStep('otp');

    setTimeout(() => {
      document.getElementById('dl-otp-input-0')?.focus();
    }, 100);
  };

  // Step 2: Handle OTP input changes
  const handleOtpChange = (val: string, index: number) => {
    const cleanVal = val.replace(/\D/g, '');
    if (!cleanVal && val !== '') return;

    const char = cleanVal.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);
    setOtpError(null);

    if (char && index < 3) {
      document.getElementById(`dl-otp-input-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`dl-otp-input-${index - 1}`)?.focus();
    }
  };

  const handleResendOtp = () => {
    setResendTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '']);
    setOtpError('✓ नया 4-अंकीय OTP पुनः प्रेषित किया गया (डेमो OTP: 1234)');
    setTimeout(() => {
      document.getElementById('dl-otp-input-0')?.focus();
    }, 100);
  };

  // Verify OTP and load records strictly for authentic registered certificates
  const handleVerifyOtp = () => {
    const entered = otp.join('');
    if (entered.length < 4) {
      setOtpError('⚠️ कृपया पूर्ण 4-अंकीय OTP दर्ज करें।');
      return;
    }

    setOtpLoading(true);
    setOtpError(null);

    setTimeout(() => {
      setOtpLoading(false);
      const cleanPhone = normalizePhoneNumber(phoneNumber);

      // Check if we have cached records for this phone
      const cached = getOfflineCachedCertificates(cleanPhone);
      let records: RegisteredCertificateItem[] = [];

      if (!isOnline && cached && Array.isArray(cached.certificates) && cached.certificates.length > 0) {
        const cleanCerts = cached.certificates.filter((c) => !isDummyCertificate(c));
        if (cleanCerts.length > 0) {
          records = cleanCerts;
          setCachedSessionInfo(cached);
        }
      } else {
        // Standard registry fetch
        records = getCertificatesByPhone(cleanPhone);
        if (records.length > 0) {
          const saved = savePhoneCertificatesToOfflineCache(cleanPhone, records, isOnline ? 'online_synced' : 'offline_fallback');
          setCachedSessionInfo(saved);
        } else {
          setCachedSessionInfo(null);
        }
      }

      if (records.length > 0) {
        saveCertificatesToIndexedDB(cleanPhone, records, isOnline ? 'synced' : 'locally_cached', isOnline).then(() => {
          refreshIndexedDbMap(cleanPhone);
        });
      }

      setCertificates(records);
      setOfflineRecentPhones(getAllOfflineCachedPhoneSummaries());
      setStep('list');
    }, 500);
  };

  // Filter and search
  const filteredCertificates = certificates.filter((item) => {
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    const matchesSearch =
      searchTerm.trim() === '' ||
      item.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.titleHindi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.categoryOrPurpose && item.categoryOrPurpose.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  // Action: Preview certificate in existing full modal
  const handlePreview = (item: RegisteredCertificateItem) => {
    if (item.type === 'volunteer_cert') {
      const vol = item.rawVolunteer || {
        id: item.id,
        name: item.recipientName,
        fatherName: item.fatherOrHusbandName || 'श्री समाज सेवी',
        role: 'Dedicated Swayam Sewak',
        area: item.categoryOrPurpose || 'Shiksha & Samajik Sewa',
        areaHindi: item.categoryOrPurpose || 'शिक्षा एवं सामाजिक सेवा',
        hoursContributed: 48,
        tasksCompleted: 8,
        joinDate: item.issueDate,
        status: 'active',
        phone: `+91-${item.phone}`,
        photoUrl: item.photoUrl
      };
      onPreviewVolunteerCert(vol);
    } else if (item.type === 'volunteer_id') {
      const vol = item.rawVolunteer || {
        id: item.id.replace('JJF-ID-', ''),
        name: item.recipientName,
        fatherName: item.fatherOrHusbandName || 'श्री समाज सेवी',
        role: 'Dedicated Swayam Sewak',
        area: item.categoryOrPurpose || 'Shiksha & Samajik Sewa',
        areaHindi: item.categoryOrPurpose || 'शिक्षा एवं सामाजिक सेवा',
        hoursContributed: 48,
        tasksCompleted: 8,
        joinDate: item.issueDate,
        status: 'active',
        bloodGroup: 'O+',
        phone: `+91-${item.phone}`,
        photoUrl: item.photoUrl
      };
      onPreviewIdCard(vol);
    } else if (item.type === 'donation_80g') {
      const don: DonationRecord = item.rawDonation || {
        id: item.id,
        donorName: item.recipientName,
        fatherName: item.fatherOrHusbandName,
        amount: item.amount || 2100,
        date: item.issueDate,
        purpose: item.categoryOrPurpose || 'Child Education & Welfare',
        purposeHindi: item.categoryOrPurpose || 'गरीब बच्चों की शिक्षा व जन-कल्याण',
        phone: `+91-${item.phone}`,
        taxExemptEligible: true,
        paymentMode: 'UPI / Bank',
        transactionRef: `UPI-JJF-${item.id.replace(/\D/g, '') || '98765432'}`
      };
      onPreviewDonationCert(don);
    } else if (item.type === 'task_appreciation') {
      const task = item.rawTask || {
        id: item.id.replace('JJF-APP-', ''),
        title: item.titleEnglish,
        titleHindi: item.titleHindi,
        category: 'education',
        location: 'Ghazipur, Uttar Pradesh',
        date: item.issueDate,
        points: 150,
        hours: 120,
        status: 'completed',
        description: item.details || 'उत्कृष्ट समाज सेवा व निःशुल्क शिक्षा योगदान',
        photoUrl: item.photoUrl
      };
      onPreviewTaskCert(task);
    } else if (item.type === 'festival_greeting') {
      const fest = item.rawGreeting || {
        id: item.id,
        festivalId: 'diwali',
        festivalNameHindi: item.categoryOrPurpose || 'दीपावली महापर्व 2026',
        festivalNameEnglish: 'Deepavali Festival',
        recipientName: item.recipientName,
        recipientTitle: item.fatherOrHusbandName || 'सम्मानित नागरिक',
        senderName: 'जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर, उत्तर प्रदेश, भारत',
        phone: item.phone,
        city: 'Ghazipur',
        date: item.issueDate,
        customMessage: 'जीवन ज्योति फाउंडेशन की ओर से आपको एवं आपके समस्त परिवार को हार्दिक बधाई एवं मंगलकामनाएं।',
        shloka: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः।',
        category: 'religious',
        symbolEmoji: '🪔',
        photoUrl: item.photoUrl
      };
      onPreviewFestivalCert(fest);
    }
  };

  // Direct Download Trigger with mandatory Server-Side Firebase Admin QR verification step
  const handleDirectDownload = async (item: RegisteredCertificateItem, format: 'jpg' | 'pdf') => {
    setActiveExportItem(item);
    setDownloadingId(`${item.id}-${format}`);
    setVerificationError(null);
    setDownloadProgressMsg(`🔐 Firebase Admin SDK द्वारा QR व प्रमाण पत्र आईडी का सत्यापन हो रहा है (ID: ${item.id})...`);

    try {
      // Step 1: Server-Side QR Verification step using Firebase Admin SDK matching generated certificate ID against Firestore database
      const qrUrl = `https://jeevanjyotifoundation.org/?verify=${encodeURIComponent(item.id)}`;
      const verifyResult = await verifyCertificateWithServerQR(item.id, qrUrl, format, item);

      if (!verifyResult.verified || !verifyResult.authorized) {
        setVerificationError(verifyResult.message || 'Firebase Admin सत्यापन विफल: यह प्रमाण पत्र संस्था के अधिकृत डेटाबेस में नहीं मिला।');
        setDownloadProgressMsg('⛔ Firebase Admin सत्यापन अस्वीकृत: डाउनलोड की अनुमति नहीं है।');
        setDownloadingId(null);
        return;
      }

      const sealToken = verifyResult.verificationSeal?.token || 'SEAL-VALID';
      setDownloadProgressMsg(`✅ Firebase Admin सत्यापन 100% सफल (Seal: ${sealToken.slice(0, 10)}...) | ${format.toUpperCase()} तैयार हो रहा है...`);

      // Allow 350ms for the DOM to render activeExportItem
      await new Promise((resolve) => setTimeout(resolve, 350));

      let targetElem: HTMLElement | null = null;
      const baseFileName = `${item.id}_${item.recipientName.replace(/\s+/g, '_')}`;

      if (item.type === 'volunteer_cert') {
        targetElem = hiddenVolunteerCertRef.current;
      } else if (item.type === 'volunteer_id') {
        targetElem = hiddenIdCardRef.current;
      } else if (item.type === 'donation_80g') {
        targetElem = hiddenDonationCertRef.current;
      } else if (item.type === 'task_appreciation') {
        targetElem = hiddenTaskCertRef.current;
      } else if (item.type === 'festival_greeting') {
        targetElem = hiddenFestivalCertRef.current;
      }

      if (!targetElem) {
        // Fallback to preview modal
        handlePreview(item);
        setDownloadingId(null);
        setDownloadProgressMsg(null);
        return;
      }

      let success = false;
      if (format === 'jpg') {
        success = await exportElementAsJpg(targetElem, `${baseFileName}.jpg`, {
          pixelRatio: 3,
          quality: 0.98,
          backgroundColor: '#FFFDF8'
        });
      } else {
        success = await exportElementAsPdf(targetElem, `${baseFileName}.pdf`, {
          orientation: item.type === 'volunteer_id' ? 'portrait' : 'landscape'
        });
      }

      if (success) {
        setDownloadProgressMsg(`✅ ${format.toUpperCase()} सफलतापूर्वक डाउनलोड हो गया! (Firebase Admin SDK द्वारा सत्यापित)`);
        setTimeout(() => {
          setDownloadProgressMsg(null);
        }, 4000);
      } else {
        setDownloadProgressMsg('⚠️ डाउनलोड में समस्या आई, कृपया "देखें" बटन से डाउनलोड करें।');
      }
    } catch (err) {
      console.error('Download error during server QR verification:', err);
      setDownloadProgressMsg('⚠️ सत्यापन या डाउनलोड में त्रुटि आई। कृपया पुनः प्रयास करें।');
    } finally {
      setDownloadingId(null);
    }
  };

  // Live Server QR & Database verification inspection
  const handleInspectServerQR = async (item: RegisteredCertificateItem) => {
    setIsVerifyingCardId(item.id);
    try {
      const qrUrl = `https://jeevanjyotifoundation.org/?verify=${encodeURIComponent(item.id)}`;
      const result = await verifyCertificateWithServerQR(item.id, qrUrl, 'preview', item);
      setInspectingVerification(result);
    } catch (e) {
      console.error('Inspection failed:', e);
    } finally {
      setIsVerifyingCardId(null);
    }
  };

  // Direct Print with Firebase Admin Verification
  const handleDirectPrint = async (item: RegisteredCertificateItem) => {
    setActiveExportItem(item);
    setVerificationError(null);
    const qrUrl = `https://jeevanjyotifoundation.org/?verify=${encodeURIComponent(item.id)}`;
    const verifyResult = await verifyCertificateWithServerQR(item.id, qrUrl, 'preview', item);
    if (!verifyResult.verified || !verifyResult.authorized) {
      setVerificationError('Firebase Admin सत्यापन विफल: मुद्रण की अनुमति नहीं है।');
      return;
    }

    setTimeout(() => {
      let targetElem: HTMLElement | null = null;
      if (item.type === 'volunteer_cert') targetElem = hiddenVolunteerCertRef.current;
      else if (item.type === 'volunteer_id') targetElem = hiddenIdCardRef.current;
      else if (item.type === 'donation_80g') targetElem = hiddenDonationCertRef.current;
      else if (item.type === 'task_appreciation') targetElem = hiddenTaskCertRef.current;
      else if (item.type === 'festival_greeting') targetElem = hiddenFestivalCertRef.current;

      directPrintElement(targetElem);
    }, 300);
  };

  // Direct WhatsApp Share
  const handleShareWhatsApp = (item: RegisteredCertificateItem) => {
    const text = `*जीवन ज्योति फाउंडेशन (रजि. ग़ाज़ीपुर, उत्तर प्रदेश, भारत)*\n\n📜 *${item.titleHindi}*\n👤 धारक: ${item.recipientName}\n🆔 प्रमाण पत्र संख्या: ${item.id}\n📅 जारी दिनांक: ${item.issueDate}\n\n🔍 अधिकृत ऑनलाइन सत्यापन लिंक:\nhttps://jeevanjyotifoundation.org/verify?cert_id=${encodeURIComponent(item.id)}\n\n✨ नीति आयोग दर्पण एवं समाज कल्याण पंजीकृत संस्था।`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // Copy ID
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper Badge Color
  const getTypeBadge = (type: CertificateCategoryType) => {
    switch (type) {
      case 'volunteer_cert':
        return {
          label: 'स्वयंसेवक प्रमाण पत्र',
          icon: <Award className="w-3.5 h-3.5" />,
          color: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'volunteer_id':
        return {
          label: 'स्वयंसेवक ID कार्ड',
          icon: <UserCheck className="w-3.5 h-3.5" />,
          color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
        };
      case 'donation_80g':
        return {
          label: 'दान रसीद व प्रशस्ति पत्र',
          icon: <FileText className="w-3.5 h-3.5" />,
          color: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      case 'task_appreciation':
        return {
          label: 'कार्य प्रशंसा पत्र',
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
          color: 'bg-amber-100 text-amber-800 border-amber-200'
        };
      case 'festival_greeting':
        return {
          label: 'पावन पर्व शुभकामना',
          icon: <Sparkles className="w-3.5 h-3.5" />,
          color: 'bg-orange-100 text-orange-800 border-orange-200'
        };
    }
  };

  const filterTabs = [
    { key: 'all', label: 'सभी दस्तावेज़ (All)', count: certificates.length },
    { key: 'volunteer_cert', label: '🎖️ स्वयंसेवक प्रमाण पत्र', count: certificates.filter((c) => c.type === 'volunteer_cert').length },
    { key: 'volunteer_id', label: '🪪 स्वयंसेवक ID कार्ड', count: certificates.filter((c) => c.type === 'volunteer_id').length },
    { key: 'donation_80g', label: '📜 दान रसीद', count: certificates.filter((c) => c.type === 'donation_80g').length },
    { key: 'task_appreciation', label: '🌟 कार्य प्रशंसा पत्र', count: certificates.filter((c) => c.type === 'task_appreciation').length },
    { key: 'festival_greeting', label: '🪔 पर्व शुभकामना पत्र', count: certificates.filter((c) => c.type === 'festival_greeting').length }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs overflow-y-auto overscroll-contain no-print">
      <div className="min-h-full flex items-center justify-center p-2 sm:p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-r from-[#8B0000] via-orange-700 to-amber-700 text-white border-b-2 border-yellow-400">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 text-yellow-300 shadow-inner">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-black text-base sm:text-lg text-white leading-tight">
                  प्रमाण पत्र एवं पहचान पत्र डाउनलोड केंद्र
                </h3>
                <p className="text-[11px] sm:text-xs text-amber-100 font-medium">
                  Official Citizen & Volunteer Certificate Download Portal (JPG / PDF)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Sync Status Indicator for IndexedDB & Server */}
              <SyncStatusIndicator
                currentPhone={phoneNumber}
                isOnline={isOnline}
                onSyncComplete={() => refreshIndexedDbMap(phoneNumber)}
                compact={false}
              />

              {/* Online / Offline Connectivity Pill */}
              {isOnline ? (
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-900/60 border border-emerald-400/40 text-emerald-200 rounded-xl text-[11px] font-bold">
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ऑनलाइन</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/90 border-2 border-yellow-400 text-yellow-300 rounded-xl text-[11px] font-black animate-pulse">
                  <WifiOff className="w-3.5 h-3.5 text-yellow-300" />
                  <span>ऑफ़लाइन मोड (Offline)</span>
                </div>
              )}

              <button
                onClick={onClose}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-colors cursor-pointer"
                title="बंद करें"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Download feedback progress banner */}
          {downloadProgressMsg && (
            <div className="px-4 py-2.5 bg-amber-900 text-amber-100 text-xs font-bold flex items-center justify-between border-b border-amber-800 animate-in fade-in">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
                <span>{downloadProgressMsg}</span>
              </div>
              <button
                onClick={() => setDownloadProgressMsg(null)}
                className="text-amber-300 hover:text-white underline text-[11px]"
              >
                छुपाएं
              </button>
            </div>
          )}

          {/* Body Content by Step */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50">
            {/* STEP 1: MOBILE NUMBER ENTRY */}
            {step === 'phone' && (
              <div className="max-w-md mx-auto py-4 sm:py-6 text-center space-y-5">
                <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center mx-auto text-amber-800 shadow-md">
                  <Smartphone className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-lg sm:text-xl font-black text-slate-900 font-serif">
                    पंजीकृत मोबाइल नंबर दर्ज करें
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    रजिस्ट्रेशन में दिए गए मोबाइल नंबर पर OTP सत्यापन के बाद आपके सभी जारी प्रमाण पत्र व पहचान पत्र उपलब्ध होंगे।
                  </p>
                </div>

                {/* Offline Mode Alert if disconnected */}
                {!isOnline && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-left flex items-start gap-3 shadow-xs">
                    <WifiOff className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <p className="font-black text-amber-900">ऑफ़लाइन सेवा सक्रिय (Offline Ready)</p>
                      <p className="text-amber-800 leading-relaxed">
                        इंटरनेट या मोबाइल नेटवर्क बाधित होने पर भी आप पूर्व सत्यापित रिकॉर्ड तुरंत देख, प्रिंट एवं उच्च गुणवत्ता (JPG/PDF) में डाउनलोड कर सकते हैं।
                      </p>
                    </div>
                  </div>
                )}

                {/* Cached Record Available Quick-Launch Banner */}
                {cachedSessionInfo && cachedSessionInfo.certificates.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-left flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <HardDrive className="w-5 h-5 text-emerald-700 shrink-0" />
                      <div className="text-xs">
                        <span className="font-black text-emerald-900">
                          💾 पंजीकृत रिकॉर्ड उपलब्ध ({cachedSessionInfo.certificates.length} प्रमाण पत्र)
                        </span>
                        <p className="text-[11px] text-emerald-700">
                          सत्यापन स्थिति: अधिकृत • प्रमाण पत्र खोलने हेतु मोबाइल OTP सत्यापन आवश्यक है
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectNumberAndSendOtp(phoneNumber)}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>OTP भेजें व खोलें</span>
                    </button>
                  </div>
                )}

                <form onSubmit={handleSendOtp} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1.5">
                      10-अंकीय पंजीकृत मोबाइल नंबर (Registered Mobile Number) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                        +91 -
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setPhoneNumber(val);
                          setPhoneError(null);
                          const cached = getOfflineCachedCertificates(normalizePhoneNumber(val));
                          setCachedSessionInfo(cached);
                        }}
                        placeholder="8052361666"
                        className="w-full pl-16 pr-4 py-3 bg-white border-2 border-slate-300 focus:border-amber-600 rounded-2xl text-base font-mono font-black focus:outline-none shadow-xs"
                      />
                    </div>
                    {phoneError && (
                      <p className="text-xs font-bold text-red-600 mt-1.5 bg-red-50 p-2 rounded-xl border border-red-200">
                        {phoneError}
                      </p>
                    )}
                  </div>

                  {/* Quick Preset Demo Numbers */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-500">त्वरित परीक्षण हेतु पंजीकृत नंबर चुनें:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {[
                        { num: '8052361666', label: '8052361666 (मुख्य फाउंडेशन)' },
                        { num: '9876543211', label: '9876543211 (आकाश वर्मा)' },
                        { num: '9876543212', label: '9876543212 (पूजा पाण्डेय)' },
                        { num: '9876543213', label: '9876543213 (राहुल यादव)' }
                      ].map((preset) => (
                        <button
                          key={preset.num}
                          type="button"
                          onClick={() => handleQuickNumberSelect(preset.num)}
                          className={`text-[11px] px-2.5 py-1 rounded-xl font-bold border transition-all cursor-pointer ${
                            phoneNumber === preset.num
                              ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-[#8B0000] to-orange-700 hover:from-[#6d0000] hover:to-orange-800 text-white font-black text-sm rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>OTP भेजें एवं आगे बढ़ें (Send Mandatory OTP)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>

                {/* Offline Device Cache History */}
                {offlineRecentPhones.length > 0 && (
                  <div className="pt-3 border-t border-slate-200 text-left space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-700 font-black">
                      <div className="flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-amber-800" />
                        <span>इस डिवाइस पर सहेजे गए पंजीकृत नंबर (Saved Registered Numbers)</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {offlineRecentPhones.length} उपलब्ध
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {offlineRecentPhones.map((sess) => (
                        <div
                          key={sess.phone}
                          onClick={() => handleSelectNumberAndSendOtp(sess.phone)}
                          className="p-2.5 bg-white hover:bg-amber-50/80 rounded-xl border border-slate-200 hover:border-amber-400 transition-all cursor-pointer flex items-center justify-between shadow-2xs group"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <p className="text-xs font-mono font-black text-slate-900 group-hover:text-amber-900">
                              +91-{sess.phone}
                            </p>
                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                              <span>{sess.totalCount} प्रमाण पत्र</span>
                              <span>•</span>
                              <span>OTP सत्यापन आवश्यक</span>
                            </p>
                          </div>
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg group-hover:bg-amber-200 flex items-center gap-1">
                            <KeyRound className="w-3 h-3" />
                            OTP भेजें
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-बिट सुरक्षित अनिवार्य OTP सत्यापन • केवल पंजीकृत नंबर पर अधिकृत</span>
                </div>
              </div>
            )}

            {/* STEP 2: OTP VERIFICATION */}
            {step === 'otp' && (
              <div className="max-w-sm mx-auto py-4 sm:py-6 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center mx-auto text-amber-800 shadow-md">
                  <KeyRound className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="text-lg sm:text-xl font-black text-slate-900 font-serif">
                    अनिवार्य OTP सत्यापन (Mandatory OTP Verification)
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    पंजीकृत मोबाइल <strong>+91-{phoneNumber}</strong> पर भेजा गया 4-अंकीय OTP दर्ज करें।
                  </p>
                </div>

                {/* Change Number Link */}
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>मोबाइल नंबर बदलें</span>
                </button>

                {/* 4-digit PIN Inputs */}
                <div className="flex justify-center gap-2.5 pt-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`dl-otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      className="w-12 h-14 text-center text-2xl font-mono font-black border-2 border-slate-300 focus:border-amber-600 rounded-2xl focus:outline-none bg-white shadow-inner"
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 py-2 px-3 rounded-xl">
                    {otpError}
                  </p>
                )}

                <div className="space-y-2">
                  <button
                    onClick={handleVerifyOtp}
                    disabled={otpLoading || otp.join('').length < 4}
                    className="w-full py-3.5 bg-[#8B0000] hover:bg-[#6b0000] disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>{otpLoading ? 'सत्यापित हो रहा है...' : 'सत्यापित करें व प्रमाण पत्र देखें'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>डेमो OTP: <strong className="text-amber-800 font-mono">1234</strong></span>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>OTP पुनः भेजें</span>
                    </button>
                  ) : (
                    <span>पुनः भेजें: <strong>{resendTimer}s</strong></span>
                  )}
                </div>
              </div>
            )}

            {/* STEP 3: CERTIFICATES & ID CARDS DASHBOARD */}
            {step === 'list' && (
              <div className="space-y-4">
                {/* User Info & Sync Status Bar */}
                <div className="p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-slate-900">
                          पंजीकृत मोबाइल: +91-{phoneNumber}
                        </span>
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                          सत्यापित रिकॉर्ड्स
                        </span>
                        {cachedSessionInfo && (
                          <span className="text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                            <HardDrive className="w-2.5 h-2.5" />
                            <span>ऑफ़लाइन सुरक्षित ({cachedSessionInfo.formattedDate})</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">
                        कुल <strong>{certificates.length}</strong> आधिकारिक प्रमाण पत्र व पहचान पत्र उपलब्ध हैं।
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {isOnline && (
                      <button
                        onClick={handleResyncWithServer}
                        disabled={isResyncing}
                        className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl text-xs font-bold text-amber-900 shadow-2xs cursor-pointer flex items-center gap-1.5"
                        title="सर्वर से नवीनतम रिकॉर्ड रीफ्रेश करें"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-amber-800 ${isResyncing ? 'animate-spin' : ''}`} />
                        <span>{isResyncing ? 'सिंक हो रहा है...' : 'रीफ्रेश सिंक'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => setStep('phone')}
                      className="px-3.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 shadow-2xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                      <span>अन्य नंबर</span>
                    </button>
                  </div>
                </div>

                {/* Filter Tabs & Search Bar */}
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {filterTabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setSelectedFilter(tab.key)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                          selectedFilter === tab.key
                            ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-xs'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                            selectedFilter === tab.key
                              ? 'bg-yellow-400 text-black'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="नाम, प्रमाण पत्र संख्या या कार्य विवरण से खोजें..."
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-amber-600 shadow-2xs"
                    />
                  </div>
                </div>

                {/* Real-time Server QR Verification Progress Banner */}
                {downloadProgressMsg && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-xs flex items-center justify-between gap-3 animate-pulse">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-[#8B0000] shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-[#8B0000]">
                        {downloadProgressMsg}
                      </span>
                    </div>
                    {downloadingId && (
                      <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin shrink-0" />
                    )}
                  </div>
                )}

                {/* Server Verification Error Alert */}
                {verificationError && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border-2 border-red-300 shadow-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-red-800">
                        {verificationError}
                      </span>
                    </div>
                    <button
                      onClick={() => setVerificationError(null)}
                      className="text-xs font-bold text-red-700 hover:text-red-900 bg-white px-2.5 py-1 rounded-lg border border-red-200 cursor-pointer"
                    >
                      खारिज करें
                    </button>
                  </div>
                )}

                {/* Certificates Cards Grid */}
                <div className="space-y-3 pt-1">
                  {filteredCertificates.length > 0 ? (
                    filteredCertificates.map((item) => {
                      const badge = getTypeBadge(item.type);
                      const isDownloading = downloadingId?.startsWith(item.id);
                      const isVerifyingThis = isVerifyingCardId === item.id;

                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-white border-2 border-amber-200/80 hover:border-amber-400 shadow-md hover:shadow-lg transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        >
                          {/* Left Details */}
                          <div className="flex items-start gap-3.5 flex-1 min-w-0">
                            {/* Photo / Avatar */}
                            <div className="relative shrink-0">
                              <img
                                src={item.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                                alt={item.recipientName}
                                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-amber-400 shadow-xs"
                                crossOrigin="anonymous"
                              />
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center border-2 border-white text-[10px]">
                                ✓
                              </div>
                            </div>

                            {/* Details text */}
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${badge.color}`}>
                                  {badge.icon}
                                  <span>{badge.label}</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyId(item.id)}
                                  className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded border border-slate-300 flex items-center gap-1 cursor-pointer"
                                  title="प्रमाण पत्र संख्या कॉपी करें"
                                >
                                  <span>{item.id}</span>
                                  {copiedId === item.id ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : null}
                                </button>
                                
                                {/* IndexedDB Sync Status Indicator Badge */}
                                {(() => {
                                  const indexedRec = indexedRecordsMap[item.id];
                                  const isPending = indexedRec?.syncStatus === 'pending_update';
                                  const isSynced = indexedRec?.syncStatus === 'synced' || (!indexedRec && isOnline);

                                  if (isPending) {
                                    return (
                                      <button
                                        type="button"
                                        onClick={handleResyncWithServer}
                                        className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 cursor-pointer hover:bg-amber-200 shadow-2xs transition"
                                        title="स्थानीय ऑफ़लाइन बदलाव IndexedDB में सुरक्षित हैं, तुरंत सर्वर से सिंक करने हेतु क्लिक करें"
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                                        <span>🟡 ऑफ़लाइन बदलाव लंबित (Pending Sync)</span>
                                      </button>
                                    );
                                  }

                                  if (isSynced) {
                                    return (
                                      <span
                                        className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1 shadow-2xs"
                                        title="सर्वर एवं IndexedDB डेटाबेस से पूर्णतः सिंक्रनाइज़्ड है"
                                      >
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                        <span>सर्वर सिंक ✓</span>
                                      </span>
                                    );
                                  }

                                  return (
                                    <span
                                      className="text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1 shadow-2xs"
                                      title="IndexedDB ब्राउज़र स्टोरेज में सुरक्षित"
                                    >
                                      <HardDrive className="w-3 h-3 text-indigo-600" />
                                      <span>IndexedDB सुरक्षित</span>
                                    </span>
                                  );
                                })()}

                                {/* Live Server & Firebase QR Verification Badge/Button */}
                                <button
                                  type="button"
                                  onClick={() => handleInspectServerQR(item)}
                                  disabled={isVerifyingThis}
                                  className="text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                  title="सर्वर व फायरबेस डेटाबेस से QR कोड का लाइव सत्यापन देखें"
                                >
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  <span>{isVerifyingThis ? 'सत्यापित हो रहा है...' : 'फायरबेस QR सत्यापित ✓'}</span>
                                </button>
                              </div>

                              <h4 className="text-sm sm:text-base font-black text-slate-900 truncate">
                                {item.recipientName}
                              </h4>

                              <p className="text-xs text-slate-600 line-clamp-1">
                                {item.fatherOrHusbandName ? `पिता/पति: ${item.fatherOrHusbandName} • ` : ''}
                                {item.categoryOrPurpose || item.details}
                              </p>

                              <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                                <span>जारी दिनांक: <strong className="text-slate-700">{item.issueDate}</strong></span>
                                {item.amount ? (
                                  <span className="font-bold text-[#8B0000]">
                                    राशि: ₹{item.amount.toLocaleString('en-IN')} (सत्यापित)
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>

                          {/* Right Action Buttons */}
                          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                            {/* 1. Preview / View Button */}
                            <button
                              type="button"
                              onClick={() => handlePreview(item)}
                              className="flex-1 sm:flex-none px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300"
                              title="प्रमाण पत्र देखें व संपादन करें"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-700" />
                              <span>देखें</span>
                            </button>

                            {/* 2. Offline Edit / Sync Test Note Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenOfflineEditModal(item)}
                              className="flex-1 sm:flex-none px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl font-bold text-xs shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-amber-300"
                              title="ऑफ़लाइन नोट या विवरण जोड़ें (IndexedDB Sync Test)"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                              <span>ऑफ़लाइन नोट</span>
                            </button>

                            {/* 3. Download JPG Button */}
                            <button
                              type="button"
                              disabled={isDownloading}
                              onClick={() => handleDirectDownload(item, 'jpg')}
                              className="flex-1 sm:flex-none px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                              title="सर्वर-साइड QR व डेटाबेस सत्यापन के बाद उच्च गुणवत्ता JPG इमेज डाउनलोड करें"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>{isDownloading && downloadingId?.endsWith('jpg') ? 'सत्यापन...' : 'JPG'}</span>
                            </button>

                            {/* 4. Download PDF Button */}
                            <button
                              type="button"
                              disabled={isDownloading}
                              onClick={() => handleDirectDownload(item, 'pdf')}
                              className="flex-1 sm:flex-none px-3 py-2 bg-[#8B0000] hover:bg-[#6b0000] text-white rounded-xl font-black text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                              title="सर्वर-साइड QR व डेटाबेस सत्यापन के बाद A4 प्रिंटेबल PDF डाउनलोड करें"
                            >
                              <FileText className="w-3.5 h-3.5 text-yellow-300" />
                              <span>{isDownloading && downloadingId?.endsWith('pdf') ? 'सत्यापन...' : 'PDF'}</span>
                            </button>

                            {/* 5. WhatsApp Share */}
                            <button
                              type="button"
                              onClick={() => handleShareWhatsApp(item)}
                              className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
                              title="WhatsApp पर शेयर करें"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>

                            {/* 6. Print */}
                            <button
                              type="button"
                              onClick={() => handleDirectPrint(item)}
                              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl transition-colors cursor-pointer"
                              title="प्रिंट करें"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
                      <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                      <h5 className="text-sm font-bold text-slate-800">
                        इस श्रेणी में कोई प्रमाण पत्र नहीं मिला
                      </h5>
                      <p className="text-xs text-slate-500">
                        कृपया अन्य श्रेणी चुनें या खोज फ़ील्ड साफ़ करें।
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="px-6 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>जीवन ज्योति फाउंडेशन • रजि. सं.: 2004/2014-2015 • नीति आयोग UID: UP/2018/0207700</span>
            </div>
            <div className="flex items-center gap-3 font-semibold text-slate-700">
              <span>पंजीकरण संख्या: {FOUNDATION_INFO.regNo}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SERVER QR VERIFICATION DETAILS INSPECTION MODAL */}
      {/* ========================================================================= */}
      {inspectingVerification && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border-2 border-emerald-500 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/30 border border-emerald-400 flex items-center justify-center text-emerald-200 shadow-inner">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black font-serif flex items-center gap-2">
                    <span>सर्वर व फायरबेस QR सत्यापन रिपोर्ट</span>
                  </h3>
                  <p className="text-[11px] text-emerald-200">
                    Live Server-Side Database Match & Cryptographic Seal
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectingVerification(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto bg-slate-50/50 text-slate-800 text-xs">
              {/* Verification Status Badge */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-black text-emerald-900">
                    प्रमाण पत्र 100% वैध एवं डेटाबेस में अधिकृत है (Verified & Authentic)
                  </h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    {inspectingVerification.message}
                  </p>
                </div>
              </div>

              {/* Matched Details Grid */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">प्रमाण पत्र आईडी (ID):</span>
                  <span className="font-mono font-black text-slate-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {inspectingVerification.certificateId}
                  </span>
                </div>

                {inspectingVerification.recipientName && (
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">धारक का नाम (Recipient):</span>
                    <span className="font-bold text-slate-900">
                      {inspectingVerification.recipientName}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">डेटाबेस स्थिति (Database Status):</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                    {inspectingVerification.databaseStatus || 'MATCHED_AND_AUTHENTICATED'}
                  </span>
                </div>

                {inspectingVerification.verificationSeal && (
                  <>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">सुरक्षा सील टोकन (HMAC Token):</span>
                      <span className="font-mono text-[10px] text-slate-700 max-w-[200px] truncate bg-slate-100 px-2 py-0.5 rounded">
                        {inspectingVerification.verificationSeal.token}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">फायरबेस रिपोजिटरी (Firestore Path):</span>
                      <span className="font-mono text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {inspectingVerification.verificationSeal.databaseRef}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">सर्वर टाइमस्टैम्प (Timestamp):</span>
                      <span className="font-mono text-[10px] text-slate-600">
                        {new Date(inspectingVerification.verificationSeal.serverTimestamp).toLocaleString('hi-IN')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">जारीकर्ता अधिकरण (Authority):</span>
                      <span className="font-bold text-amber-900">
                        {inspectingVerification.verificationSeal.authority}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-slate-500 text-[10px]">नीति आयोग UID</p>
                        <p className="font-bold font-mono text-slate-900">{inspectingVerification.verificationSeal.nitiAayogUid}</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-slate-500 text-[10px]">पंजीकरण स्थिति</p>
                        <p className="font-bold font-mono text-slate-900">{FOUNDATION_INFO.regNo}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* QR Verification Link Box */}
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-amber-950">
                    आधिकारिक सार्वजनिक सत्यापन यूआरएल:
                  </p>
                  <p className="text-[10px] font-mono text-amber-800 truncate">
                    https://jeevanjyotifoundation.org/?verify={inspectingVerification.certificateId}
                  </p>
                </div>
                <CertificateVerificationQR
                  certificateId={inspectingVerification.certificateId}
                  size={50}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInspectingVerification(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl cursor-pointer"
                >
                  बंद करें
                </button>
                {inspectingVerification.matchedRecord && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const rec = inspectingVerification.matchedRecord;
                        setInspectingVerification(null);
                        handleDirectDownload(rec, 'jpg');
                      }}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>JPG डाउनलोड</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const rec = inspectingVerification.matchedRecord;
                        setInspectingVerification(null);
                        handleDirectDownload(rec, 'pdf');
                      }}
                      className="px-4 py-2 bg-[#8B0000] hover:bg-[#6b0000] text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>PDF डाउनलोड</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OFFLINE RECORD NOTE & EDIT MODAL (FOR TESTING & DEMOING INDEXEDDB SYNC) */}
      {/* ========================================================================= */}
      {editingOfflineItem && (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border-2 border-amber-400 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-amber-700 via-orange-800 to-amber-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/30 border border-amber-300 flex items-center justify-center text-yellow-300 shadow-inner">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black font-serif">
                    ऑफ़लाइन संपादन एवं स्थानीय नोट (IndexedDB)
                  </h3>
                  <p className="text-xs text-amber-200">
                    प्रमाण पत्र: {editingOfflineItem.id}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingOfflineItem(null)}
                className="p-1 text-white/80 hover:text-white hover:bg-white/20 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 bg-slate-50">
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>IndexedDB Sync Status:</strong> आप ऑफ़लाइन होने पर भी यहाँ विवरण या नोट अपडेट कर सकते हैं। यह बदलाव तुरंत <strong>IndexedDB (pending_update)</strong> में दर्ज होगा और ऑनलाइन आते ही स्वतः सर्वर से सिंक हो जाएगा।
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  धारक का नाम (Recipient Name):
                </label>
                <input
                  type="text"
                  value={offlineEditRecipientName}
                  onChange={(e) => setOfflineEditRecipientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-600 shadow-2xs"
                  placeholder="धारक का नाम दर्ज करें"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  कार्य विवरण / स्थानीय टिप्पणी (Offline Note / Purpose):
                </label>
                <textarea
                  rows={3}
                  value={offlineEditNote}
                  onChange={(e) => setOfflineEditNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-600 shadow-2xs"
                  placeholder="उदा. सामाजिक सेवा शिविर में विशेष योगदान / स्थानीय सत्यापन पूर्ण"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">
                  स्थिति: {isOnline ? '🟢 इंटरनेट सक्रिय' : '🟡 ऑफ़लाइन मोड'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingOfflineItem(null)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveOfflineEdit}
                    className="px-4 py-2 bg-[#8B0000] hover:bg-[#6b0000] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                    <span>IndexedDB में सुरक्षित करें</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HIDDEN OFFSCREEN RENDER ENGINES FOR DIRECT HIGH-RES JPG/PDF DOWNLOAD */}
      {/* ========================================================================= */}
      <div
        className="fixed left-[-9999px] top-[-9999px] overflow-hidden pointer-events-none opacity-100"
        aria-hidden="true"
      >
        {activeExportItem && (
          <div>
            {/* 1. Volunteer Certificate Hidden Render */}
            <div
              ref={hiddenVolunteerCertRef}
              id="hidden-volunteer-cert"
              className="w-[1050px] min-h-[740px] bg-[#FFFDF8] p-7 relative text-slate-900 font-serif shadow-2xl"
              style={{
                border: '9px solid #8B0000',
                outline: '2.5px solid #D4AF37',
                outlineOffset: '-7px'
              }}
            >
              <RoyalFourCorners />
              <div className="relative z-10 text-center flex flex-col items-center justify-between min-h-[670px]">
                {/* Header */}
                <div className="w-full flex items-center justify-between border-b-2 border-amber-300 pb-3">
                  <BrandLogo size="md" />
                  <div className="text-center flex-1 px-4">
                    <h2 className="text-2xl font-black text-[#8B0000] tracking-wide">
                      {FOUNDATION_INFO.nameHindi}
                    </h2>
                    <p className="text-sm font-bold text-amber-900">{FOUNDATION_INFO.nameEnglish}</p>
                    <p className="text-[11px] text-slate-600">{FOUNDATION_INFO.address}</p>
                  </div>
                  <div className="text-right text-[11px] font-mono font-bold text-slate-700">
                    <p>प्रमाण पत्र सं: {activeExportItem.id}</p>
                    <p>दिनांक: {activeExportItem.issueDate}</p>
                  </div>
                </div>

                <RoyalCenterFlourish />

                <div className="my-2">
                  <span className="px-6 py-1.5 bg-[#8B0000] text-yellow-300 text-lg font-black tracking-wider uppercase rounded-full shadow-md">
                    सेवा समर्पण एवं स्वयंसेवक प्रमाण पत्र
                  </span>
                </div>

                {/* Recipient info & photo */}
                <div className="w-full my-4 flex items-center justify-center gap-6 px-10 text-center">
                  {activeExportItem.photoUrl && (
                    <img
                      src={activeExportItem.photoUrl}
                      alt={activeExportItem.recipientName}
                      className="w-24 h-28 object-cover rounded-xl border-2 border-amber-600 shadow-md"
                      crossOrigin="anonymous"
                    />
                  )}
                  <div className="space-y-2 flex-1">
                    <p className="text-base text-slate-700 italic">यह प्रमाणित किया जाता है कि</p>
                    <h3 className="text-3xl font-black text-[#8B0000] tracking-wide">
                      {activeExportItem.recipientName}
                    </h3>
                    <p className="text-sm font-bold text-slate-800">
                      {activeExportItem.fatherOrHusbandName ? `पिता / पति: ${activeExportItem.fatherOrHusbandName}` : ''}
                    </p>
                    <p className="text-sm text-slate-700 max-w-xl mx-auto leading-relaxed pt-1">
                      ने जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर (उत्तर प्रदेश, भारत) के अंतर्गत <strong>{activeExportItem.categoryOrPurpose || 'समाज सेवा व शिक्षा'}</strong> के क्षेत्र में निष्ठापूर्वक एवं उत्कृष्ट योगदान दिया है।
                    </p>
                  </div>
                </div>

                {/* Seals & Signatures & Bottom Right Official Verified Badge */}
                <div className="w-full flex items-end justify-between pt-3 border-t-2 border-amber-300 px-6">
                  <div className="text-center">
                    <CertificateVerificationQR
                      certificateId={activeExportItem.id}
                      size="auto"
                    />
                    <p className="text-[9px] font-mono text-slate-500 mt-0.5">QR स्कैन कर सत्यापन करेंp</p>
                  </div>

                  <div className="text-center">
                    <NgoRoundSeal size="auto" />
                  </div>

                  {/* Right: Signature & Bottom-Right Official Verified Badge */}
                  <div className="text-right flex flex-col items-end space-y-1">
                    <div className="text-center w-full">
                      <ShaileshPradhanSignature size="auto" />
                      <p className="text-xs font-black text-slate-900">शैलेश प्रधान (अध्यक्ष)</p>
                      <p className="text-[10px] text-slate-600">जीवन ज्योति फाउंडेशन</p>
                    </div>

                    <OfficialVerifiedBadge
                      certificateId={activeExportItem.id}
                      verificationDate={activeExportItem.issueDate}
                      size="sm"
                      layout="corner"
                      theme="royal"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Volunteer ID Card Hidden Render */}
            <div
              ref={hiddenIdCardRef}
              id="hidden-id-card"
              className="w-[450px] min-h-[640px] bg-[#FFFDF8] p-5 relative text-slate-900 font-sans shadow-2xl rounded-3xl"
              style={{
                border: '7px solid #8B0000',
                outline: '2px solid #D4AF37',
                outlineOffset: '-5px'
              }}
            >
              <div className="text-center pb-3 border-b-2 border-amber-300">
                <BrandLogo size="sm" />
                <h3 className="text-base font-black text-[#8B0000] mt-1">{FOUNDATION_INFO.nameHindi}</h3>
                <p className="text-[10px] font-bold text-amber-900">SWAYAM SEWAK OFFICIAL IDENTITY CARD</p>
              </div>

              <div className="text-center my-4">
                <img
                  src={activeExportItem.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={activeExportItem.recipientName}
                  className="w-24 h-28 object-cover rounded-2xl mx-auto border-3 border-amber-500 shadow-md"
                  crossOrigin="anonymous"
                />
                <h4 className="text-lg font-black text-slate-900 mt-2">{activeExportItem.recipientName}</h4>
                <span className="inline-block px-3 py-0.5 bg-emerald-700 text-white text-[11px] font-bold rounded-full mt-1">
                  Dedicated Swayam Sewak
                </span>
              </div>

              <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">पहचान पत्र संख्या:</span>
                  <span className="font-mono font-bold text-slate-900">{activeExportItem.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">पिता/पति का नाम:</span>
                  <span className="font-bold text-slate-900">{activeExportItem.fatherOrHusbandName || 'श्री समाज सेवी'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">मोबाइल नंबर:</span>
                  <span className="font-mono font-bold text-slate-900">+91-{activeExportItem.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">सेवा क्षेत्र:</span>
                  <span className="font-bold text-[#8B0000]">{activeExportItem.categoryOrPurpose || 'समाज सेवा'}</span>
                </div>
              </div>

              {/* Official Verified Badge */}
              <div className="flex justify-center pt-2">
                <OfficialVerifiedBadge
                  certificateId={activeExportItem.id}
                  verificationDate={activeExportItem.issueDate}
                  size="compact"
                  theme="gold"
                />
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-amber-300">
                <div className="origin-left">
                  <CertificateVerificationQR
                    certificateId={activeExportItem.id}
                    size="auto"
                  />
                </div>
                <div className="text-right origin-right">
                  <ShaileshPradhanSignature size="auto" />
                  <p className="text-[10px] font-bold text-slate-800">अधिकृत हस्ताक्षर</p>
                </div>
              </div>
            </div>

            {/* 3. Donation 80G Receipt Hidden Render */}
            <div
              ref={hiddenDonationCertRef}
              id="hidden-donation-cert"
              className="w-[1050px] min-h-[740px] bg-[#FFFDF8] p-7 relative text-slate-900 font-serif shadow-2xl"
              style={{
                border: '9px solid #8B0000',
                outline: '2.5px solid #D4AF37',
                outlineOffset: '-7px'
              }}
            >
              <RoyalFourCorners />
              <div className="relative z-10 flex flex-col justify-between min-h-[670px]">
                <div className="flex items-center justify-between border-b-2 border-amber-300 pb-3">
                  <BrandLogo size="md" />
                  <div className="text-center flex-1 px-4">
                    <h2 className="text-2xl font-black text-[#8B0000]">{FOUNDATION_INFO.nameHindi}</h2>
                    <p className="text-xs text-slate-600">{FOUNDATION_INFO.address}</p>
                    <p className="text-[11px] font-bold text-emerald-800">
                      पंजीकरण सं: {FOUNDATION_INFO.regNo} • नीति आयोग UID: {FOUNDATION_INFO.nitiAayogUid} • PAN: {FOUNDATION_INFO.pan}
                    </p>
                  </div>
                  <div className="text-right text-xs font-mono font-bold">
                    <p>रसीद सं: {activeExportItem.id}</p>
                    <p>दिनांक: {activeExportItem.issueDate}</p>
                  </div>
                </div>

                <div className="text-center my-3">
                  <span className="px-6 py-1.5 bg-[#8B0000] text-yellow-300 text-base font-black rounded-full shadow-md">
                    आधिकारिक दान रसीद एवं सम्मान पत्र
                  </span>
                </div>

                <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 text-sm space-y-2.5 my-2">
                  <div className="grid grid-cols-2 gap-4">
                    <p><strong>दानदाता का नाम:</strong> {activeExportItem.recipientName}</p>
                    <p><strong>पिता/पति का नाम:</strong> {activeExportItem.fatherOrHusbandName || 'दानदाता व शुभचिंतक'}</p>
                    <p><strong>दान राशि:</strong> <span className="text-lg font-black text-[#8B0000] font-mono">₹{(activeExportItem.amount || 2100).toLocaleString('en-IN')}</span></p>
                    <p><strong>दान उद्देश्य:</strong> {activeExportItem.categoryOrPurpose || 'गरीब बच्चों की शिक्षा व जन-कल्याण'}</p>
                  </div>
                  <p className="text-xs text-slate-600 pt-1 border-t border-amber-200">
                    यह दान समाज-कल्याण एवं शिक्षा उत्थान हेतु अधिकृत व प्राप्त किया गया है।
                  </p>
                </div>

                {/* Seals, Signatures & Bottom Right Official Verified Badge */}
                <div className="flex items-end justify-between pt-3 border-t-2 border-amber-300 px-6">
                  <div className="text-center">
                    <CertificateVerificationQR
                      certificateId={activeExportItem.id}
                      size="auto"
                    />
                    <p className="text-[9px] font-mono text-slate-500 mt-0.5">Official Verification</p>
                  </div>
                  <div className="text-center">
                    <NgoRoundSeal size="auto" />
                  </div>
                  <div className="text-right flex flex-col items-end space-y-1">
                    <div className="text-center w-full">
                      <ShaileshPradhanSignature size="auto" />
                      <p className="text-xs font-black text-slate-900">शैलेश प्रधान (अध्यक्ष)</p>
                    </div>
                    <OfficialVerifiedBadge
                      certificateId={activeExportItem.id}
                      verificationDate={activeExportItem.issueDate}
                      size="sm"
                      layout="corner"
                      theme="gold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Task Appreciation Hidden Render */}
            <div
              ref={hiddenTaskCertRef}
              id="hidden-task-cert"
              className="w-[1050px] min-h-[740px] bg-[#FFFDF8] p-7 relative text-slate-900 font-serif shadow-2xl"
              style={{
                border: '9px solid #8B0000',
                outline: '2.5px solid #D4AF37',
                outlineOffset: '-7px'
              }}
            >
              <RoyalFourCorners />
              <div className="relative z-10 text-center flex flex-col items-center justify-between min-h-[670px]">
                <div className="w-full flex items-center justify-between border-b-2 border-amber-300 pb-3">
                  <BrandLogo size="md" />
                  <div className="text-center flex-1 px-4">
                    <h2 className="text-2xl font-black text-[#8B0000]">{FOUNDATION_INFO.nameHindi}</h2>
                    <p className="text-xs text-slate-600">{FOUNDATION_INFO.address}</p>
                  </div>
                  <div className="text-right text-xs font-mono font-bold">
                    <p>प्रशस्ति सं: {activeExportItem.id}</p>
                    <p>दिनांक: {activeExportItem.issueDate}</p>
                  </div>
                </div>

                <div className="my-2">
                  <span className="px-6 py-1.5 bg-[#8B0000] text-yellow-300 text-base font-black rounded-full shadow-md">
                    उत्कृष्ट समाज सेवा कार्य प्रशस्ति पत्र
                  </span>
                </div>

                <div className="my-3 space-y-2">
                  <p className="text-base italic text-slate-700">ससम्मान समर्पित</p>
                  <h3 className="text-3xl font-black text-[#8B0000]">{activeExportItem.recipientName}</h3>
                  <p className="text-sm font-bold text-slate-800">{activeExportItem.fatherOrHusbandName ? `पिता / पति: ${activeExportItem.fatherOrHusbandName}` : ''}</p>
                  <p className="text-sm text-slate-700 max-w-xl mx-auto pt-2">
                    {activeExportItem.details || 'फाउंडेशन के जन-कल्याणकारी प्रकल्पों में आपके अद्वितीय योगदान व सेवा भाव हेतु यह प्रशस्ति पत्र प्रदान किया जाता है।'}
                  </p>
                </div>

                <div className="w-full flex items-end justify-between pt-3 border-t-2 border-amber-300 px-6">
                  <div className="text-center">
                    <CertificateVerificationQR
                      certificateId={activeExportItem.id}
                      size="auto"
                    />
                    <p className="text-[9px] font-mono text-slate-500 mt-0.5">सत्यापन हेतु स्कैन करें</p>
                  </div>
                  <div className="text-center">
                    <NgoRoundSeal size="auto" />
                  </div>
                  <div className="text-right flex flex-col items-end space-y-1">
                    <div className="text-center w-full">
                      <ShaileshPradhanSignature size="auto" />
                      <p className="text-xs font-black text-slate-900">शैलेश प्रधान (अध्यक्ष)</p>
                    </div>
                    <OfficialVerifiedBadge
                      certificateId={activeExportItem.id}
                      verificationDate={activeExportItem.issueDate}
                      size="sm"
                      layout="corner"
                      theme="gold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Festival Greeting Hidden Render */}
            <div
              ref={hiddenFestivalCertRef}
              id="hidden-festival-cert"
              className="w-[1050px] min-h-[740px] bg-[#FFFDF8] p-7 relative text-slate-900 font-serif shadow-2xl"
              style={{
                border: '9px solid #8B0000',
                outline: '2.5px solid #D4AF37',
                outlineOffset: '-7px'
              }}
            >
              <RoyalFourCorners />
              <div className="relative z-10 text-center flex flex-col items-center justify-between min-h-[670px]">
                <div className="w-full flex items-center justify-between border-b-2 border-amber-300 pb-3">
                  <BrandLogo size="md" />
                  <div className="text-center flex-1 px-4">
                    <h2 className="text-2xl font-black text-[#8B0000]">{FOUNDATION_INFO.nameHindi}</h2>
                    <p className="text-xs text-slate-600">{FOUNDATION_INFO.address}</p>
                  </div>
                  <div className="text-right text-xs font-mono font-bold">
                    <p>पत्र सं: {activeExportItem.id}</p>
                    <p>दिनांक: {activeExportItem.issueDate}</p>
                  </div>
                </div>

                <div className="my-2">
                  <span className="px-6 py-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 text-white text-base font-black rounded-full shadow-md">
                    पावन पर्व एवं उत्सव शुभकामना पत्र
                  </span>
                </div>

                <div className="my-3 space-y-2">
                  <h3 className="text-3xl font-black text-[#8B0000]">{activeExportItem.recipientName}</h3>
                  <p className="text-sm font-bold text-amber-900">{activeExportItem.fatherOrHusbandName || 'सम्मानित नागरिक'}</p>
                  <p className="text-sm text-slate-700 max-w-xl mx-auto pt-2 italic">
                    {activeExportItem.details || 'जीवन ज्योति फाउंडेशन की ओर से आपको एवं आपके समस्त परिवार को हार्दिक मंगलकामनाएं।'}
                  </p>
                </div>

                <div className="w-full flex items-end justify-between pt-3 border-t-2 border-amber-300 px-6">
                  <div className="text-center">
                    <CertificateVerificationQR
                      certificateId={activeExportItem.id}
                      size="auto"
                    />
                    <p className="text-[9px] font-mono text-slate-500 mt-0.5">सत्यापन हेतु स्कैन करें</p>
                  </div>
                  <div className="text-center">
                    <NgoRoundSeal size="auto" />
                  </div>
                  <div className="text-right flex flex-col items-end space-y-1">
                    <div className="text-center w-full">
                      <ShaileshPradhanSignature size="auto" />
                      <p className="text-xs font-black text-slate-900">शैलेश प्रधान (अध्यक्ष)</p>
                    </div>
                    <OfficialVerifiedBadge
                      certificateId={activeExportItem.id}
                      verificationDate={activeExportItem.issueDate}
                      size="sm"
                      layout="corner"
                      theme="gold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadCertificatesModal;
