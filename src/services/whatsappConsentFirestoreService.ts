/**
 * Jeevan Jyoti Foundation Ghazipur
 * WhatsApp Consent & Opt-In Firestore Service
 * 
 * Securely logs user consent for receiving WhatsApp updates in Firestore
 * and triggers automated welcome dispatch via WhatsApp Cloud API.
 */

import { db } from '../lib/firebase';
import { collection, doc, setDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { sendWhatsAppWelcomeMessage } from './whatsappCloudService';

export interface WhatsAppConsentRecord {
  id: string; // e.g., wa_optin_+919876543210
  phone: string;
  cleanPhone: string;
  name: string;
  category: 'volunteer' | 'donor';
  referenceId?: string;
  consentGranted: boolean;
  optInDate: string;
  userAgent?: string;
  status: 'active' | 'revoked';
  welcomeMessageSent: boolean;
  welcomeMessageId?: string;
  notes?: string;
}

const LOCAL_CONSENT_KEY = 'jjf_whatsapp_consents_store_v1';
const FIRESTORE_COLLECTION = 'whatsapp_subscribers';

/**
 * Format 10 digit phone
 */
export function clean10DigitPhone(phone?: string | null): string {
  if (!phone) return '';
  return String(phone).replace(/\D/g, '').slice(-10);
}

/**
 * Save WhatsApp opt-in consent to Firestore (with LocalStorage cache fallback)
 * and trigger welcome message via WhatsApp Cloud API
 */
export async function saveWhatsAppConsent(params: {
  phone: string;
  name: string;
  category: 'volunteer' | 'donor';
  referenceId?: string;
  details?: string;
}): Promise<{ success: boolean; welcomeSent: boolean; record: WhatsAppConsentRecord }> {
  const cleanPhone = clean10DigitPhone(params.phone);
  const optInDate = new Date().toISOString();
  const consentId = `wa_optin_${params.category}_${cleanPhone}_${Date.now()}`;

  const record: WhatsAppConsentRecord = {
    id: consentId,
    phone: `+91-${cleanPhone}`,
    cleanPhone,
    name: params.name || 'सम्मानित नागरिक',
    category: params.category,
    referenceId: params.referenceId,
    consentGranted: true,
    optInDate,
    status: 'active',
    welcomeMessageSent: false,
    notes: params.details || `Opted in via ${params.category === 'volunteer' ? 'स्वयंसेवक पंजीकरण' : 'दान पोर्टल'}`
  };

  // 1. Local Storage caching
  try {
    const raw = localStorage.getItem(LOCAL_CONSENT_KEY);
    const list: WhatsAppConsentRecord[] = raw ? JSON.parse(raw) : [];
    // remove duplicate active for same phone and category
    const filtered = list.filter(item => !(item.cleanPhone === cleanPhone && item.category === params.category));
    filtered.unshift(record);
    localStorage.setItem(LOCAL_CONSENT_KEY, JSON.stringify(filtered.slice(0, 200)));
  } catch (e) {
    console.debug('[WhatsAppConsent] Local cache error:', e);
  }

  // 2. Persist to Firestore collection `whatsapp_subscribers`
  if (db && cleanPhone) {
    try {
      const docRef = doc(db, FIRESTORE_COLLECTION, `${cleanPhone}_${params.category}`);
      await setDoc(docRef, {
        ...record,
        updatedAt: optInDate
      }, { merge: true });
      console.log(`[WhatsAppConsent] Saved consent to Firestore for ${cleanPhone} (${params.category})`);
    } catch (fsErr) {
      console.warn('[WhatsAppConsent] Firestore write note:', fsErr);
    }
  }

  // 3. Trigger Welcome Message via WhatsApp Cloud API
  let welcomeSent = false;
  try {
    const welcomeResult = await sendWhatsAppWelcomeMessage({
      phone: cleanPhone,
      recipientName: params.name,
      type: params.category,
      referenceId: params.referenceId,
      details: params.details
    });

    if (welcomeResult.success) {
      welcomeSent = true;
      record.welcomeMessageSent = true;
      record.welcomeMessageId = welcomeResult.messageId;

      // Update Firestore with welcome delivery flag
      if (db) {
        try {
          const docRef = doc(db, FIRESTORE_COLLECTION, `${cleanPhone}_${params.category}`);
          await setDoc(docRef, {
            welcomeMessageSent: true,
            welcomeMessageId: welcomeResult.messageId || null,
            welcomeSentAt: new Date().toISOString()
          }, { merge: true });
        } catch {
          // ignore
        }
      }
    }
  } catch (welcomeErr) {
    console.warn('[WhatsAppConsent] Welcome dispatch note:', welcomeErr);
  }

  return {
    success: true,
    welcomeSent,
    record
  };
}

/**
 * Retrieve list of WhatsApp consented subscribers
 */
export async function getWhatsAppConsents(): Promise<WhatsAppConsentRecord[]> {
  try {
    if (db) {
      const q = query(collection(db, FIRESTORE_COLLECTION), orderBy('optInDate', 'desc'), limit(100));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const list: WhatsAppConsentRecord[] = [];
        snap.forEach(d => {
          list.push(d.data() as WhatsAppConsentRecord);
        });
        return list;
      }
    }
  } catch (err) {
    console.debug('[WhatsAppConsent] Firestore read fallback to local cache:', err);
  }

  try {
    const raw = localStorage.getItem(LOCAL_CONSENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
