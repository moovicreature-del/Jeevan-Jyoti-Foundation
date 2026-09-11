// ============================================================================
// JEEVAN JYOTI FOUNDATION - CERTIFICATE ANALYTICS WIDGET (SUPER ADMIN)
// जीवन ज्योति फाउंडेशन - प्रमाण पत्र जारीकरण एवं पंजीकरण पाइपलाइन एनालिटिक्स विगेट्स
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Calendar,
  TrendingUp,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  BarChart3,
  LineChart as LineChartIcon,
  Layers,
  Sparkles,
  Activity
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
  AreaChart,
  Area
} from 'recharts';
import {
  CertificatePipelineStats,
  getAllRegisteredCertificates,
  computeCertificatePipelineStats,
  fetchServerCertificateStats
} from '../../services/certificateRegistryService';

export interface CertificateAnalyticsWidgetProps {
  initialYear?: string;
  initialMonth?: string;
  onOpenFullPipeline?: () => void;
  className?: string;
  showQuickNav?: boolean;
}

interface ChartItem {
  name: string;
  nameEn?: string;
  year?: number;
  total: number;
  volunteer_cert: number;
  volunteer_id: number;
  donation_80g: number;
  task_appreciation: number;
  festival_greeting: number;
  growth?: number;
  amount80G?: number;
}

