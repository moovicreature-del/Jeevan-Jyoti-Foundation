import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  RefreshCw,
  Lock,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Send
} from 'lucide-react';
import {
  sendRealOtp,
  verifyRealOtp,
  normalizeIndianPhone,
  maskPhoneNumber,
  isPhoneMatchingRegistered
} from '../services/realSmsOtpService';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber?: string;
  onSuccess: () => void;
  certificateId?: string;
  recipientName?: string;
  certificateType?: string;
  title?: string;
  subtitle?: string;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  phoneNumber = '',
  onSuccess,
  certificateId,
  recipientName,
  certificateType,
  title = 'प्रमाण पत्र डाउनलोड - मोबाइल OTP सत्यापन',
  subtitle = 'आधिकारिक प्रमाण पत्र सुरक्षा हेतु पंजीकरण फॉर्म में दर्ज मोबाइल नंबर पर OTP सत्यापन अनिवार्य है।'
}) => {
  const registeredPhoneClean = normalizeIndianPhone(phoneNumber);
  const isPhonePreRegistered = Boolean(registeredPhoneClean && registeredPhoneClean.length === 10);

  const [inputPhone, setInputPhone] = useState(registeredPhoneClean || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
  const [deliveryNote, setDeliveryNote] = useState<string | null>(null);

  const initialSendTriggered = useRef(false);

  // Initialize or reset when modal opens
  useEffect(() => {
    if (isOpen) {
      const clean = normalizeIndianPhone(phoneNumber);
      setInputPhone(clean || '');
      setOtp(['', '', '', '', '', '']);
      setSessionToken(null);
      setIsVerifying(false);
      setVerified(false);
      setErrorMsg(null);
      setStatusMsg(null);
      setResendTimer(45);
      setCanResend(false);
      setWhatsappLink(null);
      setDeliveryNote(null);
      initialSendTriggered.current = false;

      // If registered phone number is already present in certificate, send OTP automatically
      if (clean && clean.length === 10) {
        triggerSendOtp(clean);
      }
    }
  }, [isOpen, phoneNumber]);

  // Resend Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && resendTimer > 0 && !verified) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, resendTimer, verified]);

  if (!isOpen) return null;

  const currentPhone = isPhonePreRegistered ? registeredPhoneClean : normalizeIndianPhone(inputPhone);

  const triggerSendOtp = async (targetPhone: string, channel: 'sms' | 'whatsapp' = 'sms') => {
    const clean = normalizeIndianPhone(targetPhone);
    if (!clean || clean.length !== 10) {
      setErrorMsg('⚠️ कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें (उदा. 8052361666)।');
      return;
    }

    if (isPhonePreRegistered && !isPhoneMatchingRegistered(clean, registeredPhoneClean)) {
      setErrorMsg('⛔ सुरक्षा त्रुटि: केवल पंजीकरण फॉर्म में दर्ज मोबाइल नंबर पर ही OTP भेजा जा सकता है।');
      return;
    }

    setIsSendingOtp(true);
    setErrorMsg(null);
    setStatusMsg(`📡 पंजीकृत मोबाइल +91 ${clean.slice(0, 3)}••••${clean.slice(-3)} पर वास्तविक OTP प्रेषित किया जा रहा है...`);

    try {
      const res = await sendRealOtp({
        phone: clean,
        certificateId,
        recipientName,
        certificateType,
        preferredChannel: channel
      });

      setIsSendingOtp(false);

      if (res.success) {
        setSessionToken(res.sessionToken || null);
        setStatusMsg(res.message);
        setDeliveryNote(res.deliveryStatus || 'SMS Gateway द्वारा प्रेषित');
        if (res.whatsappUrl) {
          setWhatsappLink(res.whatsappUrl);
        }
        setResendTimer(45);
        setCanResend(false);
        setTimeout(() => {
          document.getElementById('real-cert-otp-0')?.focus();
        }, 150);
      } else {
        setErrorMsg(res.message || 'OTP भेजने में समस्या आई।');
        setCanResend(true);
      }
    } catch (err: any) {
      setIsSendingOtp(false);
      setErrorMsg(err.message || 'नेटवर्क त्रुटि: OTP भेजा नहीं जा सका।');
      setCanResend(true);
    }
  };

  const handleOtpChange = (val: string, index: number) => {
    const cleanVal = val.replace(/\D/g, '');
    if (!cleanVal && val !== '') return;

    // Support paste of entire 6-digit code
    if (cleanVal.length === 6) {
      const chars = cleanVal.split('').slice(0, 6);
      setOtp(chars);
      setErrorMsg(null);
      document.getElementById('real-cert-otp-5')?.focus();
      return;
    }

    const char = cleanVal.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);
    setErrorMsg(null);

    // Auto-focus next input
    if (char && index < 5) {
      const nextInput = document.getElementById(`real-cert-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`real-cert-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
    if (pastedData.length >= 6) {
      const chars = pastedData.slice(0, 6).split('');
      setOtp(chars);
      setErrorMsg(null);
      document.getElementById('real-cert-otp-5')?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredCode = otp.join('');
    if (enteredCode.length !== 6) {
      setErrorMsg('⚠️ कृपया पूर्ण 6-अंकीय OTP कोड दर्ज करें।');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const result = await verifyRealOtp({
        phone: currentPhone,
        otp: enteredCode,
        sessionToken: sessionToken || undefined,
        certificateId
      });

      setIsVerifying(false);

      if (result.verified) {
        setVerified(true);
        setStatusMsg('✓ मोबाइल नंबर सफल सत्यापित! आधिकारिक प्रमाण पत्र डाउनलोड हो रहा है...');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1100);
      } else {
        setErrorMsg(result.message || 'अमान्य OTP कोड।');
      }
    } catch (err: any) {
      setIsVerifying(false);
      setErrorMsg(err.message || 'सत्यापन में त्रुटि आई। कृपया पुनः प्रयास करें।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs overflow-y-auto overscroll-contain no-print flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-amber-400 overflow-hidden text-center animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#8B0000] via-red-800 to-amber-900 text-white px-6 py-4 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 text-amber-200 hover:text-white bg-black/20 hover:bg-black/40 rounded-full cursor-pointer transition-colors"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-amber-400/20 border border-amber-300/40 text-amber-300 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-inner">
            <KeyRound className="w-6 h-6" />
          </div>

          <h3 className="text-base sm:text-lg font-black text-amber-100 font-serif leading-tight">
            {title}
          </h3>
          <p className="text-[11px] text-amber-200/90 mt-1 font-medium">
            {subtitle}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Registered Phone Banner */}
          <div className="bg-amber-50/90 border border-amber-300/80 rounded-2xl p-3 text-left">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-200/70 flex items-center justify-center text-amber-900 shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    {isPhonePreRegistered ? 'पंजीकरण फॉर्म में दर्ज अधिकृत मोबाइल' : 'पंजीकृत मोबाइल नंबर दर्ज करें'}
                  </span>
                  <span className="font-mono font-black text-slate-900 text-sm">
                    {isPhonePreRegistered ? maskPhoneNumber(registeredPhoneClean) : (
                      <input
                        type="tel"
                        maxLength={10}
                        value={inputPhone}
                        onChange={(e) => setInputPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="10 अंकों का मोबाइल नंबर"
                        className="bg-white border border-amber-300 rounded px-2 py-0.5 text-xs font-mono font-bold w-40 text-slate-900 focus:outline-amber-600"
                      />
                    )}
                  </span>
                </div>
              </div>

              {isPhonePreRegistered ? (
                <div className="flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-300 shrink-0">
                  <Lock className="w-3 h-3 text-emerald-700" />
                  <span>पंजीकृत व सुरक्षित</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => triggerSendOtp(inputPhone)}
                  disabled={isSendingOtp || inputPhone.length !== 10}
                  className="bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                >
                  <Send className="w-3 h-3" />
                  <span>OTP भेजें</span>
                </button>
              )}
            </div>

            <p className="text-[10px] text-amber-800/80 mt-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>प्रमाण पत्र सुरक्षा: डाउनलोड हेतु केवल पंजीकरण रिकॉर्ड वाले मोबाइल पर ही OTP प्रेषित किया जाता है।</span>
            </p>
          </div>

          {verified ? (
            /* Success State */
            <div className="py-6 space-y-2 bg-emerald-50 rounded-2xl border border-emerald-300 p-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
              <p className="text-base font-black text-emerald-900">OTP सत्यापन 100% सफल!</p>
              <p className="text-xs text-emerald-700 font-medium">
                आधिकारिक उच्च-गुणवत्ता प्रमाण पत्र (PDF/JPG) डाउनलोड हो रहा है...
              </p>
            </div>
          ) : (
            /* OTP Input Form */
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-2 block">
                  मोबाइल पर प्राप्त 6-अंकीय OTP कोड दर्ज करें:
                </label>

                {/* 6 Digit Input Boxes */}
                <div className="flex justify-center gap-2 sm:gap-2.5">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`real-cert-otp-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      onPaste={idx === 0 ? handlePaste : undefined}
                      className="w-10 sm:w-11 h-12 sm:h-13 text-center text-xl sm:text-2xl font-mono font-black border-2 border-slate-300 focus:border-amber-600 rounded-xl focus:outline-none bg-slate-50 focus:bg-white transition-all shadow-inner text-slate-900"
                    />
                  ))}
                </div>
              </div>

              {/* Status or Error Notifications */}
              {errorMsg && (
                <div className="p-2.5 bg-red-50 border border-red-300 rounded-xl flex items-center gap-2 text-left text-xs font-bold text-red-800 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {statusMsg && !errorMsg && (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] font-semibold text-amber-900 text-center animate-in fade-in duration-150">
                  {statusMsg}
                  {deliveryNote && (
                    <span className="block text-[10px] text-emerald-700 font-bold mt-0.5">
                      ✓ {deliveryNote}
                    </span>
                  )}
                </div>
              )}

              {/* Verify & Download Button */}
              <button
                onClick={handleVerify}
                disabled={isVerifying || otp.join('').length !== 6 || isSendingOtp}
                className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-[#8B0000] to-red-900 hover:from-[#700000] hover:to-red-950 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>सत्यापित किया जा रहा है...</span>
                  </>
                ) : (
                  <>
                    <span>सत्यापित करें व डाउनलोड करें</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Resend SMS & WhatsApp Fallback Channel */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-600 px-1">
                  <span>SMS प्राप्त नहीं हुआ?</span>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={() => triggerSendOtp(currentPhone, 'sms')}
                      disabled={isSendingOtp}
                      className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer underline disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? 'animate-spin' : ''}`} />
                      <span>पुनः SMS भेजें</span>
                    </button>
                  ) : (
                    <span className="text-slate-500 font-medium">
                      पुनः भेजें: <strong className="font-mono text-slate-800">{resendTimer}s</strong>
                    </span>
                  )}
                </div>

                {/* Instant WhatsApp Real Delivery Option */}
                {whatsappLink && (
                  <div className="bg-emerald-50 border border-emerald-300/80 rounded-xl p-2.5 flex items-center justify-between text-left">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <MessageSquare className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-[11px] text-emerald-900 font-semibold leading-tight">
                        <span>दूरसंचार DND या SMS देरी?</span>
                        <span className="block text-[10px] text-emerald-700 font-normal">
                          WhatsApp पर भी तत्काल OTP प्राप्त करें
                        </span>
                      </div>
                    </div>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg shadow-xs transition-colors shrink-0"
                    >
                      <span>WhatsApp OTP</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Official Seal Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>NITI Aayog (UP/2018/0207700) एवं ISO 9001:2015 सुरक्षित OTP गेटवे</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OtpVerificationModal;
