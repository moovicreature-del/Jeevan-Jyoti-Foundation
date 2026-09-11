import React, { useRef, useState, useEffect } from 'react';
import { X, Printer, Download, Share2, Sparkles, ShieldCheck, Calendar, CheckCircle2, Camera, AlertCircle, Trash2, UploadCloud, Check, FileText, Mail, Languages } from 'lucide-react';
import { FestivalGreetingRecord } from '../types';
import { FOUNDATION_INFO } from '../data/foundationData';
import { FESTIVALS_LIST, getFestivalsForYear } from '../data/festivalsData';
import { getPanchangYearMeta } from '../utils/thakurPrasadCalendar';
import { CertificateVerificationQR } from './CertificateVerificationQR';
import { NgoRoundSeal, ShaileshPradhanSignature } from './DigitalSignature';
import { RoyalCertificateSeal } from './common/RoyalCertificateSeal';
import { exportElementAsPng, exportElementAsJpg, exportElementAsPdf, directPrintElement } from '../utils/exportImage';
import { OtpVerificationModal } from './OtpVerificationModal';
import { CandidatePhotoUploader } from './CandidatePhotoUploader';
import { BrandLogo } from './common/BrandLogo';
import { SendCertificateModal } from './SendCertificateModal';
import { RoyalFourCorners, RoyalCenterFlourish } from './common/RoyalCertificateBorder';
import { saveCertificateToRegistry } from '../services/certificateRegistryService';
import { CertificateLanguage, getFestivalCertMatter } from '../utils/certificateLanguageUtils';
import { CertificateLanguageToggle } from './common/CertificateLanguageToggle';
import { OfficialVerifiedBadge } from './common/OfficialVerifiedBadge';

interface Props {
  greeting: FestivalGreetingRecord;
  onClose: () => void;
}

