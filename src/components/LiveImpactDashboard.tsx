import React from 'react';
import { Users, BookOpen, Utensils, Activity, MapPin, Award } from 'lucide-react';
import { IMPACT_METRICS } from '../data/foundationData';
import { useLanguage } from '../context/LanguageContext';

export const LiveImpactDashboard: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 bg-gradient-to-r from-[#8B0000] to-amber-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-black/30 px-3 py-1 rounded-full">
            {t('impact.badge', 'REAL TIME IMPACT METRICS', 'REAL TIME IMPACT METRICS')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Cinzel',serif]">
            {t('impact.title', 'गाजीपुर में हमारे सेवा कार्यों का प्रत्यक्ष प्रभाव', 'Measurable Ground Impact Across Ghazipur')}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-2xl text-center">
            <BookOpen className="w-6 h-6 text-amber-300 mx-auto mb-2" />
            <div className="text-2xl sm:text-3xl font-black font-mono">{IMPACT_METRICS.childrenEducated}+</div>
            <div className="text-xs text-amber-100 font-bold mt-1">{t('impact.edu', 'शिक्षित बच्चे', 'Children Educated')}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-2xl text-center">
            <Utensils className="w-6 h-6 text-amber-300 mx-auto mb-2" />
            <div className="text-2xl sm:text-3xl font-black font-mono">{IMPACT_METRICS.mealsDistributed.toLocaleString('en-IN')}+</div>
            <div className="text-xs text-amber-100 font-bold mt-1">{t('impact.food', 'भोजन वितरण', 'Meals Distributed')}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-2xl text-center">
            <Activity className="w-6 h-6 text-amber-300 mx-auto mb-2" />
            <div className="text-2xl sm:text-3xl font-black font-mono">{IMPACT_METRICS.medicalCampsConducted}+</div>
            <div className="text-xs text-amber-100 font-bold mt-1">{t('impact.health', 'स्वास्थ्य शिविर', 'Medical Camps')}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-2xl text-center">
            <Users className="w-6 h-6 text-amber-300 mx-auto mb-2" />
            <div className="text-2xl sm:text-3xl font-black font-mono">{IMPACT_METRICS.activeVolunteers}+</div>
            <div className="text-xs text-amber-100 font-bold mt-1">{t('impact.vols', 'सक्रिय स्वयंसेवक', 'Active Volunteers')}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-2xl text-center">
            <MapPin className="w-6 h-6 text-amber-300 mx-auto mb-2" />
            <div className="text-2xl sm:text-3xl font-black font-mono">{IMPACT_METRICS.villagesCovered}</div>
            <div className="text-xs text-amber-100 font-bold mt-1">{t('impact.villages', 'ग्राम आच्छादित', 'Villages Covered')}</div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-2xl text-center">
            <Award className="w-6 h-6 text-amber-300 mx-auto mb-2" />
            <div className="text-2xl sm:text-3xl font-black font-mono">100%</div>
            <div className="text-xs text-amber-100 font-bold mt-1">{t('impact.verified', 'सत्यापित रिकॉर्ड', 'Verified Records')}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveImpactDashboard;
