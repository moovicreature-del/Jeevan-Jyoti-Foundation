// ============================================================================
// GOOGLE DRIVE SERVICE & AUTHENTICATION MANAGER
// जीवन ज्योति फाउंडेशन - गूगल ड्राइव सेवा एवं ऑथेंटिकेशन
// ============================================================================

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  browserPopupRedirectResolver,
  User,
} from 'firebase/auth';
import { auth, OAUTH_CLIENT_ID, AUTH_DOMAIN, PROJECT_ID } from '../lib/firebase';

// Google Drive Scopes configured for Google Workspace Drive access
export const GOOGLE_DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file'
];

export interface GoogleDriveUser {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  uid?: string;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
  iconLink?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  parents?: string[];
  shared?: boolean;
}

// In-memory token cache (strictly adhering to workspace-integration security guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Create and configure Google Auth Provider
function createDriveAuthProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  GOOGLE_DRIVE_SCOPES.forEach((scope) => provider.addScope(scope));
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  return provider;
}

/**
 * Get OAuth Environment & Redirect URI verification details
 */
export const getOAuthEnvironmentInfo = () => {
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const isDevUrl = currentOrigin.includes('ais-dev');
  const isPreUrl = currentOrigin.includes('ais-pre');
  const isLocal = currentOrigin.includes('localhost') || currentOrigin.includes('127.0.0.1');

  return {
    projectId: PROJECT_ID,
    oAuthClientId: OAUTH_CLIENT_ID,
    authDomain: AUTH_DOMAIN,
    firebaseRedirectUri: AUTH_DOMAIN ? `https://${AUTH_DOMAIN}/__/auth/handler` : '',
    currentOrigin,
    scopes: GOOGLE_DRIVE_SCOPES,
    isAuthorizedEnvironment: isDevUrl || isPreUrl || isLocal || currentOrigin.includes('firebaseapp.com'),
  };
};

/**
 * Direct OAuth Token acquisition using Google Identity Services (GSI)
 * Fallback when Firebase Auth popup is restricted by cross-origin iframe or domain policy
 */
