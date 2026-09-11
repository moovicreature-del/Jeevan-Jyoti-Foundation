// ============================================================================
// JEEVAN JYOTI FOUNDATION - FIRESTORE DONATIONS & VOLUNTEERS BACKUP SERVICE
// क्लाउड फायरस्टोर दान एवं स्वयंसेवक डेटाबेस बैकअप सेवा (JSON एक्सपोर्ट)
// ============================================================================

import { collection, getDocs } from 'firebase/firestore';
import { db, isMockFirebase } from '../lib/firebase';
import { DonationRecord, Volunteer } from '../types';
import { DONORS_DATA } from '../data/donorsData';
import { INITIAL_VOLUNTEERS, INITIAL_TASKS } from '../data/taskData';
import { FOUNDATION_INFO } from '../data/foundationData';
import {
  getAllRegisteredCertificates,
  RegisteredCertificateItem,
  normalizeCertificateId
} from './certificateRegistryService';
import { fetchPublicArchiveList, PublicArchivedCertificate } from './publicVerifiedArchiveService';
import { logAdminActivity } from './adminService';

export interface BackupMetadata {
  backupTitle: string;
  backupVersion: string;
  backupType: 'MANUAL_TRIGGERED' | 'AUTOMATED_SCHEDULED';
  organization: {
    nameHindi: string;
    nameEnglish: string;
    regNo: string;
    nitiAayogUid: string;
    pan: string;
    urn80G: string;
    district: string;
    state: string;
    officialWebsite: string;
  };
  generatedAt: string;
  generatedBy: {
    name: string;
    uid: string;
    role?: string;
  };
  environment: string;
  checksumSha256?: string;
  summary: {
    totalDonations: number;
    totalDonationAmountInr: number;
    donationsWithPanCount: number;
    totalVolunteers: number;
    totalIssuedCertificates: number;
    totalPublicArchiveRecords: number;
    totalTasksCompletedByVolunteers: number;
  };
}

export interface FirestoreBackupPayload {
  metadata: BackupMetadata;
  donations: DonationRecord[];
  volunteers: Volunteer[];
  issuedCertificates: RegisteredCertificateItem[];
  publicVerifiedArchive: PublicArchivedCertificate[];
  tasksReference: typeof INITIAL_TASKS;
}

/**
 * Generate a quick cryptographic/hash signature for tamper-evidence
 */
async function computeJsonChecksum(dataString: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle && typeof TextEncoder !== 'undefined') {
    try {
      const msgUint8 = new TextEncoder().encode(dataString);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback below
    }
  }
  // Simple fallback hash
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `sha256-sim-${Math.abs(hash).toString(16)}`;
}

/**
 * Gather and compile all Firestore and Local Registry data for donations and volunteers
 */
