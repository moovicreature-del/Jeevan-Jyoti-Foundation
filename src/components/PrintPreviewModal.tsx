import React from 'react';
import { X, Printer, Download, Eye } from 'lucide-react';
import { triggerPrint } from '../utils/printHelper';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  title = 'Print Preview',
  children
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs overflow-y-auto overscroll-contain">
      <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-300 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-sm sm:text-base">{title}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={triggerPrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Now</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-8 bg-slate-100 flex justify-center overflow-x-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintPreviewModal;
