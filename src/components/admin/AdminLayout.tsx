// ============================================================================
// JEEVAN JYOTI FOUNDATION - ADMIN DASHBOARD LAYOUT & SIDEBAR
// जीवन ज्योति फाउंडेशन - एडमिन डैशबोर्ड मुख्य लेआउट एवं साइडबार नेविगेशन
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Film,
  Megaphone,
  FileText,
  Users,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  ShieldCheck,
  Crown,
  Sparkles,
  ExternalLink,
  ChevronRight,
  UserCheck,
  IdCard
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { TabDashboardOverview } from './TabDashboardOverview';
import { TabBannerMediaManager } from './TabBannerMediaManager';
import { TabNoticeBoardManager } from './TabNoticeBoardManager';
import { TabHomeTextEditor } from './TabHomeTextEditor';
import { TabUserManagement } from './TabUserManagement';
import { TabDonationsBulkManager } from './TabDonationsBulkManager';
import { TabDonationPaymentSettings } from './TabDonationPaymentSettings';
import { TabCertificatePipelineDashboard } from './TabCertificatePipelineDashboard';
import { TabStaffApprovalManager } from './TabStaffApprovalManager';
import { TabSecuritySettings } from './TabSecuritySettings';
import { Receipt, CreditCard, Award, Database, Download, KeyRound } from 'lucide-react';
import { AdminUploadProgressProvider } from '../../context/AdminUploadProgressContext';
import { AdminUploadProgressBar } from './AdminUploadProgressBar';
import { BrandLogo } from '../common/BrandLogo';
import { DataBackupModal } from './DataBackupModal';
import { getAllStaffMembers } from '../../services/staffService';

export type AdminTabType = 'dashboard' | 'certificates' | 'staff_approval' | 'donations' | 'payment' | 'media' | 'notice' | 'text' | 'users' | 'security';

