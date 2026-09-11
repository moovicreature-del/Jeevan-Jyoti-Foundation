// ============================================================================
// JEEVAN JYOTI FOUNDATION - TAB 2: NOTICE BOARD MANAGER
// जीवन ज्योति फाउंडेशन - सूचना पट्ट (Notice Board) प्रबंधक
// ============================================================================

import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Calendar,
  AlertTriangle,
  RotateCw,
  Sparkles,
  Megaphone,
  Eye,
  Save,
  Check
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useHomeContent } from '../../context/HomeContentContext';
import { useAdminUploadProgress } from '../../context/AdminUploadProgressContext';
import { createNotice, updateNotice, deleteNotice } from '../../services/adminService';
import { NoticeItem } from '../../types';
import toast from 'react-hot-toast';

export const TabNoticeBoardManager: React.FC = () => {
  const { adminProfile } = useAdminAuth();
  const { notices } = useHomeContent();
  const { startUpload, updateProgress, completeUpload, failUpload } = useAdminUploadProgress();

  const [title, setTitle] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [date, setDate] = useState<string>(
    new Date().toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  );
  const [isActive, setIsActive] = useState<boolean>(true);
  const [priority, setPriority] = useState<'normal' | 'urgent' | 'high'>('normal');

  const [editingNoticeId, setEditingNoticeId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // नया नोटिस सबमिट करें या एडिट सेव करें
  const handleSubmitNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('कृपया सूचना का शीर्षक दर्ज करें!');
      return;
    }
    if (!message.trim()) {
      toast.error('कृपया सूचना का विस्तृत संदेश (Message) लिखें!');
      return;
    }
    if (!adminProfile) {
      toast.error('कृपया पहले लॉगिन करें!');
      return;
    }

    setIsSaving(true);
    startUpload(
      editingNoticeId ? 'सूचना अपडेट हो रही है' : 'नई सूचना प्रकाशित हो रही है',
      'notice',
      title.trim()
    );
    updateProgress(35, 'डेटाबेस में नोटिस रिकॉर्ड तैयार हो रहा है...');

    try {
      if (editingNoticeId) {
        updateProgress(70, 'फ़ायरस्टोर में सूचना अपडेट की जा रही है...');
        await updateNotice(
          editingNoticeId,
          {
            title: title.trim(),
            message: message.trim(),
            date,
            isActive,
            priority
          },
          adminProfile.name,
          adminProfile.uid
        );
        completeUpload('सूचना सफलतापूर्वक अपडेट कर दी गई!');
        toast.success('सूचना सफलतापूर्वक अपडेट कर दी गई!');
        setEditingNoticeId(null);
      } else {
        updateProgress(70, 'होम पेज सूचना पट्ट पर रिकॉर्ड सिंक हो रहा है...');
        await createNotice(
          {
            title: title.trim(),
            message: message.trim(),
            date,
            isActive,
            priority
          },
          adminProfile.name,
          adminProfile.uid
        );
        completeUpload('नई सूचना सफलतापूर्वक प्रकाशित हो गई!');
        toast.success('नई सूचना सफलतापूर्वक होम पेज पर प्रकाशित हो गई!');
      }

      // Reset form
      setTitle('');
      setMessage('');
      setIsActive(true);
      setPriority('normal');
    } catch (error) {
      console.error('Error saving notice:', error);
      failUpload('सूचना सहेजने में त्रुटि आई।');
      toast.error('सूचना सहेजने में त्रुटि आई।');
    } finally {
      setIsSaving(false);
    }
  };

  // एडिट मोड में भरें
  const handleEditClick = (notice: NoticeItem) => {
    setEditingNoticeId(notice.id);
    setTitle(notice.title);
    setMessage(notice.message);
    setDate(notice.date);
    setIsActive(notice.isActive);
    setPriority(notice.priority || 'normal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast('सूचना संपादन मोड सक्रिय है।', { icon: '✏️' });
  };

  // एक्टिव / इनएक्टिव टॉगल करें
  const handleToggleActive = async (notice: NoticeItem) => {
    if (!adminProfile) return;
    const newStatus = !notice.isActive;
    try {
      await updateNotice(
        notice.id,
        { isActive: newStatus },
        adminProfile.name,
        adminProfile.uid
      );
      toast.success(newStatus ? 'सूचना होम पेज पर सक्रिय कर दी गई!' : 'सूचना निष्क्रिय (Hide) कर दी गई।');
    } catch {
      toast.error('स्थिति बदलने में त्रुटि।');
    }
  };

  // नोटिस डिलीट करें
  const handleDeleteClick = async (notice: NoticeItem) => {
    if (!adminProfile) return;
    if (!window.confirm(`क्या आप वाकई सूचना "${notice.title}" को हमेशा के लिए हटाना चाहते हैं?`)) {
      return;
    }

    try {
      await deleteNotice(notice.id, notice.title, adminProfile.name, adminProfile.uid);
      toast.success('सूचना हटा दी गई।');
    } catch {
      toast.error('डिलीट करने में त्रुटि आई।');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider mb-1">
              <Megaphone className="w-4 h-4" />
              <span>TAB 2: NOTICE BOARD MANAGER</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              सूचना पट्ट एवं घोषणा प्रबंधक (Notice Board)
            </h2>
            <p className="text-xs text-blue-100 mt-1 max-w-xl">
              यहाँ से प्रकाशित सक्रिय सूचनाएँ मोबाइल ऐप व वेबसाइट के सबसे शीर्ष (Top Bar) पर गतिशील बैनर के रूप में नागरिकों और स्वयंसेवकों को दिखाई देती हैं।
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: CREATE / EDIT NOTICE FORM (5 COLS) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>{editingNoticeId ? 'सूचना संपादित करें (Edit Notice)' : 'नई सूचना लिखें (Write Notice)'}</span>
            </h3>
            {editingNoticeId && (
              <button
                type="button"
                onClick={() => {
                  setEditingNoticeId(null);
                  setTitle('');
                  setMessage('');
                }}
                className="text-[11px] text-red-600 font-bold hover:underline"
              >
                रद्द करें
              </button>
            )}
          </div>

          <form onSubmit={handleSubmitNotice} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                सूचना शीर्षक (Notice Title) *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="उदा. ग़ाज़ीपुर में विशाल रक्तदान शिविर / बाढ़ राहत सामग्री वितरण"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                विस्तृत संदेश (Write Notice Message) *
              </label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="यहाँ पर सूचना का पूरा विवरण, स्थान, समय और संपर्क जानकारी लिखें..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-700 leading-relaxed"
                required
              />
            </div>

            {/* Date and Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  दिनांक (Date)
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  प्राथमिकता (Priority)
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white"
                >
                  <option value="normal">सामान्य (Normal)</option>
                  <option value="high">महत्वपूर्ण (High)</option>
                  <option value="urgent">अति आवश्यक (Urgent)</option>
                </select>
              </div>
            </div>

            {/* Active Switch */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  होम पेज पर सक्रिय रखें (Show on App Home)
                </span>
                <span className="text-[10px] text-slate-500">
                  {isActive ? 'होम पेज के टॉप बार पर प्रदर्शित होगी' : 'छुपा कर रखें (Hidden)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  isActive ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-md ${
                    isActive ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>सहेजा जा रहा है...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{editingNoticeId ? 'सूचना अपडेट करें' : 'सूचना प्रकाशित करें (Publish Notice)'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: LIST OF NOTICES (7 COLS) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-700" />
                <span>सभी सूचनाएँ (Published Notices List)</span>
              </h3>
              <span className="text-[11px] text-slate-500">
                कुल {notices.length} सूचनाएँ डेटाबेस में उपलब्ध हैं
              </span>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
              {notices.filter((n) => n.isActive).length} सक्रिय (Active)
            </span>
          </div>

          {notices.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Megaphone className="w-10 h-10 mx-auto opacity-40 text-blue-700" />
              <p className="text-xs font-bold text-slate-600">अभी कोई सूचना उपलब्ध नहीं है</p>
              <p className="text-[11px]">बाईं ओर दिए फ़ॉर्म से पहली सूचना प्रकाशित करें।</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
              {notices.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl border transition ${
                    n.isActive
                      ? 'bg-blue-50/40 border-blue-200 hover:border-blue-300'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-slate-900">{n.title}</span>
                        {n.priority === 'urgent' && (
                          <span className="text-[10px] bg-red-600 text-white font-extrabold px-1.5 py-0.5 rounded">
                            URGENT
                          </span>
                        )}
                        {n.priority === 'high' && (
                          <span className="text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded">
                            महत्वपूर्ण
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            n.isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {n.isActive ? 'Active (लाइव)' : 'Inactive'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {n.message}
                      </p>

                      <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1">
                        <span>दिनांक: {n.date}</span>
                        {n.updatedBy && <span>द्वारा: {n.updatedBy}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleToggleActive(n)}
                        title={n.isActive ? 'Hide Notice' : 'Show Notice'}
                        className={`p-2 rounded-xl text-xs transition cursor-pointer ${
                          n.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {n.isActive ? <Check className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleEditClick(n)}
                        title="Edit Notice"
                        className="p-2 rounded-xl bg-blue-100 text-blue-800 hover:bg-blue-200 transition cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(n)}
                        title="Delete Notice"
                        className="p-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
