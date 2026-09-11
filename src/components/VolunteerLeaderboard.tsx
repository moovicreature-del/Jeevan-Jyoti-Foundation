import React from 'react';
import { Award, Trophy, UserCheck } from 'lucide-react';
import { LEADERBOARD_DATA } from '../data/leaderboardData';
import { useLanguage } from '../context/LanguageContext';

interface LeaderboardProps {
  onOpenIdCard?: () => void;
  onOpenVolunteerCert?: () => void;
}

export const VolunteerLeaderboard: React.FC<LeaderboardProps> = ({ onOpenIdCard, onOpenVolunteerCert }) => {
  const { t, isHindi } = useLanguage();

  return (
    <section id="leaderboard" className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-3">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>{t('lead.badge', 'कर्मठ स्वयंसेवक लीडरबोर्ड (Top Seva Leaderboard)', 'Top Seva Leaderboard')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            {t('lead.title', 'समाज सेवा में अग्रणी हमारे निष्ठावान स्वयंसेवक', 'Leading Dedicated Volunteers in Social Service')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            {t('lead.sub',
              'अथक परिश्रम, सांध्यकालीन पाठशाला अध्यापन एवं स्वास्थ्य राहत कार्यों में सर्वोच्च योगदान देने वाले युवा साथी।',
              'Honoring outstanding youth leaders for their untiring teaching, medical relief, and community support.'
            )}
          </p>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {LEADERBOARD_DATA.slice(0, 3).map((item, index) => {
            const isFirst = index === 0;
            return (
              <div
                key={item.id}
                className={`relative rounded-3xl p-6 text-center border-2 transition-all ${
                  isFirst
                    ? 'border-yellow-400 bg-gradient-to-b from-yellow-50/70 via-white to-amber-50 shadow-xl md:-translate-y-3'
                    : 'border-slate-200 bg-white shadow-md'
                }`}
              >
                {isFirst && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-950 px-4 py-0.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 fill-yellow-950" />
                    <span>Rank #1 Champion</span>
                  </div>
                )}

                <div className="relative inline-block mx-auto mb-4">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md mx-auto"
                  />
                  <div
                    className={`absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center font-black text-xs text-white shadow-sm ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-slate-400' : 'bg-amber-700'
                    }`}
                  >
                    #{item.rank}
                  </div>
                </div>

                <h4 className="text-lg font-black text-slate-900">{item.name}</h4>
                <p className="text-xs font-semibold text-slate-500">{isHindi ? item.nameHindi : item.name} • {item.area}</p>

                <div className="mt-2 mb-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                    {item.badge}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <p className="text-slate-500 font-medium">{t('lead.hours_label', 'सेवा घंटे', 'Seva Hours')}</p>
                    <p className="text-base font-black text-slate-900 mt-0.5">{item.hours} hrs</p>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl">
                    <p className="text-slate-500 font-medium">{t('lead.tasks_label', 'पूर्ण कार्य', 'Missions')}</p>
                    <p className="text-base font-black text-slate-900 mt-0.5">{item.tasks} tasks</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action button */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {onOpenIdCard && (
            <button
              onClick={onOpenIdCard}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>{t('lead.btn_id', 'अपना स्वयंसेवक कार्ड जनरेट करें (Get Volunteer ID)', 'Generate Your Volunteer ID Card')}</span>
            </button>
          )}
          {onOpenVolunteerCert && (
            <button
              onClick={onOpenVolunteerCert}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm shadow-xs transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-orange-600" />
              <span>{t('lead.btn_cert', 'प्रमाण पत्र प्राप्त करें', 'Get Appreciation Certificate')}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default VolunteerLeaderboard;
