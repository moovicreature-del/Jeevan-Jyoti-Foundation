import React from 'react';
import { CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { FOUNDATION_INFO } from '../../data/foundationData';

interface RoyalCertificateSealProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto' | 'responsive' | number;
  variant?: 'gold-crimson' | 'royal-gold' | 'emerald-gold';
  showRibbons?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * RoyalCertificateSeal
 * High-definition Vector Royal Embossed Seal for Certificates & Official Awards
 * Features outer gold filigree serrated ring, crimson accent, foundation emblem,
 * official registration stars, and authentic ribbon tails.
 * Supports auto-size adjustment based on certificate canvas shape and size.
 */
export const RoyalCertificateSeal: React.FC<RoyalCertificateSealProps> = ({
  size = 'auto',
  variant = 'gold-crimson',
  showRibbons = true,
  className = '',
  style
}) => {
  const isAuto = size === 'auto' || size === 'responsive';
  const numericSize = typeof size === 'number' ? size : null;

  const dimensions = numericSize
    ? {
        seal: numericSize,
        logo: Math.round(numericSize * 0.42),
        ribbonH: Math.round(numericSize * 0.24),
        fontTop: Math.max(6, Math.round(numericSize * 0.085)),
        fontBottom: Math.max(5.5, Math.round(numericSize * 0.075)),
        fontCenter: Math.max(6, Math.round(numericSize * 0.09))
      }
    : !isAuto && typeof size === 'string' && size in { sm: 1, md: 1, lg: 1, xl: 1 }
    ? {
        sm: { seal: 72, logo: 30, ribbonH: 18, fontTop: 6, fontBottom: 5.5, fontCenter: 6.5 },
        md: { seal: 88, logo: 38, ribbonH: 22, fontTop: 7.5, fontBottom: 6.5, fontCenter: 8 },
        lg: { seal: 104, logo: 46, ribbonH: 26, fontTop: 9, fontBottom: 8, fontCenter: 9.5 },
        xl: { seal: 120, logo: 54, ribbonH: 30, fontTop: 10.5, fontBottom: 9, fontCenter: 11 }
      }[size as 'sm' | 'md' | 'lg' | 'xl']
    : {
        // Auto responsive mode: uses fluid proportions
        seal: 86,
        logo: 36,
        ribbonH: 22,
        fontTop: 7.5,
        fontBottom: 6.5,
        fontCenter: 8
      };

  const colors = {
    'gold-crimson': {
      rimOuter: '#B8860B',
      rimGold: '#D4AF37',
      goldLight: '#FFF8DC',
      crimsonDark: '#8B0000',
      crimsonDeep: '#700000',
      textGold: '#8B0000',
      ribbonLeft: '#8B0000',
      ribbonRight: '#A52A2A',
      ribbonBorder: '#D4AF37',
      bgCenter: '#FFFDF5'
    },
    'royal-gold': {
      rimOuter: '#996515',
      rimGold: '#FFD700',
      goldLight: '#FFFDF0',
      crimsonDark: '#0022B8',
      crimsonDeep: '#001A8A',
      textGold: '#0022B8',
      ribbonLeft: '#0022B8',
      ribbonRight: '#1E40AF',
      ribbonBorder: '#FFD700',
      bgCenter: '#FFFDF8'
    },
    'emerald-gold': {
      rimOuter: '#B8860B',
      rimGold: '#D4AF37',
      goldLight: '#F4FBF7',
      crimsonDark: '#047857',
      crimsonDeep: '#065F46',
      textGold: '#065F46',
      ribbonLeft: '#065F46',
      ribbonRight: '#047857',
      ribbonBorder: '#D4AF37',
      bgCenter: '#FFFFFF'
    }
  }[variant];

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${
        isAuto ? 'w-full max-w-[clamp(68px,11cqw,98px)]' : ''
      } ${className}`}
      style={{
        width: isAuto ? undefined : `${dimensions.seal}px`,
        maxWidth: '100%',
        ...style
      }}
    >
      {/* Top-Right Verified Security Checkmark Shield */}
      <div className="absolute -top-1 -right-1 z-20 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white shrink-0">
        <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
      </div>

      {/* Main Circular Royal Embossed Seal */}
      <div
        className="relative rounded-full flex flex-col items-center justify-center text-center shadow-lg transition-transform shrink-0"
        style={{
          width: isAuto ? '100%' : `${dimensions.seal}px`,
          height: isAuto ? undefined : `${dimensions.seal}px`,
          aspectRatio: '1 / 1',
          maxWidth: `${dimensions.seal}px`,
          maxHeight: `${dimensions.seal}px`,
          backgroundColor: colors.bgCenter,
          border: `3px solid ${colors.rimGold}`,
          boxShadow: `0 0 0 2px ${colors.crimsonDark}, 0 4px 12px rgba(139, 0, 0, 0.25)`
        }}
      >
        {/* SVG Serrated Gold Border & Curved Ring Text */}
        <svg
          viewBox="0 0 200 200"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            {/* Top Text Path */}
            <path
              id={`seal-top-path-${size}-${variant}`}
              d="M 28 100 A 72 72 0 0 1 172 100"
              fill="none"
            />
            {/* Bottom Text Path */}
            <path
              id={`seal-bottom-path-${size}-${variant}`}
              d="M 172 100 A 72 72 0 0 1 28 100"
              fill="none"
            />
          </defs>

          {/* Decorative Outer Beaded / Cogged Ring */}
          <circle
            cx="100"
            cy="100"
            r="94"
            fill="none"
            stroke={colors.rimGold}
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          <circle
            cx="100"
            cy="100"
            r="88"
            fill="none"
            stroke={colors.crimsonDark}
            strokeWidth="1.5"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke={colors.rimGold}
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />

          {/* Top Text: Organization Name */}
          <text
            fontSize="14"
            fontWeight="900"
            fill={colors.crimsonDark}
            letterSpacing="2.5"
            textAnchor="middle"
          >
            <textPath
              href={`#seal-top-path-${size}-${variant}`}
              startOffset="50%"
            >
              JEEVAN JYOTI FOUNDATION
            </textPath>
          </text>

          {/* Bottom Text: Reg No & Location */}
          <text
            fontSize="12.5"
            fontWeight="800"
            fill={colors.crimsonDark}
            letterSpacing="1.8"
            textAnchor="middle"
          >
            <textPath
              href={`#seal-bottom-path-${size}-${variant}`}
              startOffset="50%"
            >
              ★ GHAZIPUR • REG. 1827 ★
            </textPath>
          </text>
        </svg>

        {/* Center Emblem with Foundation Logo */}
        <div
          className="relative z-10 rounded-full flex flex-col items-center justify-center p-1 bg-white/95 shadow-inner"
          style={{
            width: `${dimensions.logo + 16}px`,
            height: `${dimensions.logo + 16}px`,
            border: `1.5px solid ${colors.rimGold}`
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <BrandLogo size={dimensions.logo} className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Center Ribbon Title */}
        <div
          className="absolute bottom-4.5 z-10 px-2 py-0.5 rounded-full font-black tracking-widest uppercase shadow-xs flex items-center gap-0.5"
          style={{
            backgroundColor: colors.crimsonDark,
            color: '#FFFFFF',
            border: `1px solid ${colors.rimGold}`,
            fontSize: `${dimensions.fontCenter}px`,
            lineHeight: 1
          }}
        >
          <span>★</span>
          <span>OFFICIAL SEAL</span>
          <span>★</span>
        </div>
      </div>

      {/* Royal Gold Ribbon Tails Underneath */}
      {showRibbons && (
        <div
          className="relative -mt-1.5 z-0 flex items-center justify-center"
          style={{ height: `${dimensions.ribbonH}px` }}
        >
          <svg
            viewBox="0 0 120 40"
            className="h-full w-auto drop-shadow-xs"
          >
            {/* Left Ribbon Tail */}
            <path
              d="M 40 0 L 15 35 L 30 28 L 45 35 L 50 0 Z"
              fill={colors.ribbonLeft}
              stroke={colors.ribbonBorder}
              strokeWidth="1.5"
            />
            {/* Right Ribbon Tail */}
            <path
              d="M 70 0 L 75 35 L 90 28 L 105 35 L 80 0 Z"
              fill={colors.ribbonRight}
              stroke={colors.ribbonBorder}
              strokeWidth="1.5"
            />
            {/* Center Join Band */}
            <rect
              x="42"
              y="0"
              width="36"
              height="10"
              rx="3"
              fill={colors.rimGold}
              stroke={colors.crimsonDark}
              strokeWidth="1"
            />
            <text
              x="60"
              y="7.5"
              fontSize="6.5"
              fontWeight="900"
              fill={colors.crimsonDark}
              textAnchor="middle"
              letterSpacing="0.5"
            >
              GOVT. REG.
            </text>
          </svg>
        </div>
      )}
    </div>
  );
};

export default RoyalCertificateSeal;
