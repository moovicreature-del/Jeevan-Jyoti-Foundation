import { jsPDF } from 'jspdf';
import { DonationRecord } from '../types';
import { FOUNDATION_INFO } from '../data/foundationData';
import { amountToWordsIndian } from '../utils/numberToWords';

export interface SendReceiptEmailParams {
  donation: DonationRecord;
  pdfBase64?: string; // Optional pre-rendered PDF base64 string
}

export interface EmailDispatchResult {
  success: boolean;
  message: string;
  receiptNo: string;
  recipientEmail: string;
  emailId?: string;
  previewUrl?: string;
}

/**
 * Generates an official donation PDF receipt in base64 format using jsPDF vector engine
 */
export function generateDonationReceiptPdfBase64(donation: DonationRecord): string {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const receiptNo = donation.receiptNo || donation.id;
  const donationDate = donation.date
    ? new Date(donation.date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

  const amountInWords = donation.amountInWords || amountToWordsIndian(donation.amount);

  // Outer Border & Decorative Margins
  doc.setDrawColor(0, 36, 184); // Royal Blue
  doc.setLineWidth(1.2);
  doc.rect(8, 8, 194, 281);

  doc.setDrawColor(255, 179, 0); // Gold Inner Border
  doc.setLineWidth(0.6);
  doc.rect(11, 11, 188, 275);

  // Header Banner
  doc.setFillColor(0, 36, 184);
  doc.rect(11.5, 11.5, 187, 36, 'F');

  // Header Text
  doc.setTextColor(255, 230, 0); // Yellow
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('JEEVAN JYOTI FOUNDATION', 105, 23, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('VILLAGE MEERANPUR, MOHAMMADABAD, GHAZIPUR, UTTAR PRADESH, INDIA - 233303 (DIGIPIN 2J6T226CL2)', 105, 30, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Reg No: ${FOUNDATION_INFO.regNo} | NITI Aayog: ${FOUNDATION_INFO.nitiAayogUid}`, 105, 36, { align: 'center' });

  doc.setTextColor(255, 220, 100);
  doc.setFontSize(8);
  doc.text('Helpline: +91-8052361666 | Email: jeevanjyotifoundationgzp@gmail.com', 105, 42, { align: 'center' });

  // Title Ribbon: OFFICIAL DONATION RECEIPT
  doc.setFillColor(255, 243, 205);
  doc.setDrawColor(230, 140, 0);
  doc.setLineWidth(0.5);
  doc.roundedRect(25, 52, 160, 14, 2, 2, 'FD');

  doc.setTextColor(140, 40, 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('OFFICIAL DONATION RECEIPT / आधिकारिक दान रसीद', 105, 60, { align: 'center' });
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Government Registered Non-Profit Organization • Ghazipur, Uttar Pradesh', 105, 64, { align: 'center' });

  // Receipt Meta Grid (No & Date)
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 70, 180, 16, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(15, 70, 180, 16);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Receipt No:', 20, 77);
  doc.setFont('courier', 'bold');
  doc.setTextColor(0, 36, 184);
  doc.text(receiptNo, 45, 77);

  doc.setTextColor(30, 41, 59);
  doc.setFont('helvetica', 'bold');
  doc.text('Date of Receipt:', 120, 77);
  doc.setFont('helvetica', 'normal');
  doc.text(donationDate, 150, 77);

  doc.setFont('helvetica', 'bold');
  doc.text('Payment Mode:', 20, 83);
  doc.setFont('helvetica', 'normal');
  doc.text(donation.paymentMode || 'Online Payment', 47, 83);

  doc.setFont('helvetica', 'bold');
  doc.text('Txn / UTR Ref:', 120, 83);
  doc.setFont('courier', 'normal');
  doc.text(donation.transactionRef || 'VERIFIED', 150, 83);

  // Donor Details Table Section
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(15, 91, 180, 66, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(15, 91, 180, 66);

  doc.setTextColor(0, 36, 184);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('DONOR PARTICULARS & CONTRIBUTION DETAILS', 20, 98);

  // Table rows for donor
  const donorFields = [
    { label: 'Donor Full Name:', val: donation.donorName },
    { label: "Father's / Guardian's Name:", val: donation.fatherName || 'N/A' },
    { label: 'Permanent Account Number (PAN):', val: donation.panNumber || 'NOT PROVIDED / OPTIONAL' },
    { label: 'Email Address:', val: donation.email || 'N/A' },
    { label: 'Mobile / WhatsApp:', val: donation.phone || 'N/A' },
    { label: 'Postal Address:', val: donation.address || 'Ghazipur, Uttar Pradesh' },
    { label: 'Donation Purpose / Cause:', val: donation.purpose || 'Education & Child Support (Shiksha)' }
  ];

  let currentY = 106;
  donorFields.forEach((field) => {
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(field.label, 20, currentY);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'normal');
    doc.text(String(field.val), 80, currentY, { maxWidth: 110 });
    currentY += 7.5;
  });

  // Donation Amount Highlight Box
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.8);
  doc.roundedRect(15, 162, 180, 24, 2, 2, 'FD');

  doc.setTextColor(146, 64, 14);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL DONATED AMOUNT:', 20, 172);

  doc.setFontSize(16);
  doc.setTextColor(180, 83, 9);
  doc.text(`Rs. ${donation.amount.toLocaleString('en-IN')}/-`, 85, 173);

  doc.setFontSize(8.5);
  doc.setTextColor(120, 53, 15);
  doc.setFont('helvetica', 'italic');
  doc.text(`Amount in Words: ${amountInWords} Only`, 20, 181, { maxWidth: 170 });

  // Legal Compliance & Declaration Box
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(15, 190, 180, 42, 2, 2, 'F');
  doc.rect(15, 190, 180, 42);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('STATUTORY DECLARATION & NGO REGISTRATION PARTICULARS', 20, 197);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  const declarationLines = [
    '1. Donations received by JEEVAN JYOTI FOUNDATION are utilized purely for social, educational & humanitarian welfare.',
    `2. Society Registration Number: ${FOUNDATION_INFO.regNo} | NITI Aayog Darpan UID: ${FOUNDATION_INFO.nitiAayogUid}.`,
    `3. Permanent Account Number (PAN): ${FOUNDATION_INFO.pan}.`,
    '4. This donation was accepted without any consideration of commercial return, goods, or services in exchange.',
    '5. This is a computer-generated official receipt authenticated by digital authorization.'
  ];

  let declY = 203;
  declarationLines.forEach((line) => {
    doc.text(line, 20, declY, { maxWidth: 170 });
    declY += 5.2;
  });

  // Footer Signatures & QR Code Section
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 236, 180, 42, 2, 2, 'F');
  doc.rect(15, 236, 180, 42);

  // Left: Verification QR note
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('ONLINE VERIFICATION QR CODE', 22, 244);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.text('Scan via camera to verify authentic', 22, 249);
  doc.text('receipt on NGO central server:', 22, 253);
  doc.setTextColor(0, 36, 184);
  doc.text(`https://jeevanjyotifoundation.org/?verify=${encodeURIComponent(receiptNo)}`, 22, 258, { maxWidth: 85 });

  // Center: NGO Round Seal text placeholder
  doc.setDrawColor(0, 36, 184);
  doc.setLineWidth(0.4);
  doc.circle(115, 256, 14);
  doc.setTextColor(0, 36, 184);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('JEEVAN JYOTI', 115, 253, { align: 'center' });
  doc.text('FOUNDATION', 115, 256.5, { align: 'center' });
  doc.text('GHAZIPUR (U.P.)', 115, 260, { align: 'center' });

  // Right: Authorized Signatory
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Shailesh Pradhan', 165, 256, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Manager & Secretary / Authorized Signatory', 165, 261, { align: 'center' });
  doc.text('Jeevan Jyoti Foundation Ghazipur', 165, 265, { align: 'center' });

  // Convert to Base64 (Data URI without prefix)
  const dataUri = doc.output('datauristring');
  const base64Content = dataUri.split(',')[1];
  return base64Content;
}

/**
 * Dispatches an automated email containing the generated PDF receipt
 * to the donor's provided email address.
 */
export async function triggerDonationReceiptEmail(
  params: SendReceiptEmailParams
): Promise<EmailDispatchResult> {
  const { donation } = params;

  if (!donation.email || !donation.email.includes('@')) {
    return {
      success: false,
      message: 'मान्य ईमेल पता उपलब्ध नहीं है।',
      receiptNo: donation.receiptNo || donation.id,
      recipientEmail: donation.email || ''
    };
  }

  try {
    // Generate the PDF base64 if not provided
    const pdfBase64 = params.pdfBase64 || generateDonationReceiptPdfBase64(donation);

    const verificationUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/?verify=${encodeURIComponent(donation.receiptNo || donation.id)}`
      : `https://jeevanjyotifoundation.org/?verify=${encodeURIComponent(donation.receiptNo || donation.id)}`;

    // Call server API endpoint
    const response = await fetch('/api/send-donation-receipt-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        donorEmail: donation.email.trim(),
        donorName: donation.donorName.trim(),
        fatherName: donation.fatherName,
        receiptNo: donation.receiptNo || donation.id,
        amount: donation.amount,
        amountInWords: donation.amountInWords || amountToWordsIndian(donation.amount),
        date: donation.date || new Date().toISOString(),
        panNumber: donation.panNumber,
        purpose: donation.purpose || donation.purposeHindi || 'Education & Social Welfare',
        transactionRef: donation.transactionRef,
        paymentMode: donation.paymentMode,
        address: donation.address,
        pdfBase64,
        verificationUrl
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        message: data.message || 'दान रसीद PDF आपके ईमेल पर भेज दी गई है।',
        receiptNo: donation.receiptNo || donation.id,
        recipientEmail: donation.email,
        emailId: data.emailId,
        previewUrl: data.previewUrl
      };
    } else {
      throw new Error(data.message || 'ईमेल भेजने में विफल');
    }
  } catch (error: any) {
    console.error('Error triggering donation receipt email:', error);
    return {
      success: false,
      message: error.message || 'ईमेल भेजने में तकनीकी समस्या आई।',
      receiptNo: donation.receiptNo || donation.id,
      recipientEmail: donation.email
    };
  }
}
