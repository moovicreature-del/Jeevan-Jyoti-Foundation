import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, KeyRound, CheckCircle2, ArrowRight, Smartphone, RefreshCw } from 'lucide-react';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber?: string;
  onSuccess: () => void;
  title?: string;
  subtitle?: string;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  phoneNumber = '+91-8052361666',
  onSuccess,
  title = 'प्रमाण पत्र डाउनलोड - मोबाइल OTP सत्यापन',
  subtitle = 'आधिकारिक प्रमाण पत्र सुरक्षा हेतु पंजीकृत मोबाइल नंबर पर OTP सत्यापन आवश्यक है।'
}) => {
  const [mobileNum, setMobileNum] = useState(phoneNumber);
  const [isEditingPhone, setIsEditingPhone] = useState(!phoneNumber || phoneNumber.trim() === '');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMobileNum(phoneNumber || '+91-8052361666');
      setOtp(['', '', '', '']);
      setVerified(false);
      setLoading(false);
      setErrorMsg(null);
      setResendTimer(30);
      setCanResend(false);
    }
  }, [isOpen, phoneNumber]);

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

  const handleChange = (val: string, index: number) => {
    const cleanVal = val.replace(/\D/g, '');
    if (!cleanVal && val !== '') return;

    const char = cleanVal.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);
    setErrorMsg(null);

    // Auto-focus next input
    if (char && index < 3) {
      const nextInput = document.getElementById(`cert-otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`cert-otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResendOtp = () => {
    setResendTimer(30);
    setCanResend(false);
    setOtp(['', '', '', '']);
    setErrorMsg('✓ नया 4-अंकीय OTP पुनः प्रेषित किया गया (e.g. 1234)');
    setTimeout(() => {
      document.getElementById('cert-otp-input-0')?.focus();
    }, 100);
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setErrorMsg('⚠️ कृपया पूर्ण 4-अंकीय OTP दर्ज करें।');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    setTimeout(() => {
      setLoading(false);
      setVerified(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 900);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs overflow-y-auto overscroll-contain no-print">
      <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border-2 border-amber-300 overflow-hidden p-6 text-center animate-in fade-in zoom-in-95 duration-200 my-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

        <div className="w-14 h-14 bg-amber-100 border border-amber-300 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
          <KeyRound className="w-7 h-7" />
        </div>

        <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight font-serif">
          {title}
        </h3>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          {subtitle}
        </p>

        {/* Mobile Number Display / Edit */}
        <div className="mt-3 py-1.5 px-3 bg-amber-50/80 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold">
            <Smartphone className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>मोबाइल नं:</span>
            {isEditingPhone ? (
              <input
                type="tel"
                value={mobileNum}
                onChange={(e) => setMobileNum(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-28 px-1.5 py-0.5 bg-white border border-amber-300 rounded text-xs font-mono font-bold"
              />
            ) : (
              <span className="font-mono font-black text-slate-900">{mobileNum}</span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsEditingPhone(!isEditingPhone)}
            className="text-[11px] text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
          >
            {isEditingPhone ? 'सहेजें' : 'बदलें'}
          </button>
        </div>

        {verified ? (
          <div className="py-6 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <p className="text-sm font-black text-emerald-800">सत्यापन सफल! डाउनलोड प्रारंभ...</p>
            <p className="text-xs text-slate-500">Generating Official High-Res Certificate</p>
          </div>
        ) : (
          <div className="my-5 space-y-4">
            <div className="flex justify-center gap-2.5">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`cert-otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-11 h-12 text-center text-xl font-mono font-black border-2 border-slate-300 focus:border-amber-600 rounded-xl focus:outline-none bg-slate-50 shadow-inner"
                />
              ))}
            </div>

            {errorMsg && (
              <p className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 py-1.5 px-2 rounded-lg">
                {errorMsg}
              </p>
            )}

            <button
              onClick={handleVerify}
              disabled={loading || otp.join('').length < 4}
              className="w-full py-3 bg-[#8B0000] hover:bg-[#6b0000] disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{loading ? 'सत्यापित हो रहा है...' : 'सत्यापित करें व डाउनलोड करें'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>परीक्षण OTP: <strong>1234</strong></span>
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>OTP पुनः भेजें</span>
                </button>
              ) : (
                <span>पुनः भेजें: <strong>{resendTimer}s</strong></span>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>NITI Aayog & ISO Certified Security Protocol</span>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationModal;
