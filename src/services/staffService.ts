// ============================================================================
// JEEVAN JYOTI FOUNDATION - STAFF REGISTRY & SERVICE
// जीवन ज्योति फाउंडेशन - स्टाफ प्रबंधन एवं सत्यापन सर्विस
// ============================================================================

import { StaffMember } from '../types/staff';
import { INITIAL_STAFF_MEMBERS } from '../data/initialStaffData';
import { saveCertificateToRegistry } from './certificateRegistryService';

const STAFF_STORAGE_KEY = 'jjf_staff_registry_v3';

/**
 * Get all registered staff members
 */
export function getAllStaffMembers(): StaffMember[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return INITIAL_STAFF_MEMBERS;
    }
    const saved = localStorage.getItem(STAFF_STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(INITIAL_STAFF_MEMBERS));
      // Also register initial staff into central public registry
      INITIAL_STAFF_MEMBERS.forEach((staff) => registerStaffIntoCentralRegistry(staff));
      return INITIAL_STAFF_MEMBERS;
    }
    const parsed: StaffMember[] = JSON.parse(saved);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(INITIAL_STAFF_MEMBERS));
      return INITIAL_STAFF_MEMBERS;
    }
    return parsed;
  } catch (err) {
    console.warn('Error reading staff registry from storage:', err);
    return INITIAL_STAFF_MEMBERS;
  }
}

/**
 * Register staff card into central verification registry for instant QR scanning
 */
function registerStaffIntoCentralRegistry(staff: StaffMember): void {
  try {
    const cleanPhone = (staff.mobile || '').replace(/[^0-9]/g, '').slice(-10);
    saveCertificateToRegistry({
      id: staff.id,
      type: 'volunteer_id',
      titleHindi: 'आधिकारिक स्टाफ डिजिटल पहचान पत्र',
      titleEnglish: 'Official Staff Identity Card',
      recipientName: staff.fullName,
      fatherOrHusbandName: staff.fatherOrHusbandName,
      phone: cleanPhone,
      issueDate: staff.dateOfJoining,
      categoryOrPurpose: `${staff.designation} • ${staff.department}`,
      photoUrl: staff.photoUrl,
      details: `स्टाफ आईडी: ${staff.id} • रक्त समूह: ${staff.bloodGroup} • पदनाम: ${staff.designation} • कार्यक्षेत्र: ${staff.dutyLocation}`,
      status: 'active'
    });
  } catch (err) {
    console.warn('Failed to sync staff into central verification registry:', err);
  }
}

/**
 * Generate unique sequential Staff ID: JJF-STF-2026-XXX
 */
export function generateNextStaffId(): string {
  const current = getAllStaffMembers();
  const year = new Date().getFullYear();
  let maxSeq = 5;

  current.forEach((m) => {
    const match = m.id.match(/JJF-STF-\d+-(\d+)/i);
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  });

  const nextSeq = String(maxSeq + 1).padStart(3, '0');
  return `JJF-STF-${year}-${nextSeq}`;
}

/**
 * Register a new staff member (default status: 'pending' awaiting Admin approval)
 */
export function registerNewStaffMember(
  data: Omit<StaffMember, 'id' | 'createdAt' | 'status'>,
  status: StaffMember['status'] = 'pending'
): StaffMember {
  const newStaffId = generateNextStaffId();
  const cleanMobile = data.mobile.replace(/[^0-9]/g, '').slice(-10);

  const newStaff: StaffMember = {
    ...data,
    id: newStaffId,
    mobile: cleanMobile,
    status,
    createdAt: new Date().toISOString()
  };

  const current = getAllStaffMembers();
  const updated = [newStaff, ...current];

  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(updated));
    // If auto-approved/active, register into central registry right away
    if (status === 'active' || status === 'approved') {
      registerStaffIntoCentralRegistry(newStaff);
    }
    // Notify listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jjf-staff-updated'));
    }
  } catch (err) {
    console.error('Failed to persist new staff:', err);
  }

  return newStaff;
}

/**
 * Get direct URL for staff member to download their ID card
 */
export function getStaffDownloadUrl(staffId: string): string {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin;
  return `${origin}/?downloadStaffCard=${encodeURIComponent(staffId)}`;
}

/**
 * Generate official WhatsApp message URL to send I-Card download link to staff member
 */
