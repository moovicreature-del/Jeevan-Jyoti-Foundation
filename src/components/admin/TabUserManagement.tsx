// ============================================================================
// JEEVAN JYOTI FOUNDATION - TAB 4: USER MANAGEMENT (SUPER ADMIN ONLY)
// जीवन ज्योति फाउंडेशन - सुपर एडमिन यूज़र प्रबंधन एवं ऑडिट लॉग्स
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  Crown,
  CheckCircle,
  XCircle,
  Trash2,
  Clock,
  Search,
  RotateCw,
  AlertOctagon,
  UserPlus,
  Activity,
  Phone,
  Mail,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  getAllAdminUsers,
  setAdminApprovalStatus,
  updateAdminRole,
  deleteAdminUser,
  getAdminActivityLogs
} from '../../services/adminService';
import { AdminUser, AdminActivityLog } from '../../types';
import toast from 'react-hot-toast';

export const TabUserManagement: React.FC = () => {
  const { adminProfile, isSuperAdmin } = useAdminAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [logs, setLogs] = useState<AdminActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [subTab, setSubTab] = useState<'admins' | 'logs'>('admins');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRole, setFilterRole] = useState<'all' | 'superadmin' | 'admin' | 'pending'>('all');

  // Load admins and logs
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedUsers, fetchedLogs] = await Promise.all([
        getAllAdminUsers(),
        getAdminActivityLogs(50)
      ]);

      // If database has no users yet, seed master admin
      if (fetchedUsers.length === 0 && adminProfile) {
        setUsers([adminProfile]);
      } else {
        setUsers(fetchedUsers);
      }
      setLogs(fetchedLogs);
    } catch (error) {
      console.error('Error loading user management data:', error);
      toast.error('यूज़र सूची लोड करने में त्रुटि।');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      loadData();
    }
  }, [isSuperAdmin]);

  // Security Check: Only Super Admin
  if (!isSuperAdmin) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm border border-red-200 space-y-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertOctagon className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-slate-900">
          प्रवेश प्रतिबंधित (Access Restricted)
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          यूज़र मैनेजमेंट और एडमिन अनुमोदन का अधिकार केवल <strong>सुपर एडमिन (Super Admin)</strong> के पास सुरक्षित है।
        </p>
      </div>
    );
  }

  // Handle Approve / Reject
  const handleToggleApproval = async (targetUser: AdminUser, approve: boolean) => {
    if (!adminProfile) return;

    // Prevent rejecting master super admin
    if ((targetUser.mobile === '8052361666' || targetUser.mobile === '9876543210') && !approve) {
      toast.error('मुख्य सुपर एडमिन (8052361666) को रिजेक्ट/निलंबित नहीं किया जा सकता!');
      return;
    }

    try {
      await setAdminApprovalStatus(targetUser.uid, approve, adminProfile.name, adminProfile.uid);
      toast.success(
        approve
          ? `${targetUser.name} को सफलतापूर्वक Approve कर दिया गया!`
          : `${targetUser.name} का खाता निलंबित (Reject) कर दिया गया।`
      );
      loadData();
    } catch {
      toast.error('स्थिति अद्यतन करने में त्रुटि आई।');
    }
  };

  // Handle Role Change
  const handleRoleChange = async (targetUser: AdminUser, newRole: 'superadmin' | 'admin') => {
    if (!adminProfile) return;
    if (targetUser.uid === adminProfile.uid) {
      toast.error('आप अपना स्वयं का रोल नहीं बदल सकते!');
      return;
    }

    try {
      await updateAdminRole(targetUser.uid, newRole, adminProfile.name, adminProfile.uid);
      toast.success(`${targetUser.name} का रोल बदलकर ${newRole.toUpperCase()} कर दिया गया!`);
      loadData();
    } catch {
      toast.error('रोल बदलने में त्रुटि।');
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (targetUser: AdminUser) => {
    if (!adminProfile) return;
    if (targetUser.uid === adminProfile.uid) {
      toast.error('आप अपना स्वयं का खाता नहीं हटा सकते!');
      return;
    }
    if (targetUser.mobile === '8052361666' || targetUser.mobile === '9876543210') {
      toast.error('मुख्य सुपर एडमिन (8052361666) खाता सुरक्षित है!');
      return;
    }

    if (!window.confirm(`क्या आप वाकई एडमिन "${targetUser.name}" को हमेशा के लिए हटाना चाहते हैं?`)) {
      return;
    }

    try {
      await deleteAdminUser(targetUser.uid, targetUser.name, adminProfile.name, adminProfile.uid);
      toast.success(`एडमिन ${targetUser.name} को हटा दिया गया।`);
      loadData();
    } catch {
      toast.error('हटाने में त्रुटि आई।');
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.mobile && u.mobile.includes(searchTerm)) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchSearch) return false;

    if (filterRole === 'superadmin') return u.role === 'superadmin';
    if (filterRole === 'admin') return u.role === 'admin';
    if (filterRole === 'pending') return !u.approved;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
              <Crown className="w-4 h-4" />
              <span>TAB 4: SUPER ADMIN CONTROL PANEL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              यूज़र प्रबंधन एवं एडमिन अनुमोदन (Admin Management)
            </h2>
            <p className="text-xs text-blue-100 mt-1 max-w-xl">
              सभी एडमिन्स की सूची, नए रजिस्ट्रेशन की स्वीकृति (Approval/Rejection), रोल असाइनमेंट और सम्पूर्ण एक्टिविटी ऑडिट लॉग्स।
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition cursor-pointer border border-white/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>डेटा रिफ्रेश करें</span>
          </button>
        </div>
      </div>

      {/* Subtabs: Admin Users vs Activity Logs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setSubTab('admins')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
              subTab === 'admins'
                ? 'bg-blue-800 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>एडमिन सदस्य सूची ({users.length})</span>
          </button>

          <button
            onClick={() => setSubTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-2 ${
              subTab === 'logs'
                ? 'bg-blue-800 text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span>गतिविधि ऑडिट लॉग्स ({logs.length})</span>
          </button>
        </div>

        {subTab === 'admins' && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 hidden sm:inline font-bold">फ़िल्टर:</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="all">सभी सदस्य (All)</option>
              <option value="pending">प्रतीक्षारत (Pending Approval)</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}
      </div>

      {/* SUBTAB 1: ADMINS LIST */}
      {subTab === 'admins' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="नाम, मोबाइल नंबर या ईमेल द्वारा खोजें..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-700 shadow-xs"
            />
          </div>

          {/* Admins Table / Cards */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Users className="w-10 h-10 mx-auto opacity-40 text-blue-700" />
                <p className="text-xs font-bold text-slate-600">कोई एडमिन नहीं मिला</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <div
                    key={u.uid}
                    className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/80 transition"
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                          u.role === 'superadmin'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}
                      >
                        {u.role === 'superadmin' ? <Crown className="w-5 h-5 text-amber-600" /> : <ShieldCheck className="w-5 h-5 text-blue-700" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-slate-900">{u.name}</h4>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                              u.role === 'superadmin'
                                ? 'bg-amber-400 text-blue-950'
                                : 'bg-blue-800 text-white'
                            }`}
                          >
                            {u.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                          </span>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              u.approved
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800 ring-1 ring-amber-400'
                            }`}
                          >
                            {u.approved ? (
                              <>
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                <span>Approved</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                                <span>Pending Approval</span>
                              </>
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            +91 {u.mobile}
                          </span>
                          {u.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              {u.email}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            पंजीकरण: {new Date(u.createdAt).toLocaleDateString('hi-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
                      {/* Approval Toggle */}
                      {u.approved ? (
                        <button
                          onClick={() => handleToggleApproval(u, false)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
                        >
                          निलंबित करें (Suspend)
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleApproval(u, true)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>स्वीकृत करें (Approve)</span>
                        </button>
                      )}

                      {/* Role Switcher */}
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u, e.target.value as any)}
                        className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none"
                      >
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteUser(u)}
                        title="Delete Admin"
                        className="p-2 bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-700 rounded-xl transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: ACTIVITY AUDIT LOGS */}
      {subTab === 'logs' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-700" />
                <span>प्रशासनिक गतिविधि ऑडिट ट्रेल (Security Audit Log)</span>
              </h3>
              <span className="text-[11px] text-slate-500">
                एडमिन्स द्वारा किए गए सभी कार्यों की समयानुसार सूची
              </span>
            </div>
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
              Real-time Logs
            </span>
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Activity className="w-8 h-8 mx-auto opacity-40 text-blue-700" />
              <p className="text-xs font-bold text-slate-600">कोई गतिविधि लॉग उपलब्ध नहीं है</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.adminName}</span>
                      <span className="text-[10px] font-mono bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded font-bold">
                        {log.action}
                      </span>
                    </div>
                    <p className="text-slate-600">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('hi-IN', {
                      dateStyle: 'short',
                      timeStyle: 'short'
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
