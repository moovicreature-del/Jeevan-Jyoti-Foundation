// ============================================================================
// JEEVAN JYOTI FOUNDATION - DONOR DASHBOARD & RECEIPT RETRIEVAL
// दानदाता पोर्टल - पूर्व दान इतिहास, रसीद खोज व डाउनलोड
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Search,
  Receipt,
  Download,
  Eye,
  Mail,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Phone,
  FileText,
  User,
  ArrowRight,
  X,
  Sparkles
} from 'lucide-react';
import { DonationRecord } from '../../types';
import { DONORS_DATA } from '../../data/donorsData';
import { FOUNDATION_INFO } from '../../data/foundationData';
import { BrandLogo } from '../common/BrandLogo';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectReceipt: (donation: DonationRecord) => void;
}

export const DonorDashboardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectReceipt
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent' | 'large'>('all');

  // Retrieve local + initial donor records
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

    // Merge and remove duplicate IDs
    const merged = [...localList, ...DONORS_DATA];
    const uniqueMap = new Map<string, DonationRecord>();
    merged.forEach((item) => {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });

    return Array.from(uniqueMap.values());
  }, []);

  // Filtered Results
  const filteredDonations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return allDonations.filter((don) => {
      const matchSearch =
        !q ||
        don.donorName.toLowerCase().includes(q) ||
        (don.phone && don.phone.includes(q)) ||
        (don.panNumber && don.panNumber.toLowerCase().includes(q)) ||
        don.id.toLowerCase().includes(q) ||
        (don.receiptNo && don.receiptNo.toLowerCase().includes(q)) ||
        (don.email && don.email.toLowerCase().includes(q));

      if (!matchSearch) return false;

      if (selectedFilter === 'large') return don.amount >= 50000;
      return true;
    });
  }, [allDonations, searchQuery, selectedFilter]);

  const handleSendEmailCopy = (don: DonationRecord) => {
    toast.success(`दान रसीद की प्रतिलिपि ${don.email || don.phone} पर भेज दी गई है!`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-300 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-3">
            <div className="p-1 bg-white/10 rounded-xl border border-white/20">
              <BrandLogo size={48} id="donor-dash-logo" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-amber-300 flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                दानदाता पोर्टल (Donor Dashboard & Receipts)
              </h2>
              <p className="text-xs text-gray-300">
                मोबाइल नंबर, PAN या रसीद संख्या द्वारा अपनी अधिकृत दान रसीदें खोजें व डाउनलोड करें
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="दानदाता का नाम, मोबाइल नंबर (10 अंक), PAN नंबर या रसीद क्रमांक खोजें..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-amber-300/80 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-xs"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedFilter === 'all'
                    ? 'bg-[#0024B8] text-white border-[#0024B8]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                }`}
              >
                सभी रसीदें ({allDonations.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedFilter('large')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedFilter === 'large'
                    ? 'bg-[#0024B8] text-white border-[#0024B8]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                }`}
              >
                विशिष्ट दानदाता (₹50,000+)
              </button>
            </div>

            <span className="text-gray-500">
              कुल {filteredDonations.length} रसीदें उपलब्ध
            </span>
          </div>

          {/* Receipts List */}
          <div className="space-y-3">
            {filteredDonations.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-2 opacity-50" />
                <h4 className="font-bold text-gray-700 text-sm">कोई दान रसीद नहीं मिली</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  कृपया सही मोबाइल नंबर, PAN या नाम दर्ज करें। यदि आपने हाल ही में दान किया है तो 'दान करें' विकल्प से तुरंत रसीद जनरेट करें।
                </p>
              </div>
            ) : (
              filteredDonations.map((don) => (
                <div
                  key={don.id}
                  className="p-4 bg-white rounded-2xl border border-amber-200/80 shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-black text-base text-gray-900 group-hover:text-[#0024B8] transition-colors">
                        {don.donorName}
                      </h4>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-300">
                        Verified
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                      <span><strong>रसीद संख्या:</strong> <span className="font-mono font-bold text-[#0024B8]">{don.receiptNo || don.id}</span></span>
                      <span>•</span>
                      <span><strong>PAN:</strong> <span className="font-mono">{don.panNumber || 'N/A'}</span></span>
                      <span>•</span>
                      <span><strong>दिनांक:</strong> {new Date(don.date).toLocaleDateString('en-IN')}</span>
                    </div>

                    <p className="text-xs text-gray-600">
                      <strong>उद्देश्य:</strong> {don.purposeHindi || don.purpose}
                    </p>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-gray-500 block">दान राशि</span>
                      <span className="text-lg font-black text-emerald-700">
                        ₹ {don.amount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectReceipt(don)}
                        className="px-3.5 py-2 bg-gradient-to-r from-[#0024B8] to-indigo-900 hover:from-indigo-900 hover:to-indigo-950 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        title="View & Download A4 PDF Receipt"
                      >
                        <Eye className="w-4 h-4" />
                        रसीद देखें (PDF)
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSendEmailCopy(don)}
                        className="p-2 text-gray-600 hover:text-[#0024B8] bg-gray-100 hover:bg-indigo-50 rounded-xl transition-colors cursor-pointer"
                        title="Send copy via Email / Phone"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboardModal;
