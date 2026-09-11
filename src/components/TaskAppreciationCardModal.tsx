import React, { useRef, useState, useEffect } from 'react';
import { X, Printer, Download, Sparkles, CheckCircle2, ShieldCheck, Camera, AlertCircle, Trash2, UploadCloud, Check, FileText, Share2, Mail, Languages } from 'lucide-react';
import { TaskRecord } from '../types';
import { FOUNDATION_INFO } from '../data/foundationData';
import { DigitalSignature, NgoRoundSeal, ShaileshPradhanSignature } from './DigitalSignature';
import { RoyalCertificateSeal } from './common/RoyalCertificateSeal';
import { VerifiedByJyotiAiSeal } from './VerifiedByJyotiAiSeal';
import { CertificateVerificationQR } from './CertificateVerificationQR';
import { BrandLogo } from './common/BrandLogo';
import { StructuredAddressSelector } from './StructuredAddressSelector';
import { DEFAULT_STRUCTURED_ADDRESS, StructuredAddress } from '../data/locationData';
import { exportElementAsPng, exportElementAsJpg, exportElementAsPdf, directPrintElement } from '../utils/exportImage';
import { OtpVerificationModal } from './OtpVerificationModal';
import { CandidatePhotoUploader } from './CandidatePhotoUploader';
import { SendCertificateModal } from './SendCertificateModal';
import { RoyalFourCorners, RoyalCenterFlourish } from './common/RoyalCertificateBorder';
import { formatCertificateNumber } from '../utils/certificateUtils';
import { saveCertificateToRegistry } from '../services/certificateRegistryService';
import { CertificateLanguage, getTaskAppreciationMatter } from '../utils/certificateLanguageUtils';
import { CertificateLanguageToggle } from './common/CertificateLanguageToggle';
import { OfficialVerifiedBadge } from './common/OfficialVerifiedBadge';

interface Props {
  task: TaskRecord;
  volunteerName?: string;
  onClose: () => void;
}

