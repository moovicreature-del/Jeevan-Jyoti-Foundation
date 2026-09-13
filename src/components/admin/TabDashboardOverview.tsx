// ============================================================================
// JEEVAN JYOTI FOUNDATION - ADMIN DASHBOARD OVERVIEW TAB
// जीवन ज्योति फाउंडेशन - एडमिन डैशबोर्ड मुख्य अवलोकन
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Film,
  Megaphone,
  FileText,
  Users,
  ShieldCheck,
  Crown,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Eye,
  CheckCircle,
  Clock,
  HeartHandshake,
  Award,
  TrendingUp,
  Calendar,
  CreditCard,
  QrCode,
  Zap,
  CheckCircle2,
  Database,
  Download,
  Lock
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useHomeContent } from '../../context/HomeContentContext';
import { useDonationPaymentSettings } from '../../hooks/useDonationPaymentSettings';
import { getAllRegisteredCertificates, computeCertificatePipelineStats } from '../../services/certificateRegistryService';
import { CertificateAnalyticsWidget } from './CertificateAnalyticsWidget';

interface TabDashboardOverviewProps {
  onSelectTab: (tab: 'certificates' | 'donations' | 'payment' | 'media' | 'notice' | 'text' | 'users') => void;
  onViewWebsite?: () => void;
  onOpenBackupModal?: () => void;
}

