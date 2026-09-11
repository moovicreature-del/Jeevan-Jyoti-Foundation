import React, { useState } from 'react';
import { Heart, CheckCircle, Sparkles, Download, Award, FileText, ArrowRight, Star, Printer, LayoutGrid, FileSpreadsheet, Search, Filter } from 'lucide-react';
import { DONORS_DATA } from '../data/donorsData';
import { useLanguage } from '../context/LanguageContext';
import { getDonorTier, DONOR_TIERS, DonorTierType } from '../utils/donorTiers';
import { DonationRecord } from '../types';
import { FOUNDATION_INFO } from '../data/foundationData';

interface DonationWallProps {
  onOpenDonate: () => void;
  onOpenDonationCert?: () => void;
  onSelectDonationForCert?: (donation: DonationRecord) => void;
}

type FilterTab = 'all' | DonorTierType;

export const DonationWallOfFame: React.FC<DonationWallProps> = ({
  onOpenDonate,
  onOpenDonationCert,
  onSelectDonationForCert
}) => {
  const { t, isHindi } = useLanguage();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [isPrintView, setIsPrintView] = useState<boolean>(false);
  const [tableSearchQuery, setTableSearchQuery] = useState<string>('');

  // Count donors by tier
  const tierCounts = {
    all: DONORS_DATA.length,
    diamond: DONORS_DATA.filter((d) => d.amount >= 200000).length,
    platinum: DONORS_DATA.filter((d) => d.amount >= 100000 && d.amount < 200000).length,
    gold: DONORS_DATA.filter((d) => d.amount >= 50000 && d.amount < 100000).length,
    silver: DONORS_DATA.filter((d) => d.amount >= 25000 && d.amount < 50000).length,
    general: DONORS_DATA.filter((d) => d.amount < 25000).length,
  };

  // Filter donors based on active tab & optional table search
  const filteredDonors = DONORS_DATA.filter((donor) => {
    if (activeTab !== 'all') {
      const tier = getDonorTier(donor.amount);
      if (tier.key !== activeTab) return false;
    }
    if (tableSearchQuery.trim()) {
      const q = tableSearchQuery.toLowerCase();
      const matchesName = donor.donorName.toLowerCase().includes(q);
      const matchesCity = (donor.city || '').toLowerCase().includes(q);
      const matchesId = donor.id.toLowerCase().includes(q);
      const matchesPurpose = (donor.purpose || '').toLowerCase().includes(q) || (donor.purposeHindi || '').includes(q);
      const matchesPan = (donor.panNumber || '').toLowerCase().includes(q);
      if (!matchesName && !matchesCity && !matchesId && !matchesPurpose && !matchesPan) {
        return false;
      }
    }
    return true;
  });

  const totalFilteredAmount = filteredDonors.reduce((acc, d) => acc + (d.amount || 0), 0);

  const tabOptions: Array<{
    key: FilterTab;
    labelHindi: string;
    labelEnglish: string;
    symbol: string;
    threshold: string;
    colorClass: string;
    activeBg: string;
  }> = [
    {
      key: 'all',
      labelHindi: 'सभी सहयोगी',
      labelEnglish: 'All Patrons',
      symbol: '🏛️',
      threshold: 'All',
      colorClass: 'text-amber-800 border-amber-300',
      activeBg: 'bg-amber-900 text-white shadow-md',
    },
    {
      key: 'diamond',
      labelHindi: 'हीरक भामाशाह (Diamond)',
      labelEnglish: 'Diamond Patrons',
      symbol: '💎',
      threshold: '₹2,00,000+',
      colorClass: 'text-cyan-800 border-cyan-300',
      activeBg: 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-md shadow-cyan-200',
    },
    {
      key: 'platinum',
      labelHindi: 'प्लैटिनम संरक्षक (Platinum)',
      labelEnglish: 'Platinum Patrons',
      symbol: '💠',
      threshold: '₹1,00,000+',
      colorClass: 'text-indigo-800 border-indigo-300',
      activeBg: 'bg-gradient-to-r from-slate-800 via-indigo-700 to-slate-900 text-white shadow-md shadow-indigo-200',
    },
    {
      key: 'gold',
      labelHindi: 'स्वर्ण सहयोगी (Gold)',
      labelEnglish: 'Gold Patrons',
      symbol: '🥇',
      threshold: '₹50,000+',
      colorClass: 'text-amber-800 border-amber-400',
      activeBg: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white shadow-md shadow-amber-200',
    },
    {
      key: 'silver',
      labelHindi: 'रजत सहयोगी (Silver)',
      labelEnglish: 'Silver Patrons',
      symbol: '🥈',
      threshold: '₹25,000+',
      colorClass: 'text-slate-800 border-slate-400',
      activeBg: 'bg-gradient-to-r from-slate-600 to-slate-800 text-white shadow-md shadow-slate-200',
    }
  ];

  return (
    <section id="wall-of-fame" className="py-16 bg-gradient-to-b from-amber-50/60 via-white to-amber-50/40 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2 shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{t('donors.badge', 'सहयोगियों की गौरव पट्टिका (Donors Wall of Fame)', 'Donors Wall of Fame & Esteemed Patrons')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
              {t('donors.title', 'हमारे परम सहयोगी एवं भामाशाह', 'Our Esteemed Donors & Pillars of Support')}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              {t('donors.sub',
                'समर्पित दानदाता जिन्होंने समाज के अंतिम व्यक्ति तक शिक्षा व स्वास्थ्य पहुंचाया।',
                'Dedicated donors empowering community education, food relief, and healthcare.'
              )}
            </p>
          </div>

          {/* Print Version Toggle & Direct Print Button */}
          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0 flex-wrap">
            <button
              type="button"
              id="donors-toggle-print-view"
              onClick={() => setIsPrintView(!isPrintView)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer border ${
                isPrintView
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-amber-400/40'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border-amber-300 shadow-2xs'
              }`}
              title={isPrintView ? 'Switch to Card View' : 'Transform into Print-Optimized Table'}
            >
              {isPrintView ? (
                <>
                  <LayoutGrid className="w-4 h-4 text-amber-400" />
                  <span>{isHindi ? 'कार्ड दृश्य (Card View)' : 'Card View'}</span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4 text-amber-700" />
                  <span>{isHindi ? 'प्रिंट तालिका संस्करण (Print Version)' : 'Print Version'}</span>
                </>
              )}
            </button>

            {isPrintView && (
              <button
                type="button"
                id="donors-print-action-btn"
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                title="Print this donor table directly"
              >
                <Printer className="w-4 h-4" />
                <span>{isHindi ? 'प्रिंट / सेव PDF' : 'Print Table'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tier Explanation Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50/50 border border-cyan-200 p-3 rounded-2xl text-center shadow-2xs">
            <span className="text-xl">💎</span>
            <div className="font-black text-xs text-cyan-950 mt-1">Diamond Donor</div>
            <div className="text-[11px] font-extrabold text-cyan-700 font-mono">₹ 2,00,000 +</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50/50 border border-indigo-200 p-3 rounded-2xl text-center shadow-2xs">
            <span className="text-xl">💠</span>
            <div className="font-black text-xs text-indigo-950 mt-1">Platinum Donor</div>
            <div className="text-[11px] font-extrabold text-indigo-700 font-mono">₹ 1,00,000 +</div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50/50 border border-amber-200 p-3 rounded-2xl text-center shadow-2xs">
            <span className="text-xl">🥇</span>
            <div className="font-black text-xs text-amber-950 mt-1">Gold Donor</div>
            <div className="text-[11px] font-extrabold text-amber-700 font-mono">₹ 50,000 +</div>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-gray-50/50 border border-slate-200 p-3 rounded-2xl text-center shadow-2xs">
            <span className="text-xl">🥈</span>
            <div className="font-black text-xs text-slate-900 mt-1">Silver Donor</div>
            <div className="text-[11px] font-extrabold text-slate-600 font-mono">₹ 25,000 +</div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          {tabOptions.map((tab) => {
            const isActive = activeTab === tab.key;
            const count = tierCounts[tab.key];
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer border ${
                  isActive
                    ? `${tab.activeBg} scale-105 ring-2 ring-amber-400/40`
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-2xs'
                }`}
              >
                <span className="text-sm sm:text-base">{tab.symbol}</span>
                <span>{isHindi ? tab.labelHindi : tab.labelEnglish}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* CONDITIONAL VIEW: 1. PRINT-OPTIMIZED TABLE FORMAT                         */}
        {/* ========================================================================= */}
        {isPrintView ? (
          <div className="space-y-6 animate-in fade-in duration-200 mb-12">
            {/* Table Top Filter & Search Summary Bar */}
            <div className="bg-white border-2 border-slate-300 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 print:border-none print:shadow-none print:p-0">
              <div>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-slate-800" />
                  <h3 className="font-black text-base text-slate-900 font-serif">
                    {isHindi ? 'दानदाता सहयोग विवरण एवं लेखा पंजीका' : 'Official Donors & Contribution Ledger'}
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                    80G Tax Exemption Certified
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isHindi
                    ? `कुल प्रदर्शित दानदाता: ${filteredDonors.length} | कुल सहयोग राशि: ₹ ${totalFilteredAmount.toLocaleString('en-IN')}`
                    : `Showing ${filteredDonors.length} Donors | Total Contribution: ₹ ${totalFilteredAmount.toLocaleString('en-IN')}`}
                </p>
              </div>

              {/* Search in Donors Table */}
              <div className="relative print:hidden min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tableSearchQuery}
                  onChange={(e) => setTableSearchQuery(e.target.value)}
                  placeholder={isHindi ? 'नाम, शहर, रसीद सं. या पैन खोजें...' : 'Search by Name, City, ID, PAN...'}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-amber-600 transition"
                />
              </div>
            </div>

            {/* Print-Optimized Donors Table */}
            <div className="printable-table bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden" data-printable="true">
              {/* Header for actual physical prints */}
              <div className="hidden print:block p-4 border-b border-slate-300 bg-slate-50 text-center">
                <h2 className="text-xl font-black text-black font-serif uppercase tracking-wide">
                  {FOUNDATION_INFO.nameHindi} ({FOUNDATION_INFO.nameEnglish})
                </h2>
                <p className="text-xs text-slate-700 font-medium">
                  {FOUNDATION_INFO.fullAddressHindi} | पंजी. सं.: {FOUNDATION_INFO.regNo} | PAN: {FOUNDATION_INFO.pan}
                </p>
                <div className="text-sm font-bold text-slate-900 mt-1 uppercase underline">
                  दानदाता एवं भामाशाह अभिलेख (Official Donors & Contributions Register)
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-black border-b-2 border-slate-300 uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3 text-center w-12 border-r border-slate-200">क्र.सं.</th>
                      <th className="py-3 px-3 border-r border-slate-200">रसीद सं. (ID)</th>
                      <th className="py-3 px-3 border-r border-slate-200">दानदाता का नाम (Donor Name)</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">शहर (City)</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">श्रेणी (Tier)</th>
                      <th className="py-3 px-3 text-right border-r border-slate-200">सहयोग राशि (Amount)</th>
                      <th className="py-3 px-3 border-r border-slate-200">उद्देश्य / सेवा क्षेत्र (Purpose)</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">दिनांक (Date)</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">सत्यापन</th>
                      <th className="py-3 px-3 text-center print:hidden">रसीद / प्रमाण पत्र</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                    {filteredDonors.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-slate-500 font-medium">
                          {isHindi ? 'कोई दानदाता रिकॉर्ड नहीं मिला।' : 'No donor records found matching criteria.'}
                        </td>
                      </tr>
                    ) : (
                      filteredDonors.map((donor, idx) => {
                        const tier = getDonorTier(donor.amount);
                        return (
                          <tr
                            key={donor.id}
                            className={`hover:bg-amber-50/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                          >
                            <td className="py-2.5 px-3 text-center font-bold text-slate-500 border-r border-slate-200">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900 border-r border-slate-200 whitespace-nowrap">
                              {donor.id}
                            </td>
                            <td className="py-2.5 px-3 font-bold text-slate-900 border-r border-slate-200">
                              {donor.donorName}
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-600 border-r border-slate-200 whitespace-nowrap">
                              {donor.city || 'Ghazipur'}
                            </td>
                            <td className="py-2.5 px-3 text-center border-r border-slate-200 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${tier.badgeBg} ${tier.badgeText} ${tier.badgeBorder}`}>
                                <span>{tier.symbol}</span>
                                <span>{isHindi ? tier.nameHindi.split(' ')[0] : tier.name}</span>
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-black text-[#8B0000] border-r border-slate-200 whitespace-nowrap">
                              ₹ {donor.amount.toLocaleString('en-IN')}
                            </td>
                            <td className="py-2.5 px-3 text-slate-700 border-r border-slate-200">
                              {isHindi ? donor.purposeHindi : donor.purpose}
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-600 border-r border-slate-200 font-mono whitespace-nowrap">
                              {donor.date}
                            </td>
                            <td className="py-2.5 px-3 text-center border-r border-slate-200 whitespace-nowrap">
                              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                {donor.panNumber ? `PAN: ${donor.panNumber.slice(0, 2)}***` : 'Verified'}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center print:hidden whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => {
                                  if (onSelectDonationForCert) {
                                    onSelectDonationForCert(donor);
                                  } else if (onOpenDonationCert) {
                                    onOpenDonationCert();
                                  }
                                }}
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold transition cursor-pointer"
                                title="View Certificate / Receipt"
                              >
                                रसीद व प्रमाण पत्र
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  {/* Table Footer */}
                  <tfoot>
                    <tr className="bg-slate-100 border-t-2 border-slate-300 font-black text-slate-900 text-xs">
                      <td colSpan={2} className="py-3 px-3 text-left">
                        कुल दानदाता: {filteredDonors.length}
                      </td>
                      <td colSpan={3} className="py-3 px-3 text-right uppercase">
                        कुल सहयोग राशि योग (Total Amount):
                      </td>
                      <td className="py-3 px-3 text-right text-[#8B0000] font-mono text-sm font-black">
                        ₹ {totalFilteredAmount.toLocaleString('en-IN')}
                      </td>
                      <td colSpan={4} className="py-3 px-3 text-center text-slate-500 text-[11px] font-normal">
                        धारा 80G आयकर छूट अंतर्गत अधिकृत | जीवन ज्योति फाउंडेशन गाजीपुर
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* CONDITIONAL VIEW: 2. STANDARD CARD GRID VIEW                              */
          /* ========================================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-in fade-in duration-200">
            {filteredDonors.map((donor) => {
              const tier = getDonorTier(donor.amount);
              return (
                <div
                  key={donor.id}
                  className={`rounded-3xl p-6 border-2 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${tier.cardBg} ${tier.cardBorder}`}
                >
                  <div>
                    {/* Top Bar with Tier Badge & Status */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-black tracking-wide px-3 py-1 rounded-full shadow-2xs border ${tier.badgeBg} ${tier.badgeText} ${tier.badgeBorder}`}
                      >
                        <span className="text-sm">{tier.symbol}</span>
                        <span>{isHindi ? tier.nameHindi.split(' ')[0] : tier.name}</span>
                        <span className="opacity-90 font-mono text-[10px]">({tier.thresholdLabel})</span>
                      </span>

                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>{isHindi ? 'सत्यापित दान' : 'Verified Donation'}</span>
                      </div>
                    </div>

                    <h4 className="text-xl font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                      {donor.donorName}
                    </h4>
                    <p className="text-xs text-slate-500 font-bold mt-0.5">{donor.city || 'Ghazipur'}</p>

                    {/* Amount Highlight Box */}
                    <div className="my-4 p-4 rounded-2xl bg-white/90 border border-slate-200/80 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-semibold">{t('donors.amount_label', 'सहयोग राशि', 'Contribution Amount')}</span>
                        <span className="text-xs font-mono font-bold text-slate-400">{donor.id}</span>
                      </div>
                      <p className="text-2xl sm:text-3xl font-black text-[#8B0000] font-mono mt-1">
                        ₹ {donor.amount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-slate-700 font-medium mt-2 leading-snug">
                        <strong className="text-amber-900 font-bold">उद्देश्य: </strong>
                        {isHindi ? donor.purposeHindi : donor.purpose}
                      </p>
                    </div>
                  </div>

                  {/* Footer and Certificate Button */}
                  <div className="pt-3 border-t border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span>{donor.date}</span>
                      <span className="font-mono text-[11px] text-slate-600 font-bold">
                        {donor.panNumber ? `PAN: ${donor.panNumber.slice(0, 2)}***${donor.panNumber.slice(-2)}` : 'Verified'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (onSelectDonationForCert) {
                          onSelectDonationForCert(donor);
                        } else if (onOpenDonationCert) {
                          onOpenDonationCert();
                        }
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:border-amber-500"
                    >
                      <span className="text-base">{tier.symbol}</span>
                      <span>{isHindi ? 'दान सम्मान पत्र व रसीद देखें' : 'View Donation Certificate'}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA Bar */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
          <div className="text-center md:text-left space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-yellow-200 text-xs font-black uppercase mb-1">
              <span>💎 💠 🥇 🥈 Patron Categories</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              {isHindi ? 'आप भी संस्था के विशिष्ट संरक्षक (Patron) बनें' : 'Join as an Esteemed Patron Today'}
            </h3>
            <p className="text-orange-100 text-xs sm:text-sm max-w-xl">
              {isHindi
                ? 'Diamond (2L+), Platinum (1L+), Gold (50K+) या Silver (25K+) श्रेणी में सहयोग कर विशेष सम्मान प्रमाण पत्र व रसीद प्राप्त करें।'
                : 'Contribute under Diamond (2L+), Platinum (1L+), Gold (50K+), or Silver (25K+) tiers with dedicated certification.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenDonate}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-orange-50 text-orange-700 font-black text-sm shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-red-600 fill-red-600" />
              <span>{t('donors.btn_donate', 'संरक्षक बनें (Donate Now)', 'Become a Patron')}</span>
            </button>
            {onOpenDonationCert && (
              <button
                onClick={onOpenDonationCert}
                className="px-5 py-3.5 rounded-xl bg-black/25 hover:bg-black/35 border border-white/40 text-white font-bold text-sm shadow-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{t('donors.btn_receipt', 'रसीद खोजें व डाउनलोड करें', 'Download Receipt')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationWallOfFame;
