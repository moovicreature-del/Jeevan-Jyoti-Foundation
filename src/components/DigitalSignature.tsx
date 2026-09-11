import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { FOUNDATION_INFO } from '../data/foundationData';
import { BrandLogo } from './common/BrandLogo';

interface DigitalSignatureProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: 'compact' | 'full' | 'stamp' | 'badge';
  title?: string;
  subtitle?: string;
  organization?: string;
}

/**
 * High-definition Royal Blue Overlay Signature of Shailesh Pradhan
 * - Loads '/signature-shailesh-overlay.png' with SVG and fallback paths
 */
export const ShaileshPradhanSignature: React.FC<{
  className?: string;
  width?: number | string;
  size?: 'sm' | 'md' | 'lg' | 'auto' | 'responsive';
  alt?: string;
}> = ({
  className = '',
  width,
  size = 'auto',
  alt = 'Shailesh Pradhan'
}) => {
  const customStyle: React.CSSProperties = {};
  if (width) {
    customStyle.width = typeof width === 'number' ? `${width}px` : width;
  }

  const defaultSizeClass =
    size === 'sm'
      ? 'w-[110px] sm:w-[125px]'
      : size === 'md'
      ? 'w-[135px] sm:w-[155px]'
      : size === 'lg'
      ? 'w-[170px] sm:w-[220px]'
      : 'w-full max-w-[clamp(115px,16cqw,170px)]';

  return (
    <div className="inline-flex items-center justify-center select-none w-full">
      <img
        src="/signature-shailesh-overlay.png"
        alt={alt}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        className={`object-contain pointer-events-none drop-shadow-2xs ${defaultSizeClass} h-auto mx-auto ${className}`}
        style={customStyle}
        onError={(e) => {
          // Fallback to SVG or royalblue PNG if needed
          const target = e.currentTarget;
          if (target.src.includes('signature-shailesh-overlay.png')) {
            target.src = '/signature-shailesh-overlay.svg';
          } else if (target.src.includes('signature-shailesh-overlay.svg')) {
            target.src = '/signature-shailesh-royalblue.png';
          }
        }}
      />
    </div>
  );
};

/**
 * Official Royal Blue Signatory Block with Designation
 * Matches the official layout:
 * - Shailesh Pradhan (Manager / Secretary)
 * - JEEVAN JYOTI FOUNDATION
 */
export const ShaileshPradhanSignatureBlock: React.FC<{
  className?: string;
  imgClassName?: string;
  align?: 'right' | 'left' | 'center';
  isAbsolute?: boolean;
}> = ({
  className = '',
  imgClassName = 'w-full max-w-[clamp(115px,16cqw,165px)] h-auto mx-auto mb-0.5',
  align = 'center',
  isAbsolute = false,
}) => {
  const alignClass =
    align === 'right'
      ? 'text-right items-end'
      : align === 'left'
      ? 'text-left items-start'
      : 'text-center items-center';

  const containerClass = isAbsolute
    ? `absolute bottom-6 sm:bottom-12 md:bottom-20 right-4 sm:right-10 md:right-16 text-center flex flex-col items-center justify-center ${className}`
    : `flex flex-col ${alignClass} ${className}`;

  return (
    <div className={containerClass}>
      <img
        src="/signature-shailesh-overlay.png"
        alt="Signature"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        className={`object-contain pointer-events-none select-none drop-shadow-2xs mx-auto ${imgClassName}`}
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src.includes('signature-shailesh-overlay.png')) {
            target.src = '/signature-shailesh-overlay.svg';
          } else if (target.src.includes('signature-shailesh-overlay.svg')) {
            target.src = '/signature-shailesh-royalblue.png';
          }
        }}
      />
      <div className={`mt-0.5 leading-tight flex flex-col items-center justify-center text-center`}>
        <p className="text-[9pt] sm:text-[10pt] font-bold text-[#1E40AF] tracking-wide text-center">
          {FOUNDATION_INFO.presidentName || 'Shailesh Pradhan'}
        </p>
        <p className="text-[7.5pt] sm:text-[8pt] text-gray-700 font-semibold text-center">
          Manager / Secretary
        </p>
        <p className="text-[7pt] sm:text-[7.5pt] text-gray-600 font-bold uppercase tracking-wider text-center">
          {FOUNDATION_INFO.nameEnglish || 'JEEVAN JYOTI FOUNDATION'}
        </p>
      </div>
    </div>
  );
};

/**
 * Official Red/Gold Round Seal Stamp featuring the JJF circular logo
 */
