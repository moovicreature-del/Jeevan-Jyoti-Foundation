import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Calendar,
  Gift,
  Award,
  Search,
  Filter,
  Share2,
  Download,
  CheckCircle2,
  Heart,
  Eye,
  UserPlus,
  Send,
  RefreshCw,
  Clock,
  Sun,
  Moon,
  ChevronRight,
  Flame,
  Printer,
  ChevronLeft
} from 'lucide-react';
import {
  getFestivalsForYear,
  AVAILABLE_PANCHANG_YEARS,
  INITIAL_FESTIVAL_GREETINGS,
  CURRENT_YEAR
} from '../data/festivalsData';
import { formatCertificateNumber } from '../utils/certificateUtils';
import { getPanchangYearMeta, PanchangYearMeta } from '../utils/thakurPrasadCalendar';
import { FestivalItem, FestivalGreetingRecord } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { StructuredAddressSelector } from './StructuredAddressSelector';
import { DEFAULT_STRUCTURED_ADDRESS, StructuredAddress } from '../data/locationData';
import { CandidatePhotoUploader } from './CandidatePhotoUploader';

interface Props {
  onOpenCertificate: (greeting: FestivalGreetingRecord) => void;
}

const LOCAL_STORAGE_KEY = 'jjf_festival_greetings_v1';

