// ============================================================================
// JEEVAN JYOTI FOUNDATION - ADMIN CREDENTIALS & SECURITY SERVICE
// जीवन ज्योति फाउंडेशन - एडमिन एवं सुपर एडमिन लॉगिन यूज़र आईडी व पासवर्ड प्रबंधन
// ============================================================================

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isMockFirebase } from '../lib/firebase';
import { AdminRole, AdminUser } from '../types';

export interface AdminAccountCredentials {
  userId: string;
  password: string;
  name: string;
  mobile: string;
  role?: AdminRole;
  updatedAt: string;
}

export interface AdminCredentialsConfig {
  superAdmin: AdminAccountCredentials;
  admin: AdminAccountCredentials;
  customAdmins?: Record<string, AdminAccountCredentials>;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

const STORAGE_KEY = 'jjf_admin_credentials_config';
const FIRESTORE_COLLECTION = 'admin_credentials';
const FIRESTORE_DOC_ID = 'master_config';

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentialsConfig = {
  superAdmin: {
    userId: 'superadmin',
    password: 'superadmin@123',
    name: 'श्री शैलेश प्रधान जी (सुपर एडमिन)',
    mobile: '8052361666',
    role: 'superadmin',
    updatedAt: '2026-04-15T00:00:00.000Z'
  },
  admin: {
    userId: 'admin',
    password: 'admin@123',
    name: 'अधिकृत एडमिन (व्यवस्थापक)',
    mobile: '8948165666',
    role: 'admin',
    updatedAt: '2026-04-15T00:00:00.000Z'
  },
  customAdmins: {},
  lastModifiedBy: 'System Initializer',
  lastModifiedAt: '2026-04-15T00:00:00.000Z'
};

/**
 * Get synchronously from LocalStorage or fall back to defaults
 */
export function getAdminCredentialsSync(): AdminCredentialsConfig {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_CREDENTIALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ADMIN_CREDENTIALS;
    const parsed = JSON.parse(raw);
    return {
      superAdmin: {
        ...DEFAULT_ADMIN_CREDENTIALS.superAdmin,
        ...(parsed.superAdmin || {})
      },
      admin: {
        ...DEFAULT_ADMIN_CREDENTIALS.admin,
        ...(parsed.admin || {})
      },
      customAdmins: {
        ...(DEFAULT_ADMIN_CREDENTIALS.customAdmins || {}),
        ...(parsed.customAdmins || {})
      },
      lastModifiedBy: parsed.lastModifiedBy || DEFAULT_ADMIN_CREDENTIALS.lastModifiedBy,
      lastModifiedAt: parsed.lastModifiedAt || DEFAULT_ADMIN_CREDENTIALS.lastModifiedAt
    };
  } catch {
    return DEFAULT_ADMIN_CREDENTIALS;
  }
}

/**
 * Get credentials from Firestore backend and synchronize with local cache
 */
export async function getAdminCredentials(): Promise<AdminCredentialsConfig> {
  const local = getAdminCredentialsSync();

  if (!isMockFirebase && db) {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as Partial<AdminCredentialsConfig>;
        const merged: AdminCredentialsConfig = {
          superAdmin: {
            ...local.superAdmin,
            ...(data.superAdmin || {})
          },
          admin: {
            ...local.admin,
            ...(data.admin || {})
          },
          customAdmins: {
            ...(local.customAdmins || {}),
            ...(data.customAdmins || {})
          },
          lastModifiedBy: data.lastModifiedBy || local.lastModifiedBy,
          lastModifiedAt: data.lastModifiedAt || local.lastModifiedAt
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        } catch {
          // Ignore
        }
        return merged;
      }
    } catch (e) {
      console.warn('[CredentialsService] Firestore fetch fallback to local:', e);
    }
  }

  return local;
}

/**
 * Save updated credentials to Firestore and LocalStorage
 */
