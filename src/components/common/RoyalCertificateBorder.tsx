import React from 'react';

interface RoyalCornerOrnamentProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: string;
  size?: number;
  className?: string;
}

/**
 * High-Precision Vector Royal Filigree Corner Ornament
 * Rendered with crisp SVG geometric paths for crystal-clear 300 DPI print & export.
 */
export const RoyalCornerOrnament: React.FC<RoyalCornerOrnamentProps> = ({
  position,
  color = '#D4AF37', // Royal Gold
  size = 54,
  className = ''
}) => {
  const getTransform = () => {
    switch (position) {
      case 'top-right':
        return 'scaleX(-1)';
      case 'bottom-left':
        return 'scaleY(-1)';
      case 'bottom-right':
        return 'scale(-1, -1)';
      case 'top-left':
      default:
        return 'none';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-2 left-2';
      case 'top-right':
        return 'top-2 right-2';
      case 'bottom-left':
        return 'bottom-2 left-2';
      case 'bottom-right':
        return 'bottom-2 right-2';
    }
  };

  return (
    <div
      className={`absolute ${getPositionClasses()} pointer-events-none select-none z-10 ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: getTransform(),
        transformOrigin: 'center center'
      }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xs"
      >
        {/* Outer Corner L-Frame */}
        <path
          d="M 2 2 L 95 2 L 95 6 L 6 6 L 6 95 L 2 95 Z"
          fill={color}
        />
        {/* Secondary Thin Parallel Frame */}
        <path
          d="M 12 12 L 85 12 L 85 14 L 14 14 L 14 85 L 12 85 Z"
          fill={color}
          opacity="0.85"
        />

        {/* Baroque Scrollwork & Filigree Motif */}
        <path
          d="M 18 18 C 30 18 42 22 48 30 C 54 38 52 48 42 52 C 34 55 24 50 24 40 C 24 32 30 26 38 26 C 44 26 48 30 48 36 C 48 40 45 43 41 43 C 38 43 36 41 36 38"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Mirror Leaf / Petal Curve */}
        <path
          d="M 18 18 C 18 30 22 42 30 48 C 38 54 48 52 52 42 C 55 34 50 24 40 24 C 32 24 26 30 26 38 C 26 44 30 48 36 48 C 40 48 43 45 43 41 C 43 38 41 36 38 36"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Diagonal Crest Axis & Central Diamond */}
        <line x1="8" y1="8" x2="60" y2="60" stroke={color} strokeWidth="1.5" strokeDasharray="3 2" />
        
        {/* Corner Royal Rosette / Diamond */}
        <path
          d="M 22 14 L 26 18 L 22 22 L 18 18 Z"
          fill={color}
        />
        <circle cx="22" cy="22" r="3" fill={color} />
        
        {/* Delicate Corner Flourish Tip */}
        <circle cx="95" cy="4" r="3.5" fill={color} />
        <circle cx="4" cy="95" r="3.5" fill={color} />
        <circle cx="85" cy="13" r="2.5" fill={color} />
        <circle cx="13" cy="85" r="2.5" fill={color} />
      </svg>
    </div>
  );
};

/**
 * Royal Center Filigree Divider / Header Flourish
 */
export const RoyalCenterFlourish: React.FC<{
  color?: string;
  className?: string;
  width?: number;
}> = ({ color = '#D4AF37', className = '', width = 220 }) => {
  return (
    <div className={`flex items-center justify-center my-1 select-none pointer-events-none ${className}`}>
      <svg
        width={width}
        height="18"
        viewBox="0 0 300 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xs"
      >
        {/* Left Filigree Line */}
        <path
          d="M 0 12 L 100 12 M 100 12 C 112 12 118 6 126 6 C 132 6 136 10 134 14 C 132 18 126 18 124 14"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="12" cy="12" r="2.5" fill={color} />
        <circle cx="40" cy="12" r="1.8" fill={color} />
        <circle cx="70" cy="12" r="2" fill={color} />

        {/* Center Royal Crest Diamond & Lotus Motif */}
        <path
          d="M 150 2 L 157 12 L 150 22 L 143 12 Z"
          fill={color}
        />
        <circle cx="150" cy="12" r="2" fill="#FFFFFF" />
        <circle cx="138" cy="12" r="2.5" fill={color} />
        <circle cx="162" cy="12" r="2.5" fill={color} />

        {/* Right Filigree Line (Mirrored) */}
        <path
          d="M 300 12 L 200 12 M 200 12 C 188 12 182 6 174 6 C 168 6 164 10 166 14 C 168 18 174 18 176 14"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="288" cy="12" r="2.5" fill={color} />
        <circle cx="260" cy="12" r="1.8" fill={color} />
        <circle cx="230" cy="12" r="2" fill={color} />
      </svg>
    </div>
  );
};

/**
 * Standard 4-Corner Royal Filigree Set
 */
export const RoyalFourCorners: React.FC<{
  color?: string;
  size?: number;
}> = ({ color = '#D4AF37', size = 52 }) => {
  return (
    <>
      <RoyalCornerOrnament position="top-left" color={color} size={size} />
      <RoyalCornerOrnament position="top-right" color={color} size={size} />
      <RoyalCornerOrnament position="bottom-left" color={color} size={size} />
      <RoyalCornerOrnament position="bottom-right" color={color} size={size} />
    </>
  );
};
