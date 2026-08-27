import React from 'react';
import { Home, ShoppingBag, Truck, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';

export default function NotFoundPage({ onNavigate }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#faf9f6] px-4 py-16">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 text-center space-y-6 relative overflow-hidden">
        
        {/* Decorative Gold Glow Background Elements */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-[#d4af37]/15 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-[#3b0910]/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* 404 Large Display Badge */}
        <div className="relative inline-block">
          <span className="font-serif text-8xl sm:text-9xl font-extrabold text-[#3b0910] tracking-wider drop-shadow-sm select-none">
            404
          </span>
          <div className="absolute -top-2 -right-4 bg-[#d4af37] text-[#3b0910] p-2 rounded-full shadow-md animate-bounce">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-bold border border-rose-200 uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" /> Page Not Found
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Henna Pattern Lost in Space
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            The page you are looking for might have been moved, deleted, or doesn't exist. Don't worry, our fresh organic henna cones are right where you left them!
          </p>
        </div>

        {/* Navigation Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
          <button
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#3b0910] text-[#f3e5ab] font-bold text-xs sm:text-sm rounded-xl shadow-md hover:bg-[#2b050a] transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-[#d4af37]" /> Back to Home
          </button>

          <button
            onClick={() => onNavigate('shop')}
            className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Shop Henna Cones
          </button>
        </div>

        {/* Quick Links Footer */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-center gap-6 text-xs text-gray-500 font-semibold">
          <button onClick={() => onNavigate('track-order')} className="hover:text-[#3b0910] transition flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-amber-700" /> Track Order
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('reviews')} className="hover:text-[#3b0910] transition">
            Customer Reviews
          </button>
          <span>•</span>
          <button onClick={() => onNavigate('custom-order')} className="hover:text-[#3b0910] transition">
            Custom Bulk Order
          </button>
        </div>

      </div>
    </div>
  );
}
