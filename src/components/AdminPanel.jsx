import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Users, 
  CreditCard, 
  Tag, 
  Star, 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  TrendingUp, 
  DollarSign, 
  Truck, 
  CheckCircle2, 
  X,
  Upload,
  Sparkles,
  Link as LinkIcon,
  Search,
  ArrowLeft,
  ShieldCheck,
  Zap,
  CheckCircle,
  Clock,
  Layers,
  Percent
} from 'lucide-react';
import { 
  uploadImage, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  createCategory, 
  deleteCategory, 
  createGalleryItem, 
  deleteGalleryItem, 
  deleteReview, 
  updateOrderStatus, 
  deleteOrder, 
  updateShopConfig 
} from '../services/api';

export default function AdminPanel({ 
  products, 
  setProducts, 
  orders, 
  setOrders, 
  customOrders, 
  setCustomOrders,
  categories, 
  setCategories,
  reviews, 
  setReviews,
  gallery,
  setGallery,
  shopConfig,
  setShopConfig,
  onCloseAdmin 
}) {
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard'); // dashboard, products, categories, orders, custom-orders, reviews, gallery, settings

  // -------------------------------------------------------------
  // PRODUCT MODAL & CRUD STATE
  // -------------------------------------------------------------
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [prodName, setProdName] = useState('');
  const [prodCat, setProdCat] = useState('Henna Cones');
  const [prodPrice, setProdPrice] = useState(199);
  const [prodOrigPrice, setProdOrigPrice] = useState(299);
  const [prodStock, setProdStock] = useState(30);
  const [prodImg, setProdImg] = useState('/images/organic_cone.png');
  const [prodDesc, setProdDesc] = useState('');
  const [prodTipSize, setProdTipSize] = useState('0.38mm Ultra Fine');
  const [prodStainDuration, setProdStainDuration] = useState('10 - 14 Days');
  const [prodWeight, setProdWeight] = useState('25g per cone');
  const [uploadingProdImg, setUploadingProdImg] = useState(false);
  const [prodSearch, setProdSearch] = useState('');

  // -------------------------------------------------------------
  // GALLERY MODAL STATE
  // -------------------------------------------------------------
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galTitle, setGalTitle] = useState('');
  const [galCat, setGalCat] = useState('Bridal');
  const [galImg, setGalImg] = useState('/images/henna_gallery.png');
  const [galArtist, setGalArtist] = useState('JKR Master Artist');
  const [uploadingGalImg, setUploadingGalImg] = useState(false);

  // -------------------------------------------------------------
  // CATEGORY STATE
  // -------------------------------------------------------------
  const [newCatName, setNewCatName] = useState('');



  // -------------------------------------------------------------
  // SHOP CONFIG STATE
  // -------------------------------------------------------------
  const [configData, setConfigData] = useState(shopConfig || {
    name: 'JKR Henna & Cone Shop',
    tagline: '100% Pure Chemical-Free Organic Henna Cones',
    whatsappNumber: '+919876543210',
    freeDeliveryThreshold: 500,
    deliveryCharge: 50,
    address: 'JKR Henna Hub, Main Bazaar Road, Tamil Nadu, India'
  });

  // Handle Product Image Upload to Supabase Storage
  const handleProductImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingProdImg(true);
    try {
      const res = await uploadImage(file);
      const url = typeof res === 'string' ? res : (res?.imageUrl || res);
      if (url) {
        setProdImg(url);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Image upload failed: ' + err.message);
    } finally {
      setUploadingProdImg(false);
    }
  };

  // Handle Gallery Image Upload to Supabase Storage
  const handleGalleryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingGalImg(true);
    try {
      const res = await uploadImage(file);
      const url = typeof res === 'string' ? res : (res?.imageUrl || res);
      if (url) {
        setGalImg(url);
      }
    } catch (err) {
      console.error('Gallery image upload failed:', err);
      alert('Gallery image upload failed: ' + err.message);
    } finally {
      setUploadingGalImg(false);
    }
  };

  // Save Product (Add / Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!prodName) return;

    const prodObj = {
      name: prodName,
      category: prodCat,
      price: Number(prodPrice),
      originalPrice: Number(prodOrigPrice || prodPrice),
      discount: prodOrigPrice > prodPrice ? `${Math.round(((prodOrigPrice - prodPrice) / prodOrigPrice) * 100)}% OFF` : '10% OFF',
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 0,
      stock: Number(prodStock),
      isBestSeller: editingProduct ? editingProduct.isBestSeller : false,
      isNew: editingProduct ? editingProduct.isNew : true,
      image: prodImg,
      description: prodDesc || '100% Pure Organic Henna',
      tipSize: prodTipSize || '0.38mm Ultra Fine',
      weight: prodWeight || '25g per cone',
      stainDuration: prodStainDuration || '10 - 14 Days',
      ingredients: editingProduct?.ingredients || 'Organic Henna Powder, Eucalyptus Oil'
    };

    if (editingProduct) {
      try {
        const res = await updateProduct(editingProduct.id, prodObj);
        const updated = res || { ...editingProduct, ...prodObj };
        setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
      } catch (err) {
        console.error('Failed to update product:', err);
      }
    } else {
      try {
        const res = await createProduct(prodObj);
        const newProd = res || { id: Date.now(), ...prodObj };
        setProducts([newProd, ...products]);
      } catch (err) {
        console.error('Failed to create product:', err);
      }
    }

    setShowProductModal(false);
    resetProductForm();
  };

  const handleEditProductClick = (prod) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdCat(prod.category);
    setProdPrice(prod.price);
    setProdOrigPrice(prod.originalPrice || prod.price);
    setProdStock(prod.stock);
    setProdImg(prod.image);
    setProdDesc(prod.description || '');
    setProdTipSize(prod.tipSize || prod.tip_size || '0.38mm Ultra Fine');
    setProdStainDuration(prod.stainDuration || prod.stain_duration || '10 - 14 Days');
    setProdWeight(prod.weight || '25g per cone');
    setShowProductModal(true);
  };

  const handleDeleteProductClick = async (id) => {
    if (window.confirm('Delete this product permanently?')) {
      setProducts(products.filter(p => p.id !== id));
      try { await deleteProduct(id); } catch (err) {}
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCat(categories[0] || 'Henna Cones');
    setProdPrice(199);
    setProdOrigPrice(299);
    setProdStock(30);
    setProdImg('/images/organic_cone.png');
    setProdDesc('');
    setProdTipSize('0.38mm Ultra Fine');
    setProdStainDuration('10 - 14 Days');
    setProdWeight('25g per cone');
  };

  // Save Category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName || categories.includes(newCatName)) return;
    setCategories([...categories, newCatName]);
    try { await createCategory(newCatName); } catch (err) {}
    setNewCatName('');
  };

  const handleDeleteCategory = async (catName) => {
    if (categories.length <= 1) return alert('At least 1 category required.');
    setCategories(categories.filter(c => c !== catName));
    try { await deleteCategory(catName); } catch (err) {}
  };

  // Save Gallery Item
  const handleSaveGallery = async (e) => {
    e.preventDefault();
    if (!galTitle) return;
    const galObj = {
      title: galTitle,
      category: galCat,
      image: galImg,
      artist: galArtist,
      likes: 12
    };

    const newGal = { id: Date.now(), ...galObj };
    setGallery([newGal, ...gallery]);
    try { await createGalleryItem(galObj); } catch (err) {}
    setShowGalleryModal(false);
    setGalTitle('');
  };

  const handleDeleteGallery = async (id) => {
    if (window.confirm('Delete this gallery item?')) {
      setGallery(gallery.filter(g => g.id !== id));
      try { await deleteGalleryItem(id); } catch (err) {}
    }
  };



  // Order Status Change
  const handleOrderStatusChange = async (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    try { await updateOrderStatus(orderId, newStatus); } catch (err) {}
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Delete this order record?')) {
      setOrders(orders.filter(o => o.id !== orderId));
      try { await deleteOrder(orderId); } catch (err) {}
    }
  };

  // Save Shop Config
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setShopConfig(configData);
    try { await updateShopConfig(configData); } catch (err) {}
    alert('Store Settings saved successfully!');
  };

  // Stats calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const filteredProds = products.filter(p => p.name.toLowerCase().includes(prodSearch.toLowerCase()) || p.category.toLowerCase().includes(prodSearch.toLowerCase()));

  const navTabs = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
    { id: 'products', label: 'Products', icon: Package, count: products.length },
    { id: 'categories', label: 'Categories', icon: Layers, count: categories.length },
    { id: 'gallery', label: 'Design Gallery', icon: ImageIcon, count: gallery.length },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, count: orders.length },
    { id: 'custom-orders', label: 'Custom Enquiries', icon: FileText, count: customOrders.length },
    { id: 'reviews', label: 'Reviews', icon: Star, count: reviews.length },
    { id: 'settings', label: 'Store Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">

      {/* Modern Sleek Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo & Tag */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md font-bold text-white text-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-2">
                  JKR Admin Panel
                  <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    API Sync Active
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400">Node.js Express & Supabase Control Hub</p>
              </div>
            </div>

            {/* Back to Website Button */}
            <button
              onClick={onCloseAdmin}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </button>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col lg:flex-row gap-8">

        {/* Clean Sidebar / Top Navigation Bar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-1 sticky top-24">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Management Menu
            </div>
            
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeAdminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveAdminTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="flex-1 min-w-0">

          {/* 1. OVERVIEW DASHBOARD */}
          {activeAdminTab === 'dashboard' && (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Dashboard Overview</h2>
                  <p className="text-xs text-slate-500">Live store metrics and real-time business performance</p>
                </div>
                <button
                  onClick={() => {
                    resetProductForm();
                    setShowProductModal(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Total Revenue</span>
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString()}</div>
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +14.2% from last week
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Active Products</span>
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Package className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{products.length}</div>
                  <p className="text-[11px] text-slate-500">Across {categories.length} store categories</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Customer Orders</span>
                    <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{orders.length}</div>
                  <p className="text-[11px] text-amber-600 font-semibold">
                    {orders.filter(o => o.status === 'Placed' || o.status === 'Confirmed').length} Pending Fulfillment
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Custom Enquiries</span>
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{customOrders.length}</div>
                  <p className="text-[11px] text-slate-500">Bridal & Bulk Orders</p>
                </div>

              </div>

              {/* Recent Orders Preview */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveAdminTab('orders')}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3 font-mono font-bold text-slate-900">{ord.id}</td>
                          <td className="py-3 font-semibold text-slate-700">{ord.customerName}</td>
                          <td className="py-3 font-extrabold text-slate-900">₹{ord.totalAmount}</td>
                          <td className="py-3">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => setActiveAdminTab('orders')}
                              className="text-indigo-600 hover:text-indigo-800 font-bold"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* 2. PRODUCTS MANAGEMENT */}
          {activeAdminTab === 'products' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Products Catalog ({products.length})</h2>
                  <p className="text-xs text-slate-500">Manage cones, powders, sets, and pricing with Supabase Storage</p>
                </div>
                
                <button
                  onClick={() => {
                    resetProductForm();
                    setShowProductModal(true);
                  }}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" /> Add New Product
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={prodSearch}
                  onChange={(e) => setProdSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                        <th className="p-4">Product Details</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProds.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div>
                              <h4 className="font-bold text-slate-900 text-xs">{prod.name}</h4>
                              <span className="text-[10px] text-slate-400 font-mono">ID: #{prod.id}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold border border-slate-200">
                              {prod.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-extrabold text-slate-900">₹{prod.price}</span>
                            {prod.originalPrice > prod.price && (
                              <span className="text-[10px] text-slate-400 line-through ml-1.5">₹{prod.originalPrice}</span>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              prod.stock > 10
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {prod.stock} in stock
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditProductClick(prod)}
                                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProductClick(prod.id)}
                                className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* 3. CATEGORIES MANAGEMENT */}
          {activeAdminTab === 'categories' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Store Categories ({categories.length})</h2>
                <p className="text-xs text-slate-500">Organize henna cones, powders, stencils, and combos</p>
              </div>

              <form onSubmit={handleAddCategory} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex gap-2 max-w-md">
                <input
                  type="text"
                  required
                  placeholder="Enter new category name..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-indigo-700 transition"
                >
                  Add Category
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <div key={cat} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">{cat}</span>
                    {cat !== 'All' && (
                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. DESIGN GALLERY MANAGEMENT */}
          {activeAdminTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Henna Design Gallery ({gallery.length})</h2>
                  <p className="text-xs text-slate-500">Upload portfolio photos to Supabase Storage</p>
                </div>

                <button
                  onClick={() => setShowGalleryModal(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition"
                >
                  <Plus className="w-4 h-4" /> Upload Photo
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs space-y-3 group">
                    <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <span className="absolute top-3 left-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-4 pt-0 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                        <p className="text-[11px] text-slate-400">By {item.artist}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteGallery(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. ORDERS MANAGEMENT */}
          {activeAdminTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Customer Orders ({orders.length})</h2>
                <p className="text-xs text-slate-500">Update order fulfillment & dispatch statuses</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                        <th className="p-4">Order ID & Date</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Fulfillment Status</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-4 font-mono font-bold text-slate-900">
                            {ord.id}
                            <span className="block text-[10px] font-sans font-medium text-slate-400">{ord.date}</span>
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-slate-900 block">{ord.customerName}</span>
                            <span className="text-[11px] text-slate-500">{ord.phone}</span>
                          </td>
                          <td className="p-4 font-extrabold text-slate-900">₹{ord.totalAmount}</td>
                          <td className="p-4">
                            <select
                              value={ord.status}
                              onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-indigo-600"
                            >
                              <option value="Placed">Placed</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Packed">Packed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteOrder(ord.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. CUSTOM ORDERS ENQUIRIES */}
          {activeAdminTab === 'custom-orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Custom & Bulk Orders ({customOrders.length})</h2>
                <p className="text-xs text-slate-500">Bridal quotes and wholesale requests</p>
              </div>

              {customOrders.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-2">
                  <p className="text-slate-500 font-medium text-xs">No bulk order enquiries submitted yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {customOrders.map((req) => (
                    <div key={req.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">ID: {req.id}</span>
                          <h4 className="font-bold text-sm text-slate-900">{req.name} ({req.phone})</h4>
                        </div>
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold">
                          {req.quantity} Cones Requested
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl text-xs">
                        <div><span className="text-slate-400 block text-[10px]">Role</span><strong>{req.userRole}</strong></div>
                        <div><span className="text-slate-400 block text-[10px]">Cone Type</span><strong>{req.coneType || req.hennaType || 'Henna Cone'}</strong></div>
                        <div><span className="text-slate-400 block text-[10px]">Event Date</span><strong>{req.eventDate}</strong></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}



          {/* 8. REVIEWS MODERATION */}
          {activeAdminTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Customer Reviews ({reviews.length})</h2>
                <p className="text-xs text-slate-500">Moderate product testimonials & ratings</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-900">{rev.name} ({rev.city})</h4>
                        <span className="text-amber-500 text-xs font-bold">★ {rev.rating}/5</span>
                      </div>
                      <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-[10px] text-slate-400">Product: {rev.productName}</span>
                      <button
                        onClick={async () => {
                          setReviews(reviews.filter(r => r.id !== rev.id));
                          try { await deleteReview(rev.id); } catch (err) {}
                        }}
                        className="text-rose-600 text-[10px] font-bold hover:underline"
                      >
                        Delete Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. STORE SETTINGS */}
          {activeAdminTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Store Settings</h2>
                <p className="text-xs text-slate-500">Configure business info, WhatsApp order line & delivery rules</p>
              </div>

              <form onSubmit={handleSaveConfig} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Store Name</label>
                  <input
                    type="text"
                    value={configData.name}
                    onChange={(e) => setConfigData({ ...configData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Order Phone</label>
                  <input
                    type="text"
                    value={configData.whatsappNumber}
                    onChange={(e) => setConfigData({ ...configData, whatsappNumber: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Free Delivery Min Amount (₹)</label>
                    <input
                      type="number"
                      value={configData.freeDeliveryThreshold}
                      onChange={(e) => setConfigData({ ...configData, freeDeliveryThreshold: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Standard Delivery Fee (₹)</label>
                    <input
                      type="number"
                      value={configData.deliveryCharge}
                      onChange={(e) => setConfigData({ ...configData, deliveryCharge: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Shop Address</label>
                  <textarea
                    rows={3}
                    value={configData.address}
                    onChange={(e) => setConfigData({ ...configData, address: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  Save Store Settings
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-slate-200 relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-slate-900">
              {editingProduct ? 'Edit Product Details' : 'Add New Product'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              {/* Image Upload Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Product Image (Supabase Storage)</label>
                <div className="flex items-center gap-3">
                  <img src={prodImg} alt="Preview" className="w-14 h-14 rounded-xl object-cover border border-slate-200" />
                  <label className="flex-1 py-2 px-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl cursor-pointer text-xs font-bold text-slate-700 flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span>{uploadingProdImg ? 'Uploading...' : 'Choose File to Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleProductImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JKR Royal Henna Cone"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={prodCat}
                    onChange={(e) => setProdCat(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sale Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={prodOrigPrice}
                    onChange={(e) => setProdOrigPrice(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe flow, cone tip size, ingredients..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Quick View Specifications (Stain Life, Weight) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">Stain Life</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 - 14 Days"
                    value={prodStainDuration}
                    onChange={(e) => setProdStainDuration(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">Weight</label>
                  <input
                    type="text"
                    placeholder="e.g. 25g per cone"
                    value={prodWeight}
                    onChange={(e) => setProdWeight(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                {editingProduct ? 'Update Product' : 'Save New Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 relative space-y-4">
            <button onClick={() => setShowGalleryModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg text-slate-900">Upload Gallery Image</h3>

            <form onSubmit={handleSaveGallery} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Image File</label>
                <div className="flex items-center gap-3">
                  <img src={galImg} alt="Preview" className="w-14 h-14 rounded-xl object-cover border border-slate-200" />
                  <label className="flex-1 py-2 px-3 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl cursor-pointer text-xs font-bold text-slate-700 flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span>{uploadingGalImg ? 'Uploading...' : 'Choose File'}</span>
                    <input type="file" accept="image/*" onChange={handleGalleryImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bridal Palm Vine"
                  value={galTitle}
                  onChange={(e) => setGalTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Artist Name</label>
                <input
                  type="text"
                  value={galArtist}
                  onChange={(e) => setGalArtist(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Save Photo
              </button>
            </form>
          </div>
        </div>
      )}



    </div>
  );
}
