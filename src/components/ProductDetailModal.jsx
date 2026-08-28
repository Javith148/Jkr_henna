import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, ShieldCheck, Leaf, CreditCard, MessageCircle, Plus } from 'lucide-react';
import { createReview } from '../services/api';

export default function ProductDetailModal({ 
  product, 
  onClose, 
  onAddToCart, 
  onBuyNow, 
  onToggleWishlist, 
  isWishlisted,
  shopConfig,
  reviews = [],
  onAddReview,
  user,
  onOpenAccount
}) {
  const [qty, setQty] = useState(1);
  const [showAddReviewForm, setShowAddReviewForm] = useState(false);
  const [revCity, setRevCity] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');

  if (!product) return null;

  const whatsappNum = shopConfig?.whatsappNumber || '+919876543210';
  const shopName = shopConfig?.name || 'JKR Henna & Cone Shop';

  // Dynamic review calculation for this specific product only (Strict Exact Match)
  const productReviews = (reviews || []).filter((r) => {
    if (r.productId && String(r.productId) === String(product.id)) return true;
    if (r.product_id && String(r.product_id) === String(product.id)) return true;
    const rName = (r.productName || r.product_name || '').toLowerCase().trim();
    const pName = (product.name || '').toLowerCase().trim();
    if (!rName || !pName) return false;
    return rName === pName;
  });
  
  // Calculate dynamic count and average rating
  const dynamicReviewCount = productReviews.length > 0 ? productReviews.length : (product.reviewsCount || 0);
  const dynamicAvgRating = productReviews.length > 0 
    ? (productReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / productReviews.length).toFixed(1)
    : (product.rating || 5.0);

  const handleWhatsAppInquiry = () => {
    const msg = encodeURIComponent(`Hi ${shopName}! I have a question about: *${product.name}* (Price: ₹${product.price}).`);
    window.open(`https://wa.me/${whatsappNum.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank');
  };

  const handleInlineReviewSubmit = async (e) => {
    e.preventDefault();
    if (!revComment) return;

    const todayFormatted = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const reviewObj = {
      name: user?.name || 'Verified Customer',
      city: revCity || 'Customer',
      rating: revRating,
      date: todayFormatted,
      productId: product.id,
      product_id: product.id,
      productName: product.name,
      product_name: product.name,
      comment: revComment,
      stainDarkness: 'Dark Mahogany Stain',
      verified: true,
      avatar: user?.avatar || user?.photo_url || user?.photoURL || ''
    };

    // Immediately close review form and reset input states
    setShowAddReviewForm(false);
    setRevCity('');
    setRevComment('');

    if (onAddReview) {
      await onAddReview(reviewObj);
    } else {
      try {
        await createReview(reviewObj);
      } catch (err) {
        console.error('Failed to post review:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-[#d4af37]/40 max-h-[92vh] flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-30 p-2 bg-gray-100 hover:bg-[#3b0910] text-gray-700 hover:text-white rounded-full shadow transition-all duration-200"
          title="Close Quick View"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Left Column: Image, Ingredients & Safety (Moved Up) */}
        <div className="md:w-1/2 bg-[#faf6f0] p-4 sm:p-5 flex flex-col justify-start overflow-y-auto no-scrollbar border-b md:border-b-0 md:border-r border-gray-200 space-y-3">
          {/* Product Image */}
          <div className="relative w-full aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden shadow-md border border-[#d4af37]/30">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            {product.discount && (
              <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow">
                {product.discount}
              </span>
            )}
          </div>

          {/* Ingredients & Safety (Moved UP higher) */}
          <div className="bg-white p-2.5 sm:p-3 rounded-2xl border border-gray-200 space-y-1 text-xs shadow-2xs">
            <div className="flex items-center gap-1.5 text-[#540d17] font-bold">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ingredients & Purity:</span>
            </div>
            <p className="text-gray-700 font-medium text-[11px] leading-tight">
              {product.ingredients || 'Organic Rajasthani Henna Powder, Eucalyptus Oil, Cane Sugar'}
            </p>
            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px] pt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>0% PPD • 0% Ammonia • 100% Skin Safe</span>
            </div>
          </div>

          {/* Specifications: Stain Life, Weight */}
          <div className="grid grid-cols-2 gap-2 w-full text-center pt-0.5">
            <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-2xs">
              <p className="text-[9px] text-gray-500 font-semibold uppercase">Stain Life</p>
              <p className="text-xs font-bold text-emerald-700">{product.stainDuration || product.stain_duration || '10 - 14 Days'}</p>
            </div>
            <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-2xs">
              <p className="text-[9px] text-gray-500 font-semibold uppercase">Weight</p>
              <p className="text-xs font-bold text-gray-800">{product.weight || '25g per cone'}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Info, Actions & Dynamic Reviews Section (No Scrollbar) */}
        <div className="md:w-1/2 p-4 sm:p-5 overflow-y-auto no-scrollbar space-y-4 flex flex-col justify-between">
          
          <div className="space-y-3">
            {/* Category & Dynamic Rating */}
            <div className="flex items-center justify-between pr-8">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {product.category}
              </span>
              <div className="flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-full text-amber-800 text-[11px] font-bold">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{dynamicAvgRating}</span>
                <span className="text-gray-500 font-normal">({dynamicReviewCount} {dynamicReviewCount === 1 ? 'review' : 'reviews'})</span>
              </div>
            </div>

            {/* Title */}
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h2>

            {/* Price & Stock */}
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#3b0910]">
                ₹{product.price}
              </span>
              {(product.originalPrice || product.original_price) && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice || product.original_price}
                </span>
              )}
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                In Stock ({product.stock} units)
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-xs leading-relaxed">
              {product.description}
            </p>

            {/* Action Bar */}
            <div className="border-t border-gray-200 pt-2.5 space-y-2.5">
              
              {/* Quantity Counter */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-700">Quantity:</span>
                  <div className="flex items-center gap-1.5 bg-gray-100 p-0.5 rounded-xl border border-gray-300">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-6 h-6 bg-white text-gray-800 rounded-lg font-bold shadow-xs hover:bg-gray-50 flex items-center justify-center text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-5 text-center">{qty}</span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="w-6 h-6 bg-white text-gray-800 rounded-lg font-bold shadow-xs hover:bg-gray-50 flex items-center justify-center text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-2 rounded-xl border transition ${
                    isWishlisted 
                      ? 'bg-rose-600 text-white border-rose-600' 
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-rose-50'
                  }`}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Buttons: Add to Cart & Buy Now */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    onAddToCart(product, qty);
                    onClose();
                  }}
                  className="py-2.5 px-3 bg-[#540d17] hover:bg-[#3b0910] text-[#f3e5ab] font-bold rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5 border border-[#d4af37]/40"
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                </button>

                <button
                  onClick={() => {
                    onBuyNow(product, qty);
                    onClose();
                  }}
                  className="py-2.5 px-3 bg-gradient-to-r from-[#d4af37] to-[#b8860b] hover:brightness-110 text-[#3b0910] font-bold rounded-xl text-xs transition shadow flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" /> Buy Now
                </button>
              </div>

              <button
                onClick={handleWhatsAppInquiry}
                className="w-full py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-[11px] transition border border-emerald-300 flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                Ask Question on WhatsApp
              </button>
            </div>

            {/* Dynamic Product Reviews Section (Right Side - No Scrollbar) */}
            <div className="bg-[#faf6f0] p-3 sm:p-3.5 rounded-2xl border border-[#d4af37]/30 space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-1.5">
                <div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3b0910] flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    Product Reviews ({dynamicReviewCount})
                  </h4>
                  <p className="text-[10px] text-gray-600">Verified buyer reviews for {product.name}</p>
                </div>
                <button
                  onClick={() => {
                    if (!user) {
                      onClose();
                      if (onOpenAccount) onOpenAccount();
                      return;
                    }
                    setShowAddReviewForm(!showAddReviewForm);
                  }}
                  className="px-2.5 py-1 bg-[#d4af37] text-[#3b0910] hover:bg-[#e5c158] rounded-lg text-[11px] font-bold flex items-center gap-1 transition shadow-xs"
                >
                  <Plus className="w-3 h-3" />
                  {showAddReviewForm ? 'Cancel' : 'Add Review'}
                </button>
              </div>

              {/* Inline Add Review Form */}
              {showAddReviewForm && (
                <form onSubmit={handleInlineReviewSubmit} className="bg-white p-2.5 rounded-xl border border-gray-200 space-y-1.5 text-[11px] shadow-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Chennai"
                      value={revCity}
                      onChange={(e) => setRevCity(e.target.value)}
                      className="w-full px-2 py-1 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700">Rating</label>
                    <div className="flex gap-1 py-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRevRating(star)}
                        >
                          <Star className={`w-3.5 h-3.5 ${star <= revRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-700">Review *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Write your review for this product..."
                      value={revComment}
                      onChange={(e) => setRevComment(e.target.value)}
                      className="w-full px-2 py-1 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1 bg-[#3b0910] text-[#f3e5ab] font-bold rounded-lg hover:bg-[#2b050a] transition"
                  >
                    Submit Review
                  </button>
                </form>
              )}

              {/* Dynamic List of Reviews for this Product (No Scrollbar) */}
              <div className="max-h-36 overflow-y-auto no-scrollbar space-y-1.5">
                {productReviews.length === 0 ? (
                  <p className="text-[11px] text-gray-500 italic text-center py-2">
                    No reviews yet for this product. Be the first to post a review!
                  </p>
                ) : (
                  productReviews.map((rev) => (
                    <div key={rev.id || Math.random()} className="bg-white p-2 rounded-xl border border-gray-200 text-[11px] space-y-0.5 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {(rev.avatar || rev.image) && ((rev.avatar || rev.image).includes('googleusercontent.com') || (rev.avatar || rev.image).includes('supabase.co')) ? (
                            <img 
                              src={rev.avatar || rev.image} 
                              alt={rev.name} 
                              className="w-5 h-5 rounded-full object-cover border border-[#d4af37]/40 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-[#3b0910] text-[#f3e5ab] font-bold text-[9px] flex items-center justify-center border border-[#d4af37]/40 font-serif shrink-0">
                              {(rev.name || 'C').trim().charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="font-bold text-gray-900">{rev.name} ({rev.city || 'Customer'})</span>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-2.5 h-2.5 ${i < Number(rev.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 italic">"{rev.comment}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
