import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { applyLiveTranslation, initLiveTranslator } from '../utils/liveUiTranslator';

export type Language = 'hi' | 'en' | 'bho' | 'sa' | string;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isHindi: boolean;
  isEnglish: boolean;
  isBhojpuri?: boolean;
  isSanskrit?: boolean;
  t: (key: string, hindiOrDefault?: string, englishText?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  hi: {
    // Header & Brand
    'org.name': 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुर, उत्तर प्रदेश, भारत',
    'org.name_en': 'JEEVAN JYOTI FOUNDATION GHAZIPUR, UTTAR PRADESH, INDIA',
    'org.tagline': 'सेवा • शिक्षा • स्वास्थ्य',
    'org.reg_badge': 'सरकारी पंजीकृत संस्था (UP/2018/0207700)',
    
    // Nav
    'nav.home': 'मुख्य पृष्ठ',
    'nav.about': 'परिचय (About)',
    'nav.pillars': 'सेवा क्षेत्र (Pillars)',
    'nav.volunteers': 'स्वयंसेवक (Volunteers)',
    'nav.verify': 'सर्टिफिकेट सत्यापन',
    'nav.stories': 'सफलता गाथाएं',
    'nav.report': 'वार्षिक रिपोर्ट',
    'nav.donate': 'दान करें',
    
    // Hero
    'hero.badge': 'Govt. Registered NGO (UP/2018/0207700)',
    'hero.title_hi': 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुर, उत्तर प्रदेश, भारत',
    'hero.title_en': 'JEEVAN JYOTI FOUNDATION GHAZIPUR, UTTAR PRADESH, INDIA',
    'hero.tagline': 'सेवा • शिक्षा • स्वास्थ्य (समर्पित समाज सेवा)',
    'hero.desc': 'ग़ाज़ीपुर, उत्तर प्रदेश (भारत) के ग्रामीण व मलिन बस्तियों के निर्धन बच्चों को निःशुल्क गुणवत्तापूर्ण शिक्षा, निराश्रितों को अन्नपूर्णा भोजन सेवा, स्वास्थ्य शिविर एवं सामाजिक उत्थान हेतु समर्पित संस्था।',
    'hero.btn_donate': 'सहयोग / दान करें',
    'hero.btn_volunteer': 'स्वयंसेवक बनें / प्रमाण पत्र प्राप्त करें',
    'hero.card_location': 'ग्राम मीरानपुर, मोहम्मदाबाद, गाजीपुर, उत्तर प्रदेश, भारत - 233303 (DIGIPIN 2J6T226CL2)',
    'hero.card_verified': '100% पारदर्शी व सत्यापित',
    'hero.strip_edu': 'शिक्षा सेवा',
    'hero.strip_edu_sub': 'निःशुल्क पाठशाला',
    'hero.strip_food': 'अन्नपूर्णा सेवा',
    'hero.strip_food_sub': 'भोजन व राशन किट',
    'hero.strip_health': 'स्वास्थ्य रक्षा',
    'hero.strip_health_sub': 'निःशुल्क चिकित्सा',

    // Action Center
    'action.badge': 'जन सेवा एवं सत्यापन केंद्र (Citizen Action & Certificate Hub)',
    'action.title': 'सेवा से जुड़ें, तुरंत प्रमाण पत्र व पहचान पत्र प्राप्त करें',
    'action.sub': 'स्वयंसेवक प्रमाण पत्र, दान रसीद, स्वयंसेवक आईडी कार्ड और वार्षिक रिपोर्ट तुरंत जनरेट व डाउनलोड करें।',
    'action.donate': 'दान करें (Donate)',
    'action.donate_sub': 'दान फॉर्म',
    'action.vol_cert': 'स्वयंसेवक प्रमाण पत्र',
    'action.vol_cert_sub': 'QR Verified Cert',
    'action.id_card': 'स्वयंसेवक ID कार्ड',
    'action.id_card_sub': 'Official Volunteer ID',
    'action.tax_receipt': 'दान रसीद',
    'action.tax_receipt_sub': 'दान रसीद फॉर्म',
    'action.task_cert': 'कार्य प्रशंसा पत्र',
    'action.task_cert_sub': 'Special Honor Cert',
    'action.annual_report': 'वार्षिक प्रभाव रिपोर्ट',
    'action.annual_report_sub': 'Annual Report 2026',

    // Live Impact
    'impact.badge': 'REAL TIME IMPACT METRICS (धरातलीय प्रभाव)',
    'impact.title': 'गाजीपुर में हमारे सेवा कार्यों का प्रत्यक्ष प्रभाव',
    'impact.edu': 'शिक्षित बच्चे',
    'impact.food': 'भोजन वितरण',
    'impact.health': 'स्वास्थ्य शिविर',
    'impact.vols': 'सक्रिय स्वयंसेवक',
    'impact.villages': 'ग्राम आच्छादित',
    'impact.verified': 'सत्यापित रिकॉर्ड',

    // Four Pillars
    'pillars.badge': 'संस्था के मुख्य चार स्तंभ',
    'pillars.title': 'हमारी निरंतर सेवा धारा',
    'pillars.sub': 'जीवन ज्योति फाउंडेशन गाजीपुर समाज के अंतिम पायदान पर खड़े व्यक्ति तक सहायता पहुंचाने के लिए समर्पित है।',
    'pillars.p1_title': 'शिक्षा सेवा (Education Support)',
    'pillars.p1_desc': 'ग्रामीण व मलिन बस्तियों के निर्धन बच्चों हेतु निःशुल्क संध्याकालीन पाठशाला, स्कूल बैग, कॉपियां, पुस्तकें एवं डिजिटल कंप्यूटर साक्षरता।',
    'pillars.p2_title': 'अन्नपूर्णा भोजन सेवा (Food Distribution)',
    'pillars.p2_desc': 'भूखे व असहायजनों के लिए नियमित ताज़ा पौष्टिक भोजन, आपदा राहत राशन किट एवं त्योहारों पर विशेष मिष्ठान्न व आहार वितरण।',
    'pillars.p3_title': 'स्वास्थ्य रक्षा (Healthcare Camps)',
    'pillars.p3_desc': 'विशेषज्ञ चिकित्सकों द्वारा निःशुल्क नेत्र जांच, सामान्य स्वास्थ्य परामर्श, रक्तचाप/शुगर जांच एवं आवश्यक दवाइयों का निःशुल्क वितरण।',
    'pillars.p4_title': 'अनाथ व वृद्ध सेवा (Orphan & Elderly Care)',
    'pillars.p4_desc': 'निराश्रित अनाथ बच्चों के पालन-पोषण में सहयोग, शीत ऋतु में वृद्धजनों को कंबल वितरण एवं सामाजिक पुनर्वास सहायता।',

    // Ghazipur Map
    'map.badge': 'जनपद ग़ाज़ीपुर सेवा केंद्र (Active Service Hubs & Centers)',
    'map.title': 'ग़ाज़ीपुर में हमारे प्रमुख सेवा क्षेत्र एवं केंद्र',
    'map.sub': 'मोहम्मदाबाद, मीरानपुर, सदर, जमानिया एवं सैदपुर में हमारे सक्रिय सेवा केंद्र जहां नियमित पाठशाला, स्वास्थ्य कैंप व भोजन वितरण होता है।',
    'map.beneficiaries': 'कुल लाभांवित नागरिक',
    'map.vol_team': 'सक्रिय सेवा दल',
    'map.lead': 'केंद्र प्रभारी (Lead)',
    'map.contact': 'केंद्र संपर्क',
    'map.view_gmaps': 'Google Maps पर देखें',

    // Volunteer Task Portal
    'vol.badge': 'स्वयंसेवक मंच एवं प्रमाण पत्र जनरेटर',
    'vol.title': 'सेवा ही संकल्प (Volunteer Portal)',
    'vol.sub': 'संस्था के साथ जुड़ें, सेवा कार्यों में भाग लें और तत्काल डिजिटल हस्ताक्षरित प्रमाण पत्र प्राप्त करें।',
    'vol.join_btn': 'नया स्वयंसेवक पंजीकरण (Join as Volunteer)',
    'vol.son_of': 'सुपुत्र / सुपुत्री',
    'vol.field': 'सेवा क्षेत्र',
    'vol.contribution': 'योगदान',
    'vol.hours': 'घंटे',
    'vol.tasks': 'कार्य',
    'vol.date': 'दिनांक',
    'vol.view_cert': 'प्रमाण पत्र देखें (Certificate)',
    'vol.active_missions': 'सक्रिय सेवा कार्य (Active Volunteer Missions)',
    'vol.generate_task_cert': 'प्रशंसा पत्र जनरेट करें',

    // Recent Events
    'events.badge': 'गतिविधियां एवं ग्राउंड रिपोर्ट (Recent Field Events)',
    'events.title': 'हाल ही में आयोजित सेवा कार्यक्रम',
    'events.beneficiaries': 'लाभांवित संख्या',
    'events.citizens': 'नागरिक',

    // Video Showcase
    'video.badge': 'ग्राउंड डाक्यूमेंट्री एवं सेवा झलक (Ground Impact Film)',
    'video.title': 'ग़ाज़ीपुर के ग्रामीण अंचलों में जीवन ज्योति का कार्य',
    'video.sub': 'देखें कि कैसे आपके छोटे से सहयोग और हमारे कर्मठ स्वयंसेवकों के समर्पण से सैकड़ों परिवारों के चेहरों पर मुस्कान आई।',
    'video.doc_title': '"उम्मीद की एक किरण" - जीवन ज्योति डॉक्यूमेंट्री',
    'video.doc_desc': 'ग़ाज़ीपुर जनपद के सुदूर गांवों में संचालित सांध्यकालीन पाठशाला और स्वास्थ्य रक्षा अभियान की सच्ची कहानी।',

    // Donors Wall of Fame
    'donors.badge': 'सहयोगियों की गौरव पट्टिका (Donors Wall of Fame)',
    'donors.title': 'हमारे परम सहयोगी एवं भामाशाह',
    'donors.sub': 'समर्पित दानदाता जिन्होंने समाज के अंतिम व्यक्ति तक शिक्षा व स्वास्थ्य सेवा पहुंचाई।',
    'donors.btn_donate': 'सहयोग करें (Donate Now)',
    'donors.btn_receipt': 'दान रसीद डाउनलोड',
    'donors.amount_label': 'योगदान राशि',

    // Leaderboard
    'lead.badge': 'कर्मठ स्वयंसेवक लीडरबोर्ड (Top Seva Leaderboard)',
    'lead.title': 'समाज सेवा में अग्रणी हमारे निष्ठावान स्वयंसेवक',
    'lead.sub': 'अथक परिश्रम, सांध्यकालीन पाठशाला अध्यापन एवं स्वास्थ्य राहत कार्यों में सर्वोच्च योगदान देने वाले युवा साथी।',
    'lead.hours_label': 'सेवा घंटे',
    'lead.tasks_label': 'पूर्ण कार्य',
    'lead.btn_id': 'अपना स्वयंसेवक कार्ड जनरेट करें (Get Volunteer ID)',
    'lead.btn_cert': 'प्रमाण पत्र प्राप्त करें',

    // Voices / Testimonials
    'voices.badge': 'स्वयंसेवकों के अनुभव (Volunteer Testimonials)',
    'voices.title': 'धरातल पर सेवा करने वाले साथियों की जुबानी',

    // Verification Portal
    'verify.badge': 'आधिकारिक डिजिटल सत्यापन पोर्टल (Official Verification Portal)',
    'verify.title': 'सर्टिफिकेट एवं दान रसीद सत्यापन',
    'verify.sub': 'अपने प्रमाण पत्र / दान रसीद की प्रमाणिकता जांचने के लिए सर्टिफिकेट नंबर या वॉलंटियर ID दर्ज करें।',
    'verify.placeholder': 'सर्टिफिकेट संख्या (उदा. JJF-VOL-001 या JJF-DON-2025-001)',
    'verify.btn': 'सत्यापित करें (Verify Now)',
    'verify.no_record': 'कोई रिकॉर्ड नहीं मिला (No Record Found)',
    'verify.no_record_sub': 'कृपया सही सर्टिफिकेट नंबर जांचकर पुनः प्रयास करें।',

    // Impact Stories
    'stories.badge': 'धरातलीय सेवा की झलकियां',
    'stories.title': 'सफलता एवं सेवा गाथाएं',
    'stories.sub': 'गाजीपुर के विभिन्न ग्रामों एवं मजरों में जीवन ज्योति फाउंडेशन द्वारा संचालित वास्तविक जनहित कार्यक्रम।',
    'stories.beneficiaries': 'लाभार्थी',
    'stories.verified': 'सत्यापित',

    // Footer
    'footer.about_desc': 'गाजीपुर, उत्तर प्रदेश (भारत) में सामाजिक कल्याण, बाल शिक्षा, निःशुल्क स्वास्थ्य शिविर एवं अन्नपूर्णा भोजन सेवा हेतु पूर्णतः समर्पित गैर-लाभकारी संगठन।',
    'footer.compliances': 'वैधानिक पंजीकरण (Govt. Registrations)',
    'footer.quick_links': 'महत्वपूर्ण लिंक (Quick Links)',
    'footer.contact': 'संपर्क एवं मुख्य कार्यालय (Head Office)',
    'footer.manager': 'प्रबंधक / सचिव',
    'footer.rights': 'सर्वाधिकार सुरक्षित।'
  },

  en: {
    // Header & Brand
    'org.name': 'JEEVAN JYOTI FOUNDATION GHAZIPUR, UTTAR PRADESH, INDIA',
    'org.name_en': 'JEEVAN JYOTI FOUNDATION GHAZIPUR, UTTAR PRADESH, INDIA',
    'org.tagline': 'Sewa • Education • Healthcare',
    'org.reg_badge': 'Govt. Registered NGO (UP/2018/0207700)',

    // Nav
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.pillars': 'Four Pillars',
    'nav.volunteers': 'Volunteers',
    'nav.verify': 'Verify Certificate',
    'nav.stories': 'Impact Stories',
    'nav.report': 'Annual Report',
    'nav.donate': 'Donate',

    // Hero
    'hero.badge': 'Govt. Registered NGO (UP/2018/0207700)',
    'hero.title_hi': 'JEEVAN JYOTI FOUNDATION GHAZIPUR, UTTAR PRADESH, INDIA',
    'hero.title_en': 'Empowering Lives with Hope & Dignity',
    'hero.tagline': 'Sewa • Education • Healthcare',
    'hero.desc': 'A grassroots NGO dedicated to providing free quality education to underprivileged children, daily meal distribution, rural healthcare camps, and women empowerment across Ghazipur, Uttar Pradesh, India.',
    'hero.btn_donate': 'Donate Now',
    'hero.btn_volunteer': 'Join as Volunteer / Get Certificate',
    'hero.card_location': 'Village Miranpur, Mohammadabad, Ghazipur, Uttar Pradesh, India - 233303 (DIGIPIN 2J6T226CL2)',
    'hero.card_verified': '100% Transparent & Verified',
    'hero.strip_edu': 'Education Support',
    'hero.strip_edu_sub': 'Free Evening Schools',
    'hero.strip_food': 'Annapurna Seva',
    'hero.strip_food_sub': 'Meals & Ration Kits',
    'hero.strip_health': 'Healthcare Camps',
    'hero.strip_health_sub': 'Free Medical Care',

    // Action Center
    'action.badge': 'Citizen Action & Certificate Hub',
    'action.title': 'Join the Mission, Generate Official Certificates & IDs Instantly',
    'action.sub': 'Generate, verify, and download volunteer appreciation certificates, donation receipts, volunteer identity cards, and annual impact reports.',
    'action.donate': 'Donate Now',
    'action.donate_sub': 'Donation Form',
    'action.vol_cert': 'Volunteer Certificate',
    'action.vol_cert_sub': 'QR Verified Cert',
    'action.id_card': 'Volunteer ID Card',
    'action.id_card_sub': 'Official Volunteer ID',
    'action.tax_receipt': 'Donation Receipt',
    'action.tax_receipt_sub': 'Receipt Form',
    'action.task_cert': 'Honor Certificate',
    'action.task_cert_sub': 'Special Appreciation',
    'action.annual_report': 'Annual Impact Report',
    'action.annual_report_sub': 'Annual Report 2026',

    // Live Impact
    'impact.badge': 'REAL TIME IMPACT METRICS',
    'impact.title': 'Measurable Ground Impact Across Ghazipur',
    'impact.edu': 'Children Educated',
    'impact.food': 'Meals Distributed',
    'impact.health': 'Medical Camps',
    'impact.vols': 'Active Volunteers',
    'impact.villages': 'Villages Covered',
    'impact.verified': 'Verified Records',

    // Four Pillars
    'pillars.badge': 'Four Core Pillars of Foundation',
    'pillars.title': 'Our Continuous Streams of Service',
    'pillars.sub': 'Jeevan Jyoti Foundation Ghazipur is committed to uplifting every underprivileged individual across rural communities.',
    'pillars.p1_title': 'Education Support (Free Schools)',
    'pillars.p1_desc': 'Free evening learning centers for slum and rural children, school bags, notebooks, study materials, and digital literacy classes.',
    'pillars.p2_title': 'Annapurna Food Distribution',
    'pillars.p2_desc': 'Fresh nutritious meals for the hungry, emergency disaster relief ration kits, and festival festive meal drives.',
    'pillars.p3_title': 'Healthcare & Medical Camps',
    'pillars.p3_desc': 'Free eye checkups by specialist doctors, health consultations, diabetes/BP screening, and free distribution of prescribed medicines.',
    'pillars.p4_title': 'Orphan & Elderly Care',
    'pillars.p4_desc': 'Nurturing destitute children, winter blanket distribution for senior citizens, and comprehensive social rehabilitation support.',

    // Ghazipur Map
    'map.badge': 'Ghazipur District Service Centers & Hubs',
    'map.title': 'Our Major Service Centers in Ghazipur',
    'map.sub': 'Active community centers across Mohammadabad, Miranpur, Sadar, Zamania, and Saidpur hosting regular evening classes, health camps, and meal drives.',
    'map.beneficiaries': 'Total Citizens Benefited',
    'map.vol_team': 'Active Volunteer Team',
    'map.lead': 'Center In-Charge',
    'map.contact': 'Center Contact',
    'map.view_gmaps': 'Open in Google Maps',

    // Volunteer Task Portal
    'vol.badge': 'Volunteer Platform & Certificate Generator',
    'vol.title': 'Service is Our Resolve (Volunteer Portal)',
    'vol.sub': 'Join our movement, participate in field seva activities, and receive instantly authenticated, digitally signed certificates.',
    'vol.join_btn': 'Register as New Volunteer',
    'vol.son_of': 'Son / Daughter of',
    'vol.field': 'Service Sector',
    'vol.contribution': 'Contribution',
    'vol.hours': 'Hours',
    'vol.tasks': 'Missions',
    'vol.date': 'Date Joined',
    'vol.view_cert': 'View Certificate',
    'vol.active_missions': 'Active Volunteer Missions',
    'vol.generate_task_cert': 'Generate Task Certificate',

    // Recent Events
    'events.badge': 'Recent Ground Events & Field Reports',
    'events.title': 'Recently Conducted Seva Programs',
    'events.beneficiaries': 'Beneficiaries Served',
    'events.citizens': 'Citizens',

    // Video Showcase
    'video.badge': 'Ground Documentary & Seva Highlights',
    'video.title': 'Ground Realities & Impact in Rural Ghazipur',
    'video.sub': 'Witness how your generous support and our dedicated volunteers bring bright smiles and transformation to hundreds of families.',
    'video.doc_title': '"Ray of Hope" - Jeevan Jyoti Documentary',
    'video.doc_desc': 'A true documentary capturing free evening schools and healthcare missions in the remote villages of Ghazipur.',

    // Donors Wall of Fame
    'donors.badge': 'Donors Wall of Fame & Esteemed Patrons',
    'donors.title': 'Our Esteemed Donors & Pillars of Support',
    'donors.sub': 'Dedicated donors empowering community education, food relief, and healthcare.',
    'donors.btn_donate': 'Donate Now',
    'donors.btn_receipt': 'Download Donation Receipt',
    'donors.amount_label': 'Contribution Amount',

    // Leaderboard
    'lead.badge': 'Top Seva Leaderboard',
    'lead.title': 'Leading Dedicated Volunteers in Social Service',
    'lead.sub': 'Honoring outstanding youth leaders for their untiring teaching, medical relief, and community support.',
    'lead.hours_label': 'Seva Hours',
    'lead.tasks_label': 'Completed Missions',
    'lead.btn_id': 'Generate Your Volunteer ID Card',
    'lead.btn_cert': 'Get Appreciation Certificate',

    // Voices / Testimonials
    'voices.badge': 'Volunteer Testimonials & Experiences',
    'voices.title': 'Direct Voices from Our Field Volunteers',

    // Verification Portal
    'verify.badge': 'Official Digital Verification Portal',
    'verify.title': 'Certificate & Donation Receipt Verification',
    'verify.sub': 'Enter your Certificate ID or Volunteer ID to check and verify the official authenticity in real time.',
    'verify.placeholder': 'Enter Certificate ID (e.g. JJF-VOL-001 or JJF-DON-2025-001)',
    'verify.btn': 'Verify Now',
    'verify.no_record': 'No Matching Record Found',
    'verify.no_record_sub': 'Please verify the Certificate ID and try again.',

    // Impact Stories
    'stories.badge': 'Field Seva Highlights',
    'stories.title': 'Impact & Success Stories',
    'stories.sub': 'Verified community initiatives conducted by Jeevan Jyoti Foundation across various villages in Ghazipur.',
    'stories.beneficiaries': 'Beneficiaries',
    'stories.verified': 'Verified',

    // Footer
    'footer.about_desc': 'A dedicated non-profit organization serving Ghazipur, UP through free child education, healthcare camps, food distribution, and women empowerment.',
    'footer.compliances': 'Govt. Registrations & Legal',
    'footer.quick_links': 'Quick Links',
    'footer.contact': 'Contact & Head Office',
    'footer.manager': 'Manager / Secretary',
    'footer.rights': 'All Rights Reserved.'
  },

  bho: {
    'org.name': 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुर, उत्तर प्रदेश, भारत',
    'org.name_en': 'JEEVAN JYOTI FOUNDATION GHAZIPUR, UTTAR PRADESH, INDIA',
    'org.tagline': 'सेवा • शिक्षा • स्वास्थ्य',
    'org.reg_badge': 'सरकारी पंजीकृत संस्था (UP/2018/0207700)',
    'nav.home': 'मुख्य पृष्ठ',
    'nav.about': 'परिचय',
    'nav.pillars': 'सेवा क्षेत्र',
    'nav.volunteers': 'स्वयंसेवक साथी',
    'nav.verify': 'प्रमाण पत्र सत्यापन',
    'nav.stories': 'सेवा गाथा',
    'nav.report': 'वार्षिक रिपोर्ट',
    'nav.donate': 'सहयोग / दान करीं',
    'hero.badge': 'भारत सरकार नीति आयोग पंजीकृत (UP/2018/0207700)',
    'hero.title_hi': 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुर',
    'hero.tagline': 'सेवा • शिक्षा • स्वास्थ्य (समर्पित समाज सेवा)',
    'hero.desc': 'ग़ाज़ीपुर के गरीब व जरूरतमंद लइकन के मुफ़्त बढ़िया पढ़ाई, भूखन खातिर अन्नपूर्णा भोजन सेवा, स्वास्थ्य जांच शिविर आ समाज कल्याण खातिर जुटल संस्था।',
    'hero.btn_donate': 'सहयोग / दान करीं',
    'hero.btn_volunteer': 'स्वयंसेवक बनीं / प्रमाण पत्र लीं',
    'action.badge': 'जन सेवा एवं सत्यापन केंद्र',
    'action.title': 'सेवा से जुड़ीं, तुरंत प्रमाण पत्र व पहचान पत्र पाईं',
    'action.donate': 'सहयोग / दान करीं',
    'action.donate_sub': 'दान फॉर्म',
    'action.vol_cert': 'स्वयंसेवक प्रमाण पत्र',
    'action.id_card': 'स्वयंसेवक ID कार्ड',
    'action.tax_receipt': 'दान रसीद',
    'action.task_cert': 'प्रशंसा पत्र',
    'action.annual_report': 'वार्षिक रिपोर्ट',
    'footer.rights': 'सर्वाधिकार सुरक्षित।'
  },

  sa: {
    'org.name': 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुरम्, उत्तरप्रदेशः, भारतम्',
    'org.name_en': 'JEEVAN JYOTI FOUNDATION GHAZIPUR',
    'org.tagline': 'सेवा • शिक्षा • स्वास्थ्यम्',
    'org.reg_badge': 'शासकीय-पंजीकृत-संस्था (UP/2018/0207700)',
    'nav.home': 'मुख्यपृष्ठम्',
    'nav.about': 'परिचयः',
    'nav.pillars': 'सेवास्तम्भाः',
    'nav.volunteers': 'स्वयंसेवकाः',
    'nav.verify': 'प्रमाणपत्र-सत्यापनम्',
    'nav.stories': 'सेवागाथाः',
    'nav.report': 'वार्षिकविवरणम्',
    'nav.donate': 'दानं कुर्वन्तु',
    'hero.badge': 'भारतसर्वकार-नीति-आयोगे पंजीकृतम् (UP/2018/0207700)',
    'hero.title_hi': 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुरम्',
    'hero.tagline': 'सेवा • शिक्षा • स्वास्थ्यम्',
    'hero.desc': 'ग़ाज़ीपुर-जनपदे निर्धनानां बालकानां निःशुल्कशिक्षायै, बुभुक्षितानां कृते अन्नपूर्णाभोजनसेवाये, स्वास्थ्यशिबिरेभ्यः च समर्पिता संस्था।',
    'hero.btn_donate': 'दानं कुर्वन्तु',
    'hero.btn_volunteer': 'स्वयंसेवको भवन्तु',
    'action.badge': 'जनसेवा तथा सत्यापनकेन्द्रम्',
    'action.title': 'सेवया युज्यन्ताम्, तत्क्षणं प्रमाणपत्रं प्राप्नुवन्तु',
    'action.donate': 'दानं कुर्वन्तु',
    'action.vol_cert': 'स्वयंसेवकप्रमाणपत्रम्',
    'action.id_card': 'परिचयपत्रम्',
    'action.tax_receipt': 'दानप्राप्तिपत्रम्',
    'footer.rights': 'सर्वे अधिकाराः सुरक्षिताः।'
  }
};

