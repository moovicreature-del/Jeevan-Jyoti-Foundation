import React, { useState } from 'react';
import { MapPin, Building2, Landmark, Home, Globe } from 'lucide-react';
import {
  COUNTRIES,
  INDIAN_STATES,
  DISTRICTS_BY_STATE,
  getBlocksForDistrict,
  getPanchayatsAndWardsForBlock,
  StructuredAddress
} from '../data/locationData';

interface Props {
  value: StructuredAddress;
  onChange: (addr: StructuredAddress) => void;
  required?: boolean;
  compact?: boolean;
  className?: string;
  labelPrefix?: string;
}

export const StructuredAddressSelector: React.FC<Props> = ({
  value,
  onChange,
  required = true,
  compact = false,
  className = '',
  labelPrefix = ''
}) => {
  // Determine state code for sub-selectors
  const matchedState = INDIAN_STATES.find(
    (s) => s.nameHindi === value.state || s.nameEnglish === value.state || value.state?.includes(s.nameEnglish)
  );
  const stateCode = matchedState ? matchedState.id : 'UP';

  // Determine districts for selected state
  const districts = DISTRICTS_BY_STATE[stateCode] || DISTRICTS_BY_STATE['UP'] || [];
  const matchedDist = districts.find(
    (d) => d.nameHindi === value.district || d.nameEnglish === value.district || value.district?.includes(d.nameEnglish)
  );
  const districtCode = matchedDist ? matchedDist.id : (districts[0]?.id || 'GHAZIPUR');

  // Determine blocks for selected district
  const blocks = getBlocksForDistrict(stateCode, districtCode, value.district || districts[0]?.nameHindi);
  const matchedBlock = blocks.find(
    (b) => b.nameHindi === value.block || b.nameEnglish === value.block || value.block?.includes(b.nameEnglish)
  );
  const blockCode = matchedBlock ? matchedBlock.id : (blocks[0]?.id || 'MOHAMMADABAD');

  // Determine Gram Panchayat & Ward options
  const panchayatWardOptions = getPanchayatsAndWardsForBlock(blockCode, value.block || blocks[0]?.nameHindi, value.district);

  // Active filter for Gram Panchayat vs Ward
  const [activeAreaType, setActiveAreaType] = useState<'all' | 'panchayat' | 'ward'>('all');

  // Custom text toggles if not in standard list
  const [customDistrict, setCustomDistrict] = useState(false);
  const [customBlock, setCustomBlock] = useState(false);

  const filteredAreaOptions = activeAreaType === 'all'
    ? panchayatWardOptions
    : panchayatWardOptions.filter((item) => item.type === activeAreaType);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    onChange({
      ...value,
      country: selected
    });
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    const sObj = INDIAN_STATES.find((s) => s.nameHindi === selected);
    const newDistList = sObj ? (DISTRICTS_BY_STATE[sObj.id] || []) : [];
    const defaultDist = newDistList[0]?.nameHindi || 'गाज़ीपुर (Ghazipur)';
    const newBlocks = getBlocksForDistrict(sObj ? sObj.id : 'UP', newDistList[0]?.id || 'GHAZIPUR', defaultDist);
    const defaultBlock = newBlocks[0]?.nameHindi || 'मोहम्मदाबाद (Mohammadabad)';
    const newPanchayats = getPanchayatsAndWardsForBlock(newBlocks[0]?.id || 'MOHAMMADABAD', defaultBlock, defaultDist);
    const defaultVillage = newPanchayats[0]?.nameHindi || 'ग्राम मीरानपुर (Miranpur)';

    setCustomDistrict(false);
    setCustomBlock(false);

    onChange({
      ...value,
      state: selected,
      district: defaultDist,
      block: defaultBlock,
      wardOrVillage: defaultVillage
    });
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === '__CUSTOM__') {
      setCustomDistrict(true);
      onChange({ ...value, district: '' });
      return;
    }
    setCustomDistrict(false);
    const dObj = districts.find((d) => d.nameHindi === selected);
    const newBlocks = getBlocksForDistrict(stateCode, dObj ? dObj.id : 'GHAZIPUR', selected);
    const defaultBlock = newBlocks[0]?.nameHindi || 'सदर (Sadar)';
    const newPanchayats = getPanchayatsAndWardsForBlock(newBlocks[0]?.id || 'SADAR', defaultBlock, selected);

    onChange({
      ...value,
      district: selected,
      block: defaultBlock,
      wardOrVillage: newPanchayats[0]?.nameHindi || ''
    });
  };

  const handleBlockChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (selected === '__CUSTOM__') {
      setCustomBlock(true);
      onChange({ ...value, block: '' });
      return;
    }
    setCustomBlock(false);
    const bObj = blocks.find((b) => b.nameHindi === selected);
    const newPanchayats = getPanchayatsAndWardsForBlock(bObj ? bObj.id : 'BLOCK', selected, value.district);

    onChange({
      ...value,
      block: selected,
      wardOrVillage: newPanchayats[0]?.nameHindi || value.wardOrVillage
    });
  };

  const handlePanchayatWardSelect = (selectedName: string, type?: 'panchayat' | 'ward') => {
    onChange({
      ...value,
      panchayatOrWardType: type || value.panchayatOrWardType || 'panchayat',
      wardOrVillage: selectedName
    });
  };

  // Group states into States (28) and UTs (8)
  const regularStates = INDIAN_STATES.filter((s) => s.type === 'state');
  const unionTerritories = INDIAN_STATES.filter((s) => s.type === 'ut');

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between pb-1 border-b border-amber-200/80">
        <div className="flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5 text-[#8B0000]" />
          <span>
            {labelPrefix ? `${labelPrefix} ` : ''}आधिकारिक पता (Official Address){' '}
            {required && <span className="text-red-600 font-black">* अनिवार्य (Mandatory)</span>}
          </span>
        </div>
        <span className="text-[10px] text-amber-800 font-semibold bg-amber-100/70 px-2 py-0.5 rounded">
          All 28 States & 8 UTs Enabled
        </span>
      </div>

      <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 md:grid-cols-3'} gap-2.5 text-xs`}>
        {/* 1. Country */}
        <div>
          <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
            <Globe className="w-3 h-3 text-amber-700" />
            <span>1. देश (Country) {required && <span className="text-red-600">*</span>}</span>
          </label>
          <select
            value={value.country || 'भारत (India)'}
            onChange={handleCountryChange}
            required={required}
            className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-bold text-gray-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
          >
            {COUNTRIES.map((c) => (
              <option key={c.id} value={c.nameHindi}>
                {c.nameHindi}
              </option>
            ))}
          </select>
        </div>

        {/* 2. State & Union Territories */}
        <div>
          <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
            <Landmark className="w-3 h-3 text-amber-700" />
            <span>2. राज्य / केंद्र शासित प्रदेश (State / UT) {required && <span className="text-red-600">*</span>}</span>
          </label>
          <select
            value={value.state || 'उत्तर प्रदेश (Uttar Pradesh)'}
            onChange={handleStateChange}
            required={required}
            className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-bold text-gray-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
          >
            <optgroup label="🏛️ भारत के 28 राज्य (28 Indian States)">
              {regularStates.map((s) => (
                <option key={s.id} value={s.nameHindi}>
                  {s.nameHindi}
                </option>
              ))}
            </optgroup>
            <optgroup label="🇮🇳 8 केंद्र शासित प्रदेश (8 Union Territories)">
              {unionTerritories.map((ut) => (
                <option key={ut.id} value={ut.nameHindi}>
                  {ut.nameHindi}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* 3. District (Dynamic based on selected State/UT) */}
        <div>
          <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-amber-700" />
            <span>3. जिला (District) {required && <span className="text-red-600">*</span>}</span>
          </label>
          {customDistrict ? (
            <div className="flex gap-1">
              <input
                type="text"
                value={value.district}
                onChange={(e) => onChange({ ...value, district: e.target.value })}
                placeholder="जिला का नाम लिखें"
                required={required}
                className="flex-1 bg-white border border-amber-400 rounded-lg px-2.5 py-1.5 text-gray-900 font-bold focus:ring-1 focus:ring-amber-500 outline-hidden"
              />
              <button
                type="button"
                onClick={() => setCustomDistrict(false)}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-[10px] font-bold"
              >
                सूची
              </button>
            </div>
          ) : (
            <select
              value={value.district || districts[0]?.nameHindi || 'गाज़ीपुर (Ghazipur)'}
              onChange={handleDistrictChange}
              required={required}
              className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-bold text-gray-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.nameHindi}>
                  {d.nameHindi}
                </option>
              ))}
              <option value="__CUSTOM__">+ अन्य जिला लिखें (Custom District)...</option>
            </select>
          )}
        </div>

        {/* 4. Block / Tehsil (Dynamic based on District) */}
        <div>
          <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1">
            <Landmark className="w-3 h-3 text-amber-700" />
            <span>4. ब्लॉक / तहसील (Block) {required && <span className="text-red-600">*</span>}</span>
          </label>
          {customBlock ? (
            <div className="flex gap-1">
              <input
                type="text"
                value={value.block}
                onChange={(e) => onChange({ ...value, block: e.target.value })}
                placeholder="ब्लॉक / तहसील का नाम"
                required={required}
                className="flex-1 bg-white border border-amber-400 rounded-lg px-2.5 py-1.5 text-gray-900 font-bold focus:ring-1 focus:ring-amber-500 outline-hidden"
              />
              <button
                type="button"
                onClick={() => setCustomBlock(false)}
                className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-[10px] font-bold"
              >
                सूची
              </button>
            </div>
          ) : (
            <select
              value={value.block || blocks[0]?.nameHindi || 'सदर (Sadar)'}
              onChange={handleBlockChange}
              required={required}
              className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 font-bold text-gray-900 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
            >
              {blocks.map((b) => (
                <option key={b.id} value={b.nameHindi}>
                  {b.nameHindi}
                </option>
              ))}
              <option value="__CUSTOM__">+ अन्य ब्लॉक दर्ज करें (Custom Block)...</option>
            </select>
          )}
        </div>

        {/* 5. Ward / Gram Panchayat Selector & Custom Input */}
        <div className={compact ? 'sm:col-span-2' : 'sm:col-span-2 md:col-span-2'}>
          <div className="flex items-center justify-between mb-1">
            <label className="font-bold text-gray-800 flex items-center gap-1">
              <Home className="w-3 h-3 text-amber-700" />
              <span>5. वार्ड / ग्राम पंचायत (Ward / Gram Panchayat) {required && <span className="text-red-600">*</span>}</span>
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveAreaType('all')}
                className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-all ${
                  activeAreaType === 'all' ? 'bg-amber-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                सभी
              </button>
              <button
                type="button"
                onClick={() => setActiveAreaType('panchayat')}
                className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-all ${
                  activeAreaType === 'panchayat' ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🌾 ग्राम पंचायत
              </button>
              <button
                type="button"
                onClick={() => setActiveAreaType('ward')}
                className={`text-[9px] px-1.5 py-0.5 rounded font-bold transition-all ${
                  activeAreaType === 'ward' ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                🏢 शहरी वार्ड
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {/* Dropdown for selectable Wards & Panchayats */}
            <select
              value={filteredAreaOptions.some(o => o.nameHindi === value.wardOrVillage) ? value.wardOrVillage : ''}
              onChange={(e) => {
                if (e.target.value) {
                  const opt = filteredAreaOptions.find(o => o.nameHindi === e.target.value);
                  handlePanchayatWardSelect(e.target.value, opt?.type);
                }
              }}
              className="w-full bg-amber-50/50 border border-amber-300 rounded-lg px-2.5 py-1.5 font-bold text-gray-900 text-xs focus:ring-1 focus:ring-amber-500 outline-hidden cursor-pointer"
            >
              <option value="">-- वार्ड / पंचायत सूची से चुनें --</option>
              {filteredAreaOptions.map((opt) => (
                <option key={opt.id} value={opt.nameHindi}>
                  {opt.type === 'ward' ? '🏢 [वार्ड] ' : '🌾 [पंचायत] '}
                  {opt.nameHindi}
                </option>
              ))}
            </select>

            {/* Input field for exact typing or editing */}
            <input
              type="text"
              value={value.wardOrVillage}
              onChange={(e) => onChange({ ...value, wardOrVillage: e.target.value })}
              placeholder="मकान नं, ग्राम / वार्ड नाम लिखें..."
              required={required}
              className="w-full bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-gray-900 font-bold text-xs focus:ring-1 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
            />
          </div>

          {/* Quick Click Suggestion Pills */}
          {panchayatWardOptions && panchayatWardOptions.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1 items-center">
              <span className="text-[9.5px] text-gray-500 font-bold">त्वरित चयन:</span>
              {panchayatWardOptions.slice(0, 6).map((v) => (
                <button
                  type="button"
                  key={v.id}
                  onClick={() => handlePanchayatWardSelect(v.nameHindi, v.type)}
                  className={`text-[9.5px] px-1.5 py-0.5 rounded font-bold cursor-pointer transition-colors border ${
                    value.wardOrVillage === v.nameHindi
                      ? 'bg-[#8B0000] text-white border-[#8B0000]'
                      : 'bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {v.nameHindi}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Formatted Live Address Preview */}
      <div className="bg-amber-50/60 border border-amber-200/60 rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-[11px] text-amber-950 font-medium">
        <span className="font-bold text-[#8B0000] shrink-0">📍 चयनित पता (Selected Address):</span>
        <span className="truncate">
          {value.wardOrVillage ? `ग्राम/वार्ड: ${value.wardOrVillage}, ` : 'ग्राम/वार्ड [अनिवार्य], '}
          {value.block ? `ब्लॉक: ${value.block}, ` : 'ब्लॉक [अनिवार्य], '}
          {value.district ? `जिला: ${value.district}, ` : 'जिला [अनिवार्य], '}
          {value.state ? `${value.state}, ` : ''}
          {value.country || 'भारत'}
        </span>
      </div>
    </div>
  );
};

export default StructuredAddressSelector;

