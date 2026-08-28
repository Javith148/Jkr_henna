import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, CreditCard, Eye, Check } from 'lucide-react';

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onBuyNow, 
  onToggleWishlist, 
  isWishlisted, 
  onOpenDetails,
  reviews = []
}) {
  const [qty, setQty] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Dynamic Review & Rating Calculation for this specific product only (Strict Exact Match)
  const prodReviews = (reviews || []).filter((r) => {
    if (r.productId && String(r.productId) === String(product.id)) return true;
    if (r.product_id && String(r.product_id) === String(product.id)) return true;
    const rName = (r.productName || r.product_name || '').toLowerCase().trim();
    const pName = (product.name || '').toLowerCase().trim();
    if (!rName || !pName) return false;
    return rName === pName;
  });

  const dynamicReviewsCount = prodReviews.length > 0 ? prodReviews.length : (product.reviewsCount || 0);
  const dynamicRating = prodReviews.length > 0
    ? (prodReviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / prodReviews.length).toFixed(1)
    : (product.rating || 5.0);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product, qty);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuy = (e) => {
    e.stopPropagation();
    onBuyNow(product, qty);
  };

  return (
    <div 
      onClick={() => onOpenDetails(product)}
      className="bg-white rounded-xl border border-gray-200 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group cursor-pointer relative"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {(product.isBestSeller || product.is_best_seller) && (
            <span className="bg-[#3b0910] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              BEST SELLER
            </span>
          )}
          {(product.isNew || product.is_new) && (
            <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              NEW ARRIVAL
            </span>
          )}
          {product.discount && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {product.discount}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-xs transition-all z-10 ${
            isWishlisted 
              ? 'bg-rose-600 text-white' 
              : 'bg-white/90 hover:bg-white text-gray-600 hover:text-rose-600'
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white text-[#3b0910] px-3.5 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <Eye className="w-3.5 h-3.5" /> Quick View
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        
        <div className="space-y-1">
          {/* Category */}
          <div className="flex items-center justify-between text-xs font-semibold text-amber-800">
            <span>{product.category}</span>
          </div>

          {/* Product Title (+2px increased font size) */}
          <h3 className="font-serif font-bold text-gray-900 text-sm sm:text-base line-clamp-1 hover:text-[#3b0910] transition">
            {product.name}
          </h3>

          {/* Rating & Stock Badge (Stock moved to right end of rating row) */}
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.floor(Number(dynamicRating)) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-800 ml-0.5">{dynamicRating}</span>
              <span className="text-xs text-gray-400">({dynamicReviewsCount})</span>
            </div>

            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              In Stock ({product.stock})
            </span>
          </div>
        </div>

        {/* Price & Qty Row (Qty selector placed on right end of price) */}
        <div className="border-t border-gray-100 pt-2 space-y-2.5">
          
          <div className="flex items-center justify-between">
            {/* Price */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-[#3b0910]">
                ₹{product.price}
              </span>
              {(product.originalPrice || product.original_price) && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice || product.original_price}
                </span>
              )}
            </div>

            {/* Qty Selector on Right End of Price */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center bg-gray-100 rounded-xl border border-gray-300 px-1.5 py-1"
            >
              <span className="text-xs text-gray-600 font-medium mr-1.5">Qty:</span>
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-7 h-7 bg-white border border-gray-300 rounded-lg text-xs font-bold hover:bg-gray-200 text-gray-800 flex items-center justify-center transition focus:outline-none"
              >
                -
              </button>
              <span className="text-xs font-bold px-2.5 text-gray-900">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty(qty + 1)}
                className="w-7 h-7 bg-white border border-gray-300 rounded-lg text-xs font-bold hover:bg-gray-200 text-gray-800 flex items-center justify-center transition focus:outline-none"
              >
                +
              </button>
            </div>
          </div>

          {/* Equal Space Cart and Buy Buttons (50% / 50%) */}
          <div className="grid grid-cols-2 gap-2 pt-0.5" onClick={(e) => e.stopPropagation()}>
            
            <button
              onClick={handleAdd}
              className={`py-2 px-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 border ${
                addedAnimation
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-[#3b0910] hover:bg-[#2b050a] text-white border-[#3b0910]'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </>
              )}
            </button>

            <button
              onClick={handleBuy}
              className="py-2 px-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <CreditCard className="w-4 h-4" /> Buy Now
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
