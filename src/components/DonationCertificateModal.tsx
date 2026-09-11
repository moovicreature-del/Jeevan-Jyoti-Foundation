import React, { useRef, useState, useEffect } from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Heart, Award, Sparkles, Camera, AlertCircle, Trash2, UploadCloud, Check, FileText, Languages } from 'lucide-react';
import { DonationRecord } from '../types';
import { FOUNDATION_INFO } from '../data/foundationData';
import { DigitalSignature, NgoRoundSeal, ShaileshPradhanSignature } from './DigitalSignature';
import { RoyalCertificateSeal } from './common/RoyalCertificateSeal';
import { VerifiedByJyotiAiSeal } from './VerifiedByJyotiAiSeal';
import { CertificateVerificationQR } from './CertificateVerificationQR';
import { BrandLogo } from './common/BrandLogo';
import { getDonorTier } from '../utils/donorTiers';
import { StructuredAddressSelector } from './StructuredAddressSelector';
import { DEFAULT_STRUCTURED_ADDRESS, StructuredAddress } from '../data/locationData';
import { exportElementAsPng, exportElementAsJpg, exportElementAsPdf, directPrintElement } from '../utils/exportImage';
import { OtpVerificationModal } from './OtpVerificationModal';
import { CandidatePhotoUploader } from './CandidatePhotoUploader';
import { SendCertificateModal } from './SendCertificateModal';
import { RoyalFourCorners, RoyalCenterFlourish } from './common/RoyalCertificateBorder';
import { Share2, Mail } from 'lucide-react';
import { formatCertificateNumber } from '../utils/certificateUtils';
import { saveCertificateToRegistry } from '../services/certificateRegistryService';
import { CertificateLanguage, getDonationCertMatter } from '../utils/certificateLanguageUtils';
import { CertificateLanguageToggle } from './common/CertificateLanguageToggle';
import { OfficialVerifiedBadge } from './common/OfficialVerifiedBadge';

interface Props {
  donation: DonationRecord;
  onClose: () => void;
}

