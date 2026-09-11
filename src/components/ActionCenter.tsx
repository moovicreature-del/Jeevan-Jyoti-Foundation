import React from 'react';
import { Heart, UserCheck, ShieldCheck, Download, Award, FileText, Sparkles, QrCode, Zap, HardDrive } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ActionCenterProps {
  onOpenDonate: () => void;
  onOpenQuickDonate?: () => void;
  onOpenVolunteerCert: () => void;
  onOpenDonationCert: () => void;
  onOpenIdCard: () => void;
  onOpenTaskCert: () => void;
  onOpenAnnualReport: () => void;
  onOpenFestivalPortal?: () => void;
  onOpenQrScanner?: () => void;
  onOpenLeaderboard?: () => void;
  onOpenDownloadCertificates?: () => void;
  onOpenGoogleDrive?: () => void;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({
  onOpenDonate,
  onOpenQuickDonate,
  onOpenVolunteerCert,
  onOpenDonationCert,
  onOpenIdCard,
  onOpenTaskCert,
  onOpenAnnualReport,
  onOpenFestivalPortal,
  onOpenDownloadCertificates,
  onOpenGoogleDrive
}) => {
  const { t } = useLanguage();

  return (
    <section id="action-center" className="py-12 bg-gradient-to-r from-orange-600 via-amber-600 to-amber-700 text-white relative overflow-hidden shadow-lg">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-black uppercase tracking-wider mb-3 border border-white/30">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>{t('action.badge', 'जन सेवा एवं सत्यापन केंद्र (Citizen Action & Certificate Hub)', 'Citizen Action & Certificate Hub')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t('action.title', 'सेवा से जुड़ें, तुरंत प्रमाण पत्र व पहचान पत्र प्राप्त करें', 'Join the Mission, Generate Official Certificates & IDs Instantly')}
          </h2>
          <p className="text-orange-100 text-sm sm:text-base mt-2">
            {t('action.sub',
              'त्वरित UPI QR दान, त्यौहार शुभकामना प्रमाण पत्र, स्वयंसेवक प्रमाण पत्र, दान रसीद, स्वयंसेवक आईडी कार्ड, वार्षिक रिपोर्ट और गूगल ड्राइव दस्तावेज़ हब।',
              'Quick UPI QR payments, generate, verify, and download festival greeting certificates, volunteer certificates, donation receipts, volunteer identity cards, annual impact reports, and Google Drive document hub.'
            )}
          </p>
        </div>

        {/* Action Buttons Grid - 10 Column Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2.5 sm:gap-3">
          {/* 1. Quick Donate QR - Rapid 1-Tap Mobile Payment Overlay */}
          <button
            onClick={onOpenQuickDonate || onOpenDonate}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-emerald-800 via-teal-900 to-slate-950 text-yellow-300 hover:brightness-110 font-bold text-xs shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer group text-center border-2 border-emerald-400 relative overflow-hidden ring-2 ring-yellow-400/60"
            title="क्विक UPI QR कोड ओवरले खोलें (GPay, PhonePe, Paytm द्वारा तुरंत 1-Tap दान)"
          >
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-emerald-400/20 rounded-full blur-xs" />
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-950 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform shadow-md font-black">
              <Zap className="w-5 h-5 text-slate-950 fill-slate-950 animate-pulse" />
            </div>
            <span className="font-black text-white text-[11px] sm:text-xs leading-tight">Quick Donate QR</span>
            <span className="text-[9px] text-yellow-300 font-extrabold mt-0.5 bg-black/40 px-1.5 py-0.5 rounded-full border border-yellow-400/40">
              ⚡ त्वरित UPI दान
            </span>
          </button>

          {/* 2. Download certificate/id - Prominent Feature */}
          <button
            onClick={onOpenDownloadCertificates}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-amber-900 to-[#600000] text-yellow-300 hover:brightness-110 font-bold text-xs shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer group text-center border-2 border-yellow-400 relative overflow-hidden"
            title="मोबाइल नंबर व OTP द्वारा जारी सभी प्रमाण पत्र व ID कार्ड सूची देखें एवं JPG/PDF में डाउनलोड करें"
          >
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-yellow-400/20 rounded-full blur-xs" />
            <div className="w-10 h-10 rounded-xl bg-yellow-400 text-slate-950 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform shadow-md font-black">
              <Download className="w-5 h-5 text-slate-950" />
            </div>
            <span className="font-black text-white text-[11px] sm:text-xs leading-tight">Download Certificate/ID</span>
            <span className="text-[9px] text-yellow-300 font-extrabold mt-0.5 bg-black/30 px-1.5 py-0.5 rounded-full border border-yellow-400/40">
              OTP व डाउनलोड
            </span>
          </button>

          {/* 3. Donate Now Registration Form */}
          <button
            onClick={onOpenDonate}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-orange-700 hover:bg-orange-50 font-bold text-xs shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group text-center"
            title="दान पंजीकरण व रसीद फॉर्म खोलें"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 text-red-600 fill-red-600" />
            </div>
            <span className="font-black text-slate-900">{t('action.donate', 'दान करें', 'Donate Now')}</span>
            <span className="text-[9px] text-orange-800 font-semibold mt-0.5">{t('action.donate_sub', 'दान फॉर्म', 'Donation Form')}</span>
          </button>

          {/* 4. Festival Wishes & Certificate Registration Form */}
          <button
            onClick={onOpenFestivalPortal}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-amber-400 to-yellow-500 text-amber-950 hover:brightness-105 font-bold text-xs shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group text-center border-2 border-yellow-200"
            title="पावन पर्व व उत्सव शुभकामना पत्र फॉर्म खोलें"
          >
            <div className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform shadow-xs text-lg">
              🪔
            </div>
            <span className="font-black text-amber-950">त्यौहार शुभकामना</span>
            <span className="text-[9px] text-amber-900 font-extrabold mt-0.5">शुभकामना फॉर्म</span>
          </button>

          {/* 5. Volunteer Certificate Registration Form */}
          <button
            onClick={onOpenVolunteerCert}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group text-center"
            title="स्वयंसेवक पंजीकरण व प्रमाण पत्र फॉर्म खोलें"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Award className="w-5 h-5 text-blue-700" />
            </div>
            <span className="font-black text-slate-900">{t('action.vol_cert', 'स्वयंसेवक प्रमाण पत्र', 'Volunteer Cert')}</span>
            <span className="text-[9px] text-blue-800 font-semibold mt-0.5">{t('action.vol_cert_sub', 'स्वयंसेवक फॉर्म', 'Volunteer Reg')}</span>
          </button>

          {/* 6. Swayam Sewak ID Card Registration Form */}
          <button
            onClick={onOpenIdCard}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-xs shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group text-center"
            title="स्वयंसेवक ID कार्ड आवेदन व पंजीकरण फॉर्म खोलें"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <UserCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <span className="font-black text-slate-900">{t('action.id_card', 'स्वयंसेवक ID कार्ड', 'ID Card')}</span>
            <span className="text-[9px] text-emerald-800 font-semibold mt-0.5">{t('action.id_card_sub', 'ID कार्ड फॉर्म', 'ID Card Form')}</span>
          </button>

          {/* 7. Official Donation Receipt Registration Form */}
          <button
            onClick={onOpenDonationCert}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-purple-700 hover:bg-purple-50 font-bold text-xs shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group text-center"
            title="दान रसीद फॉर्म खोलें"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5 text-purple-700" />
            </div>
            <span className="font-black text-slate-900">{t('action.tax_receipt', 'दान रसीद', 'Donation Receipt')}</span>
            <span className="text-[9px] text-purple-800 font-semibold mt-0.5">{t('action.tax_receipt_sub', 'दान रसीद फॉर्म', 'Receipt Form')}</span>
          </button>

          {/* 8. Task Appreciation Registration Form */}
          <button
            onClick={onOpenTaskCert}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-amber-700 hover:bg-amber-50 font-bold text-xs shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group text-center"
            title="कार्य प्रशस्ति पत्र आवेदन फॉर्म खोलें"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
            </div>
            <span className="font-black text-slate-900">{t('action.task_cert', 'कार्य प्रशंसा पत्र', 'Honor Cert')}</span>
            <span className="text-[9px] text-amber-800 font-semibold mt-0.5">{t('action.task_cert_sub', 'प्रशस्ति फॉर्म', 'Appreciation')}</span>
          </button>

          {/* 9. Annual Impact Report / Verification */}
          <button
            onClick={onOpenAnnualReport}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white text-teal-700 hover:bg-teal-50 font-bold text-xs shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group text-center"
            title="वार्षिक सामाजिक प्रभाव प्रगति पत्रक खोलें"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Download className="w-5 h-5 text-teal-700" />
            </div>
            <span className="font-black text-slate-900">{t('action.annual_report', 'वार्षिक रिपोर्ट', 'Annual Report')}</span>
            <span className="text-[9px] text-teal-800 font-semibold mt-0.5">{t('action.annual_report_sub', 'प्रगति पत्रक 2026', 'Impact Report')}</span>
          </button>

          {/* 10. Google Drive Cloud Vault */}
          <button
            onClick={onOpenGoogleDrive}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-indigo-900 to-blue-950 text-indigo-200 hover:brightness-110 font-bold text-xs shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer group text-center border-2 border-indigo-400"
            title="गूगल ड्राइव दस्तावेज़ हब व क्लाउड बैकअप खोलें"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform shadow-xs">
              <HardDrive className="w-5 h-5 text-yellow-300" />
            </div>
            <span className="font-black text-white">Google Drive</span>
            <span className="text-[9px] text-indigo-300 font-extrabold mt-0.5">दस्तावेज़ ड्राइव</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ActionCenter;