export const TabDashboardOverview: React.FC<TabDashboardOverviewProps> = ({
  onSelectTab,
  onViewWebsite,
  onOpenBackupModal
}) => {
  const { adminProfile, isSuperAdmin } = useAdminAuth();
  const { content, notices, activeNotices } = useHomeContent();
  const { settings: paymentSettings } = useDonationPaymentSettings();
  const [certCount, setCertCount] = useState<number>(0);
  const [yearCount, setYearCount] = useState<number>(0);

  useEffect(() => {
    try {
      const allCerts = getAllRegisteredCertificates();
      const stats = computeCertificatePipelineStats(allCerts, '2026', 'all');
      setCertCount(stats.totalAllTime);
      setYearCount(stats.totalSelectedYear);
    } catch (e) {
      console.warn('Error loading cert count for overview:', e);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-black">
              {isSuperAdmin ? <Crown className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
              <span>{isSuperAdmin ? 'सुपर एडमिन कंसोल (Super Admin)' : 'अधिकृत एडमिन कंसोल (Admin)'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              स्वागत है, {adminProfile?.name || 'सम्मानित पदाधिकारी'}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              जीवन ज्योति फाउंडेशन ग़ाज़ीपुर, उत्तर प्रदेश, भारत होम पेज सामग्री प्रबंधक (Home Page Content Manager)। यहाँ किए गए सभी बदलाव बिना किसी कोड परिवर्तन के मोबाइल ऐप व वेबसाइट पर तुरंत लाइव हो जाते हैं।
            </p>
          </div>

          {onViewWebsite && (
            <button
              onClick={onViewWebsite}
              className="flex items-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs rounded-2xl shadow-lg transition cursor-pointer shrink-0"
            >
              <Eye className="w-4 h-4" />
              <span>लाइव वेबसाइट देखें</span>
            </button>
          )}
        </div>
      </div>

      {/* Featured Banner: Quick Donate QR & UPI Setting Fast Action */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-red-700 text-white rounded-3xl p-6 shadow-lg border border-amber-400 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white text-amber-700 flex items-center justify-center font-black shrink-0 shadow-md">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-white/20 text-white border border-white/40 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                QUICK DONATE QR & UPI
              </span>
              <span className="text-xs text-amber-100">
                सक्रिय UPI: <strong className="font-mono bg-black/20 px-2 py-0.5 rounded">{paymentSettings.upiId || 'jeevanjyoti.gzp@sbi'}</strong>
              </span>
            </div>
            <h2 className="text-base font-black text-white mt-1">
              क्विक डोनेट QR कोड एवं UPI VPA प्रबंधन
            </h2>
            <p className="text-xs text-amber-100">
              {paymentSettings.qrCodeMode === 'custom_image' && paymentSettings.customQrImageUrl ? (
                <span>🟢 <strong>कस्टम फोटो QR कोड</strong> सक्रिय है</span>
              ) : (
                <span>⚡ <strong>डायनामिक ऑटो-जेनरेटेड UPI QR</strong> सक्रिय है</span>
              )}
              {' '}• नए UPI ID दर्ज करें अथवा नया QR स्टैंडी फोटो अपलोड करें।
            </p>
          </div>
        </div>

        <button
          id="btn-open-payment-from-overview"
          onClick={() => onSelectTab('payment')}
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-amber-50 text-amber-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer shrink-0"
        >
          <Zap className="w-4 h-4 text-amber-600 fill-amber-600" />
          <span>QR / UPI बदलें</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Featured Banner: Super-Admin Certificate Issuance Pipeline */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-blue-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-black shrink-0 shadow-md">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.2 rounded-full font-black uppercase tracking-wider">
                SUPER ADMIN PIPELINE
              </span>
              <span className="text-xs text-blue-200">
                वर्ष 2026 में <strong>{yearCount} जारी</strong> • कुल <strong>{certCount} ऑल-टाइम</strong>
              </span>
            </div>
            <h2 className="text-base font-black text-white mt-0.5">
              प्रमाण पत्र जारीकरण एवं पंजीकरण पाइपलाइन एनालिटिक्स
            </h2>
            <p className="text-xs text-slate-300">
              माह-वार व वर्ष-वार जारी किए गए प्रमाण पत्रों की लाइव सांख्यिकी, दान रसीदें एवं फनल स्थिति देखें।
            </p>
          </div>
        </div>

        <button
          id="btn-open-cert-pipeline-from-overview"
          onClick={() => onSelectTab('certificates')}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer shrink-0"
        >
          <span>पाइपलाइन डैशबोर्ड खोलें</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Featured Banner: Automated & Manual Firestore Database Backup */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-blue-950 text-white rounded-3xl p-6 shadow-md border border-emerald-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.2 rounded-full font-black uppercase tracking-wider">
                FIRESTORE DATA BACKUP
              </span>
              <span className="text-xs text-emerald-200">
                दानदाता + स्वयंसेवक + प्रमाण पत्र
              </span>
            </div>
            <h2 className="text-base font-black text-white mt-0.5">
              फायरस्टोर डेटाबेस बैकअप (JSON Export & Download)
            </h2>
            <p className="text-xs text-slate-300">
              सभी दान रिकॉर्ड, स्वयंसेवक प्रोफाइल व जारी प्रमाण पत्रों का पूर्ण संरचित JSON बैकअप तुरंत डाउनलोड करें।
            </p>
          </div>
        </div>

        <button
          id="btn-trigger-backup-overview-banner"
          onClick={onOpenBackupModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-blue-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>JSON बैकअप डाउनलोड करें</span>
        </button>
      </div>

      {/* Quick Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Certificate Pipeline */}
        <div
          onClick={() => onSelectTab('certificates')}
          className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
              <Award className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 transition" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            CERTIFICATE PIPELINE
          </span>
          <h3 className="text-sm font-black text-slate-900 mt-1">
            प्रमाण पत्र पाइपलाइन ({certCount})
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            मासिक व वार्षिक जारीकरण • 100% QR सत्यापित
          </p>
        </div>

        {/* Card 2: Logo & App Thumbnail */}
        <div
          id="overview-card-logo-thumbnail"
          onClick={() => onSelectTab('media')}
          className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-purple-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold group-hover:scale-105 transition">
              <Film className="w-5 h-5 text-purple-700" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 transition" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            TAB 1: LOGO & APP THUMBNAIL
          </span>
          <h3 className="text-sm font-black text-slate-900 mt-1">
            ऐप लोगो एवं थंबनेल बदलें
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            {content.appLogoUrl ? '🟢 कस्टम लोगो' : '🔵 डिफ़ॉल्ट लोगो'} • {content.appThumbnailUrl ? '🟢 कस्टम थंबनेल' : '🔵 डिफ़ॉल्ट थंबनेल'}
          </p>
        </div>

        {/* Card 3: Notice Board */}
        <div
          onClick={() => onSelectTab('notice')}
          className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:border-amber-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold group-hover:scale-105 transition">
              <Megaphone className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition" />
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            TAB 2: NOTICE BOARD
          </span>
          <h3 className="text-sm font-black text-slate-900 mt-1">
            सूचना पट्ट ({activeNotices.length} सक्रिय)
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            कुल {notices.length} सूचनाएँ डेटाबेस में उपलब्ध
          </p>
        </div>

        {/* Card 4: User Management */}
        <div
          onClick={() => {
            if (isSuperAdmin) onSelectTab('users');
          }}
          className={`bg-white rounded-3xl p-5 border shadow-sm transition group ${
            isSuperAdmin
              ? 'border-slate-200 hover:border-indigo-300 hover:shadow-md cursor-pointer'
              : 'border-slate-200 opacity-60 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-900 flex items-center justify-center font-bold group-hover:scale-105 transition">
              <Users className="w-5 h-5" />
            </div>
            {isSuperAdmin && <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-700 transition" />}
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            TAB 4: USERS (SUPER ADMIN)
          </span>
          <h3 className="text-sm font-black text-slate-900 mt-1">
            एडमिन अनुमोदन व नियंत्रण
          </h3>
          <p className="text-[11px] text-slate-500 mt-1">
            {isSuperAdmin ? 'पूर्ण नियंत्रण उपलब्ध' : 'केवल सुपर एडमिन हेतु'}
          </p>
        </div>
      </div>

      {/* Live Certificate Analytics Trend & Funnel Pipeline Widget */}
      <CertificateAnalyticsWidget
        onOpenFullPipeline={() => onSelectTab('certificates')}
      />

      {/* Live Content Status Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <h3 className="text-sm font-black text-slate-900">
              होम पेज लाइव सामग्री स्थिति (Live Content Sync)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            अंतिम संपादन: <strong>{content.updatedBy || 'सिस्टम'}</strong> ({new Date(content.updatedAt || Date.now()).toLocaleDateString('hi-IN')})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              वर्तमान मुख्य शीर्षक (Hero Title)
            </span>
            <p className="text-xs font-bold text-slate-900 line-clamp-2">
              "{content.heroTitle || 'रोशनी बनो किसी के अंधेरे जीवन की'}"
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              सक्रिय सूचना (Top Notice)
            </span>
            <p className="text-xs font-bold text-blue-900 line-clamp-2">
              {activeNotices.length > 0
                ? activeNotices[0].title
                : 'कोई सूचना सक्रिय नहीं है'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              संस्था परिचय (About Text Preview)
            </span>
            <p className="text-xs text-slate-600 line-clamp-2">
              {content.aboutText || 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुर, उत्तर प्रदेश, भारत में पंजीकृत गैर-सरकारी संस्था है...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
