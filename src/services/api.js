const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Upload image file to Node.js backend -> Supabase Storage
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) throw new Error('Failed to upload image');
  const data = await res.json();
  return { imageUrl: data.imageUrl || data };
}

/**
 * Products API
 */
export async function fetchProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function createProduct(productData) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

export async function updateProduct(id, productData) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete product');
  return res.json();
}

/**
 * Categories API
 */
export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function createCategory(name) {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}

export async function deleteCategory(name) {
  const res = await fetch(`${API_BASE_URL}/categories/${encodeURIComponent(name)}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete category');
  return res.json();
}

/**
 * Gallery API
 */
export async function fetchGallery() {
  const res = await fetch(`${API_BASE_URL}/gallery`);
  if (!res.ok) throw new Error('Failed to fetch gallery items');
  return res.json();
}

export async function createGalleryItem(item) {
  const res = await fetch(`${API_BASE_URL}/gallery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error('Failed to create gallery item');
  return res.json();
}

export async function deleteGalleryItem(id) {
  const res = await fetch(`${API_BASE_URL}/gallery/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete gallery item');
  return res.json();
}

/**
 * Reviews API
 */
export async function fetchReviews() {
  const res = await fetch(`${API_BASE_URL}/reviews`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export async function createReview(review) {
  const res = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(review)
  });
  if (!res.ok) throw new Error('Failed to post review');
  return res.json();
}

export async function deleteReview(id) {
  const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete review');
  return res.json();
}

/**
 * Orders API
 */
export async function fetchOrders() {
  const res = await fetch(`${API_BASE_URL}/orders`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function createOrder(order) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
}

export async function updateOrderStatus(id, status) {
  const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Failed to update order status');
  return res.json();
}

export async function deleteOrder(id) {
  const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete order');
  return res.json();
}

/**
 * Custom Bulk Orders API
 */
export async function fetchCustomOrders() {
  const res = await fetch(`${API_BASE_URL}/custom-orders`);
  if (!res.ok) throw new Error('Failed to fetch custom orders');
  return res.json();
}

export async function createCustomOrder(customData) {
  const res = await fetch(`${API_BASE_URL}/custom-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customData)
  });
  if (!res.ok) throw new Error('Failed to create custom order');
  return res.json();
}



/**
 * Shop Config API
 */
export async function fetchShopConfig() {
  const res = await fetch(`${API_BASE_URL}/config`);
  if (!res.ok) throw new Error('Failed to fetch shop config');
  return res.json();
}

export async function updateShopConfig(config) {
  const res = await fetch(`${API_BASE_URL}/config`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  if (!res.ok) throw new Error('Failed to update shop config');
  return res.json();
}

/**
 * Auth API (Login & Signup with 7-Day JWT Token)
 */
export async function signupUser(userData) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to signup');
  return data;
}

export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to login');
  return data;
}

export async function googleLoginUser(googleUserData) {
  const res = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(googleUserData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to authenticate with Google');
  return data;
}

export async function getCurrentUser(token) {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch user');
  return data;
}

export async function saveUserCartWishlistData(email, cart, wishlist) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/cart-wishlist`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, cart, wishlist })
    });
    return await res.json();
  } catch (err) {
    console.warn('Backend cart-wishlist sync error:', err);
  }
}

export async function getUserCartWishlistData(email) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/cart-wishlist?email=${encodeURIComponent(email)}`);
    if (!res.ok) return { cart: [], wishlist: [] };
    return await res.json();
  } catch (err) {
    console.warn('Backend cart-wishlist fetch error:', err);
    return { cart: [], wishlist: [] };
  }
}