export const TaskAppreciationCardModal: React.FC<Props> = ({ task, volunteerName = 'कर्मठ स्वयंसेवक', onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>(task.photoUrl || '');
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [showAddressEdit, setShowAddressEdit] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<'jpg' | 'png' | 'pdf' | 'print' | null>(null);
  const [volunteerPhone, setVolunteerPhone] = useState('+91-8052361666');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareModalTab, setShareModalTab] = useState<'whatsapp' | 'email'>('whatsapp');
  const [certLanguage, setCertLanguage] = useState<CertificateLanguage>('bilingual');

  const [address, setAddress] = useState<StructuredAddress>({
    country: DEFAULT_STRUCTURED_ADDRESS.country,
    state: DEFAULT_STRUCTURED_ADDRESS.state,
    district: DEFAULT_STRUCTURED_ADDRESS.district,
    block: DEFAULT_STRUCTURED_ADDRESS.block,
    wardOrVillage: 'मीरानपुर (Miranpur)'
  });

  const certId = formatCertificateNumber('APP', task.date || new Date(), task.id);
  const certMatter = getTaskAppreciationMatter(certLanguage);

  // Auto-save task appreciation certificate to database & registry
  useEffect(() => {
    const cleanPhone = (volunteerPhone || '8052361666').replace(/[^0-9]/g, '').slice(-10);
    saveCertificateToRegistry({
      id: certId,
      type: 'task_appreciation',
      titleHindi: 'विशेष सेवा कार्य प्रशंसा पत्र',
      titleEnglish: 'Social Service Appreciation Certificate',
      recipientName: volunteerName,
      fatherOrHusbandName: 'श्री समाज सेवी',
      phone: cleanPhone,
      issueDate: task.date || new Date().toISOString().split('T')[0],
      categoryOrPurpose: `${task.titleHindi} (${task.title})`,
      photoUrl: photoUrl || task.photoUrl,
      details: `स्थान: ${task.location} • सेवा अंक: ${task.points}`,
      status: 'verified',
      rawTask: {
        ...task,
        photoUrl: photoUrl || task.photoUrl
      }
    });
  }, [certId, task, volunteerName, photoUrl, address, volunteerPhone]);

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

  const validateRequirements = (): boolean => {
    if (!photoUrl) {
      setPhotoError('⚠️ सेवा कार्य प्रशंसा पत्र डाउनलोड/प्रिंट करने हेतु स्वयंसेवक की फोटो अपलोड करना अनिवार्य है।');
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 150);
      return false;
    }
    if (!address.country || !address.state || !address.district || !address.block || !address.wardOrVillage?.trim()) {
      setPhotoError('⚠️ प्रशंसा पत्र हेतु देश, राज्य, जिला, ब्लॉक व वार्ड/ग्राम का चयन/दर्ज करना अनिवार्य है।');
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
      directPrintElement(cardRef.current);
    }
    setPendingFormat(null);
  };

  const executeDownloadJpg = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading('jpg');
    try {
      const fileName = `Task_Appreciation_${task.id}_${volunteerName.replace(/\s+/g, '_')}`;
      await exportElementAsJpg(cardRef.current, fileName, { quality: 0.98 });
    } finally {
      setDownloading(null);
    }
  };

  const executeDownloadPng = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading('png');
    try {
      const fileName = `Task_Appreciation_${task.id}_${volunteerName.replace(/\s+/g, '_')}`;
      await exportElementAsPng(cardRef.current, fileName, { backgroundColor: '#FFFFFF' });
    } finally {
      setDownloading(null);
    }
  };

  const executeDownloadPdf = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading('pdf');
    try {
      const fileName = `Task_Appreciation_${task.id}_${volunteerName.replace(/\s+/g, '_')}`;
      await exportElementAsPdf(cardRef.current, fileName, { orientation: 'landscape' });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 overflow-y-auto backdrop-blur-xs overscroll-contain">
      <div className="min-h-full flex items-center justify-center p-2 sm:p-4 md:p-6">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative my-auto border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 no-print gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <h3 className="font-bold text-gray-900 text-base sm:text-lg">
              सेवा कार्य प्रशंसा पत्र (Task Appreciation)
            </h3>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            {/* Language Switcher Toggle */}
            <CertificateLanguageToggle
              language={certLanguage}
              onLanguageChange={setCertLanguage}
            />

            <button
              onClick={() => setShowAddressEdit(!showAddressEdit)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                showAddressEdit
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <span>{showAddressEdit ? 'बंद करें' : 'पता बदलें'}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                photoUrl
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{photoUrl ? 'फोटो बदलें' : 'फोटो अपलोड *'}</span>
            </button>

            <button
              onClick={() => {
                if (!validateRequirements()) return;
                setShareModalTab('whatsapp');
                setShareModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
              title="Send Task Certificate to WhatsApp Number"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={() => {
                if (!validateRequirements()) return;
                setShareModalTab('email');
                setShareModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0024B8] hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
              title="Send Task Certificate to Email Address"
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
              title="Share Achievement on Social Media"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>सोशल शेयर</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold cursor-pointer"
              title="Print Certificate"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट</span>
            </button>
            <button
              onClick={() => handleInitiateDownload('jpg')}
              disabled={downloading !== null}
              title="Download Certificate JPG (300 DPI)"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading === 'jpg' ? 'JPG तैयार...' : 'JPG (300 DPI)'}</span>
            </button>
            <button
              onClick={() => handleInitiateDownload('pdf')}
              disabled={downloading !== null}
              title="Download Certificate PDF"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-[#8B0000] hover:bg-[#700000] text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{downloading === 'pdf' ? 'PDF तैयार...' : 'PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Photo Uploader Section (Camera + Gallery) */}
        <div className="pt-3 no-print">
          <CandidatePhotoUploader
            photoUrl={photoUrl}
            onPhotoChange={(url) => {
              setPhotoUrl(url);
              setPhotoError(null);
            }}
            onPhotoRemove={() => setPhotoUrl('')}
            required={true}
            label="स्वयंसेवक का पासपोर्ट फोटो (Volunteer Photo - कैमरा या गैलरी)"
            subLabel="प्रशंसा पत्र पर रंगीन फोटो मुद्रित करने हेतु (गैलरी से चुनें या लाइव कैमरा से खींचें)"
          />
        </div>

        {/* Collapsible Address Edit Drawer */}
        {showAddressEdit && (
          <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-3.5 my-2 no-print">
            <StructuredAddressSelector
              value={address}
              onChange={setAddress}
              required={true}
              compact={true}
              labelPrefix="संस्था का आधिकारिक पता"
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

        <div className="py-4 flex justify-center overflow-x-auto">
          <div
            ref={cardRef}
            className="printable-certificate bg-[#FFFDF8] text-black p-[8px] rounded-2xl shadow-2xl w-[570px] min-w-[570px] text-center relative select-none"
            style={{
              border: '8px solid #8B0000',
              boxShadow: '0 0 0 2.5px #D4AF37, 0 0 0 5px #700000, 0 10px 30px rgba(139, 0, 0, 0.25)',
              backgroundColor: '#FFFDF8'
            }}
          >
            {/* Inner Border with Royal Inlay */}
            <div
              className="relative p-5 bg-[#FFFEFC] rounded-xl overflow-hidden"
              style={{
                border: '2.5px double #D4AF37',
                outline: '1px dashed rgba(212, 175, 55, 0.5)',
                outlineOffset: '-5px'
              }}
            >
              {/* Royal Vector Corner Ornaments */}
              <RoyalFourCorners color="#D4AF37" size={48} />

              {/* Watermark in background using BrandLogo */}
              <div
                id="task-appr-watermark"
                className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0"
              >
                <BrandLogo size={360} watermark opacity={0.07} />
              </div>

              {/* Header */}
              <div className="border-b-2 border-amber-300/80 pb-2 flex flex-col items-center justify-center relative z-10">
                <BrandLogo size={65} className="mx-auto mb-1 drop-shadow-xs" id="task-appr-top-logo" />
                <div className="text-center">
                  <div className="text-lg font-black text-[#8B0000] uppercase font-['Cinzel'] tracking-wider">
                    {certLanguage === 'hi' ? FOUNDATION_INFO.nameHindi : certLanguage === 'en' ? FOUNDATION_INFO.nameEnglish : FOUNDATION_INFO.nameEnglish}
                  </div>
                  {certLanguage !== 'en' && (
                    <div className="text-xs font-bold text-amber-900">
                      {FOUNDATION_INFO.nameHindi}
                    </div>
                  )}
                  <div className="text-[9px] text-black font-extrabold mt-0.5">
                    Reg: {FOUNDATION_INFO.regNo} | NITI Aayog: {FOUNDATION_INFO.nitiAayogUid}
                  </div>
                </div>
              </div>

              {/* Title with Royal Flourish */}
              <div className="my-2">
                <RoyalCenterFlourish color="#D4AF37" width={200} />
                <span className="text-sm sm:text-base font-black text-[#8B0000] uppercase tracking-widest font-['Cinzel']">
                  {certMatter.mainTitle}
                </span>
                <div className="text-[10px] font-bold text-amber-950 mt-0.5">
                  {certMatter.subTitle}
                </div>
                <RoyalCenterFlourish color="#D4AF37" width={150} />
              </div>

            {/* Body */}
            <div className="space-y-2 text-xs text-black font-bold">
              <p className="text-[11px] text-gray-700">{certMatter.presentedToText}</p>

              {/* Volunteer Name & Photo Layout */}
              <div className="flex items-center justify-center gap-4 my-1">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  title={certLanguage === 'hi' ? 'फोटो अपलोड / बदलने के लिए क्लिक करें' : 'Click to upload/change photo'}
                  className={`relative w-16 h-20 rounded-lg border-2 flex flex-col items-center justify-center text-center p-0.5 bg-white cursor-pointer group shadow-xs overflow-hidden ${
                    photoUrl
                      ? 'border-[#008000] hover:ring-2 hover:ring-emerald-500'
                      : 'border-dashed border-red-400 bg-red-50/40 hover:bg-red-50 hover:border-red-600'
                  }`}
                >
                  {photoUrl ? (
                    <>
                      <img
                        src={photoUrl}
                        alt={volunteerName}
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
                      <Camera className="w-4 h-4 text-red-600 mb-0.5 group-hover:scale-110 transition-transform" />
                      <span className="text-[6.5pt] font-black text-red-700 uppercase leading-tight">
                        {certLanguage === 'hi' ? 'फोटो *' : 'PHOTO *'}
                      </span>
                    </>
                  )}
                </div>

                <div className="text-left">
                  <div className="text-xl font-black text-black underline decoration-amber-600 font-['Cinzel']">
                    {volunteerName}
                  </div>
                  <span className={`text-[7pt] font-black uppercase tracking-wider px-1 rounded inline-block mt-1 ${
                    photoUrl ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700 animate-pulse'
                  }`}>
                    {photoUrl ? (certLanguage === 'hi' ? '✓ प्रमाणित स्वयंसेवक' : '✓ VERIFIED VOLUNTEER') : (certLanguage === 'hi' ? '⚠️ फोटो अनिवार्य' : '⚠️ PHOTO REQUIRED')}
                  </span>
                </div>
              </div>

              <p className="text-xs leading-relaxed">
                {certLanguage === 'hi'
                  ? `आपके द्वारा "${task.titleHindi}" अभियान में दिए गए अमूल्य और निःस्वार्थ योगदान हेतु।`
                  : certLanguage === 'en'
                  ? `In deep appreciation of your invaluable and selfless contribution towards the "${task.title}" initiative.`
                  : `आपके द्वारा "${task.titleHindi}" (${task.title}) अभियान में दिए गए अमूल्य और निःस्वार्थ योगदान हेतु।`}
              </p>

              {/* Task info pill with Volunteer Address & Sector */}
              <div className="bg-[#FFFDE7] border border-yellow-300 p-2.5 rounded-xl text-left space-y-1 text-[10px] font-extrabold">
                <div>
                  <strong className="text-[#8B0000]">{certLanguage === 'hi' ? 'निवास स्थान एवं कार्यक्षेत्र पता:' : certLanguage === 'en' ? 'Residence & Sector Address:' : 'निवास व कार्यक्षेत्र पता / Address:'}</strong>{' '}
                  <span className="text-gray-900">
                    {address.wardOrVillage ? (certLanguage === 'hi' ? `ग्राम/वार्ड: ${address.wardOrVillage}, ` : `Ward/Village: ${address.wardOrVillage}, `) : ''}
                    {address.block ? (certLanguage === 'hi' ? `ब्लॉक: ${address.block}, ` : `Block: ${address.block}, `) : ''}
                    {address.district ? (certLanguage === 'hi' ? `जिला: ${address.district}, ` : `Dist: ${address.district}, `) : ''}
                    {address.state ? `${address.state} ` : ''}
                    ({address.country || (certLanguage === 'hi' ? 'भारत' : 'India')})
                  </span>
                </div>
                <div>
                  <strong className="text-[#008000]">{certLanguage === 'hi' ? 'संबंधित सेवा अभियान (Campaign/Sector):' : certLanguage === 'en' ? 'Assigned Campaign/Sector:' : 'सेवा अभियान / Campaign:'}</strong>{' '}
                  <span className="text-gray-900 font-bold">{task.titleHindi}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between pt-1 border-t border-yellow-200/80 text-[9.5px]">
                  <div><strong>{certMatter.taskLocationLabel}:</strong> {task.location}</div>
                  <div><strong>{certMatter.dateLabel}:</strong> {task.date}</div>
                  <div><strong className="text-emerald-700">{certMatter.pointsLabel}:</strong> +{task.points} Points</div>
                </div>
              </div>
            </div>

            {/* Single-Line Balanced Footer - 3 Pillars (Live Verify QR | Royal Official Seal | Authorised Signatory) */}
            <div className="border-t-2 border-amber-900/30 pt-[clamp(6px,1.2cqw,12px)] mt-2.5 grid grid-cols-3 items-center gap-[clamp(6px,1.5cqw,14px)] select-none">
              {/* COLUMN 1 (LEFT): Official Live Verification QR Code */}
              <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-[#FFFDF8] border border-amber-300/80 rounded-lg sm:rounded-xl shadow-2xs text-left w-full max-w-[clamp(170px,28cqw,240px)]">
                <div className="shrink-0 p-0.5 sm:p-1 bg-white border border-amber-400 rounded-md sm:rounded-lg shadow-2xs">
                  <CertificateVerificationQR
                    certificateId={certId}
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
                    <span className="font-mono font-bold text-[#8B0000] text-[clamp(7pt,0.9cqw,8pt)] block truncate">{certId}</span>
                  </div>
                  <div className="truncate">
                    <strong className="text-black font-black">{certLanguage === 'hi' ? 'दिनांक' : 'Date'}:</strong>{' '}
                    <span className="font-medium text-black">{task.date}</span>
                  </div>
                  <div className="text-[clamp(5.5pt,0.75cqw,6.5pt)] text-emerald-800 font-bold truncate">
                    ✓ {certLanguage === 'hi' ? 'सत्यापित सेवा' : 'Verified Task'}
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
                  {certLanguage === 'hi' ? 'आधिकारिक सेवा मुहर' : 'OFFICIAL SEVA SEAL'}
                </div>
              </div>

              {/* COLUMN 3 (RIGHT): Authorised Signatory with Authentic Digital Signature */}
              <div className="flex flex-col items-end justify-center text-right w-full">
                <div className="w-full max-w-[clamp(170px,28cqw,240px)] border-2 border-dashed border-blue-900/40 bg-[#FFFDE7]/90 p-1 sm:p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-center shadow-2xs relative">
                  <div className="text-[clamp(6.5pt,0.8cqw,7.5pt)] font-black text-blue-950 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1 truncate">
                    <ShieldCheck className="w-3 h-3 text-blue-900 shrink-0" />
                    <span className="truncate">{certMatter.signatoryLabel || 'अधिकृत हस्ताक्षरकर्ता'}</span>
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
            </div>
          </div>
        </div>

        {/* OTP Verification Modal for Secure Task Appreciation Certificate Download */}
        <OtpVerificationModal
          isOpen={isOtpOpen}
          onClose={() => setIsOtpOpen(false)}
          phoneNumber={volunteerPhone}
          onSuccess={handleOtpVerified}
          title="सेवा कार्य प्रशंसा पत्र डाउनलोड - OTP सत्यापन"
          subtitle="सुरक्षा सत्यापन: सेवा कार्य प्रशंसा पत्र डाउनलोड करने हेतु मोबाइल नंबर OTP सत्यापित करें।"
        />

        {/* Send Task Certificate via WhatsApp & Email Modal */}
        {shareModalOpen && (
          <SendCertificateModal
            isOpen={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
            defaultTab={shareModalTab}
            data={{
              certificateType: 'task_cert',
              titleHindi: 'सेवा कार्य प्रशंसा पत्र (Task Appreciation Award)',
              titleEnglish: 'Certificate of Seva Appreciation & Social Impact',
              recipientName: volunteerName,
              certificateNo: certId,
              issueDate: task.date,
              recipientPhone: volunteerPhone,
              purpose: `${task.title} - ${task.location}`,
              qrVerifyUrl: typeof window !== 'undefined' ? `${window.location.origin}/?verify=${encodeURIComponent(certId)}` : undefined
            }}
          />
        )}
        </div>
      </div>
    </div>
  );
};

export default TaskAppreciationCardModal;
