import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, Eye } from 'lucide-react';

export default function WishlistModal({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onAddToCart,
  onShopNow,
  onOpenCart,
  onOpenDetails
}) {
  if (!isOpen) return null;

  const handleMoveAllToCart = () => {
    wishlistItems.forEach(item => {
      onAddToCart(item, 1);
    });
    onClose();
    if (onOpenCart) {
      onOpenCart();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-[#3b0910] text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-rose-600/30 text-rose-300">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold">My Saved Wishlist</h2>
              <p className="text-[11px] text-amber-200">{wishlistItems.length} items saved</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {wishlistItems.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-800">Your wishlist is empty</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Explore our fresh organic henna cones and tap the heart icon to save your favorite products!
              </p>
              <button
                onClick={() => {
                  onClose();
                  onShopNow();
                }}
                className="mt-2 px-5 py-2.5 bg-[#3b0910] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#2b050a] transition"
              >
                Browse Products →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onClose();
                    if (onOpenDetails) onOpenDetails(item);
                  }}
                  className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3 group hover:border-[#3b0910] transition cursor-pointer relative"
                >
                  <div className="relative w-16 h-16 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-xl border border-gray-100"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center text-white">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-amber-800">{item.category}</p>
                    <h4 className="font-serif text-xs font-bold text-gray-900 truncate group-hover:text-[#3b0910] transition">
                      {item.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-extrabold text-[#3b0910]">₹{item.price}</span>
                      {item.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through">₹{item.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        onAddToCart(item, 1);
                      }}
                      className="p-2 bg-[#3b0910] text-white hover:bg-[#2b050a] rounded-lg text-xs font-bold shadow-xs flex items-center gap-1 transition"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onRemoveFromWishlist(item)}
                      className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlistItems.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-2">
            <button
              onClick={handleMoveAllToCart}
              className="w-full py-3 bg-[#3b0910] hover:bg-[#2b050a] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Move All to Shopping Cart
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-100 transition"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