export const FestivalCertificateModal: React.FC<Props> = ({ greeting, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>(greeting.photoUrl || '');
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<'jpg' | 'png' | 'pdf' | 'print' | null>(null);
  const [recipientPhone, setRecipientPhone] = useState(greeting.phone || '+91-8052361666');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareModalTab, setShareModalTab] = useState<'whatsapp' | 'email'>('whatsapp');
  const [certLanguage, setCertLanguage] = useState<CertificateLanguage>('bilingual');

  // Extract year from greeting ID or date, or fallback to current year
  const certYear = (() => {
    const match = greeting.id?.match(/JJF-FEST-(\d{4})/);
    if (match) return parseInt(match[1], 10);
    const dateMatch = greeting.date?.match(/(\d{4})/);
    if (dateMatch) return parseInt(dateMatch[1], 10);
    return new Date().getFullYear();
  })();

  const yearMeta = getPanchangYearMeta(certYear);
  const festivalsForYear = getFestivalsForYear(certYear);
  const festivalInfo = festivalsForYear.find((f) => f.id === greeting.festivalId) || FESTIVALS_LIST.find((f) => f.id === greeting.festivalId) || FESTIVALS_LIST[0];
  const certMatter = getFestivalCertMatter(certLanguage);

  // Auto-save festival greeting certificate to database & registry
  useEffect(() => {
    const cleanPhone = (recipientPhone || greeting.phone || '8052361666').replace(/[^0-9]/g, '').slice(-10);
    saveCertificateToRegistry({
      id: greeting.id,
      type: 'festival_greeting',
      titleHindi: `पावन पर्व शुभकामना पत्र (${greeting.festivalNameHindi})`,
      titleEnglish: `Festival Greeting Certificate (${greeting.festivalNameEnglish})`,
      recipientName: greeting.recipientName,
      fatherOrHusbandName: greeting.recipientTitle || 'शुभचिंतक',
      phone: cleanPhone,
      issueDate: greeting.date || new Date().toISOString().split('T')[0],
      categoryOrPurpose: greeting.festivalNameHindi,
      photoUrl: photoUrl || greeting.photoUrl,
      details: `${greeting.festivalNameHindi} पर फाउंडेशन द्वारा जारी विशेष शुभकामना पत्र`,
      status: 'verified',
      rawGreeting: {
        ...greeting,
        phone: recipientPhone,
        photoUrl: photoUrl || greeting.photoUrl
      }
    });
  }, [greeting, recipientPhone, photoUrl]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotoUrl(uploadEvent.target.result as string);
          setPhotoError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePhotoRequirement = (): boolean => {
    if (!photoUrl) {
      setPhotoError('⚠️ शुभकामना प्रमाण पत्र डाउनलोड/प्रिंट करने हेतु प्राप्तकर्ता की फोटो अपलोड करना अनिवार्य है।');
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 150);
      return false;
    }
    setPhotoError(null);
    return true;
  };

  const handleInitiateDownload = (format: 'jpg' | 'png' | 'pdf') => {
    if (!validatePhotoRequirement()) return;
    setPendingFormat(format);
    setIsOtpOpen(true);
  };

  const handleOtpVerified = () => {
    if (pendingFormat === 'pdf') {
      executeDownloadPdf();
    } else if (pendingFormat === 'jpg') {
      executeDownloadJpg();
    } else if (pendingFormat === 'png') {
      executeDownloadPng();
    } else if (pendingFormat === 'print') {
      directPrintElement(certificateRef.current);
    }
    setPendingFormat(null);
  };

  const executeDownloadJpg = async () => {
    if (!certificateRef.current || downloading) return;
    setDownloading('jpg');
    try {
      const fileName = `${greeting.recipientName.replace(/\s+/g, '_')}_${greeting.festivalId}_Greeting_Certificate`;
      await exportElementAsJpg(certificateRef.current, fileName, { quality: 0.98 });
    } catch (err) {
      console.error('Error downloading JPG certificate:', err);
    } finally {
      setDownloading(null);
    }
  };

  const executeDownloadPng = async () => {
    if (!certificateRef.current || downloading) return;
    setDownloading('png');
    try {
      const fileName = `${greeting.recipientName.replace(/\s+/g, '_')}_${greeting.festivalId}_Greeting_Certificate`;
      await exportElementAsPng(certificateRef.current, fileName, { backgroundColor: '#FFFFFF', pixelRatio: 2 });
    } catch (err) {
      console.error('Error downloading certificate:', err);
    } finally {
      setDownloading(null);
    }
  };

  const executeDownloadPdf = async () => {
    if (!certificateRef.current || downloading) return;
    setDownloading('pdf');
    try {
      const fileName = `${greeting.recipientName.replace(/\s+/g, '_')}_${greeting.festivalId}_Greeting_Certificate_A4`;
      await exportElementAsPdf(certificateRef.current, fileName, { orientation: 'landscape' });
    } catch (err) {
      console.error('Error downloading PDF certificate:', err);
    } finally {
      setDownloading(null);
    }
  };

  const handlePrint = () => {
    if (!validatePhotoRequirement()) return;
    setPendingFormat('print');
    setIsOtpOpen(true);
  };

  const handleWhatsAppShare = () => {
    if (!validatePhotoRequirement()) return;
    const shareText = `🪔 *जीवन ज्योति फाउंडेशन (गाज़ीपुर)* 🪔\n\n✨ *${greeting.festivalNameHindi} की हार्दिक शुभकामनाएं!* ✨\n\nआदरणीय *${greeting.recipientName}* (${greeting.recipientTitle}),\n\n"${greeting.customMessage || festivalInfo.blessingHindi}"\n\n📜 *आधिकारिक शुभकामना प्रमाण पत्र ID:* ${greeting.id}\n🌐 *सत्यापन लिंक:* ${window.location.origin}/?verify=${greeting.id}\n\n*सस्नेह:* शैलेश प्रधान (प्रबंधक / सचिव)\nजीवन ज्योति फाउंडेशन, गाज़ीपुर (उ.प्र.)\nReg. No: 03373 | NITI Aayog: UP/2023/0360341`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md overscroll-contain print:p-0 print:bg-white print:static">
      <div className="min-h-full flex items-center justify-center p-2 sm:p-4 md:p-6 print:p-0">
        <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col my-auto border border-amber-300 print:border-none print:shadow-none print:max-w-none print:w-full animate-in fade-in zoom-in-95 duration-200">
          {/* Action Header (Hidden in Print) */}
        <div className="bg-gradient-to-r from-[#8B0000] via-amber-800 to-amber-900 text-white px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between no-print shadow-md gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{greeting.symbolEmoji || festivalInfo.symbolEmoji}</span>
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">
                {greeting.festivalNameHindi} — शुभकामना पत्र
              </h3>
              <p className="text-[11px] text-amber-200">
                प्रमाण पत्र संख्या: <span className="font-mono font-bold text-white">{greeting.id}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Language Switcher Toggle */}
            <CertificateLanguageToggle
              language={certLanguage}
              onLanguageChange={setCertLanguage}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all border ${
                photoUrl
                  ? 'bg-emerald-600 text-white border-emerald-400 hover:bg-emerald-700'
                  : 'bg-amber-400 text-amber-950 border-amber-300 hover:bg-amber-300 font-black'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{photoUrl ? 'फोटो बदलें' : 'फोटो अपलोड करें *'}</span>
            </button>

            <button
              onClick={() => {
                if (!validatePhotoRequirement()) return;
                setShareModalTab('whatsapp');
                setShareModalOpen(true);
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              title="Send on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => {
                if (!validatePhotoRequirement()) return;
                setShareModalTab('email');
                setShareModalOpen(true);
              }}
              className="px-3 py-1.5 bg-[#0024B8] hover:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              title="Send to Email Address"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>ईमेल (Email)</span>
            </button>

            {/* Social Share Post Button */}
            <button
              onClick={() => {
                if (!validatePhotoRequirement()) return;
                setShareModalTab('social' as any);
                setShareModalOpen(true);
              }}
              className="px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              title="Share Greeting on Social Media"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>सोशल शेयर</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all"
              title="Print Certificate"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट (Print)</span>
            </button>
            <button
              onClick={() => handleInitiateDownload('jpg')}
              disabled={downloading !== null}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-md disabled:opacity-50"
              title="Download JPG Certificate (300 DPI)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading === 'jpg' ? 'JPG तैयार...' : 'JPG (300 DPI)'}</span>
            </button>
            <button
              onClick={() => handleInitiateDownload('pdf')}
              disabled={downloading !== null}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 text-xs font-black rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-md disabled:opacity-50"
              title="Download PDF Certificate (A4 Landscape)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{downloading === 'pdf' ? 'PDF तैयार...' : 'PDF (A4)'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Photo Uploader Section (Camera + Gallery) */}
        <div className="px-4 sm:px-6 pt-3 no-print">
          <CandidatePhotoUploader
            photoUrl={photoUrl}
            onPhotoChange={(url) => {
              setPhotoUrl(url);
              setPhotoError(null);
            }}
            onPhotoRemove={() => setPhotoUrl('')}
            required={true}
            label="शुभकामना प्राप्तकर्ता का फोटो (Recipient Photo)"
            subLabel="शुभकामना प्रमाण पत्र पर फोटो मुद्रित करने हेतु (गैलरी से चुनें या लाइव कैमरा से खींचें)"
          />
        </div>

        {/* Certificate Container with Scroll on Mobile */}
        <div className="p-3 sm:p-6 bg-[#FFFDF8] overflow-x-auto flex justify-center">
          {/* A4 Landscape Ratio Certificate Board */}
          <div
            ref={certificateRef}
            id="festival-certificate-card"
            data-printable="true"
            className="printable-certificate w-[860px] min-w-[860px] bg-[#FFFDF9] p-6 sm:p-8 rounded-2xl relative overflow-hidden text-gray-900 select-none shadow-2xl"
            style={{
              border: '9px solid #8B0000',
              boxShadow: '0 0 0 3px #D4AF37, 0 0 0 6px #700000, 0 12px 35px rgba(139, 0, 0, 0.25)',
              backgroundColor: '#FFFDF9'
            }}
          >
            {/* Inner Golden Ornate Border */}
            <div
              className="absolute inset-2 sm:inset-3 border-2 border-amber-400/90 rounded-xl pointer-events-none"
              style={{
                border: '2.5px double #D4AF37',
                outline: '1px dashed rgba(212, 175, 55, 0.5)',
                outlineOffset: '-4px'
              }}
            />

            {/* Royal Vector Corner Filigree Ornaments */}
            <RoyalFourCorners color="#D4AF37" size={56} />

            {/* Background Watermark using BrandLogo */}
            <div
              id="fest-cert-watermark"
              className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0"
            >
              <BrandLogo size={420} watermark opacity={0.07} />
            </div>

            {/* Certificate Header Content */}
            <div className="relative z-10 text-center space-y-2">
              {/* Top Foundation Strip */}
              <div className="flex items-center justify-between border-b-2 border-amber-300 pb-2.5">
                <div className="text-left">
                  <div className="text-[10px] font-bold text-amber-900 tracking-wider uppercase">
                    Reg. No: <span className="font-mono">{FOUNDATION_INFO.regNo}</span> | NITI Aayog: <span className="font-mono">{FOUNDATION_INFO.nitiAayogUid}</span>
                  </div>
                  <div className="text-[9px] text-gray-600 font-semibold">
                    80G URN: {FOUNDATION_INFO.urn80G} • 12A Certified
                  </div>
                </div>

                {/* Top Center Title & Logo */}
                <div className="flex flex-col items-center justify-center text-center flex-1">
                  <BrandLogo size={70} className="mx-auto mb-1 drop-shadow-xs" id="fest-cert-top-logo" />
                  <div className="text-center">
                    <h1 className="text-xl font-black text-[#8B0000] font-['Cinzel',serif] tracking-tight leading-none">
                      {certLanguage === 'hi' ? FOUNDATION_INFO.nameHindi : certLanguage === 'en' ? FOUNDATION_INFO.nameEnglish : FOUNDATION_INFO.nameEnglish}
                    </h1>
                    {certLanguage !== 'en' && (
                      <div className="text-xs font-bold text-amber-900 mt-0.5">
                        {FOUNDATION_INFO.nameHindi}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-bold text-amber-900">
                    {FOUNDATION_INFO.district} ({FOUNDATION_INFO.state})
                  </div>
                  <div className="text-[9px] font-mono text-gray-600 font-bold">
                    ID: {greeting.id}
                  </div>
                </div>
              </div>

              {/* Festive Title Banner & Thakur Prasad Panchang Tag */}
              <div className="pt-1.5 space-y-1">
                <div className="inline-flex items-center gap-2 px-5 py-1 rounded-full bg-gradient-to-r from-amber-700 via-orange-600 to-amber-700 text-white shadow-sm border border-amber-300">
                  <span className="text-base">{greeting.symbolEmoji || festivalInfo.symbolEmoji}</span>
                  <span className="text-xs sm:text-sm font-black tracking-wider uppercase">
                    {certLanguage === 'hi'
                      ? `${greeting.festivalNameHindi} • पावन शुभकामना संदेश पत्र (${certYear})`
                      : certLanguage === 'en'
                      ? `${greeting.festivalNameEnglish || greeting.festivalNameHindi} • Auspicious Festival Greetings (${certYear})`
                      : `${greeting.festivalNameHindi} • पावन शुभकामना संदेश पत्र (${certYear})`}
                  </span>
                  <span className="text-base">{greeting.symbolEmoji || festivalInfo.symbolEmoji}</span>
                </div>

                {/* Thakur Prasad Panchang Certification & Tithi Ribbon */}
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-amber-900">
                  <span className="bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300">
                    🚩 {festivalInfo.thakurPrasadRef || `श्री ठाकुर प्रसाद पंचांग संवत ${yearMeta.vikramSamvat}`}
                  </span>
                  {festivalInfo.tithiHindi && (
                    <span className="bg-orange-100/90 px-2.5 py-0.5 rounded-full border border-orange-300">
                      📅 {festivalInfo.tithiHindi} ({festivalInfo.dateFormattedHindi})
                    </span>
                  )}
                  {festivalInfo.shubhMuhuratHindi && (
                    <span className="bg-yellow-100/90 px-2.5 py-0.5 rounded-full border border-yellow-300">
                      ⏱️ {festivalInfo.shubhMuhuratHindi}
                    </span>
                  )}
                </div>
              </div>

              {/* Sanskrit Shloka / Vedic Blessing Box */}
              <div className="bg-[#FFFDE7]/90 border border-amber-300/80 rounded-xl py-1 px-4 max-w-2xl mx-auto shadow-2xs">
                <p className="text-[10.5px] font-bold text-amber-950 font-serif italic tracking-wide">
                  {greeting.shloka || festivalInfo.shloka}
                </p>
              </div>

              {/* Recipient Section with Clickable Photo Slot */}
              <div className="pt-1 flex items-center justify-center gap-6 max-w-2xl mx-auto">
                <div className="shrink-0 flex flex-col items-center">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    title={certLanguage === 'hi' ? 'फोटो अपलोड/बदलने के लिए क्लिक करें' : 'Click to upload/change photo'}
                    className={`relative w-20 h-24 rounded-lg border-2 flex flex-col items-center justify-center text-center p-1 bg-white cursor-pointer group shadow-xs overflow-hidden ${
                      photoUrl
                        ? 'border-[#008000] hover:ring-2 hover:ring-emerald-500'
                        : 'border-dashed border-red-400 bg-red-50/40 hover:bg-red-50 hover:border-red-600'
                    }`}
                  >
                    {photoUrl ? (
                      <>
                        <img
                          src={photoUrl}
                          alt={greeting.recipientName}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover rounded"
                        />
                        <div className="absolute top-0.5 right-0.5 bg-emerald-600 text-white rounded-full p-0.5 shadow-md">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <div className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity rounded no-print">
                          <Camera className="w-3.5 h-3.5 mb-0.5" />
                          <span className="text-[6.5pt] font-black">{certLanguage === 'hi' ? 'बदलें' : 'Change'}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5 text-red-600 mb-0.5 group-hover:scale-110 transition-transform" />
                        <span className="text-[7pt] font-black text-red-700 uppercase leading-tight">
                          {certLanguage === 'hi' ? 'फोटो अपलोड *' : 'PHOTO UPLOAD *'}
                        </span>
                      </>
                    )}
                  </div>
                  <span className={`text-[6.5pt] font-black uppercase tracking-wider mt-1 px-1 rounded ${
                    photoUrl ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700 animate-pulse'
                  }`}>
                    {photoUrl ? (certLanguage === 'hi' ? '✓ सत्यापित फोटो' : '✓ VERIFIED') : (certLanguage === 'hi' ? '⚠️ फोटो *' : '⚠️ PHOTO *')}
                  </span>
                </div>

                <div className="text-left flex-1">
                  <p className="text-xs text-gray-600 font-semibold tracking-wide">
                    {certMatter.presentedToText}
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#8B0000] font-serif tracking-tight drop-shadow-xs">
                    {greeting.recipientName}
                  </h2>
                  <div className="inline-block px-3 py-1 bg-amber-100/90 text-amber-950 font-bold text-[11px] rounded-xl border border-amber-300 mt-1">
                    <span className="text-[#8B0000]">{greeting.recipientTitle}</span>
                    <span className="mx-1.5 text-amber-500">•</span>
                    <span>
                      {greeting.wardOrVillage ? (certLanguage === 'hi' ? `ग्राम/वार्ड: ${greeting.wardOrVillage}, ` : `Ward/Village: ${greeting.wardOrVillage}, `) : ''}
                      {greeting.block ? (certLanguage === 'hi' ? `ब्लॉक: ${greeting.block}, ` : `Block: ${greeting.block}, `) : ''}
                      {greeting.district ? (certLanguage === 'hi' ? `जिला: ${greeting.district}, ` : `Dist: ${greeting.district}, `) : ''}
                      {greeting.state ? `${greeting.state}` : (greeting.city || (certLanguage === 'hi' ? 'गाज़ीपुर (उ.प्र.)' : 'Ghazipur (U.P.)'))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Festival Greeting Text */}
              <div className="max-w-2xl mx-auto px-4 py-2 bg-white/80 rounded-xl border border-amber-200 shadow-2xs text-center">
                {certLanguage === 'hi' ? (
                  <p className="text-[12.5px] leading-relaxed text-gray-800 font-medium">
                    {greeting.customMessage || festivalInfo.blessingHindi}
                  </p>
                ) : certLanguage === 'en' ? (
                  <p className="text-[12.5px] leading-relaxed text-gray-800 font-medium italic">
                    "{festivalInfo.blessingEnglish}"
                  </p>
                ) : (
                  <>
                    <p className="text-[12.5px] leading-relaxed text-gray-800 font-medium">
                      {greeting.customMessage || festivalInfo.blessingHindi}
                    </p>
                    <p className="text-[10.5px] text-gray-600 italic mt-1 border-t border-amber-100 pt-0.5">
                      "{festivalInfo.blessingEnglish}"
                    </p>
                  </>
                )}
              </div>

              {/* Single-Line Balanced Footer - 3 Pillars (Live Verify QR | Royal Official Seal | Authorised Signatory) */}
              <div className="pt-[clamp(6px,1.2cqw,12px)] border-t-2 border-amber-300/80 grid grid-cols-3 items-center gap-[clamp(6px,1.5cqw,14px)] px-1 select-none">
                {/* COLUMN 1 (LEFT): Official Live Verification QR Code */}
                <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-[#FFFDF8] border border-amber-300/80 rounded-lg sm:rounded-xl shadow-2xs text-left w-full max-w-[clamp(175px,30cqw,250px)]">
                  <div className="shrink-0 p-0.5 sm:p-1 bg-white border border-amber-400 rounded-md sm:rounded-lg shadow-2xs">
                    <CertificateVerificationQR
                      certificateId={greeting.id}
                      size="auto"
                      showId={false}
                      subText=""
                    />
                  </div>
                  <div className="flex-1 min-w-0 font-sans text-[clamp(6.5pt,0.85cqw,8pt)] leading-tight space-y-0.5 text-gray-800">
                    <div className="text-[clamp(6pt,0.8cqw,7pt)] font-black text-[#8B0000] uppercase tracking-wider truncate">
                      {certLanguage === 'hi' ? 'सत्यापन क्यूआर' : 'LIVE VERIFY QR'}
                    </div>
                    <div className="truncate">
                      <strong className="text-black font-black">ID:</strong>{' '}
                      <span className="font-mono font-bold text-[#8B0000] text-[clamp(7pt,0.9cqw,8pt)] block truncate">{greeting.id}</span>
                    </div>
                    <div className="truncate">
                      <strong className="text-black font-black">{certLanguage === 'hi' ? 'दिनांक' : 'Date'}:</strong>{' '}
                      <span className="font-medium text-black">{greeting.date}</span>
                    </div>
                    <div className="text-[clamp(5.5pt,0.75cqw,6.5pt)] text-emerald-800 font-bold truncate">
                      ✓ {certLanguage === 'hi' ? 'सत्यापित शुभकामना' : 'Verified Greeting'}
                    </div>
                  </div>
                </div>

                {/* COLUMN 2 (CENTER): Royal Official Embossed NGO Seal */}
                <div className="flex flex-col items-center justify-center text-center px-0.5 sm:px-1 w-full">
                  <RoyalCertificateSeal
                    size="auto"
                    variant="gold-crimson"
                    showRibbons={true}
                  />
                  <div className="text-[clamp(6pt,0.8cqw,7.5pt)] font-extrabold uppercase tracking-widest text-[#8B0000] mt-0.5 sm:mt-1 text-center truncate max-w-full">
                    {certLanguage === 'hi' ? 'आधिकारिक शुभकामना मुहर' : 'OFFICIAL FESTIVAL SEAL'}
                  </div>
                </div>

                {/* COLUMN 3 (RIGHT): Authorised Signatory with Authentic Digital Signature */}
                <div className="text-right flex flex-col items-end justify-center w-full">
                  <div className="w-full max-w-[clamp(175px,30cqw,250px)] border-2 border-dashed border-blue-900/40 bg-[#FFFDE7]/90 p-1 sm:p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-center shadow-2xs relative">
                    <div className="text-[clamp(6.5pt,0.8cqw,7.5pt)] font-black text-blue-950 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1 truncate">
                      <ShieldCheck className="w-3 h-3 text-blue-900 shrink-0" />
                      <span className="truncate">{certMatter.signatoryLabel}</span>
                    </div>

                    {/* Blue realistic cursive overlay signature */}
                    <div className="my-0.5 py-0.5 flex items-center justify-center">
                      <ShaileshPradhanSignature size="auto" />
                    </div>

                    <div className="border-t border-[#1E40AF]/30 pt-0.5 leading-tight">
                      <div className="text-[clamp(7.5pt,1cqw,9.5pt)] font-bold text-[#1E40AF] truncate">
                        {certMatter.signatoryName}
                      </div>
                      <div className="text-[clamp(6.5pt,0.8cqw,7.5pt)] text-gray-700 font-semibold truncate">
                        {certMatter.signatoryDesig}
                      </div>
                      <div className="text-[clamp(6pt,0.75cqw,7pt)] text-gray-600 font-bold uppercase tracking-wider truncate">
                        {FOUNDATION_INFO.nameEnglish}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Micro Footer */}
              <div className="text-[8.5px] text-gray-500 flex items-center justify-between pt-1 border-t border-gray-200">
                <span>📍 {FOUNDATION_INFO.address}</span>
                <span>📞 {FOUNDATION_INFO.phone} | ✉️ {FOUNDATION_INFO.email}</span>
                <span>🌐 {FOUNDATION_INFO.website}</span>
              </div>
            </div>
          </div>
        </div>

        {/* OTP Verification Modal for Secure Festival Greeting Certificate Download */}
        <OtpVerificationModal
          isOpen={isOtpOpen}
          onClose={() => setIsOtpOpen(false)}
          phoneNumber={recipientPhone}
          onSuccess={handleOtpVerified}
          title="शुभकामना पत्र डाउनलोड - OTP सत्यापन"
          subtitle="सुरक्षा सत्यापन: शुभकामना प्रमाण पत्र डाउनलोड करने हेतु मोबाइल नंबर OTP सत्यापित करें।"
        />

        {/* Send Festival Greeting via WhatsApp & Email Modal */}
        {shareModalOpen && (
          <SendCertificateModal
            isOpen={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
            defaultTab={shareModalTab}
            data={{
              certificateType: 'festival_cert',
              titleHindi: `${greeting.festivalNameHindi} — आधिकारिक शुभकामना पत्र`,
              titleEnglish: `${greeting.festivalNameEnglish} — Official Appreciation Greeting`,
              recipientName: greeting.recipientName,
              certificateNo: greeting.id,
              issueDate: greeting.date,
              recipientPhone: recipientPhone,
              purpose: greeting.customMessage || festivalInfo.blessingHindi,
              qrVerifyUrl: typeof window !== 'undefined' ? `${window.location.origin}/?verify=${encodeURIComponent(greeting.id)}` : undefined
            }}
          />
        )}
        </div>
      </div>
    </div>
  );
};

export default FestivalCertificateModal;
