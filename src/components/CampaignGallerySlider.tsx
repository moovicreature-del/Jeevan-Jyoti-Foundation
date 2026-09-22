// ============================================================================
// JEEVAN JYOTI FOUNDATION - CAMPAIGN LIVE PHOTO GALLERY SLIDER
// सेक्शन २: ग़ाज़ीपुर सेवा अभियानों की लाइव फ़ोटो गैलरी (स्वचालित व उत्तरदायी स्लाइडर)
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Maximize2,
  X,
  Sparkles,
  Camera,
  Layers,
  Heart,
  Eye,
  ShieldCheck,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { useHomeContent } from '../context/HomeContentContext';
import { useLanguage } from '../context/LanguageContext';
import { SliderPhotoItem } from '../types';
import { DEFAULT_CAMPAIGN_GALLERY_PHOTOS } from '../services/adminService';

interface CampaignGallerySliderProps {
  onOpenAdmin?: () => void;
  className?: string;
}

export const CampaignGallerySlider: React.FC<CampaignGallerySliderProps> = ({
  onOpenAdmin,
  className = ''
}) => {
  const { content } = useHomeContent();
  const { isHindi } = useLanguage();

  // Active slides (up to 15 photos configured by admin)
  const slides: SliderPhotoItem[] =
    content.campaignGalleryPhotos && content.campaignGalleryPhotos.length > 0
      ? content.campaignGalleryPhotos
      : DEFAULT_CAMPAIGN_GALLERY_PHOTOS;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [zoomPhoto, setZoomPhoto] = useState<SliderPhotoItem | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const autoPlay = content.sliderAutoPlay !== false;
  const intervalSeconds = content.sliderInterval && content.sliderInterval >= 2 ? content.sliderInterval : 4;
  const intervalMs = intervalSeconds * 1000;

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

  // Automatic slide interval timer & smooth progress
  useEffect(() => {
    if (!autoPlay || isPaused || slides.length <= 1) {
      return;
    }

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
  }, [autoPlay, isPaused, intervalMs, nextSlide, slides.length]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <div
      className={`relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-300/80 bg-slate-950 text-white ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="ग़ाज़ीपुर सेवा अभियानों की लाइव फ़ोटो गैलरी"
    >
      {/* Top Slide Progress Bar */}
      {autoPlay && slides.length > 1 && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/40 z-30 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Main Slide Stage */}
      <div className="relative w-full h-[340px] sm:h-[440px] md:h-[500px] lg:h-[540px] overflow-hidden bg-slate-900 select-none">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.url}
                alt={slide.title || `गाजीपुर सेवा अभियान ${index + 1}`}
                className="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out hover:scale-105"
                loading={index === 0 ? 'eager' : 'lazy'}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1200&auto=format&fit=crop&q=80';
                }}
              />

              {/* Cinematic Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent hidden md:block" />

              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 z-20 flex flex-col justify-end">
                <div className="max-w-3xl">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{slide.category || (isHindi ? 'सेवा अभियान' : 'Seva Campaign')}</span>
                    </span>

                    {slide.location && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-200 text-xs font-bold border border-white/20">
                        <MapPin className="w-3 h-3 text-amber-300" />
                        <span>{slide.location}</span>
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-300 text-xs font-mono font-bold border border-amber-400/30">
                      <Camera className="w-3 h-3 text-amber-400" />
                      <span>
                        फ़ोटो {index + 1} / {slides.length}
                      </span>
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white font-serif drop-shadow-md leading-tight mb-1.5">
                    {slide.title || `ग़ाज़ीपुर सेवा अभियान झलक ${index + 1}`}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm md:text-base text-slate-200 line-clamp-2 sm:line-clamp-3 font-medium leading-relaxed drop-shadow-sm max-w-2xl">
                    {slide.description || 'जीवन ज्योति फाउंडेशन द्वारा ग़ाज़ीपुर के जरूरतमंदों को समर्पित सेवा कार्य।'}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Top Control Bar */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {/* Zoom Lightbox Button */}
          <button
            onClick={() => setZoomPhoto(currentSlide)}
            className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-amber-600 text-white backdrop-blur-md border border-white/20 transition-all shadow-md cursor-pointer hover:scale-105"
            title="फ़ोटो को बड़ा करके देखें (Full Screen Lightbox)"
            aria-label="Zoom Photo"
          >
            <Maximize2 className="w-4 h-4 sm:w-5 h-5" />
          </button>

          {/* Play/Pause Button */}
          {slides.length > 1 && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-amber-600 text-white backdrop-blur-md border border-white/20 transition-all shadow-md cursor-pointer hover:scale-105"
              title={isPaused ? 'स्लाइड शो चलाएं (Play)' : 'स्लाइड शो रोकें (Pause)'}
              aria-label={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? <Play className="w-4 h-4 sm:w-5 h-5 fill-current" /> : <Pause className="w-4 h-4 sm:w-5 h-5" />}
            </button>
          )}
        </div>

        {/* Previous Button */}
        {slides.length > 1 && (
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/50 hover:bg-amber-600 text-white backdrop-blur-md border border-white/20 transition-all shadow-lg hover:scale-110 cursor-pointer active:scale-95"
            title="पिछली फ़ोटो (Previous)"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}

        {/* Next Button */}
        {slides.length > 1 && (
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3.5 rounded-full bg-black/50 hover:bg-amber-600 text-white backdrop-blur-md border border-white/20 transition-all shadow-lg hover:scale-110 cursor-pointer active:scale-95"
            title="अगली फ़ोटो (Next)"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip (Quick Selection) */}
      {slides.length > 1 && (
        <div className="bg-slate-900/95 border-t border-slate-800 p-2.5 sm:p-3.5 flex items-center justify-between gap-3 overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {slides.map((slide, index) => {
              const isActive = index === currentIndex;
              return (
                <button
                  key={slide.id || index}
                  onClick={() => goToSlide(index)}
                  className={`relative shrink-0 w-12 h-10 sm:w-16 sm:h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105 opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-100 hover:border-slate-500'
                  }`}
                  title={slide.title || `फ़ोटो ${index + 1}`}
                >
                  <img
                    src={slide.url}
                    alt={slide.title || `Thumb ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-amber-400/10 pointer-events-none" />
                  )}
                  <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-black/70 text-[9px] font-mono text-white rounded">
                    {index + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Admin Shortcut Button */}
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="shrink-0 text-xs font-bold text-amber-300 hover:text-white bg-white/10 hover:bg-amber-600 px-3 py-1.5 rounded-lg border border-amber-400/40 transition-colors flex items-center gap-1.5 cursor-pointer ml-2"
              title="एडमिन पोर्टल से फ़ोटो अपलोड करें या बदलें (15 फ़ोटो तक)"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">एडमिन फ़ोटो प्रबंधन</span>
              <span>({slides.length}/15)</span>
            </button>
          )}
        </div>
      )}

      {/* Lightbox Zoom Modal */}
      {zoomPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setZoomPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center bg-slate-950 rounded-2xl overflow-hidden border border-amber-400/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs">
                  {zoomPhoto.category || 'ग़ाज़ीपुर सेवा अभियान'}
                </span>
                <h4 className="text-white font-bold text-sm sm:text-base font-serif truncate max-w-md">
                  {zoomPhoto.title}
                </h4>
              </div>
              <button
                onClick={() => setZoomPhoto(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-red-600 text-white transition-colors cursor-pointer"
                title="बंद करें (Close)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full flex-1 max-h-[70vh] flex items-center justify-center p-2 bg-black">
              <img
                src={zoomPhoto.url}
                alt={zoomPhoto.title || 'सेवा फ़ोटो'}
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
    </div>
  );
};

export default CampaignGallerySlider;
