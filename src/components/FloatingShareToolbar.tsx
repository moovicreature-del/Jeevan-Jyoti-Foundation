import React, { useState } from 'react';
import { Share2, MessageCircle, Twitter, Facebook, Copy, Check, QrCode, Zap } from 'lucide-react';
import { FOUNDATION_INFO } from '../data/foundationData';

interface ShareProps {
  onOpenQr?: () => void;
  onOpenQuickDonate?: () => void;
}

export const FloatingShareToolbar: React.FC<ShareProps> = ({ onOpenQr, onOpenQuickDonate }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://jeevanjyotifoundation.org';
  const shareText = `${FOUNDATION_INFO.nameHindi} (${FOUNDATION_INFO.nameEnglish}) - सेवा • शिक्षा • स्वास्थ्य अभियान ग़ाज़ीपुर। सहयोग करें व जुड़ें: ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleTwitter = () => {
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&via=SHAILESH1666`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Action buttons */}
      <div className="flex flex-col gap-2 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-300 shadow-2xl">
        {onOpenQuickDonate && (
          <button
            onClick={onOpenQuickDonate}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 hover:from-emerald-700 hover:to-teal-900 text-yellow-300 flex items-center justify-center shadow-md transition-all hover:scale-110 cursor-pointer border border-emerald-400"
            title="⚡ Quick Donate UPI QR (त्वरित मोबाइल दान)"
          >
            <Zap className="w-5 h-5 fill-yellow-300 text-yellow-300 animate-pulse" />
          </button>
        )}

        <button
          onClick={handleWhatsApp}
          className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xs transition-all hover:scale-105 cursor-pointer"
          title="Share on WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
        </button>

        <button
          onClick={handleTwitter}
          className="w-10 h-10 rounded-xl bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-xs transition-all hover:scale-105 cursor-pointer"
          title="Share on Twitter/X"
        >
          <Twitter className="w-5 h-5" />
        </button>

        <button
          onClick={handleCopy}
          className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center shadow-xs transition-all hover:scale-105 cursor-pointer"
          title="Copy Link"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
        </button>

        {onOpenQr && (
          <button
            onClick={onOpenQr}
            className="w-10 h-10 rounded-xl bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-xs transition-all hover:scale-105 cursor-pointer"
            title="Scan QR / Verify Certificate"
          >
            <QrCode className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default FloatingShareToolbar;
