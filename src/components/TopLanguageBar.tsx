import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Globe,
  Languages,
  ChevronDown,
  Check,
  RotateCcw,
  Sparkles,
  Search,
  X,
  Phone,
  Lock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { FOUNDATION_INFO } from '../data/foundationData';
import { applyLiveTranslation } from '../utils/liveUiTranslator';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region?: string;
  popular?: boolean;
}

export const ALL_LANGUAGES: LanguageOption[] = [
  // Primary Indian Languages
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', region: 'राष्ट्रीय भाषा (National)', popular: true },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', region: 'Global / Official', popular: true },
  { code: 'bho', name: 'Bhojpuri', nativeName: 'भोजपुरी', flag: '🌾', region: 'पूर्वांचल / गाजीपुर स्थानीय', popular: true },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', flag: '🕉️', region: 'प्राचीन देवभाषा', popular: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🌸', region: 'West Bengal', popular: true },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🚩', region: 'Maharashtra', popular: true },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🦁', region: 'Gujarat', popular: true },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🦚', region: 'Tamil Nadu', popular: true },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🏛️', region: 'Andhra / Telangana', popular: true },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🌙', region: 'National / Regional', popular: true },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🪯', region: 'Punjab', popular: true },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🌊', region: 'Odisha', popular: false },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🌴', region: 'Kerala', popular: false },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🐘', region: 'Karnataka', popular: false },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🫖', region: 'Assam', popular: false },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🏔️', region: 'Nepal / Border', popular: false },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', flag: '🦚', region: 'Bihar / Purvanchal', popular: false },

  // World Languages
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', region: 'International', popular: false },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', region: 'International', popular: false },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', region: 'Middle East', popular: false },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', region: 'Europe', popular: false },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', region: 'Eurasia', popular: false },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', region: 'Asia', popular: false },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳', region: 'Asia', popular: false }
];

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

interface TopLanguageBarProps {
  onOpenAdmin?: () => void;
  onOpenStaff?: (tab?: 'options' | 'registration' | 'download') => void;
}

