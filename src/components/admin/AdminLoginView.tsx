// ============================================================================
// JEEVAN JYOTI FOUNDATION - ADMIN LOGIN & OTP REGISTRATION VIEW
// जीवन ज्योति फाउंडेशन - मोबाइल OTP लॉगिन एवं नवीन एडमिन पंजीकरण इंटरफ़ेस
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Phone,
  KeyRound,
  User,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  RotateCw,
  Crown,
  AlertTriangle,
  UserCheck,
  Eye,
  EyeOff,
  UserPlus
} from 'lucide-react';
import {
  useAdminAuth,
  SUPER_ADMIN_PHONE,
  ADMIN_PHONE
} from '../../context/AdminAuthContext';
import { AdminRole } from '../../types';
import { CreateAdminCredentialsForm } from './CreateAdminCredentialsForm';
import toast from 'react-hot-toast';

interface AdminLoginViewProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onSuccess, onCancel }) => {
  const {
    sendOtp,
    verifyOtpAndLogin,
    submitRegistration,
    setupRecaptcha,
    loginWithCredentials,
    loginAsDemoSuperAdmin,
    loginAsDemoAdmin,
    adminProfile,
    isApproved
  } = useAdminAuth();

  // लॉगिन मोड: 'credentials' (ID & Password - Default), 'phone' (Mobile OTP), या 'create_credentials' (नया बनाएं)
  const [authMode, setAuthMode] = useState<'credentials' | 'phone' | 'create_credentials'>('credentials');

