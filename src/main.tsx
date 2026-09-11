import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { LanguageProvider } from './context/LanguageContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { HomeContentProvider } from './context/HomeContentContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { registerCertificateServiceWorker } from './services/offlineCertificateCache';
import './index.css';

// Register Service Worker for offline PWA & certificate caching
registerCertificateServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <AdminAuthProvider>
          <HomeContentProvider>
            <App />
          </HomeContentProvider>
        </AdminAuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

