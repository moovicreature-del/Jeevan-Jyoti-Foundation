// ============================================================================
// JEEVAN JYOTI FOUNDATION - SUPER ADMIN & ADMIN MASTER PORTAL CONTAINER
// जीवन ज्योति फाउंडेशन - सुपर एडमिन एवं एडमिन मुख्य पोर्टल कंटेनर
// ============================================================================

import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { AdminLoginView } from './AdminLoginView';
import { AdminLayout } from './AdminLayout';
import { RotateCw, ShieldCheck } from 'lucide-react';

interface SuperAdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVerificationPortal?: (certId: string) => void;
}

export const SuperAdminPortal: React.FC<SuperAdminPortalProps> = ({
  isOpen,
  onClose,
  onOpenVerificationPortal
}) => {
  const { adminProfile, isApproved, isLoading } = useAdminAuth();

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 flex flex-col items-center gap-4 text-center max-w-sm shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center">
            <RotateCw className="w-7 h-7 animate-spin text-blue-700" />
          </div>
          <div>
            <h3 className="font-black text-base text-slate-900">प्रशासनिक डेटा लोड हो रहा है...</h3>
            <p className="text-xs text-slate-500 mt-1">फ़ायरबेस ऑथेंटिकेशन व डेटाबेस सत्यापन जारी है</p>
          </div>
        </div>
      </div>
    );
  }

  // यदि एडमिन लॉगइन नहीं है या अप्रूव नहीं है
  if (!adminProfile || !isApproved) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-lg my-auto">
          <AdminLoginView onSuccess={() => {}} onCancel={onClose} />
        </div>
      </div>
    );
  }

  // यदि एडमिन लॉगइन और अप्रूव्ड है -> पूर्ण डैशबोर्ड लेआउट दिखाएं
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-100">
      <AdminLayout
        onBackToWebsite={onClose}
        onOpenVerificationPortal={onOpenVerificationPortal}
      />
    </div>
  );
};
