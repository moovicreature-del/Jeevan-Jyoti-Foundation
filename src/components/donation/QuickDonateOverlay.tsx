import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Heart,
  QrCode,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Minimize2,
  Maximize2,
  Smartphone,
  Building2,
  CheckCircle2,
  Download,
  Share2,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  Receipt
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { FOUNDATION_INFO } from '../../data/foundationData';
import { DonationRecord } from '../../types';
import { useDonationPaymentSettings } from '../../hooks/useDonationPaymentSettings';
import { BrandLogo } from '../common/BrandLogo';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

interface QuickDonateOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onDonationSuccess?: (donation: DonationRecord) => void;
  onOpenFullForm?: () => void;
  onOpenAdminSettings?: () => void;
  initialAmount?: number;
}

export const QuickDonateOverlay: React.FC<QuickDonateOverlayProps> = ({
  isOpen,
  onClose,
  onDonationSuccess,
  onOpenFullForm,
  onOpenAdminSettings,
  initialAmount = 500
}) => {
  const { settings: paymentSettings } = useDonationPaymentSettings();

  // State
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('Shiksha & Seva (शिक्षा व भोजन सेवा)');
  const [showBankDetails, setShowBankDetails] = useState<boolean>(false);
  const [showClaimForm, setShowClaimForm] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Quick 80G Claim Details
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorPan, setDonorPan] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState<string>('');
  const [isSubmittingClaim, setIsSubmittingClaim] = useState<boolean>(false);

  const qrContainerRef = useRef<HTMLDivElement>(null);

  const finalAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;
  const activeUpiId = paymentSettings.upiId || FOUNDATION_INFO.upiId;
  const activePayeeName = paymentSettings.upiPayeeName || FOUNDATION_INFO.nameEnglish;

  // Preset Amounts
  const presetAmounts = [100, 250, 500, 1000, 2100, 5100, 11000];

  // Dynamic UPI Payment Deep Link
  const noteText = `Jeevan Jyoti Foundation - ${selectedPurpose}`;
  const upiUrl = `upi://pay?pa=${activeUpiId}&pn=${encodeURIComponent(activePayeeName)}&am=${finalAmount > 0 ? finalAmount : ''}&cu=INR&tn=${encodeURIComponent(noteText)}`;

  // Mobile Deep Links
  const gpayUrl = `gpay://upi/pay?pa=${activeUpiId}&pn=${encodeURIComponent(activePayeeName)}&am=${finalAmount > 0 ? finalAmount : ''}&cu=INR&tn=${encodeURIComponent(noteText)}`;
  const phonepeUrl = `phonepe://pay?pa=${activeUpiId}&pn=${encodeURIComponent(activePayeeName)}&am=${finalAmount > 0 ? finalAmount : ''}&cu=INR&tn=${encodeURIComponent(noteText)}`;
  const paytmUrl = `paytmmp://pay?pa=${activeUpiId}&pn=${encodeURIComponent(activePayeeName)}&am=${finalAmount > 0 ? finalAmount : ''}&cu=INR&tn=${encodeURIComponent(noteText)}`;

  // Copy to clipboard helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`Copied: ${text}`, {
      id: `copy-${fieldName}`,
      duration: 2000,
      icon: '📋'
    });
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Quick Donation Claim Handler
  const handleClaim80G = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim()) {
      toast.error('कृपया दानदाता का नाम दर्ज करें (Please enter Donor Name)');
      return;
    }
    if (finalAmount <= 0) {
      toast.error('कृपया मान्य दान राशि चुनें (Please enter a valid amount)');
      return;
    }

    setIsSubmittingClaim(true);
    const receiptNo = `JJF/DON/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;

    const newDonation: DonationRecord = {
      id: receiptNo,
      receiptNo,
      donorName: donorName.trim(),
      phone: donorPhone.trim() || undefined,
      email: donorEmail.trim() || undefined,
      panNumber: donorPan.trim().toUpperCase() || undefined,
      amount: finalAmount,
      date: new Date().toISOString(),
      purpose: selectedPurpose,
      purposeHindi: 'शिक्षा, स्वास्थ्य एवं असहाय जन सेवा',
      paymentMode: 'Direct Quick UPI Payment',
      transactionRef: utrNumber.trim() ? `UPI/UTR/${utrNumber.trim()}` : `UPI/QUICK/${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      taxExemptEligible: false,
      city: 'Ghazipur',
      emailSent: Boolean(donorEmail.trim() && donorEmail.includes('@')),
      emailSentAt: donorEmail.trim() ? new Date().toISOString() : undefined
    };

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    toast.success('🎉 धन्यवाद! आपका दान रसीद प्रमाण पत्र तुरंत जनरेट हो गया है।', {
      duration: 5000,
      icon: '📜'
    });

    setIsSubmittingClaim(false);
    onClose();
    if (onDonationSuccess) {
      onDonationSuccess(newDonation);
    }
  };

  // Keyboard shortcut: Escape to minimize or close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (!isMinimized) {
          setIsMinimized(true);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isMinimized, onClose]);

  if (!isOpen) return null;

  // --------------------------------------------------------------------------
  // 1. MINIMIZED FLOATING DOCK (Persistent Pill on Bottom-Right)
  // --------------------------------------------------------------------------
  if (isMinimized) {
    return (
      <div
        id="quick-donate-minimized-dock"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-[#8B0000] via-red-800 to-amber-900 text-white p-2.5 px-4 rounded-full shadow-2xl border-2 border-yellow-400 animate-in fade-in slide-in-from-bottom-5 duration-300 select-none group"
      >
        <div className="relative flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-md animate-pulse">
            <Zap className="w-4 h-4 text-slate-950 fill-slate-950" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
        </div>

        <button
          onClick={() => setIsMinimized(false)}
          className="flex flex-col text-left cursor-pointer hover:opacity-90 transition-opacity"
          title="क्लिक कर क्विक डोनेट QR विंडो खोलें"
        >
          <div className="flex items-center gap-1.5 font-black text-xs text-yellow-300">
            <span>⚡ Quick Donate QR</span>
            <span className="bg-black/40 px-1.5 py-0.2 rounded text-[10px] text-white">
              ₹{finalAmount > 0 ? finalAmount.toLocaleString('en-IN') : 'Custom'}
            </span>
          </div>
          <span className="text-[9.5px] text-orange-100 font-bold">1-Tap UPI Mobile Payment</span>
        </button>

        <div className="flex items-center gap-1 ml-2 pl-2 border-l border-white/20">
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 hover:bg-white/20 rounded-full text-yellow-300 hover:text-white transition-colors cursor-pointer"
            title="Expand Full QR Modal"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-full text-red-200 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // 2. FULL EXPANDED QUICK DONATE OVERLAY MODAL
  // --------------------------------------------------------------------------
  return (
    <div
      id="quick-donate-overlay-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm overflow-y-auto overscroll-contain flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        id="quick-donate-overlay-card"
        className="bg-white rounded-3xl max-w-xl w-full p-0 shadow-2xl border-2 border-amber-300 relative overflow-hidden my-auto animate-in zoom-in-95 duration-200"
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#8B0000] via-red-800 to-amber-900 text-white p-4 sm:p-5 relative">
          <div className="absolute top-0 right-0 p-3 flex items-center gap-1.5 z-10">
            {/* Minimize button */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-yellow-300 hover:text-white transition-all cursor-pointer"
              title="Minimize to floating widget (छोटा करें)"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            {/* Close button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-red-200 hover:text-white transition-all cursor-pointer"
              title="Close (बंद करें)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-400 p-1 flex items-center justify-center shadow-lg border border-yellow-200 shrink-0">
              <BrandLogo className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-400/20 border border-yellow-300/40 text-yellow-300 text-[10px] font-black uppercase tracking-wider mb-1">
                <Zap className="w-3 h-3 fill-yellow-300" />
                <span>Quick UPI Pay • त्वरित दान</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight font-serif">
                {FOUNDATION_INFO.nameHindi}
              </h2>
              <p className="text-[11px] text-orange-200 font-medium">
                Govt. Registered NGO • NITI Aayog UID: {FOUNDATION_INFO.nitiAayogUid}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* 1. Amount Selection Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-black text-slate-900 flex items-center gap-1 uppercase tracking-wide">
                <span>सहयोग राशि चुनें (Select Amount):</span>
              </label>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                100% सुरक्षित दान
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {presetAmounts.map((amt) => {
                const isSelected = !customAmount && selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-2 px-1 rounded-xl text-center font-black text-xs transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#8B0000] text-yellow-300 border-[#8B0000] shadow-md ring-2 ring-yellow-400 scale-[1.03]'
                        : 'bg-amber-50/70 border-amber-200 text-slate-800 hover:bg-amber-100 hover:border-amber-400'
                    }`}
                  >
                    ₹{amt >= 1000 ? `${amt / 1000}k` : amt}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input */}
            <div className="mt-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold">
                ₹
              </div>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="अन्य राशि (Enter custom amount e.g. 5000)"
                className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] outline-none"
              />
            </div>
          </div>

          {/* 2. QR Code & Rapid Payment Section */}
          <div className="bg-gradient-to-b from-amber-50/90 to-yellow-50/40 p-4 rounded-2xl border-2 border-amber-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* High-res Scannable Dynamic QR Code */}
              <div
                ref={qrContainerRef}
                className="p-3 bg-white rounded-2xl border-2 border-amber-400/80 shadow-md flex flex-col items-center shrink-0 relative group"
              >
                {paymentSettings.qrCodeMode === 'custom_image' && paymentSettings.customQrImageUrl ? (
                  <div className="relative w-[150px] h-[150px] flex items-center justify-center p-1 bg-white rounded-xl overflow-hidden">
                    <img
                      src={paymentSettings.customQrImageUrl}
                      alt="Official JJF Quick Donation QR"
                      className="max-h-full max-w-full object-contain rounded-lg shadow-2xs"
                    />
                    <div className="absolute top-1 right-1 bg-indigo-900/90 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-xs">
                      Official QR
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <QRCodeSVG
                      value={upiUrl}
                      size={150}
                      level="H"
                      includeMargin={false}
                      fgColor="#0B132B"
                      bgColor="#FFFFFF"
                      imageSettings={{
                        src: '/icon.png',
                        x: undefined,
                        y: undefined,
                        height: 28,
                        width: 28,
                        excavate: true
                      }}
                    />
                  </div>
                )}

                <div className="text-[10px] font-black text-slate-800 mt-1.5 uppercase tracking-wider text-center flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Scan to Pay ₹{finalAmount > 0 ? finalAmount.toLocaleString('en-IN') : 'Any'}</span>
                </div>
              </div>

              {/* UPI ID & App Triggers */}
              <div className="flex-1 w-full space-y-2.5 text-left">
                {/* Official UPI ID Box with 1-Click Copy */}
                <div className="bg-white p-2.5 rounded-xl border border-amber-300 shadow-2xs">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center justify-between">
                    <span>आधिकारिक UPI ID (Official ID):</span>
                    <span className="text-emerald-700 font-extrabold text-[9.5px]">✓ Govt Verified</span>
                  </div>
                  <div className="flex items-center justify-between mt-1 gap-2">
                    <span className="font-mono font-black text-xs sm:text-sm text-blue-950 truncate">
                      {activeUpiId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(activeUpiId, 'upi-id')}
                      className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                    >
                      {copiedField === 'upi-id' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 1-Tap Mobile UPI App Buttons */}
                <div>
                  <div className="text-[10px] font-black text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <Smartphone className="w-3 h-3 text-[#8B0000]" />
                    <span>मोबाइल ऐप द्वारा 1-Tap भुगतान करें:</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <a
                      href={gpayUrl}
                      className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-black shadow-2xs hover:shadow-xs transition-all text-center"
                    >
                      <span className="text-blue-600 font-extrabold">G</span>
                      <span className="text-red-500 font-extrabold">P</span>
                      <span className="text-yellow-500 font-extrabold">a</span>
                      <span className="text-green-600 font-extrabold">y</span>
                    </a>

                    <a
                      href={phonepeUrl}
                      className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#5F259F] hover:bg-[#4d1d82] text-white text-xs font-black shadow-2xs hover:shadow-xs transition-all text-center"
                    >
                      <span>PhonePe</span>
                    </a>

                    <a
                      href={paytmUrl}
                      className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#002E6E] hover:bg-[#00204d] text-white text-xs font-black shadow-2xs hover:shadow-xs transition-all text-center"
                    >
                      <span>Paytm</span>
                    </a>

                    <a
                      href={upiUrl}
                      className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-2xs hover:shadow-xs transition-all text-center"
                    >
                      <Zap className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                      <span>Any UPI App</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Bank Account Details Accordion */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
            <button
              type="button"
              onClick={() => setShowBankDetails(!showBankDetails)}
              className="w-full flex items-center justify-between p-3 text-left font-bold text-xs text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-700" />
                <span>सीधे बैंक खाते में ट्रांसफर (Direct Bank NEFT/RTGS/IMPS)</span>
              </div>
              {showBankDetails ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {showBankDetails && (
              <div className="p-3 pt-0 text-xs space-y-2 border-t border-slate-200 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">बैंक का नाम (Bank):</span>
                    <span className="font-extrabold text-slate-900">{FOUNDATION_INFO.bankName}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 font-bold block">खाता धारक (Account Name):</span>
                    <span className="font-extrabold text-slate-900">{FOUNDATION_INFO.bankAccountName}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block">खाता संख्या (A/C No):</span>
                      <span className="font-mono font-black text-slate-900">{FOUNDATION_INFO.bankAccountNumber}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(FOUNDATION_INFO.bankAccountNumber, 'acct-no')}
                      className="p-1 text-slate-600 hover:text-black cursor-pointer"
                      title="Copy Account Number"
                    >
                      {copiedField === 'acct-no' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold block">IFSC कोड:</span>
                      <span className="font-mono font-black text-slate-900">{FOUNDATION_INFO.bankIfsc}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(FOUNDATION_INFO.bankIfsc, 'ifsc')}
                      className="p-1 text-slate-600 hover:text-black cursor-pointer"
                      title="Copy IFSC Code"
                    >
                      {copiedField === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Instant Receipt Claim Option */}
          <div className="border-2 border-emerald-300 rounded-2xl bg-emerald-50/50 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <div>
                  <h4 className="text-xs font-black text-emerald-950">
                    तुरंत दान रसीद प्राप्त करें
                  </h4>
                  <p className="text-[10px] text-emerald-800">
                    भुगतान के बाद 1 मिनट में आधिकारिक PDF रसीद व प्रमाण पत्र डाउनलोड करें
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowClaimForm(!showClaimForm)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black transition-colors cursor-pointer shrink-0"
              >
                {showClaimForm ? 'फॉर्म छुपाएं' : 'रसीद जनरेट करें'}
              </button>
            </div>

            {/* Quick Confirmation Sub-form */}
            {showClaimForm && (
              <form onSubmit={handleClaim80G} className="mt-3 pt-3 border-t border-emerald-200 space-y-2.5 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-0.5">
                      दानदाता का पूरा नाम *
                    </label>
                    <input
                      type="text"
                      required
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-0.5">
                      मोबाइल नंबर (WhatsApp)
                    </label>
                    <input
                      type="tel"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-0.5">
                      PAN नंबर (यदि उपलब्ध हो)
                    </label>
                    <input
                      type="text"
                      value={donorPan}
                      onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                      placeholder="e.g. ABCDE1234F"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-emerald-600 uppercase"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 block mb-0.5">
                      UPI UTR / Ref No (यदि उपलब्ध हो)
                    </label>
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. 423984729182"
                      className="w-full px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingClaim}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white rounded-xl font-black text-xs shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Receipt className="w-4 h-4" />
                  <span>तुरंत दान रसीद व प्रमाण पत्र जारी करें (Generate Receipt)</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer info & full form link */}
        <div className="bg-slate-50 p-3 px-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-600">
          <div className="flex items-center gap-2 font-mono">
            <span>Reg No: <strong className="text-black">{FOUNDATION_INFO.regNo}</strong></span>
            <span>•</span>
            <span>PAN: <strong className="text-black">{FOUNDATION_INFO.pan}</strong></span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {onOpenAdminSettings && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdminSettings();
                }}
                className="text-indigo-700 hover:text-indigo-900 font-bold flex items-center gap-1 cursor-pointer bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200"
                title="व्यवस्थापक: UPI ID व QR बदलें"
              >
                <span>⚙️ QR / UPI बदलें</span>
              </button>
            )}

            {onOpenFullForm && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullForm();
                }}
                className="text-[#8B0000] font-black hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>विस्तृत दान पोर्टल</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickDonateOverlay;
