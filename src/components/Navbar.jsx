import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  user,
  searchQuery,
  setSearchQuery
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop Cones' },
    { id: 'custom-order', label: 'Bulk Orders' },
    { id: 'gallery', label: 'Gallery' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white text-gray-800 border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

          {/* 1. LEFT: Logo Image & Brand Title */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group py-1 select-none shrink-0"
          >
            <img
              src="/logo.jpg"
              alt="JKR Henna Logo"
              className="w-10 h-10 sm:w-11 sm:h-11 object-cover rounded-full shadow-xs"
              onError={(e) => {
                e.target.src = '/images/logo.jpg';
              }}
            />
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-wide text-[#3b0910]">
                JKR HENNA
              </span>
              <span className="text-xs text-gray-500 font-sans font-medium">
                Organic Henna Cones
              </span>
            </div>
          </div>

          {/* 2. CENTER: Navigation Menus */}
          <nav className="hidden md:flex items-center justify-center flex-1 space-x-1 lg:space-x-6">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`px-3 py-2 text-xs font-semibold transition duration-150 relative ${isActive
                    ? 'text-[#3b0910] font-bold border-b-2 border-[#3b0910]'
                    : 'text-gray-600 hover:text-[#3b0910]'
                    }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* 3. RIGHT: Search, Admin Panel, Wishlist, Account & Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">

            {/* Desktop Search Input */}
            <div className="hidden lg:flex items-center relative w-40 xl:w-52">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'shop') setActiveTab('shop');
                }}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-100 border border-gray-300 rounded-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#3b0910] focus:bg-white transition"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-gray-600 hover:text-[#3b0910] hover:bg-gray-100 rounded-full transition"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Account Icon */}
            <button
              onClick={onOpenAccount}
              className="p-1 text-gray-600 hover:text-[#3b0910] hover:bg-gray-100 rounded-full transition flex items-center justify-center"
              title={user ? `${user.name} Account` : "Sign In / Register"}
            >
              {user ? (
                (user.avatar || user.photo_url || user.photoURL) ? (
                  <img 
                    src={user.avatar || user.photo_url || user.photoURL} 
                    alt={user.name} 
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#d4af37] shadow-xs" 
                    referrerPolicy="no-referrer"
                    onError={(e) => { 
                      e.currentTarget.onerror = null; 
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=3b0910&color=f3e5ab`; 
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#3b0910] text-[#f3e5ab] font-bold text-xs flex items-center justify-center font-serif border-2 border-[#d4af37] shadow-xs">
                    {(user.name || 'U').trim().charAt(0).toUpperCase()}
                  </div>
                )
              ) : (
                <div className="p-1.5 hover:bg-gray-100 rounded-full transition">
                  <User className="w-5 h-5 text-gray-700" />
                </div>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 bg-[#3b0910] text-white hover:bg-[#2b050a] rounded-full font-bold shadow-xs transition flex items-center gap-1.5 px-3.5"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold">{cartCount}</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pt-3 pb-6 space-y-3">

          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'shop') setActiveTab('shop');
              }}
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-100 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <div className="grid grid-cols-1 gap-1 pt-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${isActive
                    ? 'bg-[#3b0910] text-white font-bold'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {link.label}
                </button>
              );
            })}

            <div className="pt-2 border-t border-gray-200 space-y-1">
              <button
                onClick={() => {
                  onOpenAccount();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 text-gray-700 flex items-center gap-2 text-xs hover:bg-gray-100 rounded-lg font-medium"
              >
                {user ? (
                  user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full object-cover border border-[#d4af37]" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#3b0910] text-[#f3e5ab] font-bold text-[10px] flex items-center justify-center font-serif border border-[#d4af37]">
                      {(user.name || 'U').trim().charAt(0).toUpperCase()}
                    </div>
                  )
                ) : (
                  <User className="w-4 h-4" />
                )}
                <span>{user ? user.name : 'My Account & Orders'}</span>
              </button>
            </div>
          </div>

        </div>
      )}

    </header>
  );
}
