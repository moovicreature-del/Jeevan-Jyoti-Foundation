// ============================================================================
// JEEVAN JYOTI FOUNDATION - STAFF TYPES & INTERFACES
// जीवन ज्योति फाउंडेशन - स्टाफ मॉडल एवं डेटा प्रारूप
// ============================================================================

export type StaffStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'verified' | 'leave';

export type StaffRelationType =
  | 'So'        // S/o (सुपुत्र)
  | 'Do'        // D/o (सुपुत्री)
  | 'Wo'        // W/o (पत्नी)
  | 'Father'    // पिता
  | 'Husband';  // पति

export const RELATION_PREFIX_OPTIONS: { value: StaffRelationType; label: string; shortEn: string; shortHi: string }[] = [
  { value: 'So', label: 'S/o (सुपुत्र)', shortEn: 'S/o', shortHi: 'सुपुत्र' },
  { value: 'Do', label: 'D/o (सुपुत्री)', shortEn: 'D/o', shortHi: 'सुपुत्री' },
  { value: 'Wo', label: 'W/o (पत्नी)', shortEn: 'W/o', shortHi: 'प/नि (पत्नी)' },
  { value: 'Father', label: 'पिता (Father)', shortEn: 'S/o', shortHi: 'पिता' },
  { value: 'Husband', label: 'पति (Husband)', shortEn: 'W/o', shortHi: 'पति' },
];

export function formatRelationLabel(
  relationType: StaffRelationType | string | undefined,
  name: string,
  lang: 'hi' | 'en' | 'bilingual' = 'hi'
): string {
  const cleanName = name || '';
  switch (relationType) {
    case 'So':
      if (lang === 'en') return `S/o: ${cleanName}`;
      if (lang === 'bilingual') return `S/o / सुपुत्र: ${cleanName}`;
      return `सुपुत्र: ${cleanName}`;
    case 'Do':
      if (lang === 'en') return `D/o: ${cleanName}`;
      if (lang === 'bilingual') return `D/o / सुपुत्री: ${cleanName}`;
      return `सुपुत्री: ${cleanName}`;
    case 'Wo':
      if (lang === 'en') return `W/o: ${cleanName}`;
      if (lang === 'bilingual') return `W/o / पत्नी: ${cleanName}`;
      return `प/नि: ${cleanName}`;
    case 'Husband':
      if (lang === 'en') return `W/o: ${cleanName}`;
      if (lang === 'bilingual') return `W/o / पति: ${cleanName}`;
      return `पति: ${cleanName}`;
    case 'Father':
    default:
      if (lang === 'en') return `S/o: ${cleanName}`;
      if (lang === 'bilingual') return `S/o / पिता: ${cleanName}`;
      return `पिता: ${cleanName}`;
  }
}

export interface StaffMember {
  id: string; // e.g. 'JJF-STF-2026-001'
  fullName: string;
  fullNameHindi?: string;
  fatherOrHusbandName: string;
  relationType: StaffRelationType;
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
