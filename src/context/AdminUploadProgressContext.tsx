// ============================================================================
// JEEVAN JYOTI FOUNDATION - ADMIN UPLOAD PROGRESS CONTEXT
// प्रशासनिक डेटा एवं मीडिया अपलोड विज़ुअल प्रोग्रेस बार संदर्भ
// ============================================================================

import React, { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react';

export interface UploadProgressState {
  isUploading: boolean;
  progress: number; // 0 to 100
  title: string;
  statusMessage: string;
  category: 'media' | 'content' | 'notice' | 'auth' | 'general' | 'export';
  status: 'idle' | 'uploading' | 'success' | 'error';
  bytesDetail?: string;
}

interface AdminUploadProgressContextType {
  uploadState: UploadProgressState;
  startUpload: (title: string, category?: UploadProgressState['category'], initialMessage?: string) => void;
  updateProgress: (progress: number, message?: string, bytesDetail?: string) => void;
  completeUpload: (successMessage?: string) => void;
  failUpload: (errorMessage?: string) => void;
  resetUpload: () => void;
  simulateProgress: (
    title: string,
    category?: UploadProgressState['category'],
    onFinishCallback?: () => void
  ) => {
    step: (percent: number, msg?: string) => void;
    done: (successMsg?: string) => void;
    fail: (errMsg?: string) => void;
  };
}

const initialUploadState: UploadProgressState = {
  isUploading: false,
  progress: 0,
  title: '',
  statusMessage: '',
  category: 'general',
  status: 'idle'
};

const AdminUploadProgressContext = createContext<AdminUploadProgressContextType | undefined>(undefined);

export const AdminUploadProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [uploadState, setUploadState] = useState<UploadProgressState>(initialUploadState);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startUpload = useCallback((
    title: string,
    category: UploadProgressState['category'] = 'general',
    initialMessage = 'डेटा अपलोड शुरू हो रहा है...'
  ) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    console.info(`%c[AdminUpload] 🚀 Started upload: "${title}" [${category}]`, 'color: #3b82f6; font-weight: bold;');
    
    setUploadState({
      isUploading: true,
      progress: 5,
      title,
      statusMessage: initialMessage,
      category,
      status: 'uploading'
    });
  }, []);

  const updateProgress = useCallback((progress: number, message?: string, bytesDetail?: string) => {
    const clamped = Math.min(100, Math.max(0, Math.round(progress)));
    setUploadState((prev) => ({
      ...prev,
      progress: clamped,
      statusMessage: message !== undefined ? message : prev.statusMessage,
      bytesDetail: bytesDetail !== undefined ? bytesDetail : prev.bytesDetail,
      status: clamped >= 100 ? 'success' : 'uploading'
    }));
  }, []);

  const completeUpload = useCallback((successMessage = 'प्रशासनिक डेटा सफलतापूर्वक अपलोड और सुरक्षित हो गया!') => {
    console.info(`%c[AdminUpload]  Upload completed successfully: "${successMessage}"`, 'color: #10b981; font-weight: bold;');
    
    setUploadState((prev) => ({
      ...prev,
      progress: 100,
      statusMessage: successMessage,
      status: 'success'
    }));

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setUploadState(initialUploadState);
    }, 2200);
  }, []);

  const failUpload = useCallback((errorMessage = 'डेटा अपलोड में त्रुटि आई। कृपया पुनः प्रयास करें।') => {
    console.warn(`%c[AdminUpload] ❌ Upload failed: "${errorMessage}"`, 'color: #ef4444; font-weight: bold;');
    
    setUploadState((prev) => ({
      ...prev,
      statusMessage: errorMessage,
      status: 'error'
    }));

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setUploadState(initialUploadState);
    }, 3500);
  }, []);

  const resetUpload = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setUploadState(initialUploadState);
  }, []);

  // Helper for simulating stepped progress during operations without deterministic streams
  const simulateProgress = useCallback((
    title: string,
    category: UploadProgressState['category'] = 'general',
    onFinishCallback?: () => void
  ) => {
    startUpload(title, category, 'डेटा संकलन व सत्यापन जारी है...');
    
    // Auto-advance gradually to 85% until finished
    let currentPct = 10;
    const interval = setInterval(() => {
      currentPct += Math.floor(Math.random() * 15) + 8;
      if (currentPct >= 88) {
        clearInterval(interval);
        currentPct = 88;
      }
      updateProgress(currentPct, currentPct < 50 ? 'डेटाबेस से संपर्क स्थापित हो रहा है...' : 'डेटा सुरक्षित किया जा रहा है...');
    }, 180);

    return {
      step: (percent: number, msg?: string) => {
        clearInterval(interval);
        updateProgress(percent, msg);
      },
      done: (successMsg?: string) => {
        clearInterval(interval);
        completeUpload(successMsg);
        if (onFinishCallback) onFinishCallback();
      },
      fail: (errMsg?: string) => {
        clearInterval(interval);
        failUpload(errMsg);
      }
    };
  }, [startUpload, updateProgress, completeUpload, failUpload]);

  return (
    <AdminUploadProgressContext.Provider
      value={{
        uploadState,
        startUpload,
        updateProgress,
        completeUpload,
        failUpload,
        resetUpload,
        simulateProgress
      }}
    >
      {children}
    </AdminUploadProgressContext.Provider>
  );
};

const defaultUploadContext: AdminUploadProgressContextType = {
  uploadState: initialUploadState,
  startUpload: () => {},
  updateProgress: () => {},
  completeUpload: () => {},
  failUpload: () => {},
  resetUpload: () => {},
  simulateProgress: () => ({
    step: () => {},
    done: () => {},
    fail: () => {}
  })
};

export const useAdminUploadProgress = () => {
  const context = useContext(AdminUploadProgressContext);
  return context || defaultUploadContext;
};
