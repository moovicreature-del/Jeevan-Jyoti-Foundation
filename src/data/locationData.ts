export interface LocationDataset {
  countries: Array<{ id: string; nameHindi: string; nameEnglish: string }>;
  states: Array<{ id: string; nameHindi: string; nameEnglish: string; countryId: string; type?: 'state' | 'ut' }>;
  districtsByState: Record<string, Array<{ id: string; nameHindi: string; nameEnglish: string }>>;
  blocksByDistrict: Record<string, Array<{ id: string; nameHindi: string; nameEnglish: string }>>;
  villagesByBlock: Record<string, Array<{ id: string; nameHindi: string; nameEnglish: string }>>;
}

export interface StructuredAddress {
  country: string;
  state: string;
  district: string;
  block: string;
  panchayatOrWardType?: 'panchayat' | 'ward';
  wardOrVillage: string;
  pincode?: string;
}

export const COUNTRIES = [
  { id: 'IN', nameHindi: 'भारत (India)', nameEnglish: 'India' },
  { id: 'NP', nameHindi: 'नेपाल (Nepal)', nameEnglish: 'Nepal' },
  { id: 'OTHER', nameHindi: 'अन्य देश (Other Country)', nameEnglish: 'Other Country' }
];

/**
 * All 28 States and 8 Union Territories of India (Total 36)
 */
export const INDIAN_STATES: Array<{ id: string; nameHindi: string; nameEnglish: string; type: 'state' | 'ut' }> = [
  // --- 28 States ---
  { id: 'UP', nameHindi: 'उत्तर प्रदेश (Uttar Pradesh)', nameEnglish: 'Uttar Pradesh', type: 'state' },
  { id: 'BR', nameHindi: 'बिहार (Bihar)', nameEnglish: 'Bihar', type: 'state' },
  { id: 'MP', nameHindi: 'मध्य प्रदेश (Madhya Pradesh)', nameEnglish: 'Madhya Pradesh', type: 'state' },
  { id: 'RJ', nameHindi: 'राजस्थान (Rajasthan)', nameEnglish: 'Rajasthan', type: 'state' },
  { id: 'MH', nameHindi: 'महाराष्ट्र (Maharashtra)', nameEnglish: 'Maharashtra', type: 'state' },
  { id: 'WB', nameHindi: 'पश्चिम बंगाल (West Bengal)', nameEnglish: 'West Bengal', type: 'state' },
  { id: 'GJ', nameHindi: 'गुजरात (Gujarat)', nameEnglish: 'Gujarat', type: 'state' },
  { id: 'HR', nameHindi: 'हरियाणा (Haryana)', nameEnglish: 'Haryana', type: 'state' },
  { id: 'PB', nameHindi: 'पंजाब (Punjab)', nameEnglish: 'Punjab', type: 'state' },
  { id: 'JH', nameHindi: 'झारखंड (Jharkhand)', nameEnglish: 'Jharkhand', type: 'state' },
  { id: 'CG', nameHindi: 'छत्तीसगढ़ (Chhattisgarh)', nameEnglish: 'Chhattisgarh', type: 'state' },
  { id: 'UK', nameHindi: 'उत्तराखंड (Uttarakhand)', nameEnglish: 'Uttarakhand', type: 'state' },
  { id: 'HP', nameHindi: 'हिमाचल प्रदेश (Himachal Pradesh)', nameEnglish: 'Himachal Pradesh', type: 'state' },
  { id: 'KA', nameHindi: 'कर्नाटक (Karnataka)', nameEnglish: 'Karnataka', type: 'state' },
  { id: 'TN', nameHindi: 'तमिलनाडु (Tamil Nadu)', nameEnglish: 'Tamil Nadu', type: 'state' },
  { id: 'AP', nameHindi: 'आंध्र प्रदेश (Andhra Pradesh)', nameEnglish: 'Andhra Pradesh', type: 'state' },
  { id: 'TS', nameHindi: 'तेलंगाना (Telangana)', nameEnglish: 'Telangana', type: 'state' },
  { id: 'KL', nameHindi: 'केरल (Kerala)', nameEnglish: 'Kerala', type: 'state' },
  { id: 'OD', nameHindi: 'ओडिशा (Odisha)', nameEnglish: 'Odisha', type: 'state' },
  { id: 'AS', nameHindi: 'असम (Assam)', nameEnglish: 'Assam', type: 'state' },
  { id: 'GA', nameHindi: 'गोवा (Goa)', nameEnglish: 'Goa', type: 'state' },
  { id: 'AR', nameHindi: 'अरुणाचल प्रदेश (Arunachal Pradesh)', nameEnglish: 'Arunachal Pradesh', type: 'state' },
  { id: 'MN', nameHindi: 'मणिपुर (Manipur)', nameEnglish: 'Manipur', type: 'state' },
  { id: 'ML', nameHindi: 'मेघालय (Meghalaya)', nameEnglish: 'Meghalaya', type: 'state' },
  { id: 'MZ', nameHindi: 'मिज़ोरम (Mizoram)', nameEnglish: 'Mizoram', type: 'state' },
  { id: 'NL', nameHindi: 'नागालैंड (Nagaland)', nameEnglish: 'Nagaland', type: 'state' },
  { id: 'SK', nameHindi: 'सिक्किम (Sikkim)', nameEnglish: 'Sikkim', type: 'state' },
  { id: 'TR', nameHindi: 'त्रिपुरा (Tripura)', nameEnglish: 'Tripura', type: 'state' },

  // --- 8 Union Territories ---
  { id: 'DL', nameHindi: 'दिल्ली (Delhi NCR - UT)', nameEnglish: 'Delhi', type: 'ut' },
  { id: 'JK', nameHindi: 'जम्मू और कश्मीर (Jammu & Kashmir - UT)', nameEnglish: 'Jammu and Kashmir', type: 'ut' },
  { id: 'LA', nameHindi: 'लद्दाख (Ladakh - UT)', nameEnglish: 'Ladakh', type: 'ut' },
  { id: 'CH', nameHindi: 'चंडीगढ़ (Chandigarh - UT)', nameEnglish: 'Chandigarh', type: 'ut' },
  { id: 'DNHDD', nameHindi: 'दादरा एवं नगर हवेली व दमन एवं दीव (Dadra & Nagar Haveli & Daman & Diu - UT)', nameEnglish: 'Dadra and Nagar Haveli and Daman and Diu', type: 'ut' },
  { id: 'AN', nameHindi: 'अंडमान और निकोबार द्वीप समूह (Andaman & Nicobar - UT)', nameEnglish: 'Andaman and Nicobar Islands', type: 'ut' },
  { id: 'LD', nameHindi: 'लक्षद्वीप (Lakshadweep - UT)', nameEnglish: 'Lakshadweep', type: 'ut' },
  { id: 'PY', nameHindi: 'पुडुचेरी (Puducherry - UT)', nameEnglish: 'Puducherry', type: 'ut' }
];

