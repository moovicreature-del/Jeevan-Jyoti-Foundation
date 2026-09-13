import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ActionCenter } from './components/ActionCenter';
import { FourPillars } from './components/FourPillars';
import { LiveImpactDashboard } from './components/LiveImpactDashboard';
import { GhazipurMap } from './components/GhazipurMap';
import { VolunteerTaskPortal } from './components/VolunteerTaskPortal';
import { RecentEventsCarousel } from './components/RecentEventsCarousel';
import { VideoShowcase } from './components/VideoShowcase';
import { DonationWallOfFame } from './components/DonationWallOfFame';
import { VolunteerLeaderboard } from './components/VolunteerLeaderboard';
import { VolunteerVoices } from './components/VolunteerVoices';
import { ImpactStories } from './components/ImpactStories';
import { CertificateVerificationPortal } from './components/CertificateVerificationPortal';
import { VerifyPage } from './components/VerifyPage';
import { Footer } from './components/Footer';
import { HomeNoticeBanner } from './components/HomeNoticeBanner';
import { HomePhotoSlider } from './components/HomePhotoSlider';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Utilities and Floating tools
import { JyotiBot } from './components/JyotiBot';
import { NetworkStatusToast } from './components/NetworkStatusToast';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { FloatingShareToolbar } from './components/FloatingShareToolbar';
import { FestivalGreetingsPortal } from './components/FestivalGreetingsPortal';
import { ProfessionalFormsPortal } from './components/ProfessionalFormsPortal';

import { Volunteer, TaskRecord, DonationRecord, FestivalGreetingRecord } from './types';
import { INITIAL_VOLUNTEERS } from './data/taskData';
import { initAutomatedPublicArchiveBackgroundSync } from './services/publicVerifiedArchiveService';
import { useHomeContent } from './context/HomeContentContext';
import { GlobalSkeletonLoader } from './components/common/GlobalSkeletonLoader';

// Direct Modals Imports
import { VolunteerCertificateModal } from './components/VolunteerCertificateModal';
import { DonationCertificateModal } from './components/DonationCertificateModal';
import { Donation80GReceiptView } from './components/donation/Donation80GReceiptView';
import { Donation80GPortal } from './components/donation/Donation80GPortal';
import { DonorDashboardModal } from './components/donation/DonorDashboardModal';
import { SwayamSewakCardModal } from './components/SwayamSewakCardModal';
import { TaskAppreciationCardModal } from './components/TaskAppreciationCardModal';
import { FestivalCertificateModal } from './components/FestivalCertificateModal';
import { AnnualSummaryReportModal } from './components/AnnualSummaryReportModal';
import { AnnualReportCardModal } from './components/AnnualReportCardModal';
import { SuperAdminPortal } from './components/admin/SuperAdminPortal';
import { CameraQrScannerModal } from './components/CameraQrScannerModal';
import { OtpVerificationModal } from './components/OtpVerificationModal';
import { DownloadCertificatesModal } from './components/DownloadCertificatesModal';
import { QuickDonateOverlay } from './components/donation/QuickDonateOverlay';
import { GoogleDriveHubModal } from './components/drive/GoogleDriveHubModal';

