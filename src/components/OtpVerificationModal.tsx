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
  Send,
  Check
} from 'lucide-react';
import {
  sendRealOtp,
  verifyRealOtp,
  normalizeIndianPhone,
  maskPhoneNumber,
  isPhoneMatchingRegistered,
  autoOpenWhatsAppOtp
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
  title = 'प्रमाण पत्र / पहचान पत्र - मोबाइल OTP सत्यापन',
  subtitle = 'रजिस्ट्रेशन फॉर्म में भरे गए मोबाइल नंबर पर OTP सत्यापन के बाद ही प्रमाण पत्र / आई-कार्ड डाउनलोड होगा।'
}) => {
  const registeredPhoneClean = normalizeIndianPhone(phoneNumber);
  const isPhonePreRegistered = Boolean(registeredPhoneClean && registeredPhoneClean.length === 10);

  // Step: 'enter_phone' -> 'enter_otp'
  const [step, setStep] = useState<'enter_phone' | 'enter_otp'>('enter_phone');
  // Manual entry - strictly starts empty, NEVER pre-filled with registered number
  const [manualPhone, setManualPhone] = useState('');
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

  // Reset when modal opens - strictly keep phone input empty for manual entry
  useEffect(() => {
    if (isOpen) {
      setStep('enter_phone');
      setManualPhone('');
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
    }
  }, [isOpen]);

  // Resend Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && step === 'enter_otp' && resendTimer > 0 && !verified) {
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
  }, [isOpen, step, resendTimer, verified]);

  if (!isOpen) return null;

  const handleSendOtp = async (channel: 'sms' | 'whatsapp' = 'sms') => {
    const clean = normalizeIndianPhone(manualPhone);
    setErrorMsg(null);

    if (!clean || clean.length !== 10) {
      setErrorMsg('⚠️ कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें (उदा. 8052361666)।');
      return;
    }

    // Strict security check: entered number MUST match the registration record
    if (isPhonePreRegistered && !isPhoneMatchingRegistered(clean, registeredPhoneClean)) {
      setErrorMsg(
        '⛔ सुरक्षा त्रुटि: दर्ज मोबाइल नंबर इस प्रमाण पत्र/पहचान पत्र के पंजीकरण रिकॉर्ड से मेल नहीं खाता। कृपया फॉर्म में भरा गया सही मोबाइल नंबर दर्ज करें।'
      );
      return;
    }

    setIsSendingOtp(true);
    setStatusMsg(`📡 मोबाइल +91 ${clean.slice(0, 3)}••••${clean.slice(-3)} पर वास्तविक OTP प्रेषित किया जा रहा है...`);

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
          // Automatically dispatch OTP to WhatsApp in new tab/window
          autoOpenWhatsAppOtp(res.whatsappUrl);
        }
        setStep('enter_otp');
        setResendTimer(45);
        setCanResend(false);
        setTimeout(() => {
          document.getElementById('real-cert-otp-0')?.focus();
        }, 200);
      } else {
        setErrorMsg(res.message || 'OTP प्रेषण में समस्या आई।');
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
    const clean = normalizeIndianPhone(manualPhone);
    const enteredCode = otp.join('');
    if (enteredCode.length !== 6) {
      setErrorMsg('⚠️ कृपया पूर्ण 6-अंकीय OTP कोड दर्ज करें।');
      return;
    }

    setIsVerifying(true);
    setErrorMsg(null);

    try {
      const result = await verifyRealOtp({
        phone: clean,
        otp: enteredCode,
        sessionToken: sessionToken || undefined,
        certificateId
      });

      setIsVerifying(false);

      if (result.verified) {
        setVerified(true);
        setStatusMsg('✓ मोबाइल नंबर सफल सत्यापित! आधिकारिक डाउनलोड प्रारंभ हो रहा है...');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1000);
      } else {
        setErrorMsg(result.message || 'अमान्य OTP कोड। कृपया पुनः प्रयास करें।');
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
          <p className="text-[11px] text-amber-200/90 mt-1 font-medium leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* STEP 1: Strict Manual Phone Entry (Never pre-filled) */}
          {step === 'enter_phone' && (
            <div className="space-y-4 text-left">
              <div className="bg-amber-50/90 border border-amber-300/90 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-amber-900">
                  <Smartphone className="w-4 h-4 text-amber-800 shrink-0" />
                  <span className="text-xs font-black">
                    सुरक्षा निर्देश (Manual Phone Entry)
                  </span>
                </div>
                <p className="text-[11px] text-amber-900/90 leading-relaxed font-medium">
                  सुरक्षा कारणों से पंजीकृत मोबाइल नंबर यहाँ पहले से प्रदर्शित नहीं किया गया है। प्रमाण पत्र / पहचान पत्र डाउनलोड करने हेतु <strong>रजिस्ट्रेशन फॉर्म में भरा गया 10-अंकीय मोबाइल नंबर</strong> यहाँ मैनुअली दर्ज करें:
                </p>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 mb-1.5">
                  10-अंकीय पंजीकृत मोबाइल नंबर <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500 text-sm">
                    +91 -
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={manualPhone}
                    onChange={(e) => {
                      setManualPhone(e.target.value.replace(/\D/g, ''));
                      setErrorMsg(null);
                    }}
                    placeholder="उदा. 8052361666"
                    autoFocus
                    className="w-full pl-16 pr-4 py-3 bg-white border-2 border-slate-300 focus:border-amber-600 rounded-2xl text-base font-mono font-black focus:outline-none shadow-xs text-slate-900"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  * OTP इसी मोबाइल नंबर पर SMS एवं WhatsApp पर स्वतः भेजा जाएगा
                </span>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border-2 border-red-300 rounded-xl flex items-start gap-2 text-xs font-bold text-red-800 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleSendOtp('sms')}
                disabled={isSendingOtp || manualPhone.replace(/\D/g, '').length !== 10}
                className="w-full py-3.5 bg-gradient-to-r from-[#8B0000] to-orange-700 hover:from-[#6e0000] hover:to-orange-800 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSendingOtp ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>OTP भेजा जा रहा है...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>OTP भेजें (Send Mandatory OTP)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>NITI Aayog (UP/2018/0207700) अधिकृत सुरक्षित OTP गेटवे</span>
              </div>
            </div>
          )}

          {/* STEP 2: OTP Entry & Verification */}
          {step === 'enter_otp' && (
            <div className="space-y-4">
              {/* WhatsApp Auto-Dispatch Alert Banner */}
              <div className="bg-emerald-50 border-2 border-emerald-400 rounded-2xl p-3 text-left space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-black text-emerald-950">
                      OTP स्वतः भेजा गया (SMS & WhatsApp Dispatched)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                    {maskPhoneNumber(manualPhone)}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  ✓ 6-अंकीय OTP आपके मोबाइल पर <strong>SMS एवं WhatsApp</strong> दोनों पर भेजा गया है।
                </p>

                {/* Direct WhatsApp Open Button */}
                {whatsappLink && (
                  <button
                    type="button"
                    onClick={() => autoOpenWhatsAppOtp(whatsappLink)}
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>📲 WhatsApp पर OTP तुरंत खोलें (Open WhatsApp OTP)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
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
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 mb-2 block">
                      प्राप्त 6-अंकीय OTP कोड दर्ज करें:
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
                    <div className="p-2.5 bg-red-50 border border-red-300 rounded-xl flex items-center gap-2 text-left text-xs font-bold text-red-800 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Verify & Download Button */}
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying || otp.join('').length !== 6 || isSendingOtp}
                    className="w-full py-3.5 bg-gradient-to-r from-[#8B0000] to-red-900 hover:from-[#700000] hover:to-red-950 disabled:opacity-50 text-white font-black rounded-2xl text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>सत्यापित किया जा रहा है...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>सत्यापित करें व डाउनलोड करें (Verify OTP & Download)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Resend SMS & WhatsApp Fallback Channel */}
                  <div className="flex items-center justify-between text-xs text-slate-600 px-1 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep('enter_phone')}
                      className="text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer text-[11px]"
                    >
                      ← दूसरा मोबाइल नंबर दर्ज करें
                    </button>

                    {canResend ? (
                      <button
                        type="button"
                        onClick={() => handleSendOtp('sms')}
                        disabled={isSendingOtp}
                        className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer underline disabled:opacity-50 text-[11px]"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSendingOtp ? 'animate-spin' : ''}`} />
                        <span>पुनः OTP भेजें</span>
                      </button>
                    ) : (
                      <span className="text-slate-500 font-medium text-[11px]">
                        पुनः भेजें: <strong className="font-mono text-slate-800">{resendTimer}s</strong>
                      </span>
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
          )}

        </div>
      </div>
    </div>
  );
};

export default OtpVerificationModal;