export const FestivalGreetingsPortal: React.FC<Props> = ({ onOpenCertificate }) => {
  const { t } = useLanguage();

  // Active Panchang Year (Defaults to Current System Year, supports dynamic auto-renewal)
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);

  // Active Year Panchang Metadata (Vikram Samvat, Saka Samvat, Samvatsar Name)
  const yearMeta: PanchangYearMeta = useMemo(() => {
    return getPanchangYearMeta(selectedYear);
  }, [selectedYear]);

  // Festivals dynamically computed & renewed for selected year
  const festivalsForSelectedYear = useMemo(() => {
    return getFestivalsForYear(selectedYear);
  }, [selectedYear]);

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMaas, setSelectedMaas] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFestival, setSelectedFestival] = useState<FestivalItem>(festivalsForSelectedYear[0]);
  const [activeViewTab, setActiveViewTab] = useState<'register' | 'wall' | 'calendar'>('register');

  // Update selected festival whenever year changes if needed
  useEffect(() => {
    const matched = festivalsForSelectedYear.find((f) => f.id === selectedFestival.id);
    if (matched) {
      setSelectedFestival(matched);
    } else {
      setSelectedFestival(festivalsForSelectedYear[0]);
    }
  }, [selectedYear, festivalsForSelectedYear]);

  // Form State
  const [recipientPhoto, setRecipientPhoto] = useState<string>('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientTitle, setRecipientTitle] = useState('सम्मानित नागरिक (Respected Citizen)');
  const [address, setAddress] = useState<StructuredAddress>(DEFAULT_STRUCTURED_ADDRESS);
  const [phone, setPhone] = useState('');
  const [senderName, setSenderName] = useState('जीवन ज्योति फाउंडेशन परिवार');
  const [customMessage, setCustomMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // All Greetings list (stored with local storage support)
  const [greetings, setGreetings] = useState<FestivalGreetingRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not load saved festival greetings', e);
    }
    return INITIAL_FESTIVAL_GREETINGS;
  });

  // Save to local storage on update
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(greetings));
    } catch (e) {
      console.warn('Could not save festival greetings to localStorage', e);
    }
  }, [greetings]);

  // Update default message when festival changes
  useEffect(() => {
    if (selectedFestival) {
      setCustomMessage(selectedFestival.blessingHindi);
    }
  }, [selectedFestival]);

  // Filter festivals based on category, Maas, and search query
  const filteredFestivals = useMemo(() => {
    return festivalsForSelectedYear.filter((fest) => {
      const matchesCategory = selectedCategory === 'all' || fest.category === selectedCategory;
      const matchesMaas = selectedMaas === 'all' || (fest.hinduMonthHindi && fest.hinduMonthHindi.includes(selectedMaas));
      const matchesSearch =
        fest.nameHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fest.nameEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fest.monthHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fest.tithiHindi && fest.tithiHindi.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesMaas && matchesSearch;
    });
  }, [festivalsForSelectedYear, selectedCategory, selectedMaas, searchQuery]);

  // Upcoming Next Festival Finder
  const upcomingFestival = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const upcoming = festivalsForSelectedYear.find((f) => (f.gregorianDate || '9999-12-31') >= todayStr);
    return upcoming || festivalsForSelectedYear[0];
  }, [festivalsForSelectedYear]);

  // Form Submit Handler
  const handleRegisterGreeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      setFormError('⚠️ कृपया प्राप्तकर्ता का पूरा नाम दर्ज करें।');
      return;
    }

    if (!address.country || !address.state || !address.district || !address.block || !address.wardOrVillage?.trim()) {
      setFormError('⚠️ प्रमाण पत्र के लिए देश, राज्य, जिला, ब्लॉक और वार्ड/ग्राम का चयन/दर्ज करना अनिवार्य है।');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    const newId = formatCertificateNumber('FEST', new Date());
    const formattedCity = `${address.wardOrVillage}, ${address.block}, ${address.district}`;

    const newGreeting: FestivalGreetingRecord = {
      id: newId,
      festivalId: selectedFestival.id,
      festivalNameHindi: selectedFestival.nameHindi,
      festivalNameEnglish: selectedFestival.nameEnglish,
      recipientName: recipientName.trim(),
      recipientTitle: recipientTitle || 'सम्मानित नागरिक',
      senderName: senderName.trim() || 'जीवन ज्योति फाउंडेशन',
      photoUrl: recipientPhoto || undefined,
      phone: phone.trim() || undefined,
      city: formattedCity,
      country: address.country,
      state: address.state,
      district: address.district,
      block: address.block,
      wardOrVillage: address.wardOrVillage,
      customMessage: customMessage.trim() || selectedFestival.blessingHindi,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      shloka: selectedFestival.shloka,
      category: selectedFestival.category,
      symbolEmoji: selectedFestival.symbolEmoji
    };

    setTimeout(() => {
      setGreetings((prev) => [newGreeting, ...prev]);
      setIsSubmitting(false);
      setShowSuccessToast(true);

      // Auto open newly generated certificate
      onOpenCertificate(newGreeting);

      // Reset form slightly
      setRecipientName('');
      setTimeout(() => setShowSuccessToast(false), 4000);
    }, 400);
  };

  return (
    <section id="festivals" className="py-14 bg-[#FFFDF9] relative overflow-hidden border-b border-amber-200">
      {/* Decorative aura */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Thakur Prasad Panchang Certified Header Badge */}
        <div className="text-center max-w-4xl mx-auto mb-8">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-900 to-red-950 text-amber-100 border border-amber-400/50 shadow-md text-xs font-bold mb-4">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="font-serif tracking-wide">
              🚩 श्री ठाकुर प्रसाद पंचांग (वाराणसी परंपरा) द्वारा प्रामाणिक तिथियां • स्वतः वार्षिक नवीनीकरण
            </span>
            <span className="bg-amber-500 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              Auto-Renew Active
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#8B0000] tracking-tight font-serif">
            त्यौहार एवं पंचांग कैलेंडर शुभकामना पोर्टल
          </h2>

          <p className="text-gray-700 text-sm sm:text-base mt-2.5 max-w-2xl mx-auto">
            काशी/वाराणसी के प्रसिद्ध ठाकुर प्रसाद पंचांग के अनुसार विक्रम संवत, तिथि, नक्षत्र व शुभ मुहूर्त से युक्त सभी पर्वों पर आधिकारिक शुभकामना प्रमाण पत्र तुरंत जनरेट करें।
          </p>

          {/* Dynamic Year Selector & Samvat Bar */}
          <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border-2 border-amber-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Year Selector */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-center">
              <span className="text-xs font-black text-amber-950 uppercase flex items-center gap-1">
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>पंचांग वर्ष (Year):</span>
              </span>
              <div className="flex items-center bg-white rounded-xl border border-amber-300 p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setSelectedYear((prev) => Math.max(2024, prev - 1))}
                  className="p-1 hover:bg-amber-100 rounded-lg text-amber-900 transition-colors"
                  title="पिछला वर्ष"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="bg-transparent font-black text-amber-950 text-sm px-2 py-0.5 focus:outline-none cursor-pointer"
                >
                  {AVAILABLE_PANCHANG_YEARS.map((yr) => (
                    <option key={yr} value={yr}>
                      ईस्वी {yr} {yr === CURRENT_YEAR ? '(वर्तमान)' : ''}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setSelectedYear((prev) => Math.min(2030, prev + 1))}
                  className="p-1 hover:bg-amber-100 rounded-lg text-amber-900 transition-colors"
                  title="अगला वर्ष"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {selectedYear !== CURRENT_YEAR && (
                <button
                  onClick={() => setSelectedYear(CURRENT_YEAR)}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>आज का वर्ष</span>
                </button>
              )}
            </div>

            {/* Panchang Astronomical Metadata */}
            <div className="text-center md:text-right">
              <div className="text-xs font-black text-[#8B0000] flex items-center justify-center md:justify-end gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span>{yearMeta.hinduYearTitle}</span>
              </div>
              <div className="text-[11px] font-semibold text-gray-600">
                कुल प्रमुख पर्व: <strong className="text-amber-900">{festivalsForSelectedYear.length}</strong> • काशी विश्वनाथ पंचांग गणना
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center justify-center gap-2 mt-6 p-1.5 bg-amber-100/90 rounded-2xl max-w-md mx-auto border border-amber-300 shadow-xs">
            <button
              onClick={() => setActiveViewTab('register')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeViewTab === 'register'
                  ? 'bg-[#8B0000] text-white shadow-sm'
                  : 'text-amber-900 hover:bg-amber-200/60'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>प्रमाण पत्र बनाएं</span>
            </button>

            <button
              onClick={() => setActiveViewTab('calendar')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeViewTab === 'calendar'
                  ? 'bg-[#8B0000] text-white shadow-sm'
                  : 'text-amber-900 hover:bg-amber-200/60'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>पंचांग कैलेंडर ({festivalsForSelectedYear.length})</span>
            </button>

            <button
              onClick={() => setActiveViewTab('wall')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeViewTab === 'wall'
                  ? 'bg-[#8B0000] text-white shadow-sm'
                  : 'text-amber-900 hover:bg-amber-200/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>जारी प्रमाण पत्र ({greetings.length})</span>
            </button>
          </div>
        </div>

        {/* ----------------- TAB 1: GREETING CERTIFICATE GENERATOR ----------------- */}
        {activeViewTab === 'register' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Festival Picker Quick Ribbon */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-2xl p-4 border-2 border-amber-300 shadow-sm">
                  <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                    <div className="flex items-center gap-2 font-black text-sm text-[#8B0000]">
                      <Calendar className="w-4 h-4 text-amber-700" />
                      <span>1. त्यौहार चुनें (वर्ष {selectedYear})</span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                      {festivalsForSelectedYear.length} Festivals
                    </span>
                  </div>

                  {/* Festival Grid Selector */}
                  <div className="grid grid-cols-2 gap-2 mt-3 max-h-[380px] overflow-y-auto pr-1">
                    {festivalsForSelectedYear.map((fest) => {
                      const isSelected = selectedFestival.id === fest.id;
                      return (
                        <button
                          key={fest.id}
                          type="button"
                          onClick={() => setSelectedFestival(fest)}
                          className={`p-2.5 rounded-xl text-left border transition-all flex items-start gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400 shadow-sm'
                              : 'bg-white hover:bg-amber-50/50 border-amber-200'
                          }`}
                        >
                          <span className="text-xl shrink-0 mt-0.5">{fest.symbolEmoji}</span>
                          <div className="min-w-0">
                            <div className="font-black text-xs text-gray-900 truncate">
                              {fest.nameHindi}
                            </div>
                            <div className="text-[10px] text-amber-800 font-semibold truncate">
                              {fest.dateFormattedHindi}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Festival Spotlight Card */}
                <div className="bg-gradient-to-br from-[#8B0000] via-red-900 to-amber-950 text-white rounded-2xl p-5 shadow-lg border-2 border-amber-400 relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-6xl opacity-15 pointer-events-none">
                    {selectedFestival.symbolEmoji}
                  </div>
                  <div className="relative z-10 space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-[10px] font-bold border border-amber-400/30">
                      <span>चयनित पर्व • {selectedFestival.samvatYearHindi || `संवत ${yearMeta.vikramSamvat}`}</span>
                    </div>
                    <h3 className="text-xl font-black text-yellow-200 font-serif leading-tight">
                      {selectedFestival.nameHindi}
                    </h3>
                    <div className="text-xs text-amber-100 font-medium">
                      📅 {selectedFestival.dateFormattedHindi}
                    </div>
                    {selectedFestival.shubhMuhuratHindi && (
                      <div className="text-xs text-yellow-300 font-bold flex items-center gap-1 bg-black/30 p-2 rounded-lg border border-amber-500/30">
                        <Clock className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                        <span>{selectedFestival.shubhMuhuratHindi}</span>
                      </div>
                    )}
                    <p className="text-[11px] text-amber-100/90 italic pt-1 border-t border-amber-400/30">
                      "{selectedFestival.shloka}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Certificate Registration Form */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border-2 border-amber-300 shadow-md">
                <form onSubmit={handleRegisterGreeting} className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                    <div>
                      <h3 className="text-lg font-black text-[#8B0000] font-serif">
                        2. प्राप्तकर्ता का विवरण दर्ज करें
                      </h3>
                      <p className="text-xs text-gray-600">
                        प्रमाण पत्र में नाम, पद, फोटो एवं जीवन ज्योति फाउंडेशन का आधिकारिक सील-हस्ताक्षर अंकित होगा।
                      </p>
                    </div>
                    <span className="text-2xl">{selectedFestival.symbolEmoji}</span>
                  </div>

                  {formError && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-bold flex items-center gap-2">
                      <span>{formError}</span>
                    </div>
                  )}

                  {/* Recipient Photo Uploader */}
                  <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200">
                    <CandidatePhotoUploader
                      photoUrl={recipientPhoto}
                      onPhotoChange={(url: string) => setRecipientPhoto(url)}
                      onPhotoRemove={() => setRecipientPhoto('')}
                      required={false}
                      label="प्राप्तकर्ता की पासपोर्ट फोटो (वैकल्पिक परंतु प्रमाण पत्र हेतु अनुशंसित)"
                    />
                  </div>

                  {/* Name & Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-gray-800 mb-1">
                        प्राप्तकर्ता का पूरा नाम (Recipient Full Name) *
                      </label>
                      <input
                        type="text"
                        required
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="उदा. श्री राहुल शर्मा / श्रीमती रीता देवी"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#FFFDF9] font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-gray-800 mb-1">
                        प्राप्तकर्ता का पद / उपाधि (Designation / Title) *
                      </label>
                      <select
                        value={recipientTitle}
                        onChange={(e) => setRecipientTitle(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#FFFDF9] font-medium"
                      >
                        <option value="सम्मानित नागरिक (Respected Citizen)">सम्मानित नागरिक (Respected Citizen)</option>
                        <option value="समर्पित स्वयंसेवक (Dedicated Volunteer)">समर्पित स्वयंसेवक (Dedicated Volunteer)</option>
                        <option value="दानदाता एवं संरक्षक (Patron & Donor)">दानदाता एवं संरक्षक (Patron & Donor)</option>
                        <option value="आदरणीय परिवारजन एवं शुभचिंतक">आदरणीय परिवारजन एवं शुभचिंतक</option>
                        <option value="ग्राम प्रधान / क्षेत्र पंचायत सदस्य">ग्राम प्रधान / क्षेत्र पंचायत सदस्य</option>
                        <option value="वरिष्ठ समाजसेवी एवं मार्गदर्शक">वरिष्ठ समाजसेवी एवं मार्गदर्शक</option>
                        <option value="कर्मठ कार्यकर्ता एवं युवा साथी">कर्मठ कार्यकर्ता एवं युवा साथी</option>
                      </select>
                    </div>
                  </div>

                  {/* Mobile Phone */}
                  <div>
                    <label className="block text-xs font-extrabold text-gray-800 mb-1">
                      मोबाइल नंबर / WhatsApp (प्रमाण पत्र साझा करने हेतु)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91-XXXXXXXXXX"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#FFFDF9]"
                    />
                  </div>

                  {/* Structured Address */}
                  <div className="p-3.5 bg-amber-50/40 rounded-2xl border border-amber-200">
                    <div className="text-xs font-black text-amber-950 mb-2">
                      📍 प्रमाण पत्र पता विवरण (देश, राज्य, जिला, ब्लॉक व ग्राम) *
                    </div>
                    <StructuredAddressSelector
                      value={address}
                      onChange={(updated) => setAddress(updated)}
                    />
                  </div>

                  {/* Sender Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-gray-800 mb-1">
                        प्रेषक का नाम (Sender Name)
                      </label>
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="उदा. जीवन ज्योति फाउंडेशन गाज़ीपुर, उत्तर प्रदेश, भारत / आपका नाम"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#FFFDF9]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-gray-800 mb-1">
                        पंचांग संदर्भ (Panchang Reference)
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={selectedFestival.thakurPrasadRef || `श्री ठाकुर प्रसाद पंचांग संवत ${yearMeta.vikramSamvat}`}
                        className="w-full px-3.5 py-2 rounded-xl border border-amber-200 text-xs bg-amber-50 text-amber-900 font-semibold"
                      />
                    </div>
                  </div>

                  {/* Custom Message & Presets */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-extrabold text-gray-800">
                        शुभकामना संदेश (Custom Blessing Message)
                      </label>
                      <button
                        type="button"
                        onClick={() => setCustomMessage(selectedFestival.blessingHindi)}
                        className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline"
                      >
                        डिफ़ॉल्ट संदेश भरें
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="शुभकामना संदेश लिखें..."
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-[#FFFDF9] leading-relaxed"
                    />

                    {/* Dedication Presets */}
                    {selectedFestival.defaultDedications && selectedFestival.defaultDedications.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-bold text-gray-500 mt-0.5">सुझावित पंक्तियां:</span>
                        {selectedFestival.defaultDedications.map((dedication, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCustomMessage(dedication)}
                            className="px-2 py-0.5 bg-amber-100/70 hover:bg-amber-200 text-amber-900 rounded-md text-[10px] font-medium border border-amber-300 transition-colors"
                          >
                            + {dedication.substring(0, 32)}...
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#8B0000] via-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white font-extrabold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin text-yellow-200" />
                          <span>प्रमाण पत्र तैयार हो रहा है...</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-5 h-5 text-yellow-300" />
                          <span>
                            {selectedFestival.nameHindi} प्रमाण पत्र बनाएं व डाउनलोड करें ({selectedYear})
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 2: FULL FESTIVAL & PANCHANG CALENDAR ----------------- */}
        {activeViewTab === 'calendar' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-sm">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'सभी पर्व (All)' },
                  { id: 'religious', label: 'धार्मिक एवं आध्यात्मिक' },
                  { id: 'national', label: 'राष्ट्रीय महापर्व' },
                  { id: 'cultural', label: 'सांस्कृतिक एवं समरसता' },
                  { id: 'seasonal', label: 'ऋतु व फसल उत्सव' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-[#8B0000] text-white shadow-xs'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Hindu Maas Selector & Search */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedMaas}
                  onChange={(e) => setSelectedMaas(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-amber-300 text-xs font-bold text-amber-950 bg-amber-50 focus:outline-none"
                >
                  <option value="all">सभी 12 मास (All Maas)</option>
                  <option value="चैत्र">चैत्र मास (Chaitra)</option>
                  <option value="वैशाख">वैशाख मास (Vaishakh)</option>
                  <option value="ज्येष्ठ">ज्येष्ठ मास (Jyeshtha)</option>
                  <option value="आषाढ़">आषाढ़ मास (Ashadha)</option>
                  <option value="श्रावण">श्रावण मास (Shravan)</option>
                  <option value="भाद्रपद">भाद्रपद मास (Bhadrapad)</option>
                  <option value="आश्विन">आश्विन मास (Ashwin)</option>
                  <option value="कार्तिक">कार्तिक मास (Kartik)</option>
                  <option value="मार्गशीर्ष">मार्गशीर्ष मास (Agahan)</option>
                  <option value="पौष">पौष मास (Paush)</option>
                  <option value="माघ">माघ मास (Magha)</option>
                  <option value="फाल्गुन">फाल्गुन मास (Phalguna)</option>
                </select>

                <div className="relative flex-1 sm:w-56">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="पर्व खोजें (उदा. होली, छठ, संवत)..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300 bg-[#FFFDF9]"
                  />
                </div>
              </div>
            </div>

            {/* Festivals Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFestivals.map((festival) => (
                <div
                  key={festival.id}
                  className="bg-white rounded-2xl p-5 border-2 border-amber-200 hover:border-amber-400 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-3xl p-2 rounded-xl bg-amber-50 border border-amber-200 group-hover:scale-110 transition-transform">
                        {festival.symbolEmoji}
                      </span>
                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 block">
                          {festival.monthHindi}
                        </span>
                        {festival.hinduMonthHindi && (
                          <span className="text-[9px] font-bold text-amber-700 mt-1 block">
                            {festival.hinduMonthHindi}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="font-black text-base text-[#8B0000] mt-3 leading-snug">
                      {festival.nameHindi}
                    </h3>
                    <div className="text-xs text-gray-500 font-semibold">
                      {festival.nameEnglish}
                    </div>

                    {/* Exact Tithi & Date */}
                    <div className="mt-3 p-2 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-1">
                      <div className="text-xs font-bold text-amber-950 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                        <span>{festival.dateFormattedHindi}</span>
                      </div>
                      {festival.shubhMuhuratHindi && (
                        <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{festival.shubhMuhuratHindi}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-[11.5px] text-gray-600 mt-2.5 line-clamp-2 leading-relaxed">
                      {festival.blessingHindi}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-amber-100">
                    <button
                      onClick={() => {
                        setSelectedFestival(festival);
                        setActiveViewTab('register');
                        document.getElementById('festivals')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                      <span>शुभकामना पत्र बनाएं ({selectedYear})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: REGISTERED GREETINGS WALL ----------------- */}
        {activeViewTab === 'wall' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-700" />
                <span className="font-black text-sm text-gray-900">
                  हाल ही में जारी किए गए शुभकामना प्रमाण पत्र ({greetings.length})
                </span>
              </div>
              <button
                onClick={() => setActiveViewTab('register')}
                className="px-3 py-1.5 bg-[#8B0000] text-white rounded-xl text-xs font-bold hover:bg-red-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ नया प्रमाण पत्र बनाएं</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {greetings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border-2 border-amber-300 shadow-md hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between pb-3 border-b border-amber-100">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.symbolEmoji}</span>
                      <div>
                        <div className="font-black text-xs text-amber-950 leading-tight">
                          {item.festivalNameHindi}
                        </div>
                        <div className="text-[10px] font-mono text-gray-500">
                          {item.id}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                      {item.date}
                    </span>
                  </div>

                  <div className="py-3 space-y-1">
                    <div className="text-xs text-gray-500 font-semibold">
                      शुभकामना प्राप्तकर्ता:
                    </div>
                    <div className="text-base font-black text-[#8B0000]">
                      {item.recipientName}
                    </div>
                    <div className="text-xs font-bold text-gray-700">
                      {item.recipientTitle} • <span className="text-amber-800">{item.city}</span>
                    </div>

                    <p className="text-[11.5px] text-gray-600 line-clamp-2 mt-2 italic bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                      "{item.customMessage}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-amber-100 flex items-center gap-2">
                    <button
                      onClick={() => onOpenCertificate(item)}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1 cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>प्रमाण पत्र देखें / डाउनलोड</span>
                    </button>

                    <button
                      onClick={() => {
                        const shareText = `🪔 *${item.festivalNameHindi} की हार्दिक शुभकामनाएं!* 🪔\n\nआदरणीय *${item.recipientName}* (${item.recipientTitle})\n\n"${item.customMessage}"\n\n📜 *प्रमाण पत्र संख्या:* ${item.id}\n🚩 *श्री ठाकुर प्रसाद पंचांग प्रमाणित*\n🌐 *जीवन ज्योति फाउंडेशन गाज़ीपुर, उत्तर प्रदेश, भारत*\nReg. No: 03373`;
                        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
                      }}
                      className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors"
                      title="Share on WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FestivalGreetingsPortal;
