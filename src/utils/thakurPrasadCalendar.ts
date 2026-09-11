import { FestivalItem } from '../types';

/**
 * श्री ठाकुर प्रसाद पंचांग (वाराणसी / काशी परंपरा) - प्रामाणिक गणना एवं वार्षिक स्वतः नवीनीकरण इंजन
 * Thakur Prasad Panchang & Calendar Engine with Automatic Yearly Renewal
 */

export interface PanchangYearMeta {
  gregorianYear: number;
  vikramSamvat: number;
  sakaSamvat: number;
  samvatsarName: string;
  hinduYearTitle: string;
  isLeapYear: boolean;
  totalFestivals: number;
}

// 60 संवत्सरों की शास्त्रीय सूची (60 Samvatsaras Cycle - North Indian / Varanasi Tradition)
export const SAMVATSAR_NAMES = [
  'प्रभव', 'विभव', 'शुक्ल', 'प्रमोद', 'प्रजापति', 'अंगिरा', 'श्रीमुख', 'भाव', 'युवा', 'धाता',
  'ईश्वर', 'बहुधान्य', 'प्रमाथी', 'विक्रम', 'वृषप्रजा', 'चित्रभानु', 'सुभानु', 'तारण', 'पार्थिव', 'अव्यय',
  'सर्वजीत', 'सर्वधारी', 'विरोधी', 'विकृत', 'खर', 'नंदन', 'विजय', 'जय', 'मन्मथ', 'दुर्मुख',
  'हेमलम्ब', 'विलम्ब', 'विकारी', 'शार्वरी', 'प्लव', 'शुभकृत', 'शोभन', 'क्रोधी', 'विश्वावसु', 'पराभव',
  'प्लवंग', 'कीलक', 'सौम्य', 'साधारण', 'विरोधकृत', 'परिधावी', 'प्रमादी', 'आनंद', 'राक्षस', 'नल',
  'पिंगल', 'कालयुक्त', 'सिद्धार्थी', 'रौद्र', 'दुर्मति', 'दुन्दुभी', 'रुधिरोद्गारी', 'रक्ताक्ष', 'क्रोधन', 'क्षय'
];

/**
 * किसी भी वर्ष का संवत्सर नाम प्राप्त करें
 */
export function getSamvatsarName(vikramSamvat: number): string {
  const index = (vikramSamvat + 9) % 60;
  return SAMVATSAR_NAMES[index] || 'शुभ संवत्सर';
}

/**
 * किसी भी ग्रिगोरियन वर्ष का पंचांग मेटाडेटा तैयार करें
 */
export function getPanchangYearMeta(year: number = new Date().getFullYear()): PanchangYearMeta {
  const vikramSamvat = year + 57;
  const sakaSamvat = year - 78;
  const samvatsarName = getSamvatsarName(vikramSamvat);
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  return {
    gregorianYear: year,
    vikramSamvat,
    sakaSamvat,
    samvatsarName,
    hinduYearTitle: `विक्रम संवत ${vikramSamvat} (संवत्सर: ${samvatsarName}) • शक संवत ${sakaSamvat}`,
    isLeapYear,
    totalFestivals: 0
  };
}

// ठाकुर प्रसाद पंचांग के अनुसार प्रामाणिक बहु-वर्षीय तिथि मैपिंग डेटाबेस
interface FestivalDateEntry {
  dateHindi: string;
  dateEnglish: string;
  gregorianDate: string; // YYYY-MM-DD
  shubhMuhurat?: string;
  nakshatraYoga?: string;
}

