// ============================================================================
// JEEVAN JYOTI FOUNDATION - OFFLINE CERTIFICATE & OTP CACHE SERVICE
// जीवन ज्योति फाउंडेशन - ऑफ़लाइन प्रमाण पत्र एवं OTP सत्यापन कैश सर्विस (Service Worker & LocalStorage Fallback)
// ============================================================================

import { RegisteredCertificateItem, normalizePhoneNumber } from './certificateRegistryService';

export const OFFLINE_CERT_CACHE_PREFIX = 'jjf_offline_certs_';
export const OFFLINE_PHONE_INDEX_KEY = 'jjf_offline_verified_phones_index';
export const OFFLINE_LAST_VERIFIED_PHONE_KEY = 'jjf_last_verified_phone';

export interface CachedPhoneSession {
  phone: string;
  normalizedPhone: string;
  certificates: RegisteredCertificateItem[];
  cachedAt: number; // Unix timestamp
  formattedDate: string; // "24 Aug 2026, 03:15 PM"
  recipientName?: string;
  totalCount: number;
  syncSource: 'online_synced' | 'local_generated' | 'offline_fallback';
}

export interface CachedPhoneSummary {
  phone: string;
  normalizedPhone: string;
  totalCount: number;
  recipientName?: string;
  cachedAt: number;
  formattedDate: string;
}

/**
 * Format current timestamp for user display in Indian locale
 */
function getFormattedTimestamp(date: Date = new Date()): string {
  try {
    return date.toLocaleDateString('hi-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return date.toISOString().slice(0, 16);
  }
}

/**
 * Save verified certificate records for a specific phone number into persistent offline cache
 */
export function savePhoneCertificatesToOfflineCache(
  phoneNumber: string,
  certificates: RegisteredCertificateItem[],
  syncSource: 'online_synced' | 'local_generated' | 'offline_fallback' = 'online_synced'
): CachedPhoneSession | null {
  const cleanPhone = normalizePhoneNumber(phoneNumber);
  if (!cleanPhone || cleanPhone.length < 10) return null;

  const now = new Date();
  const session: CachedPhoneSession = {
    phone: phoneNumber,
    normalizedPhone: cleanPhone,
    certificates: certificates || [],
    cachedAt: now.getTime(),
    formattedDate: getFormattedTimestamp(now),
    recipientName: certificates?.[0]?.recipientName || 'सम्मानित नागरिक',
    totalCount: certificates?.length || 0,
    syncSource
  };

  try {
    // 1. Save specific phone cache
    const cacheKey = `${OFFLINE_CERT_CACHE_PREFIX}${cleanPhone}`;
    localStorage.setItem(cacheKey, JSON.stringify(session));

    // 2. Update verified phones index
    updateOfflinePhoneIndex({
      phone: phoneNumber,
      normalizedPhone: cleanPhone,
      totalCount: session.totalCount,
      recipientName: session.recipientName,
      cachedAt: session.cachedAt,
      formattedDate: session.formattedDate
    });

    // 3. Update last verified phone key
    localStorage.setItem(OFFLINE_LAST_VERIFIED_PHONE_KEY, cleanPhone);

    return session;
  } catch (err) {
    console.warn('Unable to persist offline certificate cache to localStorage:', err);
    return session;
  }
}

/**
 * Retrieve cached certificates for a phone number from offline storage
 */
export function getOfflineCachedCertificates(phoneNumber: string): CachedPhoneSession | null {
  const cleanPhone = normalizePhoneNumber(phoneNumber);
  if (!cleanPhone || cleanPhone.length < 10) return null;

  try {
    const cacheKey = `${OFFLINE_CERT_CACHE_PREFIX}${cleanPhone}`;
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;

    const parsed: CachedPhoneSession = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.certificates)) {
      return parsed;
    }
  } catch (err) {
    console.warn('Error reading offline certificate cache for phone:', cleanPhone, err);
  }

  return null;
}

/**
 * Check if offline cache exists for a phone number
 */
export function hasOfflineCachedCertificates(phoneNumber: string): boolean {
  const cleanPhone = normalizePhoneNumber(phoneNumber);
  if (!cleanPhone) return false;
  const cacheKey = `${OFFLINE_CERT_CACHE_PREFIX}${cleanPhone}`;
  return !!localStorage.getItem(cacheKey);
}

/**
 * Get all previously verified and cached phone numbers on this device
 */
export function getAllOfflineCachedPhoneSummaries(): CachedPhoneSummary[] {
  try {
    const raw = localStorage.getItem(OFFLINE_PHONE_INDEX_KEY);
    if (!raw) return [];
    const list: CachedPhoneSummary[] = JSON.parse(raw);
    if (Array.isArray(list)) {
      return list.sort((a, b) => b.cachedAt - a.cachedAt);
    }
  } catch (err) {
    console.warn('Error reading offline phone index:', err);
  }
  return [];
}

/**
 * Internal helper to update phone index list in localStorage
 */
function updateOfflinePhoneIndex(summary: CachedPhoneSummary): void {
  try {
    const current = getAllOfflineCachedPhoneSummaries();
    const filtered = current.filter((item) => item.normalizedPhone !== summary.normalizedPhone);
    const updated = [summary, ...filtered].slice(0, 10); // Keep last 10 numbers
    localStorage.setItem(OFFLINE_PHONE_INDEX_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Error updating offline phone index:', err);
  }
}

/**
 * Remove offline cache for a specific phone number
 */
export function removeOfflinePhoneCache(phoneNumber: string): boolean {
  const cleanPhone = normalizePhoneNumber(phoneNumber);
  if (!cleanPhone) return false;

  try {
    localStorage.removeItem(`${OFFLINE_CERT_CACHE_PREFIX}${cleanPhone}`);
    const current = getAllOfflineCachedPhoneSummaries();
    const updated = current.filter((item) => item.normalizedPhone !== cleanPhone);
    localStorage.setItem(OFFLINE_PHONE_INDEX_KEY, JSON.stringify(updated));
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the most recently verified phone number on this device
 */
export function getLastVerifiedPhoneNumber(): string | null {
  try {
    return localStorage.getItem(OFFLINE_LAST_VERIFIED_PHONE_KEY);
  } catch {
    return null;
  }
}

/**
 * Register Service Worker for offline PWA capabilities and certificate asset caching
 */
export function registerCertificateServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.debug('Jeevan Jyoti SW registered with scope:', registration.scope);
      })
      .catch((err) => {
        console.debug('Service Worker registration skipped/failed:', err);
      });
  });
}
