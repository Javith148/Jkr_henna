import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, PackageCheck, MessageCircle, Send, CheckCircle, Calculator, HeartHandshake } from 'lucide-react';

export default function CustomOrderForm({ onSubmitCustomOrder, shopConfig }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [userRole, setUserRole] = useState('Bridal Artist');
  const [quantity, setQuantity] = useState(50);
  const [hennaType, setHennaType] = useState('Organic Bridal Stain');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [tipSize, setTipSize] = useState('0.35mm Ultra Fine');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const whatsappNum = shopConfig?.whatsappNumber || '+919876543210';

  // Price estimate per cone based on quantity bracket
  let pricePerCone = 38;
  if (quantity >= 50 && quantity < 100) pricePerCone = 34;
  else if (quantity >= 100 && quantity < 250) pricePerCone = 30;
  else if (quantity >= 250) pricePerCone = 26;

  const estimatedTotal = quantity * pricePerCone;

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
      hennaType,
      eventDate,
      location,
      tipSize,
      specialNotes,
      estimatedTotal,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Pending Quotation'
    };

    onSubmitCustomOrder(orderData);

    // Format WhatsApp message
    const msg = encodeURIComponent(
      `*NEW CUSTOM / BULK HENNA ORDER REQUEST*\n` +
      `-----------------------------------------\n` +
      `*Name:* ${name} (${userRole})\n` +
      `*Phone:* ${phone}\n` +
      `*Required Quantity:* ${quantity} Cones\n` +
      `*Henna Type:* ${hennaType}\n` +
      `*Tip Size:* ${tipSize}\n` +
      `*Event Date:* ${eventDate}\n` +
      `*Delivery Location:* ${location}\n` +
      `*Special Notes:* ${specialNotes || 'None'}\n` +
      `-----------------------------------------\n` +
      `*Estimated Price Quote:* ₹${estimatedTotal} (@ ₹${pricePerCone}/cone)\n\n` +
      `Please provide final confirmation & invoice details!`
    );

    window.open(`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
    setIsSubmitted(true);
  };

  return (
    <div className="py-12 bg-[#faf6f0] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
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
              Are you a <strong>Bridal Mehendi Artist</strong>, <strong>Wedding Planner</strong>, or <strong>Bulk Buyer</strong>? Get custom cone batching, pin-point tip sizing, fresh dye release scheduling, and special wholesale rates.
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="bg-white p-8 rounded-3xl border border-[#d4af37]/30 text-center space-y-4 shadow-xl">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-gray-900">Request Sent Successfully!</h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Your bulk order specifications have been transmitted to our master cone formulator via WhatsApp. We will contact you shortly to confirm batch fresh timing!
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-2.5 bg-[#540d17] text-[#f3e5ab] font-bold text-xs rounded-xl hover:bg-[#3b0910]"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form Container */}
            <form onSubmit={handleSubmit} className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#d4af37]/20 space-y-5">
              
              {/* Fix Issue 4: H2 Heading Level */}
              <h2 className="font-serif text-xl font-bold text-[#3b0910] border-b border-gray-100 pb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#d4af37]" /> Order Specification Details
              </h2>

              {/* Role Selection - Fix Issue 9: Increased gap from gap-2 (8px) to gap-4 (16px) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">I am ordering as a:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {['Bridal Artist', 'Mehendi Artist', 'Wedding Planner', 'Bulk Buyer'].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setUserRole(role)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                        userRole === role
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

              {/* Quantity Slider / Selector - Fix Issue 7: Clear visual alignment */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700">Required Cone Quantity *</label>
                  <span className="text-xs font-bold text-[#3b0910] bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                    Selected: {quantity} Cones
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full accent-[#3b0910] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>20 Cones (Min)</span>
                  <span>100 Cones</span>
                  <span>250 Cones</span>
                  <span>500+ Bulk</span>
                </div>
              </div>

              {/* Henna Type & Tip Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Henna Paste Type</label>
                  <select
                    value={hennaType}
                    onChange={(e) => setHennaType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#d4af37] focus:outline-none font-semibold text-gray-800"
                  >
                    <option value="Organic Bridal Stain">Organic Bridal Stain (Dark Cherry)</option>
                    <option value="Regular Organic Natural">Regular Organic Natural Stain</option>
                    <option value="Lavender Essential Blend">Lavender Essential Oil Blend</option>
                    <option value="Glitter Body Art">Glitter Body Art Cones</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pin-Point Tip Size</label>
                  <select
                    value={tipSize}
                    onChange={(e) => setTipSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#d4af37] focus:outline-none font-semibold text-gray-800"
                  >
                    <option value="0.32mm Super Fine Tip">0.32mm Super Fine (Bridal Detail)</option>
                    <option value="0.35mm Ultra Fine">0.35mm Ultra Fine (Standard)</option>
                    <option value="0.38mm Medium Flow">0.38mm Medium Flow (Fast Filler)</option>
                    <option value="0.45mm Bold Tip">0.45mm Bold Tip</option>
                  </select>
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
                  placeholder="e.g., Need 20 cones with lavender smell, insulated ice pouch packaging, extra fine pins..."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-xl focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              {/* Fix Issue 6: Standard WhatsApp Green button style */}
              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5 text-white" />
                Submit Request via WhatsApp
              </button>

            </form>

            {/* Live Pricing Estimator Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white p-6 rounded-3xl shadow-lg border border-[#d4af37]/30 space-y-4">
                
                {/* Fix Issue 5: Aligned H2 heading level and vertical rhythm with form header */}
                <h2 className="font-serif text-xl font-bold text-[#3b0910] border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#d4af37]" /> Live Cost Estimator
                </h2>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Quantity Requested:</span>
                    <strong className="text-gray-900">{quantity} Cones</strong>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Wholesale Tier Price:</span>
                    <strong className="text-emerald-700">₹{pricePerCone} / cone</strong>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Selected Formula:</span>
                    <strong className="text-gray-800 truncate max-w-[140px]">{hennaType}</strong>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Pin Precision:</span>
                    <strong className="text-gray-800">{tipSize.split(' ')[0]}</strong>
                  </div>

                  <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline text-sm font-bold">
                    <span className="text-gray-900">Estimated Total:</span>
                    <span className="text-2xl font-extrabold text-[#3b0910]">₹{estimatedTotal}</span>
                  </div>
                </div>

                {/* Fix Issue 3: Upgraded font size to text-xs */}
                <div className="bg-[#faf6f0] p-3.5 rounded-2xl border border-[#d4af37]/30 text-xs text-gray-600 space-y-1">
                  <p className="font-bold text-[#3b0910]">Wholesale Tier Discounts:</p>
                  <p>• 20 - 49 Cones: ₹38 / cone</p>
                  <p>• 50 - 99 Cones: ₹34 / cone (Save 10%)</p>
                  <p>• 100 - 249 Cones: ₹30 / cone (Save 20%)</p>
                  <p>• 250+ Cones: ₹26 / cone (Save 30%)</p>
                </div>
              </div>

              {/* Fix Issue 8: Lightened background color for guarantee box */}
              <div className="bg-amber-50/80 text-gray-800 p-4.5 rounded-2xl border border-amber-200 space-y-1.5 text-xs shadow-2xs">
                <p className="font-bold text-[#3b0910]">📦 Fresh Dye Release Guarantee</p>
                <p className="text-gray-600 leading-relaxed">
                  Bulk order batches are prepared 24 hours before dispatch to ensure optimal dye release right when you begin your bridal bookings.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
