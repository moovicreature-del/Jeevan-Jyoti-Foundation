// ============================================================================
// JEEVAN JYOTI FOUNDATION - REAL-TIME CLIENT-SIDE UI TRANSLATION ENGINE
// जीवन ज्योति फाउंडेशन - लाइव मल्टी-लैंग्वेज अनुवाद प्रणाली
// Works offline/instantly and coordinates with Google Translate
// ============================================================================

export interface LanguageDef {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

// Key UI Phrases translated across major Indian & international languages
export const UI_DICTIONARY: Record<string, Record<string, string>> = {
  // Navigation & Core Brand
  'जीवन ज्योति फाउंडेशन': {
    en: 'Jeevan Jyoti Foundation',
    bho: 'जीवन ज्योति फाउंडेशन',
    sa: 'जीवन ज्योति फाउंडेशन',
    bn: 'জীবন জ্যোতি ফাউন্ডেশন',
    mr: 'जीवन ज्योती फाउंडेशन',
    gu: 'જીવન જ્યોતિ ફાઉન્ડેશન',
    ta: 'ஜீவன் ஜோதி அறக்கட்டளை',
    te: 'జీవన్ జ్యోతి ఫౌండేషన్',
    ur: 'جیون جیوتی فاؤنڈیشن',
    pa: 'ਜੀਵਨ ਜਯੋਤੀ ਫਾਊਂਡੇਸ਼ਨ',
    es: 'Fundación Jeevan Jyoti',
    fr: 'Fondation Jeevan Jyoti',
    ar: 'مؤسسة جيفان جيوتي'
  },
  'सेवा • शिक्षा • स्वास्थ्य': {
    en: 'Service • Education • Healthcare',
    bho: 'सेवा • शिक्षा • स्वास्थ्य',
    sa: 'सेवा • शिक्षा • स्वास्थ्यम्',
    bn: 'সেবা • শিক্ষা • স্বাস্থ্য',
    mr: 'सेवा • शिक्षण • आरोग्य',
    gu: 'સેવા • શિક્ષણ • આરોગ્ય',
    ta: 'சேவை • கல்வி • சுகாதாரம்',
    te: 'సేవ • విద్య • ఆరోగ్యం',
    ur: 'خدمت • تعلیم • صحت',
    pa: 'ਸੇਵਾ • ਸਿੱਖਿਆ • ਸਿਹਤ',
    es: 'Servicio • Educación • Salud',
    fr: 'Service • Éducation • Santé',
    ar: 'خدمة • تعليم • رعاية صحية'
  },
  'मुख्य पृष्ठ': {
    en: 'Home',
    bho: 'मुख्य पृष्ठ',
    sa: 'मुख्यपृष्ठम्',
    bn: 'মূল পাতা',
    mr: 'मुख्य पृष्ठ',
    gu: 'મુખ્ય પૃષ્ઠ',
    ta: 'முகப்பு',
    te: 'హోమ్ పేజీ',
    ur: 'مرکزی صفحہ',
    pa: 'ਮੁੱਖ ਪੰਨਾ',
    es: 'Inicio',
    fr: 'Accueil',
    ar: 'الصفحة الرئيسية'
  },
  'परिचय (About)': {
    en: 'About Us',
    bho: 'परिचय',
    sa: 'परिचयः',
    bn: 'পরিচিতি',
    mr: 'परिचय',
    gu: 'પરિચય',
    ta: 'பற்றி',
    te: 'మా గురించి',
    ur: 'تعارف',
    pa: 'ਜਾਣ-ਪਛਾਣ',
    es: 'Acerca de',
    fr: 'À propos',
    ar: 'من نحن'
  },
  'सेवा क्षेत्र (Pillars)': {
    en: 'Four Pillars',
    bho: 'सेवा क्षेत्र',
    sa: 'सेवास्तम्भाः',
    bn: 'সেবা স্তম্ভ',
    mr: 'सेवा क्षेत्र',
    gu: 'સેવા ક્ષેત્ર',
    ta: 'சேவை பகுதிகள்',
    te: 'సేవా రంగాలు',
    ur: 'خدمتی شعبے',
    pa: 'ਸੇਵਾ ਖੇਤਰ',
    es: 'Pilares de Servicio',
    fr: 'Piliers de Service',
    ar: 'مجالات الخدمة'
  },
  'स्वयंसेवक (Volunteers)': {
    en: 'Volunteers',
    bho: 'स्वयंसेवक साथी',
    sa: 'स्वयंसेवकाः',
    bn: 'স্বেচ্ছাসেবক',
    mr: 'स्वयंसेवक',
    gu: 'સ્વયંસેવકો',
    ta: 'தன்னார்வலர்கள்',
    te: 'స్వచ్ఛంద సేవకులు',
    ur: 'رضاکار',
    pa: 'ਵਲੰਟੀਅਰ',
    es: 'Voluntarios',
    fr: 'Bénévoles',
    ar: 'متطوعون'
  },
  'सर्टिफिकेट सत्यापन': {
    en: 'Verify Certificate',
    bho: 'प्रमाण पत्र सत्यापन',
    sa: 'प्रमाणपत्र-सत्यापनम्',
    bn: 'সার্টিফিকেট যাচাই',
    mr: 'प्रमाणपत्र पडताळणी',
    gu: 'પ્રમાણપત્ર ચકાસણી',
    ta: 'சான்றிதழ் சரிபார்ப்பு',
    te: 'సర్టిఫికేట్ ధృవీకరణ',
    ur: 'سرٹیفکیٹ تصدیق',
    pa: 'ਸਰਟੀਫਿਕੇਟ ਤਸਦੀਕ',
    es: 'Verificar Certificado',
    fr: 'Vérifier le certificat',
    ar: 'التحقق من الشهادة'
  },
  'सफलता गाथाएं': {
    en: 'Impact Stories',
    bho: 'सेवा गाथा',
    sa: 'सेवागाथाः',
    bn: 'সাফল্যের গল্প',
    mr: 'यशस्वी कथा',
    gu: 'સફળતા ગાથાઓ',
    ta: 'வெற்றிக் கதைகள்',
    te: 'విజయ కథలు',
    ur: 'کامیابی کی کہانیاں',
    pa: 'ਸਫਲਤਾ ਦੀਆਂ ਕਹਾਣੀਆਂ',
    es: 'Historias de Impacto',
    fr: 'Témoignages',
    ar: 'قصص النجاح'
  },
  'वार्षिक रिपोर्ट': {
    en: 'Annual Report',
    bho: 'वार्षिक रिपोर्ट',
    sa: 'वार्षिकविवरणम्',
    bn: 'বার্ষিক প্রতিবেদন',
    mr: 'वार्षिक अहवाल',
    gu: 'વાર્ષિક અહેવાલ',
    ta: 'ஆண்டு அறிக்கை',
    te: 'వార్షిక నివేదిక',
    ur: 'سالانہ رپورٹ',
    pa: 'ਸਾਲਾਨਾ ਰਿਪੋਰਟ',
    es: 'Informe Anual',
    fr: 'Rapport Annuel',
    ar: 'التقرير السنوي'
  },
  'सहयोग / दान करें': {
    en: 'Donate Now',
    bho: 'सहयोग / दान करीं',
    sa: 'दानं कुर्वन्तु',
    bn: 'অনুদান দিন',
    mr: 'देणगी द्या',
    gu: 'દાન કરો',
    ta: 'நன்கொடை அளியுங்கள்',
    te: 'విరాళం ఇవ్వండి',
    ur: 'عطیہ دیں',
    pa: 'ਦਾਨ ਕਰੋ',
    es: 'Donar Ahora',
    fr: 'Faire un don',
    ar: 'تبرع الآن'
  },
  'दान करें': {
    en: 'Donate',
    bho: 'दान करीं',
    sa: 'दानम्',
    bn: 'অনুদান',
    mr: 'दान करा',
    gu: 'દાન કરો',
    ta: 'நன்கொடை',
    te: 'విరాళం',
    ur: 'عطیہ',
    pa: 'ਦਾਨ',
    es: 'Donar',
    fr: 'Donner',
    ar: 'تبرع'
  },
  'दान फॉर्म': {
    en: 'Donation Form',
    bho: 'दान फॉर्म',
    sa: 'दानपत्रम्',
    bn: 'অনুদান ফর্ম',
    mr: 'देणगी अर्ज',
    gu: 'દાન ફોર્મ',
    ta: 'நன்கொடை படிவம்',
    te: 'విరాళం ఫారమ్',
    ur: 'عطیہ فارم',
    pa: 'ਦਾਨ ਫਾਰਮ',
    es: 'Formulario de Donación',
    fr: 'Formulaire de don',
    ar: 'نموذج التبرع'
  },
  '5 फॉर्म': {
    en: '5 Official Forms',
    bho: '5 फॉर्म',
    sa: '५ पत्राणि',
    bn: '৫টি ফর্ম',
    mr: '५ अर्ज',
    gu: '૫ ફોર્મ',
    ta: '5 படிவங்கள்',
    te: '5 ఫారమ్‌లు',
    ur: '5 فارم',
    pa: '5 ਫਾਰਮ',
    es: '5 Formularios',
    fr: '5 Formulaires',
    ar: '5 نماذج'
  },
  'त्यौहार': {
    en: 'Festivals',
    bho: 'त्यौहार',
    sa: 'उत्सवाः',
    bn: 'উৎসব',
    mr: 'सण आणि उत्सव',
    gu: 'તહેવારો',
    ta: 'பண்டிகைகள்',
    te: 'పండుగలు',
    ur: 'تہوار',
    pa: 'ਤਿਉਹਾਰ',
    es: 'Festivales',
    fr: 'Fêtes',
    ar: 'مهرجانات'
  },
  'ऐप इंस्टॉल करें': {
    en: 'Install App',
    bho: 'ऐप इंस्टॉल करीं',
    sa: 'अनुप्रयोगं स्थापयन्तु',
    bn: 'অ্যাপ ইনস্টল করুন',
    mr: 'अॅप इन्स्टॉल करा',
    gu: 'એપ ઇન્સ્ટોલ કરો',
    ta: 'செயலியை நிறுவுங்கள்',
    te: 'యాప్ ఇన్‌స్టాల్ చేయండి',
    ur: 'ایپ انسٹال کریں',
    pa: 'ਐਪ ਸਥਾਪਿਤ ਕਰੋ',
    es: 'Instalar App',
    fr: 'Installer l’App',
    ar: 'تثبيت التطبيق'
  },
  'गूगल ड्राइव': {
    en: 'Google Drive',
    bho: 'गूगल ड्राइव',
    sa: 'गूगल ड्राइव',
    bn: 'গুগল ড্রাইভ',
    mr: 'गूगल ड्राइव्ह',
    gu: 'ગૂગલ ડ્રાઇવ',
    ta: 'கூகுள் டிரைவ்',
    te: 'గూగుల్ డ్రైవ్',
    ur: 'گوگل ڈرائیو',
    pa: 'ਗੂਗਲ ਡਰਾਈਵ',
    es: 'Google Drive',
    fr: 'Google Drive',
    ar: 'جوجل درايف'
  },
  'एडमिन': {
    en: 'Admin',
    bho: 'एडमिन',
    sa: 'प्रशासकः',
    bn: 'অ্যাডমিন',
    mr: 'प्रशासक',
    gu: 'એડમિન',
    ta: 'நிர்வாகி',
    te: 'అడ్మిన్',
    ur: 'ایڈمن',
    pa: 'ਐਡਮਿਨ',
    es: 'Administrador',
    fr: 'Administrateur',
    ar: 'المشرف'
  },

  // Action Center & Certificates
  'स्वयंसेवक बनें / प्रमाण पत्र प्राप्त करें': {
    en: 'Join as Volunteer / Get Certificate',
    bho: 'स्वयंसेवक बनीं / प्रमाण पत्र लीं',
    sa: 'स्वयंसेवको भवन्तु / प्रमाणपत्रं प्राप्नुवन्तु',
    bn: 'স্বেচ্ছাসেবক হন / সার্টিফিকেট নিন',
    mr: 'स्वयंसेवक व्हा / प्रमाणपत्र मिळवा',
    gu: 'સ્વયંસેવક બનો / સર્ટિફિકેટ મેળવો',
    ta: 'தன்னார்வலராக இணையுங்கள் / சான்றிதழ் பெறுங்கள்',
    te: 'వాలంటీర్‌గా చేరండి / సర్టిఫికేట్ పొందండి',
    ur: 'رضاکار بنیں / سرٹیفکیٹ حاصل کریں',
    pa: 'ਵਲੰਟੀਅਰ ਬਣੋ / ਸਰਟੀਫਿਕੇਟ ਪ੍ਰਾਪਤ ਕਰੋ',
    es: 'Únete como Voluntario / Obtén Certificado',
    fr: 'Devenir bénévole / Obtenir un certificat',
    ar: 'انضم كمتطوع / احصل على شهادة'
  },
  'स्वयंसेवक प्रमाण पत्र': {
    en: 'Volunteer Certificate',
    bho: 'स्वयंसेवक प्रमाण पत्र',
    sa: 'स्वयंसेवकप्रमाणपत्रम्',
    bn: 'স্বেচ্ছাসেবক সার্টিফিকেট',
    mr: 'स्वयंसेवक प्रमाणपत्र',
    gu: 'સ્વયંસેવક પ્રમાણપત્ર',
    ta: 'தன்னார்வலர் சான்றிதழ்',
    te: 'వాలంటీర్ సర్టిఫికేట్',
    ur: 'رضاکار سرٹیفکیٹ',
    pa: 'ਵਲੰਟੀਅਰ ਸਰਟੀਫਿਕੇਟ',
    es: 'Certificado de Voluntario',
    fr: 'Certificat de bénévole',
    ar: 'شهادة التطوع'
  },
  'स्वयंसेवक ID कार्ड': {
    en: 'Volunteer ID Card',
    bho: 'स्वयंसेवक ID कार्ड',
    sa: 'स्वयंसेवक-परिचयपत्रम्',
    bn: 'স্বেচ্ছাসেবক আইডি কার্ড',
    mr: 'स्वयंसेवक ओळखपत्र',
    gu: 'સ્વયંસેવક આઈડી કાર્ડ',
    ta: 'தன்னார்வலர் அடையாள அட்டை',
    te: 'వాలంటీర్ ఐడీ కార్డ్',
    ur: 'رضاکار شناختی کارڈ',
    pa: 'ਵਲੰਟੀਅਰ ਸ਼ਨਾਖਤੀ ਕਾਰਡ',
    es: 'Tarjeta de ID de Voluntario',
    fr: 'Carte d’identité bénévole',
    ar: 'بطاقة هوية المتطوع'
  },
  'दान रसीद': {
    en: 'Donation Receipt',
    bho: 'दान रसीद',
    sa: 'दानरसीदपत्रम्',
    bn: 'অনুদান রসিদ',
    mr: 'देणगी पावती',
    gu: 'દાન રસીદ',
    ta: 'நன்கொடை ரசீது',
    te: 'విరాళం రసీదు',
    ur: 'عطیہ رسید',
    pa: 'ਦਾਨ ਰਸੀਦ',
    es: 'Recibo de Donación',
    fr: 'Reçu de don',
    ar: 'إيصال التبرع'
  },
  'कार्य प्रशंसा पत्र': {
    en: 'Task Appreciation Certificate',
    bho: 'कार्य प्रशंसा पत्र',
    sa: 'कार्यप्रशंसापत्रम्',
    bn: 'কাজের প্রশংসা পত্র',
    mr: 'कार्य प्रशंसा प्रमाणपत्र',
    gu: 'કાર્ય પ્રશંસા પત્ર',
    ta: 'பணி பாராட்டுச் சான்றிதழ்',
    te: 'కార్య ప్రశంసా పత్రం',
    ur: 'تعریفی سند',
    pa: 'ਕੰਮ ਦੀ ਪ੍ਰਸ਼ੰਸਾ ਪੱਤਰ',
    es: 'Certificado de Reconocimiento',
    fr: 'Certificat d’appréciation',
    ar: 'شهادة تقدير المهام'
  },
  'वार्षिक प्रभाव रिपोर्ट': {
    en: 'Annual Impact Report',
    bho: 'वार्षिक प्रभाव रिपोर्ट',
    sa: 'वार्षिकप्रभावविवरणम्',
    bn: 'বার্ষিক প্রভাব রিপোর্ট',
    mr: 'वार्षिक प्रभाव अहवाल',
    gu: 'વાર્ષિક પ્રભાવ અહેવાલ',
    ta: 'ஆண்டு தாக்க அறிக்கை',
    te: 'వార్షిక ప్రభావ నివేదిక',
    ur: 'سالانہ اثرات کی رپورٹ',
    pa: 'ਸਾਲਾਨਾ ਪ੍ਰਭਾਵ ਰਿਪੋਰਟ',
    es: 'Informe de Impacto Anual',
    fr: 'Rapport d’impact annuel',
    ar: 'تقرير الأثر السنوي'
  },
  'सर्टिफिकेट डाउनलोड': {
    en: 'Download Certificates',
    bho: 'सर्टिफिकेट डाउनलोड',
    sa: 'प्रमाणपत्र-डाउनलोड',
    bn: 'সার্টিফিকেট ডাউনলোড',
    mr: 'प्रमाणपत्र डाउनलोड करा',
    gu: 'સર્ટિફિકેટ ડાઉનલોડ',
    ta: 'சான்றிதழ் பதிவிறக்கம்',
    te: 'సర్టిఫికేట్ డౌన్‌లోడ్',
    ur: 'سرٹیفکیٹ ڈاؤن لوڈ',
    pa: 'ਸਰਟੀਫਿਕੇਟ ਡਾਊਨਲੋਡ',
    es: 'Descargar Certificados',
    fr: 'Télécharger les certificats',
    ar: 'تحميل الشهادات'
  },
  'स्टाफ रजिस्ट्रेशन व आई-कार्ड': {
    en: 'Staff Registration & ID Card',
    bho: 'स्टाफ रजिस्ट्रेशन व आई-कार्ड',
    sa: 'कर्मचारी-पंजीकरणम् तथा परिचयपत्रम्',
    bn: 'কর্মী নিবন্ধন ও আইডি কার্ড',
    mr: 'कर्मचारी नोंदणी आणि ओळखपत्र',
    gu: 'સ્ટાફ નોંધણી અને આઈડી કાર્ડ',
    ta: 'ஊழியர் பதிவு மற்றும் அடையாள அட்டை',
    te: 'సిబ్బంది రిజిస్ట్రేషన్ మరియు ఐడీ కార్డ్',
    ur: 'سٹاف رجسٹریشن اور شناختی کارڈ',
    pa: 'ਸਟਾਫ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਤੇ ਸ਼ਨਾਖਤੀ ਕਾਰਡ',
    es: 'Registro de Personal y Carné',
    fr: 'Enregistrement du personnel et carte',
    ar: 'تسجيل الموظفين وبطاقة الهوية'
  },

  // Security & OTP Modal Phrases
  'OTP सत्यापित करें': {
    en: 'Verify OTP',
    bho: 'OTP सत्यापित करीं',
    sa: 'OTP सत्यापयन्तु',
    bn: 'ওটিপি যাচাই করুন',
    mr: 'ओटीपी पडताळा',
    gu: 'ઓટીપી ચકાસો',
    ta: 'OTP சரிபார்க்கவும்',
    te: 'OTP ధృవీకరించండి',
    ur: 'او ٹی پی کی تصدیق کریں',
    pa: 'OTP ਤਸਦੀਕ ਕਰੋ',
    es: 'Verificar OTP',
    fr: 'Vérifier OTP',
    ar: 'تحقق من رمز OTP'
  },
  'OTP भेजें': {
    en: 'Send OTP',
    bho: 'OTP भेजीं',
    sa: 'OTP प्रेषयन्तु',
    bn: 'ওটিপি পাঠান',
    mr: 'ओटीपी पाठवा',
    gu: 'ઓટીપી મોકલો',
    ta: 'OTP அனுப்பவும்',
    te: 'OTP పంపండి',
    ur: 'او ٹی پی بھیجیں',
    pa: 'OTP ਭੇਜੋ',
    es: 'Enviar OTP',
    fr: 'Envoyer OTP',
    ar: 'إرسال رمز OTP'
  },
  'मोबाइल नंबर दर्ज करें': {
    en: 'Enter Mobile Number',
    bho: 'मोबाइल नंबर दर्ज करीं',
    sa: 'चलभाषसङ्ख्यां लिखन्तु',
    bn: 'মোবাইল নম্বর লিখুন',
    mr: 'मोबाईल नंबर प्रविष्ट करा',
    gu: 'મોબાઇલ નંબર દાખલ કરો',
    ta: 'மொபைல் எண்ணை உள்ளிடவும்',
    te: 'మొబైల్ నంబర్ నమోదు చేయండి',
    ur: 'موبائل نمبر درج کریں',
    pa: 'ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ',
    es: 'Ingrese Número Móvil',
    fr: 'Entrez le numéro de mobile',
    ar: 'أدخل رقم الهاتف المحمول'
  },
  'प्रमाण पत्र / पहचान पत्र - मोबाइल OTP सत्यापन': {
    en: 'Certificate / ID Card - Mobile OTP Verification',
    bho: 'प्रमाण पत्र / पहचान पत्र - मोबाइल OTP सत्यापन',
    sa: 'प्रमाणपत्रम् / परिचयपत्रम् - चलभाष OTP सत्यापनम्',
    bn: 'সার্টিফিকেট / আইডি কার্ড - মোবাইল ওটিপি যাচাই',
    mr: 'प्रमाणपत्र / ओळखपत्र - मोबाइल ओटीपी पडताळणी',
    gu: 'પ્રમાણપત્ર / આઈડી કાર્ડ - મોબાઇલ ઓટીપી ચકાસણી',
    ta: 'சான்றிதழ் / அடையாள அட்டை - மொபைல் OTP சரிபார்ப்பு',
    te: 'సర్టిఫికేట్ / ఐడీ కార్డ్ - మొబైల్ OTP ధృవీకరణ',
    ur: 'سرٹیفکیٹ / شناختی کارڈ - موبائل او ٹی پی تصدیق',
    pa: 'ਸਰਟੀਫਿਕੇਟ / ਸ਼ਨਾਖਤੀ ਕਾਰਡ - ਮੋਬਾਈਲ OTP ਤਸਦੀਕ',
    es: 'Certificado / Carné - Verificación OTP Móvil',
    fr: 'Certificat / Carte - Vérification OTP mobile',
    ar: 'شهادة / بطاقة هوية - التحقق عبر رمز OTP'
  },

  // Impact metrics
  'शिक्षित बच्चे': {
    en: 'Children Educated',
    bho: 'पढ़ल लइका',
    sa: 'शिक्षिताः बालकाः',
    bn: 'শিক্ষিত শিশু',
    mr: 'शिक्षित मुले',
    gu: 'શિક્ષિત બાળકો',
    ta: 'கல்வி பெற்ற குழந்தைகள்',
    te: 'విద్యావంతులైన పిల్లలు',
    ur: 'تعلیم یافتہ بچے',
    pa: 'ਪੜ੍ਹੇ-ਲਿਖੇ ਬੱਚੇ',
    es: 'Niños Educados',
    fr: 'Enfants scolarisés',
    ar: 'أطفال تم تعليمهم'
  },
  'भोजन वितरण': {
    en: 'Meals Distributed',
    bho: 'भोजन वितरण',
    sa: 'भोजनवितरणम्',
    bn: 'খাবার বিতরণ',
    mr: 'अन्न वाटप',
    gu: 'ભોજન વિતરણ',
    ta: 'உணவு வழங்கல்',
    te: 'భోజన పంపిణీ',
    ur: 'کھانا تقسیم',
    pa: 'ਭੋਜਨ ਵੰਡ',
    es: 'Comidas Distribuidas',
    fr: 'Repas distribués',
    ar: 'وجبات تم توزيعها'
  },
  'स्वास्थ्य शिविर': {
    en: 'Medical Camps',
    bho: 'स्वास्थ्य जांच',
    sa: 'स्वास्थ्यशिबिराणि',
    bn: 'স্বাস্থ্য শিবির',
    mr: 'आरोग्य शिबिरे',
    gu: 'આરોગ્ય શિબિર',
    ta: 'மருத்துவ முகாம்கள்',
    te: 'వైద్య శిబిరాలు',
    ur: 'طبی کیمپ',
    pa: 'ਮੈਡੀਕਲ ਕੈਂਪ',
    es: 'Campamentos Médicos',
    fr: 'Camps Médicaux',
    ar: 'مخيمات طبية'
  },
  'सक्रिय स्वयंसेवक': {
    en: 'Active Volunteers',
    bho: 'सक्रिय स्वयंसेवक',
    sa: 'सक्रियाः स्वयंसेवकाः',
    bn: 'সক্রিয় স্বেচ্ছাসেবক',
    mr: 'सक्रिय स्वयंसेवक',
    gu: 'સક્રિય સ્વયંસેવકો',
    ta: 'செயலில் உள்ள தன்னார்வலர்கள்',
    te: 'క్రియాశీల వాలంటీర్లు',
    ur: 'فعال رضاکار',
    pa: 'ਸਰਗਰਮ ਵਲੰਟੀਅਰ',
    es: 'Voluntarios Activos',
    fr: 'Bénévoles Actifs',
    ar: 'متطوعون نشطون'
  },
  'ग्राम आच्छादित': {
    en: 'Villages Covered',
    bho: 'गांव आच्छादित',
    sa: 'व्याप्ताः ग्रामाः',
    bn: 'আওতাভুক্ত গ্রাম',
    mr: 'समाविष्ट गावे',
    gu: 'આવરી લેવાયેલ ગામો',
    ta: 'உட்படுத்தப்பட்ட கிராமங்கள்',
    te: 'కవర్ చేయబడిన గ్రామాలు',
    ur: 'شامل دیہات',
    pa: 'ਸ਼ਾਮਲ ਪਿੰਡ',
    es: 'Pueblos Cubiertos',
    fr: 'Villages Couverts',
    ar: 'القرى المشمولة'
  },
  'सत्यापित रिकॉर्ड': {
    en: 'Verified Records',
    bho: 'सत्यापित रिकॉर्ड',
    sa: 'प्रमाणीकृत-अभिलेखः',
    bn: 'যাচাইকৃত রেকর্ড',
    mr: 'पडताळलेले नोंदी',
    gu: 'ચકાસાયેલ રેકોર્ડ્સ',
    ta: 'சரிபார்க்கப்பட்ட பதிவுகள்',
    te: 'ధృవీకరించబడిన రికార్డులు',
    ur: 'تصدیق شدہ ریکارڈ',
    pa: 'ਤਸਦੀਕਸ਼ੁਦਾ ਰਿਕਾਰਡ',
    es: 'Registros Verificados',
    fr: 'Dossiers Vérifiés',
    ar: 'سجلات موثقة'
  },

  // Four Pillars
  'शिक्षा सेवा': {
    en: 'Education Support',
    bho: 'शिक्षा सेवा',
    sa: 'शिक्षासेवा',
    bn: 'শিক্ষা সহায়তা',
    mr: 'शिक्षण सेवा',
    gu: 'શિક્ષણ સેવા',
    ta: 'கல்வி சேவை',
    te: 'విద్యా సేవ',
    ur: 'تعلیمی امداد',
    pa: 'ਸਿੱਖਿਆ ਸੇਵਾ',
    es: 'Apoyo Educativo',
    fr: 'Soutien Éducatif',
    ar: 'دعم التعليم'
  },
  'अन्नपूर्णा सेवा': {
    en: 'Annapurna Seva',
    bho: 'अन्नपूर्णा सेवा',
    sa: 'अन्नपूर्णासेवा',
    bn: 'অন্নপূর্ণা সেবা',
    mr: 'अन्नपूर्णा सेवा',
    gu: 'અન્નપૂર્ણા સેવા',
    ta: 'அன்னபூரணா சேவை',
    te: 'అన్నపూర్ణ సేవ',
    ur: 'اناپورنا سیوا',
    pa: 'ਅੰਨਪੂਰਨਾ ਸੇਵਾ',
    es: 'Servicio de Alimentos Annapurna',
    fr: 'Service de repas Annapurna',
    ar: 'خدمة الطعام أنابورنا'
  },
  'स्वास्थ्य रक्षा': {
    en: 'Healthcare Camps',
    bho: 'स्वास्थ्य रक्षा',
    sa: 'स्वास्थ्यसंरक्षणम्',
    bn: 'স্বাস্থ্য সুরক্ষা',
    mr: 'आरोग्य संरक्षण',
    gu: 'આરોગ્ય રક્ષણ',
    ta: 'சுகாதார பாதுகாப்பு',
    te: 'ఆరోగ్య పరిరక్షణ',
    ur: 'حفظان صحت',
    pa: 'ਸਿਹਤ ਸੰਭਾਲ',
    es: 'Protección de Salud',
    fr: 'Soins de Santé',
    ar: 'الرعاية الصحية'
  },
  'अनाथ व वृद्ध सेवा': {
    en: 'Orphan & Elderly Care',
    bho: 'अनाथ आ वृद्ध सेवा',
    sa: 'अनाथ-वृद्ध-सेवा',
    bn: 'অনাথ ও বৃদ্ধ সেবা',
    mr: 'अनाथ आणि वृद्ध सेवा',
    gu: 'અનાથ અને વૃદ્ધ સેવા',
    ta: 'அநாதை மற்றும் முதியோர் பராமரிப்பு',
    te: 'అనాథ మరియు వృద్ధుల సంరక్షణ',
    ur: 'یتیموں اور بوڑھوں کی دیکھ بھال',
    pa: 'ਯਤੀਮ ਅਤੇ ਬਜ਼ੁਰਗਾਂ ਦੀ ਸੰਭਾਲ',
    es: 'Cuidado de Huérfanos y Ancianos',
    fr: 'Soin des orphelins et personnes âgées',
    ar: 'رعاية الأيتام وكبار السن'
  }
};

// Store original texts so we can revert cleanly to Hindi
const originalTextMap = new WeakMap<Node, string>();
let observer: MutationObserver | null = null;
let currentLanguage = 'hi';

/**
 * Translates a given text using the dictionary for the target language.
 */
export function translatePhrase(text: string, targetLang: string): string {
  if (!text || targetLang === 'hi') return text;
  const trimmed = text.trim();
  if (!trimmed) return text;

  // Direct match
  const entry = UI_DICTIONARY[trimmed];
  if (entry) {
    if (entry[targetLang]) return text.replace(trimmed, entry[targetLang]);
    if (entry['en']) return text.replace(trimmed, entry['en']);
  }

  // Partial substring replacements for phrases
  let translated = text;
  for (const [hiPhrase, translations] of Object.entries(UI_DICTIONARY)) {
    if (translated.includes(hiPhrase)) {
      const replacement = translations[targetLang] || translations['en'];
      if (replacement) {
        translated = translated.split(hiPhrase).join(replacement);
      }
    }
  }

  return translated;
}

/**
 * Scans and updates DOM text nodes to reflect the selected language.
 */
function walkAndTranslate(node: Node, targetLang: string) {
  // Skip script, style, code, svg, inputs, or specifically ignored nodes
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    const tagName = el.tagName?.toLowerCase();
    if (
      tagName === 'script' ||
      tagName === 'style' ||
      tagName === 'code' ||
      tagName === 'pre' ||
      el.id === 'google_translate_element' ||
      el.classList?.contains('notranslate') ||
      el.getAttribute('translate') === 'no' ||
      el.closest('#google_translate_element')
    ) {
      return;
    }

    // Translate placeholder attributes if any
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      const placeholder = el.getAttribute('placeholder');
      if (placeholder) {
        if (!el.dataset.origPlaceholder) {
          el.dataset.origPlaceholder = placeholder;
        }
        if (targetLang === 'hi') {
          el.setAttribute('placeholder', el.dataset.origPlaceholder);
        } else {
          el.setAttribute('placeholder', translatePhrase(el.dataset.origPlaceholder, targetLang));
        }
      }
    }
  }

  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.nodeValue;
    if (!text || !text.trim()) return;

    if (!originalTextMap.has(node)) {
      originalTextMap.set(node, text);
    }

    const orig = originalTextMap.get(node) || text;

    if (targetLang === 'hi') {
      if (node.nodeValue !== orig) {
        node.nodeValue = orig;
      }
    } else {
      const translated = translatePhrase(orig, targetLang);
      if (node.nodeValue !== translated) {
        node.nodeValue = translated;
      }
    }
    return;
  }

  // Recurse children
  let child = node.firstChild;
  while (child) {
    const next = child.nextSibling;
    walkAndTranslate(child, targetLang);
    child = next;
  }
}

