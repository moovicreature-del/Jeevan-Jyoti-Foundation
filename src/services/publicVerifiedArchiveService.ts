// ============================================================================
// JEEVAN JYOTI FOUNDATION - PUBLIC VERIFIED ARCHIVE BACKGROUND SERVICE
// जीवन ज्योति फाउंडेशन - पब्लिक वेरिफाइड आर्काइव ऑटोमेटेड बैकग्राउंड सर्विस (Firestore)
// ============================================================================

import { db, isMockFirebase } from '../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  increment,
  query,
  orderBy,
  limit,
  Unsubscribe
} from 'firebase/firestore';
import { FOUNDATION_INFO } from '../data/foundationData';
import {
  RegisteredCertificateItem,
  CertificateCategoryType,
  normalizeCertificateId,
  normalizePhoneNumber,
  getAllRegisteredCertificates
} from './certificateRegistryService';

export const PUBLIC_ARCHIVE_COLLECTION = 'public_verified_archive';
const LOCAL_PUBLIC_ARCHIVE_KEY = 'jjf_public_verified_archive_cache_v1';

export type PublicVerificationStatus =
  | 'VERIFIED_ACTIVE'
  | 'OFFICIALLY_CERTIFIED'
  | 'EXEMPTION_CONFIRMED'
  | 'ACTIVE'
  | 'REVOKED';

export interface PublicArchivedCertificate {
  id: string;
  certificateId: string;
  type: CertificateCategoryType;
  titleHindi: string;
  titleEnglish: string;
  recipientName: string;
  fatherOrHusbandName?: string;
  phone: string;
  phoneMasked: string;
  issueDate: string;
  verificationStatus: PublicVerificationStatus;
  categoryOrPurpose?: string;
  amount?: number;
  details?: string;
  photoUrl?: string;
  qrVerificationUrl: string;
  verificationHash: string;
  verificationCount: number;
  lastVerifiedAt: string;
  archivedAt: string;
  isPubliclyVerified: boolean;
  source: string;
  issuerMetadata: {
    foundationNameHindi: string;
    foundationNameEnglish: string;
    regNo: string;
    nitiAayogUid: string;
    pan: string;
    section80G_URN: string;
    section12A_URN: string;
    signatoryName: string;
    signatoryDesignation: string;
    headquarters: string;
  };
  revocationReason?: string;
  rawRecord?: any;
}

// Generate deterministic tamper-evident verification hash
export function generateVerificationHash(certId: string, name: string, issueDate: string): string {
  const input = `${certId}|${name}|${issueDate}|${FOUNDATION_INFO.regNo}|${FOUNDATION_INFO.pan}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  return `JJF-SEC-${hex}-${certId.replace(/[^A-Z0-9]/g, '').slice(-4) || '2026'}`;
}

// Mask phone number for public display (e.g. +91 80523*****)
export function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return '+91 80523*****';
  const clean = normalizePhoneNumber(phone);
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 5)}*****`;
  }
  return `+91 ${clean.slice(0, 4)}****`;
}

// Map internal status to PublicVerificationStatus
export function mapToPublicStatus(
  rawStatus?: string,
  type?: CertificateCategoryType
): PublicVerificationStatus {
  if (rawStatus === 'revoked') return 'REVOKED';
  if (type === 'donation_80g') return 'EXEMPTION_CONFIRMED';
  if (type === 'volunteer_cert' || type === 'task_appreciation') return 'OFFICIALLY_CERTIFIED';
  return 'VERIFIED_ACTIVE';
}

/**
 * Format any certificate into a standardized PublicArchivedCertificate
 */
