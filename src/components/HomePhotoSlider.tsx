// ============================================================================
// JEEVAN JYOTI FOUNDATION - HOME PAGE MULTI-PHOTO DYNAMIC SLIDESHOW
// होम पेज मुख्य फ़ोटो गैलरी - स्वचालित क्रिस्टल-क्लियर स्लाइड शो
// ============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Maximize2,
  X,
  Sparkles,
  Image as ImageIcon,
  Heart,
  ShieldCheck,
  Eye,
  Camera,
  Layers
} from 'lucide-react';
import { useHomeContent } from '../context/HomeContentContext';
import { useLanguage } from '../context/LanguageContext';
import { SliderPhotoItem } from '../types';
import { DEFAULT_SLIDER_PHOTOS } from '../services/adminService';

interface HomePhotoSliderProps {
  onOpenAdmin?: () => void;
  className?: string;
  isCompact?: boolean;
}

export const HomePhotoSlider: React.FC<HomePhotoSliderProps> = ({
  onOpenAdmin,
  className = '',
  isCompact = false
}) => {
  const { content } = useHomeContent();
  const { t, isHindi } = useLanguage();

  // Get active slides
  const slides: SliderPhotoItem[] =
    content.sliderPhotos && content.sliderPhotos.length > 0
      ? content.sliderPhotos
      : DEFAULT_SLIDER_PHOTOS;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [zoomPhoto, setZoomPhoto] = useState<SliderPhotoItem | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const autoPlay = content.sliderAutoPlay !== false;
  const intervalSeconds = content.sliderInterval && content.sliderInterval >= 2 ? content.sliderInterval : 4;
  const intervalMs = intervalSeconds * 1000;

  // Safe slide navigation
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

  // Reset index if slides array shrunk
  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  // Automatic slide interval timer & smooth progress bar
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

  const currentSlide = slides[currentIndex] || slides[0];

  return (
    <section
      id="home-photo-slider"
      className={`relative w-full ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300 bg-slate-950 group">
        
        {/* Top Floating Badge Bar */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2 flex-wrap pointer-events-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B0000]/90 text-white text-[11px] font-black uppercase tracking-wider backdrop-blur-md shadow-md border border-red-400/40">
            <Camera className="w-3.5 h-3.5 text-amber-300" />
            <span>{t('slider.live_badge', 'सेवा गतिविधियां गैलरी', 'Seva Gallery')}</span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 text-amber-300 text-[10px] font-extrabold backdrop-blur-md border border-white/10">
            <Sparkles className="w-3 h-3" />
            <span>ग़ाज़ीपुर जमीनी कार्य</span>
          </div>
        </div>

        {/* Top Right Counter & Controls */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1.5 pointer-events-auto">
          {/* Slide Counter */}
          <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono font-extrabold border border-white/20 flex items-center gap-1">
            <span className="text-amber-400">{String(currentIndex + 1).padStart(2, '0')}</span>
            <span className="text-white/40">/</span>
            <span>{String(slides.length).padStart(2, '0')}</span>
          </div>

          {/* Pause / Play Button */}
          {slides.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused((p) => !p);
              }}
              className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-amber-300 hover:text-white backdrop-blur-md border border-white/20 transition cursor-pointer"
              title={isPaused ? 'स्लाइड शो चलाएं (Play)' : 'स्लाइड शो रोकें (Pause)'}
              aria-label="Toggle Auto Slide"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-amber-300" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          )}

          {/* Zoom Fullscreen Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoomPhoto(currentSlide);
            }}
            className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white hover:text-amber-300 backdrop-blur-md border border-white/20 transition cursor-pointer"
            title="फ़ोटो बड़ा करके देखें (Full Size View)"
            aria-label="Zoom Photo"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Image Viewport Area */}
        <div
          className={`relative w-full overflow-hidden bg-slate-900 cursor-pointer ${
            isCompact ? 'h-64 sm:h-80 md:h-96' : 'h-72 sm:h-96 md:h-[440px] lg:h-[500px]'
          }`}
          onClick={() => setZoomPhoto(currentSlide)}
        >
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={slide.id || `slide-${idx}`}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-10 scale-100 pointer-events-auto' : 'opacity-0 z-0 scale-105 pointer-events-none'
                }`}
              >
                <img
                  src={slide.url}
                  alt={slide.title || 'जीवन ज्योति फाउंडेशन गाजीपुर'}
                  className="w-full h-full object-cover object-center transform transition-transform duration-7000 ease-linear scale-100 group-hover:scale-105"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />

                {/* Ambient Bottom Gradient for Title Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Left & Right Slide Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-[#8B0000] text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg opacity-80 group-hover:opacity-100 transition-all cursor-pointer transform hover:scale-110"
              title="पिछली फ़ोटो (Previous)"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-[#8B0000] text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg opacity-80 group-hover:opacity-100 transition-all cursor-pointer transform hover:scale-110"
              title="अगली फ़ोटो (Next)"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Bottom Overlay Info & Caption Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-6 text-white pointer-events-none">
          <div className="max-w-3xl space-y-1 sm:space-y-1.5">
            {currentSlide.title && (
              <h3 className="text-base sm:text-xl md:text-2xl font-black text-amber-300 drop-shadow-md font-['Cinzel',serif] leading-tight">
                {currentSlide.title}
              </h3>
            )}
            {currentSlide.description && (
              <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 drop-shadow-sm font-medium">
                {currentSlide.description}
              </p>
            )}
          </div>

          {/* Bottom Dot Indicators & Progress Bar */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-white/15 pointer-events-auto">
            {/* Dots */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {slides.map((_, idx) => (
                <button
                  key={`dot-${idx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(idx);
                  }}
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-6 sm:w-8 bg-amber-400 shadow-md'
                      : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/80'
                  }`}
                  title={`स्लाइड ${idx + 1} पर जाएं`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Quick Link to Admin */}
            {onOpenAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenAdmin();
                }}
                className="text-[10px] sm:text-xs text-amber-300 hover:text-white font-bold underline transition-colors cursor-pointer"
                title="फ़ोटो गैलरी बदलें"
              >
                + नई फ़ोटो जोड़ें (एडमिन)
              </button>
            )}
          </div>
        </div>

        {/* Active Timer Progress Line */}
        {autoPlay && !isPaused && slides.length > 1 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-30 overflow-hidden pointer-events-none">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Fullscreen Photo Zoom Modal */}
      {zoomPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setZoomPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-slate-950 rounded-3xl overflow-hidden border-2 border-amber-400 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-[#8B0000] to-[#500000] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-300" />
                <div>
                  <h4 className="text-sm font-black text-amber-200">
                    {zoomPhoto.title || 'जीवन ज्योति फाउंडेशन - सेवा गतिविधि'}
                  </h4>
                  <p className="text-[11px] text-red-200">ग़ाज़ीपुर (उत्तर प्रदेश, भारत)</p>
                </div>
              </div>
              <button
                onClick={() => setZoomPhoto(null)}
                className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative max-h-[75vh] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={zoomPhoto.url}
                alt={zoomPhoto.title || 'जीवन ज्योति फाउंडेशन'}
                className="max-h-[75vh] w-auto object-contain select-none"
              />
            </div>

            {/* Modal Caption */}
            {zoomPhoto.description && (
              <div className="p-4 bg-slate-900 text-gray-200 text-xs sm:text-sm border-t border-slate-800">
                <p className="font-medium leading-relaxed">{zoomPhoto.description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default HomePhotoSlider;