export const DISTRICTS_BY_STATE: Record<string, Array<{ id: string; nameHindi: string; nameEnglish: string }>> = {
  UP: [
    { id: 'GHAZIPUR', nameHindi: 'गाज़ीपुर (Ghazipur)', nameEnglish: 'Ghazipur' },
    { id: 'BALLIA', nameHindi: 'बलिया (Ballia)', nameEnglish: 'Ballia' },
    { id: 'MAU', nameHindi: 'मऊ (Mau)', nameEnglish: 'Mau' },
    { id: 'VARANASI', nameHindi: 'वाराणसी (Varanasi)', nameEnglish: 'Varanasi' },
    { id: 'CHANDAULI', nameHindi: 'चंदौली (Chandauli)', nameEnglish: 'Chandauli' },
    { id: 'AZAMGARH', nameHindi: 'आज़मगढ़ (Azamgarh)', nameEnglish: 'Azamgarh' },
    { id: 'JAUNPUR', nameHindi: 'जौनपुर (Jaunpur)', nameEnglish: 'Jaunpur' },
    { id: 'GORAKHPUR', nameHindi: 'गोरखपुर (Gorakhpur)', nameEnglish: 'Gorakhpur' },
    { id: 'DEORIA', nameHindi: 'देवरिया (Deoria)', nameEnglish: 'Deoria' },
    { id: 'MIRZAPUR', nameHindi: 'मिर्ज़ापुर (Mirzapur)', nameEnglish: 'Mirzapur' },
    { id: 'SONBHADRA', nameHindi: 'सोनभद्र (Sonbhadra)', nameEnglish: 'Sonbhadra' },
    { id: 'PRAYAGRAJ', nameHindi: 'प्रयागराज (Prayagraj)', nameEnglish: 'Prayagraj' },
    { id: 'LUCKNOW', nameHindi: 'लखनऊ (Lucknow)', nameEnglish: 'Lucknow' },
    { id: 'KANPUR', nameHindi: 'कानपुर नगर (Kanpur)', nameEnglish: 'Kanpur' },
    { id: 'AYODHYA', nameHindi: 'अयोध्या (Ayodhya)', nameEnglish: 'Ayodhya' },
    { id: 'NOIDA', nameHindi: 'गौतम बुद्ध नगर (Noida/GB Nagar)', nameEnglish: 'Gautam Buddha Nagar' },
    { id: 'GHAZIABAD', nameHindi: 'गाज़ियाबाद (Ghaziabad)', nameEnglish: 'Ghaziabad' },
    { id: 'MEERUT', nameHindi: 'मेरठ (Meerut)', nameEnglish: 'Meerut' },
    { id: 'AGRA', nameHindi: 'आगरा (Agra)', nameEnglish: 'Agra' },
    { id: 'ALIGARH', nameHindi: 'अलीगढ़ (Aligarh)', nameEnglish: 'Aligarh' },
    { id: 'BAREILLY', nameHindi: 'बरेली (Bareilly)', nameEnglish: 'Bareilly' },
    { id: 'MORADABAD', nameHindi: 'मुरादाबाद (Moradabad)', nameEnglish: 'Moradabad' },
    { id: 'SAHARANPUR', nameHindi: 'सहारनपुर (Saharanpur)', nameEnglish: 'Saharanpur' },
    { id: 'JHANSI', nameHindi: 'झांसी (Jhansi)', nameEnglish: 'Jhansi' },
    { id: 'MATHURA', nameHindi: 'मथुरा (Mathura)', nameEnglish: 'Mathura' },
    { id: 'KUSHINAGAR', nameHindi: 'कुशीनगर (Kushinagar)', nameEnglish: 'Kushinagar' },
    { id: 'MAHARAJGANJ', nameHindi: 'महराजगंज (Maharajganj)', nameEnglish: 'Maharajganj' },
    { id: 'BASTI', nameHindi: 'बस्ती (Basti)', nameEnglish: 'Basti' },
    { id: 'SANT_KABIR_NAGAR', nameHindi: 'संत कबीर नगर (Sant Kabir Nagar)', nameEnglish: 'Sant Kabir Nagar' },
    { id: 'SIDDHARTHNAGAR', nameHindi: 'सिद्धार्थनगर (Siddharthnagar)', nameEnglish: 'Siddharthnagar' },
    { id: 'BHADOHI', nameHindi: 'भदोही (Bhadohi)', nameEnglish: 'Bhadohi' },
    { id: 'SULTANPUR', nameHindi: 'सुल्तानपुर (Sultanpur)', nameEnglish: 'Sultanpur' },
    { id: 'AMETHI', nameHindi: 'अमेठी (Amethi)', nameEnglish: 'Amethi' },
    { id: 'PRATAPGARH', nameHindi: 'प्रतापगढ़ (Pratapgarh)', nameEnglish: 'Pratapgarh' },
    { id: 'KAUSHAMBI', nameHindi: 'कौशाम्बी (Kaushambi)', nameEnglish: 'Kaushambi' },
    { id: 'FATEHPUR', nameHindi: 'फतेहपुर (Fatehpur)', nameEnglish: 'Fatehpur' },
    { id: 'UNNAO', nameHindi: 'उन्नाव (Unnao)', nameEnglish: 'Unnao' },
    { id: 'RAEBARELI', nameHindi: 'रायबरेली (Raebareli)', nameEnglish: 'Raebareli' },
    { id: 'BARABANKI', nameHindi: 'बाराबंकी (Barabanki)', nameEnglish: 'Barabanki' },
    { id: 'GONDA', nameHindi: 'गोंडा (Gonda)', nameEnglish: 'Gonda' },
    { id: 'BAHRAICH', nameHindi: 'बहराइच (Bahraich)', nameEnglish: 'Bahraich' },
    { id: 'SHRAVASTI', nameHindi: 'श्रावस्ती (Shravasti)', nameEnglish: 'Shravasti' },
    { id: 'BALRAMPUR', nameHindi: 'बलरामपुर (Balrampur)', nameEnglish: 'Balrampur' }
  ],
  BR: [
    { id: 'PATNA', nameHindi: 'पटना (Patna)', nameEnglish: 'Patna' },
    { id: 'BUXAR', nameHindi: 'बक्सर (Buxar)', nameEnglish: 'Buxar' },
    { id: 'KAIMUR', nameHindi: 'कैमूर / भभुआ (Kaimur)', nameEnglish: 'Kaimur' },
    { id: 'ROHTAS', nameHindi: 'रोहतास / सासाराम (Rohtas)', nameEnglish: 'Rohtas' },
    { id: 'BHOJPUR', nameHindi: 'भोजपुर / आरा (Bhojpur/Ara)', nameEnglish: 'Bhojpur' },
    { id: 'SARAN', nameHindi: 'सारण / छपरा (Saran/Chhapra)', nameEnglish: 'Saran' },
    { id: 'SIWAN', nameHindi: 'सीवान (Siwan)', nameEnglish: 'Siwan' },
    { id: 'GOPALGANJ', nameHindi: 'गोपालगंज (Gopalganj)', nameEnglish: 'Gopalganj' },
    { id: 'GAYA', nameHindi: 'गया (Gaya)', nameEnglish: 'Gaya' },
    { id: 'MUZAFFARPUR', nameHindi: 'मुजफ्फरपुर (Muzaffarpur)', nameEnglish: 'Muzaffarpur' },
    { id: 'BHAGALPUR', nameHindi: 'भागलपुर (Bhagalpur)', nameEnglish: 'Bhagalpur' },
    { id: 'DARBHANGA', nameHindi: 'दरभंगा (Darbhanga)', nameEnglish: 'Darbhanga' },
    { id: 'PURNEA', nameHindi: 'पूर्णिया (Purnea)', nameEnglish: 'Purnea' },
    { id: 'BEGUSARAI', nameHindi: 'बेगूसराय (Begusarai)', nameEnglish: 'Begusarai' },
    { id: 'NALANDA', nameHindi: 'नालंदा (Nalanda)', nameEnglish: 'Nalanda' },
    { id: 'AURANGABAD_BR', nameHindi: 'औरंगाबाद (Aurangabad)', nameEnglish: 'Aurangabad' },
    { id: 'VAISHALI', nameHindi: 'वैशाली (Vaishali)', nameEnglish: 'Vaishali' },
    { id: 'SAMASTIPUR', nameHindi: 'समस्तीपुर (Samastipur)', nameEnglish: 'Samastipur' },
    { id: 'MADHUBANI', nameHindi: 'मधुबनी (Madhubani)', nameEnglish: 'Madhubani' },
    { id: 'KATIHAR', nameHindi: 'कटिहार (Katihar)', nameEnglish: 'Katihar' },
    { id: 'MUNGER', nameHindi: 'मुंगेर (Munger)', nameEnglish: 'Munger' }
  ],
  MP: [
    { id: 'BHOPAL', nameHindi: 'भोपाल (Bhopal)', nameEnglish: 'Bhopal' },
    { id: 'INDORE', nameHindi: 'इंदौर (Indore)', nameEnglish: 'Indore' },
    { id: 'JABALPUR', nameHindi: 'जबलपुर (Jabalpur)', nameEnglish: 'Jabalpur' },
    { id: 'GWALIOR', nameHindi: 'ग्वालियर (Gwalior)', nameEnglish: 'Gwalior' },
    { id: 'UJJAIN', nameHindi: 'उज्जैन (Ujjain)', nameEnglish: 'Ujjain' },
    { id: 'REWA', nameHindi: 'रीवा (Rewa)', nameEnglish: 'Rewa' },
    { id: 'SATNA', nameHindi: 'सतना (Satna)', nameEnglish: 'Satna' },
    { id: 'SINGRAULI', nameHindi: 'सिंगरौली (Singrauli)', nameEnglish: 'Singrauli' },
    { id: 'SAGAR', nameHindi: 'सागर (Sagar)', nameEnglish: 'Sagar' },
    { id: 'DEWAS', nameHindi: 'देवास (Dewas)', nameEnglish: 'Dewas' },
    { id: 'KATNI', nameHindi: 'कटनी (Katni)', nameEnglish: 'Katni' },
    { id: 'CHHINDWARA', nameHindi: 'छिंदवाड़ा (Chhindwara)', nameEnglish: 'Chhindwara' }
  ],
  RJ: [
    { id: 'JAIPUR', nameHindi: 'जयपुर (Jaipur)', nameEnglish: 'Jaipur' },
    { id: 'JODHPUR', nameHindi: 'जोधपुर (Jodhpur)', nameEnglish: 'Jodhpur' },
    { id: 'UDAIPUR', nameHindi: 'उदयपुर (Udaipur)', nameEnglish: 'Udaipur' },
    { id: 'KOTA', nameHindi: 'कोटा (Kota)', nameEnglish: 'Kota' },
    { id: 'BIKANER', nameHindi: 'बीकानेर (Bikaner)', nameEnglish: 'Bikaner' },
    { id: 'AJMER', nameHindi: 'अजमेर (Ajmer)', nameEnglish: 'Ajmer' },
    { id: 'BHILWARA', nameHindi: 'भीलवाड़ा (Bhilwara)', nameEnglish: 'Bhilwara' },
    { id: 'ALWAR', nameHindi: 'अलवर (Alwar)', nameEnglish: 'Alwar' },
    { id: 'SIKAR', nameHindi: 'सीकर (Sikar)', nameEnglish: 'Sikar' },
    { id: 'BHARATPUR', nameHindi: 'भरतपुर (Bharatpur)', nameEnglish: 'Bharatpur' }
  ],
  MH: [
    { id: 'MUMBAI', nameHindi: 'मुंबई (Mumbai)', nameEnglish: 'Mumbai' },
    { id: 'MUMBAI_SUBURBAN', nameHindi: 'मुंबई उपनगर (Mumbai Suburban)', nameEnglish: 'Mumbai Suburban' },
    { id: 'PUNE', nameHindi: 'पुणे (Pune)', nameEnglish: 'Pune' },
    { id: 'NAGPUR', nameHindi: 'नागपुर (Nagpur)', nameEnglish: 'Nagpur' },
    { id: 'THANE', nameHindi: 'ठाणे (Thane)', nameEnglish: 'Thane' },
    { id: 'NASHIK', nameHindi: 'नाशिक (Nashik)', nameEnglish: 'Nashik' },
    { id: 'CHHATRAPATI_SAMBHAJINAGAR', nameHindi: 'छत्रपति संभाजीनगर / औरंगाबाद', nameEnglish: 'Chhatrapati Sambhajinagar' },
    { id: 'SOLAPUR', nameHindi: 'सोलापुर (Solapur)', nameEnglish: 'Solapur' },
    { id: 'KOLHAPUR', nameHindi: 'कोल्हापुर (Kolhapur)', nameEnglish: 'Kolhapur' },
    { id: 'NAVI_MUMBAI', nameHindi: 'नवी मुंबई (Navi Mumbai)', nameEnglish: 'Navi Mumbai' }
  ],
  WB: [
    { id: 'KOLKATA', nameHindi: 'कोलकाता (Kolkata)', nameEnglish: 'Kolkata' },
    { id: 'HOWRAH', nameHindi: 'हावड़ा (Howrah)', nameEnglish: 'Howrah' },
    { id: 'NORTH_24_PARGANAS', nameHindi: 'उत्तर 24 परगना (North 24 Parganas)', nameEnglish: 'North 24 Parganas' },
    { id: 'SOUTH_24_PARGANAS', nameHindi: 'दक्षिण 24 परगना (South 24 Parganas)', nameEnglish: 'South 24 Parganas' },
    { id: 'DARJEELING', nameHindi: 'दार्जिलिंग (Darjeeling)', nameEnglish: 'Darjeeling' },
    { id: 'SILIGURI', nameHindi: 'सिलीगुड़ी (Siliguri)', nameEnglish: 'Siliguri' },
    { id: 'ASANSOL_PASCHIM_BARDHAMAN', nameHindi: 'पश्चिम बर्धमान (Asansol/Durgapur)', nameEnglish: 'Paschim Bardhaman' }
  ],
  GJ: [
    { id: 'AHMEDABAD', nameHindi: 'अहमदाबाद (Ahmedabad)', nameEnglish: 'Ahmedabad' },
    { id: 'SURAT', nameHindi: 'सूरत (Surat)', nameEnglish: 'Surat' },
    { id: 'VADODARA', nameHindi: 'वडोदरा (Vadodara)', nameEnglish: 'Vadodara' },
    { id: 'RAJKOT', nameHindi: 'राजकोट (Rajkot)', nameEnglish: 'Rajkot' },
    { id: 'GANDHINAGAR', nameHindi: 'गांधीनगर (Gandhinagar)', nameEnglish: 'Gandhinagar' },
    { id: 'BHAVNAGAR', nameHindi: 'भावनगर (Bhavnagar)', nameEnglish: 'Bhavnagar' },
    { id: 'JAMNAGAR', nameHindi: 'जामनगर (Jamnagar)', nameEnglish: 'Jamnagar' }
  ],
  HR: [
    { id: 'GURUGRAM', nameHindi: 'गुरुग्राम (Gurugram)', nameEnglish: 'Gurugram' },
    { id: 'FARIDABAD', nameHindi: 'फरीदाबाद (Faridabad)', nameEnglish: 'Faridabad' },
    { id: 'PANIPAT', nameHindi: 'पानीपत (Panipat)', nameEnglish: 'Panipat' },
    { id: 'AMBALA', nameHindi: 'अंबाला (Ambala)', nameEnglish: 'Ambala' },
    { id: 'KARNAL', nameHindi: 'करनाल (Karnal)', nameEnglish: 'Karnal' },
    { id: 'ROHTAK', nameHindi: 'रोहतक (Rohtak)', nameEnglish: 'Rohtak' },
    { id: 'HISAR', nameHindi: 'हिसार (Hisar)', nameEnglish: 'Hisar' },
    { id: 'SONIPAT', nameHindi: 'सोनीपत (Sonipat)', nameEnglish: 'Sonipat' },
    { id: 'PANCHKULA', nameHindi: 'पंचकुला (Panchkula)', nameEnglish: 'Panchkula' }
  ],
  PB: [
    { id: 'LUDHIANA', nameHindi: 'लुधियाना (Ludhiana)', nameEnglish: 'Ludhiana' },
    { id: 'AMRITSAR', nameHindi: 'अमृतसर (Amritsar)', nameEnglish: 'Amritsar' },
    { id: 'JALANDHAR', nameHindi: 'जालंधर (Jalandhar)', nameEnglish: 'Jalandhar' },
    { id: 'PATIALA', nameHindi: 'पटियाला (Patiala)', nameEnglish: 'Patiala' },
    { id: 'BATHINDA', nameHindi: 'बठिंडा (Bathinda)', nameEnglish: 'Bathinda' },
    { id: 'MOHALI', nameHindi: 'मोहाली / SAS नगर (Mohali)', nameEnglish: 'SAS Nagar Mohali' }
  ],
  JH: [
    { id: 'RANCHI', nameHindi: 'रांची (Ranchi)', nameEnglish: 'Ranchi' },
    { id: 'JAMSHEDPUR', nameHindi: 'जमशेदपुर / पूर्वी सिंहभूम', nameEnglish: 'East Singhbhum' },
    { id: 'DHANBAD', nameHindi: 'धनबाद (Dhanbad)', nameEnglish: 'Dhanbad' },
    { id: 'BOKARO', nameHindi: 'बोकारो (Bokaro)', nameEnglish: 'Bokaro' },
    { id: 'HAZARIBAGH', nameHindi: 'हजारीबाग (Hazaribagh)', nameEnglish: 'Hazaribagh' },
    { id: 'DEOGHAR', nameHindi: 'देवघर (Deoghar)', nameEnglish: 'Deoghar' },
    { id: 'GIRIDIH', nameHindi: 'गिरिडीह (Giridih)', nameEnglish: 'Giridih' }
  ],
  CG: [
    { id: 'RAIPUR', nameHindi: 'रायपुर (Raipur)', nameEnglish: 'Raipur' },
    { id: 'BHILAI_DURG', nameHindi: 'दुर्ग / भिलाई (Durg)', nameEnglish: 'Durg' },
    { id: 'BILASPUR', nameHindi: 'बिलासपुर (Bilaspur)', nameEnglish: 'Bilaspur' },
    { id: 'KORBA', nameHindi: 'कोरबा (Korba)', nameEnglish: 'Korba' },
    { id: 'RAJNANDGAON', nameHindi: 'राजनंदगांव (Rajnandgaon)', nameEnglish: 'Rajnandgaon' },
    { id: 'JAGDALPUR', nameHindi: 'बस्तर / जगदलपुर (Bastar)', nameEnglish: 'Bastar' }
  ],
  UK: [
    { id: 'DEHRADUN', nameHindi: 'देहरादून (Dehradun)', nameEnglish: 'Dehradun' },
    { id: 'HARIDWAR', nameHindi: 'हरिद्वार (Haridwar)', nameEnglish: 'Haridwar' },
    { id: 'NAINITAL', nameHindi: 'नैनीताल / हल्द्वानी (Nainital)', nameEnglish: 'Nainital' },
    { id: 'UDHAM_SINGH_NAGAR', nameHindi: 'उधम सिंह नगर / रुद्रपुर', nameEnglish: 'Udham Singh Nagar' },
    { id: 'RISHIKESH', nameHindi: 'ऋषिकेश (Rishikesh)', nameEnglish: 'Rishikesh' },
    { id: 'ALMORA', nameHindi: 'अल्मोड़ा (Almora)', nameEnglish: 'Almora' },
    { id: 'PAURI_GARHWAL', nameHindi: 'पौड़ी गढ़वाल (Pauri Garhwal)', nameEnglish: 'Pauri Garhwal' }
  ],
  HP: [
    { id: 'SHIMLA', nameHindi: 'शिमला (Shimla)', nameEnglish: 'Shimla' },
    { id: 'KANGRA_DHARAMSHALA', nameHindi: 'कांगड़ा / धर्मशाला (Kangra)', nameEnglish: 'Kangra' },
    { id: 'MANDI', nameHindi: 'मंडी (Mandi)', nameEnglish: 'Mandi' },
    { id: 'SOLAN', nameHindi: 'सोलन (Solan)', nameEnglish: 'Solan' },
    { id: 'KULLU_MANALI', nameHindi: 'कुल्लू / मनाली (Kullu)', nameEnglish: 'Kullu' }
  ],
  KA: [
    { id: 'BENGALURU_URBAN', nameHindi: 'बेंगलुरु शहरी (Bengaluru Urban)', nameEnglish: 'Bengaluru Urban' },
    { id: 'MYSURU', nameHindi: 'मैसूर (Mysuru)', nameEnglish: 'Mysuru' },
    { id: 'MANGALURU', nameHindi: 'मंगलुरु / दक्षिण कन्नड़ (Mangaluru)', nameEnglish: 'Dakshina Kannada' },
    { id: 'HUBBALLI_DHARWAD', nameHindi: 'हुबली-धारवाड़ (Hubballi-Dharwad)', nameEnglish: 'Dharwad' },
    { id: 'BELAGAVI', nameHindi: 'बेलगावी (Belagavi)', nameEnglish: 'Belagavi' }
  ],
  TN: [
    { id: 'CHENNAI', nameHindi: 'चेन्नई (Chennai)', nameEnglish: 'Chennai' },
    { id: 'COIMBATORE', nameHindi: 'कोयंबटूर (Coimbatore)', nameEnglish: 'Coimbatore' },
    { id: 'MADURAI', nameHindi: 'मदुरै (Madurai)', nameEnglish: 'Madurai' },
    { id: 'TIRUCHIRAPPALLI', nameHindi: 'तिरुचिरापल्ली (Tiruchirappalli)', nameEnglish: 'Tiruchirappalli' },
    { id: 'SALEM', nameHindi: 'सलेम (Salem)', nameEnglish: 'Salem' }
  ],
  AP: [
    { id: 'VISAKHAPATNAM', nameHindi: 'विशाखापट्टनम (Visakhapatnam)', nameEnglish: 'Visakhapatnam' },
    { id: 'VIJAYAWADA', nameHindi: 'विजयवाड़ा / एनटीआर (Vijayawada)', nameEnglish: 'NTR' },
    { id: 'GUNTUR', nameHindi: 'गुंटूर (Guntur)', nameEnglish: 'Guntur' },
    { id: 'TIRUPATI', nameHindi: 'तिरुपति (Tirupati)', nameEnglish: 'Tirupati' },
    { id: 'KURNOOL', nameHindi: 'कर्नूल (Kurnool)', nameEnglish: 'Kurnool' }
  ],
  TS: [
    { id: 'HYDERABAD', nameHindi: 'हैदराबाद (Hyderabad)', nameEnglish: 'Hyderabad' },
    { id: 'WARANGAL', nameHindi: 'वारंगल (Warangal)', nameEnglish: 'Warangal' },
    { id: 'RANGAREDDY', nameHindi: 'रंगारेड्डी (Rangareddy)', nameEnglish: 'Rangareddy' },
    { id: 'MEDCHAL_MALKAJGIRI', nameHindi: 'मेडचल-मलकाजगिरी (Medchal-Malkajgiri)', nameEnglish: 'Medchal-Malkajgiri' },
    { id: 'NIZAMABAD', nameHindi: 'निजामाबाद (Nizamabad)', nameEnglish: 'Nizamabad' }
  ],
  KL: [
    { id: 'THIRUVANANTHAPURAM', nameHindi: 'तिरुवनंतपुरम (Thiruvananthapuram)', nameEnglish: 'Thiruvananthapuram' },
    { id: 'KOCHI_ERNAKULAM', nameHindi: 'कोच्चि / एर्नाकुलम (Kochi/Ernakulam)', nameEnglish: 'Ernakulam' },
    { id: 'KOZHIKODE', nameHindi: 'कोझिकोड (Kozhikode)', nameEnglish: 'Kozhikode' },
    { id: 'THRISSUR', nameHindi: 'त्रिशूर (Thrissur)', nameEnglish: 'Thrissur' }
  ],
  OD: [
    { id: 'BHUBANESWAR_KHORDHA', nameHindi: 'भुवनेश्वर / खोरधा (Bhubaneswar)', nameEnglish: 'Khordha' },
    { id: 'CUTTACK', nameHindi: 'कटक (Cuttack)', nameEnglish: 'Cuttack' },
    { id: 'ROURKELA_SUNDARGARH', nameHindi: 'राउरकेला / सुंदरगढ़ (Rourkela)', nameEnglish: 'Sundargarh' },
    { id: 'PURI', nameHindi: 'पुरी (Puri)', nameEnglish: 'Puri' },
    { id: 'BALASORE', nameHindi: 'बालेश्वर (Balasore)', nameEnglish: 'Balasore' }
  ],
  AS: [
    { id: 'GUWAHATI_KAMRUP', nameHindi: 'गुवाहाटी / कामरूप मेट्रो (Guwahati)', nameEnglish: 'Kamrup Metropolitan' },
    { id: 'DIBRUGARH', nameHindi: 'डिब्रूगढ़ (Dibrugarh)', nameEnglish: 'Dibrugarh' },
    { id: 'SILCHAR_CACHAR', nameHindi: 'सिलचर / कछार (Silchar)', nameEnglish: 'Cachar' },
    { id: 'JORHAT', nameHindi: 'जोरहाट (Jorhat)', nameEnglish: 'Jorhat' }
  ],
  GA: [
    { id: 'NORTH_GOA', nameHindi: 'उत्तर गोवा / पणजी (North Goa)', nameEnglish: 'North Goa' },
    { id: 'SOUTH_GOA', nameHindi: 'दक्षिण गोवा / मडगांव (South Goa)', nameEnglish: 'South Goa' }
  ],
  AR: [
    { id: 'ITANAGAR_PAPUM_PARE', nameHindi: 'ईटानगर / पापुम पारे (Itanagar)', nameEnglish: 'Papum Pare' },
    { id: 'TAWANG', nameHindi: 'तवांग (Tawang)', nameEnglish: 'Tawang' },
    { id: 'PASIGHAT_EAST_SIANG', nameHindi: 'पासीघाट / पूर्वी सियांग', nameEnglish: 'East Siang' }
  ],
  MN: [
    { id: 'IMPHAL_WEST', nameHindi: 'इम्फाल पश्चिम (Imphal West)', nameEnglish: 'Imphal West' },
    { id: 'IMPHAL_EAST', nameHindi: 'इम्फाल पूर्व (Imphal East)', nameEnglish: 'Imphal East' },
    { id: 'CHURACHANDPUR', nameHindi: 'चुराचांदपुर (Churachandpur)', nameEnglish: 'Churachandpur' }
  ],
  ML: [
    { id: 'SHILLONG_EAST_KHASI', nameHindi: 'शिलांग / पूर्वी खासी हिल्स', nameEnglish: 'East Khasi Hills' },
    { id: 'WEST_GARO_HILLS', nameHindi: 'तुरा / पश्चिमी गारो हिल्स', nameEnglish: 'West Garo Hills' }
  ],
  MZ: [
    { id: 'AIZAWL', nameHindi: 'आइजोल (Aizawl)', nameEnglish: 'Aizawl' },
    { id: 'LUNGLEI', nameHindi: 'लुंगलेई (Lunglei)', nameEnglish: 'Lunglei' }
  ],
  NL: [
    { id: 'KOHIMA', nameHindi: 'कोहिमा (Kohima)', nameEnglish: 'Kohima' },
    { id: 'DIMAPUR', nameHindi: 'दीमापुर (Dimapur)', nameEnglish: 'Dimapur' }
  ],
  SK: [
    { id: 'GANGTOK', nameHindi: 'गंगटोक (Gangtok)', nameEnglish: 'Gangtok' },
    { id: 'NAMCHI', nameHindi: 'नामची (Namchi)', nameEnglish: 'Namchi' }
  ],
  TR: [
    { id: 'AGARTALA_WEST_TRIPURA', nameHindi: 'अगरतला / पश्चिम त्रिपुरा', nameEnglish: 'West Tripura' },
    { id: 'GOMATI_UDAIPUR', nameHindi: 'गोमती / उदयपुर (Gomati)', nameEnglish: 'Gomati' }
  ],

  // --- 8 Union Territories ---
  DL: [
    { id: 'NEW_DELHI', nameHindi: 'नई दिल्ली (New Delhi)', nameEnglish: 'New Delhi' },
    { id: 'SOUTH_DELHI', nameHindi: 'दक्षिणी दिल्ली (South Delhi)', nameEnglish: 'South Delhi' },
    { id: 'EAST_DELHI', nameHindi: 'पूर्वी दिल्ली (East Delhi)', nameEnglish: 'East Delhi' },
    { id: 'NORTH_DELHI', nameHindi: 'उत्तरी दिल्ली (North Delhi)', nameEnglish: 'North Delhi' },
    { id: 'WEST_DELHI', nameHindi: 'पश्चिमी दिल्ली (West Delhi)', nameEnglish: 'West Delhi' },
    { id: 'CENTRAL_DELHI', nameHindi: 'मध्य दिल्ली (Central Delhi)', nameEnglish: 'Central Delhi' },
    { id: 'SOUTH_WEST_DELHI', nameHindi: 'दक्षिण पश्चिम दिल्ली (South West Delhi)', nameEnglish: 'South West Delhi' },
    { id: 'NORTH_WEST_DELHI', nameHindi: 'उत्तर पश्चिम दिल्ली (North West Delhi)', nameEnglish: 'North West Delhi' },
    { id: 'NORTH_EAST_DELHI', nameHindi: 'उत्तर पूर्व दिल्ली (North East Delhi)', nameEnglish: 'North East Delhi' },
    { id: 'SHAHDARA', nameHindi: 'शाहदरा (Shahdara)', nameEnglish: 'Shahdara' }
  ],
  JK: [
    { id: 'SRINAGAR', nameHindi: 'श्रीनगर (Srinagar)', nameEnglish: 'Srinagar' },
    { id: 'JAMMU', nameHindi: 'जम्मू (Jammu)', nameEnglish: 'Jammu' },
    { id: 'ANANTNAG', nameHindi: 'अनंतनाग (Anantnag)', nameEnglish: 'Anantnag' },
    { id: 'BARAMULLA', nameHindi: 'बारामूला (Baramulla)', nameEnglish: 'Baramulla' },
    { id: 'UDHAMPUR', nameHindi: 'उधमपुर (Udhampur)', nameEnglish: 'Udhampur' },
    { id: 'KATHUA', nameHindi: 'कठुआ (Kathua)', nameEnglish: 'Kathua' }
  ],
  LA: [
    { id: 'LEH', nameHindi: 'लेह (Leh)', nameEnglish: 'Leh' },
    { id: 'KARGIL', nameHindi: 'कारगिल (Kargil)', nameEnglish: 'Kargil' }
  ],
  CH: [
    { id: 'CHANDIGARH_CITY', nameHindi: 'चंडीगढ़ नगर (Chandigarh)', nameEnglish: 'Chandigarh' }
  ],
  DNHDD: [
    { id: 'DAMAN', nameHindi: 'दमन (Daman)', nameEnglish: 'Daman' },
    { id: 'DIU', nameHindi: 'दीव (Diu)', nameEnglish: 'Diu' },
    { id: 'SILVASSA', nameHindi: 'सिलवासा / दादरा नगर हवेली', nameEnglish: 'Dadra and Nagar Haveli' }
  ],
  AN: [
    { id: 'PORT_BLAIR_SOUTH_ANDAMAN', nameHindi: 'पोर्ट ब्लेयर / दक्षिण अंडमान', nameEnglish: 'South Andaman' },
    { id: 'NORTH_MIDDLE_ANDAMAN', nameHindi: 'उत्तर व मध्य अंडमान', nameEnglish: 'North and Middle Andaman' },
    { id: 'NICOBAR', nameHindi: 'निकोबार (Nicobar)', nameEnglish: 'Nicobar' }
  ],
  LD: [
    { id: 'KAVARATTI', nameHindi: 'कवरत्ती (Kavaratti)', nameEnglish: 'Kavaratti' },
    { id: 'AGATTI', nameHindi: 'अगत्ती (Agatti)', nameEnglish: 'Agatti' },
    { id: 'ANDROTT', nameHindi: 'अंद्रोत (Andrott)', nameEnglish: 'Andrott' }
  ],
  PY: [
    { id: 'PUDUCHERRY_CITY', nameHindi: 'पुडुचेरी शहर (Puducherry)', nameEnglish: 'Puducherry' },
    { id: 'KARAIKAL', nameHindi: 'कराईकल (Karaikal)', nameEnglish: 'Karaikal' },
    { id: 'MAHE', nameHindi: 'माहे (Mahe)', nameEnglish: 'Mahe' },
    { id: 'YANAM', nameHindi: 'यानम (Yanam)', nameEnglish: 'Yanam' }
  ]
};