  // Credentials State (MUST BE EMPTY BY DEFAULT - NO AUTOFILL)
  const [loginUserId, setLoginUserId] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);

  // Phone/OTP फ़ॉर्म स्टेप्स: 'phone' -> 'otp' -> 'register' -> 'pending'
  const [step, setStep] = useState<'phone' | 'otp' | 'register' | 'pending'>('phone');
  // Phone MUST BE EMPTY BY DEFAULT - NO AUTOFILL
  const [phone, setPhone] = useState<string>('');
  const [activePortalType, setActivePortalType] = useState<'superadmin' | 'admin' | 'custom'>('custom');
  const [otp, setOtp] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any>(null);

  // रजिस्ट्रेशन फ़ील्ड्स
  const [regName, setRegName] = useState<string>('');
  const [regMobile, setRegMobile] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regRole, setRegRole] = useState<AdminRole>('superadmin');

  // Recaptcha इनिशियलाइज़ करें
  useEffect(() => {
    const verifier = setupRecaptcha('recaptcha-container');
    setRecaptchaVerifier(verifier);
  }, []);

  // यदि प्रोफ़ाइल पहले से है पर अप्रूव नहीं है
  useEffect(() => {
    if (adminProfile && !isApproved) {
      setStep('pending');
    }
  }, [adminProfile, isApproved]);

  // त्वरित User ID व पासवर्ड द्वारा लॉगिन हैंडलर
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = loginUserId.trim();
    const cleanPass = loginPassword.trim();

    if (!cleanId) {
      toast.error('कृपया अपना User ID / उपयोगकर्ता नाम दर्ज करें!');
      return;
    }
    if (!cleanPass) {
      toast.error('कृपया अपना पासवर्ड दर्ज करें!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginWithCredentials(cleanId, cleanPass);
      if (res.success) {
        if (onSuccess) onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // क्विक रोल टॉगल
  // Role Selector (without pre-filling phone numbers)
  const handleSelectRolePreset = (type: 'superadmin' | 'admin') => {
    setActivePortalType(type);
    if (type === 'superadmin') {
      setRegRole('superadmin');
    } else {
      setRegRole('admin');
    }
  };

  // 1. फ़ोन नंबर पर वास्तविक OTP भेजें (SMS व WhatsApp)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      toast.error('कृपया 10-अंकों का वैध मोबाइल नंबर दर्ज करें!');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await sendOtp(cleanPhone, recaptchaVerifier);
      if (success) {
        setRegMobile(cleanPhone);
        setStep('otp');
      }
    } catch {
      toast.error('OTP भेजने में असमर्थ। कृपया पुनः प्रयास करें।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. OTP सत्यापित करें (केवल वास्तविक OTP द्वारा सत्यापन)
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOtp = otp.replace(/\D/g, '').trim();
    if (cleanOtp.length < 6) {
      toast.error('कृपया 6-अंकों का OTP दर्ज करें!');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await verifyOtpAndLogin(cleanOtp);
      if (result.success) {
        if (result.isNewUser) {
          setRegMobile(phone);
          setStep('register');
        } else {
          if (onSuccess) onSuccess();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. नवीन एडमिन पंजीकरण पूरा करें
  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) {
      toast.error('कृपया पूरा नाम दर्ज करें!');
      return;
    }
    if (!regMobile.trim()) {
      toast.error('कृपया मोबाइल नंबर दर्ज करें!');
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await submitRegistration({
        name: regName.trim(),
        mobile: regMobile.trim(),
        email: regEmail.trim() || 'admin@jeevanjyotifoundation.org',
        role: regRole
      });

      if (ok) {
        if (regRole === 'superadmin' || regMobile.includes(SUPER_ADMIN_PHONE) || regMobile.includes(ADMIN_PHONE)) {
          if (onSuccess) onSuccess();
        } else {
          setStep('pending');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden text-slate-800">
      {/* Invisible Recaptcha Container */}
      <div id="recaptcha-container"></div>

      {/* Header Banner - Royal Blue & Gold Theme */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-black shadow-lg">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold tracking-widest text-amber-300 uppercase block">
                ADMIN & SUPER ADMIN PORTAL
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                जीवन ज्योति फाउंडेशन
              </h2>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl transition cursor-pointer"
            >
              बंद करें
            </button>
          )}
        </div>
        <p className="text-xs text-blue-100 mt-2">
          अधिकृत User ID व पासवर्ड अथवा OTP द्वारा सुरक्षित प्रशासनिक प्रवेश
        </p>
      </div>

      {/* Body Content */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Login Method Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold gap-1">
          <button
            type="button"
            onClick={() => setAuthMode('credentials')}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer text-[11px] sm:text-xs ${
              authMode === 'credentials'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className={`w-3.5 h-3.5 ${authMode === 'credentials' ? 'text-amber-300' : 'text-slate-400'}`} />
            <span>यूज़र आईडी / पासवर्ड</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('phone');
              setStep('phone');
            }}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer text-[11px] sm:text-xs ${
              authMode === 'phone'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Phone className={`w-3.5 h-3.5 ${authMode === 'phone' ? 'text-amber-300' : 'text-slate-400'}`} />
            <span>मोबाइल OTP</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('create_credentials')}
            className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer text-[11px] sm:text-xs ${
              authMode === 'create_credentials'
                ? 'bg-blue-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className={`w-3.5 h-3.5 ${authMode === 'create_credentials' ? 'text-amber-300' : 'text-slate-400'}`} />
            <span>नया बनाएं</span>
          </button>
        </div>

        {/* ================= METHOD 1: USER ID & PASSWORD LOGIN (DEFAULT) ================= */}
        {authMode === 'credentials' && (
          <form onSubmit={handleCredentialsLogin} className="space-y-4" autoComplete="off">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-blue-50 text-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-1 border border-blue-100">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900">
                प्रशासनिक लॉगिन (Official Sign-In)
              </h3>
              <p className="text-xs text-slate-500">
                सुपर एडमिन अथवा एडमिन User ID एवं पासवर्ड दर्ज करें
              </p>
            </div>

            {/* User ID Field - Empty by default, no autofill */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                यूज़र आईडी / उपयोगकर्ता नाम (User ID) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4 text-blue-700" />
                </div>
                <input
                  type="text"
                  autoComplete="off"
                  value={loginUserId}
                  onChange={(e) => setLoginUserId(e.target.value)}
                  placeholder="उदा. superadmin या admin"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
                  required
                />
              </div>
            </div>

            {/* Password Field - Empty by default, new-password autofill guard */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                गोपनीय पासवर्ड (Password) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4 text-blue-700" />
                </div>
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="पासवर्ड दर्ज करें"
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* No Auto-fill Notification Badge */}
            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
              🔒 सुरक्षा निर्देश: क्रेडेंशियल्स स्वतः नहीं भरे गए हैं। कृपया अपना मान्य User ID व पासवर्ड दर्ज करें।
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-700/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>सत्यापन जारी है...</span>
                </>
              ) : (
                <>
                  <span>सुरक्षित लॉगिन करें (Sign In)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Direct CTA: Create New Admin Credentials */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAuthMode('create_credentials')}
                className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs rounded-xl border border-amber-300 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <UserPlus className="w-4 h-4 text-amber-700" />
                <span>नया प्रशासनिक Username व Password बनाएं (Create Account)</span>
              </button>
            </div>
          </form>
        )}

        {/* ================= METHOD 3: CREATE ADMIN USERNAME & PASSWORD ================= */}
        {authMode === 'create_credentials' && (
          <CreateAdminCredentialsForm
            onSuccess={(created) => {
              setLoginUserId(created.userId);
              if (onSuccess) onSuccess();
            }}
            onSwitchToLogin={(newId) => {
              if (newId) setLoginUserId(newId);
              setAuthMode('credentials');
            }}
          />
        )}

        {/* ================= METHOD 2: MOBILE OTP LOGIN ================= */}
        {authMode === 'phone' && step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-5" autoComplete="off">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  पंजीकृत मोबाइल नंबर (Manual Enter Mobile Number) *
                </label>
                <span className="text-[10px] font-bold text-blue-800">
                  10-अंकीय मोबाइल नंबर
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-5 h-5 text-blue-700" />
                </div>
                <div className="absolute inset-y-0 left-10 flex items-center text-xs font-bold text-slate-500 border-r border-slate-200 pr-2 my-2">
                  +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  autoComplete="off"
                  value={phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setPhone(val);
                    if (val === SUPER_ADMIN_PHONE) setActivePortalType('superadmin');
                    else if (val === ADMIN_PHONE) setActivePortalType('admin');
                    else setActivePortalType('custom');
                  }}
                  placeholder="अपना 10-अंकीय मोबाइल नंबर दर्ज करें"
                  className="w-full pl-22 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700 transition font-mono"
                  required
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                सुरक्षा हेतु आपके मोबाइल व WhatsApp पर वास्तविक OTP कोड भेजा जाएगा।
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-bold text-sm rounded-2xl shadow-lg shadow-blue-700/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>OTP भेजा जा रहा है...</span>
                </>
              ) : (
                <>
                  <span>OTP कोड प्राप्त करें (SMS / WhatsApp)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                OTP कोड सत्यापित करें
              </h3>
              <p className="text-xs text-slate-500">
                मोबाइल <span className="font-bold text-blue-900">+91 {phone}</span> पर भेजा गया 6-अंकों का लाइव कोड दर्ज करें
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                6-अंकीय OTP कोड
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className="w-full text-center tracking-[0.4em] py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xl font-black text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700 transition font-mono"
                required
                autoFocus
              />
              <p className="text-[11px] text-slate-500 mt-1.5 text-center">
                OTP आपके मोबाइल SMS तथा WhatsApp पर भेजा गया है
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                नंबर बदलें
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-2 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>सत्यापन जारी है...</span>
                  </>
                ) : (
                  <>
                    <span>सत्यापित करें एवं आगे बढ़ें</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: FIRST-TIME REGISTRATION (NAME, MOBILE, EMAIL, ROLE) */}
        {step === 'register' && (
          <form onSubmit={handleRegistrationSubmit} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mx-auto mb-1">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                नवीन एडमिन पंजीकरण (New Admin Registration)
              </h3>
              <p className="text-xs text-slate-500">
                कृपया अपना आधिकारिक विवरण दर्ज करें
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                पूरा नाम (Full Name) *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="उदा. श्री शैलेश प्रधान जी / व्यवस्थापक"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                  required
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                मोबाइल नंबर (Mobile Number) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="tel"
                  value={regMobile}
                  onChange={(e) => setRegMobile(e.target.value)}
                  placeholder="10-digit Mobile"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ईमेल आईडी (Email Address)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="admin@jeevanjyotifoundation.org"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                प्रशासनिक पद / भूमिका (Select Role) *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition text-center ${
                    regRole === 'admin'
                      ? 'border-blue-700 bg-blue-50 text-blue-900 ring-2 ring-blue-700'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={regRole === 'admin'}
                    onChange={() => setRegRole('admin')}
                    className="sr-only"
                  />
                  <ShieldCheck className="w-5 h-5 text-blue-700 mb-1" />
                  <span className="font-bold text-xs">Admin (एडमिन)</span>
                  <span className="text-[10px] text-slate-500">प्रशासनिक व्यवस्थापक</span>
                </label>

                <label
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center cursor-pointer transition text-center ${
                    regRole === 'superadmin'
                      ? 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-500'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="superadmin"
                    checked={regRole === 'superadmin'}
                    onChange={() => setRegRole('superadmin')}
                    className="sr-only"
                  />
                  <Crown className="w-5 h-5 text-amber-600 mb-1" />
                  <span className="font-bold text-xs">Super Admin</span>
                  <span className="text-[10px] text-slate-500">मुख्य प्रशासक</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>पंजीकरण दर्ज हो रहा है...</span>
                </>
              ) : (
                <>
                  <span>पंजीकरण पूर्ण करें</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 4: PENDING APPROVAL SCREEN */}
        {step === 'pending' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              अनुमोदन प्रतीक्षारत (Approval Pending)
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
              नमस्ते <span className="font-bold text-blue-950">{adminProfile?.name || 'एडमिन साथी'}</span>! आपका खाता सफलतापूर्वक पंजीकृत हो गया है। सुरक्षा कारणों से मुख्य सुपर एडमिन द्वारा अनुमोदन (Approval) के पश्चात आप डैशबोर्ड एक्सेस कर सकेंगे।
            </p>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 text-left space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>फाउंडेशन प्रशासनिक सुरक्षा सूचना:</span>
              </div>
              <p className="text-[11px] text-slate-700">
                खाते की पुष्टि सुपर एडमिन की अनुमति के बाद स्वतः सक्रिय हो जाएगी।
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  होम पेज पर वापस लौटें
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
