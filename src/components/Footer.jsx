import React from 'react';
import { MessageCircle, ShieldCheck, Truck, ArrowRight, Clock } from 'lucide-react';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Footer({ shopConfig, setActiveTab, categories = [], onSelectCategory }) {
  const whatsappNum = shopConfig?.whatsappNumber || '+919876543210';
  const instaUrl = shopConfig?.instagramUrl || 'https://www.instagram.com/jkr_henna';
  const instaHandle = shopConfig?.instagramHandle || '@jkr_henna';

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}`, '_blank');
  };

  // Get top 7 categories from DB (excluding 'All')
  const topCategories = (categories || [])
    .filter(c => typeof c === 'string' ? c !== 'All' : c.name !== 'All')
    .slice(0, 7);

  const handleCategoryClick = (catName) => {
    if (onSelectCategory) {
      onSelectCategory(catName);
    }
    if (setActiveTab) {
      setActiveTab('shop');
    }
  };

  return (
    <footer className="bg-[#3b0910] text-white border-t border-[#d4af37]/20 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#d4af37]/20">
          
          {/* Col 1: Brand Info with Logo Image */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.jpg" 
                alt="JKR Henna Logo" 
                className="w-12 h-12 rounded-full object-cover border-2 border-[#d4af37] shadow-md"
              />
              <span className="font-serif text-2xl font-bold tracking-wider text-[#f3e5ab]">
                JKR HENNA
              </span>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">
              100% Chemical-Free Organic Henna Cones handcrafted with Rajasthani Lawsonia leaves and essential oils. Engineered for deep natural stain and smooth flow.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleWhatsApp}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Support
              </button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-[#f3e5ab] font-bold text-sm">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-[#d4af37] transition flex items-center gap-1.5">
                  <span>Home Page</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('shop')} className="hover:text-[#d4af37] transition flex items-center gap-1.5">
                  <span>Shop Organic Cones</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('custom-order')} className="hover:text-[#d4af37] transition flex items-center gap-1.5">
                  <span>Bulk & Custom Orders</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('gallery')} className="hover:text-[#d4af37] transition flex items-center gap-1.5">
                  <span>Henna Design Gallery</span>
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('track-order')} className="hover:text-[#d4af37] transition flex items-center gap-1.5">
                  <span>Track Order Status</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories dynamically loaded from DB (Top 7) */}
          <div className="space-y-3">
            <h4 className="font-serif text-[#f3e5ab] font-bold text-sm">
              Top Categories
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              {topCategories.length > 0 ? (
                topCategories.map((cat, idx) => {
                  const catName = typeof cat === 'string' ? cat : cat.name;
                  return (
                    <li key={idx}>
                      <button
                        onClick={() => handleCategoryClick(catName)}
                        className="hover:text-[#d4af37] transition flex items-center gap-1 group text-left"
                      >
                        <ArrowRight className="w-3 h-3 text-[#d4af37] opacity-0 group-hover:opacity-100 transition-all" />
                        <span>{catName}</span>
                      </button>
                    </li>
                  );
                })
              ) : (
                <>
                  <li><button onClick={() => handleCategoryClick('Henna Cones')} className="hover:text-[#d4af37]">Henna Cones</button></li>
                  <li><button onClick={() => handleCategoryClick('Bridal Cones')} className="hover:text-[#d4af37]">Bridal Cones</button></li>
                  <li><button onClick={() => handleCategoryClick('Henna Powder')} className="hover:text-[#d4af37]">Henna Powder</button></li>
                  <li><button onClick={() => handleCategoryClick('Glitter Cones')} className="hover:text-[#d4af37]">Glitter Cones</button></li>
                  <li><button onClick={() => handleCategoryClick('Henna Oils')} className="hover:text-[#d4af37]">Henna Oils</button></li>
                  <li><button onClick={() => handleCategoryClick('Stencils')} className="hover:text-[#d4af37]">Stencils</button></li>
                  <li><button onClick={() => handleCategoryClick('Combo Sets')} className="hover:text-[#d4af37]">Combo Sets</button></li>
                </>
              )}
            </ul>
          </div>

          {/* Col 4: Redesigned Connect & Social Hub */}
          <div className="space-y-3">
            <h4 className="font-serif text-[#f3e5ab] font-bold text-sm">
              Connect & Social Hub
            </h4>
            <div className="bg-[#4d101a] p-4 rounded-2xl border border-[#d4af37]/30 space-y-2.5 text-xs">
              <a
                href={instaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 bg-[#3b0910]/60 hover:bg-[#3b0910] rounded-xl border border-[#d4af37]/30 transition group"
              >
                <div className="p-1.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white rounded-lg shrink-0 shadow-xs">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-amber-200 font-bold text-xs group-hover:underline">{instaHandle}</p>
                  <p className="text-[10px] text-gray-300">Follow on Instagram</p>
                </div>
              </a>

              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center gap-2.5 p-2 bg-[#3b0910]/60 hover:bg-[#3b0910] rounded-xl border border-[#d4af37]/30 transition group text-left"
              >
                <div className="p-1.5 bg-emerald-600 text-white rounded-lg shrink-0 shadow-xs">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-emerald-300 font-bold text-xs group-hover:underline">WhatsApp Direct</p>
                  <p className="text-[10px] text-gray-300">Instant Order & Queries</p>
                </div>
              </button>

              <div className="flex items-center gap-2.5 p-2 bg-[#3b0910]/40 rounded-xl border border-white/5">
                <div className="p-1.5 bg-amber-500/20 text-[#d4af37] rounded-lg shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-gray-200 font-semibold text-[11px]">Fresh Weekly Batches</p>
                  <p className="text-[10px] text-gray-400">Handcrafted & Shipped Fast</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 JKR Henna Shop. All rights reserved. Crafted for Mehendi Lovers.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> 100% Chemical-Free
            </span>
            <span className="flex items-center gap-1 text-[#d4af37]">
              <Truck className="w-4 h-4" /> Pan India Express Shipping
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
