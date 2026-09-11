import React, { useState } from 'react';
import { Play, Film, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useHomeContent } from '../context/HomeContentContext';

export const VideoShowcase: React.FC = () => {
  const { t } = useLanguage();
  const { content } = useHomeContent();
  const [isPlaying, setIsPlaying] = useState(false);

  const videoUrl = content.bannerVideoUrl || 'https://www.youtube.com/watch?v=0kF5s7J_C3A';
  const coverImage = content.bannerImageUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80';
  const docTitle = content.bannerTitle || '"उम्मीद की एक किरण" - जीवन ज्योति डॉक्यूमेंट्री';
  const docSubtitle = content.bannerSubtitle || 'ग़ाज़ीपुर जनपद के सुदूर गांवों में संचालित सांध्यकालीन पाठशाला और स्वास्थ्य रक्षा अभियान की सच्ची कहानी।';

  return (
    <section id="video-showcase" className="py-16 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-400/30">
            <Film className="w-4 h-4 text-amber-400" />
            <span>{t('video.badge', 'ग्राउंड डाक्यूमेंट्री एवं सेवा झलक (Ground Impact Film)', 'Ground Documentary & Seva Highlights')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-serif">
            {t('video.title', 'ग़ाज़ीपुर के ग्रामीण अंचलों में जीवन ज्योति का कार्य', 'Ground Realities & Impact in Rural Ghazipur')}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2">
            {t('video.sub',
              'देखें कि कैसे आपके छोटे से सहयोग और हमारे कर्मठ स्वयंसेवकों के समर्पण से सैकड़ों परिवारों के चेहरों पर मुस्कान आई।',
              'Witness how your generous support and our dedicated volunteers bring bright smiles and transformation to hundreds of families.'
            )}
          </p>
        </div>

        {/* Video Frame */}
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border-2 border-amber-400/40 shadow-2xl bg-black relative aspect-video flex items-center justify-center group">
          {isPlaying ? (
            videoUrl.includes('youtube.com') ? (
              <iframe
                src={`${videoUrl.replace('watch?v=', 'embed/')}?autoplay=1`}
                title="Jeevan Jyoti Documentary"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <>
              <img
                src={coverImage}
                alt="Jeevan Jyoti Documentary Cover"
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Center Play Badge */}
              <div className="relative z-10 text-center p-6">
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="w-20 h-20 rounded-full bg-blue-800/90 hover:bg-amber-500 text-white hover:text-blue-950 flex items-center justify-center mx-auto mb-4 shadow-xl border-4 border-amber-400/40 group-hover:scale-110 transition-transform cursor-pointer"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
                <h3 className="text-xl sm:text-2xl font-black text-white drop-shadow-md">
                  {docTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg mx-auto font-medium">
                  {docSubtitle}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;

