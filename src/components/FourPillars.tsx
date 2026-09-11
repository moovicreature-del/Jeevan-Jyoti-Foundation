import React from 'react';
import { BookOpen, Utensils, Activity, Home, Sparkles, Compass } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useHomeContent } from '../context/HomeContentContext';

export const FourPillars: React.FC = () => {
  const { t } = useLanguage();
  const { content } = useHomeContent();

  const pillars = [
    {
      icon: BookOpen,
      color: 'from-amber-500 to-amber-700',
      title: t('pillars.p1_title', 'शिक्षा सेवा (Education Support)', 'Education Support (Free Schools)'),
      desc: t('pillars.p1_desc',
        'ग्रामीण व मलिन बस्तियों के निर्धन बच्चों हेतु निःशुल्क संध्याकालीन पाठशाला, स्कूल बैग, कॉपियां, पुस्तकें एवं डिजिटल कंप्यूटर साक्षरता।',
        'Free evening learning centers for slum and rural children, school bags, notebooks, study materials, and digital literacy classes.'
      )
    },
    {
      icon: Utensils,
      color: 'from-red-500 to-red-700',
      title: t('pillars.p2_title', 'अन्नपूर्णा भोजन सेवा (Food Distribution)', 'Annapurna Food Distribution'),
      desc: t('pillars.p2_desc',
        'भूखे व असहायजनों के लिए नियमित ताज़ा पौष्टिक भोजन, आपदा राहत राशन किट एवं त्योहारों पर विशेष मिष्ठान्न व आहार वितरण।',
        'Fresh nutritious meals for the hungry, emergency disaster relief ration kits, and festival festive meal drives.'
      )
    },
    {
      icon: Activity,
      color: 'from-emerald-500 to-emerald-700',
      title: t('pillars.p3_title', 'स्वास्थ्य रक्षा (Healthcare Camps)', 'Healthcare & Medical Camps'),
      desc: t('pillars.p3_desc',
        'विशेषज्ञ चिकित्सकों द्वारा निःशुल्क नेत्र जांच, सामान्य स्वास्थ्य परामर्श, रक्तचाप/शुगर जांच एवं आवश्यक दवाइयों का निःशुल्क वितरण।',
        'Free eye checkups by specialist doctors, health consultations, diabetes/BP screening, and free distribution of prescribed medicines.'
      )
    },
    {
      icon: Home,
      color: 'from-blue-500 to-blue-700',
      title: t('pillars.p4_title', 'अनाथ व वृद्ध सेवा (Orphan & Elderly Care)', 'Orphan & Elderly Care'),
      desc: t('pillars.p4_desc',
        'निराश्रित अनाथ बच्चों के पालन-पोषण में सहयोग, शीत ऋतु में वृद्धजनों को कंबल वितरण एवं सामाजिक पुनर्वास सहायता।',
        'Nurturing destitute children, winter blanket distribution for senior citizens, and comprehensive social rehabilitation support.'
      )
    }
  ];

  return (
    <section id="pillars" className="py-16 bg-white border-t border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('pillars.badge', 'संस्था के मुख्य चार स्तंभ', 'Four Core Pillars of Foundation')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-['Cinzel',serif]">
            {t('pillars.title', 'हमारी निरंतर सेवा धारा', 'Our Continuous Streams of Service')}
          </h2>
          <p className="text-sm text-gray-600 mt-2 font-medium">
            {t('pillars.sub',
              'जीवन ज्योति फाउंडेशन गाजीपुर (उत्तर प्रदेश, भारत) समाज के अंतिम पायदान पर खड़े व्यक्ति तक सहायता पहुंचाने के लिए समर्पित है।',
              'Jeevan Jyoti Foundation Ghazipur (Uttar Pradesh, India) is committed to uplifting every underprivileged individual across rural communities.'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="bg-amber-50/40 border-2 border-amber-200/80 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${p.color} text-white flex items-center justify-center shadow-md mb-4 group-hover:scale-110 transition-transform`}>
                <p.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">
                {p.title}
              </h3>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Dynamic Mission & Vision Statement Card */}
        {content.missionText && (
          <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-amber-400">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold shrink-0 shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-black text-amber-300 uppercase tracking-widest block">
                  हमारा मिशन एवं संकल्प (Our Core Mission)
                </span>
                <p className="text-xs sm:text-sm text-blue-50 leading-relaxed font-medium">
                  {content.missionText}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FourPillars;
