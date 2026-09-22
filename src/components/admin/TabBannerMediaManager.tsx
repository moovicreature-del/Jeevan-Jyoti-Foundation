// ============================================================================
// JEEVAN JYOTI FOUNDATION - TAB 1: 4-SECTION PHOTO SLIDER & MEDIA MANAGER
// चार मुख्य सेवा सेक्शनों हेतु अलग-अलग १५ फ़ोटो अपलोड एवं स्लाइडर प्रबंधक
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
  Check,
  Camera,
  MapPin,
  Calendar,
  X,
  FolderOpen
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useHomeContent } from '../../context/HomeContentContext';
import { useAdminUploadProgress } from '../../context/AdminUploadProgressContext';
import {
  saveHomeContent,
  uploadMediaFile,
  DEFAULT_SLIDER_PHOTOS,
  DEFAULT_CAMPAIGN_GALLERY_PHOTOS,
  DEFAULT_RECENT_EVENTS_PHOTOS,
  DEFAULT_RURAL_WORK_PHOTOS
} from '../../services/adminService';
import { AppLogoManager } from './AppLogoManager';
import { SliderPhotoItem } from '../../types';
import { extractYouTubeId } from '../VideoShowcase';
import toast from 'react-hot-toast';

type ActiveSectionTab =
  | 'section_hero_slides'
  | 'section_campaign_gallery'
  | 'section_recent_events'
  | 'section_rural_work'
  | 'section_branding_video';

interface SectionConfig {
  id: ActiveSectionTab;
  numberLabel: string;
  titleHindi: string;
  titleEnglish: string;
  badge: string;
  description: string;
  supportsMetadata: boolean;
}

const SECTION_CONFIGS: SectionConfig[] = [
  {
    id: 'section_hero_slides',
    numberLabel: '१',
    titleHindi: 'लाइव फ़ोटो स्लाइड्स (होम पेज)',
    titleEnglish: 'Home Hero Live Photo Slides',
    badge: '📸 मुख्य होम स्लाइडर',
    description: 'वेबसाइट के शीर्ष (Hero Section) पर प्रदर्शित होने वाली स्वचालित मुख्य फ़ोटो स्लाइड (अधिकतम 15 फ़ोटो)।',
    supportsMetadata: false
  },
  {
    id: 'section_campaign_gallery',
    numberLabel: '२',
    titleHindi: 'ग़ाज़ीपुर सेवा अभियानों की लाइव फ़ोटो गैलरी',
    titleEnglish: 'Ghazipur Seva Campaigns Live Gallery',
    badge: '🏛️ जमीनी सेवा अभियान',
    description: 'निःशुल्क शिक्षा, अन्नपूर्णा भोजन, स्वास्थ्य शिविर व जन-जागरूकता अभियानों की लाइव फ़ोटो गैलरी (अधिकतम 15 फ़ोटो)।',
    supportsMetadata: true
  },
  {
    id: 'section_recent_events',
    numberLabel: '३',
    titleHindi: 'हाल ही में आयोजित सेवा कार्यक्रम',
    titleEnglish: 'Recently Conducted Seva Programs',
    badge: '📅 हालिया सेवा कार्यक्रम',
    description: 'गाजीपुर के विभिन्न क्षेत्रों में आयोजित नवीनतम सेवा कार्यक्रमों की रिपोर्ट व फ़ोटो स्लाइड (अधिकतम 15 फ़ोटो)।',
    supportsMetadata: true
  },
  {
    id: 'section_rural_work',
    numberLabel: '४',
    titleHindi: 'ग़ाज़ीपुर के ग्रामीण अंचलों में जीवन ज्योति का कार्य',
    titleEnglish: 'Jeevan Jyoti Impact in Rural Ghazipur',
    badge: '🌾 ग्रामीण धरातलीय कार्य',
    description: 'सुदूर गांवों, पुरवों व मजरों में संचालित राहत, बाल शिक्षा व स्वास्थ्य रक्षा की फ़ोटो स्लाइड (अधिकतम 15 फ़ोटो)।',
    supportsMetadata: true
  }
];

