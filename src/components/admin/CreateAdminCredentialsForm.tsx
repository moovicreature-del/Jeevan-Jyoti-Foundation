// ============================================================================
// JEEVAN JYOTI FOUNDATION - CREATE ADMIN USERNAME & PASSWORD FORM
// जीवन ज्योति फाउंडेशन - एडमिन हेतु नया Username एवं Password बनाने का फ़ॉर्म
// ============================================================================

import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Crown,
  RotateCw,
  ArrowRight,
  Send,
  Check
} from 'lucide-react';
import { createOrSetAdminCredentials } from '../../services/adminCredentialsService';
import { sendRealSmsOtp, verifyRealSmsOtp } from '../../services/realSmsOtpService';
import { useAdminAuth, SUPER_ADMIN_PHONE, ADMIN_PHONE } from '../../context/AdminAuthContext';
import { AdminRole } from '../../types';
import toast from 'react-hot-toast';

interface CreateAdminCredentialsFormProps {
  onSuccess?: (created: { userId: string; role: AdminRole }) => void;
  onSwitchToLogin?: (createdUserId?: string) => void;
  defaultRole?: 'superadmin' | 'admin';
}

export const CreateAdminCredentialsForm: React.FC<CreateAdminCredentialsFormProps> = ({
  onSuccess,
  onSwitchToLogin,
  defaultRole = 'superadmin'
}) => {
  const { loginWithCredentials } = useAdminAuth();

  // Role Selection
  const [selectedRole, setSelectedRole] = useState<'superadmin' | 'admin'>(defaultRole);

  // Identity - Keep mobile empty by default so user manually enters it
  const [name, setName] = useState<string>(
    defaultRole === 'superadmin' ? 'श्री शैलेश प्रधान जी' : 'अधिकृत एडमिन (व्यवस्थापक)'
  );
  const [mobile, setMobile] = useState<string>('');

  // Security Verification Method - Mobile OTP Required
  const [otpInput, setOtpInput] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [isOtpSending, setIsOtpSending] = useState<boolean>(false);
  const [isOtpVerified, setIsOtpVerified] = useState<boolean>(false);
  const [otpSessionToken, setOtpSessionToken] = useState<string>('');

  // Credentials Fields
  const [newUsername, setNewUsername] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Processing & Success State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdSuccess, setCreatedSuccess] = useState<{
    userId: string;
    role: AdminRole;
    message: string;
  } | null>(null);

  // Role Switch Handler
  const handleRoleChange = (role: 'superadmin' | 'admin') => {
    setSelectedRole(role);
    if (role === 'superadmin') {
      setName('श्री शैलेश प्रधान जी');
    } else {
      setName('अधिकृत एडमिन (व्यवस्थापक)');
    }
    setIsOtpVerified(false);
    setIsOtpSent(false);
    setOtpInput('');
  };

  // Send Mobile OTP via Real SMS / WhatsApp
  const handleSendOtp = async () => {
    const cleanPhone = mobile.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      toast.error('कृपया 10 अंकों का मान्य मोबाइल नंबर दर्ज करें!');
      return;
    }

    setIsOtpSending(true);
    try {
      const res = await sendRealSmsOtp({
        phone: cleanPhone,
        recipientName: name,
        preferredChannel: 'sms'
      });

      if (res.success) {
        setIsOtpSent(true);
        setOtpSessionToken(res.sessionToken || '');
        toast.success(
          `सत्यापन कोड (OTP) मोबाइल +91-${cleanPhone} एवं WhatsApp पर भेज दिया गया है!`
        );
      } else {
        toast.error(res.message || 'OTP भेजने में असमर्थ। कृपया नेटवर्क की जांच करें।');
      }
    } catch {
      toast.error('नेटवर्क त्रुटि: कृपया पुनः प्रयास करें।');
    } finally {
      setIsOtpSending(false);
    }
  };

  // Verify Mobile OTP strictly via real SMS/WhatsApp service
  const handleVerifyOtp = async () => {
    const cleanPhone = mobile.replace(/\D/g, '').slice(-10);
    if (!otpInput || otpInput.trim().length < 6) {
      toast.error('कृपया 6 अंकों का OTP कोड दर्ज करें!');
      return;
    }

    const res = await verifyRealSmsOtp({
      phone: cleanPhone,
      otp: otpInput.trim(),
      sessionToken: otpSessionToken
    });

    if (res.verified) {
      setIsOtpVerified(true);
      toast.success('✓ मोबाइल OTP सफलतापूर्वक सत्यापित हुआ!');
    } else {
      toast.error(res.message || 'अमान्य OTP कोड! कृपया सही कोड दर्ज करें।');
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUsername = newUsername.trim().toLowerCase();
    const cleanPassword = newPassword.trim();
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);

    if (!cleanUsername || cleanUsername.length < 3) {
      toast.error('Username कम से कम 3 अक्षरों का होना चाहिए!');
      return;
    }

    // Space check in username
    if (/\s/.test(cleanUsername)) {
      toast.error('Username में स्पेस (खाली स्थान) नहीं होना चाहिए!');
      return;
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      toast.error('Password कम से कम 6 अक्षरों का होना चाहिए!');
      return;
    }

    if (cleanPassword !== confirmPassword.trim()) {
      toast.error('पासवर्ड और कन्फर्म पासवर्ड मेल नहीं खा रहे हैं!');
      return;
    }

    if (cleanMobile.length !== 10) {
      toast.error('कृपया 10-अंकों का मान्य मोबाइल नंबर दर्ज करें!');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createOrSetAdminCredentials({
        role: selectedRole,
        name: name.trim(),
        mobile: cleanMobile,
        newUserId: cleanUsername,
        newPassword: cleanPassword,
        isOtpVerified: isOtpVerified,
        modifierName: name.trim() || 'Admin Portal'
      });

      if (result.success) {
        setCreatedSuccess({
          userId: cleanUsername,
          role: selectedRole,
          message: result.message
        });
        toast.success(`🎉 Username '${cleanUsername}' एवं Password सफलतापूर्वक सुरक्षित हुआ!`, {
          duration: 5000
        });
        if (onSuccess) {
          onSuccess({ userId: cleanUsername, role: selectedRole });
        }
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error('क्रेडेंशियल सुरक्षित करने में तकनीकी त्रुटि आई।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Instant Login with Newly Created Credentials
  const handleInstantLogin = async () => {
    if (!createdSuccess) return;
    setIsSubmitting(true);
    try {
      const res = await loginWithCredentials(createdSuccess.userId, newPassword.trim());
      if (res.success) {
        if (onSuccess) {
          onSuccess(createdSuccess);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // SUCCESS SCREEN
  // -------------------------------------------------------------
  if (createdSuccess) {
    return (
      <div className="text-center py-6 px-4 space-y-5 animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-md border-2 border-emerald-300">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-black tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            क्रेडेंशियल्स सफलतापूर्वक सक्रिय
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-2">
            नया Username व Password बन गया!
          </h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            अब आप इस Username और Password से कभी भी सीधे प्रशासनिक लॉगिन कर सकते हैं।
          </p>
        </div>

        {/* Credentials Card */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 max-w-sm mx-auto shadow-xs">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-bold">प्रशासनिक पद:</span>
            <span className="font-black text-blue-900">
              {createdSuccess.role === 'superadmin' ? '👑 सुपर एडमिन' : '🛡️ अधिकृत एडमिन'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
            <span className="text-slate-500 font-bold">नया Username:</span>
            <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {createdSuccess.userId}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-bold">पंजीकृत नाम:</span>
            <span className="font-bold text-slate-800">{name}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 max-w-sm mx-auto">
          <button
            type="button"
            onClick={handleInstantLogin}
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>लॉगिन हो रहा है...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>इस नए Username से तुरंत लॉगिन करें</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {onSwitchToLogin && (
            <button
              type="button"
              onClick={() => onSwitchToLogin(createdSuccess.userId)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              लॉगिन स्क्रीन पर वापस जाएं
            </button>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FORM VIEW
  // -------------------------------------------------------------
  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left" autoComplete="off">
      <div className="text-center space-y-1 pb-1">
        <div className="w-12 h-12 bg-amber-50 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-1 border border-amber-200">
          <KeyRound className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black text-slate-900">
          नया Username और Password बनाएं
        </h3>
        <p className="text-xs text-slate-500">
          प्रशासनिक कार्य हेतु अपना मनचाहा User ID व गोपनीय पासवर्ड सेट करें
        </p>
      </div>

      {/* 1. Administrative Role Selection */}
      <div>
        <label className="block text-[11px] font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
          1. प्रशासनिक पद चुनें (Select Admin Role) *
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleRoleChange('superadmin')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
              selectedRole === 'superadmin'
                ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <Crown className={`w-5 h-5 ${selectedRole === 'superadmin' ? 'text-amber-600' : 'text-slate-400'}`} />
              {selectedRole === 'superadmin' && (
                <span className="w-4 h-4 bg-amber-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <div>
              <span className="block text-xs font-black text-slate-900">सुपर एडमिन (Super Admin)</span>
              <span className="text-[10px] text-slate-500">संस्था प्रमुख / मुख्य प्रशासक</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
              selectedRole === 'admin'
                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <ShieldCheck className={`w-5 h-5 ${selectedRole === 'admin' ? 'text-blue-600' : 'text-slate-400'}`} />
              {selectedRole === 'admin' && (
                <span className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <div>
              <span className="block text-xs font-black text-slate-900">अधिकृत एडमिन (Admin)</span>
              <span className="text-[10px] text-slate-500">प्रशासनिक व्यवस्थापक</span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Admin Name & Mobile (Manual Entry) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            अधिकारी का नाम (Full Name) *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="नाम दर्ज करें"
              required
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            पंजीकृत मोबाइल नंबर (Manual Enter) *
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              maxLength={10}
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value.replace(/\D/g, ''));
                setIsOtpVerified(false);
                setIsOtpSent(false);
              }}
              placeholder="10-अंकीय मोबाइल नंबर दर्ज करें"
              required
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. Security Verification via Real Mobile / WhatsApp OTP */}
      <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>2. मोबाइल OTP सुरक्षा सत्यापन (Live Verification) *</span>
          </label>
          <span className="text-[10px] font-bold text-blue-700 bg-white px-2 py-0.5 rounded-md border border-blue-200">
            SMS & WhatsApp
          </span>
        </div>

        <div className="space-y-2">
          {isOtpVerified ? (
            <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>मोबाइल (+91-{mobile}) पर भेजे गए OTP से प्रमाणीकरण सफल हुआ!</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                placeholder="6-अंकीय लाइव OTP कोड दर्ज करें"
                className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {!isOtpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isOtpSending || mobile.length !== 10}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  {isOtpSending ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>OTP भेजें</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>सत्यापित करें</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. Desired Username (User ID) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            3. नया Username (यूज़र आईडी बनाएं) *
          </label>
          <span className="text-[10px] text-slate-400">बिना स्पेस, कम से कम 3 अक्षर</span>
        </div>
        <div className="relative">
          <User className="w-4 h-4 text-blue-700 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            autoComplete="off"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
            placeholder="उदा. shailesh, superadmin, admin_ghazipur"
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
        </div>
        {newUsername.trim().length > 0 && (
          <p className="text-[10px] text-blue-800 mt-1 font-semibold">
            लॉगिन यूज़र आईडी होगी: <span className="font-mono bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">{newUsername.trim().toLowerCase()}</span>
          </p>
        )}
      </div>

      {/* 5. Password & Confirm Password */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            4. नया गोपनीय पासवर्ड (Password) *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="कम से कम 6 अक्षर"
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">
            पासवर्ड पुनः दर्ज करें (Confirm) *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="पासवर्ड दोबारा लिखें"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>
        </div>
      </div>

      {/* Password Match Status */}
      {confirmPassword.length > 0 && (
        <div className="text-[11px]">
          {newPassword === confirmPassword ? (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> दोनों पासवर्ड मेल खा रहे हैं।
            </span>
          ) : (
            <span className="text-red-600 font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> पासवर्ड मेल नहीं खा रहे हैं!
            </span>
          )}
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-900 hover:to-indigo-950 text-white font-black text-xs rounded-2xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>सुरक्षित किया जा रहा है...</span>
            </>
          ) : (
            <>
              <KeyRound className="w-4 h-4 text-amber-300" />
              <span>नया Username और Password बनाएं एवं सुरक्षित करें</span>
            </>
          )}
        </button>
      </div>

      {onSwitchToLogin && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => onSwitchToLogin()}
            className="text-xs text-blue-700 hover:text-blue-900 font-bold cursor-pointer underline"
          >
            पहले से Username और Password है? यहाँ क्लिक करके लॉगिन करें
          </button>
        </div>
      )}
    </form>
  );
};