export const requestAccessTokenViaGSI = (): Promise<{
  user: GoogleDriveUser;
  accessToken: string;
}> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window environment not available'));
      return;
    }

    const google = (window as any).google;
    if (!google?.accounts?.oauth2) {
      reject(new Error('Google Identity Services (GSI) script is not yet loaded in browser.'));
      return;
    }

    if (!OAUTH_CLIENT_ID) {
      reject(new Error('OAuth Client ID is missing from firebase-applet-config.json.'));
      return;
    }

    try {
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: OAUTH_CLIENT_ID,
        scope: GOOGLE_DRIVE_SCOPES.join(' '),
        callback: async (resp: any) => {
          if (resp.error) {
            reject(new Error(resp.error_description || resp.error));
            return;
          }
          if (!resp.access_token) {
            reject(new Error('No access token received from Google OAuth.'));
            return;
          }

          cachedAccessToken = resp.access_token;

          // Retrieve user profile information using access token
          let userProfile: GoogleDriveUser = {
            displayName: 'Google Drive User',
            email: 'user@google.com',
            photoURL: '',
            uid: 'gsi_' + Date.now(),
          };

          try {
            const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${resp.access_token}` },
            });
            if (profileRes.ok) {
              const data = await profileRes.json();
              userProfile = {
                displayName: data.name || data.email,
                email: data.email,
                photoURL: data.picture || '',
                uid: data.sub || 'gsi_' + Date.now(),
              };
            }
          } catch (profileErr) {
            console.warn('[GSI] Non-fatal profile fetch notice:', profileErr);
          }

          resolve({
            user: userProfile,
            accessToken: resp.access_token,
          });
        },
        error_callback: (err: any) => {
          reject(err);
        },
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Initialize Drive Auth State Listener
 * Caches access token in memory while user is signed in, clears on sign-out
 */
export const initDriveAuth = (
  onAuthSuccess?: (user: User | GoogleDriveUser, token: string) => void,
  onAuthFailure?: () => void
) => {
  if (!auth) {
    if (onAuthFailure) onAuthFailure();
    return () => {};
  }

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else if (!isSigningIn) {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

/**
 * Sign in with Google using popup to acquire Google Drive access token
 * Handles both Firebase Auth popup resolver and GSI direct token fallback
 */
export const signInWithGoogleDrive = async (): Promise<{
  user: User | GoogleDriveUser;
  accessToken: string;
}> => {
  try {
    isSigningIn = true;

    // Primary Flow: Firebase Auth with explicit popup redirect resolver
    if (auth) {
      try {
        const provider = createDriveAuthProvider();
        // Passing browserPopupRedirectResolver explicitly eliminates auth/argument-error
        const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
        const credential = GoogleAuthProvider.credentialFromResult(result);

        if (credential?.accessToken) {
          cachedAccessToken = credential.accessToken;
          return {
            user: result.user,
            accessToken: cachedAccessToken,
          };
        }
      } catch (firebaseError: any) {
        console.warn('[Google Drive Auth] Firebase popup notice:', firebaseError?.code, firebaseError?.message);

        // If Firebase Auth throws domain/popup error, attempt direct GSI fallback if available
        if (
          (firebaseError?.code === 'auth/unauthorized-domain' ||
            firebaseError?.code === 'auth/popup-blocked' ||
            firebaseError?.code === 'auth/popup-closed-by-user') &&
          typeof window !== 'undefined' &&
          (window as any).google?.accounts?.oauth2 &&
          OAUTH_CLIENT_ID
        ) {
          const gsiResult = await requestAccessTokenViaGSI();
          return gsiResult;
        }

        throw firebaseError;
      }
    }

    // Fallback if auth is not initialized
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2 && OAUTH_CLIENT_ID) {
      return await requestAccessTokenViaGSI();
    }

    throw new Error('Authentication services are not available.');
  } catch (error: any) {
    console.error('[Google Drive Auth] Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Get current in-memory cached access token
 */
export const getDriveAccessToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * Sign out and clear cached token
 */
export const signOutGoogleDrive = async (): Promise<void> => {
  if (auth) {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Signout warning:', err);
    }
  }
  cachedAccessToken = null;
};

// ============================================================================
// GOOGLE DRIVE REST API OPERATIONS
// ============================================================================

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API_URL = 'https://www.googleapis.com/upload/drive/v3';

/**
 * List files and folders from Google Drive
 */
export const listDriveFiles = async (options?: {
  folderId?: string;
  query?: string;
  pageSize?: number;
  pageToken?: string;
}): Promise<{ files: GoogleDriveFile[]; nextPageToken?: string }> => {
  const token = cachedAccessToken;
  if (!token) {
    throw new Error('Not authenticated with Google Drive. Please sign in.');
  }

  const queryParts: string[] = ['trashed = false'];

  if (options?.folderId && options.folderId !== 'root') {
    queryParts.push(`'${options.folderId}' in parents`);
  } else if (options?.folderId === 'root') {
    queryParts.push(`'root' in parents`);
  }

  if (options?.query && options.query.trim()) {
    const escaped = options.query.replace(/['\\]/g, '');
    queryParts.push(`name contains '${escaped}'`);
  }

  const q = encodeURIComponent(queryParts.join(' and '));
  const pageSize = options?.pageSize || 40;
  const pageTokenParam = options?.pageToken ? `&pageToken=${options.pageToken}` : '';

  const fields = encodeURIComponent(
    'nextPageToken, files(id, name, mimeType, size, modifiedTime, iconLink, thumbnailLink, webViewLink, webContentLink, parents, shared)'
  );

  const url = `${DRIVE_API_URL}/files?q=${q}&pageSize=${pageSize}&fields=${fields}&orderBy=folder,modifiedTime desc${pageTokenParam}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const message = errData?.error?.message || `Google Drive API error: ${res.statusText}`;
    throw new Error(message);
  }

  const data = await res.json();
  return {
    files: data.files || [],
    nextPageToken: data.nextPageToken,
  };
};

/**
 * Create a new folder in Google Drive
 */
export const createDriveFolder = async (
  name: string,
  parentId?: string
): Promise<GoogleDriveFile> => {
  const token = cachedAccessToken;
  if (!token) throw new Error('Not authenticated with Google Drive');

  const metadata: { name: string; mimeType: string; parents?: string[] } = {
    name: name.trim(),
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parentId && parentId !== 'root') {
    metadata.parents = [parentId];
  }

  const res = await fetch(`${DRIVE_API_URL}/files?fields=id,name,mimeType,webViewLink`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to create folder');
  }

  return await res.json();
};

/**
 * Upload a file to Google Drive using multipart upload
 */
export const uploadFileToDrive = async (params: {
  fileData: Blob | File | string;
  fileName: string;
  mimeType: string;
  parentId?: string;
  description?: string;
}): Promise<GoogleDriveFile> => {
  const token = cachedAccessToken;
  if (!token) throw new Error('Not authenticated with Google Drive');

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata: { name: string; mimeType: string; description?: string; parents?: string[] } = {
    name: params.fileName,
    mimeType: params.mimeType,
  };

  if (params.description) {
    metadata.description = params.description;
  }

  if (params.parentId && params.parentId !== 'root') {
    metadata.parents = [params.parentId];
  }

  let body: BodyInit;

  if (typeof params.fileData === 'string') {
    // String content (e.g. JSON, CSV, text)
    const multipartBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      `Content-Type: ${params.mimeType}\r\n\r\n` +
      params.fileData +
      closeDelimiter;

    body = multipartBody;
  } else {
    // Blob or File binary
    const metaBlob = new Blob([JSON.stringify(metadata)], {
      type: 'application/json; charset=UTF-8',
    });

    const parts = [
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n`,
      metaBlob,
      `\r\n--${boundary}\r\nContent-Type: ${params.mimeType}\r\n\r\n`,
      params.fileData,
      `\r\n--${boundary}--`,
    ];

    body = new Blob(parts);
  }

  const res = await fetch(
    `${UPLOAD_API_URL}/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body,
    }
  );

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to upload file to Google Drive');
  }

  return await res.json();
};

/**
 * Delete a file or folder from Google Drive
 * (Caller MUST execute explicit confirmation dialog beforehand)
 */
export const deleteDriveFile = async (fileId: string): Promise<void> => {
  const token = cachedAccessToken;
  if (!token) throw new Error('Not authenticated with Google Drive');

  const res = await fetch(`${DRIVE_API_URL}/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || 'Failed to delete file from Google Drive');
  }
};

/**
 * Format bytes to readable size
 */
export const formatFileSize = (bytes?: string | number): string => {
  if (!bytes) return '—';
  const num = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
  if (isNaN(num)) return '—';
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  if (num < 1024 * 1024 * 1024) return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  return `${(num / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};
