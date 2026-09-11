import React from 'react';
import { IMPACT_STORIES } from '../data/taskData';
import { Sparkles, Calendar, Users, Heart } from 'lucide-react';
import { EventStory } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const ImpactStories: React.FC = () => {
  const { t, isHindi } = useLanguage();

  return (
    <section id="stories" className="py-16 bg-white border-t border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('stories.badge', 'धरातलीय सेवा की झलकियां', 'Field Seva Highlights')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-['Cinzel',serif]">
            {t('stories.title', 'सफलता एवं सेवा गाथाएं', 'Impact & Success Stories')}
          </h2>
          <p className="text-sm text-gray-600 mt-2 font-medium">
            {t('stories.sub',
              'गाजीपुर के विभिन्न ग्रामों एवं मजरों में जीवन ज्योति फाउंडेशन द्वारा संचालित वास्तविक जनहित कार्यक्रम।',
              'Verified community initiatives conducted by Jeevan Jyoti Foundation across various villages in Ghazipur.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {IMPACT_STORIES.map((story: EventStory) => (
            <div
              key={story.id}
              className="bg-[#FFFAF0] border-2 border-amber-200 rounded-3xl p-6 shadow-xs hover:shadow-lg transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-black uppercase tracking-wider bg-amber-200/80 text-amber-950 px-2.5 py-0.5 rounded-full">
                    {story.badgeText}
                  </span>
                  <span className="text-xs text-gray-500 font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {story.date}
                  </span>
                </div>

                <h3 className="text-lg font-black text-gray-900 mb-2 leading-snug">
                  {isHindi ? story.titleHindi : story.title}
                </h3>
                <p className="text-xs text-gray-700 leading-relaxed mb-4 font-medium">
                  {story.description}
                </p>
              </div>

              <div className="pt-4 border-t border-amber-200 flex items-center justify-between text-xs font-bold text-amber-900">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-700" />
                  <span>{t('stories.beneficiaries', 'लाभार्थी', 'Beneficiaries')}: {story.beneficiariesCount}+ {t('events.citizens', 'ग्रामीण', 'Citizens')}</span>
                </span>
                <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                  {t('stories.verified', 'सत्यापित', 'Verified')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStories;
