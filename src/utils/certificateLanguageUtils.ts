import { FOUNDATION_INFO } from '../data/foundationData';

export type CertificateLanguage = 'hi' | 'en' | 'bilingual';

export interface VolunteerCertText {
  regNoLabel: string;
  nitiLabel: string;
  certNoLabel: string;
  issueDateLabel: string;
  volIdLabel: string;
  foundationName: string;
  motto: string;
  address: string;
  mainTitle: string;
  subTitle: string;
  certifyIntro: string;
  relationLabel: string;
  foundationRegisteredAddressLabel: string;
  foundationRegisteredAddressValue: string;
  servedAsLabel: string;
  volunteerBadge: string;
  orgNameInBody: string;
  forContributionIn: string;
  durationLabel: string;
  mottoEmbodiment: string;
  credentialsTitle: string;
  verifiedBadgeTitle: string;
  verifiedBadgeSub: string;
  signatoryTitle: string;
  signatoryName: string;
  signatoryDesignation: string;
  signatoryOrg: string;
  qrScanInstruction: string;
}

export interface DonationCertText {
  regNoLabel: string;
  nitiLabel: string;
  urn80GLabel: string;
  urn12ALabel: string;
  receiptNoLabel: string;
  issueDateLabel: string;
  dateLabel: string;
  foundationName: string;
  address: string;
  taxInfoLine: string;
  mainTitle: string;
  subTitle: string;
  acknowledgedIntro: string;
  donorNameLabel: string;
  donorPanLabel: string;
  relationLabel: string;
  addressLabel: string;
  amountLabel: string;
  paymentModeLabel: string;
  modeLabel: string;
  refLabel: string;
  purposeLabel: string;
  panLabel: string;
  taxExemptionNote: string;
  verificationRecordTitle: string;
  signatoryTitle: string;
  signatoryLabel: string;
  signatoryName: string;
  signatoryDesignation: string;
  signatoryDesig: string;
  signatoryOrg: string;
  qrInstruction: string;
  qrScanInstruction: string;
}

export interface IdCardText {
  foundationName: string;
  cardTitle: string;
  designation: string;
  idNoLabel: string;
  fatherHusbandLabel: string;
  phoneLabel: string;
  bloodGroupLabel: string;
  areaLabel: string;
  addressLabel: string;
  validityLabel: string;
  signatoryLabel: string;
  qrInstruction: string;
}

export interface TaskAppreciationText {
  foundationName: string;
  certNoLabel: string;
  dateLabel: string;
  mainTitle: string;
  subTitle: string;
  presentedToText: string;
  officeAddressLabel: string;
  taskLocationLabel: string;
  pointsLabel: string;
  bodyText: string;
  signatoryLabel: string;
  signatoryName: string;
  signatoryDesig: string;
  qrInstruction: string;
}

export interface FestivalGreetingText {
  foundationName: string;
  certNoLabel: string;
  dateLabel: string;
  mainTitle: string;
  subTitle: string;
  presentedToText: string;
  wishingIntro: string;
  blessingQuote: string;
  verifiedTitle: string;
  signatoryLabel: string;
  signatoryName: string;
  signatoryDesig: string;
  qrInstruction: string;
}

