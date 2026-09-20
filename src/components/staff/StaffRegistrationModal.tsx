// ============================================================================
// JEEVAN JYOTI FOUNDATION - STAFF REGISTRATION MODAL
// जीवन ज्योति फाउंडेशन - आधिकारिक स्टाफ पंजीकरण फॉर्म
// ============================================================================

import React, { useState, useRef } from 'react';
import {
  X,
  User,
  Phone,
  Droplet,
  Calendar,
  Building,
  Briefcase,
  Camera,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Award,
  AlertCircle,
  FileCheck,
  Eye,
  Download,
  Sparkles
} from 'lucide-react';
import { StaffMember, StaffRelationType } from '../../types/staff';
import { registerNewStaffMember } from '../../services/staffService';
import confetti from 'canvas-confetti';

interface StaffRegistrationModalProps {
  onClose: () => void;
  onSuccessViewCard: (staff: StaffMember) => void;
}

// 6 Core Official Designations requested by User:
// President/अध्यक्ष, Vice President/उपाध्यक्ष, Secretary/सचिव, Manager/प्रबंधक, Treasurer/लेखाकार, Member/सदस्य
const PRESET_DESIGNATIONS = [
  'President / अध्यक्ष',
  'Vice President / उपाध्यक्ष',
  'Secretary / सचिव',
  'Manager / प्रबंधक',
  'Treasurer / लेखाकार',
  'Member / सदस्य',
  'Chief Project Coordinator / मुख्य समन्वयक',
  'Senior Educator / वरिष्ठ शिक्षक',
  'Field Operations Officer / फील्ड अधिकारी',
  'Other / अन्य (कस्टम पदनाम)'
];

const PRESET_DEPARTMENTS = [
  'शिक्षा व बाल संस्कार विभाग (Education Wing)',
  'स्वास्थ्य, पोषण व चिकित्सा सेवा (Health & Nutrition)',
  'महिला सशक्तीकरण व सिलाई केंद्र (Women Empowerment)',
  'प्रशासनिक, लेखा व ऑडिट अनुभाग (Administration & Accounts)',
  'आपदा राहत व सामाजिक सेवा अनुभाग (Disaster Relief & Social Work)',
  'आईटी, डिजिटल मीडिया व जनसंपर्क (IT & Digital Communications)',
  'पर्यावरण व पौधारोपण प्रकोष्ठ (Environment & Green Mission)'
];

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80'
];

