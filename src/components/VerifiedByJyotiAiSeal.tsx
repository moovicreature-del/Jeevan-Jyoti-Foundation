import React from 'react';
import { ShieldCheck, CheckCircle2, Cpu } from 'lucide-react';
import { BrandLogo } from './common/BrandLogo';

interface VerifiedByJyotiAiSealProps {
  status?: 'issued' | 'pending' | 'verified';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const VerifiedByJyotiAiSeal: React.FC<VerifiedByJyotiAiSealProps> = ({
  status = 'issued',
  size = 'md',
  className = '',
  style
}) => {
  const isVerified = status === 'issued' || status === 'verified';

  const theme = isVerified
    ? {
        border: 'border-yellow-400',
        innerBorder: 'border-amber-400',
        bg: 'bg-[#FFFDE7]',
        printBg: '#fffde7',
        textPrimary: 'text-black',
        textSecondary: 'text-black',
        accent: 'text-amber-800',
        badgeBg: 'bg-black',
        badgeText: 'text-yellow-300',
        statusLabel: 'VERIFIED & ISSUED',
        statusDesc: 'Authenticated by Jyoti AI Engine',
        icon: ShieldCheck
      }
    : {
        border: 'border-amber-300',
        innerBorder: 'border-amber-400',
        bg: 'bg-amber-50',
        printBg: '#fffbeb',
        textPrimary: 'text-amber-900',
        textSecondary: 'text-amber-700',
        accent: 'text-amber-600',
        badgeBg: 'bg-amber-600',
        badgeText: 'text-white',
        statusLabel: 'IN REVIEW',
        statusDesc: 'Verification in progress',
        icon: Cpu
      };

  const sizeClasses = {
    sm: {
      sealRadius: 'w-8 h-8',
      iconSize: 'w-4 h-4',
      titleSize: 'text-[9px]',
      descSize: 'text-[7.5px]'
    },
    md: {
      sealRadius: 'w-10 h-10',
      iconSize: 'w-5 h-5',
      titleSize: 'text-[10px]',
      descSize: 'text-[8.5px]'
    },
    lg: {
      sealRadius: 'w-12 h-12',
      iconSize: 'w-6 h-6',
      titleSize: 'text-[11px]',
      descSize: 'text-[9.5px]'
    }
  }[size];

  return (
    <div
      className={`inline-flex items-center gap-2 p-1.5 px-3 rounded-xl border ${theme.border} ${theme.bg} shadow-xs select-none ${className}`}
      style={{ ...style, backgroundColor: theme.printBg }}
    >
      <div className="flex items-center gap-2.5">
        {/* Left Side: Circular/Shield AI Emblem containing the official logo */}
        <div className={`relative flex items-center justify-center ${sizeClasses.sealRadius} rounded-full border-2 border-double ${theme.innerBorder} bg-[#0022B8] shadow-xs shrink-0 overflow-visible p-0.5`}>
          <div className="absolute inset-0.5 rounded-full border border-dotted border-yellow-300 pointer-events-none" />

          {/* Top-Right Verified Green Tick Circle Badge */}
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border border-white bg-emerald-600 text-white flex items-center justify-center shadow-xs z-10">
            <CheckCircle2 className="w-2.5 h-2.5 text-white stroke-[3]" />
          </div>

          {/* Attached Official JJF Logo inside the Shield */}
          <BrandLogo className="w-full h-full" id="jyoti-seal-logo" />
        </div>

        {/* Right Side: Text Information */}
        <div className="text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-black uppercase tracking-wider ${sizeClasses.titleSize} ${theme.textPrimary}`}>
              VERIFIED BY JYOTI AI
            </span>
            <span className={`text-[7px] font-black px-1.5 py-0.2 rounded ${theme.badgeBg} ${theme.badgeText}`}>
              {theme.statusLabel}
            </span>
          </div>
          <p className={`font-medium ${sizeClasses.descSize} ${theme.textSecondary}`}>
            {theme.statusDesc}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifiedByJyotiAiSeal;
