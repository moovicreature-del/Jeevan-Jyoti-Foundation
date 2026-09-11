import React, { useState } from 'react';
import { Calendar, MapPin, Users, ChevronLeft, ChevronRight, Sparkles, Heart } from 'lucide-react';
import { RECENT_EVENTS } from '../data/eventsData';
import { EventItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const RecentEventsCarousel: React.FC = () => {
  const { t, isHindi } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevEvent = () => {
    setCurrentIndex((prev) => (prev === 0 ? RECENT_EVENTS.length - 1 : prev - 1));
  };

  const nextEvent = () => {
    setCurrentIndex((prev) => (prev === RECENT_EVENTS.length - 1 ? 0 : prev + 1));
  };

  const current: EventItem = RECENT_EVENTS[currentIndex];

  return (
    <section id="events" className="py-16 bg-amber-50/40 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>{t('events.badge', 'गतिविधियां एवं ग्राउंड रिपोर्ट (Recent Field Events)', 'Recent Ground Events & Field Reports')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
              {t('events.title', 'हाल ही में आयोजित सेवा कार्यक्रम', 'Recently Conducted Seva Programs')}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevEvent}
              className="p-3 rounded-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-xs transition-colors cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextEvent}
              className="p-3 rounded-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-xs transition-colors cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Large Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 relative h-72 lg:h-[450px] overflow-hidden bg-slate-900">
            <img
              src={current.imageUrl}
              alt={current.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md">
              {current.category}
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  {current.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-600" />
                  {current.location}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif leading-tight">
                {isHindi ? current.titleHindi : current.title}
              </h3>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {isHindi ? current.descriptionHindi : current.description}
              </p>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-800 font-bold uppercase tracking-wider">{t('events.beneficiaries', 'लाभांवित संख्या', 'Beneficiaries Served')}</p>
                  <p className="text-2xl font-black text-slate-900 font-mono mt-0.5">{current.beneficiariesCount}+ {t('events.citizens', 'नागरिक', 'Citizens')}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-orange-100 text-orange-700">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">
                Event {currentIndex + 1} of {RECENT_EVENTS.length}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-black text-orange-700">
                <Heart className="w-4 h-4 fill-orange-600 text-orange-600" />
                <span>धरातलीय जनसेवा</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentEventsCarousel;
