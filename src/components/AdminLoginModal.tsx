import React, { useState } from 'react';
import { X, Lock, User, Key, ShieldCheck, AlertCircle, Sparkles, Eye, EyeOff, UserPlus, KeyRound } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { CreateAdminCredentialsForm } from './admin/CreateAdminCredentialsForm';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithCredentials, loginAsDemoSuperAdmin, loginAsDemoAdmin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'create'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await loginWithCredentials(username.trim(), password.trim());
      if (res.success) {
        setIsLoggedIn(true);
        if (onSuccess) onSuccess();
      } else {
        setError(res.message || 'अमान्य यूज़र आईडी या पासवर्ड। कृपया सही क्रेडेंशियल्स दर्ज करें अथवा नया बनाएं।');
      }
    } catch {
      setError('लॉगिन करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs overflow-y-auto overscroll-contain">
      <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-tight">पदाधिकारी / एडमिन पोर्टल</h3>
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                  Official Administrative Access
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Switcher: Login vs Create Username/Password */}
          {!isLoggedIn && (
            <div className="px-6 pt-4">
              <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setError('');
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-blue-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <KeyRound className={`w-4 h-4 ${activeTab === 'login' ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>लॉगिन करें (Sign In)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('create');
                    setError('');
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
                    activeTab === 'create'
                      ? 'bg-blue-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className={`w-4 h-4 ${activeTab === 'create' ? 'text-amber-300' : 'text-slate-400'}`} />
                  <span>नया Username/Password बनाएं</span>
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 sm:p-8">
            {isLoggedIn ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-slate-900">
                  प्रशासनिक लॉगिन सफल
                </h4>
                <p className="text-xs text-slate-600">
                  (जीवन ज्योति फाउंडेशन ग़ाज़ीपुर - अधिकृत प्रशासनिक पोर्टल)
                </p>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium">
                  आपके पास प्रमाण पत्र अनुमोदन, दान रसीद जनरेशन और स्वयंसेवक डेटाबेस का पूर्ण प्रशासनिक अधिकार है।
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  डैशबोर्ड पर जारी रखें
                </button>
              </div>
            ) : activeTab === 'create' ? (
              /* CREATE USERNAME & PASSWORD FORM */
              <CreateAdminCredentialsForm
                onSuccess={(created) => {
                  setUsername(created.userId);
                  if (onSuccess) onSuccess();
                }}
                onSwitchToLogin={(newId) => {
                  if (newId) setUsername(newId);
                  setActiveTab('login');
                }}
              />
            ) : (
              /* STANDARD LOGIN FORM */
              <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                <div className="text-center mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2 border border-amber-200">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900">
                    प्रशासनिक लॉगिन (Admin Login)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    अपना User ID एवं गोपनीय पासवर्ड दर्ज करके प्रवेश करें
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    यूज़र आईडी / उपयोगकर्ता नाम (User ID / Username) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-blue-700 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="उदा. superadmin, admin या आपका बनाया Username"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    गोपनीय पासवर्ड (Password) *
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-blue-700 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="पासवर्ड दर्ज करें"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-900 hover:to-indigo-950 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer mt-2 disabled:opacity-50"
                >
                  {loading ? 'सत्यापित किया जा रहा है...' : 'सुरक्षित लॉगिन करें (Secure Login)'}
                </button>

                {/* Direct Link to Create Username & Password */}
                <div className="pt-3 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab('create')}
                    className="text-xs text-blue-800 hover:text-blue-950 font-black flex items-center justify-center gap-1.5 mx-auto bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200 transition cursor-pointer w-full"
                  >
                    <UserPlus className="w-4 h-4 text-blue-700" />
                    <span>नया Username और Password बनाना चाहते हैं? यहाँ क्लिक करें</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;