// Backwards compatibility map of stateName -> districtNames[]
export const INDIAN_STATES_DISTRICTS: Record<string, string[]> = Object.fromEntries(
  INDIAN_STATES.map((s) => {
    const distList = DISTRICTS_BY_STATE[s.id] || [];
    return [s.nameHindi, distList.map((d) => d.nameHindi)];
  })
);

export const BLOCKS_BY_DISTRICT: Record<string, Array<{ id: string; nameHindi: string; nameEnglish: string }>> = {
  GHAZIPUR: [
    { id: 'MOHAMMADABAD', nameHindi: 'मोहम्मदाबाद (Mohammadabad)', nameEnglish: 'Mohammadabad' },
    { id: 'GHAZIPUR_SADAR', nameHindi: 'गाज़ीपुर सदर (Ghazipur Sadar)', nameEnglish: 'Ghazipur Sadar' },
    { id: 'ZAMANIA', nameHindi: 'जमानिया (Zamania)', nameEnglish: 'Zamania' },
    { id: 'SAIDPUR', nameHindi: 'सैदपुर (Saidpur)', nameEnglish: 'Saidpur' },
    { id: 'JAKHANIAN', nameHindi: 'जखनियां (Jakhanian)', nameEnglish: 'Jakhanian' },
    { id: 'KASIMABAD', nameHindi: 'कासिमाबाद (Kasimabad)', nameEnglish: 'Kasimabad' },
    { id: 'MARDAH', nameHindi: 'मरदह (Mardah)', nameEnglish: 'Mardah' },
    { id: 'DEOKALI', nameHindi: 'देवकली (Deokali)', nameEnglish: 'Deokali' },
    { id: 'KARANDA', nameHindi: 'करंडा (Karanda)', nameEnglish: 'Karanda' },
    { id: 'MANIHARI', nameHindi: 'मनिहारी (Manihari)', nameEnglish: 'Manihari' },
    { id: 'BIRNO', nameHindi: 'बिरनो (Birno)', nameEnglish: 'Birno' },
    { id: 'BHADAURA', nameHindi: 'भदौरा (Bhadaura)', nameEnglish: 'Bhadaura' },
    { id: 'REOTIPUR', nameHindi: 'रेवतीपुर (Reotipur)', nameEnglish: 'Reotipur' },
    { id: 'BARACHAWAR', nameHindi: 'बाराचवर (Barachawar)', nameEnglish: 'Barachawar' },
    { id: 'VARACHAK', nameHindi: 'भांवरकोल (Bhanwarkol)', nameEnglish: 'Bhanwarkol' },
    { id: 'SADAR_CITY', nameHindi: 'गाज़ीपुर नगर क्षेत्र (Ghazipur City)', nameEnglish: 'Ghazipur City' }
  ],
  BALLIA: [
    { id: 'BALLIA_SADAR', nameHindi: 'बलिया सदर (Ballia Sadar)', nameEnglish: 'Ballia Sadar' },
    { id: 'RASRA', nameHindi: 'रसड़ा (Rasra)', nameEnglish: 'Rasra' },
    { id: 'BAIRIA', nameHindi: 'बैरिया (Bairia)', nameEnglish: 'Bairia' },
    { id: 'SIKANDERPUR', nameHindi: 'सिकंदरपुर (Sikanderpur)', nameEnglish: 'Sikanderpur' },
    { id: 'BANSDEEH', nameHindi: 'बांसडीह (Bansdeeh)', nameEnglish: 'Bansdeeh' },
    { id: 'BELHARI', nameHindi: 'बेलहरी (Belhari)', nameEnglish: 'Belhari' },
    { id: 'CHILKAHAR', nameHindi: 'चिल्कहर (Chilkahar)', nameEnglish: 'Chilkahar' },
    { id: 'GARWAR', nameHindi: 'गड़वार (Garwar)', nameEnglish: 'Garwar' },
    { id: 'HANUMANGANJ', nameHindi: 'हनुमानगंज (Hanumanganj)', nameEnglish: 'Hanumanganj' },
    { id: 'DUBHAR', nameHindi: 'दुबहड़ (Dubhar)', nameEnglish: 'Dubhar' }
  ],
  MAU: [
    { id: 'MAU_NATH_BHANJAN', nameHindi: 'मऊ सदर (Mau Nath Bhanjan)', nameEnglish: 'Mau Sadar' },
    { id: 'MUHAMMADABAD_GOHNA', nameHindi: 'मुहम्मदाबाद गोहना (Muhammadabad Gohna)', nameEnglish: 'Muhammadabad Gohna' },
    { id: 'GHOSI', nameHindi: 'घोसी (Ghosi)', nameEnglish: 'Ghosi' },
    { id: 'MADHUBAN', nameHindi: 'मधुबन (Madhuban)', nameEnglish: 'Madhuban' },
    { id: 'KOPAGANJ', nameHindi: 'कोपागंज (Kopaganj)', nameEnglish: 'Kopaganj' },
    { id: 'DOHRIGHAT', nameHindi: 'दोहरीघाट (Dohrighat)', nameEnglish: 'Dohrighat' }
  ],
  VARANASI: [
    { id: 'KASHI_CITY', nameHindi: 'वाराणसी नगर (Varanasi City)', nameEnglish: 'Varanasi City' },
    { id: 'KASHI_VIDYAPEETH', nameHindi: 'काशी विद्यापीठ (Kashi Vidyapeeth)', nameEnglish: 'Kashi Vidyapeeth' },
    { id: 'PINDRRA', nameHindi: 'पिंडरा (Pindra)', nameEnglish: 'Pindra' },
    { id: 'HARAHUA', nameHindi: 'हरहुआ (Harahua)', nameEnglish: 'Harahua' },
    { id: 'CHOLAPUR', nameHindi: 'चोलापुर (Cholapur)', nameEnglish: 'Cholapur' },
    { id: 'SEVAPURI', nameHindi: 'सेवापुरी (Sevapuri)', nameEnglish: 'Sevapuri' },
    { id: 'ARAZILINE', nameHindi: 'आराजीलाइन (Araziline)', nameEnglish: 'Araziline' },
    { id: 'BARAGAON', nameHindi: 'बड़ागांव (Baragaon)', nameEnglish: 'Baragaon' }
  ],
  CHANDAULI: [
    { id: 'CHANDAULI_SADAR', nameHindi: 'चंदौली सदर (Chandauli Sadar)', nameEnglish: 'Chandauli Sadar' },
    { id: 'SAKALDIHA', nameHindi: 'सकलडीहा (Sakaldiha)', nameEnglish: 'Sakaldiha' },
    { id: 'CHAKIYA', nameHindi: 'चकिया (Chakiya)', nameEnglish: 'Chakiya' },
    { id: 'MUGHALSARAI_NIAMATABAD', nameHindi: 'मुगलसराय / नियामताबाद', nameEnglish: 'Niyamatabad' },
    { id: 'DHARMANJPUR', nameHindi: 'धानापुर (Dhanapur)', nameEnglish: 'Dhanapur' },
    { id: 'CHAHANIYA', nameHindi: 'चहनिया (Chahaniya)', nameEnglish: 'Chahaniya' }
  ],
  AZAMGARH: [
    { id: 'AZAMGARH_SADAR', nameHindi: 'आज़मगढ़ सदर (Azamgarh Sadar)', nameEnglish: 'Azamgarh Sadar' },
    { id: 'SAGRI', nameHindi: 'सगड़ी (Sagri)', nameEnglish: 'Sagri' },
    { id: 'LALGANJ', nameHindi: 'लालगंज (Lalganj)', nameEnglish: 'Lalganj' },
    { id: 'PHOOLPUR', nameHindi: 'फूलपुर पवई (Phoolpur Pawai)', nameEnglish: 'Phoolpur Pawai' },
    { id: 'MEHNAGAR', nameHindi: 'मेहनाजपुर / मेहनगर (Mehnagar)', nameEnglish: 'Mehnagar' },
    { id: 'NIZAMABAD_UP', nameHindi: 'निज़ामाबाद (Nizamabad)', nameEnglish: 'Nizamabad' }
  ],
  JAUNPUR: [
    { id: 'JAUNPUR_SADAR', nameHindi: 'जौनपुर सदर (Jaunpur Sadar)', nameEnglish: 'Jaunpur Sadar' },
    { id: 'SHAHGANJ', nameHindi: 'शाहगंज (Shahganj)', nameEnglish: 'Shahganj' },
    { id: 'MARIYAHU', nameHindi: 'मड़ियाहूं (Mariyahu)', nameEnglish: 'Mariyahu' },
    { id: 'MACHHLISHAHR', nameHindi: 'मछलीशहर (Machhlishahr)', nameEnglish: 'Machhlishahr' },
    { id: 'KERAKAT', nameHindi: 'केराकत (Kerakat)', nameEnglish: 'Kerakat' },
    { id: 'BADLAPUR', nameHindi: 'बदलापुर (Badlapur)', nameEnglish: 'Badlapur' }
  ],
  GORAKHPUR: [
    { id: 'GORAKHPUR_SADAR', nameHindi: 'गोरखपुर सदर (Gorakhpur Sadar)', nameEnglish: 'Gorakhpur Sadar' },
    { id: 'CHARGAWAN', nameHindi: 'चरगांवा (Chargawan)', nameEnglish: 'Chargawan' },
    { id: 'SAHJANWA', nameHindi: 'सहजनवा (Sahjanwa)', nameEnglish: 'Sahjanwa' },
    { id: 'CHOURICHAURA', nameHindi: 'चौरी चौरा (Chauri Chaura)', nameEnglish: 'Chauri Chaura' },
    { id: 'KAMPILGANJ', nameHindi: 'कैम्पियरगंज (Campierganj)', nameEnglish: 'Campierganj' },
    { id: 'BANSGAON', nameHindi: 'बांसगांव (Bansgaon)', nameEnglish: 'Bansgaon' }
  ],
  BUXAR: [
    { id: 'BUXAR_SADAR', nameHindi: 'बक्सर सदर (Buxar Sadar)', nameEnglish: 'Buxar Sadar' },
    { id: 'DUMRAON', nameHindi: 'डुमरांव (Dumraon)', nameEnglish: 'Dumraon' },
    { id: 'BRAHAMPUR', nameHindi: 'ब्रह्मपुर (Brahampur)', nameEnglish: 'Brahampur' },
    { id: 'CHAUGAN', nameHindi: 'चौगाईं (Chaugain)', nameEnglish: 'Chaugain' },
    { id: 'SIMRI', nameHindi: 'सिमरी (Simri)', nameEnglish: 'Simri' },
    { id: 'ITADHI', nameHindi: 'इटाढ़ी (Itadhi)', nameEnglish: 'Itadhi' },
    { id: 'NAWANAGAR', nameHindi: 'नवानगर (Nawanagar)', nameEnglish: 'Nawanagar' },
    { id: 'CHAKKI', nameHindi: 'चक्की (Chakki)', nameEnglish: 'Chakki' }
  ],
  PATNA: [
    { id: 'PATNA_SADAR', nameHindi: 'पटना सदर (Patna Sadar)', nameEnglish: 'Patna Sadar' },
    { id: 'DANAPUR', nameHindi: 'दानापुर (Danapur)', nameEnglish: 'Danapur' },
    { id: 'PHULWARI_SHARIF', nameHindi: 'फुलवारी शरीफ (Phulwari Sharif)', nameEnglish: 'Phulwari Sharif' },
    { id: 'FATUHA', nameHindi: 'फतुहा (Fatuha)', nameEnglish: 'Fatuha' },
    { id: 'BARH', nameHindi: 'बाढ़ (Barh)', nameEnglish: 'Barh' },
    { id: 'MASAURHI', nameHindi: 'मसौढ़ी (Masaurhi)', nameEnglish: 'Masaurhi' },
    { id: 'BIHTA', nameHindi: 'बिहटा (Bihta)', nameEnglish: 'Bihta' }
  ],
  LUCKNOW: [
    { id: 'LUCKNOW_SADAR', nameHindi: 'लखनऊ नगर / सदर (Lucknow Sadar)', nameEnglish: 'Lucknow Sadar' },
    { id: 'BAKSHI_KA_TALAB', nameHindi: 'बक्शी का तालाब (BKT)', nameEnglish: 'BKT' },
    { id: 'SAROJINI_NAGAR', nameHindi: 'सरोजिनी नगर (Sarojini Nagar)', nameEnglish: 'Sarojini Nagar' },
    { id: 'MOHANLALGANJ', nameHindi: 'मोहनलालगंज (Mohanlalganj)', nameEnglish: 'Mohanlalganj' },
    { id: 'MAL', nameHindi: 'माल (Mal)', nameEnglish: 'Mal' },
    { id: 'MALIHABAD', nameHindi: 'मलिहाबाद (Malihabad)', nameEnglish: 'Malihabad' }
  ],
  NEW_DELHI: [
    { id: 'CONNAUGHT_PLACE', nameHindi: 'कनॉट प्लेस जोन (Connaught Place)', nameEnglish: 'Connaught Place' },
    { id: 'CHANAKYAPURI', nameHindi: 'चाणक्यपुरी जोन (Chanakyapuri)', nameEnglish: 'Chanakyapuri' },
    { id: 'PARLIAMENT_STREET', nameHindi: 'संसद मार्ग क्षेत्र (Parliament Street)', nameEnglish: 'Parliament Street' },
    { id: 'DELHI_CANTT', nameHindi: 'दिल्ली कैंट (Delhi Cantt)', nameEnglish: 'Delhi Cantt' }
  ]
};