export const StaffRegistrationModal: React.FC<StaffRegistrationModalProps> = ({
  onClose,
  onSuccessViewCard
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [fatherOrHusbandName, setFatherOrHusbandName] = useState('');
  const [relationType, setRelationType] = useState<StaffRelationType>('So');
  const [selectedDesignation, setSelectedDesignation] = useState(PRESET_DESIGNATIONS[0]);
  const [customDesignation, setCustomDesignation] = useState('');
  const [department, setDepartment] = useState(PRESET_DEPARTMENTS[0]);
  const [mobile, setMobile] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [email, setEmail] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [dateOfJoining, setDateOfJoining] = useState(new Date().toISOString().slice(0, 10));
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [aadhaarOrIdRef, setAadhaarOrIdRef] = useState('');
  const [address, setAddress] = useState('ग्राम मीरानपुर, पो. मोहम्मदाबाद, गाजीपुर (उ.प्र.) - 233303');
  const [photoUrl, setPhotoUrl] = useState(SAMPLE_AVATARS[0]);
  const [badgeLevel, setBadgeLevel] = useState<'कोर टीम (Core Team)' | 'कार्यकारी स्टाफ (Executive Staff)' | 'वरिष्ठ अधिकारी (Lead Officer)'>('कार्यकारी स्टाफ (Executive Staff)');
  const [dutyLocation, setDutyLocation] = useState('गाजीपुर मुख्य शाखा (Ghazipur HQ)');

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredStaff, setRegisteredStaff] = useState<StaffMember | null>(null);

  // Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('कृपया 5MB से छोटी पासपोर्ट फोटो चुनें।');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPhotoUrl(uploadEvent.target.result as string);
          setFormError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Form Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validations
    if (!fullName.trim()) {
      setFormError('कृपया स्टाफ सदस्य का पूरा नाम दर्ज करें।');
      return;
    }
    if (!fatherOrHusbandName.trim()) {
      setFormError('कृपया पिता अथवा पति का नाम दर्ज करें।');
      return;
    }
    const cleanMobile = mobile.replace(/[^0-9]/g, '');
    if (cleanMobile.length < 10) {
      setFormError('कृपया वैध 10-अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }

    const isCustom = selectedDesignation.includes('अन्य') || selectedDesignation.includes('Other');
    const finalDesignation = isCustom
      ? customDesignation.trim() || 'स्टाफ सदस्य (Staff Member)'
      : selectedDesignation;

    // Generate Hindi equivalent if available
    let hindiDesignation = finalDesignation;
    if (finalDesignation.includes('President / अध्यक्ष')) hindiDesignation = 'अध्यक्ष';
    else if (finalDesignation.includes('Vice President / उपाध्यक्ष')) hindiDesignation = 'उपाध्यक्ष';
    else if (finalDesignation.includes('Secretary / सचिव')) hindiDesignation = 'सचिव';
    else if (finalDesignation.includes('Manager / प्रबंधक')) hindiDesignation = 'प्रबंधक';
    else if (finalDesignation.includes('Treasurer / लेखाकार')) hindiDesignation = 'लेखाकार (कोषाध्यक्ष)';
    else if (finalDesignation.includes('Member / सदस्य')) hindiDesignation = 'सदस्य';

    setIsSubmitting(true);

    try {
      const newStaff = registerNewStaffMember({
        fullName: fullName.trim(),
        fullNameHindi: fullName.trim(),
        fatherOrHusbandName: fatherOrHusbandName.trim(),
        relationType,
        designation: finalDesignation,
        designationHindi: hindiDesignation,
        department,
        mobile: cleanMobile,
        email: email.trim() || undefined,
        bloodGroup,
        dateOfJoining,
        dateOfBirth: dateOfBirth || undefined,
        emergencyContact: emergencyContact.replace(/[^0-9]/g, '').slice(-10) || '8052361666',
        aadhaarOrIdRef: aadhaarOrIdRef.trim() || undefined,
        address: address.trim(),
        photoUrl: photoUrl || SAMPLE_AVATARS[0],
        staffBadgeLevel: badgeLevel,
        dutyLocation
      });

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }

      setRegisteredStaff(newStaff);
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setFormError('पंजीकरण में त्रुटि आई। कृपया पुनः प्रयास करें।');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-300 my-auto animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8B0000] via-[#A00000] to-[#3F2B96] text-white p-4 sm:p-5 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300 flex items-center justify-center text-amber-300">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white font-['Cinzel',serif]">
                  जीवन ज्योति फाउंडेशन - स्टाफ रजिस्ट्रेशन फॉर्म
                </h3>
                <span className="bg-amber-400 text-[#8B0000] text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  New Onboarding
                </span>
              </div>
              <p className="text-xs text-amber-100 font-medium mt-0.5">
                आधिकारिक स्टाफ पंजीकरण फॉर्म भरें एवं तुरंत डायनामिक पहचान पत्र प्राप्त करें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Registration is completed successfully */}
        {registeredStaff ? (
          <div className="p-6 text-center space-y-5 bg-gradient-to-b from-amber-50/50 to-white">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md border-2 border-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                पंजीकरण सफलतापूर्वक दर्ज हुआ (Application Submitted)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
                बधाई हो! {registeredStaff.fullName} जी का स्टाफ रिकॉर्ड दर्ज हो गया है।
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                आवंटित आधिकारिक स्टाफ आईडी:{' '}
                <strong className="text-[#8B0000] font-mono text-base font-black">
                  {registeredStaff.id}
                </strong>
              </p>
            </div>

            {/* Staff Card Preview Snippet */}
            <div className="max-w-md mx-auto p-4 bg-white rounded-xl border border-amber-200 shadow-md flex items-center gap-4 text-left">
              <img
                src={registeredStaff.photoUrl}
                alt={registeredStaff.fullName}
                className="w-14 h-16 object-cover rounded-lg border-2 border-amber-400 shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-gray-900 truncate">
                  {registeredStaff.fullName}
                </div>
                <div className="text-xs text-amber-800 font-bold truncate">
                  {registeredStaff.designation}
                </div>
                <div className="text-xs text-gray-500 font-mono mt-0.5">
                  ID: {registeredStaff.id} • {registeredStaff.bloodGroup}
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                    ⏳ एडमिन अप्रूवल हेतु लंबित (Approval Pending)
                  </span>
                </div>
              </div>
            </div>

            {/* Approval Workflow & WhatsApp Notification Notice */}
            <div className="max-w-md mx-auto p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-300 rounded-2xl text-left space-y-2.5 text-xs text-gray-700">
              <div className="flex items-center gap-2 text-emerald-800 font-black">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>आई-कार्ड सत्यापन एवं डाउनलोड प्रक्रिया:</span>
              </div>
              <ul className="space-y-1.5 pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-black mt-0.5">1.</span>
                  <span><strong>एडमिन सत्यापन (Admin Approval):</strong> आपका आवेदन संस्था प्रशासन को प्राप्त हो गया है। विवरण की समीक्षा के बाद इसे स्वीकृत (Approve) किया जाएगा।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-black mt-0.5">2.</span>
                  <span><strong>WhatsApp पर सीधा लिंक:</strong> स्वीकृति मिलते ही आपके रजिस्टर्ड मोबाइल (<strong>+91 {registeredStaff.mobile}</strong>) के WhatsApp पर आई-कार्ड डाउनलोड लिंक प्राप्त होगा।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-black mt-0.5">3.</span>
                  <span><strong>OTP सत्यापन द्वारा डाउनलोड:</strong> अप्रूवल के बाद आप वेबसाइट से अपने रजिस्टर्ड मोबाइल पर OTP सत्यापन करके भी सीधे उच्च गुणवत्ता वाला 2-Page आई-कार्ड डाउनलोड कर सकते हैं।</span>
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onSuccessViewCard(registeredStaff)}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#8B0000] via-red-700 to-amber-600 hover:from-red-800 hover:to-amber-700 text-white font-black text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>आई-कार्ड स्थिति देखें (View Card Status)</span>
              </button>
              <button
                onClick={() => {
                  setRegisteredStaff(null);
                  setFullName('');
                  setFatherOrHusbandName('');
                  setMobile('');
                }}
                className="w-full sm:w-auto px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                + एक और स्टाफ जोड़ें (Add Another)
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            {/* 1. Photo Selection & Avatar */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={photoUrl}
                  alt="Staff Preview"
                  className="w-20 h-24 object-cover rounded-xl border-2 border-amber-400 shadow-md bg-white"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-1.5 bg-[#8B0000] text-white rounded-full shadow-md hover:bg-red-800 cursor-pointer transition-transform hover:scale-110"
                  title="गैलरी / कैमरा से फोटो अपलोड करें"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="text-xs font-bold text-gray-800">
                  📷 पासपोर्ट साइज फोटो (Passport Size Photo)
                </div>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  अपनी स्पष्ट फोटो अपलोड करें या नीचे दिए गए सैंपल अवतार में से चुनें:
                </p>
                {/* Sample Avatar Picker */}
                <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2">
                  {SAMPLE_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(av)}
                      className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        photoUrl === av ? 'border-[#8B0000] scale-110 shadow-xs' : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 text-[11px] font-bold text-[#8B0000] bg-white border border-[#8B0000] rounded-lg hover:bg-red-50 flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>अपलोड</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Personal Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  पूरा नाम (Full Name) *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="उदा. श्री राहुल कुमार राय"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-hidden"
                />
              </div>

              {/* Father / Husband / Guardian Name & Relation Prefix */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">
                    संबंधी / अभिभावक का नाम (Father / Husband / Guardian) *
                  </label>
                  <span className="text-[10px] text-[#8B0000] font-bold">
                    {relationType === 'So' && 'सुपुत्र (Son of)'}
                    {relationType === 'Do' && 'सुपुत्री (Daughter of)'}
                    {relationType === 'Wo' && 'पत्नी (Wife of)'}
                    {relationType === 'Husband' && 'पति (Husband)'}
                    {relationType === 'Father' && 'पिता (Father)'}
                  </span>
                </div>

                {/* Relationship Prefix Selector Buttons */}
                <div className="grid grid-cols-4 gap-1 mb-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setRelationType('So')}
                    className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer text-center ${
                      relationType === 'So' || relationType === 'Father'
                        ? 'bg-[#8B0000] text-white shadow-xs'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                    title="S/o (सुपुत्र)"
                  >
                    S/o (सुपुत्र)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRelationType('Do')}
                    className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer text-center ${
                      relationType === 'Do'
                        ? 'bg-[#8B0000] text-white shadow-xs'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                    title="D/o (सुपुत्री)"
                  >
                    D/o (सुपुत्री)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRelationType('Wo')}
                    className={`py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer text-center ${
                      relationType === 'Wo' || relationType === 'Husband'
                        ? 'bg-[#8B0000] text-white shadow-xs'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                    title="W/o (पत्नी / पति का नाम)"
                  >
                    W/o (पत्नी)
                  </button>
                  <select
                    value={relationType}
                    onChange={(e) => setRelationType(e.target.value as StaffRelationType)}
                    className="py-1 px-1 text-[10.5px] font-bold rounded-lg bg-white border border-gray-300 text-gray-700 cursor-pointer outline-hidden"
                  >
                    <option value="So">S/o (सुपुत्र)</option>
                    <option value="Do">D/o (सुपुत्री)</option>
                    <option value="Wo">W/o (पत्नी)</option>
                    <option value="Father">पिता (Father)</option>
                    <option value="Husband">पति (Husband)</option>
                  </select>
                </div>

                {/* Input with prefix badge */}
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 px-1.5 py-0.5 rounded-md bg-amber-100 text-[#8B0000] text-xs font-black border border-amber-300 pointer-events-none select-none font-mono">
                    {relationType === 'So'
                      ? 'S/o'
                      : relationType === 'Do'
                      ? 'D/o'
                      : relationType === 'Wo'
                      ? 'W/o'
                      : relationType === 'Husband'
                      ? 'W/o'
                      : 'S/o'}
                  </span>
                  <input
                    type="text"
                    required
                    value={fatherOrHusbandName}
                    onChange={(e) => setFatherOrHusbandName(e.target.value)}
                    placeholder={
                      relationType === 'Do'
                        ? 'उदा. श्री शिवपूजन राय (पिता का नाम)'
                        : relationType === 'Wo' || relationType === 'Husband'
                        ? 'उदा. श्री सतीश चन्द्र वर्मा (पति का नाम)'
                        : 'उदा. श्री शिवपूजन राय (पिता का नाम)'
                    }
                    className="w-full pl-15 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* 3. Designation & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Designation */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  पदनाम (Designation / Role) *
                </label>
                <select
                  value={selectedDesignation}
                  onChange={(e) => setSelectedDesignation(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-hidden bg-white"
                >
                  {PRESET_DESIGNATIONS.map((d, i) => (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {selectedDesignation.includes('अन्य') && (
                  <input
                    type="text"
                    required
                    value={customDesignation}
                    onChange={(e) => setCustomDesignation(e.target.value)}
                    placeholder="अपना विशेष पदनाम दर्ज करें (Enter custom designation)"
                    className="w-full mt-2 px-3 py-1.5 text-sm border border-amber-400 rounded-xl focus:ring-2 focus:ring-[#8B0000] outline-hidden"
                  />
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  विभाग (Department / Wing) *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-hidden bg-white"
                >
                  {PRESET_DEPARTMENTS.map((dept, i) => (
                    <option key={i} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4. Contact & Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Mobile */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  मोबाइल नंबर (Mobile) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-bold">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="8052361666"
                    className="w-full pl-11 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  आपातकालीन संपर्क (Emergency)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-bold">+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="8052361666"
                    className="w-full pl-11 pr-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  रक्त समूह (Blood Group) *
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-hidden bg-white font-bold text-red-600"
                >
                  {['O+', 'B+', 'A+', 'AB+', 'O-', 'A-', 'B-', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 5. Joining Date & Badge Level */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Date of Joining */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ज्वाइनिंग तिथि (Joining Date) *
                </label>
                <input
                  type="date"
                  required
                  value={dateOfJoining}
                  onChange={(e) => setDateOfJoining(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-hidden"
                />
              </div>

              {/* Staff Level */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  स्टाफ श्रेणी (Badge Level)
                </label>
                <select
                  value={badgeLevel}
                  onChange={(e) => setBadgeLevel(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-hidden bg-white"
                >
                  <option value="कार्यकारी स्टाफ (Executive Staff)">कार्यकारी स्टाफ (Executive Staff)</option>
                  <option value="कोर टीम (Core Team)">कोर टीम (Core Team)</option>
                  <option value="वरिष्ठ अधिकारी (Lead Officer)">वरिष्ठ अधिकारी (Lead Officer)</option>
                </select>
              </div>

              {/* Duty Location */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  कार्यक्षेत्र / शाखा (Location)
                </label>
                <input
                  type="text"
                  value={dutyLocation}
                  onChange={(e) => setDutyLocation(e.target.value)}
                  placeholder="उदा. मीरानपुर मुख्य शाखा"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-hidden"
                />
              </div>
            </div>

            {/* 6. Address & ID Reference */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Aadhaar / ID Ref */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  पहचान पत्र / आधार संदर्भ (ID Ref)
                </label>
                <input
                  type="text"
                  value={aadhaarOrIdRef}
                  onChange={(e) => setAadhaarOrIdRef(e.target.value)}
                  placeholder="उदा. XXXX-XXXX-4589"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-hidden font-mono"
                />
              </div>

              {/* Full Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  स्थायी पता (Residential Address)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ग्राम, पोस्ट, ब्लॉक, गाजीपुर, उ.प्र. - 233303"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8B0000] focus:border-transparent outline-hidden"
                />
              </div>
            </div>

            {/* Submit CTA Bar */}
            <div className="pt-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>पंजीकरण उपरांत तत्काल डिजिटल आई-कार्ड जारी होगा</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-[#8B0000] to-red-700 hover:from-red-800 hover:to-red-900 text-white font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'प्रक्रियाधीन...' : 'पंजीकरण पूर्ण करें (Complete Registration)'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