export const getVolunteerCertMatter = (lang: CertificateLanguage): VolunteerCertText => {
  if (lang === 'en') {
    return {
      regNoLabel: 'Reg. No',
      nitiLabel: 'NITI Aayog UID',
      certNoLabel: 'Certificate No',
      issueDateLabel: 'Date of Issue',
      volIdLabel: 'Volunteer ID',
      foundationName: FOUNDATION_INFO.nameEnglish,
      motto: '• SERVICE • EDUCATION • HEALTHCARE •',
      address: FOUNDATION_INFO.fullAddressEnglish || FOUNDATION_INFO.address,
      mainTitle: 'CERTIFICATE OF APPRECIATION',
      subTitle: 'FOR OUTSTANDING VOLUNTEER SERVICE & COMMUNITY DEDICATION',
      certifyIntro: 'This is proudly presented to certify that',
      relationLabel: 'Son / Daughter / Spouse of',
      foundationRegisteredAddressLabel: 'Registered NGO Address:',
      foundationRegisteredAddressValue: FOUNDATION_INFO.fullAddressEnglish || FOUNDATION_INFO.address,
      servedAsLabel: 'has dedicatedly and honorably served as an active',
      volunteerBadge: 'VOLUNTEER',
      orgNameInBody: 'JEEVAN JYOTI FOUNDATION, GHAZIPUR',
      forContributionIn: 'for remarkable, selfless contribution and outstanding humanitarian service in',
      durationLabel: 'Duration of Service',
      mottoEmbodiment: 'Your tireless compassion, integrity, and relentless spirit of service truly embody our founding ethos: "SEWA. SHIKSHA. SWASTHYA." (Service, Education & Healthcare).',
      credentialsTitle: 'CERTIFICATE CREDENTIALS:',
      verifiedBadgeTitle: 'VERIFIED BY JYOTI AI',
      verifiedBadgeSub: 'Authenticated Cloud Certificate',
      signatoryTitle: 'AUTHORIZED SIGNATORY',
      signatoryName: 'Shailesh Pradhan',
      signatoryDesignation: 'Manager & General Secretary',
      signatoryOrg: 'Jeevan Jyoti Foundation, Ghazipur',
      qrScanInstruction: 'Scan QR Code to Verify Authenticity'
    };
  }

  if (lang === 'hi') {
    return {
      regNoLabel: 'पंजीकरण संख्या',
      nitiLabel: 'नीति आयोग विशिष्ट पहचान (UID)',
      certNoLabel: 'प्रमाण पत्र क्रमांक',
      issueDateLabel: 'जारी करने की तिथि',
      volIdLabel: 'स्वयंसेवक पहचान सं.',
      foundationName: FOUNDATION_INFO.nameHindi,
      motto: '• सेवा • शिक्षा • स्वास्थ्य •',
      address: FOUNDATION_INFO.fullAddressHindi || FOUNDATION_INFO.address,
      mainTitle: 'प्रशस्ति एवं सेवा समर्पण सम्मान पत्र',
      subTitle: 'उत्कृष्ट समाज सेवा, समर्पण एवं निःस्वार्थ जन-कल्याण हेतु',
      certifyIntro: 'अत्यंत गौरव एवं हर्ष के साथ प्रमाणित किया जाता है कि',
      relationLabel: 'सुपुत्र / सुपुत्री / धर्मपत्नी',
      foundationRegisteredAddressLabel: 'संस्था का पंजीकृत आधिकारिक पता:',
      foundationRegisteredAddressValue: FOUNDATION_INFO.fullAddressHindi || FOUNDATION_INFO.address,
      servedAsLabel: 'ने संस्था में एक निष्ठावान एवं कर्मठ',
      volunteerBadge: 'आधिकारिक स्वयंसेवक',
      orgNameInBody: 'जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर (उत्तर प्रदेश)',
      forContributionIn: 'के रूप में समाज के वंचित वर्ग के उत्थान एवं निरंतर सहयोग हेतु उत्कृष्ट योगदान दिया है:',
      durationLabel: 'सेवा अवधि',
      mottoEmbodiment: 'आपकी सेवा भावना, परोपकार व कर्तव्यनिष्ठा संस्था के मूल मंत्र "सेवा • शिक्षा • स्वास्थ्य" को साकार करती है। हम आपके उज्ज्वल भविष्य की कामना करते हैं।',
      credentialsTitle: 'प्रमाण पत्र अधिकृत विवरण:',
      verifiedBadgeTitle: 'ज्योति AI द्वारा प्रमाणित',
      verifiedBadgeSub: 'फायरबेस क्लाउड सत्यापित रिकॉर्ड',
      signatoryTitle: 'अधिकृत हस्ताक्षरकर्ता',
      signatoryName: 'शैलेश प्रधान',
      signatoryDesignation: 'प्रबंधक एवं सचिव',
      signatoryOrg: 'जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर',
      qrScanInstruction: 'QR कोड स्कैन कर सत्यता प्रमाणित करें'
    };
  }

  // Bilingual (Default)
  return {
    regNoLabel: 'Reg. No / पंजीकरण सं.',
    nitiLabel: 'NITI Aayog UID',
    certNoLabel: 'Certificate No / प्रमाण पत्र सं.',
    issueDateLabel: 'Date of Issue / जारी दिनांक',
    volIdLabel: 'Volunteer ID / स्वयंसेवक सं.',
    foundationName: `${FOUNDATION_INFO.nameHindi} / ${FOUNDATION_INFO.nameEnglish}`,
    motto: '• SEWA • SHIKSHA • SWASTHYA • (सेवा • शिक्षा • स्वास्थ्य)',
    address: `${FOUNDATION_INFO.fullAddressEnglish || FOUNDATION_INFO.address}`,
    mainTitle: 'प्रशस्ति पत्र / CERTIFICATE OF APPRECIATION',
    subTitle: 'उत्कृष्ट स्वयंसेवक सेवा सम्मान / FOR OUTSTANDING VOLUNTEER SERVICE',
    certifyIntro: 'This is to certify that / यह प्रमाणित किया जाता है कि',
    relationLabel: 'Son / Daughter / Spouse of (सुपुत्र / सुपुत्री / पत्नी)',
    foundationRegisteredAddressLabel: 'संस्था का पंजीकृत पता (Registered NGO Address):',
    foundationRegisteredAddressValue: `${FOUNDATION_INFO.fullAddressHindi || FOUNDATION_INFO.address}`,
    servedAsLabel: 'has dedicatedly served as a (ने निष्ठापूर्वक सेवा दी)',
    volunteerBadge: 'VOLUNTEER / स्वयंसेवक',
    orgNameInBody: 'JEEVAN JYOTI FOUNDATION, GHAZIPUR',
    forContributionIn: 'for selfless contribution in (निःस्वार्थ योगदान के क्षेत्र में):',
    durationLabel: 'Duration / सेवा अवधि',
    mottoEmbodiment: 'Your compassion, dedication and spirit of service truly embodies our motto : "SEWA. SHIKSHA. SWASTHYA." (सेवा • शिक्षा • स्वास्थ्य)',
    credentialsTitle: 'CERTIFICATE CREDENTIALS / प्रमाण पत्र विवरण:',
    verifiedBadgeTitle: 'VERIFIED BY JYOTI AI',
    verifiedBadgeSub: 'Authenticated Certificate',
    signatoryTitle: 'AUTHORISED SIGNATORY / अधिकृत हस्ताक्षरकर्ता',
    signatoryName: 'Shailesh Pradhan / शैलेश प्रधान',
    signatoryDesignation: 'Manager & Secretary (प्रबंधक एवं सचिव)',
    signatoryOrg: 'Jeevan Jyoti Foundation, Ghazipur',
    qrScanInstruction: 'Scan QR to Verify / QR स्कैन कर सत्यापन करें'
  };
};

