import { FestivalItem, FestivalGreetingRecord } from '../types';
import { getFestivalForYear, getPanchangYearMeta } from '../utils/thakurPrasadCalendar';

/**
 * श्री ठाकुर प्रसाद पंचांग (वाराणसी परंपरा) के अनुसार सर्वमान्य प्रामाणिक त्यौहार सूची (Base Definitions)
 */
export const FESTIVALS_BASE_DEFINITIONS: Omit<FestivalItem, 'dateFormattedHindi' | 'dateFormattedEnglish'>[] = [
  // 1. मकर संक्रांति
  {
    id: 'makar_sankranti',
    nameHindi: 'मकर संक्रांति, पोंगल एवं लोहड़ी (खिचड़ी पर्व)',
    nameEnglish: 'Makar Sankranti, Pongal & Lohri',
    monthHindi: 'पौष / माघ (जनवरी)',
    monthEnglish: 'January',
    hinduMonthHindi: 'माघ मास (सूर्य मकर राशि प्रवेश)',
    hinduMonthEnglish: 'Magha Maas (Solar Transit)',
    tithiHindi: 'उत्तरायण सूर्य संक्रांति',
    tithiEnglish: 'Solar Uttarayan Transit',
    paksha: 'solar',
    category: 'seasonal',
    symbolEmoji: '🪁',
    themeColor: {
      primary: '#D97706',
      secondary: '#CA8A04',
      border: 'border-yellow-400',
      badgeBg: 'bg-yellow-100 text-yellow-900',
      gradient: 'from-amber-500 via-yellow-500 to-orange-500',
      accent: '#713F12'
    },
    shloka: 'ॐ सूर्याय नमः। आदित्याय विद्महे दिवाकराय धीमहि तन्नः सूर्यः प्रचोदयात्॥',
    blessingHindi: 'सूर्यदेव के उत्तरायण, नव-ऊर्जा, तिल-गुड़ की मिठास और दान-पुण्य के पावन पर्व मकर संक्रांति, पोंगल एवं लोहड़ी की हार्दिक बधाई एवं मंगलकामनाएं।',
    blessingEnglish: 'May the holy transit of Sun Lord fill your life with warmth, harvest prosperity, vibrant health, and sweetest joys on Makar Sankranti.',
    defaultDedications: [
      'तिल-गुड़ जैसा मधुर प्रेम और पतंगों जैसी ऊंची उड़ान की मंगलकामनाएं।',
      'दान एवं सेवा का यह महापर्व आपके भंडार को निरंतर परिपूर्ण रखे।',
      'भगवान भास्कर आपके संपूर्ण परिवार को आरोग्य और यश प्रदान करें।'
    ]
  },
  // 2. मौनी अमावस्या (माघ अमावस्या)
  {
    id: 'mauni_amavasya',
    nameHindi: 'मौनी अमावस्या (माघ अमावस्या महाकुंभ स्नान)',
    nameEnglish: 'Mauni Amavasya Mahaparv',
    monthHindi: 'माघ (जनवरी/फरवरी)',
    monthEnglish: 'Jan/Feb',
    hinduMonthHindi: 'माघ मास',
    hinduMonthEnglish: 'Magha Maas',
    tithiHindi: 'माघ कृष्ण अमावस्या',
    tithiEnglish: 'Magha Krishna Amavasya',
    paksha: 'krishna',
    category: 'religious',
    symbolEmoji: '🌊',
    themeColor: {
      primary: '#0369A1',
      secondary: '#38BDF8',
      border: 'border-sky-400',
      badgeBg: 'bg-sky-100 text-sky-900',
      gradient: 'from-sky-700 via-blue-800 to-indigo-900',
      accent: '#0C4A6E'
    },
    shloka: 'गङ्गे च यमुने चैव गोदावरि सरस्वति। नर्मदे सिन्धु कावेरि जलेऽस्मिन् संनिधिं कुरु॥',
    blessingHindi: 'तीर्थराज प्रयाग, काशी एवं गंगा-यमुना संगम के परम पावन स्नान पर्व मौनी अमावस्या की आप सभी को कोटिशः मंगलमय शुभकामनाएं।',
    blessingEnglish: 'Heartfelt greetings on the sacred occasion of Mauni Amavasya! May holy river dips bring eternal purity, peace, and spiritual bliss to your life.',
    defaultDedications: [
      'पवित्र तीर्थ स्नान और मौन साधना से आत्मिक शांति प्राप्त हो।',
      'दान और परोपकार से जीवन के समस्त पापों का क्षय हो।'
    ]
  },
  // 3. गणतंत्र दिवस
  {
    id: 'republic_day',
    nameHindi: 'गणतंत्र दिवस (राष्ट्रीय गौरव महापर्व)',
    nameEnglish: 'Republic Day of India',
    monthHindi: 'जनवरी',
    monthEnglish: 'January',
    hinduMonthHindi: 'माघ मास',
    hinduMonthEnglish: 'Magha Maas',
    tithiHindi: '26 जनवरी • संविधान गौरव दिवस',
    tithiEnglish: '26th January • Constitution Day',
    paksha: 'solar',
    category: 'national',
    symbolEmoji: '🏛️',
    themeColor: {
      primary: '#1D4ED8',
      secondary: '#EA580C',
      border: 'border-blue-500',
      badgeBg: 'bg-blue-100 text-blue-950',
      gradient: 'from-orange-500 via-blue-700 to-green-600',
      accent: '#172554'
    },
    shloka: 'सत्यमेव जयते नानृतं सत्येन पन्था विततो देवयानः। सर्वे भवन्तु सुखिनः॥',
    blessingHindi: 'भारतीय संविधान, लोकतंत्र और संप्रभुता के गौरवशाली पर्व 26 जनवरी गणतंत्र दिवस की हार्दिक शुभकामनाएं। न्याय, समानता, बंधुता और सामाजिक न्याय के सिद्धांतों को अक्षुण्ण रखें।',
    blessingEnglish: 'Happy Republic Day! Celebrating the democratic ethos, social equality, and supreme constitutional values of our great nation.',
    defaultDedications: [
      'संविधान निर्माताओं को नमन के साथ गणतंत्र दिवस की हार्दिक बधाई।',
      'सशक्त नागरिक, समृद्ध गाज़ीपुर एवं सशक्त भारत की संकल्पना को साकार करें।'
    ]
  },
  // 4. बसंत पंचमी एवं सरस्वती पूजा
  {
    id: 'vasant_panchami',
    nameHindi: 'बसंत पंचमी एवं मां सरस्वती पूजा',
    nameEnglish: 'Vasant Panchami & Saraswati Puja',
    monthHindi: 'माघ (जनवरी/फरवरी)',
    monthEnglish: 'Jan/Feb',
    hinduMonthHindi: 'माघ मास',
    hinduMonthEnglish: 'Magha Maas',
    tithiHindi: 'माघ शुक्ल पंचमी (ऋतुराज बसंत आगमन)',
    tithiEnglish: 'Magha Shukla Panchami',
    paksha: 'shukla',
    category: 'religious',
    symbolEmoji: '🪕',
    themeColor: {
      primary: '#CA8A04',
      secondary: '#EAB308',
      border: 'border-yellow-400',
      badgeBg: 'bg-yellow-100 text-yellow-900',
      gradient: 'from-yellow-500 via-amber-500 to-orange-500',
      accent: '#854D0E'
    },
    shloka: 'या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता। या वीणावरदण्डमण्डितकरा या श्वेतपद्मासना॥ सा मां पातु सरस्वती भगवती निःशेषजाड्यापहा॥',
    blessingHindi: 'विद्या, बुद्धि, ज्ञान, कला एवं संगीत की अधिष्ठात्री मां भगवती सरस्वती की आराधना एवं ऋतुराज बसंत के आगमन के पावन पर्व बसंत पंचमी की हार्दिक बधाई व अनंत शुभकामनाएं।',
    blessingEnglish: 'May Goddess Saraswati bestow supreme wisdom, intellect, creative eloquence, and radiant knowledge upon you on Vasant Panchami.',
    defaultDedications: [
      'मां शारदे आपके जीवन में ज्ञान और विवेक का अमृत प्रवाहित करें।',
      'ऋतुराज बसंत आपके जीवन को नई उमंग और सकारात्मक ऊर्जा से परिपूर्ण करे।'
    ]
  },
  // 5. महाशिवरात्रि महापर्व
  {
    id: 'maha_shivratri',
    nameHindi: 'महाशिवरात्रि महापर्व (कल्याणकारी शिव-पार्वती उत्सव)',
    nameEnglish: 'Maha Shivratri Mahaparv',
    monthHindi: 'फाल्गुन (फरवरी/मार्च)',
    monthEnglish: 'Feb/March',
    hinduMonthHindi: 'फाल्गुन मास',
    hinduMonthEnglish: 'Phalguna Maas',
    tithiHindi: 'फाल्गुन कृष्ण चतुर्दशी (निशीथ काल)',
    tithiEnglish: 'Phalguna Krishna Chaturdashi',
    paksha: 'krishna',
    category: 'religious',
    symbolEmoji: '🕉️',
    themeColor: {
      primary: '#0F766E',
      secondary: '#14B8A6',
      border: 'border-teal-400',
      badgeBg: 'bg-teal-100 text-teal-900',
      gradient: 'from-teal-700 via-cyan-700 to-slate-800',
      accent: '#134E4A'
    },
    shloka: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥ कर्पूरगौरं करुणावतारं संसारसारम् भुजगेन्द्रहारम्। सदावसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि॥',
    blessingHindi: 'देवाधिदेव महादेव एवं माता पार्वती के पावन विवाह व कल्याणकारी उत्सव महाशिवरात्रि की आप सभी को अनंतानंत मंगलमय शुभकामनाएं। हर हर महादेव!',
    blessingEnglish: 'May Lord Shiva and Goddess Parvati shower supreme blessings of health, inner peace, strength, and enlightenment upon you on Maha Shivratri.',
    defaultDedications: [
      'भोलेनाथ की कृपा से आपके जीवन के सभी कष्ट दूर हों और मनोकामनाएं पूर्ण हों।',
      'महादेव के आशीर्वाद से जीवन में सदैव धर्म, सेवा और सत्कर्म का मार्ग प्रशस्त रहे।'
    ]
  },
  // 6. होली एवं धुलेंडी महापर्व
  {
    id: 'holi',
    nameHindi: 'होलिका दहन एवं होली (रंगोत्सव व धुलेंडी)',
    nameEnglish: 'Holi & Dhulandi Festival of Colors',
    monthHindi: 'फाल्गुन / चैत्र (मार्च)',
    monthEnglish: 'March',
    hinduMonthHindi: 'फाल्गुन मास (पूर्णिमा)',
    hinduMonthEnglish: 'Phalguna Maas Purnima',
    tithiHindi: 'फाल्गुन पूर्णिमा एवं चैत्र कृष्ण प्रतिपदा',
    tithiEnglish: 'Phalguna Purnima & Chaitra Pratipada',
    paksha: 'shukla',
    category: 'cultural',
    symbolEmoji: '🎨',
    themeColor: {
      primary: '#BE185D',
      secondary: '#EC4899',
      border: 'border-pink-400',
      badgeBg: 'bg-pink-100 text-pink-900',
      gradient: 'from-pink-600 via-purple-600 to-amber-500',
      accent: '#831843'
    },
    shloka: 'परस्परं भावयन्तः श्रेयः परमवाप्स्यथ। सर्वत्र सुखिनः सन्तु सन्तु सर्वे निरामयाः॥',
    blessingHindi: 'सौहार्द, प्रेम, उल्लास और सामाजिक समरसता के पावन पर्व होली पर जीवन ज्योति फाउंडेशन की ओर से हार्दिक बधाई। यह रंगों का उत्सव आपके जीवन में आनंद, ऊर्जा और सकारात्मक संकल्पों का नवीन रंग भरे।',
    blessingEnglish: 'May the vibrant colors of Holi bring boundless joy, peace, camaraderie, and radiant prosperity to you and your loved ones.',
    defaultDedications: [
      'स्नेह, सद्भाव और अपनत्व के पावन रंगों से परिपूर्ण होली की अशेष शुभकामनाएं।',
      'सभी भेदभाव मिटाकर परस्पर प्रेम और सहयोग की नई मिसाल कायम करें।'
    ]
  },
  // 7. चैत्र नवरात्रि एवं हिंदू नववर्ष (नवसंवत्सर)
  {
    id: 'chaitra_navratri',
    nameHindi: 'चैत्र नवरात्रि (कलश स्थापना) एवं नवसंवत्सर (हिंदू नववर्ष)',
    nameEnglish: 'Chaitra Navratri & Hindu New Year (Nav Samvatsar)',
    monthHindi: 'चैत्र (मार्च/अप्रैल)',
    monthEnglish: 'March/April',
    hinduMonthHindi: 'चैत्र मास (शुक्ल पक्ष)',
    hinduMonthEnglish: 'Chaitra Maas Shukla Paksha',
    tithiHindi: 'चैत्र शुक्ल प्रतिपदा (कलश स्थापना)',
    tithiEnglish: 'Chaitra Shukla Pratipada',
    paksha: 'shukla',
    category: 'religious',
    symbolEmoji: '🌸',
    themeColor: {
      primary: '#C2410C',
      secondary: '#FB923C',
      border: 'border-orange-400',
      badgeBg: 'bg-orange-100 text-orange-900',
      gradient: 'from-orange-600 via-amber-600 to-red-600',
      accent: '#7C2D12'
    },
    shloka: 'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥',
    blessingHindi: 'मां भगवती की नौ शक्तियों की उपासना के पावन पर्व चैत्र नवरात्रि और नवसंवत्सर (भारतीय नववर्ष) की अशेष मंगलकामनाएं। यह नववर्ष आपके जीवन में शुभता और सुख-समृद्धि लाए।',
    blessingEnglish: 'Warm wishes on Chaitra Navratri and Hindu New Year! May the divine Mother shower supreme grace, victory, and prosperity on your home.',
    defaultDedications: [
      'मां दुर्गा आपके जीवन को शक्ति, बुद्धि और सर्व मंगल से परिपूर्ण करें।',
      'नवसंवत्सर आपके जीवन में नवोत्साह और नए कीर्तिमान स्थापित करे।'
    ]
  },
  // 8. श्री राम नवमी
  {
    id: 'ram_navami',
    nameHindi: 'श्री राम नवमी (मर्यादा पुरुषोत्तम जन्मोत्सव)',
    nameEnglish: 'Shri Ram Navami Mahaparv',
    monthHindi: 'चैत्र (अप्रैल)',
    monthEnglish: 'April',
    hinduMonthHindi: 'चैत्र मास',
    hinduMonthEnglish: 'Chaitra Maas',
    tithiHindi: 'चैत्र शुक्ल नवमी (मध्याह्न 12:00 बजे)',
    tithiEnglish: 'Chaitra Shukla Navami',
    paksha: 'shukla',
    category: 'religious',
    symbolEmoji: '🏹',
    themeColor: {
      primary: '#B45309',
      secondary: '#F59E0B',
      border: 'border-amber-500',
      badgeBg: 'bg-amber-100 text-amber-900',
      gradient: 'from-amber-600 via-orange-600 to-yellow-600',
      accent: '#78350F'
    },
    shloka: 'भए प्रगट कृपाला दीनदयाला कौसल्या हितकारी। हरषित महतारी मुनि मन हारी अद्भुत रूप बिचारी॥ श्री रामचंद्र कृपालु भजु मन हरण भवभय दारुणम्॥',
    blessingHindi: 'मर्यादा पुरुषोत्तम, धर्मधुरंधर प्रभु श्री राम के पावन अवतरण दिवस श्री राम नवमी की समस्त सनातनी बंधुओं को कोटि-कोटि मंगलमय शुभकामनाएं। जय श्री राम!',
    blessingEnglish: 'Heartiest greetings on Shri Ram Navami! May the divine ideals and righteous blessings of Maryada Purushottam Lord Rama illuminate your path with truth and peace.',
    defaultDedications: [
      'प्रभु श्री राम का आशीर्वाद आपके जीवन में सुख, शांति और आरोग्य प्रदान करे।',
      'रामराज्य की परिकल्पना को सेवा और सद्भाव के माध्यम से साकार करें।'
    ]
  },
  // 9. हनुमान जयंती
  {
    id: 'hanuman_jayanti',
    nameHindi: 'श्री हनुमान जयंती (संकटमोचन जन्मोत्सव)',
    nameEnglish: 'Shri Hanuman Jayanti',
    monthHindi: 'चैत्र (अप्रैल)',
    monthEnglish: 'April',
    hinduMonthHindi: 'चैत्र मास',
    hinduMonthEnglish: 'Chaitra Maas',
    tithiHindi: 'चैत्र पूर्णिमा (चित्र नक्षत्र)',
    tithiEnglish: 'Chaitra Purnima',
    paksha: 'shukla',
    category: 'religious',
    symbolEmoji: '🚩',
    themeColor: {
      primary: '#DC2626',
      secondary: '#F97316',
      border: 'border-red-500',
      badgeBg: 'bg-red-100 text-red-950',
      gradient: 'from-red-600 via-orange-600 to-amber-600',
      accent: '#991B1B'
    },
    shloka: 'मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम्। वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये॥',
    blessingHindi: 'बल, बुद्धि, विद्या और असीम भक्ति के पुंज संकटमोचन श्री हनुमान जी के जन्मोत्सव हनुमान जयंती की हार्दिक शुभकामनाएं। पवनसुत आपके समस्त कष्ट हरें।',
    blessingEnglish: 'Happy Hanuman Jayanti! May Sankatmochan Lord Hanuman bless you with boundless courage, vitality, wisdom, and unshakeable inner strength.',
    defaultDedications: [
      'पवनसुत हनुमान जी की कृपा से आपके समस्त संकटों का निवारण हो।',
      'बजरंग बली आपके परिवार को निर्भयता और अटूट स्वास्थ्य का वरदान दें।'
    ]
  },
  // 10. अक्षय तृतीया एवं भगवान परशुराम जयंती
  {
    id: 'akshaya_tritiya',
    nameHindi: 'अक्षय तृतीया एवं भगवान परशुराम जयंती',
    nameEnglish: 'Akshaya Tritiya & Parshuram Jayanti',
    monthHindi: 'वैशाख (अप्रैल/मई)',
    monthEnglish: 'April/May',
    hinduMonthHindi: 'वैशाख मास',
    hinduMonthEnglish: 'Vaishakha Maas',
    tithiHindi: 'वैशाख शुक्ल तृतीया (अक्षय फल प्राप्ति)',
    tithiEnglish: 'Vaishakha Shukla Tritiya',
    paksha: 'shukla',
    category: 'religious',
    symbolEmoji: '🪙',
    themeColor: {
      primary: '#D97706',
      secondary: '#FBBF24',
      border: 'border-yellow-500',
      badgeBg: 'bg-yellow-100 text-yellow-900',
      gradient: 'from-amber-500 via-yellow-400 to-orange-500',
      accent: '#78350F'
    },
    shloka: 'अक्षय्यं सर्वकल्याणं यस्मात्कर्म प्रजायते। तस्मादियं तृतीया च ख्याता ह्यक्षयतृतीया॥',
    blessingHindi: 'दान, पुण्य, तप और अटूट अक्षय फल देने वाले पावन पर्व अक्षय तृतीया एवं भगवान परशुराम जयंती की हार्दिक बधाई। मां लक्ष्मी आपके भंडार को अक्षय रखें।',
    blessingEnglish: 'Wishing you eternal wealth, unfading joy, and supreme fortune on the auspicious day of Akshaya Tritiya.',
    defaultDedications: [
      'आपके जीवन में पुण्य, यश और वैभव सदैव अक्षय और अखंड रहे।',
      'अक्षय तृतीया का पावन पर्व आपके घर में सुख-समृद्धि की वर्षा करे।'
    ]
  },
  // 11. ईद-उल-फ़ितर
  {
    id: 'eid_ul_fitr',
    nameHindi: 'ईद-उल-फ़ितर (मीठी ईद व भाईचारा उत्सव)',
    nameEnglish: 'Eid-ul-Fitr Celebration',
    monthHindi: 'शव्वाल (मार्च/अप्रैल/मई)',
    monthEnglish: 'Spring',
    hinduMonthHindi: 'शव्वाल 1',
    hinduMonthEnglish: 'Shawwal 1',
    tithiHindi: 'चांद के दीदार उपरांत शव्वाल माह प्रथम दिवस',
    tithiEnglish: 'First Day of Shawwal',
    paksha: 'hijri',
    category: 'cultural',
    symbolEmoji: '🌙',
    themeColor: {
      primary: '#047857',
      secondary: '#10B981',
      border: 'border-emerald-400',
      badgeBg: 'bg-emerald-100 text-emerald-950',
      gradient: 'from-emerald-700 via-teal-700 to-green-600',
      accent: '#064E3B'
    },
    shloka: 'तस्माद् भ्रातृभावं संवर्धयन्तु। सर्वेषां सुखशान्तिसमृद्धिश्च भवतु॥',
    blessingHindi: 'पवित्र रमज़ान के उपरांत अमन, चैन, भाईचारे और खुशियों के मुबारक पर्व ईद-उल-फ़ितर की जीवन ज्योति फाउंडेशन की ओर से दिली मुबारकबाद। ईद मुबारक!',
    blessingEnglish: 'Eid Mubarak! May this joyous day bring divine peace, harmony, bountiful blessings, and happiness to all homes and hearts.',
    defaultDedications: [
      'परस्पर प्रेम, सौहार्द और खुशहाली का यह पावन पैगाम हर दिल को महकाए।',
      'ईद की मिठास समाज में आपसी भाईचारे और एकात्मता को और अधिक सुदृढ़ करे।'
    ]
  },
  // 12. गंगा दशहरा एवं निर्जला एकादशी
  {
    id: 'ganga_dussehra',
    nameHindi: 'गंगा दशहरा एवं निर्जला एकादशी महापर्व',
    nameEnglish: 'Ganga Dussehra & Nirjala Ekadashi',
    monthHindi: 'ज्येष्ठ (मई/जून)',
    monthEnglish: 'May/June',
    hinduMonthHindi: 'ज्येष्ठ मास',
    hinduMonthEnglish: 'Jyeshtha Maas',
    tithiHindi: 'ज्येष्ठ शुक्ल दशमी एवं एकादशी',
    tithiEnglish: 'Jyeshtha Shukla Dashami & Ekadashi',
    paksha: 'shukla',
    category: 'religious',
    symbolEmoji: '🏺',
    themeColor: {
      primary: '#0284C7',
      secondary: '#38BDF8',
      border: 'border-sky-400',
      badgeBg: 'bg-sky-100 text-sky-900',
      gradient: 'from-sky-600 via-blue-600 to-teal-700',
      accent: '#0369A1'
    },
    shloka: 'नमो भगवत्यै दशपापहरायै गङ्गायै नारायण्यै रेवत्यै शिवायै अमृतायै विश्वरूपिण्यै नन्दितायै ते नमो नमः॥',
    blessingHindi: 'मां गंगा के भू-अवतरण दिवस गंगा दशहरा एवं भीमसेनी निर्जला एकादशी की हार्दिक बधाई। मां गंगा आपके जीवन के समस्त त्रितापों को शांत करें।',
    blessingEnglish: 'Warm wishes on Ganga Dussehra! May the celestial grace of Mother Ganga purify your thoughts and bless your lineage with virtue and health.',
    defaultDedications: [
      'पतितपावनी मां गंगा की कृपा आप और आपके परिवार पर सदा बनी रहे।',
      'गंगा और नदियों के संरक्षण का संकल्प लेकर पर्यावरण को समृद्ध करें।'
    ]
  },
  // 13. गुरु पूर्णिमा एवं व्यास पूजा
  {
    id: 'guru_purnima',
    nameHindi: 'गुरु पूर्णिमा एवं महर्षि वेदव्यास जयंती',
    nameEnglish: 'Guru Purnima & Ved Vyas Jayanti',
    monthHindi: 'आषाढ़ (जुलाई)',
    monthEnglish: 'July',
    hinduMonthHindi: 'आषाढ़ मास',
    hinduMonthEnglish: 'Ashadha Maas',
    tithiHindi: 'आषाढ़ पूर्णिमा (व्यास पूर्णिमा)',
    tithiEnglish: 'Ashadha Purnima',
    paksha: 'shukla',
    category: 'religious',
    symbolEmoji: '🪔',
    themeColor: {
      primary: '#B45309',
      secondary: '#F59E0B',
      border: 'border-amber-400',
      badgeBg: 'bg-amber-100 text-amber-900',
      gradient: 'from-amber-600 via-orange-600 to-yellow-600',
      accent: '#78350F'
    },
    shloka: 'गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः। गुरुः साक्षात् परं ब्रह्म तस्मै श्रीगुरवे नमः॥ अखंडमंडलाकारं व्याप्तं येन चराचरम्। तत्पदं दर्शितं येन तस्मै श्रीगुरवे नमः॥',
    blessingHindi: 'अज्ञान के अंधकार को मिटाकर ज्ञान का अलौकिक प्रकाश देने वाले समस्त आदरणीय गुरुजनों के वंदन के पावन पर्व गुरु पूर्णिमा की हार्दिक शुभकामनाएं।',
    blessingEnglish: 'Happy Guru Purnima! Bowing with utmost reverence to our gurus and teachers who guide us from darkness to light and selfless wisdom.',
    defaultDedications: [
      'सद्गुरु के चरणों में शत-शत नमन, जिनकी प्रेरणा से जीवन सार्थक होता है।',
      'गुरु की कृपा से जीवन में ज्ञान, विनम्रता और सेवा भाव का निरंतर संचार हो।'
    ]
  },
  // 14. नाग पंचमी
  {
    id: 'nag_panchami',
    nameHindi: 'नाग पंचमी (कालसर्प दोष निवारण एवं प्रकृति पूजन)',
    nameEnglish: 'Nag Panchami Mahaparv',
    monthHindi: 'श्रावण (जुलाई/अगस्त)',
    monthEnglish: 'July/August',
    hinduMonthHindi: 'श्रावण मास (सावन)',
    hinduMonthEnglish: 'Shravana Maas',
    tithiHindi: 'श्रावण शुक्ल पंचमी',
    tithiEnglish: 'Shravana Shukla Panchami',
    paksha: 'shukla',
    category: 'religious',
    symbolEmoji: '🐍',
    themeColor: {
      primary: '#0D9488',
      secondary: '#14B8A6',
      border: 'border-teal-400',
      badgeBg: 'bg-teal-100 text-teal-900',
      gradient: 'from-teal-700 via-emerald-700 to-cyan-800',
      accent: '#115E59'
    },
    shloka: 'सर्वे नागाः प्रीयन्तां मे ये केचित् पृथिवीतले। ये च हेतिमरीचिस्था येऽन्तरे दिवि संस्थिताः॥',
    blessingHindi: 'भगवान भोलेनाथ के आभूषण नाग देवता की पूजा एवं प्रकृति संरक्षण के पावन पर्व नाग पंचमी की हार्दिक बधाई व अनंत शुभकामनाएं।',
    blessingEnglish: 'Heartiest greetings on Nag Panchami! May Lord Shiva and Nag Devta protect you from fear and bless your household with strength and peace.',
    defaultDedications: [
      'नाग देवता आपके परिवार को विषैले विकारों से मुक्त कर सुख-शांति प्रदान करें।',
      'सावन मास में महादेव की असीम कृपा आप पर सदैव बरसती रहे।'
    ]
  },
  // 15. स्वतंत्रता दिवस
  {
    id: 'independence_day',
    nameHindi: 'स्वतंत्रता दिवस (अमृत काल - राष्ट्रीय महापर्व)',
    nameEnglish: 'Independence Day of India',
    monthHindi: 'अगस्त',
    monthEnglish: 'August',
    hinduMonthHindi: 'श्रावण / भाद्रपद',
    hinduMonthEnglish: 'Shravan / Bhadrapad',
    tithiHindi: '15 अगस्त • राष्ट्रीय स्वाधीनता महापर्व',
    tithiEnglish: '15th August • Independence Day',
    paksha: 'solar',
    category: 'national',
    symbolEmoji: '🇮🇳',
    themeColor: {
      primary: '#EA580C',
      secondary: '#16A34A',
      border: 'border-orange-500',
      badgeBg: 'bg-orange-100 text-orange-950',
      gradient: 'from-orange-600 via-white to-green-700',
      accent: '#1E3A8A'
    },
    shloka: 'जननी जन्मभूमिश्च स्वर्गादपि गरीयसी। राष्ट्राय स्वाहा, राष्ट्राय इदं न मम॥',
    blessingHindi: 'मातृभूमि की स्वतंत्रता, एकता एवं अखंडता के पावन राष्ट्रीय पर्व 15 अगस्त पर समस्त देशवासियों को सादर जय हिंद! आइए, राष्ट्र निर्माण और असहायों की सेवा का अटूट संकल्प लें।',
    blessingEnglish: 'Warm greetings on the auspicious Independence Day! Let us unite in nation building, social upliftment, and selfless humanitarian service for Mother India.',
    defaultDedications: [
      'अमर शहीदों को कोटि-कोटि नमन के साथ स्वतंत्रता दिवस की गर्वमयी शुभकामनाएं।',
      'विकसित भारत और सशक्त समाज के निर्माण में अपना बहुमूल्य योगदान दें।'
    ]
  },
  // 16. रक्षा बंधन एवं श्रावणी उपाकर्म
  {
    id: 'raksha_bandhan',
    nameHindi: 'रक्षा बंधन एवं संस्कृत दिवस (श्रावणी पूर्णिमा)',
    nameEnglish: 'Raksha Bandhan Mahaparv',
    monthHindi: 'श्रावण (अगस्त)',
    monthEnglish: 'August',
    hinduMonthHindi: 'श्रावण मास (पूर्णिमा)',
    hinduMonthEnglish: 'Shravana Maas Purnima',
    tithiHindi: 'श्रावण शुक्ल पूर्णिमा (श्रावणी उपाकर्म)',
    tithiEnglish: 'Shravana Shukla Purnima',
    paksha: 'shukla',
    category: 'cultural',
    symbolEmoji: '🧵',
    themeColor: {
      primary: '#9333EA',
      secondary: '#C084FC',
      border: 'border-purple-400',
      badgeBg: 'bg-purple-100 text-purple-900',
      gradient: 'from-purple-600 via-pink-600 to-red-500',
      accent: '#581C87'
    },
    shloka: 'येन बद्धो बली राजा दानवेन्द्रो महाबलः। तेन त्वामनुबध्नामि रक्षे मा चल मा चल॥',
    blessingHindi: 'भाई-बहन के अटूट स्नेह, विश्वास, समर्पण और रक्षा के पवित्र पर्व रक्षाबंधन की हार्दिक बधाई एवं शुभकामनाएं। यह पावन सूत्र समाज में नारी सुरक्षा और सम्मान का संवाहक बने।',
    blessingEnglish: 'Happy Raksha Bandhan! Celebrating the sacred bond of love, care, duty, and eternal protection between siblings.',
    defaultDedications: [
      'स्नेह और विश्वास के पवित्र रक्षासूत्र से जुड़े इस महापर्व की हार्दिक बधाई।',
      'प्रत्येक बहन के सम्मान, सुरक्षा और आत्मनिर्भरता हेतु हम सदैव संकल्पित हैं।'
    ]
  },
  // 17. श्री कृष्ण जन्माष्टमी
  {
    id: 'janmashtami',
    nameHindi: 'श्री कृष्ण जन्माष्टमी (रोहिणी नक्षत्र जन्मोत्सव)',
    nameEnglish: 'Shri Krishna Janmashtami',
    monthHindi: 'भाद्रपद (अगस्त/सितम्बर)',
    monthEnglish: 'August/September',
    hinduMonthHindi: 'भाद्रपद मास (भादों)',
    hinduMonthEnglish: 'Bhadrapada Maas',
    tithiHindi: 'भाद्रपद कृष्ण अष्टमी (निशीथ काल मध्यरात्रि)',
    tithiEnglish: 'Bhadrapada Krishna Ashtami',
    paksha: 'krishna',
    category: 'religious',
    symbolEmoji: '🦚',
    themeColor: {
      primary: '#1E40AF',
      secondary: '#3B82F6',
      border: 'border-blue-400',
      badgeBg: 'bg-blue-100 text-blue-900',
      gradient: 'from-blue-700 via-indigo-700 to-teal-600',
      accent: '#1E3A8A'
    },
    shloka: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥ वसुदेवसुतं देवं कंसचाणूरमर्दनम्। देवकीपरमानन्दं कृष्णं वन्दे जगद्गुरुम्॥',
    blessingHindi: 'कर्मयोग के प्रणेता, जगद्गुरु भगवान श्री कृष्ण के पावन प्राकट्योत्सव श्री कृष्ण जन्माष्टमी की आप सभी को कोटिशः मंगलकामनाएं। जय श्री कृष्णा!',
    blessingEnglish: 'May the flute notes of Lord Krishna fill your life with divine joy, virtue, truth, and fearless duty (Karma Yoga). Happy Janmashtami!',
    defaultDedications: [
      'माखनचोर, मुरलीधर कन्हैया आपके घर में सुख, शांति और आरोग्य का वरदान दें।',
      'गीता के निष्काम कर्मयोग का संदेश हम सभी के जीवन का मार्गदर्शक बने।'
    ]
  },
  // 18. हरतालिका तीज
  {
    id: 'hartalika_teej',
    nameHindi: 'हरतालिका तीज व्रत (अखंड सौभाग्य पर्व)',
    nameEnglish: 'Hartalika Teej Vrat',
    monthHindi: 'भाद्रपद (अगस्त/सितम्बर)',
    monthEnglish: 'Aug/Sept',
    hinduMonthHindi: 'भाद्रपद मास',
    hinduMonthEnglish: 'Bhadrapada Maas',
    tithiHindi: 'भाद्रपद शुक्ल तृतीya (हस्त नक्षत्र)',
    tithiEnglish: 'Bhadrapada Shukla Tritiya',
    paksha: 'shukla',
    category: 'religious',
    symbolEmoji: '🪞',
    themeColor: {
      primary: '#BE123C',
      secondary: '#FB7185',
      border: 'border-rose-400',
      badgeBg: 'bg-rose-100 text-rose-900',
      gradient: 'from-rose-600 via-pink-600 to-amber-500',
      accent: '#881337'
    },
    shloka: 'उमामहेश्वराभ्यां नमः। अखण्ड सौभाग्यमारोग्यं देहि मे परमेश्वरि॥',
    blessingHindi: 'पति की दीर्घायु, अखंड सौभाग्य एवं पारिवारिक सुख-शांति के पावन पर्व हरतालिका तीज की समस्त माताओं-बहनों को हार्दिक बधाई एवं मंगलकामनाएं।',
    blessingEnglish: 'Warm wishes on Hartalika Teej! May Goddess Parvati and Lord Shiva bless your marriage with everlasting love, longevity, and joy.',
    defaultDedications: [
      'माता पार्वती की कृपा से आपके घर में अखंड सौभाग्य और सुख का वास रहे।',
      'त्याग और समर्पण का यह व्रत आपके वैवाहिक जीवन को माधुर्य प्रदान करे।'
    ]
  },
  // 19. गणेश चतुर्थी (विघ्नहर्ता उत्सव)
  {
    id: 'ganesh_chaturthi',
    nameHindi: 'गणेश चतुर्थी (विघ्नहर्ता उत्सव व अनंत महोत्सव)',
    nameEnglish: 'Ganesh Chaturthi Mahotsav',
    monthHindi: 'भाद्रपद (सितम्बर)',
    monthEnglish: 'September',
    hinduMonthHindi: 'भाद्रपद मास',
    hinduMonthEnglish: 'Bhadrapada Maas',
    tithiHindi: 'भाद्रपद शुक्ल चतुर्थी (मध्याह्न स्थापना)',
    tithiEnglish: 'Bhadrapada Shukla Chaturthi',
    paksha: 'shukla',
    category: 'religious',
    symbolEmoji: '🐘',
    themeColor: {
      primary: '#B91C1C',
      secondary: '#F97316',
      border: 'border-red-400',
      badgeBg: 'bg-red-100 text-red-900',
      gradient: 'from-red-600 via-orange-600 to-amber-500',
      accent: '#7F1D1D'
    },
    shloka: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥ गजाननं भूतगणादिसेवितं कपित्थजम्बूफलचारुभक्षणम्। उमासुतं शोकविनाशकारकं नमामि विघ्नेश्वरपादपङ्कजम्॥',
    blessingHindi: 'बुद्धि, ज्ञान, ऋद्धि-सिद्धि के दाता भगवान श्री गणेश जी के जन्मोत्सव गणेश चतुर्थी की हार्दिक मंगलकामनाएं। गणपति बाप्पा आपके सभी विघ्न हरें।',
    blessingEnglish: 'Warm greetings on Ganesh Chaturthi! May Lord Vighnaharta eliminate all obstacles and bestow boundless wisdom and prosperity upon you.',
    defaultDedications: [
      'गणपति बाप्पा मोरया! आपके सभी नए संकल्पों और कार्यों में निर्विघ्न सफलता प्राप्त हो।',
      'रिद्धि-सिद्धि और शुभ-लाभ का आपके घर में सदा वास रहे।'
    ]
  },
  // 20. गांधी जयंती एवं लाल बहादुर शास्त्री जयंती
  {
    id: 'gandhi_jayanti',
    nameHindi: 'गांधी जयंती एवं शास्त्री जयंती',
    nameEnglish: 'Gandhi & Shastri Jayanti',
    monthHindi: 'अक्टूबर',
    monthEnglish: 'October',
    hinduMonthHindi: 'आश्विन मास',
    hinduMonthEnglish: 'Ashvina Maas',
    tithiHindi: '02 अक्टूबर • सत्य, अहिंसा, सादगी व स्वावलंबन दिवस',
    tithiEnglish: '2nd October • National Day',
    paksha: 'solar',
    category: 'national',
    symbolEmoji: '🕊️',
    themeColor: {
      primary: '#374151',
      secondary: '#65A30D',
      border: 'border-gray-400',
      badgeBg: 'bg-gray-100 text-gray-900',
      gradient: 'from-slate-700 via-lime-700 to-amber-600',
      accent: '#111827'
    },
    shloka: 'अहिंसा परमो धर्मः धर्महिंसा तथैव च। सत्यमेव जयते नानृतम्॥',
    blessingHindi: 'राष्ट्रपिता महात्मा गांधी एवं पूर्व प्रधानमंत्री लाल बहादुर शास्त्री जी की जयंती पर शत-शत नमन। सत्य, अहिंसा, स्वच्छता, जय जवान-जय किसान के आदर्शों को जीवन में अपनाएं।',
    blessingEnglish: 'Remembering the apostles of Truth, Non-Violence, Simplicity, and Self-Reliance on Gandhi & Shastri Jayanti. Let us serve humanity with pure integrity.',
    defaultDedications: [
      'सत्य और अहिंसा के मार्ग पर चलकर समाज में बदलाव लाने का संकल्प लें।',
      'स्वच्छता, सादगी और कर्तव्यनिष्ठा ही राष्ट्रपिता के प्रति सच्ची श्रद्धांजलि है।'
    ]
  },
  // 21. शारदीय नवरात्रि (कलश स्थापना)
  {
    id: 'sharad_navratri',
    nameHindi: 'शारदीय नवरात्रि (कलश स्थापना व दुर्गा पूजा उत्सव)',
    nameEnglish: 'Sharadiya Navratri & Durga Puja',
    monthHindi: 'आश्विन (सितम्बर/अक्टूबर)',
    monthEnglish: 'Sept/Oct',
    hinduMonthHindi: 'आश्विन मास (क्वांर)',
    hinduMonthEnglish: 'Ashvina Maas (Kunwar)',
    tithiHindi: 'आश्विन शुक्ल प्रतिपदा (घटस्थापना)',
    tithiEnglish: 'Ashvina Shukla Pratipada',
    paksha: 'shukla',
    category: 'religious',
    symbolEmoji: '🔱',
    themeColor: {
      primary: '#DC2626',
      secondary: '#F59E0B',
      border: 'border-red-500',
      badgeBg: 'bg-red-100 text-red-950',
      gradient: 'from-red-700 via-orange-600 to-yellow-500',
      accent: '#991B1B'
    },
    shloka: 'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥ या देवी सर्वभूतेषु शक्तिरूपेण संस्थिता। नमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः॥',
    blessingHindi: 'आदिशक्ति मां भगवती दुर्गा के नौ रूपों की आराधना के महापर्व शारदीय नवरात्रि की हार्दिक शुभकामनाएं। मां अंबे आपके जीवन से समस्त आसुरी प्रवृत्तियों का संहार करें।',
    blessingEnglish: 'Heartfelt greetings on Sharad Navratri! May Maa Durga shower divine grace, courage, and triumph over all difficulties upon your household.',
    defaultDedications: [
      'मां अंबे की कृपा से आपके घर में सुख, शांति, बुद्धि और समृद्धि का वास हो।',
      'नारी शक्ति और पर्यावरण के प्रति सम्मान का पावन संकल्प लें।'
    ]
  },
  // 22. विजयादशमी (दशहरा महापर्व)
  {
    id: 'dussehra',
    nameHindi: 'विजयादशमी (दशहरा महापर्व व शस्त्र पूजन)',
    nameEnglish: 'Vijayadashami (Dussehra Mahaparv)',
    monthHindi: 'आश्विन (अक्टूबर)',
    monthEnglish: 'October',
    hinduMonthHindi: 'आश्विन मास',
    hinduMonthEnglish: 'Ashvina Maas',
    tithiHindi: 'आश्विन शुक्ल दशमी (अपराह्न विजय मुहूर्त)',
    tithiEnglish: 'Ashvina Shukla Dashami',
    paksha: 'shukla',
    category: 'religious',
    symbolEmoji: '🏹',
    themeColor: {
      primary: '#C2410C',
      secondary: '#F59E0B',
      border: 'border-orange-500',
      badgeBg: 'bg-orange-100 text-orange-950',
      gradient: 'from-orange-700 via-red-600 to-amber-600',
      accent: '#7C2D12'
    },
    shloka: 'धर्मो रक्षति रक्षितः। यतो धर्मस्ततो जयः। सत्यमेव जयते नानृतम्॥',
    blessingHindi: 'बुराई पर अच्छाई, अधर्म पर धर्म और असत्य पर सत्य की शाश्वत विजय के महापर्व विजयादशमी (दशहरा) की आप सभी को हार्दिक बधाई एवं अनंत शुभकामनाएं।',
    blessingEnglish: 'Happy Vijayadashami! Celebrating the timeless victory of righteousness over wickedness, truth over falsehood, and light over darkness.',
    defaultDedications: [
      'आपके अंतःकरण के सभी विकारों का शमन हो और सद्गुणों की विजय हो।',
      'दशहरा का यह पावन पर्व आपके जीवन में नई उमंग, पराक्रम और विजयश्री लेकर आए।'
    ]
  },
  // 23. करवा चौथ व्रत
  {
    id: 'karwa_chauth',
    nameHindi: 'करवा चौथ व्रत (पति दीर्घायु एवं सौभाग्य पर्व)',
    nameEnglish: 'Karwa Chauth Vrat',
    monthHindi: 'कार्तिक (अक्टूबर/नवम्बर)',
    monthEnglish: 'Oct/Nov',
    hinduMonthHindi: 'कार्तिक मास',
    hinduMonthEnglish: 'Kartika Maas',
    tithiHindi: 'कार्तिक कृष्ण चतुर्थी (चंद्रोदय पूजन)',
    tithiEnglish: 'Kartika Krishna Chaturthi',
    paksha: 'krishna',
    category: 'religious',
    symbolEmoji: '🌕',
    themeColor: {
      primary: '#9D174D',
      secondary: '#F472B6',
      border: 'border-pink-500',
      badgeBg: 'bg-pink-100 text-pink-950',
      gradient: 'from-pink-700 via-rose-600 to-amber-500',
      accent: '#831843'
    },
    shloka: 'ॐ शिवायै नमः। नमः शिवायै शर्वाण्यै सौभाग्यं संततिं शुभाम्। प्रयच्छ भक्तियुक्तायै नारीणां हरवल्लभे॥',
    blessingHindi: 'अटूट प्रेम, त्याग, विश्वास और पति के दीर्घ जीवन के पावन व्रत करवा चौथ की समस्त सुहागिनों को हार्दिक शुभकामनाएं।',
    blessingEnglish: 'Warm wishes on Karwa Chauth! May the sacred moonlight bless your marital bond with eternal love, harmony, and togetherness.',
    defaultDedications: [
      'चांद की चांदनी आपके वैवाहिक जीवन में प्रेम और खुशहाली का प्रकाश भरे।',
      'पारिवारिक सौहार्द और अटूट विश्वास का यह बंधन सदा अमर रहे।'
    ]
  },
  // 24. धनतेरस (धन्वंतरि त्रयोदशी)
  {
    id: 'dhanteras',
    nameHindi: 'धनतेरस एवं भगवान धन्वंतरि जयंती (आरोग्य दिवस)',
    nameEnglish: 'Dhanteras & Lord Dhanvantari Jayanti',
    monthHindi: 'कार्तिक (अक्टूबर/नवम्बर)',
    monthEnglish: 'Oct/Nov',
    hinduMonthHindi: 'कार्तिक मास',
    hinduMonthEnglish: 'Kartika Maas',
    tithiHindi: 'कार्तिक कृष्ण त्रयोदशी (प्रदोष काल दीपदान)',
    tithiEnglish: 'Kartika Krishna Trayodashi',
    paksha: 'krishna',
    category: 'religious',
    symbolEmoji: '💰',
    themeColor: {
      primary: '#B45309',
      secondary: '#F59E0B',
      border: 'border-amber-400',
      badgeBg: 'bg-amber-100 text-amber-900',
      gradient: 'from-amber-600 via-yellow-500 to-orange-600',
      accent: '#78350F'
    },
    shloka: 'नमामि धन्वंतरिमादिदेवं सुरासुरैर्वन्दितपादपद्मम्। लोके जरारुग्भयमृत्युनाशं दातारमीशं विविधौषधीनाम्॥',
    blessingHindi: 'आरोग्य के अधिष्ठाता भगवान धन्वंतरि जयंती एवं धनतेरस महापर्व की हार्दिक बधाई। कुबेर देव और मां लक्ष्मी आपके घर में धन, धान्य और आरोग्य की वर्षा करें।',
    blessingEnglish: 'May Lord Dhanvantari and Goddess Lakshmi bless you and your family with radiant health, immense prosperity, and auspicious fortune on Dhanteras.',
    defaultDedications: [
      'प्रथम सुख निरोगी काया! भगवान धन्वंतरि आपको पूर्ण आरोग्य प्रदान करें।',
      'कुबेर देव की कृपा से आपके घर में सुख, शांति और वैभव का वास हो।'
    ]
  },
  // 25. दीपावली एवं लक्ष्मी-गणेश पूजन
  {
    id: 'diwali',
    nameHindi: 'दीपावली महापर्व एवं श्री लक्ष्मी-गणेश पूजन',
    nameEnglish: 'Deepawali Mahaparv & Shri Lakshmi-Ganesh Pujan',
    monthHindi: 'कार्तिक (अक्टूबर/नवम्बर)',
    monthEnglish: 'October/November',
    hinduMonthHindi: 'कार्तिक मास (अमावस्या)',
    hinduMonthEnglish: 'Kartika Maas Amavasya',
    tithiHindi: 'कार्तिक कृष्ण अमावस्या (महालक्ष्मी प्रदोष पूजन)',
    tithiEnglish: 'Kartika Krishna Amavasya',
    paksha: 'krishna',
    category: 'religious',
    symbolEmoji: '🪔',
    themeColor: {
      primary: '#B45309',
      secondary: '#F59E0B',
      border: 'border-amber-400',
      badgeBg: 'bg-amber-100 text-amber-900',
      gradient: 'from-amber-600 via-orange-600 to-yellow-600',
      accent: '#78350F'
    },
    shloka: 'ॐ असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्माऽमृतं गमय॥ ॐ श्रीं ह्रीं क्लीं त्रिभुवन महालक्ष्म्यै अस्मांक दारिद्र्य नाशय प्रचुर धन देहि क्लीं ह्रीं श्रीं ॐ नमः॥',
    blessingHindi: 'जीवन ज्योति फाउंडेशन गाज़ीपुर (उत्तर प्रदेश, भारत) की ओर से आपको एवं आपके संपूर्ण परिवार को प्रकाश, समृद्धि, आरोग्य एवं अनंत खुशियों के महापर्व दीपावली की कोटि-कोटि मंगलमय शुभकामनाएं। यह दीप-पर्व आपके जीवन में ज्ञान और सेवा का अलौकिक प्रकाश फैलाए।',
    blessingEnglish: 'On the auspicious occasion of Deepawali, Jeevan Jyoti Foundation Ghazipur (Uttar Pradesh, India) wishes you and your family abundant joy, prosperity, health, and radiant light of wisdom and selfless service.',
    defaultDedications: [
      'दीपों का यह पावन पर्व आपके जीवन को सुख, शांति एवं अपार समृद्धि से आलोकित करे।',
      'मां लक्ष्मी व भगवान गणेश जी की असीम अनुकंपा आप पर सदैव बनी रहे।',
      'समाज के अंतिम पंक्ति के व्यक्ति के जीवन में उजाला लाने के संकल्प के साथ हार्दिक बधाई।'
    ]
  },
  // 26. गोवर्धन पूजा एवं भाई दूज
  {
    id: 'govardhan_bhai_dooj',
    nameHindi: 'गोवर्धन पूजा, अन्नकूट एवं भाई दूज (यम द्वितीया)',
    nameEnglish: 'Govardhan Puja, Annakoot & Bhai Dooj',
    monthHindi: 'कार्तिक (अक्टूबर/नवम्बर)',
    monthEnglish: 'Oct/Nov',
    hinduMonthHindi: 'कार्तिक मास (शुक्ल पक्ष)',
    hinduMonthEnglish: 'Kartika Maas Shukla Paksha',
    tithiHindi: 'कार्तिक शुक्ल प्रतिपदा एवं द्वितीया',
    tithiEnglish: 'Kartika Shukla Pratipada & Dwitiya',
    paksha: 'shukla',
    category: 'cultural',
    symbolEmoji: '🐄',
    themeColor: {
      primary: '#059669',
      secondary: '#10B981',
      border: 'border-emerald-400',
      badgeBg: 'bg-emerald-100 text-emerald-950',
      gradient: 'from-emerald-700 via-teal-600 to-amber-500',
      accent: '#064E3B'
    },
    shloka: 'गोवर्धन धराधार गोकुल त्राणकारक। विष्णुबाहु कृतोच्छ्राय गवां कोटिप्रदो भव॥ भ्रातस्तवानुजाताऽहं भुङ्क्ष्व भक्तमिमं शुभम्। प्रीतये यमराजस्य यमुनाया विशेषतः॥',
    blessingHindi: 'प्रकृति, गौ-वंश व पर्यावरण संरक्षण के प्रतीक गोवर्धन पूजा (अन्नकूट) तथा भाई-बहन के पावन स्नेह के पर्व भाई दूज (यम द्वितीया) की हार्दिक बधाई व अनंत शुभकामनाएं।',
    blessingEnglish: 'Warm greetings on Govardhan Puja, Annakoot, and Bhai Dooj! May nature bestow abundant bounties and siblings share lifelong bond of love and protection.',
    defaultDedications: [
      'प्रकृति और गौ-संरक्षण का संकल्प लेकर पर्यावरण को समृद्ध बनाएं।',
      'भाई-बहन का अटूट स्नेह और विश्वास सदैव प्रगाढ़ रहे।'
    ]
  },
  // 27. लोक आस्था का महापर्व छठ पूजा
  {
    id: 'chhath_puja',
    nameHindi: 'लोक आस्था का महापर्व छठ पूजा (डाला छठ)',
    nameEnglish: 'Chhath Puja Mahaparv (Surya Shasthi)',
    monthHindi: 'कार्तिक (अक्टूबर/नवम्बर)',
    monthEnglish: 'October/November',
    hinduMonthHindi: 'कार्तिक मास',
    hinduMonthEnglish: 'Kartika Maas',
    tithiHindi: 'कार्तिक शुक्ल षष्ठी (संध्या व उषा अर्घ्य)',
    tithiEnglish: 'Kartika Shukla Shashthi',
    paksha: 'shukla',
    category: 'cultural',
    symbolEmoji: '☀️',
    themeColor: {
      primary: '#B45309',
      secondary: '#EA580C',
      border: 'border-amber-500',
      badgeBg: 'bg-amber-100 text-amber-950',
      gradient: 'from-amber-600 via-orange-600 to-red-600',
      accent: '#78350F'
    },
    shloka: 'ॐ नमो भगवते श्रीसूर्याय नमः। षष्ठी देव्यै नमः। आरोग्यं भास्करादिच्छेत् श्रियमिच्छेद् हुताशनात्। ज्ञानं महेश्वरादिच्छेन्मुक्तिमिच्छेज्जनार्दनात्॥',
    blessingHindi: 'प्रकृति, स्वच्छता, पवित्रता एवं प्रत्यक्ष देवता भगवान सूर्य तथा छठी मइया की उपासना के महापर्व छठ पूजा की आप सभी को कोटिशः मंगलकामनाएं।',
    blessingEnglish: 'Heartiest greetings on the sacred Chhath Puja! May Lord Bhaskar and Chhathi Maiya bless your household with longevity, vitality, purity, and peace.',
    defaultDedications: [
      'उदीयमान एवं अस्ताचलगामी सूर्यदेव की असीम कृपा आप और आपके परिवार पर सदा बनी रहे।',
      'कठिन साधना और लोक-आस्था का यह पावन पर्व समाज में स्वच्छता और पर्यावरण रक्षा की प्रेरणा दे।'
    ]
  },
  // 28. देव दीपावली (वाराणसी) एवं गुरु नानक जयंती
  {
    id: 'dev_deepawali',
    nameHindi: 'देव दीपावली (वाराणसी गंगा घाट) एवं गुरु नानक प्रकाश पर्व',
    nameEnglish: 'Dev Deepawali (Varanasi) & Guru Nanak Prakash Parv',
    monthHindi: 'कार्तिक (नवम्बर)',
    monthEnglish: 'November',
    hinduMonthHindi: 'कार्तिक मास (पूर्णिमा)',
    hinduMonthEnglish: 'Kartika Maas Purnima',
    tithiHindi: 'कार्तिक पूर्णिमा (त्रिपुरारी उत्सव)',
    tithiEnglish: 'Kartika Purnima',
    paksha: 'shukla',
    category: 'religious',
    symbolEmoji: '☬',
    themeColor: {
      primary: '#0D9488',
      secondary: '#F59E0B',
      border: 'border-teal-400',
      badgeBg: 'bg-teal-100 text-teal-900',
      gradient: 'from-teal-700 via-amber-600 to-blue-700',
      accent: '#115E59'
    },
    shloka: 'एक ओंकार सतिनामु करता पुरखु निरभउ निरवैरु अकाल मूरति अजूनी सैभं गुर प्रसादि॥ ॐ त्रिपुरान्तकाय विद्महे हेमरूपाय धीमहि तन्नो रुद्रः प्रचोदयात्॥',
    blessingHindi: 'काशी के 84 घाटों पर देवताओं के अवतरण पर्व देव दीपावली एवं मानवता के अग्रदूत श्री गुरु नानक देव जी के प्रकाश पर्व की कोटि-कोटि लख-लख बधाइयां।',
    blessingEnglish: 'Warm greetings on Dev Deepawali Varanasi and Sri Guru Nanak Dev Ji\'s Prakash Gurpurab! May divine light guide you towards truth, service, and unity.',
    defaultDedications: [
      'काशी के पावन गंगा घाटों की अलौकिक देव दीपावली आपके जीवन को आलोकित करे।',
      'किरत करो, नाम जपो और वंड छको के पावन सिद्धांतों को जीवन में धारण करें।'
    ]
  },
  // 29. क्रिसमस एवं अंग्रेजी नव वर्ष
  {
    id: 'christmas',
    nameHindi: 'क्रिसमस एवं अंग्रेजी नव वर्ष',
    nameEnglish: 'Christmas & Happy New Year',
    monthHindi: 'दिसम्बर / जनवरी',
    monthEnglish: 'December / January',
    hinduMonthHindi: 'पौष मास',
    hinduMonthEnglish: 'Pausha Maas',
    tithiHindi: '25 दिसम्बर - 01 जनवरी (विश्व शांति व उल्लास पर्व)',
    tithiEnglish: '25th Dec - 1st Jan',
    paksha: 'solar',
    category: 'cultural',
    symbolEmoji: '🎄',
    themeColor: {
      primary: '#15803D',
      secondary: '#DC2626',
      border: 'border-green-400',
      badgeBg: 'bg-green-100 text-green-950',
      gradient: 'from-green-700 via-red-600 to-amber-500',
      accent: '#14532D'
    },
    shloka: 'सर्वेऽपि सुखिनः सन्तु सर्वे सन्तु निरामयाः। जगत्प्रीतिः समायातु विश्वशान्तिः प्रजायते॥',
    blessingHindi: 'प्रभु ईसा मसीह के जन्मोत्सव क्रिसमस एवं आगामी नव वर्ष की हार्दिक शुभकामनाएं। यह पर्व आपके जीवन में प्रेम, आशा, शांति और नवीन ऊर्जा का संचार करे।',
    blessingEnglish: 'Merry Christmas and a Joyous Happy New Year! Wishing you peace, boundless goodwill, vibrant health, and delightful blessings all year round.',
    defaultDedications: [
      'प्रेम, करुणा और क्षमा का यह पावन संदेश विश्व में शांति और बंधुत्व की स्थापना करे।',
      'आने वाला नव वर्ष आपके लिए नई उपलब्धियों और खुशियों से परिपूर्ण हो।'
    ]
  }
];

