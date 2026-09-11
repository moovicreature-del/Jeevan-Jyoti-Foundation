import React, { useRef, useState, useEffect } from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, User, Camera, AlertCircle, Trash2, UploadCloud, Check, FileText, Share2, Mail, Languages } from 'lucide-react';
import { Volunteer } from '../types';
import { FOUNDATION_INFO } from '../data/foundationData';
import { CertificateVerificationQR } from './CertificateVerificationQR';
import { DigitalSignature, NgoRoundSeal, ShaileshPradhanSignature } from './DigitalSignature';
import { BrandLogo } from './common/BrandLogo';
import { StructuredAddressSelector } from './StructuredAddressSelector';
import { DEFAULT_STRUCTURED_ADDRESS, StructuredAddress } from '../data/locationData';
import { exportElementAsPng, exportElementAsJpg, exportElementAsPdf, directPrintElement } from '../utils/exportImage';
import { OtpVerificationModal } from './OtpVerificationModal';
import { CandidatePhotoUploader } from './CandidatePhotoUploader';
import { SendCertificateModal } from './SendCertificateModal';
import { formatCertificateNumber, formatCertificateIssueDate } from '../utils/certificateUtils';
import { saveCertificateToRegistry } from '../services/certificateRegistryService';
import { CertificateLanguage, getIdCardMatter } from '../utils/certificateLanguageUtils';
import { CertificateLanguageToggle } from './common/CertificateLanguageToggle';
import { OfficialVerifiedBadge } from './common/OfficialVerifiedBadge';

interface Props {
  volunteer?: Partial<Volunteer> | null;
  onClose: () => void;
  onOpenRegistrationForm?: () => void;
}

