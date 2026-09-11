import React, { useRef, useState } from 'react';
import { X, Download, Printer, ShieldCheck, Sparkles, Building, Users, BookOpen, HeartPulse, Utensils, FileText } from 'lucide-react';
import { FOUNDATION_INFO, IMPACT_METRICS } from '../data/foundationData';
import { CertificateVerificationQR } from './CertificateVerificationQR';
import { NgoRoundSeal, OfficialSignature } from './DigitalSignature';
import { exportElementAsJpg, exportElementAsPdf, directPrintElement } from '../utils/exportImage';
import { VerifiedByJyotiAiSeal } from './VerifiedByJyotiAiSeal';
import { BrandLogo } from './common/BrandLogo';
import { RoyalFourCorners, RoyalCenterFlourish } from './common/RoyalCertificateBorder';
import { OfficialVerifiedBadge } from './common/OfficialVerifiedBadge';

interface AnnualReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnnualReportCardModal: React.FC<AnnualReportCardModalProps> = ({ isOpen, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadJpg = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading('jpg');
    try {
      await exportElementAsJpg(cardRef.current, `JJF-Annual-Impact-Card-2025-2026`, {
        quality: 0.98
      });
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadPdf = async () => {
    if (!cardRef.current || downloading) return;
    setDownloading('pdf');
    try {
      await exportElementAsPdf(cardRef.current, `JJF-Annual-Impact-Card-2025-2026_A4`, {
        orientation: 'portrait'
      });
    } finally {
      setDownloading(null);
    }
  };

  const handlePrint = () => {
    directPrintElement(cardRef.current);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs overflow-y-auto overscroll-contain">
      <div className="min-h-full flex items-center justify-center p-2 sm:p-4 md:p-6">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
          {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 bg-slate-900 text-white gap-2 no-print">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm sm:text-base">
              वार्षिक रिपोर्ट कार्ड (Official Annual Report Card 2025-2026)
            </span>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all border border-slate-600 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट (Print)</span>
            </button>
            <button
              onClick={handleDownloadJpg}
              disabled={downloading !== null}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading === 'jpg' ? 'JPG तैयार...' : 'JPG (300 DPI)'}</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={downloading !== null}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{downloading === 'pdf' ? 'PDF तैयार...' : 'PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Card Body */}
        <div className="p-4 sm:p-8 bg-slate-100/70 overflow-x-auto flex justify-center print:p-0 print:bg-white">
          <div
            ref={cardRef}
            id="annual-report-card-capture"
            data-printable="true"
            className="printable-certificate w-full max-w-3xl bg-[#FFFDF8] rounded-2xl p-[10px] text-slate-900 shadow-2xl relative select-none"
            style={{
              border: '9px solid #8B0000',
              boxShadow: '0 0 0 3px #D4AF37, 0 0 0 6px #700000, 0 12px 35px rgba(139, 0, 0, 0.25)',
              backgroundColor: '#FFFDF8'
            }}
          >
            {/* Inner Border with Royal Inlay */}
            <div
              className="relative p-6 sm:p-8 bg-[#FFFEFC] rounded-xl overflow-hidden"
              style={{
                border: '2.5px double #D4AF37',
                outline: '1px dashed rgba(212, 175, 55, 0.5)',
                outlineOffset: '-5px'
              }}
            >
              {/* Royal Vector Corner Ornaments */}
              <RoyalFourCorners color="#D4AF37" size={54} />

              {/* Watermark using BrandLogo */}
              <div
                id="ann-rep-watermark"
                className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0"
              >
                <BrandLogo size={460} watermark opacity={0.07} />
              </div>

              {/* Header */}
              <div className="text-center pb-5 border-b-2 border-amber-300/80 flex flex-col items-center relative z-10">
                <BrandLogo size={70} className="mx-auto mb-2 drop-shadow-xs" id="ann-rep-top-logo" />
                <div className="inline-block px-4 py-1 bg-amber-100 text-amber-900 font-black text-xs rounded-full uppercase tracking-wider mb-1.5 border border-amber-300">
                  Annual Progress & Accountability Card (वार्षिक प्रगति पत्रक)
                </div>
                <RoyalCenterFlourish color="#D4AF37" width={220} />
                <h1 className="text-2xl sm:text-3xl font-black text-[#8B0000] font-serif">
                  {FOUNDATION_INFO.nameHindi}
                </h1>
                <p className="text-sm font-bold text-amber-900 uppercase tracking-wider mt-0.5">
                  {FOUNDATION_INFO.nameEnglish} • REG: {FOUNDATION_INFO.regNo}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  NITI Aayog UID: <strong>{FOUNDATION_INFO.nitiAayogUid}</strong> | Registered NGO (Ghazipur, U.P.)
                </p>
              </div>

            {/* Metrics Highlight */}
            <div className="my-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <p className="text-2xl font-black text-blue-900">{IMPACT_METRICS.childrenEducated}+</p>
                <p className="text-xs font-bold text-blue-800">शिक्षित बच्चे (Students)</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
                <Utensils className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                <p className="text-2xl font-black text-amber-900">{IMPACT_METRICS.mealsDistributed}+</p>
                <p className="text-xs font-bold text-amber-800">भोजन वितरण (Meals)</p>
              </div>

              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center">
                <HeartPulse className="w-6 h-6 text-red-600 mx-auto mb-1" />
                <p className="text-2xl font-black text-red-900">{IMPACT_METRICS.medicalCampsConducted}</p>
                <p className="text-xs font-bold text-red-800">स्वास्थ्य कैंप (Camps)</p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                <Users className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-2xl font-black text-emerald-900">{IMPACT_METRICS.activeVolunteers}+</p>
                <p className="text-xs font-bold text-emerald-800">सक्रिय स्वयंसेवक (Volunteers)</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-center">
                <Building className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <p className="text-2xl font-black text-purple-900">{IMPACT_METRICS.villagesCovered}</p>
                <p className="text-xs font-bold text-purple-800">ग्राम पंचायतें (Villages)</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <ShieldCheck className="w-6 h-6 text-emerald-700 mx-auto mb-1" />
                <p className="text-2xl font-black text-slate-900">100%</p>
                <p className="text-xs font-bold text-emerald-800">पारदर्शिता (Audit Clean)</p>
              </div>
            </div>

            {/* Single-Line Balanced Footer - 3 Pillars (Live Verify QR | Royal Official Seal | Authorised Signatory) */}
            <div className="pt-3.5 border-t-2 border-slate-200 grid grid-cols-3 items-center gap-2 sm:gap-3 select-none">
              {/* COLUMN 1 (LEFT): Verification QR Code */}
              <div className="flex items-center gap-2 p-2 bg-[#FFFDF8] border border-amber-300/80 rounded-xl shadow-2xs text-left max-w-[240px]">
                <div className="shrink-0 p-1 bg-white border border-amber-400 rounded-lg shadow-2xs">
                  <CertificateVerificationQR
                    certificateId="JJF-REP-2026-001"
                    size={62}
                    showId={false}
                    subText=""
                  />
                </div>
                <div className="flex-1 min-w-0 font-sans text-[7.5pt] sm:text-[8pt] leading-tight space-y-0.5 text-gray-800">
                  <div className="text-[7pt] font-black text-[#8B0000] uppercase tracking-wider truncate">
                    REPORT VERIFY QR
                  </div>
                  <div className="truncate">
                    <strong className="text-black font-black">ID:</strong>{' '}
                    <span className="font-mono font-bold text-[#8B0000] text-[7.5pt] block truncate">JJF-REP-2026-001</span>
                  </div>
                  <div>
                    <strong className="text-black font-black">Date:</strong>{' '}
                    <span className="font-medium text-black">15 Mar 2026</span>
                  </div>
                  <div className="text-[6.5pt] text-emerald-800 font-bold truncate">
                    ✓ Scan to Verify Report
                  </div>
                </div>
              </div>

              {/* COLUMN 2 (CENTER): Official NGO Seal */}
              <div className="flex flex-col items-center justify-center text-center px-1">
                <NgoRoundSeal size="md" />
                <div className="text-[7pt] font-extrabold uppercase tracking-widest text-[#8B0000] mt-1 text-center">
                  वार्षिक प्रभाव मुहर • OFFICIAL SEAL
                </div>
              </div>

              {/* COLUMN 3 (RIGHT): Authorised Signatory */}
              <div className="flex flex-col items-end justify-center text-right">
                <OfficialSignature title="अधिकृत हस्ताक्षरकर्ता / AUTHORISED SIGNATORY" />
              </div>
            </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AnnualReportCardModal;
