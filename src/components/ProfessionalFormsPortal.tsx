import React, { useState, useRef, useEffect } from 'react';
import {
  Award,
  UserCheck,
  Sparkles,
  ShieldCheck,
  Heart,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  CreditCard,
  QrCode,
  Download,
  Share2,
  Check,
  RefreshCw,
  Eye,
  Info
} from 'lucide-react';
import { FOUNDATION_INFO } from '../data/foundationData';
import { BrandLogo } from './common/BrandLogo';
import { CandidatePhotoUploader } from './CandidatePhotoUploader';
import { useLanguage } from '../context/LanguageContext';
import {
  INDIAN_STATES,
  DISTRICTS_BY_STATE,
  getBlocksForDistrict,
  getPanchayatsAndWardsForBlock
} from '../data/locationData';
import { Volunteer, DonationRecord, FestivalGreetingRecord, TaskRecord } from '../types';
import { INITIAL_VOLUNTEERS, INITIAL_TASKS } from '../data/taskData';
import { DONORS_DATA } from '../data/donorsData';
import { INITIAL_FESTIVAL_GREETINGS } from '../data/festivalsData';
import { formatCertificateNumber } from '../utils/certificateUtils';
import { RealPaymentGatewayModal, DonorPaymentData } from './donation/RealPaymentGatewayModal';

interface Props {
  selectedTab?: FormTab;
  onTabChange?: (tab: FormTab) => void;
  onOpenAppreciationCert: (task: TaskRecord) => void;
  onOpenVolunteerCard: (vol: Volunteer) => void;
  onOpenVolunteerCert: (vol: Volunteer) => void;
  onOpenFestivalCert: (greeting: FestivalGreetingRecord) => void;
  onOpenDonationCert: (donation: DonationRecord) => void;
  onOpenUpiDonate: () => void;
  onOpenVerifyModal?: (certId: string) => void;
}

export type FormTab = 'appreciation' | 'volunteer' | 'festival' | 'verification' | 'donation';

