import React from 'react';
import { Languages, Globe } from 'lucide-react';
import { CertificateLanguage } from '../../utils/certificateLanguageUtils';

interface Props {
  language: CertificateLanguage;
  onLanguageChange: (lang: CertificateLanguage) => void;
  className?: string;
  size?: 'sm' | 'md';
}

export const CertificateLanguageToggle: React.FC<Props> = ({
  language,
  onLanguageChange,
  className = '',
  size = 'sm'
}) => {
  return (
    <div className={`inline-flex items-center gap-1 bg-amber-100/90 p-1 rounded-xl border border-amber-300 shadow-2xs ${className}`}>
      <div className="flex items-center gap-1 px-1.5 text-amber-900 font-black text-[11px]">
        <Languages className="w-3.5 h-3.5 text-[#8B0000]" />
        <span className="hidden sm:inline">भाषा (Lang):</span>
      </div>

      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => onLanguageChange('hi')}
          className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
            language === 'hi'
              ? 'bg-[#8B0000] text-white shadow-xs scale-102'
              : 'text-amber-950 hover:bg-amber-200/80'
          }`}
          title="प्रमाण पत्र का पूरा मैटर शुद्ध हिंदी में बदलें"
        >
          हिंदी (Hindi)
        </button>

        <button
          type="button"
          onClick={() => onLanguageChange('en')}
          className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
            language === 'en'
              ? 'bg-[#8B0000] text-white shadow-xs scale-102'
              : 'text-amber-950 hover:bg-amber-200/80'
          }`}
          title="Convert entire certificate content into English"
        >
          English
        </button>

        <button
          type="button"
          onClick={() => onLanguageChange('bilingual')}
          className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
            language === 'bilingual'
              ? 'bg-[#8B0000] text-white shadow-xs scale-102'
              : 'text-amber-950 hover:bg-amber-200/80'
          }`}
          title="द्विभाषी प्रारूप (हिंदी + English)"
        >
          द्विभाषी (Bilingual)
        </button>
      </div>
    </div>
  );
};
