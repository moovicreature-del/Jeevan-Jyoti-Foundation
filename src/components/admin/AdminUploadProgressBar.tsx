// ============================================================================
// JEEVAN JYOTI FOUNDATION - ADMIN UPLOAD PROGRESS BAR COMPONENT
// प्रशासनिक डेटा एवं मीडिया अपलोड विज़ुअल प्रोग्रेस बार UI घटक
// ============================================================================

import React from 'react';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Database,
  Film,
  FileText,
  Megaphone
} from 'lucide-react';
import { useAdminUploadProgress } from '../../context/AdminUploadProgressContext';

export const AdminUploadProgressBar: React.FC = () => {
  const { uploadState, resetUpload } = useAdminUploadProgress();

  if (!uploadState.isUploading && uploadState.status === 'idle') {
    return null;
  }

  const getCategoryIcon = () => {
    switch (uploadState.category) {
      case 'media':
        return <Film className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />;
      case 'notice':
        return <Megaphone className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />;
      case 'content':
        return <FileText className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />;
      default:
        return <Database className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />;
    }
  };

  const isSuccess = uploadState.status === 'success';
  const isError = uploadState.status === 'error';

  return (
    <div
      id="admin-upload-progress-banner"
      className="sticky top-16 z-50 w-full transition-all duration-300 shadow-lg"
      role="progressbar"
      aria-valuenow={uploadState.progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`px-4 py-3 sm:px-6 border-b transition-colors duration-300 ${
          isSuccess
            ? 'bg-emerald-900/95 border-emerald-700 text-emerald-50'
            : isError
            ? 'bg-rose-900/95 border-rose-700 text-rose-50'
            : 'bg-blue-950/95 border-blue-800 text-white backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header Row: Title, Status & Percentage */}
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {isSuccess ? (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                </div>
              ) : isError ? (
                <div className="w-6 h-6 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 text-rose-300" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 animate-bounce">
                  <UploadCloud className="w-3.5 h-3.5 text-amber-300" />
                </div>
              )}

              <div className="truncate">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold tracking-tight truncate">
                    {uploadState.title || 'प्रशासनिक डेटा अपलोड'}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded ${
                      isSuccess
                        ? 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/30'
                        : isError
                        ? 'bg-rose-400/20 text-rose-200 border border-rose-400/30'
                        : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    }`}
                  >
                    {isSuccess ? 'पूर्ण' : isError ? 'त्रुटि' : `${uploadState.progress}%`}
                  </span>
                </div>
                <p className="text-[11px] opacity-85 truncate mt-0.5">
                  {uploadState.statusMessage}
                  {uploadState.bytesDetail && (
                    <span className="ml-1.5 opacity-70 font-mono">({uploadState.bytesDetail})</span>
                  )}
                </p>
              </div>
            </div>

            {/* Right: Percent & Manual Dismiss Button */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono font-bold">
                {getCategoryIcon()}
                <span className="text-amber-300">{uploadState.progress}%</span>
              </div>
              <button
                type="button"
                onClick={resetUpload}
                aria-label="Close upload progress"
                className="p-1 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Animated Progress Track */}
          <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden p-0.5 border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-300 relative ${
                isSuccess
                  ? 'bg-emerald-400'
                  : isError
                  ? 'bg-rose-500'
                  : 'bg-gradient-to-r from-amber-500 via-amber-300 to-amber-400'
              }`}
              style={{ width: `${uploadState.progress}%` }}
            >
              {!isSuccess && !isError && (
                <div className="absolute inset-0 bg-white/25 animate-pulse rounded-full"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
