import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, PackageCheck, MessageCircle, Send, CheckCircle, Calculator, HeartHandshake, X } from 'lucide-react';

export default function CustomOrderForm({ onSubmitCustomOrder, products = [], shopConfig }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [userRole, setUserRole] = useState('Bridal Artist');
  const [quantity, setQuantity] = useState(50);
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [whatsappMsgUrl, setWhatsappMsgUrl] = useState('');

  // Products selection logic
  const availableProducts = (products && products.length > 0)
    ? products
    : [
      { id: '1', name: 'Organic Bridal Henna Cone', price: 38, image: '/images/organic_cone.png', category: 'Henna Cones' },
      { id: '2', name: 'Natural Dye Release Cone', price: 45, image: '/images/bridal_cone.png', category: 'Henna Cones' },
      { id: '3', name: 'Lavender Essential Cone', price: 50, image: '/images/henna_cone_hand_design.png', category: 'Henna Cones' },
      { id: '4', name: 'Jumbo Bulk Henna Cone', price: 60, image: '/images/organic_cone.png', category: 'Bulk Cones' }
    ];

  const [selectedProdId, setSelectedProdId] = useState(availableProducts[0]?.id || availableProducts[0]?.name);

  // Find active selected product object
  const selectedProduct = availableProducts.find(
    (p) => String(p.id) === String(selectedProdId) || p.name === selectedProdId
  ) || availableProducts[0];

  const basePrice = Number(selectedProduct?.price || 38);

  // Calculate tier discount based on selected product price (Starts with 5% discount for <50 cones)
  let tierDiscountPercent = 5;
  if (quantity >= 50 && quantity < 100) tierDiscountPercent = 10;
  else if (quantity >= 100 && quantity < 250) tierDiscountPercent = 20;
  else if (quantity >= 250) tierDiscountPercent = 30;

  const pricePerCone = Math.round(basePrice * (1 - tierDiscountPercent / 100));
  const estimatedTotal = quantity * pricePerCone;
  const totalSavings = (basePrice * quantity) - estimatedTotal;

  const whatsappNum = shopConfig?.whatsappNumber || '+919876543210';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !location || !eventDate) {
      alert('Please fill out all required fields.');
      return;
    }

    const orderData = {
      id: `CUSTOM-${Math.floor(100 + Math.random() * 900)}`,
      name,
      phone,
      userRole,
      quantity,
      coneType: selectedProduct.name,
      productId: selectedProduct.id,
      basePrice,
      pricePerCone,
      eventDate,
      location,
      specialNotes,
      estimatedTotal,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Pending Quotation'
    };

    // Save to Database / App state
    onSubmitCustomOrder(orderData);

    // Format WhatsApp message URL
    const msg = encodeURIComponent(
      `*NEW CUSTOM / BULK HENNA ORDER REQUEST*\n` +
      `-----------------------------------------\n` +
      `*Name:* ${name} (${userRole})\n` +
      `*Phone:* ${phone}\n` +
      `*Selected Cone:* ${selectedProduct.name} (Base: ₹${basePrice})\n` +
      `*Quantity:* ${quantity} Cones\n` +
      `*Wholesale Price:* ₹${pricePerCone} / cone (${tierDiscountPercent}% OFF)\n` +
      `*Event Date:* ${eventDate}\n` +
      `*Delivery Location:* ${location}\n` +
      `*Special Notes:* ${specialNotes || 'None'}\n` +
      `-----------------------------------------\n` +
      `*Estimated Total Quote:* ₹${estimatedTotal} (Saved ₹${totalSavings})\n\n` +
      `Please confirm batch scheduling & invoice details!`
    );

    const waUrl = `https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}?text=${msg}`;
    setWhatsappMsgUrl(waUrl);

    // Show Confirmation Dialog Modal Box
    setShowDialog(true);
  };

  return (
    <div className="py-12 bg-[#faf6f0] min-h-screen font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Banner Card */}
        <div className="bg-gradient-to-r from-[#540d17] via-[#3b0910] to-[#2b050a] text-white p-8 rounded-3xl shadow-xl border border-[#d4af37]/30 mb-8 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/20 text-[#f3e5ab] text-xs font-bold mb-3 border border-[#d4af37]/40">
              <HeartHandshake className="w-4 h-4 text-[#d4af37]" />
              Designed for Professionals & Bulk Buyers
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-white mb-2">
              Custom & Bulk Cone Request
            </h1>
            <p className="text-gray-200 text-xs sm:text-sm leading-relaxed">
              Are you a <strong>Bridal Mehendi Artist</strong>, <strong>Wedding Planner</strong>, or <strong>Bulk Buyer</strong>? Get custom cone batching, fresh dye release scheduling, and special wholesale rates.
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="bg-white p-8 rounded-3xl border border-[#d4af37]/30 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-gray-900">Request Saved & Transmitted!</h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Your custom order request for <strong>{selectedProduct.name}</strong> has been saved. Our master formulator will review your request and contact you via WhatsApp shortly!
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-2.5 bg-[#540d17] text-[#f3e5ab] font-bold text-xs rounded-xl hover:bg-[#3b0910] transition"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#d4af37]/20 space-y-6">

              <h2 className="font-serif text-xl font-bold text-[#3b0910] border-b border-gray-100 pb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#d4af37]" /> Order Specification Details
              </h2>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">I am ordering as a:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Bridal Artist', 'Mehendi Artist', 'Wedding Planner', 'Bulk Buyer'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setUserRole(role)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${userRole === role
                          ? 'bg-[#3b0910] text-[#f3e5ab] border-[#d4af37]'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Henna Art"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp / Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Cone Type Selection with Image Preview Card */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700">Select Cone Type *</label>

                <div className="flex flex-col sm:flex-row items-stretch gap-3 bg-[#faf6f0] p-3 rounded-2xl border border-[#d4af37]/30">
                  {/* Selected Product Thumbnail */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-[#d4af37] shadow-xs shrink-0 bg-white">
                    <img
                      src={selectedProduct?.image || '/images/organic_cone.png'}
                      alt={selectedProduct?.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/images/organic_cone.png'; }}
                    />
                  </div>

                  {/* Dropdown Selector (Name Only, Price Removed) */}
                  <div className="flex-1 flex flex-col justify-center space-y-1.5">
                    <select
                      value={selectedProdId}
                      onChange={(e) => setSelectedProdId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#d4af37] focus:outline-none font-bold text-[#3b0910] bg-white cursor-pointer"
                    >
                      {availableProducts.map((prod) => (
                        <option key={prod.id || prod.name} value={prod.id || prod.name}>
                          {prod.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center justify-between text-[11px] px-1">
                      <span className="text-gray-500 font-medium">Standard Retail Price:</span>
                      <span className="font-extrabold text-[#3b0910]">₹{basePrice} per cone</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quantity Slider / Selector */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700">Required Cone Quantity *</label>
                  <span className="text-xs font-bold text-[#3b0910] bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                    Selected: {quantity} Cones
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="500"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full accent-[#3b0910] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 font-medium">
                  <span>2 Cones (Min)</span>
                  <span>100 Cones</span>
                  <span>250 Cones</span>
                  <span>500+ Bulk</span>
                </div>
              </div>

              {/* Event Date & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Event / Requirement Date *</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#d4af37] focus:outline-none text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Delivery City / Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Madurai, Tamil Nadu"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Special Requirements & Instructions</label>
                <textarea
                  rows={3}
                  placeholder="e.g., Specific fragrance preference, custom packaging instructions, delivery date details..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              {/* Send Request Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#540d17] hover:bg-[#3b0910] text-[#f3e5ab] font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-[#d4af37]" />
                Send Request
              </button>

            </form>

            {/* Redesigned Premium Live Cost Estimator Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-[#d4af37]/40 space-y-5">

                {/* Header */}
                <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                  <h2 className="font-serif text-xl font-bold text-[#3b0910] flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#d4af37]" /> Live Cost Estimator
                  </h2>
                </div>

                {/* Selected Product Card Preview */}
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[#faf6f0] to-[#f5ebd9] rounded-2xl border border-[#d4af37]/30 shadow-2xs">
                  <img
                    src={selectedProduct?.image || '/images/organic_cone.png'}
                    alt={selectedProduct?.name}
                    className="w-14 h-14 rounded-xl object-cover border border-[#d4af37] shadow-xs bg-white shrink-0"
                    onError={(e) => { e.target.src = '/images/organic_cone.png'; }}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Selected Product</span>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3b0910] truncate">
                      {selectedProduct?.name}
                    </h4>
                    <p className="text-[11px] text-gray-600">Base Retail: <strong>₹{basePrice}</strong> / cone</p>
                  </div>
                </div>

                {/* Live Estimator Line Items */}
                <div className="space-y-2.5 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Selected Cone:</span>
                    <strong className="text-[#3b0910] font-bold truncate max-w-[170px]">{selectedProduct?.name}</strong>
                  </div>

                  <div className="flex justify-between items-center text-gray-700">
                    <span>Quantity Requested:</span>
                    <strong className="text-gray-900 font-bold bg-white px-2 py-0.5 rounded border border-gray-200">{quantity} Cones</strong>
                  </div>

                  <div className="flex justify-between items-center text-gray-700">
                    <span>Wholesale Tier Price:</span>
                    <div className="text-right">
                      <strong className="text-emerald-700 font-extrabold text-sm">₹{pricePerCone}</strong>
                      <span className="text-[11px] text-gray-500"> / cone</span>
                      {tierDiscountPercent > 0 && (
                        <span className="ml-1 text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">
                          ({tierDiscountPercent}% OFF)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Estimated Total:</span>
                      {totalSavings > 0 && (
                        <span className="text-[10px] text-emerald-700 font-bold">You Save ₹{totalSavings}!</span>
                      )}
                    </div>
                    <span className="text-2xl font-black text-[#3b0910]">₹{estimatedTotal}</span>
                  </div>
                </div>

                {/* Wholesale Tier Discounts Breakdown */}
                <div className="bg-[#faf6f0] p-4 rounded-2xl border border-[#d4af37]/30 text-xs space-y-2">
                  <p className="font-serif font-bold text-[#3b0910] text-xs">Wholesale Tier Discounts (Based on ₹{basePrice}):</p>

                  <div className="space-y-1.5">
                    {[
                      { tier: '2 - 49 Cones', disc: 5, label: `₹${Math.round(basePrice * 0.95)} / cone (Save 5%)` },
                      { tier: '50 - 99 Cones', disc: 10, label: `₹${Math.round(basePrice * 0.90)} / cone (Save 10%)` },
                      { tier: '100 - 249 Cones', disc: 20, label: `₹${Math.round(basePrice * 0.80)} / cone (Save 20%)` },
                      { tier: '250+ Cones', disc: 30, label: `₹${Math.round(basePrice * 0.70)} / cone (Save 30%)` },
                    ].map((item, idx) => {
                      const isActive = (item.disc === tierDiscountPercent);
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-2 rounded-xl text-[11px] font-medium transition ${isActive
                              ? 'bg-[#3b0910] text-[#f3e5ab] font-bold shadow-xs border border-[#d4af37]'
                              : 'bg-white text-gray-700 border border-gray-200'
                            }`}
                        >
                          <span className="flex items-center gap-1.5">
                            {isActive && <CheckCircle className="w-3.5 h-3.5 text-[#d4af37]" />}
                            • {item.tier}
                          </span>
                          <span>{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Fresh Guarantee Box */}
                <div className="bg-amber-50/90 text-gray-800 p-4 rounded-2xl border border-amber-200 space-y-1.5 text-xs shadow-2xs">
                  <p className="font-bold text-[#3b0910] flex items-center gap-1.5">
                    <span className="text-base">📦</span> Fresh Dye Release Guarantee
                  </p>
                  <p className="text-gray-600 leading-relaxed text-[11px]">
                    Bulk order batches are prepared 24 hours before dispatch to ensure optimal dye release right when you begin your bridal bookings.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Confirmation Dialog Modal */}
        {showDialog && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#d4af37]/40 text-center space-y-5 relative">
              <button
                onClick={() => { setShowDialog(false); setIsSubmitted(true); }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-[#3b0910]">
                  Request Sent Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                  Ungal request send aiyurchu! Order details check pannitu ungalukku WhatsApp pannuvom.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappMsgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
                <button
                  onClick={() => { setShowDialog(false); setIsSubmitted(true); }}
                  className="py-3 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
