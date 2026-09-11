import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { CertificateVerificationQR } from '../CertificateVerificationQR';
import { RoyalCertificateSeal } from './RoyalCertificateSeal';
import { ShaileshPradhanSignature } from '../DigitalSignature';
import { FOUNDATION_INFO } from '../../data/foundationData';

export interface RoyalCertificateFooterProps {
  certificateId: string;
  issueDate?: string;
  qrSize?: number | 'auto' | 'responsive' | 'sm' | 'md' | 'lg';
  qrSubText?: string;
  verificationUrl?: string;
  
  // Left Column Details
  credentialsTitle?: string;
  certNumberLabel?: string;
  issueDateLabel?: string;
  extraLeftDetails?: React.ReactNode;
  
  // Center Column (Official Seal)
  sealSize?: 'sm' | 'md' | 'lg' | 'xl' | 'auto' | 'responsive' | number;
  sealVariant?: 'gold-crimson' | 'royal-gold' | 'emerald-gold';
  
  // Right Column (Authorised Signatory)
  signatoryTitle?: string;
  signatoryName?: string;
  signatoryDesignation?: string;
  signatoryOrganization?: string;
  
  // Layout & Theme
  theme?: 'royal' | 'gold' | 'emerald' | 'navy';
  language?: 'hi' | 'en' | 'bilingual';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * RoyalCertificateFooter
 * Implements the standard prestigious 3-Pillar Single-Line Certificate Footer with
 * full auto-sizing responsiveness across certificate shapes and aspect ratios:
 * 1. LEFT:   Official Live Verification QR Code with Certificate No & Issue Date
 * 2. CENTER: Official Royal Embossed Foundation NGO Seal (राजकीय / आधिकारिक सील)
 * 3. RIGHT:  Authorised Signatory with Digital Signature (अधिकृत हस्ताक्षरकर्ता - श्री शैलेश प्रधान)
 */
export const RoyalCertificateFooter: React.FC<RoyalCertificateFooterProps> = ({
  certificateId,
  issueDate,
  qrSize = 'auto',
  qrSubText,
  verificationUrl,
  
  credentialsTitle,
  certNumberLabel = 'Certificate No.',
  issueDateLabel = 'Issue Date',
  extraLeftDetails,
  
  sealSize = 'auto',
  sealVariant = 'gold-crimson',
  
  signatoryTitle = 'अधिकृत हस्ताक्षरकर्ता / AUTHORISED SIGNATORY',
  signatoryName = FOUNDATION_INFO.presidentName || 'Shailesh Pradhan',
  signatoryDesignation = 'Manager / Secretary (प्रबंधक / सचिव)',
  signatoryOrganization = FOUNDATION_INFO.nameEnglish || 'JEEVAN JYOTI FOUNDATION',
  
  theme = 'royal',
  language = 'bilingual',
  className = '',
  style
}) => {
  const dynamicVerifyUrl =
    verificationUrl ||
    (typeof window !== 'undefined' && window.location.origin
      ? `${window.location.origin}/?verify=${encodeURIComponent(certificateId)}`
      : `https://jeevanjyotifoundation.org/?verify=${encodeURIComponent(certificateId)}`);

  const dynamicIssueDate =
    issueDate ||
    new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date());

  const subText =
    qrSubText ||
    (language === 'hi'
      ? 'सत्यापन हेतु स्कैन करें'
      : language === 'en'
      ? 'Scan to Verify Online'
      : 'स्कैन कर सत्यापित करें');

  const defaultCredentialsTitle =
    credentialsTitle ||
    (language === 'hi'
      ? 'डिजिटल सत्यापन क्यूआर'
      : language === 'en'
      ? 'ONLINE VERIFY QR'
      : 'सत्यापन क्यूआर / VERIFY QR');

