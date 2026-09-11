// ============================================================================
// JEEVAN JYOTI FOUNDATION - UNIVERSAL SOCIAL SHARING & DISPATCH MODAL
// सभी प्रमाण पत्रों को ईमेल, व्हाट्सएप एवं सोशल मीडिया पर त्वरित साझा करने हेतु मॉडल
// ============================================================================

import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  MessageSquare,
  FileText,
  User,
  Calendar,
  Share2,
  Sparkles,
  AlertCircle,
  Globe,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import { FOUNDATION_INFO } from '../data/foundationData';
import { triggerDonationReceiptEmail } from '../services/emailService';
import { DonationRecord } from '../types';

export interface CertificateShareData {
  certificateType:
    | 'volunteer_cert'
    | 'donation_80g'
    | 'volunteer_id'
    | 'task_cert'
    | 'festival_cert'
    | 'general';
  titleHindi: string;
  titleEnglish: string;
  recipientName: string;
  certificateNo: string;
  issueDate?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  amount?: number;
  purpose?: string;
  fatherName?: string;
  role?: string;
  area?: string;
  address?: string;
  photoUrl?: string;
  customMessage?: string;
  qrVerifyUrl?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: CertificateShareData;
  defaultTab?: 'whatsapp' | 'email' | 'social';
}

