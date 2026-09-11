// ============================================================================
// JEEVAN JYOTI FOUNDATION - TAB 3: HOME PAGE TEXT EDITOR
// जीवन ज्योति फाउंडेशन - होम पेज टेक्स्ट एडिटर (Hero, About, Mission, Footer)
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Save,
  RotateCw,
  RefreshCw,
  Sparkles,
  Eye,
  CheckCircle,
  HelpCircle,
  Layers,
  HeartHandshake,
  Compass,
  Info
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useHomeContent } from '../../context/HomeContentContext';
import { useAdminUploadProgress } from '../../context/AdminUploadProgressContext';
import { saveHomeContent, DEFAULT_HOME_CONTENT } from '../../services/adminService';
import toast from 'react-hot-toast';

export const TabHomeTextEditor: React.FC = () => {
  const { adminProfile } = useAdminAuth();
  const { content } = useHomeContent();
  const { startUpload, updateProgress, completeUpload, failUpload } = useAdminUploadProgress();

  const [heroTitle, setHeroTitle] = useState<string>(content.heroTitle || '');
  const [heroSubtitle, setHeroSubtitle] = useState<string>(content.heroSubtitle || '');
  const [aboutText, setAboutText] = useState<string>(content.aboutText || '');
  const [missionText, setMissionText] = useState<string>(content.missionText || '');
  const [footerText, setFooterText] = useState<string>(content.footerText || '');

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activePreview, setActivePreview] = useState<'hero' | 'about' | 'mission' | 'footer'>('hero');

  // Sync state with incoming content
  useEffect(() => {
    if (content) {
      setHeroTitle(content.heroTitle || DEFAULT_HOME_CONTENT.heroTitle);
      setHeroSubtitle(content.heroSubtitle || DEFAULT_HOME_CONTENT.heroSubtitle);
      setAboutText(content.aboutText || DEFAULT_HOME_CONTENT.aboutText);
      setMissionText(content.missionText || DEFAULT_HOME_CONTENT.missionText);
      setFooterText(content.footerText || DEFAULT_HOME_CONTENT.footerText);
    }
  }, [content]);

  // Save to Firestore
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProfile) {
      toast.error('कृपया पहले लॉगिन करें!');
      return;
    }

    setIsSaving(true);
    startUpload('होम पेज टेक्स्ट सिंक', 'content', 'स्लोगन, परिचय व उद्देश्य सामग्री');
    updateProgress(30, 'क्लाउड सर्वर से संपर्क स्थापित किया जा रहा है...');

    try {
      updateProgress(70, 'फ़ायरस्टोर में टेक्स्ट बदलाव सहेजे जा रहे हैं...');
      await saveHomeContent(
        {
          ...content,
          heroTitle: heroTitle.trim(),
          heroSubtitle: heroSubtitle.trim(),
          aboutText: aboutText.trim(),
          missionText: missionText.trim(),
          footerText: footerText.trim()
        },
        adminProfile.name,
        adminProfile.uid
      );
      completeUpload('होम पेज का समस्त टेक्स्ट सफलतापूर्वक सहेजा गया!');
      toast.success('होम पेज का समस्त टेक्स्ट सफलतापूर्वक अपडेट हो गया!');
    } catch (error) {
      console.error('Text save error:', error);
      failUpload('टेक्स्ट डेटा सहेजने में त्रुटि आई।');
      toast.error('टेक्स्ट सेव करने में त्रुटि आई।');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to default
  const handleResetDefaults = () => {
    setHeroTitle(DEFAULT_HOME_CONTENT.heroTitle);
    setHeroSubtitle(DEFAULT_HOME_CONTENT.heroSubtitle);
    setAboutText(DEFAULT_HOME_CONTENT.aboutText);
    setMissionText(DEFAULT_HOME_CONTENT.missionText);
    setFooterText(DEFAULT_HOME_CONTENT.footerText);
    toast.success('डिफ़ॉल्ट मान लोड किए गए। सेव करने के लिए "टेक्स्ट सेव करें" दबाएं।');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>TAB 3: HOME PAGE TEXT EDITOR</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              होम पेज टेक्स्ट एवं कंटेंट संपादक
            </h2>
            <p className="text-xs text-blue-100 mt-1 max-w-xl">
              बिना किसी कोडिंग के ऐप और वेबसाइट के मुख्य शीर्षक, उप-शीर्षक, परिचय (About Us), उद्देश्य (Mission) और फुटर टेक्स्ट को तुरंत बदलें।
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition cursor-pointer border border-white/20"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>डिफ़ॉल्ट रीसेट</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT 7 COLS: EDITABLE TEXT FIELDS */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. HERO SECTION TEXT */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-black text-xs">
                  1
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  हीरो सेक्शन टेक्स्ट (Hero Banner Text)
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  मुख्य स्लोगन / शीर्षक (Hero Title) *
                </label>
                <input
                  type="text"
                  value={heroTitle}
                  onFocus={() => setActivePreview('hero')}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="रोशनी बनो किसी के अंधेरे जीवन की"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  उप-शीर्षक / टैगलाइन (Hero Subtitle) *
                </label>
                <textarea
                  rows={2}
                  value={heroSubtitle}
                  onFocus={() => setActivePreview('hero')}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="ग़ाज़ीपुर के हर वंचित वर्ग तक शिक्षा, स्वास्थ्य, अन्न और स्वावलंबन पहुँचाने का पवित्र सामाजिक संकल्प।"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700 leading-relaxed"
                  required
                />
              </div>
            </div>

            {/* 2. ABOUT US TEXT */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-black text-xs">
                  2
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  संस्था परिचय (About Us Text)
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  जीवन ज्योति फाउंडेशन का संक्षिप्त परिचय (About Us Content) *
                </label>
                <textarea
                  rows={4}
                  value={aboutText}
                  onFocus={() => setActivePreview('about')}
                  onChange={(e) => setAboutText(e.target.value)}
                  placeholder="संस्था का इतिहास, पंजीकरण व ग़ाज़ीपुर जिले में किए जाने वाले सामाजिक कार्यों का विवरण लिखें..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700 leading-relaxed"
                  required
                />
              </div>
            </div>

            {/* 3. MISSION TEXT */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-xs">
                  3
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  संस्था का लक्ष्य एवं उद्देश्य (Mission & Vision Text)
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  मिशन एवं संकल्प वक्तव्य (Mission Statement) *
                </label>
                <textarea
                  rows={3}
                  value={missionText}
                  onFocus={() => setActivePreview('mission')}
                  onChange={(e) => setMissionText(e.target.value)}
                  placeholder="शिक्षा का प्रकाश, स्वास्थ्य शिविर, युवा स्वावलंबन और नारी सशक्तीकरण..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700 leading-relaxed"
                  required
                />
              </div>
            </div>

            {/* 4. FOOTER TEXT */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-900 flex items-center justify-center font-black text-xs">
                  4
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  फुटर कॉपीराइट एवं कानूनी जानकारी (Footer Text)
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  फुटर का अंतिम संदेश (Footer Copyright Statement) *
                </label>
                <input
                  type="text"
                  value={footerText}
                  onFocus={() => setActivePreview('footer')}
                  onChange={(e) => setFooterText(e.target.value)}
                  placeholder="© 2026 जीवन ज्योति फाउंडेशन ग़ाज़ीपुर, उत्तर प्रदेश, भारत। सर्वाधिकार सुरक्षित।"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                  required
                />
              </div>
            </div>
          </div>

          {/* RIGHT 5 COLS: INTERACTIVE LIVE PREVIEW CARD */}
          <div className="lg:col-span-5 space-y-4">
            <div className="sticky top-6 bg-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4 border border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-300">
                    लाइव पूर्वावलोकन (Live App Preview)
                  </h4>
                </div>
                <span className="text-[10px] bg-blue-900 text-blue-200 px-2 py-0.5 rounded-full font-bold">
                  Real-time
                </span>
              </div>

              {/* Preview Tabs */}
              <div className="flex gap-1 bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActivePreview('hero')}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition ${
                    activePreview === 'hero' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400'
                  }`}
                >
                  Hero
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreview('about')}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition ${
                    activePreview === 'about' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400'
                  }`}
                >
                  About
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreview('mission')}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition ${
                    activePreview === 'mission' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400'
                  }`}
                >
                  Mission
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreview('footer')}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition ${
                    activePreview === 'footer' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400'
                  }`}
                >
                  Footer
                </button>
              </div>

              {/* Dynamic Preview Container */}
              <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 min-h-[220px] flex flex-col justify-center">
                {activePreview === 'hero' && (
                  <div className="space-y-3 text-center">
                    <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block">
                      जीवन ज्योति फाउंडेशन ग़ाज़ीपुर, उत्तर प्रदेश, भारत
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                      {heroTitle || 'रोशनी बनो किसी के अंधेरे जीवन की'}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
                      {heroSubtitle || 'ग़ाज़ीपुर के हर वंचित वर्ग तक शिक्षा, स्वास्थ्य, अन्न और स्वावलंबन पहुँचाने का संकल्प।'}
                    </p>
                  </div>
                )}

                {activePreview === 'about' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-400 text-xs font-black">
                      <HeartHandshake className="w-4 h-4" />
                      <span>संस्था परिचय (About Jeevan Jyoti)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {aboutText || 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुर, उत्तर प्रदेश, भारत में पंजीकृत एक गैर-सरकारी सामाजिक संस्था है।'}
                    </p>
                  </div>
                )}

                {activePreview === 'mission' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-black">
                      <Compass className="w-4 h-4" />
                      <span>हमारा मिशन (Our Mission & Vision)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {missionText || 'शिक्षा का प्रकाश, स्वास्थ्य शिविर, युवा स्वावलंबन और नारी सशक्तीकरण द्वारा समाज का विकास।'}
                    </p>
                  </div>
                )}

                {activePreview === 'footer' && (
                  <div className="space-y-2 text-center">
                    <p className="text-xs text-slate-400">
                      {footerText || '© 2026 जीवन ज्योति फाउंडेशन ग़ाज़ीपुर, उत्तर प्रदेश, भारत। सर्वाधिकार सुरक्षित।'}
                    </p>
                    <div className="flex justify-center gap-3 text-[10px] text-amber-400 pt-2 border-t border-slate-800">
                      <span>नीति आयोग दर्पण</span>
                      <span>•</span>
                      <span>80G / 12A अधिकृत</span>
                      <span>•</span>
                      <span>ग़ाज़ीपुर (उ.प्र.)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Status Note */}
              <div className="p-3 bg-slate-800/60 rounded-xl text-[11px] text-slate-400 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  यह टेक्स्ट सेव होते ही पूरे मोबाइल ऐप और वेबसाइट के सभी पेजों पर लाइव हो जाता है।
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SAVE STRIP */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="text-xs text-slate-300">
            <span className="font-bold text-amber-400">अंतिम अपडेट: </span>
            {content.updatedBy || 'सिस्टम एडमिन'} द्वारा{' '}
            {content.updatedAt
              ? new Date(content.updatedAt).toLocaleString('hi-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })
              : 'हाल ही में'}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-blue-950 font-black text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>फ़ायरबेस में सहेजा जा रहा है...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>होम पेज टेक्स्ट सेव करें (Save Text Changes)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
