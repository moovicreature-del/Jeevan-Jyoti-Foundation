// ============================================================================
// JEEVAN JYOTI FOUNDATION - APP LOGO & THUMBNAIL MANAGER
// जीवन ज्योति फाउंडेशन - आधिकारिक ऐप लोगो एवं वेबसाइट थंबनेल प्रबंधक
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  RotateCw,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Award,
  FileCheck,
  Eye,
  Trash2,
  Globe,
  ExternalLink,
  Layers,
  Share2,
  Smartphone,
  Copy,
  Check,
  Compass
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useHomeContent } from '../../context/HomeContentContext';
import { useAdminUploadProgress } from '../../context/AdminUploadProgressContext';
import {
  updateAppLogo,
  resetAppLogo,
  updateAppThumbnail,
  resetAppThumbnail,
  deleteThumbnailFromAllDatabases,
  uploadMediaFile,
  optimizeImageFile,
  purgeAllOtherLogosFromDatabaseAndEnforceSoleLogo,
  deleteLogoFromAllDatabases
} from '../../services/adminService';
import { BrandLogo } from '../common/BrandLogo';
import toast from 'react-hot-toast';

export const AppLogoManager: React.FC = () => {
  const { adminProfile } = useAdminAuth();
  const { content } = useHomeContent();
  const { startUpload, updateProgress, completeUpload, failUpload } = useAdminUploadProgress();

  // Active Management Section: 'logo' (Brand Logo) or 'thumbnail' (App & Website Social Share Thumbnail)
  const [managerMode, setManagerMode] = useState<'logo' | 'thumbnail'>('logo');

  // --- 1. MAIN LOGO STATE ---
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('jjf_custom_logo');
        if (stored) return stored;
      } catch {
        // Ignore
      }
    }
    return content?.appLogoUrl || '';
  });
  const [logoDirectUrlInput, setLogoDirectUrlInput] = useState<string>('');
  const [activeLogoPreviewTab, setActiveLogoPreviewTab] = useState<'navbar' | 'certificate' | 'seal' | 'watermark'>('navbar');

  // --- 2. APP THUMBNAIL STATE ---
  const [selectedThumbFile, setSelectedThumbFile] = useState<File | null>(null);
  const [thumbPreviewUrl, setThumbPreviewUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('jjf_custom_thumbnail');
        if (stored) return stored;
      } catch {
        // Ignore
      }
    }
    return content?.appThumbnailUrl || '';
  });
  const [thumbDirectUrlInput, setThumbDirectUrlInput] = useState<string>('');
  const [activeThumbPreviewTab, setActiveThumbPreviewTab] = useState<'whatsapp' | 'mobile_app' | 'browser'>('whatsapp');

  // --- COMMON STATE ---
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isApplying, setIsApplying] = useState<boolean>(false);

  // Sync with context updates
  useEffect(() => {
    if (content?.appLogoUrl) {
      setLogoPreviewUrl(content.appLogoUrl);
    } else if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('jjf_custom_logo');
      setLogoPreviewUrl(stored || '');
    }

    if (content?.appThumbnailUrl) {
      setThumbPreviewUrl(content.appThumbnailUrl);
    } else if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('jjf_custom_thumbnail');
      setThumbPreviewUrl(stored || '');
    }
  }, [content?.appLogoUrl, content?.appThumbnailUrl]);

  // ==========================================
  // HANDLERS FOR MAIN LOGO
  // ==========================================
  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('कृपया केवल इमेज फ़ाइल (PNG, JPG, WEBP, SVG) चुनें!');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('फ़ाइल का आकार 10MB से कम होना चाहिए!');
      return;
    }

    setSelectedLogoFile(file);
    try {
      const optimizedUrl = await optimizeImageFile(file);
      setLogoPreviewUrl(optimizedUrl);
      setLogoDirectUrlInput('');
      toast.success('लोगो फ़ोटो चुनी गई! लागू करने के लिए "नया मुख्य लोगो सेव करें" पर क्लिक करें।');
    } catch {
      const localBlobUrl = URL.createObjectURL(file);
      setLogoPreviewUrl(localBlobUrl);
      setLogoDirectUrlInput('');
      toast.success('लोगो फ़ोटो चुनी गई! लागू करने के लिए "नया मुख्य लोगो सेव करें" पर क्लिक करें।');
    }
  };

  const handleLogoDirectUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setLogoDirectUrlInput(url);
    if (url.trim()) {
      setSelectedLogoFile(null);
      setLogoPreviewUrl(url.trim());
    } else {
      setLogoPreviewUrl(content?.appLogoUrl || '');
    }
  };

  const handleApplyNewLogo = async () => {
    const adminName = adminProfile?.name || 'सिस्टम व्यवस्थापक';
    const adminUid = adminProfile?.uid || 'admin';

    let finalLogoUrl = logoPreviewUrl;
    if (!finalLogoUrl && !selectedLogoFile) {
      toast.error('कृपया पहले कोई लोगो फ़ाइल चुनें या इमेज URL दर्ज करें!');
      return;
    }

    setIsApplying(true);
    startUpload('संस्था लोगो सार्वभौमिक अपडेट', 'content', 'लोगो अनुकूलन, अपलोड व रीयलटाइम डेटाबेस सिंक');

    try {
      if (selectedLogoFile) {
        setIsUploading(true);
        updateProgress(25, 'लोगो इमेज को अनुकूलित किया जा रहा है...');
        try {
          const optimizedDataUrl = await optimizeImageFile(selectedLogoFile);
          finalLogoUrl = optimizedDataUrl;
          updateProgress(50, 'क्लाउड स्टोरेज में लोगो सुरक्षित हो रहा है...');
        } catch {
          finalLogoUrl = await uploadMediaFile(
            selectedLogoFile,
            'banners',
            (progress, message, bytesDetail) => {
              updateProgress(progress, message, bytesDetail);
            }
          );
        }
      }

      updateProgress(85, 'सभी पेजों, प्रमाणपत्रों व नेवबार में लोगो लागू हो रहा है...');
      await updateAppLogo(finalLogoUrl, adminName, adminUid);

      setLogoPreviewUrl(finalLogoUrl);
      setSelectedLogoFile(null);
      setLogoDirectUrlInput('');

      const fileInput = document.getElementById('admin-app-logo-file-input') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';

      completeUpload('नया लोगो सभी पेजों पर सफलतापूर्वक लागू हो गया!');
      toast.success('🎉 नया लोगो पूरी वेबसाइट, नेवबार, रसीदों व प्रमाण पत्रों पर तुरंत लागू हो गया!');
    } catch (err) {
      console.error(err);
      failUpload('लोगो अपडेट करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
      toast.error('लोगो अपडेट करने में त्रुटि आई।');
    } finally {
      setIsUploading(false);
      setIsApplying(false);
    }
  };

  const handleResetLogoToDefault = async () => {
    const adminName = adminProfile?.name || 'सिस्टम व्यवस्थापक';
    const adminUid = adminProfile?.uid || 'admin';

    if (!confirm('क्या आप लोगो को मूल डिफ़ॉल्ट वेक्टर प्रतीक (Official Vector Emblem) में रीसेट करना चाहते हैं?')) {
      return;
    }

    setIsApplying(true);
    startUpload('मूल लोगो रीसेट प्रक्रिया', 'content', 'डिफ़ॉल्ट वेक्टर प्रतीक पुनर्स्थापित हो रहा है');

    try {
      await resetAppLogo(adminName, adminUid);
      setLogoPreviewUrl('');
      setSelectedLogoFile(null);
      setLogoDirectUrlInput('');
      const fileInput = document.getElementById('admin-app-logo-file-input') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';
      completeUpload('मूल डिफ़ॉल्ट वेक्टर लोगो सफलतापूर्वक पुनर्स्थापित हो गया!');
      toast.success('मूल डिफ़ॉल्ट लोगो सफलतापूर्वक रीसेट हो गया!');
    } catch (err) {
      console.error(err);
      failUpload('रीसेट करने में त्रुटि आई।');
      toast.error('लोगो रीसेट करने में त्रुटि आई।');
    } finally {
      setIsApplying(false);
    }
  };

  const handleDeleteLogoEverywhere = async () => {
    const adminName = adminProfile?.name || 'सिस्टम व्यवस्थापक';
    if (!confirm('क्या आप डेटाबेस, फायरस्टोर और लोकल स्टोरेज से लोगो पूरी तरह डिलीट करना चाहते हैं? इसके बाद संस्था का मूल वेक्टर प्रतीक सक्रिय रहेगा।')) {
      return;
    }

    setIsApplying(true);
    startUpload('लोगो सम्पूर्ण निष्कासन', 'content', 'डेटाबेस व सभी स्टोरेज से लोगो डिलीट किया जा रहा है...');

    try {
      const res = await deleteLogoFromAllDatabases(adminName);
      setLogoPreviewUrl('');
      setSelectedLogoFile(null);
      setLogoDirectUrlInput('');
      const fileInput = document.getElementById('admin-app-logo-file-input') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';
      completeUpload(res.message);
      toast.success(res.message);
    } catch (err) {
      console.error(err);
      failUpload('लोगो डिलीट करने में त्रुटि आई।');
      toast.error('लोगो डिलीट करने में त्रुटि आई।');
    } finally {
      setIsApplying(false);
    }
  };

  // ==========================================
  // HANDLERS FOR APP & WEBSITE THUMBNAIL LOGO
  // ==========================================
  const handleThumbFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('कृपया केवल इमेज फ़ाइल (PNG, JPG, WEBP, SVG) चुनें!');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('फ़ाइल का आकार 10MB से कम होना चाहिए!');
      return;
    }

    setSelectedThumbFile(file);
    try {
      const optimizedUrl = await optimizeImageFile(file);
      setThumbPreviewUrl(optimizedUrl);
      setThumbDirectUrlInput('');
      toast.success('थंबनेल इमेज चुनी गई! लागू करने के लिए "वेबसाइट एवं ऐप थंबनेल सेव करें" पर क्लिक करें।');
    } catch {
      const localBlobUrl = URL.createObjectURL(file);
      setThumbPreviewUrl(localBlobUrl);
      setThumbDirectUrlInput('');
      toast.success('थंबनेल इमेज चुनी गई! लागू करने के लिए "वेबसाइट एवं ऐप थंबनेल सेव करें" पर क्लिक करें।');
    }
  };

  const handleThumbDirectUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setThumbDirectUrlInput(url);
    if (url.trim()) {
      setSelectedThumbFile(null);
      setThumbPreviewUrl(url.trim());
    } else {
      setThumbPreviewUrl(content?.appThumbnailUrl || '');
    }
  };

  // Copy Main Logo into Thumbnail
  const handleCopyMainLogoToThumbnail = () => {
    const mainLogo = logoPreviewUrl || content?.appLogoUrl || '';
    if (!mainLogo) {
      toast.error('मुख्य लोगो अभी खाली है! कृपया पहले मुख्य लोगो अपलोड करें या कोई इमेज चुनें।');
      return;
    }
    setThumbPreviewUrl(mainLogo);
    setSelectedThumbFile(null);
    setThumbDirectUrlInput('');
    toast.success('मुख्य लोगो को थंबनेल पूर्वावलोकन में कॉपी कर दिया गया है! अब "थंबनेल सेव करें" पर क्लिक करें।');
  };

  // Upload and Apply App Thumbnail
  const handleApplyAppThumbnail = async () => {
    const adminName = adminProfile?.name || 'सिस्टम व्यवस्थापक';
    const adminUid = adminProfile?.uid || 'admin';

    let finalThumbUrl = thumbPreviewUrl;
    if (!finalThumbUrl && !selectedThumbFile) {
      toast.error('कृपया पहले कोई थंबनेल इमेज फ़ाइल चुनें या URL दर्ज करें!');
      return;
    }

    setIsApplying(true);
    startUpload('ऐप थंबनेल सार्वभौमिक अपडेट', 'content', 'थंबनेल अनुकूलन, अपलोड व सोशल शेयर सिंक');

    try {
      if (selectedThumbFile) {
        setIsUploading(true);
        updateProgress(30, 'थंबनेल इमेज अनुकूलित की जा रही है (512x512 उच्च-गुणवत्ता)...');
        try {
          const optimizedDataUrl = await optimizeImageFile(selectedThumbFile);
          finalThumbUrl = optimizedDataUrl;
          updateProgress(60, 'क्लाउड स्टोरेज में थंबनेल सुरक्षित हो रहा है...');
        } catch {
          finalThumbUrl = await uploadMediaFile(
            selectedThumbFile,
            'banners',
            (progress, message, bytesDetail) => {
              updateProgress(progress, message, bytesDetail);
            }
          );
        }
      }

      updateProgress(85, 'मेटा टैग्स, OpenGraph, व्हाट्सएप शेयर कार्ड व PWA आइकन में थंबनेल लागू हो रहा है...');
      await updateAppThumbnail(finalThumbUrl, adminName, adminUid);

      setThumbPreviewUrl(finalThumbUrl);
      setSelectedThumbFile(null);
      setThumbDirectUrlInput('');

      const fileInput = document.getElementById('admin-app-thumbnail-file-input') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';

      completeUpload('ऐप थंबनेल लोगो सफलतापूर्वक अपडेट हो गया!');
      toast.success('🎉 वेबसाइट एवं ऐप का थंबनेल लोगो सफलतापूर्वक अपडेट हो गया! व्हाट्सएप शेयर, सोशल मीडिया व PWA आइकन पर तुरंत लागू!');
    } catch (err) {
      console.error(err);
      failUpload('थंबनेल अपडेट करने में त्रुटि आई। कृपया पुनः प्रयास करें।');
      toast.error('थंबनेल अपडेट करने में त्रुटि आई।');
    } finally {
      setIsUploading(false);
      setIsApplying(false);
    }
  };

  const handleResetThumbToDefault = async () => {
    const adminName = adminProfile?.name || 'सिस्टम व्यवस्थापक';
    const adminUid = adminProfile?.uid || 'admin';

    if (!confirm('क्या आप ऐप थंबनेल को मूल डिफ़ॉल्ट (Default PWA Emblem) में रीसेट करना चाहते हैं?')) {
      return;
    }

    setIsApplying(true);
    startUpload('थंबनेल रीसेट प्रक्रिया', 'content', 'डिफ़ॉल्ट थंबनेल पुनर्स्थापित हो रहा है');

    try {
      await resetAppThumbnail(adminName, adminUid);
      setThumbPreviewUrl('');
      setSelectedThumbFile(null);
      setThumbDirectUrlInput('');
      const fileInput = document.getElementById('admin-app-thumbnail-file-input') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';
      completeUpload('डिफ़ॉल्ट थंबनेल सफलतापूर्वक पुनर्स्थापित हो गया!');
      toast.success('डिफ़ॉल्ट थंबनेल सफलतापूर्वक रीसेट हो गया!');
    } catch (err) {
      console.error(err);
      failUpload('थंबनेल रीसेट करने में त्रुटि आई।');
      toast.error('थंबनेल रीसेट करने में त्रुटि आई।');
    } finally {
      setIsApplying(false);
    }
  };

  const handleDeleteThumbEverywhere = async () => {
    const adminName = adminProfile?.name || 'सिस्टम व्यवस्थापक';
    const adminUid = adminProfile?.uid || 'admin';

    if (!confirm('क्या आप डेटाबेस और स्टोरेज से कस्टम ऐप थंबनेल लोगो हटाना चाहते हैं?')) {
      return;
    }

    setIsApplying(true);
    startUpload('थंबनेल निष्कासन', 'content', 'डेटाबेस से थंबनेल हटाया जा रहा है...');

    try {
      const res = await deleteThumbnailFromAllDatabases(adminName, adminUid);
      setThumbPreviewUrl('');
      setSelectedThumbFile(null);
      setThumbDirectUrlInput('');
      const fileInput = document.getElementById('admin-app-thumbnail-file-input') as HTMLInputElement | null;
      if (fileInput) fileInput.value = '';
      completeUpload(res.message);
      toast.success(res.message);
    } catch (err) {
      console.error(err);
      failUpload('थंबनेल हटाने में त्रुटि आई।');
      toast.error('थंबनेल हटाने में त्रुटि आई।');
    } finally {
      setIsApplying(false);
    }
  };

  const isCustomLogoActive = Boolean(content?.appLogoUrl || logoPreviewUrl);
  const isCustomThumbActive = Boolean(content?.appThumbnailUrl || thumbPreviewUrl);

  const resolvedThumbDisplay = thumbPreviewUrl || '/pwa-icon-512.png';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
      {/* 1. TOP HEADER & MODE SELECTOR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-blue-950 flex items-center justify-center font-black shadow-md border border-amber-300 shrink-0">
            <Sparkles className="w-6 h-6 text-blue-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                ऐप लोगो एवं थंबनेल प्रबंधक (App Logo & Thumbnail Manager)
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live Global Sync
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              संस्था का मुख्य लोगो (Navbar/Certificates) एवं वेबसाइट/ऐप का सोशल शेयर थंबनेल (WhatsApp/PWA/Favicon) यहाँ से बदलें।
            </p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 self-stretch md:self-auto">
          {managerMode === 'logo' ? (
            isCustomLogoActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                कस्टम मुख्य लोगो सक्रिय
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                डिफ़ॉल्ट वेक्टर लोगो सक्रिय
              </span>
            )
          ) : (
            isCustomThumbActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-full text-xs font-bold">
                <CheckCircle className="w-3.5 h-3.5 text-purple-600" />
                कस्टम ऐप थंबनेल सक्रिय
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-full text-xs font-bold">
                <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                डिफ़ॉल्ट PWA थंबनेल सक्रिय
              </span>
            )
          )}
        </div>
      </div>

      {/* 2. DUAL MODE NAVIGATION TABS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
        <button
          type="button"
          onClick={() => setManagerMode('logo')}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            managerMode === 'logo'
              ? 'bg-white text-blue-900 shadow-md border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span>1. संस्था मुख्य लोगो (Navbar, Certificates, Donation Receipts)</span>
        </button>

        <button
          type="button"
          id="btn-switch-to-thumbnail-tab"
          onClick={() => setManagerMode('thumbnail')}
          className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-black text-xs sm:text-sm transition-all cursor-pointer ${
            managerMode === 'thumbnail'
              ? 'bg-gradient-to-r from-purple-800 to-indigo-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Share2 className={`w-4 h-4 ${managerMode === 'thumbnail' ? 'text-amber-300' : 'text-purple-700'}`} />
          <span>2. वेबसाइट व ऐप थंबनेल (WhatsApp, Social Share & PWA Icon)</span>
          <span className="text-[10px] bg-amber-400 text-purple-950 font-black px-1.5 py-0.2 rounded-full uppercase">
            Option
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: MAIN LOGO MANAGER */}
      {/* ========================================================================= */}
      {managerMode === 'logo' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 text-xs text-blue-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">संस्था का मुख्य लोगो (Universal Brand Logo):</strong>
              यह लोगो वेबसाइट के मुख्य नेवबार हेडर, फुटर, दान पावती रसीदों, स्वयंसेवक व दानदाता प्रमाण पत्रों, डिजिटल मुहर (Stamp) तथा आधिकारिक लेटरहेड पर स्वतः दिखाई देता है।
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Upload Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* File Dropzone */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-3xl p-6 transition-all text-center relative group">
                <input
                  type="file"
                  id="admin-app-logo-file-input"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={handleLogoFileChange}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  disabled={isApplying || isUploading}
                />
                <div className="flex flex-col items-center justify-center gap-2.5">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-200 flex items-center justify-center text-blue-800 group-hover:scale-105 group-hover:bg-blue-800 group-hover:text-white transition-all">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-slate-800 block">
                      नया मुख्य लोगो फ़ाइल चुनें या यहाँ ड्रैग करें
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      PNG (ट्रांसपेरेंट बैकग्राउंड सर्वोत्तम), JPG, WEBP या SVG (अधिकतम 10MB)
                    </span>
                  </div>
                  {selectedLogoFile && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-900 rounded-xl text-xs font-bold">
                      <CheckCircle className="w-4 h-4 text-blue-700" />
                      चयनित: {selectedLogoFile.name} ({(selectedLogoFile.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </div>
              </div>

              {/* Direct URL Input */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-700" />
                  अथवा सीधा इमेज वेब लिंक पेस्ट करें (Optional Web URL)
                </label>
                <input
                  type="url"
                  value={logoDirectUrlInput}
                  onChange={handleLogoDirectUrlChange}
                  placeholder="https://example.com/images/my-ngo-logo.png"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-800"
                  disabled={isApplying || isUploading}
                />
                <p className="text-[11px] text-slate-400">
                  Google Drive, Cloudinary, Imgur या अपनी वेबसाइट का सीधा इमेज लिंक दर्ज करें।
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleApplyNewLogo}
                  disabled={isApplying || isUploading || (!selectedLogoFile && !logoPreviewUrl && !logoDirectUrlInput)}
                  className="flex-1 min-w-[220px] flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-blue-900/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApplying || isUploading ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin text-amber-300" />
                      <span>अपलोड व रीयलटाइम सिंक जारी है...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-amber-300" />
                      <span>नया मुख्य लोगो सेव करें व सभी जगह लागू करें</span>
                    </>
                  )}
                </button>

                {isCustomLogoActive && (
                  <button
                    type="button"
                    onClick={handleResetLogoToDefault}
                    disabled={isApplying || isUploading}
                    title="मूल डिफ़ॉल्ट वेक्टर लोगो पर वापस लौटें"
                    className="flex items-center gap-2 px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition cursor-pointer border border-slate-200"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                    <span>डिफ़ॉल्ट लोगो रीसेट</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDeleteLogoEverywhere}
                  disabled={isApplying || isUploading}
                  title="डेटाबेस, फायरस्टोर और लोकल स्टोरेज से लोगो पूरी तरह डिलीट करें"
                  className="flex items-center gap-1.5 px-3.5 py-3.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-2xl font-bold text-xs transition cursor-pointer border border-red-200"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span>लोगो डिलीट करें</span>
                </button>
              </div>
            </div>

            {/* Right Column: Multi-Context Live Preview (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-slate-100/80 rounded-3xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-800" />
                  <span className="font-black text-xs text-slate-800">
                    लाइव संदर्भ पूर्वावलोकन (Main Logo Live Preview)
                  </span>
                </div>
                <span className="text-[10px] bg-amber-400 text-blue-950 font-black px-1.5 py-0.5 rounded">
                  Real-time
                </span>
              </div>

              {/* Context Selector Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-200/70 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveLogoPreviewTab('navbar')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    activeLogoPreviewTab === 'navbar' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  नेवबार
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLogoPreviewTab('certificate')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    activeLogoPreviewTab === 'certificate' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  प्रमाण पत्र
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLogoPreviewTab('seal')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    activeLogoPreviewTab === 'seal' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  मुहर (Seal)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLogoPreviewTab('watermark')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    activeLogoPreviewTab === 'watermark' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  वॉटरमार्क
                </button>
              </div>

              {/* Preview Canvas */}
              <div className="min-h-[220px] flex items-center justify-center">
                {activeLogoPreviewTab === 'navbar' && (
                  <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center gap-3">
                    <BrandLogo size={46} customLogoUrl={logoPreviewUrl || undefined} className="drop-shadow-xs" />
                    <div>
                      <div className="font-black text-sm text-[#3F2B96] leading-none font-['Cinzel',serif]">
                        JEEVAN JYOTI FOUNDATION
                      </div>
                      <div className="text-[10px] font-bold text-amber-700 leading-tight mt-0.5">
                        जीवन ज्योति फाउंडेशन • ग़ाज़ीपुर, उत्तर प्रदेश, भारत
                      </div>
                    </div>
                  </div>
                )}

                {activeLogoPreviewTab === 'certificate' && (
                  <div className="w-full bg-[#FFFDF8] rounded-2xl p-4 shadow-sm border border-amber-200 text-center space-y-2">
                    <BrandLogo size={60} customLogoUrl={logoPreviewUrl || undefined} className="mx-auto drop-shadow-xs" />
                    <div>
                      <div className="font-black text-xs text-[#8B0000] tracking-wider uppercase">
                        JEEVAN JYOTI FOUNDATION GHAZIPUR
                      </div>
                      <div className="text-[10px] font-semibold text-slate-600">
                        भारत सरकार पंजीकृत एवं अधिकृत संस्था
                      </div>
                    </div>
                  </div>
                )}

                {activeLogoPreviewTab === 'seal' && (
                  <div className="w-full flex items-center justify-center p-3">
                    <div className="relative w-36 h-36 rounded-full border-4 border-dashed border-red-700 bg-red-50/50 flex flex-col items-center justify-center p-2 shadow-inner text-center">
                      <span className="text-[8px] font-black text-red-800 uppercase tracking-widest">
                        ★ OFFICIAL SEAL ★
                      </span>
                      <div className="my-1">
                        <BrandLogo size={42} customLogoUrl={logoPreviewUrl || undefined} />
                      </div>
                      <span className="text-[7px] font-bold text-red-800">
                        GOVT. REGD. NGO
                      </span>
                    </div>
                  </div>
                )}

                {activeLogoPreviewTab === 'watermark' && (
                  <div className="w-full relative h-40 bg-white rounded-2xl p-4 border border-slate-200 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <BrandLogo size={140} watermark opacity={0.12} customLogoUrl={logoPreviewUrl || undefined} />
                    </div>
                    <div className="relative z-10 text-center space-y-1">
                      <span className="text-xs font-black text-slate-800 block">
                        प्रमाण पत्र वॉटरमार्क पृष्ठभूमि
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        दस्तावेज़ की बैकग्राउंड में हल्का वॉटरमार्क
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200/60 text-[11px] text-blue-900 leading-relaxed">
                <span className="font-black block">💡 तत्काल सार्वभौमिक अद्यतन (Instant Global Fix):</span>
                जैसे ही आप लोगो सेव करेंगे, वेबसाइट का हर पेज और सभी प्रमाण पत्र बिना पेज रिफ्रेश किए स्वतः नए लोगो से अपडेट हो जाएंगे।
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: WEBSITE & APP THUMBNAIL LOGO MANAGER (Requested Feature) */}
      {/* ========================================================================= */}
      {managerMode === 'thumbnail' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Information & Feature Summary */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-950 text-white rounded-3xl p-6 shadow-md border border-purple-400/40 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-black">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>वेबसाइट एवं ऐप थंबनेल लोगो चेंजर (App Thumbnail Logo Changer)</span>
                </div>
                <h4 className="text-lg font-black text-white">
                  सोशल मीडिया शेयर थंबनेल, PWA मोबाइल ऐप आइकन व फेविकॉन
                </h4>
                <p className="text-xs text-purple-100 max-w-2xl leading-relaxed">
                  जब कोई व्यक्ति इस वेबसाइट का लिंक व्हाट्सएप (WhatsApp), फेसबुक, ट्विटर या सोशल मीडिया पर शेयर करेगा — तो यह थंबनेल लोगो कार्ड के रूप में दिखेगा। साथ ही मोबाइल में ऐप इंस्टॉल करने पर यह होम-स्क्रीन ऐप आइकन (PWA Thumbnail) का कार्य करता है।
                </p>
              </div>

              {/* Fast Copy Main Logo Shortcut */}
              <button
                type="button"
                onClick={handleCopyMainLogoToThumbnail}
                className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-blue-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer shrink-0"
              >
                <Copy className="w-4 h-4" />
                <span>मुख्य लोगो को थंबनेल बनाएं</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Upload Controls (7 Cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* File Dropzone */}
              <div className="bg-purple-50/50 border-2 border-dashed border-purple-300 hover:border-purple-600 rounded-3xl p-6 transition-all text-center relative group">
                <input
                  type="file"
                  id="admin-app-thumbnail-file-input"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={handleThumbFileChange}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                  disabled={isApplying || isUploading}
                />
                <div className="flex flex-col items-center justify-center gap-2.5">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-purple-200 flex items-center justify-center text-purple-800 group-hover:scale-105 group-hover:bg-purple-800 group-hover:text-white transition-all">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-slate-800 block">
                      ऐप थंबनेल इमेज फ़ाइल चुनें या ड्रैग करें
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      PNG (512x512 पिक्सल अनुशंसित), JPG, WEBP या SVG (अधिकतम 10MB)
                    </span>
                  </div>
                  {selectedThumbFile && (
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-950 rounded-xl text-xs font-bold">
                      <CheckCircle className="w-4 h-4 text-purple-700" />
                      चयनित: {selectedThumbFile.name} ({(selectedThumbFile.size / 1024).toFixed(1)} KB)
                    </div>
                  )}
                </div>
              </div>

              {/* Direct URL Input */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-purple-700" />
                  अथवा सीधा इमेज वेब लिंक दर्ज करें (Image URL)
                </label>
                <input
                  type="url"
                  value={thumbDirectUrlInput}
                  onChange={handleThumbDirectUrlChange}
                  placeholder="https://example.com/images/my-app-thumbnail.png"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-purple-800"
                  disabled={isApplying || isUploading}
                />
                <p className="text-[11px] text-slate-400">
                  Google Drive, Imgur, Cloudinary या अपनी वेबसाइट का सीधा 512x512 इमेज लिंक यहाँ पेस्ट कर सकते हैं।
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  id="btn-save-app-thumbnail"
                  onClick={handleApplyAppThumbnail}
                  disabled={isApplying || isUploading || (!selectedThumbFile && !thumbPreviewUrl && !thumbDirectUrlInput)}
                  className="flex-1 min-w-[220px] flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-800 via-indigo-900 to-blue-900 hover:from-purple-700 hover:to-indigo-800 text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-purple-950/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApplying || isUploading ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin text-amber-300" />
                      <span>थंबनेल अपलोड व मेटा टैग्स सिंक जारी है...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-amber-300" />
                      <span>वेबसाइट एवं ऐप थंबनेल सेव करें (Save Thumbnail)</span>
                    </>
                  )}
                </button>

                {isCustomThumbActive && (
                  <button
                    type="button"
                    onClick={handleResetThumbToDefault}
                    disabled={isApplying || isUploading}
                    title="डिफ़ॉल्ट PWA थंबनेल पर वापस लौटें"
                    className="flex items-center gap-2 px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-xs transition cursor-pointer border border-slate-200"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                    <span>डिफ़ॉल्ट रीसेट</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDeleteThumbEverywhere}
                  disabled={isApplying || isUploading}
                  title="डेटाबेस और स्टोरेज से थंबनेल हटाएं"
                  className="flex items-center gap-1.5 px-3.5 py-3.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-2xl font-bold text-xs transition cursor-pointer border border-red-200"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                  <span>थंबनेल डिलीट करें</span>
                </button>
              </div>
            </div>

            {/* Right Column: Multi-Device Simulation Preview (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-b from-slate-50 to-slate-100/80 rounded-3xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-purple-800" />
                  <span className="font-black text-xs text-slate-800">
                    थंबनेल लाइव सिमुलेशन (Real Live Simulation)
                  </span>
                </div>
                <span className="text-[10px] bg-purple-600 text-white font-black px-1.5 py-0.5 rounded">
                  OpenGraph Live
                </span>
              </div>

              {/* Simulation Selector Tabs */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/70 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveThumbPreviewTab('whatsapp')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    activeThumbPreviewTab === 'whatsapp' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  व्हाट्सएप शेयर
                </button>
                <button
                  type="button"
                  onClick={() => setActiveThumbPreviewTab('mobile_app')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    activeThumbPreviewTab === 'mobile_app' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  मोबाइल ऐप PWA
                </button>
                <button
                  type="button"
                  onClick={() => setActiveThumbPreviewTab('browser')}
                  className={`py-1.5 text-[11px] font-bold rounded-lg transition cursor-pointer ${
                    activeThumbPreviewTab === 'browser' ? 'bg-white text-purple-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ब्राउज़र टैब
                </button>
              </div>

              {/* SIMULATION PREVIEW 1: WHATSAPP / SOCIAL MEDIA SHARE CARD */}
              {activeThumbPreviewTab === 'whatsapp' && (
                <div className="bg-[#EFEAE2] rounded-2xl p-3.5 shadow-inner border border-stone-300 space-y-2">
                  <span className="text-[10px] font-bold text-stone-600 block">
                    💬 व्हाट्सएप लिंक शेयरिंग पूर्वावलोकन (WhatsApp Link Card):
                  </span>
                  <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                    <div className="h-36 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                      <img
                        src={resolvedThumbDisplay}
                        alt="App Thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/pwa-icon-512.png';
                        }}
                      />
                    </div>
                    <div className="p-3 bg-stone-50 border-t border-stone-200">
                      <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block truncate">
                        jeevanjyotifoundation.org
                      </span>
                      <h5 className="text-xs font-black text-slate-900 leading-snug line-clamp-1 mt-0.5">
                        जीवन ज्योति फाउंडेशन ग़ाज़ीपुर | Jeevan Jyoti Foundation
                      </h5>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
                        Official NGO platform for Education, Healthcare, Food Distribution & Volunteerism in Ghazipur, UP.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SIMULATION PREVIEW 2: MOBILE APP HOMESCREEN ICON (PWA) */}
              {activeThumbPreviewTab === 'mobile_app' && (
                <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-center text-white space-y-3 shadow-inner">
                  <span className="text-[10px] font-bold text-purple-200 block">
                    📱 मोबाइल होम-स्क्रीन ऐप आइकन (Mobile App Icon):
                  </span>
                  <div className="inline-block relative">
                    <div className="w-20 h-20 rounded-2xl shadow-2xl bg-white p-1.5 border-2 border-amber-400 mx-auto overflow-hidden flex items-center justify-center">
                      <img
                        src={resolvedThumbDisplay}
                        alt="App Icon"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/pwa-icon-512.png';
                        }}
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">
                      जीवन ज्योति
                    </span>
                    <span className="text-[10px] text-amber-300 block">
                      PWA मोबाइल ऐप
                    </span>
                  </div>
                </div>
              )}

              {/* SIMULATION PREVIEW 3: BROWSER TAB & BOOKMARK */}
              {activeThumbPreviewTab === 'browser' && (
                <div className="bg-slate-200 rounded-2xl p-3 space-y-2 border border-slate-300">
                  <span className="text-[10px] font-bold text-slate-600 block">
                    🌐 ब्राउज़र विंडो टैब पूर्वावलोकन (Browser Favicon):
                  </span>
                  <div className="bg-white rounded-t-xl px-3 py-2 flex items-center gap-2 shadow-xs border border-b-0 border-slate-300">
                    <img
                      src={resolvedThumbDisplay}
                      alt="Favicon"
                      referrerPolicy="no-referrer"
                      className="w-4 h-4 rounded-sm object-contain shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/pwa-icon-512.png';
                      }}
                    />
                    <span className="text-[11px] font-bold text-slate-800 truncate max-w-[200px]">
                      जीवन ज्योति फाउंडेशन ग़ाज़ीपुर...
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-b-xl border border-slate-300 text-center text-xs text-slate-500">
                    वेबसाइट का नया थंबनेल लोगो ब्राउज़र टैब, फेविकॉन और बुकमार्क में दिखाई देगा।
                  </div>
                </div>
              )}

              {/* Info Note */}
              <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-200 text-[11px] text-purple-950 leading-relaxed">
                <span className="font-black block">💡 स्वतः रीयलटाइम मेटा-टैग्स अपडेट:</span>
                थंबनेल सेव करते ही HTML के <code className="font-mono bg-purple-100 px-1 rounded">&lt;meta property="og:image"&gt;</code>, Twitter Card तथा PWA आइकन में यह स्वतः तुरंत लाइव हो जाएगा।
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