/**
 * Dispatches and configures Google Translate widget cookie and select combo.
 */
export function syncGoogleTranslateWidget(targetLang: string) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  try {
    const domain = window.location.hostname;
    // Format both /auto/lang and /hi/lang
    const cookieVal = targetLang === 'hi' ? '' : `/auto/${targetLang}`;
    const expires = targetLang === 'hi' ? 'Thu, 01 Jan 1970 00:00:00 UTC' : 'Fri, 31 Dec 2030 23:59:59 GMT';

    // Standard cookies
    document.cookie = `googtrans=${cookieVal}; expires=${expires}; path=/;`;
    document.cookie = `googtrans=${cookieVal}; expires=${expires}; path=/; SameSite=Lax;`;

    if (domain) {
      document.cookie = `googtrans=${cookieVal}; expires=${expires}; path=/; domain=${domain};`;
      document.cookie = `googtrans=${cookieVal}; expires=${expires}; path=/; domain=${domain}; SameSite=Lax;`;
      
      const parts = domain.split('.');
      if (parts.length > 2) {
        const rootDomain = '.' + parts.slice(-2).join('.');
        document.cookie = `googtrans=${cookieVal}; expires=${expires}; path=/; domain=${rootDomain};`;
      }
    }

    // Trigger select element if Google Translate has loaded
    const select =
      document.querySelector<HTMLSelectElement>('select.goog-te-combo') ||
      document.querySelector<HTMLSelectElement>('#google_translate_element select');

    if (select) {
      select.value = targetLang;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      select.dispatchEvent(new Event('input', { bubbles: true }));
    }
  } catch (err) {
    console.debug('Google Translate sync note:', err);
  }
}