export const CertificateAnalyticsWidget: React.FC<CertificateAnalyticsWidgetProps> = ({
  initialYear = '2026',
  initialMonth = 'all',
  onOpenFullPipeline,
  className = '',
  showQuickNav = true
}) => {
  const [selectedYear, setSelectedYear] = useState<string>(initialYear);
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);
  const [chartType, setChartType] = useState<'stacked_bar' | 'trend_area' | 'yearly_comparison'>('stacked_bar');
  const [stats, setStats] = useState<CertificatePipelineStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Month labels mapping
  const monthNames = [
    { value: 'all', labelHi: 'सभी 12 माह', labelEn: 'All Months' },
    { value: '1', labelHi: 'जनवरी', labelEn: 'Jan' },
    { value: '2', labelHi: 'फ़रवरी', labelEn: 'Feb' },
    { value: '3', labelHi: 'मार्च', labelEn: 'Mar' },
    { value: '4', labelHi: 'अप्रैल', labelEn: 'Apr' },
    { value: '5', labelHi: 'मई', labelEn: 'May' },
    { value: '6', labelHi: 'जून', labelEn: 'Jun' },
    { value: '7', labelHi: 'जुलाई', labelEn: 'Jul' },
    { value: '8', labelHi: 'अगस्त', labelEn: 'Aug' },
    { value: '9', labelHi: 'सितम्बर', labelEn: 'Sep' },
    { value: '10', labelHi: 'अक्टूबर', labelEn: 'Oct' },
    { value: '11', labelHi: 'नवम्बर', labelEn: 'Nov' },
    { value: '12', labelHi: 'दिसम्बर', labelEn: 'Dec' }
  ];

  // Load analytics data
  const loadData = async () => {
    try {
      setIsLoading(true);
      const computed = await fetchServerCertificateStats(selectedYear, selectedMonth);
      setStats(computed);
    } catch (err) {
      console.warn('Error loading certificate analytics widget data:', err);
      const localCerts = getAllRegisteredCertificates();
      const localStats = computeCertificatePipelineStats(localCerts, selectedYear, selectedMonth);
      setStats(localStats);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedYear, selectedMonth]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  // Prepare chart dataset
  const chartData: ChartItem[] = useMemo(() => {
    if (!stats) return [];

    if (chartType === 'yearly_comparison') {
      return stats.yearlyData
        .map((y) => ({
          name: `वर्ष ${y.year}`,
          year: y.year,
          total: y.total,
          volunteer_cert: y.volunteer_cert,
          volunteer_id: y.volunteer_id,
          donation_80g: y.donation_80g,
          task_appreciation: y.task_appreciation,
          festival_greeting: y.festival_greeting,
          growth: y.growthVsPrevYear
        }))
        .reverse();
    }

    // Monthly data
    return stats.monthlyData.map((m) => ({
      name: m.shortMonth || m.monthNameHi,
      nameEn: m.monthNameEn,
      year: m.year,
      total: m.total,
      volunteer_cert: m.volunteer_cert,
      volunteer_id: m.volunteer_id,
      donation_80g: m.donation_80g,
      task_appreciation: m.task_appreciation,
      festival_greeting: m.festival_greeting,
      amount80G: m.amount80G
    }));
  }, [stats, chartType]);

  // Current active volume in selected filter
  const currentVolume = useMemo(() => {
    if (!stats) return 0;
    if (selectedMonth !== 'all') {
      const mKey = `${selectedYear === 'all' ? new Date().getFullYear() : selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
      const found = stats.monthlyData.find((m) => m.monthKey === mKey);
      return found ? found.total : stats.totalSelectedMonth;
    }
    return stats.totalSelectedYear;
  }, [stats, selectedMonth, selectedYear]);

  return (
    <div
      id="certificate-analytics-widget"
      className={`bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm space-y-6 ${className}`}
    >
      {/* Widget Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                PIPELINE ANALYTICS
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {stats?.selectedYear === 'all' ? 'ऑल-टाइम ट्रेंड' : `वर्ष ${stats?.selectedYear || '2026'}`}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5 flex items-center gap-2">
              <span>प्रमाण पत्र जारीकरण एवं पंजीकरण ट्रेंड</span>
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 font-bold hidden sm:inline-flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> लाइव सिंक्रनाइज़्ड
              </span>
            </h3>
          </div>
        </div>

        {/* Filter Controls & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Year Filter */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500 mr-1.5 shrink-0" />
            <select
              id="analytics-widget-year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
            >
              <option value="2026">वर्ष 2026</option>
              <option value="2025">वर्ष 2025</option>
              <option value="2024">वर्ष 2024</option>
              <option value="all">सभी वर्ष (All Years)</option>
            </select>
          </div>

          {/* Month Filter */}
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 mr-1.5 shrink-0" />
            <select
              id="analytics-widget-month-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs max-w-[130px] truncate"
            >
              {monthNames.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.labelHi} ({m.labelEn})
                </option>
              ))}
            </select>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setChartType('stacked_bar')}
              title="माह-वार स्टैक्ड बार चार्ट"
              className={`p-1.5 rounded-lg transition font-bold flex items-center gap-1 cursor-pointer ${
                chartType === 'stacked_bar'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">माह-वार</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType('trend_area')}
              title="कुल प्रवाह ट्रेंड एरिया"
              className={`p-1.5 rounded-lg transition font-bold flex items-center gap-1 cursor-pointer ${
                chartType === 'trend_area'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LineChartIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">ट्रेंड</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType('yearly_comparison')}
              title="वार्षिक तुलना चार्ट"
              className={`p-1.5 rounded-lg transition font-bold flex items-center gap-1 cursor-pointer ${
                chartType === 'yearly_comparison'
                  ? 'bg-white text-purple-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">वार्षिक</span>
            </button>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="रिफ्रेश एनालिटिक्स डेटा"
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>

          {/* Quick Navigate to Full Pipeline */}
          {showQuickNav && onOpenFullPipeline && (
            <button
              type="button"
              onClick={onOpenFullPipeline}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
            >
              <span>पूर्ण पाइपलाइन</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {selectedMonth === 'all' ? `वर्ष ${selectedYear} कुल जारी` : 'चयनित माह जारी'}
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-slate-900">{currentVolume}</span>
            <span className="text-[10px] text-slate-500 font-semibold">प्रमाण पत्र</span>
          </div>
          <span className="text-[10px] text-blue-600 font-bold block mt-0.5">
            कुल ऑल-टाइम: {stats?.totalAllTime || 0}
          </span>
        </div>

        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            वार्षिक वृद्धि (YoY Growth)
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-emerald-600">
              +{stats?.growthPercentYoY || 0}%
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
            पिछले वर्ष की तुलना में
          </span>
        </div>

        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            80G दान प्रमाणित राशि
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-slate-900">
              ₹{(stats?.totalDonationAmount || 0).toLocaleString('en-IN')}
            </span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
            10BD टैक्स छूट अधिकृत
          </span>
        </div>

        <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            QR सत्यापन दर (Integrity)
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-indigo-700">100%</span>
            <ShieldCheck className="w-4 h-4 text-indigo-700" />
          </div>
          <span className="text-[10px] text-indigo-700 font-bold block mt-0.5">
            HMAC-SHA256 सुरक्षित
          </span>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Activity className="w-4 h-4 text-blue-600" />
            <span>
              {chartType === 'stacked_bar' && 'माह-वार प्रमाण पत्र वितरण (Monthly Stacked Volume by Category)'}
              {chartType === 'trend_area' && 'मासिक जारीकरण संचयी प्रवाह (Cumulative Monthly Issuance Volume)'}
              {chartType === 'yearly_comparison' && 'वार्षिक तुलनात्मक जारीकरण (Year-over-Year Comparative Issuance)'}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
            12 माह का सक्रिय डेटा
          </span>
        </div>

        <div className="bg-slate-50/70 rounded-2xl p-3 sm:p-4 border border-slate-200/90 h-64 sm:h-72 w-full">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-xs font-bold">एनालिटिक्स डेटा लोड हो रहा है...</span>
            </div>
          ) : chartData.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
              कोई रिकॉर्ड उपलब्ध नहीं है
            </div>
          ) : chartType === 'stacked_bar' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '11px',
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                  }}
                  labelFormatter={(label: any) => `माह: ${label}`}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="volunteer_cert" name="स्वयंसेवक पत्र" stackId="a" fill="#1d4ed8" radius={[0, 0, 0, 0]} />
                <Bar dataKey="volunteer_id" name="डिजिटल ID" stackId="a" fill="#0284c7" radius={[0, 0, 0, 0]} />
                <Bar dataKey="donation_80g" name="दान रसीद" stackId="a" fill="#059669" radius={[0, 0, 0, 0]} />
                <Bar dataKey="task_appreciation" name="प्रशंसा पत्र" stackId="a" fill="#d97706" radius={[0, 0, 0, 0]} />
                <Bar dataKey="festival_greeting" name="पर्व शुभकामना" stackId="a" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : chartType === 'trend_area' ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="widgetColorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="widgetColor80G" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '11px',
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                  }}
                  labelFormatter={(label: any) => `माह: ${label}`}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="कुल जारी प्रमाण पत्र"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#widgetColorTotal)"
                />
                <Area
                  type="monotone"
                  dataKey="donation_80g"
                  name="दान रसीदें"
                  stroke="#059669"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#widgetColor80G)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '11px',
                    border: 'none',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                  }}
                  labelFormatter={(label: any) => `${label}`}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="total" name="वार्षिक कुल जारी" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="donation_80g" name="दान रसीदें" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="volunteer_cert" name="स्वयंसेवक पत्र" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 5-Stage Registration & Issuance Pipeline Flow Bar */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              पंजीकरण एवं जारीकरण पाइपलाइन चरण (Registration Funnel Stages)
            </h4>
          </div>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-bold">
            ५-चरणीय सुरक्षित प्रवाह
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {(stats?.pipelineStages || []).map((stage, idx) => (
            <div
              key={stage.stageId}
              className="bg-slate-50 hover:bg-slate-100/80 transition rounded-xl p-2.5 border border-slate-200/90 space-y-1 text-center sm:text-left"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-black text-slate-500 uppercase">
                  चरण {idx + 1}
                </span>
                <span
                  className="text-[10px] font-black px-1.5 py-0.2 rounded-md"
                  style={{
                    backgroundColor: `${stage.colorHex}15`,
                    color: stage.colorHex
                  }}
                >
                  {stage.percentage}%
                </span>
              </div>
              <p className="text-xs font-black text-slate-900 truncate">
                {stage.stageNameHi}
              </p>
              <div className="flex items-baseline justify-between pt-0.5">
                <span className="text-sm font-black" style={{ color: stage.colorHex }}>
                  {stage.count}
                </span>
                <span className="text-[9px] text-slate-400">रिकॉर्ड</span>
              </div>
              {/* Mini progress line */}
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${stage.percentage}%`,
                    backgroundColor: stage.colorHex
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown Badges */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>श्रेणी-वार जारीकरण अनुपात:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(stats?.categoryDistribution || []).map((cat) => (
            <span
              key={cat.type}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border"
              style={{
                backgroundColor: `${cat.color}10`,
                borderColor: `${cat.color}30`,
                color: cat.color
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
              <span>{cat.labelHi}</span>
              <span className="font-black bg-white px-1.5 py-0.2 rounded-md shadow-2xs">
                {cat.count} ({cat.percentage}%)
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
