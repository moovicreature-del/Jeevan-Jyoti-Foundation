// ============================================================================
// JEEVAN JYOTI FOUNDATION - OFFICIAL DONATION RECEIPT (A4 PDF READY)
// आधिकारिक दान रसीद - जीवन ज्योति फाउंडेशन
// ============================================================================

import React, { useRef, useState } from 'react';
import {
  Download,
  Printer,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Globe,
  FileCheck,
  Copy,
  Check,
  X,
  ExternalLink,
  Sparkles,
  Award
} from 'lucide-react';
import { DonationRecord } from '../../types';
import { FOUNDATION_INFO } from '../../data/foundationData';
import { BrandLogo } from '../common/BrandLogo';
import { RoyalFourCorners, RoyalCenterFlourish } from '../common/RoyalCertificateBorder';
import { ShaileshPradhanSignatureBlock, NgoRoundSeal } from '../DigitalSignature';
import { RoyalCertificateSeal } from '../common/RoyalCertificateSeal';
import { CertificateVerificationQR } from '../CertificateVerificationQR';
import { amountToWordsIndian } from '../../utils/numberToWords';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import { SendCertificateModal, CertificateShareData } from '../SendCertificateModal';
import { triggerDonationReceiptEmail } from '../../services/emailService';
import { useDonationPaymentSettings } from '../../hooks/useDonationPaymentSettings';
import { OfficialVerifiedBadge } from '../common/OfficialVerifiedBadge';
import { OtpVerificationModal } from '../OtpVerificationModal';

interface Props {
  donation: DonationRecord;
  onClose?: () => void;
  onDonationSelect?: (don: DonationRecord) => void;
}

