import React from 'react';
import { ShoppingCart, MessageCircle, ShieldCheck, Leaf, Clock, ArrowRight, Star, PackageCheck, Award, CheckCircle2 } from 'lucide-react';

export default function HeroBanner({ shopConfig, onShopNowClick, onCustomOrderClick, reviews = [] }) {
  const whatsappNum = shopConfig?.whatsappNumber || '+919876543210';
  const shopName = shopConfig?.name || 'JKR Henna & Cone Shop';

  // Dynamic Overall Rating Calculation from reviews
  const overallAvgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(`Hello ${shopName}! I would like to inquire about your Organic Henna Cones.`);
    window.open(`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
  };

  return (
    <div className="bg-white text-gray-900 pt-4 pb-8 sm:pt-6 sm:pb-10 lg:pt-6 lg:pb-12 border-b border-gray-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">

            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>100% Chemical-Free Organic Henna</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[#3b0910]">
              Natural Henna Cones Crafted for Rich, Long-Lasting Stain
            </h1>

            {/* Subtext */}
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Freshly hand-rolled each week using premium Lawsonia henna powder and therapeutic essential oils. Engineered with pin-point precision tips for smooth, effortless flow.
            </p>

            {/* Action Buttons with clear visual hierarchy */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onShopNowClick}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#3b0910] hover:bg-[#2b050a] text-[#f3e5ab] font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4 text-[#f3e5ab]" />
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 ml-1 text-[#f3e5ab]" />
              </button>

              <button
                onClick={onCustomOrderClick}
                className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm rounded-xl border border-gray-300 transition flex items-center justify-center gap-2 shadow-2xs"
              >
                <PackageCheck className="w-4 h-4 text-[#3b0910]" />
                <span>Custom & Bulk Orders</span>
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full sm:w-auto px-6 py-3.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-sm rounded-xl border border-emerald-300 transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>WhatsApp Order</span>
              </button>
            </div>



          </div>

          {/* Right Clean Showcase Image Composition */}
          <div className="lg:col-span-5 relative flex justify-center">

            <div className="relative w-full max-w-md">

              {/* Main Image Frame */}
              <div className="aspect-[4/5] bg-gray-50 rounded-3xl overflow-hidden border border-gray-200 shadow-xl relative group">
                <img
                  src="/images/bridal_cone.png"
                  alt="JKR Organic Henna Cones Showcase"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={(e) => {
                    e.target.src = '/images/organic_cone.png';
                  }}
                />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 bg-white/95 text-gray-900 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-gray-200 shadow-md">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  <span>100% Pure Organic Lawsonia</span>
                </div>

                {/* Floating Bottom Badge */}
                <div className="absolute bottom-4 right-4 bg-white/95 text-[#3b0910] backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 border border-gray-200 shadow-lg">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{overallAvgRating} / 5.0 Rating</p>
                    <p className="text-[10px] text-gray-500 font-normal">{reviews.length > 0 ? `${reviews.length} Verified Reviews` : 'Verified Buyers'}</p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