export async function compileDonationsAndVolunteersBackup(adminInfo: {
  name: string;
  uid: string;
  role?: string;
}): Promise<FirestoreBackupPayload> {
  // 1. Fetch cloud issued certificates from Firestore
  let cloudCertificates: RegisteredCertificateItem[] = [];
  if (db && !isMockFirebase) {
    try {
      const colRef = collection(db, 'issued_certificates');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        snap.forEach((docSnap) => {
          const item = docSnap.data() as RegisteredCertificateItem;
          if (item && item.id) {
            cloudCertificates.push(item);
          }
        });
      }
    } catch (e) {
      console.warn('Backup: Note reading issued_certificates from Firestore:', e);
    }
  }

  // 2. Fetch public verified archive from Firestore / local service
  let publicArchiveRecords: PublicArchivedCertificate[] = [];
  try {
    publicArchiveRecords = await fetchPublicArchiveList(500);
  } catch (e) {
    console.warn('Backup: Note reading public archive:', e);
  }

  // 3. Compile Master Certificates list (Cloud + Local storage)
  const localCerts = getAllRegisteredCertificates();
  const certMap = new Map<string, RegisteredCertificateItem>();
  
  [...cloudCertificates, ...localCerts].forEach((item) => {
    const safeId = normalizeCertificateId(item.id);
    if (safeId && !certMap.has(safeId)) {
      certMap.set(safeId, item);
    }
  });
  const allCertificates = Array.from(certMap.values());

  // 4. Compile Master Donations List (From user storage, donorsData, and 80G certificates)
  let localUserDonations: DonationRecord[] = [];
  try {
    const rawDonations = localStorage.getItem('jjf_user_donations');
    if (rawDonations) {
      localUserDonations = JSON.parse(rawDonations);
    }
  } catch {
    // Ignore
  }

  const donationsMap = new Map<string, DonationRecord>();

  // Add pre-seeded donors
  DONORS_DATA.forEach((d) => {
    donationsMap.set(d.id, { ...d });
  });

  // Add user created donations
  localUserDonations.forEach((d) => {
    donationsMap.set(d.id, { ...d });
  });

  // Extract from issued 80G certificates if any rawDonation is present
  allCertificates.forEach((c) => {
    if (c.type === 'donation_80g') {
      if (c.rawDonation && c.rawDonation.id) {
        donationsMap.set(c.rawDonation.id, { ...c.rawDonation });
      } else {
        // Construct standard record from certificate
        const synthId = `DON-${c.id.replace(/[^a-zA-Z0-9]/g, '-')}`;
        if (!donationsMap.has(synthId)) {
          donationsMap.set(synthId, {
            id: synthId,
            receiptNo: c.id,
            donorName: c.recipientName,
            fatherName: c.fatherOrHusbandName || '',
            amount: c.amount || 1100,
            date: c.issueDate || '2026-01-01',
            purpose: c.categoryOrPurpose || 'Child Education & Healthcare',
            purposeHindi: c.details || 'शिक्षा एवं स्वास्थ्य सेवा',
            paymentMode: 'Online UPI / Bank',
            transactionRef: `TXN-${c.id.slice(-6)}`,
            taxExemptEligible: true,
            phone: c.phone || ''
          });
        }
      }
    }
  });

  const masterDonationsList = Array.from(donationsMap.values());

  // 5. Compile Master Volunteers List
  const volunteersMap = new Map<string, Volunteer>();

  // Add pre-seeded volunteers
  INITIAL_VOLUNTEERS.forEach((v) => {
    volunteersMap.set(v.id, { ...v });
  });

  // Add from volunteer certificates and ID cards
  allCertificates.forEach((c) => {
    if (c.type === 'volunteer_cert' || c.type === 'volunteer_id') {
      if (c.rawVolunteer && c.rawVolunteer.id) {
        volunteersMap.set(c.rawVolunteer.id, { ...c.rawVolunteer });
      } else {
        const volId = `VOL-${c.phone.slice(-4) || '2026'}`;
        if (!volunteersMap.has(volId)) {
          volunteersMap.set(volId, {
            id: volId,
            name: c.recipientName,
            fatherName: c.fatherOrHusbandName || 'श्री संरक्षक',
            relationType: 'Father',
            role: c.categoryOrPurpose || 'वरिष्ठ समाज सेवी / स्वयंसेवक',
            area: 'Ghazipur Rural & Urban',
            areaHindi: 'गाज़ीपुर ग्रामीण व नगर क्षेत्र',
            hoursContributed: 48,
            tasksCompleted: 6,
            joinDate: c.issueDate || '2026-01-15',
            status: 'certified',
            phone: c.phone,
            photoUrl: c.photoUrl
          });
        }
      }
    }
  });

  const masterVolunteersList = Array.from(volunteersMap.values());

  // Compute metrics
  const totalDonationsAmount = masterDonationsList.reduce((sum, d) => sum + (d.amount || 0), 0);
  const donorsWithPan = masterDonationsList.filter((d) => d.panNumber && d.panNumber.length === 10).length;
  const totalTasks = masterVolunteersList.reduce((sum, v) => sum + (v.tasksCompleted || 0), 0);

  const nowIso = new Date().toISOString();

  const metadata: BackupMetadata = {
    backupTitle: 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुर - दानदाता व स्वयंसेवक पूर्ण फायरस्टोर डेटाबेस बैकअप',
    backupVersion: '2.0.0-PROD',
    backupType: 'MANUAL_TRIGGERED',
    organization: {
      nameHindi: FOUNDATION_INFO.nameHindi,
      nameEnglish: FOUNDATION_INFO.nameEnglish,
      regNo: FOUNDATION_INFO.regNo,
      nitiAayogUid: FOUNDATION_INFO.nitiAayogUid,
      pan: FOUNDATION_INFO.pan,
      urn80G: FOUNDATION_INFO.urn80G,
      district: FOUNDATION_INFO.district,
      state: FOUNDATION_INFO.state,
      officialWebsite: FOUNDATION_INFO.website
    },
    generatedAt: nowIso,
    generatedBy: {
      name: adminInfo.name || 'सिस्टम व्यवस्थापक',
      uid: adminInfo.uid || 'admin',
      role: adminInfo.role || 'Super Admin'
    },
    environment: 'production-cloud-firestore',
    summary: {
      totalDonations: masterDonationsList.length,
      totalDonationAmountInr: totalDonationsAmount,
      donationsWithPanCount: donorsWithPan,
      totalVolunteers: masterVolunteersList.length,
      totalIssuedCertificates: allCertificates.length,
      totalPublicArchiveRecords: publicArchiveRecords.length,
      totalTasksCompletedByVolunteers: totalTasks
    }
  };

  const payloadWithoutChecksum: FirestoreBackupPayload = {
    metadata,
    donations: masterDonationsList,
    volunteers: masterVolunteersList,
    issuedCertificates: allCertificates,
    publicVerifiedArchive: publicArchiveRecords,
    tasksReference: INITIAL_TASKS
  };

  // Compute Checksum
  const checksum = await computeJsonChecksum(JSON.stringify(payloadWithoutChecksum));
  payloadWithoutChecksum.metadata.checksumSha256 = checksum;

  return payloadWithoutChecksum;
}