export const getDonationCertMatter = (lang: CertificateLanguage): DonationCertText => {
  if (lang === 'en') {
    return {
      regNoLabel: 'Reg. No',
      nitiLabel: 'NITI Aayog UID',
      urn80GLabel: 'NGO Reg',
      urn12ALabel: 'Registration',
      receiptNoLabel: 'Donation Receipt No',
      issueDateLabel: 'Receipt Date',
      dateLabel: 'Date',
      foundationName: FOUNDATION_INFO.nameEnglish,
      address: FOUNDATION_INFO.fullAddressEnglish || FOUNDATION_INFO.address,
      taxInfoLine: `Reg No: ${FOUNDATION_INFO.regNo} • NITI Aayog: ${FOUNDATION_INFO.nitiAayogUid} • PAN: ${FOUNDATION_INFO.pan}`,
      mainTitle: 'OFFICIAL DONATION RECEIPT & APPRECIATION',
      subTitle: 'OFFICIAL REGISTERED CHARITABLE DONATION RECEIPT',
      acknowledgedIntro: 'With deep gratitude, we acknowledge and certify the generous charitable contribution received from:',
      donorNameLabel: 'Donor Name',
      donorPanLabel: 'Donor PAN',
      relationLabel: 'Father / Spouse Name',
      addressLabel: 'Donor Address',
      amountLabel: 'Donation Amount',
      paymentModeLabel: 'Mode of Payment',
      modeLabel: 'Mode',
      refLabel: 'Ref No',
      purposeLabel: 'Purpose of Contribution',
      panLabel: 'Donor PAN No',
      taxExemptionNote: 'Donations to Jeevan Jyoti Foundation are accepted in accordance with government non-profit regulations and utilized towards societal welfare.',
      verificationRecordTitle: 'VERIFICATION RECORD',
      signatoryTitle: 'AUTHORIZED SIGNATORY',
      signatoryLabel: 'Authorized Signatory',
      signatoryName: 'Shailesh Pradhan',
      signatoryDesignation: 'Manager & General Secretary',
      signatoryDesig: 'Manager & Secretary',
      signatoryOrg: 'Jeevan Jyoti Foundation, Ghazipur',
      qrInstruction: 'Scan QR to verify donation receipt',
      qrScanInstruction: 'Scan QR to Verify Receipt Authenticity'
    };
  }

  if (lang === 'hi') {
    return {
      regNoLabel: 'पंजीकरण संख्या',
      nitiLabel: 'नीति आयोग UID',
      urn80GLabel: 'पंजीकरण',
      urn12ALabel: 'दर्पण UID',
      receiptNoLabel: 'दान रसीद क्रमांक',
      issueDateLabel: 'रसीद दिनांक',
      dateLabel: 'दिनांक',
      foundationName: FOUNDATION_INFO.nameHindi,
      address: FOUNDATION_INFO.fullAddressHindi || FOUNDATION_INFO.address,
      taxInfoLine: `पंजीकरण संख्या: ${FOUNDATION_INFO.regNo} • नीति आयोग: ${FOUNDATION_INFO.nitiAayogUid} • पैन: ${FOUNDATION_INFO.pan}`,
      mainTitle: 'आधिकारिक दान रसीद एवं सम्मान पत्र',
      subTitle: 'जीवन ज्योति फाउंडेशन - समाज कल्याण एवं शिक्षा सहयोग रसीद',
      acknowledgedIntro: 'संस्था अत्यंत आदर व कृतज्ञतापूर्वक प्रमाणित करती है कि निम्नलिखित उदार दानदाता से पुनीत सहयोग प्राप्त हुआ:',
      donorNameLabel: 'दानदाता का नाम',
      donorPanLabel: 'दानदाता पैन',
      relationLabel: 'पिता / पति का नाम',
      addressLabel: 'दानदाता का पता',
      amountLabel: 'सहयोग राशि',
      paymentModeLabel: 'भुगतान का माध्यम',
      modeLabel: 'माध्यम',
      refLabel: 'संदर्भ सं.',
      purposeLabel: 'दान का पुनीत उद्देश्य',
      panLabel: 'दानदाता का पैन नंबर',
      taxExemptionNote: 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुर को दी गई दान राशि पूरी तरह से पारदर्शी रूप से समाज-कल्याण, शिक्षा एवं स्वास्थ्य कार्यों में उपयोग की जाती है।',
      verificationRecordTitle: 'सत्यापन अभिलेख',
      signatoryTitle: 'अधिकृत हस्ताक्षरकर्ता',
      signatoryLabel: 'अधिकृत हस्ताक्षरकर्ता',
      signatoryName: 'शैलेश प्रधान',
      signatoryDesignation: 'प्रबंधक एवं सचिव',
      signatoryDesig: 'प्रबंधक एवं सचिव',
      signatoryOrg: 'जीवन ज्योति फाउंडेशन, ग़ाज़ीपुर',
      qrInstruction: 'रसीद जांच हेतु QR स्कैन करें',
      qrScanInstruction: 'दान रसीद की आधिकारिक जांच हेतु QR स्कैन करें'
    };
  }

  // Bilingual
  return {
    regNoLabel: 'Reg. No / पंजी. सं.',
    nitiLabel: 'NITI UID',
    urn80GLabel: 'Registration / पंजी.',
    urn12ALabel: 'Darpan / दर्पण',
    receiptNoLabel: 'Receipt No / रसीद सं.',
    issueDateLabel: 'Date / दिनांक',
    dateLabel: 'Date / दिनांक',
    foundationName: `${FOUNDATION_INFO.nameHindi} (${FOUNDATION_INFO.nameEnglish})`,
    address: `${FOUNDATION_INFO.fullAddressHindi || FOUNDATION_INFO.address}`,
    taxInfoLine: `Reg: ${FOUNDATION_INFO.regNo} • NITI UID: ${FOUNDATION_INFO.nitiAayogUid} • PAN: ${FOUNDATION_INFO.pan}`,
    mainTitle: 'आधिकारिक दान रसीद एवं सम्मान पत्र / DONATION RECEIPT',
    subTitle: 'Official Donation Receipt / आधिकारिक संस्था दान रसीद',
    acknowledgedIntro: 'With deep gratitude, we acknowledge and certify the donation from / ससम्मान प्रमाणित किया जाता है कि:',
    donorNameLabel: 'Donor Name / दानदाता का नाम',
    donorPanLabel: 'Donor PAN / पैन',
    relationLabel: "Father/Spouse / पिता/पति",
    addressLabel: 'Address / पता',
    amountLabel: 'Amount / सहयोग राशि',
    paymentModeLabel: 'Payment Mode / माध्यम',
    modeLabel: 'Mode / माध्यम',
    refLabel: 'Ref / संदर्भ',
    purposeLabel: 'Purpose / उद्देश्य',
    panLabel: 'PAN No / पैन नंबर',
    taxExemptionNote: 'Official registered contribution for public welfare and education • जन-कल्याण एवं शिक्षा उत्थान हेतु अधिकृत दान।',
    verificationRecordTitle: 'VERIFICATION RECORD / सत्यापन अभिलेख',
    signatoryTitle: 'AUTHORIZED SIGNATORY / अधिकृत हस्ताक्षर',
    signatoryLabel: 'Authorized Signatory / अधिकृत हस्ताक्षर',
    signatoryName: 'Shailesh Pradhan / शैलेश प्रधान',
    signatoryDesignation: 'Manager & Secretary (प्रबंधक एवं सचिव)',
    signatoryDesig: 'Manager & Secretary (प्रबंधक एवं सचिव)',
    signatoryOrg: 'Jeevan Jyoti Foundation, Ghazipur',
    qrInstruction: 'Scan QR to Verify / QR स्कैन कर जांचें',
    qrScanInstruction: 'Scan QR to Verify / QR स्कैन कर जांचें'
  };
};

