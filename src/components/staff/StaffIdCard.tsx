// ============================================================================
// JEEVAN JYOTI FOUNDATION - DYNAMIC STYLISH STAFF I-CARD COMPONENT
// जीवन ज्योति फाउंडेशन - डायनामिक व स्टाईलिश आधिकारिक स्टाफ पहचान पत्र
// Supports Hindi, English & Bilingual Modes for Preview & Instant Download
// ============================================================================

import React from 'react';
import { StaffMember, StaffCardTheme, StaffCardLanguage, formatRelationLabel } from '../../types/staff';
import { FOUNDATION_INFO } from '../../data/foundationData';
import { CertificateVerificationQR } from '../CertificateVerificationQR';
import { ShaileshPradhanSignature, NgoRoundSeal } from '../DigitalSignature';
import { BrandLogo } from '../common/BrandLogo';
import { Droplet, Phone, Calendar, MapPin, ShieldCheck, Award, CheckCircle2 } from 'lucide-react';

interface StaffIdCardProps {
  staff: StaffMember;
  theme?: StaffCardTheme;
  side?: 'front' | 'back';
  language?: StaffCardLanguage;
  className?: string;
  id?: string;
}

// Helpers to cleanly extract and format designations for Hindi / English
export function getLocalizedDesignation(designation: string, lang: StaffCardLanguage): { primary: string; sub?: string } {
  const lower = designation.toLowerCase();

  if (lower.includes('president') && !lower.includes('vice')) {
    if (lang === 'hi') return { primary: 'अध्यक्ष', sub: 'President' };
    if (lang === 'en') return { primary: 'President', sub: 'अध्यक्ष' };
    return { primary: 'President / अध्यक्ष' };
  }
  if (lower.includes('vice president') || lower.includes('उपाध्यक्ष')) {
    if (lang === 'hi') return { primary: 'उपाध्यक्ष', sub: 'Vice President' };
    if (lang === 'en') return { primary: 'Vice President', sub: 'उपाध्यक्ष' };
    return { primary: 'Vice President / उपाध्यक्ष' };
  }
  if (lower.includes('secretary') || lower.includes('सचिव')) {
    if (lang === 'hi') return { primary: 'सचिव', sub: 'Secretary' };
    if (lang === 'en') return { primary: 'Secretary', sub: 'सचिव' };
    return { primary: 'Secretary / सचिव' };
  }
  if (lower.includes('manager') || lower.includes('प्रबंधक')) {
    if (lang === 'hi') return { primary: 'प्रबंधक', sub: 'Manager' };
    if (lang === 'en') return { primary: 'Manager', sub: 'प्रबंधक' };
    return { primary: 'Manager / प्रबंधक' };
  }
  if (lower.includes('treasurer') || lower.includes('लेखाकार') || lower.includes('कोषाध्यक्ष')) {
    if (lang === 'hi') return { primary: 'लेखाकार (कोषाध्यक्ष)', sub: 'Treasurer' };
    if (lang === 'en') return { primary: 'Treasurer', sub: 'लेखाकार' };
    return { primary: 'Treasurer / लेखाकार' };
  }
  if (lower.includes('member') || lower.includes('सदस्य')) {
    if (lang === 'hi') return { primary: 'सदस्य', sub: 'Member' };
    if (lang === 'en') return { primary: 'Member', sub: 'सदस्य' };
    return { primary: 'Member / सदस्य' };
  }

  // Fallback for custom designations
  if (lang === 'hi') {
    return { primary: designation.replace(/\([^)]*\)/g, '').trim() };
  }
  return { primary: designation };
}