/**
 * Main application language switch function.
 * Applies instant in-memory translation to the DOM and synchronizes Google Translate.
 */
export function applyLiveTranslation(langCode: string) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const target = langCode || 'hi';
  currentLanguage = target;

  // 1. Set HTML tag attribute
  document.documentElement.lang = target;

  // 2. Set storage
  try {
    localStorage.setItem('jjf_selected_language', target);
    localStorage.setItem('jjf_portal_lang', target);
  } catch {}

  // 3. Immediately walk and translate current DOM
  if (document.body) {
    walkAndTranslate(document.body, target);
  }

  // 4. Disconnect previous observer and set up new one for dynamic elements (modals, forms)
  if (observer) {
    observer.disconnect();
  }

  if (target !== 'hi') {
    observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach((node) => {
            walkAndTranslate(node, currentLanguage);
          });
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // 5. Synchronize Google Translate widget
  syncGoogleTranslateWidget(target);

  // 6. Dispatch a custom window event for other listeners
  window.dispatchEvent(
    new CustomEvent('jjf-language-changed', {
      detail: { language: target }
    })
  );
}

/**
 * Initializes language on page load.
 */
export function initLiveTranslator() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  let saved = 'hi';
  try {
    saved =
      localStorage.getItem('jjf_selected_language') ||
      localStorage.getItem('jjf_portal_lang') ||
      'hi';
  } catch {}

  if (saved && saved !== 'hi') {
    // Wait until initial render settles
    setTimeout(() => {
      applyLiveTranslation(saved);
    }, 150);
  }
}
