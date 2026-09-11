import React from 'react';
import { ShieldCheck, CheckCircle2, Globe, ExternalLink, Calendar, Lock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { BrandLogo } from './BrandLogo';

export interface OfficialVerifiedBadgeProps {
  certificateId: string;
  customVerifyUrl?: string;
  verificationDate?: string;
  size?: 'sm' | 'md' | 'lg' | 'compact' | 'micro';
  theme?: 'gold' | 'royal' | 'emerald' | 'navy' | 'light';
  language?: 'hi' | 'en' | 'bilingual';
  showUrlText?: boolean;
  showQr?: boolean;
  layout?: 'row' | 'corner' | 'compact';
  className?: string;
  style?: React.CSSProperties;
}

export const OfficialVerifiedBadge: React.FC<OfficialVerifiedBadgeProps> = ({
  certificateId,
  customVerifyUrl,
  verificationDate,
  size = 'md',
  theme = 'gold',
  language = 'bilingual',
  showUrlText = true,
  showQr = true,
  layout = 'row',
  className = '',
  style
}) => {
  // Determine site base URL dynamically
  const baseUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://jeevanjyotifoundation.org';

  const dynamicVerifyUrl = customVerifyUrl || `${baseUrl}/?verify=${encodeURIComponent(certificateId)}`;
  const displayUrl = dynamicVerifyUrl.replace(/^https?:\/\//, '');

  // Dynamic date (defaults to current date for live authenticity, or formatted verificationDate)
  const displayDate =
    verificationDate ||
    new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date());

  const themeStyles = {
    gold: {
      container: 'bg-[#FFFDF0] border-amber-400 text-slate-900 print:bg-white print:border-amber-500',
      printBg: '#fffdf0',
      innerRing: 'border-amber-500 bg-amber-50',
      badgeBg: 'bg-amber-800 text-amber-50',
      accentText: 'text-amber-900',
      iconColor: 'text-amber-800',
      urlBox: 'bg-white/95 border-amber-300 text-amber-950',
      verifiedPill: 'bg-emerald-700 text-white'
    },
    royal: {
      container: 'bg-[#FFFDF8] border-[#8B0000]/40 text-slate-900 print:bg-white print:border-[#8B0000]',
      printBg: '#fffdf8',
      innerRing: 'border-[#8B0000] bg-red-50',
      badgeBg: 'bg-[#8B0000] text-amber-200',
      accentText: 'text-[#8B0000]',
      iconColor: 'text-[#8B0000]',
      urlBox: 'bg-white/95 border-red-200 text-red-950',
      verifiedPill: 'bg-emerald-700 text-white'
    },
    emerald: {
      container: 'bg-[#F4FBF7] border-emerald-500/50 text-slate-900 print:bg-white print:border-emerald-600',
      printBg: '#f4fbf7',
      innerRing: 'border-emerald-600 bg-emerald-50',
      badgeBg: 'bg-emerald-800 text-emerald-100',
      accentText: 'text-emerald-950',
      iconColor: 'text-emerald-700',
      urlBox: 'bg-white/95 border-emerald-300 text-emerald-950',
      verifiedPill: 'bg-emerald-700 text-white'
    },
    navy: {
      container: 'bg-[#F6F8FD] border-blue-400 text-slate-900 print:bg-white print:border-blue-600',
      printBg: '#f6f8fd',
      innerRing: 'border-blue-700 bg-blue-50',
      badgeBg: 'bg-[#0022B8] text-white',
      accentText: 'text-blue-950',
      iconColor: 'text-[#0022B8]',
      urlBox: 'bg-white/95 border-blue-200 text-blue-950',
      verifiedPill: 'bg-emerald-700 text-white'
    },
    light: {
      container: 'bg-white border-slate-300 text-slate-900 print:border-slate-800',
      printBg: '#ffffff',
      innerRing: 'border-slate-400 bg-slate-50',
      badgeBg: 'bg-slate-800 text-white',
      accentText: 'text-slate-900',
      iconColor: 'text-slate-800',
      urlBox: 'bg-slate-50 border-slate-200 text-slate-900',
      verifiedPill: 'bg-emerald-700 text-white'
    }
  }[theme];

  // Micro / Minimal Badge for tight ID cards or sub-footers
  if (size === 'micro') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 p-1 px-2 rounded-md border text-[6.5pt] font-mono select-none ${themeStyles.container} ${className}`}
        style={{ ...style }}
      >
        <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
        <span className="font-bold uppercase tracking-wider text-emerald-900">OFFICIAL VERIFIED</span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-700 font-bold">{displayDate}</span>
      </div>
    );
  }

  // Compact Variant (e.g., inside Swayam Sewak ID Cards or compact certificates)
  if (size === 'compact' || layout === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2 p-1.5 px-2 rounded-lg border-2 shadow-2xs select-none ${themeStyles.container} ${className}`}
        style={{ ...style }}
      >
        {showQr && (
          <div className="p-0.5 bg-white border border-slate-200 rounded shrink-0 shadow-2xs">
            <QRCodeSVG
              value={dynamicVerifyUrl}
              size={28}
              level="M"
              marginSize={0}
              fgColor="#0022B8"
              bgColor="#FFFFFF"
            />
          </div>
        )}

        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
        </div>

        <div className="text-left leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-[7.5pt] font-black uppercase tracking-wider text-emerald-800">
              {language === 'hi' ? 'शासकीय सत्यापित' : 'OFFICIAL VERIFIED'}
            </span>
            <span className="text-[6.5pt] font-mono font-bold text-gray-600">
              {displayDate}
            </span>
          </div>
          {showUrlText && (
            <div className="text-[6.5pt] font-mono text-blue-900 truncate max-w-[190px] font-bold">
              {displayUrl}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Bottom-Right Corner Specialized Variant
  if (layout === 'corner') {
    const isSm = size === 'sm';
    const qrDim = isSm ? 42 : 52;

    return (
      <div
        className={`inline-flex flex-col items-end text-right p-2 px-2.5 rounded-xl border-2 shadow-xs select-none ${themeStyles.container} ${className}`}
        style={{ ...style }}
        data-verified-badge="corner"
      >
        {/* Top Header inside corner badge: Official Verified + Date */}
        <div className="flex items-center justify-between w-full gap-2 border-b border-amber-300/60 pb-1 mb-1.5">
          <span className="text-[6.5pt] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-700 text-white flex items-center gap-0.5">
            <CheckCircle2 className="w-2.5 h-2.5 text-white stroke-[3]" />
            <span>OFFICIAL VERIFIED</span>
          </span>

          <span className="text-[6.5pt] font-mono font-bold text-gray-700 flex items-center gap-0.5">
            <Calendar className="w-2.5 h-2.5 text-gray-500" />
            <span>{displayDate}</span>
          </span>
        </div>

        {/* Middle: QR Code + Live Verification URL Details */}
        <div className="flex items-center gap-2 w-full justify-end">
          {showUrlText && (
            <div className="text-right leading-tight max-w-[150px] font-mono">
              <div className="text-[6pt] text-gray-500 font-sans uppercase font-bold tracking-tight">
                {language === 'hi' ? 'डिजिटल सत्यापन लिंक:' : 'Verify Live Record:'}
              </div>
              <a
                href={dynamicVerifyUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[6.5pt] font-bold text-blue-900 hover:underline break-all block truncate"
              >
                {displayUrl}
              </a>
              <div className="text-[6pt] text-emerald-800 font-bold mt-0.5 font-sans">
                ID: <span className="font-mono text-black">{certificateId}</span>
              </div>
            </div>
          )}

          {showQr && (
            <div className="p-1 bg-white border border-slate-300 rounded-lg shrink-0 shadow-2xs flex flex-col items-center">
              <QRCodeSVG
                value={dynamicVerifyUrl}
                size={qrDim}
                level="M"
                marginSize={0}
                fgColor="#0a1128"
                bgColor="#FFFFFF"
              />
              <span className="text-[5pt] font-mono font-bold text-gray-500 mt-0.5 uppercase tracking-tighter">
                OFFICIAL QR
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';
  const qrSize = isSmall ? 34 : isLarge ? 46 : 38;

  return (
    <div
      className={`relative inline-flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 p-2 px-2.5 rounded-xl border-2 shadow-xs select-none ${themeStyles.container} ${className}`}
      style={{ ...style }}
      data-verified-badge="true"
    >
      {/* 1. Left: Official Seal & Verification Shield */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="relative">
          <div
            className={`flex items-center justify-center rounded-full border-2 border-double ${themeStyles.innerRing} ${
              isSmall ? 'w-8 h-8 p-0.5' : isLarge ? 'w-11 h-11 p-1' : 'w-9 h-9 p-0.5'
            } shadow-inner`}
          >
            <BrandLogo className="w-full h-full object-contain" id={`verified-badge-logo-${certificateId}`} />
          </div>

          {/* Absolute green tick overlay */}
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 border border-white text-white flex items-center justify-center shadow-xs z-10">
            <CheckCircle2 className="w-3 h-3 text-white stroke-[3]" />
          </div>
        </div>

        {/* Verification Title & NGO Metadata */}
        <div className="text-left leading-tight">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`font-black uppercase tracking-wide flex items-center gap-1 ${themeStyles.accentText} ${
                isSmall ? 'text-[8pt]' : isLarge ? 'text-[10pt]' : 'text-[9pt]'
              }`}
            >
              <ShieldCheck className={`${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-emerald-600 shrink-0`} />
              <span>
                {language === 'hi'
                  ? 'शासकीय सत्यापित प्रति'
                  : language === 'en'
                  ? 'OFFICIAL VERIFIED'
                  : 'OFFICIAL VERIFIED • आधिकारिक सत्यापित'}
              </span>
            </span>

            <span
              className={`text-[6.5pt] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider ${themeStyles.verifiedPill}`}
            >
              ✓ AUTHENTIC RECORD
            </span>
          </div>

          <div className="flex items-center gap-2 text-[7pt] text-gray-700 font-bold mt-0.5 flex-wrap">
            <span className="flex items-center gap-0.5">
              <Calendar className="w-2.5 h-2.5 text-gray-500 shrink-0" />
              <span>सत्यापन तिथि / Validated: <strong className="text-black font-mono">{displayDate}</strong></span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-0.5 font-mono text-gray-800">
              <Lock className="w-2.5 h-2.5 text-emerald-700 shrink-0" />
              <span>ID: {certificateId}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Middle / Right: Dynamic Verification Link and Mini Scannable QR Code */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        {showUrlText && (
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-left font-mono leading-tight ${themeStyles.urlBox} ${
              isSmall ? 'text-[6.5pt]' : 'text-[7pt]'
            }`}
          >
            <Globe className="w-3 h-3 text-blue-700 shrink-0" />
            <div className="truncate max-w-[180px] sm:max-w-[240px]">
              <span className="text-gray-500 font-sans text-[6pt] block">Live QR Verification URL:</span>
              <a
                href={dynamicVerifyUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-900 font-black hover:underline"
              >
                {displayUrl}
              </a>
            </div>
            <ExternalLink className="w-2.5 h-2.5 text-gray-400 shrink-0" />
          </div>
        )}

        {showQr && (
          <div className="p-1 bg-white border border-slate-300 rounded-lg shrink-0 shadow-2xs flex flex-col items-center">
            <QRCodeSVG
              value={dynamicVerifyUrl}
              size={qrSize}
              level="M"
              marginSize={0}
              fgColor="#0a1128"
              bgColor="#FFFFFF"
            />
            <span className="text-[5.5pt] font-mono font-bold text-gray-500 mt-0.5 uppercase tracking-tighter">
              OFFICIAL QR
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficialVerifiedBadge;