/**
 * Fallback block / tehsil helper for ANY district across India
 */
export function getBlocksForDistrict(stateId: string, districtId: string, districtName?: string): Array<{ id: string; nameHindi: string; nameEnglish: string }> {
  if (BLOCKS_BY_DISTRICT[districtId]) {
    return BLOCKS_BY_DISTRICT[districtId];
  }
  const cleanName = (districtName || districtId).split('(')[0].trim();
  return [
    { id: `${districtId}_SADAR`, nameHindi: `${cleanName} सदर / मुख्य तहसील`, nameEnglish: `${cleanName} Sadar` },
    { id: `${districtId}_NAGAR`, nameHindi: `${cleanName} नगर क्षेत्र (City Zone)`, nameEnglish: `${cleanName} City Zone` },
    { id: `${districtId}_NORTH`, nameHindi: `${cleanName} उत्तरी ब्लॉक (North Block)`, nameEnglish: `${cleanName} North Block` },
    { id: `${districtId}_SOUTH`, nameHindi: `${cleanName} दक्षिणी ब्लॉक (South Block)`, nameEnglish: `${cleanName} South Block` },
    { id: `${districtId}_EAST`, nameHindi: `${cleanName} पूर्वी ब्लॉक (East Block)`, nameEnglish: `${cleanName} East Block` },
    { id: `${districtId}_WEST`, nameHindi: `${cleanName} पश्चिमी ब्लॉक (West Block)`, nameEnglish: `${cleanName} West Block` },
    { id: `${districtId}_CENTRAL`, nameHindi: `${cleanName} केंद्रीय विकास खंड (Central Block)`, nameEnglish: `${cleanName} Central Block` }
  ];
}