export const TabBannerMediaManager: React.FC = () => {
  const { adminProfile } = useAdminAuth();
  const { content } = useHomeContent();
  const { startUpload, updateProgress, completeUpload, failUpload } = useAdminUploadProgress();

  // Active Sub-Tab
  const [activeTab, setActiveTab] = useState<ActiveSectionTab>('section_hero_slides');

  // 4 Photo Arrays (Up to 15 photos each)
  const [sliderPhotos, setSliderPhotos] = useState<SliderPhotoItem[]>([]);
  const [campaignGalleryPhotos, setCampaignGalleryPhotos] = useState<SliderPhotoItem[]>([]);
  const [recentEventsPhotos, setRecentEventsPhotos] = useState<SliderPhotoItem[]>([]);
  const [ruralWorkPhotos, setRuralWorkPhotos] = useState<SliderPhotoItem[]>([]);

  // Slider Global Settings
  const [sliderAutoPlay, setSliderAutoPlay] = useState<boolean>(true);
  const [sliderInterval, setSliderInterval] = useState<number>(4);

  // Single Banner & Video
  const [bannerImageUrl, setBannerImageUrl] = useState<string>('');
  const [bannerVideoUrl, setBannerVideoUrl] = useState<string>('');
  const [bannerTitle, setBannerTitle] = useState<string>('');
  const [bannerSubtitle, setBannerSubtitle] = useState<string>('');

  // Add Custom Photo by URL Modal
  const [showAddUrlModal, setShowAddUrlModal] = useState<boolean>(false);
  const [targetSectionForUrl, setTargetSectionForUrl] = useState<ActiveSectionTab>('section_hero_slides');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');
  const [customPhotoTitle, setCustomPhotoTitle] = useState<string>('');
  const [customPhotoDesc, setCustomPhotoDesc] = useState<string>('');
  const [customPhotoCategory, setCustomPhotoCategory] = useState<string>('');
  const [customPhotoLocation, setCustomPhotoLocation] = useState<string>('');
  const [customPhotoDate, setCustomPhotoDate] = useState<string>('');

  // Zoom preview modal
  const [previewZoomPhoto, setPreviewZoomPhoto] = useState<SliderPhotoItem | null>(null);

  // Upload & Save states
  const [isUploadingFiles, setIsUploadingFiles] = useState<boolean>(false);
  const [uploadProgressText, setUploadProgressText] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize state with Home Content
  useEffect(() => {
    if (content) {
      // 1. Hero slides
      if (content.sliderPhotos && content.sliderPhotos.length > 0) {
        setSliderPhotos(content.sliderPhotos.slice(0, 15));
      } else {
        setSliderPhotos(DEFAULT_SLIDER_PHOTOS.slice(0, 15));
      }

      // 2. Campaign gallery
      if (content.campaignGalleryPhotos && content.campaignGalleryPhotos.length > 0) {
        setCampaignGalleryPhotos(content.campaignGalleryPhotos.slice(0, 15));
      } else {
        setCampaignGalleryPhotos(DEFAULT_CAMPAIGN_GALLERY_PHOTOS.slice(0, 15));
      }

      // 3. Recent events
      if (content.recentEventsPhotos && content.recentEventsPhotos.length > 0) {
        setRecentEventsPhotos(content.recentEventsPhotos.slice(0, 15));
      } else {
        setRecentEventsPhotos(DEFAULT_RECENT_EVENTS_PHOTOS.slice(0, 15));
      }

      // 4. Rural work
      if (content.ruralWorkPhotos && content.ruralWorkPhotos.length > 0) {
        setRuralWorkPhotos(content.ruralWorkPhotos.slice(0, 15));
      } else {
        setRuralWorkPhotos(DEFAULT_RURAL_WORK_PHOTOS.slice(0, 15));
      }

      // Video & settings
      setSliderAutoPlay(content.sliderAutoPlay !== false);
      setSliderInterval(content.sliderInterval || 4);
      setBannerImageUrl(content.bannerImageUrl || (content.sliderPhotos?.[0]?.url || ''));
      setBannerVideoUrl(content.ruralWorkVideoUrl || content.bannerVideoUrl || 'https://www.youtube.com/watch?v=0kF5s7J_C3A');
      setBannerTitle(content.bannerTitle || 'सशक्त ग़ाज़ीपुर, समृद्ध समाज');
      setBannerSubtitle(content.bannerSubtitle || 'हमारे सेवा अभियानों से जुड़ें और समाज निर्माण में अपना योगदान दें');
    }
  }, [content]);

  // Helper to get active list and its setter
  const getSectionState = (
    tab: ActiveSectionTab
  ): {
    items: SliderPhotoItem[];
    setItems: React.Dispatch<React.SetStateAction<SliderPhotoItem[]>>;
    defaults: SliderPhotoItem[];
    label: string;
  } => {
    switch (tab) {
      case 'section_hero_slides':
        return {
          items: sliderPhotos,
          setItems: setSliderPhotos,
          defaults: DEFAULT_SLIDER_PHOTOS,
          label: 'लाइव फ़ोटो स्लाइड्स (होम पेज)'
        };
      case 'section_campaign_gallery':
        return {
          items: campaignGalleryPhotos,
          setItems: setCampaignGalleryPhotos,
          defaults: DEFAULT_CAMPAIGN_GALLERY_PHOTOS,
          label: 'ग़ाज़ीपुर सेवा अभियानों की लाइव फ़ोटो गैलरी'
        };
      case 'section_recent_events':
        return {
          items: recentEventsPhotos,
          setItems: setRecentEventsPhotos,
          defaults: DEFAULT_RECENT_EVENTS_PHOTOS,
          label: 'हाल ही में आयोजित सेवा कार्यक्रम'
        };
      case 'section_rural_work':
        return {
          items: ruralWorkPhotos,
          setItems: setRuralWorkPhotos,
          defaults: DEFAULT_RURAL_WORK_PHOTOS,
          label: 'ग़ाज़ीपुर के ग्रामीण अंचलों में जीवन ज्योति का कार्य'
        };
      default:
        return {
          items: sliderPhotos,
          setItems: setSliderPhotos,
          defaults: DEFAULT_SLIDER_PHOTOS,
          label: 'लाइव फ़ोटो स्लाइड्स'
        };
    }
  };

  // Multiple File Selection & Upload (Up to 15 photos max)
  const handleMultipleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const { items, setItems, label } = getSectionState(activeTab);
    const availableSlots = 15 - items.length;

    if (availableSlots <= 0) {
      toast.error(`इस सेक्शन में पहले से 15 फ़ोटो भरी हुई हैं! कृपया पहले कोई पुरानी फ़ोटो हटाएं।`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.type.startsWith('image/')) {
        validFiles.push(f);
      }
    }

    if (validFiles.length === 0) {
      toast.error('कृपया केवल वैध इमेज (JPG/PNG/WEBP) फ़ाइलें चुनें!');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Limit files to available slots
    const filesToUpload = validFiles.slice(0, availableSlots);
    if (validFiles.length > availableSlots) {
      toast(`अधिकतम 15 सीमा के कारण केवल प्रथम ${availableSlots} फ़ोटो अपलोड की जा रही हैं।`, {
        icon: 'ℹ️'
      });
    }

    setIsUploadingFiles(true);
    startUpload(
      `फ़ोटो अपलोड (${filesToUpload.length} फ़ोटो)`,
      'media',
      `${label} में ${filesToUpload.length} फ़ोटो जोड़ी जा रही हैं`
    );

    const newUploaded: SliderPhotoItem[] = [];

    try {
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        const stepPct = Math.round((i / filesToUpload.length) * 100);
        setUploadProgressText(`फ़ोटो ${i + 1}/${filesToUpload.length} अपलोड हो रही है: ${file.name}`);
        updateProgress(stepPct, `अपलोडिंग: ${file.name} (${i + 1}/${filesToUpload.length})`);

        const downloadUrl = await uploadMediaFile(
          file,
          'slider',
          (pct) => {
            const overallPct = Math.round(stepPct + pct / filesToUpload.length);
            updateProgress(overallPct);
          }
        );

        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .trim();

        newUploaded.push({
          id: `photo-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
          url: downloadUrl,
          title: cleanName.length > 2 ? cleanName : `${label} झलक ${items.length + i + 1}`,
          description: 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुर सेवा अभियान',
          category: activeTab === 'section_recent_events' ? 'सेवा कार्यक्रम' : 'जनसेवा अभियान',
          location: 'ग़ाज़ीपुर, उत्तर प्रदेश',
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString()
        });
      }

      setItems((prev) => [...prev, ...newUploaded].slice(0, 15));
      completeUpload();
      toast.success(`🎉 ${newUploaded.length} नई फ़ोटो सफलतापूर्वक जुड़ गईं! (कुल: ${items.length + newUploaded.length}/15)`);
    } catch (err: any) {
      console.error('File upload error:', err);
      failUpload(err?.message || 'फ़ोटो अपलोड असफल');
      toast.error(`अपलोड त्रुटि: ${err?.message || 'फ़ोटो अपलोड नहीं हो सकी'}`);
    } finally {
      setIsUploadingFiles(false);
      setUploadProgressText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Add Photo by Custom URL Handler
  const handleAddPhotoByUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPhotoUrl.trim()) {
      toast.error('कृपया फ़ोटो का वैध URL दर्ज करें!');
      return;
    }

    const { items, setItems, label } = getSectionState(targetSectionForUrl);
    if (items.length >= 15) {
      toast.error(`इस सेक्शन में पहले से अधिकतम 15 फ़ोटो पूरी हैं!`);
      return;
    }

    const newPhoto: SliderPhotoItem = {
      id: `url-photo-${Date.now()}`,
      url: customPhotoUrl.trim(),
      title: customPhotoTitle.trim() || `${label} झलक ${items.length + 1}`,
      description: customPhotoDesc.trim() || 'जीवन ज्योति फाउंडेशन सेवा अभियान',
      category: customPhotoCategory.trim() || 'जनसेवा अभियान',
      location: customPhotoLocation.trim() || 'ग़ाज़ीपुर',
      date: customPhotoDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    setItems((prev) => [...prev, newPhoto].slice(0, 15));
    toast.success(`फ़ोटो सफलतापूर्वक जोड़ दी गई! (${items.length + 1}/15)`);

    // Reset inputs
    setCustomPhotoUrl('');
    setCustomPhotoTitle('');
    setCustomPhotoDesc('');
    setCustomPhotoCategory('');
    setCustomPhotoLocation('');
    setCustomPhotoDate('');
    setShowAddUrlModal(false);
  };

  // Reorder Item (Up)
  const handleMoveUp = (tab: ActiveSectionTab, index: number) => {
    if (index === 0) return;
    const { setItems } = getSectionState(tab);
    setItems((prev) => {
      const arr = [...prev];
      const temp = arr[index - 1];
      arr[index - 1] = arr[index];
      arr[index] = temp;
      return arr;
    });
  };

  // Reorder Item (Down)
  const handleMoveDown = (tab: ActiveSectionTab, index: number) => {
    const { items, setItems } = getSectionState(tab);
    if (index === items.length - 1) return;
    setItems((prev) => {
      const arr = [...prev];
      const temp = arr[index + 1];
      arr[index + 1] = arr[index];
      arr[index] = temp;
      return arr;
    });
  };

  // Delete Item
  const handleDeletePhoto = (tab: ActiveSectionTab, id: string) => {
    const { items, setItems } = getSectionState(tab);
    if (items.length <= 1) {
      toast.error('कम से कम १ फ़ोटो स्लाइडर में रहना अनिवार्य है!');
      return;
    }
    setItems((prev) => prev.filter((p) => p.id !== id));
    toast.success('फ़ोटो हटा दी गई');
  };

  // Update Item Fields inline
  const handleUpdatePhotoField = (
    tab: ActiveSectionTab,
    id: string,
    field: keyof SliderPhotoItem,
    value: string
  ) => {
    const { setItems } = getSectionState(tab);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Reset to Defaults
  const handleResetSectionDefaults = (tab: ActiveSectionTab) => {
    const { setItems, defaults, label } = getSectionState(tab);
    if (window.confirm(`क्या आप ${label} को सत्यापित डिफ़ॉल्ट फ़ोटो सेट पर रीसेट करना चाहते हैं?`)) {
      setItems(defaults.slice(0, 15));
      toast.success(`${label} की डिफ़ॉल्ट फ़ोटो पुनः लोड हो गई हैं!`);
    }
  };

  // Quick Save YouTube Video Only (For Section 4 Rural Work)
  const [isSavingVideo, setIsSavingVideo] = useState<boolean>(false);
  const handleSaveRuralVideoOnly = async () => {
    if (!bannerVideoUrl.trim()) {
      toast.error('कृपया यूट्यूब वीडियो का वैध लिंक दर्ज करें!');
      return;
    }
    setIsSavingVideo(true);
    try {
      await saveHomeContent(
        {
          ruralWorkVideoUrl: bannerVideoUrl.trim(),
          bannerVideoUrl: bannerVideoUrl.trim(),
          bannerTitle: bannerTitle.trim(),
          bannerSubtitle: bannerSubtitle.trim()
        },
        adminProfile?.name || 'एडमिन व्यवस्थापक',
        adminProfile?.uid || 'admin'
      );
      toast.success('🎥 ग्रामीण अंचल हेतु यूट्यूब HD वीडियो लिंक सफलतापूर्वक सुरक्षित हो गया!');
    } catch (err: any) {
      console.error('Error saving rural video:', err);
      toast.error(`वीडियो लिंक सुरक्षित करने में त्रुटि: ${err?.message || 'पुनः प्रयास करें'}`);
    } finally {
      setIsSavingVideo(false);
    }
  };

  // Save All 4 Sections to Firestore & LocalStorage
  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await saveHomeContent(
        {
          sliderPhotos: sliderPhotos.slice(0, 15),
          campaignGalleryPhotos: campaignGalleryPhotos.slice(0, 15),
          recentEventsPhotos: recentEventsPhotos.slice(0, 15),
          ruralWorkPhotos: ruralWorkPhotos.slice(0, 15),
          sliderAutoPlay,
          sliderInterval,
          bannerImageUrl: sliderPhotos[0]?.url || bannerImageUrl,
          bannerImages: sliderPhotos.map((p) => p.url),
          bannerVideoUrl: bannerVideoUrl.trim(),
          ruralWorkVideoUrl: bannerVideoUrl.trim(),
          bannerTitle: bannerTitle.trim(),
          bannerSubtitle: bannerSubtitle.trim()
        },
        adminProfile?.name || 'एडमिन व्यवस्थापक',
        adminProfile?.uid || 'admin'
      );

      toast.success('✅ चारों सेक्शन की सभी फ़ोटो व सेटिंग्स सफलतापूर्वक सुरक्षित कर दी गईं!');
    } catch (err: any) {
      console.error('Save error:', err);
      toast.error(`सहेजने में त्रुटि: ${err?.message || 'पुनः प्रयास करें'}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper for current active section config
  const activeConfig = SECTION_CONFIGS.find((c) => c.id === activeTab);
  const activeSectionState = getSectionState(activeTab);

  return (
    <div className="space-y-6">
      {/* Top Banner & Multi-Section Explanation Header */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 rounded-3xl border-2 border-amber-400/80 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider mb-2 shadow-xs">
              <Camera className="w-3.5 h-3.5" />
              <span>४ मुख्य सेवा फ़ोटो गैलरी प्रबंधक (15 Photos Per Section)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-white flex items-center gap-2">
              <span>लाइव फ़ोटो व स्लाइडर महा-प्रबंधक</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              चारों अलग-अलग सेक्शनों (लाइव फ़ोटो स्लाइड्स, सेवा अभियान गैलरी, हालिया सेवा कार्यक्रम, और ग्रामीण सेवा कार्य) में अधिकतम १५-१५ फ़ोटो अपलोड करें। सभी फ़ोटो वेबसाइट पर स्वचालित रूप से स्लाइड में प्रदर्शित होंगी।
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/40 p-3 rounded-2xl border border-amber-400/30 text-center">
            <div className="p-2 rounded-xl bg-white/5">
              <p className="text-[10px] text-amber-300 font-bold">१. लाइव स्लाइड्स</p>
              <p className="text-lg font-black text-white font-mono">{sliderPhotos.length}/15</p>
            </div>
            <div className="p-2 rounded-xl bg-white/5">
              <p className="text-[10px] text-amber-300 font-bold">२. अभियान गैलरी</p>
              <p className="text-lg font-black text-white font-mono">{campaignGalleryPhotos.length}/15</p>
            </div>
            <div className="p-2 rounded-xl bg-white/5">
              <p className="text-[10px] text-amber-300 font-bold">३. सेवा कार्यक्रम</p>
              <p className="text-lg font-black text-white font-mono">{recentEventsPhotos.length}/15</p>
            </div>
            <div className="p-2 rounded-xl bg-white/5">
              <p className="text-[10px] text-amber-300 font-bold">४. ग्रामीण अंचल</p>
              <p className="text-lg font-black text-white font-mono">{ruralWorkPhotos.length}/15</p>
            </div>
          </div>
        </div>
      </div>

      {/* 5-SubTab Switcher */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
        {SECTION_CONFIGS.map((cfg) => {
          const isSelected = activeTab === cfg.id;
          const count = getSectionState(cfg.id).items.length;
          return (
            <button
              key={cfg.id}
              onClick={() => setActiveTab(cfg.id)}
              className={`shrink-0 px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#8B0000] text-white shadow-md scale-102 ring-2 ring-amber-300'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
              }`}>
                {cfg.numberLabel}
              </span>
              <span>{cfg.titleHindi}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                isSelected ? 'bg-black/30 text-amber-200' : 'bg-slate-200 text-slate-700'
              }`}>
                {count}/15
              </span>
            </button>
          );
        })}

        {/* Branding, Video & Thumbnail Tab */}
        <button
          onClick={() => setActiveTab('section_branding_video')}
          className={`shrink-0 px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer ml-auto ${
            activeTab === 'section_branding_video'
              ? 'bg-[#8B0000] text-white shadow-md scale-102 ring-2 ring-amber-300'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>लोगो, थंबनेल व वीडियो</span>
        </button>
      </div>

      {/* Hidden Multiple File Input for Active Section */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleMultipleFilesUpload}
        multiple
        accept="image/*"
        className="hidden"
      />

      {/* ===================================================================== */}
      {/* SECTION CONTENT: 1 OF THE 4 PHOTO GALLERIES                           */}
      {/* ===================================================================== */}
      {activeConfig && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
          {/* Section Sub-Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs">
                  {activeConfig.badge}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs font-bold border border-slate-200">
                  कुल फ़ोटो: {activeSectionState.items.length} / 15
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
                सेक्शन {activeConfig.numberLabel}: {activeConfig.titleHindi}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                {activeConfig.description}
              </p>
            </div>

            {/* Quick Actions for this Section */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingFiles || activeSectionState.items.length >= 15}
                className="px-4 py-2.5 bg-gradient-to-r from-[#8B0000] to-[#5a0000] hover:from-[#6b0000] hover:to-[#400000] text-white rounded-xl font-black text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                title="कंप्यूटर या फोन से नई फ़ोटो चुनें (अधिकतम 15 तक)"
              >
                <Upload className="w-4 h-4 text-amber-300" />
                <span>📁 नई फ़ोटो अपलोड करें</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTargetSectionForUrl(activeTab);
                  setShowAddUrlModal(true);
                }}
                disabled={activeSectionState.items.length >= 15}
                className="px-3.5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="वेब लिंक (URL) द्वारा फ़ोटो जोड़ें"
              >
                <Plus className="w-4 h-4 text-amber-700" />
                <span>+ URL जोड़ें</span>
              </button>

              <button
                type="button"
                onClick={() => handleResetSectionDefaults(activeTab)}
                className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
                title="डिफ़ॉल्ट 15 सेवा फ़ोटो पुनः लोड करें"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">डिफ़ॉल्ट लोड करें</span>
              </button>
            </div>
          </div>

          {/* =============================================================== */}
          {/* SPECIAL YOUTUBE HD VIDEO MANAGER FOR SECTION 4: RURAL WORK      */}
          {/* =============================================================== */}
          {activeTab === 'section_rural_work' && (
            <div className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 text-white rounded-3xl p-6 sm:p-7 border-2 border-red-500/80 shadow-2xl space-y-5 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-red-500/30">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-black uppercase tracking-wider mb-2 shadow-xs">
                      <Film className="w-3.5 h-3.5" />
                      <span>HD 1080p यूट्यूब वीडियो - ऑटो-प्ले समर्थित</span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-black font-serif text-white flex items-center gap-2">
                      <span>यूट्यूब वीडियो लिंक (ग्रामीण अंचल सेक्शन में ऑटो-प्ले होगा)</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      यहाँ जो यूट्यूब लिंक आप दर्ज करेंगे, वह होम पेज के "ग़ाज़ीपुर के ग्रामीण अंचलों में जीवन ज्योति का कार्य" सेक्शन में सीधे HD क्वालिटी में स्वतः (Auto-play) चलेगा।
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveRuralVideoOnly}
                    disabled={isSavingVideo}
                    className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-xl text-xs font-black shadow-lg transition flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0 disabled:opacity-50"
                    title="केवल इस वीडियो लिंक को तुरंत सुरक्षित करें"
                  >
                    {isSavingVideo ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>सहेजा जा रहा है...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>💾 केवल वीडियो लिंक सहेजें</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
                  {/* Inputs (7 cols) */}
                  <div className="lg:col-span-7 space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-amber-300 mb-1">
                        यूट्यूब वीडियो लिंक (YouTube Video URL) *
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          required
                          value={bannerVideoUrl}
                          onChange={(e) => setBannerVideoUrl(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=0kF5s7J_C3A या https://youtu.be/..."
                          className="w-full px-3.5 py-2.5 bg-slate-900/90 border-2 border-red-400/60 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                        />
                        {bannerVideoUrl && (
                          <button
                            type="button"
                            onClick={() => setBannerVideoUrl('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer p-1"
                            title="खाली करें"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        समर्थित रूप: YouTube Watch link, youtu.be, Shorts, या Embed link
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-200 mb-1">
                          वीडियो शीर्षक (Title)
                        </label>
                        <input
                          type="text"
                          value={bannerTitle}
                          onChange={(e) => setBannerTitle(e.target.value)}
                          placeholder="उदा. 'उम्मीद की एक किरण' - जीवन ज्योति डॉक्यूमेंट्री"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-200 mb-1">
                          उपशीर्षक / विवरण (Subtitle)
                        </label>
                        <input
                          type="text"
                          value={bannerSubtitle}
                          onChange={(e) => setBannerSubtitle(e.target.value)}
                          placeholder="उदा. ग़ाज़ीपुर के सुदूर गांवों में सेवा कार्य की सच्ची कहानी"
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-slate-200 font-medium">
                          HD 1080p क्वालिटी और स्वचालित प्लेबैक (Autoplay) सक्षम है।
                        </span>
                      </div>
                      {bannerVideoUrl && (
                        <a
                          href={bannerVideoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-amber-300 hover:text-amber-200 underline flex items-center gap-1 shrink-0 ml-2"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>यूट्यूब पर जांचें</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Live Embed Preview (5 cols) */}
                  <div className="lg:col-span-5">
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      लाइव HD पूर्वावलोकन (Live HD Preview):
                    </label>
                    {(() => {
                      const vId = extractYouTubeId(bannerVideoUrl);
                      if (vId) {
                        return (
                          <div className="relative rounded-2xl overflow-hidden border-2 border-red-400/60 bg-black aspect-video shadow-xl">
                            <iframe
                              src={`https://www.youtube-nocookie.com/embed/${vId}?rel=0&modestbranding=1&hd=1`}
                              title="YouTube Preview"
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                            <div className="absolute top-2 left-2 pointer-events-none">
                              <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[10px]">
                                HD पूर्वावलोकन
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div className="rounded-2xl border-2 border-dashed border-slate-700 aspect-video flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                          <Film className="w-8 h-8 text-slate-600 mb-2" />
                          <p className="text-xs font-semibold">वैध यूट्यूब लिंक दर्ज करने पर यहाँ लाइव HD प्लेयर दिखेगा</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Progress Bar if Uploading */}
          {isUploadingFiles && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 animate-pulse">
              <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-2">
                <span className="flex items-center gap-2">
                  <RotateCw className="w-4 h-4 animate-spin text-amber-700" />
                  <span>{uploadProgressText || 'फ़ोटो अपलोड हो रही हैं...'}</span>
                </span>
                <span>अधिकतम १५ फ़ोटो सुरक्षित हो रही हैं</span>
              </div>
              <div className="w-full h-2 bg-amber-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-600 transition-all duration-300" style={{ width: '80%' }} />
              </div>
            </div>
          )}

          {/* Photo Cards Grid for Active Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#8B0000]" />
                <span>अपलोड की गई फ़ोटो की सूची (कुल {activeSectionState.items.length}/15 फ़ोटो):</span>
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                क्रमानुसार प्रदर्शित होंगी (ऊपर-नीचे बटनों से क्रम बदलें)
              </span>
            </div>

            {activeSectionState.items.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 space-y-3">
                <Camera className="w-12 h-12 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-700">इस सेक्शन में अभी कोई फ़ोटो नहीं है</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  ऊपर दिए गए "नई फ़ोटो अपलोड करें" बटन से 15 तक फ़ोटो जोड़ें या डिफ़ॉल्ट फ़ोटो लोड करें।
                </p>
                <button
                  type="button"
                  onClick={() => handleResetSectionDefaults(activeTab)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl"
                >
                  डिफ़ॉल्ट फ़ोटो लोड करें
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {activeSectionState.items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 bg-slate-50/70 hover:bg-amber-50/20 transition-all grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                  >
                    {/* Thumbnail + Zoom + Order Badge (3 Cols) */}
                    <div className="md:col-span-3 flex items-center gap-3">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(activeTab, index)}
                          disabled={index === 0}
                          className="p-1 rounded bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                          title="स्लाइड ऊपर करें"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] font-mono font-black text-[#8B0000]">
                          #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(activeTab, index)}
                          disabled={index === activeSectionState.items.length - 1}
                          className="p-1 rounded bg-white hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                          title="स्लाइड नीचे करें"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Image Preview */}
                      <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 group shrink-0">
                        <img
                          src={item.url}
                          alt={item.title || 'Slide'}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&auto=format&fit=crop&q=80';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setPreviewZoomPhoto(item)}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                          title="बड़ा करके देखें"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata & Captions (8 Cols) */}
                    <div className="md:col-span-8 space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                            फ़ोटो शीर्षक (Title) *
                          </label>
                          <input
                            type="text"
                            value={item.title || ''}
                            onChange={(e) =>
                              handleUpdatePhotoField(activeTab, item.id, 'title', e.target.value)
                            }
                            placeholder="फ़ोटो का मुख्य शीर्षक"
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                            सेवा श्रेणी (Category / Tag)
                          </label>
                          <input
                            type="text"
                            value={item.category || ''}
                            onChange={(e) =>
                              handleUpdatePhotoField(activeTab, item.id, 'category', e.target.value)
                            }
                            placeholder="उदा. शिक्षा सेवा, स्वास्थ्य, राहत"
                            className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                          संक्षिप्त विवरण (Description / Caption)
                        </label>
                        <input
                          type="text"
                          value={item.description || ''}
                          onChange={(e) =>
                            handleUpdatePhotoField(activeTab, item.id, 'description', e.target.value)
                          }
                          placeholder="इस सेवा गतिविधि का संक्षिप्त विवरण"
                          className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                        />
                      </div>

                      {/* Location & Date for Events/Rural */}
                      {activeConfig.supportsMetadata && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                            <input
                              type="text"
                              value={item.location || ''}
                              onChange={(e) =>
                                handleUpdatePhotoField(activeTab, item.id, 'location', e.target.value)
                              }
                              placeholder="स्थान उदा. मीरानपुर, गाजीपुर"
                              className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded-md text-[11px] text-slate-700"
                            />
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                            <input
                              type="date"
                              value={item.date || ''}
                              onChange={(e) =>
                                handleUpdatePhotoField(activeTab, item.id, 'date', e.target.value)
                              }
                              className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded-md text-[11px] text-slate-700"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Delete Action (1 Col) */}
                    <div className="md:col-span-1 flex md:flex-col items-center justify-end md:justify-center">
                      <button
                        type="button"
                        onClick={() => handleDeletePhoto(activeTab, item.id)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition cursor-pointer"
                        title="यह फ़ोटो हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Live Slide Preview for Active Section */}
          {activeSectionState.items.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 text-[#8B0000]" />
                  <span>लाइव स्लाइडर पूर्वावलोकन (Preview of Section {activeConfig.numberLabel})</span>
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {activeSectionState.items.length} फ़ोटो स्लाइड
                </span>
              </div>

              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-black border-2 border-amber-400/60 shadow-lg">
                <img
                  src={activeSectionState.items[0]?.url}
                  alt="Preview"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase">
                    {activeSectionState.items[0]?.category || activeConfig.badge}
                  </span>
                  <h4 className="text-base sm:text-lg font-black font-serif mt-1">
                    {activeSectionState.items[0]?.title}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-1">
                    {activeSectionState.items[0]?.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* SUB-TAB 5: BRANDING, LOGO, THUMBNAIL & VIDEO                          */}
      {/* ===================================================================== */}
      {activeTab === 'section_branding_video' && (
        <div className="space-y-6">
          {/* Logo & Thumbnail Manager */}
          <AppLogoManager />

          {/* Documentary Video Settings */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-black text-xs">
                  🎬 ग्राउंड डॉक्यूमेंट्री
                </span>
                <h3 className="text-xl font-black text-slate-900 font-serif mt-2">
                  डॉक्यूमेंट्री वीडियो सेटिंग्स
                </h3>
              </div>
            </div>

            <div className="space-y-4 max-w-3xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  YouTube / Video URL
                </label>
                <input
                  type="url"
                  value={bannerVideoUrl}
                  onChange={(e) => setBannerVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  वीडियो शीर्षक (Title)
                </label>
                <input
                  type="text"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="उदा. सशक्त गाजीपुर, समृद्ध समाज"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  वीडियो उपशीर्षक (Subtitle)
                </label>
                <input
                  type="text"
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  placeholder="हमारे सेवा अभियानों से जुड़ें..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* GLOBAL SLIDER TIMING & AUTOPLAY SETTINGS                              */}
      {/* ===================================================================== */}
      <div className="bg-amber-50/60 rounded-3xl p-6 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-900 rounded-2xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900">स्लाइडर गति व समय सेटिंग्स</h4>
            <p className="text-xs text-slate-600">सभी चारों स्लाइडरों के स्वतः बदलने का समय (सेकंड में)</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sliderAutoPlay"
              checked={sliderAutoPlay}
              onChange={(e) => setSliderAutoPlay(e.target.checked)}
              className="w-4 h-4 text-[#8B0000] rounded cursor-pointer"
            />
            <label htmlFor="sliderAutoPlay" className="text-xs font-bold text-slate-800 cursor-pointer">
              ऑटो-प्ले चालू रखें
            </label>
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="number"
              min={2}
              max={15}
              value={sliderInterval}
              onChange={(e) => setSliderInterval(Math.max(2, Math.min(15, parseInt(e.target.value) || 4)))}
              className="w-16 px-2.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-center"
            />
            <span className="text-xs font-medium text-slate-600">सेकंड</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MASTER SAVE BUTTON BAR (Saves All 4 Sections)                         */}
      {/* ===================================================================== */}
      <div className="bg-slate-950 text-white rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl border-2 border-amber-400">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-amber-300 text-sm">चारों सेक्शन सुरक्षित होने हेतु तैयार</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            कुल: {sliderPhotos.length} + {campaignGalleryPhotos.length} + {recentEventsPhotos.length} + {ruralWorkPhotos.length} फ़ोटो अपलोड हैं (प्रत्येक में अधिकतम 15)
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving || isUploadingFiles}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition cursor-pointer flex items-center justify-center gap-2.5 disabled:opacity-50 transform hover:scale-105"
        >
          {isSaving ? (
            <>
              <RotateCw className="w-5 h-5 animate-spin" />
              <span>क्लाउड डेटाबेस में सुरक्षित हो रहा है...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5 text-slate-950" />
              <span>💾 सभी 4 सेक्शन की फ़ोटो सुरक्षित करें (Save All Changes)</span>
            </>
          )}
        </button>
      </div>

      {/* MODAL: ADD PHOTO BY URL */}
      {showAddUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-amber-300 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-600" />
                <span>URL से नई फ़ोटो जोड़ें</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddUrlModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddPhotoByUrl} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  लक्ष्य सेक्शन चुनें (Target Section)
                </label>
                <select
                  value={targetSectionForUrl}
                  onChange={(e) => setTargetSectionForUrl(e.target.value as ActiveSectionTab)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="section_hero_slides">१. लाइव फ़ोटो स्लाइड्स (होम पेज)</option>
                  <option value="section_campaign_gallery">२. ग़ाज़ीपुर सेवा अभियानों की लाइव फ़ोटो गैलरी</option>
                  <option value="section_recent_events">३. हाल ही में आयोजित सेवा कार्यक्रम</option>
                  <option value="section_rural_work">४. ग़ाज़ीपुर के ग्रामीण अंचलों में जीवन ज्योति का कार्य</option>
                </select>
              </div>

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
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  फ़ोटो शीर्षक (Title)
                </label>
                <input
                  type="text"
                  value={customPhotoTitle}
                  onChange={(e) => setCustomPhotoTitle(e.target.value)}
                  placeholder="उदा. निःशुल्क स्वास्थ्य शिविर"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  संक्षिप्त विवरण (Description)
                </label>
                <input
                  type="text"
                  value={customPhotoDesc}
                  onChange={(e) => setCustomPhotoDesc(e.target.value)}
                  placeholder="उदा. ग़ाज़ीपुर ग्रामीण क्षेत्र में निशुल्क दवा वितरण"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8B0000]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    श्रेणी (Category)
                  </label>
                  <input
                    type="text"
                    value={customPhotoCategory}
                    onChange={(e) => setCustomPhotoCategory(e.target.value)}
                    placeholder="उदा. शिक्षा सेवा"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    स्थान (Location)
                  </label>
                  <input
                    type="text"
                    value={customPhotoLocation}
                    onChange={(e) => setCustomPhotoLocation(e.target.value)}
                    placeholder="उदा. जमानियां, गाजीपुर"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
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

      {/* MODAL: ZOOM PREVIEW LIGHTBOX */}
      {previewZoomPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPreviewZoomPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden border border-amber-400/40 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-white font-bold text-sm truncate">{previewZoomPhoto.title}</h4>
              <button
                type="button"
                onClick={() => setPreviewZoomPhoto(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-red-600 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-3 flex items-center justify-center max-h-[70vh]">
              <img
                src={previewZoomPhoto.url}
                alt={previewZoomPhoto.title || 'Slide'}
                className="max-w-full max-h-[65vh] object-contain rounded-lg"
              />
            </div>
            {previewZoomPhoto.description && (
              <p className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                {previewZoomPhoto.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TabBannerMediaManager;