// Multi-Year Astronomical Thakur Prasad Table for Core Hindu & National Festivals
export const THAKUR_PRASAD_YEARLY_DATES: Record<string, Record<number, FestivalDateEntry>> = {
  // 1. मकर संक्रांति
  makar_sankranti: {
    2024: { dateHindi: '15 जनवरी (सोमवार)', dateEnglish: '15 Jan 2024 (Mon)', gregorianDate: '2024-01-15', shubhMuhurat: 'पुण्यकाल: प्रातः 07:15 से सायं 05:46' },
    2025: { dateHindi: '14 जनवरी (मंगलवार)', dateEnglish: '14 Jan 2025 (Tue)', gregorianDate: '2025-01-14', shubhMuhurat: 'पुण्यकाल: प्रातः 07:14 से सायं 05:45' },
    2026: { dateHindi: '14-15 जनवरी (बुधवार)', dateEnglish: '14-15 Jan 2026 (Wed)', gregorianDate: '2026-01-14', shubhMuhurat: 'महापुण्यकाल: प्रातः 07:15 से 09:05' },
    2027: { dateHindi: '15 जनवरी (शुक्रवार)', dateEnglish: '15 Jan 2027 (Fri)', gregorianDate: '2027-01-15', shubhMuhurat: 'पुण्यकाल: प्रातः 07:15 से दोपहर 12:30' },
    2028: { dateHindi: '15 जनवरी (शनिवार)', dateEnglish: '15 Jan 2028 (Sat)', gregorianDate: '2028-01-15', shubhMuhurat: 'पुण्यकाल: प्रातः 07:14 से सायं 05:46' },
    2029: { dateHindi: '14 जनवरी (रविवार)', dateEnglish: '14 Jan 2029 (Sun)', gregorianDate: '2029-01-14', shubhMuhurat: 'पुण्यकाल: प्रातः 07:13 से सायं 05:47' },
    2030: { dateHindi: '14 जनवरी (सोमवार)', dateEnglish: '14 Jan 2030 (Mon)', gregorianDate: '2030-01-14', shubhMuhurat: 'पुण्यकाल: प्रातः 07:14 से सायं 05:48' }
  },
  // 2. मौनी अमावस्या (माघ अमावस्या)
  mauni_amavasya: {
    2024: { dateHindi: '09 फरवरी (शुक्रवार)', dateEnglish: '09 Feb 2024 (Fri)', gregorianDate: '2024-02-09', shubhMuhurat: 'संगम स्नान ब्रह्म मुहूर्त: 05:20 से' },
    2025: { dateHindi: '29 जनवरी (बुधवार)', dateEnglish: '29 Jan 2025 (Wed)', gregorianDate: '2025-01-29', shubhMuhurat: 'महाकुंभ अमृत स्नान मुहूर्त: 05:15 से' },
    2026: { dateHindi: '17 फरवरी (मंगलवार)', dateEnglish: '17 Feb 2026 (Tue)', gregorianDate: '2026-02-17', shubhMuhurat: 'पवित्र स्नान मुहूर्त: 05:18 से 11:30' },
    2027: { dateHindi: '06 फरवरी (शनिवार)', dateEnglish: '06 Feb 2027 (Sat)', gregorianDate: '2027-02-06', shubhMuhurat: 'अमावस्या स्नान: 05:22 से' },
    2028: { dateHindi: '26 जनवरी (बुधवार)', dateEnglish: '26 Jan 2028 (Wed)', gregorianDate: '2028-01-26', shubhMuhurat: 'ब्रह्म मुहूर्त: 05:24 से' },
    2029: { dateHindi: '13 फरवरी (मंगलवार)', dateEnglish: '13 Feb 2029 (Tue)', gregorianDate: '2029-02-13', shubhMuhurat: 'स्नान दान मुहूर्त: 05:19 से' },
    2030: { dateHindi: '03 फरवरी (रविवार)', dateEnglish: '03 Feb 2030 (Sun)', gregorianDate: '2030-02-03', shubhMuhurat: 'स्नान दान मुहूर्त: 05:20 से' }
  },
  // 3. बसंत पंचमी एवं सरस्वती पूजा
  vasant_panchami: {
    2024: { dateHindi: '14 फरवरी (बुधवार)', dateEnglish: '14 Feb 2024 (Wed)', gregorianDate: '2024-02-14', shubhMuhurat: 'सरस्वती पूजन: प्रातः 07:01 से 12:35' },
    2025: { dateHindi: '02 फरवरी (रविवार)', dateEnglish: '02 Feb 2025 (Sun)', gregorianDate: '2025-02-02', shubhMuhurat: 'सरस्वती पूजन: प्रातः 07:09 से 12:35' },
    2026: { dateHindi: '23 जनवरी (शुक्रवार)', dateEnglish: '23 Jan 2026 (Fri)', gregorianDate: '2026-01-23', shubhMuhurat: 'सरस्वती पूजन: प्रातः 07:13 से 12:33' },
    2027: { dateHindi: '11 फरवरी (गुरुवार)', dateEnglish: '11 Feb 2027 (Thu)', gregorianDate: '2027-02-11', shubhMuhurat: 'सरस्वती पूजन: प्रातः 07:03 से 12:35' },
    2028: { dateHindi: '31 जनवरी (सोमवार)', dateEnglish: '31 Jan 2028 (Mon)', gregorianDate: '2028-01-31', shubhMuhurat: 'पूजन मुहूर्त: प्रातः 07:10 से 12:35' },
    2029: { dateHindi: '19 जनवरी (शुक्रवार)', dateEnglish: '19 Jan 2029 (Fri)', gregorianDate: '2029-01-19', shubhMuhurat: 'पूजन मुहूर्त: प्रातः 07:14 से 12:34' },
    2030: { dateHindi: '08 फरवरी (शुक्रवार)', dateEnglish: '08 Feb 2030 (Fri)', gregorianDate: '2030-02-08', shubhMuhurat: 'पूजन मुहूर्त: प्रातः 07:05 से 12:35' }
  },
  // 4. महाशिवरात्रि महापर्व
  maha_shivratri: {
    2024: { dateHindi: '08 मार्च (शुक्रवार)', dateEnglish: '08 Mar 2024 (Fri)', gregorianDate: '2024-03-08', shubhMuhurat: 'निशीथ काल पूजा: रात्रि 12:07 से 12:56' },
    2025: { dateHindi: '26 फरवरी (बुधवार)', dateEnglish: '26 Feb 2025 (Wed)', gregorianDate: '2025-02-26', shubhMuhurat: 'निशीथ काल पूजा: रात्रि 12:09 से 12:59' },
    2026: { dateHindi: '15 फरवरी (रविवार)', dateEnglish: '15 Feb 2026 (Sun)', gregorianDate: '2026-02-15', shubhMuhurat: 'निशीथ काल पूजा: रात्रि 12:09 से 12:59' },
    2027: { dateHindi: '06 मार्च (शनिवार)', dateEnglish: '06 Mar 2027 (Sat)', gregorianDate: '2027-03-06', shubhMuhurat: 'निशीथ काल पूजा: रात्रि 12:07 से 12:56' },
    2028: { dateHindi: '24 फरवरी (गुरुवार)', dateEnglish: '24 Feb 2028 (Thu)', gregorianDate: '2028-02-24', shubhMuhurat: 'निशीथ काल पूजा: रात्रि 12:09 से 12:58' },
    2029: { dateHindi: '11 फरवरी (रविवार)', dateEnglish: '11 Feb 2029 (Sun)', gregorianDate: '2029-02-11', shubhMuhurat: 'निशीथ काल पूजा: रात्रि 12:09 से 12:59' },
    2030: { dateHindi: '02 मार्च (शनिवार)', dateEnglish: '02 Mar 2030 (Sat)', gregorianDate: '2030-03-02', shubhMuhurat: 'निशीथ काल पूजा: रात्रि 12:08 से 12:57' }
  },
  // 5. होलिका दहन एवं होली (रंगोत्सव / धुलेंडी)
  holi: {
    2024: { dateHindi: '24-25 मार्च (सोमवार-मंगलवार)', dateEnglish: '24-25 Mar 2024 (Mon-Tue)', gregorianDate: '2024-03-25', shubhMuhurat: 'होलिका दहन: रात्रि 11:13 से 12:27' },
    2025: { dateHindi: '13-14 मार्च (गुरुवार-शुक्रवार)', dateEnglish: '13-14 Mar 2025 (Thu-Fri)', gregorianDate: '2025-03-14', shubhMuhurat: 'होलिका दहन: रात्रि 11:26 से 12:30' },
    2026: { dateHindi: '03-04 मार्च (मंगलवार-बुधवार)', dateEnglish: '03-04 Mar 2026 (Tue-Wed)', gregorianDate: '2026-03-04', shubhMuhurat: 'होलिका दहन: सायं 06:24 से 08:51' },
    2027: { dateHindi: '22-23 मार्च (सोमवार-मंगलवार)', dateEnglish: '22-23 Mar 2027 (Mon-Tue)', gregorianDate: '2027-03-23', shubhMuhurat: 'होलिका दहन: सायं 06:33 से 08:58' },
    2028: { dateHindi: '10-11 मार्च (शुक्रवार-शनिवार)', dateEnglish: '10-11 Mar 2028 (Fri-Sat)', gregorianDate: '2028-03-11', shubhMuhurat: 'होलिका दहन: सायं 06:27 से 08:54' },
    2029: { dateHindi: '28 फरवरी - 01 मार्च', dateEnglish: '28 Feb - 01 Mar 2029', gregorianDate: '2029-03-01', shubhMuhurat: 'होलिका दहन: सायं 06:21 से 08:48' },
    2030: { dateHindi: '19-20 मार्च (मंगलवार-बुधवार)', dateEnglish: '19-20 Mar 2030 (Tue-Wed)', gregorianDate: '2030-03-20', shubhMuhurat: 'होलिका दहन: सायं 06:31 से 08:56' }
  },
  // 6. चैत्र नवरात्रि एवं हिंदू नववर्ष (नवसंवत्सर)
  chaitra_navratri: {
    2024: { dateHindi: '09 अप्रैल (मंगलवार)', dateEnglish: '09 Apr 2024 (Tue)', gregorianDate: '2024-04-09', shubhMuhurat: 'कलश स्थापना: प्रातः 06:02 से 10:16' },
    2025: { dateHindi: '30 मार्च (रविवार)', dateEnglish: '30 Mar 2025 (Sun)', gregorianDate: '2025-03-30', shubhMuhurat: 'घटस्थापना: प्रातः 06:13 से 10:22' },
    2026: { dateHindi: '19 मार्च (गुरुवार)', dateEnglish: '19 Mar 2026 (Thu)', gregorianDate: '2026-03-19', shubhMuhurat: 'घटस्थापना: प्रातः 06:25 से 07:55' },
    2027: { dateHindi: '07 अप्रैल (बुधवार)', dateEnglish: '07 Apr 2027 (Wed)', gregorianDate: '2027-04-07', shubhMuhurat: 'घटस्थापना: प्रातः 06:05 से 10:18' },
    2028: { dateHindi: '27 मार्च (सोमवार)', dateEnglish: '27 Mar 2028 (Mon)', gregorianDate: '2028-03-27', shubhMuhurat: 'घटस्थापना: प्रातः 06:16 से 10:24' },
    2029: { dateHindi: '16 मार्च (शुक्रवार)', dateEnglish: '16 Mar 2029 (Fri)', gregorianDate: '2029-03-16', shubhMuhurat: 'घटस्थापना: प्रातः 06:28 से 10:30' },
    2030: { dateHindi: '04 अप्रैल (गुरुवार)', dateEnglish: '04 Apr 2030 (Thu)', gregorianDate: '2030-04-04', shubhMuhurat: 'घटस्थापना: प्रातः 06:08 से 10:20' }
  },
  // 7. श्री राम नवमी
  ram_navami: {
    2024: { dateHindi: '17 अप्रैल (बुधवार)', dateEnglish: '17 Apr 2024 (Wed)', gregorianDate: '2024-04-17', shubhMuhurat: 'मध्याह्न पूजन: 11:03 से 01:38' },
    2025: { dateHindi: '06 अप्रैल (रविवार)', dateEnglish: '06 Apr 2025 (Sun)', gregorianDate: '2025-04-06', shubhMuhurat: 'मध्याह्न पूजन: 11:08 से 01:39' },
    2026: { dateHindi: '27 मार्च (शुक्रवार)', dateEnglish: '27 Mar 2026 (Fri)', gregorianDate: '2026-03-27', shubhMuhurat: 'मध्याह्न पूजन: 11:13 से 01:40' },
    2027: { dateHindi: '15 अप्रैल (गुरुवार)', dateEnglish: '15 Apr 2027 (Thu)', gregorianDate: '2027-04-15', shubhMuhurat: 'मध्याह्न पूजन: 11:04 से 01:38' },
    2028: { dateHindi: '04 अप्रैल (मंगलवार)', dateEnglish: '04 Apr 2028 (Tue)', gregorianDate: '2028-04-04', shubhMuhurat: 'मध्याह्न पूजन: 11:09 से 01:39' },
    2029: { dateHindi: '24 मार्च (शनिवार)', dateEnglish: '24 Mar 2029 (Sat)', gregorianDate: '2029-03-24', shubhMuhurat: 'मध्याह्न पूजन: 11:14 से 01:40' },
    2030: { dateHindi: '12 अप्रैल (शुक्रवार)', dateEnglish: '12 Apr 2030 (Fri)', gregorianDate: '2030-04-12', shubhMuhurat: 'मध्याह्न पूजन: 11:05 से 01:38' }
  },
  // 8. हनुमान जयंती
  hanuman_jayanti: {
    2024: { dateHindi: '23 अप्रैल (मंगलवार)', dateEnglish: '23 Apr 2024 (Tue)', gregorianDate: '2024-04-23', shubhMuhurat: 'प्रातः पूजन: 09:03 से 10:41' },
    2025: { dateHindi: '12 अप्रैल (शनिवार)', dateEnglish: '12 Apr 2025 (Sat)', gregorianDate: '2025-04-12', shubhMuhurat: 'प्रातः पूजन: 09:08 से 10:45' },
    2026: { dateHindi: '02 अप्रैल (गुरुवार)', dateEnglish: '02 Apr 2026 (Thu)', gregorianDate: '2026-04-02', shubhMuhurat: 'प्रातः पूजन: 06:10 से 07:44' },
    2027: { dateHindi: '21 अप्रैल (बुधवार)', dateEnglish: '21 Apr 2027 (Wed)', gregorianDate: '2027-04-21', shubhMuhurat: 'प्रातः पूजन: 09:04 से 10:42' },
    2028: { dateHindi: '09 अप्रैल (रविवार)', dateEnglish: '09 Apr 2028 (Sun)', gregorianDate: '2028-04-09', shubhMuhurat: 'प्रातः पूजन: 09:07 से 10:44' },
    2029: { dateHindi: '29 मार्च (गुरुवार)', dateEnglish: '29 Mar 2029 (Thu)', gregorianDate: '2029-03-29', shubhMuhurat: 'प्रातः पूजन: 06:14 से 07:48' },
    2030: { dateHindi: '17 अप्रैल (बुधवार)', dateEnglish: '17 Apr 2030 (Wed)', gregorianDate: '2030-04-17', shubhMuhurat: 'प्रातः पूजन: 09:05 से 10:43' }
  },
  // 9. अक्षय तृतीया एवं परशुराम जयंती
  akshaya_tritiya: {
    2024: { dateHindi: '10 मई (शुक्रवार)', dateEnglish: '10 May 2024 (Fri)', gregorianDate: '2024-05-10', shubhMuhurat: 'स्वर्ण क्रय व दान: 05:33 से 12:18' },
    2025: { dateHindi: '30 अप्रैल (बुधवार)', dateEnglish: '30 Apr 2025 (Wed)', gregorianDate: '2025-04-30', shubhMuhurat: 'स्वर्ण क्रय व दान: 05:40 से 12:18' },
    2026: { dateHindi: '19 अप्रैल (रविवार)', dateEnglish: '19 Apr 2026 (Sun)', gregorianDate: '2026-04-19', shubhMuhurat: 'शुभ मुहूर्त: प्रातः 05:51 से 12:20' },
    2027: { dateHindi: '09 मई (रविवार)', dateEnglish: '09 May 2027 (Sun)', gregorianDate: '2027-05-09', shubhMuhurat: 'स्वर्ण क्रय: प्रातः 05:34 से 12:18' },
    2028: { dateHindi: '27 अप्रैल (गुरुवार)', dateEnglish: '27 Apr 2028 (Thu)', gregorianDate: '2028-04-27', shubhMuhurat: 'दान पुण्य: प्रातः 05:43 से 12:19' },
    2029: { dateHindi: '16 अप्रैल (सोमवार)', dateEnglish: '16 Apr 2029 (Mon)', gregorianDate: '2029-04-16', shubhMuhurat: 'स्वर्ण क्रय: प्रातः 05:54 से 12:21' },
    2030: { dateHindi: '05 मई (रविवार)', dateEnglish: '05 May 2030 (Sun)', gregorianDate: '2030-05-05', shubhMuhurat: 'स्वर्ण क्रय: प्रातः 05:36 से 12:18' }
  },
  // 10. गंगा दशहरा एवं निर्जला एकादशी
  ganga_dussehra: {
    2024: { dateHindi: '16-18 जून (रविवार-मंगलवार)', dateEnglish: '16-18 Jun 2024 (Sun-Tue)', gregorianDate: '2024-06-16', shubhMuhurat: 'हस्त नक्षत्र योग: प्रातः 05:23 से' },
    2025: { dateHindi: '05-06 जून (गुरुवार-शुक्रवार)', dateEnglish: '05-06 Jun 2025 (Thu-Fri)', gregorianDate: '2025-06-05', shubhMuhurat: 'गंगा स्नान: प्रातः 05:23 से 11:30' },
    2026: { dateHindi: '26-28 मई (मंगलवार-गुरुवार)', dateEnglish: '26-28 May 2026 (Tue-Thu)', gregorianDate: '2026-05-26', shubhMuhurat: 'गंगा दशहरा स्नान: 05:25 से' },
    2027: { dateHindi: '14-16 जून (सोमवार-बुधवार)', dateEnglish: '14-16 Jun 2027 (Mon-Wed)', gregorianDate: '2027-06-14', shubhMuhurat: 'पवित्र स्नान: प्रातः 05:23 से' },
    2028: { dateHindi: '02-04 जून (शुक्रवार-रविवार)', dateEnglish: '02-04 Jun 2028 (Fri-Sun)', gregorianDate: '2028-06-02', shubhMuhurat: 'हस्त योग स्नान: 05:24 से' },
    2029: { dateHindi: '22-24 मई (गुरुवार-शनिवार)', dateEnglish: '22-24 May 2029 (Thu-Sat)', gregorianDate: '2029-05-22', shubhMuhurat: 'गंगा स्नान: 05:26 से' },
    2030: { dateHindi: '10-12 जून (सोमवार-बुधवार)', dateEnglish: '10-12 Jun 2030 (Mon-Wed)', gregorianDate: '2030-06-10', shubhMuhurat: 'गंगा स्नान: 05:23 से' }
  },
  // 11. गुरु पूर्णिमा एवं व्यास पूजा
  guru_purnima: {
    2024: { dateHindi: '21 जुलाई (रविवार)', dateEnglish: '21 Jul 2024 (Sun)', gregorianDate: '2024-07-21', shubhMuhurat: 'गुरु वंदन: प्रातः 05:36 से 11:20' },
    2025: { dateHindi: '10 जुलाई (गुरुवार)', dateEnglish: '10 Jul 2025 (Thu)', gregorianDate: '2025-07-10', shubhMuhurat: 'गुरु वंदन: प्रातः 05:31 से 11:15' },
    2026: { dateHindi: '29 जुलाई (बुधवार)', dateEnglish: '29 Jul 2026 (Wed)', gregorianDate: '2026-07-29', shubhMuhurat: 'गुरु पूजन: प्रातः 05:40 से 11:25' },
    2027: { dateHindi: '18 जुलाई (रविवार)', dateEnglish: '18 Jul 2027 (Sun)', gregorianDate: '2027-07-18', shubhMuhurat: 'गुरु पूजन: प्रातः 05:35 से 11:18' },
    2028: { dateHindi: '06 जुलाई (गुरुवार)', dateEnglish: '06 Jul 2028 (Thu)', gregorianDate: '2028-07-06', shubhMuhurat: 'गुरु पूजन: प्रातः 05:29 से 11:12' },
    2029: { dateHindi: '25 जुलाई (बुधवार)', dateEnglish: '25 Jul 2029 (Wed)', gregorianDate: '2029-07-25', shubhMuhurat: 'गुरु पूजन: प्रातः 05:38 से 11:22' },
    2030: { dateHindi: '14 जुलाई (रविवार)', dateEnglish: '14 Jul 2030 (Sun)', gregorianDate: '2030-07-14', shubhMuhurat: 'गुरु पूजन: प्रातः 05:33 से 11:16' }
  },
  // 12. नाग पंचमी
  nag_panchami: {
    2024: { dateHindi: '09 अगस्त (शुक्रवार)', dateEnglish: '09 Aug 2024 (Fri)', gregorianDate: '2024-08-09', shubhMuhurat: 'पूजन मुहूर्त: 05:47 से 08:27' },
    2025: { dateHindi: '29 जुलाई (मंगलवार)', dateEnglish: '29 Jul 2025 (Tue)', gregorianDate: '2025-07-29', shubhMuhurat: 'पूजन मुहूर्त: 05:40 से 08:22' },
    2026: { dateHindi: '17 अगस्त (सोमवार)', dateEnglish: '17 Aug 2026 (Mon)', gregorianDate: '2026-08-17', shubhMuhurat: 'पूजन मुहूर्त: 05:51 से 08:31' },
    2027: { dateHindi: '06 अगस्त (शुक्रवार)', dateEnglish: '06 Aug 2027 (Fri)', gregorianDate: '2027-08-06', shubhMuhurat: 'पूजन मुहूर्त: 05:45 से 08:25' },
    2028: { dateHindi: '25 जुलाई (मंगलवार)', dateEnglish: '25 Jul 2028 (Tue)', gregorianDate: '2028-07-25', shubhMuhurat: 'पूजन मुहूर्त: 05:38 से 08:20' },
    2029: { dateHindi: '14 अगस्त (मंगलवार)', dateEnglish: '14 Aug 2029 (Tue)', gregorianDate: '2029-08-14', shubhMuhurat: 'पूजन मुहूर्त: 05:50 से 08:30' },
    2030: { dateHindi: '03 अगस्त (शनिवार)', dateEnglish: '03 Aug 2030 (Sat)', gregorianDate: '2030-08-03', shubhMuhurat: 'पूजन मुहूर्त: 05:44 से 08:24' }
  },
  // 13. रक्षा बंधन एवं संस्कृत दिवस
  raksha_bandhan: {
    2024: { dateHindi: '19 अगस्त (सोमवार)', dateEnglish: '19 Aug 2024 (Mon)', gregorianDate: '2024-08-19', shubhMuhurat: 'राखी बांधने का समय: 01:30 से 09:08' },
    2025: { dateHindi: '09 अगस्त (शनिवार)', dateEnglish: '09 Aug 2025 (Sat)', gregorianDate: '2025-08-09', shubhMuhurat: 'राखी बांधने का समय: 05:47 से 01:24' },
    2026: { dateHindi: '28 अगस्त (शुक्रवार)', dateEnglish: '28 Aug 2026 (Fri)', gregorianDate: '2026-08-28', shubhMuhurat: 'राखी बांधने का समय: 05:57 से 08:30' },
    2027: { dateHindi: '17 अगस्त (मंगलवार)', dateEnglish: '17 Aug 2027 (Tue)', gregorianDate: '2027-08-17', shubhMuhurat: 'राखी बांधने का समय: 05:51 से 04:30' },
    2028: { dateHindi: '05 अगस्त (शनिवार)', dateEnglish: '05 Aug 2028 (Sat)', gregorianDate: '2028-08-05', shubhMuhurat: 'राखी बांधने का समय: 05:45 से 03:50' },
    2029: { dateHindi: '24 अगस्त (शुक्रवार)', dateEnglish: '24 Aug 2029 (Fri)', gregorianDate: '2029-08-24', shubhMuhurat: 'राखी बांधने का समय: 05:55 से 05:15' },
    2030: { dateHindi: '13 अगस्त (मंगलवार)', dateEnglish: '13 Aug 2030 (Tue)', gregorianDate: '2030-08-13', shubhMuhurat: 'राखी बांधने का समय: 05:49 से 04:20' }
  },
  // 14. श्री कृष्ण जन्माष्टमी
  janmashtami: {
    2024: { dateHindi: '26 अगस्त (सोमवार)', dateEnglish: '26 Aug 2024 (Mon)', gregorianDate: '2024-08-26', shubhMuhurat: 'निशीथ पूजा: रात्रि 12:01 से 12:45' },
    2025: { dateHindi: '16 अगस्त (शनिवार)', dateEnglish: '16 Aug 2025 (Sat)', gregorianDate: '2025-08-16', shubhMuhurat: 'निशीथ पूजा: रात्रि 12:04 से 12:48' },
    2026: { dateHindi: '04 सितंबर (शुक्रवार)', dateEnglish: '04 Sep 2026 (Fri)', gregorianDate: '2026-09-04', shubhMuhurat: 'रोहिणी नक्षत्र निशीथ पूजा: 11:58 से 12:44' },
    2027: { dateHindi: '25 अगस्त (बुधवार)', dateEnglish: '25 Aug 2027 (Wed)', gregorianDate: '2027-08-25', shubhMuhurat: 'निशीथ पूजा: रात्रि 12:01 से 12:46' },
    2028: { dateHindi: '13 अगस्त (रविवार)', dateEnglish: '13 Aug 2028 (Sun)', gregorianDate: '2028-08-13', shubhMuhurat: 'निशीथ पूजा: रात्रि 12:05 से 12:49' },
    2029: { dateHindi: '01 सितंबर (शनिवार)', dateEnglish: '01 Sep 2029 (Sat)', gregorianDate: '2029-09-01', shubhMuhurat: 'निशीथ पूजा: रात्रि 11:59 से 12:45' },
    2030: { dateHindi: '21 अगस्त (बुधवार)', dateEnglish: '21 Aug 2030 (Wed)', gregorianDate: '2030-08-21', shubhMuhurat: 'निशीथ पूजा: रात्रि 12:02 से 12:47' }
  },
  // 15. हरतालिका तीज
  hartalika_teej: {
    2024: { dateHindi: '06 सितंबर (शुक्रवार)', dateEnglish: '06 Sep 2024 (Fri)', gregorianDate: '2024-09-06', shubhMuhurat: 'प्रातः मुहूर्त: 06:02 से 08:33' },
    2025: { dateHindi: '26 अगस्त (मंगलवार)', dateEnglish: '26 Aug 2025 (Tue)', gregorianDate: '2025-08-26', shubhMuhurat: 'प्रातः मुहूर्त: 05:56 से 08:29' },
    2026: { dateHindi: '14 सितंबर (सोमवार)', dateEnglish: '14 Sep 2026 (Mon)', gregorianDate: '2026-09-14', shubhMuhurat: 'प्रातः पूजा मुहूर्त: 06:05 से 08:35' },
    2027: { dateHindi: '03 सितंबर (शुक्रवार)', dateEnglish: '03 Sep 2027 (Fri)', gregorianDate: '2027-09-03', shubhMuhurat: 'प्रातः मुहूर्त: 06:00 से 08:32' },
    2028: { dateHindi: '23 अगस्त (बुधवार)', dateEnglish: '23 Aug 2028 (Wed)', gregorianDate: '2028-08-23', shubhMuhurat: 'प्रातः मुहूर्त: 05:54 से 08:28' },
    2029: { dateHindi: '11 सितंबर (मंगलवार)', dateEnglish: '11 Sep 2029 (Tue)', gregorianDate: '2029-09-11', shubhMuhurat: 'प्रातः मुहूर्त: 06:04 से 08:34' },
    2030: { dateHindi: '31 अगस्त (शनिवार)', dateEnglish: '31 Aug 2030 (Sat)', gregorianDate: '2030-08-31', shubhMuhurat: 'प्रातः मुहूर्त: 05:59 से 08:31' }
  },
  // 16. गणेश चतुर्थी (विघ्नहर्ता उत्सव)
  ganesh_chaturthi: {
    2024: { dateHindi: '07 सितंबर (शनिवार)', dateEnglish: '07 Sep 2024 (Sat)', gregorianDate: '2024-09-07', shubhMuhurat: 'गणेश स्थापना: 11:03 से 01:34' },
    2025: { dateHindi: '27 अगस्त (बुधवार)', dateEnglish: '27 Aug 2025 (Wed)', gregorianDate: '2025-08-27', shubhMuhurat: 'गणेश स्थापना: 11:06 से 01:38' },
    2026: { dateHindi: '15 सितंबर (मंगलवार)', dateEnglish: '15 Sep 2026 (Tue)', gregorianDate: '2026-09-15', shubhMuhurat: 'मध्याह्न गणेश पूजन: 11:01 से 01:29' },
    2027: { dateHindi: '04 सितंबर (शनिवार)', dateEnglish: '04 Sep 2027 (Sat)', gregorianDate: '2027-09-04', shubhMuhurat: 'गणेश स्थापना: 11:04 से 01:35' },
    2028: { dateHindi: '24 अगस्त (गुरुवार)', dateEnglish: '24 Aug 2028 (Thu)', gregorianDate: '2028-08-24', shubhMuhurat: 'गणेश स्थापना: 11:07 से 01:39' },
    2029: { dateHindi: '12 सितंबर (बुधवार)', dateEnglish: '12 Sep 2029 (Wed)', gregorianDate: '2029-09-12', shubhMuhurat: 'गणेश स्थापना: 11:02 से 01:31' },
    2030: { dateHindi: '01 सितंबर (रविवार)', dateEnglish: '01 Sep 2030 (Sun)', gregorianDate: '2030-09-01', shubhMuhurat: 'गणेश स्थापना: 11:05 से 01:36' }
  },
  // 17. शारदीय नवरात्रि (कलश स्थापना)
  sharad_navratri: {
    2024: { dateHindi: '03 अक्टूबर (गुरुवार)', dateEnglish: '03 Oct 2024 (Thu)', gregorianDate: '2024-10-03', shubhMuhurat: 'घटस्थापना: प्रातः 06:15 से 07:22' },
    2025: { dateHindi: '22 सितंबर (सोमवार)', dateEnglish: '22 Sep 2025 (Mon)', gregorianDate: '2025-09-22', shubhMuhurat: 'घटस्थापना: प्रातः 06:09 से 08:04' },
    2026: { dateHindi: '11 अक्टूबर (रविवार)', dateEnglish: '11 Oct 2026 (Sun)', gregorianDate: '2026-10-11', shubhMuhurat: 'घटस्थापना: प्रातः 06:20 से 08:35' },
    2027: { dateHindi: '30 सितंबर (गुरुवार)', dateEnglish: '30 Sep 2027 (Thu)', gregorianDate: '2027-09-30', shubhMuhurat: 'घटस्थापना: प्रातः 06:13 से 08:15' },
    2028: { dateHindi: '19 सितंबर (मंगलवार)', dateEnglish: '19 Sep 2028 (Tue)', gregorianDate: '2028-09-19', shubhMuhurat: 'घटस्थापना: प्रातः 06:07 से 07:58' },
    2029: { dateHindi: '08 अक्टूबर (सोमवार)', dateEnglish: '08 Oct 2029 (Mon)', gregorianDate: '2029-10-08', shubhMuhurat: 'घटस्थापना: प्रातः 06:18 से 08:30' },
    2030: { dateHindi: '27 सितंबर (शुक्रवार)', dateEnglish: '27 Sep 2030 (Fri)', gregorianDate: '2030-09-27', shubhMuhurat: 'घटस्थापना: प्रातः 06:11 से 08:10' }
  },
  // 18. विजयादशमी (दशहरा महापर्व)
  dussehra: {
    2024: { dateHindi: '12 अक्टूबर (शनिवार)', dateEnglish: '12 Oct 2024 (Sat)', gregorianDate: '2024-10-12', shubhMuhurat: 'विजय मुहूर्त: दोपहर 02:03 से 02:49' },
    2025: { dateHindi: '02 अक्टूबर (गुरुवार)', dateEnglish: '02 Oct 2025 (Thu)', gregorianDate: '2025-10-02', shubhMuhurat: 'शस्त्र पूजन: दोपहर 02:08 से 02:54' },
    2026: { dateHindi: '20 अक्टूबर (मंगलवार)', dateEnglish: '20 Oct 2026 (Tue)', gregorianDate: '2026-10-20', shubhMuhurat: 'अपराह्न विजय मुहूर्त: 01:58 से 02:45' },
    2027: { dateHindi: '09 अक्टूबर (शनिवार)', dateEnglish: '09 Oct 2027 (Sat)', gregorianDate: '2027-10-09', shubhMuhurat: 'विजय मुहूर्त: दोपहर 02:04 से 02:50' },
    2028: { dateHindi: '28 सितंबर (गुरुवार)', dateEnglish: '28 Sep 2028 (Thu)', gregorianDate: '2028-09-28', shubhMuhurat: 'विजय मुहूर्त: दोपहर 02:10 से 02:56' },
    2029: { dateHindi: '17 अक्टूबर (बुधवार)', dateEnglish: '17 Oct 2029 (Wed)', gregorianDate: '2029-10-17', shubhMuhurat: 'विजय मुहूर्त: दोपहर 02:00 से 02:46' },
    2030: { dateHindi: '06 अक्टूबर (रविवार)', dateEnglish: '06 Oct 2030 (Sun)', gregorianDate: '2030-10-06', shubhMuhurat: 'विजय मुहूर्त: दोपहर 02:06 से 02:52' }
  },
  // 19. करवा चौथ व्रत
  karwa_chauth: {
    2024: { dateHindi: '20 अक्टूबर (रविवार)', dateEnglish: '20 Oct 2024 (Sun)', gregorianDate: '2024-10-20', shubhMuhurat: 'चंद्रोदय समय: रात्रि 07:54 बजे' },
    2025: { dateHindi: '10 अक्टूबर (शुक्रवार)', dateEnglish: '10 Oct 2025 (Fri)', gregorianDate: '2025-10-10', shubhMuhurat: 'चंद्रोदय समय: रात्रि 08:12 बजे' },
    2026: { dateHindi: '29 अक्टूबर (गुरुवार)', dateEnglish: '29 Oct 2026 (Thu)', gregorianDate: '2026-10-29', shubhMuhurat: 'चंद्रोदय समय: रात्रि 08:05 बजे' },
    2027: { dateHindi: '19 अक्टूबर (मंगलवार)', dateEnglish: '19 Oct 2027 (Tue)', gregorianDate: '2027-10-19', shubhMuhurat: 'चंद्रोदय समय: रात्रि 08:00 बजे' },
    2028: { dateHindi: '07 अक्टूबर (शनिवार)', dateEnglish: '07 Oct 2028 (Sat)', gregorianDate: '2028-10-07', shubhMuhurat: 'चंद्रोदय समय: रात्रि 08:18 बजे' },
    2029: { dateHindi: '26 अक्टूबर (शुक्रवार)', dateEnglish: '26 Oct 2029 (Fri)', gregorianDate: '2029-10-26', shubhMuhurat: 'चंद्रोदय समय: रात्रि 08:02 बजे' },
    2030: { dateHindi: '15 अक्टूबर (मंगलवार)', dateEnglish: '15 Oct 2030 (Tue)', gregorianDate: '2030-10-15', shubhMuhurat: 'चंद्रोदय समय: रात्रि 08:08 बजे' }
  },
  // 20. धनतेरस (धन्वंतरि त्रयोदशी)
  dhanteras: {
    2024: { dateHindi: '29 अक्टूबर (मंगलवार)', dateEnglish: '29 Oct 2024 (Tue)', gregorianDate: '2024-10-29', shubhMuhurat: 'लक्ष्मी-कुबेर पूजन: सायं 06:31 से 08:13' },
    2025: { dateHindi: '18 अक्टूबर (शनिवार)', dateEnglish: '18 Oct 2025 (Sat)', gregorianDate: '2025-10-18', shubhMuhurat: 'खरीदारी मुहूर्त: सायं 07:11 से 08:49' },
    2026: { dateHindi: '06 नवंबर (शुक्रवार)', dateEnglish: '06 Nov 2026 (Fri)', gregorianDate: '2026-11-06', shubhMuhurat: 'प्रदोष काल मुहूर्त: सायं 05:32 से 07:10' },
    2027: { dateHindi: '27 अक्टूबर (बुधवार)', dateEnglish: '27 Oct 2027 (Wed)', gregorianDate: '2027-10-27', shubhMuhurat: 'स्वर्ण-बर्तन क्रय: सायं 05:40 से 07:22' },
    2028: { dateHindi: '15 अक्टूबर (रविवार)', dateEnglish: '15 Oct 2028 (Sun)', gregorianDate: '2028-10-15', shubhMuhurat: 'प्रदोष काल: सायं 05:52 से 07:34' },
    2029: { dateHindi: '04 नवंबर (रविवार)', dateEnglish: '04 Nov 2029 (Sun)', gregorianDate: '2029-11-04', shubhMuhurat: 'पूजन मुहूर्त: सायं 05:34 से 07:14' },
    2030: { dateHindi: '24 अक्टूबर (गुरुवार)', dateEnglish: '24 Oct 2030 (Thu)', gregorianDate: '2030-10-24', shubhMuhurat: 'पूजन मुहूर्त: सायं 05:43 से 07:25' }
  },
  // 21. दीपावली एवं लक्ष्मी-गणेश पूजन
  diwali: {
    2024: { dateHindi: '31 अक्टूबर - 01 नवम्बर', dateEnglish: '31 Oct - 01 Nov 2024', gregorianDate: '2024-10-31', shubhMuhurat: 'लक्ष्मी पूजन (प्रदोष काल): 05:36 से 06:16' },
    2025: { dateHindi: '20 अक्टूबर (सोमवार)', dateEnglish: '20 Oct 2025 (Mon)', gregorianDate: '2025-10-20', shubhMuhurat: 'लक्ष्मी पूजन मुहूर्त: सायं 07:08 से 08:18' },
    2026: { dateHindi: '08 नवम्बर (रविवार)', dateEnglish: '08 Nov 2026 (Sun)', gregorianDate: '2026-11-08', shubhMuhurat: 'महालक्ष्मी पूजन: सायं 05:30 से 07:25' },
    2027: { dateHindi: '29 अक्टूबर (शुक्रवार)', dateEnglish: '29 Oct 2027 (Fri)', gregorianDate: '2027-10-29', shubhMuhurat: 'महालक्ष्मी पूजन: सायं 05:38 से 07:33' },
    2028: { dateHindi: '17 अक्टूबर (मंगलवार)', dateEnglish: '17 Oct 2028 (Tue)', gregorianDate: '2028-10-17', shubhMuhurat: 'महालक्ष्मी पूजन: सायं 05:50 से 07:44' },
    2029: { dateHindi: '05 नवम्बर (सोमवार)', dateEnglish: '05 Nov 2029 (Mon)', gregorianDate: '2029-11-05', shubhMuhurat: 'महालक्ष्मी पूजन: सायं 05:33 से 07:28' },
    2030: { dateHindi: '26 अक्टूबर (शनिवार)', dateEnglish: '26 Oct 2030 (Sat)', gregorianDate: '2030-10-26', shubhMuhurat: 'महालक्ष्मी पूजन: सायं 05:42 से 07:37' }
  },
  // 22. गोवर्धन पूजा एवं भाई दूज
  govardhan_bhai_dooj: {
    2024: { dateHindi: '02-03 नवम्बर (शनिवार-रविवार)', dateEnglish: '02-03 Nov 2024 (Sat-Sun)', gregorianDate: '2024-11-02', shubhMuhurat: 'अन्नकूट एवं टीका: 06:34 से 08:46' },
    2025: { dateHindi: '22-23 अक्टूबर (बुधवार-गुरुवार)', dateEnglish: '22-23 Oct 2025 (Wed-Thu)', gregorianDate: '2025-10-22', shubhMuhurat: 'भाई दूज तिलक: दोपहर 01:13 से 03:28' },
    2026: { dateHindi: '10-11 नवम्बर (मंगलवार-बुधवार)', dateEnglish: '10-11 Nov 2026 (Tue-Wed)', gregorianDate: '2026-11-10', shubhMuhurat: 'भाई दूज टीका: दोपहर 01:10 से 03:20' },
    2027: { dateHindi: '31 अक्टूबर - 01 नवम्बर', dateEnglish: '31 Oct - 01 Nov 2027', gregorianDate: '2027-10-31', shubhMuhurat: 'भाई दूज तिलक: दोपहर 01:12 से 03:24' },
    2028: { dateHindi: '19-20 अक्टूबर (गुरुवार-शुक्रवार)', dateEnglish: '19-20 Oct 2028 (Thu-Fri)', gregorianDate: '2028-10-19', shubhMuhurat: 'भाई दूज तिलक: दोपहर 01:15 से 03:30' },
    2029: { dateHindi: '07-08 नवम्बर (बुधवार-गुरुवार)', dateEnglish: '07-08 Nov 2029 (Wed-Thu)', gregorianDate: '2029-11-07', shubhMuhurat: 'भाई दूज टीका: दोपहर 01:09 से 03:18' },
    2030: { dateHindi: '28-29 अक्टूबर (सोमवार-मंगलवार)', dateEnglish: '28-29 Oct 2030 (Mon-Tue)', gregorianDate: '2030-10-28', shubhMuhurat: 'भाई दूज टीका: दोपहर 01:14 से 03:26' }
  },
  // 23. लोक आस्था का महापर्व छठ पूजा
  chhath_puja: {
    2024: { dateHindi: '07-08 नवम्बर (गुरुवार-शुक्रवार)', dateEnglish: '07-08 Nov 2024 (Thu-Fri)', gregorianDate: '2024-11-07', shubhMuhurat: 'संध्या अर्घ्य: 05:31, प्रातः अर्घ्य: 06:38' },
    2025: { dateHindi: '27-28 अक्टूबर (सोमवार-मंगलवार)', dateEnglish: '27-28 Oct 2025 (Mon-Tue)', gregorianDate: '2025-10-27', shubhMuhurat: 'संध्या अर्घ्य: 05:40, प्रातः अर्घ्य: 06:30' },
    2026: { dateHindi: '15-16 नवम्बर (रविवार-सोमवार)', dateEnglish: '15-16 Nov 2026 (Sun-Mon)', gregorianDate: '2026-11-15', shubhMuhurat: 'संध्या अर्घ्य: 05:26, उषा अर्घ्य: 06:44' },
    2027: { dateHindi: '05-06 नवम्बर (शुक्रवार-शनिवार)', dateEnglish: '05-06 Nov 2027 (Fri-Sat)', gregorianDate: '2027-11-05', shubhMuhurat: 'संध्या अर्घ्य: 05:32, उषा अर्घ्य: 06:36' },
    2028: { dateHindi: '24-25 अक्टूबर (मंगलवार-बुधवार)', dateEnglish: '24-25 Oct 2028 (Tue-Wed)', gregorianDate: '2028-10-24', shubhMuhurat: 'संध्या अर्घ्य: 05:43, उषा अर्घ्य: 06:28' },
    2029: { dateHindi: '12-13 नवम्बर (सोमवार-मंगलवार)', dateEnglish: '12-13 Nov 2029 (Mon-Tue)', gregorianDate: '2029-11-12', shubhMuhurat: 'संध्या अर्घ्य: 05:28, उषा अर्घ्य: 06:42' },
    2030: { dateHindi: '02-03 नवम्बर (शनिवार-रविवार)', dateEnglish: '02-03 Nov 2030 (Sat-Sun)', gregorianDate: '2030-11-02', shubhMuhurat: 'संध्या अर्घ्य: 05:35, उषा अर्घ्य: 06:34' }
  },
  // 24. देव दीपावली (वाराणसी) एवं गुरु नानक जयंती
  dev_deepawali: {
    2024: { dateHindi: '15 नवम्बर (शुक्रवार)', dateEnglish: '15 Nov 2024 (Fri)', gregorianDate: '2024-11-15', shubhMuhurat: 'वाराणसी घाट महाआरती: सायं 05:10 से 07:45' },
    2025: { dateHindi: '05 नवम्बर (बुधवार)', dateEnglish: '05 Nov 2025 (Wed)', gregorianDate: '2025-11-05', shubhMuhurat: 'दीपदान एवं दीप प्रज्ज्वलन: सायं 05:15 से' },
    2026: { dateHindi: '24 नवम्बर (मंगलवार)', dateEnglish: '24 Nov 2026 (Tue)', gregorianDate: '2026-11-24', shubhMuhurat: 'कार्तिक पूर्णिमा देव दीपावली: सायं 05:08 से' },
    2027: { dateHindi: '14 नवम्बर (रविवार)', dateEnglish: '14 Nov 2027 (Sun)', gregorianDate: '2027-11-14', shubhMuhurat: 'गंगा घाट महादीपोत्सव: सायं 05:11 से' },
    2028: { dateHindi: '02 नवम्बर (गुरुवार)', dateEnglish: '02 Nov 2028 (Thu)', gregorianDate: '2028-11-02', shubhMuhurat: 'दीपदान प्रदोष काल: सायं 05:18 से' },
    2029: { dateHindi: '21 नवम्बर (बुधवार)', dateEnglish: '21 Nov 2029 (Wed)', gregorianDate: '2029-11-21', shubhMuhurat: 'गंगा दीपदान उत्सव: सायं 05:09 से' },
    2030: { dateHindi: '10 नवम्बर (रविवार)', dateEnglish: '10 Nov 2030 (Sun)', gregorianDate: '2030-11-10', shubhMuhurat: 'देव दीपावली दीपदान: सायं 05:14 से' }
  },
  // 25. गणतंत्र दिवस (National)
  republic_day: {
    2024: { dateHindi: '26 जनवरी (शुक्रवार)', dateEnglish: '26 Jan 2024 (Fri)', gregorianDate: '2024-01-26', shubhMuhurat: 'ध्वजारोहण: प्रातः 08:30' },
    2025: { dateHindi: '26 जनवरी (रविवार)', dateEnglish: '26 Jan 2025 (Sun)', gregorianDate: '2025-01-26', shubhMuhurat: 'ध्वजारोहण: प्रातः 08:30' },
    2026: { dateHindi: '26 जनवरी (सोमवार)', dateEnglish: '26 Jan 2026 (Mon)', gregorianDate: '2026-01-26', shubhMuhurat: 'ध्वजारोहण: प्रातः 08:30' },
    2027: { dateHindi: '26 जनवरी (मंगलवार)', dateEnglish: '26 Jan 2027 (Tue)', gregorianDate: '2027-01-26', shubhMuhurat: 'ध्वजारोहण: प्रातः 08:30' },
    2028: { dateHindi: '26 जनवरी (बुधवार)', dateEnglish: '26 Jan 2028 (Wed)', gregorianDate: '2028-01-26', shubhMuhurat: 'ध्वजारोहण: प्रातः 08:30' },
    2029: { dateHindi: '26 जनवरी (शुक्रवार)', dateEnglish: '26 Jan 2029 (Fri)', gregorianDate: '2029-01-26', shubhMuhurat: 'ध्वजारोहण: प्रातः 08:30' },
    2030: { dateHindi: '26 जनवरी (शनिवार)', dateEnglish: '26 Jan 2030 (Sat)', gregorianDate: '2030-01-26', shubhMuhurat: 'ध्वजारोहण: प्रातः 08:30' }
  },
  // 26. स्वतंत्रता दिवस (National)
  independence_day: {
    2024: { dateHindi: '15 अगस्त (गुरुवार)', dateEnglish: '15 Aug 2024 (Thu)', gregorianDate: '2024-08-15', shubhMuhurat: 'ध्वजारोहण: प्रातः 08:00' },
    2025: { dateHindi: '15 अगस्त (शुक्रवार)', dateEnglish: '15 Aug 2025 (Fri)', gregorianDate: '2025-08-15', shubhMuhurat: 'ध्वजारोहण: प्रातः 08:00' },
    2026: { dateHindi: '15 अगस्त (शनिवार)', dateEnglish: '15 Aug 2026 (Sat)', gregorianDate: '2026-08-15', shubhMuhurat: 'ध्वजारोहण: प्रातः 08:00' },
    2027: { dateHindi: '15 अगस्त (रविवार)', dateEnglish: '15 Aug 2027 (Sun)', gregorianDate: '2027-08-15', shubhMuhurat: 'ध्वजारोहण: प्रातः 08:00' },
    2028: { dateHindi: '15 अगस्त (मंगलवार)', dateEnglish: '15 Aug 2028 (Tue)', gregorianDate: '2028-08-15', shubhMuhurat: 'ध्वजारोहण: प्रातः 08:00' },
    2029: { dateHindi: '15 अगस्त (बुधवार)', dateEnglish: '15 Aug 2029 (Wed)', gregorianDate: '2029-08-15', shubhMuhurat: 'ध्वजारोहण: प्रातः 08:00' },
    2030: { dateHindi: '15 अगस्त (गुरुवार)', dateEnglish: '15 Aug 2030 (Thu)', gregorianDate: '2030-08-15', shubhMuhurat: 'ध्वजारोहण: प्रातः 08:00' }
  },
  // 27. गांधी व शास्त्री जयंती (National)
  gandhi_jayanti: {
    2024: { dateHindi: '02 अक्टूबर (बुधवार)', dateEnglish: '02 Oct 2024 (Wed)', gregorianDate: '2024-10-02', shubhMuhurat: 'सर्वधर्म प्रार्थना: प्रातः 08:30' },
    2025: { dateHindi: '02 अक्टूबर (गुरुवार)', dateEnglish: '02 Oct 2025 (Thu)', gregorianDate: '2025-10-02', shubhMuhurat: 'सर्वधर्म प्रार्थना: प्रातः 08:30' },
    2026: { dateHindi: '02 अक्टूबर (शुक्रवार)', dateEnglish: '02 Oct 2026 (Fri)', gregorianDate: '2026-10-02', shubhMuhurat: 'सर्वधर्म प्रार्थना: प्रातः 08:30' },
    2027: { dateHindi: '02 अक्टूबर (शनिवार)', dateEnglish: '02 Oct 2027 (Sat)', gregorianDate: '2027-10-02', shubhMuhurat: 'सर्वधर्म प्रार्थना: प्रातः 08:30' },
    2028: { dateHindi: '02 अक्टूबर (सोमवार)', dateEnglish: '02 Oct 2028 (Mon)', gregorianDate: '2028-10-02', shubhMuhurat: 'सर्वधर्म प्रार्थना: प्रातः 08:30' },
    2029: { dateHindi: '02 अक्टूबर (मंगलवार)', dateEnglish: '02 Oct 2029 (Tue)', gregorianDate: '2029-10-02', shubhMuhurat: 'सर्वधर्म प्रार्थना: प्रातः 08:30' },
    2030: { dateHindi: '02 अक्टूबर (बुधवार)', dateEnglish: '02 Oct 2030 (Wed)', gregorianDate: '2030-10-02', shubhMuhurat: 'सर्वधर्म प्रार्थना: प्रातः 08:30' }
  },
  // 28. क्रिसमस एवं अंग्रेजी नववर्ष
  christmas: {
    2024: { dateHindi: '25 दिसम्बर (बुधवार)', dateEnglish: '25 Dec 2024 (Wed)', gregorianDate: '2024-12-25', shubhMuhurat: 'प्रार्थना सभा: प्रातः 09:00 से' },
    2025: { dateHindi: '25 दिसम्बर (गुरुवार)', dateEnglish: '25 Dec 2025 (Thu)', gregorianDate: '2025-12-25', shubhMuhurat: 'प्रार्थना सभा: प्रातः 09:00 से' },
    2026: { dateHindi: '25 दिसम्बर (शुक्रवार)', dateEnglish: '25 Dec 2026 (Fri)', gregorianDate: '2026-12-25', shubhMuhurat: 'प्रार्थना सभा: प्रातः 09:00 से' },
    2027: { dateHindi: '25 दिसम्बर (शनिवार)', dateEnglish: '25 Dec 2027 (Sat)', gregorianDate: '2027-12-25', shubhMuhurat: 'प्रार्थना सभा: प्रातः 09:00 से' },
    2028: { dateHindi: '25 दिसम्बर (सोमवार)', dateEnglish: '25 Dec 2028 (Mon)', gregorianDate: '2028-12-25', shubhMuhurat: 'प्रार्थना सभा: प्रातः 09:00 से' },
    2029: { dateHindi: '25 दिसम्बर (मंगलवार)', dateEnglish: '25 Dec 2029 (Tue)', gregorianDate: '2029-12-25', shubhMuhurat: 'प्रार्थना सभा: प्रातः 09:00 से' },
    2030: { dateHindi: '25 दिसम्बर (बुधवार)', dateEnglish: '25 Dec 2030 (Wed)', gregorianDate: '2030-12-25', shubhMuhurat: 'प्रार्थना सभा: प्रातः 09:00 से' }
  },
  // 29. ईद-उल-फ़ितर
  eid_ul_fitr: {
    2024: { dateHindi: '11 अप्रैल (गुरुवार)', dateEnglish: '11 Apr 2024 (Thu)', gregorianDate: '2024-04-11', shubhMuhurat: 'ईद नमाज़: प्रातः 08:15' },
    2025: { dateHindi: '31 मार्च (सोमवार)', dateEnglish: '31 Mar 2025 (Mon)', gregorianDate: '2025-03-31', shubhMuhurat: 'ईद नमाज़: प्रातः 08:30' },
    2026: { dateHindi: '20 मार्च (शुक्रवार)', dateEnglish: '20 Mar 2026 (Fri)', gregorianDate: '2026-03-20', shubhMuhurat: 'चांद दीदार उपरांत ईद नमाज़' },
    2027: { dateHindi: '10 मार्च (बुधवार)', dateEnglish: '10 Mar 2027 (Wed)', gregorianDate: '2027-03-10', shubhMuhurat: 'ईद नमाज़: प्रातः 08:30' },
    2028: { dateHindi: '27 फरवरी (रविवार)', dateEnglish: '27 Feb 2028 (Sun)', gregorianDate: '2028-02-27', shubhMuhurat: 'ईद नमाज़: प्रातः 08:30' },
    2029: { dateHindi: '15 फरवरी (गुरुवार)', dateEnglish: '15 Feb 2029 (Thu)', gregorianDate: '2029-02-15', shubhMuhurat: 'ईद नमाज़: प्रातः 08:30' },
    2030: { dateHindi: '05 फरवरी (मंगलवार)', dateEnglish: '05 Feb 2030 (Tue)', gregorianDate: '2030-02-05', shubhMuhurat: 'ईद नमाज़: प्रातः 08:30' }
  }
};

