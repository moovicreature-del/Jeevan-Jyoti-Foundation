// ============================================================================
// JEEVAN JYOTI FOUNDATION - FIREBASE CONFIGURATION & INITIALIZATION
// जीवन ज्योति फाउंडेशन - फ़ायरबेस ऑथ, फायरस्टोर और स्टोरेज इनिशियलाइज़ेशन
// ============================================================================

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  initializeAuth,
  browserLocalPersistence,
  inMemoryPersistence,
  browserPopupRedirectResolver
} from 'firebase/auth';
import {
  initializeFirestore,
  memoryLocalCache,
  getFirestore,
  setLogLevel,
  disableNetwork,
  enableNetwork,
  Firestore
} from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import firebaseConfigData from '../../firebase-applet-config.json';

// फ़ायरबेस प्रोजेक्ट कॉन्फ़िगरेशन (Firebase configuration values)
export const OAUTH_CLIENT_ID: string = firebaseConfigData.oAuthClientId || '';
export const AUTH_DOMAIN: string = firebaseConfigData.authDomain || '';
export const PROJECT_ID: string = firebaseConfigData.projectId || '';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
  firestoreDatabaseId: (firebaseConfigData as any).firestoreDatabaseId || '(default)'
};

// Singleton App Instance
export const app: FirebaseApp = !getApps().length 
  ? initializeApp(firebaseConfig) 
  : getApp();

// Firebase Auth Service with LocalStorage persistence and browser popup redirect resolver
export const auth: Auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: [browserLocalPersistence, inMemoryPersistence],
      popupRedirectResolver: browserPopupRedirectResolver
    });
  } catch {
    try {
      return getAuth(app);
    } catch {
      try {
        return getAuth();
      } catch {
        return null as unknown as Auth;
      }
    }
  }
})();

// Check if credentials are mock / unprovisioned
export const isMockFirebase = !firebaseConfig.apiKey || firebaseConfig.apiKey === 'mock-api-key';

// Suppress benign connection retry / streaming fallback warnings in iframe/sandboxed environments
try {
  setLogLevel('silent');
} catch {
  // Ignore
}

// Track whether Firestore backend is actively connected or operating in offline mode
let isFirestoreOnlineState = false;

export const isFirestoreOnline = (): boolean => isFirestoreOnlineState;

// Firestore Database Service with In-Memory Cache and auto-detecting transport
export const db: Firestore = (() => {
  try {
    const databaseId =
      firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
        ? firebaseConfig.firestoreDatabaseId
        : undefined;

    const firestoreInstance = initializeFirestore(
      app,
      {
        localCache: memoryLocalCache(),
        experimentalAutoDetectLongPolling: true,
      },
      databaseId
    );

    // If running in browser, verify if the Cloud Firestore backend is active
    if (typeof window !== 'undefined' && firebaseConfig.apiKey && firebaseConfig.projectId) {
      const probeUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents?key=${firebaseConfig.apiKey}`;
      fetch(probeUrl, { method: 'GET' })
        .then(async (res) => {
          if (res.status === 404 || !res.ok) {
            // Database not provisioned on Google Cloud yet; operate cleanly in offline mode
            isFirestoreOnlineState = false;
            try {
              await disableNetwork(firestoreInstance);
            } catch {
              // Ignore
            }
          } else {
            isFirestoreOnlineState = true;
          }
        })
        .catch(async () => {
          // Network unreachable; ensure smooth offline mode without retrying indefinitely
          isFirestoreOnlineState = false;
          try {
            await disableNetwork(firestoreInstance);
          } catch {
            // Ignore
          }
        });
    }

    return firestoreInstance;
  } catch (error) {
    console.warn('[Firebase] Firestore initialize warning, falling back to getFirestore:', error);
    try {
      return getFirestore(app);
    } catch {
      return null as unknown as Firestore;
    }
  }
})();

// Firebase Storage Service for Media & Banners
export const storage: FirebaseStorage = (() => {
  try {
    return getStorage(app);
  } catch (err) {
    console.warn('[Firebase] Storage initialization warning:', err);
    return null as unknown as FirebaseStorage;
  }
})();

export default app;
