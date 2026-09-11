import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-xs ${className}`}>
      <button
        onClick={() => setLanguage('hi')}
        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
          language === 'hi'
            ? 'bg-orange-600 text-white shadow-xs'
            : 'text-slate-700 hover:text-orange-600'
        }`}
      >
        हिन्दी
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-orange-600 text-white shadow-xs'
            : 'text-slate-700 hover:text-orange-600'
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSelector;