export async function saveAdminCredentialsConfig(
  newConfig: AdminCredentialsConfig,
  modifierName: string = 'Super Admin'
): Promise<{ success: boolean; message: string }> {
  try {
    const enrichedConfig: AdminCredentialsConfig = {
      ...newConfig,
      lastModifiedBy: modifierName,
      lastModifiedAt: new Date().toISOString()
    };

    // 1. Save to LocalStorage immediately
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(enrichedConfig));
        window.dispatchEvent(
          new CustomEvent('jjf-admin-credentials-updated', { detail: enrichedConfig })
        );
      } catch (err) {
        console.warn('[CredentialsService] LocalStorage save warning:', err);
      }
    }

    // 2. Persist to Firestore
    if (!isMockFirebase && db) {
      try {
        const docRef = doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID);
        await setDoc(docRef, enrichedConfig, { merge: true });
      } catch (err) {
        console.warn('[CredentialsService] Firestore persist warning (saved locally):', err);
      }
    }

    return {
      success: true,
      message: 'लॉगिन क्रेडेंशियल्स (User ID एवं Password) सफलतापूर्वक सुरक्षित कर दिए गए!'
    };
  } catch (error) {
    console.error('[CredentialsService] Update error:', error);
    return {
      success: false,
      message: 'क्रेडेंशियल्स अपडेट करने में त्रुटि आई।'
    };
  }
}

/**
 * Update Super Admin Login Credentials
 */
export async function updateSuperAdminCredentials(
  newUserId: string,
  newPassword: string,
  modifierName: string = 'श्री शैलेश प्रधान जी'
): Promise<{ success: boolean; message: string }> {
  const cleanId = newUserId.trim();
  const cleanPassword = newPassword.trim();

  if (!cleanId || cleanId.length < 3) {
    return { success: false, message: 'सुपर एडमिन User ID कम से कम 3 अक्षरों की होनी चाहिए।' };
  }
  if (!cleanPassword || cleanPassword.length < 6) {
    return { success: false, message: 'सुपर एडमिन पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' };
  }

  const current = getAdminCredentialsSync();
  const updated: AdminCredentialsConfig = {
    ...current,
    superAdmin: {
      ...current.superAdmin,
      userId: cleanId,
      password: cleanPassword,
      updatedAt: new Date().toISOString()
    }
  };

  return saveAdminCredentialsConfig(updated, modifierName);
}

/**
 * Update Admin Login Credentials
 */
export async function updateRegularAdminCredentials(
  newUserId: string,
  newPassword: string,
  modifierName: string = 'अधिकृत एडमिन'
): Promise<{ success: boolean; message: string }> {
  const cleanId = newUserId.trim();
  const cleanPassword = newPassword.trim();

  if (!cleanId || cleanId.length < 3) {
    return { success: false, message: 'एडमिन User ID कम से कम 3 अक्षरों की होनी चाहिए।' };
  }
  if (!cleanPassword || cleanPassword.length < 6) {
    return { success: false, message: 'एडमिन पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' };
  }

  const current = getAdminCredentialsSync();
  const updated: AdminCredentialsConfig = {
    ...current,
    admin: {
      ...current.admin,
      userId: cleanId,
      password: cleanPassword,
      updatedAt: new Date().toISOString()
    }
  };

  return saveAdminCredentialsConfig(updated, modifierName);
}

/**
 * Reset credentials back to Foundation Default
 */
export async function resetToDefaultCredentials(
  modifierName: string = 'Super Admin'
): Promise<{ success: boolean; message: string }> {
  return saveAdminCredentialsConfig(DEFAULT_ADMIN_CREDENTIALS, `${modifierName} (Factory Reset)`);
}

/**
 * Create or Set Admin Username and Password
 * नवीन अथवा मौजूदा एडमिन हेतु नया User ID एवं Password सुरक्षित करना
 */