export const VILLAGES_OR_WARDS: Record<string, Array<{ id: string; nameHindi: string; nameEnglish: string; type?: 'panchayat' | 'ward' }>> = {
  MOHAMMADABAD: [
    { id: 'MIRANPUR', nameHindi: 'ग्राम मीरानपुर (Miranpur - JJF मुख्यालय)', nameEnglish: 'Village Miranpur', type: 'panchayat' },
    { id: 'YUSUFPUR', nameHindi: 'यूसुफपुर कस्बा (Yusufpur Town)', nameEnglish: 'Yusufpur Town', type: 'ward' },
    { id: 'HAIDARIA', nameHindi: 'ग्राम हैदरिया (Haidaria)', nameEnglish: 'Village Haidaria', type: 'panchayat' },
    { id: 'KUNDESAR', nameHindi: 'ग्राम कुण्डेसर (Kundesar)', nameEnglish: 'Village Kundesar', type: 'panchayat' },
    { id: 'SHERPUR', nameHindi: 'ग्राम शेरपुर कलां (Sherpur)', nameEnglish: 'Village Sherpur', type: 'panchayat' },
    { id: 'BAHADURGANJ', nameHindi: 'बहादुरगंज नगर (Bahadurganj)', nameEnglish: 'Bahadurganj', type: 'ward' },
    { id: 'NONHARA', nameHindi: 'ग्राम नोनहरा (Nonhara)', nameEnglish: 'Village Nonhara', type: 'panchayat' },
    { id: 'KASIMABAD_VIL', nameHindi: 'ग्राम कासिमाबाद (Kasimabad)', nameEnglish: 'Village Kasimabad', type: 'panchayat' },
    { id: 'ALAVALPUR', nameHindi: 'ग्राम अलावलापुर (Alavalpur)', nameEnglish: 'Village Alavalpur', type: 'panchayat' },
    { id: 'MOH_WARD_1', nameHindi: 'वार्ड संख्या 01 - गांधी नगर (Gandhi Nagar)', nameEnglish: 'Ward 01 - Gandhi Nagar', type: 'ward' },
    { id: 'MOH_WARD_2', nameHindi: 'वार्ड संख्या 02 - सुभाष नगर (Subhash Nagar)', nameEnglish: 'Ward 02 - Subhash Nagar', type: 'ward' },
    { id: 'MOH_WARD_3', nameHindi: 'वार्ड संख्या 03 - पटेल नगर (Patel Nagar)', nameEnglish: 'Ward 03 - Patel Nagar', type: 'ward' },
    { id: 'MOH_WARD_4', nameHindi: 'वार्ड संख्या 04 - आंबेडकर नगर (Ambedkar Nagar)', nameEnglish: 'Ward 04 - Ambedkar Nagar', type: 'ward' },
    { id: 'MOH_WARD_5', nameHindi: 'वार्ड संख्या 05 - भगत सिंह नगर (Bhagat Singh Nagar)', nameEnglish: 'Ward 05 - Bhagat Singh Nagar', type: 'ward' }
  ],
  GHAZIPUR_SADAR: [
    { id: 'GZ_CITY_CENTER', nameHindi: 'गाज़ीपुर शहर मुख्य (Ghazipur Main)', nameEnglish: 'Ghazipur Main', type: 'ward' },
    { id: 'LANKA', nameHindi: 'लंका / कचहरी क्षेत्र (Lanka/Kachehri)', nameEnglish: 'Lanka/Kachehri', type: 'ward' },
    { id: 'RAVINDRAMPURI', nameHindi: 'रविन्द्रपुरी (Ravindrapuri)', nameEnglish: 'Ravindrapuri', type: 'ward' },
    { id: 'MISHRA_BAZAR', nameHindi: 'मिश्रबाज़ार (Mishra Bazar)', nameEnglish: 'Mishra Bazar', type: 'ward' },
    { id: 'GORA_BAZAR', nameHindi: 'गोरा बाज़ार (Gora Bazar)', nameEnglish: 'Gora Bazar', type: 'ward' },
    { id: 'CHHAWANI', nameHindi: 'छावनी क्षेत्र (Cantonment)', nameEnglish: 'Cantonment', type: 'ward' },
    { id: 'JANGIPUR', nameHindi: 'ग्राम पंचायत जंगीपुर (Jangipur)', nameEnglish: 'Gram Panchayat Jangipur', type: 'panchayat' },
    { id: 'NANDGANJ', nameHindi: 'ग्राम पंचायत नन्दगंज (Nandganj)', nameEnglish: 'Gram Panchayat Nandganj', type: 'panchayat' },
    { id: 'TARIGHAT', nameHindi: 'ग्राम पंचायत ताड़ीघाट (Tarighat)', nameEnglish: 'Gram Panchayat Tarighat', type: 'panchayat' },
    { id: 'GZ_WARD_1', nameHindi: 'वार्ड संख्या 01 - नेहरू नगर', nameEnglish: 'Ward 01 - Nehru Nagar', type: 'ward' },
    { id: 'GZ_WARD_2', nameHindi: 'वार्ड संख्या 02 - शास्त्री नगर', nameEnglish: 'Ward 02 - Shastri Nagar', type: 'ward' },
    { id: 'GZ_WARD_3', nameHindi: 'वार्ड संख्या 03 - विवेकानंद नगर', nameEnglish: 'Ward 03 - Vivekanand Nagar', type: 'ward' }
  ],
  ZAMANIA: [
    { id: 'GAHMAR', nameHindi: 'ग्राम पंचायत गहमर (Gahmar - एशिया का सबसे बड़ा गाँव)', nameEnglish: 'Gram Panchayat Gahmar', type: 'panchayat' },
    { id: 'DILDARNAGAR', nameHindi: 'दिलदारनगर कस्बा (Dildarnagar)', nameEnglish: 'Dildarnagar', type: 'ward' },
    { id: 'ZAMANIA_TOWN', nameHindi: 'जमानिया कस्बा / वार्ड (Zamania Town)', nameEnglish: 'Zamania Town', type: 'ward' },
    { id: 'DEORHI', nameHindi: 'ग्राम पंचायत डेवढ़ी (Deorhi)', nameEnglish: 'Gram Panchayat Deorhi', type: 'panchayat' },
    { id: 'MATSA', nameHindi: 'ग्राम पंचायत मतसा (Matsa)', nameEnglish: 'Gram Panchayat Matsa', type: 'panchayat' },
    { id: 'REOTIPUR_VIL', nameHindi: 'ग्राम पंचायत रेवतीपुर (Reotipur)', nameEnglish: 'Gram Panchayat Reotipur', type: 'panchayat' }
  ]
};

