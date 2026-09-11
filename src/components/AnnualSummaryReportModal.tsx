import React, { useRef, useState } from 'react';
import { X, Printer, Download, FileText, CheckCircle2 } from 'lucide-react';
import { FOUNDATION_INFO, IMPACT_METRICS } from '../data/foundationData';
import { DigitalSignature, NgoRoundSeal } from './DigitalSignature';
import { CertificateVerificationQR } from './CertificateVerificationQR';
import { BrandLogo } from './common/BrandLogo';
import { RoyalFourCorners, RoyalCenterFlourish } from './common/RoyalCertificateBorder';
import { exportElementAsPng, exportElementAsJpg, exportElementAsPdf, directPrintElement } from '../utils/exportImage';

interface Props {
  onClose: () => void;
}

export const AnnualSummaryReportModal: React.FC<Props> = ({ onClose }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handlePrint = () => {
    directPrintElement(reportRef.current);
  };

  const handleDownloadJpg = async () => {
    if (!reportRef.current || downloading) return;
    setDownloading('jpg');
    try {
      await exportElementAsJpg(reportRef.current, 'Annual_Impact_Report_2024_2025', { quality: 0.98 });
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current || downloading) return;
    setDownloading('pdf');
    try {
      await exportElementAsPdf(reportRef.current, 'Annual_Impact_Report_2024_2025_A4', { orientation: 'portrait' });
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 overflow-y-auto backdrop-blur-xs overscroll-contain">
      <div className="min-h-full flex items-center justify-center p-2 sm:p-4 md:p-6">
        <div className="bg-white rounded-2xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl relative my-auto border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-200 no-print gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-gray-900 text-base sm:text-lg">
              वार्षिक प्रगति एवं प्रभाव रिपोर्ट (Annual Impact Report)
            </h3>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>प्रिंट</span>
            </button>
            <button
              onClick={handleDownloadJpg}
              disabled={downloading !== null}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading === 'jpg' ? 'JPG तैयार...' : 'JPG (300 DPI)'}</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={downloading !== null}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-[#8B0000] hover:bg-[#700000] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{downloading === 'pdf' ? 'PDF तैयार...' : 'PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="py-4 flex justify-center">
          <div
            ref={reportRef}
            className="printable-certificate bg-[#FFFDF8] text-black p-[8px] rounded-2xl shadow-2xl space-y-4 relative w-full select-none"
            style={{
              border: '8px solid #8B0000',
              boxShadow: '0 0 0 2.5px #D4AF37, 0 0 0 5px #700000, 0 10px 30px rgba(139, 0, 0, 0.25)',
              backgroundColor: '#FFFDF8'
            }}
          >
            {/* Inner Border with Royal Inlay */}
            <div
              className="relative p-6 sm:p-8 bg-[#FFFEFC] rounded-xl overflow-hidden"
              style={{
                border: '2px double #D4AF37',
                outline: '1px dashed rgba(212, 175, 55, 0.5)',
                outlineOffset: '-4px'
              }}
            >
              {/* Royal Vector Corner Ornaments */}
              <RoyalFourCorners color="#D4AF37" size={50} />

              {/* Watermark using BrandLogo */}
              <div
                id="ann-sum-watermark"
                className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0"
              >
                <BrandLogo size={420} watermark opacity={0.07} />
              </div>

              {/* Header */}
              <div className="text-center border-b-2 border-amber-300/80 pb-4 flex flex-col items-center relative z-10">
                <BrandLogo size={65} className="mx-auto mb-1 drop-shadow-xs" id="ann-sum-top-logo" />
                <h2 className="text-xl font-black text-[#8B0000] font-['Cinzel']">
                  {FOUNDATION_INFO.nameEnglish}
                </h2>
                <h3 className="text-sm font-bold text-amber-900">
                  {FOUNDATION_INFO.nameHindi}
                </h3>
                <p className="text-[10px] text-gray-700 font-bold">
                  {FOUNDATION_INFO.fullAddressHindi || FOUNDATION_INFO.address}
                </p>
                <div className="text-xs font-bold text-black mt-1">
                  REG: {FOUNDATION_INFO.regNo} | NITI AAYOG: {FOUNDATION_INFO.nitiAayogUid} | PAN: {FOUNDATION_INFO.pan}
                </div>
              </div>

              {/* Title with Royal Flourish */}
              <div className="text-center my-2">
                <RoyalCenterFlourish color="#D4AF37" width={220} />
                <span className="bg-amber-100 text-amber-900 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-amber-300">
                  वार्षिक सामाजिक प्रभाव विवरण (Annual Impact Summary 2024-2025)
                </span>
                <RoyalCenterFlourish color="#D4AF37" width={180} />
              </div>

            {/* Impact Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-2">
              <div className="bg-[#FFFDE7] p-3 rounded-lg border border-yellow-300 text-center">
                <div className="text-2xl font-black text-[#8B0000]">{IMPACT_METRICS.childrenEducated}+</div>
                <div className="text-xs font-bold text-black">शिक्षित बालक-बालिकाएं</div>
              </div>
              <div className="bg-[#FFFDE7] p-3 rounded-lg border border-yellow-300 text-center">
                <div className="text-2xl font-black text-[#8B0000]">{IMPACT_METRICS.mealsDistributed.toLocaleString('en-IN')}+</div>
                <div className="text-xs font-bold text-black">भोजन थाली वितरण</div>
              </div>
              <div className="bg-[#FFFDE7] p-3 rounded-lg border border-yellow-300 text-center">
                <div className="text-2xl font-black text-[#8B0000]">{IMPACT_METRICS.medicalCampsConducted}</div>
                <div className="text-xs font-bold text-black">स्वास्थ्य जांच शिविर</div>
              </div>
              <div className="bg-[#FFFDE7] p-3 rounded-lg border border-yellow-300 text-center">
                <div className="text-2xl font-black text-[#8B0000]">{IMPACT_METRICS.activeVolunteers}+</div>
                <div className="text-xs font-bold text-black">सक्रिय स्वयंसेवक</div>
              </div>
              <div className="bg-[#FFFDE7] p-3 rounded-lg border border-yellow-300 text-center">
                <div className="text-2xl font-black text-[#8B0000]">{IMPACT_METRICS.villagesCovered}</div>
                <div className="text-xs font-bold text-black">ग्राम आच्छादित (गाजीपुर)</div>
              </div>
              <div className="bg-[#FFFDE7] p-3 rounded-lg border border-yellow-300 text-center">
                <div className="text-2xl font-black text-[#8B0000]">100%</div>
                <div className="text-xs font-bold text-black">पारदर्शिता व अनुपालन</div>
              </div>
            </div>

            {/* Signatures and QR */}
            <div className="border-t pt-4 flex items-center justify-between">
              <CertificateVerificationQR certificateId="JJF-REPORT-2025" size={60} />
              <NgoRoundSeal className="scale-90" />
              <DigitalSignature />
            </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AnnualSummaryReportModal;
