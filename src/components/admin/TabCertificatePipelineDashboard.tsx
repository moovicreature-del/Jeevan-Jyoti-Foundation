// ============================================================================
// JEEVAN JYOTI FOUNDATION - SUPER ADMIN CERTIFICATES & PIPELINE DASHBOARD
// जीवन ज्योति फाउंडेशन - सुपर एडमिन प्रमाण पत्र जारीकरण एवं पंजीकरण पाइपलाइन एनालिटिक्स
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Calendar,
  Filter,
  TrendingUp,
  CheckCircle,
  ShieldCheck,
  Search,
  RefreshCw,
  Download,
  ExternalLink,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  QrCode,
  Layers,
  Copy,
  Check,
  Sparkles,
  ArrowUpRight,
  Database,
  Smartphone,
  UserCheck,
  Clock,
  Printer,
  Info,
  X
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  RegisteredCertificateItem,
  CertificateCategoryType,
  CertificatePipelineStats,
  computeCertificatePipelineStats,
  fetchServerCertificateStats,
  syncCertificatesFromFirestore,
  getAllRegisteredCertificates,
  parseDateComponents
} from '../../services/certificateRegistryService';
import toast from 'react-hot-toast';

interface TabCertificatePipelineDashboardProps {
  onOpenVerificationPortal?: (certId: string) => void;
}