export const Donation80GReceiptView: React.FC<Props> = ({
  donation,
  onClose
}) => {
  const { settings: paymentSettings } = useDonationPaymentSettings();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareModalTab, setShareModalTab] = useState<'whatsapp' | 'email'>('whatsapp');
  const [isSendingEmailDirect, setIsSendingEmailDirect] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'pdf' | 'print' | null>(null);
  const [emailStatusMessage, setEmailStatusMessage] = useState<string | null>(
    donation.email ? `रसीद ईमेल पर भेजी गई: ${donation.email}` : null
  );

  // Format Receipt Number e.g. JJF/DON/2026/0001
  const receiptNumber = donation.receiptNo || (
    donation.id.startsWith('JJF/DON')
      ? donation.id
      : `JJF/DON/2026/${donation.id.replace(/[^0-9]/g, '').slice(-4).padStart(4, '0') || '0001'}`
  );

  // Format Date
  const donationDate = donation.date
    ? new Date(donation.date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

  const amountInWords = donation.amountInWords || amountToWordsIndian(donation.amount);

  // Direct Verification URL
  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/?verify=${encodeURIComponent(receiptNumber)}`
    : `https://jeevanjyotifoundation.org/?verify=${encodeURIComponent(receiptNumber)}`;

  // Handle Instant A4 PDF Download
  const executeDownloadPdf = async () => {
    if (!receiptRef.current) return;
    setIsGeneratingPdf(true);
    const toastId = toast.loading('उच्च गुणवत्ता A4 दान रसीद PDF तैयार हो रही है...');

    try {
      // Create high-res canvas
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#FFFFFF',
        windowWidth: 800
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      pdf.save(`Donation_Receipt_${receiptNumber.replace(/[\/\\]/g, '_')}_${donation.donorName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);

      toast.success('दान रसीद PDF सफलतापूर्वक डाउनलोड हो गई!', { id: toastId });
    } catch (err) {
      console.error('PDF Generation error:', err);
      toast.error('PDF बनाने में त्रुटि आई। कृपया प्रिंट विकल्प का प्रयोग करें।', { id: toastId });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleInitiateDownloadPdf = () => {
    setPendingAction('pdf');
    setIsOtpOpen(true);
  };

  // Handle Native Print
  const handleInitiatePrint = () => {
    setPendingAction('print');
    setIsOtpOpen(true);
  };

  const handleOtpVerified = () => {
    if (pendingAction === 'pdf') {
      executeDownloadPdf();
    } else if (pendingAction === 'print') {
      window.print();
    }
    setPendingAction(null);
  };

  // Copy Verification Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopiedLink(true);
    toast.success('सत्यापन लिंक कॉपी हो गया!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Handle Instant Direct Automated Email Trigger with PDF Receipt
  const handleDirectEmailResend = async () => {
    const targetEmail = donation.email || prompt('कृपया दान रसीद PDF प्राप्त करने हेतु ईमेल पता दर्ज करें:', 'moovicreature@gmail.com');
    if (!targetEmail || !targetEmail.includes('@')) {
      toast.error('मान्य ईमेल पता दर्ज करना आवश्यक है।');
      return;
    }

    setIsSendingEmailDirect(true);
    const toastId = toast.loading(`ईमेल (${targetEmail}) पर PDF रसीद भेजी जा रही है...`);

    try {
      const result = await triggerDonationReceiptEmail({
        donation: {
          ...donation,
          email: targetEmail
        }
      });

      if (result.success) {
        setEmailStatusMessage(`दान रसीद PDF सफलतापूर्वक भेजी गई: ${targetEmail}`);
        toast.success(`📩 दान रसीद PDF आपके ईमेल (${targetEmail}) पर प्रेषित हो गई!`, { id: toastId });
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      console.error(err);
      toast.error('ईमेल प्रेषण में समस्या आई। शेयर डायलॉग खोला जा रहा है...', { id: toastId });
      setShareModalTab('email');
      setShareModalOpen(true);
    } finally {
      setIsSendingEmailDirect(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-200 print:border-0 print:shadow-none my-auto">
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 print:hidden border-b border-amber-500/30">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="font-bold text-sm sm:text-base text-amber-200">
                आधिकारिक दान रसीद (Official Donation Receipt)
              </span>
              <span className="text-[11px] text-gray-300 block">
                रसीद क्रमांक: <strong className="font-mono text-white">{receiptNumber}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Direct Send/Resend Email Button */}
            <button
              onClick={handleDirectEmailResend}
              disabled={isSendingEmailDirect}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              title="Automated Email PDF Dispatch"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isSendingEmailDirect ? 'ईमेल भेजी जा रही...' : 'PDF ईमेल भेजें'}</span>
            </button>

            {/* Send on WhatsApp Button */}
            <button
              onClick={() => {
                setShareModalTab('whatsapp');
                setShareModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Send Receipt to WhatsApp Number"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handleInitiatePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer shadow-xs border border-white/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट</span>
            </button>

            {/* Download PDF Button */}
            <button
              onClick={handleInitiateDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs sm:text-sm font-black rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isGeneratingPdf ? 'PDF तैयार हो रही...' : 'डाउनलोड A4 PDF'}</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors ml-1 cursor-pointer"
                title="बंद करें"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Live Email Confirmation Banner if dispatched */}
        {emailStatusMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-800 flex items-center justify-between print:hidden">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {emailStatusMessage}
            </span>
            <span className="text-[11px] font-normal text-emerald-600">
              PDF संलग्न
            </span>
          </div>
        )}

        {/* Certificate Container with Royal Heritage Styling */}
        <div className="p-2 sm:p-6 bg-slate-100/90 overflow-x-auto print:p-0 print:bg-white">
          <div
            ref={receiptRef}
            id="a4-donation-receipt"
            className="w-full max-w-[780px] mx-auto bg-white rounded-2xl p-4 sm:p-7 relative select-none print:p-6 print:m-0 print:w-full print:max-w-none print:rounded-none"
            style={{
              border: '9px solid #8B0000',
              boxShadow: '0 0 0 3px #D4AF37, 0 0 0 6px #700000, 0 12px 35px rgba(139, 0, 0, 0.25)',
              backgroundColor: '#FFFDF8'
            }}
          >
            {/* Inner Border with Royal Inlay */}
            <div
              className="relative p-6 sm:p-8 bg-[#FFFEFC] rounded-xl overflow-hidden"
              style={{
                border: '2.5px double #D4AF37',
                outline: '1px dashed rgba(212, 175, 55, 0.5)',
                outlineOffset: '-5px',
                minHeight: '1020px'
              }}
            >
              {/* Royal Vector Corner Ornaments */}
              <RoyalFourCorners color="#D4AF37" size={54} />

              {/* Background Watermark using BrandLogo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <BrandLogo size={420} watermark opacity={0.06} />
              </div>

              {/* Content Layer */}
              <div className="relative z-10 space-y-4">
                {/* 1. HEADER: Foundation Full Details & Logo */}
                <div className="text-center space-y-2 border-b-2 border-amber-300/80 pb-4">
                  <div className="flex justify-center">
                    <BrandLogo size={85} className="drop-shadow-xs mx-auto" id="receipt-main-logo" />
                  </div>

                  <div>
                    <h1 className="text-xl sm:text-2xl font-black tracking-wide text-[#8B0000] uppercase font-serif">
                      {FOUNDATION_INFO.nameEnglish}
                    </h1>
                    <p className="text-sm font-bold text-amber-900">
                      {FOUNDATION_INFO.nameHindi}
                    </p>
                    <p className="text-[11px] sm:text-xs text-gray-700 max-w-xl mx-auto mt-1 leading-relaxed font-medium">
                      {FOUNDATION_INFO.fullAddressEnglish}
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[10.5px] text-gray-600 font-medium mt-1">
                      <span><strong>Phone:</strong> {paymentSettings.contactPhone || FOUNDATION_INFO.phone}</span>
                      <span>•</span>
                      <span><strong>Email:</strong> {paymentSettings.contactEmail || FOUNDATION_INFO.email}</span>
                      <span>•</span>
                      <span><strong>Website:</strong> {FOUNDATION_INFO.website}</span>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-2 mt-1.5 text-[10px] font-bold">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded">
                        NITI Aayog Darpan: {paymentSettings.nitiAayogUid || FOUNDATION_INFO.nitiAayogUid}
                      </span>
                      <span className="px-2 py-0.5 bg-indigo-100 text-[#0024B8] border border-indigo-300 rounded">
                        NGO Reg No: {FOUNDATION_INFO.regNo}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. SUB-HEADER: "OFFICIAL DONATION RECEIPT" in Bold Box */}
                <div className="bg-gradient-to-r from-[#0024B8] via-indigo-800 to-[#0024B8] border-indigo-600 text-white py-2 px-4 rounded-lg shadow-sm border flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-200" />
                    <span className="text-sm sm:text-base font-black tracking-wider uppercase drop-shadow-xs">
                      OFFICIAL DONATION RECEIPT / आधिकारिक दान रसीद
                    </span>
                  </div>
                  <div className="text-right text-xs">
                    <span className="bg-white/20 px-2.5 py-0.5 rounded font-mono font-bold">
                      सामान्य समाज-कल्याण दान
                    </span>
                  </div>
                </div>

                {/* Receipt Metadata Row */}
                <div className="flex flex-wrap items-center justify-between text-xs bg-amber-50/80 px-3.5 py-2 rounded-lg border border-amber-200 font-medium">
                  <div>
                    <span className="text-gray-600">Receipt No: </span>
                    <strong className="font-mono text-[#0024B8] text-sm">{receiptNumber}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600">Date: </span>
                    <strong className="text-gray-900">{donationDate}</strong>
                  </div>
                  <div>
                    <span className="text-gray-600">Financial Year: </span>
                    <strong className="text-gray-900">2025-2026 / 2026-2027</strong>
                  </div>
                </div>

                {/* 3. DONOR DETAILS TABLE */}
                <div className="overflow-hidden rounded-lg border-2 border-amber-300">
                  <div className="bg-[#0024B8] text-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>Donor Details (दानदाता विवरण)</span>
                    <span className="text-[10px] text-amber-200">
                      Official Registered Receipt
                    </span>
                  </div>
                  <table className="w-full text-left text-xs border-collapse bg-white">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="w-1/3 py-2 px-3 bg-amber-50/50 font-semibold text-gray-700 border-r border-gray-200">
                          Name of Donor (दानदाता का नाम):
                        </td>
                        <td className="py-2 px-3 font-bold text-gray-900 text-sm">
                          {donation.donorName}
                        </td>
                      </tr>
                      {donation.fatherName && (
                        <tr className="border-b border-gray-200">
                          <td className="py-2 px-3 bg-amber-50/50 font-semibold text-gray-700 border-r border-gray-200">
                            Father's Name (पिता का नाम):
                          </td>
                          <td className="py-2 px-3 font-medium text-gray-800">
                            {donation.fatherName}
                          </td>
                        </tr>
                      )}
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-3 bg-amber-50/50 font-semibold text-gray-700 border-r border-gray-200">
                          Donor PAN (पैन नंबर):
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-[#0024B8]">
                          {donation.panNumber ? donation.panNumber.toUpperCase() : 'NOT PROVIDED / OPTIONAL'}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-3 bg-amber-50/50 font-semibold text-gray-700 border-r border-gray-200">
                          Address (पता):
                        </td>
                        <td className="py-2 px-3 text-gray-800">
                          {donation.address || donation.city || 'Ghazipur, Uttar Pradesh, India'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 bg-amber-50/50 font-semibold text-gray-700 border-r border-gray-200">
                          Contact (सम्पर्क विवरण):
                        </td>
                        <td className="py-2 px-3 text-gray-800">
                          <span><strong>Email:</strong> {donation.email || 'N/A'}</span>
                          <span className="mx-2">•</span>
                          <span><strong>Phone:</strong> {donation.phone || 'N/A'}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 4. DONATION DETAILS TABLE */}
                <div className="overflow-hidden rounded-lg border-2 border-emerald-400">
                  <div className="bg-[#2E8B57] text-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>Donation & Payment Details (दान एवं भुगतान विवरण)</span>
                    <span className="text-[10px] text-emerald-100">Official Receipt</span>
                  </div>
                  <table className="w-full text-left text-xs border-collapse bg-white">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="w-1/3 py-2 px-3 bg-emerald-50/50 font-semibold text-gray-700 border-r border-gray-200">
                          Date of Donation (दान तिथि):
                        </td>
                        <td className="py-2 px-3 font-medium text-gray-900">
                          {donationDate}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-3 bg-emerald-50/50 font-semibold text-gray-700 border-r border-gray-200">
                          Mode of Payment (भुगतान माध्यम):
                        </td>
                        <td className="py-2 px-3 font-medium text-gray-800">
                          <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-800 font-semibold rounded mr-2">
                            {donation.paymentMode || 'UPI / Online Razorpay'}
                          </span>
                          <span>({donation.donationType === 'monthly' ? 'मासिक सहयोग / Monthly' : 'एकमुश्त / One-Time'})</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-3 bg-emerald-50/50 font-semibold text-gray-700 border-r border-gray-200">
                          Transaction ID / UTR No:
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-gray-900">
                          {donation.transactionRef || `UPI/JJF/${Date.now().toString().slice(-8)}`}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-3 bg-emerald-50/50 font-semibold text-gray-700 border-r border-gray-200">
                          Amount in Figures (दान राशि):
                        </td>
                        <td className="py-2 px-3 font-black text-base text-[#2E8B57]">
                          ₹ {donation.amount.toLocaleString('en-IN')}/-
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-3 bg-emerald-50/50 font-semibold text-gray-700 border-r border-gray-200">
                          Amount in Words (शब्दों में राशि):
                        </td>
                        <td className="py-2 px-3 font-bold text-gray-900 italic">
                          {amountInWords}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 bg-emerald-50/50 font-semibold text-gray-700 border-r border-gray-200">
                          Purpose of Donation (दान का उद्देश्य):
                        </td>
                        <td className="py-2 px-3 font-semibold text-[#0024B8]">
                          {donation.purposeHindi || donation.purpose || 'शिक्षा, भोजन एवं समग्र सामाजिक उत्थान (Shiksha, Bhojan & General Welfare)'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* 5. STATUTORY CERTIFICATE CLAUSE BOX */}
                <div className="p-3 bg-amber-50/90 rounded-lg border border-amber-300 text-[11px] sm:text-xs text-gray-800 leading-relaxed space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-amber-700" />
                    <span>
                      Official NGO Donation Certification (आधिकारिक प्रमाणन):
                    </span>
                  </div>
                  <p className="italic text-gray-700">
                    "This is to certify that the above contribution has been received as a voluntary donation by Jeevan Jyoti Foundation, Ghazipur, Uttar Pradesh, India towards humanitarian, education and social welfare initiatives."
                  </p>
                  <div className="pt-1 flex flex-wrap items-center justify-between text-[10px] text-gray-600 border-t border-amber-200">
                    <span><strong>NGO PAN:</strong> {FOUNDATION_INFO.pan}</span>
                    <span><strong>NGO Reg No:</strong> {FOUNDATION_INFO.regNo}</span>
                    <span><strong>NITI Aayog UID:</strong> {FOUNDATION_INFO.nitiAayogUid}</span>
                    <span><strong>Social Contribution</strong></span>
                  </div>
                </div>

                {/* 6. Single-Line Balanced Footer - 3 Pillars */}
                <div className="pt-[clamp(6px,1.2cqw,12px)] border-t-2 border-amber-300/80 grid grid-cols-3 items-center gap-[clamp(6px,1.5cqw,14px)] select-none">
                  {/* COLUMN 1 (LEFT): Official Live Verification QR Code */}
                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-[#FFFDF8] border border-emerald-300/80 rounded-lg sm:rounded-xl shadow-2xs text-left w-full max-w-[clamp(175px,30cqw,250px)]">
                    <div className="shrink-0 p-0.5 sm:p-1 bg-white border border-emerald-400 rounded-md sm:rounded-lg shadow-2xs">
                      <CertificateVerificationQR
                        certificateId={receiptNumber}
                        size="auto"
                        showId={false}
                        subText=""
                      />
                    </div>
                    <div className="flex-1 min-w-0 font-sans text-[clamp(6.5pt,0.85cqw,8pt)] leading-tight space-y-0.5 text-gray-800">
                      <div className="text-[clamp(6pt,0.8cqw,7pt)] font-black text-emerald-900 uppercase tracking-wider truncate">
                        OFFICIAL VALIDATED QR
                      </div>
                      <div className="truncate">
                        <strong className="text-black font-black">Receipt No:</strong>{' '}
                        <span className="font-mono font-bold text-emerald-900 text-[clamp(7pt,0.9cqw,8pt)] block truncate">{receiptNumber}</span>
                      </div>
                      <div className="truncate">
                        <strong className="text-black font-black">Reg No:</strong>{' '}
                        <span className="font-mono text-black text-[clamp(6.5pt,0.8cqw,7.5pt)]">{FOUNDATION_INFO.regNo}</span>
                      </div>
                      <div className="text-[clamp(5.5pt,0.75cqw,6.5pt)] text-emerald-800 font-bold truncate">
                        ✓ Scan to Verify Receipt
                      </div>
                    </div>
                  </div>

                  {/* COLUMN 2 (CENTER): Royal Official Embossed NGO Seal */}
                  <div className="flex flex-col items-center justify-center text-center px-0.5 sm:px-1 w-full">
                    <RoyalCertificateSeal
                      size="sm"
                      variant="emerald-gold"
                      showRibbons={true}
                      className="max-w-[72px] sm:max-w-[76px]"
                    />
                    <div className="text-[clamp(6pt,0.8cqw,7.5pt)] font-extrabold uppercase tracking-widest text-[#065F46] mt-0.5 sm:mt-1 text-center truncate max-w-full">
                      आधिकारिक राजकीय मुहर
                    </div>
                  </div>

                  {/* COLUMN 3 (RIGHT): Authorised Signatory */}
                  <div className="text-right flex flex-col items-end justify-center w-full">
                    <ShaileshPradhanSignatureBlock
                      className="items-end w-full max-w-[clamp(175px,30cqw,250px)]"
                      align="right"
                      imgClassName="w-full max-w-[clamp(115px,16cqw,165px)] h-auto mb-0.5 ml-auto"
                    />
                  </div>
                </div>

                {/* Statutory Note */}
                <div className="text-center text-[9.5px] text-gray-500 italic pt-1 border-t border-gray-100">
                  Note: "This is a computer generated digital receipt and does not require physical signature."
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share / Send via WhatsApp & Email Modal */}
      {shareModalOpen && (
        <SendCertificateModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          defaultTab={shareModalTab}
          data={{
            certificateType: 'donation_80g',
            titleHindi: 'आधिकारिक दान रसीद',
            titleEnglish: 'Official Donation Receipt',
            recipientName: donation.donorName,
            fatherName: donation.fatherName,
            certificateNo: receiptNumber,
            issueDate: donation.date ? new Date(donation.date).toLocaleDateString('en-GB') : undefined,
            recipientPhone: donation.phone,
            recipientEmail: donation.email,
            amount: donation.amount,
            purpose: donation.purposeHindi || donation.purpose || 'General Social Welfare',
            qrVerifyUrl: verifyUrl
          }}
        />
      )}

      {/* Mandatory OTP Verification Modal before PDF Download / Print */}
      {isOtpOpen && (
        <OtpVerificationModal
          isOpen={isOtpOpen}
          onClose={() => setIsOtpOpen(false)}
          phoneNumber={donation.phone || ''}
          onSuccess={handleOtpVerified}
          certificateId={receiptNumber}
          recipientName={donation.donorName}
          certificateType="donation_80g"
          title="दान रसीद - पंजीकृत मोबाइल OTP सत्यापन"
          subtitle="सुरक्षा एवं आधिकारिक सत्यापन हेतु दान पंजीकरण में दर्ज मोबाइल नंबर पर 6-अंकीय OTP सत्यापन अनिवार्य है।"
        />
      )}
    </div>
  );
};

export default Donation80GReceiptView;
