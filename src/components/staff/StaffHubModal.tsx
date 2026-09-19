// ============================================================================
// JEEVAN JYOTI FOUNDATION - STAFF HUB MODAL
// जीवन ज्योति फाउंडेशन - स्टाफ सेवा केंद्र (2 विकल्प: रजिस्ट्रेशन & आई-कार्ड डाउनलोड)
// ============================================================================

import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Award,
  ShieldCheck,
  Briefcase,
  Download,
  FileText,
  ChevronRight,
  Sparkles,
  Users
} from 'lucide-react';
import { StaffMember } from '../../types/staff';
import { findStaffMember } from '../../services/staffService';
import { StaffRegistrationModal } from './StaffRegistrationModal';
import { StaffIdCardDownloadModal } from './StaffIdCardDownloadModal';

interface StaffHubModalProps {
  initialTab?: 'options' | 'registration' | 'download';
  initialStaffId?: string | null;
  onClose: () => void;
}

export const StaffHubModal: React.FC<StaffHubModalProps> = ({
  initialTab = 'options',
  initialStaffId,
  onClose
}) => {
  const [currentView, setCurrentView] = useState<'options' | 'registration' | 'download'>(
    initialStaffId ? 'download' : initialTab
  );
  const [targetStaff, setTargetStaff] = useState<StaffMember | null>(() => {
    if (initialStaffId) {
      return findStaffMember(initialStaffId);
    }
    return null;
  });

  React.useEffect(() => {
    if (initialStaffId) {
      const found = findStaffMember(initialStaffId);
      if (found) {
        setTargetStaff(found);
        setCurrentView('download');
      }
    }
  }, [initialStaffId]);

  // If user opened Registration Form directly
  if (currentView === 'registration') {
    return (
      <StaffRegistrationModal
        onClose={onClose}
        onSuccessViewCard={(staff) => {
          setTargetStaff(staff);
          setCurrentView('download');
        }}
      />
    );
  }

  // If user opened I-Card Download directly
  if (currentView === 'download') {
    return (
      <StaffIdCardDownloadModal
        initialStaff={targetStaff}
        onClose={onClose}
        onOpenRegistrationForm={() => setCurrentView('registration')}
      />
    );
  }

  // DEFAULT VIEW: Selection Hub showing the 2 explicit options
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-amber-300 my-auto animate-in fade-in zoom-in duration-200">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#8B0000] via-[#A00000] to-[#3F2B96] text-white p-5 sm:p-6 text-center relative border-b-2 border-amber-400">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-amber-400/20 border-2 border-amber-300 rounded-2xl flex items-center justify-center mx-auto text-amber-300 shadow-md mb-2.5">
            <Users className="w-7 h-7" />
          </div>

          <span className="text-[11px] font-black uppercase tracking-widest text-amber-300 bg-black/25 px-3 py-1 rounded-full border border-amber-400/50">
            आधिकारिक स्टाफ पोर्टल • Official Staff Portal
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-white font-['Cinzel',serif] mt-2">
            जीवन ज्योति फाउंडेशन स्टाफ सेवा
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-md mx-auto">
            कृपया अपनी आवश्यकतानुसार नीचे दिए गए दो विकल्पों में से एक का चयन करें:
          </p>
        </div>

        {/* The 2 Primary Choices */}
        <div className="p-5 sm:p-8 bg-gradient-to-b from-amber-50/40 to-white space-y-4">
          {/* OPTION 1: Staff Registration */}
          <button
            type="button"
            onClick={() => setCurrentView('registration')}
            className="w-full text-left p-5 rounded-2xl bg-white border-2 border-amber-300 hover:border-[#8B0000] shadow-sm hover:shadow-xl transition-all duration-200 group flex items-start gap-4 cursor-pointer hover:scale-[1.01]"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-red-600 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
              <UserPlus className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#8B0000] text-white text-[11px] font-black flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 group-hover:text-[#8B0000] transition-colors">
                    स्टाफ रजिस्ट्रेशन (Staff Registration)
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#8B0000] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>फॉर्म भरें</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>

              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                नया स्टाफ पंजीकरण फॉर्म खोलें। नाम, पदनाम, विभाग, रक्त समूह व संपर्क विवरण दर्ज करके तुरंत आधिकारिक स्टाफ आईडी व पहचान पत्र जनरेट करें।
              </p>

              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                <span className="text-[10.5px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                  📝 नया ऑनबोर्डिंग फॉर्म
                </span>
                <span className="text-[10.5px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md">
                  ⚡ तुरंत आईडी आवंटन
                </span>
              </div>
            </div>
          </button>

          {/* OPTION 2: Staff I-Card Download */}
          <button
            type="button"
            onClick={() => setCurrentView('download')}
            className="w-full text-left p-5 rounded-2xl bg-white border-2 border-indigo-200 hover:border-indigo-600 shadow-sm hover:shadow-xl transition-all duration-200 group flex items-start gap-4 cursor-pointer hover:scale-[1.01]"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-800 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-700 text-white text-[11px] font-black flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 group-hover:text-indigo-800 transition-colors">
                    स्टाफ आई-कार्ड डाउनलोड (Staff I-Card Download)
                  </h3>
                </div>
                <span className="text-xs font-bold text-indigo-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>कार्ड देखें</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>

              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                स्टाफ आईडी अथवा पंजीकृत मोबाइल नंबर दर्ज करें। अपना स्टाइलिश व डायनामिक पहचान पत्र (आगे व पीछे का दृश्य) देखें और उच्च गुणवत्ता में PDF या PNG डाउनलोड करें।
              </p>

              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                <span className="text-[10.5px] font-bold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-md">
                  🪪 स्टाइलिश डायनामिक कार्ड
                </span>
                <span className="text-[10.5px] font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded-md">
                  📥 हिन्दी व English दोनों भाषाओं में डाउनलोड
                </span>
                <span className="text-[10.5px] font-bold bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md">
                  🖨️ डायरेक्ट प्रिंट
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>जीवन ज्योति फाउंडेशन ग़ाज़ीपुर (उ.प्र.) • सरकारी पंजीकृत संस्था (UP/2018/0207700)</span>
        </div>
      </div>
    </div>
  );
};
