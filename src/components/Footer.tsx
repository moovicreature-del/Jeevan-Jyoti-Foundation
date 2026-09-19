import React from 'react';
import { FOUNDATION_INFO } from '../data/foundationData';
import { Phone, Mail, MapPin, ShieldCheck, Facebook, Instagram, Twitter, Youtube, MessageCircle, ExternalLink, Lock, Smartphone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useHomeContent } from '../context/HomeContentContext';
import { BrandLogo } from './common/BrandLogo';
import { NewsletterSignup } from './NewsletterSignup';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { t, isHindi } = useLanguage();
  const { content } = useHomeContent();

  const socialLinks = [
    {
      name: 'Facebook',
      handle: '@JeevanJyotiGhazipur',
      url: 'https://facebook.com',
      icon: Facebook,
      color: 'hover:bg-[#1877F2] hover:border-[#1877F2] text-[#1877F2] hover:text-white',
      bgHover: 'bg-[#1877F2]/10 border-[#1877F2]/40'
    },
    {
      name: 'Instagram',
      handle: '@jeevanjyotifoundation',
      url: FOUNDATION_INFO.instagramUrl || 'https://instagram.com/jeevanjyotifoundation',
      icon: Instagram,
      color: 'hover:bg-gradient-to-r hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:border-transparent text-[#E1306C] hover:text-white',
      bgHover: 'bg-[#E1306C]/10 border-[#E1306C]/40'
    },
    {
      name: 'Twitter / X',
      handle: '@SHAILESH1666',
      url: FOUNDATION_INFO.xUrl || 'https://x.com/SHAILESH1666',
      icon: Twitter,
      color: 'hover:bg-black hover:border-slate-600 text-sky-400 hover:text-white',
      bgHover: 'bg-sky-400/10 border-sky-400/40'
    },
    {
      name: 'YouTube',
      handle: 'Jeevan Jyoti Foundation',
      url: 'https://youtube.com',
      icon: Youtube,
      color: 'hover:bg-[#FF0000] hover:border-[#FF0000] text-[#FF0000] hover:text-white',
      bgHover: 'bg-[#FF0000]/10 border-[#FF0000]/40'
    },
    {
      name: 'WhatsApp',
      handle: '+91-8052361666',
      url: 'https://api.whatsapp.com/send?phone=918052361666&text=Namaste%20Jeevan%20Jyoti%20Foundation',
      icon: MessageCircle,
      color: 'hover:bg-[#25D366] hover:border-[#25D366] text-[#25D366] hover:text-white',
      bgHover: 'bg-[#25D366]/10 border-[#25D366]/40'
    }
  ];

  return (
    <footer id="about" className="bg-[#1A1A1A] text-gray-300 pt-16 pb-8 border-t-4 border-[#8B0000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          
          {/* Col 1: About Foundation */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogo size={42} className="shrink-0 drop-shadow-xs" id="footer-brand-logo" />
              <div>
                <h4 className="font-black text-white text-base font-['Cinzel'] leading-tight">
                  JEEVAN JYOTI FOUNDATION
                </h4>
                <p className="text-xs text-[#FFD700] font-bold">
                  Village Miranpur, Ghazipur, Uttar Pradesh, India - 233303 (DIGIPIN 2J6T226CL2)
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {content.aboutText || t('footer.about_desc',
                'गाजीपुर, उत्तर प्रदेश में सामाजिक कल्याण, बाल शिक्षा, निःशुल्क स्वास्थ्य शिविर एवं अन्नपूर्णा भोजन सेवा हेतु पूर्णतः समर्पित गैर-लाभकारी संगठन।',
                'A dedicated non-profit organization serving Ghazipur, UP through free child education, healthcare camps, food distribution, and women empowerment.'
              )}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-400 text-[10px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Govt. Registered & NITI Aayog Certified NGO</span>
            </div>
          </div>

          {/* Col 2: Legal & Tax Compliances */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-amber-400 border-b border-gray-800 pb-2">
              {t('footer.compliances', 'वैधानिक पंजीकरण (Govt. Registrations)', 'Govt. Registrations & Legal')}
            </h4>
            <ul className="text-xs space-y-2 font-mono">
              <li><span className="text-gray-400">Reg. No:</span> <strong className="text-white">{FOUNDATION_INFO.regNo}</strong></li>
              <li><span className="text-gray-400">NITI Aayog:</span> <strong className="text-white">{FOUNDATION_INFO.nitiAayogUid}</strong></li>
              <li><span className="text-gray-400">PAN:</span> <strong className="text-white">{FOUNDATION_INFO.pan}</strong></li>
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-amber-400 border-b border-gray-800 pb-2">
              {t('footer.quick_links', 'महत्वपूर्ण लिंक (Quick Links)', 'Quick Links')}
            </h4>
            <ul className="text-xs space-y-2 text-gray-300 font-semibold">
              <li><a href="#pillars" className="hover:text-amber-400 transition-colors">{isHindi ? 'शिक्षा एवं स्वास्थ्य सेवा' : 'Education & Healthcare'}</a></li>
              <li><a href="#volunteers" className="hover:text-amber-400 transition-colors">{isHindi ? 'स्वयंसेवक प्रमाण पत्र पोर्टल' : 'Volunteer Portal & Certificates'}</a></li>
              <li><a href="#verification" className="hover:text-amber-400 transition-colors">{isHindi ? 'ऑनलाइन सर्टिफिकेट सत्यापन' : 'Online Verification Portal'}</a></li>
              <li><a href="#stories" className="hover:text-amber-400 transition-colors">{isHindi ? 'वार्षिक प्रगति गाथाएं' : 'Annual Progress Stories'}</a></li>
              <li>
                <button
                  onClick={() => {
                    sessionStorage.removeItem('jjf_pwa_banner_dismissed');
                    window.location.reload();
                  }}
                  className="hover:text-amber-300 text-yellow-400 font-bold transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isHindi ? 'ऐप इंस्टॉल करें (Install App / PWA)' : 'Install Web App (PWA)'}</span>
                </button>
              </li>
              {onOpenAdmin && (
                <li>
                  <button
                    onClick={onOpenAdmin}
                    className="hover:text-amber-300 text-amber-400/90 font-bold transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>{isHindi ? 'एडमिन व सुपर एडमिन पोर्टल' : 'Admin & Super Admin Portal'}</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-amber-400 border-b border-gray-800 pb-2">
              {t('footer.contact', 'संपर्क एवं मुख्य कार्यालय (Head Office)', 'Contact & Head Office')}
            </h4>
            <div className="text-xs space-y-2.5 text-gray-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="leading-relaxed block">
                    {isHindi
                      ? (FOUNDATION_INFO.fullAddressHindi || `${FOUNDATION_INFO.address}`)
                      : (FOUNDATION_INFO.fullAddressEnglish || `${FOUNDATION_INFO.address}`)}
                  </span>
                  <a
                    href="https://maps.app.goo.gl/72kFrETKbmiKA3gv7"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:underline pt-0.5"
                  >
                    <span>📍 Google Maps पर देखें</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`tel:${FOUNDATION_INFO.phone}`} className="hover:text-amber-400 transition-colors font-mono">{FOUNDATION_INFO.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href={`mailto:${FOUNDATION_INFO.email}`} className="hover:text-amber-400 transition-colors">{FOUNDATION_INFO.email}</a>
              </div>
              <div className="pt-2 text-[11px] text-amber-400 font-bold">
                {t('footer.manager', 'प्रबंधक / सचिव', 'Manager / Secretary')}: {FOUNDATION_INFO.presidentName}
              </div>
            </div>
          </div>

        </div>

        {/* Newsletter Signup Section (Monthly NGO Impact Updates) */}
        <div className="pt-10 pb-2">
          <NewsletterSignup variant="footer" />
        </div>

        {/* Social Media Integration Bar */}
        <div className="py-8 border-b border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="text-sm sm:text-base font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <span>{isHindi ? 'सोशल मीडिया पर जुड़ें व फॉलो करें' : 'Follow & Connect on Social Media'}</span>
              <span className="text-xs text-amber-400 font-normal">({FOUNDATION_INFO.nameEnglish})</span>
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              {isHindi
                ? 'फाउंडेशन के सेवा कार्य, स्वास्थ्य शिविर व बाल शिक्षा अभियानों के नियमित अपडेट्स पाएं।'
                : 'Get regular updates on our social drives, health camps, and child education programs.'}
            </p>
          </div>

          <div className="flex items-center flex-wrap justify-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Jeevan Jyoti Foundation on ${social.name}`}
                  className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all duration-200 cursor-pointer ${social.bgHover} ${social.color}`}
                >
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-bold">{social.name}</span>
                  <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <div>
            {content.footerText || `© ${new Date().getFullYear()} ${FOUNDATION_INFO.nameEnglish} (ग़ाज़ीपुर). ${t('footer.rights', 'सर्वाधिकार सुरक्षित।', 'All rights reserved.')}`}
          </div>
          <div className="flex items-center gap-1 text-gray-400 font-bold">
            <span>{isHindi ? 'सेवा • शिक्षा • स्वास्थ्य' : 'Sewa • Education • Healthcare'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