export const SendCertificateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  defaultTab = 'whatsapp'
}) => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'email' | 'social'>(defaultTab);

  // Form states
  const [phone, setPhone] = useState(
    (data.recipientPhone || '').replace(/[^0-9]/g, '').slice(-10) || '8052361666'
  );
  const [countryCode, setCountryCode] = useState('+91');
  const [email, setEmail] = useState(
    data.recipientEmail || 'moovicreature@gmail.com'
  );
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  if (!isOpen) return null;

  // Compute live verification & direct download URL
  const baseUrl =
    typeof window !== 'undefined' ? window.location.origin : 'https://jeevanjyotifoundation.org';
  const verifyUrl =
    data.qrVerifyUrl || `${baseUrl}/?verify=${encodeURIComponent(data.certificateNo)}`;

  // Construct Achievement Social Text for WhatsApp / Social posts
  const getSocialShareText = () => {
    let achievementDetail = '';
    if (data.certificateType === 'donation_80g' && data.amount) {
      achievementDetail = `मैंने जीवन ज्योति फाउंडेशन को ₹${data.amount.toLocaleString('en-IN')} का सहयोग प्रदान कर आधिकारिक दान रसीद प्राप्त की है।`;
    } else if (data.certificateType === 'volunteer_cert') {
      achievementDetail = `मुझे जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर द्वारा सामाजिक सेवा हेतु आधिकारिक स्वयंसेवक प्रशस्ति पत्र प्रदान किया गया है।`;
    } else if (data.certificateType === 'volunteer_id') {
      achievementDetail = `मैं जीवन ज्योति फाउंडेशन का पंजीकृत एवं आधिकारिक स्वयंसेवक हूँ। (ID: ${data.certificateNo})`;
    } else if (data.certificateType === 'task_cert') {
      achievementDetail = `मैंने जीवन ज्योति फाउंडेशन के सेवा कार्य "${data.purpose || 'समाज सेवा'}" में सक्रिय योगदान देकर सेवा सम्मान प्राप्त किया है।`;
    } else if (data.certificateType === 'festival_cert') {
      achievementDetail = `जीवन ज्योति फाउंडेशन द्वारा सस्नेह जारी आधिकारिक शुभकामना प्रमाण पत्र।`;
    } else {
      achievementDetail = `जीवन ज्योति फाउंडेशन द्वारा जारी आधिकारिक डिजिटल प्रमाण पत्र।`;
    }

    return `🪔 *जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर (उ.प्र.)* 🪔\n(Govt. Reg. No: ${FOUNDATION_INFO.regNo} | NITI Aayog: ${FOUNDATION_INFO.nitiAayogUid})\n━━━━━━━━━━━━━━━━━━━━━\n📜 *${data.titleHindi}*\n_${data.titleEnglish}_\n\n👤 *धारक:* ${data.recipientName}\n🔢 *प्रमाण पत्र सं.:* ${data.certificateNo}\n📅 *दिनांक:* ${
      data.issueDate || new Date().toLocaleDateString('en-GB')
    }\n\n✨ *${achievementDetail}*\n\n✅ *आधिकारिक सत्यापन व डिजिटल PDF देखें:*\n🔗 ${verifyUrl}\n\n🏛️ *पंजीकरण संख्या:* ${
      FOUNDATION_INFO.regNo
    }\n📞 *हेल्पलाइन:* ${FOUNDATION_INFO.phone}\n#JeevanJyotiFoundation #Ghazipur #NGO #SocialService #Seva`;
  };

  // Construct WhatsApp Direct Message
  const getWhatsAppMessage = () => {
    return `🪔 *जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर (उ.प्र.)* 🪔\n(Govt. Reg. No: ${FOUNDATION_INFO.regNo} | NITI Aayog: ${FOUNDATION_INFO.nitiAayogUid})\n━━━━━━━━━━━━━━━━━━━━━\n📜 *${data.titleHindi}*\n_${data.titleEnglish}_\n\n👤 *नाम (Recipient Name):* ${data.recipientName}\n${
      data.fatherName ? `👨‍👦 *पिता/अभिभावक:* ${data.fatherName}\n` : ''
    }🔢 *प्रमाण पत्र / रसीद संख्या:* ${data.certificateNo}\n📅 *दिनांक (Date):* ${
      data.issueDate || new Date().toLocaleDateString('en-GB')
    }\n${
      data.amount ? `💰 *दान राशि:* ₹ ${data.amount.toLocaleString('en-IN')}\n` : ''
    }${
      data.purpose ? `🎯 *उद्देश्य / सेवा क्षेत्र:* ${data.purpose}\n` : ''
    }\n✅ *ऑनलाइन 100% सत्यापन एवं डिजिटल PDF डाउनलोड लिंक:*\n🔗 ${verifyUrl}\n\n🏛️ *पंजीकरण:* ${
      FOUNDATION_INFO.regNo
    }\n📞 *हेल्पलाइन व संपर्क:* ${FOUNDATION_INFO.phone}\n🌐 *आधिकारिक पोर्टल:* https://jeevanjyotifoundation.org\n━━━━━━━━━━━━━━━━━━━━━\n*जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर द्वारा सस्नेह प्रेषित।*`;
  };

  // Construct Email Subject & Body
  const emailSubject = `[जीवन ज्योति फाउंडेशन] आधिकारिक ${data.titleHindi} - ${data.certificateNo} (${data.recipientName})`;

  const emailBody = `आदरणीय ${data.recipientName} जी,

 सादर प्रणाम।

जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर (पंजीकरण सं. ${FOUNDATION_INFO.regNo} | नीति आयोग यूआईडी: ${FOUNDATION_INFO.nitiAayogUid}) द्वारा आपका आधिकारिक "${data.titleHindi}" (${data.titleEnglish}) जारी किया गया है।

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
प्रमाण पत्र एवं रसीद विवरण (Certificate Details):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• प्रमाण पत्र / रसीद संख्या: ${data.certificateNo}
• धारक का नाम: ${data.recipientName}
${data.fatherName ? `• पिता / संरक्षक: ${data.fatherName}\n` : ''}• निर्गत तिथि: ${
    data.issueDate || new Date().toLocaleDateString('en-GB')
  }
${data.amount ? `• दान राशि: ₹ ${data.amount.toLocaleString('en-IN')}\n` : ''}${
    data.purpose ? `• उद्देश्य / सेवा क्षेत्र: ${data.purpose}\n` : ''
  }• पंजीकरण संख्या: ${FOUNDATION_INFO.regNo}
• नीति आयोग UID: ${FOUNDATION_INFO.nitiAayogUid}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
डिजिटल सत्यापन व PDF डाउनलोड लिंक:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
आप नीचे दिए गए आधिकारिक लिंक पर क्लिक करके अपने प्रमाण पत्र का लाइव सत्यापन कर सकते हैं और उच्च-रिज़ॉल्यूशन A4 PDF डाउनलोड/प्रिंट कर सकते हैं:
${verifyUrl}

यदि आपको किसी भी प्रकार की सहायता चाहिए, तो आप हमारी आधिकारिक हेल्पलाइन ${
    FOUNDATION_INFO.phone
  } पर संपर्क कर सकते हैं या ${FOUNDATION_INFO.email} पर ईमेल कर सकते हैं।

सस्नेह एवं ससम्मान,
शैलेश प्रधान (प्रबंधक / सचिव)
जीवन ज्योति फाउंडेशन
मीरानपुर, ग़ाज़ीपुर (उ.प्र.) - 233001
फोन: ${FOUNDATION_INFO.phone}
वेबसाइट: https://jeevanjyotifoundation.org`;

  // Action: Send on WhatsApp (Specific Number)
  const handleSendWhatsApp = () => {
    const cleanDigits = phone.replace(/[^0-9]/g, '');
    if (cleanDigits.length < 10) {
      toast.error('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }

    const fullNumber = `${countryCode.replace('+', '')}${cleanDigits.slice(-10)}`;
    const text = getWhatsAppMessage();
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${fullNumber}&text=${encodeURIComponent(
      text
    )}`;

    window.open(whatsappUrl, '_blank');
    toast.success(`व्हाट्सएप चैट खोली गई (+${fullNumber})`);
  };

  // Action: Instant Broadcast WhatsApp Share (Any chat / Status)
  const handleBroadcastWhatsApp = () => {
    const text = getSocialShareText();
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('व्हाट्सएप शेयर विंडो खोली गई!');
  };

  // Action: Copy Text
  const handleCopyText = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    toast.success('संदेश क्लिपबोर्ड पर कॉपी हो गया!');
    setTimeout(() => setCopiedText(false), 2500);
  };

  // Action: Copy Live Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopiedLink(true);
    toast.success('सत्यापन लिंक कॉपी हो गया!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Action: Native Device Share (Web Share API)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.titleHindi} - जीवन ज्योति फाउंडेशन`,
          text: getSocialShareText(),
          url: verifyUrl
        });
        toast.success('सफलतापूर्वक साझा किया गया!');
      } catch (err) {
        // User dismissed or aborted share
      }
    } else {
      handleBroadcastWhatsApp();
    }
  };

  // Action: Social Direct Channels
  const handleShareTwitter = () => {
    const tweetText = `Jeevan Jyoti Foundation - ${data.titleEnglish} (${data.certificateNo})\nRecipient: ${data.recipientName}`;
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(
        verifyUrl
      )}&via=SHAILESH1666&hashtags=NGO,Ghazipur,SocialService`,
      '_blank'
    );
  };

  const handleShareTelegram = () => {
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(verifyUrl)}&text=${encodeURIComponent(
        getSocialShareText()
      )}`,
      '_blank'
    );
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(verifyUrl)}`,
      '_blank'
    );
  };

  // Action: Send Email (Automated Server API Dispatch with PDF Attachment + Fallback)
  const handleSendEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('कृपया एक वैध ईमेल पता दर्ज करें।');
      return;
    }

    setSendingEmail(true);
    const toastId = toast.loading('ईमेल एवं PDF रसीद प्रेषित की जा रही है...');

    try {
      if (data.certificateType === 'donation_80g') {
        const dummyDonation: DonationRecord = {
          id: data.certificateNo,
          receiptNo: data.certificateNo,
          donorName: data.recipientName,
          fatherName: data.fatherName,
          amount: data.amount || 5000,
          date: data.issueDate || new Date().toISOString(),
          purpose: data.purpose || 'Education & Child Care',
          purposeHindi: data.purpose || 'शिक्षा एवं सामाजिक कल्याण',
          paymentMode: 'Online / UPI',
          transactionRef: `TXN${Date.now().toString().slice(-8)}`,
          taxExemptEligible: true,
          email: email.trim()
        };

        const result = await triggerDonationReceiptEmail({ donation: dummyDonation });
        if (result.success) {
          setEmailSentSuccess(true);
          toast.success(`📩 दान रसीद (PDF) ${email} पर सफलतापूर्वक भेज दी गई!`, { id: toastId });
        } else {
          throw new Error(result.message);
        }
      } else {
        // Direct email fallback for other certificate types
        const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
          emailSubject
        )}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoUrl;
        setEmailSentSuccess(true);
        toast.success(`ईमेल प्रेषण तैयार किया गया: ${email}`, { id: toastId });
      }
    } catch (err: any) {
      console.error('Email dispatch error:', err);
      // Fallback to mailto
      const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoUrl;
      setEmailSentSuccess(true);
      toast.success(`ईमेल क्लाइंट खोला गया (${email})`, { id: toastId });
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xs overflow-y-auto overscroll-contain">
      <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-slate-200 relative my-auto animate-in fade-in zoom-in-95 duration-200">
          {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-black tracking-wider uppercase text-emerald-300">
              प्रमाण पत्र सोशल शेयरिंग व प्रेषण (Instant Social Share)
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
            प्रमाण पत्र एवं उपलब्धि तुरंत साझा करें
          </h3>
          <p className="text-xs text-emerald-100/90 mt-1">
            प्रमाण पत्र संख्या: <strong className="font-mono text-amber-300">{data.certificateNo}</strong> • धारक:{' '}
            <strong className="text-white">{data.recipientName}</strong>
          </p>
        </div>

        {/* Certificate Mini Preview Badge */}
        <div className="bg-emerald-50/70 border-b border-emerald-100 px-5 py-3 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
            <div className="truncate">
              <span className="font-bold text-gray-900 block truncate">{data.titleHindi}</span>
              <span className="text-[11px] text-gray-500 truncate block">{data.titleEnglish}</span>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-1 bg-emerald-600/10 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>सत्यापित (Verified)</span>
          </div>
        </div>

        {/* Quick Social Action Ribbon */}
        <div className="px-5 pt-3 pb-1 flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/60">
          <div className="text-[11px] font-bold text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>त्वरित शेयरिंग विकल्प (Quick Share):</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleBroadcastWhatsApp}
              className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Share on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline text-[11px]">WhatsApp</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300 transition text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Copy Live Verification URL"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5 text-slate-700" />}
              <span className="hidden sm:inline text-[11px]">लिंक कॉपी</span>
            </button>
            {typeof navigator !== 'undefined' && (
              <button
                onClick={handleNativeShare}
                className="p-1.5 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="System Share"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-700" />
                <span className="hidden sm:inline text-[11px]">शेयर</span>
              </button>
            )}
          </div>
        </div>

        {/* Tabs Switcher */}
        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                activeTab === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="truncate">WhatsApp</span>
            </button>

            <button
              onClick={() => setActiveTab('email')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                activeTab === 'email'
                  ? 'bg-[#0024B8] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span className="truncate">Email</span>
            </button>

            <button
              onClick={() => setActiveTab('social')}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs sm:text-sm font-black transition cursor-pointer ${
                activeTab === 'social'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span className="truncate">Social Post</span>
            </button>
          </div>

          {/* TAB 1: WHATSAPP DISPATCH */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>व्हाट्सएप नंबर (WhatsApp Mobile Number) *</span>
                </label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3.5 bg-gray-100 border border-gray-300 rounded-xl text-xs font-bold text-gray-700">
                    {countryCode}
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10 अंकों का मोबाइल नंबर दर्ज करें"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                    className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-gray-500">
                  इस नंबर पर प्रमाण पत्र विवरण व आधिकारिक PDF डाउनलोड लिंक भेजा जाएगा।
                </p>
              </div>

              {/* Message Preview Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>संदेश पूर्वावलोकन (Pre-formatted WhatsApp Message):</span>
                  <button
                    onClick={() => handleCopyText(getWhatsAppMessage())}
                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>कॉपी हो गया</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>कॉपी करें</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 font-mono whitespace-pre-line max-h-36 overflow-y-auto leading-relaxed">
                  {getWhatsAppMessage()}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={handleSendWhatsApp}
                  className="w-full sm:flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>व्हाट्सएप पर भेजें (Send on WhatsApp)</span>
                </button>

                <button
                  onClick={() => handleCopyText(getWhatsAppMessage())}
                  className="w-full sm:w-auto py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition border border-gray-300"
                >
                  <Copy className="w-4 h-4" />
                  <span>कॉपी करें</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: EMAIL DISPATCH */}
          {activeTab === 'email' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#0024B8]" />
                  <span>ईमेल पता (Recipient Email Address) *</span>
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <p className="text-[11px] text-gray-500">
                  इस ईमेल पते पर प्रमाण पत्र, यूआरएन विवरण व सत्यापन लिंक प्रेषित होगा।
                </p>
              </div>

              {/* Subject & Body Preview */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>ईमेल प्रारूप (Formatted Email Body):</span>
                  <button
                    onClick={() => handleCopyText(emailBody)}
                    className="inline-flex items-center gap-1 text-[#0024B8] hover:text-blue-800 font-semibold cursor-pointer"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>कॉपी हुआ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>बॉडी कॉपी करें</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 font-mono whitespace-pre-line max-h-36 overflow-y-auto leading-relaxed">
                  <strong>विषय:</strong> {emailSubject}
                  {'\n\n'}
                  {emailBody}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                  className="w-full sm:flex-1 py-3 px-4 bg-[#0024B8] hover:bg-[#001c90] text-white font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{sendingEmail ? 'ईमेल खुल रहा है...' : 'ईमेल भेजें (Send via Mail Client)'}</span>
                </button>

                <button
                  onClick={() => handleCopyText(emailBody)}
                  className="w-full sm:w-auto py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition border border-gray-300"
                >
                  <Copy className="w-4 h-4" />
                  <span>टेक्स्ट कॉपी करें</span>
                </button>
              </div>

              {emailSentSuccess && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>ईमेल प्रेषण विवरण तैयार किया गया।</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SOCIAL POST & BROADCAST */}
          {activeTab === 'social' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-purple-600" />
                  <span>सोशल मीडिया शेयरिंग प्रारूप (Achievement Post):</span>
                </label>
                <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-xl text-[11px] text-purple-950 font-mono whitespace-pre-line max-h-36 overflow-y-auto leading-relaxed">
                  {getSocialShareText()}
                </div>
              </div>

              {/* Social Platform Grid Buttons */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  सोशल नेटवर्क चुनें (Choose Platform):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={handleBroadcastWhatsApp}
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={handleShareTelegram}
                    className="p-2.5 bg-[#229ED9] hover:bg-[#1c8ec4] text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                  </button>

                  <button
                    onClick={handleShareTwitter}
                    className="p-2.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition shadow-xs"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>X / Twitter</span>
                  </button>

                  <button
                    onClick={handleShareFacebook}
                    className="p-2.5 bg-[#1877F2] hover:bg-[#1466d2] text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Facebook</span>
                  </button>
                </div>
              </div>

              {/* System Native Share or Copy Post */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={handleNativeShare}
                  className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>उपलब्धि साझा करें (Share Achievement)</span>
                </button>

                <button
                  onClick={() => handleCopyText(getSocialShareText())}
                  className="w-full sm:w-auto py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition border border-gray-300"
                >
                  <Copy className="w-4 h-4" />
                  <span>पोस्ट कॉपी करें</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>जीवन ज्योति फाउंडेशन • 100% पारदर्शी डिजिटल रिकॉर्ड्स</span>
          <button onClick={onClose} className="font-bold text-slate-700 hover:underline cursor-pointer">
            बंद करें (Close)
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SendCertificateModal;
