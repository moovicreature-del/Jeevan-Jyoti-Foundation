// ============================================================================
// JEEVAN JYOTI FOUNDATION - STAFF TYPES & INTERFACES
// जीवन ज्योति फाउंडेशन - स्टाफ मॉडल एवं डेटा प्रारूप
// ============================================================================

export type StaffStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'verified' | 'leave';

export interface StaffMember {
  id: string; // e.g. 'JJF-STF-2026-001'
  fullName: string;
  fullNameHindi?: string;
  fatherOrHusbandName: string;
  relationType: 'Father' | 'Husband';
  designation: string; // e.g. 'मुख्य परियोजना समन्वयक (Chief Project Coordinator)'
  designationHindi?: string;
  department: string; // e.g. 'शिक्षा व बाल कल्याण विभाग'
  mobile: string;
  email?: string;
  bloodGroup: string; // e.g. 'O+', 'B+', 'A+', 'AB+', 'O-', 'A-', 'B-', 'AB-'
  dateOfJoining: string; // e.g. '2024-04-15'
  dateOfBirth?: string;
  emergencyContact: string;
  aadhaarOrIdRef?: string;
  address: string;
  photoUrl: string;
  signatureUrl?: string;
  status: StaffStatus;
  statusUpdatedAt?: string;
  rejectionReason?: string;
  rejectedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  whatsappNotified?: boolean;
  whatsappNotifiedAt?: string;
  staffBadgeLevel: 'कोर टीम (Core Team)' | 'कार्यकारी स्टाफ (Executive Staff)' | 'वरिष्ठ अधिकारी (Lead Officer)';
  dutyLocation: string; // e.g. 'गाजीपुर मुख्य कार्यालय (Ghazipur HQ)'
  createdAt: string;
}

export type StaffCardTheme = 'maroon_gold' | 'navy_gold' | 'emerald_gold' | 'royal_purple';
export type StaffCardLanguage = 'hi' | 'en' | 'bilingual';