/**
 * Universal dynamic helper for Gram Panchayats & Urban Wards for any block
 */
export function getPanchayatsAndWardsForBlock(blockId: string, blockName?: string, districtName?: string): Array<{ id: string; nameHindi: string; nameEnglish: string; type: 'panchayat' | 'ward' }> {
  if (VILLAGES_OR_WARDS[blockId]) {
    return VILLAGES_OR_WARDS[blockId].map((item) => ({
      ...item,
      type: item.type || 'panchayat'
    }));
  }

  const cleanBlock = (blockName || blockId).split('(')[0].trim();
  return [
    // Standard Gram Panchayats
    { id: `${blockId}_GP_01`, nameHindi: `ग्राम पंचायत ${cleanBlock} मुख्य (Gram Panchayat Main)`, nameEnglish: `GP ${cleanBlock} Main`, type: 'panchayat' },
    { id: `${blockId}_GP_02`, nameHindi: `ग्राम पंचायत ${cleanBlock} उत्तर (GP North)`, nameEnglish: `GP ${cleanBlock} North`, type: 'panchayat' },
    { id: `${blockId}_GP_03`, nameHindi: `ग्राम पंचायत ${cleanBlock} दक्षिण (GP South)`, nameEnglish: `GP ${cleanBlock} South`, type: 'panchayat' },
    { id: `${blockId}_GP_04`, nameHindi: `ग्राम पंचायत ${cleanBlock} पूर्व (GP East)`, nameEnglish: `GP ${cleanBlock} East`, type: 'panchayat' },
    { id: `${blockId}_GP_05`, nameHindi: `ग्राम पंचायत ${cleanBlock} पश्चिम (GP West)`, nameEnglish: `GP ${cleanBlock} West`, type: 'panchayat' },
    { id: `${blockId}_GP_06`, nameHindi: `ग्राम पंचायत आदर्श ग्राम (Adarsh Gram)`, nameEnglish: `GP Adarsh Gram`, type: 'panchayat' },
    { id: `${blockId}_GP_07`, nameHindi: `ग्राम पंचायत सेवाकुंज (Sevakunj)`, nameEnglish: `GP Sevakunj`, type: 'panchayat' },
    
    // Standard Urban/Town Wards
    { id: `${blockId}_WARD_01`, nameHindi: `वार्ड संख्या 01 - गांधी नगर (Ward 01)`, nameEnglish: `Ward 01 - Gandhi Nagar`, type: 'ward' },
    { id: `${blockId}_WARD_02`, nameHindi: `वार्ड संख्या 02 - सुभाष नगर (Ward 02)`, nameEnglish: `Ward 02 - Subhash Nagar`, type: 'ward' },
    { id: `${blockId}_WARD_03`, nameHindi: `वार्ड संख्या 03 - पटेल नगर (Ward 03)`, nameEnglish: `Ward 03 - Patel Nagar`, type: 'ward' },
    { id: `${blockId}_WARD_04`, nameHindi: `वार्ड संख्या 04 - आंबेडकर नगर (Ward 04)`, nameEnglish: `Ward 04 - Ambedkar Nagar`, type: 'ward' },
    { id: `${blockId}_WARD_05`, nameHindi: `वार्ड संख्या 05 - भगत सिंह नगर (Ward 05)`, nameEnglish: `Ward 05 - Bhagat Singh Nagar`, type: 'ward' },
    { id: `${blockId}_WARD_06`, nameHindi: `वार्ड संख्या 06 - विवेकानंद नगर (Ward 06)`, nameEnglish: `Ward 06 - Vivekanand Nagar`, type: 'ward' },
    { id: `${blockId}_WARD_07`, nameHindi: `वार्ड संख्या 07 - शास्त्री नगर (Ward 07)`, nameEnglish: `Ward 07 - Shastri Nagar`, type: 'ward' },
    { id: `${blockId}_WARD_08`, nameHindi: `वार्ड संख्या 08 - नेहरू नगर (Ward 08)`, nameEnglish: `Ward 08 - Nehru Nagar`, type: 'ward' },
    { id: `${blockId}_WARD_09`, nameHindi: `वार्ड संख्या 09 - तिलक नगर (Ward 09)`, nameEnglish: `Ward 09 - Tilak Nagar`, type: 'ward' },
    { id: `${blockId}_WARD_10`, nameHindi: `वार्ड संख्या 10 - अशोक नगर (Ward 10)`, nameEnglish: `Ward 10 - Ashok Nagar`, type: 'ward' }
  ];
}

