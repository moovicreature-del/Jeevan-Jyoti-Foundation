// ============================================================================
// JEEVAN JYOTI FOUNDATION - DONATION PORTAL & RECEIPT GENERATOR
// जीवन ज्योति फाउंडेशन - दान पोर्टल एवं तुरंत डिजिटल रसीद
// ============================================================================

import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  QrCode,
  CreditCard,
  Building2,
  ArrowRight,
  Copy,
  Check,
  Lock,
  Receipt,
  X
} from 'lucide-react';
import { DonationRecord } from '../../types';
import { FOUNDATION_INFO } from '../../data/foundationData';
import { BrandLogo } from '../common/BrandLogo';
import { amountToWordsIndian } from '../../utils/numberToWords';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { triggerDonationReceiptEmail } from '../../services/emailService';
import { useDonationPaymentSettings } from '../../hooks/useDonationPaymentSettings';
import { RealPaymentGatewayModal, DonorPaymentData } from './RealPaymentGatewayModal';

interface Props {
  isOpen?: boolean;
  onClose: () => void;
  onDonationSuccess: (donation: DonationRecord) => void;
  onOpenDonorDashboard?: () => void;
}

export const Donation80GPortal: React.FC<Props> = ({
  isOpen = true,
  onClose,
  onDonationSuccess,
  onOpenDonorDashboard
}) => {
  const { settings: paymentSettings } = useDonationPaymentSettings();

  // Form State
  const [donorName, setDonorName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Ghazipur');
  const [pincode, setPincode] = useState('233001');
  
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');
  const [purpose, setPurpose] = useState<string>('Shiksha (शिक्षा सहयोग)');
  const [agreeDeclaration, setAgreeDeclaration] = useState<boolean>(true);

  // Payment Mode
  const [paymentTab, setPaymentTab] = useState<'upi' | 'razorpay' | 'bank'>('upi');
  const [txnRef, setTxnRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Real Payment Gateway Modal state
  const [showRealGateway, setShowRealGateway] = useState(false);
  const [activePaymentData, setActivePaymentData] = useState<DonorPaymentData | null>(null);

  // Final amount calculation
  const currentAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;

  // Preset Amounts
  const presetAmounts = [100, 500, 1000, 2100];

  // Purposes
  const purposeOptions = [
    {
      id: 'Shiksha',
      title: 'Shiksha (शिक्षा सहयोग)',
      desc: 'ग्रामीण निर्धन बच्चों की स्कूल फीस, पाठ्य सामग्री व डिजिटल शिक्षा',
      badge: '₹500 / माह'
    },
    {
      id: 'Bhojan',
      title: 'Bhojan (अन्नपूर्णा पौष्टिक भोजन)',
      desc: 'असहाय, वृद्ध व कुपोषण के शिकार बच्चों हेतु निःशुल्क गर्म भोजन',
      badge: '₹100 / भोजन'
    },
    {
      id: 'Swasthya',
      title: 'Swasthya (स्वास्थ्य व चिकित्सा)',
      desc: 'मुफ्त स्वास्थ्य जांच शिविर, दवा वितरण व बुजुर्गों का उपचार',
      badge: '₹1,000 / शिविर'
    },
    {
      id: 'General',
      title: 'General (समग्र सामाजिक कल्याण)',
      desc: 'आपदा राहत, महिला स्वावलंबन व ग्राम्य विकास अभियान',
      badge: 'आवश्यकतानुसार'
    }
  ];

  // Dynamic UPI URL based on admin configured settings
  const activeUpiId = paymentSettings.upiId || FOUNDATION_INFO.upiId;
  const activePayeeName = paymentSettings.upiPayeeName || FOUNDATION_INFO.nameEnglish;
  const upiIntentUrl = `upi://pay?pa=${activeUpiId}&pn=${encodeURIComponent(activePayeeName)}&am=${currentAmount}&cu=INR&tn=${encodeURIComponent(`JJF Donation - ${purpose.split(' ')[0]}`)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(activeUpiId);
    setCopiedUpi(true);
    toast.success('UPI ID क्लिपबोर्ड पर कॉपी हो गई!');
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Live PAN Validation
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const isPanValid = !panNumber || panRegex.test(panNumber.toUpperCase());

  // Submit and Complete Donation
  const handleSubmitDonation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!donorName.trim()) {
      toast.error('कृपया दानदाता का नाम दर्ज करें!');
      return;
    }

    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      toast.error('कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें!');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      toast.error('कृपया मान्य ईमेल पता दर्ज करें!');
      return;
    }

    if (panNumber && !panRegex.test(panNumber.toUpperCase())) {
      toast.error('कृपया 10 अक्षरों का मान्य PAN नंबर दर्ज करें (उदा. ABCDE1234F)!');
      return;
    }

    if (!currentAmount || currentAmount < 10) {
      toast.error('कृपया कम से कम ₹10 की दान राशि दर्ज करें!');
      return;
    }

    if (!agreeDeclaration) {
      toast.error('कृपया दान सहमति चेकबॉक्स स्वीकार करें!');
      return;
    }

    // Build donor payment bundle and open real payment gateway modal
    const donorPaymentData: DonorPaymentData = {
      name: donorName.trim(),
      fatherName: fatherName.trim() || undefined,
      phone: phone.trim(),
      email: email.trim(),
      panNumber: panNumber.trim().toUpperCase() || undefined,
      address: address.trim() || undefined,
      city: city.trim() || 'Ghazipur',
      district: 'ग़ाज़ीपुर (Ghazipur)',
      state: 'उत्तर प्रदेश (Uttar Pradesh)',
      pincode: pincode.trim() || '233001',
      amount: currentAmount,
      purpose: purpose
    };

    setActivePaymentData(donorPaymentData);
    setShowRealGateway(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-300 my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* ========================================================================= */}
        {/* HEADER - Logo Left + JJF + Ghazipur UP */}
        {/* ========================================================================= */}
        <header className="bg-gradient-to-r from-[#0024B8] via-indigo-950 to-[#0024B8] text-white p-4 sm:p-6 relative overflow-hidden border-b-4 border-amber-400">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            {/* Logo Left + Details */}
            <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
              <div className="p-1 bg-white/10 rounded-2xl border border-amber-300/30 shrink-0">
                <BrandLogo className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md" id="donation-page-top-logo" />
              </div>
              <div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-wide text-amber-300 uppercase font-serif">
                    {FOUNDATION_INFO.nameEnglish}
                  </h1>
                  <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-300 border border-emerald-400/50 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Govt. Registered NGO
                  </span>
                </div>
                <p className="text-sm font-semibold text-white/90">
                  {FOUNDATION_INFO.nameHindi}
                </p>
                <p className="text-xs text-amber-100/80">
                  Ghazipur, Uttar Pradesh • NITI Aayog: <strong className="text-white font-mono">{FOUNDATION_INFO.nitiAayogUid}</strong>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {onOpenDonorDashboard && (
                <button
                  type="button"
                  onClick={onOpenDonorDashboard}
                  className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Receipt className="w-4 h-4 text-amber-300" />
                  मेरी दान रसीदें
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                title="बंद करें"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* ========================================================================= */}
          {/* HERO SECTION */}
          {/* ========================================================================= */}
          <div className="relative rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white p-5 sm:p-6 shadow-md overflow-hidden">
            <div className="absolute right-3 bottom-2 opacity-15 pointer-events-none">
              <BrandLogo size={180} watermark opacity={1} />
            </div>

            <div className="relative z-10 max-w-2xl space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-yellow-100 border border-white/30">
                <Sparkles className="w-3.5 h-3.5" />
                परोपकार परमोधर्मः • सेवा • शिक्षा • स्वास्थ्य
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
                "आपके दान से रोशन हो किसी का जीवन"
              </h2>
              <p className="text-xs sm:text-sm text-amber-50 leading-relaxed">
                ग़ाज़ीपुर के निर्धन बच्चों को शिक्षा, असहायों को अन्नपूर्णा भोजन व बुजुर्गों को चिकित्सा सहायता प्रदान कर 100% पारदर्शी समाज निर्माण में सहभागी बनें।
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                  <span>1,450+ शिक्षित बच्चे</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                  <span>42,800+ भोजन पैकेट</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-yellow-300" />
                  <span>तुरंत आधिकारिक PDF रसीद</span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* REGISTRATION INFO BOX */}
          {/* ========================================================================= */}
          <div className="bg-emerald-50 border-2 border-emerald-400 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-emerald-950">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-500 text-white rounded-xl shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm text-emerald-900 flex items-center gap-1.5">
                  सरकारी पंजीकृत गैर-लाभकारी संगठन (Govt. Registered NGO)
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed mt-0.5">
                  पंजीकरण संख्या: <strong>{FOUNDATION_INFO.regNo}</strong> | नीति आयोग दर्पण UID: <strong>{FOUNDATION_INFO.nitiAayogUid}</strong>
                </p>
              </div>
            </div>
            <div className="shrink-0 text-xs bg-white px-3 py-1.5 rounded-lg border border-emerald-300 font-mono font-bold text-emerald-900">
              PAN: {FOUNDATION_INFO.pan}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MAIN DONATION FORM */}
          {/* ========================================================================= */}
          <form onSubmit={handleSubmitDonation} className="space-y-6">
            {/* Step 1: Amount & Type Selection */}
            <div className="bg-amber-50/50 p-4 sm:p-6 rounded-2xl border border-amber-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">1</span>
                  दान राशि एवं प्रकार चुनें (Donation Amount & Frequency) <span className="text-red-500">*</span>
                </h3>

                {/* One-time vs Monthly Toggle */}
                <div className="inline-flex p-1 bg-gray-200 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setDonationType('one-time')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      donationType === 'one-time'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    एकमुश्त (One-Time)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationType('monthly')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      donationType === 'monthly'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    मासिक (Monthly)
                  </button>
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {presetAmounts.map((amt) => {
                  const isSelected = selectedAmount === amt && !customAmount;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount('');
                      }}
                      className={`p-3 rounded-xl font-bold text-center border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'border-[#0024B8] bg-indigo-50 text-[#0024B8] shadow-sm ring-2 ring-indigo-300'
                          : 'border-gray-200 bg-white text-gray-800 hover:border-amber-400 hover:bg-amber-50/50'
                      }`}
                    >
                      <span className="text-lg">₹{amt.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-gray-500 font-normal">
                        {amt === 100 ? '1 समय भोजन' : amt === 500 ? 'मासिक शिक्षा' : amt === 1000 ? 'स्वास्थ्य किट' : 'सम्मान सहयोग'}
                      </span>
                    </button>
                  );
                })}

                {/* Custom Amount Input */}
                <div className="col-span-2 sm:col-span-1 relative">
                  <input
                    type="number"
                    min="10"
                    placeholder="अन्य राशि (₹)"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                    className={`w-full h-full min-h-[54px] px-3 py-2 text-sm font-bold text-center rounded-xl border-2 focus:outline-none transition-all ${
                      customAmount
                        ? 'border-[#0024B8] bg-indigo-50 text-[#0024B8] ring-2 ring-indigo-300'
                        : 'border-gray-200 bg-white text-gray-800 focus:border-amber-500'
                    }`}
                  />
                </div>
              </div>

              {/* Selected Amount in Words preview */}
              {currentAmount > 0 && (
                <div className="text-xs bg-amber-100/60 p-2.5 rounded-xl border border-amber-300 text-amber-900 font-medium flex items-center justify-between">
                  <span>कुल दान राशि: <strong className="text-sm font-bold">₹{currentAmount.toLocaleString('en-IN')}</strong></span>
                  <span className="italic text-gray-700 font-serif">({amountToWordsIndian(currentAmount)})</span>
                </div>
              )}
            </div>

            {/* Step 2: Purpose Selection */}
            <div className="space-y-3">
              <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">2</span>
                दान का उद्देश्य (Select Purpose of Donation) <span className="text-red-500">*</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {purposeOptions.map((opt) => {
                  const isSelected = purpose === opt.title;
                  return (
                    <label
                      key={opt.id}
                      className={`p-3.5 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#2E8B57] bg-emerald-50/70 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="donationPurpose"
                        value={opt.title}
                        checked={isSelected}
                        onChange={() => setPurpose(opt.title)}
                        className="mt-1 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-gray-900">{opt.title}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Donor Details */}
            <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between border-b border-gray-200 pb-2 gap-2">
                <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold">3</span>
                  दानदाता विवरण (Donor Details)
                </h3>
                <span className="text-[11px] text-gray-500 font-medium">
                  * चिह्नित फ़ील्ड अनिवार्य हैं
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Donor Name* */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    दानदाता का पूरा नाम (Donor Full Name) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. राजेश कुमार सिंह"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-500"
                  />
                </div>

                {/* Father's Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    पिता का नाम (Father's Name) <span className="text-gray-400 font-normal">(वैकल्पिक / Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. श्री सत्यदेव सिंह"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-500"
                  />
                </div>

                {/* Email* */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ईमेल आईडी (Email Address) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com (रसीद इसपर भेजी जाएगी)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-500"
                  />
                </div>

                {/* Phone* */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    मोबाइल नंबर (Mobile Number) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10 अंकों का मोबाइल नंबर"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-amber-400 focus:border-amber-500"
                  />
                </div>

                {/* PAN Number */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    PAN नंबर (Permanent Account Number) <span className="text-gray-400 font-normal">(वैकल्पिक / Optional)</span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="उदा. ABCDE1234F (वैकल्पिक / Optional)"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    className={`w-full px-3.5 py-2.5 bg-white rounded-xl border text-sm font-mono tracking-wider uppercase focus:ring-2 ${
                      panNumber && !isPanValid
                        ? 'border-red-500 focus:ring-red-400'
                        : 'border-gray-300 focus:ring-amber-400 focus:border-amber-500'
                    }`}
                  />
                  {panNumber && !isPanValid && (
                    <p className="text-[11px] text-red-600 mt-1">
                      कृपया 10 अक्षरों का मान्य PAN नंबर दर्ज करें (उदा. ABCDE1234F)।
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    डाक पता (Postal Address) <span className="text-gray-400 font-normal">(वैकल्पिक / Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="मकान नंबर, मोहल्ला / ग्राम, पोस्ट, जनपद ग़ाज़ीपुर (उ.प्र.) - 233001"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-amber-400 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Declaration Checkbox */}
              <div className="pt-2 border-t border-gray-200">
                <label className="flex items-start gap-2.5 text-xs text-gray-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeDeclaration}
                    onChange={(e) => setAgreeDeclaration(e.target.checked)}
                    className="mt-0.5 h-4 w-4 text-[#0024B8] rounded border-gray-300 focus:ring-indigo-500"
                  />
                  <span>
                    <strong>दान घोषणा (Declaration):</strong> "मैं पुष्टि करता/करती हूँ कि यह दान स्वेच्छा से जीवन ज्योति फाउंडेशन के जन-कल्याणकारी कार्यों हेतु दिया जा रहा है।"
                  </span>
                </label>
              </div>
            </div>

            {/* Step 4: Payment Options (UPI / QR, Razorpay Cards/Netbanking, Direct Bank) */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border-2 border-[#0024B8]/30 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
                <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0024B8] text-white text-xs flex items-center justify-center font-bold">4</span>
                  भुगतान माध्यम (Payment Method)
                </h3>
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Secure Gateway
                </span>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentTab('upi')}
                  className={`p-3 rounded-xl font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border-2 ${
                    paymentTab === 'upi'
                      ? 'border-[#0024B8] bg-indigo-50 text-[#0024B8]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span>UPI / QR Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentTab('razorpay')}
                  className={`p-3 rounded-xl font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border-2 ${
                    paymentTab === 'razorpay'
                      ? 'border-[#0024B8] bg-indigo-50 text-[#0024B8]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Card / Netbanking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentTab('bank')}
                  className={`p-3 rounded-xl font-bold text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border-2 ${
                    paymentTab === 'bank'
                      ? 'border-[#0024B8] bg-indigo-50 text-[#0024B8]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span>Direct Bank NEFT</span>
                </button>
              </div>

              {/* Tab 1: UPI & Dynamic QR */}
              {paymentTab === 'upi' && (
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Left: Dynamic QR or Custom QR Image */}
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-white rounded-2xl shadow-md border-2 border-amber-400">
                      {paymentSettings.qrCodeMode === 'custom_image' && paymentSettings.customQrImageUrl ? (
                        <img
                          src={paymentSettings.customQrImageUrl}
                          alt="Donation QR"
                          className="w-[170px] h-[170px] object-contain rounded-lg"
                        />
                      ) : (
                        <QRCodeSVG
                          value={upiIntentUrl}
                          size={170}
                          level="H"
                          includeMargin={false}
                        />
                      )}
                    </div>
                    <p className="text-[11px] text-gray-600 font-bold mt-2">
                      GPay • PhonePe • Paytm • BHIM
                    </p>
                    <a
                      href={upiIntentUrl}
                      className="mt-2 inline-block sm:hidden px-4 py-1.5 bg-[#0024B8] text-white text-xs font-bold rounded-lg"
                    >
                      UPI ऐप खोलें (Pay ₹{currentAmount})
                    </a>
                  </div>

                  {/* Right: UPI ID Copy & TXN Ref Input */}
                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <span className="text-xs text-gray-600 font-semibold block">
                        आधिकारिक संस्था UPI ID (Official Account):
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="px-3 py-2 bg-white rounded-xl border border-gray-300 font-mono font-bold text-sm text-gray-900 flex-1">
                          {activeUpiId}
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUpi}
                          className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer shrink-0"
                        >
                          {copiedUpi ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          {copiedUpi ? 'कॉपी हुआ' : 'कॉपी'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        UPI Transaction UTR / Ref No (यदि भुगतान कर दिया है):
                      </label>
                      <input
                        type="text"
                        placeholder="उदा. 408512345678 (12 अंकों का UTR)"
                        value={txnRef}
                        onChange={(e) => setTxnRef(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-gray-300 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Card & Netbanking Real Gateway */}
              {paymentTab === 'razorpay' && (
                <div className="p-4 bg-indigo-50/80 rounded-2xl border-2 border-indigo-300 text-center space-y-3">
                  <div className="flex flex-wrap justify-center items-center gap-2">
                    <span className="px-3 py-1 bg-white rounded-lg font-black text-xs border border-indigo-200 text-indigo-950 shadow-xs">
                      💳 Visa / Mastercard / RuPay
                    </span>
                    <span className="px-3 py-1 bg-white rounded-lg font-black text-xs border border-indigo-200 text-indigo-950 shadow-xs">
                      🏛️ SBI, HDFC, ICICI, PNB, BOB (50+ Banks)
                    </span>
                    <span className="px-3 py-1 bg-emerald-100 rounded-lg font-black text-xs text-emerald-900 border border-emerald-300 shadow-xs">
                      🔒 3D Secure OTP Protection
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 max-w-lg mx-auto font-medium">
                    नीचे बटन दबाते ही <strong>संस्था का अधिकृत बैंक खाता विवरण</strong> खुलेगा। आगे बढ़ने पर आप डेबिट/क्रेडिट कार्ड या इंटरनेट बैंकिंग चुनकर बैंक OTP सत्यापन द्वारा वास्तविक भुगतान कर सकेंगे और तुरंत आधिकारिक दान प्रमाण पत्र प्राप्त होगा।
                  </p>
                  <button
                    type="button"
                    onClick={handleSubmitDonation}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-700 via-[#0024B8] to-blue-800 hover:from-indigo-800 text-white font-black text-xs sm:text-sm rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-amber-300" />
                    <span>डेबिट/क्रेडिट कार्ड व नेट बैंकिंग गेटवे खोलें (Proceed to Pay)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Tab 3: Bank NEFT */}
              {paymentTab === 'bank' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-800">
                    <div><strong>खाता नाम:</strong> {paymentSettings.bankAccountName || FOUNDATION_INFO.bankAccountName}</div>
                    <div><strong>बैंक:</strong> {paymentSettings.bankName || FOUNDATION_INFO.bankName}</div>
                    <div><strong>खाता संख्या:</strong> <span className="font-mono font-bold text-[#0024B8]">{paymentSettings.bankAccountNumber || FOUNDATION_INFO.bankAccountNumber}</span></div>
                    <div><strong>IFSC कोड:</strong> <span className="font-mono font-bold">{paymentSettings.bankIfsc || FOUNDATION_INFO.bankIfsc}</span></div>
                    <div><strong>शाखा:</strong> {paymentSettings.bankBranch || FOUNDATION_INFO.bankBranch}</div>
                    <div><strong>खाता प्रकार:</strong> Current Account</div>
                  </div>
                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={handleSubmitDonation}
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Building2 className="w-4 h-4 text-amber-300" />
                      <span>बैंक खाता विवरण देखें व ऑनलाइन भुगतान विकल्प खोलें</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Final Action CTA Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer tracking-wide"
              >
                <Heart className="w-5 h-5 text-red-300 fill-red-300" />
                <span>
                  {isProcessing
                    ? 'रसीद तैयार हो रही है...'
                    : `₹${currentAmount.toLocaleString('en-IN')} दान करें • बैंक खाता विवरण व भुगतान गेटवे खोलें`}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-xs text-gray-500 mt-2 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                100% पारदर्शी • नीति आयोग दर्पण व सरकारी पंजीकृत संस्था
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Real Payment Gateway Modal */}
      {showRealGateway && activePaymentData && (
        <RealPaymentGatewayModal
          isOpen={showRealGateway}
          onClose={() => setShowRealGateway(false)}
          donorData={activePaymentData}
          onPaymentSuccess={(donation) => {
            setShowRealGateway(false);
            onClose();
            onDonationSuccess(donation);
          }}
        />
      )}
    </div>
  );
};

export default Donation80GPortal;
