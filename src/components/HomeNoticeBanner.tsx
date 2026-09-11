// ============================================================================
// JEEVAN JYOTI FOUNDATION - DYNAMIC COMMUNITY NOTICE BOARD TOP BANNER
// होम पेज शीर्ष सक्रिय समुदाय सूचना पट्ट - स्मूथ मार्की स्क्रॉल इफ़ेक्ट युक्त
// ============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Megaphone,
  ChevronRight,
  ChevronLeft,
  Pause,
  Play,
  X,
  Sparkles,
  Calendar,
  AlertCircle,
  Radio,
  ExternalLink,
  Layers,
  Info
} from 'lucide-react';
import { useHomeContent } from '../context/HomeContentContext';
import { NoticeItem } from '../types';

interface HomeNoticeBannerProps {
  onOpenAdmin?: () => void;
}

export const HomeNoticeBanner: React.FC<HomeNoticeBannerProps> = ({ onOpenAdmin }) => {
  const { activeNotices } = useHomeContent();
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [selectedNoticeIndex, setSelectedNoticeIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [viewAllStream, setViewAllStream] = useState<boolean>(false);
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
  const [modalNotice, setModalNotice] = useState<NoticeItem | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const singleContentRef = useRef<HTMLDivElement>(null);

  // Measure if content exceeds container width
  const checkOverflow = useCallback(() => {
    if (!containerRef.current || !singleContentRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const contentWidth = singleContentRef.current.scrollWidth;
    // If content exceeds container or stream mode is active, enable marquee scroll
    setIsOverflowing(contentWidth > containerWidth - 20);
  }, []);

  useEffect(() => {
    checkOverflow();
    const handleResize = () => {
      checkOverflow();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkOverflow, selectedNoticeIndex, activeNotices, viewAllStream]);

  // Also check overflow on initial mount and when notice changes
  useEffect(() => {
    const timer = setTimeout(() => {
      checkOverflow();
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedNoticeIndex, activeNotices, viewAllStream, checkOverflow]);

  if (dismissed || activeNotices.length === 0) return null;

  const currentNotice = activeNotices[selectedNoticeIndex] || activeNotices[0];

  // Dynamic animation duration based on text length (comfortable reading speed ~ 12-18 chars/sec)
  const currentTextLength = viewAllStream
    ? activeNotices.reduce((acc, n) => acc + (n.title?.length || 0) + (n.message?.length || 0), 0)
    : (currentNotice.title?.length || 0) + (currentNotice.message?.length || 0);

  const marqueeDuration = Math.max(18, Math.min(60, Math.round(currentTextLength / 6)));

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider shadow-xs animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-300"></span>
            अति आवश्यक
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-blue-950 text-[10px] font-black uppercase tracking-wider shadow-xs">
            <Sparkles className="w-2.5 h-2.5 text-blue-950" />
            महत्वपूर्ण
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold tracking-wider">
            <Radio className="w-2.5 h-2.5 text-white" />
            सूचना
          </span>
        );
    }
  };

  const handleNextNotice = () => {
    setSelectedNoticeIndex((prev) => (prev + 1) % activeNotices.length);
  };

  const handlePrevNotice = () => {
    setSelectedNoticeIndex((prev) => (prev - 1 + activeNotices.length) % activeNotices.length);
  };

  return (
    <>
      <div
        id="home-community-notice-banner"
        className="bg-gradient-to-r from-[#001082] via-[#0015A8] to-[#000c60] text-white border-b-2 border-amber-400 py-1.5 px-3 sm:px-4 shadow-md relative z-40 select-none group transition-all"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
          {/* Notice Live Badge / Category Pill */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400 text-[#001082] text-[11px] font-black shadow-xs tracking-wider">
              <Megaphone className="w-3.5 h-3.5 text-[#001082] animate-bounce" />
              <span className="hidden sm:inline">जनसूचना</span>
              <span className="text-[10px] bg-blue-950 text-amber-300 px-1.5 py-0.2 rounded-full font-extrabold">
                {viewAllStream ? `कुल ${activeNotices.length}` : `${selectedNoticeIndex + 1}/${activeNotices.length}`}
              </span>
            </div>

            {/* Priority Indicator */}
            <div className="hidden lg:inline-block">
              {!viewAllStream && getPriorityBadge(currentNotice.priority)}
            </div>
          </div>

          {/* Marquee & Content Viewport Area */}
          <div
            ref={containerRef}
            className="flex-1 overflow-hidden relative min-w-0 h-6 flex items-center cursor-pointer"
            onClick={() => !viewAllStream && setModalNotice(currentNotice)}
            title="विस्तृत विवरण देखने के लिए क्लिक करें / Hover to pause"
          >
            {/* Left Edge Smooth Gradient Fade Mask */}
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#001082] to-transparent z-10 pointer-events-none" />

            {/* Right Edge Smooth Gradient Fade Mask */}
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#000c60] to-transparent z-10 pointer-events-none" />

            {/* Mode 1: All Active Notices Continuous Stream */}
            {viewAllStream ? (
              <div
                className="animate-marquee-smooth flex items-center whitespace-nowrap gap-8 text-xs py-0.5"
                data-paused={isPaused}
                style={{ '--marquee-duration': `${marqueeDuration}s` } as React.CSSProperties}
              >
                {/* First Pass */}
                <div className="flex items-center gap-8 shrink-0">
                  {activeNotices.map((n, idx) => (
                    <div
                      key={`stream-1-${n.id || idx}`}
                      className="flex items-center gap-2 hover:text-amber-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalNotice(n);
                      }}
                    >
                      <span className="text-amber-300 font-extrabold flex items-center gap-1">
                        <span>📢 {n.title}:</span>
                      </span>
                      <span className="text-blue-100 font-medium">{n.message}</span>
                      {n.date && (
                        <span className="text-[10px] text-amber-200/80 bg-white/10 px-1.5 py-0.2 rounded font-mono">
                          {n.date}
                        </span>
                      )}
                      <span className="text-amber-400 font-bold ml-2">✦</span>
                    </div>
                  ))}
                </div>

                {/* Second Pass for seamless infinite loop */}
                <div className="flex items-center gap-8 shrink-0" aria-hidden="true">
                  {activeNotices.map((n, idx) => (
                    <div
                      key={`stream-2-${n.id || idx}`}
                      className="flex items-center gap-2 hover:text-amber-200 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalNotice(n);
                      }}
                    >
                      <span className="text-amber-300 font-extrabold flex items-center gap-1">
                        <span>📢 {n.title}:</span>
                      </span>
                      <span className="text-blue-100 font-medium">{n.message}</span>
                      {n.date && (
                        <span className="text-[10px] text-amber-200/80 bg-white/10 px-1.5 py-0.2 rounded font-mono">
                          {n.date}
                        </span>
                      )}
                      <span className="text-amber-400 font-bold ml-2">✦</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : isOverflowing ? (
              /* Mode 2: Single Notice with Smooth Marquee Scroll When Overflows */
              <div
                className="animate-marquee-smooth flex items-center whitespace-nowrap gap-12 text-xs py-0.5"
                data-paused={isPaused}
                style={{ '--marquee-duration': `${marqueeDuration}s` } as React.CSSProperties}
              >
                {/* Pass 1 */}
                <div ref={singleContentRef} className="flex items-center gap-2 shrink-0">
                  <span className="font-extrabold text-amber-300">{currentNotice.title}:</span>
                  <span className="text-blue-100 font-medium">{currentNotice.message}</span>
                  {currentNotice.date && (
                    <span className="text-[10px] text-amber-200/80 bg-white/10 px-1.5 py-0.2 rounded font-mono">
                      {currentNotice.date}
                    </span>
                  )}
                </div>

                {/* Loop Separator */}
                <span className="text-amber-400 font-bold shrink-0">✦ ✦ ✦</span>

                {/* Pass 2 */}
                <div className="flex items-center gap-2 shrink-0" aria-hidden="true">
                  <span className="font-extrabold text-amber-300">{currentNotice.title}:</span>
                  <span className="text-blue-100 font-medium">{currentNotice.message}</span>
                  {currentNotice.date && (
                    <span className="text-[10px] text-amber-200/80 bg-white/10 px-1.5 py-0.2 rounded font-mono">
                      {currentNotice.date}
                    </span>
                  )}
                </div>

                <span className="text-amber-400 font-bold shrink-0">✦ ✦ ✦</span>
              </div>
            ) : (
              /* Mode 3: Static View when content fits inside container */
              <div ref={singleContentRef} className="flex items-center gap-2 text-xs py-0.5 w-full">
                <span className="font-extrabold text-amber-300 shrink-0">{currentNotice.title}:</span>
                <span className="text-blue-100 font-medium truncate">{currentNotice.message}</span>
                {currentNotice.date && (
                  <span className="text-[10px] text-amber-200/80 bg-white/10 px-1.5 py-0.2 rounded font-mono shrink-0 hidden md:inline">
                    {currentNotice.date}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Action & Marquee Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 text-xs">
            {/* Play / Pause Toggle Button */}
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="p-1 rounded bg-black/20 hover:bg-black/40 text-amber-200 hover:text-white transition-colors cursor-pointer"
              title={isPaused ? 'स्क्रॉल पुनः चालू करें (Play)' : 'स्क्रॉल रोकें (Pause)'}
              aria-label="Marquee Play/Pause Toggle"
            >
              {isPaused ? <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" /> : <Pause className="w-3 h-3" />}
            </button>

            {/* Stream All Notices Toggle */}
            {activeNotices.length > 1 && (
              <button
                onClick={() => setViewAllStream((prev) => !prev)}
                className={`hidden md:flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  viewAllStream
                    ? 'bg-amber-400 text-blue-950 border-amber-300 font-extrabold'
                    : 'bg-white/10 hover:bg-white/20 text-amber-200 border-white/20'
                }`}
                title="सभी सूचनाओं का निरंतर मार्की प्रवाह (All Notices Stream)"
              >
                <Layers className="w-2.5 h-2.5" />
                <span>{viewAllStream ? 'एकल सूचना' : 'सभी सूचनाएं'}</span>
              </button>
            )}

            {/* Previous / Next Notice Navigation Buttons */}
            {activeNotices.length > 1 && !viewAllStream && (
              <div className="hidden sm:flex items-center gap-0.5 bg-black/20 rounded p-0.5 border border-white/10">
                <button
                  onClick={handlePrevNotice}
                  className="p-0.5 hover:bg-white/20 rounded text-amber-200 hover:text-white transition-colors cursor-pointer"
                  title="पिछली सूचना"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={handleNextNotice}
                  className="p-0.5 hover:bg-white/20 rounded text-amber-200 hover:text-white transition-colors cursor-pointer"
                  title="अगली सूचना"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Full Notice View Button */}
            <button
              onClick={() => setModalNotice(currentNotice)}
              className="p-1 rounded bg-white/10 hover:bg-white/20 text-amber-200 hover:text-white transition-colors cursor-pointer"
              title="सूचना विस्तार से पढ़ें"
            >
              <Info className="w-3 h-3" />
            </button>

            {/* Admin Portal Link */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-[10px] text-amber-300 hover:text-white font-bold underline transition-colors cursor-pointer hidden lg:inline px-1"
                title="सूचना पट्ट प्रबंधन"
              >
                एडमिन
              </button>
            )}

            {/* Dismiss Banner Button */}
            <button
              onClick={() => setDismissed(true)}
              className="p-1 text-blue-200 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
              title="सूचना पट्ट बंद करें"
              aria-label="Close Notice Banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Full Notice Modal Detail Popup */}
      {modalNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white text-gray-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-amber-400 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#001082] via-[#0015A8] to-[#000c60] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-amber-400 text-blue-950 flex items-center justify-center font-black">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-amber-200">जीवन ज्योति फाउंडेशन - आधिकारिक जनसूचना</h3>
                  <p className="text-[11px] text-blue-200">गाजीपुर, उत्तर प्रदेश, भारत</p>
                </div>
              </div>
              <button
                onClick={() => setModalNotice(null)}
                className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  {getPriorityBadge(modalNotice.priority)}
                  {modalNotice.date && (
                    <span className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>दिनांक: {modalNotice.date}</span>
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-gray-500 font-semibold bg-gray-100 px-2 py-0.5 rounded-full">
                  सूचना ID: {modalNotice.id?.slice(0, 8) || 'OFFICIAL'}
                </span>
              </div>

              <div>
                <h4 className="text-base font-black text-gray-900 leading-snug mb-2">
                  {modalNotice.title}
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60">
                  {modalNotice.message}
                </p>
              </div>

              <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-200 text-xs text-blue-950 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-blue-900">अधिक जानकारी या सहभागिता हेतु:</p>
                  <p className="text-blue-800">
                    कृपया संस्था के आधिकारिक हेल्पलाइन <strong>+91-8052361666</strong> अथवा ईमेल <strong>jeevanjyotifoundationgzp@gmail.com</strong> पर संपर्क करें।
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 p-3.5 px-5 flex items-center justify-between border-t border-gray-200">
              <span className="text-[11px] text-gray-500">
                नीति आयोग व भारत सरकार पंजीकृत संस्था
              </span>
              <button
                onClick={() => setModalNotice(null)}
                className="px-4 py-1.5 bg-[#001082] hover:bg-[#0015A8] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                समझ गया / बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HomeNoticeBanner;
