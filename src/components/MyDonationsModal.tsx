import React, { useState } from 'react';
import { X, Heart, Search, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import { DONORS_DATA } from '../data/donorsData';
import { DonationRecord } from '../types';
import { getDonorTier, DonorTierType } from '../utils/donorTiers';

interface MyDonationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDonationForCert: (donor: DonationRecord) => void;
}

export const MyDonationsModal: React.FC<MyDonationsModalProps> = ({
  isOpen,
  onClose,
  onSelectDonationForCert
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');

  if (!isOpen) return null;

  const filtered = DONORS_DATA.filter((d) => {
    const matchesSearch =
      d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.city && d.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.phone && d.phone.includes(searchTerm));

    if (!matchesSearch) return false;
    if (selectedTier === 'all') return true;
    const tier = getDonorTier(d.amount);
    return tier.key === selectedTier;
  });

  const tierFilterButtons = [
    { key: 'all', label: 'सभी (All)', symbol: '🏛️' },
    { key: 'diamond', label: '💎 Diamond (2L+)', symbol: '💎' },
    { key: 'platinum', label: '💠 Platinum (1L+)', symbol: '💠' },
    { key: 'gold', label: '🥇 Gold (50K+)', symbol: '🥇' },
    { key: 'silver', label: '🥈 Silver (25K+)', symbol: '🥈' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs overflow-y-auto overscroll-contain">
      <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-white text-white" />
            <h3 className="font-bold text-base">मेरे दान एवं रसीदें (My Donations & Receipts)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tier Filter */}
        <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="नाम, फोन नंबर, शहर या डोनेशन ID द्वारा खोजें..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>

          {/* Tier Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {tierFilterButtons.map((btn) => {
              const active = selectedTier === btn.key;
              return (
                <button
                  key={btn.key}
                  onClick={() => setSelectedTier(btn.key)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    active
                      ? 'bg-amber-900 text-white border-amber-900 shadow-2xs'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1">
          {filtered.length > 0 ? (
            filtered.map((donor) => {
              const tier = getDonorTier(donor.amount);
              return (
                <div
                  key={donor.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs ${tier.cardBg} ${tier.cardBorder}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border shadow-2xs ${tier.badgeBg} ${tier.badgeText} ${tier.badgeBorder}`}>
                        {tier.symbol} {tier.name}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-700 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                        {donor.id}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Verified Valid
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-black text-slate-900">{donor.donorName}</h4>
                    <p className="text-xs text-slate-600">
                      {donor.purposeHindi || donor.purpose} • {donor.city || 'Ghazipur'} • {donor.date}
                    </p>
                    <p className="text-base font-black text-[#8B0000] font-mono">
                      ₹ {donor.amount.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onSelectDonationForCert(donor);
                      onClose();
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-[#8B0000] hover:bg-[#700000] text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>दान रसीद देखें</span>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-slate-500 text-xs">
              कोई दान रिकॉर्ड नहीं मिला। कृपया अन्य कीवर्ड या श्रेणी चुनें।
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default MyDonationsModal;
