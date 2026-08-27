import React, { useState } from 'react';
import { X, Percent, Copy, Check } from 'lucide-react';

export default function OffersModal({ isOpen, onClose, coupons = [] }) {
  const [copiedCode, setCopiedCode] = useState('');

  if (!isOpen) return null;

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-[#d4af37]/40 relative space-y-4">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-[#540d17]">
          <Percent className="w-6 h-6 text-[#d4af37]" />
          <h2 className="font-serif text-xl font-bold">Active Offers & Coupon Codes</h2>
        </div>

        <div className="space-y-3 pt-2">
          {(coupons || []).map((coupon) => (
            <div 
              key={coupon.code}
              className="bg-[#faf6f0] p-4 rounded-2xl border border-[#d4af37]/30 flex items-center justify-between shadow-sm"
            >
              <div>
                <span className="font-mono text-sm font-extrabold text-[#540d17] bg-[#d4af37]/20 px-2.5 py-0.5 rounded border border-[#d4af37]/40">
                  {coupon.code}
                </span>
                <p className="text-xs font-bold text-gray-900 mt-1">{coupon.description}</p>
              </div>

              <button
                onClick={() => handleCopy(coupon.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  copiedCode === coupon.code
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#540d17] text-[#f3e5ab] hover:bg-[#3b0910]'
                }`}
              >
                {copiedCode === coupon.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode === coupon.code ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
