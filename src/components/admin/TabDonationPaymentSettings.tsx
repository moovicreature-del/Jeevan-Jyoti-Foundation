// ============================================================================
// JEEVAN JYOTI FOUNDATION - ADMIN DONATION BANK, UPI & QR PAYMENT SETTINGS
// एडमिन पोर्टल: दान खाता विवरण, UPI आईडी एवं QR कोड प्रबंधन
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  QrCode,
  CreditCard,
  Upload,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  Eye,
  Trash2,
  Phone,
  Mail,
  FileCheck,
  Smartphone,
  Info,
  Zap,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { DonationPaymentSettings } from '../../types';
import {
  DEFAULT_DONATION_PAYMENT_SETTINGS,
  getDonationPaymentSettings,
  saveDonationPaymentSettings,
  resetDonationPaymentSettings,
  uploadCustomPaymentQrImage
} from '../../services/adminService';
import toast from 'react-hot-toast';

export const TabDonationPaymentSettings: React.FC = () => {
  const { adminProfile } = useAdminAuth();
  const [settings, setSettings] = useState<DonationPaymentSettings>(DEFAULT_DONATION_PAYMENT_SETTINGS);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploadingQr, setIsUploadingQr] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [previewAmount, setPreviewAmount] = useState<number>(2100);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<'quick_donate' | 'bank_80g'>('quick_donate');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const UPI_SUFFIX_CHIPS = ['@sbi', '@okaxis', '@paytm', '@ybl', '@icici', '@ibl', '@axl', '@postbank', '@kotak', '@barodampay'];

  const handleApplyUpiSuffix = (suffix: string) => {
    const raw = upiId.trim();
    if (!raw) {
      setUpiId(`jeevanjyoti${suffix}`);
      return;
    }
    const atIdx = raw.indexOf('@');
    if (atIdx !== -1) {
      setUpiId(`${raw.substring(0, atIdx)}${suffix}`);
    } else {
      setUpiId(`${raw}${suffix}`);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('कृपया केवल वैध इमेज फ़ाइल (PNG, JPG, JPEG, WEBP) चुनें!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('फ़ाइल का आकार 5MB से कम होना चाहिए!');
      return;
    }

    try {
      setIsUploadingQr(true);
      setUploadProgress(15);
      const adminUid = adminProfile?.uid || 'admin-local';
      const uploadedUrl = await uploadCustomPaymentQrImage(file, adminUid, (p) => setUploadProgress(p));
      setCustomQrImageUrl(uploadedUrl);
      setQrCodeMode('custom_image');
      toast.success('कस्टम QR कोड फोटो सफलतापूर्वक अपलोड हो गई!');
    } catch (err) {
      console.error(err);
      toast.error('QR कोड फोटो अपलोड करने में त्रुटि आई।');
    } finally {
      setIsUploadingQr(false);
      setUploadProgress(0);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [upiId, setUpiId] = useState('');
  const [upiPayeeName, setUpiPayeeName] = useState('');
  const [qrCodeMode, setQrCodeMode] = useState<'auto_generated' | 'custom_image'>('auto_generated');
  const [customQrImageUrl, setCustomQrImageUrl] = useState('');
  
  const [bankAccountName, setBankAccountName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankBranch, setBankBranch] = useState('');
  
  const [panNumber, setPanNumber] = useState('');
  const [urn80G, setUrn80G] = useState('');
  const [urn10A, setUrn10A] = useState('');
  const [nitiAayogUid, setNitiAayogUid] = useState('');
  
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [donationNoteHindi, setDonationNoteHindi] = useState('');

  // Load current settings on mount
  useEffect(() => {
    let isMounted = true;
    getDonationPaymentSettings().then((data) => {
      if (isMounted) {
        setSettings(data);
        populateForm(data);
        setInitialLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const populateForm = (data: DonationPaymentSettings) => {
    setUpiId(data.upiId || '');
    setUpiPayeeName(data.upiPayeeName || '');
    setQrCodeMode(data.qrCodeMode || 'auto_generated');
    setCustomQrImageUrl(data.customQrImageUrl || '');
    
    setBankAccountName(data.bankAccountName || '');
    setBankAccountNumber(data.bankAccountNumber || '');
    setBankIfsc(data.bankIfsc || '');
    setBankName(data.bankName || '');
    setBankBranch(data.bankBranch || '');
    
    setPanNumber(data.panNumber || '');
    setUrn80G(data.urn80G || '');
    setUrn10A(data.urn10A || '');
    setNitiAayogUid(data.nitiAayogUid || '');
    
    setContactPhone(data.contactPhone || '');
    setContactEmail(data.contactEmail || '');
    setDonationNoteHindi(data.donationNoteHindi || '');
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Handle Custom QR Image Selection / Upload
  const handleQrImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('कृपया केवल वैध इमेज फ़ाइल (PNG, JPG, JPEG, WEBP) चुनें!');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('फ़ाइल का आकार 5MB से कम होना चाहिए!');
      return;
    }

    try {
      setIsUploadingQr(true);
      setUploadProgress(10);
      const adminUid = adminProfile?.uid || 'admin-local';
      const uploadedUrl = await uploadCustomPaymentQrImage(file, adminUid, (p) => setUploadProgress(p));
      
      setCustomQrImageUrl(uploadedUrl);
      setQrCodeMode('custom_image');
      toast.success('कस्टम QR कोड फोटो सफलतापूर्वक लोड हो गई!');
    } catch (err) {
      console.error(err);
      toast.error('QR कोड फोटो अपलोड करने में त्रुटि आई।');
    } finally {
      setIsUploadingQr(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Remove Custom QR Image
  const handleRemoveCustomQr = () => {
    setCustomQrImageUrl('');
    setQrCodeMode('auto_generated');
    toast.success('कस्टम QR हटा दिया गया। अब डायनामिक ऑटो-जेनरेटेड QR सक्रिय है।');
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!upiId.trim()) {
      toast.error('कृपया वैध UPI ID दर्ज करें!');
      return;
    }
    if (!bankAccountNumber.trim()) {
      toast.error('कृपया बैंक खाता संख्या दर्ज करें!');
      return;
    }
    if (!bankIfsc.trim()) {
      toast.error('कृपया बैंक IFSC कोड दर्ज करें!');
      return;
    }

    setIsSaving(true);
    try {
      const adminName = adminProfile?.name || 'व्यवस्थापक';
      const adminUid = adminProfile?.uid || 'admin-user';

      const payload: Partial<DonationPaymentSettings> = {
        upiId: upiId.trim(),
        upiPayeeName: upiPayeeName.trim() || 'JEEVAN JYOTI FOUNDATION',
        qrCodeMode,
        customQrImageUrl: customQrImageUrl.trim(),
        bankAccountName: bankAccountName.trim() || 'JEEVAN JYOTI FOUNDATION',
        bankAccountNumber: bankAccountNumber.trim(),
        bankIfsc: bankIfsc.trim().toUpperCase(),
        bankName: bankName.trim(),
        bankBranch: bankBranch.trim(),
        panNumber: panNumber.trim().toUpperCase(),
        urn80G: urn80G.trim().toUpperCase(),
        urn10A: urn10A.trim().toUpperCase(),
        nitiAayogUid: nitiAayogUid.trim(),
        contactPhone: contactPhone.trim(),
        contactEmail: contactEmail.trim(),
        donationNoteHindi: donationNoteHindi.trim()
      };

      const result = await saveDonationPaymentSettings(payload, adminName, adminUid);
      setSettings(result.data);
      toast.success('🎉 दान बैंक खाता विवरण, UPI ID एवं QR कोड सेटिंग्स सफलतापूर्वक अपडेट हो गई!', {
        duration: 4000
      });
    } catch (err) {
      console.error(err);
      toast.error('सेटिंग्स सेव करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to Foundation Defaults
  const handleResetToDefault = async () => {
    if (!window.confirm('क्या आप सचमुच दान विवरण को मूल डिफ़ॉल्ट (Bank of India खाता) पर रीसेट करना चाहते हैं?')) {
      return;
    }

    setIsSaving(true);
    try {
      const adminName = adminProfile?.name || 'व्यवस्थापक';
      const adminUid = adminProfile?.uid || 'admin-user';

      const result = await resetDonationPaymentSettings(adminName, adminUid);
      setSettings(result.data);
      populateForm(result.data);
      toast.success('दान भुगतान विवरण मूल डिफ़ॉल्ट पर रीसेट कर दिए गए।');
    } catch (err) {
      console.error(err);
      toast.error('रीसेट करने में त्रुटि आई।');
    } finally {
      setIsSaving(false);
    }
  };

  const dynamicUpiUrl = `upi://pay?pa=${upiId || 'jeevanjyoti.gzp@sbi'}&pn=${encodeURIComponent(upiPayeeName || 'JEEVAN JYOTI FOUNDATION')}&am=${previewAmount}&cu=INR&tn=${encodeURIComponent('JJF Donation')}`;

  if (initialLoading) {
    return (
      <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-600">दान भुगतान सेटिंग्स लोड हो रही हैं...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-black">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>दान बैंक खाता, UPI एवं QR कोड नियंत्रण (Payment Settings)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              दान भुगतान विवरण व QR कोड प्रबंधन
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
              यहाँ से आप संस्था का बैंक खाता विवरण, UPI आईडी (VPA), कस्टम QR कोड फोटो तथा 80G विवरण बदल सकते हैं। यह जानकारी पूरे पोर्टल पर तुरंत लाइव अपडेट हो जाएगी।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleResetToDefault}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition border border-white/20 cursor-pointer"
              title="मूल बैंक ऑफ इंडिया खाते पर रीसेट करें"
            >
              <RotateCcw className="w-4 h-4 text-amber-300" />
              <span>डिफ़ॉल्ट रीसेट करें</span>
            </button>
          </div>
        </div>

        {/* Quick Summary Pill */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-200">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-300">सक्रिय UPI ID:</span>
            <span className="font-mono font-black text-white bg-blue-950/60 px-2.5 py-0.5 rounded border border-blue-700">
              {settings.upiId}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-300">सक्रिय खाता:</span>
            <span className="font-mono font-bold text-white">
              {settings.bankAccountNumber} ({settings.bankName})
            </span>
          </div>
          <div className="text-[11px] text-blue-300">
            अंतिम अपडेट: {settings.updatedAt ? new Date(settings.updatedAt).toLocaleString('hi-IN') : 'सिस्टम डिफ़ॉल्ट'}
          </div>
        </div>
      </div>

      {/* Main Settings Form & Live Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Editable Form Fields (8 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* Section 1: UPI ID & VPA Payment Details */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    1. UPI आईडी एवं डिजिटल भुगतान विवरण (UPI / VPA Settings)
                  </h3>
                  <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM आदि UPI ऐप्स हेतु</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    UPI ID / VPA पता <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. jeevanjyoti.gzp@sbi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value.toLowerCase().trim())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs font-mono font-bold"
                  />
                  <div className="mt-2 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-500 block">
                      ⚡ 1-क्लिक हैंडल जोड़ें (Quick UPI Handle):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {UPI_SUFFIX_CHIPS.map((suffix) => (
                        <button
                          key={suffix}
                          type="button"
                          onClick={() => handleApplyUpiSuffix(suffix)}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 border border-slate-200 transition cursor-pointer"
                        >
                          {suffix}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    UPI Payee Name (खाताधारक नाम) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="JEEVAN JYOTI FOUNDATION"
                    value={upiPayeeName}
                    onChange={(e) => setUpiPayeeName(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    दानदाता के Google Pay, PhonePe, Paytm में दिखने वाला अधिकृत नाम
                  </span>

                  {/* Test UPI Intent in Mobile Browser */}
                  <div className="mt-3">
                    <a
                      href={`upi://pay?pa=${encodeURIComponent(upiId || 'jeevanjyoti.gzp@sbi')}&pn=${encodeURIComponent(upiPayeeName || 'JEEVAN JYOTI FOUNDATION')}&cu=INR`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-[11px] font-bold transition"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>📱 मोबाइल UPI ऐप लिंक टेस्ट करें</span>
                      <ExternalLink className="w-3 h-3 text-emerald-600" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: QR Code Mode & Custom QR Image Upload */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    2. क्विक डोनेट QR कोड मोड एवं स्टैंडी फोटो अपलोड (QR Code Configuration)
                  </h3>
                  <p className="text-[11px] text-slate-500">स्वचालित डिजिटल QR अथवा बैंक का फोटो QR कोड</p>
                </div>
              </div>

              {/* QR Mode Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setQrCodeMode('auto_generated')}
                  className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                    qrCodeMode === 'auto_generated'
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-950 ring-2 ring-emerald-200'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      डायनामिक UPI QR कोड
                    </span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.2 rounded">
                      अनुशंसित (Auto)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    UPI ID और दान राशि के आधार पर ऑटोमैटिक QR कोड बनाता है।
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setQrCodeMode('custom_image')}
                  className={`p-3.5 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                    qrCodeMode === 'custom_image'
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 ring-2 ring-indigo-200'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-xs flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-indigo-600" />
                      कस्टम QR कोड इमेज
                    </span>
                    <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-1.5 py-0.2 rounded">
                      फोटो QR
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    बैंक या PhonePe/Paytm का आधिकारिक स्टैंडी QR फोटो अपलोड करें।
                  </p>
                </button>
              </div>

              {/* Custom QR Image Upload Box with Drag & Drop */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`p-4 rounded-2xl border-2 transition-all space-y-3 ${
                  isDragOver
                    ? 'border-indigo-500 bg-indigo-50/70 border-dashed scale-[1.01]'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <label className="block text-xs font-black text-slate-800">
                  बैंक / आधिकारिक QR कोड फोटो अपलोड (Drag & Drop or Upload Custom Payment QR Image)
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {customQrImageUrl ? (
                    <div className="relative w-28 h-28 bg-white rounded-xl p-1.5 border-2 border-indigo-400 shadow-sm flex items-center justify-center shrink-0">
                      <img
                        src={customQrImageUrl}
                        alt="Custom QR Code"
                        className="max-h-full max-w-full object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveCustomQr}
                        title="कस्टम QR हटाएं"
                        className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-28 h-28 bg-white rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 text-center p-2 shrink-0">
                      <QrCode className="w-8 h-8 opacity-40 mb-1" />
                      <span className="text-[10px]">कोई फोटो नहीं</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleQrImageSelect}
                      accept="image/*"
                      className="hidden"
                      id="custom-qr-upload"
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      <label
                        htmlFor="custom-qr-upload"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow transition cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{customQrImageUrl ? 'QR फोटो बदलें' : 'QR फोटो अपलोड करें'}</span>
                      </label>
                      {customQrImageUrl && (
                        <button
                          type="button"
                          onClick={() => setQrCodeMode('custom_image')}
                          className="px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 rounded-xl text-xs font-bold transition"
                        >
                          यह फोटो QR चालू करें
                        </button>
                      )}
                    </div>

                    {isUploadingQr && (
                      <div className="space-y-1">
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-indigo-700 font-bold">
                          अपलोड हो रहा है: {uploadProgress}%
                        </span>
                      </div>
                    )}

                    <p className="text-[10px] text-slate-500">
                      फ़ाइल को यहाँ खींचकर छोड़ें (Drag & Drop) अथवा चुनें। समर्थित: JPG, PNG, WEBP (अधिकतम 5MB)।
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Bank Account Details */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    3. बैंक खाता विवरण (Official Bank Account Details)
                  </h3>
                  <p className="text-[11px] text-slate-500">NEFT, RTGS, IMPS एवं डायरेक्ट बैंक ट्रांसफर हेतु</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    खाताधारक / संस्था का नाम (Account Holder Name) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="JEEVAN JYOTI FOUNDATION"
                    value={bankAccountName}
                    onChange={(e) => setBankAccountName(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    बैंक का नाम (Bank Name) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. BANK OF INDIA / STATE BANK OF INDIA"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    खाता संख्या (Account Number) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. 718720110000323"
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value.replace(/\s+/g, ''))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-xs font-mono font-black text-[#0024B8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    IFSC कोड (IFSC Code) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    placeholder="उदा. BKID0007187"
                    value={bankIfsc}
                    onChange={(e) => setBankIfsc(e.target.value.toUpperCase().trim())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    बैंक शाखा एवं शहर (Branch & City)
                  </label>
                  <input
                    type="text"
                    placeholder="उदा. Daudpur, Mohammadabad, Ghazipur (U.P.)"
                    value={bankBranch}
                    onChange={(e) => setBankBranch(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Statutory 80G, 12A & PAN Numbers */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    4. आयकर 80G, 12A एवं PAN विवरण (Statutory 80G Tax Identifiers)
                  </h3>
                  <p className="text-[11px] text-slate-500">रसीदों और आयकर छूट प्रमाणपत्रों पर छपने वाले नंबर</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    80G URN नंबर
                  </label>
                  <input
                    type="text"
                    placeholder="AAEAJ3141QF20231"
                    value={urn80G}
                    onChange={(e) => setUrn80G(e.target.value.toUpperCase().trim())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-xs font-mono font-bold text-purple-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    12A URN नंबर
                  </label>
                  <input
                    type="text"
                    placeholder="AAEAJ3141QE20231"
                    value={urn10A}
                    onChange={(e) => setUrn10A(e.target.value.toUpperCase().trim())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-xs font-mono font-bold text-purple-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    संस्था PAN नंबर (NGO PAN)
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="AAEAJ3141Q"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase().trim())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-800 mb-1">
                    नीति आयोग NGO Darpan UID
                  </label>
                  <input
                    type="text"
                    placeholder="UP/2018/0207700"
                    value={nitiAayogUid}
                    onChange={(e) => setNitiAayogUid(e.target.value.trim())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  दानदाताओं हेतु विशेष निर्देश / टिप्पणी (Donor Payment Note Hindi)
                </label>
                <textarea
                  rows={2}
                  placeholder="भुगतान के उपरांत UTR / संदर्भ संख्या दर्ज करें..."
                  value={donationNoteHindi}
                  onChange={(e) => setDonationNoteHindi(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-xs font-medium"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{isSaving ? 'सहेजा जा रहा है...' : 'परिवर्तन सुरक्षित सहेजें (Save All Changes)'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Interactive Donor Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 space-y-4">
            
            {/* Live Preview Header Badge & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-black text-slate-800">
                  लाइव दानदाता पूर्वावलोकन (Live Preview)
                </span>
              </div>
              <div className="flex items-center bg-slate-200/80 p-1 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setPreviewTab('quick_donate')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition cursor-pointer ${
                    previewTab === 'quick_donate'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ⚡ क्विक डोनेट
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('bank_80g')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition cursor-pointer ${
                    previewTab === 'bank_80g'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🏛️ 80G व बैंक
                </button>
              </div>
            </div>

            {previewTab === 'quick_donate' ? (
              /* Quick Donate Modal Preview */
              <div className="bg-gradient-to-b from-amber-500/10 via-white to-amber-500/5 rounded-3xl p-5 border-2 border-amber-300 shadow-md space-y-4">
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-black tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                    <Zap className="w-3 h-3 fill-amber-700 text-amber-700" />
                    <span>क्विक डोनेट विंडो (Quick Donate Preview)</span>
                  </div>
                  <h4 className="font-black text-base text-slate-900">
                    {upiPayeeName || 'JEEVAN JYOTI FOUNDATION'}
                  </h4>
                  <p className="text-xs text-slate-600">
                    QR स्कैन करें अथवा नीचे दिए गए ऐप पर क्लिक करें
                  </p>
                </div>

                {/* Amount Picker Simulation */}
                <div className="flex items-center justify-center gap-2 py-1">
                  {[200, 500, 1100, 2100, 5100].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setPreviewAmount(amt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        previewAmount === amt
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>

                {/* QR Code Container */}
                <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
                  <div className="relative p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                    {qrCodeMode === 'custom_image' && customQrImageUrl ? (
                      <img
                        src={customQrImageUrl}
                        alt="Donation QR"
                        className="w-48 h-48 object-contain rounded-lg"
                      />
                    ) : (
                      <QRCodeSVG
                        value={dynamicUpiUrl}
                        size={190}
                        level="H"
                        includeMargin={true}
                      />
                    )}
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 font-black text-[9px] px-2.5 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                      {qrCodeMode === 'custom_image' ? '🟢 आधिकारिक फोटो QR सक्रिय' : `⚡ ₹${previewAmount} डायनामिक QR सक्रिय`}
                    </div>
                  </div>

                  {/* UPI ID Pill */}
                  <div className="w-full bg-slate-50 rounded-xl p-2.5 border border-slate-200 flex items-center justify-between gap-2">
                    <div className="text-left overflow-hidden">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">
                        UPI ID (VPA)
                      </span>
                      <span className="font-mono font-black text-xs text-slate-800 truncate block">
                        {upiId || 'jeevanjyoti.gzp@sbi'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(upiId || 'jeevanjyoti.gzp@sbi', 'upiId')}
                      className="p-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 transition cursor-pointer shrink-0"
                      title="UPI ID कॉपी करें"
                    >
                      {copiedField === 'upiId' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 1-Tap UPI Apps Simulator */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 block text-center">
                    1-टैप UPI ऐप्स भुगतान बटन
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 bg-white rounded-xl border border-slate-200 text-center font-bold text-[11px] text-slate-800 shadow-xs">
                      🔵 Google Pay
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-slate-200 text-center font-bold text-[11px] text-purple-800 shadow-xs">
                      🟣 PhonePe
                    </div>
                    <div className="p-2 bg-white rounded-xl border border-slate-200 text-center font-bold text-[11px] text-sky-800 shadow-xs">
                      🔷 Paytm
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Bank & 80G Detailed Preview */
              <div className="bg-gradient-to-b from-blue-500/10 via-white to-blue-500/5 rounded-3xl p-5 border-2 border-blue-300 shadow-md space-y-4">
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-black tracking-wider text-blue-900 bg-blue-200/80 px-2.5 py-0.5 rounded-full">
                    <Building2 className="w-3 h-3 text-blue-700" />
                    <span>80G बैंक खाता एवं रसीद पोर्टल</span>
                  </div>
                  <h4 className="font-black text-base text-slate-900">
                    {bankAccountName || 'JEEVAN JYOTI FOUNDATION'}
                  </h4>
                  <p className="text-xs text-slate-600">
                    NEFT / RTGS / IMPS एवं आधिकारिक 80G रसीद
                  </p>
                </div>

                {/* Direct Bank Account Card Preview */}
                <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-sm space-y-2.5 text-xs">
                  <div className="flex items-center justify-between font-black text-slate-800 border-b border-slate-200 pb-2">
                    <span className="flex items-center gap-1.5 text-blue-900">
                      <Building2 className="w-4 h-4 text-blue-700" />
                      आधिकारिक बैंक खाता
                    </span>
                    <span className="text-[10px] text-blue-700 font-mono font-bold bg-blue-100 px-2 py-0.5 rounded">
                      100% 80G कर-मुक्त
                    </span>
                  </div>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">बैंक नाम:</span>
                      <span className="font-bold text-slate-800">{bankName || 'BANK OF INDIA'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">खाता संख्या:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-black text-blue-900 text-xs">
                          {bankAccountNumber || '718720110000323'}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(bankAccountNumber, 'accNo')}
                          className="text-slate-400 hover:text-blue-700 cursor-pointer"
                          title="Copy Account No"
                        >
                          {copiedField === 'accNo' ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">IFSC कोड:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {bankIfsc || 'BKID0007187'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">शाखा:</span>
                      <span className="font-medium text-slate-700 truncate max-w-[180px]">
                        {bankBranch || 'Daudpur, Ghazipur'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Statutory Details Preview */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">80G URN:</span>
                    <span className="font-mono font-bold text-purple-900">{urn80G || 'AAEAJ3141QF20231'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">NGO PAN:</span>
                    <span className="font-mono font-bold text-slate-800">{panNumber || 'AAEAJ3141Q'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">NGO Darpan UID:</span>
                    <span className="font-mono font-bold text-slate-800">{nitiAayogUid || 'UP/2018/0207700'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Help & Info Box */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 text-xs text-blue-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="w-4 h-4 text-blue-700" />
                <span>व्यवस्थापक सूचना (Admin Note)</span>
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                यहाँ किए गए किसी भी बदलाव को सहेजने के बाद मुख्य पृष्ठ व क्विक डोनेट मोडल में तुरंत नया QR कोड एवं UPI ID लाइव अपडेट हो जाएगा।
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TabDonationPaymentSettings;