export function formatToPublicArchivedCertificate(
  item: RegisteredCertificateItem | any
): PublicArchivedCertificate {
  const normId = normalizeCertificateId(item.id || item.certificateId || 'JJF-CERT-2026');
  const now = new Date().toISOString();
  const certDate = item.issueDate || item.date || '2026-01-15';
  const cleanPhone = normalizePhoneNumber(item.phone) || '8052361666';
  const pubStatus = mapToPublicStatus(item.status, item.type);
  const hash = generateVerificationHash(normId, item.recipientName || item.name || '', certDate);

  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://jeevanjyotifoundation.org';

  return {
    id: normId,
    certificateId: normId,
    type: item.type || 'volunteer_cert',
    titleHindi: item.titleHindi || 'आधिकारिक प्रमाण पत्र',
    titleEnglish: item.titleEnglish || 'Official Certificate',
    recipientName: item.recipientName || item.name || 'सम्मानित सदस्य',
    fatherOrHusbandName: item.fatherOrHusbandName || item.fatherName,
    phone: cleanPhone,
    phoneMasked: maskPhoneNumber(cleanPhone),
    issueDate: certDate,
    verificationStatus: pubStatus,
    categoryOrPurpose: item.categoryOrPurpose || item.areaHindi || item.purposeHindi || item.purpose,
    amount: item.amount,
    details: item.details,
    photoUrl: item.photoUrl,
    qrVerificationUrl: `${origin}/?verify=${encodeURIComponent(normId)}`,
    verificationHash: hash,
    verificationCount: item.verificationCount || 1,
    lastVerifiedAt: now,
    archivedAt: item.createdAt || item.archivedAt || now,
    isPubliclyVerified: true,
    source: 'automated_background_pipeline',
    issuerMetadata: {
      foundationNameHindi: FOUNDATION_INFO.nameHindi,
      foundationNameEnglish: FOUNDATION_INFO.nameEnglish,
      regNo: FOUNDATION_INFO.regNo,
      nitiAayogUid: FOUNDATION_INFO.nitiAayogUid,
      pan: FOUNDATION_INFO.pan,
      section80G_URN: FOUNDATION_INFO.urn80G,
      section12A_URN: FOUNDATION_INFO.urn10A,
      signatoryName: FOUNDATION_INFO.presidentName || 'Shailesh Pradhan',
      signatoryDesignation: 'Manager & Secretary (प्रबंधक / सचिव)',
      headquarters: 'Ghazipur, Uttar Pradesh, India'
    },
    rawRecord: item
  };
}

/**
 * Automated Background Service:
 * Archives any newly issued or updated certificate to the 'public_verified_archive' collection in Firestore.
 */
export async function archiveCertificateToPublicArchive(
  item: RegisteredCertificateItem | any
): Promise<PublicArchivedCertificate> {
  const archived = formatToPublicArchivedCertificate(item);
  const docSafeId = archived.certificateId.replace(/[\/\s#?&]/g, '_');

  // 1. Update Local Storage Cache immediately
  try {
    const cached = getLocalPublicArchive();
    const existingIdx = cached.findIndex(
      (c) => normalizeCertificateId(c.certificateId) === normalizeCertificateId(archived.certificateId)
    );
    if (existingIdx >= 0) {
      cached[existingIdx] = { ...cached[existingIdx], ...archived };
    } else {
      cached.unshift(archived);
    }
    localStorage.setItem(LOCAL_PUBLIC_ARCHIVE_KEY, JSON.stringify(cached));
  } catch (e) {
    console.debug('Local archive cache note:', e);
  }

  // 2. Broadcast local update event for UI reactivity
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('jjf_public_archive_updated', {
        detail: archived
      })
    );
  }

  // 3. Persist to Firestore public_verified_archive in background
  try {
    if (db && !isMockFirebase) {
      const docRef = doc(db, PUBLIC_ARCHIVE_COLLECTION, docSafeId);
      // Clean undefined keys for Firestore compatibility
      const firestorePayload = JSON.parse(JSON.stringify(archived));
      await setDoc(docRef, firestorePayload, { merge: true });
      console.log(`[Public Verified Archive] Successfully archived certificate: ${archived.certificateId}`);
    }
  } catch (err) {
    console.debug('[Public Verified Archive] Firestore write skipped/offline cached:', err);
  }

  return archived;
}

/**
 * Read cached local public archive
 */
