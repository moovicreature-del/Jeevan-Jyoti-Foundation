// ============================================================================
// JEEVAN JYOTI FOUNDATION - ADMIN 80G DONATIONS & BULK RECEIPTS MANAGER
// एडमिन 80G दान प्रबंधन, थोक रसीद डाउनलोड एवं आयकर फॉर्म 10BD CSV एक्सपोर्ट
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Download,
  Search,
  Filter,
  FileSpreadsheet,
  Printer,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Building2,
  Share2,
  Sparkles,
  RefreshCw,
  CreditCard,
  QrCode,
  Settings,
  Database
} from 'lucide-react';
import { DonationRecord } from '../../types';
import { DONORS_DATA } from '../../data/donorsData';
import { FOUNDATION_INFO } from '../../data/foundationData';
import { Donation80GReceiptView } from '../donation/Donation80GReceiptView';
import { TabDonationPaymentSettings } from './TabDonationPaymentSettings';
import { useDonationPaymentSettings } from '../../hooks/useDonationPaymentSettings';
import { DataBackupModal } from './DataBackupModal';
import toast from 'react-hot-toast';

export const TabDonationsBulkManager: React.FC = () => {
  const [subTab, setSubTab] = useState<'records' | 'settings'>('records');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('all');
  const [selectedFY, setSelectedFY] = useState<string>('2025-26');
  const [selectedDonationForView, setSelectedDonationForView] = useState<DonationRecord | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);

  const { settings: paymentSettings } = useDonationPaymentSettings();

  // Retrieve all local + pre-seeded donations
  const allDonations = useMemo(() => {
    let localList: DonationRecord[] = [];
    try {
      const stored = localStorage.getItem('jjf_user_donations');
      if (stored) {
        localList = JSON.parse(stored);
      }
    } catch {
      // Ignore
    }

    const merged = [...localList, ...DONORS_DATA];
    const uniqueMap = new Map<string, DonationRecord>();
    merged.forEach((d) => {
      if (!uniqueMap.has(d.id)) {
        uniqueMap.set(d.id, d);
      }
    });

    return Array.from(uniqueMap.values());
  }, []);

  // Filtered donations
  const filteredDonations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return allDonations.filter((don) => {
      const matchesSearch =
        !q ||
        don.donorName.toLowerCase().includes(q) ||
        (don.phone && don.phone.includes(q)) ||
        (don.panNumber && don.panNumber.toLowerCase().includes(q)) ||
        don.id.toLowerCase().includes(q) ||
        (don.receiptNo && don.receiptNo.toLowerCase().includes(q)) ||
        (don.email && don.email.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (selectedPurpose !== 'all') {
        const p = (don.purposeHindi || don.purpose || '').toLowerCase();
        if (!p.includes(selectedPurpose.toLowerCase())) return false;
      }

      return true;
    });
  }, [allDonations, searchQuery, selectedPurpose]);

  // Aggregate Metrics
  const totalAmount = filteredDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const donorsWithPan = filteredDonations.filter((d) => d.panNumber && d.panNumber.length === 10).length;

  // Export CSV for 80G Tax Filing (Form 10BD format compliant)
  const handleExportForm10BDCsv = () => {
    try {
      const headers = [
        'Receipt No',
        'Date of Donation',
        'Donor Name',
        "Father's Name",
        'Donor PAN',
        'Mobile Number',
        'Email Address',
        'Postal Address',
        'Amount (INR)',
        'Mode of Payment',
        'Transaction Ref / UTR',
        'Purpose of Donation',
        '80G Eligibility',
        'Section Code'
      ];

      const rows = filteredDonations.map((d) => [
        `"${d.receiptNo || d.id}"`,
        `"${new Date(d.date).toLocaleDateString('en-GB')}"`,
        `"${(d.donorName || '').replace(/"/g, '""')}"`,
        `"${(d.fatherName || '').replace(/"/g, '""')}"`,
        `"${d.panNumber || 'NOT PROVIDED'}"`,
        `"${d.phone || ''}"`,
        `"${d.email || ''}"`,
        `"${(d.address || d.city || '').replace(/"/g, '""')}"`,
        d.amount,
        `"${d.paymentMode || 'UPI / Online'}"`,
        `"${d.transactionRef || ''}"`,
        `"${(d.purposeHindi || d.purpose || 'General Welfare').replace(/"/g, '""')}"`,
        '"Eligible u/s 80G(5)(vi)"',
        '"Sec 80G(5)"'
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `JJF_Donations_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('दानदाता डेटा CSV सफलतापूर्वक डाउनलोड हो गया!');
    } catch (err) {
      console.error(err);
      toast.error('CSV निर्यात करने में त्रुटि आई।');
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSubTab('records')}
          className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
            subTab === 'records'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>दानदाता रिकॉर्ड व रसीदें (Donations & Receipts)</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('settings')}
          className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-black transition-all cursor-pointer ${
            subTab === 'settings'
              ? 'bg-blue-800 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-400" />
          <span>बैंक खाता, UPI व QR कोड सेटिंग्स (Bank / UPI / QR Settings)</span>
        </button>
      </div>

      {/* SubTab 2: Payment Settings */}
      {subTab === 'settings' ? (
        <TabDonationPaymentSettings />
      ) : (
        <>
          {/* Top Header Card */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-black">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>दान एवं रसीद प्रबंधन (Donations Hub)</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  दानदाता रिकॉर्ड व थोक रसीद डाउनलोड
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
                  सभी दानदाताओं की आधिकारिक रसीदें, संस्था पंजीकरण: <strong className="text-amber-300 font-mono">{FOUNDATION_INFO.regNo}</strong>, वित्तीय रिकॉर्ड हेतु CSV रिपोर्ट एवं थोक PDF जेनरेशन।
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  id="btn-open-backup-from-donations"
                  onClick={() => setIsBackupModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer border border-white/20"
                  title="समस्त दानदाता व स्वयंसेवक डेटाबेस का पूर्ण JSON बैकअप"
                >
                  <Database className="w-4 h-4 text-amber-300" />
                  <span>डेटा बैकअप (JSON)</span>
                </button>

                <button
                  onClick={handleExportForm10BDCsv}
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>दानदाता सूची CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-gray-500 block">कुल दानदाता (Total Donors)</span>
              <div className="text-2xl font-black text-gray-900 mt-1">
                {filteredDonations.length}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
                {donorsWithPan} दानदाता PAN पंजीकृत
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-gray-500 block">कुल प्राप्त दान राशि (Total Funds)</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">
                ₹ {totalAmount.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-gray-500 mt-0.5 block">
                100% पारदर्शी एवं प्रमाणित दान
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-gray-500 block">संस्था पंजीकरण विवरण</span>
              <div className="text-sm font-mono font-bold text-[#0024B8] mt-1">
                {FOUNDATION_INFO.regNo}
              </div>
              <span className="text-[11px] text-gray-500 mt-0.5 block">
                PAN: {FOUNDATION_INFO.pan} • दर्पण UID: {FOUNDATION_INFO.nitiAayogUid}
              </span>
            </div>
          </div>

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="दानदाता का नाम, मोबाइल, PAN या रसीद संख्या खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedPurpose}
              onChange={(e) => setSelectedPurpose(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-800 focus:outline-none"
            >
              <option value="all">सभी उद्देश्य (All Purposes)</option>
              <option value="shiksha">शिक्षा (Education)</option>
              <option value="bhojan">भोजन (Annapurna Food)</option>
              <option value="swasthya">स्वास्थ्य (Medical/Health)</option>
              <option value="general">समग्र विकास (General)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Donors Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                <th className="py-3 px-4">रसीद संख्या</th>
                <th className="py-3 px-4">दिनांक</th>
                <th className="py-3 px-4">दानदाता का नाम</th>
                <th className="py-3 px-4">PAN नंबर</th>
                <th className="py-3 px-4">मोबाइल / ईमेल</th>
                <th className="py-3 px-4 text-right">राशि (₹)</th>
                <th className="py-3 px-4 text-center">A4 रसीद PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    कोई दानदाता रिकॉर्ड नहीं मिला।
                  </td>
                </tr>
              ) : (
                filteredDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#0024B8]">
                      {d.receiptNo || d.id}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(d.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      <div>{d.donorName}</div>
                      {d.fatherName && <div className="text-[10px] text-gray-500 font-normal">S/O: {d.fatherName}</div>}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-700">
                      {d.panNumber || <span className="text-gray-400 italic">N/A</span>}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div>{d.phone || 'N/A'}</div>
                      <div className="text-[10px] text-gray-400">{d.email || ''}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-emerald-800 text-sm">
                      ₹ {d.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedDonationForView(d)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-[#0024B8] border border-indigo-200 rounded-lg font-bold text-xs inline-flex items-center gap-1 transition cursor-pointer"
                        title="View and Download A4 PDF Receipt"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>रसीद</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

        {/* Selected Donation Receipt PDF View Modal */}
        {selectedDonationForView && (
          <Donation80GReceiptView
            donation={selectedDonationForView}
            onClose={() => setSelectedDonationForView(null)}
          />
        )}

        {/* Firestore Database Backup Modal */}
        <DataBackupModal
          isOpen={isBackupModalOpen}
          onClose={() => setIsBackupModalOpen(false)}
        />
      </>
    )}
  </div>
);
};

export default TabDonationsBulkManager;
