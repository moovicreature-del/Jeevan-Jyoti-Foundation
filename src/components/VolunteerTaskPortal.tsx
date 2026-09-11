import React, { useState } from 'react';
import { Award, UserPlus, MapPin, Calendar, CreditCard, X, Printer, LayoutGrid, FileSpreadsheet, Search, CheckCircle2, ShieldCheck } from 'lucide-react';
import { TaskRecord, Volunteer } from '../types';
import { INITIAL_TASKS, INITIAL_VOLUNTEERS } from '../data/taskData';
import { useLanguage } from '../context/LanguageContext';
import { StructuredAddressSelector } from './StructuredAddressSelector';
import { DEFAULT_STRUCTURED_ADDRESS, StructuredAddress } from '../data/locationData';
import { CandidatePhotoUploader } from './CandidatePhotoUploader';
import { formatCertificateNumber } from '../utils/certificateUtils';
import { FOUNDATION_INFO } from '../data/foundationData';

interface Props {
  onSelectVolunteerCertificate: (volunteer: Volunteer) => void;
  onSelectTaskCertificate: (task: TaskRecord) => void;
  onSelectIdCard: (volunteer: Volunteer) => void;
}

export const VolunteerTaskPortal: React.FC<Props> = ({
  onSelectVolunteerCertificate,
  onSelectTaskCertificate,
  onSelectIdCard
}) => {
  const getTodayDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { t, isHindi } = useLanguage();
  const [volunteers, setVolunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  const [tasks] = useState<TaskRecord[]>(INITIAL_TASKS);
  const [isPrintView, setIsPrintView] = useState<boolean>(false);
  const [tableSearchQuery, setTableSearchQuery] = useState<string>('');
  const [showRegModal, setShowRegModal] = useState(false);
  const [newPhoto, setNewPhoto] = useState<string>('');
  const [newName, setNewName] = useState('');
  const [newRelationType, setNewRelationType] = useState<'Father' | 'Husband' | 'Guardian'>('Father');
  const [newFather, setNewFather] = useState('');
  const [newJoinDate, setNewJoinDate] = useState(() => getTodayDateString());
  const [newArea, setNewArea] = useState('Education & Child Literacy');
  const [regAddress, setRegAddress] = useState<StructuredAddress>(DEFAULT_STRUCTURED_ADDRESS);
  const [regError, setRegError] = useState<string | null>(null);

  const handleRegisterVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      setRegError(isHindi ? 'कृपया स्वयंसेवक का पूरा नाम भरें।' : 'Please enter Volunteer Full Name.');
      return;
    }
    if (!newFather.trim()) {
      setRegError(
        newRelationType === 'Husband'
          ? (isHindi ? 'कृपया पति / जीवनसाथी का नाम भरें।' : 'Please enter Husband / Spouse Name.')
          : newRelationType === 'Guardian'
          ? (isHindi ? 'कृपया अभिभावक का नाम भरें।' : 'Please enter Guardian Name.')
          : (isHindi ? 'कृपया पिता का नाम भरें।' : 'Please enter Father Name.')
      );
      return;
    }
    if (!regAddress.country || !regAddress.state || !regAddress.district || !regAddress.block || !regAddress.wardOrVillage?.trim()) {
      setRegError(isHindi ? 'देश, राज्य, जिला, ब्लॉक व वार्ड/ग्राम का चयन/दर्ज करना अनिवार्य है।' : 'Country, State, District, Block and Ward/Village are mandatory.');
      return;
    }

    const newVol: Volunteer = {
      id: formatCertificateNumber('VOL', newJoinDate || new Date(), volunteers.length + 1),
      name: newName.trim(),
      fatherName: newFather.trim(),
      relationType: newRelationType,
      role: 'सक्रिय स्वयंसेवक (Active Volunteer)',
      area: newArea,
      areaHindi: newArea === 'Education & Child Literacy' ? 'निःशुल्क बाल शिक्षा' : 'स्वास्थ्य एवं अन्नपूर्णा सेवा',
      hoursContributed: 24,
      tasksCompleted: 4,
      joinDate: newJoinDate || getTodayDateString(),
      photoUrl: newPhoto || undefined,
      status: 'active',
      country: regAddress.country,
      state: regAddress.state,
      district: regAddress.district,
      block: regAddress.block,
      wardOrVillage: regAddress.wardOrVillage
    };

    setVolunteers([newVol, ...volunteers]);
    setShowRegModal(false);
    setNewName('');
    setNewFather('');
    setNewPhoto('');
    setNewJoinDate(getTodayDateString());
    setRegError(null);
    onSelectVolunteerCertificate(newVol);
  };

  const filteredVolunteers = volunteers.filter((vol) => {
    if (!tableSearchQuery.trim()) return true;
    const q = tableSearchQuery.toLowerCase();
    return (
      vol.name.toLowerCase().includes(q) ||
      vol.fatherName.toLowerCase().includes(q) ||
      vol.id.toLowerCase().includes(q) ||
      vol.area.toLowerCase().includes(q) ||
      (vol.areaHindi && vol.areaHindi.includes(q)) ||
      (vol.block && vol.block.toLowerCase().includes(q))
    );
  });

  const totalVolHours = volunteers.reduce((acc, v) => acc + (v.hoursContributed || 0), 0);
  const totalVolTasks = volunteers.reduce((acc, v) => acc + (v.tasksCompleted || 0), 0);

  return (
    <section id="volunteers" className="py-16 bg-amber-50/30 border-t border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFDE7] border border-yellow-300 text-black text-xs font-black uppercase tracking-wider mb-2 shadow-xs">
              <Award className="w-3.5 h-3.5 text-black" />
              <span>{t('vol.badge', 'स्वयंसेवक मंच एवं प्रमाण पत्र जनरेटर', 'Volunteer Platform & Certificate Generator')}</span>
            </div>
            <h2 className="text-3xl font-black text-gray-900 font-['Cinzel',serif]">
              {t('vol.title', 'सेवा ही संकल्प (Volunteer Portal)', 'Service is Our Resolve (Volunteer Portal)')}
            </h2>
            <p className="text-sm text-gray-600 mt-1 font-medium">
              {t('vol.sub',
                'संस्था के साथ जुड़ें, सेवा कार्यों में भाग लें और तत्काल डिजिटल हस्ताक्षरित प्रमाण पत्र प्राप्त करें।',
                'Join our movement, participate in field seva activities, and receive instantly authenticated, digitally signed certificates.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto shrink-0 flex-wrap">
            {/* Print Version Toggle Button */}
            <button
              type="button"
              id="volunteers-toggle-print-view"
              onClick={() => setIsPrintView(!isPrintView)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer border ${
                isPrintView
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-amber-400/40'
                  : 'bg-white text-slate-700 hover:bg-amber-50 border-amber-300 shadow-2xs'
              }`}
              title={isPrintView ? 'Switch to Card View' : 'Transform to Print-Optimized Table'}
            >
              {isPrintView ? (
                <>
                  <LayoutGrid className="w-4 h-4 text-amber-400" />
                  <span>{isHindi ? 'कार्ड दृश्य (Card View)' : 'Card View'}</span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4 text-amber-700" />
                  <span>{isHindi ? 'प्रिंट तालिका संस्करण (Print Version)' : 'Print Version'}</span>
                </>
              )}
            </button>

            {isPrintView && (
              <button
                type="button"
                id="volunteers-print-action-btn"
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                title="Print this volunteer table directly"
              >
                <Printer className="w-4 h-4" />
                <span>{isHindi ? 'प्रिंट / सेव PDF' : 'Print Table'}</span>
              </button>
            )}

            <button
              onClick={() => setShowRegModal(true)}
              className="px-5 py-2.5 bg-[#8B0000] hover:bg-[#6b0000] text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-md flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('vol.join_btn', 'नया स्वयंसेवक पंजीकरण', 'Register as Volunteer')}</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CONDITIONAL VIEW: 1. PRINT-OPTIMIZED TABLE VIEW                           */}
        {/* ========================================================================= */}
        {isPrintView ? (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Print View Top Notification & Search Toolbar */}
            <div className="bg-white border-2 border-slate-300 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 print:border-none print:shadow-none print:p-0">
              <div>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-slate-800" />
                  <h3 className="font-black text-base text-slate-900 font-serif">
                    {isHindi ? 'अधिकृत स्वयंसेवक पंजी एवं सेवा अभिलेख' : 'Official Volunteer Register & Service Record'}
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                    {FOUNDATION_INFO.regNo}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isHindi
                    ? `जीवन ज्योति फाउंडेशन — कुल पंजीकृत स्वयंसेवक: ${volunteers.length} | कुल सेवा घंटे: ${totalVolHours} hrs | पूर्ण सेवा कार्य: ${totalVolTasks}`
                    : `Jeevan Jyoti Foundation — Total Volunteers: ${volunteers.length} | Total Seva Hours: ${totalVolHours} hrs | Completed Tasks: ${totalVolTasks}`}
                </p>
              </div>

              {/* Table Search Input */}
              <div className="relative print:hidden min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tableSearchQuery}
                  onChange={(e) => setTableSearchQuery(e.target.value)}
                  placeholder={isHindi ? 'नाम, ID या ब्लॉक से खोजें...' : 'Search by Name, ID or Block...'}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:bg-white focus:border-amber-600 transition"
                />
              </div>
            </div>

            {/* Print-Optimized Volunteers Table */}
            <div className="printable-table bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden" data-printable="true">
              {/* Header for actual print sheets */}
              <div className="hidden print:block p-4 border-b border-slate-300 bg-slate-50 text-center">
                <h2 className="text-xl font-black text-black font-serif uppercase tracking-wide">
                  {FOUNDATION_INFO.nameHindi} ({FOUNDATION_INFO.nameEnglish})
                </h2>
                <p className="text-xs text-slate-700 font-medium">
                  {FOUNDATION_INFO.fullAddressHindi} | पंजी. सं.: {FOUNDATION_INFO.regNo} | NITI Aayog: {FOUNDATION_INFO.nitiAayogUid}
                </p>
                <div className="text-sm font-bold text-slate-900 mt-1 uppercase underline">
                  स्वयंसेवक सेवा पंजीका (Official Volunteer Roster & Service Log)
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-black border-b-2 border-slate-300 uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-3 text-center w-12 border-r border-slate-200">क्र.सं.</th>
                      <th className="py-3 px-3 border-r border-slate-200">पंजीकरण सं. (ID)</th>
                      <th className="py-3 px-3 border-r border-slate-200">स्वयंसेवक का नाम (Volunteer Name)</th>
                      <th className="py-3 px-3 border-r border-slate-200">पिता / संरक्षक (Guardian)</th>
                      <th className="py-3 px-3 border-r border-slate-200">सेवा प्रभाग (Service Sector)</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">स्थान / ब्लॉक</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">योगदान (Hours / Tasks)</th>
                      <th className="py-3 px-3 text-center border-r border-slate-200">पंजी. तिथि</th>
                      <th className="py-3 px-3 text-center print:hidden">प्रमाण पत्र / ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                    {filteredVolunteers.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-8 text-center text-slate-500 font-medium">
                          {isHindi ? 'कोई स्वयंसेवक नहीं मिला।' : 'No volunteer records found matching criteria.'}
                        </td>
                      </tr>
                    ) : (
                      filteredVolunteers.map((vol, idx) => (
                        <tr
                          key={vol.id}
                          className={`hover:bg-amber-50/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                        >
                          <td className="py-2.5 px-3 text-center font-bold text-slate-500 border-r border-slate-200">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900 border-r border-slate-200 whitespace-nowrap">
                            {vol.id}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 border-r border-slate-200">
                            {vol.name}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 border-r border-slate-200">
                            {vol.fatherName}
                          </td>
                          <td className="py-2.5 px-3 text-slate-800 border-r border-slate-200 font-medium">
                            {isHindi ? vol.areaHindi || vol.area : vol.area}
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-600 border-r border-slate-200 whitespace-nowrap">
                            {vol.block || 'Ghazipur'}, {vol.district || 'Ghazipur'}
                          </td>
                          <td className="py-2.5 px-3 text-center border-r border-slate-200 whitespace-nowrap">
                            <span className="font-bold text-emerald-800">{vol.hoursContributed} hrs</span>
                            <span className="text-slate-400 mx-1">/</span>
                            <span className="font-semibold text-slate-700">{vol.tasksCompleted} tasks</span>
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-600 border-r border-slate-200 font-mono whitespace-nowrap">
                            {vol.joinDate}
                          </td>
                          <td className="py-2.5 px-3 text-center print:hidden whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => onSelectVolunteerCertificate(vol)}
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold transition cursor-pointer"
                                title="View Volunteer Certificate"
                              >
                                प्रमाण पत्र
                              </button>
                              <button
                                type="button"
                                onClick={() => onSelectIdCard(vol)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-bold transition cursor-pointer"
                                title="View ID Card"
                              >
                                <CreditCard className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {/* Table Footer with Summary Stats */}
                  <tfoot>
                    <tr className="bg-slate-100 border-t-2 border-slate-300 font-black text-slate-900 text-xs">
                      <td colSpan={2} className="py-3 px-3 text-left">
                        कुल अभिलेख: {filteredVolunteers.length}
                      </td>
                      <td colSpan={4} className="py-3 px-3 text-right">
                        कुल सेवा योगदान योग (Total Logged Seva):
                      </td>
                      <td className="py-3 px-3 text-center text-emerald-900 font-mono">
                        {filteredVolunteers.reduce((acc, v) => acc + (v.hoursContributed || 0), 0)} घंटे / {filteredVolunteers.reduce((acc, v) => acc + (v.tasksCompleted || 0), 0)} कार्य
                      </td>
                      <td colSpan={2} className="py-3 px-3 text-center text-slate-500 text-[11px] font-normal">
                        डिजिटल रूप से सत्यापित
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Print-Optimized Active Missions Table */}
            <div className="printable-table bg-white border border-slate-300 rounded-2xl shadow-sm overflow-hidden" data-printable="true">
              <div className="p-3.5 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
                <h4 className="font-black text-xs text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>{isHindi ? 'सक्रिय सेवा कार्य तालिका (Active Volunteer Missions)' : 'Active Volunteer Missions Table'}</span>
                </h4>
                <span className="text-[11px] font-bold text-slate-600">कुल सक्रिय मिशन: {tasks.length}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-900 font-black border-b border-slate-200 text-[11px]">
                      <th className="py-2.5 px-3 text-center w-12 border-r border-slate-200">क्र.सं.</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">मिशन शीर्षक (Mission Title)</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">स्थान (Location)</th>
                      <th className="py-2.5 px-3 text-center border-r border-slate-200">अंक (Points)</th>
                      <th className="py-2.5 px-3 text-center border-r border-slate-200">दिनांक (Date)</th>
                      <th className="py-2.5 px-3 text-center print:hidden">प्रशंसा पत्र</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {tasks.map((task, idx) => (
                      <tr key={task.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="py-2 px-3 text-center font-bold text-slate-500 border-r border-slate-200">{idx + 1}</td>
                        <td className="py-2 px-3 font-bold text-slate-900 border-r border-slate-200">
                          {isHindi ? task.titleHindi : task.title}
                          <p className="text-[10px] text-slate-500 font-normal mt-0.5">{task.description}</p>
                        </td>
                        <td className="py-2 px-3 text-slate-700 border-r border-slate-200 whitespace-nowrap">{task.location}</td>
                        <td className="py-2 px-3 text-center font-mono font-bold text-emerald-700 border-r border-slate-200">+{task.points} pts</td>
                        <td className="py-2 px-3 text-center text-slate-600 border-r border-slate-200 font-mono whitespace-nowrap">{task.date}</td>
                        <td className="py-2 px-3 text-center print:hidden whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onSelectTaskCertificate(task)}
                            className="px-2.5 py-1 bg-[#8B0000] hover:bg-[#6b0000] text-white rounded text-[11px] font-bold transition cursor-pointer"
                          >
                            प्रशंसा पत्र
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* CONDITIONAL VIEW: 2. STANDARD CARD GRID VIEW                              */
          /* ========================================================================= */
          <>
            {/* Volunteers Certificate Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-in fade-in duration-200">
              {volunteers.map((vol) => (
                <div
                  key={vol.id}
                  className="bg-white border-2 border-amber-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-black text-base text-gray-900">{vol.name}</h3>
                      <p className="text-xs text-gray-500 font-medium">{t('vol.son_of', 'सुपुत्र / सुपुत्री', 'S/D of')}: Shri {vol.fatherName}</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      {vol.id}
                    </span>
                  </div>

                  <div className="my-3 space-y-1 text-xs text-gray-700 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                    <div><strong>{t('vol.field', 'सेवा क्षेत्र', 'Field')}:</strong> {isHindi ? vol.areaHindi : vol.area}</div>
                    <div><strong>{t('vol.contribution', 'योगदान', 'Contribution')}:</strong> {vol.hoursContributed} {t('vol.hours', 'घंटे', 'hrs')} ({vol.tasksCompleted} {t('vol.tasks', 'कार्य', 'tasks')})</div>
                    <div><strong>{t('vol.date', 'दिनांक', 'Date')}:</strong> {vol.joinDate}</div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => onSelectVolunteerCertificate(vol)}
                      className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer text-center shadow-xs"
                    >
                      {t('vol.view_cert', 'प्रमाण पत्र देखें (Certificate)', 'View Certificate')}
                    </button>
                    <button
                      onClick={() => onSelectIdCard(vol)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      title="ID Card"
                    >
                      <CreditCard className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Tasks List */}
            <div>
              <h3 className="text-xl font-black text-gray-900 mb-4 font-['Cinzel']">
                {t('vol.active_missions', 'सक्रिय सेवा कार्य (Active Volunteer Missions)', 'Active Volunteer Missions')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white border-2 border-dashed border-amber-300 rounded-2xl p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-amber-900 font-bold mb-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {task.location}
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono font-bold">
                          +{task.points} pts
                        </span>
                      </div>

                      <h4 className="font-black text-sm text-gray-900 mb-1">
                        {isHindi ? task.titleHindi : task.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                        {task.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-500 flex items-center gap-1 font-bold">
                        <Calendar className="w-3.5 h-3.5" />
                        {task.date}
                      </span>
                      <button
                        onClick={() => onSelectTaskCertificate(task)}
                        className="px-3 py-1.5 bg-[#8B0000] hover:bg-[#6b0000] text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        {t('vol.generate_task_cert', 'प्रशंसा पत्र जनरेट करें', 'Generate Certificate')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Registration Modal */}
        {showRegModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm overflow-y-auto p-2 sm:p-4 md:p-6 flex items-start sm:items-center justify-center py-6 sm:py-10 overscroll-contain touch-pan-y">
            <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl relative border border-gray-100 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200 sticky -top-4 bg-white z-10 pt-1">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 font-['Cinzel']">
                    {t('vol.join_btn', 'नया स्वयंसेवक पंजीकरण', 'New Volunteer Registration')}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">जीवन ज्योति फाउंडेशन स्वयंसेवक सदस्यता</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Error Alert */}
              {regError && (
                <div className="bg-red-50 border border-red-300 text-red-800 p-2.5 rounded-xl text-xs font-bold mb-3">
                  ⚠️ {regError}
                </div>
              )}

              <form onSubmit={handleRegisterVolunteer} className="space-y-4 text-xs">
                {/* Candidate Photo Upload at Top of Form */}
                <CandidatePhotoUploader
                  photoUrl={newPhoto}
                  onPhotoChange={setNewPhoto}
                  onPhotoRemove={() => setNewPhoto('')}
                  required={false}
                  label="स्वयंसेवक फोटो (Volunteer Photo - कैमरा या गैलरी)"
                  subLabel="पहचान पत्र व प्रमाण पत्र हेतु लाइव कैमरा से फोटो खींचें या गैलरी से चुनें"
                />

                <div>
                  <label className="block font-bold text-gray-700 mb-1">{isHindi ? 'पूरा नाम (Full Name) *' : 'Full Name *'}</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="उदा. श्री राहुल कुमार / श्रीमती प्रतिमा राय"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>

                {/* Relation Type & Father/Spouse/Guardian Name */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      {isHindi ? 'संबंध प्रकार (Relation) *' : 'Relation Type *'}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setNewRelationType('Father')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                          newRelationType === 'Father'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        👨‍🦳 पिता (Father)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewRelationType('Husband')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                          newRelationType === 'Husband'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        💍 पति/जीवनसाथी
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewRelationType('Guardian')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                          newRelationType === 'Guardian'
                            ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        🛡️ अभिभावक
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">
                      {newRelationType === 'Husband'
                        ? (isHindi ? 'पति / जीवनसाथी का नाम (Husband / Spouse Name) *' : "Husband's / Spouse's Name *")
                        : newRelationType === 'Guardian'
                        ? (isHindi ? 'अभिभावक का नाम (Guardian Name) *' : "Guardian's Name *")
                        : (isHindi ? 'पिता का नाम (Father\'s Name) *' : "Father's Name *")}
                    </label>
                    <input
                      type="text"
                      required
                      value={newFather}
                      onChange={(e) => setNewFather(e.target.value)}
                      placeholder={
                        newRelationType === 'Husband'
                          ? (isHindi ? 'उदा. श्री अमित कुमार (पति / जीवनसाथी का नाम)' : 'e.g. Shri Amit Kumar (Husband/Spouse)')
                          : newRelationType === 'Guardian'
                          ? (isHindi ? 'उदा. श्री सुरेश कुमार (अभिभावक का नाम)' : 'e.g. Shri Suresh Kumar (Guardian)')
                          : (isHindi ? 'उदा. श्री रामेश्वर राय (पिता का नाम)' : 'e.g. Shri Rameshwar Rai (Father)')
                      }
                      className="w-full px-3 py-2 border rounded-xl bg-white"
                    />
                  </div>
                </div>

                {/* Structured Address 5-Tier Selector */}
                <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                  <StructuredAddressSelector
                    value={regAddress}
                    onChange={setRegAddress}
                    required={true}
                    compact={true}
                    labelPrefix="स्थायी पता"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">{isHindi ? 'सेवा क्षेत्र (Service Area)' : 'Service Sector'}</label>
                  <select
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Education & Child Literacy">Education & Child Literacy (शिक्षा सेवा)</option>
                    <option value="Food Security & Relief">Food Distribution & Relief (अन्नपूर्णा सेवा)</option>
                    <option value="Healthcare & Hygiene">Healthcare Camps (स्वास्थ्य रक्षा)</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-gray-700">
                      {isHindi ? 'पंजीकरण तिथि (Registration Date) *' : 'Registration Date *'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setNewJoinDate(getTodayDateString())}
                      className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>🔄 आज की तिथि सेट करें</span>
                    </button>
                  </div>
                  <input
                    type="date"
                    required
                    value={newJoinDate}
                    onChange={(e) => setNewJoinDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  />
                  <div className="text-[11px] text-emerald-800 font-bold mt-1 inline-flex items-center gap-1">
                    <span>📅</span> स्वतः आज की वर्तमान तिथि ({new Date(newJoinDate || getTodayDateString()).toLocaleDateString('hi-IN', { day: '2-digit', month: 'short', year: 'numeric' })})
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRegModal(false)}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer"
                  >
                    {isHindi ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#8B0000] hover:bg-[#700000] text-white font-bold rounded-xl transition cursor-pointer shadow-md"
                  >
                    {isHindi ? 'पंजीकरण पूर्ण करें' : 'Complete Registration'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VolunteerTaskPortal;