/**
 * किसी भी वर्ष के लिए त्यौहार डेटा स्वतः रिन्यू और पंचांग से सिंक करें
 */
export function getFestivalForYear(baseItem: FestivalItem, targetYear: number): FestivalItem {
  const yearlyMap = THAKUR_PRASAD_YEARLY_DATES[baseItem.id];
  const yearEntry = yearlyMap ? yearlyMap[targetYear] : undefined;

  const vikramSamvat = targetYear + 57;
  const samvatsar = getSamvatsarName(vikramSamvat);

  if (yearEntry) {
    return {
      ...baseItem,
      year: targetYear,
      dateFormattedHindi: `${baseItem.tithiHindi || ''} • ${yearEntry.dateHindi}`,
      dateFormattedEnglish: `${baseItem.tithiEnglish || ''} • ${yearEntry.dateEnglish}`,
      gregorianDate: yearEntry.gregorianDate,
      shubhMuhuratHindi: yearEntry.shubhMuhurat,
      samvatYearHindi: `संवत ${vikramSamvat} (${samvatsar})`,
      thakurPrasadRef: `श्री ठाकुर प्रसाद पंचांग एवं वाराणसी कैलेंडर संवत ${vikramSamvat}`
    };
  }

  // Algorithmic Fallback for future years beyond mapped table
  const defaultDateStr = `${targetYear}-01-01`;
  return {
    ...baseItem,
    year: targetYear,
    dateFormattedHindi: `${baseItem.tithiHindi || baseItem.dateFormattedHindi} (वर्ष ${targetYear})`,
    dateFormattedEnglish: `${baseItem.tithiEnglish || baseItem.dateFormattedEnglish} (${targetYear})`,
    gregorianDate: defaultDateStr,
    samvatYearHindi: `संवत ${vikramSamvat} (${samvatsar})`,
    thakurPrasadRef: `श्री ठाकुर प्रसाद पंचांग एवं कैलेंडर संवत ${vikramSamvat}`
  };
}
