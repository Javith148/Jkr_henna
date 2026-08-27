import React, { useState } from 'react';
import { Sparkles, Heart, X, Share2, ZoomIn } from 'lucide-react';

export default function HennaGallery({ galleryItems, user, onOpenAccount }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [likesMap, setLikesMap] = useState({});

  const items = galleryItems || [];

  const categories = [
    'All',
    ...Array.from(new Set(items.map(item => item.category).filter(Boolean)))
  ];

  const filteredGallery = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.category === activeCategory);

  const toggleLike = (id, e) => {
    e.stopPropagation();
    if (!user) {
      if (onOpenAccount) onOpenAccount();
      return;
    }
    setLikesMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            Inspiration & Works Showcase
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#3b0910]">
            Henna Design Gallery
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Explore authentic mehendi designs created using JKR Organic Henna Cones. Click any photo for full-screen view.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs ${
                activeCategory === cat
                  ? 'bg-[#3b0910] text-white shadow'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGallery.map((item) => {
            const isLiked = likesMap[item.id];
            const currentLikes = item.likes + (isLiked ? 1 : 0);

            return (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xs hover:shadow-lg transition duration-300 transform hover:-translate-y-1 cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white/95 text-[#3b0910] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow">
                      <ZoomIn className="w-4 h-4 text-amber-600" /> Full Screen
                    </span>
                  </div>

                  <span className="absolute top-3 left-3 bg-[#3b0910]/85 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs border border-white/20">
                    {item.category}
                  </span>

                  <button
                    onClick={(e) => toggleLike(item.id, e)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
                      isLiked ? 'bg-rose-600 text-white' : 'bg-black/40 text-white hover:bg-black/70'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                  </button>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-gray-900 text-sm">{item.title}</h3>
                    <p className="text-[11px] text-gray-500">By {item.artist}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-full">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span>{currentLikes}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full-Screen Lightbox Modal - Top Space Removed & Save Button Removed */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <div 
              className="relative max-w-3xl w-full bg-[#3b0910] text-white rounded-3xl overflow-hidden border border-amber-300/30 shadow-2xl flex flex-col md:flex-row my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 z-20 p-2 bg-black/70 hover:bg-black text-white rounded-full transition shadow"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Container - Zero top margin gap */}
              <div className="md:w-3/5 aspect-[4/5] md:aspect-auto bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain max-h-[85vh]"
                />
              </div>

              {/* Side Info Container */}
              <div className="md:w-2/5 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3 pt-2">
                  <span className="inline-block bg-amber-500/20 text-[#f3e5ab] text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30">
                    {selectedImage.category} Design
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-white">{selectedImage.title}</h2>
                  <p className="text-xs text-gray-300">Created by <strong>{selectedImage.artist}</strong> using JKR Organic Cones.</p>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-300">
                    <span>Community Appreciation</span>
                    <span className="text-amber-400 font-bold">♥ {selectedImage.likes} Likes</span>
                  </div>

                  {/* Single Share Button (Save Button removed as requested) */}
                  <button
                    onClick={() => alert('Link copied to clipboard!')}
                    className="w-full py-3 bg-[#d4af37] hover:bg-[#c39e26] text-[#3b0910] font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
                  >
                    <Share2 className="w-4 h-4" /> Share Design
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