export const TopLanguageBar: React.FC<TopLanguageBarProps> = ({ onOpenAdmin, onOpenStaff }) => {
  const { language, setLanguage } = useLanguage();

  const [selectedLang, setSelectedLang] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
        if (match && match[1]) {
          const parts = decodeURIComponent(match[1]).split('/');
          const code = parts[parts.length - 1];
          if (code) return code;
        }
        return (
          localStorage.getItem('jjf_selected_language') ||
          localStorage.getItem('jjf_portal_lang') ||
          language ||
          'hi'
        );
      }
    } catch {
      // Fallback
    }
    return language || 'hi';
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSizeLevel, setFontSizeLevel] = useState<number>(100);
  const [langToast, setLangToast] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync selectedLang if LanguageContext changes
  useEffect(() => {
    if (language && language !== selectedLang) {
      setSelectedLang(language);
    }
  }, [language]);

  // Helper to trigger Google Translate's hidden combo box
  const triggerGoogleTranslateCombo = useCallback((langCode: string): boolean => {
    if (typeof document === 'undefined') return false;
    const select =
      document.querySelector<HTMLSelectElement>('select.goog-te-combo') ||
      document.querySelector<HTMLSelectElement>('#google_translate_element select');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      select.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }
    return false;
  }, []);

  // Initialize Google Translate Script safely after mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initTranslate = () => {
      try {
        if (window.google && window.google.translate) {
          const container = document.getElementById('google_translate_element');
          if (container && !container.hasChildNodes()) {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'hi',
                autoDisplay: false
              },
              'google_translate_element'
            );

            // If a language other than Hindi is already active, re-trigger
            setTimeout(() => {
              const current =
                localStorage.getItem('jjf_selected_language') ||
                localStorage.getItem('jjf_portal_lang');
              if (current && current !== 'hi') {
                triggerGoogleTranslateCombo(current);
              }
            }, 600);
          }
        }
      } catch (err) {
        console.debug('Google Translate init note:', err);
      }
    };

    window.googleTranslateElementInit = initTranslate;

    const existingScript = document.getElementById('google-translate-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.async = true;
      script.src =
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      initTranslate();
    }
  }, [triggerGoogleTranslateCombo]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Change language function
  const handleSelectLanguage = useCallback(
    (langCode: string) => {
      const targetLang = langCode || 'hi';
      setSelectedLang(targetLang);
      setIsDropdownOpen(false);

      // 1. Immediately update React Context & HTML attribute & Storage
      setLanguage(targetLang);
      try {
        localStorage.setItem('jjf_selected_language', targetLang);
        localStorage.setItem('jjf_portal_lang', targetLang);
        if (typeof document !== 'undefined') {
          document.documentElement.lang = targetLang;
        }
      } catch {
        // Ignore storage errors
      }

      // 2. Trigger instant in-memory DOM & Text node translation
      applyLiveTranslation(targetLang);

      // 3. Show instant visual notification
      const matched = ALL_LANGUAGES.find((l) => l.code === targetLang);
      if (matched) {
        setLangToast(`${matched.flag} भाषा बदली गई: ${matched.nativeName} (${matched.name})`);
        setTimeout(() => setLangToast(null), 3200);
      }

      // 2. Set Google Translate cookies across all scopes
      try {
        const domain = window.location.hostname;
        if (targetLang === 'hi') {
          // Clear translation to restore native Hindi
          document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          if (domain && domain.includes('.')) {
            document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;
            const parts = domain.split('.');
            if (parts.length > 2) {
              const parentDomain = '.' + parts.slice(-2).join('.');
              document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${parentDomain};`;
            }
          }
        } else {
          document.cookie = `googtrans=/hi/${targetLang}; path=/; max-age=31536000;`;
          if (domain && domain.includes('.')) {
            document.cookie = `googtrans=/hi/${targetLang}; path=/; domain=${domain}; max-age=31536000;`;
            const parts = domain.split('.');
            if (parts.length > 2) {
              const parentDomain = '.' + parts.slice(-2).join('.');
              document.cookie = `googtrans=/hi/${targetLang}; path=/; domain=${parentDomain}; max-age=31536000;`;
            }
          }
        }
      } catch (e) {
        console.debug('Language translation cookie note:', e);
      }

      // 3. Trigger Google Translate combobox element with retry polling
      if (!triggerGoogleTranslateCombo(targetLang)) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (triggerGoogleTranslateCombo(targetLang) || attempts >= 25) {
            clearInterval(interval);
          }
        }, 120);
      }
    },
    [setLanguage, triggerGoogleTranslateCombo]
  );

  // Font resize accessibility
  const adjustFontSize = useCallback((delta: number) => {
    setFontSizeLevel((prev) => {
      const next = Math.max(85, Math.min(125, prev + delta));
      if (typeof document !== 'undefined') {
        document.documentElement.style.fontSize = `${next}%`;
      }
      return next;
    });
  }, []);

  const resetFontSize = useCallback(() => {
    setFontSizeLevel(100);
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize = '100%';
    }
  }, []);

  // Filter languages
  const filteredLanguages = ALL_LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.region && l.region.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentLangObj = ALL_LANGUAGES.find((l) => l.code === selectedLang) || ALL_LANGUAGES[0];

  return (
    <div
      id="top-language-translation-bar"
      className="bg-linear-to-r from-[#5B0606] via-[#7B0B0B] to-[#5B0606] text-white border-b border-amber-500/30 text-xs py-1 px-3 sm:px-6 relative z-50 shadow-xs select-none"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left Side: National & Regional Identity & Govt Registration */}
        <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
          <span className="inline-flex items-center gap-1 font-extrabold text-amber-200 tracking-wide">
            <span className="text-sm">🇮🇳</span>
            <span className="hidden sm:inline">भारत सरकार नीति आयोग पंजीकृत •</span>
            <span>Reg: UP/2018/0207700</span>
          </span>

          <span className="hidden md:inline-flex items-center gap-1 bg-amber-400/20 text-amber-200 text-[10px] px-2 py-0.5 rounded-full border border-amber-400/30 font-semibold">
            <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
            <span>12A पंजीकृत एवं नीति आयोग मान्यता प्राप्त</span>
          </span>
        </div>

        {/* Right Side: Translation Bar & Accessibility Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 ml-auto">
          {/* Phone Link */}
          <a
            href={`tel:${FOUNDATION_INFO.phone}`}
            className="hidden xl:flex items-center gap-1 text-[10px] text-amber-100 hover:text-white bg-black/20 px-2 py-0.5 rounded border border-amber-500/20"
            title="हेल्पलाइन / संपर्क"
          >
            <Phone className="w-2.5 h-2.5 text-amber-300" />
            <span>{FOUNDATION_INFO.phone}</span>
          </a>

          {/* Admin Portal Button */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="hidden sm:flex items-center gap-1 text-[10px] bg-red-950/80 hover:bg-red-900 text-amber-200 hover:text-white px-2 py-0.5 rounded border border-amber-500/40 transition-colors cursor-pointer font-bold"
              title="सुपर एडमिन एवं एडमिन पोर्टल लॉगिन"
            >
              <Lock className="w-2.5 h-2.5" />
              <span>एडमिन</span>
            </button>
          )}

          {/* Quick Language Pills (Desktop & Tablet) */}
          <div className="hidden lg:flex items-center gap-1 bg-black/30 p-0.5 rounded-lg border border-amber-500/30">
            <button
              onClick={() => handleSelectLanguage('hi')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedLang === 'hi'
                  ? 'bg-amber-400 text-red-950 shadow-xs scale-105'
                  : 'text-amber-100 hover:bg-white/10 hover:text-white'
              }`}
              title="हिन्दी (Hindi)"
            >
              <span>🇮🇳</span>
              <span>हिन्दी</span>
            </button>

            <button
              onClick={() => handleSelectLanguage('en')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedLang === 'en'
                  ? 'bg-amber-400 text-red-950 shadow-xs scale-105'
                  : 'text-amber-100 hover:bg-white/10 hover:text-white'
              }`}
              title="English"
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>

            <button
              onClick={() => handleSelectLanguage('bho')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedLang === 'bho'
                  ? 'bg-amber-400 text-red-950 shadow-xs scale-105'
                  : 'text-amber-100 hover:bg-white/10 hover:text-white'
              }`}
              title="भोजपुरी (Bhojpuri)"
            >
              <span>🌾</span>
              <span>भोजपुरी</span>
            </button>

            <button
              onClick={() => handleSelectLanguage('sa')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedLang === 'sa'
                  ? 'bg-amber-400 text-red-950 shadow-xs scale-105'
                  : 'text-amber-100 hover:bg-white/10 hover:text-white'
              }`}
              title="संस्कृतम् (Sanskrit)"
            >
              <span>🕉️</span>
              <span>संस्कृतम्</span>
            </button>

            <button
              onClick={() => handleSelectLanguage('bn')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                selectedLang === 'bn'
                  ? 'bg-amber-400 text-red-950 shadow-xs scale-105'
                  : 'text-amber-100 hover:bg-white/10 hover:text-white'
              }`}
              title="বাংলা (Bengali)"
            >
              <span>🌸</span>
              <span>বাংলা</span>
            </button>
          </div>

          {/* Main Language Translation Dropdown Selector */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-amber-900/90 hover:bg-amber-800 text-amber-100 hover:text-white px-2.5 py-1 rounded-lg border border-amber-400/40 text-[11px] font-extrabold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              title="अपनी भाषा चुनें / Translate Website"
              aria-expanded={isDropdownOpen}
              id="btn-open-language-translator"
            >
              <Globe className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline text-amber-300 font-semibold">भाषा / Lang:</span>
              <span className="flex items-center gap-1">
                <span>{currentLangObj.flag}</span>
                <span className="font-bold">{currentLangObj.nativeName}</span>
              </span>
              <ChevronDown className={`w-3 h-3 text-amber-300 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Language Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-white text-gray-900 rounded-xl shadow-2xl border border-amber-300 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header */}
                <div className="bg-linear-to-r from-[#8B0000] to-[#5B0606] text-white px-3.5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Languages className="w-4 h-4 text-amber-300" />
                    <div>
                      <h4 className="font-black text-xs text-amber-200">भाषा चुनें / Choose Language</h4>
                      <p className="text-[10px] text-amber-100/80">लाइव अनुवाद (Live Instant Translation)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDropdownOpen(false)}
                    className="p-1 text-amber-200 hover:text-white rounded-lg hover:bg-white/10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="p-2 border-b border-gray-100 bg-amber-50/50">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="भाषा खोजें / Search language..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-amber-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500 font-medium"
                    />
                  </div>
                </div>

                {/* Languages List */}
                <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 scrollbar-thin">
                  {filteredLanguages.length > 0 ? (
                    filteredLanguages.map((lang) => {
                      const isSelected = selectedLang === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => handleSelectLanguage(lang.code)}
                          className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-amber-100 text-[#8B0000] font-black'
                              : 'hover:bg-amber-50 text-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base leading-none">{lang.flag}</span>
                            <div>
                              <div className="font-bold text-gray-900 flex items-center gap-1.5">
                                <span>{lang.nativeName}</span>
                                <span className="text-[10px] text-gray-500 font-normal">({lang.name})</span>
                              </div>
                              {lang.region && (
                                <p className="text-[10px] text-amber-800/80 font-medium">{lang.region}</p>
                              )}
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-xs text-gray-500">
                      कोई भाषा नहीं मिली / No language found
                    </div>
                  )}
                </div>

                {/* Footer with Reset */}
                <div className="p-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-[10px]">
                  <button
                    onClick={() => handleSelectLanguage('hi')}
                    className="text-[#8B0000] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>मूल हिन्दी में बदलें (Reset to Hindi)</span>
                  </button>
                  <span className="text-gray-400">Google Translate संचालित</span>
                </div>
              </div>
            )}
          </div>

          {/* Text Size Accessibility Controls */}
          <div className="hidden sm:flex items-center gap-0.5 bg-black/30 p-0.5 rounded-lg border border-amber-500/30 text-[10px] font-bold text-amber-200">
            <button
              onClick={() => adjustFontSize(-5)}
              className="px-1.5 py-0.5 hover:bg-white/10 rounded cursor-pointer transition-colors"
              title="फॉन्ट छोटा करें (Decrease Font Size)"
            >
              A-
            </button>
            <button
              onClick={resetFontSize}
              className="px-1.5 py-0.5 hover:bg-white/10 rounded cursor-pointer transition-colors text-white"
              title="सामान्य फॉन्ट (Normal Font Size)"
            >
              A
            </button>
            <button
              onClick={() => adjustFontSize(5)}
              className="px-1.5 py-0.5 hover:bg-white/10 rounded cursor-pointer transition-colors"
              title="फॉन्ट बड़ा करें (Increase Font Size)"
            >
              A+
            </button>
          </div>

          {/* Hidden Google Translate Target Container (Shielded with suppressHydrationWarning) */}
          <div
            id="google_translate_element"
            style={{
              position: 'absolute',
              left: '-9999px',
              top: '-9999px',
              width: '1px',
              height: '1px',
              opacity: 0,
              pointerEvents: 'none',
              overflow: 'hidden'
            }}
            suppressHydrationWarning
          />
        </div>
      </div>

      {/* Floating Language Confirmation Toast */}
      {langToast && (
        <div className="fixed top-12 right-4 z-50 animate-bounce bg-emerald-700 text-white text-xs font-black px-4 py-2 rounded-xl shadow-2xl border-2 border-emerald-300 flex items-center gap-2">
          <span>{langToast}</span>
        </div>
      )}
    </div>
  );
};

export default TopLanguageBar;
