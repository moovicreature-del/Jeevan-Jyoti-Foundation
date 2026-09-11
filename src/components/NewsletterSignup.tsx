// ============================================================================
// JEEVAN JYOTI FOUNDATION - NEWSLETTER SIGNUP COMPONENT
// मासिक एनजीओ प्रभाव समाचार पत्रिका सदस्यता (Monthly NGO Impact Updates)
// ============================================================================

import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { subscribeToNewsletter, isValidEmail } from '../services/newsletterService';

interface NewsletterSignupProps {
  className?: string;
  variant?: 'footer' | 'standalone';
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  className = '',
  variant = 'footer'
}) => {
  const { isHindi } = useLanguage();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'alreadySubscribed' | null;
    text: string;
  }>({ type: null, text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setStatusMessage({
        type: 'error',
        text: isHindi ? 'कृपया अपना ईमेल पता दर्ज करें।' : 'Please enter your email address.'
      });
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setStatusMessage({
        type: 'error',
        text: isHindi
          ? 'कृपया एक वैध ईमेल पता दर्ज करें (उदा. yourname@example.com)।'
          : 'Please enter a valid email address (e.g. yourname@example.com).'
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ type: null, text: '' });

    try {
      const res = await subscribeToNewsletter(cleanEmail, isHindi ? 'hi' : 'en');
      if (res.success) {
        if (res.alreadySubscribed) {
          setStatusMessage({
            type: 'alreadySubscribed',
            text: res.message
          });
        } else {
          setStatusMessage({
            type: 'success',
            text: res.message
          });
          setEmail('');
        }
      } else {
        setStatusMessage({
          type: 'error',
          text: res.message
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: isHindi
          ? 'सदस्यता लेते समय त्रुटि हुई। कृपया पुनः प्रयास करें।'
          : 'An error occurred while subscribing. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="newsletter-signup-section"
      className={`rounded-2xl sm:rounded-3xl border transition-all duration-300 ${
        variant === 'footer'
          ? 'bg-gradient-to-br from-stone-900 via-neutral-900 to-amber-950/30 border-amber-900/40 p-6 sm:p-8 md:p-10 shadow-xl'
          : 'bg-white dark:bg-stone-900 border-slate-200 dark:border-stone-800 p-6 sm:p-8 shadow-md'
      } ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        
        {/* Left Column: Heading & Description */}
        <div className="lg:col-span-7 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isHindi
                ? 'मासिक प्रभाव पत्रिका • Monthly Impact Bulletin'
                : 'Monthly NGO Impact Newsletter'}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            {isHindi ? (
              <>
                गाजीपुर में जमीनी सेवा व बदलाव के{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                  मासिक अपडेट्स
                </span>{' '}
                सीधे अपने इनबॉक्स में पाएं
              </>
            ) : (
              <>
                Get Verified{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                  Monthly Impact Updates
                </span>{' '}
                Delivered to Your Inbox
              </>
            )}
          </h3>

          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
            {isHindi
              ? 'बाल शिक्षा, निःशुल्क स्वास्थ्य शिविर, अन्नपूर्णा भोजन वितरण, और महिला सशक्तिकरण की सत्यापित मासिक रिपोर्ट, फोटो-डॉक्यूमेंट्री और सेवा गाथाएं प्राप्त करें।'
              : 'Receive verified monthly reports on our free child education centers, medical relief camps, food distribution drives, and women self-reliance programs in Ghazipur.'}
          </p>

          {/* Value Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-gray-300">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-stone-800/80 border border-stone-700/60">
              <HeartHandshake className="w-3 h-3 text-rose-400" />
              <span>{isHindi ? 'निःशुल्क सेवा रिपोर्ट' : 'Free Impact Reports'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-stone-800/80 border border-stone-700/60">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>{isHindi ? '100% स्पैम मुक्त' : 'Zero Spam Guarantee'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-stone-800/80 border border-stone-700/60">
              <Mail className="w-3 h-3 text-amber-400" />
              <span>{isHindi ? 'महीने में 1 बार' : 'Once a Month'}</span>
            </span>
          </div>
        </div>

        {/* Right Column: Interactive Subscription Form */}
        <div className="lg:col-span-5">
          <form onSubmit={handleSubmit} className="space-y-3" id="newsletter-subscription-form">
            <div className="relative flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4 text-amber-400" />
                </div>
                <input
                  id="newsletter-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (statusMessage.type) setStatusMessage({ type: null, text: '' });
                  }}
                  placeholder={isHindi ? 'अपना ईमेल पता दर्ज करें...' : 'Enter your email address...'}
                  disabled={isLoading}
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-stone-950/80 border border-amber-500/30 rounded-xl text-white placeholder-gray-400 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all disabled:opacity-50 shadow-inner"
                />
              </div>

              <button
                id="newsletter-subscribe-button"
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-400 hover:via-amber-500 hover:to-yellow-400 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 active:scale-95 hover:scale-[1.02] transition-all duration-150 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-stone-950" />
                    <span>{isHindi ? 'प्रतीक्षा करें...' : 'Subscribing...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isHindi ? 'सदस्यता लें' : 'Subscribe'}</span>
                    <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                  </>
                )}
              </button>
            </div>

            {/* Status Message Feedback */}
            {statusMessage.type && (
              <div
                id="newsletter-status-message"
                className={`flex items-start gap-2 p-3 rounded-xl text-xs leading-relaxed animate-in fade-in duration-200 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-950/70 border border-emerald-600/50 text-emerald-300'
                    : statusMessage.type === 'alreadySubscribed'
                    ? 'bg-blue-950/70 border border-blue-600/50 text-blue-300'
                    : 'bg-rose-950/70 border border-rose-600/50 text-rose-300'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : statusMessage.type === 'alreadySubscribed' ? (
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            {/* Privacy Assurance Note */}
            <p className="text-[11px] text-gray-400 flex items-center gap-1.5 pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
              <span>
                {isHindi
                  ? 'आपकी निजता हमारे लिए सर्वोपरि है। हम कभी स्पैम नहीं भेजते। आप किसी भी समय अनसब्सक्राइब कर सकते हैं।'
                  : 'Your privacy is respected. No spam ever. You can unsubscribe at any time with one click.'}
              </span>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

export default NewsletterSignup;
