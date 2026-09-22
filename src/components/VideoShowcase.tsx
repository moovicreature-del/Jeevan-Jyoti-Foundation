// ============================================================================
// JEEVAN JYOTI FOUNDATION - RURAL WORK SHOWCASE & LIVE PHOTO SLIDER
// सेक्शन ४: ग़ाज़ीपुर के ग्रामीण अंचलों में जीवन ज्योति का कार्य (यूट्यूब HD वीडियो व १५ फ़ोटो)
// ============================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Play,
  Pause,
  Film,
  Sparkles,
  Camera,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  MapPin,
  Layers,
  Volume2,
  VolumeX,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useHomeContent } from '../context/HomeContentContext';
import { SliderPhotoItem } from '../types';
import { DEFAULT_RURAL_WORK_PHOTOS } from '../services/adminService';

interface VideoShowcaseProps {
  onOpenAdmin?: () => void;
}

/**
 * YouTube URL से Video ID निकालने का सुरक्षित हेल्पर
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // Pattern matching watch?v=, youtu.be/, embed/, shorts/
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  if (match && match[1]) {
    return match[1];
  }

  // Fallback: Check if 11 character string directly passed
  if (/^[\w-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export const VideoShowcase: React.FC<VideoShowcaseProps> = ({ onOpenAdmin }) => {
  const { t, isHindi } = useLanguage();
  const { content } = useHomeContent();

  // Mode: 'video' (Default for YouTube HD automatic play) or 'slides'
  const [activeTab, setActiveTab] = useState<'video' | 'slides'>('video');
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Rural work slides (up to 15 photos configured by admin)
  const slides: SliderPhotoItem[] =
    content.ruralWorkPhotos && content.ruralWorkPhotos.length > 0
      ? content.ruralWorkPhotos
      : DEFAULT_RURAL_WORK_PHOTOS;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [zoomPhoto, setZoomPhoto] = useState<SliderPhotoItem | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Video URL from admin
  const rawVideoUrl =
    content.ruralWorkVideoUrl ||
    content.bannerVideoUrl ||
    'https://www.youtube.com/watch?v=0kF5s7J_C3A';

  const docTitle = content.bannerTitle || '"उम्मीद की एक किरण" - जीवन ज्योति डॉक्यूमेंट्री';
  const docSubtitle =
    content.bannerSubtitle ||
    'ग़ाज़ीपुर जनपद के सुदूर गांवों में संचालित सांध्यकालीन पाठशाला और स्वास्थ्य रक्षा अभियान की सच्ची कहानी।';

  const autoPlay = content.sliderAutoPlay !== false;
  const intervalSeconds = content.sliderInterval && content.sliderInterval >= 2 ? content.sliderInterval : 4.5;
  const intervalMs = intervalSeconds * 1000;

  // Extract YouTube ID
  const youtubeVideoId = useMemo(() => extractYouTubeId(rawVideoUrl), [rawVideoUrl]);

  // Construct HD Quality Autoplay URL
  const hdAutoplayEmbedUrl = useMemo(() => {
    if (!youtubeVideoId) return '';
    // YouTube Parameters for HD Quality & Autoplay:
    // autoplay=1 : Start automatically
    // mute=1/0   : Muted by default so modern browsers allow instant automatic playback without blocking
    // vq=hd1080  : Request 1080p Full HD video quality
    // hd=1       : Force High Definition mode
    // loop=1     : Loop playback
    // rel=0      : Do not show unrelated recommendations
    // enablejsapi=1 : Allow iframe API
    const muteParam = isMuted ? '1' : '0';
    return `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=1&mute=${muteParam}&loop=1&playlist=${youtubeVideoId}&controls=1&modestbranding=1&rel=0&hd=1&vq=hd1080&playsinline=1&enablejsapi=1`;
  }, [youtubeVideoId, isMuted]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  // Autoplay timer for rural slides
  useEffect(() => {
    if (activeTab !== 'slides' || !autoPlay || isPaused || slides.length <= 1) return;

    const stepMs = 50;
    const progressStep = (stepMs / intervalMs) * 100;

    const timer = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          nextSlide();
          return 0;
        }
        return old + progressStep;
      });
    }, stepMs);

    return () => clearInterval(timer);
  }, [activeTab, autoPlay, isPaused, intervalMs, nextSlide, slides.length]);

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <section id="video-showcase" className="py-16 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 text-red-300 text-xs font-black uppercase tracking-wider mb-3 border border-red-500/30 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t('video.badge', 'ग्राउंड रियलिटी एवं ग्रामीण सेवा झलक (Ground Impact in Rural Villages)', 'Ground Impact in Rural Villages')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-serif leading-tight">
            {t('video.title', 'ग़ाज़ीपुर के ग्रामीण अंचलों में जीवन ज्योति का कार्य', 'Ground Realities & Impact in Rural Ghazipur')}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm md:text-base mt-2 font-medium">
            {t(
              'video.sub',
              'देखें कि कैसे आपके सहयोग और हमारे समर्पित स्वयंसेवकों के प्रयास से सुदूर गांवों में सेवा की अलख जग रही है।',
              'Watch how your support and our dedicated volunteers transform lives across rural Ghazipur.'
            )}
          </p>

          {/* Dual Toggle: YouTube HD Video (Default) vs Rural Photo Slider (15 Photos) */}
          <div className="mt-6 inline-flex items-center p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl gap-1">
            <button
              onClick={() => setActiveTab('video')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'video'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg scale-102 ring-2 ring-red-400/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-4 h-4 text-red-300" />
              <span>🎬 लाइव यूट्यूब HD वीडियो (ऑटो-प्ले)</span>
            </button>

            <button
              onClick={() => setActiveTab('slides')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'slides'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-lg scale-102 ring-2 ring-amber-300'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>📸 ग्रामीण सेवा फ़ोटो ({slides.length}/15)</span>
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* VIEW 1: YOUTUBE HD VIDEO EMBED WITH AUTOMATIC PLAY                */}
        {/* ================================================================= */}
        {activeTab === 'video' && (
          <div className="max-w-5xl mx-auto space-y-4 animate-in fade-in duration-300">
            {/* HD Video Player Container */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-red-500/50 shadow-2xl bg-black aspect-video flex items-center justify-center group">
              {youtubeVideoId ? (
                <iframe
                  src={hdAutoplayEmbedUrl}
                  title={docTitle}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                /* Fallback if non-youtube or custom video */
                <video
                  src={rawVideoUrl}
                  controls
                  autoPlay
                  muted={isMuted}
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}

              {/* Status Pill on Top Left */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 backdrop-blur-md text-white font-black text-[11px] uppercase tracking-wider shadow-lg border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>HD 1080p ऑटो-प्ले सक्रिय</span>
                </span>
              </div>

              {/* Unmute / Mute Audio Controller on Top Right */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`px-3 py-1.5 rounded-full font-bold text-xs backdrop-blur-md border transition-all flex items-center gap-1.5 cursor-pointer shadow-lg hover:scale-105 ${
                    isMuted
                      ? 'bg-amber-500/90 hover:bg-amber-500 text-slate-950 border-amber-300'
                      : 'bg-black/75 hover:bg-black text-white border-white/20'
                  }`}
                  title={isMuted ? 'यूट्यूब वीडियो की आवाज़ चालू करें' : 'आवाज़ म्यूट करें'}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-slate-950" />
                      <span>🔊 आवाज़ खोलें</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      <span>आवाज़ चालू है</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Video Meta Info & Admin Direct Quick Button */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white font-serif flex items-center gap-2">
                  <Film className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{docTitle}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  {docSubtitle}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {rawVideoUrl && (
                  <a
                    href={rawVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                    title="YouTube पर देखें"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">यूट्यूब पर खोलें</span>
                  </a>
                )}

                {onOpenAdmin && (
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md"
                    title="एडमिन पोर्टल से यूट्यूब वीडियो लिंक बदलें"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>एडमिन से लिंक बदलें</span>
                  </button>
                )}
              </div>
            </div>

            {/* Rural 15 Photos Horizontal Quick Carousel Strip underneath video */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  <span>ग्रामीण सेवा झलकियां ({slides.length} फ़ोटो उपलब्ध):</span>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('slides')}
                  className="text-[11px] font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>बड़ा स्लाइड शो देखें</span>
                  <span>→</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id || idx}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setActiveTab('slides');
                    }}
                    className="relative shrink-0 w-24 h-16 sm:w-28 sm:h-18 rounded-xl overflow-hidden border border-slate-700 hover:border-amber-400 transition group cursor-pointer"
                    title={slide.title}
                  >
                    <img
                      src={slide.url}
                      alt={slide.title || ''}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <span className="absolute bottom-1 left-1.5 right-1 text-[9px] text-white font-medium truncate text-left">
                      {slide.title || `फ़ोटो ${idx + 1}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 2: RURAL ACTION PHOTO SLIDER (Up to 15 Photos)               */}
        {/* ================================================================= */}
        {activeTab === 'slides' && (
          <div
            className="max-w-5xl mx-auto rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-2xl bg-slate-900 relative animate-in fade-in duration-300"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Top Slide Progress Bar */}
            {autoPlay && slides.length > 1 && (
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/40 z-30 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 transition-all duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* Main Slide Area */}
            <div className="relative w-full h-[360px] sm:h-[460px] md:h-[520px] overflow-hidden bg-black select-none">
              {slides.map((slide, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={slide.id || idx}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                    }`}
                  >
                    <img
                      src={slide.url}
                      alt={slide.title || 'ग्रामीण सेवा कार्य'}
                      className="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80';
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 z-20">
                      <div className="max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{slide.category || 'ग्रामीण सेवा कार्य'}</span>
                          </span>

                          {slide.location && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-bold border border-white/20">
                              <MapPin className="w-3 h-3 text-amber-300" />
                              <span>{slide.location}</span>
                            </span>
                          )}

                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-xs font-mono font-bold border border-amber-400/30">
                            <Camera className="w-3 h-3 text-amber-400" />
                            <span>फ़ोटो {idx + 1} / {slides.length}</span>
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-serif drop-shadow-md leading-tight mb-2">
                          {slide.title || `ग्रामीण सेवा झलक ${idx + 1}`}
                        </h3>

                        <p className="text-xs sm:text-sm md:text-base text-slate-200 line-clamp-2 sm:line-clamp-3 font-medium leading-relaxed drop-shadow-sm max-w-2xl">
                          {slide.description || 'ग़ाज़ीपुर के सुदूर गांवों में वंचित परिवारों तक सहायता पहुंचाने का धरातलीय अभियान।'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Top Controls */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <button
                  onClick={() => setZoomPhoto(currentSlide)}
                  className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-amber-600 text-white backdrop-blur-md border border-white/20 transition cursor-pointer hover:scale-105"
                  title="फ़ोटो बड़ा करके देखें"
                >
                  <Maximize2 className="w-4 h-4 sm:w-5 h-5" />
                </button>

                {slides.length > 1 && (
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-amber-600 text-white backdrop-blur-md border border-white/20 transition cursor-pointer hover:scale-105"
                    title={isPaused ? 'स्लाइड शो चलाएं' : 'स्लाइड शो रोकें'}
                  >
                    {isPaused ? <Play className="w-4 h-4 sm:w-5 h-5 fill-current" /> : <Pause className="w-4 h-4 sm:w-5 h-5" />}
                  </button>
                )}
              </div>

              {/* Prev / Next Navigation */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-amber-600 text-white backdrop-blur-md border border-white/20 transition hover:scale-110 cursor-pointer"
                    title="पिछली फ़ोटो"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-amber-600 text-white backdrop-blur-md border border-white/20 transition hover:scale-110 cursor-pointer"
                    title="अगली फ़ोटो"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Thumbnails Strip & Admin Button */}
            <div className="bg-slate-900 border-t border-slate-800 p-3 sm:p-4 flex items-center justify-between gap-3 overflow-x-auto">
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id || idx}
                    onClick={() => goToSlide(idx)}
                    className={`relative shrink-0 w-12 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
                      idx === currentIndex
                        ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105 opacity-100'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                    title={slide.title || `फ़ोटो ${idx + 1}`}
                  >
                    <img src={slide.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                    <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-black/70 text-[9px] font-mono text-white rounded">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>

              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="shrink-0 text-xs font-bold text-amber-300 hover:text-white bg-white/10 hover:bg-amber-600 px-3.5 py-2 rounded-xl border border-amber-400/40 transition flex items-center gap-1.5 cursor-pointer ml-2"
                  title="एडमिन से ग्रामीण सेवा फ़ोटो बदलें (15 फ़ोटो तक)"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">एडमिन फ़ोटो</span>
                  <span>({slides.length}/15)</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Zoom Modal */}
      {zoomPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setZoomPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center bg-slate-950 rounded-2xl overflow-hidden border border-amber-400/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs">
                  {zoomPhoto.category || 'ग्रामीण सेवा कार्य'}
                </span>
                <h4 className="text-white font-bold text-sm sm:text-base font-serif truncate max-w-md">
                  {zoomPhoto.title}
                </h4>
              </div>
              <button
                onClick={() => setZoomPhoto(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-red-600 text-white transition-colors cursor-pointer"
                title="बंद करें"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full flex-1 max-h-[70vh] flex items-center justify-center p-2 bg-black">
              <img
                src={zoomPhoto.url}
                alt={zoomPhoto.title || 'ग्रामीण सेवा फ़ोटो'}
                className="max-w-full max-h-[68vh] object-contain rounded-lg"
              />
            </div>

            {zoomPhoto.description && (
              <div className="w-full p-4 bg-slate-900 border-t border-slate-800 text-slate-300 text-xs sm:text-sm">
                <p>{zoomPhoto.description}</p>
                {zoomPhoto.location && (
                  <p className="mt-1 text-amber-300 text-xs font-semibold">📍 {zoomPhoto.location}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoShowcase;
