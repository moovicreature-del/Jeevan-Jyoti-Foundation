// ============================================================================
// JEEVAN JYOTI FOUNDATION - HOME CONTENT REALTIME CONTEXT
// होम पेज सामग्री और नोटिस बोर्ड का लाइव रियल-टाइम स्टेट मैनेजर
// ============================================================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppHomeContent, NoticeItem } from '../types';
import {
  DEFAULT_HOME_CONTENT,
  subscribeToHomeContent,
  subscribeToNotices,
  deleteLogoFromAllDatabases,
  applyDynamicAppThumbnail
} from '../services/adminService';

interface HomeContentContextType {
  content: AppHomeContent;
  notices: NoticeItem[];
  activeNotices: NoticeItem[];
  isLoading: boolean;
}

const HomeContentContext = createContext<HomeContentContextType>({
  content: DEFAULT_HOME_CONTENT,
  notices: [],
  activeNotices: [],
  isLoading: true
});

export const HomeContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<AppHomeContent>(() => {
    if (typeof window !== 'undefined') {
      try {
        const local = localStorage.getItem('jjf_home_content');
        if (local) {
          const parsed = JSON.parse(local);
          const customLogo = localStorage.getItem('jjf_custom_logo');
          if (customLogo) parsed.appLogoUrl = customLogo;
          const customThumb = localStorage.getItem('jjf_custom_thumbnail');
          if (customThumb) parsed.appThumbnailUrl = customThumb;
          return parsed;
        }
        const customLogo = localStorage.getItem('jjf_custom_logo');
        const customThumb = localStorage.getItem('jjf_custom_thumbnail');
        if (customLogo || customThumb) {
          return {
            ...DEFAULT_HOME_CONTENT,
            appLogoUrl: customLogo || '',
            appThumbnailUrl: customThumb || ''
          };
        }
      } catch {
        // Ignore
      }
    }
    return DEFAULT_HOME_CONTENT;
  });
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // 0. Ensure meta tags sync on startup with any custom thumbnail
    if (content?.appThumbnailUrl) {
      applyDynamicAppThumbnail(content.appThumbnailUrl);
    }

    // 1. होम पेज कंटेंट का रियल-टाइम लिसनर
    const unsubContent = subscribeToHomeContent((updatedContent) => {
      setContent(updatedContent);
      if (updatedContent?.appThumbnailUrl) {
        applyDynamicAppThumbnail(updatedContent.appThumbnailUrl);
      }
      setIsLoading(false);
    });

    // 2. नोटिस बोर्ड का रियल-टाइम लिसनर
    const unsubNotices = subscribeToNotices((updatedNotices) => {
      setNotices(updatedNotices);
    });

    // 3. रियल-टाइम लोगो चेंज इवेंट लिसनर
    const handleLogoChanged = (e: CustomEvent<string>) => {
      const newLogo = typeof e.detail === 'string' ? e.detail : '';
      setContent((prev) => ({
        ...prev,
        appLogoUrl: newLogo
      }));
    };

    // 4. रियल-टाइम थंबनेल चेंज इवेंट लिसनर
    const handleThumbnailChanged = (e: CustomEvent<string>) => {
      const newThumb = typeof e.detail === 'string' ? e.detail : '';
      setContent((prev) => ({
        ...prev,
        appThumbnailUrl: newThumb
      }));
      applyDynamicAppThumbnail(newThumb);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('jjf-logo-changed' as any, handleLogoChanged);
      window.addEventListener('jjf-thumbnail-changed' as any, handleThumbnailChanged);
    }

    return () => {
      try {
        if (typeof unsubContent === 'function') unsubContent();
      } catch (err) {
        console.warn('Unsub content notice:', err);
      }
      try {
        if (typeof unsubNotices === 'function') unsubNotices();
      } catch (err) {
        console.warn('Unsub notices notice:', err);
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('jjf-logo-changed' as any, handleLogoChanged);
        window.removeEventListener('jjf-thumbnail-changed' as any, handleThumbnailChanged);
      }
    };
  }, []);

  const activeNotices = notices.filter((n) => n.isActive);

  return (
    <HomeContentContext.Provider
      value={{
        content,
        notices,
        activeNotices,
        isLoading
      }}
    >
      {children}
    </HomeContentContext.Provider>
  );
};

export const useHomeContent = () => {
  const context = useContext(HomeContentContext);
  return context;
};