export const DEFAULT_STRUCTURED_ADDRESS: StructuredAddress = {
  country: 'भारत (India)',
  state: 'उत्तर प्रदेश (Uttar Pradesh)',
  district: 'गाज़ीपुर (Ghazipur)',
  block: 'मोहम्मदाबाद (Mohammadabad)',
  panchayatOrWardType: 'panchayat',
  wardOrVillage: 'ग्राम मीरानपुर (Miranpur - JJF मुख्यालय)',
  pincode: '233222'
};

export function formatStructuredAddress(addr: Partial<StructuredAddress>): string {
  const parts: string[] = [];
  if (addr.wardOrVillage) parts.push(`ग्राम/वार्ड: ${addr.wardOrVillage}`);
  if (addr.block) parts.push(`ब्लॉक: ${addr.block}`);
  if (addr.district) parts.push(`जिला: ${addr.district}`);
  if (addr.state) parts.push(addr.state);
  if (addr.country) parts.push(addr.country);
  return parts.join(', ');
}

export function formatShortAddress(addr: Partial<StructuredAddress>): string {
  const parts: string[] = [];
  if (addr.wardOrVillage) parts.push(addr.wardOrVillage);
  if (addr.block) parts.push(addr.block);
  if (addr.district) parts.push(addr.district);
  if (addr.state) parts.push(addr.state);
  return parts.join(', ');
}

