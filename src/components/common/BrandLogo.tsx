import React, { useState, useEffect } from 'react';
import { useHomeContent } from '../../context/HomeContentContext';

export interface BrandLogoProps {
  size?: number | string;
  className?: string;
  variant?: 'default' | 'white' | 'dark';
  watermark?: boolean;
  opacity?: number;
  id?: string;
  alt?: string;
  style?: React.CSSProperties;
  interactive?: boolean;
  customLogoUrl?: string;
  forceVector?: boolean;
  onClick?: (e: React.MouseEvent<SVGSVGElement | HTMLImageElement | HTMLDivElement>) => void;
}

/**
 * BrandLogo - Universal Dynamic NGO Logo Component with Fallback Vector Emblem
 * Dynamically renders custom uploaded app logo or high-precision official JJF vector emblem.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({ 
  size = 200, 
  className = '',
  variant = 'default',
  watermark = false,
  opacity,
  id,
  alt = 'जीवन ज्योति फाउंडेशन आधिकारिक लोगो',
  style = {},
  customLogoUrl,
  forceVector = false,
  onClick
}) => {
  const homeContext = useHomeContent();
  const contextLogo = homeContext?.content?.appLogoUrl || '';

  const [localCustomLogo, setLocalCustomLogo] = useState<string>(() => {
    if (customLogoUrl !== undefined && customLogoUrl !== '') return customLogoUrl;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('jjf_custom_logo');
        if (stored) return stored;
      } catch {
        // Ignore
      }
    }
    return contextLogo || '';
  });

  const [imgFailed, setImgFailed] = useState<boolean>(false);

  // Sync with contextLogo or customLogoUrl
  useEffect(() => {
    if (customLogoUrl !== undefined) {
      setLocalCustomLogo(customLogoUrl);
      setImgFailed(false);
    } else if (contextLogo !== undefined) {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('jjf_custom_logo');
        if (stored) {
          setLocalCustomLogo(stored);
        } else {
          setLocalCustomLogo(contextLogo || '');
        }
      } else {
        setLocalCustomLogo(contextLogo || '');
      }
      setImgFailed(false);
    }
  }, [customLogoUrl, contextLogo]);

  // Listen for instant custom events for immediate updates across all components
  useEffect(() => {
    const handleLogoChange = (e: CustomEvent<string>) => {
      const newLogo = typeof e.detail === 'string' ? e.detail : '';
      setLocalCustomLogo(newLogo);
      setImgFailed(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('jjf-logo-changed' as any, handleLogoChange);
      return () => {
        window.removeEventListener('jjf-logo-changed' as any, handleLogoChange);
      };
    }
  }, []);

  const resolvedSize = typeof size === 'number' 
    ? size 
    : (size === 'xs' ? 24 : size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 64 : size === 'xl' ? 80 : size);

  // Determine active logo URL to render:
  // Priority: 1. explicit prop, 2. local state / event, 3. context, 4. local storage, 5. empty (vector fallback)
  let activeLogoUrl = '';
  if (customLogoUrl !== undefined && customLogoUrl !== '') {
    activeLogoUrl = customLogoUrl;
  } else if (localCustomLogo) {
    activeLogoUrl = localCustomLogo;
  } else if (contextLogo) {
    activeLogoUrl = contextLogo;
  } else if (typeof window !== 'undefined') {
    try {
      activeLogoUrl = localStorage.getItem('jjf_custom_logo') || '';
    } catch {
      activeLogoUrl = '';
    }
  } else {
    activeLogoUrl = '';
  }

  // Reset imgFailed when the URL changes
  useEffect(() => {
    setImgFailed(false);
  }, [activeLogoUrl]);

  const textColor = variant === 'white' ? '#FFFFFF' : '#2E1E6B';
  const personColor = variant === 'white' ? '#FFFFFF' : (variant === 'dark' ? '#1A1820' : '#48395F');
  const finalOpacity = watermark ? (opacity ?? 0.12) : (opacity ?? 1);

  // If a custom logo is active and image hasn't errored, render custom uploaded logo
  if (activeLogoUrl && !imgFailed && !forceVector) {
    const dimensionStyle: React.CSSProperties = typeof resolvedSize === 'number' 
      ? { width: `${resolvedSize}px`, height: `${resolvedSize}px` } 
      : { width: resolvedSize, height: resolvedSize };

    return (
      <img
        id={id}
        src={activeLogoUrl}
        alt={alt}
        className={`object-contain rounded-full inline-block shrink-0 ${className} ${watermark ? 'pointer-events-none select-none' : ''}`}
        style={{
          ...dimensionStyle,
          opacity: finalOpacity,
          ...(watermark ? { filter: 'contrast(1.05)' } : {}),
          ...style
        }}
        onError={() => setImgFailed(true)}
        onClick={onClick}
        loading="eager"
        crossOrigin="anonymous"
      />
    );
  }

  return (
    <svg 
      id={id}
      width={resolvedSize} 
      height={resolvedSize} 
      viewBox="0 0 500 520" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${watermark ? 'pointer-events-none select-none' : ''}`}
      style={{
        opacity: finalOpacity,
        ...style
      }}
      onClick={onClick}
    >
      <defs>
        {/* Exact circular arc for "JEEVAN JYOTI FOUNDATION" arched typography */}
        <path 
          id="jjfOfficialTextArcPrecision" 
          d="M 64 235 A 188 188 0 1 1 436 235" 
          fill="none" 
        />
      </defs>

      {/* 1. Main Background Yellow Circle with Deep Purple Border */}
      <circle 
        cx="250" 
        cy="220" 
        r="210" 
        fill="#FFDE00" 
        stroke="#2E1E6B" 
        strokeWidth="6" 
      />

      {/* 2. Bright Orange Rainbow Halo Band (Upper Semicircular Arc) */}
      <path 
        d="M 105 295 A 150 150 0 1 1 395 295" 
        fill="none" 
        stroke="#FA7815" 
        strokeWidth="28" 
        strokeLinecap="butt" 
      />

      {/* 3. Eight Distinct, Thin, Straight Sunburst Lines Radiating from the Center */}
      <g stroke="#FA7815" strokeWidth="3.5" strokeLinecap="round">
        {/* Ray 1: 168.75° (Leftmost horizontal ray) */}
        <line x1="205" y1="210" x2="112" y2="194" />
        {/* Ray 2: 146.25° (Upper-left diagonal ray) */}
        <line x1="212" y1="195" x2="132" y2="142" />
        {/* Ray 3: 123.75° (Mid-upper-left diagonal ray) */}
        <line x1="225" y1="182" x2="172" y2="104" />
        {/* Ray 4: 101.25° (Near vertical-left ray) */}
        <line x1="240" y1="174" x2="224" y2="82" />
        {/* Ray 5: 78.75° (Near vertical-right ray) */}
        <line x1="260" y1="174" x2="276" y2="82" />
        {/* Ray 6: 56.25° (Mid-upper-right diagonal ray) */}
        <line x1="275" y1="182" x2="328" y2="104" />
        {/* Ray 7: 33.75° (Upper-right diagonal ray) */}
        <line x1="288" y1="195" x2="368" y2="142" />
        {/* Ray 8: 11.25° (Rightmost horizontal ray) */}
        <line x1="295" y1="210" x2="388" y2="194" />
      </g>

      {/* 4. Symmetrical Meditating Yogi in Padmasana with Gyan Mudra Hand Circles on Knees */}
      <g fill={personColor}>
        {/* Rounded Head */}
        <circle cx="250" cy="152" r="19" />
        
        {/* Straight Torso, Sloping Shoulders, Slender Arms, and Symmetric Armpit Negative Space */}
        <path 
          d="
            M 243 174
            C 243 178, 230 188, 204 204
            C 180 218, 160 248, 154 274
            C 152 284, 158 292, 172 286
            C 184 280, 198 266, 206 252
            C 212 242, 216 232, 218 220
            C 218 232, 218 248, 216 268
            C 208 278, 182 290, 165 302
            C 157 308, 163 318, 180 320
            C 202 322, 235 316, 250 316
            C 265 316, 298 322, 320 320
            C 337 318, 343 308, 335 302
            C 318 290, 292 278, 284 268
            C 282 248, 282 232, 282 220
            C 284 232, 288 242, 294 252
            C 302 266, 316 280, 328 286
            C 342 292, 348 284, 346 274
            C 340 248, 320 218, 296 204
            C 270 188, 257 178, 257 174
            Z
          " 
        />

        {/* Full Lotus Base / Crossed Limbs */}
        <ellipse cx="250" cy="308" rx="72" ry="16" />

        {/* Left Hand: Explicit Small Circle on Knee for Gyan Mudra */}
        <circle cx="164" cy="288" r="8.5" fill={personColor} stroke="#FFDE00" strokeWidth="1" />
        
        {/* Right Hand: Explicit Small Circle on Knee for Gyan Mudra */}
        <circle cx="336" cy="288" r="8.5" fill={personColor} stroke="#FFDE00" strokeWidth="1" />
      </g>

      {/* 5. Dual Perfectly Symmetrical Green Leaves with White Crescent Highlights & Sharp V-Stem */}
      <g>
        {/* Left Green Leaf */}
        <path 
          d="
            M 250 495 
            C 246 435, 208 390, 138 344 
            C 90 338, 40 354, 24 358 
            C 36 378, 82 432, 148 464 
            C 190 484, 228 492, 250 495 
            Z
          " 
          fill="#0E9F43" 
          stroke="#0A7E35"
          strokeWidth="2"
        />

        {/* Right Green Leaf */}
        <path 
          d="
            M 250 495 
            C 254 435, 292 390, 362 344 
            C 410 338, 460 354, 476 358 
            C 464 378, 418 432, 352 464 
            C 310 484, 272 492, 250 495 
            Z
          " 
          fill="#0E9F43" 
          stroke="#0A7E35"
          strokeWidth="2"
        />

        {/* Left Leaf White Highlight Stroke */}
        <path 
          d="M 235 475 C 185 455, 115 410, 115 358" 
          stroke="white" 
          strokeWidth="6" 
          strokeLinecap="round" 
          fill="none" 
        />

        {/* Right Leaf White Highlight Stroke */}
        <path 
          d="M 265 475 C 315 455, 385 410, 385 358" 
          stroke="white" 
          strokeWidth="6" 
          strokeLinecap="round" 
          fill="none" 
        />

        {/* Sharp Central Stem Sprout Point at Bottom Center */}
        <polygon points="246,488 250,512 254,488" fill="#0A7E35" />
      </g>

      {/* 6. Arched Top Typography: JEEVAN JYOTI FOUNDATION */}
      <text 
        fill={textColor} 
        fontSize="31" 
        fontFamily="'Arial Black', 'Trebuchet MS', 'Impact', sans-serif" 
        fontWeight="900" 
        letterSpacing="1.2"
      >
        <textPath 
          href="#jjfOfficialTextArcPrecision" 
          startOffset="50%" 
          textAnchor="middle"
        >
          JEEVAN JYOTI FOUNDATION
        </textPath>
      </text>
    </svg>
  );
};

export default BrandLogo;
