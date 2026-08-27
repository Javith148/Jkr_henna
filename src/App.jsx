import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import WhyChooseUs from './components/WhyChooseUs';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CustomOrderForm from './components/CustomOrderForm';
import HennaGallery from './components/HennaGallery';
import ReviewSection from './components/ReviewSection';
import InstagramGallery from './components/InstagramGallery';
import CustomerAccountModal from './components/CustomerAccountModal';
import WishlistModal from './components/WishlistModal';
import AdminPanel from './components/AdminPanel';
import OrderTracking from './components/OrderTracking';
import Footer from './components/Footer';

import {
  fetchProducts,
  fetchCategories,
  fetchGallery,
  fetchReviews,
  fetchOrders,
  fetchCustomOrders,
  fetchShopConfig,
  createOrder,
  createCustomOrder,
  createReview,
  saveUserCartWishlistData,
  getUserCartWishlistData,
  googleLoginUser
} from './services/api';

import { Search, ArrowUpDown, ArrowRight } from 'lucide-react';

export default function App() {
  // Navigation & View States with URL Path Sync
  const getInitialTab = () => {
    const path = window.location.pathname.toLowerCase().replace('/', '');
    const hash = window.location.hash.toLowerCase().replace('#', '');
    if (path === 'admin' || path === 'open' || hash === 'admin' || hash === 'open') {
      return 'admin';
    }
    if (['shop', 'custom-order', 'gallery', 'reviews', 'track-order'].includes(path)) {
      return path;
    }
    return 'home';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    const newPath = tab === 'home' ? '/' : `/${tab}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState({ tab }, '', newPath);
    }
  };

  // Sync with browser back/forward buttons & URL changes
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase().replace('/', '');
      if (path === 'admin' || path === 'open') {
        setActiveTabState('admin');
      } else if (['shop', 'custom-order', 'gallery', 'reviews', 'track-order'].includes(path)) {
        setActiveTabState(path);
      } else {
        setActiveTabState('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Store Datasets - Empty initial state (Loaded live from Supabase Database via API)
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [gallery, setGallery] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customOrders, setCustomOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [shopConfig, setShopConfig] = useState({});

  // Fetch initial data from Node.js Express API on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [prodsData, catsData, galData, revsData, ordsData, custOrdsData, configData] = await Promise.allSettled([
          fetchProducts(),
          fetchCategories(),
          fetchGallery(),
          fetchReviews(),
          fetchOrders(),
          fetchCustomOrders(),
          fetchShopConfig()
        ]);

        if (prodsData.status === 'fulfilled' && Array.isArray(prodsData.value)) {
          const normalizedProducts = prodsData.value.map(p => ({
            ...p,
            id: p.id,
            name: p.name || 'Organic Henna Cone',
            image: p.image || '/images/organic_cone.png',
            category: p.category || 'All',
            price: Number(p.price || 0),
            originalPrice: p.originalPrice ?? p.original_price ?? p.price,
            original_price: p.original_price ?? p.originalPrice ?? p.price,
            discount: p.discount || '',
            rating: Number(p.rating || 5.0),
            reviewsCount: p.reviewsCount ?? p.reviews_count ?? 0,
            reviews_count: p.reviews_count ?? p.reviewsCount ?? 0,
            stock: Number(p.stock ?? 30),
            isBestSeller: p.isBestSeller ?? p.is_best_seller ?? false,
            is_best_seller: p.is_best_seller ?? p.isBestSeller ?? false,
            isNew: p.isNew ?? p.is_new ?? false,
            is_new: p.is_new ?? p.isNew ?? false,
            tipSize: p.tipSize || p.tip_size || '0.38mm Fine',
            tip_size: p.tip_size || p.tipSize || '0.38mm Fine',
            stainDuration: p.stainDuration || p.stain_duration || '10 - 14 Days',
            stain_duration: p.stain_duration || p.stainDuration || '10 - 14 Days',
            weight: p.weight || '25g per cone',
            ingredients: p.ingredients || 'Organic Henna Powder, Eucalyptus Oil',
            description: p.description || ''
          }));
          setProducts(normalizedProducts);
        }
        if (catsData.status === 'fulfilled' && Array.isArray(catsData.value)) {
          const rawCats = catsData.value.map(c => typeof c === 'string' ? c : c.name || c);
          setCategories(rawCats.includes('All') ? rawCats : ['All', ...rawCats]);
        }
        if (galData.status === 'fulfilled' && Array.isArray(galData.value)) {
          setGallery(galData.value);
        }
        if (revsData.status === 'fulfilled' && Array.isArray(revsData.value)) {
          setReviews(revsData.value);
        }
        if (ordsData.status === 'fulfilled' && Array.isArray(ordsData.value)) {
          setOrders(ordsData.value);
        }
        if (custOrdsData.status === 'fulfilled' && Array.isArray(custOrdsData.value)) {
          setCustomOrders(custOrdsData.value);
        }
        if (configData.status === 'fulfilled' && configData.value) {
          setShopConfig(configData.value);
        }
      } catch (err) {
        console.warn('API backend sync warning:', err);
      }
    }

    loadBackendData();
  }, []);

  // User Authentication State (Persisted with 7-Day JWT Token in localStorage)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('jkr_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  // Track DB initial sync status for active user to avoid race conditions
  const [isSyncedWithDb, setIsSyncedWithDb] = useState(false);

  // Cart & Wishlist State (User-Scoped Persistence)
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  // Fetch & Sync Cart & Wishlist from Supabase Database when user logs in or changes
  useEffect(() => {
    if (!user?.email) {
      setCartItems([]);
      setWishlistItems([]);
      setIsSyncedWithDb(false);
      return;
    }

    let isMounted = true;

    async function syncDbCartWishlist() {
      try {
        setIsSyncedWithDb(false);
        const dbData = await getUserCartWishlistData(user.email);
        if (isMounted && dbData) {
          // ALWAYS set state, even if empty array [], so previous account items don't bleed through!
          setCartItems(Array.isArray(dbData.cart) ? dbData.cart : []);
          setWishlistItems(Array.isArray(dbData.wishlist) ? dbData.wishlist : []);
        }
      } catch (err) {
        console.warn('Could not sync user cart/wishlist from DB:', err);
      } finally {
        if (isMounted) setIsSyncedWithDb(true);
      }
    }

    syncDbCartWishlist();

    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  // Persist Cart & Wishlist to Supabase Database & localStorage ONLY AFTER initial sync
  useEffect(() => {
    if (!user?.email) {
      localStorage.setItem('jkr_cart_guest', JSON.stringify(cartItems));
      localStorage.setItem('jkr_wishlist_guest', JSON.stringify(wishlistItems));
      return;
    }

    const cartKey = `jkr_cart_${user.email.trim().toLowerCase()}`;
    const wishlistKey = `jkr_wishlist_${user.email.trim().toLowerCase()}`;

    localStorage.setItem(cartKey, JSON.stringify(cartItems));
    localStorage.setItem(wishlistKey, JSON.stringify(wishlistItems));

    if (isSyncedWithDb) {
      saveUserCartWishlistData(user.email, cartItems, wishlistItems);
    }
  }, [cartItems, wishlistItems, user?.email, isSyncedWithDb]);

  const handleLogin = async (loggedUser, token) => {
    // Clear state before switching user
    setCartItems([]);
    setWishlistItems([]);
    setIsSyncedWithDb(false);

    setUser(loggedUser);
    if (loggedUser) {
      localStorage.setItem('jkr_user', JSON.stringify(loggedUser));
    }
    if (token) {
      localStorage.setItem('jkr_token', token);
    }

    // Automatically sync logged-in / Google user to Database via API
    if (loggedUser && loggedUser.email) {
      try {
        const dbRes = await googleLoginUser({
          name: loggedUser.name || loggedUser.email.split('@')[0],
          email: loggedUser.email,
          avatar: loggedUser.avatar || loggedUser.photo_url || loggedUser.photoURL || ''
        });
        if (dbRes?.token && dbRes?.user) {
          localStorage.setItem('jkr_token', dbRes.token);
          localStorage.setItem('jkr_user', JSON.stringify(dbRes.user));
          setUser(dbRes.user);
        }
      } catch (err) {
        console.warn('Backend DB sync notice on login:', err);
      }
    }
  };

  const handleLogout = () => {
    // Completely reset cart & wishlist state on logout
    setCartItems([]);
    setWishlistItems([]);
    setIsSyncedWithDb(false);
    setUser(null);
    localStorage.removeItem('jkr_user');
    localStorage.removeItem('jkr_token');
  };

  // Modals & Drawers
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Search & Filters State for Shop Page
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(2500);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  // Cart Handlers (With Login Check Guard)
  const handleAddToCart = (product, qty = 1) => {
    if (!user) {
      setIsAccountOpen(true);
      return;
    }
    setCartItems((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, { ...product, qty }];
    });
  };

  const handleBuyNow = (product, qty = 1) => {
    if (!user) {
      setIsAccountOpen(true);
      return;
    }
    handleAddToCart(product, qty);
    setIsCartOpen(true);
  };

  const handleUpdateQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
    } else {
      setCartItems(prev => prev.map(item => item.id === id ? { ...item, qty: newQty } : item));
    }
  };

  const handleRemoveFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist Handler (With Login Check Guard)
  const handleToggleWishlist = (product) => {
    if (!user) {
      setIsAccountOpen(true);
      return;
    }
    setWishlistItems((prev) => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  // Order Placement
  const handleOrderPlaced = async (newOrder) => {
    setOrders([newOrder, ...orders]);
    try {
      await createOrder(newOrder);
    } catch (err) {
      console.warn('Backend sync order notice:', err);
    }
  };

  // Custom Order Submission
  const handleSubmitCustomOrder = async (customReq) => {
    setCustomOrders([customReq, ...customOrders]);
    try {
      await createCustomOrder(customReq);
    } catch (err) {
      console.warn('Backend sync custom order notice:', err);
    }
  };

  // Add New Review Handler
  const handleAddReview = async (reviewObj) => {
    try {
      const res = await createReview(reviewObj);
      const newRev = res || { id: Date.now(), ...reviewObj };
      setReviews(prev => [newRev, ...prev]);
    } catch (err) {
      console.warn('Backend sync review notice:', err);
      setReviews(prev => [{ id: Date.now(), ...reviewObj }, ...prev]);
    }
  };

  // Filtered & Sorted Products Calculation
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesPrice = prod.price <= maxPrice;
    const matchesRating = prod.rating >= minRating;
    const matchesStock = !inStockOnly || prod.stock > 0;

    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'low-high') return a.price - b.price;
    if (sortBy === 'high-low') return b.price - a.price;
    return b.rating - a.rating;
  });

  // If active tab is 'admin', render Admin Panel full screen
  if (activeTab === 'admin') {
    return (
      <AdminPanel
        products={products}
        setProducts={setProducts}
        orders={orders}
        setOrders={setOrders}
        customOrders={customOrders}
        setCustomOrders={setCustomOrders}
        categories={categories}
        setCategories={setCategories}
        reviews={reviews}
        setReviews={setReviews}
        gallery={gallery}
        setGallery={setGallery}
        shopConfig={shopConfig}
        setShopConfig={setShopConfig}
        onCloseAdmin={() => setActiveTab('home')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#faf9f6] text-gray-900 selection:bg-[#3b0910] selection:text-white font-sans">

      {/* Global Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItems.reduce((sum, item) => sum + item.qty, 0)}
        wishlistCount={wishlistItems.length}
        onOpenCart={() => {
          if (!user) setIsAccountOpen(true);
          else setIsCartOpen(true);
        }}
        onOpenWishlist={() => {
          if (!user) setIsAccountOpen(true);
          else setIsWishlistOpen(true);
        }}
        onOpenAccount={() => setIsAccountOpen(true)}
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Page View Routing */}
      <main className="flex-1">

        {/* 1. HOME PAGE */}
        {activeTab === 'home' && (
          <div>
            <HeroBanner
              onShopNowClick={() => setActiveTab('shop')}
              onCustomOrderClick={() => setActiveTab('custom-order')}
              reviews={reviews}
            />

            <WhyChooseUs />

            {/* Featured Best Sellers Section */}
            <section className="py-16 bg-[#faf9f6]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3.5 py-1 rounded-full border border-amber-300 inline-block">
                    Customer Favorites
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3b0910]">
                    Best-Selling Cones & Kits
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.slice(0, 4).map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onAddToCart={handleAddToCart}
                      onBuyNow={handleBuyNow}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={wishlistItems.some(w => w.id === prod.id)}
                      onOpenDetails={setSelectedProductDetails}
                      reviews={reviews}
                    />
                  ))}
                </div>

                {/* Prominent Centered View All Products CTA (Issue 15 Fix) */}
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setActiveTab('shop')}
                    className="px-8 py-3.5 bg-white hover:bg-gray-100 text-[#3b0910] font-bold text-xs sm:text-sm rounded-xl border border-[#3b0910]/20 shadow-xs transition inline-flex items-center justify-center gap-2"
                  >
                    <span>Browse All {products.length} Products</span>
                    <ArrowRight className="w-4 h-4 text-[#3b0910]" />
                  </button>
                </div>

              </div>
            </section>

            {/* Organic Henna Highlight Banner */}
            <section className="py-12 bg-[#3b0910] text-white relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="space-y-2 max-w-xl">
                  <span className="text-amber-200 text-xs font-bold uppercase tracking-widest">Handcrafted Fresh Weekly</span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">Bridal Henna Cones with Micro Pin Tips</h2>
                  <p className="text-gray-200 text-xs sm:text-sm">
                    Pin-point 0.32mm precision tips designed for bridal intricate peacocks, vines, and mandalas without clogging.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('custom-order')}
                  className="px-8 py-3.5 bg-white hover:bg-gray-100 text-[#3b0910] font-bold text-xs sm:text-sm rounded-xl shadow-md shrink-0"
                >
                  Custom Order for Bridal Event
                </button>
              </div>
            </section>

            <InstagramGallery gallery={gallery} shopConfig={shopConfig} />

            <ReviewSection 
              reviews={reviews} 
              onAddReview={handleAddReview} 
              products={products} 
              user={user} 
              onOpenAccount={() => setIsAccountOpen(true)} 
            />
          </div>
        )}

        {/* 2. SHOP / PRODUCTS PAGE */}
        {activeTab === 'shop' && (
          <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3b0910]">
                Shop Henna Cones & Accessories
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm">
                Choose from our range of 100% chemical-free organic cones, bridal packs, powders, and stencils.
              </p>
            </div>

            {/* Category Tab Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={typeof cat === 'string' ? cat : cat.name}
                  onClick={() => setSelectedCategory(typeof cat === 'string' ? cat : cat.name)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${selectedCategory === (typeof cat === 'string' ? cat : cat.name)
                      ? 'bg-[#3b0910] text-white shadow'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                  {typeof cat === 'string' ? cat : cat.name}
                </button>
              ))}
            </div>

            {/* Search & Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col lg:flex-row items-center justify-between gap-4">

              {/* Search Bar */}
              <div className="relative w-full lg:w-80">
                <input
                  type="text"
                  placeholder="Search product name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded-xl focus:border-[#3b0910] focus:outline-none"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>

              {/* Price Filter & Controls */}
              <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto text-xs">

                {/* Price Slider */}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700">Max Price:</span>
                  <input
                    type="range"
                    min="100"
                    max="2500"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="accent-[#3b0910] w-24"
                  />
                  <span className="font-extrabold text-[#3b0910]">₹{maxPrice}</span>
                </div>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 bg-gray-50 border border-gray-300 rounded-xl font-semibold text-gray-800 focus:outline-none"
                  >
                    <option value="popular">Sort: Most Popular</option>
                    <option value="low-high">Price: Low → High</option>
                    <option value="high-low">Price: High → Low</option>
                  </select>
                </div>

                {/* Stock filter */}
                <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-[#3b0910]"
                  />
                  <span>In Stock Only</span>
                </label>

              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center border border-gray-200 space-y-3">
                <p className="text-gray-500 font-semibold text-sm">No products found matching your filters.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setMaxPrice(2500);
                  }}
                  className="px-4 py-2 bg-[#3b0910] text-white text-xs font-bold rounded-xl"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onToggleWishlist={handleToggleWishlist}
                    isWishlisted={wishlistItems.some(w => w.id === prod.id)}
                    onOpenDetails={setSelectedProductDetails}
                    reviews={reviews}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* CUSTOM / BULK ORDER PAGE */}
        {activeTab === 'custom-order' && (
          <CustomOrderForm onSubmitCustomOrder={handleSubmitCustomOrder} />
        )}

        {/* HENNA GALLERY PAGE */}
        {activeTab === 'gallery' && (
          <HennaGallery galleryItems={gallery} user={user} onOpenAccount={() => setIsAccountOpen(true)} />
        )}

        {/* REVIEWS PAGE */}
        {activeTab === 'reviews' && (
          <ReviewSection reviews={reviews} onAddReview={handleAddReview} products={products} user={user} onOpenAccount={() => setIsAccountOpen(true)} />
        )}

        {/* ORDER TRACKING PAGE */}
        {activeTab === 'track-order' && (
          <OrderTracking orders={orders} />
        )}

      </main>

      {/* Global Modals & Drawers */}
      <ProductDetailModal
        product={selectedProductDetails}
        onClose={() => setSelectedProductDetails(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={selectedProductDetails ? wishlistItems.some(w => w.id === selectedProductDetails.id) : false}
        shopConfig={shopConfig}
        reviews={reviews}
        onAddReview={handleAddReview}
        user={user}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onOrderPlaced={handleOrderPlaced}
        shopConfig={shopConfig}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onShopNow={() => setActiveTab('shop')}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenDetails={setSelectedProductDetails}
      />

      <CustomerAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        orders={orders}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onTrackOrder={(id) => {
          setActiveTab('track-order');
        }}
      />

      {/* Global Footer */}
      <Footer
        shopConfig={shopConfig}
        setActiveTab={setActiveTab}
        categories={categories}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveTab('shop');
        }}
      />

    </div>
  );
}