export const GHAZIPUR_LOCATIONS = [
  {
    id: 'miranpur-hq',
    name: 'Jeevan Jyoti HQ & Skill Center',
    nameHindi: 'जीवन ज्योति मुख्य कार्यालय व कौशल केंद्र',
    type: 'headquarters' as const,
    address: 'Village Meeranpur Urf Madiyawadih, Post Meeranpur, Block Mohammadabad, District Ghazipur, Uttar Pradesh, India - 233303 (DIGIPIN 2J6T226CL2)',
    coordinates: { lat: 25.6124, lng: 83.7548 },
    beneficiaries: 4200,
    activeVolunteers: 45,
    leadPerson: 'Shailesh Pradhan (Manager)',
    phone: '+91 8052361666',
    googleMapsUrl: 'https://maps.app.goo.gl/72kFrETKbmiKA3gv7'
  },
  {
    id: 'sadar-shiksha',
    name: 'Ghazipur Sadar Child Literacy Center',
    nameHindi: 'गाज़ीपुर सदर निःशुल्क बाल पाठशाला केंद्र',
    type: 'school' as const,
    address: 'Near Ganga Ghat, Ghazipur Sadar, UP - 233001',
    coordinates: { lat: 25.5844, lng: 83.5772 },
    beneficiaries: 1850,
    activeVolunteers: 28,
    leadPerson: 'Pooja Verma (Coordinator)',
    phone: '+91 8052361666',
    googleMapsUrl: 'https://maps.app.goo.gl/72kFrETKbmiKA3gv7'
  },
  {
    id: 'zamania-annapurna',
    name: 'Zamania Annapurna Food Seva Hub',
    nameHindi: 'जमानिया अन्नपूर्णा भोजन वितरण सेवा केंद्र',
    type: 'food_center' as const,
    address: 'Station Road, Zamania, Ghazipur - 232329',
    coordinates: { lat: 25.4312, lng: 83.5601 },
    beneficiaries: 3100,
    activeVolunteers: 22,
    leadPerson: 'Manoj Singh (Seva Incharge)',
    phone: '+91 8052361666',
    googleMapsUrl: 'https://maps.app.goo.gl/72kFrETKbmiKA3gv7'
  },
  {
    id: 'mohammadabad-health',
    name: 'Mohammadabad Mobile Health Mission',
    nameHindi: 'मोहम्मदाबाद निःशुल्क स्वास्थ्य व दवा वितरण केंद्र',
    type: 'health_camp' as const,
    address: 'Tehsil Chowk, Mohammadabad, Ghazipur - 233222',
    coordinates: { lat: 25.6198, lng: 83.7554 },
    beneficiaries: 2900,
    activeVolunteers: 34,
    leadPerson: 'Dr. R.K. Pandey (Medical Lead)',
    phone: '+91 8052361666',
    googleMapsUrl: 'https://maps.app.goo.gl/72kFrETKbmiKA3gv7'
  }
];