  return (
    <div
      className={`border-t-2 border-amber-900/30 pt-[clamp(6px,1.2cqw,12px)] mt-2.5 grid grid-cols-3 items-center gap-[clamp(6px,1.5cqw,14px)] select-none relative ${className}`}
      style={style}
    >
      {/* ========================================================================= */}
      {/* COLUMN 1 (LEFT): OFFICIAL LIVE VERIFICATION QR CODE & CREDENTIALS         */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-[#FFFDF8] border border-amber-300/80 rounded-lg sm:rounded-xl shadow-2xs text-left w-full max-w-[clamp(175px,30cqw,250px)]">
        <div className="shrink-0 p-0.5 sm:p-1 bg-white border border-amber-400 rounded-md sm:rounded-lg shadow-2xs">
          <CertificateVerificationQR
            certificateId={certificateId}
            size={qrSize}
            showId={false}
            subText=""
          />
        </div>
        <div className="flex-1 min-w-0 font-sans text-[clamp(6.5pt,0.85cqw,8pt)] leading-tight space-y-0.5 text-gray-800">
          <div className="text-[clamp(6pt,0.8cqw,7pt)] font-black text-[#8B0000] uppercase tracking-wider truncate">
            {defaultCredentialsTitle}
          </div>
          <div className="truncate">
            <strong className="text-black font-black">{certNumberLabel}:</strong>{' '}
            <span className="font-mono font-bold text-[#8B0000] text-[clamp(7pt,0.9cqw,8pt)] block truncate">{certificateId}</span>
          </div>
          <div className="truncate">
            <strong className="text-black font-black">{issueDateLabel}:</strong>{' '}
            <span className="font-medium text-black">{dynamicIssueDate}</span>
          </div>
          {extraLeftDetails ? (
            extraLeftDetails
          ) : (
            <div className="text-[clamp(5.5pt,0.75cqw,6.5pt)] text-emerald-800 font-bold truncate">
              ✓ {subText}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COLUMN 2 (CENTER): OFFICIAL ROYAL EMBOSSED SEAL OF THE FOUNDATION         */}
      {/* ========================================================================= */}
      <div className="flex flex-col items-center justify-center text-center px-0.5 sm:px-1 w-full">
        <RoyalCertificateSeal
          size={sealSize}
          variant={sealVariant}
          showRibbons={true}
        />
        <div className="text-[clamp(6pt,0.8cqw,7.5pt)] font-extrabold uppercase tracking-widest text-[#8B0000] mt-0.5 sm:mt-1 text-center truncate max-w-full">
          {language === 'hi' ? 'आधिकारिक राजकीय मुहर' : 'OFFICIAL SEAL OF FOUNDATION'}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COLUMN 3 (RIGHT): AUTHORISED SIGNATORY WITH GENUINE DIGITAL SIGNATURE     */}
      {/* ========================================================================= */}
      <div className="flex flex-col items-end justify-center text-right w-full">
        <div className="w-full max-w-[clamp(175px,30cqw,250px)] border-2 border-dashed border-blue-900/40 bg-[#FFFDE7]/90 p-1 sm:p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-center shadow-2xs relative">
          {/* Security Shield Checkmark Badge */}
          <div className="text-[clamp(6.5pt,0.8cqw,7.5pt)] font-black text-blue-950 uppercase tracking-wider mb-0.5 flex items-center justify-center gap-1 truncate">
            <ShieldCheck className="w-3 h-3 text-blue-900 shrink-0" />
            <span className="truncate">{signatoryTitle}</span>
          </div>

          {/* Genuine Royal Blue Signature of Shailesh Pradhan */}
          <div className="my-0.5 py-0.5 flex items-center justify-center">
            <ShaileshPradhanSignature size="auto" />
          </div>

          {/* Signatory Name & Designation */}
          <div className="border-t border-[#1E40AF]/30 pt-0.5 leading-tight">
            <div className="text-[clamp(7.5pt,1cqw,9.5pt)] font-bold text-[#1E40AF] truncate">
              {signatoryName}
            </div>
            <div className="text-[clamp(6.5pt,0.8cqw,7.5pt)] text-gray-700 font-semibold truncate">
              {signatoryDesignation}
            </div>
            <div className="text-[clamp(6pt,0.75cqw,7pt)] text-gray-600 font-bold uppercase tracking-wider truncate">
              {signatoryOrganization}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoyalCertificateFooter;
