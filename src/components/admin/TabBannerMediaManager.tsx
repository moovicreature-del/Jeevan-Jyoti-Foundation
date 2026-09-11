// ============================================================================
// JEEVAN JYOTI FOUNDATION - TAB 1: BANNER & MULTI-PHOTO SLIDER MANAGER
// जीवन ज्योति फाउंडेशन - होम पेज फ़ोटो स्लाइडर एवं मीडिया प्रबंधक
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  Video,
  Upload,
  Save,
  CheckCircle,
  AlertCircle,
  Eye,
  Sparkles,
  RotateCw,
  Film,
  ExternalLink,
  RefreshCw,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Layers,
  Clock,
  Play,
  Pause,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Check
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useHomeContent } from '../../context/HomeContentContext';
import { useAdminUploadProgress } from '../../context/AdminUploadProgressContext';
import {
  saveHomeContent,
  uploadMediaFile,
  DEFAULT_SLIDER_PHOTOS
} from '../../services/adminService';
import { AppLogoManager } from './AppLogoManager';
import { SliderPhotoItem } from '../../types';
import toast from 'react-hot-toast';

export const TabBannerMediaManager: React.FC = () => {
  const { adminProfile } = useAdminAuth();
  const { content } = useHomeContent();
  const { startUpload, updateProgress, completeUpload, failUpload } = useAdminUploadProgress();

  // Multi-photo slider state
  const [sliderPhotos, setSliderPhotos] = useState<SliderPhotoItem[]>([]);
  const [sliderAutoPlay, setSliderAutoPlay] = useState<boolean>(true);
  const [sliderInterval, setSliderInterval] = useState<number>(4);

  // Single banner & video state (for backward compatibility & full features)
  const [bannerImageUrl, setBannerImageUrl] = useState<string>('');
  const [bannerVideoUrl, setBannerVideoUrl] = useState<string>('');
  const [bannerTitle, setBannerTitle] = useState<string>('');
  const [bannerSubtitle, setBannerSubtitle] = useState<string>('');

  // Add custom photo modal / input
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');
  const [customPhotoTitle, setCustomPhotoTitle] = useState<string>('');
  const [customPhotoDesc, setCustomPhotoDesc] = useState<string>('');
  const [showAddUrlModal, setShowAddUrlModal] = useState<boolean>(false);

  // Preview slider state in admin
  const [previewIndex, setPreviewIndex] = useState<number>(0);

  const [isUploadingMultiple, setIsUploadingMultiple] = useState<boolean>(false);
  const [uploadProgressText, setUploadProgressText] = useState<string>('');
  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when content updates from Firestore
  useEffect(() => {
    if (content) {
      if (content.sliderPhotos && content.sliderPhotos.length > 0) {
        setSliderPhotos(content.sliderPhotos);
      } else if (content.bannerImages && content.bannerImages.length > 0) {
        setSliderPhotos(
          content.bannerImages.map((url, i) => ({
            id: `slide-${i + 1}`,
            url,
            title: `सेवा फ़ोटो ${i + 1}`,
            description: 'जीवन ज्योति फाउंडेशन गाजीपुर'
          }))
        );
      } else {
        setSliderPhotos(DEFAULT_SLIDER_PHOTOS);
      }

      setSliderAutoPlay(content.sliderAutoPlay !== false);
      setSliderInterval(content.sliderInterval || 4);
      setBannerImageUrl(content.bannerImageUrl || (content.sliderPhotos?.[0]?.url || ''));
      setBannerVideoUrl(content.bannerVideoUrl || 'https://www.youtube.com/watch?v=0kF5s7J_C3A');
      setBannerTitle(content.bannerTitle || 'सशक्त ग़ाज़ीपुर, समृद्ध समाज');
      setBannerSubtitle(content.bannerSubtitle || 'हमारे सेवा अभियानों से जुड़ें और समाज निर्माण में अपना योगदान दें');
    }
  }, [content]);

  // Multiple File Selection & Bulk Upload Handler
  const handleMultipleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.type.startsWith('image/')) {
        validFiles.push(f);
      }
    }

    if (validFiles.length === 0) {
      toast.error('कृपया केवल वैध इमेज (JPG/PNG/WEBP) फ़ाइलें चुनें!');
      return;
    }

    setIsUploadingMultiple(true);
    startUpload(
      `बहु-फ़ोटो अपलोड (${validFiles.length} फ़ोटो)`,
      'media',
      `कुल ${validFiles.length} नई फ़ोटो होम पेज स्लाइडर में जोड़ी जा रही हैं`
    );

    const newUploadedSlides: SliderPhotoItem[] = [];

    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const stepPct = Math.round(((i) / validFiles.length) * 100);
        setUploadProgressText(`फ़ोटो ${i + 1}/${validFiles.length} अपलोड हो रही है: ${file.name}`);
        updateProgress(stepPct, `अपलोडिंग: ${file.name} (${i + 1}/${validFiles.length})`);

        const downloadUrl = await uploadMediaFile(
          file,
          'home-slider',
          (filePct) => {
            const overallPct = Math.round(((i + filePct / 100) / validFiles.length) * 100);
            updateProgress(overallPct, `${file.name}: ${filePct}%`);
          }
        );

        // Generate clean default title from file name
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

        newUploadedSlides.push({
          id: `slide-${Date.now()}-${i}`,
          url: downloadUrl,
          title: cleanName.length > 3 ? cleanName : `संस्था सेवा गतिविधि फ़ोटो ${sliderPhotos.length + i + 1}`,
          description: 'जीवन ज्योति फाउंडेशन गाजीपुर (उत्तर प्रदेश)',
          createdAt: new Date().toISOString()
        });
      }

      setSliderPhotos((prev) => [...prev, ...newUploadedSlides]);
      if (newUploadedSlides.length > 0 && !bannerImageUrl) {
        setBannerImageUrl(newUploadedSlides[0].url);
      }

      completeUpload(`सफलतापूर्वक ${validFiles.length} फ़ोटो अपलोड हो गईं!`);
      toast.success(`${validFiles.length} फ़ोटो सफलतापूर्वक जोड़ी गईं! 'सेव करें' दबाएं।`);
    } catch (err) {
      console.error('Multi photo upload error:', err);
      failUpload('फ़ोटो अपलोड में त्रुटि आई। कृपया पुनः प्रयास करें।');
      toast.error('कुछ फ़ोटो अपलोड नहीं हो सकीं।');
    } finally {
      setIsUploadingMultiple(false);
      setUploadProgressText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Add photo by URL
  const handleAddPhotoByUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPhotoUrl.trim()) {
      toast.error('कृपया मान्य फ़ोटो URL दर्ज करें!');
      return;
    }

    const newSlide: SliderPhotoItem = {
      id: `slide-${Date.now()}`,
      url: customPhotoUrl.trim(),
      title: customPhotoTitle.trim() || `संस्था सेवा फ़ोटो ${sliderPhotos.length + 1}`,
      description: customPhotoDesc.trim() || 'जीवन ज्योति फाउंडेशन गाजीपुर',
      createdAt: new Date().toISOString()
    };

    setSliderPhotos((prev) => [...prev, newSlide]);
    setCustomPhotoUrl('');
    setCustomPhotoTitle('');
    setCustomPhotoDesc('');
    setShowAddUrlModal(false);
    toast.success('फ़ोटो सफलतापूर्वक जोड़ी गई!');
  };

  // Remove single photo
  const handleRemovePhoto = (index: number) => {
    setSliderPhotos((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next;
    });
    if (previewIndex >= sliderPhotos.length - 1) {
      setPreviewIndex(Math.max(0, sliderPhotos.length - 2));
    }
    toast.success('फ़ोटो हटाई गई!');
  };

  // Move slide up (earlier in rotation)
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    setSliderPhotos((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setPreviewIndex(index - 1);
  };

  // Move slide down (later in rotation)
  const handleMoveDown = (index: number) => {
    if (index >= sliderPhotos.length - 1) return;
    setSliderPhotos((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setPreviewIndex(index + 1);
  };

  // Update slide metadata
  const handleUpdateSlideField = (index: number, field: 'title' | 'description' | 'url', val: string) => {
    setSliderPhotos((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], [field]: val };
      }
      return copy;
    });
  };

  // Reset to default authentic Ghazipur seva photos
  const handleResetToDefaults = () => {
    setSliderPhotos(DEFAULT_SLIDER_PHOTOS);
    setSliderAutoPlay(true);
    setSliderInterval(4);
    setBannerImageUrl(DEFAULT_SLIDER_PHOTOS[0].url);
    setBannerVideoUrl('https://www.youtube.com/watch?v=0kF5s7J_C3A');
    setBannerTitle('सशक्त ग़ाज़ीपुर, समृद्ध समाज');
    setBannerSubtitle('हमारे सेवा अभियानों से जुड़ें और समाज निर्माण में अपना योगदान दें');
    setPreviewIndex(0);
    toast.success('डिफ़ॉल्ट सेवा फ़ोटो लोड की गईं। सेव करने के लिए "सेव करें" बटन दबाएं।');
  };

  // Video Upload Handler
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('कृपया केवल MP4 वीडियो फ़ाइल चुनें!');
      return;
    }

    setIsUploadingVideo(true);
    startUpload('होम पेज वीडियो अपलोड', 'media', `फ़ाइल: ${file.name}`);

    try {
      const downloadUrl = await uploadMediaFile(
        file,
        'videos',
        (progress, message, bytesDetail) => {
          updateProgress(progress, message, bytesDetail);
        }
      );
      setBannerVideoUrl(downloadUrl);
      completeUpload('वीडियो सफलतापूर्वक अपलोड हो गया!');
      toast.success('वीडियो सफलतापूर्वक अपलोड हो गया!');
    } catch (err) {
      console.error(err);
      failUpload('वीडियो अपलोड में त्रुटि आई।');
      toast.error('वीडियो अपलोड में त्रुटि आई।');
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Save all media & multi-photo slider to Firestore & LocalStorage
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProfile) {
      toast.error('कृपया पहले लॉगिन करें!');
      return;
    }

    if (sliderPhotos.length === 0) {
      toast.error('कृपया कम से कम 1 फ़ोटो अवश्य जोड़ें!');
      return;
    }

    setIsSaving(true);
    startUpload('प्रशासनिक डेटा सुरक्षित हो रहा है', 'content', 'होम पेज फ़ोटो स्लाइडर एवं मीडिया');
    updateProgress(35, 'फ़ायरस्टोर में बहु-फ़ोटो स्लाइडर डेटा अपडेट किया जा रहा है...');

    try {
      const firstImageUrl = sliderPhotos[0]?.url || bannerImageUrl;

      await saveHomeContent(
        {
          ...content,
          sliderPhotos,
          bannerImages: sliderPhotos.map((p) => p.url),
          sliderAutoPlay,
          sliderInterval,
          bannerImageUrl: firstImageUrl,
          bannerVideoUrl,
          bannerTitle,
          bannerSubtitle
        },
        adminProfile.name,
        adminProfile.uid
      );

      completeUpload('होम पेज फ़ोटो स्लाइडर सफलतापूर्वक सहेजा गया!');
      toast.success('होम पेज फ़ोटो स्लाइडर सफलतापूर्वक सेव हो गया! होम पेज पर तुरंत लाइव होगा।');
    } catch (error) {
      console.error('Save error:', error);
      failUpload('डेटा सहेजने में त्रुटि आई।');
      toast.error('सेव करने में त्रुटि आई।');
    } finally {
      setIsSaving(false);
    }
  };

  const activePreviewSlide = sliderPhotos[previewIndex] || sliderPhotos[0];

  return (
    <div className="space-y-6">
      {/* 1. APP & BRAND LOGO DIRECT MANAGER */}
      <AppLogoManager />

      {/* 2. Banner & Multi-Photo Top Header Card */}
      <div className="bg-gradient-to-r from-[#8B0000] via-red-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>TAB 1: MULTI-PHOTO SLIDER & MEDIA MANAGER</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              होम पेज बहु-फ़ोटो स्लाइडर एवं मीडिया प्रबंधक
            </h2>
            <p className="text-xs text-red-100 mt-1 max-w-2xl leading-relaxed">
              यहाँ से आप एक साथ कई फ़ोटो (Multiple Photos) चुनकर अपलोड कर सकते हैं। ये सभी फ़ोटो होम पेज पर स्वचालित रूप से स्पष्ट व सुंदर स्लाइड शो (Automatic Smooth Slideshow) के रूप में प्रदर्शित होंगी।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleResetToDefaults}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition cursor-pointer border border-white/20"
              title="डिफ़ॉल्ट गाजीपुर सेवा फ़ोटो लोड करें"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>डिफ़ॉल्ट फ़ोटो लोड करें</span>
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* ==================================================================== */}
        {/* SECTION 1: MULTIPLE PHOTO SELECTOR & LIVE SLIDER MANAGER */}
        {/* ==================================================================== */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-amber-300 space-y-6">
          
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold shadow-xs">
                <Image className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>होम पेज मुख्य फ़ोटो स्लाइडर (Multi-Photo Slideshow)</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full">
                    {sliderPhotos.length} फ़ोटो सक्रिय
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  एक साथ कई फ़ोटो चुनें। स्लाइड का क्रम (Order), नाम व गति सेट करें।
                </p>
              </div>
            </div>

            {/* Quick Actions Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Add by URL */}
              <button
                type="button"
                onClick={() => setShowAddUrlModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition cursor-pointer border border-slate-200"
              >
                <Plus className="w-3.5 h-3.5 text-blue-600" />
                <span>URL से जोड़ें</span>
              </button>

              {/* Multiple Upload Trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingMultiple}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#8B0000] hover:bg-[#6b0000] text-white text-xs font-bold rounded-xl shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                {isUploadingMultiple ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>अपलोड हो रहा है...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-amber-300" />
                    <span>+ Multiple Photos चुनें</span>
                  </>
                )}
              </button>

              {/* Hidden multi-file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleMultipleFilesChange}
                className="hidden"
                disabled={isUploadingMultiple}
              />
            </div>
          </div>

          {/* Slider Auto-Play & Speed Controls */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
            {/* AutoPlay Toggle */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <label className="text-xs font-bold text-slate-800">
                स्वचालित स्लाइड शो (Auto-Play):
              </label>
              <button
                type="button"
                onClick={() => setSliderAutoPlay(!sliderAutoPlay)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  sliderAutoPlay ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    sliderAutoPlay ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Slide Duration Interval */}
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-700 shrink-0" />
              <label className="text-xs font-bold text-slate-800 shrink-0">
                स्लाइड बदलने की गति:
              </label>
              <select
                value={sliderInterval}
                onChange={(e) => setSliderInterval(Number(e.target.value))}
                className="px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                <option value={2}>2 सेकंड (Fast)</option>
                <option value={3}>3 सेकंड (Smooth)</option>
                <option value={4}>4 सेकंड (Standard)</option>
                <option value={5}>5 सेकंड (Relaxed)</option>
                <option value={7}>7 सेकंड (Detailed)</option>
                <option value={10}>10 सेकंड (Long)</option>
              </select>
            </div>

            {/* Total Slides Count */}
            <div className="text-right text-xs text-slate-600 font-semibold sm:col-span-2 lg:col-span-1">
              <span>वर्तमान में </span>
              <strong className="text-[#8B0000]">{sliderPhotos.length} फ़ोटो</strong>
              <span> होम पेज पर घूमेंगी</span>
            </div>
          </div>

          {/* Live Mini Preview Box in Admin */}
          {sliderPhotos.length > 0 && activePreviewSlide && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span>एडमिन लाइव पूर्वावलोकन (Live Slideshow Preview):</span>
                </span>
                <span className="text-slate-500 font-mono">
                  {previewIndex + 1} / {sliderPhotos.length}
                </span>
              </div>

              <div className="relative aspect-video max-h-72 rounded-2xl overflow-hidden bg-slate-950 border-2 border-slate-300 shadow-inner group">
                <img
                  src={activePreviewSlide.url}
                  alt={activePreviewSlide.title || 'Slide'}
                  className="w-full h-full object-cover transition-transform duration-500"
                />

                {/* Overlay Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
                  <h4 className="text-sm font-black text-amber-300 drop-shadow">
                    {activePreviewSlide.title || 'शीर्षक रहित'}
                  </h4>
                  {activePreviewSlide.description && (
                    <p className="text-[11px] text-gray-200 line-clamp-1">
                      {activePreviewSlide.description}
                    </p>
                  )}
                </div>

                {/* Arrows */}
                {sliderPhotos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewIndex(
                          (prev) => (prev - 1 + sliderPhotos.length) % sliderPhotos.length
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black text-white transition cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewIndex((prev) => (prev + 1) % sliderPhotos.length)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 hover:bg-black text-white transition cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Upload Progress Status Banner */}
          {isUploadingMultiple && uploadProgressText && (
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 animate-pulse">
              <RotateCw className="w-5 h-5 text-blue-700 animate-spin shrink-0" />
              <div className="text-xs">
                <p className="font-black text-blue-950">{uploadProgressText}</p>
                <p className="text-blue-700 text-[11px]">कृपया प्रतीक्षा करें...</p>
              </div>
            </div>
          )}

          {/* Photo Management Cards Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                स्लाइडर फ़ोटो सूची एवं संपादन (Manage All Slides):
              </h4>
              {sliderPhotos.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('क्या आप सभी फ़ोटो हटाना चाहते हैं?')) {
                      setSliderPhotos([]);
                      toast.success('सभी फ़ोटो हटाई गईं!');
                    }
                  }}
                  className="text-xs text-red-600 hover:text-red-800 font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>सभी हटाएं</span>
                </button>
              )}
            </div>

            {sliderPhotos.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
                <Image className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <h5 className="text-sm font-bold text-slate-700">कोई फ़ोटो उपलब्ध नहीं है</h5>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  ऊपर <strong>&apos;Multiple Photos चुनें&apos;</strong> बटन दबाकर अपने कंप्यूटर या फ़ोन से 1 या अधिक फ़ोटो अपलोड करें।
                </p>
                <button
                  type="button"
                  onClick={handleResetToDefaults}
                  className="mt-3 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  डिफ़ॉल्ट सेवा फ़ोटो लोड करें
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sliderPhotos.map((slide, index) => (
                  <div
                    key={slide.id || `slide-item-${index}`}
                    className="p-4 bg-slate-50 border border-slate-200 hover:border-amber-400 rounded-2xl flex flex-col sm:flex-row gap-4 transition shadow-xs group"
                  >
                    {/* Thumbnail & Index */}
                    <div className="relative w-full sm:w-36 h-28 sm:h-auto rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                      <img
                        src={slide.url}
                        alt={slide.title || `Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 left-1.5 bg-black/75 text-amber-300 text-[10px] font-mono font-black px-2 py-0.5 rounded-md">
                        #{index + 1}
                      </span>
                    </div>

                    {/* Controls & Edit Fields */}
                    <div className="flex-1 space-y-2 min-w-0">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          फ़ोटो शीर्षक (Slide Title)
                        </label>
                        <input
                          type="text"
                          value={slide.title || ''}
                          onChange={(e) =>
                            handleUpdateSlideField(index, 'title', e.target.value)
                          }
                          placeholder="उदा. निःशुल्क पाठशाला"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-0.5">
                          विवरण (Caption / Subtitle)
                        </label>
                        <input
                          type="text"
                          value={slide.description || ''}
                          onChange={(e) =>
                            handleUpdateSlideField(index, 'description', e.target.value)
                          }
                          placeholder="उदा. गाजीपुर ग्रामीण बच्चों को शिक्षा"
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      {/* Bottom action row: Move up, down, preview, delete */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className="p-1 rounded-md bg-white hover:bg-slate-200 text-slate-700 disabled:opacity-30 transition cursor-pointer"
                            title="पहले दिखाएं (Move Up)"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(index)}
                            disabled={index === sliderPhotos.length - 1}
                            className="p-1 rounded-md bg-white hover:bg-slate-200 text-slate-700 disabled:opacity-30 transition cursor-pointer"
                            title="बाद में दिखाएं (Move Down)"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPreviewIndex(index)}
                            className="p-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 transition ml-1 cursor-pointer"
                            title="पूर्वावलोकन देखें"
                          >
                            देखें
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(index)}
                          className="p-1 text-red-600 hover:text-red-800 transition cursor-pointer"
                          title="इस फ़ोटो को हटाएं"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 2: VIDEO SHOWCASE & HEADINGS */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Video Manager */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    होम पेज वीडियो (Home Video Showcase)
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    MP4 फ़ाइल या YouTube / CDN लिंक
                  </span>
                </div>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded-md">
                MP4 & YouTube
              </span>
            </div>

            {/* Video Live Preview Box */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 flex items-center justify-center shadow-inner">
              {bannerVideoUrl && bannerVideoUrl.includes('youtube.com') ? (
                <iframe
                  src={bannerVideoUrl.replace('watch?v=', 'embed/')}
                  title="YouTube Preview"
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              ) : bannerVideoUrl ? (
                <video
                  src={bannerVideoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 text-slate-400">
                  <Video className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">कोई वीडियो सेट नहीं है</p>
                </div>
              )}
            </div>

            {/* Video Upload & URL Input */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  डिवाइस से MP4 वीडियो अपलोड करें
                </label>
                <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer transition text-xs font-bold text-slate-700">
                  {isUploadingVideo ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin text-blue-700" />
                      <span>वीडियो अपलोड हो रहा है...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-blue-700" />
                      <span>कंप्यूटर / फ़ोन से MP4 चुनें</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="video/mp4,video/*"
                    onChange={handleVideoFileChange}
                    className="hidden"
                    disabled={isUploadingVideo}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  या YouTube / MP4 वीडियो URL लिंक
                </label>
                <input
                  type="url"
                  value={bannerVideoUrl}
                  onChange={(e) => setBannerVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=0kF5s7J_C3A"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>
            </div>
          </div>

          {/* Banner Headings */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  बैनर मुख्य शीर्षक एवं उप-शीर्षक
                </h3>
                <span className="text-[10px] text-slate-500">
                  होम पेज के शीर्ष पर प्रदर्शित होने वाले नारे
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  बैनर मुख्य शीर्षक (Banner Title)
                </label>
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="सशक्त ग़ाज़ीपुर, समृद्ध समाज"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  बैनर उप-शीर्षक (Banner Subtitle)
                </label>
                <textarea
                  rows={3}
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  placeholder="हमारे सेवा अभियानों से जुड़ें और समाज निर्माण में अपना योगदान दें"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* BOTTOM SAVE BUTTON STRIP */}
        {/* ==================================================================== */}
        <div className="bg-slate-900 text-white rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border-2 border-amber-400">
          <div className="text-xs text-slate-300">
            <span className="font-bold text-amber-400">सत्यापित स्थिति: </span>
            {sliderPhotos.length} स्लाइडर फ़ोटो सुरक्षित होने हेतु तैयार हैं।
          </div>

          <button
            type="submit"
            disabled={isSaving || isUploadingMultiple || isUploadingVideo}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-amber-600 text-blue-950 font-black text-sm rounded-2xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 transform hover:scale-105"
          >
            {isSaving ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>क्लाउड डेटाबेस में सहेजा जा रहा है...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-blue-950" />
                <span>फ़ोटो स्लाइडर व सेटिंग्स सेव करें (Save All Changes)</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal: Add Photo by URL */}
      {showAddUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-amber-300 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-600" />
                <span>URL से नई फ़ोटो जोड़ें</span>
              </h3>
              <button
                onClick={() => setShowAddUrlModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPhotoByUrl} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  फ़ोटो का पूरा वेब लिंक (Image URL) *
                </label>
                <input
                  type="url"
                  required
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  फ़ोटो का शीर्षक (Title)
                </label>
                <input
                  type="text"
                  value={customPhotoTitle}
                  onChange={(e) => setCustomPhotoTitle(e.target.value)}
                  placeholder="उदा. निःशुल्क स्वास्थ्य शिविर"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  छोटा विवरण (Description / Caption)
                </label>
                <input
                  type="text"
                  value={customPhotoDesc}
                  onChange={(e) => setCustomPhotoDesc(e.target.value)}
                  placeholder="उदा. गाजीपुर ग्रामीण क्षेत्र में निशुल्क दवा वितरण"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUrlModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#8B0000] hover:bg-[#6b0000] text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
                >
                  फ़ोटो जोड़ें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabBannerMediaManager;
