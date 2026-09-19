// ============================================================================
// JEEVAN JYOTI FOUNDATION - STAFF I-CARD DOWNLOAD & VERIFICATION PORTAL
// जीवन ज्योति फाउंडेशन - स्टाफ पहचान पत्र डाउनलोड एवं सत्यापन केंद्र
// Features: Dynamic Themes, Hindi & English Dual Language Download, Flip & PDF
// ============================================================================

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Download,
  Printer,
  Search,
  RotateCw,
  Share2,
  Check,
  ShieldCheck,
  Award,
  Sparkles,
  Palette,
  Phone,
  UserCheck,
  FileText,
  UserPlus,
  Languages,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { StaffMember, StaffCardTheme, StaffCardLanguage } from '../../types/staff';
import { getAllStaffMembers, findStaffMember } from '../../services/staffService';
import { StaffIdCard } from './StaffIdCard';
import { exportElementAsPng, exportElementAsPdf, exportElementsAsMultiPagePdf, directPrintElement } from '../../utils/exportImage';
import { OtpVerificationModal } from '../OtpVerificationModal';

interface StaffIdCardDownloadModalProps {
  initialStaff?: StaffMember | null;
  onClose: () => void;
  onOpenRegistrationForm: () => void;
}

export const StaffIdCardDownloadModal: React.FC<StaffIdCardDownloadModalProps> = ({
  initialStaff,
  onClose,
  onOpenRegistrationForm
}) => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const allStaff = getAllStaffMembers();

  // Selected Staff State
  const [selectedStaff, setSelectedStaff] = useState<StaffMember>(
    initialStaff || allStaff[0] || ({} as StaffMember)
  );

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  // Card View States
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [cardTheme, setCardTheme] = useState<StaffCardTheme>('maroon_gold');
  const [cardLanguage, setCardLanguage] = useState<StaffCardLanguage>('hi');
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // OTP Verification States for I-Card Download
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Reset OTP verification status when switching staff
  useEffect(() => {
    setIsOtpVerified(false);
  }, [selectedStaff?.id]);

  // Approval status checks
  const isApproved = selectedStaff.status === 'approved' || selectedStaff.status === 'active' || selectedStaff.status === 'verified';
  const isPending = selectedStaff.status === 'pending';
  const isRejected = selectedStaff.status === 'rejected';

  const requireOtpBeforeAction = (action: () => void) => {
    if (isPending) {
      alert('⚠️ यह स्टाफ पहचान पत्र वर्तमान में संस्था प्रशासन (Admin) के अनुमोदन हेतु लंबित है। एडमिन द्वारा स्वीकृति (Approval) मिलते ही डाउनलोड सक्षम हो जाएगा। आपके रजिस्टर्ड मोबाइल पर WhatsApp सूचना भी प्राप्त होगी।');
      return;
    }
    if (isRejected) {
      alert(`⚠️ यह स्टाफ पंजीकरण संस्था प्रशासन द्वारा अस्वीकृत किया गया है। ${selectedStaff.rejectionReason ? `(कारण: ${selectedStaff.rejectionReason})` : ''}`);
      return;
    }

    if (isOtpVerified) {
      action();
    } else {
      setPendingAction(() => action);
      setIsOtpOpen(true);
    }
  };

  const handleOtpSuccess = () => {
    setIsOtpVerified(true);
    setIsOtpOpen(false);
    if (pendingAction) {
      setTimeout(() => {
        pendingAction();
        setPendingAction(null);
      }, 200);
    }
  };

  // Update selected staff if initialStaff changes
  useEffect(() => {
    if (initialStaff) {
      setSelectedStaff(initialStaff);
    }
  }, [initialStaff]);

  // Handle Search
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchError(null);

    if (!searchQuery.trim()) {
      setSearchError('कृपया स्टाफ आईडी (उदा. JJF-STF-2026-001) या मोबाइल नंबर दर्ज करें।');
      return;
    }

    const found = findStaffMember(searchQuery.trim());
    if (found) {
      setSelectedStaff(found);
      setSearchError(null);
    } else {
      setSearchError('इस आईडी या मोबाइल नंबर से कोई स्टाफ सदस्य नहीं मिला। कृपया पुनः जांचें।');
    }
  };

  // Execute Download High-Res PNG with specific language
  const executeDownloadPng = async (langToUse: StaffCardLanguage = cardLanguage) => {
    if (langToUse !== cardLanguage) {
      setCardLanguage(langToUse);
      // Wait a tick for render
      await new Promise((resolve) => setTimeout(resolve, 80));
    }

    const cardEl = document.getElementById('staff-id-card-rendered');
    if (!cardEl) return;
    setIsExporting(`png_${langToUse}`);
    try {
      const langLabel = langToUse === 'en' ? 'EN' : langToUse === 'hi' ? 'HI' : 'Bilingual';
      const fileName = `JJF_Staff_Card_${selectedStaff.id}_${langLabel}_${cardSide}`;
      await exportElementAsPng(cardEl, fileName, {
        pixelRatio: 3,
        backgroundColor: '#FFFFFF'
      });
    } catch (err) {
      console.error('PNG download error:', err);
    } finally {
      setIsExporting(null);
    }
  };

  const handleDownloadPng = (langToUse: StaffCardLanguage = cardLanguage) => {
    requireOtpBeforeAction(() => executeDownloadPng(langToUse));
  };

  // Execute Download Print-Ready 2-Page PDF (Page 1: Front, Page 2: Back)
  const executeDownloadPdf = async (langToUse: StaffCardLanguage = cardLanguage) => {
    if (langToUse !== cardLanguage) {
      setCardLanguage(langToUse);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const frontEl = document.getElementById('staff-card-export-front');
    const backEl = document.getElementById('staff-card-export-back');
    const currentEl = document.getElementById('staff-id-card-rendered');
    
    // Page 1: Front Side, Page 2: Back Side
    const elementsToExport = [frontEl || currentEl, backEl].filter((el): el is HTMLElement => el !== null);
    if (elementsToExport.length === 0) return;

    setIsExporting('pdf');
    try {
      const langLabel = langToUse === 'en' ? 'EN' : langToUse === 'hi' ? 'HI' : 'Bilingual';
      const fileName = `JJF_Staff_ID_${selectedStaff.id}_${langLabel}_BothSides_2Page`;
      await exportElementsAsMultiPagePdf(elementsToExport, fileName, {
        orientation: 'portrait',
        backgroundColor: '#FFFFFF',
        pixelRatio: 3
      });
    } catch (err) {
      console.error('2-Page PDF download error:', err);
    } finally {
      setIsExporting(null);
    }
  };

  const handleDownloadPdf = (langToUse: StaffCardLanguage = cardLanguage) => {
    requireOtpBeforeAction(() => executeDownloadPdf(langToUse));
  };

  // Direct Print
  const handlePrint = () => {
    requireOtpBeforeAction(() => {
      const cardEl = document.getElementById('staff-id-card-rendered');
      directPrintElement(cardEl);
    });
  };

  // WhatsApp Share
  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `*जीवन ज्योति फाउंडेशन ग़ाज़ीपुर - आधिकारिक स्टाफ पहचान पत्र*\n\n` +
      `👤 नाम: ${selectedStaff.fullName}\n` +
      `💼 पदनाम: ${selectedStaff.designation}\n` +
      `🆔 स्टाफ आईडी: ${selectedStaff.id}\n` +
      `🩸 रक्त समूह: ${selectedStaff.bloodGroup}\n` +
      `🌐 ऑनलाइन सत्यापन लिंक: ${window.location.origin}/?verify=${selectedStaff.id}\n\n` +
      `_सरकारी पंजीकृत संस्था (Reg: UP/2018/0207700)_`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-300 my-auto animate-in fade-in zoom-in duration-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#8B0000] via-[#A00000] to-[#3F2B96] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-amber-400 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300 flex items-center justify-center text-amber-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white font-['Cinzel',serif]">
                  स्टाफ पहचान पत्र डाउनलोड व सत्यापन केंद्र
                </h3>
                <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-amber-100 font-medium mt-0.5">
                Staff Identity Card Portal • हिन्दी एवं English दोनों भाषाओं में डाउनलोड उपलब्ध
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-gray-50/60">
          {/* Top Search Bar */}
          <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-gray-200 mb-5">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="स्टाफ आई.डी. (उदा. JJF-STF-2026-001) या मोबाइल नंबर से खोजें..."
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-hidden"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#8B0000] hover:bg-[#700000] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>खोजें (Search)</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenRegistrationForm}
                  className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  title="नया स्टाफ रजिस्टर करें"
                >
                  <UserPlus className="w-4 h-4 text-[#8B0000]" />
                  <span className="hidden sm:inline">नया स्टाफ रजिस्ट्रेशन</span>
                  <span className="sm:hidden">रजिस्ट्रेशन</span>
                </button>
              </div>
            </form>

            {searchError && (
              <div className="mt-2 text-xs font-bold text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
                {searchError}
              </div>
            )}

            {/* Quick Picker Chips for Registered Staff */}
            <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-gray-400 shrink-0">पंजीकृत स्टाफ:</span>
              {allStaff.slice(0, 6).map((stf) => (
                <button
                  key={stf.id}
                  type="button"
                  onClick={() => setSelectedStaff(stf)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                    selectedStaff.id === stf.id
                      ? 'bg-[#8B0000] text-white shadow-xs'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {stf.fullName} ({stf.id.split('-').pop()})
                </button>
              ))}
            </div>
          </div>

          {/* Main 2-Column Section */}
          <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-start">
            {/* Left: Card Display (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {/* Language Selector Bar Right Above Card */}
              <div className="w-full max-w-[360px] mb-2.5 flex items-center justify-between bg-white p-1.5 rounded-xl border border-gray-200 shadow-xs">
                <span className="text-[11px] font-bold text-gray-600 flex items-center gap-1 ml-1">
                  <Languages className="w-3.5 h-3.5 text-[#8B0000]" />
                  <span>भाषा (Language):</span>
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setCardLanguage('hi')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      cardLanguage === 'hi'
                        ? 'bg-[#8B0000] text-white shadow-xs'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    🇮🇳 हिन्दी
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardLanguage('en')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      cardLanguage === 'en'
                        ? 'bg-[#8B0000] text-white shadow-xs'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardLanguage('bilingual')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      cardLanguage === 'bilingual'
                        ? 'bg-[#8B0000] text-white shadow-xs'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    🌐 द्विभाषी
                  </button>
                </div>
              </div>

              {/* The Actual Staff I-Card Element */}
              <div ref={cardContainerRef} className="relative transition-all duration-300 hover:scale-[1.01]">
                <StaffIdCard
                  id="staff-id-card-rendered"
                  staff={selectedStaff}
                  side={cardSide}
                  theme={cardTheme}
                  language={cardLanguage}
                />
              </div>

              {/* Flip Button underneath */}
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCardSide((prev) => (prev === 'front' ? 'back' : 'front'))}
                  className="px-4 py-1.5 bg-white border border-gray-300 hover:border-amber-400 text-gray-800 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#8B0000]" />
                  <span>
                    {cardSide === 'front' ? 'कार्ड का पिछला भाग देखें (Flip to Back)' : 'कार्ड का मुख्य भाग देखें (Flip to Front)'}
                  </span>
                </button>
                <span className="text-[11px] font-bold text-gray-500">
                  वर्तमान: {cardSide === 'front' ? 'अग्र भाग (Front)' : 'पृष्ठ भाग (Back)'}
                </span>
              </div>
            </div>

            {/* Right: Customization Controls & Download Buttons (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Staff Details Summary Card */}
              <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-gray-700">स्टाफ विवरण संक्षेप</span>
                  </div>
                  <span className="text-xs font-mono font-black text-[#8B0000] bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                    {selectedStaff.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block">स्टाफ का नाम:</span>
                    <span className="font-extrabold text-gray-900">{selectedStaff.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block">पदनाम:</span>
                    <span className="font-bold text-gray-800">{selectedStaff.designation}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block">विभाग:</span>
                    <span className="font-medium text-gray-700">{selectedStaff.department}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-bold block">रक्त समूह:</span>
                    <span className="font-bold text-red-600">{selectedStaff.bloodGroup}</span>
                  </div>
                </div>
              </div>

              {/* Theme Selector */}
              <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-2.5">
                  <Palette className="w-4 h-4 text-amber-600" />
                  <span>स्टाइलिश कार्ड कलर थीम चुनें (Select Card Theme)</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'maroon_gold', label: 'शाही महरून (Maroon & Gold)', color: 'from-[#8B0000] to-amber-500' },
                    { id: 'navy_gold', label: 'रॉयल नेवी (Navy & Gold)', color: 'from-[#0B1E48] to-yellow-500' },
                    { id: 'emerald_gold', label: 'एमराल्ड ग्रीन (Emerald)', color: 'from-[#084228] to-amber-400' },
                    { id: 'royal_purple', label: 'शाही बैंगनी (Royal Purple)', color: 'from-[#3B1566] to-purple-500' }
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      type="button"
                      onClick={() => setCardTheme(thm.id as StaffCardTheme)}
                      className={`p-2 rounded-xl text-left border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                        cardTheme === thm.id
                          ? 'border-[#8B0000] bg-red-50/50 text-[#8B0000] ring-2 ring-[#8B0000]/20'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-tr ${thm.color} shrink-0 shadow-xs`}></div>
                      <span className="text-[11px] truncate">{thm.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Multi-Page PDF Download & Language Options */}
              <div className="space-y-2.5 pt-1">
                {/* Status Warning if Pending */}
                {isPending && (
                  <div className="p-3.5 bg-amber-50 border-2 border-amber-400 rounded-2xl text-xs space-y-2 text-amber-950">
                    <div className="flex items-center gap-2 font-black text-amber-900">
                      <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>अनुमोदन प्रक्रियाधीन (Admin Approval Pending)</span>
                    </div>
                    <p className="text-[11.5px] leading-relaxed">
                      यह स्टाफ आई-कार्ड वर्तमान में संस्था प्रशासन (Admin) के अनुमोदन हेतु प्रतीक्षारत है। 
                      एडमिन द्वारा स्वीकृति (Approve) मिलते ही आपके रजिस्टर्ड मोबाइल (<strong>+91 {selectedStaff.mobile}</strong>) पर WhatsApp द्वारा आधिकारिक डाउनलोड लिंक भेजा जाएगा।
                    </p>
                    <div className="bg-amber-100/80 p-2 rounded-xl text-[11px] font-bold text-amber-900">
                      ℹ️ संस्था प्रशासन द्वारा अप्रूवल मिलने के उपरांत आप सीधे अपने रजिस्टर्ड मोबाइल पर OTP सत्यापन करके भी 2-Page प्रिंट-रेडी कार्ड डाउनलोड कर सकेंगे।
                    </div>
                  </div>
                )}

                {/* Status Warning if Rejected */}
                {isRejected && (
                  <div className="p-3.5 bg-red-50 border-2 border-red-400 rounded-2xl text-xs space-y-1.5 text-red-950">
                    <div className="flex items-center gap-2 font-black text-red-800">
                      <X className="w-5 h-5 text-red-600 shrink-0" />
                      <span>पंजीकरण अस्वीकृत (Application Rejected)</span>
                    </div>
                    <p className="text-[11.5px]">
                      यह स्टाफ पंजीकरण संस्था प्रशासन द्वारा अस्वीकृत कर दिया गया है।
                      {selectedStaff.rejectionReason && (
                        <span className="block mt-1 font-bold text-red-900">
                          कारण: {selectedStaff.rejectionReason}
                        </span>
                      )}
                    </p>
                  </div>
                )}

                {/* Approved Badge */}
                {isApproved && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs flex items-center gap-2.5 text-emerald-950">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-black text-emerald-900 block">
                        ✅ आधिकारिक रूप से स्वीकृत (Approved by Admin)
                      </span>
                      <span className="text-[11px] text-emerald-800">
                        {isOtpVerified
                          ? 'OTP सत्यापित है। आप नीचे दिए गए बटनों से तुरंत 2-Page PDF व PNG डाउनलोड कर सकते हैं।'
                          : `अपने रजिस्टर्ड मोबाइल (+91 ${selectedStaff.mobile}) पर OTP सत्यापन करके तुरंत डाउनलोड करें।`}
                      </span>
                    </div>
                  </div>
                )}

                {/* Security Verification Status Banner (for approved staff) */}
                {isApproved && !isOtpVerified && (
                  <div className="p-2.5 rounded-xl border text-xs flex items-center gap-2.5 bg-amber-50 border-amber-300 text-amber-950">
                    <ShieldCheck className="w-4 h-4 text-[#8B0000] shrink-0" />
                    <div className="text-[11px] leading-tight">
                      <span>
                        <strong className="text-[#8B0000]">🔒 सुरक्षा नियम: </strong>
                        रजिस्ट्रेशन में दर्ज मोबाइल नंबर (+91 {selectedStaff.mobile}) पर OTP सत्यापन के बाद ही डाउनलोड होगा।
                      </span>
                    </div>
                  </div>
                )}

                {/* 1. Highlighted 2-Page PDF Download Button (Both Sides in 2 Pages) */}
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(cardLanguage)}
                  disabled={isExporting !== null}
                  className="w-full py-3 px-4 bg-gradient-to-r from-red-800 via-rose-700 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white font-black rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 border-2 border-amber-300"
                >
                  <FileText className="w-5 h-5 text-amber-300 shrink-0" />
                  <div className="text-left">
                    <div className="leading-tight text-[13.5px]">
                      {isExporting === 'pdf'
                        ? 'दोनों साइड 2-पेज PDF तैयार हो रही है...'
                        : '📄 दोनों साइड (2-Page) PDF डाउनलोड करें'}
                    </div>
                    <div className="text-[10px] text-amber-200 font-medium">
                      Page 1: फ्रंट साइड • Page 2: बैक साइड (NGO सम्पूर्ण विवरण सहित)
                    </div>
                  </div>
                </button>

                {/* 2. Hindi Download Button */}
                <button
                  type="button"
                  onClick={() => handleDownloadPng('hi')}
                  disabled={isExporting !== null}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-[#8B0000] via-red-700 to-amber-600 hover:from-red-800 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>
                    {isExporting === 'png_hi'
                      ? 'हिंदी आई-कार्ड तैयार हो रहा है...'
                      : '🇮🇳 हिंदी में आई-कार्ड डाउनलोड करें (PNG)'}
                  </span>
                </button>

                {/* 3. English Download Button */}
                <button
                  type="button"
                  onClick={() => handleDownloadPng('en')}
                  disabled={isExporting !== null}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-[#0B1E48] via-blue-900 to-indigo-800 hover:from-[#081535] hover:to-indigo-900 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-yellow-300" />
                  <span>
                    {isExporting === 'png_en'
                      ? 'Generating English I-Card...'
                      : '🇬🇧 Download I-Card in English (PNG)'}
                  </span>
                </button>

                {/* Secondary Actions Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* Print */}
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="py-2.5 px-3 bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-gray-700" />
                    <span>प्रिंट करें (Print)</span>
                  </button>

                  {/* WhatsApp Share */}
                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <span>शेयर करें (WhatsApp)</span>
                  </button>
                </div>

                {/* Register New Staff CTA Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onOpenRegistrationForm}
                    className="w-full py-2 px-4 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-[#8B0000]" />
                    <span>नया स्टाफ पंजीकृत करना चाहते हैं? यहाँ क्लिक करें</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Offscreen Elements for Multi-Page 2-Page PDF Export (Page 1: Front, Page 2: Back) */}
        <div
          style={{
            position: 'fixed',
            left: '-9999px',
            top: '-9999px',
            width: '380px',
            pointerEvents: 'none',
            zIndex: -100
          }}
          aria-hidden="true"
        >
          <div id="staff-card-export-front">
            <StaffIdCard
              staff={selectedStaff}
              side="front"
              theme={cardTheme}
              language={cardLanguage}
            />
          </div>
          <div id="staff-card-export-back" className="mt-4">
            <StaffIdCard
              staff={selectedStaff}
              side="back"
              theme={cardTheme}
              language={cardLanguage}
            />
          </div>
        </div>
      </div>

      {/* Mandatory OTP Verification Modal before Download */}
      {isOtpOpen && (
        <OtpVerificationModal
          isOpen={isOtpOpen}
          onClose={() => {
            setIsOtpOpen(false);
            setPendingAction(null);
          }}
          phoneNumber={selectedStaff.mobile}
          recipientName={selectedStaff.fullName}
          certificateId={selectedStaff.id}
          onSuccess={handleOtpSuccess}
        />
      )}
    </div>
  );
};
