import React, { useState } from 'react';
import { X, Lock, User, Key, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { FOUNDATION_INFO } from '../data/foundationData';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      // Demo authorized credentials for NGO administration
      if ((username === 'admin' || username === 'shailesh') && (password === 'admin123' || password === 'jjf2026')) {
        setIsLoggedIn(true);
        if (onSuccess) onSuccess();
      } else {
        setError('अमान्य यूज़रनेम या पासवर्ड। कृपया सही क्रेडेंशियल्स दर्ज करें।');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs overflow-y-auto overscroll-contain">
      <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm sm:text-base">पदाधिकारी / एडमिन पोर्टल (Official Portal)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {isLoggedIn ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-slate-900">
                स्वागत है, श्री शैलेश प्रधान जी
              </h4>
              <p className="text-xs text-slate-600">
                (प्रबंधक / सचिव - Jeevan Jyoti Foundation Ghazipur)
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
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-slate-900">
                  प्रशासनिक लॉगिन (Admin Login)
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  जीवन ज्योति फाउंडेशन ग़ाज़ीपुर, उत्तर प्रदेश, भारत (अधिकृत पैनल)
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
                  उपयोगकर्ता नाम (Username)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin or shailesh"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-amber-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  गोपनीय पासवर्ड (Password)
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-amber-600 font-medium"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Demo credentials: <code className="bg-slate-100 px-1 py-0.5 rounded">shailesh</code> / <code className="bg-slate-100 px-1 py-0.5 rounded">admin123</code>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer mt-2"
              >
                {loading ? 'सत्यापित किया जा रहा है...' : 'सुरक्षित लॉगिन करें (Secure Login)'}
              </button>
            </form>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;
