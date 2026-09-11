import { DonationRecord } from '../types';

export const DONORS_DATA: DonationRecord[] = [
  // Diamond Donors (₹2,00,000+)
  {
    id: 'JJF-DON-2026-01',
    donorName: 'Shri Brijesh Kumar Rai & Family Trust',
    panNumber: 'AAATB1234F',
    email: 'brijesh.rai.trust@gmail.com',
    phone: '+91-9838012345',
    amount: 250000,
    date: '2026-01-10',
    purpose: 'Complete Rural Smart Education Center & Computer Lab Setup',
    purposeHindi: 'ग्रामीण डिजिटल स्मार्ट स्कूल व 25 कंप्यूटर युक्त आईटी लैब स्थापना',
    paymentMode: 'NEFT / RTGS Bank Transfer',
    transactionRef: 'RTGS/SBIN2601108892',
    taxExemptEligible: true,
    city: 'Ghazipur'
  },
  {
    id: 'JJF-DON-2026-02',
    donorName: 'Purvanchal Welfare Foundation (USA Chapter)',
    panNumber: 'AAATP9876Q',
    email: 'purvanchal.usa@trust.org',
    phone: '+91-9450098765',
    amount: 200000,
    date: '2026-02-14',
    purpose: 'Mobile Medical Van & Emergency Healthcare Camps for 20 Villages',
    purposeHindi: 'चलित स्वास्थ्य सेवा वैन व 20 ग्रामों में निःशुल्क आपात चिकित्सा शिविर',
    paymentMode: 'Direct Bank Wire',
    transactionRef: 'WIRE/HDFC2602143310',
    taxExemptEligible: true,
    city: 'Mohammadabad / USA'
  },

  // Platinum Donors (₹1,00,000+)
  {
    id: 'JJF-DON-2026-03',
    donorName: 'Dr. Anand Prakash Upadhyay & Bros.',
    panNumber: 'BCEPU4567K',
    email: 'dr.anand.upadhyay@medcare.in',
    phone: '+91-9721012345',
    amount: 150000,
    date: '2026-02-28',
    purpose: 'Annual Annapurna Nutritious Food Support for 500 Underprivileged Children',
    purposeHindi: '500 निर्धन बच्चों हेतु वार्षिक अन्नपूर्णा पौष्टिक आहार सहयोग',
    paymentMode: 'IMPS Bank Transfer',
    transactionRef: 'IMPS/260228001923',
    taxExemptEligible: true,
    city: 'Zamania'
  },
  {
    id: 'JJF-DON-2026-04',
    donorName: 'Ganga Valley Infrastructure Pvt. Ltd.',
    panNumber: 'AABCG7788R',
    email: 'csr@gangavalleyinfra.com',
    phone: '+91-9415200331',
    amount: 100000,
    date: '2026-03-10',
    purpose: 'Solar Water Purifiers & Sanitation Stations in 5 Rural Schools',
    purposeHindi: '5 ग्रामीण विद्यालयों में सौर ऊर्जा आधारित शुद्ध पेयजल व स्वच्छता संयंत्र',
    paymentMode: 'Corporate CSR Transfer',
    transactionRef: 'CSR/PNB260310884',
    taxExemptEligible: true,
    city: 'Ghazipur Sadar'
  },

  // Gold Donors (₹50,000+)
  {
    id: 'JJF-DON-2026-05',
    donorName: 'Dr. Ramesh Chandra Rai',
    panNumber: 'ABCDE1234F',
    email: 'dr.ramesh.rai@gmail.com',
    phone: '+91-9876543210',
    amount: 51000,
    date: '2026-01-15',
    purpose: 'Free Evening School Education & Digital Classrooms',
    purposeHindi: 'निशुल्क सांध्यकालीन शिक्षा व डिजिटल क्लासरूम',
    paymentMode: 'UPI / Direct Bank Transfer',
    transactionRef: 'UPI/260115009842',
    taxExemptEligible: true,
    city: 'Ghazipur'
  },
  {
    id: 'JJF-DON-2026-06',
    donorName: 'Shri Vinod Bihari Lal',
    panNumber: 'DEFLB9988C',
    email: 'vinod.bihari.lal@gmail.com',
    phone: '+91-9451122334',
    amount: 50000,
    date: '2026-03-20',
    purpose: 'Free Cataract Eye Surgeries & Eyeglasses Distribution for 100 Seniors',
    purposeHindi: '100 ग्रामीण बुजुर्गों का निःशुल्क मोतियाबिंद ऑपरेशन व चश्मा वितरण',
    paymentMode: 'Net Banking',
    transactionRef: 'NET/SBI260320491',
    taxExemptEligible: true,
    city: 'Saidpur'
  },

  // Silver Donors (₹25,000+)
  {
    id: 'JJF-DON-2026-07',
    donorName: 'Smt. Pratima Devi & Family',
    panNumber: 'FGHIJ5678K',
    email: 'pratima.devi.gzp@gmail.com',
    phone: '+91-9450123456',
    amount: 31000,
    date: '2026-02-01',
    purpose: 'Winter Blanket & Nutrition Kit Drive for 250 Families',
    purposeHindi: 'शीतकालीन कंबल व 250 परिवारों के लिए राशन किट वितरण',
    paymentMode: 'NEFT / RTGS',
    transactionRef: 'NEFT/SBIN260201099',
    taxExemptEligible: true,
    city: 'Mohammadabad'
  },
  {
    id: 'JJF-DON-2026-08',
    donorName: 'Advocate Sunil Kumar Pandey',
    panNumber: 'JKLMN3344T',
    email: 'sunil.pandey.legal@gmail.com',
    phone: '+91-9889771122',
    amount: 25000,
    date: '2026-03-15',
    purpose: 'Women Sewing & Skill Development Center Equipments',
    purposeHindi: 'महिला सिलाई प्रशिक्षण केंद्र हेतु सिलाई मशीन व उपकरण',
    paymentMode: 'UPI Transfer',
    transactionRef: 'UPI/260315998124',
    taxExemptEligible: true,
    city: 'Ghazipur'
  },

  // General Contributors (Below ₹25,000)
  {
    id: 'JJF-DON-2026-09',
    donorName: 'Er. Alok Srivastava',
    panNumber: 'KLMNO9012P',
    email: 'alok.srivastava.tech@gmail.com',
    phone: '+91-9123456780',
    amount: 15000,
    date: '2026-02-18',
    purpose: 'Rural Eye Care & Free Medicine Camp',
    purposeHindi: 'ग्रामीण नेत्र जांच व निशुल्क दवा वितरण शिविर',
    paymentMode: 'UPI',
    transactionRef: 'UPI/260218114421',
    taxExemptEligible: true,
    city: 'Varanasi'
  },
  {
    id: 'JJF-DON-2026-10',
    donorName: 'Shri Manoj Kumar Gupta',
    panNumber: 'PQRST3456U',
    email: 'manoj.gupta.gzp@yahoo.com',
    phone: '+91-9889123456',
    amount: 11000,
    date: '2026-03-05',
    purpose: 'Annapurna Daily Meal Initiative for Slum Children',
    purposeHindi: 'अन्नपूर्णा दैनिक भोजन योजना',
    paymentMode: 'UPI / QR',
    transactionRef: 'UPI/260305882310',
    taxExemptEligible: true,
    city: 'Ghazipur City'
  },
  {
    id: 'JJF-DON-2026-11',
    donorName: 'Smt. Kavita Sharma',
    panNumber: 'UVWXY7890Z',
    email: 'kavita.sharma@outlook.com',
    phone: '+91-9935123987',
    amount: 10000,
    date: '2026-03-22',
    purpose: 'Women Skill Development & Sewing Machine Distribution',
    purposeHindi: 'महिला स्वावलंबन एवं सिलाई प्रशिक्षण केंद्र',
    paymentMode: 'Net Banking',
    transactionRef: 'NET/HDFC260322441',
    taxExemptEligible: true,
    city: 'Ghazipur'
  },
  {
    id: 'JJF-DON-2026-12',
    donorName: 'Shri Rajeshwar Singh',
    panNumber: 'ZXYWV4321A',
    email: 'rajeshwar.singh@gmail.com',
    phone: '+91-9415678901',
    amount: 7500,
    date: '2026-04-10',
    purpose: 'Stationery & Books for 100 Rural Students',
    purposeHindi: '100 ग्रामीण छात्रों हेतु कॉपी-किताब एवं स्कूल बैग',
    paymentMode: 'UPI',
    transactionRef: 'UPI/260410776512',
    taxExemptEligible: true,
    city: 'Zamania'
  }
];

export const INITIAL_DONORS = DONORS_DATA;
