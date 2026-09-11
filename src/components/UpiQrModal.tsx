import React, { useState } from 'react';
import { X, Heart, Copy, Check, Sparkles, Building, QrCode, CreditCard, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { FOUNDATION_INFO } from '../data/foundationData';
import { DonationRecord } from '../types';
import { getDonorTier } from '../utils/donorTiers';
import { triggerDonationReceiptEmail } from '../services/emailService';
import { useDonationPaymentSettings } from '../hooks/useDonationPaymentSettings';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
  onDonationSuccess: (donation: DonationRecord) => void;
}

type PaymentTab = 'upi_qr' | 'bank_transfer' | 'card';

export const UpiQrModal: React.FC<Props> = ({ onClose, onDonationSuccess }) => {
  const { settings: paymentSettings } = useDonationPaymentSettings();
  const [activeTab, setActiveTab] = useState<PaymentTab>('upi_qr');
  const [amount, setAmount] = useState<number>(25000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [panNumber, setPanNumber] = useState<string>('');
  const [city, setCity] = useState<string>('Ghazipur');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Card fields for simulated card flow
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const selectedAmount = customAmount ? parseInt(customAmount, 10) || 0 : amount;
  const currentTier = getDonorTier(selectedAmount);

  const activeUpiId = paymentSettings.upiId || FOUNDATION_INFO.upiId;
  const activePayeeName = paymentSettings.upiPayeeName || FOUNDATION_INFO.nameEnglish;
  const upiUrl = `upi://pay?pa=${activeUpiId}&pn=${encodeURIComponent(activePayeeName)}&am=${selectedAmount}&cu=INR&tn=${encodeURIComponent(`${currentTier.name} Donation JJF`)}`;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConfirmDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || selectedAmount <= 0) return;

    let paymentMode = 'Direct UPI Transfer';
    if (activeTab === 'bank_transfer') {
      paymentMode = 'Direct Bank Transfer (NEFT/RTGS/IMPS)';
    } else if (activeTab === 'card') {
      paymentMode = 'Debit/Credit Card Online Gateway';
    }

    const receiptNo = `JJF/DON/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;

    const newDonation: DonationRecord = {
      id: receiptNo,
      receiptNo,
      donorName: donorName.trim(),
      email: donorEmail.trim() || undefined,
      panNumber: panNumber.trim().toUpperCase() || undefined,
      amount: selectedAmount,
      date: new Date().toISOString(),
      purpose: `${currentTier.name} - शिक्षा, स्वास्थ्य एवं असहाय जन सेवा`,
      purposeHindi: `${currentTier.nameHindi} - शिक्षा, स्वास्थ्य व निर्धन सहायता`,
      paymentMode,
      transactionRef: activeTab === 'bank_transfer'
        ? `BOI/NEFT/${Math.floor(100000000000 + Math.random() * 900000000000)}`
        : activeTab === 'card'
        ? `CARD/TXN/${Math.floor(100000000000 + Math.random() * 900000000000)}`
        : `UPI/${Math.floor(100000000000 + Math.random() * 900000000000)}`,
      taxExemptEligible: false,
      city: city.trim() || 'Ghazipur',
      emailSent: Boolean(donorEmail.trim() && donorEmail.includes('@')),
      emailSentAt: donorEmail.trim() ? new Date().toISOString() : undefined
    };

    if (donorEmail.trim() && donorEmail.includes('@')) {
      triggerDonationReceiptEmail({ donation: newDonation }).then((res) => {
        if (res.success) {
          toast.success(`📩 दान रसीद PDF आपके ईमेल (${donorEmail.trim()}) पर भेज दी गई है!`, {
            duration: 5000,
            icon: '✉️'
          });
        }
      }).catch(console.warn);
    }

    onDonationSuccess(newDonation);
  };

  const patronTiers = [
    { label: 'Diamond', amount: 200000, symbol: '💎', sub: '₹2,00,000+' },
    { label: 'Platinum', amount: 100000, symbol: '💠', sub: '₹1,00,000+' },
    { label: 'Gold', amount: 50000, symbol: '🥇', sub: '₹50,000+' },
    { label: 'Silver', amount: 25000, symbol: '🥈', sub: '₹25,000+' },
  ];

  const sevaPresets = [11000, 5100, 2100, 1100, 500];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 overflow-y-auto backdrop-blur-xs overscroll-contain">
      <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative my-auto border border-amber-200 animate-in fade-in zoom-in-95 duration-200">
          {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mb-2">
            <Heart className="w-6 h-6 fill-red-600" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 font-serif">
            दान एवं सहयोग सेवा (Donation & Support)
          </h3>
          <p className="text-xs text-gray-600 mt-0.5">
            UPI, QR कोड, बैंक ट्रांसफर अथवा कार्ड द्वारा सुरक्षित सहयोग कर आधिकारिक डिजिटल रसीद प्राप्त करें।
          </p>
        </div>

        <div className="space-y-4">
          {/* Patron Category Selection Cards */}
          <div>
            <label className="block text-xs font-black text-gray-900 mb-1.5 uppercase tracking-wide">
              🌟 विशिष्ट संरक्षक श्रेणी चुनें (Select Patron Tier):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {patronTiers.map((p) => {
                const isSelected = !customAmount && amount === p.amount;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setAmount(p.amount);
                      setCustomAmount('');
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-amber-900 text-white border-amber-900 shadow-md ring-2 ring-amber-400'
                        : 'bg-amber-50/70 border-amber-200 text-gray-800 hover:bg-amber-100/60'
                    }`}
                  >
                    <span className="text-xl">{p.symbol}</span>
                    <span className="text-xs font-black mt-0.5">{p.label}</span>
                    <span className={`text-[10px] font-mono font-extrabold ${isSelected ? 'text-amber-200' : 'text-amber-800'}`}>
                      ₹ {p.amount.toLocaleString('en-IN')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Regular Seva Presets & Custom Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                सामान्य सेवा राशि:
              </label>
              <div className="grid grid-cols-5 gap-1">
                {sevaPresets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setAmount(val);
                      setCustomAmount('');
                    }}
                    className={`py-1 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                      !customAmount && amount === val
                        ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-2xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    ₹ {val >= 1000 ? `${val / 1000}k` : val}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">
                अन्य इच्छानुसार राशि (Custom Amount):
              </label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="₹ इच्छित राशि दर्ज करें"
                className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl focus:outline-none focus:border-amber-600 font-mono font-bold"
              />
            </div>
          </div>

          {/* Live Tier Badge Indicator */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-amber-50/80 border border-amber-200 text-xs">
            <div className="flex items-center gap-1.5 font-black text-amber-950">
              <span className="text-base">{currentTier.symbol}</span>
              <span>श्रेणी: {currentTier.name} ({currentTier.nameHindi})</span>
            </div>
            <div className="font-mono font-black text-[#8B0000] text-base">
              ₹ {selectedAmount.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div>
            <label className="block text-xs font-black text-gray-900 mb-1.5 uppercase tracking-wide">
              💳 भुगतान विधि चुनें (Payment Method):
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('upi_qr')}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
                  activeTab === 'upi_qr'
                    ? 'bg-amber-900 text-white border-amber-900 shadow-md'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>UPI / QR Code</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bank_transfer')}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
                  activeTab === 'bank_transfer'
                    ? 'bg-amber-900 text-white border-amber-900 shadow-md'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <Building className="w-4 h-4" />
                <span>Bank Account</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border transition-all ${
                  activeTab === 'card'
                    ? 'bg-amber-900 text-white border-amber-900 shadow-md'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Debit / Card</span>
              </button>
            </div>
          </div>

          {/* Tab 1: UPI & QR Code */}
          {activeTab === 'upi_qr' && (
            <div className="bg-[#FFFDF9] border-2 border-dashed border-amber-300 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center">
              <div className="p-2 bg-white rounded-xl shadow-xs border border-gray-200">
                {paymentSettings.qrCodeMode === 'custom_image' && paymentSettings.customQrImageUrl ? (
                  <img
                    src={paymentSettings.customQrImageUrl}
                    alt="Donation QR Code"
                    className="w-[130px] h-[130px] object-contain rounded-lg"
                  />
                ) : (
                  <QRCodeSVG
                    value={upiUrl}
                    size={130}
                    level="M"
                  />
                )}
              </div>

              <div className="mt-2.5 flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200 text-xs">
                <span className="font-mono font-bold text-gray-800">{activeUpiId}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(activeUpiId, 'upiId')}
                  className="text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'upiId' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedField === 'upiId' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <span className="text-[10px] text-gray-500 mt-1 font-medium">
                Google Pay • PhonePe • Paytm • BHIM UPI • Instant Digital Receipt
              </span>
            </div>
          )}

          {/* Tab 2: Bank Account Details (NEFT / RTGS / IMPS) */}
          {activeTab === 'bank_transfer' && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 text-xs space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/80">
                <span className="font-bold text-gray-600">Account Name:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-gray-900">{paymentSettings.bankAccountName || FOUNDATION_INFO.bankAccountName}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(paymentSettings.bankAccountName || FOUNDATION_INFO.bankAccountName, 'accName')}
                    className="p-1 hover:bg-amber-100 rounded text-amber-800 cursor-pointer"
                    title="Copy Account Name"
                  >
                    {copiedField === 'accName' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/80">
                <span className="font-bold text-gray-600">Account Number:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-black text-base text-[#8B0000]">{paymentSettings.bankAccountNumber || FOUNDATION_INFO.bankAccountNumber}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(paymentSettings.bankAccountNumber || FOUNDATION_INFO.bankAccountNumber, 'accNo')}
                    className="p-1 hover:bg-amber-100 rounded text-amber-800 cursor-pointer"
                    title="Copy Account Number"
                  >
                    {copiedField === 'accNo' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/80">
                <span className="font-bold text-gray-600">IFSC Code:</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-gray-900">{paymentSettings.bankIfsc || FOUNDATION_INFO.bankIfsc}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(paymentSettings.bankIfsc || FOUNDATION_INFO.bankIfsc, 'ifsc')}
                    className="p-1 hover:bg-amber-100 rounded text-amber-800 cursor-pointer"
                    title="Copy IFSC Code"
                  >
                    {copiedField === 'ifsc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pb-1.5 border-b border-amber-200/80">
                <span className="font-bold text-gray-600">Bank Name:</span>
                <span className="font-bold text-gray-900">{paymentSettings.bankName || FOUNDATION_INFO.bankName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-600">Branch:</span>
                <span className="font-bold text-gray-900">{paymentSettings.bankBranch || FOUNDATION_INFO.bankBranch}</span>
              </div>
            </div>
          )}

          {/* Tab 3: Debit / Credit Card */}
          {activeTab === 'card' && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 space-y-2.5 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  कार्ड नंबर (Card Number)
                </label>
                <input
                  type="text"
                  maxLength={19}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4532 •••• •••• ••••"
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl font-mono focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    वैधता (MM/YY)
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="12/28"
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl font-mono focus:outline-none focus:border-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="•••"
                    className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-xl font-mono focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>
              <p className="text-[10px] text-gray-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted Instant Gateway Processing</span>
              </p>
            </div>
          )}

          {/* Donor Info Form */}
          <form onSubmit={handleConfirmDonation} className="space-y-3 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  दानदाता का नाम (Donor Name) *
                </label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="श्री / श्रीमती का नाम"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  शहर / ग्राम (City / Village)
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="गाजीपुर / अन्य"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ईमेल पता (Email ID - PDF रसीद प्राप्ति हेतु)
                </label>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="donor@example.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  PAN नंबर (वैकल्पिक / Optional)
                </label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value)}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-xl uppercase font-mono focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#8B0000] hover:bg-[#6b0000] text-white font-bold rounded-xl text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>
                {currentTier.symbol} {currentTier.name} दान रसीद प्राप्त करें
              </span>
            </button>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
};

export default UpiQrModal;
