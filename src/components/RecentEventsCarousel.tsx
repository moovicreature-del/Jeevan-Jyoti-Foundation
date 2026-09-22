// ============================================================================
// JEEVAN JYOTI FOUNDATION - RECENT SEVA EVENTS SLIDESHOW CAROUSEL
// सेक्शन ३: हाल ही में आयोजित सेवा कार्यक्रम (स्वचालित व गतिशील स्लाइडर - अधिकतम १५ फ़ोटो)
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Heart,
  Maximize2,
  X,
  Play,
  Pause,
  Layers,
  Camera
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useHomeContent } from '../context/HomeContentContext';
import { SliderPhotoItem } from '../types';
import { DEFAULT_RECENT_EVENTS_PHOTOS } from '../services/adminService';

interface RecentEventsCarouselProps {
  onOpenAdmin?: () => void;
}

export const RecentEventsCarousel: React.FC<RecentEventsCarouselProps> = ({ onOpenAdmin }) => {
  const { t, isHindi } = useLanguage();
  const { content } = useHomeContent();

  // Active event slides (up to 15 photos from Admin)
  const slides: SliderPhotoItem[] =
    content.recentEventsPhotos && content.recentEventsPhotos.length > 0
      ? content.recentEventsPhotos
      : DEFAULT_RECENT_EVENTS_PHOTOS;

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [zoomPhoto, setZoomPhoto] = useState<SliderPhotoItem | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const autoPlay = content.sliderAutoPlay !== false;
  const intervalSeconds = content.sliderInterval && content.sliderInterval >= 2 ? content.sliderInterval : 5;
  const intervalMs = intervalSeconds * 1000;

  const nextEvent = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const prevEvent = useCallback(() => {
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

  // Autoplay timer
  useEffect(() => {
    if (!autoPlay || isPaused || slides.length <= 1) return;

    const stepMs = 50;
    const progressStep = (stepMs / intervalMs) * 100;

    const timer = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          nextEvent();
          return 0;
        }
        return old + progressStep;
      });
    }, stepMs);

    return () => clearInterval(timer);
  }, [autoPlay, isPaused, intervalMs, nextEvent, slides.length]);

  if (!slides || slides.length === 0) return null;

  const current: SliderPhotoItem = slides[currentIndex] || slides[0];

  return (
    <section id="events" className="py-16 bg-amber-50/50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>{t('events.badge', 'गतिविधियां एवं ग्राउंड रिपोर्ट (Recent Field Events)', 'Recent Ground Events & Field Reports')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
              {t('events.title', 'हाल ही में आयोजित सेवा कार्यक्रम', 'Recently Conducted Seva Programs')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              ग़ाज़ीपुर के विभिन्न क्षेत्रों में आयोजित जनसेवा अभियानों की लाइव फ़ोटो स्लाइड
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            {slides.length > 1 && (
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-3 rounded-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-xs transition-colors cursor-pointer"
                title={isPaused ? 'स्लाइड शो चलाएं' : 'स्लाइड शो रोकें'}
                aria-label="Play/Pause"
              >
                {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
              </button>
            )}

            <button
              onClick={prevEvent}
              className="p-3 rounded-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-xs transition-colors cursor-pointer"
              title="पिछला कार्यक्रम"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextEvent}
              className="p-3 rounded-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-xs transition-colors cursor-pointer"
              title="अगला कार्यक्रम"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="ml-2 text-xs font-bold text-[#8B0000] hover:text-[#5a0000] bg-orange-100 hover:bg-orange-200 px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                title="एडमिन से सेवा कार्यक्रम फ़ोटो बदलें (15 फ़ोटो तक)"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">एडमिन फ़ोटो</span>
                <span>({slides.length}/15)</span>
              </button>
            )}
          </div>
        </div>

        {/* Featured Large Slide Card */}
        <div
          className="relative bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Top Progress Line */}
          {autoPlay && slides.length > 1 && (
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/10 z-30 overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Left Photo Showcase (7 Columns) */}
          <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-[480px] overflow-hidden bg-slate-900 group">
            <img
              src={current.url}
              alt={current.title || 'सेवा कार्यक्रम'}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80';
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Category Badge */}
            <div className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{current.category || 'सेवा कार्यक्रम'}</span>
            </div>

            {/* Slide Index Badge */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-amber-300 text-xs font-mono font-bold px-3 py-1.5 rounded-full border border-amber-400/30 flex items-center gap-1">
              <Camera className="w-3.5 h-3.5" />
              <span>स्लाइड {currentIndex + 1} / {slides.length}</span>
            </div>

            {/* Zoom Button */}
            <button
              onClick={() => setZoomPhoto(current)}
              className="absolute bottom-4 right-4 p-2.5 rounded-full bg-black/60 hover:bg-orange-600 text-white backdrop-blur-md border border-white/20 transition cursor-pointer shadow-md"
              title="फ़ोटो बड़ा करके देखें"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Right Information Details (5 Columns) */}
          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-white">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                {current.date && (
                  <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-orange-600" />
                    {current.date}
                  </span>
                )}
                {current.location && (
                  <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-orange-600" />
                    {current.location}
                  </span>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif leading-tight">
                {current.title || `सेवा कार्यक्रम ${currentIndex + 1}`}
              </h3>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {current.description || 'जीवन ज्योति फाउंडेशन द्वारा ग़ाज़ीपुर के जरूरतमंद परिवारों एवं नागरिकों के कल्याण हेतु आयोजित कार्यक्रम।'}
              </p>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-800 font-bold uppercase tracking-wider">
                    {t('events.beneficiaries', 'लाभांवित संख्या', 'Beneficiaries Served')}
                  </p>
                  <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                    350+ {t('events.citizens', 'नागरिक', 'Citizens')}
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-orange-100 text-orange-700">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Bottom Slide Indicators */}
            <div className="pt-6 mt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 font-mono">
                  कार्यक्रम फ़ोटो {currentIndex + 1} of {slides.length}
                </span>
                <div className="flex items-center gap-1.5 text-xs font-black text-orange-700">
                  <Heart className="w-4 h-4 fill-orange-600 text-orange-600" />
                  <span>धरातलीय जनसेवा</span>
                </div>
              </div>

              {/* Dot Indicators */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id || idx}
                    onClick={() => goToSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex
                        ? 'w-7 bg-orange-600'
                        : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    title={slide.title || `स्लाइड ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      {zoomPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setZoomPhoto(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center bg-slate-950 rounded-2xl overflow-hidden border border-orange-400/40 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-orange-600 text-white font-black text-xs">
                  {zoomPhoto.category || 'सेवा कार्यक्रम'}
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
                alt={zoomPhoto.title || 'कार्यक्रम फ़ोटो'}
                className="max-w-full max-h-[68vh] object-contain rounded-lg"
              />
            </div>

            {zoomPhoto.description && (
              <div className="w-full p-4 bg-slate-900 border-t border-slate-800 text-slate-300 text-xs sm:text-sm">
                <p>{zoomPhoto.description}</p>
                {zoomPhoto.location && (
                  <p className="mt-1 text-orange-400 text-xs font-semibold">📍 {zoomPhoto.location}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default RecentEventsCarousel;
