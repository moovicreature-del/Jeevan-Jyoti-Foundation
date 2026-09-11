// ============================================================================
// GOOGLE DRIVE SERVICE & AUTHENTICATION MANAGER
// जीवन ज्योति फाउंडेशन - गूगल ड्राइव सेवा एवं ऑथेंटिकेशन
// ============================================================================

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

// Google Drive Scopes configured in OAuth setup
export const GOOGLE_DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.activity',
  'https://www.googleapis.com/auth/drive.activity.readonly',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.apps.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.install',
  'https://www.googleapis.com/auth/drive.meet.readonly',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.scripts'
];

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
    prompt: 'select_account',
    access_type: 'offline'
  });
  return provider;
}

/**
 * Initialize Drive Auth State Listener
 * Caches access token in memory while user is signed in, clears on sign-out
 */
export const initDriveAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
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
 */
export const signInWithGoogleDrive = async (): Promise<{
  user: User;
  accessToken: string;
}> => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Check your Firebase credentials.');
  }

  try {
    isSigningIn = true;
    const provider = createDriveAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential?.accessToken) {
      throw new Error(
        'Google did not return an access token. Please ensure third-party popups are enabled.'
      );
    }

    cachedAccessToken = credential.accessToken;
    return {
      user: result.user,
      accessToken: cachedAccessToken,
    };
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