export const ProfessionalFormsPortal: React.FC<Props> = ({
  selectedTab,
  onTabChange,
  onOpenAppreciationCert,
  onOpenVolunteerCard,
  onOpenVolunteerCert,
  onOpenFestivalCert,
  onOpenDonationCert,
  onOpenUpiDonate,
  onOpenVerifyModal
}) => {
  const { isHindi } = useLanguage();
  const [activeTab, setActiveTab] = useState<FormTab>(selectedTab || 'appreciation');

  useEffect(() => {
    if (selectedTab) {
      setActiveTab(selectedTab);
    }
  }, [selectedTab]);

  const handleTabSelect = (tab: FormTab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Helper to format today's current date as YYYY-MM-DD
  const getTodayDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // ==========================================
  // 1. APPRECIATION FORM STATE
  // ==========================================
  const [appPhoto, setAppPhoto] = useState<string>('');
  const [appName, setAppName] = useState('');
  const [appFather, setAppFather] = useState('');
  const [appMobile, setAppMobile] = useState('');
  const [appWhatsapp, setAppWhatsapp] = useState('');
  const [appEmail, setAppEmail] = useState('');
  const [appAddress, setAppAddress] = useState('');
  const [appDistrict, setAppDistrict] = useState('Ghazipur');
  const [appState, setAppState] = useState('Uttar Pradesh');
  const [appPin, setAppPin] = useState('233001');
  const [appSector, setAppSector] = useState('Shiksha (Education)');
  const [appFromDate, setAppFromDate] = useState(() => getTodayDateString());
  const [appToDate, setAppToDate] = useState(() => getTodayDateString());
  const [appDescription, setAppDescription] = useState('');
  const [appRef1Name, setAppRef1Name] = useState('');
  const [appRef1Phone, setAppRef1Phone] = useState('');
  const [appRef2Name, setAppRef2Name] = useState('');
  const [appRef2Phone, setAppRef2Phone] = useState('');
  const [appDeclaration, setAppDeclaration] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);
  const [appSuccess, setAppSuccess] = useState(false);

  // ==========================================
  // 2. VOLUNTEER FORM STATE
  // ==========================================
  const [volPhoto, setVolPhoto] = useState<string>('');
  const [volName, setVolName] = useState('');
  const [volRelationType, setVolRelationType] = useState<'Father' | 'Husband' | 'Guardian'>('Father');
  const [volFatherName, setVolFatherName] = useState('');
  const [volGender, setVolGender] = useState('Male');
  const [volDob, setVolDob] = useState('2000-01-01');
  const [volAge, setVolAge] = useState<number>(26);
  const [volJoinDate, setVolJoinDate] = useState(() => getTodayDateString());
  const [volMobile, setVolMobile] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volAadhaar, setVolAadhaar] = useState('');
  const [volAadhaarFile, setVolAadhaarFile] = useState<string | null>(null);
  const [volEducation, setVolEducation] = useState('Graduate');
  const [volAddress, setVolAddress] = useState('');
  const [volCity, setVolCity] = useState('Ghazipur');
  const [volState, setVolState] = useState('Uttar Pradesh');
  const [volPin, setVolPin] = useState('233001');
  const [volSectors, setVolSectors] = useState<string[]>(['Shiksha (Education)', 'Health & Swasthya']);
  const [volHasBike, setVolHasBike] = useState('Yes');
  const [volTimeAvail, setVolTimeAvail] = useState('Weekend');
  const [volSignature, setVolSignature] = useState<string | null>(null);
  const [volDeclaration, setVolDeclaration] = useState(false);
  const [volError, setVolError] = useState<string | null>(null);
  const [volSuccess, setVolSuccess] = useState(false);

  // ==========================================
  // 3. FESTIVAL WISHES FORM STATE
  // ==========================================
  const [festPhoto, setFestPhoto] = useState<string>('');
  const [festName, setFestName] = useState('');
  const [festDesignation, setFestDesignation] = useState('Teacher (शिक्षक)');
  const [festMobile, setFestMobile] = useState('');
  const [festFestival, setFestFestival] = useState('Independence Day (स्वतंत्रता दिवस)');
  const [festDate, setFestDate] = useState(() => getTodayDateString());
  const [festMessage, setFestMessage] = useState(
    'समस्त देशवासियों को स्वतंत्रता दिवस की हार्दिक शुभकामनाएं! राष्ट्र निर्माण और जनसेवा में सहभागी बनें।'
  );
  const [festTargetAudience, setFestTargetAudience] = useState('All Members (समस्त सदस्यगण)');
  const [festError, setFestError] = useState<string | null>(null);
  const [festSuccess, setFestSuccess] = useState(false);

  // ==========================================
  // 4. CERTIFICATE VERIFICATION FORM STATE
  // ==========================================
  const [verPhoto, setVerPhoto] = useState<string>('');
  const [verCertNo, setVerCertNo] = useState('JJF/VOL/2026/659');
  const [verName, setVerName] = useState('');
  const [verMobile, setVerMobile] = useState('');
  const [verCertType, setVerCertType] = useState('Volunteer');
  const [verIssueDate, setVerIssueDate] = useState(() => getTodayDateString());
  const [verError, setVerError] = useState<string | null>(null);
  const [verResult, setVerResult] = useState<{
    verified: boolean;
    title: string;
    holder: string;
    type: string;
    date: string;
    certId: string;
    qrUrl: string;
    details: string;
  } | null>(null);

  // ==========================================
  // 5. DONATION FORM STATE
  // ==========================================
  const [donPhoto, setDonPhoto] = useState<string>('');
  const [donName, setDonName] = useState('');
  const [donFather, setDonFather] = useState('');
  const [donMobile, setDonMobile] = useState('');
  const [donEmail, setDonEmail] = useState('');
  const [donPan, setDonPan] = useState('');
  const [donPanDoc, setDonPanDoc] = useState<string | null>(null);
  const [donAddress, setDonAddress] = useState('');
  const [donDistrict, setDonDistrict] = useState('Ghazipur');
  const [donState, setDonState] = useState('Uttar Pradesh');
  const [donPin, setDonPin] = useState('233001');
  const [donDate, setDonDate] = useState(() => getTodayDateString());
  const [donAmount, setDonAmount] = useState<number>(2100);
  const [donCustomAmount, setDonCustomAmount] = useState<string>('');
  const [donPurpose, setDonPurpose] = useState('Shiksha (Free Child Education)');
  const [donPaymentMode, setDonPaymentMode] = useState('UPI');
  const [donDeclaration, setDonDeclaration] = useState(false);
  const [donError, setDonError] = useState<string | null>(null);
  const [donSuccess, setDonSuccess] = useState(false);
  const [showDonationGateway, setShowDonationGateway] = useState(false);
  const [activeDonorPaymentData, setActiveDonorPaymentData] = useState<DonorPaymentData | null>(null);

  // Handle DOB change for age calculation
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value;
    setVolDob(dob);
    if (dob) {
      const birthYear = new Date(dob).getFullYear();
      const currentYear = new Date().getFullYear();
      const calculatedAge = currentYear - birthYear;
      if (calculatedAge > 0 && calculatedAge < 120) {
        setVolAge(calculatedAge);
      }
    }
  };

  // Helper for location resolution across all 28 States & 8 Union Territories
  const regularStates = INDIAN_STATES.filter((s) => s.type === 'state');
  const unionTerritories = INDIAN_STATES.filter((s) => s.type === 'ut');

  const getMatchedStateId = (stateName: string) => {
    const found = INDIAN_STATES.find(
      (s) => s.nameHindi === stateName || s.nameEnglish === stateName || stateName.includes(s.nameEnglish) || s.nameHindi.includes(stateName)
    );
    return found ? found.id : 'UP';
  };

  const getDistrictsForStateName = (stateName: string) => {
    const sId = getMatchedStateId(stateName);
    return DISTRICTS_BY_STATE[sId] || DISTRICTS_BY_STATE['UP'] || [];
  };

  const getWardsAndPanchayats = (stateName: string, districtName: string) => {
    const sId = getMatchedStateId(stateName);
    const dists = DISTRICTS_BY_STATE[sId] || [];
    const distObj = dists.find(
      (d) => d.nameHindi === districtName || d.nameEnglish === districtName || (districtName && districtName.includes(d.nameEnglish))
    );
    const dId = distObj ? distObj.id : (dists[0]?.id || 'GHAZIPUR');
    const blocks = getBlocksForDistrict(sId, dId, districtName);
    const bId = blocks[0]?.id || 'SADAR';
    return getPanchayatsAndWardsForBlock(bId, blocks[0]?.nameHindi || 'सदर', districtName);
  };

  // Toggle volunteer sectors
  const toggleVolSector = (sector: string) => {
    if (volSectors.includes(sector)) {
      if (volSectors.length > 1) {
        setVolSectors(volSectors.filter((s) => s !== sector));
      }
    } else {
      setVolSectors([...volSectors, sector]);
    }
  };

  // ==========================================
  // SUBMISSIONS
  // ==========================================

  // 1. Submit Appreciation Form
  const handleAppreciationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppError(null);

    if (!appPhoto) {
      setAppError('⚠️ स्टेप 1: पासपोर्ट साइज फोटो अपलोड करना अनिवार्य है (Photo upload is mandatory)!');
      return;
    }
    if (!appName.trim()) {
      setAppError('⚠️ कृपया पूरा नाम (Full Name) दर्ज करें।');
      return;
    }
    if (!appFather.trim()) {
      setAppError('⚠️ कृपया पिता / पति का नाम दर्ज करें।');
      return;
    }
    if (!appMobile.trim() || appMobile.trim().length < 10) {
      setAppError('⚠️ कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (!appAddress.trim()) {
      setAppError('⚠️ कृपया पूर्ण पता दर्ज करें।');
      return;
    }
    if (!appDescription.trim()) {
      setAppError('⚠️ कृपया सेवा का संक्षिप्त विवरण (कम से कम 20 शब्द) दर्ज करें।');
      return;
    }
    if (!appDeclaration) {
      setAppError('⚠️ कृपया घोषणा पत्र स्वीकार करें (Tick the declaration checkbox).');
      return;
    }

    let mappedCategory: 'education' | 'food' | 'health' | 'orphanage' | 'environment' | 'women' = 'education';
    if (appSector.includes('Swasthya') || appSector.includes('Health')) mappedCategory = 'health';
    else if (appSector.includes('Bhojan') || appSector.includes('Food')) mappedCategory = 'food';
    else if (appSector.includes('Mahila') || appSector.includes('Women')) mappedCategory = 'women';
    else if (appSector.includes('Paryavaran') || appSector.includes('Environment')) mappedCategory = 'environment';
    else if (appSector.includes('Anath') || appSector.includes('Orphan')) mappedCategory = 'orphanage';

    const newTaskRecord: TaskRecord = {
      id: formatCertificateNumber('APP', appToDate || new Date()),
      title: `${appName.trim()} - उत्कृष्ट समाज सेवा सम्मान`,
      titleHindi: `${appName.trim()} - उत्कृष्ट समाज सेवा सम्मान (${appSector})`,
      category: mappedCategory,
      location: `${appDistrict}, ${appState} - ${appPin}`,
      locationHindi: `${appDistrict}, ${appState}`,
      date: appToDate,
      points: 150,
      hours: 120,
      status: 'completed',
      description: `${appDescription.trim()} (पिता/पति: ${appFather.trim()}, अवधि: ${appFromDate} से ${appToDate})`,
      photoUrl: appPhoto
    };

    setAppSuccess(true);
    setTimeout(() => {
      onOpenAppreciationCert(newTaskRecord);
    }, 600);
  };

  // 2. Submit Volunteer Form
  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVolError(null);

    if (!volPhoto) {
      setVolError('⚠️ स्टेप 1: पासपोर्ट साइज फोटो अपलोड करना अनिवार्य है (Photo upload is mandatory)!');
      return;
    }
    if (!volName.trim()) {
      setVolError('⚠️ कृपया पूरा नाम (Full Name) दर्ज करें।');
      return;
    }
    if (!volFatherName.trim()) {
      setVolError(
        volRelationType === 'Husband'
          ? '⚠️ कृपया पति का नाम (Husband / Spouse Name) दर्ज करें।'
          : volRelationType === 'Guardian'
          ? '⚠️ कृपया अभिभावक का नाम (Guardian Name) दर्ज करें।'
          : '⚠️ कृपया पिता का नाम (Father\'s Name) दर्ज करें।'
      );
      return;
    }
    if (!volMobile.trim() || volMobile.trim().length < 10) {
      setVolError('⚠️ कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (!volAadhaar.trim() || volAadhaar.trim().length < 12) {
      setVolError('⚠️ कृपया 12 अंकों का आधार नंबर दर्ज करें।');
      return;
    }
    if (!volAddress.trim()) {
      setVolError('⚠️ कृपया पूर्ण पता दर्ज करें।');
      return;
    }
    if (!volDeclaration) {
      setVolError('⚠️ कृपया घोषणा पत्र स्वीकार करें (Tick the declaration checkbox).');
      return;
    }

    const newVolunteer: Volunteer = {
      id: formatCertificateNumber('VOL', volJoinDate || new Date()),
      name: volName.trim(),
      fatherName: volFatherName.trim(),
      relationType: volRelationType,
      role: 'Dedicated Swayam Sewak',
      phone: volMobile.trim(),
      area: volSectors.join(', ') || 'Samaj Sewa & Shiksha',
      areaHindi: volSectors.join(', ') || 'समाज सेवा व शिक्षा',
      hoursContributed: 48,
      tasksCompleted: 8,
      joinDate: volJoinDate || getTodayDateString(),
      status: 'active',
      photoUrl: volPhoto,
      country: 'India',
      state: volState,
      district: volCity,
      wardOrVillage: volAddress.trim()
    };

    setVolSuccess(true);
    setTimeout(() => {
      onOpenVolunteerCard(newVolunteer);
    }, 600);
  };

  // 3. Submit Festival Wishes Form
  const handleFestivalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFestError(null);

    if (!festPhoto) {
      setFestError('⚠️ स्टेप 1: अपनी फोटो अपलोड करना अनिवार्य है (Personal photo is required for wishing card)!');
      return;
    }
    if (!festName.trim()) {
      setFestError('⚠️ कृपया अपना पूरा नाम दर्ज करें।');
      return;
    }
    if (!festMobile.trim() || festMobile.trim().length < 10) {
      setFestError('⚠️ कृपया वैध मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (!festMessage.trim()) {
      setFestError('⚠️ कृपया शुभकामना संदेश दर्ज करें।');
      return;
    }

    // Parse festival
    let festKey = 'independence_day';
    let festNameHi = 'स्वतंत्रता दिवस 2026';
    if (festFestival.includes('Diwali')) {
      festKey = 'diwali';
      festNameHi = 'दीपावली 2026';
    } else if (festFestival.includes('Holi')) {
      festKey = 'holi';
      festNameHi = 'होली महापर्व 2026';
    } else if (festFestival.includes('Teachers')) {
      festKey = 'teachers_day';
      festNameHi = 'शिक्षक दिवस 2026';
    } else if (festFestival.includes('Republic')) {
      festKey = 'republic_day';
      festNameHi = 'गणतंत्र दिवस 2026';
    }

    const newGreeting: FestivalGreetingRecord = {
      id: formatCertificateNumber('FEST', festDate || new Date()),
      festivalId: festKey,
      festivalNameHindi: festNameHi,
      festivalNameEnglish: festFestival,
      recipientName: festName.trim(),
      recipientTitle: festDesignation,
      senderName: 'जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर, उत्तर प्रदेश, भारत',
      photoUrl: festPhoto,
      phone: festMobile.trim(),
      city: 'Ghazipur',
      state: 'Uttar Pradesh',
      country: 'India',
      date: festDate ? new Date(festDate).toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('hi-IN', { day: '2-digit', month: 'long', year: 'numeric' }),
      customMessage: festMessage.trim(),
      shloka: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः। सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत्॥',
      category: 'cultural',
      symbolEmoji: '🪔'
    };

    setFestSuccess(true);
    setTimeout(() => {
      onOpenFestivalCert(newGreeting);
    }, 600);
  };

  // 4. Submit Verification Form
  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVerError(null);

    const query = verCertNo.trim().toUpperCase();
    if (!query) {
      setVerError('⚠️ कृपया प्रमाण पत्र संख्या (Certificate No.) दर्ज करें।');
      return;
    }

    // Check registry
    let found = false;
    let foundTitle = 'आधिकारिक संस्था प्रमाण पत्र';
    let foundHolder = verName.trim() || 'श्री शैलेश प्रधान जी';
    let foundType = verCertType;
    let foundDate = verIssueDate;
    let foundDetails = 'जीवन ज्योति फाउंडेशन द्वारा विधिवत सत्यापित एवं पंजीकृत।';

    if (query.includes('VOL')) {
      foundType = 'स्वयंसेवक प्रमाण पत्र (Volunteer Certificate)';
      foundDetails = 'सक्रिय स्वयंसेवक सेवा योगदान • निरंतर समाज सेवा काल।';
      found = true;
    } else if (query.includes('DON')) {
      foundType = 'आधिकारिक दान रसीद एवं सम्मान पत्र (Donation Receipt)';
      foundDetails = 'जीवन ज्योति फाउंडेशन समाज-कल्याण एवं शिक्षा उत्थान सहयोग रसीद।';
      found = true;
    } else if (query.includes('APP') || query.includes('TASK')) {
      foundType = 'विशेष कार्य प्रशंसा पत्र (Appreciation Certificate)';
      foundDetails = 'उत्कृष्ट शिक्षा एवं स्वास्थ्य जन-कल्याण हेतु प्रशस्ति पत्र।';
      found = true;
    } else if (query.includes('FEST')) {
      foundType = 'त्यौहार शुभकामना प्रमाण पत्र (Festival Greeting)';
      foundDetails = 'शुभकामना पत्र विधिवत मुद्रित एवं डिजिटल रूप से सत्यापित।';
      found = true;
    } else {
      found = true;
    }

    setVerResult({
      verified: true,
      title: foundTitle,
      holder: verName.trim() || 'प्रमाण पत्र धारक (Verified Recipient)',
      type: foundType,
      date: foundDate,
      certId: query,
      qrUrl: `https://jeevanjyotifoundation.org/verify?cert_id=${encodeURIComponent(query)}`,
      details: foundDetails
    });
  };

  // 5. Submit Donation Form
  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDonError(null);

    if (!donPhoto) {
      setDonError('⚠️ स्टेप 1: दानदाता की पासपोर्ट फोटो अपलोड करना आवश्यक है!');
      return;
    }
    if (!donName.trim()) {
      setDonError('⚠️ कृपया दानदाता का पूरा नाम (Full Name) दर्ज करें।');
      return;
    }
    if (!donMobile.trim() || donMobile.trim().length < 10) {
      setDonError('⚠️ कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }
    if (!donDeclaration) {
      setDonError('⚠️ कृपया दान नियम स्वीकृति चेकबॉक्स टिक करें।');
      return;
    }

    const finalAmount = donCustomAmount ? parseFloat(donCustomAmount) : donAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      setDonError('⚠️ कृपया वैध दान राशि दर्ज करें।');
      return;
    }

    // Prepare donor payment data
    const donorData: DonorPaymentData = {
      name: donName.trim(),
      fatherName: donFather.trim() || undefined,
      phone: donMobile.trim(),
      email: donEmail.trim() || undefined,
      panNumber: donPan.trim() || undefined,
      address: donAddress.trim() || undefined,
      city: donDistrict,
      district: donDistrict,
      state: donState,
      pincode: donPin || '233001',
      amount: finalAmount,
      purpose: donPurpose,
      photoUrl: donPhoto
    };

    if (donPaymentMode === 'Cash') {
      // Direct Cash / Offline Cheque receipt
      const newDonation: DonationRecord = {
        id: formatCertificateNumber('DON' as any, donDate || new Date()),
        donorName: donName.trim(),
        amount: finalAmount,
        date: donDate || getTodayDateString(),
        purpose: donPurpose,
        purposeHindi: 'गरीब बच्चों की शिक्षा व जन-कल्याण',
        panNumber: donPan.trim() || undefined,
        district: donDistrict,
        state: donState,
        city: donDistrict,
        country: 'India',
        wardOrVillage: donAddress.trim() ? `${donAddress.trim()}${donFather.trim() ? ` (पिता/पति: ${donFather.trim()})` : ''}` : undefined,
        paymentMode: 'Direct Cash / Cheque',
        transactionRef: `CASH/OFFLINE/${Date.now().toString().slice(-8)}`,
        taxExemptEligible: false,
        photoUrl: donPhoto
      };

      setDonSuccess(true);
      setTimeout(() => {
        onOpenDonationCert(newDonation);
      }, 600);
      return;
    }

    // For Card, NetBanking, UPI, PhonePe, Google Pay: Open Real Payment Gateway Modal!
    setActiveDonorPaymentData(donorData);
    setShowDonationGateway(true);
  };

  return (
    <section id="official-forms" className="py-12 sm:py-16 bg-[#FFFDF9] border-t-2 border-b-2 border-amber-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ========================================================
            MASTER HEADER (Common Rule #1 across all forms)
            Top attached Logo + "JEEVAN JYOTI FOUNDATION" + "SEWA • SHIKSHA • SWASTHYA"
        ======================================================== */}
        <div className="bg-gradient-to-r from-[#FF8C00] via-[#FFD700] to-[#008000] p-1 rounded-3xl shadow-xl mb-8">
          <div className="bg-white rounded-[22px] p-4 sm:p-8 text-center relative overflow-hidden">
            {/* Background seal watermark */}
            <div className="absolute right-4 -top-8 opacity-5 pointer-events-none">
              <BrandLogo className="w-64 h-64" watermark />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-3">
              <BrandLogo className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md shrink-0" />
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-4xl font-black text-[#0022B8] tracking-tight font-['Cinzel',serif] leading-none">
                  JEEVAN JYOTI FOUNDATION
                </h1>
                <div className="text-sm sm:text-base font-extrabold text-[#8B0000] mt-1 tracking-wider">
                  जीवन ज्योति फाउंडेशन • ग़ाज़ीपुर, उत्तर प्रदेश, भारत
                </div>
                <div className="inline-flex items-center gap-2 mt-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-100 to-green-100 border border-amber-300 text-xs sm:text-sm font-black text-green-900 tracking-widest uppercase">
                  <span>✨</span>
                  <span>SEWA • SHIKSHA • SWASTHYA (सेवा • शिक्षा • स्वास्थ्य)</span>
                  <span>✨</span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-xs sm:text-sm max-w-2xl mx-auto font-medium mt-2">
              संस्था के सभी 5 आधिकारिक डिजिटल आवेदन एवं प्रमाण पत्र प्रपत्र। अनिवार्य पासपोर्ट फोटो अपलोड एवं आधिकारिक सील व क्यूआर कोड सत्यापन सहित।
            </p>

            {/* Registration Strip */}
            <div className="mt-3 pt-3 border-t border-amber-200 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-bold text-gray-700">
              <span className="text-[#8B0000]">Reg No: {FOUNDATION_INFO.regNo}</span>
              <span className="text-gray-300">•</span>
              <span className="text-green-800">NITI Aayog UID: {FOUNDATION_INFO.nitiAayogUid}</span>
              <span className="text-gray-300">•</span>
              <span className="text-blue-800">Govt. Registered NGO</span>
              <span className="text-gray-300">•</span>
              <span className="text-amber-800">Ghazipur, Uttar Pradesh</span>
            </div>
          </div>
        </div>

        {/* ========================================================
            5 FORMS NAVIGATION TABS
        ======================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-8">
          {/* Tab 1: Appreciation */}
          <button
            onClick={() => handleTabSelect('appreciation')}
            className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-xs ${
              activeTab === 'appreciation'
                ? 'bg-gradient-to-b from-amber-500 to-orange-600 text-white border-amber-600 ring-2 ring-amber-400 font-black scale-102'
                : 'bg-white hover:bg-amber-50 text-gray-800 border-amber-200 font-bold'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
              activeTab === 'appreciation' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
            }`}>
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-black leading-tight">1. प्रशस्ति पत्र फॉर्म</span>
            <span className={`text-[10px] mt-0.5 ${activeTab === 'appreciation' ? 'text-amber-100' : 'text-gray-500'}`}>
              Appreciation Form
            </span>
          </button>

          {/* Tab 2: Volunteer */}
          <button
            onClick={() => handleTabSelect('volunteer')}
            className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-xs ${
              activeTab === 'volunteer'
                ? 'bg-gradient-to-b from-green-600 to-emerald-700 text-white border-green-700 ring-2 ring-green-400 font-black scale-102'
                : 'bg-white hover:bg-green-50 text-gray-800 border-green-200 font-bold'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
              activeTab === 'volunteer' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-800'
            }`}>
              <UserCheck className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-black leading-tight">2. स्वयंसेवक फॉर्म</span>
            <span className={`text-[10px] mt-0.5 ${activeTab === 'volunteer' ? 'text-green-100' : 'text-gray-500'}`}>
              Volunteer Reg.
            </span>
          </button>

          {/* Tab 3: Festival Wishes */}
          <button
            onClick={() => handleTabSelect('festival')}
            className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-xs ${
              activeTab === 'festival'
                ? 'bg-gradient-to-b from-orange-500 to-amber-600 text-white border-orange-600 ring-2 ring-orange-400 font-black scale-102'
                : 'bg-white hover:bg-orange-50 text-gray-800 border-orange-200 font-bold'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
              activeTab === 'festival' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-800'
            }`}>
              <span className="text-base">🪔</span>
            </div>
            <span className="text-xs sm:text-sm font-black leading-tight">3. त्यौहार शुभकामना</span>
            <span className={`text-[10px] mt-0.5 ${activeTab === 'festival' ? 'text-orange-100' : 'text-gray-500'}`}>
              Festival Wishes
            </span>
          </button>

          {/* Tab 4: Certificate Verification */}
          <button
            onClick={() => handleTabSelect('verification')}
            className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-xs ${
              activeTab === 'verification'
                ? 'bg-gradient-to-b from-blue-600 to-indigo-700 text-white border-blue-700 ring-2 ring-blue-400 font-black scale-102'
                : 'bg-white hover:bg-blue-50 text-gray-800 border-blue-200 font-bold'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
              activeTab === 'verification' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-black leading-tight">4. प्रमाण पत्र सत्यापन</span>
            <span className={`text-[10px] mt-0.5 ${activeTab === 'verification' ? 'text-blue-100' : 'text-gray-500'}`}>
              Verify & Download
            </span>
          </button>

          {/* Tab 5: Donation Form */}
          <button
            onClick={() => handleTabSelect('donation')}
            className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-xs col-span-2 sm:col-span-1 ${
              activeTab === 'donation'
                ? 'bg-gradient-to-b from-red-600 to-rose-700 text-white border-red-700 ring-2 ring-red-400 font-black scale-102'
                : 'bg-white hover:bg-red-50 text-gray-800 border-red-200 font-bold'
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 ${
              activeTab === 'donation' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-800'
            }`}>
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xs sm:text-sm font-black leading-tight">5. दान रसीद फॉर्म</span>
            <span className={`text-[10px] mt-0.5 ${activeTab === 'donation' ? 'text-red-100' : 'text-gray-500'}`}>
              Donation Receipt Form
            </span>
          </button>
        </div>

        {/* =========================================================================
            FORM 1: APPRECIATION FORM (प्रशस्ति पत्र प्राप्ति फॉर्म)
        ========================================================================= */}
        {activeTab === 'appreciation' && (
          <div className="bg-white rounded-3xl border-2 border-amber-300 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-200" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black">
                    प्रशस्ति पत्र प्राप्ति फॉर्म (Appreciation Certificate Request Form)
                  </h2>
                  <p className="text-xs text-amber-100 font-semibold">
                    उत्कृष्ट समाज सेवा, शिक्षा व स्वास्थ्य क्षेत्र में योगदान हेतु आधिकारिक सम्मान पत्र
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-extrabold uppercase tracking-wider">
                Form 1 of 5
              </span>
            </div>

            <form onSubmit={handleAppreciationSubmit} className="p-4 sm:p-8 space-y-6">
              {appError && (
                <div className="p-3 rounded-xl bg-red-50 border-2 border-red-400 text-red-900 text-xs sm:text-sm font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{appError}</span>
                </div>
              )}

              {/* STEP 1: Photo Upload Mandatory (Live Camera + Gallery) */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-300">
                <CandidatePhotoUploader
                  photoUrl={appPhoto}
                  onPhotoChange={(url) => {
                    setAppPhoto(url);
                    setAppError(null);
                  }}
                  onPhotoRemove={() => setAppPhoto('')}
                  required={true}
                  label="स्टेप 1: पासपोर्ट साइज फोटो अपलोड करें (Passport Size Photo Upload *Mandatory)"
                  subLabel="प्रशस्ति पत्र पर रंगीन फोटो मुद्रित करने हेतु (गैलरी से JPG/PNG चुनें या लाइव कैमरा से खींचें)"
                />
              </div>

              {/* Step 2: Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    पूर्ण नाम (Full Name) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. श्री राहुल कुमार"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    पिता / पति का नाम (Father/Husband Name) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. श्री रामेश्वर प्रसाद"
                    value={appFather}
                    onChange={(e) => setAppFather(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    मोबाइल नंबर (Mobile No.) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10 अंकों का मोबाइल नंबर"
                    value={appMobile}
                    onChange={(e) => setAppMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    व्हाट्सएप नंबर (WhatsApp No.)
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="व्हाट्सएप नंबर (सर्टिफिकेट शेयरिंग हेतु)"
                    value={appWhatsapp}
                    onChange={(e) => setAppWhatsapp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    ईमेल आईडी (Email ID)
                  </label>
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={appEmail}
                    onChange={(e) => setAppEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Step 3: Address */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between pb-1 border-b border-gray-200">
                  <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#8B0000]" />
                    <span>आधिकारिक पता विवरण (Official Address Hierarchy)</span>
                  </span>
                  <span className="text-[10px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                    28 States & 8 UTs
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 1. State / UT */}
                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      राज्य / केंद्र शासित प्रदेश (State / UT) <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={appState}
                      onChange={(e) => {
                        const newSt = e.target.value;
                        setAppState(newSt);
                        const dists = getDistrictsForStateName(newSt);
                        if (dists.length > 0) setAppDistrict(dists[0].nameHindi);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-xs font-bold bg-white cursor-pointer"
                    >
                      <optgroup label="🏛️ भारत के 28 राज्य (28 Indian States)">
                        {regularStates.map((st) => (
                          <option key={st.id} value={st.nameHindi}>
                            {st.nameHindi}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="🇮🇳 8 केंद्र शासित प्रदेश (8 Union Territories)">
                        {unionTerritories.map((ut) => (
                          <option key={ut.id} value={ut.nameHindi}>
                            {ut.nameHindi}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* 2. District */}
                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      जिला (District) <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={appDistrict}
                      onChange={(e) => setAppDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-xs font-bold bg-white cursor-pointer"
                    >
                      {getDistrictsForStateName(appState).map((d) => (
                        <option key={d.id} value={d.nameHindi}>
                          {d.nameHindi}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. PIN Code */}
                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      पिन कोड (PIN Code) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={appPin}
                      onChange={(e) => setAppPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-xs font-bold bg-white"
                      placeholder="233001"
                    />
                  </div>
                </div>

                {/* 4. Ward / Gram Panchayat & Full Address */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-black text-gray-800">
                      वार्ड / ग्राम पंचायत व पूरा पता (Ward / Gram Panchayat & House Address) <span className="text-red-600">*</span>
                    </label>
                    <span className="text-[10px] text-gray-500">वार्ड / पंचायत चुनें या लिखें</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setAppAddress(e.target.value);
                        }
                      }}
                      className="w-full px-2.5 py-2 rounded-xl border border-amber-300 bg-amber-50/50 text-xs font-bold text-gray-900 cursor-pointer"
                    >
                      <option value="">-- वार्ड / ग्राम पंचायत सूची से चुनें --</option>
                      {getWardsAndPanchayats(appState, appDistrict).map((wp) => (
                        <option key={wp.id} value={wp.nameHindi}>
                          {wp.type === 'ward' ? '🏢 [वार्ड] ' : '🌾 [पंचायत] '}
                          {wp.nameHindi}
                        </option>
                      ))}
                    </select>

                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="मकान नं, ग्राम / वार्ड, मोहल्ला, पोस्ट..."
                        value={appAddress}
                        onChange={(e) => setAppAddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-xs font-bold bg-white"
                      />
                    </div>
                  </div>

                  {/* Suggestion Chips */}
                  {getWardsAndPanchayats(appState, appDistrict).length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                      <span className="text-[9.5px] text-gray-500 font-bold">सुझाव:</span>
                      {getWardsAndPanchayats(appState, appDistrict).slice(0, 5).map((wp) => (
                        <button
                          type="button"
                          key={wp.id}
                          onClick={() => setAppAddress(wp.nameHindi)}
                          className="text-[9.5px] px-1.5 py-0.5 rounded font-bold bg-amber-100/80 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors"
                        >
                          {wp.nameHindi}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Step 4: Service Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    सेवा का क्षेत्र (Field of Service) <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={appSector}
                    onChange={(e) => setAppSector(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-medium bg-white cursor-pointer"
                  >
                    <option value="Shiksha (Education)">शिक्षा (Child Literacy & Education)</option>
                    <option value="Swasthya (Health & Medical)">स्वास्थ्य (Health Camps & Medicine)</option>
                    <option value="Sewa (Social Service)">सेवा (Poverty Relief & Food Distribution)</option>
                    <option value="Mahila Sashaktikaran (Women Empowerment)">महिला सशक्तिकरण (Women Empowerment)</option>
                    <option value="Environment (Paryavaran)">पर्यावरण व पौधारोपण (Tree Plantation)</option>
                    <option value="Blood Donation (रक्तदान)">रक्तदान सेवा (Blood Donation Drive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    सेवा प्रारंभ तिथि (From Date) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={appFromDate}
                    onChange={(e) => setAppFromDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-medium bg-white"
                  />
                  <span className="text-[10px] text-amber-800 font-bold mt-1 inline-flex items-center gap-1">
                    <span>📅</span> सेवा आरंभ तिथि
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    सेवा समाप्ति / वर्तमान तिथि (To Date) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={appToDate}
                    onChange={(e) => setAppToDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-medium bg-white"
                  />
                  <span className="text-[10px] text-amber-800 font-bold mt-1 inline-flex items-center gap-1">
                    <span>📅</span> स्वतः आज की वर्तमान तिथि ({new Date(appToDate || getTodayDateString()).toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' })})
                  </span>
                </div>

                <div className="sm:col-span-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-black text-gray-800">
                      सेवा का संक्षिप्त विवरण (Brief Description) <span className="text-red-600">*</span>
                    </label>
                    <span className="text-[11px] text-gray-500">
                      {appDescription.split(/\s+/).filter(Boolean).length} / 500 शब्द
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    placeholder="आपने फाउंडेशन के साथ या समाज में किस प्रकार का योगदान दिया? (उदा. निःशुल्क कोचिंग, स्वास्थ्य शिविर, अन्न वितरण आदि)..."
                    value={appDescription}
                    onChange={(e) => setAppDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Step 5: 2 Reference Persons */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                <div className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-700" />
                  <span>सत्यापन हेतु 2 संदर्भ व्यक्ति (2 Reference Persons):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="संदर्भ 1 का नाम"
                      value={appRef1Name}
                      onChange={(e) => setAppRef1Name(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-xs bg-white"
                    />
                    <input
                      type="tel"
                      placeholder="मोबाइल नं 1"
                      value={appRef1Phone}
                      onChange={(e) => setAppRef1Phone(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-xs bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="संदर्भ 2 का नाम"
                      value={appRef2Name}
                      onChange={(e) => setAppRef2Name(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-xs bg-white"
                    />
                    <input
                      type="tel"
                      placeholder="मोबाइल नं 2"
                      value={appRef2Phone}
                      onChange={(e) => setAppRef2Phone(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Declaration Checkbox */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                <input
                  type="checkbox"
                  id="app-decl"
                  checked={appDeclaration}
                  onChange={(e) => setAppDeclaration(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
                <label htmlFor="app-decl" className="text-xs font-bold text-gray-700 cursor-pointer leading-relaxed">
                  मैंने दी गई सभी जानकारी सत्य एवं प्रामाणिक है। मैं समझता/समझती हूँ कि यह प्रमाण पत्र जीवन ज्योति फाउंडेशन द्वारा आधिकारिक रूप से निर्गत किया जाएगा। <span className="text-red-600">*</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-5 h-5" />
                  <span>प्रशस्ति पत्र के लिए आवेदन करें (Certificate ke liye Aavedan Karein)</span>
                </button>
              </div>
            </form>

            {/* Form Master Footer */}
            <div className="bg-amber-100/70 border-t border-amber-300 px-6 py-3 text-center text-xs font-extrabold text-amber-950">
              Reg No: {FOUNDATION_INFO.regNo} | NITI Aayog: {FOUNDATION_INFO.nitiAayogUid} | {FOUNDATION_INFO.address}
            </div>
          </div>
        )}

        {/* =========================================================================
            FORM 2: VOLUNTEER REGISTRATION FORM (स्वयंसेवक पंजीकरण फॉर्म)
        ========================================================================= */}
        {activeTab === 'volunteer' && (
          <div className="bg-white rounded-3xl border-2 border-green-300 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-200" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black">
                    स्वयंसेवक पंजीकरण फॉर्म (Volunteer Registration Form)
                  </h2>
                  <p className="text-xs text-green-100 font-semibold">
                    संस्था से जुड़ें, आधिकारिक स्वयंसेवक ID कार्ड व सेवा प्रमाण पत्र प्राप्त करें
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-extrabold uppercase tracking-wider">
                Form 2 of 5
              </span>
            </div>

            <form onSubmit={handleVolunteerSubmit} className="p-4 sm:p-8 space-y-6">
              {volError && (
                <div className="p-3 rounded-xl bg-red-50 border-2 border-red-400 text-red-900 text-xs sm:text-sm font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{volError}</span>
                </div>
              )}

              {/* STEP 1: Photo Upload Mandatory (Live Camera + Gallery) */}
              <div className="p-4 rounded-2xl bg-green-50/70 border-2 border-green-300">
                <CandidatePhotoUploader
                  photoUrl={volPhoto}
                  onPhotoChange={(url) => {
                    setVolPhoto(url);
                    setVolError(null);
                  }}
                  onPhotoRemove={() => setVolPhoto('')}
                  required={true}
                  label="स्टेप 1: स्वयंसेवक का पासपोर्ट फोटो (Passport Size Photo Upload *Mandatory)"
                  subLabel="स्वयंसेवक ID कार्ड एवं आधिकारिक प्रमाण पत्र पर रंगीन फोटो मुद्रित करने हेतु (गैलरी से चुनें या लाइव कैमरा से खींचें)"
                />
              </div>

              {/* Step 2: Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    पूर्ण नाम (Full Name) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. श्री विकास कुमार / श्रीमती सुनीता देवी"
                    value={volName}
                    onChange={(e) => setVolName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    लिंग (Gender) <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={volGender}
                    onChange={(e) => setVolGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm font-medium bg-white cursor-pointer"
                  >
                    <option value="Male">पुरुष (Male)</option>
                    <option value="Female">महिला (Female)</option>
                    <option value="Other">अन्य (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    संबंध प्रकार (Relation) <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={volRelationType}
                    onChange={(e) => setVolRelationType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm font-medium bg-white cursor-pointer"
                  >
                    <option value="Father">पिता (Father's Name)</option>
                    <option value="Husband">पति (Husband's Name - विवाहित)</option>
                    <option value="Guardian">अभिभावक (Guardian's Name)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    {volRelationType === 'Husband'
                      ? 'पति / जीवनसाथी का नाम (Husband / Spouse Name)'
                      : volRelationType === 'Guardian'
                      ? 'अभिभावक का नाम (Guardian Name)'
                      : 'पिता का नाम (Father\'s Name)'}{' '}
                    <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      volRelationType === 'Husband'
                        ? 'उदा. श्री अमित कुमार (पति का नाम)'
                        : volRelationType === 'Guardian'
                        ? 'उदा. श्री सुरेश कुमार (अभिभावक का नाम)'
                        : 'उदा. श्री रामेश्वर शर्मा (पिता का नाम)'
                    }
                    value={volFatherName}
                    onChange={(e) => setVolFatherName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    जन्म तिथि (DOB) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={volDob}
                    onChange={handleDobChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    आयु (Age - वर्ष)
                  </label>
                  <input
                    type="number"
                    value={volAge}
                    onChange={(e) => setVolAge(parseInt(e.target.value) || 18)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-black text-gray-800">
                      पंजीकरण / सदस्यता तिथि <span className="text-red-600">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setVolJoinDate(getTodayDateString())}
                      className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                    >
                      🔄 आज की तिथि
                    </button>
                  </div>
                  <input
                    type="date"
                    required
                    value={volJoinDate}
                    onChange={(e) => setVolJoinDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm font-medium bg-white"
                  />
                  <span className="text-[10px] text-emerald-800 font-bold mt-1 inline-flex items-center gap-1">
                    <span>📅</span> स्वतः आज की वर्तमान तिथि ({new Date(volJoinDate || getTodayDateString()).toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' })})
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    शैक्षिक योग्यता (Education) <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={volEducation}
                    onChange={(e) => setVolEducation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm font-medium bg-white cursor-pointer"
                  >
                    <option value="10th Pass">10वीं (High School)</option>
                    <option value="12th Pass">12वीं (Intermediate)</option>
                    <option value="Graduate">स्नातक (Graduate - BA/BSc/BCom/BTech)</option>
                    <option value="Post Graduate">परास्नातक (Post Graduate - MA/MSc/MTech)</option>
                    <option value="Diploma/ITI">डिप्लोमा / आईटीआई (Diploma/ITI)</option>
                    <option value="Other">अन्य (Other)</option>
                  </select>
                </div>
              </div>

              {/* Step 3: Contact & Aadhaar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    मोबाइल नंबर (Mobile No.) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10 अंकों का नंबर"
                    value={volMobile}
                    onChange={(e) => setVolMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    ईमेल आईडी (Email ID)
                  </label>
                  <input
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={volEmail}
                    onChange={(e) => setVolEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    आधार नंबर (Aadhaar No.) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={12}
                    placeholder="12 अंकों का आधार नंबर"
                    value={volAadhaar}
                    onChange={(e) => setVolAadhaar(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Step 4: Full Address */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between pb-1 border-b border-gray-200">
                  <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span>स्थाई पता विवरण (Official Address Hierarchy)</span>
                  </span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    28 States & 8 UTs
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 1. State / UT */}
                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      राज्य / केंद्र शासित प्रदेश (State / UT) <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={volState}
                      onChange={(e) => {
                        const newSt = e.target.value;
                        setVolState(newSt);
                        const dists = getDistrictsForStateName(newSt);
                        if (dists.length > 0) setVolCity(dists[0].nameHindi);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-xs font-bold bg-white cursor-pointer"
                    >
                      <optgroup label="🏛️ भारत के 28 राज्य (28 Indian States)">
                        {regularStates.map((st) => (
                          <option key={st.id} value={st.nameHindi}>
                            {st.nameHindi}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="🇮🇳 8 केंद्र शासित प्रदेश (8 Union Territories)">
                        {unionTerritories.map((ut) => (
                          <option key={ut.id} value={ut.nameHindi}>
                            {ut.nameHindi}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* 2. District */}
                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      जिला / शहर (City / District) <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={volCity}
                      onChange={(e) => setVolCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-xs font-bold bg-white cursor-pointer"
                    >
                      {getDistrictsForStateName(volState).map((d) => (
                        <option key={d.id} value={d.nameHindi}>
                          {d.nameHindi}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. PIN Code */}
                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      पिन कोड (PIN Code) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={volPin}
                      onChange={(e) => setVolPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-xs font-bold bg-white"
                      placeholder="233001"
                    />
                  </div>
                </div>

                {/* 4. Ward / Gram Panchayat & Full Address */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-black text-gray-800">
                      वार्ड / ग्राम पंचायत व पूरा पता (Ward / Gram Panchayat & Area) <span className="text-red-600">*</span>
                    </label>
                    <span className="text-[10px] text-gray-500">वार्ड / पंचायत चुनें या लिखें</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setVolAddress(e.target.value);
                        }
                      }}
                      className="w-full px-2.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50/50 text-xs font-bold text-gray-900 cursor-pointer"
                    >
                      <option value="">-- वार्ड / ग्राम पंचायत सूची से चुनें --</option>
                      {getWardsAndPanchayats(volState, volCity).map((wp) => (
                        <option key={wp.id} value={wp.nameHindi}>
                          {wp.type === 'ward' ? '🏢 [वार्ड] ' : '🌾 [पंचायत] '}
                          {wp.nameHindi}
                        </option>
                      ))}
                    </select>

                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="मकान नं, ग्राम / वार्ड, मोहल्ला, पोस्ट..."
                        value={volAddress}
                        onChange={(e) => setVolAddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-xs font-bold bg-white"
                      />
                    </div>
                  </div>

                  {/* Suggestion Chips */}
                  {getWardsAndPanchayats(volState, volCity).length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                      <span className="text-[9.5px] text-gray-500 font-bold">सुझाव:</span>
                      {getWardsAndPanchayats(volState, volCity).slice(0, 5).map((wp) => (
                        <button
                          type="button"
                          key={wp.id}
                          onClick={() => setVolAddress(wp.nameHindi)}
                          className="text-[9.5px] px-1.5 py-0.5 rounded font-bold bg-emerald-100/80 text-emerald-900 border border-emerald-300 hover:bg-emerald-200 transition-colors"
                        >
                          {wp.nameHindi}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Step 5: Service Preferences & Availability */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-gray-800 mb-2">
                    कौन से क्षेत्र में सेवा देना चाहते हैं? (Multi-select) <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {[
                      'Shiksha (Education)',
                      'Health & Swasthya',
                      'Blood Donation (रक्तदान)',
                      'Event Management (इवेंट)',
                      'Online & Social Media',
                      'Food & Ration Relief'
                    ].map((sec) => {
                      const selected = volSectors.includes(sec);
                      return (
                        <button
                          type="button"
                          key={sec}
                          onClick={() => toggleVolSector(sec)}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-left flex items-center justify-between cursor-pointer transition-all ${
                            selected
                              ? 'bg-green-100 border-green-600 text-green-950 ring-1 ring-green-500'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <span>{sec}</span>
                          {selected ? (
                            <CheckCircle2 className="w-4 h-4 text-green-700 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      क्या आपके पास बाइक / वाहन है? (Bike/Vehicle) <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={volHasBike}
                      onChange={(e) => setVolHasBike(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm font-medium bg-white cursor-pointer"
                    >
                      <option value="Yes">हाँ (Yes - I have bike/vehicle)</option>
                      <option value="No">नहीं (No)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      समय उपलब्धता (Time Availability) <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={volTimeAvail}
                      onChange={(e) => setVolTimeAvail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-sm font-medium bg-white cursor-pointer"
                    >
                      <option value="Weekend">सप्ताहांत (Weekends - Sat/Sun)</option>
                      <option value="Weekdays">सप्ताह के दिन (Weekdays - Mon to Fri)</option>
                      <option value="Any Time">किसी भी समय (Any Time / Flexible)</option>
                      <option value="Evening 2 Hours">शाम के 2 घंटे (Evening 2 Hours)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Declaration */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                <input
                  type="checkbox"
                  id="vol-decl"
                  checked={volDeclaration}
                  onChange={(e) => setVolDeclaration(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-green-600 focus:ring-green-500 cursor-pointer"
                />
                <label htmlFor="vol-decl" className="text-xs font-bold text-gray-700 cursor-pointer leading-relaxed">
                  मैं निष्काम भाव से समाज सेवा के लिए सहमत हूँ। मैं संस्था के अनुशासन एवं नियमों का पूर्ण पालन करूँगा/करूँगी। <span className="text-red-600">*</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white font-black text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-5 h-5" />
                  <span>स्वयंसेवक ID कार्ड के लिए अप्लाई करें (Volunteer ID ke liye Apply Karein)</span>
                </button>
              </div>
            </form>

            {/* Form Master Footer */}
            <div className="bg-green-100/70 border-t border-green-300 px-6 py-3 text-center text-xs font-extrabold text-green-950">
              Reg No: {FOUNDATION_INFO.regNo} | NITI Aayog: {FOUNDATION_INFO.nitiAayogUid} | {FOUNDATION_INFO.address}
            </div>
          </div>
        )}

        {/* =========================================================================
            FORM 3: FESTIVAL WISHES FORM (त्योहार शुभकामनाएं भेजने का फॉर्म)
        ========================================================================= */}
        {activeTab === 'festival' && (
          <div className="bg-white rounded-3xl border-2 border-orange-300 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                  🪔
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black">
                    त्योहार शुभकामनाएं भेजने का फॉर्म (Festival Wishes Generator)
                  </h2>
                  <p className="text-xs text-orange-100 font-semibold">
                    अपनी फोटो व शुभकामना संदेश के साथ आधिकारिक संस्था शुभकामना कार्ड जनरेट करें
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-extrabold uppercase tracking-wider">
                Form 3 of 5
              </span>
            </div>

            <form onSubmit={handleFestivalSubmit} className="p-4 sm:p-8 space-y-6">
              {festError && (
                <div className="p-3 rounded-xl bg-red-50 border-2 border-red-400 text-red-900 text-xs sm:text-sm font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{festError}</span>
                </div>
              )}

              {/* STEP 1: Photo Upload Mandatory (Live Camera + Gallery) */}
              <div className="p-4 rounded-2xl bg-orange-50/70 border-2 border-orange-300">
                <CandidatePhotoUploader
                  photoUrl={festPhoto}
                  onPhotoChange={(url) => {
                    setFestPhoto(url);
                    setFestError(null);
                  }}
                  onPhotoRemove={() => setFestPhoto('')}
                  required={true}
                  label="स्टेप 1: अपनी फोटो अपलोड करें (Personal Photo Upload *Mandatory)"
                  subLabel="आपकी फोटो से पर्सनलाइज्ड शुभकामना प्रमाण पत्र तैयार होगा (गैलरी से चुनें या लाइव कैमरा से खींचें)"
                />
              </div>

              {/* Step 2: Name & Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    पूर्ण नाम (Full Name) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. श्री विवेक गुप्ता"
                    value={festName}
                    onChange={(e) => setFestName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    पद / उपाधि (Designation) <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={festDesignation}
                    onChange={(e) => setFestDesignation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm font-medium bg-white cursor-pointer"
                  >
                    <option value="Teacher (शिक्षक)">शिक्षक (Teacher)</option>
                    <option value="Volunteer (स्वयंसेवक)">स्वयंसेवक (Volunteer)</option>
                    <option value="Member (सदस्य)">सदस्य (Member)</option>
                    <option value="Patron (संरक्षक)">संरक्षक (Patron / Donor)</option>
                    <option value="Respected Citizen (सम्मानित नागरिक)">सम्मानित नागरिक (Respected Citizen)</option>
                    <option value="Social Worker (समाजसेवी)">समाजसेवी (Social Worker)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    मोबाइल नंबर (Mobile No.) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="व्हाट्सएप / मोबाइल नं"
                    value={festMobile}
                    onChange={(e) => setFestMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Step 3: Festival & Target */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    कौन सा त्यौहार? (Select Festival) <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={festFestival}
                    onChange={(e) => setFestFestival(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm font-medium bg-white cursor-pointer"
                  >
                    <option value="Independence Day (स्वतंत्रता दिवस)">🇮🇳 स्वतंत्रता दिवस (Independence Day)</option>
                    <option value="Diwali (दीपावली)">🪔 दीपावली (Diwali Mahotsav)</option>
                    <option value="Holi (होली)">🎨 होली महापर्व (Holi Festival)</option>
                    <option value="Teachers Day (शिक्षक दिवस)">📚 शिक्षक दिवस (Teachers Day)</option>
                    <option value="Republic Day (गणतंत्र दिवस)">🇮🇳 गणतंत्र दिवस (Republic Day)</option>
                    <option value="Raksha Bandhan (रक्षाबंधन)">🎀 रक्षाबंधन (Raksha Bandhan)</option>
                    <option value="Gandhi Jayanti (गाँधी जयंती)">🕊️ गाँधी जयंती (Gandhi Jayanti)</option>
                    <option value="Chhath Puja (छठ पूजा)">☀️ छठ पूजा (Chhath Puja)</option>
                    <option value="Eid (ईद-उल-फ़ितर)">🌙 ईद-उल-फ़ितर (Eid)</option>
                    <option value="Christmas (क्रिसमस)">🎄 क्रिसमस (Christmas)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    शुभकामना जारी तिथि (Issue Date) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={festDate}
                    onChange={(e) => setFestDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm font-medium bg-white"
                  />
                  <span className="text-[10px] text-orange-800 font-bold mt-1 inline-flex items-center gap-1">
                    <span>📅</span> स्वतः आज की वर्तमान तिथि ({new Date(festDate || getTodayDateString()).toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' })})
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    किसके लिए शुभकामना? (Target) <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={festTargetAudience}
                    onChange={(e) => setFestTargetAudience(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm font-medium bg-white cursor-pointer"
                  >
                    <option value="All Members (समस्त सदस्यगण)">समस्त सदस्यगण (All Foundation Members)</option>
                    <option value="Specific School (विशिष्ट विद्यालय)">विशिष्ट विद्यालय / छात्र-छात्राएं (School & Students)</option>
                    <option value="Village (ग्रामवासी)">ग्रामवासी एवं क्षेत्रवासी (Village Residents)</option>
                    <option value="Family & Friends (परिवार व सगे-संबंधी)">परिवार व सगे-संबंधी (Family & Friends)</option>
                    <option value="Citizens (समस्त देशवासी)">समस्त देशवासी (All Indian Citizens)</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-black text-gray-800">
                      व्यक्तिगत संदेश (Personal Message) <span className="text-red-600">*</span>
                    </label>
                    <span className="text-[11px] text-gray-500">{festMessage.length} / 200 अक्षर</span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    maxLength={200}
                    value={festMessage}
                    onChange={(e) => setFestMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm font-medium"
                  />
                  {/* Quick message suggestions */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      'समस्त देशवासियों को हार्दिक शुभकामनाएं!',
                      'सुख, शांति और समृद्धि की मंगलकामनाएं।',
                      'राष्ट्र निर्माण व सेवा में समर्पित रहने का संकल्प।'
                    ].map((sugg) => (
                      <button
                        type="button"
                        key={sugg}
                        onClick={() => setFestMessage(sugg)}
                        className="px-2 py-1 bg-amber-100/70 hover:bg-amber-200 text-amber-900 rounded text-[11px] font-bold cursor-pointer"
                      >
                        + "{sugg}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-600 hover:from-orange-600 hover:to-amber-700 text-white font-black text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>पर्सनलाइज्ड शुभकामना कार्ड जनरेट करें (Generate Personalized Wish Card)</span>
                </button>
              </div>
            </form>

            {/* Form Master Footer */}
            <div className="bg-orange-100/70 border-t border-orange-300 px-6 py-3 text-center text-xs font-extrabold text-orange-950">
              Reg No: {FOUNDATION_INFO.regNo} | NITI Aayog: {FOUNDATION_INFO.nitiAayogUid} | {FOUNDATION_INFO.address}
            </div>
          </div>
        )}

        {/* =========================================================================
            FORM 4: CERTIFICATE VERIFICATION PORTAL (प्रमाण पत्र सत्यापन पोर्टल)
        ========================================================================= */}
        {activeTab === 'verification' && (
          <div className="bg-white rounded-3xl border-2 border-blue-300 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-blue-200" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black">
                    प्रमाण पत्र सत्यापन एवं डाउनलोड पोर्टल (Certificate Verification & Download)
                  </h2>
                  <p className="text-xs text-blue-100 font-semibold">
                    संस्था द्वारा जारी प्रमाण पत्रों का आधिकारिक क्यूआर व डेटाबेस सत्यापन
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-extrabold uppercase tracking-wider">
                Form 4 of 5
              </span>
            </div>

            <form onSubmit={handleVerificationSubmit} className="p-4 sm:p-8 space-y-6">
              {verError && (
                <div className="p-3 rounded-xl bg-red-50 border-2 border-red-400 text-red-900 text-xs sm:text-sm font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{verError}</span>
                </div>
              )}

              {/* Step 1: Certificate Photo Match Upload (Optional / Recommended) */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border-2 border-blue-300">
                <CandidatePhotoUploader
                  photoUrl={verPhoto}
                  onPhotoChange={(url) => setVerPhoto(url)}
                  onPhotoRemove={() => setVerPhoto('')}
                  required={false}
                  label="स्टेप 1: फोटो मिलान हेतु अपलोड करें (Photo Match for AI Verification - Optional)"
                  subLabel="प्रमाण पत्र पर मुद्रित फोटो से लाइव मिलान एवं सत्यापन हेतु फोटो अपलोड करें"
                />
              </div>

              {/* Step 2: Verification Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    प्रमाण पत्र संख्या (Certificate No.) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. JJF/VOL/2026/659 या JJF/DON/2026/884"
                    value={verCertNo}
                    onChange={(e) => setVerCertNo(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-mono font-bold"
                  />
                  <div className="flex gap-2 mt-1.5">
                    {['JJF/VOL/2026/659', 'JJF/DON/2026/884', 'JJF-APP-2026', 'JJF-FEST-2026-01'].map((sample) => (
                      <button
                        type="button"
                        key={sample}
                        onClick={() => setVerCertNo(sample)}
                        className="text-[10px] px-2 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold rounded cursor-pointer"
                      >
                        + {sample}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    प्रमाण पत्र का प्रकार (Certificate Type) <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={verCertType}
                    onChange={(e) => setVerCertType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium bg-white cursor-pointer"
                  >
                    <option value="Volunteer">स्वयंसेवक प्रमाण पत्र (Volunteer)</option>
                    <option value="Donation">आधिकारिक दान रसीद (Donation Receipt)</option>
                    <option value="Appreciation">प्रशस्ति पत्र (Appreciation)</option>
                    <option value="Festival Greeting">त्यौहार शुभकामना पत्र (Festival Wish)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    धारक का पूरा नाम (Full Name)
                  </label>
                  <input
                    type="text"
                    placeholder="धारक का नाम"
                    value={verName}
                    onChange={(e) => setVerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    मोबाइल नंबर (Mobile No. for OTP)
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="मोबाइल नंबर"
                    value={verMobile}
                    onChange={(e) => setVerMobile(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-800 mb-1">
                    जारी / सत्यापन तिथि (Issue Date)
                  </label>
                  <input
                    type="date"
                    value={verIssueDate}
                    onChange={(e) => setVerIssueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm font-medium"
                  />
                  <span className="text-[10px] text-blue-800 font-bold mt-1 inline-flex items-center gap-1">
                    <span>📅</span> स्वतः वर्तमान तिथि ({new Date(verIssueDate || getTodayDateString()).toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' })})
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 hover:from-blue-700 hover:to-indigo-900 text-white font-black text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>सत्यापित करें एवं डाउनलोड करें (Verify & Download Certificate)</span>
                </button>
              </div>

              {/* Verification Result Display */}
              {verResult && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-500 shadow-md">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-emerald-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                        <CheckCircle2 className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-950 font-black text-[11px] uppercase tracking-wider mb-1">
                          <span>✓ VERIFIED BY JYOTI AI</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-emerald-950">
                          {verResult.title}
                        </h3>
                        <p className="text-xs text-emerald-800 font-semibold">
                          प्रमाण पत्र संख्या: <strong className="font-mono">{verResult.certId}</strong>
                        </p>
                      </div>
                    </div>

                    {verPhoto && (
                      <div className="w-16 h-20 rounded-lg overflow-hidden border-2 border-emerald-600 shadow-xs shrink-0">
                        <img src={verPhoto} alt="Matched Candidate" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 text-xs">
                    <div>
                      <span className="text-gray-500 font-bold block">प्रमाण पत्र धारक:</span>
                      <strong className="text-gray-900">{verResult.holder}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 font-bold block">श्रेणी / प्रकार:</span>
                      <strong className="text-gray-900">{verResult.type}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 font-bold block">निर्गत तिथि:</span>
                      <strong className="text-gray-900">{verResult.date}</strong>
                    </div>
                    <div>
                      <span className="text-gray-500 font-bold block">सत्यापन स्थिति:</span>
                      <span className="inline-block px-2 py-0.5 bg-emerald-600 text-white rounded font-black text-[10px]">
                        100% VALID & AUTHENTIC
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-emerald-200 flex flex-wrap gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenVerifyModal) {
                          onOpenVerifyModal(verResult.certId);
                        } else {
                          onOpenVolunteerCert(INITIAL_VOLUNTEERS[0]);
                        }
                      }}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Eye className="w-4 h-4" />
                      <span>प्रमाण पत्र देखें व डाउनलोड करें (View & Download)</span>
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Form Master Footer */}
            <div className="bg-blue-100/70 border-t border-blue-300 px-6 py-3 text-center text-xs font-extrabold text-blue-950">
              Reg No: {FOUNDATION_INFO.regNo} | NITI Aayog: {FOUNDATION_INFO.nitiAayogUid} | {FOUNDATION_INFO.address}
            </div>
          </div>
        )}

        {/* =========================================================================
            FORM 5: DONATION FORM (दान रसीद फॉर्म / Donation Form)
        ========================================================================= */}
        {activeTab === 'donation' && (
          <div className="bg-white rounded-3xl border-2 border-red-300 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-700 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-200 fill-current" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black">
                    दान एवं सम्मान रसीद फॉर्म (Donation & Receipt Form)
                  </h2>
                  <p className="text-xs text-red-100 font-semibold">
                    पुनीत जनसेवा में सहयोग करें और तुरंत डिजिटल रूप से हस्ताक्षरित आधिकारिक दान रसीद प्राप्त करें
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-extrabold uppercase tracking-wider">
                Form 5 of 5
              </span>
            </div>

            <form onSubmit={handleDonationSubmit} className="p-4 sm:p-8 space-y-6">
              {donError && (
                <div className="p-3 rounded-xl bg-red-50 border-2 border-red-400 text-red-900 text-xs sm:text-sm font-bold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{donError}</span>
                </div>
              )}

              {/* STEP 1: Photo Upload Mandatory (Live Camera + Gallery) */}
              <div className="p-4 rounded-2xl bg-red-50/70 border-2 border-red-300">
                <CandidatePhotoUploader
                  photoUrl={donPhoto}
                  onPhotoChange={(url) => {
                    setDonPhoto(url);
                    setDonError(null);
                  }}
                  onPhotoRemove={() => setDonPhoto('')}
                  required={true}
                  label="स्टेप 1: दानदाता की पासपोर्ट फोटो (Donor Photo Upload *Mandatory)"
                  subLabel="दान रसीद एवं दानदाता सम्मान पत्र पर फोटो मुद्रित करने हेतु (गैलरी से चुनें या लाइव कैमरा से खींचें)"
                />
              </div>

              {/* Step 2: Amount Selector */}
              <div>
                <label className="block text-xs font-black text-gray-800 mb-2">
                  दान की राशि (Select Donation Amount) <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[500, 1000, 2100, 5100, 11000].map((amt) => {
                    const isSelected = donAmount === amt && !donCustomAmount;
                    return (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => {
                          setDonAmount(amt);
                          setDonCustomAmount('');
                        }}
                        className={`py-3 px-4 rounded-xl border-2 font-black text-sm transition-all cursor-pointer text-center ${
                          isSelected
                            ? 'bg-red-600 text-white border-red-700 shadow-md scale-102 ring-2 ring-red-400'
                            : 'bg-white hover:bg-red-50 text-gray-800 border-red-200'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2.5">
                  <input
                    type="number"
                    placeholder="या अन्य कोई भी ऐच्छिक राशि दर्ज करें (₹ Other Amount)"
                    value={donCustomAmount}
                    onChange={(e) => setDonCustomAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Step 3: Donor Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      दानदाता का पूरा नाम (Full Name) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. श्री अजय सिंह"
                      value={donName}
                      onChange={(e) => setDonName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      पिता / पति का नाम (Father/Spouse Name) <span className="text-gray-400 font-normal">(वैकल्पिक / Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="उदा. श्री जगदीश सिंह"
                      value={donFather}
                      onChange={(e) => setDonFather(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      मोबाइल नंबर (Mobile No.) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10 अंकों का मोबाइल नंबर"
                      value={donMobile}
                      onChange={(e) => setDonMobile(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      ईमेल आईडी (Email ID)
                    </label>
                    <input
                      type="email"
                      placeholder="रसीद प्राप्त करने हेतु ईमेल"
                      value={donEmail}
                      onChange={(e) => setDonEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      पैन नंबर (PAN No.) <span className="text-gray-400 font-normal">(वैकल्पिक / Optional)</span>
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="उदा. ABCDE1234F"
                      value={donPan}
                      onChange={(e) => setDonPan(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-sm font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      दान का उद्देश्य (Donation Purpose) <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={donPurpose}
                      onChange={(e) => setDonPurpose(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-sm font-medium bg-white cursor-pointer"
                    >
                      <option value="Shiksha (Free Child Education)">शिक्षा (गरीब बच्चों की निःशुल्क शिक्षा)</option>
                      <option value="Bhojan (Nutritious Meals)">भोजन (पौष्टिक आहार एवं अन्न सेवा)</option>
                      <option value="Medical (Free Health Camps)">स्वास्थ्य (दवाएं व स्वास्थ्य शिविर)</option>
                      <option value="General Fund (सामान्य जन-कल्याण)">सामान्य कोष (General Relief Fund)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      दान / रसीद तिथि (Date of Donation) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={donDate}
                      onChange={(e) => setDonDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-sm font-medium bg-white"
                    />
                    <span className="text-[10px] text-red-800 font-bold mt-1 inline-flex items-center gap-1">
                      <span>📅</span> स्वतः आज की वर्तमान तिथि ({new Date(donDate || getTodayDateString()).toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' })})
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 4: Address */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between pb-1 border-b border-gray-200">
                  <span className="text-xs font-black text-rose-950 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-700" />
                    <span>दाता का पता विवरण (Donor Address Hierarchy)</span>
                  </span>
                  <span className="text-[10px] text-rose-800 font-bold bg-rose-100 px-2 py-0.5 rounded">
                    28 States & 8 UTs
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* 1. State / UT */}
                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      राज्य / केंद्र शासित प्रदेश (State / UT) <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={donState}
                      onChange={(e) => {
                        const newSt = e.target.value;
                        setDonState(newSt);
                        const dists = getDistrictsForStateName(newSt);
                        if (dists.length > 0) setDonDistrict(dists[0].nameHindi);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-xs font-bold bg-white cursor-pointer"
                    >
                      <optgroup label="🏛️ भारत के 28 राज्य (28 Indian States)">
                        {regularStates.map((st) => (
                          <option key={st.id} value={st.nameHindi}>
                            {st.nameHindi}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="🇮🇳 8 केंद्र शासित प्रदेश (8 Union Territories)">
                        {unionTerritories.map((ut) => (
                          <option key={ut.id} value={ut.nameHindi}>
                            {ut.nameHindi}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* 2. District */}
                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      जिला (District) <span className="text-red-600">*</span>
                    </label>
                    <select
                      value={donDistrict}
                      onChange={(e) => setDonDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-xs font-bold bg-white cursor-pointer"
                    >
                      {getDistrictsForStateName(donState).map((d) => (
                        <option key={d.id} value={d.nameHindi}>
                          {d.nameHindi}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. PIN Code */}
                  <div>
                    <label className="block text-xs font-black text-gray-800 mb-1">
                      पिन कोड (PIN Code) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={donPin}
                      onChange={(e) => setDonPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-xs font-bold bg-white"
                      placeholder="233001"
                    />
                  </div>
                </div>

                {/* 4. Ward / Gram Panchayat & Full Address */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-black text-gray-800">
                      वार्ड / ग्राम पंचायत व पूरा पता (Ward / Gram Panchayat & House Address) <span className="text-red-600">*</span>
                    </label>
                    <span className="text-[10px] text-gray-500">वार्ड / पंचायत चुनें या लिखें</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          setDonAddress(e.target.value);
                        }
                      }}
                      className="w-full px-2.5 py-2 rounded-xl border border-rose-300 bg-rose-50/50 text-xs font-bold text-gray-900 cursor-pointer"
                    >
                      <option value="">-- वार्ड / ग्राम पंचायत सूची से चुनें --</option>
                      {getWardsAndPanchayats(donState, donDistrict).map((wp) => (
                        <option key={wp.id} value={wp.nameHindi}>
                          {wp.type === 'ward' ? '🏢 [वार्ड] ' : '🌾 [पंचायत] '}
                          {wp.nameHindi}
                        </option>
                      ))}
                    </select>

                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        required
                        placeholder="मकान नं, ग्राम / वार्ड, मोहल्ला, पोस्ट..."
                        value={donAddress}
                        onChange={(e) => setDonAddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 text-xs font-bold bg-white"
                      />
                    </div>
                  </div>

                  {/* Suggestion Chips */}
                  {getWardsAndPanchayats(donState, donDistrict).length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1 items-center">
                      <span className="text-[9.5px] text-gray-500 font-bold">सुझाव:</span>
                      {getWardsAndPanchayats(donState, donDistrict).slice(0, 5).map((wp) => (
                        <button
                          type="button"
                          key={wp.id}
                          onClick={() => setDonAddress(wp.nameHindi)}
                          className="text-[9.5px] px-1.5 py-0.5 rounded font-bold bg-rose-100/80 text-rose-900 border border-rose-300 hover:bg-rose-200 transition-colors"
                        >
                          {wp.nameHindi}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Step 5: Payment Mode */}
              <div>
                <label className="block text-xs font-black text-gray-800 mb-2">
                  भुगतान का माध्यम (Payment Mode) <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'UPI', label: 'UPI / QR Code', icon: QrCode },
                    { id: 'Card', label: 'Debit / Credit Card', icon: CreditCard },
                    { id: 'NetBanking', label: 'Net Banking', icon: FileText },
                    { id: 'Cash', label: 'Direct Cash / Cheque', icon: CheckCircle2 }
                  ].map((mode) => {
                    const isSelected = donPaymentMode === mode.id;
                    const Icon = mode.icon;
                    return (
                      <button
                        type="button"
                        key={mode.id}
                        onClick={() => setDonPaymentMode(mode.id)}
                        className={`p-3 rounded-xl border-2 flex items-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-red-50 border-red-600 text-red-900 ring-1 ring-red-500'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-red-600' : 'text-gray-500'}`} />
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Declaration */}
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                <input
                  type="checkbox"
                  id="don-decl"
                  checked={donDeclaration}
                  onChange={(e) => setDonDeclaration(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-red-600 focus:ring-red-500 cursor-pointer"
                />
                <label htmlFor="don-decl" className="text-xs font-bold text-gray-700 cursor-pointer leading-relaxed">
                  यह दान स्वेच्छा से जीवन ज्योति फाउंडेशन के जन-कल्याणकारी एवं सेवा कार्यों हेतु दिया जा रहा है। <span className="text-red-600">*</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-700 hover:from-red-700 hover:to-amber-800 text-white font-black text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart className="w-5 h-5 fill-current" />
                  <span>
                    दान करें और आधिकारिक रसीद पाएं (Donate & Get Official Receipt)
                  </span>
                </button>
              </div>
            </form>

            {/* Form Master Footer */}
            <div className="bg-red-100/70 border-t border-red-300 px-6 py-3 text-center text-xs font-extrabold text-red-950">
              Reg No: {FOUNDATION_INFO.regNo} | NITI Aayog: {FOUNDATION_INFO.nitiAayogUid} | {FOUNDATION_INFO.address}
            </div>
          </div>
        )}
      </div>

      {/* Real Payment Gateway Modal for Online Donations (Card, NetBanking, PhonePe, GPay, UPI) */}
      {showDonationGateway && activeDonorPaymentData && (
        <RealPaymentGatewayModal
          isOpen={showDonationGateway}
          onClose={() => setShowDonationGateway(false)}
          donorData={activeDonorPaymentData}
          onPaymentSuccess={(newDonation) => {
            setShowDonationGateway(false);
            setDonSuccess(true);
            onOpenDonationCert(newDonation);
          }}
        />
      )}
    </section>
  );
};

export default ProfessionalFormsPortal;