interface AdminLayoutProps {
  onBackToWebsite: () => void;
  onOpenVerificationPortal?: (certId: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToWebsite, onOpenVerificationPortal }) => {
  const { adminProfile, isSuperAdmin, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [pendingStaffCount, setPendingStaffCount] = useState<number>(0);

  useEffect(() => {
    const updatePendingCount = () => {
      try {
        const staff = getAllStaffMembers();
        const pending = staff.filter((s) => s.status === 'pending').length;
        setPendingStaffCount(pending);
      } catch {
        setPendingStaffCount(0);
      }
    };

    updatePendingCount();
    window.addEventListener('jjf-staff-updated', updatePendingCount);
    return () => {
      window.removeEventListener('jjf-staff-updated', updatePendingCount);
    };
  }, []);

  // Sidebar Menu Items Definition
  const menuItems = [
    {
      id: 'dashboard' as AdminTabType,
      label: 'डैशबोर्ड (Dashboard)',
      sublabel: 'मुख्य अवलोकन',
      icon: LayoutDashboard,
      superAdminOnly: false
    },
    {
      id: 'staff_approval' as AdminTabType,
      label: 'स्टाफ आई-कार्ड अप्रूवल',
      sublabel: 'स्वीकृति/रिजेक्ट व WhatsApp लिंक',
      icon: IdCard,
      superAdminOnly: false,
      badge: pendingStaffCount > 0 ? `${pendingStaffCount} नया` : 'Staff'
    },
    {
      id: 'certificates' as AdminTabType,
      label: 'प्रमाण पत्र पाइपलाइन (Certificates)',
      sublabel: 'मासिक व वार्षिक जारीकरण ट्रैकिंग',
      icon: Award,
      superAdminOnly: false,
      badge: 'Super Admin'
    },
    {
      id: 'donations' as AdminTabType,
      label: 'दानदाता व रसीदें (Donations Hub)',
      sublabel: 'Tab: रसीदें व डेटा एक्सपोर्ट',
      icon: Receipt,
      superAdminOnly: false,
      badge: 'Donations'
    },
    {
      id: 'payment' as AdminTabType,
      label: '⚡ क्विक डोनेट QR, UPI व बैंक',
      sublabel: 'Quick Donate QR फोटो, UPI ID व खाता',
      icon: CreditCard,
      superAdminOnly: false,
      badge: '⚡ Quick Donate'
    },
    {
      id: 'media' as AdminTabType,
      label: 'लोगो, थंबनेल व मीडिया (Logo & Thumbnail)',
      sublabel: 'Tab 1: ऐप लोगो, ऐप थंबनेल, फोटो व वीडियो',
      icon: Film,
      superAdminOnly: false,
      badge: 'Logo & Thumb'
    },
    {
      id: 'notice' as AdminTabType,
      label: 'सूचना पट्ट (Notice Board)',
      sublabel: 'Tab 2: सूचनाएं लिखें',
      icon: Megaphone,
      superAdminOnly: false
    },
    {
      id: 'text' as AdminTabType,
      label: 'होम पेज टेक्स्ट (Text Editor)',
      sublabel: 'Tab 3: स्लोगन व टेक्स्ट',
      icon: FileText,
      superAdminOnly: false
    },
    {
      id: 'users' as AdminTabType,
      label: 'यूज़र मैनेजमेंट (Users)',
      sublabel: 'Tab 4: एडमिन अप्रूवल',
      icon: Users,
      superAdminOnly: true,
      badge: 'Super Admin'
    },
    {
      id: 'security' as AdminTabType,
      label: 'आईडी व पासवर्ड सुरक्षा (Security)',
      sublabel: 'सुपर एडमिन व एडमिन क्रेडेंशियल्स',
      icon: KeyRound,
      superAdminOnly: true,
      badge: 'Super Admin'
    }
  ];

  const handleTabSelect = (tab: AdminTabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AdminUploadProgressProvider>
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
        {/* TOP APP BAR - Royal Blue & Gold Theme */}
        <header className="sticky top-0 z-40 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white shadow-md border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 rounded-xl text-white hover:bg-white/10 lg:hidden cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleTabSelect('dashboard')}>
              <BrandLogo size={42} className="drop-shadow-md rounded-full bg-white/10 p-0.5 border border-white/20" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-black text-sm sm:text-base tracking-tight text-white">
                    जीवन ज्योति फाउंडेशन
                  </h1>
                  <span className="text-[10px] bg-amber-400 text-blue-950 font-black px-1.5 py-0.2 rounded font-mono">
                    ADMIN
                  </span>
                </div>
                <p className="text-[10px] text-blue-200">
                  होम पेज सामग्री व पोर्टल प्रबंधन
                </p>
              </div>
            </div>
          </div>

          {/* Right: User Profile & Back to Website */}
          <div className="flex items-center gap-3">
            {/* User Pill */}
            <div className="hidden sm:flex items-center gap-2.5 bg-blue-950/60 border border-blue-700/50 rounded-2xl px-3 py-1.5">
              <div className="w-7 h-7 rounded-xl bg-amber-400 text-blue-950 flex items-center justify-center font-bold text-xs">
                {isSuperAdmin ? <Crown className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              </div>
              <div className="text-left">
                <span className="text-xs font-black text-white block leading-none">
                  {adminProfile?.name || 'एडमिन'}
                </span>
                <span className="text-[9px] text-amber-300 font-bold uppercase">
                  {isSuperAdmin ? 'सुपर एडमिन' : 'एडमिन'}
                </span>
              </div>
            </div>

            {/* Backup Database Button */}
            <button
              id="btn-open-database-backup-header"
              onClick={() => setIsBackupModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-amber-400 hover:bg-amber-300 text-blue-950 rounded-xl text-xs font-black transition cursor-pointer shadow-sm border border-amber-300"
              title="फायरस्टोर दान व स्वयंसेवक डेटाबेस JSON बैकअप"
            >
              <Database className="w-4 h-4 text-blue-950" />
              <span className="hidden sm:inline">डेटा बैकअप (JSON)</span>
            </button>

            {/* Back to Website Button */}
            <button
              onClick={onBackToWebsite}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition cursor-pointer border border-white/15"
            >
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">वेबसाइट पर जाएँ</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              title="लॉगआउट करें"
              className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* GLOBAL ADMINISTRATIVE UPLOAD & SYNC PROGRESS BAR */}
      <AdminUploadProgressBar />

      {/* MAIN CONTAINER: SIDEBAR + CONTENT AREA */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* DESKTOP SIDEBAR (ROYAL BLUE ACCENTED) */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-4">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 space-y-1">
            <div className="px-3 py-2 text-[11px] font-black tracking-wider text-slate-400 uppercase">
              प्रशासनिक मेनू (Menu)
            </div>

            {menuItems.map((item) => {
              if (item.superAdminOnly && !isSuperAdmin) return null;
              const isActive = activeTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-800 text-white shadow-md shadow-blue-800/20'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-blue-900'
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                    <div>
                      <span className="block leading-tight">{item.label}</span>
                      <span className={`text-[10px] block font-normal ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>
                        {item.sublabel}
                      </span>
                    </div>
                  </div>
                  {item.badge && !isActive && (
                    <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.5 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Database Backup Card in Sidebar */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-orange-50 border border-amber-300 rounded-3xl p-4 text-xs space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between text-amber-950 font-black">
              <span className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-700" />
                डेटा बैकअप (JSON)
              </span>
              <span className="text-[9px] bg-amber-400 text-blue-950 px-1.5 py-0.2 rounded font-mono font-bold">
                FIRESTORE
              </span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              दानदाता, स्वयंसेवक व जारी प्रमाण पत्रों का पूर्ण JSON बैकअप डाउनलोड करें।
            </p>
            <button
              id="btn-open-database-backup-sidebar"
              onClick={() => setIsBackupModalOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black rounded-xl text-xs shadow-sm transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>बैकअप डाउनलोड करें</span>
            </button>
          </div>

          {/* Quick Info Badge */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-4 text-xs space-y-2 shadow-sm border border-blue-900">
            <div className="flex items-center gap-2 text-amber-300 font-black">
              <Sparkles className="w-4 h-4" />
              <span>फ़ायरबेस रीयलटाइम डेटाबेस</span>
            </div>
            <p className="text-[11px] text-blue-100 leading-relaxed">
              सभी सामग्री Firestore एवं Storage के साथ सुरक्षित रूप से सिंक्रनाइज़्ड है।
            </p>
          </div>
        </aside>

        {/* MOBILE SLIDE-OVER DRAWER */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col p-4 space-y-4 z-10">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-800" />
                  <span className="font-black text-sm text-slate-900">एडमिन मेनू</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 flex-1">
                {menuItems.map((item) => {
                  if (item.superAdminOnly && !isSuperAdmin) return null;
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabSelect(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-blue-800 text-white shadow-md'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  id="btn-open-database-backup-drawer"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsBackupModalOpen(true);
                  }}
                  className="w-full py-2.5 bg-amber-400 text-blue-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm"
                >
                  <Database className="w-4 h-4" />
                  <span>डेटा बैकअप (JSON Export)</span>
                </button>
                <button
                  onClick={onBackToWebsite}
                  className="w-full py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>वेबसाइट पर वापस लौटें</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>लॉगआउट करें</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <TabDashboardOverview
              onSelectTab={(tab) => setActiveTab(tab)}
              onViewWebsite={onBackToWebsite}
              onOpenBackupModal={() => setIsBackupModalOpen(true)}
            />
          )}
          {activeTab === 'certificates' && (
            <TabCertificatePipelineDashboard
              onOpenVerificationPortal={onOpenVerificationPortal}
            />
          )}
          {activeTab === 'staff_approval' && <TabStaffApprovalManager />}
          {activeTab === 'donations' && <TabDonationsBulkManager />}
          {activeTab === 'payment' && <TabDonationPaymentSettings />}
          {activeTab === 'media' && <TabBannerMediaManager />}
          {activeTab === 'notice' && <TabNoticeBoardManager />}
          {activeTab === 'text' && <TabHomeTextEditor />}
          {activeTab === 'users' && <TabUserManagement />}
          {activeTab === 'security' && <TabSecuritySettings />}
        </main>
      </div>

      {/* FIRESTORE DATABASE BACKUP MODAL */}
      <DataBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />
    </div>
    </AdminUploadProgressProvider>
  );
};