export const SwayamSewakCardModal: React.FC<Props> = ({ volunteer, onClose, onOpenRegistrationForm }) => {
  const safeVol = volunteer || {};
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>(safeVol.photoUrl || '');
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [showAddressEdit, setShowAddressEdit] = useState(false);
  const [showFullFormEdit, setShowFullFormEdit] = useState(true);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [pendingFormat, setPendingFormat] = useState<'jpg' | 'png' | 'pdf' | 'print' | null>(null);
  const [certLanguage, setCertLanguage] = useState<CertificateLanguage>('bilingual');
  const [cardName, setCardName] = useState(safeVol.name || 'श्री रामेश्वर राय');
  const [volunteerPhone, setVolunteerPhone] = useState(safeVol.phone || '+91-8052361666');
  const [cardFatherName, setCardFatherName] = useState(safeVol.fatherName || 'श्री रामेश्वर जी');
  const [cardRelationType, setCardRelationType] = useState(safeVol.relationType || 'Father');
  const [cardRole, setCardRole] = useState(safeVol.role || 'Dedicated Swayam Sewak');
  const [cardArea, setCardArea] = useState(safeVol.area || 'शिक्षा एवं निःशुल्क पाठशाला (Shiksha)');
  const [cardBloodGroup, setCardBloodGroup] = useState(safeVol.bloodGroup || 'O+');
  const initialCardId = formatCertificateNumber('ID', safeVol.joinDate || new Date(), safeVol.id || '01');
  const initialCardDate = formatCertificateIssueDate(safeVol.joinDate || new Date());
  const [cardId, setCardId] = useState(initialCardId);
  const [cardJoinDate, setCardJoinDate] = useState(initialCardDate);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareModalTab, setShareModalTab] = useState<'whatsapp' | 'email'>('whatsapp');
  const cardMatter = getIdCardMatter(certLanguage);

  const [address, setAddress] = useState<StructuredAddress>({
    country: safeVol.country || DEFAULT_STRUCTURED_ADDRESS.country,
    state: safeVol.state || DEFAULT_STRUCTURED_ADDRESS.state,
    district: safeVol.district || DEFAULT_STRUCTURED_ADDRESS.district,
    block: safeVol.block || DEFAULT_STRUCTURED_ADDRESS.block,
    wardOrVillage: safeVol.wardOrVillage || 'मीरानपुर (Miranpur)'
  });

  // Auto-save issued Swayam Sewak ID Card to database & local registry
  useEffect(() => {
    const cleanPhone = (volunteerPhone || safeVol.phone || '8052361666').replace(/[^0-9]/g, '').slice(-10);
    saveCertificateToRegistry({
      id: cardId,
      type: 'volunteer_id',
      titleHindi: 'स्वयंसेवक डिजिटल पहचान पत्र',
      titleEnglish: 'Swayam Sewak Digital ID Card',
      recipientName: cardName,
      fatherOrHusbandName: cardFatherName,
      phone: cleanPhone,
      issueDate: cardJoinDate,
      categoryOrPurpose: `${cardRole} • ${cardArea}`,
      photoUrl: photoUrl || safeVol.photoUrl,
      details: `ब्लड ग्रुप: ${cardBloodGroup} • अधिकृत पहचान पत्र`,
      status: 'active',
      rawVolunteer: {
        ...safeVol,
        id: cardId,
        name: cardName,
        fatherName: cardFatherName,
        phone: volunteerPhone,
        role: cardRole,
        area: cardArea,
        bloodGroup: cardBloodGroup,
        photoUrl: photoUrl || safeVol.photoUrl,
        country: address.country,
        state: address.state,
        district: address.district,
        block: address.block,
        wardOrVillage: address.wardOrVillage
      } as Volunteer
    });
  }, [cardId, cardName, cardFatherName, cardRole, cardArea, cardBloodGroup, cardJoinDate, photoUrl, address, volunteerPhone]);

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
      setPhotoError('⚠️ आधिकारिक स्वयंसेवक पहचान पत्र डाउनलोड/प्रिंट करने हेतु पासपोर्ट फोटो अपलोड करना अनिवार्य है।');
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 150);
      return false;
    }
    if (!address.country || !address.state || !address.district || !address.block || !address.wardOrVillage?.trim()) {
      setPhotoError('⚠️ पहचान पत्र हेतु देश, राज्य, जिला, ब्लॉक व वार्ड/ग्राम का चयन/दर्ज करना अनिवार्य है।');
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

  const handleInitiateDownload = (format: 'jpg' | 'png' | 'pdf') => {
    if (!validateRequirements()) return;
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
      directPrintElement(cardRef.current);
    }
    setPendingFormat(null);
  };

  const executeDownloadJpg = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading('jpg');
    try {
      const fileName = `ID_Card_${(cardName || 'Volunteer').replace(/\s+/g, '_')}`;
      await exportElementAsJpg(cardRef.current, fileName, { quality: 0.98 });
    } finally {
      setDownloading(null);
    }
  };

  const executeDownloadPng = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading('png');
    try {
      const fileName = `ID_Card_${(cardName || 'Volunteer').replace(/\s+/g, '_')}`;
      await exportElementAsPng(cardRef.current, fileName, { backgroundColor: '#FFFFFF' });
    } finally {
      setDownloading(null);
    }
  };

  const executeDownloadPdf = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading('pdf');
    try {
      const fileName = `ID_Card_${(cardName || 'Volunteer').replace(/\s+/g, '_')}`;
      await exportElementAsPdf(cardRef.current, fileName, { orientation: 'portrait' });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto p-2 sm:p-4 md:p-6 flex items-start sm:items-center justify-center py-4 sm:py-8 overscroll-contain touch-pan-y">
      <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 gap-2.5 no-print sticky -top-4 bg-white z-10 pt-1">
          <div>
            <h3 className="font-bold text-gray-900 text-base sm:text-lg">
              आधिकारिक स्वयंसेवक पहचान पत्र (ID Card)
            </h3>
            <p className="text-xs text-gray-500 font-medium">Jeevan Jyoti Foundation Official Volunteer Pass</p>
          </div>
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setShowFullFormEdit(!showFullFormEdit)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                showFullFormEdit
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{showFullFormEdit ? 'कार्ड देखें' : 'फॉर्म भरें / संपादित करें'}</span>
            </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                  photoUrl
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{photoUrl ? 'फोटो बदलें' : 'फोटो *'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!photoUrl) {
                    setPhotoError('पहचान पत्र हेतु फोटो अनिवार्य है!');
                    return;
                  }
                  setShareModalTab('whatsapp');
                  setShareModalOpen(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                title="Send ID Card to WhatsApp Number"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!photoUrl) {
                    setPhotoError('पहचान पत्र हेतु फोटो अनिवार्य है!');
                    return;
                  }
                  setShareModalTab('email');
                  setShareModalOpen(true);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#0024B8] hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                title="Send ID Card to Email Address"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>ईमेल</span>
              </button>

              {/* Certificate Language Toggle */}
              <CertificateLanguageToggle
                language={certLanguage}
                onLanguageChange={setCertLanguage}
              />

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold cursor-pointer"
                title="Print ID Card"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>प्रिंट</span>
              </button>
              <button
                type="button"
                onClick={() => handleInitiateDownload('jpg')}
                disabled={downloading !== null}
                title="Download ID Card JPG (300 DPI)"
                className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloading === 'jpg' ? 'JPG...' : 'JPG'}</span>
              </button>
              <button
                type="button"
                onClick={() => handleInitiateDownload('pdf')}
                disabled={downloading !== null}
                title="Download ID Card PDF"
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#8B0000] hover:bg-[#700000] text-white rounded-lg text-xs font-bold cursor-pointer shadow-xs disabled:opacity-50"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{downloading === 'pdf' ? 'PDF...' : 'PDF'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Top Quick Links & Toggle Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 no-print border-b border-gray-100 pb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-gray-600">मोड:</span>
              <button
                type="button"
                onClick={() => setShowFullFormEdit(false)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  !showFullFormEdit ? 'bg-amber-600 text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🪪 ID कार्ड देखें
              </button>
              <button
                type="button"
                onClick={() => setShowFullFormEdit(true)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  showFullFormEdit ? 'bg-green-700 text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📝 विवरण फॉर्म भरें
              </button>
            </div>

            {onOpenRegistrationForm && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRegistrationForm();
                }}
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
              >
                <span>विस्तृत पोर्टल फॉर्म खोलें →</span>
              </button>
            )}
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
            subLabel="पहचान पत्र पर रंगीन फोटो मुद्रित करने हेतु (गैलरी से चुनें या लाइव कैमरा से खींचें)"
          />
        </div>

        {/* Full Form Edit Drawer */}
        {showFullFormEdit && (
          <div className="bg-amber-50/95 border-2 border-amber-300 rounded-xl p-3.5 my-3 no-print space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <div className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-700" />
                <span>स्वयंसेवक पहचान पत्र विवरण फॉर्म (Live Form Fill)</span>
              </div>
              <span className="text-[10px] font-bold text-green-800 bg-green-100 px-2 py-0.5 rounded">
                कार्ड पर तुरंत अपडेट होगा
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-gray-800 mb-1">
                  स्वयंसेवक का नाम (Volunteer Full Name) *
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="उदा. श्री विकास कुमार / श्रीमती सुनीता देवी"
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Relation & Father/Husband Name */}
              <div className="p-2.5 bg-white rounded-xl border border-amber-200 sm:col-span-2 space-y-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-800 mb-1">
                    संबंध प्रकार (Relation Type) *
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setCardRelationType('Father')}
                      className={`py-1 px-2 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                        cardRelationType === 'Father'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      👨‍🦳 पिता (Father)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardRelationType('Husband')}
                      className={`py-1 px-2 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                        cardRelationType === 'Husband'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      💍 पति/जीवनसाथी
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardRelationType('Guardian')}
                      className={`py-1 px-2 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                        cardRelationType === 'Guardian'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      🛡️ अभिभावक
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-800 mb-1">
                    {cardRelationType === 'Husband'
                      ? 'पति / जीवनसाथी का नाम (Husband / Spouse Name) *'
                      : cardRelationType === 'Guardian'
                      ? 'अभिभावक का नाम (Guardian Name) *'
                      : 'पिता का नाम (Father\'s Name) *'}
                  </label>
                  <input
                    type="text"
                    value={cardFatherName}
                    onChange={(e) => setCardFatherName(e.target.value)}
                    placeholder={
                      cardRelationType === 'Husband'
                        ? 'उदा. श्री अमित कुमार (पति / जीवनसाथी का नाम)'
                        : cardRelationType === 'Guardian'
                        ? 'उदा. श्री सुरेश कुमार (अभिभावक का नाम)'
                        : 'उदा. श्री रामेश्वर शर्मा (पिता का नाम)'
                    }
                    className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Phone & Blood Group */}
              <div>
                <label className="block text-[11px] font-bold text-gray-800 mb-1">
                  मोबाइल नंबर (Mobile No.) *
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={volunteerPhone.replace('+91-', '')}
                  onChange={(e) => setVolunteerPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10 अंकों का मोबाइल नंबर"
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-800 mb-1">
                  रक्त समूह (Blood Group)
                </label>
                <select
                  value={cardBloodGroup}
                  onChange={(e) => setCardBloodGroup(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              {/* Role & Area */}
              <div>
                <label className="block text-[11px] font-bold text-gray-800 mb-1">
                  पद / भूमिका (Role)
                </label>
                <input
                  type="text"
                  value={cardRole}
                  onChange={(e) => setCardRole(e.target.value)}
                  placeholder="उदा. Dedicated Swayam Sewak"
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-800 mb-1">
                  सेवा क्षेत्र (Service Sector)
                </label>
                <input
                  type="text"
                  value={cardArea}
                  onChange={(e) => setCardArea(e.target.value)}
                  placeholder="उदा. शिक्षा एवं निःशुल्क पाठशाला"
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Vol ID & Issue Date */}
              <div>
                <label className="block text-[11px] font-bold text-gray-800 mb-1">
                  पहचान पत्र क्रमांक (Vol ID)
                </label>
                <input
                  type="text"
                  value={cardId}
                  onChange={(e) => setCardId(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-gray-800">
                    जारी तिथि (Issue Date)
                  </label>
                  <button
                    type="button"
                    onClick={() => setCardJoinDate(formatCertificateIssueDate(new Date()))}
                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                  >
                    🔄 आज की तिथि
                  </button>
                </div>
                <input
                  type="text"
                  value={cardJoinDate}
                  onChange={(e) => setCardJoinDate(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Address Selector */}
            <div className="pt-2 border-t border-amber-200">
              <label className="block text-[11px] font-bold text-gray-800 mb-1">
                आधिकारिक डाक पता (Official Postal Address) *
              </label>
              <StructuredAddressSelector
                value={address}
                onChange={setAddress}
                required={true}
                compact={true}
                labelPrefix="पहचान पत्र पता"
              />
            </div>
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

        <div className="py-4 flex justify-center">
          <div
            ref={cardRef}
            className="printable-certificate w-[340px] bg-white border-4 border-[#8B0000] rounded-2xl shadow-xl overflow-hidden text-center relative select-none"
          >
            {/* Watermark in background using BrandLogo */}
            <div
              id="swayam-card-watermark"
              className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0"
            >
              <BrandLogo size={220} watermark opacity={0.08} />
            </div>

            {/* Top Bar */}
            <div className="bg-[#8B0000] text-white py-2 px-3 flex items-center justify-center gap-2.5 relative z-10">
              <BrandLogo size={36} className="shrink-0 drop-shadow-xs" id="swayam-card-top-logo" />
              <div className="text-left">
                <div className="text-[11px] font-black uppercase tracking-wider font-['Cinzel'] leading-tight">
                  {certLanguage === 'hi' ? FOUNDATION_INFO.nameHindi : FOUNDATION_INFO.nameEnglish}
                </div>
                {certLanguage !== 'hi' && (
                  <div className="text-[9.5px] font-bold text-amber-200 leading-tight">
                    {FOUNDATION_INFO.nameHindi}
                  </div>
                )}
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-3 bg-[#FFFDF9]">
              {/* Photo & Role with Click-to-Upload */}
              <div className="flex flex-col items-center justify-center">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  title={certLanguage === 'hi' ? 'फोटो अपलोड/बदलने के लिए क्लिक करें' : 'Click to upload/change photo'}
                  className={`relative w-20 h-24 border-2 rounded-lg flex items-center justify-center shadow-xs cursor-pointer group overflow-hidden ${
                    photoUrl
                      ? 'border-[#008000] hover:ring-2 hover:ring-emerald-500'
                      : 'border-dashed border-red-400 bg-red-50/50 hover:bg-red-50 hover:border-red-600'
                  }`}
                >
                  {photoUrl ? (
                    <>
                      <img
                        src={photoUrl}
                        alt={cardName || 'Volunteer'}
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover"
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
                    <div className="flex flex-col items-center">
                      <Camera className="w-6 h-6 text-red-600 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-[7pt] font-black text-red-700 uppercase">
                        {certLanguage === 'hi' ? 'फोटो *' : 'PHOTO *'}
                      </span>
                    </div>
                  )}
                </div>

                <span className={`text-[7pt] font-black uppercase tracking-wider mt-1 px-1.5 py-0.5 rounded ${
                  photoUrl ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700 animate-pulse'
                }`}>
                  {photoUrl
                    ? (certLanguage === 'hi' ? '✓ सत्यापित स्वयंसेवक' : certLanguage === 'en' ? '✓ VERIFIED VOLUNTEER' : '✓ VERIFIED VOLUNTEER')
                    : (certLanguage === 'hi' ? '⚠️ फोटो अनिवार्य' : '⚠️ PHOTO REQUIRED')}
                </span>

                <h4 className="text-base font-black text-black mt-1">
                  {cardName}
                </h4>
                <div className="text-xs font-bold text-[#8B0000]">
                  {cardRole}
                </div>
              </div>

              {/* Details table */}
              <div className="text-[10px] text-black font-extrabold text-left bg-[#FFFDE7] p-2.5 rounded-lg border border-yellow-300 space-y-1">
                <div><span className="text-[#8B0000]">{cardMatter.idNoLabel}</span> {cardId}</div>
                <div>
                  <span className="text-[#8B0000]">
                    {cardRelationType === 'Husband'
                      ? (certLanguage === 'hi' ? 'पति (Husband):' : certLanguage === 'en' ? 'Husband:' : 'Husband / पति:')
                      : cardRelationType === 'Guardian'
                      ? (certLanguage === 'hi' ? 'अभिभावक (Guardian):' : certLanguage === 'en' ? 'Guardian:' : 'Guardian / अभिभावक:')
                      : (certLanguage === 'hi' ? 'पिता (Father):' : certLanguage === 'en' ? 'Father:' : 'Father / पिता:')}
                  </span>{' '}
                  {cardFatherName}
                </div>
                {cardBloodGroup && (
                  <div><span className="text-[#8B0000]">{cardMatter.bloodGroupLabel}</span> {cardBloodGroup}</div>
                )}
                <div>
                  <span className="text-[#8B0000]">{cardMatter.addressLabel}</span>{' '}
                  <span className="text-gray-900 font-black">
                    {address.wardOrVillage ? `${address.wardOrVillage}, ` : ''}
                    {address.block ? `${address.block}, ` : ''}
                    {address.district ? `${address.district}` : (certLanguage === 'hi' ? 'गाज़ीपुर' : 'Ghazipur')}
                    {address.state ? `, ${address.state}` : ''}
                    {address.country ? ` (${address.country})` : ''}
                  </span>
                </div>
                <div><span className="text-[#8B0000]">{cardMatter.areaLabel}</span> <span className="text-[#008000] font-black">{cardArea}</span></div>
                <div><span className="text-[#8B0000]">{certLanguage === 'hi' ? 'जारी दिनांक:' : certLanguage === 'en' ? 'Issued Date:' : 'Issued Date / जारी दिनांक:'}</span> {cardJoinDate}</div>
              </div>

              {/* Verification & Seals */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-300 gap-1.5">
                <CertificateVerificationQR certificateId={cardId} size="auto" subText={cardMatter.qrInstruction} />
                <NgoRoundSeal size="auto" className="max-w-[70px] shrink-0" />
                <div className="text-right flex flex-col items-end shrink-0 max-w-[120px]">
                  <ShaileshPradhanSignature size="auto" className="w-full max-w-[110px]" />
                  <div className="text-[8px] font-semibold text-[#1E40AF] mt-0.5 border-t border-[#1E40AF]/30 pt-0.5 w-full">
                    {certLanguage === 'hi' ? 'शैलेश प्रधान' : 'Shailesh Pradhan'}
                  </div>
                  <div className="text-[6.5px] text-gray-600 font-medium">
                    {certLanguage === 'hi' ? 'प्रबंधक एवं सचिव' : 'Manager / Secretary'}
                  </div>
                </div>
              </div>

              {/* Official Verified Badge */}
              <div className="flex justify-center pt-0.5">
                <OfficialVerifiedBadge
                  certificateId={cardId}
                  verificationDate={cardJoinDate}
                  language={certLanguage}
                  size="compact"
                  theme="gold"
                />
              </div>
            </div>

            {/* Bottom Strip */}
            <div className="bg-amber-900 text-white text-[8px] py-1 font-bold">
              Reg. No: {FOUNDATION_INFO.regNo} | Ghazipur, Uttar Pradesh, India - 233303 (DIGIPIN 2J6T226CL2)
            </div>
          </div>
        </div>

        {/* OTP Verification Modal for Secure Volunteer ID Card Download */}
        <OtpVerificationModal
          isOpen={isOtpOpen}
          onClose={() => setIsOtpOpen(false)}
          phoneNumber={volunteerPhone}
          onSuccess={handleOtpVerified}
          title="पहचान पत्र डाउनलोड - OTP सत्यापन"
          subtitle="सुरक्षा सत्यापन: स्वयंसेवक पहचान पत्र डाउनलोड करने हेतु मोबाइल नंबर OTP सत्यापित करें।"
        />

        {/* Send Certificate / ID Card via WhatsApp & Email Modal */}
        {shareModalOpen && (
          <SendCertificateModal
            isOpen={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
            defaultTab={shareModalTab}
            data={{
              certificateType: 'volunteer_id',
              titleHindi: 'आधिकारिक स्वयंसेवक पहचान पत्र (ID Pass)',
              titleEnglish: 'Official Volunteer Identity Pass Card',
              recipientName: cardName,
              fatherName: cardFatherName,
              recipientPhone: volunteerPhone,
              certificateNo: cardId,
              issueDate: cardJoinDate,
              role: cardRole,
              area: cardArea,
              address: `${address.wardOrVillage || ''}, ${address.block || ''}, ${address.district || ''}`,
              photoUrl: photoUrl || undefined
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SwayamSewakCardModal;
