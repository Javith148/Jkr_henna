import React, { useState } from 'react';
import { Star, CheckCircle, Plus, X, Sparkles } from 'lucide-react';
import { createReview } from '../services/api';

export default function ReviewSection({ reviews = [], onAddReview, products = [], user, onOpenAccount }) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newCity, setNewCity] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newProduct, setNewProduct] = useState(products[0]?.name || 'JKR Signature Organic Henna Cone');

  // Dynamic Overall Average Rating Calculation
  const overallAvgRating = reviews && reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + Number(r.rating || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

  const handleAddReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment) return;

    const selectedProdName = newProduct || products[0]?.name || 'JKR Signature Organic Henna Cone';
    const matchedProduct = (products || []).find(p => p.name === selectedProdName);

    const todayFormatted = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const reviewObj = {
      name: user?.name || 'Verified Customer',
      city: newCity || 'Customer',
      rating: newRating,
      date: todayFormatted,
      productId: matchedProduct?.id,
      product_id: matchedProduct?.id,
      productName: selectedProdName,
      product_name: selectedProdName,
      comment: newComment,
      stainDarkness: 'Dark Mahogany Stain',
      verified: true,
      avatar: user?.avatar || user?.photo_url || user?.photoURL || ''
    };

    // Immediately close modal form and reset input states
    setShowReviewModal(false);
    setNewCity('');
    setNewComment('');

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

  const isRealAvatar = (url) => {
    if (!url || typeof url !== 'string') return false;
    const cleanUrl = url.toLowerCase();
    if (cleanUrl.includes('unsplash') || cleanUrl.includes('ui-avatars') || cleanUrl.includes('dummy') || cleanUrl.includes('placeholder')) {
      return false;
    }
    if (cleanUrl.includes('googleusercontent.com') || cleanUrl.includes('supabase.co') || cleanUrl.startsWith('data:image')) {
      return true;
    }
    return false;
  };

  const getFormattedReviewDate = (rev) => {
    if (rev.created_at) {
      try {
        const d = new Date(rev.created_at);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
        }
      } catch (e) {}
    }
    if (rev.date && !rev.date.includes('ago') && !rev.date.includes('now') && !rev.date.includes('Recently')) {
      return rev.date;
    }
    return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <section id="reviews" className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37] tracking-widest uppercase mb-1">
              <Sparkles className="w-4 h-4 text-[#d4af37]" /> Verified Customer Reviews
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#3b0910]">Loved by Thousands of Artists</h2>
          </div>

          {/* Rating Summary & Write Review Button */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-200">
              <span className="text-xl font-bold text-amber-900">{overallAvgRating}</span>
              <div>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 font-medium">{reviews.length} Verified Reviews</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (!user) {
                  if (onOpenAccount) onOpenAccount();
                  return;
                }
                setShowReviewModal(true);
              }}
              className="w-full md:w-auto px-6 py-3 bg-[#d4af37] text-[#3b0910] font-bold text-xs rounded-xl shadow hover:bg-[#e5c158] transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Write a Review
            </button>
          </div>
        </div>

        {/* Reviews Grid (Show first 6 reviews only) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((rev) => {
            const avatarUrl = rev.avatar || rev.image;
            const revDate = getFormattedReviewDate(rev);

            return (
              <div 
                key={rev.id || Math.random()}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isRealAvatar(avatarUrl) ? (
                        <img 
                          src={avatarUrl} 
                          alt={rev.name} 
                          className="w-10 h-10 rounded-full object-cover border border-[#d4af37]/40 shadow-2xs shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#3b0910] text-[#f3e5ab] font-bold text-sm flex items-center justify-center border border-[#d4af37]/40 shadow-2xs shrink-0 font-serif">
                          {(rev.name || 'C').trim().charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-serif font-bold text-gray-900 text-sm">{rev.name}</h3>
                        <p className="text-xs text-gray-500">{rev.city || 'Customer'} • {revDate}</p>
                      </div>
                    </div>
                  <div className="flex text-amber-500 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3.5 h-3.5 ${i < Number(rev.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 text-xs text-amber-900 font-semibold inline-block">
                  Bought: {rev.productName || rev.product_name || 'JKR Organic Henna Cone'}
                </div>

                <p className="text-gray-700 text-xs leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  Stain: {rev.stainDarkness || rev.stain_darkness || 'Deep Dark Stain'}
                </span>
                <span className="text-gray-400 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified Buyer
                </span>
              </div>
            </div>
          );
        })}
        </div>

        {/* Write Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-gray-200 relative space-y-4">
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif text-xl font-bold text-[#3b0910]">Write Your Review</h3>

              <form onSubmit={handleAddReviewSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Select Product *</label>
                  <select
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#d4af37] focus:outline-none"
                  >
                    {products && products.length > 0 ? (
                      products.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name}
                        </option>
                      ))
                    ) : (
                      <option value="JKR Signature Organic Henna Cone">JKR Signature Organic Henna Cone</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Chennai"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="p-1"
                      >
                        <Star className={`w-6 h-6 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Review Comment *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the stain quality, cone flow, and softness..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#3b0910] text-[#f3e5ab] font-bold text-xs rounded-xl shadow hover:bg-[#2b050a]"
                >
                  Post Review
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
