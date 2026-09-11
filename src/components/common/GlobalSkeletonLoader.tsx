// ============================================================================
// JEEVAN JYOTI FOUNDATION - GLOBAL FIRESTORE SKELETON LOADER
// फायरस्टोर क्लाउड डेटा सिंक्रनाइज़ेशन व लोडिंग स्केलेटन घटक
// ============================================================================

import React from 'react';
import { Database, Sparkles, Cloud, ShieldCheck } from 'lucide-react';

interface GlobalSkeletonLoaderProps {
  message?: string;
  variant?: 'full-app' | 'hero' | 'stats' | 'cards' | 'table' | 'banner';
  className?: string;
}

export const GlobalSkeletonLoader: React.FC<GlobalSkeletonLoaderProps> = ({
  message = 'फायरस्टोर क्लाउड डेटाबेस से लाइव रिकॉर्ड लोड हो रहे हैं...',
  variant = 'full-app',
  className = ''
}) => {
  if (variant === 'banner') {
    return (
      <div className={`w-full bg-amber-500/10 border-b border-amber-300/30 px-4 py-2.5 flex items-center justify-between animate-pulse ${className}`}>
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <div className="w-4 h-4 rounded-full bg-amber-300/60 animate-ping shrink-0" />
          <div className="h-3.5 bg-amber-200/80 rounded w-2/3 max-w-md" />
        </div>
      </div>
    );
  }

  if (variant === 'stats') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto px-4 sm:px-6 my-8 ${className}`}>
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-slate-200" />
              <div className="w-12 h-4 rounded-md bg-slate-100" />
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="h-7 bg-slate-200 rounded-lg w-3/4" />
              <div className="h-3.5 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 sm:px-6 my-8 ${className}`}>
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 animate-pulse">
            <div className="w-12 h-12 rounded-2xl bg-slate-200" />
            <div className="h-5 bg-slate-200 rounded-md w-2/3" />
            <div className="space-y-2">
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-5/6" />
              <div className="h-3 bg-slate-100 rounded w-4/6" />
            </div>
            <div className="pt-2">
              <div className="h-9 bg-slate-200 rounded-xl w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 animate-pulse ${className}`}>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="h-6 bg-slate-200 rounded-lg w-1/3" />
          <div className="h-8 bg-slate-100 rounded-xl w-28" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-50 gap-4">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-4 bg-slate-100 rounded w-1/5" />
              <div className="h-4 bg-slate-100 rounded w-1/6" />
              <div className="h-7 bg-slate-200 rounded-lg w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: Full App Initial Screen Skeleton
  return (
    <div
      id="global-firestore-skeleton-loader"
      className={`min-h-screen bg-[#FFFDF9] flex flex-col font-sans relative overflow-hidden ${className}`}
    >
      {/* Top Floating Status Indicator */}
      <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="bg-slate-900/90 text-white backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-slate-700/50 flex items-center gap-2.5 text-xs font-bold animate-pulse">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <Database className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span className="text-slate-200 font-medium tracking-wide">{message}</span>
        </div>
      </div>

      {/* 1. Header Navbar Skeleton */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 animate-pulse">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-200 border border-slate-300" />
            <div className="space-y-1.5">
              <div className="h-4 bg-slate-300 rounded w-44" />
              <div className="h-2.5 bg-slate-200 rounded w-32" />
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="h-9 bg-slate-100 rounded-xl w-24" />
            <div className="h-9 bg-slate-100 rounded-xl w-24" />
            <div className="h-9 bg-slate-200 rounded-xl w-32" />
            <div className="h-9 bg-amber-100 rounded-xl w-28" />
          </div>
        </div>
      </header>

      {/* 2. Top Notice Bar Skeleton */}
      <div className="bg-amber-50 border-b border-amber-200/60 px-4 py-2.5 animate-pulse">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-5 h-5 rounded-md bg-amber-200 shrink-0" />
          <div className="h-3.5 bg-amber-200 rounded w-3/4 max-w-2xl" />
        </div>
      </div>

      {/* 3. Hero Section Skeleton */}
      <section className="py-12 lg:py-16 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 animate-pulse">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/70 border border-amber-200 w-64 h-7" />
              <div className="space-y-3">
                <div className="h-10 sm:h-12 bg-slate-300 rounded-2xl w-5/6" />
                <div className="h-8 bg-slate-200 rounded-xl w-3/4" />
              </div>
              <div className="h-5 bg-amber-100 rounded-lg w-2/3" />
              <div className="space-y-2 pt-1">
                <div className="h-3.5 bg-slate-200 rounded w-full" />
                <div className="h-3.5 bg-slate-200 rounded w-11/12" />
                <div className="h-3.5 bg-slate-100 rounded w-4/5" />
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <div className="h-12 bg-amber-300 rounded-2xl w-40" />
                <div className="h-12 bg-slate-200 rounded-2xl w-44" />
                <div className="h-12 bg-slate-100 rounded-2xl w-36" />
              </div>
            </div>

            {/* Right Hero Interactive Showcase Skeleton */}
            <div className="lg:col-span-5 animate-pulse">
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-lg space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-200" />
                    <div className="space-y-1">
                      <div className="h-4 bg-slate-300 rounded w-28" />
                      <div className="h-2.5 bg-slate-100 rounded w-20" />
                    </div>
                  </div>
                  <div className="w-14 h-6 rounded-full bg-emerald-100" />
                </div>
                <div className="h-44 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-200 animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="h-10 bg-slate-200 rounded-xl" />
                  <div className="h-10 bg-amber-200 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Action Center Strip Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-4 mb-8 w-full">
        <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm animate-pulse">
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-2xl p-3 flex flex-col justify-between">
                <div className="w-6 h-6 rounded-lg bg-slate-200" />
                <div className="h-2.5 bg-slate-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Live Impact Dashboard Counters Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 my-6 w-full animate-pulse">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-1.5">
              <div className="h-6 bg-slate-700 rounded-lg w-48" />
              <div className="h-3.5 bg-slate-800 rounded w-64" />
            </div>
            <div className="w-24 h-8 rounded-xl bg-slate-800" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                <div className="h-4 bg-slate-700 rounded w-1/2" />
                <div className="h-8 bg-amber-300/40 rounded-lg w-3/4" />
                <div className="h-3 bg-slate-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Main Cards Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 my-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-slate-200" />
              <div className="h-5 bg-slate-300 rounded w-2/3" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
                <div className="h-3 bg-slate-100 rounded w-3/4" />
              </div>
              <div className="h-10 bg-slate-200 rounded-xl w-full mt-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Named sub-variants for modular usage across components
export const FullAppSkeleton: React.FC<{ message?: string; className?: string }> = (props) => (
  <GlobalSkeletonLoader variant="full-app" {...props} />
);

export const StatsSkeleton: React.FC<{ className?: string }> = (props) => (
  <GlobalSkeletonLoader variant="stats" {...props} />
);

export const CardGridSkeleton: React.FC<{ className?: string }> = (props) => (
  <GlobalSkeletonLoader variant="cards" {...props} />
);

export const TableSkeleton: React.FC<{ className?: string }> = (props) => (
  <GlobalSkeletonLoader variant="table" {...props} />
);

export const BannerSkeleton: React.FC<{ className?: string }> = (props) => (
  <GlobalSkeletonLoader variant="banner" {...props} />
);

