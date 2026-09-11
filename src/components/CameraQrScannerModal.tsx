import React, { useState } from 'react';
import { X, Camera, QrCode, Search, ShieldCheck, AlertCircle } from 'lucide-react';

interface CameraQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanResult: (result: string) => void;
}

export const CameraQrScannerModal: React.FC<CameraQrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanResult
}) => {
  const [manualCode, setManualCode] = useState('');
  const [isScanning, setIsScanning] = useState(true);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    onScanResult(manualCode.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs overflow-y-auto overscroll-contain">
      <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-md bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-700 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-sm sm:text-base">QR कोड स्कैनर (Live Scanner)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder simulation */}
        <div className="p-6 text-center">
          <div className="relative w-64 h-64 mx-auto bg-slate-950 rounded-2xl border-2 border-orange-500/50 flex items-center justify-center overflow-hidden shadow-inner mb-6">
            <div className="absolute inset-4 border-2 border-dashed border-orange-400/60 rounded-xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-bounce" />

            <div className="space-y-2 z-10 p-4">
              <QrCode className="w-16 h-16 text-orange-400/80 mx-auto animate-pulse" />
              <p className="text-xs text-slate-300 font-medium">
                सर्टिफिकेट या ID कार्ड का QR कोड कैमरे के सामने लाएं
              </p>
            </div>
          </div>

          {/* Quick Demo Scan Buttons */}
          <div className="mb-6 space-y-2">
            <p className="text-[11px] text-slate-400 font-semibold">त्वरित परीक्षण हेतु चयन करें (Demo Quick Scan):</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => {
                  onScanResult('JJF-VOL-2026-659');
                  onClose();
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-orange-600 rounded-lg text-xs font-mono font-bold text-orange-200 border border-slate-700 transition-colors cursor-pointer"
              >
                JJF-VOL-2026-659
              </button>
              <button
                onClick={() => {
                  onScanResult('JJF-DON-2026-001');
                  onClose();
                }}
                className="px-3 py-1 bg-slate-800 hover:bg-orange-600 rounded-lg text-xs font-mono font-bold text-orange-200 border border-slate-700 transition-colors cursor-pointer"
              >
                JJF-DON-2026-001
              </button>
            </div>
          </div>

          {/* Manual Input Fallback */}
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="या ID दर्ज करें (e.g. JJF-VOL-001)"
              className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Verify
            </button>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CameraQrScannerModal;
