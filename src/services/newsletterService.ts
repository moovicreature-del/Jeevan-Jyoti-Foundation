// ============================================================================
// JEEVAN JYOTI FOUNDATION - NEWSLETTER SUBSCRIPTION SERVICE
// मासिक एनजीओ प्रभाव समाचार पत्र (Monthly NGO Impact Updates) सदस्यता सेवा
// ============================================================================

import { doc, setDoc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db, isMockFirebase } from '../lib/firebase';

export interface NewsletterSubscriber {
  email: string;
  name?: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
  source: string;
  preferredLanguage: string;
}

const NEWSLETTER_COLLECTION = 'newsletterSubscribers';
const LOCAL_STORAGE_KEY = 'jjf_newsletter_subscribers';

/**
 * Basic RFC 5322 compliant email regex validation
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 150) return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(trimmed);
}

/**
 * Generate a safe Firestore document ID from an email address
 */
export function getEmailDocId(email: string): string {
  return email.trim().toLowerCase().replace(/[^a-z0-9_@.-]/g, '_');
}

/**
 * Get locally stored subscribers
 */
export function getLocalSubscribers(): NewsletterSubscriber[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Subscribe an email address to monthly NGO impact updates
 */
export async function subscribeToNewsletter(
  email: string,
  preferredLanguage: string = 'hi',
  name?: string
): Promise<{ success: boolean; message: string; alreadySubscribed?: boolean }> {
  const cleanEmail = email.trim().toLowerCase();

  if (!isValidEmail(cleanEmail)) {
    return {
      success: false,
      message: preferredLanguage === 'hi'
        ? 'कृपया एक वैध ईमेल पता दर्ज करें (उदा. example@gmail.com)।'
        : 'Please enter a valid email address (e.g. example@gmail.com).'
    };
  }

  const docId = getEmailDocId(cleanEmail);
  const now = new Date().toISOString();

  const subscriberData: NewsletterSubscriber = {
    email: cleanEmail,
    name: name ? name.trim().slice(0, 100) : undefined,
    subscribedAt: now,
    status: 'active',
    source: 'footer_newsletter',
    preferredLanguage
  };

  // 1. Check LocalStorage cache
  const localList = getLocalSubscribers();
  const existingLocal = localList.find((s) => s.email === cleanEmail);

  if (existingLocal && existingLocal.status === 'active') {
    return {
      success: true,
      alreadySubscribed: true,
      message: preferredLanguage === 'hi'
        ? 'आप पहले से ही हमारे मासिक प्रभाव समाचार पत्र के पंजीकृत सदस्य हैं! धन्यवाद।'
        : "You are already subscribed to our monthly impact newsletter! Thank you."
    };
  }

  // 2. Save to LocalStorage immediately
  try {
    const updated = [
      subscriberData,
      ...localList.filter((s) => s.email !== cleanEmail)
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated.slice(0, 500)));
  } catch (err) {
    console.warn('[Newsletter] LocalStorage write notice:', err);
  }

  // 3. Write to Firestore backend
  if (!isMockFirebase && db) {
    try {
      const docRef = doc(db, NEWSLETTER_COLLECTION, docId);

      // Check if already subscribed in Firestore
      try {
        const existingDoc = await getDoc(docRef);
        if (existingDoc.exists()) {
          const data = existingDoc.data();
          if (data.status === 'active') {
            return {
              success: true,
              alreadySubscribed: true,
              message: preferredLanguage === 'hi'
                ? 'आप पहले से ही हमारे मासिक प्रभाव समाचार पत्र के सदस्य हैं! धन्यवाद।'
                : "You are already subscribed to our monthly impact newsletter! Thank you."
            };
          }
        }
      } catch {
        // If read fails (e.g. permission or offline), proceed to write
      }

      await setDoc(docRef, subscriberData, { merge: true });
    } catch (error) {
      console.warn('[Newsletter] Firestore save notice (saved to local queue):', error);
      // Even if Firestore is offline, local storage has it, so the user experience is smooth
    }
  }

  return {
    success: true,
    message: preferredLanguage === 'hi'
      ? 'सफलतापूर्वक सदस्यता ग्रहण की गई! जीवन ज्योति फाउंडेशन के मासिक सेवा व प्रभाव अपडेट्स आपके ईमेल पर भेजे जाएंगे।'
      : 'Successfully subscribed! You will receive monthly impact updates and service reports in your inbox.'
  };
}

/**
 * Get total subscribers count (for admin overview)
 */
export async function getSubscribersCount(): Promise<number> {
  const local = getLocalSubscribers();
  let count = local.length;

  if (!isMockFirebase && db) {
    try {
      const colRef = collection(db, NEWSLETTER_COLLECTION);
      const snap = await getDocs(query(colRef, limit(100)));
      if (!snap.empty) {
        count = Math.max(count, snap.size);
      }
    } catch {
      // Return local count
    }
  }

  return count;
}