export async function createOrSetAdminCredentials(params: {
  role: 'superadmin' | 'admin';
  name?: string;
  mobile: string;
  newUserId: string;
  newPassword: string;
  securityAuthCode?: string;
  isOtpVerified?: boolean;
  modifierName?: string;
}): Promise<{
  success: boolean;
  message: string;
  userId?: string;
  role?: AdminRole;
}> {
  const cleanId = (params.newUserId || '').trim();
  const cleanPass = (params.newPassword || '').trim();
  const cleanMobile = (params.mobile || '').replace(/\D/g, '').slice(-10);
  const cleanName = (params.name || '').trim();
  const cleanCode = (params.securityAuthCode || '').trim();

  if (!cleanId || cleanId.length < 3) {
    return { success: false, message: 'यूज़र आईडी (Username) कम से कम 3 अक्षरों का होना चाहिए।' };
  }
  if (!cleanPass || cleanPass.length < 6) {
    return { success: false, message: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' };
  }
  if (!cleanMobile || cleanMobile.length !== 10) {
    return { success: false, message: 'कृपया 10-अंकों का मान्य मोबाइल नंबर दर्ज करें।' };
  }

  // Security Verification check:
  // Strictly require mobile OTP verification
  if (!params.isOtpVerified) {
    return {
      success: false,
      message: 'सुरक्षा प्रमाणीकरण विफल! क्रेडेंशियल बनाने अथवा बदलने हेतु मोबाइल पर भेजे गए OTP का सत्यापन अनिवार्य है।'
    };
  }

  const current = getAdminCredentialsSync();
  const now = new Date().toISOString();

  const accountName = cleanName || (params.role === 'superadmin' ? 'श्री शैलेश प्रधान जी' : 'अधिकृत एडमिन');

  const newAccount: AdminAccountCredentials = {
    userId: cleanId,
    password: cleanPass,
    name: accountName,
    mobile: cleanMobile,
    role: params.role,
    updatedAt: now
  };

  const updatedConfig: AdminCredentialsConfig = {
    ...current,
    customAdmins: {
      ...(current.customAdmins || {}),
      [cleanId.toLowerCase()]: newAccount
    }
  };

  if (params.role === 'superadmin') {
    updatedConfig.superAdmin = {
      ...current.superAdmin,
      userId: cleanId,
      password: cleanPass,
      name: accountName,
      mobile: cleanMobile,
      role: 'superadmin',
      updatedAt: now
    };
  } else {
    updatedConfig.admin = {
      ...current.admin,
      userId: cleanId,
      password: cleanPass,
      name: accountName,
      mobile: cleanMobile,
      role: 'admin',
      updatedAt: now
    };
  }

  const res = await saveAdminCredentialsConfig(updatedConfig, accountName || params.modifierName || 'Admin Setup');
  if (res.success) {
    return {
      success: true,
      message: `🎉 बधाई! नया Username '${cleanId}' एवं Password सफलतापूर्वक सुरक्षित हो गया। अब आप इससे तुरंत लॉगिन कर सकते हैं।`,
      userId: cleanId,
      role: params.role
    };
  }
  return { success: false, message: res.message };
}

/**
 * Verify user ID and password against configured credentials
 */
export async function verifyAdminLogin(
  userIdOrMobile: string,
  inputPassword: string
): Promise<{
  success: boolean;
  role?: AdminRole;
  userProfile?: AdminUser;
  message: string;
}> {
  const cleanId = (userIdOrMobile || '').trim().toLowerCase();
  const cleanPass = (inputPassword || '').trim();

  if (!cleanId || !cleanPass) {
    return {
      success: false,
      message: 'कृपया यूज़र आईडी / मोबाइल एवं पासवर्ड दोनों दर्ज करें।'
    };
  }

  // Ensure fresh credentials from cache or cloud
  const creds = await getAdminCredentials();

  // 1. Check Super Admin Match
  const superId = creds.superAdmin.userId.trim().toLowerCase();
  const superMobile = creds.superAdmin.mobile.trim();
  const superPass = creds.superAdmin.password.trim();

  // Check aliases: configured superId, phone 8052361666, or legacy aliases
  const isSuperIdMatch =
    cleanId === superId ||
    cleanId === superMobile ||
    cleanId === '8052361666' ||
    cleanId === 'shailesh' ||
    cleanId === 'superadmin';

  const isSuperPassMatch =
    cleanPass === superPass ||
    (superPass === DEFAULT_ADMIN_CREDENTIALS.superAdmin.password &&
      (cleanPass === 'admin123' || cleanPass === 'jjf2026'));

  if (isSuperIdMatch && isSuperPassMatch) {
    const profile: AdminUser = {
      uid: `superadmin-${superMobile || '8052361666'}`,
      name: creds.superAdmin.name || 'श्री शैलेश प्रधान जी',
      mobile: creds.superAdmin.mobile || '8052361666',
      email: 'superadmin@jeevanjyotifoundation.org',
      role: 'superadmin',
      approved: true,
      createdAt: creds.superAdmin.updatedAt || '2021-04-15T00:00:00.000Z',
      lastLogin: new Date().toISOString()
    };
    return {
      success: true,
      role: 'superadmin',
      userProfile: profile,
      message: `स्वागत है, ${profile.name}! (सुपर एडमिन)`
    };
  }

  // 2. Check Admin Match
  const adminId = creds.admin.userId.trim().toLowerCase();
  const adminMobile = creds.admin.mobile.trim();
  const adminPass = creds.admin.password.trim();

  const isAdminIdMatch =
    cleanId === adminId ||
    cleanId === adminMobile ||
    cleanId === '8948165666' ||
    cleanId === 'admin';

  const isAdminPassMatch =
    cleanPass === adminPass ||
    (adminPass === DEFAULT_ADMIN_CREDENTIALS.admin.password &&
      (cleanPass === 'admin123' || cleanPass === 'jjf2026'));

  if (isAdminIdMatch && isAdminPassMatch) {
    const profile: AdminUser = {
      uid: `admin-${adminMobile || '8948165666'}`,
      name: creds.admin.name || 'अधिकृत एडमिन (व्यवस्थापक)',
      mobile: creds.admin.mobile || '8948165666',
      email: 'admin@jeevanjyotifoundation.org',
      role: 'admin',
      approved: true,
      createdAt: creds.admin.updatedAt || '2021-06-10T00:00:00.000Z',
      lastLogin: new Date().toISOString()
    };
    return {
      success: true,
      role: 'admin',
      userProfile: profile,
      message: `स्वागत है, ${profile.name}! (अधिकृत एडमिन)`
    };
  }

  // 3. Check Custom Created Admin Accounts
  if (creds.customAdmins) {
    for (const [key, acc] of Object.entries(creds.customAdmins)) {
      const accId = (acc.userId || '').trim().toLowerCase();
      const accMob = (acc.mobile || '').trim();
      const accPass = (acc.password || '').trim();

      if (
        (cleanId === accId || cleanId === accMob || cleanId === key.toLowerCase()) &&
        cleanPass === accPass
      ) {
        const assignedRole: AdminRole = acc.role === 'superadmin' ? 'superadmin' : 'admin';
        const profile: AdminUser = {
          uid: `${assignedRole}-${accMob || cleanId}`,
          name: acc.name || (assignedRole === 'superadmin' ? 'श्री शैलेश प्रधान जी' : 'अधिकृत एडमिन'),
          mobile: acc.mobile || '',
          email: `${accId}@jeevanjyotifoundation.org`,
          role: assignedRole,
          approved: true,
          createdAt: acc.updatedAt || new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        return {
          success: true,
          role: assignedRole,
          userProfile: profile,
          message: `स्वागत है, ${profile.name}! (${assignedRole === 'superadmin' ? 'सुपर एडमिन' : 'अधिकृत एडमिन'})`
        };
      }
    }
  }

  return {
    success: false,
    message: 'अमान्य यूज़र आईडी या पासवर्ड। कृपया सही क्रेडेंशियल्स दर्ज करें अथवा "नया Username/Password बनाएं" विकल्प से नया बनाएं।'
  };
}