export function generateStaffApprovalWhatsAppUrl(staff: StaffMember): string {
  const cleanMobile = staff.mobile.replace(/[^0-9]/g, '').slice(-10);
  const downloadUrl = getStaffDownloadUrl(staff.id);

  const message = `*जीवन ज्योति फाउंडेशन (ग़ाज़ीपुर, उ.प्र.)*
*आधिकारिक स्टाफ पहचान पत्र स्वीकृति सूचना (Staff ID Approved)*

नमस्ते *${staff.fullName}* जी,
हार्दिक बधाई! जीवन ज्योति फाउंडेशन में आपका स्टाफ पंजीकरण एवं आधिकारिक डिजिटल पहचान पत्र संस्था प्रशासन (Admin) द्वारा *स्वीकृत (Approved)* कर दिया गया है।

🪪 *स्टाफ आईडी:* ${staff.id}
💼 *पदनाम:* ${staff.designation}
🏢 *विभाग:* ${staff.department}
📍 *कार्यक्षेत्र:* ${staff.dutyLocation}

📄 *अपना 2-Page प्रिंट-रेडी पहचान पत्र डाउनलोड करने का आधिकारिक लिंक:*
${downloadUrl}

🔒 *सुरक्षा निर्देश:* ऊपर दिए गए लिंक को खोलें और अपने रजिस्टर्ड मोबाइल नंबर (*+91 ${cleanMobile}*) पर प्राप्त OTP सत्यापित करके अपना पहचान पत्र तुरंत डाउनलोड करें।

- *प्रशासन, जीवन ज्योति फाउंडेशन*
मीरानपुर, मोहम्मदाबाद, जनपद गाजीपुर (उ.प्र.)
हेल्पलाइन: +91 8052361666`;

  return `https://wa.me/91${cleanMobile}?text=${encodeURIComponent(message)}`;
}

/**
 * Approve a staff member and activate their official ID card
 */
export function approveStaffMember(
  id: string,
  adminName: string = 'Admin'
): { staff: StaffMember; whatsappUrl: string } | null {
  const current = getAllStaffMembers();
  const index = current.findIndex((m) => m.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const nowIso = new Date().toISOString();
  const target = current[index];
  const updatedStaff: StaffMember = {
    ...target,
    status: 'approved',
    approvedAt: nowIso,
    statusUpdatedAt: nowIso,
    approvedBy: adminName,
    rejectionReason: undefined
  };

  current[index] = updatedStaff;

  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(current));
    // Register into public verification registry
    registerStaffIntoCentralRegistry(updatedStaff);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jjf-staff-updated'));
    }
  } catch (err) {
    console.error('Failed to update staff approval:', err);
  }

  const whatsappUrl = generateStaffApprovalWhatsAppUrl(updatedStaff);
  return { staff: updatedStaff, whatsappUrl };
}

/**
 * Reject a staff member registration with optional reason
 */
export function rejectStaffMember(
  id: string,
  reason: string = 'दस्तावेज या विवरण अपूर्ण होने के कारण'
): StaffMember | null {
  const current = getAllStaffMembers();
  const index = current.findIndex((m) => m.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return null;

  const nowIso = new Date().toISOString();
  const updatedStaff: StaffMember = {
    ...current[index],
    status: 'rejected',
    statusUpdatedAt: nowIso,
    rejectedAt: nowIso,
    rejectionReason: reason
  };

  current[index] = updatedStaff;

  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(current));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jjf-staff-updated'));
    }
  } catch (err) {
    console.error('Failed to reject staff:', err);
  }

  return updatedStaff;
}

/**
 * Mark staff as notified via WhatsApp
 */
export function markStaffWhatsAppNotified(id: string): void {
  const current = getAllStaffMembers();
  const index = current.findIndex((m) => m.id.toLowerCase() === id.toLowerCase());
  if (index === -1) return;

  current[index] = {
    ...current[index],
    whatsappNotified: true,
    whatsappNotifiedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(current));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jjf-staff-updated'));
    }
  } catch (err) {
    console.error('Failed to mark whatsapp notified:', err);
  }
}

/**
 * Delete staff member from registry
 */
export function deleteStaffMember(id: string): boolean {
  const current = getAllStaffMembers();
  const filtered = current.filter((m) => m.id.toLowerCase() !== id.toLowerCase());
  if (filtered.length === current.length) return false;

  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(filtered));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jjf-staff-updated'));
    }
    return true;
  } catch (err) {
    console.error('Failed to delete staff:', err);
    return false;
  }
}

/**
 * Find staff member by ID or 10-digit mobile number
 */
export function findStaffMember(query: string): StaffMember | null {
  if (!query) return null;
  const cleanQuery = query.trim().toLowerCase();
  const digitsOnly = query.replace(/[^0-9]/g, '');

  const all = getAllStaffMembers();

  // Search exact ID first
  const byId = all.find((m) => m.id.toLowerCase() === cleanQuery);
  if (byId) return byId;

  // Search by mobile (last 10 digits)
  if (digitsOnly.length >= 10) {
    const searchPhone = digitsOnly.slice(-10);
    const byPhone = all.find((m) => m.mobile.slice(-10) === searchPhone || (m.emergencyContact && m.emergencyContact.slice(-10) === searchPhone));
    if (byPhone) return byPhone;
  }

  // Search partial ID or Name
  const byPartial = all.find(
    (m) =>
      m.id.toLowerCase().includes(cleanQuery) ||
      m.fullName.toLowerCase().includes(cleanQuery) ||
      m.designation.toLowerCase().includes(cleanQuery)
  );

  return byPartial || null;
}
