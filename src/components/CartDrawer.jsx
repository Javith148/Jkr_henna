import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Check, Percent, Tag, MessageCircle, Truck, ShieldCheck, Sparkles } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQty, 
  onRemoveItem, 
  onClearCart,
  onOrderPlaced,
  shopConfig 
}) {
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Cart, 2: Checkout Form, 3: Success

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('WhatsApp Direct');
  const [placedOrderId, setPlacedOrderId] = useState('');

  if (!isOpen) return null;

  const freeDeliveryThreshold = shopConfig?.freeDeliveryThreshold ?? 500;
  const configDeliveryCharge = shopConfig?.deliveryCharge ?? 50;
  const whatsappNum = shopConfig?.whatsappNumber || '+919876543210';
  const shopName = shopConfig?.name || 'JKR Henna & Cone Shop';

  // Subtotal Calculation
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  
  // Delivery Fee Calculation
  const deliveryCharge = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : configDeliveryCharge;
  
  const finalTotal = Math.max(0, subtotal + deliveryCharge);

  // Submit Order Handler
  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !phone || !address || !pincode) {
      alert('Please fill out all address details.');
      return;
    }

    // Generate Order ID
    const newOrderId = `JKR-${Math.floor(1000 + Math.random() * 9000)}`;
    setPlacedOrderId(newOrderId);

    // Order payload
    const newOrder = {
      id: newOrderId,
      customerName,
      phone,
      date: new Date().toISOString().split('T')[0],
      totalAmount: finalTotal,
      status: 'Placed',
      paymentMethod,
      items: cartItems.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
      address: `${address}, ${city} - ${pincode}`,
      courier: 'Pending Dispatch Assignment',
      estimatedDelivery: '2 - 3 Days'
    };

    onOrderPlaced(newOrder);

    // If WhatsApp Payment/Order option is selected:
    if (paymentMethod === 'WhatsApp Direct') {
      const itemsList = cartItems.map(i => `• ${i.name} (Qty: ${i.qty}) - ₹${i.price * i.qty}`).join('\n');
      const waText = encodeURIComponent(
        `*NEW ORDER FROM WEBSITE*\n` +
        `-------------------------------\n` +
        `*Order ID:* ${newOrderId}\n` +
        `*Customer:* ${customerName}\n` +
        `*Phone:* ${phone}\n` +
        `*Delivery Address:* ${address}, ${city} - ${pincode}\n` +
        `-------------------------------\n` +
        `*Order Items:*\n${itemsList}\n` +
        `-------------------------------\n` +
        `*Subtotal:* ₹${subtotal}\n` +
        `*Delivery:* ${deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}\n` +
        `*Total Amount:* ₹${finalTotal}\n` +
        `*Payment Choice:* ${paymentMethod}\n\n` +
        `Please confirm my order!`
      );
      window.open(`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}?text=${waText}`, '_blank');
    }

    setCheckoutStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-white h-full flex flex-col justify-between shadow-2xl border-l border-[#d4af37]/30">
        
        {/* Cart Drawer Header */}
        <div className="bg-[#540d17] text-white p-4 flex items-center justify-between border-b border-[#d4af37]/30">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
            <h2 className="font-serif text-lg font-bold text-white">Your Shopping Cart</h2>
            <span className="bg-[#d4af37] text-[#3b0910] text-xs font-bold px-2 py-0.5 rounded-full">
              {cartItems.reduce((acc, i) => acc + i.qty, 0)}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition text-gray-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CART ITEMS VIEW */}
        {checkoutStep === 1 && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 bg-[#faf6f0] rounded-full flex items-center justify-center mx-auto border border-[#d4af37]/30">
                  <ShoppingBag className="w-10 h-10 text-[#d4af37]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-gray-800">Your Cart is Empty</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Looks like you haven't added any henna cones or products to your cart yet.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#540d17] text-[#f3e5ab] font-bold rounded-xl text-xs shadow hover:bg-[#3b0910]"
                >
                  Start Shopping Now
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-[#faf6f0] rounded-2xl border border-[#d4af37]/20 relative"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-xl border border-gray-200"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-amber-800 font-medium">
                          ₹{item.price} x {item.qty}
                        </p>
                        
                        {/* Qty Adjust */}
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            onClick={() => onUpdateQty(item.id, item.qty - 1)}
                            className="w-5 h-5 bg-white border border-gray-300 rounded text-xs font-bold hover:bg-gray-100 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-gray-800">{item.qty}</span>
                          <button
                            onClick={() => onUpdateQty(item.id, item.qty + 1)}
                            className="w-5 h-5 bg-white border border-gray-300 rounded text-xs font-bold hover:bg-gray-100 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between self-stretch">
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-extrabold text-[#540d17]">
                          ₹{item.price * item.qty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>


              </>
            )}
          </div>
        )}

        {/* STEP 2: CHECKOUT ADDRESS & PAYMENT FORM */}
        {checkoutStep === 2 && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="font-serif font-bold text-gray-900 text-sm">Delivery & Checkout Information</h3>
              <button 
                onClick={() => setCheckoutStep(1)}
                className="text-xs text-amber-800 underline font-semibold"
              >
                Back to Cart
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anitha Sundar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Shipping Address *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Door No, Street Name, Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City / Town *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chennai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 600001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#d4af37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Choice */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-gray-700 mb-2">Select Payment Method</label>
                <div className="space-y-2">
                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition ${
                    paymentMethod === 'WhatsApp Direct' ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="pm"
                        checked={paymentMethod === 'WhatsApp Direct'}
                        onChange={() => setPaymentMethod('WhatsApp Direct')}
                      />
                      <span>WhatsApp Instant Order (Direct Chat & UPI)</span>
                    </div>
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                  </label>

                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition ${
                    paymentMethod === 'Cash on Delivery' ? 'border-[#d4af37] bg-amber-50 text-amber-950 font-bold' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="pm"
                        checked={paymentMethod === 'Cash on Delivery'}
                        onChange={() => setPaymentMethod('Cash on Delivery')}
                      />
                      <span>Cash on Delivery (COD)</span>
                    </div>
                    <Truck className="w-4 h-4 text-amber-700" />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-4 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#3b0910] font-bold text-sm rounded-xl shadow-lg hover:brightness-110 flex items-center justify-center gap-2"
              >
                <span>Confirm Order & Pay (₹{finalTotal})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: ORDER SUCCESS SCREEN */}
        {checkoutStep === 3 && (
          <div className="flex-1 overflow-y-auto p-6 text-center space-y-4 flex flex-col justify-center items-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-300 text-emerald-600 animate-bounce">
              <Check className="w-10 h-10" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-gray-900">Order Placed Successfully!</h3>
            <div className="bg-[#faf6f0] p-4 rounded-2xl border border-[#d4af37]/30 text-left w-full space-y-2 text-xs">
              <p className="flex justify-between">
                <span className="text-gray-500">Order Reference:</span>
                <strong className="text-[#540d17] font-mono">{placedOrderId}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Total Paid/Due:</span>
                <strong className="text-emerald-700">₹{finalTotal}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Payment Option:</span>
                <strong className="text-gray-800">{paymentMethod}</strong>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Estimated Delivery:</span>
                <strong className="text-amber-800">2 - 3 Days</strong>
              </p>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Thank you for ordering with <strong>{shopName}</strong>! Your henna cones are being carefully packed. You can track your status anytime under <strong>"Track Order"</strong> using your Order ID.
            </p>

            <button
              onClick={() => {
                onClearCart();
                setCheckoutStep(1);
                onClose();
              }}
              className="w-full py-3 bg-[#540d17] text-[#f3e5ab] font-bold text-xs rounded-xl shadow hover:bg-[#3b0910]"
            >
              Continue Browsing Shop
            </button>
          </div>
        )}

        {/* Footer Billing Breakdown Summary */}
        {cartItems.length > 0 && checkoutStep === 1 && (
          <div className="p-4 bg-[#faf6f0] border-t border-[#d4af37]/30 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-gray-900">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery Charge:</span>
                <span className={deliveryCharge === 0 ? "font-bold text-emerald-700" : "font-semibold text-gray-900"}>
                  {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                </span>
              </div>



              <div className="border-t border-gray-300 pt-2 flex justify-between text-sm font-extrabold text-[#3b0910]">
                <span>Total Amount:</span>
                <span className="text-base text-[#540d17]">₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={() => setCheckoutStep(2)}
              className="w-full py-3 bg-gradient-to-r from-[#d4af37] via-[#e5c158] to-[#b8860b] text-[#3b0910] font-bold text-sm rounded-xl shadow-lg hover:brightness-110 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