const defaultLanguageContext: LanguageContextType = {
  language: 'hi',
  setLanguage: () => {},
  toggleLanguage: () => {},
  isHindi: true,
  isEnglish: false,
  isBhojpuri: false,
  isSanskrit: false,
  t: (key: string, hindiOrDefault?: string, englishText?: string): string => {
    if (translations.hi?.[key]) {
      return translations.hi[key];
    }
    return hindiOrDefault || key;
  }
};

const LanguageContext = React.createContext<LanguageContextType>(defaultLanguageContext);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = React.useState<Language>(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved =
          window.localStorage.getItem('jjf_portal_lang') ||
          window.localStorage.getItem('jjf_selected_language');
        if (saved) return saved;
      }
    } catch {
      // Ignore access errors in restricted environments
    }
    return 'hi';
  });

  // Initialize live DOM translation on mount
  React.useEffect(() => {
    initLiveTranslator();
  }, []);

  const setLanguage = (lang: Language) => {
    const validLang = lang || 'hi';
    setLanguageState(validLang);
    try {
      if (typeof window !== 'undefined') {
        if (window.localStorage) {
          window.localStorage.setItem('jjf_portal_lang', validLang);
          window.localStorage.setItem('jjf_selected_language', validLang);
        }
        document.documentElement.lang = validLang;
      }
    } catch {
      // Ignore write errors in restricted environments
    }
    // Apply live in-memory translation across DOM and Google Translate
    applyLiveTranslation(validLang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  const t = (key: string, hindiOrDefault?: string, englishText?: string): string => {
    const langDict = (translations as Record<string, Record<string, string>>)[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // If not in target language, check if English text is available
    if (language !== 'hi') {
      if (translations.en?.[key]) {
        return translations.en[key];
      }
      if (englishText) {
        return englishText;
      }
    }
    if (translations.hi?.[key]) {
      return translations.hi[key];
    }
    return hindiOrDefault || key;
  };

  const isHindi = language === 'hi';
  const isEnglish = language === 'en';
  const isBhojpuri = language === 'bho';
  const isSanskrit = language === 'sa';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isHindi,
        isEnglish,
        isBhojpuri,
        isSanskrit,
        t
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = React.useContext(LanguageContext);
  return context || defaultLanguageContext;
};