export const getIdCardMatter = (lang: CertificateLanguage): IdCardText => {
  if (lang === 'en') {
    return {
      foundationName: FOUNDATION_INFO.nameEnglish,
      cardTitle: 'OFFICIAL VOLUNTEER IDENTITY CARD',
      designation: 'Dedicated Swayam Sewak / Volunteer',
      idNoLabel: 'Identity Card No:',
      fatherHusbandLabel: "Father / Spouse's Name:",
      phoneLabel: 'Emergency / Contact No:',
      bloodGroupLabel: 'Blood Group:',
      areaLabel: 'Assigned Service Area:',
      addressLabel: 'Official Base Address:',
      validityLabel: 'Card Validity:',
      signatoryLabel: 'Authorized Signatory',
      qrInstruction: 'Scan QR to verify ID'
    };
  }

  if (lang === 'hi') {
    return {
      foundationName: FOUNDATION_INFO.nameHindi,
      cardTitle: 'स्वयंसेवक आधिकारिक पहचान पत्र',
      designation: 'कर्मठ स्वयंसेवक / समाज सेवी',
      idNoLabel: 'पहचान पत्र क्रमांक:',
      fatherHusbandLabel: 'पिता / पति का नाम:',
      phoneLabel: 'संपर्क मोबाइल नंबर:',
      bloodGroupLabel: 'रक्त समूह (Blood Group):',
      areaLabel: 'आवंटित सेवा क्षेत्र:',
      addressLabel: 'मूल निवास / पता:',
      validityLabel: 'वैधता अवधि:',
      signatoryLabel: 'अधिकृत हस्ताक्षर',
      qrInstruction: 'QR स्कैन कर पहचान सत्यापित करें'
    };
  }

  return {
    foundationName: `${FOUNDATION_INFO.nameHindi} (${FOUNDATION_INFO.nameEnglish})`,
    cardTitle: 'SWAYAM SEWAK OFFICIAL IDENTITY CARD / पहचान पत्र',
    designation: 'Dedicated Swayam Sewak / स्वयंसेवक',
    idNoLabel: 'ID No / पहचान सं:',
    fatherHusbandLabel: 'Father/Spouse / पिता/पति:',
    phoneLabel: 'Phone / मोबाइल:',
    bloodGroupLabel: 'Blood Group / ब्लड ग्रुप:',
    areaLabel: 'Area / सेवा क्षेत्र:',
    addressLabel: 'Address / पता:',
    validityLabel: 'Validity / वैधता:',
    signatoryLabel: 'Authorised Signatory / अधिकृत हस्ताक्षर',
    qrInstruction: 'Scan QR to verify ID'
  };
};