/**
 * Triggers a download of the compiled backup as a formatted JSON file
 */
export function downloadBackupJsonFile(payload: FirestoreBackupPayload): string {
  const jsonContent = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const dateStamp = new Date().toISOString().slice(0, 10);
  const timeStamp = new Date().toTimeString().slice(0, 8).replace(/:/g, '');
  const fileName = `JJF_Firestore_Backup_Donations_Volunteers_${dateStamp}_${timeStamp}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);

  // Store timestamp of last backup in localStorage
  try {
    localStorage.setItem('jjf_last_backup_timestamp', new Date().toISOString());
    localStorage.setItem('jjf_last_backup_meta', JSON.stringify({
      fileName,
      totalDonations: payload.metadata.summary.totalDonations,
      totalVolunteers: payload.metadata.summary.totalVolunteers,
      totalCertificates: payload.metadata.summary.totalIssuedCertificates,
      checksum: payload.metadata.checksumSha256
    }));
  } catch {
    // Ignore
  }

  return fileName;
}

/**
 * Complete action to trigger manual backup and record audit log in firestore
 */
export async function executeManualDatabaseBackup(adminInfo: {
  name: string;
  uid: string;
  role?: string;
}): Promise<{
  fileName: string;
  payload: FirestoreBackupPayload;
  summary: BackupMetadata['summary'];
}> {
  const payload = await compileDonationsAndVolunteersBackup(adminInfo);
  const fileName = downloadBackupJsonFile(payload);

  // Log action in Firestore Admin Logs
  try {
    await logAdminActivity({
      adminUid: adminInfo.uid,
      adminName: adminInfo.name,
      action: 'DATABASE_BACKUP_JSON_EXPORT',
      details: `फायरस्टोर डेटाबेस बैकअप डाउनलोड: ${payload.metadata.summary.totalDonations} दान रिकॉर्ड (₹${payload.metadata.summary.totalDonationAmountInr.toLocaleString('en-IN')}) एवं ${payload.metadata.summary.totalVolunteers} स्वयंसेवक (${fileName})`
    });
  } catch (err) {
    console.warn('Logging backup activity warning:', err);
  }

  return {
    fileName,
    payload,
    summary: payload.metadata.summary
  };
}
