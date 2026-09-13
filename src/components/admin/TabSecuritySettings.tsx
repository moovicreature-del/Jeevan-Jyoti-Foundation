// ============================================================================
// JEEVAN JYOTI FOUNDATION - TAB: LOGIN CREDENTIALS & SECURITY
// जीवन ज्योति फाउंडेशन - एडमिन एवं सुपर एडमिन यूजर आईडी व पासवर्ड प्रबंधन
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Crown,
  KeyRound,
  Lock,
  User,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Eye,
  EyeOff,
  RefreshCw,
  Info,
  Save,
  Check,
  UserPlus,
  Users
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  getAdminCredentials,
  getAdminCredentialsSync,
  updateSuperAdminCredentials,
  updateRegularAdminCredentials,
  resetToDefaultCredentials,
  AdminCredentialsConfig
} from '../../services/adminCredentialsService';
import { CreateAdminCredentialsForm } from './CreateAdminCredentialsForm';
import toast from 'react-hot-toast';

export const TabSecuritySettings: React.FC = () => {
  const { adminProfile, isSuperAdmin } = useAdminAuth();

  const [credentials, setCredentials] = useState<AdminCredentialsConfig>(() =>
    getAdminCredentialsSync()
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSavingSuper, setIsSavingSuper] = useState<boolean>(false);
  const [isSavingAdmin, setIsSavingAdmin] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [showCreateAdminModal, setShowCreateAdminModal] = useState<boolean>(false);

  // Super Admin Form State (EMPTY BY DEFAULT for inputs to avoid accidental autofill overwrite)
  const [superUserId, setSuperUserId] = useState<string>('');
  const [superPassword, setSuperPassword] = useState<string>('');
  const [superConfirmPassword, setSuperConfirmPassword] = useState<string>('');
  const [showSuperPassword, setShowSuperPassword] = useState<boolean>(false);

  // Admin Form State (EMPTY BY DEFAULT)
  const [adminUserId, setAdminUserId] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [adminConfirmPassword, setAdminConfirmPassword] = useState<string>('');
  const [showAdminPassword, setShowAdminPassword] = useState<boolean>(false);

  // Load fresh credentials on mount
  const loadCredentials = async () => {
    setIsLoading(true);
    try {
      const fresh = await getAdminCredentials();
      setCredentials(fresh);
      setSuperUserId(fresh.superAdmin.userId);
      setAdminUserId(fresh.admin.userId);
    } catch (e) {
      console.warn('Error fetching credentials:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCredentials();
  }, []);

  // Handle Save Super Admin Credentials
  const handleSaveSuperAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!superUserId.trim()) {
      toast.error('कृपया सुपर एडमिन User ID दर्ज करें।');
      return;
    }
    if (superPassword && superPassword.length < 6) {
      toast.error('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      return;
    }
    if (superPassword && superPassword !== superConfirmPassword) {
      toast.error('सुपर एडमिन नया पासवर्ड और कन्फर्म पासवर्ड मेल नहीं खाते!');
      return;
    }

    const newPassToSave = superPassword.trim() || credentials.superAdmin.password;

    setIsSavingSuper(true);
    try {
      const res = await updateSuperAdminCredentials(
        superUserId.trim(),
        newPassToSave,
        adminProfile?.name || 'Super Admin'
      );
      if (res.success) {
        toast.success('👑 सुपर एडमिन User ID व पासवर्ड सफलतापूर्वक अपडेट कर दिए गए!');
        setSuperPassword('');
        setSuperConfirmPassword('');
        await loadCredentials();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('सुरक्षा सेटिंग्स सहेजने में त्रुटि आई।');
    } finally {
      setIsSavingSuper(false);
    }
  };

  // Handle Save Admin Credentials
  const handleSaveAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUserId.trim()) {
      toast.error('कृपया एडमिन User ID दर्ज करें।');
      return;
    }
    if (adminPassword && adminPassword.length < 6) {
      toast.error('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
      return;
    }
    if (adminPassword && adminPassword !== adminConfirmPassword) {
      toast.error('एडमिन नया पासवर्ड और कन्फर्म पासवर्ड मेल नहीं खाते!');
      return;
    }

    const newPassToSave = adminPassword.trim() || credentials.admin.password;

    setIsSavingAdmin(true);
    try {
      const res = await updateRegularAdminCredentials(
        adminUserId.trim(),
        newPassToSave,
        adminProfile?.name || 'व्यवस्थापक'
      );
      if (res.success) {
        toast.success('🛡️ एडमिन User ID व पासवर्ड सफलतापूर्वक अपडेट कर दिए गए!');
        setAdminPassword('');
        setAdminConfirmPassword('');
        await loadCredentials();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('सुरक्षा सेटिंग्स सहेजने में त्रुटि आई।');
    } finally {
      setIsSavingAdmin(false);
    }
  };

  // Factory Reset
  const handleResetDefaults = async () => {
    const confirmReset = window.confirm(
      'क्या आप वाकई दोनों क्रेडेंशियल्स को फ़ैक्टरी डिफ़ॉल्ट (superadmin / admin) पर रीसेट करना चाहते हैं?'
    );
    if (!confirmReset) return;

    setIsResetting(true);
    try {
      const res = await resetToDefaultCredentials(adminProfile?.name || 'Super Admin');
      if (res.success) {
        toast.success('क्रेडेंशियल्स सफलतापूर्वक फ़ैक्टरी डिफ़ॉल्ट पर रीसेट कर दिए गए!');
        await loadCredentials();
        setSuperPassword('');
        setSuperConfirmPassword('');
        setAdminPassword('');
        setAdminConfirmPassword('');
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('रीसेट करने में त्रुटि आई।');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
              <KeyRound className="w-4 h-4" />
              <span>प्रशासनिक सुरक्षा एवं क्रेडेंशियल्स (Login Credentials Management)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              एडमिन व सुपर एडमिन यूज़र आईडी एवं पासवर्ड बदलें
            </h2>
            <p className="text-xs text-blue-100 mt-1 max-w-2xl leading-relaxed">
              यहाँ से आप एडमिन और सुपर एडमिन दोनों के लॉगिन User ID और पासवर्ड बदल सकते हैं। सुरक्षा को ध्यान में रखते हुए लॉगिन स्क्रीन पर ऑटो-फिल (Autofill) बंद कर दिया गया है।
            </p>
          </div>

          <button
            onClick={loadCredentials}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition cursor-pointer border border-white/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>डेटा रीलोड करें</span>
          </button>
        </div>
      </div>

      {/* Security Info Notice Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-950 flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">
            सुरक्षा निर्देश (No-Autofill Security Mandate):
          </p>
          <p className="text-blue-800 leading-relaxed text-[11px]">
            लॉगिन फॉर्म पर पहले से कोई भी पुराना पासवर्ड या यूजरनेम स्वतः नहीं भरा जाएगा (<code className="bg-blue-100 px-1 py-0.5 rounded font-mono">autoComplete=&quot;off&quot;</code>)। यहाँ नए क्रेडेंशियल्स सुरक्षित करते ही वे तुरंत फ़ायरबेस व स्थानीय सुरक्षित कैश में सक्रिय हो जाएंगे।
          </p>
          {credentials.lastModifiedAt && (
            <p className="text-[10px] text-blue-600 font-semibold pt-1">
              अंतिम अद्यतन: {new Date(credentials.lastModifiedAt).toLocaleString('hi-IN')} द्वारा {credentials.lastModifiedBy || 'व्यवस्थापक'}
            </p>
          )}
        </div>
      </div>

      {/* Two Column Grid: Super Admin vs Regular Admin Credentials */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= SUPER ADMIN CARD ================= */}
        <div className="bg-white rounded-3xl border border-amber-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent p-5 sm:p-6 border-b border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-blue-950 flex items-center justify-center shadow-sm font-black">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  सुपर एडमिन क्रेडेंशियल्स (Super Admin)
                </h3>
                <p className="text-xs text-amber-900 font-medium">
                  {credentials.superAdmin.name} ({credentials.superAdmin.mobile})
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black px-2.5 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
              पूर्ण नियंत्रण
            </span>
          </div>

          <form onSubmit={handleSaveSuperAdmin} className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between" autoComplete="off">
            <div className="space-y-4">
              {/* Current Active User ID Badge */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">वर्तमान सक्रिय User ID:</span>
                <span className="font-mono font-black text-amber-950 bg-white px-2 py-0.5 rounded border border-amber-200">
                  {credentials.superAdmin.userId}
                </span>
              </div>

              {/* Edit Super Admin User ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  सुपर एडमिन User ID (लॉगिन उपयोगकर्ता नाम) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    autoComplete="off"
                    value={superUserId}
                    onChange={(e) => setSuperUserId(e.target.value)}
                    placeholder="उदा. superadmin या shailesh"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  इस आईडी द्वारा सुपर एडमिन पोर्टल में लॉगिन किया जा सकेगा।
                </p>
              </div>

              {/* Edit Super Admin Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    नया सुपर एडमिन पासवर्ड (New Password)
                  </label>
                  <span className="text-[10px] text-slate-500">खाली छोड़ने पर पुराना पासवर्ड रहेगा</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showSuperPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={superPassword}
                    onChange={(e) => setSuperPassword(e.target.value)}
                    placeholder="नया पासवर्ड दर्ज करें (कम से कम 6 अक्षर)"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSuperPassword(!showSuperPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showSuperPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Super Admin Password */}
              {superPassword && (
                <div className="animate-fadeIn">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    नया पासवर्ड पुनः दर्ज करें (Confirm Password) *
                  </label>
                  <div className="relative">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showSuperPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={superConfirmPassword}
                      onChange={(e) => setSuperConfirmPassword(e.target.value)}
                      placeholder="पासवर्ड की पुष्टि करें"
                      className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 ${
                        superConfirmPassword && superConfirmPassword === superPassword
                          ? 'border-emerald-400 focus:ring-emerald-500'
                          : 'border-slate-200 focus:ring-amber-500'
                      }`}
                      required={Boolean(superPassword)}
                    />
                  </div>
                  {superConfirmPassword && superConfirmPassword !== superPassword && (
                    <p className="text-[10px] text-red-600 font-semibold mt-1">
                      पासवर्ड मेल नहीं खा रहे हैं!
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <button
                type="submit"
                disabled={isSavingSuper || !isSuperAdmin}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-blue-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                {isSavingSuper ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>सहेज रहे हैं...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>सुपर एडमिन क्रेडेंशियल्स सहेजें (Save Super Admin)</span>
                  </>
                )}
              </button>
              {!isSuperAdmin && (
                <p className="text-[10px] text-red-500 text-center mt-1.5">
                  सुपर एडमिन क्रेडेंशियल्स बदलने हेतु सुपर एडमिन अनुमति आवश्यक है।
                </p>
              )}
            </div>
          </form>
        </div>

        {/* ================= REGULAR ADMIN CARD ================= */}
        <div className="bg-white rounded-3xl border border-blue-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-gradient-to-r from-blue-600/15 via-blue-600/5 to-transparent p-5 sm:p-6 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-700 text-white flex items-center justify-center shadow-sm font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  एडमिन क्रेडेंशियल्स (Admin Login)
                </h3>
                <p className="text-xs text-blue-900 font-medium">
                  {credentials.admin.name} ({credentials.admin.mobile})
                </p>
              </div>
            </div>
            <span className="text-[10px] font-black px-2.5 py-1 bg-blue-100 text-blue-900 rounded-full border border-blue-300">
              प्रशासनिक एक्सेस
            </span>
          </div>

          <form onSubmit={handleSaveAdmin} className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between" autoComplete="off">
            <div className="space-y-4">
              {/* Current Active User ID Badge */}
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">वर्तमान सक्रिय User ID:</span>
                <span className="font-mono font-black text-blue-950 bg-white px-2 py-0.5 rounded border border-blue-200">
                  {credentials.admin.userId}
                </span>
              </div>

              {/* Edit Admin User ID */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  एडमिन User ID (लॉगिन उपयोगकर्ता नाम) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    autoComplete="off"
                    value={adminUserId}
                    onChange={(e) => setAdminUserId(e.target.value)}
                    placeholder="उदा. admin या vyavasthapak"
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  इस आईडी द्वारा नियमित एडमिन पोर्टल में लॉगिन किया जा सकेगा।
                </p>
              </div>

              {/* Edit Admin Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    नया एडमिन पासवर्ड (New Password)
                  </label>
                  <span className="text-[10px] text-slate-500">खाली छोड़ने पर पुराना पासवर्ड रहेगा</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="नया पासवर्ड दर्ज करें (कम से कम 6 अक्षर)"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Admin Password */}
              {adminPassword && (
                <div className="animate-fadeIn">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    नया पासवर्ड पुनः दर्ज करें (Confirm Password) *
                  </label>
                  <div className="relative">
                    <CheckCircle2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={adminConfirmPassword}
                      onChange={(e) => setAdminConfirmPassword(e.target.value)}
                      placeholder="पासवर्ड की पुष्टि करें"
                      className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 ${
                        adminConfirmPassword && adminConfirmPassword === adminPassword
                          ? 'border-emerald-400 focus:ring-emerald-500'
                          : 'border-slate-200 focus:ring-blue-600'
                      }`}
                      required={Boolean(adminPassword)}
                    />
                  </div>
                  {adminConfirmPassword && adminConfirmPassword !== adminPassword && (
                    <p className="text-[10px] text-red-600 font-semibold mt-1">
                      पासवर्ड मेल नहीं खा रहे हैं!
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4">
              <button
                type="submit"
                disabled={isSavingAdmin}
                className="w-full py-3 px-4 bg-blue-800 hover:bg-blue-900 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                {isSavingAdmin ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>सहेज रहे हैं...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>एडमिन क्रेडेंशियल्स सहेजें (Save Admin Login)</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SECTION: Create New Admin Username & Password (नया प्रशासनिक Username व Password बनाएं) */}
      <div className="bg-white border-2 border-dashed border-amber-300 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  नया Admin Username व Password बनाएं
                </h3>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                  नया विकल्प
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                किसी भी नए या मौजूदा पदाधिकारी हेतु नया User ID एवं Password पंजीकृत करें
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateAdminModal(!showCreateAdminModal)}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>{showCreateAdminModal ? 'फ़ॉर्म बंद करें' : 'नया क्रेडेंशियल बनाएं'}</span>
          </button>
        </div>

        {/* Expandable Form */}
        {showCreateAdminModal && (
          <div className="mt-6 pt-6 border-t border-amber-200 animate-in fade-in zoom-in-95 max-w-xl mx-auto">
            <CreateAdminCredentialsForm
              onSuccess={() => {
                loadCredentials();
                setShowCreateAdminModal(false);
              }}
            />
          </div>
        )}
      </div>

      {/* SECTION: Active Configured Admin Directory */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-900">
            <Users className="w-5 h-5 text-blue-800" />
            <h3 className="font-black text-sm">सक्रिय प्रशासनिक खाते (Configured Admin Accounts)</h3>
          </div>
          <span className="text-xs text-slate-500">
            अंतिम सिंक: {new Date(credentials.lastModifiedAt || Date.now()).toLocaleDateString('hi-IN')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Super Admin Tile */}
          <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 bg-amber-200/80 text-amber-900 font-black text-[10px] rounded-md flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-700" /> सुपर एडमिन
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">● सक्रिय</span>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-xs font-black text-slate-900">
                User ID: <span className="text-blue-900">{credentials.superAdmin.userId}</span>
              </p>
              <p className="text-xs font-bold text-slate-700">{credentials.superAdmin.name}</p>
              <p className="text-[11px] font-mono text-slate-500">मोबाइल: {credentials.superAdmin.mobile}</p>
            </div>
          </div>

          {/* Admin Tile */}
          <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 bg-blue-200/80 text-blue-900 font-black text-[10px] rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-700" /> अधिकृत एडमिन
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">● सक्रिय</span>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-xs font-black text-slate-900">
                User ID: <span className="text-blue-900">{credentials.admin.userId}</span>
              </p>
              <p className="text-xs font-bold text-slate-700">{credentials.admin.name}</p>
              <p className="text-[11px] font-mono text-slate-500">मोबाइल: {credentials.admin.mobile}</p>
            </div>
          </div>

          {/* Custom Accounts If Any */}
          {credentials.customAdmins &&
            Object.entries(credentials.customAdmins).map(([k, acc]) => (
              <div
                key={k}
                className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-200 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-emerald-200/80 text-emerald-900 font-black text-[10px] rounded-md flex items-center gap-1">
                    <User className="w-3 h-3 text-emerald-700" /> {acc.role === 'superadmin' ? 'सुपर एडमिन' : 'एडमिन'}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">● सक्रिय</span>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-xs font-black text-slate-900">
                    User ID: <span className="text-emerald-900">{acc.userId}</span>
                  </p>
                  <p className="text-xs font-bold text-slate-700">{acc.name || 'कस्टम एडमिन'}</p>
                  <p className="text-[11px] font-mono text-slate-500">मोबाइल: {acc.mobile}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Safety & Reset Defaults Bottom Panel */}
      {isSuperAdmin && (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-900">
                फ़ैक्टरी डिफ़ॉल्ट रीसेट (Emergency Factory Reset)
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                यदि आप नया पासवर्ड भूल जाते हैं, तो क्रेडेंशियल्स को मूल फाउंडेशन सेटिंग्स (superadmin / admin) पर पुनर्स्थापित किया जा सकता है।
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetDefaults}
            disabled={isResetting}
            className="px-4 py-2.5 bg-slate-200 hover:bg-red-100 hover:text-red-700 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer shrink-0 border border-slate-300 flex items-center gap-2"
          >
            {isResetting ? (
              <RotateCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span>मूल डिफ़ॉल्ट पर रीसेट करें</span>
          </button>
        </div>
      )}
    </div>
  );
};