// Helper to format Department based on language
export function getLocalizedDepartment(department: string, lang: StaffCardLanguage): string {
  if (lang === 'en') {
    if (department.includes('Education') || department.includes('शिक्षा')) return 'Education & Child Welfare Wing';
    if (department.includes('Health') || department.includes('स्वास्थ्य')) return 'Healthcare & Nutrition Cell';
    if (department.includes('Women') || department.includes('महिला')) return 'Women Empowerment & Skill Center';
    if (department.includes('Administration') || department.includes('प्रशासनिक')) return 'Administration & Accounts Wing';
    if (department.includes('Disaster') || department.includes('आपदा')) return 'Disaster Relief & Social Work';
    if (department.includes('IT') || department.includes('आईटी')) return 'IT & Digital Communications';
    if (department.includes('Environment') || department.includes('पर्यावरण')) return 'Green Mission & Environment';
    if (department.includes('Executive') || department.includes('कार्यकारी')) return 'Central Executive Council';
    return department;
  }
  if (lang === 'hi') {
    if (department.includes('शिक्षा')) return 'शिक्षा व बाल संस्कार विभाग';
    if (department.includes('स्वास्थ्य')) return 'स्वास्थ्य, पोषण व चिकित्सा सेवा';
    if (department.includes('महिला')) return 'महिला सशक्तीकरण व कौशल विकास';
    if (department.includes('प्रशासनिक')) return 'प्रशासनिक व लेखा अनुभाग';
    if (department.includes('आपदा')) return 'आपदा राहत व सामाजिक सेवा';
    if (department.includes('आईटी')) return 'आईटी व डिजिटल मीडिया';
    if (department.includes('पर्यावरण')) return 'पर्यावरण व हरित मिशन प्रकोष्ठ';
    if (department.includes('कार्यकारी')) return 'केंद्रीय कार्यकारी परिषद';
    return department;
  }
  return department;
}