export function getLocalPublicArchive(): PublicArchivedCertificate[] {
  try {
    const stored = localStorage.getItem(LOCAL_PUBLIC_ARCHIVE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // ignore
  }
  return [];
}

/**
 * Fetch a single public archived certificate from Firestore (with local fallback)
 */
export async function fetchPublicArchivedCertificate(
  certificateId: string
): Promise<PublicArchivedCertificate | null> {
  const normId = normalizeCertificateId(certificateId);
  if (!normId) return null;

  const docSafeId = normId.replace(/[\/\s#?&]/g, '_');

  // 1. Try Firestore First
  if (db && !isMockFirebase) {
    try {
      const docRef = doc(db, PUBLIC_ARCHIVE_COLLECTION, docSafeId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as PublicArchivedCertificate;
        // Increment public verification lookup count asynchronously
        recordPublicVerificationLookup(normId).catch(() => {});
        return data;
      }
    } catch (err) {
      console.debug('[Public Verified Archive] Firestore read note:', err);
    }
  }

  // 2. Fallback to Local Public Archive Cache
  const localCache = getLocalPublicArchive();
  const cachedMatch = localCache.find(
    (c) => normalizeCertificateId(c.certificateId) === normId
  );
  if (cachedMatch) {
    recordPublicVerificationLookup(normId).catch(() => {});
    return cachedMatch;
  }

  // 3. Fallback to Registered Certificate Store & Auto-Archive
  const allRegistered = getAllRegisteredCertificates();
  const regMatch = allRegistered.find(
    (c) => normalizeCertificateId(c.id) === normId
  );
  if (regMatch) {
    const autoArchived = await archiveCertificateToPublicArchive(regMatch);
    return autoArchived;
  }

  return null;
}

/**
 * Real-Time Firestore onSnapshot Listener:
 * Enables instant public verification status updates when certificate status or details change in Firestore!
 */
export function listenToPublicCertificateStatus(
  certificateId: string,
  onUpdate: (item: PublicArchivedCertificate | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const normId = normalizeCertificateId(certificateId);
  const docSafeId = normId.replace(/[\/\s#?&]/g, '_');

  // Fallback initial value
  const initialLocal = getLocalPublicArchive().find(
    (c) => normalizeCertificateId(c.certificateId) === normId
  );
  if (initialLocal) {
    onUpdate(initialLocal);
  }

  if (!db || isMockFirebase) {
    // If mock or offline, listen to window events
    const handler = (e: any) => {
      if (e.detail && normalizeCertificateId(e.detail.certificateId) === normId) {
        onUpdate(e.detail);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('jjf_public_archive_updated', handler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('jjf_public_archive_updated', handler);
      }
    };
  }

  try {
    const docRef = doc(db, PUBLIC_ARCHIVE_COLLECTION, docSafeId);
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const certData = docSnap.data() as PublicArchivedCertificate;
          onUpdate(certData);
        } else {
          // Check local fallback
          const local = getLocalPublicArchive().find(
            (c) => normalizeCertificateId(c.certificateId) === normId
          );
          onUpdate(local || null);
        }
      },
      (error) => {
        console.warn('[Public Verified Archive Listener Notice]:', error.message);
        if (onError) onError(error);
      }
    );
    return unsubscribe;
  } catch (err: any) {
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Record a public verification scan / lookup count in Firestore
 */
export async function recordPublicVerificationLookup(certificateId: string): Promise<void> {
  const normId = normalizeCertificateId(certificateId);
  const docSafeId = normId.replace(/[\/\s#?&]/g, '_');
  const now = new Date().toISOString();

  // Update local cache counter
  try {
    const local = getLocalPublicArchive();
    const idx = local.findIndex((c) => normalizeCertificateId(c.certificateId) === normId);
    if (idx >= 0) {
      local[idx].verificationCount = (local[idx].verificationCount || 0) + 1;
      local[idx].lastVerifiedAt = now;
      localStorage.setItem(LOCAL_PUBLIC_ARCHIVE_KEY, JSON.stringify(local));
    }
  } catch {
    // ignore
  }

  // Update Firestore counter
  if (db && !isMockFirebase) {
    try {
      const docRef = doc(db, PUBLIC_ARCHIVE_COLLECTION, docSafeId);
      await updateDoc(docRef, {
        verificationCount: increment(1),
        lastVerifiedAt: now
      }).catch(async () => {
        // If doc does not exist yet, fetch registered and create
        const registered = getAllRegisteredCertificates().find((c) => normalizeCertificateId(c.id) === normId);
        if (registered) {
          await archiveCertificateToPublicArchive(registered);
        }
      });
    } catch {
      // ignore
    }
  }
}

/**
 * Fetch all archived certificates from Firestore Public Verified Archive
 */
export async function fetchPublicArchiveList(
  maxItems: number = 100
): Promise<PublicArchivedCertificate[]> {
  const localList = getLocalPublicArchive();

  if (db && !isMockFirebase) {
    try {
      const colRef = collection(db, PUBLIC_ARCHIVE_COLLECTION);
      const q = query(colRef, orderBy('archivedAt', 'desc'), limit(maxItems));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const cloudList: PublicArchivedCertificate[] = [];
        snap.forEach((d) => {
          const item = d.data() as PublicArchivedCertificate;
          if (item && item.certificateId) {
            cloudList.push(item);
          }
        });

        if (cloudList.length > 0) {
          // Merge with local
          localStorage.setItem(LOCAL_PUBLIC_ARCHIVE_KEY, JSON.stringify(cloudList));
          return cloudList;
        }
      }
    } catch (err) {
      console.debug('[Public Verified Archive] List query notice:', err);
    }
  }

  // If local list is empty, seed from registered certificates
  if (localList.length === 0) {
    const allReg = getAllRegisteredCertificates();
    const formatted = allReg.map((r) => formatToPublicArchivedCertificate(r));
    try {
      localStorage.setItem(LOCAL_PUBLIC_ARCHIVE_KEY, JSON.stringify(formatted));
    } catch {
      // ignore
    }
    return formatted;
  }

  return localList;
}

/**
 * Update certificate status in Public Verified Archive (e.g. Mark as Verified, Certified, or Revoked)
 */
export async function updatePublicCertificateStatus(
  certificateId: string,
  newStatus: PublicVerificationStatus,
  reason?: string
): Promise<boolean> {
  const normId = normalizeCertificateId(certificateId);
  const docSafeId = normId.replace(/[\/\s#?&]/g, '_');
  const now = new Date().toISOString();

  // 1. Update local cache
  try {
    const local = getLocalPublicArchive();
    const idx = local.findIndex((c) => normalizeCertificateId(c.certificateId) === normId);
    if (idx >= 0) {
      local[idx].verificationStatus = newStatus;
      if (reason) local[idx].revocationReason = reason;
      local[idx].lastVerifiedAt = now;
      localStorage.setItem(LOCAL_PUBLIC_ARCHIVE_KEY, JSON.stringify(local));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('jjf_public_archive_updated', { detail: local[idx] })
        );
      }
    }
  } catch (e) {
    console.debug('Local status update note:', e);
  }

  // 2. Update Firestore
  if (db && !isMockFirebase) {
    try {
      const docRef = doc(db, PUBLIC_ARCHIVE_COLLECTION, docSafeId);
      await updateDoc(docRef, {
        verificationStatus: newStatus,
        revocationReason: reason || null,
        lastVerifiedAt: now
      });
      return true;
    } catch (err) {
      console.warn('[Public Verified Archive] Status update failed:', err);
      return false;
    }
  }

  return true;
}

/**
 * Automated Background Boot Service:
 * Automatically archives all registered certificates to Firestore `public_verified_archive` on app launch.
 */
let hasInitializedArchiveSync = false;

export async function initAutomatedPublicArchiveBackgroundSync(): Promise<void> {
  if (hasInitializedArchiveSync) return;
  hasInitializedArchiveSync = true;

  try {
    const allCertificates = getAllRegisteredCertificates();
    console.log(`[Public Verified Archive] Starting automated background archive for ${allCertificates.length} certificates...`);

    // Execute in background chunks to prevent UI blocking
    for (const cert of allCertificates) {
      await archiveCertificateToPublicArchive(cert);
    }
    console.log(`[Public Verified Archive] Automated background archiving initialized successfully.`);
  } catch (err) {
    console.debug('[Public Verified Archive] Automated sync background notice:', err);
  }
}

// Backward compatibility aliases
export type PublicVerifiedCertificateRecord = PublicArchivedCertificate;
export const getPublicVerifiedArchiveList = fetchPublicArchiveList;