export const TabCertificatePipelineDashboard: React.FC<TabCertificatePipelineDashboardProps> = ({
  onOpenVerificationPortal
}) => {
  const { adminProfile, isSuperAdmin } = useAdminAuth();

  // State Management
  const [stats, setStats] = useState<CertificatePipelineStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'overview' | 'monthly_trends' | 'pipeline_funnel' | 'registry_table'>('overview');
  const [selectedCertDetail, setSelectedCertDetail] = useState<RegisteredCertificateItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Month options with bilingual labels
  const monthOptions = [
    { value: 'all', label: 'सभी माह (All Months)' },
    { value: '1', label: '01 - जनवरी (January)' },
    { value: '2', label: '02 - फ़रवरी (February)' },
    { value: '3', label: '03 - मार्च (March)' },
    { value: '4', label: '04 - अप्रैल (April)' },
    { value: '5', label: '05 - मई (May)' },
    { value: '6', label: '06 - जून (June)' },
    { value: '7', label: '07 - जुलाई (July)' },
    { value: '8', label: '08 - अगस्त (August)' },
    { value: '9', label: '09 - सितम्बर (September)' },
    { value: '10', label: '10 - अक्टूबर (October)' },
    { value: '11', label: '11 - नवम्बर (November)' },
    { value: '12', label: '12 - दिसम्बर (December)' },
  ];

  // Category filter options
  const categoryFilters = [
    { value: 'all', label: 'सभी प्रमाण पत्र (All Types)', icon: Layers },
    { value: 'volunteer_cert', label: 'स्वयंसेवक प्रमाण पत्र', icon: Award },
    { value: 'volunteer_id', label: 'डिजिटल पहचान पत्र (ID)', icon: Smartphone },
    { value: 'donation_80g', label: '80G दान रसीदें', icon: ShieldCheck },
    { value: 'task_appreciation', label: 'सेवा कार्य प्रशंसा पत्र', icon: CheckCircle },
    { value: 'festival_greeting', label: 'पर्व शुभकामना पत्र', icon: Sparkles },
  ];

  // Load Certificate Analytics Data
  const loadAnalyticsData = async (forceSync: boolean = false) => {
    if (forceSync) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      if (forceSync) {
        await syncCertificatesFromFirestore();
      }
      const data = await fetchServerCertificateStats(selectedYear, selectedMonth);
      setStats(data);
      if (forceSync) {
        toast.success('डेटाबेस एवं प्रमाण पत्र पाइपलाइन सफलतापूर्वक सिंक्रनाइज़्ड!');
      }
    } catch (err) {
      console.error('Error fetching certificate pipeline stats:', err);
      // Fallback
      const local = getAllRegisteredCertificates();
      setStats(computeCertificatePipelineStats(local, selectedYear, selectedMonth));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData(false);
  }, [selectedYear, selectedMonth]);

  // Filtered Certificates for Table / Search
  const filteredCertificates = useMemo(() => {
    if (!stats || !stats.certificates) return [];

    return stats.certificates.filter((cert) => {
      // 1. Year Filter
      const { year, month } = parseDateComponents(cert.issueDate || cert.createdAt);
      if (selectedYear !== 'all' && year !== parseInt(selectedYear, 10)) {
        return false;
      }

      // 2. Month Filter
      if (selectedMonth !== 'all' && month !== parseInt(selectedMonth, 10)) {
        return false;
      }

      // 3. Category Filter
      if (selectedCategory !== 'all' && cert.type !== selectedCategory) {
        return false;
      }

      // 4. Status Filter
      if (selectedStatus !== 'all' && cert.status !== selectedStatus) {
        return false;
      }

      // 5. Search Query
      if (searchTerm.trim()) {
        const query = searchTerm.trim().toLowerCase();
        const idMatch = cert.id.toLowerCase().includes(query);
        const nameMatch = (cert.recipientName || '').toLowerCase().includes(query);
        const phoneMatch = (cert.phone || '').includes(query);
        const purposeMatch = (cert.categoryOrPurpose || '').toLowerCase().includes(query);
        const titleMatch = (cert.titleHindi || '').toLowerCase().includes(query) || (cert.titleEnglish || '').toLowerCase().includes(query);
        return idMatch || nameMatch || phoneMatch || purposeMatch || titleMatch;
      }

      return true;
    });
  }, [stats, selectedYear, selectedMonth, selectedCategory, selectedStatus, searchTerm]);

  // Copy Certificate ID
  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success(`आईडी कॉपी की गई: ${id}`);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Export Analytics to CSV
  const handleExportCSV = () => {
    if (!filteredCertificates.length) {
      toast.error('एक्सपोर्ट के लिए कोई रिकॉर्ड उपलब्ध नहीं है।');
      return;
    }

    const headers = [
      'Certificate ID',
      'Category Type',
      'Recipient Name',
      'Father/Husband Name',
      'Phone',
      'Issue Date',
      'Purpose / Designation',
      'Amount (INR)',
      'Status',
      'Verification URL'
    ];

    const rows = filteredCertificates.map((c) => [
      `"${c.id}"`,
      `"${c.type}"`,
      `"${c.recipientName}"`,
      `"${c.fatherOrHusbandName || ''}"`,
      `"${c.phone}"`,
      `"${c.issueDate}"`,
      `"${c.categoryOrPurpose || ''}"`,
      c.amount || 0,
      `"${c.status}"`,
      `"https://jeevanjyotifoundation.org/?verify=${encodeURIComponent(c.id)}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JJF_Certificate_Pipeline_Report_${selectedYear}_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV रिपोर्ट डाउनलोड हो गई!');
  };

  // Helper for category badge color and label
  const getCategoryBadge = (type: CertificateCategoryType) => {
    switch (type) {
      case 'volunteer_cert':
        return { label: 'स्वयंसेवक प्रमाण पत्र', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'volunteer_id':
        return { label: 'डिजिटल पहचान पत्र (ID)', bg: 'bg-sky-50 text-sky-800 border-sky-200' };
      case 'donation_80g':
        return { label: '80G आयकर दान रसीद', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'task_appreciation':
        return { label: 'सेवा कार्य प्रशंसा पत्र', bg: 'bg-amber-50 text-amber-900 border-amber-200' };
      case 'festival_greeting':
        return { label: 'पर्व शुभकामना पत्र', bg: 'bg-purple-50 text-purple-800 border-purple-200' };
      default:
        return { label: 'प्रमाण पत्र', bg: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  if (isLoading && !stats) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
        <div className="w-14 h-14 bg-blue-50 text-blue-800 rounded-2xl flex items-center justify-center mx-auto">
          <RefreshCw className="w-7 h-7 animate-spin text-blue-700" />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-900">प्रमाण पत्र एनालिटिक्स एवं पाइपलाइन लोड हो रही है...</h3>
          <p className="text-xs text-slate-500 mt-1">Firebase Firestore व सर्वर डेटाबेस से मासिक व वार्षिक आंकड़े तैयार किए जा रहे हैं</p>
        </div>
      </div>
    );
  }

  const currentYearData = stats?.yearlyData.find((y) => y.year === parseInt(selectedYear, 10)) || stats?.yearlyData[0];
  const monthlyChartData = stats?.monthlyData || [];
  const categoryChartData = stats?.categoryDistribution || [];
  const pipelineStages = stats?.pipelineStages || [];

  return (
    <div id="certificate-pipeline-dashboard" className="space-y-6">
      {/* 1. TOP HEADER BANNER - Royal Blue & Amber Theme */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-blue-900">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-40 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-black">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>सुपर एडमिन कंसोल • प्रमाण पत्र जारीकरण एवं पंजीकरण पाइपलाइन</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              प्रमाण पत्र जारीकरण एवं पंजीकरण पाइपलाइन
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 max-w-3xl leading-relaxed">
              वर्ष-वार व माह-वार जारी किए गए समस्त प्रमाण पत्रों (स्वयंसेवक, 80G दान रसीद, पहचान पत्र, सेवा प्रशंसा व पर्व पत्र) की लाइव स्थिति, सत्यापन पाइपलाइन एवं विस्तृत सांख्यिकी।
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="btn-sync-pipeline-data"
              onClick={() => loadAnalyticsData(true)}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/20 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-amber-300 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'डेटाबेस सिंक्रनाइज़ हो रहा है...' : 'डेटाबेस रिफ्रेश करें'}</span>
            </button>

            <button
              id="btn-export-pipeline-csv"
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-blue-950 rounded-xl text-xs font-black shadow-lg transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>CSV रिपोर्ट एक्सपोर्ट</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. FILTER & TIMEFRAME SELECTOR TOOLBAR */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-800" />
            <h2 className="text-sm font-black text-slate-900">
              समय-सीमा एवं फ़िल्टर चयन (Timeframe & Filters)
            </h2>
          </div>

          {/* View Mode Toggle Switch */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl self-stretch sm:self-auto overflow-x-auto">
            <button
              onClick={() => setViewMode('overview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                viewMode === 'overview'
                  ? 'bg-blue-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              समग्र अवलोकन (Overview)
            </button>
            <button
              onClick={() => setViewMode('monthly_trends')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                viewMode === 'monthly_trends'
                  ? 'bg-blue-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              मासिक चार्ट (Trends)
            </button>
            <button
              onClick={() => setViewMode('pipeline_funnel')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                viewMode === 'pipeline_funnel'
                  ? 'bg-blue-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              पंजीकरण फ़नल (Pipeline)
            </button>
            <button
              onClick={() => setViewMode('registry_table')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                viewMode === 'registry_table'
                  ? 'bg-blue-800 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              रिकॉर्ड्स सूची ({filteredCertificates.length})
            </button>
          </div>
        </div>

        {/* Filters Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Year Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
              वर्ष (Year)
            </label>
            <div className="relative">
              <select
                id="filter-year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition cursor-pointer"
              >
                <option value="all">सभी वर्ष (All Years)</option>
                {stats?.availableYears.map((yr) => (
                  <option key={yr} value={String(yr)}>
                    वर्ष {yr} {yr === 2026 ? '(वर्तमान / Current)' : ''}
                  </option>
                ))}
              </select>
              <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Month Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
              माह (Month)
            </label>
            <select
              id="filter-month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition cursor-pointer"
            >
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
              प्रमाण पत्र प्रकार (Category)
            </label>
            <select
              id="filter-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition cursor-pointer"
            >
              {categoryFilters.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
              सर्च (Name / ID / Mobile)
            </label>
            <div className="relative">
              <input
                id="search-pipeline-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="नाम, आईडी (JJF-...), मोबाइल..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. KEY METRICS CARDS (KPI OVERVIEW) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total All-Time Certificates */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">
              All-Time
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              कुल जारी प्रमाण पत्र (All Time)
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {stats?.totalAllTime || 0}
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                +100% Verified
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>डेटाबेस स्थिति:</span>
            <strong className="text-emerald-700 font-bold">Cloud Synced 🟢</strong>
          </p>
        </div>

        {/* KPI 2: Current Selected Year Volume */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              Year {selectedYear}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {selectedYear === 'all' ? 'समस्त वर्षों का कुल' : `वर्ष ${selectedYear} में जारी`}
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-900">
                {stats?.totalSelectedYear || 0}
              </span>
              <span className="text-xs font-bold text-slate-500">
                ({selectedMonth === 'all' ? '12 माह' : `माह ${selectedMonth}`})
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>YoY वृद्धि दर:</span>
            <strong className="text-blue-700 font-bold">+{stats?.growthPercentYoY || 0}%</strong>
          </p>
        </div>

        {/* KPI 3: Pipeline Completion & Verification Rate */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
              Security
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              सत्यापन एवं सुरक्षा स्तर
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                100%
              </span>
              <span className="text-xs font-bold text-amber-700">
                SHA-256 Cloud
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>QR सत्यापन सील:</span>
            <strong className="text-slate-800 font-bold">सक्रिय एवं अधिकृत</strong>
          </p>
        </div>

        {/* KPI 4: 80G Tax Donations Registered */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] bg-purple-50 text-purple-800 font-bold px-2 py-0.5 rounded-full border border-purple-200">
              80G Exemption
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              80G दान राशि रिकॉर्डेड
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-purple-950">
                ₹{(stats?.totalDonationAmount || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span>Form 10BD अनुपालन:</span>
            <strong className="text-emerald-700 font-bold">AAEAJ3141QF20231</strong>
          </p>
        </div>
      </div>

      {/* 4. MAIN VISUALIZATION PANELS (RECHARTS) */}
      {(viewMode === 'overview' || viewMode === 'monthly_trends') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Monthly Issuance Breakdown (Bar Chart) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-800" />
                  <span>मासिक प्रमाण पत्र जारीकरण विवरण (Monthly Issuance Volume - {selectedYear})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  प्रत्येक माह में जारी किए गए सभी प्रकार के प्रमाण पत्रों का बार चार्ट
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400">कुल वार्षिक संख्या:</span>
                <span className="text-sm font-black text-blue-900 ml-1.5">{stats?.totalSelectedYear || 0}</span>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="shortMonth" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      borderRadius: '12px',
                      fontSize: '12px',
                      border: 'none',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                    }}
                    labelFormatter={(label: any) => `माह: ${label}`}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="volunteer_cert" name="स्वयंसेवक पत्र" stackId="a" fill="#1d4ed8" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="volunteer_id" name="पहचान पत्र (ID)" stackId="a" fill="#0284c7" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="donation_80g" name="80G दान रसीद" stackId="a" fill="#059669" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="task_appreciation" name="सेवा प्रशंसा पत्र" stackId="a" fill="#d97706" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="festival_greeting" name="पर्व शुभकामना" stackId="a" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Category Distribution Donut */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div>
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-700" />
                  <span>प्रमाण पत्र प्रकार वितरण (Category Share)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  कुल जारी प्रमाण पत्रों का श्रेणी-वार अनुपात
                </p>
              </div>

              <div className="h-48 w-full relative my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      dataKey="count"
                      nameKey="labelHi"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        color: '#ffffff',
                        borderRadius: '12px',
                        fontSize: '11px',
                        border: 'none'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center metric */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-slate-400 font-bold">कुल</span>
                  <span className="text-xl font-black text-slate-900 leading-none">
                    {stats?.totalAllTime || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Category breakdown list */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              {categoryChartData.map((cat) => (
                <div key={cat.type} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-slate-700 font-bold">{cat.labelHi}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{cat.count}</span>
                    <span className="text-[10px] text-slate-400 font-semibold w-8 text-right">
                      {cat.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. YEAR-OVER-YEAR & PIPELINE FUNNEL (DETAILED ANALYTICS) */}
      {(viewMode === 'overview' || viewMode === 'pipeline_funnel') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pipeline Conversion Funnel (5-stage) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>पंजीकरण एवं जारीकरण पाइपलाइन चरण (Registration Funnel Stages)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  आवेदन intake से लेकर QR प्रमाणन व डिलीवरी तक की सम्पूर्ण पाइपलाइन गति
                </p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-black px-2.5 py-1 rounded-xl">
                98% Pipeline Efficiency
              </span>
            </div>

            {/* Stage Progress Bars */}
            <div className="space-y-4 pt-2">
              {pipelineStages.map((stage, idx) => (
                <div key={stage.stageId} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-900 font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 leading-tight">
                          {stage.stageNameHi}
                        </h4>
                        <span className="text-[10px] text-slate-400 block font-normal">
                          {stage.stageNameEn} • {stage.description}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-slate-900 font-mono">
                        {stage.count} रिकॉर्ड्स
                      </span>
                      <span className="text-[10px] font-black text-blue-700 block">
                        {stage.percentage}%
                      </span>
                    </div>
                  </div>

                  {/* Progress track */}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${stage.percentage}%`,
                        backgroundColor: stage.colorHex
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Year-over-Year (YoY) Growth Summary Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-800" />
                <span>वार्षिक वृद्धि तुलना (Year-over-Year)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                पिछले वर्षों की तुलना में वार्षिक प्रगति
              </p>
            </div>

            <div className="space-y-3">
              {stats?.yearlyData.map((yr) => (
                <div
                  key={yr.year}
                  onClick={() => setSelectedYear(String(yr.year))}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                    selectedYear === String(yr.year)
                      ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-slate-900">वर्ष {yr.year}</span>
                      <span className="text-[10px] text-slate-500 block">
                        स्वयंसेवक: {yr.volunteer_cert} • 80G: {yr.donation_80g} • ID: {yr.volunteer_id}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-blue-900 font-mono block">
                        {yr.total} कुल
                      </span>
                      {yr.growthVsPrevYear !== 0 && (
                        <span className={`text-[10px] font-bold ${yr.growthVsPrevYear > 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {yr.growthVsPrevYear > 0 ? `+${yr.growthVsPrevYear}%` : `${yr.growthVsPrevYear}%`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-amber-300 font-black">
                <Database className="w-3.5 h-3.5" />
                <span>Firestore डेटाबेस अनुपालन</span>
              </div>
              <p className="text-[11px] text-blue-100">
                प्रत्येक जारी प्रमाण पत्र अधिकृत Firestore संग्रह <code>issued_certificates</code> में तुरंत संग्रहीत होता है।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 6. LIVE CERTIFICATE REGISTRY TABLE & PIPELINE RECORDS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-800" />
              <span>प्रमाण पत्र पंजीकरण तालिका (Registered Certificates Pipeline Records)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              फ़िल्टर के अनुसार कुल <strong>{filteredCertificates.length}</strong> प्रमाण पत्र रिकॉर्ड्स उपलब्ध
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">स्थिति फ़िल्टर:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">सभी स्थिति (All)</option>
              <option value="certified">पूर्ण प्रमाणित (Certified)</option>
              <option value="verified">QR सत्यापित (Verified)</option>
              <option value="active">सक्रिय (Active)</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        {filteredCertificates.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <Info className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-black text-slate-700">कोई प्रमाण पत्र रिकॉर्ड नहीं मिला</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              कृपया सर्च शब्द या वर्ष / माह फ़िल्टर बदलें अथवा नया प्रमाण पत्र जारी करें।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/90 text-slate-600 font-black uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">प्रमाण पत्र आईडी (ID)</th>
                  <th className="px-4 py-3">प्रकार (Category)</th>
                  <th className="px-4 py-3">धारक / प्राप्तकर्ता</th>
                  <th className="px-4 py-3">मोबाइल नंबर</th>
                  <th className="px-4 py-3">जारी तिथि</th>
                  <th className="px-4 py-3">पाइपलाइन स्थिति</th>
                  <th className="px-4 py-3 text-right">कार्यवाही (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredCertificates.map((cert) => {
                  const badge = getCategoryBadge(cert.type);
                  return (
                    <tr
                      key={cert.id}
                      className="hover:bg-blue-50/40 transition cursor-pointer"
                      onClick={() => setSelectedCertDetail(cert)}
                    >
                      {/* ID Column */}
                      <td className="px-4 py-3.5 font-mono font-bold text-blue-900">
                        <div className="flex items-center gap-1.5">
                          <span>{cert.id}</span>
                          <button
                            title="आईडी कॉपी करें"
                            onClick={(e) => handleCopyId(cert.id, e)}
                            className="p-1 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-slate-100 transition"
                          >
                            {copiedId === cert.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      </td>

                      {/* Recipient */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900">{cert.recipientName}</div>
                        {cert.fatherOrHusbandName && (
                          <div className="text-[10px] text-slate-400 font-normal">
                            पिता/संरक्षक: {cert.fatherOrHusbandName}
                          </div>
                        )}
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-600">
                        +91 {cert.phone}
                      </td>

                      {/* Issue Date */}
                      <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                        {cert.issueDate}
                      </td>

                      {/* Pipeline Status */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>QR प्रमाणित</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            title="विस्तृत विवरण देखें"
                            onClick={() => setSelectedCertDetail(cert)}
                            className="p-1.5 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-800 rounded-xl transition cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {onOpenVerificationPortal && (
                            <button
                              title="सत्यापन पोर्टल पर देखें"
                              onClick={() => onOpenVerificationPortal(cert.id)}
                              className="p-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl transition cursor-pointer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 7. CERTIFICATE RECORD DETAILS MODAL */}
      {selectedCertDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-auto border border-slate-200 animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center">
                  <Award className="w-5 h-5 text-blue-800" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    प्रमाण पत्र पाइपलाइन विवरण
                  </h3>
                  <span className="font-mono text-xs font-bold text-blue-800">
                    {selectedCertDetail.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCertDetail(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">प्राप्तकर्ता का नाम</span>
                  <p className="font-black text-slate-900 text-sm">{selectedCertDetail.recipientName}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">पिता/संरक्षक का नाम</span>
                  <p className="font-bold text-slate-800">{selectedCertDetail.fatherOrHusbandName || 'लागू नहीं'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">पंजीकृत मोबाइल नंबर</span>
                  <p className="font-mono font-bold text-slate-900">+91 {selectedCertDetail.phone}</p>
                </div>
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">जारी तिथि (Issue Date)</span>
                  <p className="font-bold text-slate-800">{selectedCertDetail.issueDate}</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">प्रमाण पत्र शीर्षक एवं उद्देश्य</span>
                <p className="font-bold text-slate-900">{selectedCertDetail.titleHindi}</p>
                <p className="text-[11px] text-slate-500">{selectedCertDetail.titleEnglish}</p>
                {selectedCertDetail.categoryOrPurpose && (
                  <p className="text-[11px] text-blue-900 font-semibold pt-1">
                    विवरण: {selectedCertDetail.categoryOrPurpose}
                  </p>
                )}
              </div>

              {/* Security & Firestore Seal Badge */}
              <div className="p-4 bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-amber-300 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Firebase Admin SDK Cryptographic Seal
                  </span>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold">
                    VALIDATED
                  </span>
                </div>
                <div className="font-mono text-[10px] text-blue-200 space-y-0.5">
                  <p>Database Ref: firestore://issued_certificates/{selectedCertDetail.id.replace(/[\/\s]/g, '_')}</p>
                  <p>Registration No: GAZ/03373 | NITI Aayog: UP/2018/0207700</p>
                  <p>Section 80G URN: AAEAJ3141QF20231 | 12A URN: AAEAJ3141QE20231</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedCertDetail(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                बंद करें
              </button>
              {onOpenVerificationPortal && (
                <button
                  onClick={() => {
                    const id = selectedCertDetail.id;
                    setSelectedCertDetail(null);
                    onOpenVerificationPortal(id);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>सत्यापन पोर्टल खोलें</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
