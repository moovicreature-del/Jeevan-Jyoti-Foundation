import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  HardDrive,
  Folder,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  File,
  Upload,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FolderPlus,
  ArrowLeft,
  DownloadCloud,
  Database,
  Users,
  HeartHandshake
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  signInWithGoogleDrive,
  signOutGoogleDrive,
  getDriveAccessToken,
  initDriveAuth,
  listDriveFiles,
  createDriveFolder,
  uploadFileToDrive,
  deleteDriveFile,
  formatFileSize,
  GoogleDriveFile,
} from '../../services/googleDriveService';
import { useLanguage } from '../../context/LanguageContext';
import { DONORS_DATA } from '../../data/donorsData';
import { INITIAL_VOLUNTEERS } from '../../data/taskData';
import { FOUNDATION_INFO } from '../../data/foundationData';

interface GoogleDriveHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BreadcrumbItem {
  id: string;
  name: string;
}

export const GoogleDriveHubModal: React.FC<GoogleDriveHubModalProps> = ({ isOpen, onClose }) => {
  const { isHindi } = useLanguage();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getDriveAccessToken());
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Drive Navigation & Files State
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState<BreadcrumbItem>({ id: 'root', name: 'My Drive' });
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { id: 'root', name: 'My Drive' },
  ]);

  // Actions State
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // File Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Destructive Action Confirmation Modal State (MANDATORY)
  const [fileToDelete, setFileToDelete] = useState<GoogleDriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Backup Quick Export State
  const [isExportingBackup, setIsExportingBackup] = useState(false);

  // Initialize Auth state on mount
  useEffect(() => {
    const unsubscribe = initDriveAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
        setAuthError(null);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Fetch files whenever folder changes or token is acquired
  useEffect(() => {
    if (isOpen && accessToken) {
      loadFiles(activeFolder.id);
    }
  }, [isOpen, accessToken, activeFolder.id]);

  const loadFiles = async (folderId: string, query?: string) => {
    setIsLoadingFiles(true);
    try {
      const result = await listDriveFiles({
        folderId,
        query,
      });
      setFiles(result.files);
    } catch (err: any) {
      console.error('Error fetching Google Drive files:', err);
      if (err.message?.includes('401') || err.message?.includes('Not authenticated')) {
        setAccessToken(null);
        setCurrentUser(null);
      }
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await signInWithGoogleDrive();
      setCurrentUser(res.user);
      setAccessToken(res.accessToken);
    } catch (err: any) {
      console.error('Sign in failed:', err);
      let msg = err.message || 'Google Drive authentication failed';
      if (err.code === 'auth/popup-blocked') {
        msg = isHindi
          ? 'पॉपअप ब्लॉक हो गया है। कृपया ब्राउज़र में पॉपअप की अनुमति दें या नए टैब में खोलें।'
          : 'Popup was blocked by the browser. Please allow popups or open in a new tab.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        msg = isHindi ? 'लॉगिन रद्द किया गया।' : 'Sign-in cancelled.';
      }
      setAuthError(msg);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await signOutGoogleDrive();
    setCurrentUser(null);
    setAccessToken(null);
    setFiles([]);
  };

  const handleFolderClick = (folder: GoogleDriveFile) => {
    const nextBreadcrumb = { id: folder.id, name: folder.name };
    setBreadcrumbs((prev) => [...prev, nextBreadcrumb]);
    setActiveFolder(nextBreadcrumb);
    setSearchQuery('');
  };

  const handleBreadcrumbClick = (item: BreadcrumbItem, index: number) => {
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
    setActiveFolder(item);
    setSearchQuery('');
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setIsCreatingFolder(true);
    try {
      await createDriveFolder(newFolderName.trim(), activeFolder.id);
      setNewFolderName('');
      setShowNewFolderModal(false);
      await loadFiles(activeFolder.id);
      triggerSuccessToast(isHindi ? 'फ़ोल्डर सफलतापूर्वक बनाया गया' : 'Folder created successfully');
    } catch (err: any) {
      alert(err.message || 'Failed to create folder');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];
    setIsUploading(true);

    try {
      await uploadFileToDrive({
        fileData: file,
        fileName: file.name,
        mimeType: file.type || 'application/octet-stream',
        parentId: activeFolder.id,
      });

      await loadFiles(activeFolder.id);
      triggerSuccessToast(
        isHindi
          ? `फ़ाइल "${file.name}" गूगल ड्राइव में अपलोड हो गई!`
          : `File "${file.name}" uploaded to Google Drive!`
      );
    } catch (err: any) {
      alert(err.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;

    setIsDeleting(true);
    try {
      await deleteDriveFile(fileToDelete.id);
      triggerSuccessToast(
        isHindi
          ? `"${fileToDelete.name}" ड्राइव से हटा दी गई।`
          : `"${fileToDelete.name}" deleted from Google Drive.`
      );
      setFileToDelete(null);
      await loadFiles(activeFolder.id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete file');
    } finally {
      setIsDeleting(false);
    }
  };

  const triggerSuccessToast = (msg: string) => {
    setUploadSuccessMsg(msg);
    setTimeout(() => {
      setUploadSuccessMsg(null);
    }, 4000);
  };

  // Quick 1-Click Backup NGO Data to Google Drive
  const handleExportNgoBackup = async (type: 'donors' | 'volunteers' | 'full_audit') => {
    setIsExportingBackup(true);
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

      if (type === 'donors') {
        const jsonContent = JSON.stringify(
          {
            foundation: FOUNDATION_INFO.nameEnglish,
            registrationNo: FOUNDATION_INFO.regNo,
            pan: FOUNDATION_INFO.pan,
            exportedAt: new Date().toLocaleString('en-IN'),
            totalDonors: DONORS_DATA.length,
            records: DONORS_DATA,
          },
          null,
          2
        );

        const fileName = `Jeevan_Jyoti_Donors_Registry_${timestamp}.json`;
        await uploadFileToDrive({
          fileData: jsonContent,
          fileName,
          mimeType: 'application/json',
          parentId: activeFolder.id,
          description: 'Official 80G Certified Donors Registry Backup - Jeevan Jyoti Foundation',
        });
      } else if (type === 'volunteers') {
        // Generate clean CSV
        const headers = 'ID,Name,Father_Husband,Contact,Role,Date_Joined,Status\n';
        const rows = INITIAL_VOLUNTEERS.map(
          (v) =>
            `"${v.id}","${v.name}","${v.fatherName || ''}","${v.phone || ''}","${v.role}","${v.joinDate}","${v.status}"`
        ).join('\n');
        const csvContent = headers + rows;

        const fileName = `Jeevan_Jyoti_Volunteers_Roster_${timestamp}.csv`;
        await uploadFileToDrive({
          fileData: csvContent,
          fileName,
          mimeType: 'text/csv',
          parentId: activeFolder.id,
          description: 'Active Volunteer Roster - Jeevan Jyoti Foundation Ghazipur',
        });
      } else {
        // Full Foundation Audit Snapshot
        const fullContent = JSON.stringify(
          {
            organization: FOUNDATION_INFO,
            donorsCount: DONORS_DATA.length,
            volunteersCount: INITIAL_VOLUNTEERS.length,
            exportedAt: new Date().toISOString(),
            status: 'Verified NGO Archive Snapshot',
          },
          null,
          2
        );

        const fileName = `Jeevan_Jyoti_Audit_Report_${timestamp}.json`;
        await uploadFileToDrive({
          fileData: fullContent,
          fileName,
          mimeType: 'application/json',
          parentId: activeFolder.id,
        });
      }

      await loadFiles(activeFolder.id);
      triggerSuccessToast(
        isHindi
          ? 'संस्था का बैकअप सीधे गूगल ड्राइव में सुरक्षित कर दिया गया!'
          : 'Foundation record backup saved directly to Google Drive!'
      );
    } catch (err: any) {
      alert(err.message || 'Backup export failed');
    } finally {
      setIsExportingBackup(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className="w-5 h-5 text-amber-500 fill-amber-500" />;
    }
    if (mimeType.includes('pdf')) {
      return <FileText className="w-5 h-5 text-red-600" />;
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('csv') || mimeType.includes('excel')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    }
    if (mimeType.includes('image')) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    }
    return <File className="w-5 h-5 text-slate-500" />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl border border-white/20">
              <HardDrive className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black font-serif tracking-tight">
                  {isHindi ? 'गूगल ड्राइव दस्तावेज़ केंद्र' : 'Google Drive Document Hub'}
                </h3>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                {isHindi
                  ? 'जीवन ज्योति फाउंडेशन के अभिलेख, रिपोर्ट, प्रमाण पत्र व बैकअप ड्राइव में सुरक्षित रखें'
                  : 'Manage NGO records, certificates, audits, and cloud backups directly in Google Drive'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Toast */}
        {uploadSuccessMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{uploadSuccessMsg}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* AUTHENTICATION VIEW: WHEN NOT LOGGED IN                                    */}
        {/* ========================================================================= */}
        {!accessToken ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center my-auto space-y-6">
            <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center border-2 border-amber-200 shadow-inner">
              <svg className="w-12 h-12" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.5l5.85 10.15z" fill="#ea4335"/>
                <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
              </svg>
            </div>

            <div className="max-w-md space-y-2">
              <h4 className="text-2xl font-black text-slate-900 font-serif">
                {isHindi ? 'गूगल ड्राइव से जुड़ें' : 'Connect to Google Drive'}
              </h4>
              <p className="text-sm text-slate-600">
                {isHindi
                  ? 'जीवन ज्योति फाउंडेशन के आधिकारिक दस्तावेज़ देखने, नए फोल्डर बनाने व रिकॉर्ड्स का बैकअप सुरक्षित करने हेतु गूगल से लॉगिन करें।'
                  : 'Sign in with your Google account to access, upload, organize NGO files, and export cloud backups to Google Drive.'}
              </p>
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl max-w-md text-left flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <div>
                  <span className="font-bold">Authentication Issue: </span>
                  {authError}
                </div>
              </div>
            )}

            {/* Official Material Design "Sign in with Google" Button */}
            <div className="pt-2">
              <button
                type="button"
                id="google-drive-signin-btn"
                disabled={isAuthenticating}
                onClick={handleSignIn}
                className="group relative inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 text-sm font-bold rounded-2xl border-2 border-slate-300 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {isAuthenticating ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-amber-600" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                )}
                <span>
                  {isAuthenticating
                    ? isHindi
                      ? 'गूगल से कनेक्ट हो रहा है...'
                      : 'Connecting to Google...'
                    : isHindi
                    ? 'गूगल से साइन इन करें (Sign in with Google)'
                    : 'Sign in with Google'}
                </span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 max-w-sm">
              {isHindi
                ? 'सहमति के साथ आपकी गूगल ड्राइव फाइलों को सुरक्षित तरीके से सूचीबद्ध व प्रबंधित किया जाएगा।'
                : 'With your explicit consent, your Google Drive files will be securely listed and managed.'}
            </p>
          </div>
        ) : (
          /* ========================================================================= */
          /* LOGGED IN VIEW: DRIVE EXPLORER, BREADCRUMBS, ACTIONS, BACKUPS             */
          /* ========================================================================= */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* User & Top Action Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              {/* Connected User Profile Pill */}
              <div className="flex items-center gap-2.5">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Google User'}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border border-slate-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                    {currentUser?.displayName?.charAt(0) || 'G'}
                  </div>
                )}
                <div>
                  <div className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <span>{currentUser?.displayName || 'Google Account'}</span>
                    <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                      Connected
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {currentUser?.email}
                  </div>
                </div>
              </div>

              {/* Action Buttons: New Folder, Upload, Quick NGO Backup, Sign Out */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Upload File */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Upload any file from your computer/device"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? (isHindi ? 'अपलोड हो रहा है...' : 'Uploading...') : (isHindi ? 'फ़ाइल अपलोड' : 'Upload File')}</span>
                </button>

                {/* New Folder */}
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(true)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isHindi ? 'नया फ़ोल्डर' : 'New Folder'}</span>
                </button>

                {/* Quick 1-Click NGO Backup Dropdown */}
                <div className="relative group">
                  <button
                    type="button"
                    disabled={isExportingBackup}
                    className="px-3.5 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    title="Export foundation registry directly to Google Drive"
                  >
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span>{isExportingBackup ? (isHindi ? 'बैकअप बन रहा है...' : 'Saving...') : (isHindi ? 'NGO रिकॉर्ड्स बैकअप' : 'Export NGO Records')}</span>
                  </button>

                  <div className="absolute right-0 top-full mt-1.5 w-60 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 hidden group-hover:block z-30 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onClick={() => handleExportNgoBackup('donors')}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition flex items-center gap-2 cursor-pointer"
                    >
                      <HeartHandshake className="w-4 h-4 text-red-600" />
                      <div>
                        <div>{isHindi ? 'दानदाता लेजर (JSON)' : 'Donors Ledger (JSON)'}</div>
                        <div className="text-[10px] text-slate-400 font-normal">80G tax records backup</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportNgoBackup('volunteers')}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition flex items-center gap-2 cursor-pointer"
                    >
                      <Users className="w-4 h-4 text-indigo-600" />
                      <div>
                        <div>{isHindi ? 'स्वयंसेवक सूची (CSV)' : 'Volunteers Roster (CSV)'}</div>
                        <div className="text-[10px] text-slate-400 font-normal">Active volunteers spreadsheet</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExportNgoBackup('full_audit')}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-slate-800 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition flex items-center gap-2 cursor-pointer border-t border-slate-100"
                    >
                      <Database className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div>{isHindi ? 'संस्था ऑडिट सारांश' : 'Foundation Full Snapshot'}</div>
                        <div className="text-[10px] text-slate-400 font-normal">Complete NGO statistics backup</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Sign Out Button */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                  title="Disconnect Google Drive"
                >
                  {isHindi ? 'साइन आउट' : 'Sign Out'}
                </button>
              </div>
            </div>

            {/* Breadcrumb Navigation & Search Filter */}
            <div className="px-6 py-3 bg-white border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Breadcrumb Links */}
              <div className="flex items-center gap-1 text-xs font-bold text-slate-600 overflow-x-auto py-1">
                {breadcrumbs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleBreadcrumbClick(breadcrumbs[breadcrumbs.length - 2], breadcrumbs.length - 2)}
                    className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 mr-1 cursor-pointer"
                    title="Go up one level"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}

                {breadcrumbs.map((crumb, idx) => {
                  const isLast = idx === breadcrumbs.length - 1;
                  return (
                    <React.Fragment key={crumb.id + idx}>
                      {idx > 0 && <span className="text-slate-300">/</span>}
                      <button
                        type="button"
                        onClick={() => handleBreadcrumbClick(crumb, idx)}
                        disabled={isLast}
                        className={`px-2 py-1 rounded-lg transition cursor-pointer whitespace-nowrap ${
                          isLast
                            ? 'text-indigo-900 bg-indigo-50 font-black'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        {crumb.name}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Search & Refresh */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        loadFiles(activeFolder.id, searchQuery);
                      }
                    }}
                    placeholder={isHindi ? 'ड्राइव में खोजें...' : 'Search files in Drive...'}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 transition"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => loadFiles(activeFolder.id, searchQuery)}
                  disabled={isLoadingFiles}
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer disabled:opacity-50"
                  title="Refresh Drive files"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Files & Folders Content List */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingFiles ? (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-amber-600" />
                  <p className="text-xs font-medium">
                    {isHindi ? 'गूगल ड्राइव फाइलें लोड हो रही हैं...' : 'Loading Google Drive items...'}
                  </p>
                </div>
              ) : files.length === 0 ? (
                <div className="py-20 text-center text-slate-500 space-y-3 max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-slate-100 rounded-3xl mx-auto flex items-center justify-center">
                    <Folder className="w-8 h-8 text-slate-400" />
                  </div>
                  <h5 className="font-bold text-sm text-slate-800">
                    {isHindi ? 'इस फ़ोल्डर में कोई फ़ाइल नहीं है' : 'No files found in this folder'}
                  </h5>
                  <p className="text-xs text-slate-500">
                    {isHindi
                      ? 'ऊपर दिए गए "फ़ाइल अपलोड" या "NGO रिकॉर्ड्स बैकअप" बटन से तुरंत दस्तावेज़ सुरक्षित करें।'
                      : 'Upload files using the buttons above or export an instant foundation backup.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {files.map((file) => {
                    const isFolder = file.mimeType === 'application/vnd.google-apps.folder';

                    return (
                      <div
                        key={file.id}
                        className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 group ${
                          isFolder
                            ? 'bg-amber-50/40 border-amber-200 hover:border-amber-400 hover:bg-amber-50/80 cursor-pointer shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                        }`}
                        onClick={() => {
                          if (isFolder) handleFolderClick(file);
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="shrink-0">{getFileIcon(file.mimeType)}</div>
                          <div className="min-w-0 flex-1">
                            <div
                              className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-900"
                              title={file.name}
                            >
                              {file.name}
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                              {file.size ? <span>{formatFileSize(file.size)}</span> : null}
                              {file.modifiedTime ? (
                                <span>
                                  {new Date(file.modifiedTime).toLocaleDateString('hi-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                  })}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        {/* Actions for Item */}
                        <div
                          className="flex items-center gap-1 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                              title="Open in Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Delete File Button (triggers MANDATORY confirmation dialog) */}
                          <button
                            type="button"
                            onClick={() => setFileToDelete(file)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{FOUNDATION_INFO.nameEnglish} • Cloud Vault</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-300 transition cursor-pointer"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-MODAL 1: CREATE NEW FOLDER                                            */}
      {/* ========================================================================= */}
      {showNewFolderModal && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-amber-600" />
                <span>{isHindi ? 'नया फ़ोल्डर बनाएं' : 'Create New Folder'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowNewFolderModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? 'फ़ोल्डर का नाम *' : 'Folder Name *'}
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="उदा. Foundation Audit 2026 / Field Photos"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isCreatingFolder || !newFolderName.trim()}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-50"
                >
                  {isCreatingFolder ? (isHindi ? 'बनाया जा रहा है...' : 'Creating...') : (isHindi ? 'फ़ोल्डर बनाएं' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-MODAL 2: MANDATORY DESTRUCTIVE ACTION CONFIRMATION DIALOG              */}
      {/* ========================================================================= */}
      {fileToDelete && (
        <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-base text-slate-900">
                  {isHindi ? 'फ़ाइल हटाने की पुष्टि करें' : 'Confirm Deletion'}
                </h4>
                <p className="text-xs text-slate-500">Google Drive Destructive Action</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-900 break-all">{fileToDelete.name}</div>
              <div className="text-slate-500 font-mono text-[11px]">
                Type: {fileToDelete.mimeType} {fileToDelete.size ? `• ${formatFileSize(fileToDelete.size)}` : ''}
              </div>
            </div>

            <p className="text-xs text-red-700 font-medium leading-relaxed">
              {isHindi
                ? 'क्या आप वाकई इस फ़ाइल को गूगल ड्राइव से हटाना चाहते हैं? यह क्रिया वापस नहीं ली जा सकती।'
                : 'Are you sure you want to delete this file from Google Drive? This action cannot be undone.'}
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setFileToDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                {isHindi ? 'रद्द करें (Cancel)' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>{isDeleting ? (isHindi ? 'हटाया जा रहा है...' : 'Deleting...') : (isHindi ? 'हाँ, हटाएं (Confirm Delete)' : 'Confirm Delete')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleDriveHubModal;