export const DonationCertificateModal: React.FC<Props> = ({ donation, onClose }) => {
  const certRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [donorPhotoUrl, setDonorPhotoUrl] = useState<string>(donation.photoUrl || '');
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [showAddressEdit, setShowAddressEdit] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<'jpg' | 'png' | 'pdf' | 'print' | null>(null);
  const [donorPhone, setDonorPhone] = useState(donation.phone || '+91-8052361666');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareModalTab, setShareModalTab] = useState<'whatsapp' | 'email'>('whatsapp');
  const [certLanguage, setCertLanguage] = useState<CertificateLanguage>('bilingual');

  const [donorAddress, setDonorAddress] = useState<StructuredAddress>({
    country: donation.country || DEFAULT_STRUCTURED_ADDRESS.country,
    state: donation.state || DEFAULT_STRUCTURED_ADDRESS.state,
    district: donation.district || DEFAULT_STRUCTURED_ADDRESS.district,
    block: donation.block || DEFAULT_STRUCTURED_ADDRESS.block,
    wardOrVillage: donation.wardOrVillage || donation.city || 'गाज़ीपुर (Ghazipur)'
  });

  const certNumber = formatCertificateNumber('80G', donation.date || new Date(), donation.id);
  const tier = getDonorTier(donation.amount);
  const certMatter = getDonationCertMatter(certLanguage);

  // Auto-save issued 80G donation certificate to database & local registry
  useEffect(() => {
    const cleanPhone = (donorPhone || donation.phone || '8052361666').replace(/[^0-9]/g, '').slice(-10);
    saveCertificateToRegistry({
      id: certNumber,
      type: 'donation_80g',
      titleHindi: '80G आयकर दान रसीद व सम्मान पत्र',
      titleEnglish: '80G Tax Exemption Receipt & Citation',
      recipientName: donation.donorName,
      fatherOrHusbandName: donation.fatherName || 'दानदाता एवं शुभचिंतक',
      phone: cleanPhone,
      issueDate: donation.date || new Date().toISOString().split('T')[0],
      amount: donation.amount,
      categoryOrPurpose: donation.purposeHindi || donation.purpose || 'मानव सेवा व शिक्षा योगदान',
      photoUrl: donorPhotoUrl || donation.photoUrl,
      details: `दान राशि: ₹${donation.amount.toLocaleString('en-IN')} (${tier.nameHindi}) • 80G URN अधिकृत`,
      status: 'certified',
      rawDonation: {
        ...donation,
        id: certNumber,
        photoUrl: donorPhotoUrl || donation.photoUrl,
        country: donorAddress.country,
        state: donorAddress.state,
        district: donorAddress.district,
        block: donorAddress.block,
        wardOrVillage: donorAddress.wardOrVillage,
        phone: donorPhone
      }
    });
  }, [certNumber, donation, donorPhotoUrl, donorAddress, donorPhone, tier.nameHindi]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setDonorPhotoUrl(uploadEvent.target.result as string);
          setPhotoError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateRequirements = (): boolean => {
    if (!donorPhotoUrl) {
      setPhotoError('⚠️ दानदाता सम्मान पत्र एवं 80G रसीद हेतु दानदाता की फोटो / संस्था लोगो अपलोड करना अनिवार्य है।');
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 150);
      return false;
    }
    if (!donorAddress.country || !donorAddress.state || !donorAddress.district || !donorAddress.block || !donorAddress.wardOrVillage?.trim()) {
      setPhotoError('⚠️ 80G प्रमाण पत्र हेतु देश, राज्य, जिला, ब्लॉक व वार्ड/ग्राम का चयन/दर्ज करना अनिवार्य है।');
      setShowAddressEdit(true);
      return false;
    }
    setPhotoError(null);
    return true;
  };

  const handlePrint = () => {
    if (!validateRequirements()) return;
    setPendingFormat('print');
    setIsOtpOpen(true);
  };

  // 1. Trigger OTP check before downloading
  const handleInitiateDownload = (format: 'jpg' | 'png' | 'pdf') => {
    if (!validateRequirements()) return;
    setPendingFormat(format);
    setIsOtpOpen(true);
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
      directPrintElement(certRef.current);
    }
    setPendingFormat(null);
  };

  const executeDownloadJpg = async () => {
    if (!certRef.current || downloading) return;
    setDownloading('jpg');
    try {
      const fileName = `80G_${tier.key.toUpperCase()}_Receipt_${donation.donorName.replace(/\s+/g, '_')}`;
      await exportElementAsJpg(certRef.current, fileName, { quality: 0.98 });
    } finally {
      setDownloading(null);
    }
  };

  const executeDownloadPng = async () => {
    if (!certRef.current || downloading) return;
    setDownloading('png');
    try {
      const fileName = `80G_${tier.key.toUpperCase()}_Receipt_${donation.donorName.replace(/\s+/g, '_')}`;
      await exportElementAsPng(certRef.current, fileName, { backgroundColor: '#FFFFFF' });
    } finally {
      setDownloading(null);
    }
  };

  const executeDownloadPdf = async () => {
    if (!certRef.current || downloading) return;
    setDownloading('pdf');
    try {
      const fileName = `80G_${tier.key.toUpperCase()}_Receipt_${donation.donorName.replace(/\s+/g, '_')}_A4`;
      await exportElementAsPdf(certRef.current, fileName, { orientation: 'landscape' });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 overflow-y-auto backdrop-blur-xs overscroll-contain">
      <div className="min-h-full flex items-center justify-center p-2 sm:p-4 md:p-6">
        <div className="bg-white rounded-2xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl relative my-auto border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 no-print gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{tier.symbol}</span>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                80G दान रसीद एवं {tier.name} सम्मान पत्र
              </h3>
              <p className="text-xs text-gray-500 font-medium">
                Official 80G Tax Exemption Receipt & {tier.name} Certificate
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
              onClick={() => setShowAddressEdit(!showAddressEdit)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer border ${
                showAddressEdit
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <span>{showAddressEdit ? 'संपादन बंद करें' : 'पता संपादित करें (Edit Address)'}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer border ${
                donorPhotoUrl
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{donorPhotoUrl ? 'फोटो बदलें' : 'फोटो अपलोड करें *'}</span>
            </button>

            {/* Send on WhatsApp Button */}
            <button
              onClick={() => {
                if (!validateRequirements()) return;
                setShareModalTab('whatsapp');
                setShareModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-xs"
              title="Send 80G Receipt to WhatsApp Number"
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
              title="Send 80G Receipt to Email Address"
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

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>प्रिंट (Print)</span>
            </button>
            <button
              onClick={() => handleInitiateDownload('jpg')}
              disabled={downloading !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloading === 'jpg' ? 'JPG तैयार...' : 'JPG (300 DPI)'}</span>
            </button>
            <button
              onClick={() => handleInitiateDownload('pdf')}
              disabled={downloading !== null}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8B0000] hover:bg-[#700000] text-white rounded-lg text-sm font-semibold transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              <span>{downloading === 'pdf' ? 'PDF तैयार...' : 'PDF (80G रसीद)'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Photo Uploader Section (Camera + Gallery) */}
        <div className="pt-3 no-print">
          <CandidatePhotoUploader
            photoUrl={donorPhotoUrl}
            onPhotoChange={(url) => {
              setDonorPhotoUrl(url);
              setPhotoError(null);
            }}
            onPhotoRemove={() => setDonorPhotoUrl('')}
            required={true}
            label="दानदाता / भामाशाह का फोटो (Donor Photo - कैमरा या गैलरी)"
            subLabel="80G रसीद एवं सम्मान पत्र पर फोटो मुद्रित करने हेतु (गैलरी से चुनें या लाइव कैमरा से खींचें)"
          />
        </div>

        {/* Collapsible Address Edit Drawer */}
        {showAddressEdit && (
          <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-4 my-2 no-print">
            <StructuredAddressSelector
              value={donorAddress}
              onChange={setDonorAddress}
              required={true}
              labelPrefix="दानदाता आधिकारिक पता"
            />
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />

        <div className="overflow-x-auto py-4 flex justify-center">
          <div
            ref={certRef}
            className="printable-certificate bg-[#FFFDF8] text-black p-[10px] rounded-2xl shadow-2xl relative min-w-[720px] max-w-[860px] mx-auto select-none"
            style={{
              border: '9px solid #8B0000',
              boxShadow: '0 0 0 3px #D4AF37, 0 0 0 6px #700000, 0 12px 35px rgba(139, 0, 0, 0.25)',
              backgroundColor: '#FFFDF8'
            }}
          >
            {/* Inner Border with Gold Filigree */}
            <div
              className="relative p-6 bg-[#FFFEFC] rounded-xl overflow-hidden"
              style={{
                border: '2.5px double #D4AF37',
                outline: '1px dashed rgba(212, 175, 55, 0.5)',
                outlineOffset: '-5px'
              }}
            >
              {/* Royal Vector Gold Corner Ornaments */}
              <RoyalFourCorners color="#D4AF37" size={56} />

              {/* Watermark using BrandLogo */}
              <div
                id="don-cert-watermark"
                className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0"
              >
                <BrandLogo size={420} watermark opacity={0.07} />
              </div>

              {/* Header Section */}
              <div className="flex items-start justify-between gap-4 border-b-2 border-amber-300/80 pb-3 relative z-10">
                <div className="text-left font-sans text-[11px] text-black font-extrabold space-y-0.5 pt-1">
                  <div><strong className="text-[#8B0000] font-black">{certMatter.regNoLabel}:</strong> {FOUNDATION_INFO.regNo}</div>
                  <div><strong className="text-[#8B0000] font-black">{certMatter.urn80GLabel}:</strong> {FOUNDATION_INFO.urn80G}</div>
                  <div><strong className="text-[#8B0000] font-black">{certMatter.urn12ALabel}:</strong> {FOUNDATION_INFO.urn10A}</div>
                </div>

                {/* Top Center Title & Logo */}
                <div className="text-center flex-1">
                  <BrandLogo size={75} className="mx-auto mb-1 drop-shadow-xs" id="don-cert-top-logo" />
                  <h1 className="text-2xl font-black text-[#8B0000] tracking-wide uppercase font-['Cinzel',serif]">
                    {certLanguage === 'hi' ? FOUNDATION_INFO.nameHindi : certLanguage === 'en' ? FOUNDATION_INFO.nameEnglish : FOUNDATION_INFO.nameEnglish}
                  </h1>
                  {certLanguage !== 'en' && (
                    <h2 className="text-base font-extrabold text-amber-900">
                      {FOUNDATION_INFO.nameHindi}
                    </h2>
                  )}
                  <p className="text-[10px] font-sans text-black max-w-xl mx-auto leading-tight mt-0.5 font-extrabold">
                    {certLanguage === 'hi' ? (FOUNDATION_INFO.fullAddressHindi || FOUNDATION_INFO.address) : (FOUNDATION_INFO.fullAddressEnglish || FOUNDATION_INFO.address)}
                  </p>
                </div>

                <div className="text-right font-sans text-[11px] text-black font-extrabold space-y-0.5 pt-1">
                  <div><strong className="text-[#8B0000] font-black">{certMatter.receiptNoLabel}:</strong> <span className="font-mono font-black">{certNumber}</span></div>
                  <div><strong className="text-[#8B0000] font-black">{certMatter.dateLabel}:</strong> <span className="font-mono font-black">{donation.date}</span></div>
                  <div><strong className="text-[#8B0000] font-black">{certMatter.panLabel}:</strong> <span className="font-mono font-black">{FOUNDATION_INFO.pan}</span></div>
                </div>
              </div>

              {/* Donor Category Emblem Ribbon with Symbol */}
              <div className="flex items-center justify-center my-3">
                <div
                  className={`inline-flex items-center gap-2 px-6 py-1.5 rounded-full text-xs font-black tracking-wider uppercase shadow-xs ${tier.certificateEmblemClass}`}
                >
                  <span className="text-lg">{tier.symbol}</span>
                  <span>{certLanguage === 'hi' ? `${tier.nameHindi} दानदाता सम्मान` : certLanguage === 'en' ? `${tier.name} CERTIFICATION` : `${tier.name} CERTIFICATION | ${tier.nameHindi}`}</span>
                  <span className="text-[10px] font-mono opacity-90">({tier.thresholdLabel})</span>
                </div>
              </div>

              {/* Receipt Banner with Royal Flourish */}
              <div className="text-center my-2">
                <RoyalCenterFlourish color="#D4AF37" width={220} />
                <div className="inline-block border-y-2 border-[#8B0000] py-1 px-8">
                  <span className="text-xl font-black uppercase tracking-widest text-[#8B0000] font-['Cinzel',serif]">
                    {certMatter.mainTitle}
                  </span>
                  <div className="text-xs font-bold text-black mt-0.5">
                    {certMatter.subTitle}
                  </div>
                </div>
                <RoyalCenterFlourish color="#D4AF37" width={180} />
              </div>

            {/* Donor & Amount Details with Donor Photo */}
            <div className="my-3 space-y-3 px-4">
              <p className="text-center text-sm font-sans text-black font-black italic">
                {certMatter.acknowledgedIntro}
              </p>

              <div className="flex items-center justify-center gap-6">
                {/* Clickable Donor Photo Slot */}
                <div className="shrink-0 flex flex-col items-center">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    title={certLanguage === 'hi' ? 'दानदाता फोटो अपलोड/बदलने के लिए क्लिक करें' : 'Click to upload/change donor photo'}
                    className={`relative w-22 h-26 rounded-lg border-2 flex flex-col items-center justify-center text-center p-1 bg-white cursor-pointer group shadow-xs overflow-hidden ${
                      donorPhotoUrl
                        ? 'border-[#008000] hover:ring-2 hover:ring-emerald-500'
                        : 'border-dashed border-red-400 bg-red-50/40 hover:bg-red-50 hover:border-red-600'
                    }`}
                  >
                    {donorPhotoUrl ? (
                      <>
                        <img
                          src={donorPhotoUrl}
                          alt={donation.donorName}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover rounded"
                        />
                        <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <div className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity rounded no-print">
                          <Camera className="w-4 h-4 mb-0.5" />
                          <span className="text-[7pt] font-black">{certLanguage === 'hi' ? 'बदलें' : 'Change'}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                          <Camera className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="text-[7.5pt] font-black text-red-700 uppercase leading-tight">
                          {certLanguage === 'hi' ? 'फोटो अपलोड *' : 'PHOTO UPLOAD *'}
                        </span>
                      </>
                    )}
                  </div>
                  <span className={`text-[7pt] font-black uppercase tracking-wider mt-1 px-1 rounded ${
                    donorPhotoUrl ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700 animate-pulse'
                  }`}>
                    {donorPhotoUrl ? (certLanguage === 'hi' ? '✓ दानदाता फोटो' : '✓ DONOR PHOTO') : (certLanguage === 'hi' ? '⚠️ फोटो अनिवार्य' : '⚠️ PHOTO REQUIRED')}
                  </span>
                </div>

                <div className="text-center flex-1">
                  <span className="text-2xl font-black text-black underline decoration-red-600 decoration-2 underline-offset-4 font-['Cinzel',serif]">
                    {donation.donorName}
                  </span>
                  {donation.fatherName && (
                    <div className="text-xs font-semibold text-gray-800 mt-0.5">
                      {certLanguage === 'hi' ? 'पिता / पति / अभिभावक:' : certLanguage === 'en' ? 'Father / Spouse:' : 'पिता / पति (Father / Spouse):'} <strong className="text-black">{donation.fatherName}</strong>
                    </div>
                  )}
                  {donation.panNumber && (
                    <div className="text-xs font-mono font-black text-black mt-0.5">
                      {certMatter.donorPanLabel}: {donation.panNumber}
                    </div>
                  )}
                  <div className="text-xs font-bold text-gray-800 mt-1 px-3 py-1 bg-amber-50/80 rounded-lg border border-amber-200/70 inline-block max-w-[95%]">
                    <span className="text-[#8B0000] font-black">{certMatter.addressLabel}:</span>{' '}
                    <span className="text-black font-extrabold">
                      {donorAddress.wardOrVillage ? (certLanguage === 'hi' ? `ग्राम/वार्ड: ${donorAddress.wardOrVillage}, ` : `Ward/Village: ${donorAddress.wardOrVillage}, `) : ''}
                      {donorAddress.block ? (certLanguage === 'hi' ? `ब्लॉक: ${donorAddress.block}, ` : `Block: ${donorAddress.block}, `) : ''}
                      {donorAddress.district ? (certLanguage === 'hi' ? `जिला: ${donorAddress.district}, ` : `Dist: ${donorAddress.district}, `) : ''}
                      {donorAddress.state ? `${donorAddress.state} ` : ''}
                      ({donorAddress.country || (certLanguage === 'hi' ? 'भारत' : 'India')})
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount Highlight Box with Tier Category */}
              <div className="flex items-center justify-center my-2">
                <div className="bg-[#FFFDE7] border-2 border-amber-400 px-8 py-2.5 rounded-xl text-center shadow-xs min-w-[320px]">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-black text-black uppercase tracking-wider">
                    <span>{tier.symbol}</span>
                    <span>{certMatter.amountLabel}</span>
                    <span>• {certLanguage === 'hi' ? tier.nameHindi : tier.name}</span>
                  </div>
                  <div className="text-3xl font-black text-[#8B0000] font-mono mt-0.5">
                    ₹ {donation.amount.toLocaleString('en-IN')} /-
                  </div>
                  <div className="text-[11px] font-extrabold text-black mt-0.5">
                    ({certMatter.modeLabel}: {donation.paymentMode} | {certMatter.refLabel}: {donation.transactionRef})
                  </div>
                </div>
              </div>

              <div className="text-center text-xs text-black font-bold max-w-2xl mx-auto space-y-1">
                <p>
                  <strong>{certMatter.purposeLabel}:</strong> {certLanguage === 'hi' ? (donation.purposeHindi || donation.purpose) : certLanguage === 'en' ? (donation.purpose || donation.purposeHindi) : `${donation.purpose} (${donation.purposeHindi})`}
                </p>
                <p className="text-[11px] text-gray-900">
                  {certMatter.taxExemptionNote}
                </p>
              </div>
            </div>

            {/* Single-Line Balanced Footer - 3 Pillars (Live Verify QR | Royal Official Seal | Authorised Signatory) */}
            <div className="border-t-2 border-amber-900/40 pt-[clamp(6px,1.2cqw,12px)] mt-2.5 grid grid-cols-3 items-center gap-[clamp(6px,1.5cqw,14px)] select-none">
              {/* COLUMN 1 (LEFT): Official Live Verification QR Code & 80G Credentials */}
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
                    {certLanguage === 'hi' ? '80G सत्यापन क्यूआर' : '80G VERIFY QR'}
                  </div>
                  <div className="truncate">
                    <strong className="text-black font-black">{certMatter.receiptNoLabel}:</strong>{' '}
                    <span className="font-mono font-bold text-[#8B0000] text-[clamp(7pt,0.9cqw,8pt)] block truncate">{certNumber}</span>
                  </div>
                  <div className="truncate">
                    <strong className="text-black font-black">{certMatter.donorPanLabel}:</strong>{' '}
                    <span className="font-mono text-black font-medium">{donation.panNumber || 'N/A'}</span>
                  </div>
                  <div className="text-[clamp(5.5pt,0.75cqw,6.5pt)] text-emerald-800 font-bold truncate">
                    ✓ {certLanguage === 'hi' ? '80G कर छूट वैध' : '80G Tax Exempt'}
                  </div>
                </div>
              </div>

              {/* COLUMN 2 (CENTER): Royal Official Embossed NGO Seal */}
              <div className="flex flex-col items-center justify-center text-center px-0.5 sm:px-1 w-full">
                <RoyalCertificateSeal
                  size="sm"
                  variant="gold-crimson"
                  showRibbons={true}
                  className="max-w-[72px] sm:max-w-[76px]"
                />
                <div className="text-[clamp(6pt,0.8cqw,7.5pt)] font-extrabold uppercase tracking-widest text-[#8B0000] mt-0.5 sm:mt-1 text-center truncate max-w-full">
                  {certLanguage === 'hi' ? 'राजकीय मुहर / 80G प्रमाणित' : 'OFFICIAL SEAL • 80G APPROVED'}
                </div>
              </div>

              {/* COLUMN 3 (RIGHT): Authorised Signatory with Authentic Digital Signature */}
              <div className="flex flex-col items-end justify-center text-right w-full">
                <div className="w-full max-w-[clamp(175px,30cqw,250px)] border-2 border-dashed border-blue-900/40 bg-[#FFFDE7]/90 p-1 sm:p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-center shadow-2xs relative">
                  <div className="text-[clamp(6.5pt,0.8cqw,7.5pt)] font-black text-blue-950 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1 truncate">
                    <ShieldCheck className="w-3 h-3 text-blue-900 shrink-0" />
                    <span className="truncate">{certMatter.signatoryLabel}</span>
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
                      {certMatter.signatoryDesig}
                    </div>
                    <div className="text-[clamp(6pt,0.75cqw,7pt)] text-gray-600 font-bold uppercase tracking-wider truncate">
                      {FOUNDATION_INFO.nameEnglish}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* OTP Verification Modal for Secure 80G Certificate Download */}
        <OtpVerificationModal
          isOpen={isOtpOpen}
          onClose={() => setIsOtpOpen(false)}
          phoneNumber={donorPhone}
          onSuccess={handleOtpVerified}
          title="80G दान रसीद डाउनलोड - OTP सत्यापन"
          subtitle="सुरक्षा सत्यापन: आयकर 80G रसीद डाउनलोड करने हेतु पंजीकृत मोबाइल नंबर पर OTP सत्यापित करें।"
        />

        {/* Send Certificate via WhatsApp & Email Modal */}
        {shareModalOpen && (
          <SendCertificateModal
            isOpen={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
            defaultTab={shareModalTab}
            data={{
              certificateType: 'donation_80g',
              titleHindi: 'धारा 80G आयकर दान प्रशस्ति पत्र व रसीद',
              titleEnglish: '80G Tax Exemption Certificate of Appreciation',
              recipientName: donation.donorName,
              fatherName: donation.fatherName,
              certificateNo: certNumber,
              issueDate: donation.date,
              recipientPhone: donorPhone,
              recipientEmail: donation.email,
              amount: donation.amount,
              purpose: donation.purposeHindi || donation.purpose || 'General Welfare',
              qrVerifyUrl: typeof window !== 'undefined' ? `${window.location.origin}/?verify=${encodeURIComponent(certNumber)}` : undefined
            }}
          />
        )}
        </div>
      </div>
    </div>
  );
};

export default DonationCertificateModal;
