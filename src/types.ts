export interface FoundationInfo {
  nameHindi: string;
  nameEnglish: string;
  taglineHindi: string;
  taglineEnglish: string;
  regNo: string;
  nitiAayogUid: string;
  pan: string;
  urn80G: string;
  urn10A: string;
  address: string;
  fullAddressHindi?: string;
  fullAddressEnglish?: string;
  village?: string;
  postOffice?: string;
  block?: string;
  district: string;
  state: string;
  country?: string;
  pincode: string;
  digipin?: string;
  phone: string;
  email: string;
  website: string;
  upiId: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
  bankBranch: string;
  presidentName: string;
  managerName: string;
  secretaryName: string;
  establishedYear: number;
  googleMapsUrl?: string;
  twitterHandle?: string;
  twitterUrl?: string;
  xHandle?: string;
  xUrl?: string;
  instagramHandle?: string;
  instagramUrl?: string;
}

export interface StructuredAddress {
  country: string;
  state: string;
  district: string;
  block: string;
  wardOrVillage: string;
  pincode?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  fatherName: string;
  relationType?: 'Father' | 'Husband' | 'Spouse' | 'Guardian';
  role: string;
  area: string;
  areaHindi: string;
  hoursContributed: number;
  tasksCompleted: number;
  joinDate: string;
  photoUrl?: string;
  bloodGroup?: string;
  badge?: string;
  status: 'active' | 'certified' | 'leader';
  rank?: number;
  phone?: string;
  whatsappConsent?: boolean;
  whatsappOptInAt?: string;
  country?: string;
  state?: string;
  district?: string;
  block?: string;
  wardOrVillage?: string;
}

export interface DonationRecord {
  id: string;
  receiptNo?: string;
  donorName: string;
  fatherName?: string;
  panNumber?: string;
  email?: string;
  phone?: string;
  whatsappConsent?: boolean;
  whatsappOptInAt?: string;
  address?: string;
  amount: number;
  amountInWords?: string;
  date: string;
  donationType?: 'one-time' | 'monthly';
  purpose: string;
  purposeHindi: string;
  paymentMode: string;
  transactionRef: string;
  transactionStatus?: 'verified' | 'pending' | 'failed';
  transactionHash?: string;
  taxExemptEligible: boolean;
  agree80GDeclaration?: boolean;
  photoUrl?: string;
  city?: string;
  country?: string;
  state?: string;
  district?: string;
  pincode?: string;
  block?: string;
  wardOrVillage?: string;
  status?: 'confirmed' | 'pending' | 'verified';
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  certificateUrl?: string;
  emailSent?: boolean;
  emailSentAt?: string;
}

export interface TaskRecord {
  id: string;
  title: string;
  titleHindi: string;
  category: 'education' | 'food' | 'health' | 'orphanage' | 'environment' | 'women';
  location: string;
  locationHindi?: string;
  date: string;
  points: number;
  hours: number;
  status: 'open' | 'completed' | 'in_progress';
  description: string;
  volunteersRequired?: number;
  volunteersAssigned?: number;
  photoUrl?: string;
}

export interface EventItem {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  date: string;
  location: string;
  category: string;
  beneficiariesCount: number;
  imageUrl: string;
}

export interface EventStory {
  id: string;
  title: string;
  titleHindi: string;
  date: string;
  description: string;
  beneficiariesCount: number;
  category: string;
  badgeText: string;
  imageUrl?: string;
  location?: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  nameHindi: string;
  avatar: string;
  hours: number;
  tasks: number;
  badge: string;
  area: string;
}

export interface LocationItem {
  id: string;
  name: string;
  nameHindi: string;
  type: 'school' | 'health_camp' | 'food_center' | 'headquarters';
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  beneficiaries: number;
  activeVolunteers: number;
  leadPerson: string;
  phone: string;
  googleMapsUrl?: string;
}

export interface CertificateData {
  certificateId: string;
  recipientName: string;
  fatherName?: string;
  roleOrCategory: string;
  issueDate: string;
  validTill?: string;
  hoursOrAmount?: string;
  qrVerifyUrl: string;
  foundationInfo: FoundationInfo;
  type: 'volunteer' | 'donation' | 'appreciation' | 'idcard' | 'annual_report' | 'festival_greeting';
}