export const getTaskAppreciationMatter = (lang: CertificateLanguage): TaskAppreciationText => {
  if (lang === 'en') {
    return {
      foundationName: FOUNDATION_INFO.nameEnglish,
      certNoLabel: 'Certificate No',
      dateLabel: 'Date',
      mainTitle: 'CERTIFICATE OF SEVA APPRECIATION',
      subTitle: 'FOR EXCELLENCE IN COMMUNITY SERVICE & SOCIAL IMPACT',
      presentedToText: 'This Certificate of Appreciation is proudly presented to:',
      officeAddressLabel: 'Registered Office',
      taskLocationLabel: 'Field Task Location',
      pointsLabel: 'Seva Score Earned',
      bodyText: 'In deep recognition and sincere appreciation of your exemplary dedication and selfless volunteer work.',
      signatoryLabel: 'AUTHORISED SIGNATORY',
      signatoryName: 'Shailesh Pradhan',
      signatoryDesig: 'Manager & Secretary',
      qrInstruction: 'Scan to Verify Authenticity'
    };
  }

  if (lang === 'hi') {
    return {
      foundationName: FOUNDATION_INFO.nameHindi,
      certNoLabel: 'प्रमाण पत्र क्रमांक',
      dateLabel: 'दिनांक',
      mainTitle: 'विशेष सेवा कार्य प्रशंसा पत्र',
      subTitle: 'उत्कृष्ट समाज सेवा, समर्पण एवं जनकल्याणकारी योगदान हेतु',
      presentedToText: 'संस्था द्वारा यह सेवा प्रशंसा पत्र ससम्मान समर्पित किया जाता है:',
      officeAddressLabel: 'संस्था का पंजीकृत पता',
      taskLocationLabel: 'सेवा कार्य स्थल',
      pointsLabel: 'अर्जित सेवा अंक',
      bodyText: 'आपके द्वारा सामाजिक उत्थान एवं निःस्वार्थ सेवा अभियान में किए गए उत्कृष्ट योगदान की भूरि-भूरि प्रशंसा की जाती है।',
      signatoryLabel: 'अधिकृत हस्ताक्षरकर्ता',
      signatoryName: 'शैलेश प्रधान',
      signatoryDesig: 'प्रबंधक एवं सचिव',
      qrInstruction: 'QR स्कैन कर सत्यापन करें'
    };
  }

  // Bilingual
  return {
    foundationName: `${FOUNDATION_INFO.nameHindi} (${FOUNDATION_INFO.nameEnglish})`,
    certNoLabel: 'Certificate No / प्रमाण पत्र सं.',
    dateLabel: 'Date / दिनांक',
    mainTitle: 'सेवा कार्य प्रशंसा पत्र / SEVA APPRECIATION',
    subTitle: 'COMMUNITY SERVICE RECOGNITION / समाज सेवा सम्मान',
    presentedToText: 'This Certificate is presented to / ससम्मान समर्पित:',
    officeAddressLabel: 'Registered Address / पंजीकृत पता',
    taskLocationLabel: 'Location / सेवा स्थल',
    pointsLabel: 'Seva Points / सेवा अंक',
    bodyText: 'In recognition of outstanding dedication and selfless service / उत्कृष्ट सेवा समर्पण हेतु',
    signatoryLabel: 'Authorised Signatory / अधिकृत हस्ताक्षरकर्ता',
    signatoryName: 'Shailesh Pradhan / शैलेश प्रधान',
    signatoryDesig: 'Manager & Secretary (प्रबंधक एवं सचिव)',
    qrInstruction: 'Scan QR to Verify / QR स्कैन कर जांचें'
  };
};