/**
 * किसी भी निर्दिष्ट वर्ष के लिए संपूर्ण ठाकुर प्रसाद पंचांग त्यौहार सूची प्राप्त करें
 * Automatically Renews and Re-computes for any Gregorian Year
 */
export function getFestivalsForYear(year: number = new Date().getFullYear()): FestivalItem[] {
  return FESTIVALS_BASE_DEFINITIONS.map((festDef) => {
    // Construct intermediate FestivalItem
    const baseItem: FestivalItem = {
      ...festDef,
      dateFormattedHindi: '',
      dateFormattedEnglish: ''
    };
    return getFestivalForYear(baseItem, year);
  }).sort((a, b) => {
    const dateA = a.gregorianDate || '9999-12-31';
    const dateB = b.gregorianDate || '9999-12-31';
    return dateA.localeCompare(dateB);
  });
}

// Current Year Dynamic Festivals List (Defaults to current system year & auto-renews dynamically)
export const CURRENT_YEAR = new Date().getFullYear();
export const FESTIVALS_LIST: FestivalItem[] = getFestivalsForYear(CURRENT_YEAR);

/**
 * समर्थित पंचांग वर्षों की सूची (Available Years in Selector)
 */
export const AVAILABLE_PANCHANG_YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

// Initial pre-registered sample greeting records for live community board
export const INITIAL_FESTIVAL_GREETINGS: FestivalGreetingRecord[] = [
  {
    id: 'JJF-FEST-2026-01',
    festivalId: 'diwali',
    festivalNameHindi: 'दीपावली महापर्व एवं श्री लक्ष्मी-गणेश पूजन',
    festivalNameEnglish: 'Deepawali Mahaparv & Shri Lakshmi-Ganesh Pujan',
    recipientName: 'पंडित श्री प्रकाश नारायण चौबे',
    recipientTitle: 'सम्मानित धर्मगुरु एवं समाज सेवी',
    senderName: 'शैलेश कुमार (अध्यक्ष)',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&fit=crop&q=80',
    phone: '+91-9450012345',
    city: 'गोराबाजार, गाज़ीपुर सदर',
    country: 'भारत (India)',
    state: 'उत्तर प्रदेश (Uttar Pradesh)',
    district: 'गाज़ीपुर (Ghazipur)',
    block: 'गाज़ीपुर सदर (Ghazipur Sadar)',
    wardOrVillage: 'गोराबाजार वार्ड संख्या 12',
    customMessage: 'मां महालक्ष्मी और विघ्नहर्ता भगवान श्री गणेश जी की असीम कृपा आपके समस्त परिवार पर बनी रहे। समाज सेवा में आपका योगदान सर्वदा वंदनीय है।',
    date: '10 Nov 2026',
    shloka: 'ॐ असतो मा सद्गमय। तमसो मा ज्योतिर्गमय। मृत्योर्माऽमृतं गमय॥ ॐ शान्तिः शान्तिः शान्तिः॥',
    category: 'religious',
    symbolEmoji: '🪔'
  },
  {
    id: 'JJF-FEST-2026-02',
    festivalId: 'independence_day',
    festivalNameHindi: 'स्वतंत्रता दिवस (अमृत काल - राष्ट्रीय महापर्व)',
    festivalNameEnglish: 'Independence Day of India',
    recipientName: 'डॉ. आनंद वर्धन सिंह',
    recipientTitle: 'वरिष्ठ चिकित्सक एवं संरक्षक',
    senderName: 'जीवन ज्योति फाउंडेशन परिवार',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80',
    phone: '+91-9839123456',
    city: 'जमानिया, गाज़ीपुर',
    country: 'भारत (India)',
    state: 'उत्तर प्रदेश (Uttar Pradesh)',
    district: 'गाज़ीपुर (Ghazipur)',
    block: 'जमानिया (Zamania)',
    wardOrVillage: 'स्टेशन रोड कस्बा',
    customMessage: 'मातृभूमि की सेवा और वंचितों के स्वास्थ्य संवर्धन हेतु आपके समर्पण को कोटि-कोटि नमन। स्वतंत्रता दिवस की हार्दिक शुभकामनाएं!',
    date: '15 Aug 2026',
    shloka: 'जननी जन्मभूमिश्च स्वर्गादपि गरीयसी। राष्ट्राय स्वाहा, राष्ट्राय इदं न मम॥',
    category: 'national',
    symbolEmoji: '🇮🇳'
  },
  {
    id: 'JJF-FEST-2026-03',
    festivalId: 'chhath_puja',
    festivalNameHindi: 'लोक आस्था का महापर्व छठ पूजा (डाला छठ)',
    festivalNameEnglish: 'Chhath Puja Mahaparv (Surya Shasthi)',
    recipientName: 'श्रीमती सुनीता देवी राय',
    recipientTitle: 'आदर्श समाज सेविका एवं व्रती',
    senderName: 'जीवन ज्योति फाउंडेशन गाज़ीपुर, उत्तर प्रदेश, भारत',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&fit=crop&q=80',
    phone: '+91-8874567890',
    city: 'मुहम्मदाबाद, गाज़ीपुर',
    country: 'भारत (India)',
    state: 'उत्तर प्रदेश (Uttar Pradesh)',
    district: 'गाज़ीपुर (Ghazipur)',
    block: 'मुहम्मदाबाद (Mohammadabad)',
    wardOrVillage: 'यूसुफपुर बाजार',
    customMessage: 'भगवान भाष्कर और छठी मइया आपके परिवार को आरोग्यता, संतान सुख और अखंड सौभाग्य का आशीर्वाद दें। जय छठी मइया!',
    date: '07 Nov 2026',
    shloka: 'ॐ नमो भगवते श्रीसूर्याय नमः। षष्ठी देव्यै नमः। आरोग्यं भास्करादिच्छेत्॥',
    category: 'cultural',
    symbolEmoji: '☀️'
  }
];
