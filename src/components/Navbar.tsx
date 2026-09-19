import React, { useState } from 'react';
import { Heart, Award, ShieldCheck, Menu, X, Phone, Globe, QrCode, Lock, Smartphone, Download, HardDrive, Users, UserPlus, ChevronDown } from 'lucide-react';
import { FOUNDATION_INFO } from '../data/foundationData';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogo } from './common/BrandLogo';
import { TopLanguageBar } from './TopLanguageBar';

interface Props {
  onOpenDonate: () => void;
  onOpenReport: () => void;
  onOpenAdmin?: () => void;
  onOpenGoogleDrive?: () => void;
  onOpenStaff?: (tab?: 'options' | 'registration' | 'download') => void;
}

export const Navbar: React.FC<Props> = ({ onOpenDonate, onOpenReport, onOpenAdmin, onOpenGoogleDrive, onOpenStaff }) => {
  const { language, setLanguage, isHindi, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200 shadow-xs">
      {/* Top Comprehensive Translation & Multi-Language Bar */}
      <TopLanguageBar onOpenAdmin={onOpenAdmin} onOpenStaff={onOpenStaff} />

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand: Organization Logo & Typography */}
        <a
          href="#"
          id="nav-brand-logo-link"
          className="flex items-center gap-3 group shrink-0 transition-transform duration-200 hover:scale-[1.01]"
        >
          <div
            id="nav-logo-animated-wrapper"
            className="relative shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:rotate-1"
          >
            <BrandLogo size={46} className="drop-shadow-xs" />
          </div>

          <div className="flex flex-col justify-center">
            <div className="font-black text-lg sm:text-xl text-[#3F2B96] tracking-tight leading-none font-['Cinzel',serif] group-hover:text-[#8B0000] transition-colors">
              JEEVAN JYOTI FOUNDATION
            </div>
            <div className="text-[11px] font-extrabold text-amber-700 leading-tight mt-0.5 tracking-wide">
              {isHindi
                ? 'जीवन ज्योति फाउंडेशन • ग़ाज़ीपुर, उत्तर प्रदेश, भारत'
                : 'Jeevan Jyoti Foundation • Ghazipur, UP, India'}
            </div>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-4 text-sm font-bold text-gray-800">
          <a href="#about" className="hover:text-[#8B0000] transition-colors">
            {t('nav.about', 'परिचय', 'About')}
          </a>
          <a href="#pillars" className="hover:text-[#8B0000] transition-colors">
            {t('nav.pillars', 'सेवा क्षेत्र', 'Pillars')}
          </a>
          <a href="#official-forms" className="hover:text-[#8B0000] transition-colors flex items-center gap-1 text-green-900 bg-green-100/90 px-2.5 py-1 rounded-xl border border-green-300">
            <span>📝</span>
            <span>{isHindi ? '5 फॉर्म' : '5 Forms'}</span>
          </a>

          <a href="#festivals" className="hover:text-[#8B0000] transition-colors flex items-center gap-1 text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-xl border border-amber-300">
            <span>🪔</span>
            <span>{isHindi ? 'त्यौहार' : 'Festivals'}</span>
          </a>
          <a href="#volunteers" className="hover:text-[#8B0000] transition-colors">
            {t('nav.volunteers', 'स्वयंसेवक', 'Volunteers')}
          </a>
          <a href="#verification" className="hover:text-[#8B0000] transition-colors flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{t('nav.verify', 'सत्यापन', 'Verify')}</span>
          </a>
        </nav>

        {/* Action CTA Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-pwa-install-modal'))}
            className="px-3 py-2 bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-[#8B0000] font-black text-xs rounded-xl shadow-xs border border-amber-400 flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105"
            title={isHindi ? "आधिकारिक मोबाइल / डेस्कटॉप ऐप इंस्टॉल करें" : "Install Official App"}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{isHindi ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>
          </button>
          <button
            onClick={onOpenGoogleDrive}
            className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            title={isHindi ? "गूगल ड्राइव दस्तावेज़ केंद्र (Google Drive Document Hub)" : "Google Drive Document Hub"}
          >
            <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isHindi ? 'गूगल ड्राइव' : 'Google Drive'}</span>
          </button>
          <button
            onClick={onOpenReport}
            className="px-3 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            {t('nav.report', 'वार्षिक रिपोर्ट', 'Annual Report')}
          </button>
          <button
            onClick={onOpenDonate}
            className="px-4 py-2 bg-gradient-to-r from-[#8B0000] to-red-700 hover:from-red-800 hover:to-red-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:shadow-lg"
          >
            <Heart className="w-4 h-4 fill-white animate-pulse" />
            <span>{t('nav.donate', 'दान करें', 'Donate')}</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-1.5">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-pwa-install-modal'))}
            className="p-2 bg-amber-400 text-[#8B0000] rounded-lg text-xs font-black flex items-center gap-1"
            title="ऐप इंस्टॉल करें"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenDonate}
            className="p-2 bg-[#8B0000] text-white rounded-lg text-xs font-bold"
          >
            <Heart className="w-4 h-4 fill-white" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-200 bg-white px-4 py-4 space-y-3 font-bold text-sm text-gray-800">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              window.dispatchEvent(new CustomEvent('open-pwa-install-modal'));
            }}
            className="w-full text-left py-2.5 px-3 bg-gradient-to-r from-amber-400 to-yellow-300 text-[#8B0000] rounded-xl font-black flex items-center justify-between border border-amber-400 shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span>फाउंडेशन ऐप इंस्टॉल करें (Install App)</span>
            </div>
            <Download className="w-4 h-4" />
          </button>

          {/* Prominent Mobile Staff Section (Top Priority) */}
          <div className="p-3 bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 rounded-2xl border-2 border-amber-400 space-y-2 shadow-sm">
            <div className="text-xs font-black text-[#8B0000] uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#8B0000]" />
                <span>स्टाफ पोर्टल (Staff Portal - 2 विकल्प)</span>
              </span>
              <span className="text-[10px] bg-red-800 text-white px-2 py-0.5 rounded-full font-mono">नया</span>
            </div>
            <div className="grid grid-cols-1 gap-2 pt-0.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenStaff?.('registration');
                }}
                className="w-full text-left p-2.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-50 flex items-center gap-3 text-xs font-bold text-gray-900 cursor-pointer shadow-xs transition-transform active:scale-98"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-gray-900">1. स्टाफ रजिस्ट्रेशन</div>
                  <div className="text-[11px] text-gray-500 font-medium">नया ऑनबोर्डिंग फॉर्म भरें व आईडी पाएं</div>
                </div>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenStaff?.('download');
                }}
                className="w-full text-left p-2.5 rounded-xl bg-white border border-indigo-300 hover:bg-indigo-50 flex items-center gap-3 text-xs font-bold text-gray-900 cursor-pointer shadow-xs transition-transform active:scale-98"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-gray-900">2. स्टाफ आई-कार्ड डाउनलोड</div>
                  <div className="text-[11px] text-gray-500 font-medium">स्टाइलिश कार्ड खोजें व डाउनलोड करें (हिन्दी/Eng)</div>
                </div>
              </button>
            </div>
          </div>

          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 hover:text-[#8B0000]"
          >
            {t('nav.about', 'परिचय (About)', 'About')}
          </a>
          <a
            href="#pillars"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 hover:text-[#8B0000]"
          >
            {t('nav.pillars', 'सेवा क्षेत्र (Pillars)', 'Four Pillars')}
          </a>
          <a
            href="#official-forms"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-green-900 font-black hover:text-green-950 flex items-center gap-1.5"
          >
            <span>📝</span>
            <span>5 ऑनलाइन फॉर्म (5 Professional Forms)</span>
          </a>
          <a
            href="#festivals"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-amber-900 font-black hover:text-[#8B0000] flex items-center gap-1.5"
          >
            <span>🪔</span>
            <span>त्यौहार शुभकामना व प्रमाण पत्र (Festival Wishes)</span>
          </a>
          <a
            href="#volunteers"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 hover:text-[#8B0000]"
          >
            {t('nav.volunteers', 'स्वयंसेवक एवं कार्य (Volunteers)', 'Volunteers')}
          </a>
          <a
            href="#verification"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-1 text-emerald-800 hover:text-emerald-900"
          >
            सर्टिफिकेट सत्यापन (Verify Certificate)
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenReport();
            }}
            className="w-full text-left py-1 text-amber-900"
          >
            वार्षिक प्रगति रिपोर्ट (Annual Report)
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              if (onOpenGoogleDrive) onOpenGoogleDrive();
            }}
            className="w-full text-left py-1.5 px-2 bg-indigo-50 text-indigo-900 rounded-lg font-bold flex items-center gap-2 border border-indigo-200"
          >
            <HardDrive className="w-4 h-4 text-indigo-600" />
            <span>गूगल ड्राइव दस्तावेज़ (Google Drive Hub)</span>
          </button>

          {/* Mobile Language Switcher Row */}
          <div className="pt-2 border-t border-amber-200 mt-2">
            <div className="text-[11px] font-bold text-gray-500 mb-1.5 flex items-center gap-1">
              <Globe className="w-3 h-3 text-[#8B0000]" />
              <span>भाषा अनुवाद (Select Language):</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => {
                  setLanguage('hi');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold border text-center ${
                  language === 'hi'
                    ? 'bg-[#8B0000] text-white border-[#8B0000]'
                    : 'bg-amber-50 text-gray-800 border-amber-200'
                }`}
              >
                🇮🇳 हिन्दी
              </button>
              <button
                onClick={() => {
                  setLanguage('en');
                  setMobileMenuOpen(false);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold border text-center ${
                  language === 'en'
                    ? 'bg-[#8B0000] text-white border-[#8B0000]'
                    : 'bg-amber-50 text-gray-800 border-amber-200'
                }`}
              >
                🇬🇧 English
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  const btn = document.getElementById('btn-open-language-translator');
                  if (btn) btn.click();
                }}
                className="py-1.5 px-2 rounded-lg text-xs font-bold border bg-yellow-100 text-yellow-900 border-yellow-300 text-center"
              >
                🌐 अन्य (100+)
              </button>
            </div>
          </div>

          {onOpenAdmin && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full text-left py-2 px-3 bg-red-50 text-[#8B0000] rounded-xl font-bold flex items-center gap-2 border border-red-200 mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isHindi ? 'एडमिन / सुपर एडमिन लॉगिन' : 'Admin / Super Admin Login'}</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
