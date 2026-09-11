import React, { useRef, useState, useEffect } from 'react';
import { X, Printer, Download, Award, ShieldCheck, User, Edit3, Check, FileText, Image as ImageIcon, Camera, AlertCircle, Trash2, UploadCloud, Share2, Mail, Globe, Languages } from 'lucide-react';
import { Volunteer } from '../types';
import { FOUNDATION_INFO } from '../data/foundationData';
import { CertificateVerificationQR } from './CertificateVerificationQR';
import { ShaileshPradhanSignature, NgoRoundSeal } from './DigitalSignature';
import { RoyalCertificateSeal } from './common/RoyalCertificateSeal';
import { exportElementAsPng, exportElementAsJpg, exportElementAsPdf, directPrintElement } from '../utils/exportImage';
import { StructuredAddressSelector } from './StructuredAddressSelector';
import { DEFAULT_STRUCTURED_ADDRESS, StructuredAddress } from '../data/locationData';
import { OtpVerificationModal } from './OtpVerificationModal';
import { CandidatePhotoUploader } from './CandidatePhotoUploader';
import { BrandLogo } from './common/BrandLogo';
import { SendCertificateModal } from './SendCertificateModal';
import { RoyalFourCorners, RoyalCenterFlourish } from './common/RoyalCertificateBorder';
import { formatCertificateNumber, formatCertificateIssueDate, formatCertificateDuration } from '../utils/certificateUtils';
import { saveCertificateToRegistry } from '../services/certificateRegistryService';
import { CertificateLanguage, getVolunteerCertMatter } from '../utils/certificateLanguageUtils';
import { CertificateLanguageToggle } from './common/CertificateLanguageToggle';
import { OfficialVerifiedBadge } from './common/OfficialVerifiedBadge';

interface Props {
  volunteer: Volunteer;
  onClose: () => void;
}