export const getFestivalCertMatter = (lang: CertificateLanguage): FestivalGreetingText => {
  if (lang === 'en') {
    return {
      foundationName: FOUNDATION_INFO.nameEnglish,
      certNoLabel: 'Greeting ID',
      dateLabel: 'Issue Date',
      mainTitle: 'FESTIVAL GREETINGS & BLESSINGS',
      subTitle: 'OFFICIAL WISHES CERTIFICATE OF JEEVAN JYOTI FOUNDATION',
      presentedToText: 'Warmly and respectfully presented by Jeevan Jyoti Foundation Ghazipur to:',
      wishingIntro: 'On this auspicious and festive occasion, we pray for your prosperity, health, and endless joy.',
      blessingQuote: 'May this divine festival bring peace, light and happiness to you and your family.',
      verifiedTitle: 'Official Digital Verification',
      signatoryLabel: 'AUTHORISED SIGNATORY',
      signatoryName: 'Shailesh Pradhan',
      signatoryDesig: 'Manager & Secretary',
      qrInstruction: 'Scan to Verify Authenticity'
    };
  }

  if (lang === 'hi') {
    return {
      foundationName: FOUNDATION_INFO.nameHindi,
      certNoLabel: 'शुभकामना पत्र क्रमांक',
      dateLabel: 'जारी दिनांक',
      mainTitle: 'पावन पर्व शुभकामना एवं मंगलकामना पत्र',
      subTitle: 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुर की ओर से विशेष शुभकामना संदेश',
      presentedToText: 'जीवन ज्योति फाउंडेशन ग़ाज़ीपुर की ओर से सस्नेह एवं ससम्मान समर्पित:',
      wishingIntro: 'पावन पर्व के शुभ अवसर पर आपके एवं आपके सपरिवार के सुख, शांति, उत्तम स्वास्थ्य एवं समृद्धि की मंगलकामना करते हैं।',
      blessingQuote: 'ईश्वर आपको दीर्घायु एवं सदा निरोगी रखें तथा जीवन में नित्य नई ऊंचाइयों को प्रदान करें।',
      verifiedTitle: 'आधिकारिक डिजिटल सत्यापन',
      signatoryLabel: 'अधिकृत हस्ताक्षरकर्ता',
      signatoryName: 'शैलेश प्रधान',
      signatoryDesig: 'प्रबंधक एवं सचिव',
      qrInstruction: 'QR स्कैन कर सत्यता जांचें'
    };
  }

  // Bilingual
  return {
    foundationName: `${FOUNDATION_INFO.nameHindi} (${FOUNDATION_INFO.nameEnglish})`,
    certNoLabel: 'ID / क्रमांक',
    dateLabel: 'Date / दिनांक',
    mainTitle: 'पावन पर्व शुभकामना पत्र / FESTIVAL GREETING CERTIFICATE',
    subTitle: 'Auspicious Festive Greetings / मंगलमय शुभकामना संदेश',
    presentedToText: 'Presented with warm regards to / सस्नेह समर्पित:',
    wishingIntro: 'May this sacred festival bring prosperity, joy and good health / पर्व आपके जीवन में सुख व समृद्धि लाए',
    blessingQuote: 'Wishing you peace, harmony and success / आपके सुखद एवं समृद्ध जीवन की मंगलकामनाएं',
    verifiedTitle: 'Official Digital Verification / आधिकारिक डिजिटल सत्यापन',
    signatoryLabel: 'AUTHORISED SIGNATORY / अधिकृत हस्ताक्षरकर्ता',
    signatoryName: 'Shailesh Pradhan / शैलेश प्रधान',
    signatoryDesig: 'Manager & Secretary (प्रबंधक एवं सचिव)',
    qrInstruction: 'Scan QR to Verify / QR स्कैन कर जांचें'
  };
};
