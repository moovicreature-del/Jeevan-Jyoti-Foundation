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
  inMemoryPersistence
} from 'firebase/auth';
import {
  initializeFirestore,
  memoryLocalCache,
  getFirestore,
  setLogLevel,
  Firestore
} from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import firebaseConfigData from '../../firebase-applet-config.json';

// फ़ायरबेस प्रोजेक्ट कॉन्फ़िगरेशन (Firebase configuration values)
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

// Firebase Auth Service with LocalStorage persistence to prevent IndexedDB closing/hidden error in v12.17
export const auth: Auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: [browserLocalPersistence, inMemoryPersistence]
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
  setLogLevel('error');
} catch {
  // Ignore
}

// Firestore Database Service with In-Memory Cache and forced long-polling for stable network ingress
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
        experimentalForceLongPolling: true,
      },
      databaseId
    );

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