export const VolunteerCertificateModal: React.FC<Props> = ({ volunteer, onClose }) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [showEditPanel, setShowEditPanel] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<'pdf' | 'jpg' | 'png' | 'print' | null>(null);
  const [volunteerPhone, setVolunteerPhone] = useState(volunteer.phone || '+91-8052361666');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareModalTab, setShareModalTab] = useState<'whatsapp' | 'email'>('whatsapp');
  const [certLanguage, setCertLanguage] = useState<CertificateLanguage>('bilingual');

  // Editable text states with issued number/month/year
  const initialCertNo = formatCertificateNumber('VOL', volunteer.joinDate || new Date(), volunteer.id || '01');
  const initialIssueDate = formatCertificateIssueDate(volunteer.joinDate || new Date());
  const initialDurationText = formatCertificateDuration(volunteer.joinDate || '2026-01-01', new Date());

  const [certNumber, setCertNumber] = useState(initialCertNo);
  const [issueDate, setIssueDate] = useState(initialIssueDate);
  const [volunteerName, setVolunteerName] = useState(volunteer.name || 'Pratima Kumari Rai');
  const [fatherTitle, setFatherTitle] = useState(
    volunteer.fatherName
      ? volunteer.fatherName.startsWith('Shri') || volunteer.fatherName.startsWith('श्री') || volunteer.fatherName.startsWith('Smt') || volunteer.fatherName.startsWith('श्रीमती')
        ? volunteer.fatherName
        : `Shri ${volunteer.fatherName}`
      : 'Shri Ramakant Rai'
  );
  const [areaContribution, setAreaContribution] = useState(volunteer.area || 'SHIKSHA (FREE EDUCATION & EVENING SCHOOL)');
  const [areaHindi, setAreaHindi] = useState(volunteer.areaHindi || 'शिक्षा एवं निःशुल्क संध्या पाठशाला');
  const [durationText, setDurationText] = useState(initialDurationText);
  const [volunteerId, setVolunteerId] = useState(volunteer.id || 'JJF-VOL-01');
  const [customPhotoUrl, setCustomPhotoUrl] = useState(volunteer.photoUrl || '');
  
  // Dynamic Matter based on Language
  const certMatter = getVolunteerCertMatter(certLanguage);
  
  // Structured Address State
  const [volAddress, setVolAddress] = useState<StructuredAddress>({
    country: volunteer.country || DEFAULT_STRUCTURED_ADDRESS.country,
    state: volunteer.state || DEFAULT_STRUCTURED_ADDRESS.state,
    district: volunteer.district || DEFAULT_STRUCTURED_ADDRESS.district,
    block: volunteer.block || DEFAULT_STRUCTURED_ADDRESS.block,
    wardOrVillage: volunteer.wardOrVillage || 'मीरानपुर (Miranpur)'
  });

  // Auto-save issued volunteer certificate to database & local registry
  useEffect(() => {
    const cleanPhone = (volunteerPhone || volunteer.phone || '8052361666').replace(/[^0-9]/g, '').slice(-10);
    saveCertificateToRegistry({
      id: certNumber,
      type: 'volunteer_cert',
      titleHindi: 'आधिकारिक स्वयंसेवक प्रमाण पत्र',
      titleEnglish: 'Official Volunteer Certificate',
      recipientName: volunteerName,
      fatherOrHusbandName: fatherTitle,
      phone: cleanPhone,
      issueDate: issueDate,
      categoryOrPurpose: `${areaHindi} (${areaContribution})`,
      photoUrl: customPhotoUrl || volunteer.photoUrl,
      details: `सेवा योगदान: ${durationText} • ${areaHindi}`,
      status: 'verified',
      rawVolunteer: {
        ...volunteer,
        id: volunteerId,
        name: volunteerName,
        fatherName: fatherTitle,
        phone: volunteerPhone,
        area: areaContribution,
        areaHindi: areaHindi,
        photoUrl: customPhotoUrl || volunteer.photoUrl,
        country: volAddress.country,
        state: volAddress.state,
        district: volAddress.district,
        block: volAddress.block,
        wardOrVillage: volAddress.wardOrVillage
      }
    });
  }, [certNumber, volunteerName, fatherTitle, areaHindi, areaContribution, issueDate, durationText, customPhotoUrl, volunteerId, volAddress, volunteerPhone]);

  // Validate mandatory photo & address before printing or downloading
  const validateRequirements = (): boolean => {
    if (!customPhotoUrl) {
      setPhotoError('⚠️ आधिकारिक प्रमाण पत्र के लिए पासपोर्ट साइज फोटो अपलोड करना अनिवार्य है।');
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 150);
      return false;
    }
    if (!volAddress.country || !volAddress.state || !volAddress.district || !volAddress.block || !volAddress.wardOrVillage?.trim()) {
      setPhotoError('⚠️ प्रमाण पत्र के लिए देश, राज्य, जिला, ब्लॉक व वार्ड/ग्राम का चयन/दर्ज करना अनिवार्य है।');
      setShowEditPanel(true);
      return false;
    }
    setPhotoError(null);
    return true;
  };

  const handlePrint = () => {
    if (!validateRequirements()) return;
    setPendingFormat('print');
    setIsOtpModalOpen(true);
  };

  // 1. Trigger OTP check before downloading
  const handleInitiateDownload = (format: 'pdf' | 'jpg' | 'png') => {
    if (!validateRequirements()) return;
    setPendingFormat(format);
    setIsOtpModalOpen(true);
  };

  // 2. Execute actual download once OTP is verified
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

  const executeDownloadPdf = async () => {
    if (!certificateRef.current || downloading) return;
    setDownloading('pdf');
    try {
      const fileName = `Certificate_Of_Appreciation_${volunteerName.replace(/\s+/g, '_')}_A4_300DPI`;
      await exportElementAsPdf(certificateRef.current, fileName, { orientation: 'landscape' });
    } finally {
      setDownloading(null);
    }
  };

  const executeDownloadJpg = async () => {
    if (!certificateRef.current || downloading) return;
    setDownloading('jpg');
    try {
      const fileName = `Certificate_Of_Appreciation_${volunteerName.replace(/\s+/g, '_')}_300DPI`;
      await exportElementAsJpg(certificateRef.current, fileName, { quality: 0.96 });
    } finally {
      setDownloading(null);
    }
  };

  const executeDownloadPng = async () => {
    if (!certificateRef.current || downloading) return;
    setDownloading('png');
    try {
      const fileName = `Certificate_Of_Appreciation_${volunteerName.replace(/\s+/g, '_')}`;
      await exportElementAsPng(certificateRef.current, fileName, { backgroundColor: '#FFFFFF' });
    } finally {
      setDownloading(null);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setCustomPhotoUrl(uploadEvent.target.result as string);
          setPhotoError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto p-2 sm:p-4 md:p-6 flex items-start sm:items-center justify-center py-4 sm:py-8 overscroll-contain touch-pan-y">
      <div className="bg-white rounded-2xl max-w-5xl w-full p-4 sm:p-6 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200 max-h-[94vh] overflow-y-auto">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 gap-3 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <Award className="w-6 h-6 text-[#FF8C00]" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-base sm:text-lg leading-tight">
                प्रशस्ति पत्र / CERTIFICATE OF APPRECIATION
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Official A4 Landscape Volunteer Appreciation Award • High-Res 300 DPI Print Ready
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Language Switcher Toggle */}
            <CertificateLanguageToggle
              language={certLanguage}
              onLanguageChange={setCertLanguage}
            />

            {/* Toggle Edit Button */}
            <button
              onClick={() => setShowEditPanel(!showEditPanel)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                showEditPanel
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{showEditPanel ? 'संपादन बंद करें' : 'विवरण बदलें (Edit Text)'}</span>
            </button>

            {/* Send on WhatsApp Button */}
            <button
              onClick={() => {
                if (!validateRequirements()) return;
                setShareModalTab('whatsapp');
                setShareModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-xs"
              title="Send Certificate to WhatsApp Number"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* Send to Email Button */}
            <button
              onClick={() => {
                if (!validateRequirements()) return;
                setShareModalTab('email');
                setShareModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0024B8] hover:bg-blue-800 text-white rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-xs"
              title="Send Certificate to Email Address"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>ईमेल (Email)</span>
            </button>

            {/* Social Share Post Button */}
            <button
              onClick={() => {
                if (!validateRequirements()) return;
                setShareModalTab('social' as any);
                setShareModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-xs"
              title="Share Achievement on Social Media"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>सोशल शेयर</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट (Print)</span>
            </button>

            {/* Download JPG Button */}
            <button
              onClick={() => handleInitiateDownload('jpg')}
              disabled={downloading !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading === 'jpg' ? 'JPG तैयार...' : 'JPG (300 DPI)'}</span>
            </button>

            {/* Download PDF Button */}
            <button
              onClick={() => handleInitiateDownload('pdf')}
              disabled={downloading !== null}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8B0000] hover:bg-[#6e0000] text-white rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{downloading === 'pdf' ? 'PDF तैयार...' : 'PDF (A4 Landscape)'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Photo Uploader Section (Camera + Gallery) */}
        <div className="px-4 sm:px-6 pt-3 no-print">
          <CandidatePhotoUploader
            photoUrl={customPhotoUrl}
            onPhotoChange={(url) => {
              setCustomPhotoUrl(url);
              setPhotoError(null);
            }}
            onPhotoRemove={() => setCustomPhotoUrl('')}
            required={true}
            label="स्वयंसेवक का पासपोर्ट फोटो (Volunteer Photo - कैमरा या गैलरी)"
            subLabel="प्रमाण पत्र पर फोटो मुद्रित करने हेतु (गैलरी से चुनें या लाइव कैमरा से खींचें)"
          />
        </div>

        {/* Live Edit Drawer (Collapsible) */}
        {showEditPanel && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 my-3 no-print transition-all animate-fadeIn">
            <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-amber-200">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5" /> प्रमाण पत्र विवरण संपादित करें (Live Text Editor):
              </span>
              <button
                onClick={() => setShowEditPanel(false)}
                className="text-xs text-amber-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-emerald-700" /> संपन्न (Done)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              {/* Name */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">स्वयंसेवक का नाम (Name):</label>
                <input
                  type="text"
                  value={volunteerName}
                  onChange={(e) => setVolunteerName(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 font-bold text-gray-900 focus:ring-1 focus:ring-amber-500 outline-hidden"
                />
              </div>

              {/* Certificate No */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">प्रमाण पत्र संख्या (Cert No):</label>
                <input
                  type="text"
                  value={certNumber}
                  onChange={(e) => setCertNumber(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 font-mono font-bold text-gray-900 focus:ring-1 focus:ring-amber-500 outline-hidden"
                />
              </div>

              {/* Date of Issue */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-gray-700">जारी दिनांक (Date of Issue):</label>
                  <button
                    type="button"
                    onClick={() => setIssueDate(formatCertificateIssueDate(new Date()))}
                    className="text-[10px] font-bold text-amber-800 hover:underline cursor-pointer"
                  >
                    🔄 आज की तिथि
                  </button>
                </div>
                <input
                  type="text"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 font-bold text-gray-900 focus:ring-1 focus:ring-amber-500 outline-hidden"
                />
              </div>

              {/* Father's / Spouse's Name */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">पिता / पति / अभिभावक (Father / Spouse):</label>
                <input
                  type="text"
                  value={fatherTitle}
                  onChange={(e) => setFatherTitle(e.target.value)}
                  placeholder="उदा. Shri Ramakant Rai / Smt Pratima Rai"
                  className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:ring-1 focus:ring-amber-500 outline-hidden"
                />
              </div>

              {/* Area of Contribution */}
              <div className="sm:col-span-2">
                <label className="block font-bold text-gray-700 mb-1">सेवा क्षेत्र (Contribution Area):</label>
                <input
                  type="text"
                  value={areaContribution}
                  onChange={(e) => setAreaContribution(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:ring-1 focus:ring-amber-500 outline-hidden"
                />
              </div>

              {/* Service Period / Duration Text */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">सेवा काल / सेवा अवधि (Service Period):</label>
                <input
                  type="text"
                  value={durationText}
                  onChange={(e) => setDurationText(e.target.value)}
                  placeholder="उदा. From 01 Jan 2026 to 25 Aug 2026"
                  className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 text-gray-900 focus:ring-1 focus:ring-amber-500 outline-hidden"
                />
              </div>

              {/* Structured Address Selector Component */}
              <div className="sm:col-span-2 md:col-span-4 bg-white/90 p-3 rounded-lg border border-amber-300">
                <StructuredAddressSelector
                  value={volAddress}
                  onChange={setVolAddress}
                  required={true}
                  compact={true}
                  labelPrefix="स्वयंसेवक का निवास एवं सेवा कार्यक्षेत्र पता"
                />
              </div>
            </div>
          </div>
        )}

        {/* Certificate Container with A4 Landscape Ratio */}
        <div className="overflow-x-auto py-4 flex justify-center">
          <div
            ref={certificateRef}
            className="printable-certificate bg-[#FFFDF8] text-black p-[10px] rounded-2xl shadow-2xl relative select-none"
            style={{
              width: '880px',
              minWidth: '880px',
              border: '10px solid #8B0000', // Outer Royal Deep Crimson Border
              boxShadow: '0 0 0 3px #D4AF37, 0 0 0 6px #700000, 0 12px 35px rgba(139, 0, 0, 0.25)',
              backgroundColor: '#FFFDF8',
              fontFamily: 'Arial, sans-serif'
            }}
          >
            {/* Inner Royal Border with Gold Filigree */}
            <div
              className="relative p-6 bg-[#FFFEFC] overflow-hidden rounded-lg"
              style={{
                border: '3px double #D4AF37',
                outline: '1px dashed rgba(212, 175, 55, 0.6)',
                outlineOffset: '-7px',
                minHeight: '580px'
              }}
            >
              {/* Royal Vector Gold Corner Filigree Ornaments */}
              <RoyalFourCorners color="#D4AF37" size={60} />

              {/* Background Watermark using BrandLogo */}
              <div
                id="vol-cert-watermark"
                className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0"
              >
                <BrandLogo size={420} watermark opacity={0.07} />
              </div>

              {/* Certificate Content */}
              <div className="relative z-10 flex flex-col justify-between h-full space-y-3">
                {/* 1. Top Header */}
                <div className="flex items-start justify-between gap-2 border-b-2 border-amber-300/80 pb-2">
                  {/* Left Top Reg Info */}
                  <div className="text-left font-sans text-[10pt] text-black leading-tight pt-1">
                    <div className="font-bold">{certMatter.regNoLabel}: <span className="font-normal">{FOUNDATION_INFO.regNo}</span></div>
                    <div className="font-bold text-[9.5pt]">{certMatter.nitiLabel}: <span className="font-normal">{FOUNDATION_INFO.nitiAayogUid}</span></div>
                  </div>

                  {/* Center Top Logo */}
                  <div className="text-center shrink-0 -mt-1">
                    <BrandLogo size={75} className="mx-auto drop-shadow-xs" id="vol-cert-top-logo" />
                  </div>

                  {/* Right Top Cert No & Date of Issue */}
                  <div className="text-right font-sans text-[10pt] text-[#8B0000] font-bold leading-tight pt-1">
                    <div>{certMatter.certNoLabel}: <span className="font-mono">{certNumber}</span></div>
                    <div>{certMatter.issueDateLabel}: <span>{issueDate}</span></div>
                  </div>
                </div>

                {/* 2. Main Title & Sub-line & Address */}
                <div className="text-center space-y-0.5">
                  <h1
                    className="text-2xl sm:text-3xl font-black uppercase tracking-wider font-serif"
                    style={{ color: '#8B0000' }}
                  >
                    {certLanguage === 'hi' ? FOUNDATION_INFO.nameHindi : certLanguage === 'en' ? FOUNDATION_INFO.nameEnglish : `${FOUNDATION_INFO.nameHindi} / ${FOUNDATION_INFO.nameEnglish}`}
                  </h1>
                  <div
                    className="text-xs font-black tracking-widest uppercase font-serif"
                    style={{ color: '#008000' }}
                  >
                    {certMatter.motto}
                  </div>
                  <p className="text-[9pt] text-black max-w-2xl mx-auto leading-tight font-medium">
                    {certLanguage === 'hi' ? (FOUNDATION_INFO.fullAddressHindi || FOUNDATION_INFO.address) : (FOUNDATION_INFO.fullAddressEnglish || FOUNDATION_INFO.address)}
                  </p>
                </div>

                {/* 3. Heading & Subheading with Royal Flourish */}
                <div className="text-center my-1">
                  <RoyalCenterFlourish color="#D4AF37" width={260} />
                  <h2
                    className="text-xl sm:text-2xl font-black font-serif tracking-wide uppercase"
                    style={{ color: '#8B0000' }}
                  >
                    {certMatter.mainTitle}
                  </h2>
                  <div
                    className="text-[10.5pt] font-black tracking-normal uppercase mt-0.5"
                    style={{ color: '#008000' }}
                  >
                    {certMatter.subTitle}
                  </div>
                  <RoyalCenterFlourish color="#D4AF37" width={180} />
                </div>

                {/* 4. Body Section: Left Photo + Center Text */}
                <div className="flex items-center gap-5 px-3 py-1">
                  {/* Left: Square Verified Photo */}
                  <div className="shrink-0 flex flex-col items-center justify-center">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      title={customPhotoUrl ? 'फोटो बदलने के लिए क्लिक करें' : 'फोटो अपलोड करने के लिए क्लिक करें (Mandatory)'}
                      className={`relative w-26 h-30 border-2 rounded-lg flex flex-col items-center justify-center text-center p-1 shadow-xs bg-white cursor-pointer group transition-all overflow-hidden ${
                        customPhotoUrl
                          ? 'border-[#008000] hover:ring-2 hover:ring-emerald-500'
                          : 'border-dashed border-red-400 bg-red-50/40 hover:bg-red-50 hover:border-red-600'
                      }`}
                    >
                      {customPhotoUrl ? (
                        <>
                          <img
                            src={customPhotoUrl}
                            alt={volunteerName}
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover rounded"
                          />
                          {/* Green verified check badge */}
                          <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-md">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity rounded no-print">
                            <Camera className="w-4 h-4 mb-0.5 text-white" />
                            <span className="text-[7.5pt] font-black leading-tight">बदलें (Change)</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                            <Camera className="w-5 h-5 text-red-600" />
                          </div>
                          <span className="text-[8pt] font-black text-red-700 uppercase leading-tight">
                            फोटो अपलोड *
                          </span>
                          <span className="text-[7pt] font-bold text-gray-600 uppercase mt-0.5">
                            CLICK HERE
                          </span>
                        </>
                      )}
                    </div>
                    {/* Caption underneath photo */}
                    <div className="mt-1 text-center">
                      <span className={`text-[7.5pt] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        customPhotoUrl ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700 animate-pulse'
                      }`}>
                        {customPhotoUrl ? (certLanguage === 'hi' ? '✓ सत्यापित फोटो' : '✓ VERIFIED PHOTO') : (certLanguage === 'hi' ? '⚠️ फोटो अनिवार्य' : '⚠️ PHOTO REQUIRED')}
                      </span>
                    </div>
                  </div>

                  {/* Center Text Description */}
                  <div className="flex-1 text-center space-y-1.5">
                    <p className="text-[10pt] font-sans text-black italic">
                      {certMatter.certifyIntro}
                    </p>

                    {/* Volunteer Name in Golden Yellow (#DAA520) Script/Serif Font */}
                    <div>
                      <span
                        className="text-2xl sm:text-3xl font-extrabold tracking-wide font-serif inline-block"
                        style={{ color: '#DAA520' }}
                      >
                        {volunteerName}
                      </span>
                    </div>

                    <p className="text-[9.5pt] text-black font-normal leading-tight">
                      {certMatter.relationLabel} <strong className="text-black font-bold">{fatherTitle}</strong>
                    </p>

                    {/* Volunteer Residential & Field Sector Address Display */}
                    <div className="text-[9pt] sm:text-[9.5pt] text-black font-medium leading-tight px-2 py-0.5 bg-amber-50/80 rounded-md border border-amber-200/70 inline-block max-w-[95%] mx-auto">
                      <span className="text-[#8B0000] font-black">
                        {certLanguage === 'hi' ? 'निवास स्थान एवं कार्यक्षेत्र पता:' : certLanguage === 'en' ? 'Residence & Sector Address:' : 'निवास व कार्यक्षेत्र पता / Address:'}
                      </span>{' '}
                      <strong className="text-black">
                        {volAddress.wardOrVillage ? (certLanguage === 'hi' ? `ग्राम/वार्ड: ${volAddress.wardOrVillage}, ` : `Ward/Village: ${volAddress.wardOrVillage}, `) : ''}
                        {volAddress.block ? (certLanguage === 'hi' ? `ब्लॉक: ${volAddress.block}, ` : `Block: ${volAddress.block}, `) : ''}
                        {volAddress.district ? (certLanguage === 'hi' ? `जिला: ${volAddress.district}, ` : `Dist: ${volAddress.district}, `) : ''}
                        {volAddress.state ? `${volAddress.state} ` : ''}
                        ({volAddress.country || (certLanguage === 'hi' ? 'भारत' : 'India')})
                      </strong>
                    </div>

                    <p className="text-[10pt] text-black leading-snug">
                      {certMatter.servedAsLabel} <strong className="font-black" style={{ color: '#DC2626' }}>"{certMatter.volunteerBadge}"</strong> {certLanguage === 'hi' ? 'जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर में' : 'at'} <strong className="font-black" style={{ color: '#DC2626' }}>{certMatter.orgNameInBody}</strong>
                      <br />
                      <span className="font-bold text-[#8B0000]">{certLanguage === 'hi' ? 'संबंधित सेवा क्षेत्र (Assigned Sector):' : certLanguage === 'en' ? 'Assigned Sector:' : 'संबंधित सेवा क्षेत्र / Assigned Sector:'}</span>{' '}
                      <strong className="font-black" style={{ color: '#008000' }}>{certLanguage === 'hi' ? areaHindi : certLanguage === 'en' ? areaContribution : `${areaContribution} (${areaHindi})`}</strong>
                    </p>

                    {/* Duration Badge: Yellow Rounded Rectangle */}
                    <div className="flex items-center justify-center pt-0.5">
                      <div
                        className="px-5 py-1 rounded-full text-black text-[9.5pt] font-bold shadow-2xs inline-block"
                        style={{
                          backgroundColor: '#FFF59D',
                          border: '1.5px solid #FDD835'
                        }}
                      >
                        {certMatter.durationLabel}: {durationText}
                      </div>
                    </div>

                    {/* Motto */}
                    <p className="text-[9pt] text-black italic leading-tight pt-0.5">
                      {certMatter.mottoEmbodiment}
                    </p>
                  </div>
                </div>

                {/* 5. Single-Line Balanced Footer - 3 Pillars (Live Verify QR | Royal Official Seal | Authorised Signatory) */}
                <div className="border-t-2 border-amber-900/30 pt-[clamp(6px,1.2cqw,12px)] mt-2.5 grid grid-cols-3 items-center gap-[clamp(6px,1.5cqw,14px)] select-none">
                  {/* COLUMN 1 (LEFT): Official Live Verification QR Code & Credentials */}
                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-[#FFFDF8] border border-amber-300/80 rounded-lg sm:rounded-xl shadow-2xs text-left w-full max-w-[clamp(175px,30cqw,250px)]">
                    <div className="shrink-0 p-0.5 sm:p-1 bg-white border border-amber-400 rounded-md sm:rounded-lg shadow-2xs">
                      <CertificateVerificationQR
                        certificateId={certNumber}
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
                        <strong className="text-black font-black">{certMatter.certNoLabel}:</strong>{' '}
                        <span className="font-mono font-bold text-[#8B0000] text-[clamp(7pt,0.9cqw,8pt)] block truncate">{certNumber}</span>
                      </div>
                      <div className="truncate">
                        <strong className="text-black font-black">{certMatter.issueDateLabel}:</strong>{' '}
                        <span className="font-medium text-black">{issueDate}</span>
                      </div>
                      <div className="text-[clamp(5.5pt,0.75cqw,6.5pt)] text-emerald-800 font-bold truncate">
                        ✓ {certLanguage === 'hi' ? 'स्कैन कर सत्यापित करें' : 'Scan to Verify'}
                      </div>
                    </div>
                  </div>

                  {/* COLUMN 2 (CENTER): Royal Official Embossed Seal of the Foundation */}
                  <div className="flex flex-col items-center justify-center text-center px-0.5 sm:px-1 w-full">
                    <RoyalCertificateSeal
                      size="auto"
                      variant="gold-crimson"
                      showRibbons={true}
                    />
                    <div className="text-[clamp(6pt,0.8cqw,7.5pt)] font-extrabold uppercase tracking-widest text-[#8B0000] mt-0.5 sm:mt-1 text-center truncate max-w-full">
                      {certLanguage === 'hi' ? 'आधिकारिक राजकीय मुहर' : 'OFFICIAL SEAL OF FOUNDATION'}
                    </div>
                  </div>

                  {/* COLUMN 3 (RIGHT): Authorised Signatory with Authentic Digital Signature */}
                  <div className="flex flex-col items-end justify-center text-right w-full">
                    <div className="w-full max-w-[clamp(175px,30cqw,250px)] border-2 border-dashed border-blue-900/40 bg-[#FFFDE7]/90 p-1 sm:p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-center shadow-2xs relative">
                      <div className="text-[clamp(6.5pt,0.8cqw,7.5pt)] font-black text-blue-950 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1 truncate">
                        <ShieldCheck className="w-3 h-3 text-blue-900 shrink-0" />
                        <span className="truncate">{certMatter.signatoryTitle}</span>
                      </div>

                      {/* Genuine Royal Blue Signature */}
                      <div className="my-0.5 py-0.5 flex items-center justify-center">
                        <ShaileshPradhanSignature size="auto" />
                      </div>

                      <div className="border-t border-[#1E40AF]/30 pt-0.5 leading-tight">
                        <div className="text-[clamp(7.5pt,1cqw,9.5pt)] font-bold text-[#1E40AF] truncate">
                          {certMatter.signatoryName}
                        </div>
                        <div className="text-[clamp(6.5pt,0.8cqw,7.5pt)] text-gray-700 font-semibold truncate">
                          {certMatter.signatoryDesignation}
                        </div>
                        <div className="text-[clamp(6pt,0.75cqw,7pt)] text-gray-600 font-bold uppercase tracking-wider truncate">
                          {certMatter.signatoryOrg}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* OTP Verification Modal for Secure Certificate Download */}
        <OtpVerificationModal
          isOpen={isOtpModalOpen}
          onClose={() => setIsOtpModalOpen(false)}
          phoneNumber={volunteerPhone}
          onSuccess={handleOtpVerified}
          title="स्वयंसेवक प्रमाण पत्र डाउनलोड - OTP सत्यापन"
          subtitle="सुरक्षा सत्यापन: प्रमाण पत्र PDF / JPG डाउनलोड करने हेतु मोबाइल नंबर OTP सत्यापित करें।"
        />

        {/* Send Certificate via WhatsApp & Email Modal */}
        {shareModalOpen && (
          <SendCertificateModal
            isOpen={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
            defaultTab={shareModalTab}
            data={{
              certificateType: 'volunteer_cert',
              titleHindi: 'आधिकारिक स्वयंसेवक प्रशस्ति पत्र',
              titleEnglish: 'Certificate of Appreciation & Dedicated Volunteer Award',
              recipientName: volunteerName,
              fatherName: fatherTitle,
              certificateNo: certNumber,
              issueDate: issueDate,
              recipientPhone: volunteerPhone,
              purpose: `${areaHindi} (${areaContribution})`,
              qrVerifyUrl: typeof window !== 'undefined' ? `${window.location.origin}/?verify=${encodeURIComponent(certNumber)}` : undefined
            }}
          />
        )}
      </div>
    </div>
  );
};

export default VolunteerCertificateModal;