export interface FestivalItem {
  id: string;
  nameHindi: string;
  nameEnglish: string;
  dateFormattedHindi: string;
  dateFormattedEnglish: string;
  monthHindi: string;
  monthEnglish: string;
  category: 'religious' | 'national' | 'cultural' | 'seasonal';
  symbolEmoji: string;
  themeColor: {
    primary: string;
    secondary: string;
    border: string;
    badgeBg: string;
    gradient: string;
    accent: string;
  };
  shloka: string;
  blessingHindi: string;
  blessingEnglish: string;
  defaultDedications: string[];
  // Thakur Prasad Panchang & Astronomical Fields
  tithiHindi?: string;
  tithiEnglish?: string;
  hinduMonthHindi?: string;
  hinduMonthEnglish?: string;
  paksha?: 'shukla' | 'krishna' | 'solar' | 'hijri';
  shubhMuhuratHindi?: string;
  nakshatraYoga?: string;
  gregorianDate?: string;
  samvatYearHindi?: string;
  thakurPrasadRef?: string;
  year?: number;
}

export interface FestivalGreetingRecord {
  id: string;
  festivalId: string;
  festivalNameHindi: string;
  festivalNameEnglish: string;
  recipientName: string;
  recipientTitle: string; // e.g. "सम्मानित नागरिक", "समर्पित स्वयंसेवक", "दानदाता एवं शुभचिंतक", "परिवार व सगे-संबंधी"
  senderName: string;
  photoUrl?: string;
  phone?: string;
  city: string;
  country?: string;
  state?: string;
  district?: string;
  block?: string;
  wardOrVillage?: string;
  customMessage?: string;
  date: string;
  shloka: string;
  category: string;
  symbolEmoji: string;
}

// ----------------------------------------------------
// एडमिन और सुपर एडमिन पोर्टल के लिए डेटा प्रकार (Types)
// ----------------------------------------------------

export type AdminRole = 'superadmin' | 'admin';

export interface AdminUser {
  uid: string;
  name: string;
  mobile: string;
  email: string;
  role: AdminRole;
  approved: boolean;
  createdAt: string;
  lastLogin?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface SliderPhotoItem {
  id: string;
  url: string;
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  date?: string;
  createdAt?: string;
}

export interface AppHomeContent {
  id?: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  missionText: string;
  footerText: string;
  bannerImageUrl: string;
  bannerImages?: string[]; // Array of multiple photo URLs
  sliderPhotos?: SliderPhotoItem[]; // Section 1: लाइव फ़ोटो स्लाइड्स (Live Photo Slides, up to 15)
  campaignGalleryPhotos?: SliderPhotoItem[]; // Section 2: ग़ाज़ीपुर सेवा अभियानों की लाइव फ़ोटो गैलरी (Campaign Live Gallery, up to 15)
  recentEventsPhotos?: SliderPhotoItem[]; // Section 3: हाल ही में आयोजित सेवा कार्यक्रम (Recent Events, up to 15)
  ruralWorkPhotos?: SliderPhotoItem[]; // Section 4: ग़ाज़ीपुर के ग्रामीण अंचलों में जीवन ज्योति का कार्य (Rural Work Field, up to 15)
  sliderAutoPlay?: boolean;
  sliderInterval?: number; // In seconds
  bannerVideoUrl: string;
  ruralWorkVideoUrl?: string; // Section 4: ग़ाज़ीपुर के ग्रामीण अंचलों में यूट्यूब वीडियो (HD Auto-play)
  bannerTitle?: string;
  bannerSubtitle?: string;
  appLogoUrl?: string;
  appThumbnailUrl?: string; // Website & App Social Share Thumbnail / OpenGraph / PWA Icon
  updatedBy: string;
  updatedAt: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  message: string;
  date: string;
  isActive: boolean;
  priority?: 'normal' | 'urgent' | 'high';
  updatedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DonationPaymentSettings {
  upiId: string;
  upiPayeeName: string;
  qrCodeMode: 'auto_generated' | 'custom_image';
  customQrImageUrl?: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
  bankBranch: string;
  panNumber?: string;
  urn80G?: string;
  urn10A?: string;
  nitiAayogUid?: string;
  contactPhone?: string;
  contactEmail?: string;
  donationNoteHindi?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface AdminActivityLog {
  id: string;
  adminUid: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
}

