import React from 'react';
import { Quote, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const VOLUNTEER_VOICES = [
  {
    id: 'voice-01',
    name: 'Pooja Pandey',
    roleHindi: 'सांध्यकालीन पाठशाला शिक्षिका स्वयंसेवक',
    roleEn: 'Evening School Teacher Volunteer',
    quoteHindi: 'मीरानपुर के बच्चों को पढ़ाते हुए जब उनके चेहरों पर सीखने की चमक देखती हूँ, तो लगता है कि जीवन का सच्चा अर्थ यही है। संस्था ने हमें सेवा का अद्भुत मंच दिया है।',
    quoteEn: 'Teaching children in Miranpur and watching the spark of curiosity in their eyes gives life its true meaning. Jeevan Jyoti Foundation provides a truly empowering platform.',
    area: 'Ghazipur Sadar',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'voice-02',
    name: 'Aakash Verma',
    roleHindi: 'चिकित्सा शिविर प्रमुख स्वयंसेवक',
    roleEn: 'Medical Camp Lead Volunteer',
    quoteHindi: 'बुजुर्गों को निशुल्क चश्मे और स्वास्थ्य जांच उपलब्ध कराना एक अत्यंत संतोषजनक अनुभव रहा है। शैलेश जी का मार्गदर्शन हमेशा प्रेरणा देता है।',
    quoteEn: 'Providing free eye checkups and healthcare for the elderly in remote villages brings immense satisfaction. The leadership continuously inspires us on ground.',
    area: 'Mohammadabad',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'voice-03',
    name: 'Rahul Yadav',
    roleHindi: 'अन्नपूर्णा सेवा स्वयंसेवक',
    roleEn: 'Annapurna Seva Volunteer',
    quoteHindi: 'कोरोना काल से लेकर अब तक हर रविवार अन्नपूर्णा भोजन वितरण में भाग लेना मेरी दिनचर्या का हिस्सा बन चुका है। हमें अपनी मिट्टी की सेवा पर गर्व है।',
    quoteEn: 'Serving fresh meals every Sunday as part of Annapurna Seva has become a core part of my life. Serving our home soil of Ghazipur is an honor.',
    area: 'Zamania',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80'
  }
];

export const VolunteerVoices: React.FC = () => {
  const { t, isHindi } = useLanguage();

  return (
    <section id="volunteer-voices" className="py-16 bg-amber-50/40 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-black uppercase tracking-wider mb-3">
            <Heart className="w-4 h-4 text-red-600 fill-red-600" />
            <span>{t('voices.badge', 'स्वयंसेवकों के अनुभव (Volunteer Testimonials)', 'Volunteer Testimonials & Experiences')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            {t('voices.title', 'धरातल पर सेवा करने वाले साथियों की जुबानी', 'Direct Voices from Our Field Volunteers')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {VOLUNTEER_VOICES.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col justify-between relative"
            >
              <div>
                <Quote className="w-8 h-8 text-orange-400 mb-4 opacity-70" />
                <p className="text-slate-700 text-sm sm:text-base italic leading-relaxed">
                  &quot;{isHindi ? item.quoteHindi : item.quoteEn}&quot;
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-orange-300"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                  <p className="text-xs text-orange-700 font-semibold">{isHindi ? item.roleHindi : item.roleEn}</p>
                  <p className="text-[11px] text-slate-400">{item.area}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VolunteerVoices;