export function App() {
  const { isLoading: isFirestoreLoading } = useHomeContent();
  const [verifyRouteId, setVerifyRouteId] = useState<string | null>(null);

  // Modals state
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [selectedIdCardVol, setSelectedIdCardVol] = useState<Volunteer | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskRecord | null>(null);
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null);
  const [selectedFestivalGreeting, setSelectedFestivalGreeting] = useState<FestivalGreetingRecord | null>(null);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [showQuickDonateModal, setShowQuickDonateModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAnnualReportCardModal, setShowAnnualReportCardModal] = useState(false);
  const [showMyDonationsModal, setShowMyDonationsModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [showQrScannerModal, setShowQrScannerModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showDownloadCertificatesModal, setShowDownloadCertificatesModal] = useState(false);
  const [showGoogleDriveModal, setShowGoogleDriveModal] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<'appreciation' | 'volunteer' | 'festival' | 'verification' | 'donation'>('appreciation');

  // Check URL params and boot background services on mount
  useEffect(() => {
    // Automated background service: Archive all issued certificates to Firestore 'public_verified_archive'
    initAutomatedPublicArchiveBackgroundSync().catch(() => {});

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const verifyParam =
        urlParams.get('verify') ||
        urlParams.get('cert_id') ||
        urlParams.get('id') ||
        urlParams.get('certNo') ||
        urlParams.get('receipt_no');
      if (verifyParam) {
        setVerifyRouteId(verifyParam);
      }
    }
  }, []);

  const handleDonationSuccess = (newDonation: DonationRecord) => {
    setShowDonateModal(false);
    setSelectedDonation(newDonation);
  };

  const handleScanResult = (resultId: string) => {
    setVerifyRouteId(resultId);
  };

  const handleOpenFormTab = (tab: 'appreciation' | 'volunteer' | 'festival' | 'verification' | 'donation') => {
    setActiveFormTab(tab);
    setTimeout(() => {
      const element = document.getElementById('official-forms');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  // If user requested a direct verification page
  if (verifyRouteId) {
    return (
      <div className="min-h-screen bg-[#FFFDF9] text-gray-900 flex flex-col font-sans">
        <VerifyPage
          initialCertId={verifyRouteId}
          onBack={() => setVerifyRouteId(null)}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-gray-900 flex flex-col font-sans selection:bg-amber-200 relative">
      {/* PWA Notification banner */}
      <PwaInstallBanner />

      {/* Dynamic Home Notice Board Banner from Firestore (Tab 2) */}
      <HomeNoticeBanner onOpenAdmin={() => setShowAdminLoginModal(true)} />

      {/* Header Navigation */}
      <Navbar
        onOpenDonate={() => setShowDonateModal(true)}
        onOpenReport={() => setShowReportModal(true)}
        onOpenAdmin={() => setShowAdminLoginModal(true)}
        onOpenGoogleDrive={() => setShowGoogleDriveModal(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection
          onOpenDonate={() => handleOpenFormTab('donation')}
          onOpenVolunteerPortal={() => handleOpenFormTab('volunteer')}
          onOpenAdmin={() => setShowAdminLoginModal(true)}
        />

        {/* Action Hub Strip */}
        <ActionCenter
          onOpenQuickDonate={() => setShowQuickDonateModal(true)}
          onOpenDownloadCertificates={() => setShowDownloadCertificatesModal(true)}
          onOpenDonate={() => handleOpenFormTab('donation')}
          onOpenVolunteerCert={() => handleOpenFormTab('volunteer')}
          onOpenDonationCert={() => handleOpenFormTab('donation')}
          onOpenIdCard={() => handleOpenFormTab('volunteer')}
          onOpenTaskCert={() => handleOpenFormTab('appreciation')}
          onOpenAnnualReport={() => setShowAnnualReportCardModal(true)}
          onOpenFestivalPortal={() => handleOpenFormTab('festival')}
          onOpenQrScanner={() => handleOpenFormTab('verification')}
          onOpenGoogleDrive={() => setShowGoogleDriveModal(true)}
        />

        {/* Home Page Photo Slider Showcase (Automatic Smooth Slideshow) */}
        <section id="home-gallery-showcase" className="py-10 bg-gradient-to-b from-amber-50/70 via-white to-amber-50/40 border-y border-amber-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8B0000] text-white text-xs font-black uppercase tracking-wider mb-2 shadow-xs">
                  <span>📸 जमीनी सेवा गतिविधियां (Ground Action Live Slides)</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-serif">
                  ग़ाज़ीपुर सेवा अभियानों की लाइव फ़ोटो गैलरी
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
                  निःशुल्क शिक्षा, अन्नपूर्णा भोजन, चिकित्सा शिविर एवं पर्यावरण संरक्षण की स्वचालित झलकियां
                </p>
              </div>

              <button
                onClick={() => setShowAdminLoginModal(true)}
                className="text-xs font-bold text-[#8B0000] hover:text-[#5a0000] underline self-start sm:self-auto cursor-pointer flex items-center gap-1"
                title="एडमिन पोर्टल से फ़ोटो जोड़ें / बदलें"
              >
                <span>एडमिन लॉगिन से फ़ोटो बदलें / जोड़ें</span>
                <span>→</span>
              </button>
            </div>

            {/* Main Interactive Clear Slideshow */}
            <HomePhotoSlider onOpenAdmin={() => setShowAdminLoginModal(true)} />
          </div>
        </section>

        {/* Live Counters */}
        <LiveImpactDashboard />

        {/* 5 Professional Forms Master Portal (Appreciation, Volunteer, Festival, Verification, Donation) */}
        <ProfessionalFormsPortal
          selectedTab={activeFormTab}
          onTabChange={setActiveFormTab}
          onOpenAppreciationCert={(task) => setSelectedTask(task)}
          onOpenVolunteerCard={(vol) => setSelectedIdCardVol(vol)}
          onOpenVolunteerCert={(vol) => setSelectedVolunteer(vol)}
          onOpenFestivalCert={(greeting) => setSelectedFestivalGreeting(greeting)}
          onOpenDonationCert={(donation) => setSelectedDonation(donation)}
          onOpenUpiDonate={() => setShowDonateModal(true)}
          onOpenVerifyModal={(certId) => setVerifyRouteId(certId)}
        />

        {/* Festival Greetings & Registration Tab Portal */}
        <FestivalGreetingsPortal
          onOpenCertificate={(greeting) => setSelectedFestivalGreeting(greeting)}
        />

        {/* Four Core Pillars */}
        <FourPillars />

        {/* Interactive Ghazipur Map */}
        <GhazipurMap />

        {/* Volunteer Task Portal & Live Seva Assignment */}
        <VolunteerTaskPortal
          onSelectVolunteerCertificate={(vol) => setSelectedVolunteer(vol)}
          onSelectTaskCertificate={(task) => setSelectedTask(task)}
          onSelectIdCard={(vol) => setSelectedIdCardVol(vol)}
        />

        {/* Recent Field Events & Ground News */}
        <RecentEventsCarousel />

        {/* Documentary Video Showcase */}
        <VideoShowcase />

        {/* Donors Wall of Fame */}
        <DonationWallOfFame
          onOpenDonate={() => setShowDonateModal(true)}
          onOpenDonationCert={() => setShowMyDonationsModal(true)}
          onSelectDonationForCert={(don) => setSelectedDonation(don)}
        />

        {/* Volunteer Leaderboard */}
        <VolunteerLeaderboard
          onOpenIdCard={() => {
            setActiveFormTab('volunteer');
            document.getElementById('official-forms')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenVolunteerCert={() => setSelectedVolunteer(INITIAL_VOLUNTEERS[0])}
        />

        {/* Voices from Ground */}
        <VolunteerVoices />

        {/* Official Certificate Verification Portal */}
        <CertificateVerificationPortal />

        {/* Ground Impact Stories */}
        <ImpactStories />
      </main>

      {/* Footer */}
      <Footer onOpenAdmin={() => setShowAdminLoginModal(true)} />

      {/* Interactive AI Chatbot */}
      <JyotiBot />

      {/* Floating Share Toolbar */}
      <FloatingShareToolbar
        onOpenQr={() => setShowQrScannerModal(true)}
        onOpenQuickDonate={() => setShowQuickDonateModal(true)}
      />

      {/* Network Status Offline Alert */}
      <NetworkStatusToast />

      {/* -------------------- ALL MODALS (SUSPENSE & ERROR BOUNDARY PROTECTED) -------------------- */}
      <ErrorBoundary fallbackTitle="मॉडल लोडिंग में समस्या (Modal Loading Issue)">
        {/* Modals & Overlays */}
        {/* 0. Quick Donate QR Code Overlay for Rapid Mobile Payments */}
          {showQuickDonateModal && (
            <QuickDonateOverlay
              isOpen={showQuickDonateModal}
              onClose={() => setShowQuickDonateModal(false)}
              onDonationSuccess={handleDonationSuccess}
              onOpenFullForm={() => {
                setShowQuickDonateModal(false);
                handleOpenFormTab('donation');
              }}
              onOpenAdminSettings={() => {
                setShowQuickDonateModal(false);
                setShowAdminLoginModal(true);
              }}
            />
          )}
          {/* 1. Volunteer Appreciation Certificate Modal */}
          {selectedVolunteer && (
            <VolunteerCertificateModal
              volunteer={selectedVolunteer}
              onClose={() => setSelectedVolunteer(null)}
            />
          )}

          {/* 2. Swayam Sewak Official ID Card Modal */}
          {selectedIdCardVol && (
            <SwayamSewakCardModal
              volunteer={selectedIdCardVol}
              onClose={() => setSelectedIdCardVol(null)}
              onOpenRegistrationForm={() => {
                setActiveFormTab('volunteer');
                document.getElementById('official-forms')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}

          {/* 3. Task Appreciation Certificate Modal */}
          {selectedTask && (
            <TaskAppreciationCardModal
              task={selectedTask}
              onClose={() => setSelectedTask(null)}
            />
          )}

          {/* 4. Official Donation Receipt A4 PDF Modal */}
          {selectedDonation && (
            <Donation80GReceiptView
              donation={selectedDonation}
              onClose={() => setSelectedDonation(null)}
            />
          )}

          {/* 4.5. Festival Greeting & Blessing Certificate Modal */}
          {selectedFestivalGreeting && (
            <FestivalCertificateModal
              greeting={selectedFestivalGreeting}
              onClose={() => setSelectedFestivalGreeting(null)}
            />
          )}

          {/* 5. Online Donation Portal */}
          {showDonateModal && (
            <Donation80GPortal
              isOpen={showDonateModal}
              onClose={() => setShowDonateModal(false)}
              onDonationSuccess={handleDonationSuccess}
              onOpenDonorDashboard={() => {
                setShowDonateModal(false);
                setShowMyDonationsModal(true);
              }}
            />
          )}

          {/* 6. Annual Summary Report Modal */}
          {showReportModal && (
            <AnnualSummaryReportModal
              onClose={() => setShowReportModal(false)}
            />
          )}

          {/* 7. Annual Report Card Modal */}
          {showAnnualReportCardModal && (
            <AnnualReportCardModal
              isOpen={showAnnualReportCardModal}
              onClose={() => setShowAnnualReportCardModal(false)}
            />
          )}

          {/* 8. My Donations Explorer & Receipt Retrieval Modal */}
          {showMyDonationsModal && (
            <DonorDashboardModal
              isOpen={showMyDonationsModal}
              onClose={() => setShowMyDonationsModal(false)}
              onSelectReceipt={(don) => {
                setShowMyDonationsModal(false);
                setSelectedDonation(don);
              }}
            />
          )}

          {/* 9. Super Admin & Admin Control Master Portal */}
          {showAdminLoginModal && (
            <SuperAdminPortal
              isOpen={showAdminLoginModal}
              onClose={() => setShowAdminLoginModal(false)}
              onOpenVerificationPortal={(certId) => {
                setShowAdminLoginModal(false);
                setVerifyRouteId(certId);
              }}
            />
          )}

          {/* 10. QR Camera Scanner Modal */}
          {showQrScannerModal && (
            <CameraQrScannerModal
              isOpen={showQrScannerModal}
              onClose={() => setShowQrScannerModal(false)}
              onScanResult={handleScanResult}
            />
          )}

          {/* 11. OTP Verification Modal */}
          {showOtpModal && (
            <OtpVerificationModal
              isOpen={showOtpModal}
              onClose={() => setShowOtpModal(false)}
              onSuccess={() => {}}
            />
          )}

          {/* 12. Citizen Certificate & ID Card Download Center with OTP Verification */}
          {showDownloadCertificatesModal && (
            <DownloadCertificatesModal
              isOpen={showDownloadCertificatesModal}
              onClose={() => setShowDownloadCertificatesModal(false)}
              onPreviewVolunteerCert={(vol) => {
                setShowDownloadCertificatesModal(false);
                setSelectedVolunteer(vol);
              }}
              onPreviewIdCard={(vol) => {
                setShowDownloadCertificatesModal(false);
                setSelectedIdCardVol(vol);
              }}
              onPreviewDonationCert={(don) => {
                setShowDownloadCertificatesModal(false);
                setSelectedDonation(don);
              }}
              onPreviewTaskCert={(task) => {
                setShowDownloadCertificatesModal(false);
                setSelectedTask(task);
              }}
              onPreviewFestivalCert={(fest) => {
                setShowDownloadCertificatesModal(false);
                setSelectedFestivalGreeting(fest);
              }}
            />
          )}

          {/* 13. Google Drive Official Document Hub Modal */}
          {showGoogleDriveModal && (
            <GoogleDriveHubModal
              isOpen={showGoogleDriveModal}
              onClose={() => setShowGoogleDriveModal(false)}
            />
          )}
      </ErrorBoundary>
    </div>
  );
}

export default App;
