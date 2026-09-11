import React from 'react';
import { X, Download, Printer, FileText } from 'lucide-react';
import { triggerPrint } from '../utils/printHelper';

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  documentId: string;
  children: React.ReactNode;
  onDownload?: () => void;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  documentId,
  children,
  onDownload
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs overflow-y-auto overscroll-contain">
      <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base leading-tight">{title}</h3>
              <p className="text-[11px] text-slate-400 font-mono">Document ID: {documentId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onDownload && (
              <button
                onClick={onDownload}
                className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            )}
            <button
              onClick={triggerPrint}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-600 cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-4 sm:p-8 bg-slate-100/70 max-h-[80vh] overflow-y-auto flex justify-center">
          {children}
        </div>
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal;