export const NgoRoundSeal: React.FC<{
  className?: string;
  style?: React.CSSProperties;
  size?: 'sm' | 'md' | 'lg' | 'auto' | 'responsive' | string;
}> = ({
  className = '',
  style,
  size = 'auto'
}) => {
  const sizeClasses =
    size === 'sm'
      ? 'w-14 h-14 text-[6px]'
      : size === 'lg'
      ? 'w-24 h-24 text-[8px]'
      : size === 'md'
      ? 'w-20 h-20 text-[7px]'
      : 'w-full max-w-[clamp(56px,8.5cqw,80px)] aspect-square text-[clamp(5.5px,0.8cqw,7px)]';

  return (
    <div
      className={`relative rounded-full border-2 border-double border-[#8B0000] p-1 flex flex-col items-center justify-center font-bold text-[#8B0000] text-center bg-[#FFFDE7] shrink-0 shadow-xs transform rotate-2 select-none ${sizeClasses} ${className}`}
      style={style}
    >
      {/* Top-Right Verified Green Tick Circle Badge */}
      <div className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-white bg-emerald-600 text-white flex items-center justify-center shadow-xs z-10">
        <CheckCircle2 className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white stroke-[3]" />
      </div>

      <div className="uppercase tracking-tight text-[#8B0000] leading-none font-black text-[6.5px]">
        OFFICIAL SEAL
      </div>

      {/* Embedded Official Logo in Center of Seal */}
      <div className="my-0.5 w-[50%] h-[50%] shrink-0 flex items-center justify-center rounded-full overflow-hidden bg-white/40 p-0.5">
        <BrandLogo size={28} className="w-full h-full object-contain" id="ngo-seal-logo" />
      </div>

      <div className="font-mono font-black text-[#8B0000] leading-none text-[5.5px] sm:text-[6px]">
        ★ JJF GHAZIPUR ★
      </div>
    </div>
  );
};

/**
 * Standard Digital Signature with Royal Blue Signature of Shailesh Pradhan
 */
export const DigitalSignature: React.FC<DigitalSignatureProps> = ({
  className = '',
  style,
  title = 'AUTHORISED SIGNATORY',
  subtitle = 'Manager / Secretary',
  organization = 'JEEVAN JYOTI FOUNDATION'
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center relative font-sans w-full ${className}`} style={style}>
      {/* Official Blue Ink Stamp Seal Box */}
      <div className="relative p-1.5 sm:p-2 px-2.5 sm:px-3.5 rounded-xl border-2 border-dashed border-[#1E40AF]/40 bg-[#FFFDE7]/95 text-[#1E40AF] shadow-xs w-full max-w-[clamp(170px,26cqw,240px)] mx-auto select-none my-0.5">
        {/* Top-Right Solid Green Verified Checkmark Circle Badge */}
        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-white bg-emerald-600 text-white flex items-center justify-center shadow-md z-20">
          <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-[3]" />
        </div>

        <div className="text-[7pt] sm:text-[7.5pt] tracking-wider uppercase font-black text-[#1E40AF] flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#1E40AF]" />
          <span>{title}</span>
        </div>

        {/* Shailesh Pradhan Royal Blue Signature */}
        <div className="my-0.5 py-0.5 flex items-center justify-center">
          <img
            src="/signature-shailesh-overlay.png"
            alt="Shailesh Pradhan Signature"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            className="w-full max-w-[clamp(110px,16cqw,165px)] h-auto object-contain pointer-events-none drop-shadow-2xs"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.includes('signature-shailesh-overlay.png')) {
                target.src = '/signature-shailesh-overlay.svg';
              } else if (target.src.includes('signature-shailesh-overlay.svg')) {
                target.src = '/signature-shailesh-royalblue.png';
              }
            }}
          />
        </div>

        <div className="border-t border-[#1E40AF]/30 pt-0.5 mt-0.5 leading-tight">
          <div className="text-[8.5pt] sm:text-[9.5pt] font-bold text-[#1E40AF] tracking-wide">
            {FOUNDATION_INFO.presidentName || 'Shailesh Pradhan'}
          </div>
          <div className="text-[7pt] sm:text-[7.5pt] text-gray-700 font-semibold">
            {subtitle}
          </div>
          <div className="text-[6.5pt] sm:text-[7pt] text-gray-600 font-bold uppercase tracking-wider truncate">
            {organization}
          </div>
        </div>
      </div>
    </div>
  );
};

export const OfficialSignature = DigitalSignature;

export default DigitalSignature;