export const StaffIdCard: React.FC<StaffIdCardProps> = ({
  staff,
  theme = 'maroon_gold',
  side = 'front',
  language = 'hi',
  className = '',
  id = 'staff-id-card-element'
}) => {
  // Theme color styles
  const themeStyles = {
    maroon_gold: {
      headerBg: 'from-[#8B0000] via-[#700000] to-[#4A0000]',
      primaryColor: '#8B0000',
      accentColor: '#D4AF37', // Gold
      badgeBg: 'bg-amber-500',
      pillBg: 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white',
      borderRing: 'border-amber-400',
      subtleBg: 'bg-amber-50/70',
      tagText: 'text-amber-900',
      highlightBorder: 'border-amber-300'
    },
    navy_gold: {
      headerBg: 'from-[#0B1E48] via-[#102A6B] to-[#0A1633]',
      primaryColor: '#0B1E48',
      accentColor: '#E6B800',
      badgeBg: 'bg-blue-600',
      pillBg: 'bg-gradient-to-r from-blue-700 to-indigo-800 text-white',
      borderRing: 'border-yellow-400',
      subtleBg: 'bg-blue-50/70',
      tagText: 'text-blue-950',
      highlightBorder: 'border-blue-200'
    },
    emerald_gold: {
      headerBg: 'from-[#084228] via-[#0D5936] to-[#06331E]',
      primaryColor: '#084228',
      accentColor: '#D4AF37',
      badgeBg: 'bg-emerald-600',
      pillBg: 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white',
      borderRing: 'border-amber-400',
      subtleBg: 'bg-emerald-50/70',
      tagText: 'text-emerald-950',
      highlightBorder: 'border-emerald-200'
    },
    royal_purple: {
      headerBg: 'from-[#3B1566] via-[#4D1C85] to-[#2B0C4D]',
      primaryColor: '#3B1566',
      accentColor: '#F59E0B',
      badgeBg: 'bg-purple-600',
      pillBg: 'bg-gradient-to-r from-purple-700 to-violet-800 text-white',
      borderRing: 'border-amber-400',
      subtleBg: 'bg-purple-50/70',
      tagText: 'text-purple-950',
      highlightBorder: 'border-purple-200'
    }
  }[theme];

  const locDesignation = getLocalizedDesignation(staff.designation, language);
  const locDepartment = getLocalizedDepartment(staff.department, language);

  // If viewing the Back side of the Staff I-Card
  if (side === 'back') {
    return (
      <div
        id={id}
        className={`w-[360px] h-[570px] bg-white rounded-2xl shadow-2xl relative overflow-hidden border-2 border-amber-400 flex flex-col justify-between select-none ${className}`}
        style={{
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3)',
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* Background Subtle Watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 opacity-10">
          <BrandLogo size={200} />
        </div>

        {/* Top Header Graphic with NGO Details */}
        <div className="relative z-10">
          {/* Security Encoded Stripe */}
          <div className="h-8 bg-gradient-to-r from-gray-950 via-gray-900 to-black w-full flex items-center px-3 justify-between border-b border-amber-400">
            <span className="text-[9px] tracking-widest text-amber-300 font-mono font-bold">
              JJF • SECURE VERIFIED RFID ENCODED ID
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[8px] text-gray-300 font-mono">ISO 9001:2015</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            </div>
          </div>

          {/* Mini Header: NGO Identity on Back Side */}
          <div className={`bg-gradient-to-r ${themeStyles.headerBg} text-white px-3 py-1.5 flex items-center justify-between border-b border-amber-400/80`}>
            <div className="flex items-center gap-2">
              <div className="p-0.5 bg-white rounded-full shadow-xs shrink-0">
                <BrandLogo size={24} />
              </div>
              <div>
                <h3 className="text-[11.5px] font-black leading-tight text-white font-['Cinzel',serif]">
                  {language === 'en' ? 'JEEVAN JYOTI FOUNDATION' : 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुर'}
                </h3>
                <div className="text-[8.5px] text-amber-300 font-bold leading-none">
                  {language === 'en' ? 'Sewa • Shiksha • Swasthya' : 'सेवा • शिक्षा • स्वास्थ्य'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-1.5 py-0.5 rounded bg-amber-400 text-[#8B0000] text-[8px] font-black uppercase">
                {language === 'en' ? 'Card Back' : 'बैक साइड'}
              </span>
            </div>
          </div>
        </div>

        {/* Back Content - Complete NGO Details */}
        <div className="p-3 flex-1 flex flex-col justify-between text-gray-800 relative z-10 space-y-1.5">
          {/* Statutory & Legal Registration Info */}
          <div className="bg-amber-50/90 rounded-xl p-2 border border-amber-300/80 shadow-2xs">
            <div className="text-[9.5px] font-black text-[#8B0000] uppercase tracking-wider mb-1 flex items-center justify-between border-b border-amber-200 pb-0.5">
              <span>🏛️ {language === 'en' ? 'NGO Statutory Registrations' : 'संस्था के वैधानिक पंजीकरण विवरण'}</span>
              <span className="text-[8px] text-gray-500 font-mono">12A Registered NGO</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px]">
              <div>
                <span className="text-gray-500 block text-[7.5px] font-bold uppercase">Society Reg. No:</span>
                <span className="font-extrabold text-gray-900 font-mono">UP/2018/0207700</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[7.5px] font-bold uppercase">NITI Aayog UID:</span>
                <span className="font-extrabold text-gray-900 font-mono">UP/2021/0285918</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[7.5px] font-bold uppercase">Income Tax 12A URN:</span>
                <span className="font-extrabold text-gray-900 font-mono">AAEAJ3141QE20231</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[7.5px] font-bold uppercase">PAN / PAN No:</span>
                <span className="font-extrabold text-gray-900 font-mono">AAEAJ3141Q</span>
              </div>
            </div>
          </div>

          {/* Registered Head Office & Official Contacts */}
          <div className="bg-white rounded-xl p-2 border border-gray-200 shadow-2xs text-[9px] space-y-1.5">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#8B0000] shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-[8px] font-bold text-gray-500 uppercase">
                  {language === 'en' ? 'Registered Head Office Address:' : 'पंजीकृत केंद्रीय कार्यालय का पता:'}
                </div>
                <div className="font-bold text-gray-900 leading-tight text-[9.5px]">
                  {language === 'en'
                    ? 'Vill. Meeranpur Urf Madiyawadih, Post Meeranpur, Block Mohammadabad, Dist. Ghazipur (U.P.) - 233303'
                    : 'ग्राम मीरानपुर उर्फ मदियावडीह, पो. मीरानपुर, ब्लॉक मोहम्मदाबाद, जनपद ग़ाज़ीपुर (उ.प्र.) - 233303'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-gray-100 text-[8.5px]">
              <div className="flex items-center gap-1 text-gray-700">
                <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="font-mono font-bold">+91-8052361666</span>
              </div>
              <div className="flex items-center gap-1 text-gray-700 font-mono font-bold">
                <span>📌 DIGIPIN: 2J6T226CL2</span>
              </div>
              <div className="text-gray-700 truncate" title="jeevanjyotifoundationgzp@gmail.com">
                ✉️ jeevanjyotifoundationgzp@gmail.com
              </div>
              <div className="text-gray-700 font-semibold truncate" title="https://jeevanjyotifoundation.org">
                🌐 www.jeevanjyotifoundation.org
              </div>
            </div>
          </div>

          {/* Rules & Terms */}
          <div className="bg-gray-50/90 rounded-xl p-2 border border-gray-200 text-[8.5px] leading-tight text-gray-700">
            <div className="flex items-center gap-1 mb-1 font-black text-[#8B0000] uppercase text-[9px]">
              <ShieldCheck className="w-3 h-3 text-[#8B0000]" />
              <span>{language === 'en' ? 'Terms & Instructions' : 'नियम व महत्वपूर्ण निर्देश'}</span>
            </div>
            {language === 'en' ? (
              <ul className="space-y-0.5 list-disc list-inside text-gray-600">
                <li>This card is official property of Jeevan Jyoti Foundation Ghazipur.</li>
                <li>Displaying this identity card during NGO field operations is mandatory.</li>
                <li>Upon cessation of service, this card must be surrendered to HQ immediately.</li>
                <li>Misuse or unauthorized duplication of this identity card is strictly prohibited.</li>
              </ul>
            ) : (
              <ul className="space-y-0.5 list-disc list-inside text-gray-600">
                <li>यह पहचान पत्र जीवन ज्योति फाउंडेशन ग़ाज़ीपुर का आधिकारिक स्वामित्व है।</li>
                <li>संस्था के कार्यक्षेत्र व कर्तव्य निर्वहन के समय इसे धारण करना अनिवार्य है।</li>
                <li>संस्था से कार्यमुक्त होने की दशा में इस पहचान पत्र को कार्यालय में जमा करना होगा।</li>
                <li>पहचान पत्र का किसी भी प्रकार का अनधिकृत उपयोग या प्रतिलिपि दण्डनीय है।</li>
              </ul>
            )}
          </div>

          {/* Lost and Found Instructions */}
          <div className="bg-red-50/90 p-1.5 rounded-lg border border-red-200 text-center text-[8.5px]">
            <span className="font-extrabold text-red-900">
              ⚠️ {language === 'en' ? 'If Found Please Return to Head Office or Call Helpline: ' : 'यदि यह कार्ड मिले तो कृपया केंद्रीय कार्यालय लौटाएं या कॉल करें: '}
            </span>
            <span className="font-black text-red-800 font-mono">+91-8052361666</span>
          </div>

          {/* Endorsement & Signatory Block with Manager / Secretary */}
          <div className="pt-1 border-t border-gray-200 flex items-center justify-between px-1">
            {/* Barcode Mock Visual */}
            <div className="text-left">
              <div className="font-mono text-[8px] tracking-wider text-gray-600">
                ID: {staff.id}
              </div>
              <div className="h-6 w-32 bg-gray-900 rounded-xs text-white font-mono text-[7px] tracking-widest flex items-center justify-center">
                ||| ||||| || |||| |||||| ||
              </div>
              <div className="text-[7px] text-gray-500 font-bold mt-0.5">
                Scan QR on Front to Verify
              </div>
            </div>

            {/* Official Seal in Mini */}
            <div className="scale-75 shrink-0">
              <NgoRoundSeal size="sm" />
            </div>

            {/* Authorized Signatory: Manager / Secretary */}
            <div className="text-center shrink-0">
              <div className="h-7 flex items-center justify-center">
                <ShaileshPradhanSignature size="sm" className="max-h-6" />
              </div>
              <div className="border-t border-gray-400 pt-0.5 w-24 text-center">
                <div className="text-[8px] font-black text-gray-900 leading-tight">
                  {language === 'en' ? 'Shailesh Pradhan' : 'शैलेश प्रधान'}
                </div>
                <div className="text-[7px] font-bold text-[#8B0000] leading-tight">
                  {language === 'en' ? 'Manager / Secretary' : 'प्रबंधक / सचिव'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Ribbon */}
        <div className="bg-gray-950 text-white text-center py-1 text-[9px] font-bold tracking-wider relative z-10 border-t border-amber-400 flex items-center justify-around px-2">
          <span>{language === 'en' ? 'SERVICE • EDUCATION • HEALTH' : 'सेवा • शिक्षा • स्वास्थ्य'}</span>
          <span className="font-mono text-amber-400 text-[8px]">JJF-GZP-ID</span>
        </div>
      </div>
    );
  }

  // FRONT SIDE (Main Stylish Staff I-Card)
  return (
    <div
      id={id}
      className={`w-[360px] h-[570px] bg-white rounded-2xl shadow-2xl relative overflow-hidden border-2 border-amber-400 flex flex-col justify-between select-none ${className}`}
      style={{
        boxShadow: '0 20px 45px -12px rgba(0,0,0,0.35)',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Background Watermark Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[radial-gradient(#8B0000_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Top Lanyard Clip Indicator Slot */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-14 h-2 bg-gray-300 rounded-full border border-gray-400 shadow-inner z-20"></div>

      {/* TOP HEADER: Gradient Banner with Organization Title */}
      <div className={`relative bg-gradient-to-b ${themeStyles.headerBg} text-white pt-4 pb-3 px-3 text-center border-b-2 border-amber-400 shadow-md`}>
        {/* Holographic Seal Indicator in Corner */}
        <div className="absolute top-2 right-2.5 flex flex-col items-center">
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-100 to-amber-500 border border-amber-200 flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-3 h-3 text-[#8B0000]" />
          </div>
          <span className="text-[7px] text-amber-200 font-bold tracking-tighter mt-0.5">ORIGINAL</span>
        </div>

        {/* Foundation Emblem & Name */}
        <div className="flex items-center justify-center gap-2.5 mb-1 mt-0.5">
          <div className="p-0.5 bg-white rounded-full shadow-md shrink-0 border border-amber-300">
            <BrandLogo size={34} />
          </div>
          <div className="text-center">
            {language === 'en' ? (
              <>
                <h1 className="font-black text-[14px] leading-tight text-white tracking-tight font-['Cinzel',serif] drop-shadow-xs">
                  JEEVAN JYOTI FOUNDATION
                </h1>
                <div className="text-[9.5px] font-extrabold text-amber-300 leading-none mt-0.5 text-center">
                  Ghazipur, Uttar Pradesh (India)
                </div>
              </>
            ) : language === 'hi' ? (
              <>
                <h1 className="font-black text-[14px] leading-tight text-white tracking-tight drop-shadow-xs">
                  जीवन ज्योति फाउंडेशन
                </h1>
                <div className="text-[10px] font-extrabold text-amber-300 leading-none mt-0.5 text-center">
                  मीरानपुर, मोहम्मदाबाद, गाजीपुर (उ.प्र.)
                </div>
              </>
            ) : (
              <>
                <h1 className="font-black text-[13.5px] leading-tight text-white tracking-tight font-['Cinzel',serif] drop-shadow-xs">
                  JEEVAN JYOTI FOUNDATION
                </h1>
                <div className="text-[10.5px] font-extrabold text-amber-300 leading-none mt-0.5 text-center">
                  जीवन ज्योति फाउंडेशन ग़ाज़ीपुर
                </div>
              </>
            )}

            {/* Official Royal NGO Contact Pill below Name & Address */}
            <div className="mt-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/60 backdrop-blur-xs text-amber-200 shadow-2xs">
              <Phone className="w-2.5 h-2.5 text-amber-300 shrink-0" />
              <span className="text-[9px] font-black font-mono tracking-wider text-amber-100">
                (+91) 8052361666
              </span>
            </div>
          </div>
        </div>

        {/* Registration & Accreditation sub-banner */}
        <div className="text-[8.5px] font-semibold text-amber-100/90 tracking-tight mt-1 flex items-center justify-center gap-1.5 flex-wrap">
          {language === 'en' ? (
            <>
              <span>Reg. No: <strong>UP/2018/0207700</strong></span>
              <span>•</span>
              <span>NITI Aayog: <strong>UP/2021/0285918</strong></span>
            </>
          ) : (
            <>
              <span>पंजीकरण संख्या: <strong>UP/2018/0207700</strong></span>
              <span>•</span>
              <span>नीति आयोग: <strong>UP/2021/0285918</strong></span>
            </>
          )}
        </div>

        {/* Golden Badge Header Strip */}
        <div className="mt-1.5 py-0.5 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400 rounded-full text-[#8B0000] font-black text-[10px] tracking-wider uppercase shadow-xs flex items-center justify-center gap-1.5">
          <Award className="w-3 h-3" />
          <span>
            {language === 'en'
              ? 'OFFICIAL STAFF IDENTITY CARD'
              : language === 'hi'
              ? 'आधिकारिक स्टाफ पहचान पत्र'
              : 'OFFICIAL STAFF IDENTITY CARD • स्टाफ पहचान पत्र'}
          </span>
        </div>
      </div>

      {/* MIDDLE SECTION: Staff Photo, Name, and Information */}
      <div className="px-4 py-2 flex-1 flex flex-col justify-between relative z-10">
        {/* Photo + Identity Badging */}
        <div className="flex items-center gap-3.5 mt-1">
          {/* Staff Photo in Gold Frame */}
          <div className="relative shrink-0">
            <div className="w-22 h-26 rounded-xl p-1 bg-gradient-to-b from-amber-400 via-yellow-200 to-amber-500 shadow-md border border-amber-300">
              <img
                src={staff.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'}
                alt={staff.fullName}
                className="w-full h-full object-cover rounded-lg bg-gray-100"
                crossOrigin="anonymous"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80';
                }}
              />
            </div>
            {/* Active / Verified Badge */}
            <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-600 text-white p-0.5 rounded-full shadow-md border-2 border-white" title="सत्यापित सक्रिय स्टाफ">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          {/* Name & Role Designation */}
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
              <span>
                {language === 'en'
                  ? staff.staffBadgeLevel.includes('Lead') ? 'LEAD OFFICER' : staff.staffBadgeLevel.includes('Core') ? 'CORE TEAM' : 'EXECUTIVE'
                  : staff.staffBadgeLevel}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </div>
            <h2 className="text-[16px] font-black text-gray-900 leading-tight tracking-tight mt-0.5 truncate">
              {staff.fullName}
            </h2>
            <div className="text-[11px] font-medium text-gray-600 truncate mt-0.5">
              {formatRelationLabel(staff.relationType, staff.fatherOrHusbandName, language)}
            </div>

            {/* Designation Pill - Dynamic & Stylish */}
            <div className="mt-1.5 inline-block max-w-full">
              <div className="px-2.5 py-0.5 rounded-md bg-[#8B0000] text-white text-[11px] font-extrabold tracking-tight shadow-xs truncate">
                {locDesignation.primary}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Grid with Official NGO Logo Watermark */}
        <div className="mt-1.5 bg-gray-50/95 rounded-xl p-2.5 border border-gray-200 text-[11px] relative overflow-hidden shadow-2xs">
          {/* NGO Official Logo Watermark right on Staff Details section */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0">
            <div className="w-36 h-36 flex items-center justify-center opacity-15">
              <BrandLogo size={135} />
            </div>
          </div>

          <div className="relative z-10 space-y-1.5">
            {/* Row 1: Staff ID & Blood Group */}
            <div className="grid grid-cols-2 gap-2 border-b border-gray-200/70 pb-1.5">
              <div>
                <span className="text-[9px] font-bold text-gray-500 block uppercase tracking-wider">
                  {language === 'en' ? 'Staff ID' : language === 'hi' ? 'स्टाफ आई.डी.' : 'स्टाफ आई.डी. (Staff ID)'}
                </span>
                <span className="font-extrabold text-gray-900 font-mono text-[12px] text-[#8B0000]">
                  {staff.id}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-gray-500 block uppercase tracking-wider">
                  {language === 'en' ? 'Blood Group' : language === 'hi' ? 'रक्त समूह' : 'रक्त समूह (Blood Group)'}
                </span>
                <span className="font-extrabold text-red-600 flex items-center gap-1 text-[12px]">
                  <Droplet className="w-3.5 h-3.5 fill-red-500" />
                  {staff.bloodGroup}
                </span>
              </div>
            </div>

            {/* Row 2: Department & Joining Date */}
            <div className="grid grid-cols-2 gap-2 border-b border-gray-200/70 pb-1.5">
              <div>
                <span className="text-[9px] font-bold text-gray-500 block uppercase tracking-wider">
                  {language === 'en' ? 'Department' : language === 'hi' ? 'विभाग' : 'विभाग (Department)'}
                </span>
                <span className="font-bold text-gray-800 text-[10.5px] truncate block" title={locDepartment}>
                  {locDepartment}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-gray-500 block uppercase tracking-wider">
                  {language === 'en' ? 'Date of Joining' : language === 'hi' ? 'ज्वाइनिंग तिथि' : 'ज्वाइनिंग तिथि (Joined)'}
                </span>
                <span className="font-bold text-gray-800 text-[10.5px] flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  {staff.dateOfJoining}
                </span>
              </div>
            </div>

            {/* Row 3: Mobile & Emergency */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[9px] font-bold text-gray-500 block uppercase tracking-wider">
                  {language === 'en' ? 'Mobile' : language === 'hi' ? 'मोबाइल' : 'मोबाइल (Mobile)'}
                </span>
                <span className="font-bold text-gray-800 text-[10.5px] flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  +91-{staff.mobile}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold text-gray-500 block uppercase tracking-wider">
                  {language === 'en' ? 'Emergency' : language === 'hi' ? 'आपातकालीन' : 'आपातकालीन (Emergency)'}
                </span>
                <span className="font-bold text-gray-800 text-[10.5px] font-mono">
                  {staff.emergencyContact ? `+91-${staff.emergencyContact}` : '+91-8052361666'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM AUTHENTICATION: QR Code, Official Stamp & President Signature */}
        <div className="mt-2 pt-1 border-t border-gray-200 flex items-center justify-between gap-2">
          {/* Verification QR Code */}
          <div className="flex flex-col items-center bg-white p-1 rounded-lg border border-gray-200 shadow-2xs">
            <CertificateVerificationQR
              certificateId={staff.id}
              size={56}
              showId={false}
              subText=""
            />
            <span className="text-[7.5px] font-extrabold text-gray-600 tracking-tighter mt-0.5">
              {language === 'en' ? 'SCAN TO VERIFY' : 'सत्यापन QR'}
            </span>
          </div>

          {/* Official Round Stamp in Middle */}
          <div className="flex flex-col items-center justify-center opacity-85 scale-90">
            <NgoRoundSeal size="sm" />
          </div>

          {/* Authorized Signatory: Manager / Secretary */}
          <div className="flex flex-col items-center text-center">
            <div className="h-9 flex items-center justify-center">
              <ShaileshPradhanSignature size="sm" className="max-h-8" />
            </div>
            <div className="border-t border-gray-400 pt-0.5 w-24 text-center">
              <div className="text-[9px] font-black text-gray-900 leading-tight">
                {language === 'en' ? 'Shailesh Pradhan' : 'शैलेश प्रधान'}
              </div>
              <div className="text-[7.5px] font-bold text-[#8B0000] leading-tight">
                {language === 'en'
                  ? 'Manager / Secretary'
                  : language === 'hi'
                  ? 'प्रबंधक / सचिव'
                  : 'Manager / Secretary (प्रबंधक/सचिव)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BAR: Location & Card Authenticity */}
      <div className={`bg-gradient-to-r ${themeStyles.headerBg} text-white py-1 px-3 flex items-center justify-between text-[9px] font-bold border-t border-amber-300`}>
        <span className="flex items-center gap-1">
          <MapPin className="w-2.5 h-2.5 text-amber-300" />
          {language === 'en' ? 'Ghazipur, Uttar Pradesh - 233303' : 'गाजीपुर, उत्तर प्रदेश (233303)'}
        </span>
        <span className="text-amber-300 tracking-wider font-mono">
          JJF-OFFICIAL-ID
        </span>
      </div>
    </div>
  );
};
