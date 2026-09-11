export type DonorTierType = 'diamond' | 'platinum' | 'gold' | 'silver' | 'general';

export interface DonorTierInfo {
  key: DonorTierType;
  name: string;
  nameHindi: string;
  symbol: string;
  minAmount: number;
  thresholdLabel: string;
  thresholdLabelHindi: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  cardBorder: string;
  cardBg: string;
  accentColor: string;
  certificateEmblemClass: string;
}

export const DONOR_TIERS: Record<DonorTierType, DonorTierInfo> = {
  diamond: {
    key: 'diamond',
    name: 'Diamond Patron',
    nameHindi: 'हीरक भामाशाह (Diamond Patron)',
    symbol: '💎',
    minAmount: 200000,
    thresholdLabel: '₹2,00,000+',
    thresholdLabelHindi: '₹2,00,000 या अधिक',
    badgeBg: 'bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-700',
    badgeBorder: 'border-cyan-300',
    badgeText: 'text-white',
    cardBorder: 'border-cyan-300 ring-2 ring-cyan-400/30',
    cardBg: 'bg-gradient-to-b from-cyan-50/90 via-white to-sky-50/40',
    accentColor: '#0284c7',
    certificateEmblemClass: 'bg-gradient-to-r from-cyan-600 to-blue-800 text-white border-2 border-cyan-300'
  },
  platinum: {
    key: 'platinum',
    name: 'Platinum Patron',
    nameHindi: 'प्लैटिनम संरक्षक (Platinum Patron)',
    symbol: '💠',
    minAmount: 100000,
    thresholdLabel: '₹1,00,000+',
    thresholdLabelHindi: '₹1,00,000 या अधिक',
    badgeBg: 'bg-gradient-to-r from-slate-700 via-indigo-600 to-slate-800',
    badgeBorder: 'border-indigo-300',
    badgeText: 'text-white',
    cardBorder: 'border-indigo-300 ring-2 ring-indigo-400/20',
    cardBg: 'bg-gradient-to-b from-indigo-50/80 via-white to-purple-50/30',
    accentColor: '#4f46e5',
    certificateEmblemClass: 'bg-gradient-to-r from-slate-800 to-indigo-900 text-white border-2 border-indigo-300'
  },
  gold: {
    key: 'gold',
    name: 'Gold Patron',
    nameHindi: 'स्वर्ण सहयोगी (Gold Patron)',
    symbol: '🥇',
    minAmount: 50000,
    thresholdLabel: '₹50,000+',
    thresholdLabelHindi: '₹50,000 या अधिक',
    badgeBg: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600',
    badgeBorder: 'border-amber-400',
    badgeText: 'text-white',
    cardBorder: 'border-amber-300 ring-2 ring-amber-400/20',
    cardBg: 'bg-gradient-to-b from-amber-50/90 via-white to-yellow-50/30',
    accentColor: '#d97706',
    certificateEmblemClass: 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 text-white border-2 border-yellow-300'
  },
  silver: {
    key: 'silver',
    name: 'Silver Patron',
    nameHindi: 'रजत सहयोगी (Silver Patron)',
    symbol: '🥈',
    minAmount: 25000,
    thresholdLabel: '₹25,000+',
    thresholdLabelHindi: '₹25,000 या अधिक',
    badgeBg: 'bg-gradient-to-r from-slate-500 to-slate-700',
    badgeBorder: 'border-slate-300',
    badgeText: 'text-white',
    cardBorder: 'border-slate-300 ring-1 ring-slate-300/40',
    cardBg: 'bg-gradient-to-b from-slate-50/90 via-white to-gray-50/30',
    accentColor: '#475569',
    certificateEmblemClass: 'bg-gradient-to-r from-slate-600 to-slate-800 text-white border-2 border-slate-300'
  },
  general: {
    key: 'general',
    name: 'Seva Contributor',
    nameHindi: 'सेवा सहयोगी (Seva Contributor)',
    symbol: '🌟',
    minAmount: 0,
    thresholdLabel: 'Under ₹25,000',
    thresholdLabelHindi: '₹25,000 से कम',
    badgeBg: 'bg-gradient-to-r from-orange-500 to-amber-600',
    badgeBorder: 'border-orange-200',
    badgeText: 'text-white',
    cardBorder: 'border-orange-200',
    cardBg: 'bg-white',
    accentColor: '#ea580c',
    certificateEmblemClass: 'bg-gradient-to-r from-orange-600 to-amber-700 text-white border-2 border-amber-300'
  }
};

/**
 * Determine the tier based on donation amount
 */
export function getDonorTier(amount: number): DonorTierInfo {
  if (amount >= 200000) return DONOR_TIERS.diamond;
  if (amount >= 100000) return DONOR_TIERS.platinum;
  if (amount >= 50000) return DONOR_TIERS.gold;
  if (amount >= 25000) return DONOR_TIERS.silver;
  return DONOR_TIERS.general;
}
