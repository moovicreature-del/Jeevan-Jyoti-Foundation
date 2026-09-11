import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  Users,
  School,
  HeartPulse,
  Utensils,
  Home,
  ExternalLink,
  Share2,
  Copy,
  Check,
  Compass,
  Building2,
  ShieldCheck,
  Globe,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { GHAZIPUR_LOCATIONS } from '../data/locationData';
import { FOUNDATION_INFO } from '../data/foundationData';
import { LocationItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const GhazipurMap: React.FC = () => {
  const { t, isHindi } = useLanguage();
  const [selectedLoc, setSelectedLoc] = useState<LocationItem>(GHAZIPUR_LOCATIONS[0]);
  const [viewMode, setViewMode] = useState<'interactive_map' | 'hub_details'>('interactive_map');
  const [copiedLink, setCopiedLink] = useState(false);

  const officialGmapsUrl = 'https://maps.app.goo.gl/72kFrETKbmiKA3gv7';

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'school':
        return <School className="w-4 h-4 text-blue-600" />;
      case 'health_camp':
        return <HeartPulse className="w-4 h-4 text-red-600" />;
      case 'food_center':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      default:
        return <Home className="w-4 h-4 text-orange-600" />;
    }
  };

  const handleCopyGmapsLink = () => {
    navigator.clipboard.writeText(officialGmapsUrl);
    setCopiedLink(true);
    toast.success('गूगल मैप लोकेशन लिंक कॉपी हो गया!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Google Maps embed URL based on selected location
  const getEmbedMapUrl = () => {
    // For headquarters or other centers, construct clean embed URL
    const query = encodeURIComponent(
      `${selectedLoc.name} ${selectedLoc.address}`
    );
    return `https://maps.google.com/maps?q=${selectedLoc.coordinates.lat},${selectedLoc.coordinates.lng}&hl=hi&z=15&output=embed`;
  };

  return (
    <section id="ghazipur-map" className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-900 text-xs font-black uppercase tracking-wider mb-3">
            <MapPin className="w-4 h-4 text-orange-600" />
            <span>
              {t(
                'map.badge',
                'आधिकारिक गूगल मैप एवं सेवा केंद्र (Official Google Map & Service Hubs)',
                'Official Google Map & Active Service Hubs'
              )}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-serif">
            {t(
              'map.title',
              'गूगल मैप पर जीवन ज्योति फाउंडेशन (ग़ाज़ीपुर, उत्तर प्रदेश, भारत) की लोकेशन',
              'Jeevan Jyoti Foundation (Ghazipur, Uttar Pradesh, India) on Google Maps'
            )}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 leading-relaxed">
            {t(
              'map.sub',
              'मीरानपुर (मोहम्मदाबाद), ग़ाज़ीपुर मुख्य कार्यालय सहित समस्त सेवा केंद्रों की लाइव गूगल मैप लोकेशन देखें एवं सीधे दिशा-निर्देश प्राप्त करें।',
              'View live Google Map location and get instant turn-by-turn driving directions to our Head Office in Miranpur, Mohammadabad, and regional centers.'
            )}
          </p>

          {/* Quick Direct Google Map Link Banner */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 p-2 bg-white rounded-2xl border border-orange-200 shadow-sm">
            <a
              href={officialGmapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-md transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>गूगल मैप में खोलें (Open in Google Maps)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <button
              onClick={handleCopyGmapsLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-slate-300"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'लिंक कॉपी हुआ' : 'मैप लिंक कॉपी करें'}</span>
            </button>

            <span className="text-[11px] font-mono text-slate-500 hidden md:inline px-2">
              maps.app.goo.gl/72kFrETKbmiKA3gv7
            </span>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: List of Centers (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                सेवा केंद्र चयन (Select Center)
              </span>
              <span className="text-[11px] text-orange-600 font-bold">
                {GHAZIPUR_LOCATIONS.length} सक्रिय केंद्र
              </span>
            </div>

            {GHAZIPUR_LOCATIONS.map((loc) => {
              const isSelected = selectedLoc.id === loc.id;
              const isHq = loc.id === 'miranpur-hq';
              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLoc(loc)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-orange-500 bg-white shadow-lg ring-2 ring-orange-400/20'
                      : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/30 shadow-xs'
                  }`}
                >
                  {isHq && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-600 to-amber-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-bl-lg uppercase tracking-wider">
                      मुख्य कार्यालय (HQ)
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl border shrink-0 ${
                        isSelected
                          ? 'bg-orange-50 border-orange-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {getTypeIcon(loc.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {isHindi ? loc.nameHindi : loc.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                        {loc.address}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-600 font-semibold">
                        <span className="flex items-center gap-1 text-orange-700">
                          <Users className="w-3.5 h-3.5" />
                          {loc.beneficiaries}+ {t('events.citizens', 'लाभांवित', 'Beneficiaries')}
                        </span>
                        <span>•</span>
                        <span className="text-emerald-700 font-bold">
                          {loc.activeVolunteers} {t('impact.vols', 'स्वयंसेवक', 'Volunteers')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Official HQ Address Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md border border-slate-700 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>पंजीकृत मुख्य पता (Registered Address)</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {FOUNDATION_INFO.fullAddressHindi || FOUNDATION_INFO.address}
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-300 border-t border-slate-700/80">
                <span>पिन कोड: <strong className="text-white font-mono">{FOUNDATION_INFO.pincode} (DIGIPIN 2J6T226CL2)</strong></span>
                <span>हेल्पलाइन: <strong className="text-amber-300 font-mono">{FOUNDATION_INFO.phone}</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Embedded Google Map & Interactive Card (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            {/* Map Action Top Bar */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <h3 className="text-sm font-black text-white truncate">
                    {isHindi ? selectedLoc.nameHindi : selectedLoc.name}
                  </h3>
                  <span className="text-[11px] text-orange-300 font-mono block">
                    GPS: {selectedLoc.coordinates.lat.toFixed(4)}° N, {selectedLoc.coordinates.lng.toFixed(4)}° E
                  </span>
                </div>
              </div>

              {/* View Switcher & External Button */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                  <button
                    onClick={() => setViewMode('interactive_map')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'interactive_map'
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    लाइव गूगल मैप
                  </button>
                  <button
                    onClick={() => setViewMode('hub_details')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'hub_details'
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    केंद्र विवरण
                  </button>
                </div>

                <a
                  href={selectedLoc.googleMapsUrl || officialGmapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  title="Open live location in Google Maps App"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Main Interactive Display Area */}
            {viewMode === 'interactive_map' ? (
              <div className="relative w-full h-[460px] bg-slate-100">
                {/* Embedded Live Google Map iFrame */}
                <iframe
                  title={`Google Map - ${selectedLoc.name}`}
                  src={getEmbedMapUrl()}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />

                {/* Floating Navigation Overlay Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-lg border border-slate-200 text-xs text-slate-800 max-w-xs pointer-events-auto">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>सत्यापित सेवा केंद्र (Verified NGO Center)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 truncate">{selectedLoc.address}</p>
                  <a
                    href={selectedLoc.googleMapsUrl || officialGmapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    <span>दिशा-निर्देश प्राप्त करें (Get Directions)</span>
                    <Navigation className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              /* Center Details View */
              <div className="p-6 sm:p-8 space-y-6 bg-slate-900 text-white min-h-[460px] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    <span>सक्रिय सामाजिक सेवा केंद्र</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white font-serif">
                    {isHindi ? selectedLoc.nameHindi : selectedLoc.name}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {selectedLoc.address}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                      <p className="text-xs text-slate-400 font-medium">{t('map.beneficiaries', 'कुल लाभांवित नागरिक', 'Total Citizens Benefited')}</p>
                      <p className="text-2xl font-black text-yellow-400 mt-1">{selectedLoc.beneficiaries.toLocaleString('en-IN')}+</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
                      <p className="text-xs text-slate-400 font-medium">{t('map.vol_team', 'सक्रिय सेवा दल', 'Active Volunteer Team')}</p>
                      <p className="text-2xl font-black text-emerald-400 mt-1">{selectedLoc.activeVolunteers} Volunteers</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 col-span-2 sm:col-span-1">
                      <p className="text-xs text-slate-400 font-medium">{t('map.lead', 'केंद्र प्रभारी (Lead)', 'Center In-Charge')}</p>
                      <p className="text-sm font-bold text-white mt-1">{selectedLoc.leadPerson}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
                  <a
                    href={`tel:${selectedLoc.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 text-xs text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-orange-400" />
                    <span>{t('map.contact', 'केंद्र संपर्क', 'Center Contact')}: <strong className="text-white font-mono">{selectedLoc.phone}</strong></span>
                  </a>
                  <a
                    href={selectedLoc.googleMapsUrl || officialGmapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-lg transition-colors cursor-pointer"
                  >
                    <span>{t('map.view_gmaps', 'Google Maps पर देखें', 'Open in Google Maps')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {/* Bottom Bar with Coordinates, Address & Instant Link */}
            <div className="bg-slate-50 border-t border-slate-200 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 min-w-0">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                <span className="truncate font-medium">
                  {selectedLoc.address}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLoc.coordinates.lat},${selectedLoc.coordinates.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>दिशा-निर्देश (Directions)</span>
                </a>

                <a
                  href={selectedLoc.googleMapsUrl || officialGmapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span>गूगल मैप खोलें</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GhazipurMap;
