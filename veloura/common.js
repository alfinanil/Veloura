/* ==========================================================================
   VELOURA BEAUTY - COMMON APP LOGIC & STATE MANAGEMENT
   ========================================================================== */

const API_BASE = 'https://dummyjson.com/products/category/';
const CATEGORY_MAP = {
    'skin-care': 'Skincare',
    'beauty': 'Makeup'
};
const USD_TO_IDR = 16000;
const CACHE_KEY = 'veloura-products-v4';
const FREE_SHIPPING_THRESHOLD = 200000;

// Override photos with high resolution generated imagery
const IMAGE_OVERRIDES = {
    'Skincare': 'images/skincare.jpg',
    'Makeup': 'images/makeup.jpg',
    'Haircare': 'images/haircare.jpg',
    'Bodycare': 'images/bodycare.jpg'
};

// Global State
let cachedProductsList = [];
let appliedDiscountPercent = 0;

// ==========================================================================
// DATA FETCHING & FORMATTING
// ==========================================================================

function toProduct(item, slug) {
    const categoryName = CATEGORY_MAP[slug] || 'Skincare';
    return {
        id: item.id,
        name: item.title,
        category: categoryName,
        subtitle: item.brand || categoryName,
        price: Math.round((item.price * USD_TO_IDR) / 1000) * 1000,
        image: item.thumbnail || IMAGE_OVERRIDES[categoryName],
        desc: item.description,
        benefits: (item.tags || ['Radiant Glow', 'Nourishing', 'Hydrating']).slice(0, 3).map(t => t.charAt(0).toUpperCase() + t.slice(1)),
        rating: item.rating || 4.8,
        discount: item.discountPercentage ? Math.round(item.discountPercentage) : 0,
        reviewCount: (item.reviews || []).length || 24
    };
}

// Hardcoded offline fallback products (guarantees site works even on file:// protocol or offline)
const FALLBACK_PRODUCTS = [
    {
        id: "skin-serum-01",
        name: "Hydration Glow Serum",
        category: "Skincare",
        subtitle: "Hyaluronic Acid & Niacinamide",
        price: 135000,
        image: "images/skincare.jpg",
        desc: "An ultra-hydrating facial serum infused with pure hyaluronic acid and niacinamide to restore radiant skin glow and refine pores.",
        benefits: ["Plumping Moisture", "Pore Refining", "100% Vegan", "Radiant Glow"],
        rating: 4.9,
        discount: 15,
        reviewCount: 240
    },
    {
        id: "skin-cream-02",
        name: "Vitamin C Brightening Cream",
        category: "Skincare",
        subtitle: "Antioxidant Radiance Booster",
        price: 145000,
        image: "images/skincare.jpg",
        desc: "Lightweight moisturizer enriched with stable Vitamin C and botanical extracts to brighten dull complexion and fade dark spots.",
        benefits: ["Brightening", "Fades Dark Spots", "Non-Comedogenic", "Daily Defense"],
        rating: 4.8,
        discount: 10,
        reviewCount: 185
    },
    {
        id: "makeup-lipstick-01",
        name: "Velvet Matte Rose Lipstick",
        category: "Makeup",
        subtitle: "Long-Wear Satin Finish",
        price: 89000,
        image: "images/makeup.jpg",
        desc: "A velvety matte lipstick delivering rich pigmentation and all-day hydration with jojoba oil and vitamin E.",
        benefits: ["8h Long Wear", "Non-Drying", "Rich Pigment", "Smudge-Proof"],
        rating: 4.9,
        discount: 20,
        reviewCount : 310
    },
    {
        id: "makeup-blush-02",
        name: "Radiant Glow Blush Powder",
        category: "Makeup",
        subtitle: "Soft Peach Luminizer",
        price: 95000,
        image: "images/makeup.jpg",
        desc: "Silky powder blush featuring light-reflecting micro-pearls for a natural sun-kissed flush.",
        benefits: ["Natural Flush", "Micro-Pearl Shine", "Seamless Blend", "All Skin Tones"],
        rating: 4.7,
        discount: 0,
        reviewCount: 128
    },
    {
        id: "moisturizing-shampoo",
        name: "Botanical Hydrating Shampoo",
        category: "Haircare",
        subtitle: "Argan Oil & Aloe Vera Formula",
        price: 95000,
        image: "images/haircare.jpg",
        desc: "A luxurious nourishing shampoo that deeply cleanses, strengthens roots, and restores natural hair shine without harsh sulfates.",
        benefits: ["Sulfate-Free", "Deep Moisture", "Shine Restoring", "For All Hair Types"],
        rating: 4.9,
        discount: 15,
        reviewCount: 142
    },
    {
        id: "hair-repair-serum",
        name: "Golden Silk Hair Repair Serum",
        category: "Haircare",
        subtitle: "Heat Protectant & Frizz Control",
        price: 125000,
        image: "images/haircare.jpg",
        desc: "Intensive leave-in treatment infused with pure keratin and golden argan oil to tame frizz and protect against heat damage.",
        benefits: ["Frizz Control", "Heat Protection", "Silky Touch", "Lightweight Formula"],
        rating: 4.8,
        discount: 10,
        reviewCount: 89
    },
    {
        id: "silky-body-lotion",
        name: "Velvet Rose Silky Body Lotion",
        category: "Bodycare",
        subtitle: "Soft & Non-Sticky Hydration",
        price: 85000,
        image: "images/bodycare.jpg",
        desc: "A fast-absorbing luxury body lotion with organic shea butter and delicate Bulgarian rose essence for 24-hour hydration.",
        benefits: ["24h Moisture", "Fast Absorbing", "Non-Sticky", "Organic Shea Butter"],
        rating: 4.9,
        discount: 20,
        reviewCount: 210
    },
    {
        id: "exfoliating-body-scrub",
        name: "Pink Himalayan Salt Body Scrub",
        category: "Bodycare",
        subtitle: "Smooth & Glow Exfoliator",
        price: 99000,
        image: "images/bodycare.jpg",
        desc: "Exfoliating body scrub enriched with sweet almond oil and coconut blossom to buff away dead skin cells and reveal radiant glow.",
        benefits: ["Gentle Exfoliation", "Radiant Glow", "Enriched with Oils", "Smells Divine"],
        rating: 4.7,
        discount: 0,
        reviewCount: 76
    }
];

async function fetchProducts() {
    const demoError = new URLSearchParams(window.location.search).get('demo') === 'error';

    if (!demoError) {
        try {
            const cached = sessionStorage.getItem(CACHE_KEY);
            if (cached) {
                cachedProductsList = JSON.parse(cached);
                if (cachedProductsList && cachedProductsList.length > 0) return cachedProductsList;
            }
        } catch (e) {}
    }

    // 1) Sumber utama: REST API backend PHP (data dikelola lewat Admin Dashboard)
    if (!demoError) {
        try {
            const res = await apiFetch('/products', { auth: false });
            if (Array.isArray(res.data) && res.data.length) {
                cachedProductsList = res.data;
                try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(cachedProductsList)); } catch (e) {}
                return cachedProductsList;
            }
        } catch (e) { console.warn('Backend API tidak aktif, memakai katalog cadangan:', e.message); }
    }

    // 2) Cadangan: dummyjson + products.json + FALLBACK_PRODUCTS
    const base = demoError ? 'https://dummyjson.com/produk-salah/' : API_BASE;
    let fetchedList = [];

    try {
        const requests = Object.keys(CATEGORY_MAP).map(async (slug) => {
            const response = await fetch(`${base}${slug}?limit=100`);
            if (!response.ok) throw new Error(`Server status ${response.status}`);
            const data = await response.json();
            return data.products.map(item => toProduct(item, slug));
        });

        // Local products fallback
        requests.push(
            fetch('products.json').then(res => {
                if (!res.ok) throw new Error(`products.json error ${res.status}`);
                return res.json().then(data => data.products);
            })
        );

        const results = await Promise.allSettled(requests);
        fetchedList = results
            .filter(r => r.status === 'fulfilled' && Array.isArray(r.value))
            .flatMap(r => r.value);
    } catch (e) {
        console.warn('Network API fetch failed, using offline fallback catalog:', e);
    }

    // If fetched API list is empty or failed (e.g. file:// protocol or offline), use FALLBACK_PRODUCTS
    if (!fetchedList || fetchedList.length === 0) {
        cachedProductsList = FALLBACK_PRODUCTS;
    } else {
        cachedProductsList = fetchedList;
    }

    try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(cachedProductsList));
    } catch (e) {}

    return cachedProductsList;
}

async function loadProducts(minMs = 400) {
    const [list] = await Promise.all([
        fetchProducts(),
        new Promise(resolve => setTimeout(resolve, minMs))
    ]);
    return list;
}

function formatPrice(number) {
    return 'Rp' + Math.round(number).toLocaleString('id-ID');
}

function salePrice(p) {
    if (!p.discount) return p.price;
    return Math.round((p.price * (1 - p.discount / 100)) / 1000) * 1000;
}

// ==========================================================================
// CART STATE & DRAWER MANAGEMENT
// ==========================================================================

function getCartItems() {
    try {
        return JSON.parse(localStorage.getItem('veloura-cart-items')) || [];
    } catch (e) {
        return [];
    }
}

function saveCartItems(items) {
    try {
        localStorage.setItem('veloura-cart-items', JSON.stringify(items));
    } catch (e) {}
    updateHeaderBadges();
    renderCartDrawer();
}

function getCartTotalCount() {
    return getCartItems().reduce((acc, item) => acc + item.qty, 0);
}

function addToCart(product, qty = 1) {
    const items = getCartItems();
    const existingIndex = items.findIndex(i => String(i.id) === String(product.id));

    if (existingIndex > -1) {
        items[existingIndex].qty += qty;
    } else {
        items.push({
            id: product.id,
            name: product.name,
            price: product.discount ? salePrice(product) : product.price,
            image: product.image,
            category: product.category,
            qty: qty
        });
    }

    saveCartItems(items);
    showToast(`Added ${qty} × ${product.name} to cart!`);
    toggleCartDrawer(true);
}

function updateCartQty(productId, delta) {
    let items = getCartItems();
    const index = items.findIndex(i => String(i.id) === String(productId));

    if (index > -1) {
        items[index].qty += delta;
        if (items[index].qty <= 0) {
            items.splice(index, 1);
        }
    }
    saveCartItems(items);
}

function removeFromCart(productId) {
    let items = getCartItems();
    items = items.filter(i => String(i.id) !== String(productId));
    saveCartItems(items);
    showToast('Item removed from cart.');
}

function toggleCartDrawer(open) {
    const overlay = document.querySelector('#cart-drawer-overlay');
    if (!overlay) return;
    if (open) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function renderCartDrawer() {
    const drawerList = document.querySelector('#drawer-cart-list');
    const subtotalEl = document.querySelector('#drawer-subtotal');
    const grandTotalEl = document.querySelector('#drawer-grandtotal');
    const shippingBarFill = document.querySelector('#shipping-progress-fill');
    const shippingTextEl = document.querySelector('#shipping-progress-text');
    
    if (!drawerList) return;

    const items = getCartItems();
    
    if (items.length === 0) {
        drawerList.innerHTML = `
            <div class="empty-cart-state">
                <i class="bi bi-bag-heart"></i>
                <p>Your shopping cart is empty.</p>
                <a href="shop.html" onclick="toggleCartDrawer(false)" class="add-cart-btn" style="margin-top:16px; display:inline-block;">Explore Shop</a>
            </div>`;
        if (subtotalEl) subtotalEl.textContent = formatPrice(0);
        if (grandTotalEl) grandTotalEl.textContent = formatPrice(0);
        if (shippingBarFill) shippingBarFill.style.width = '0%';
        if (shippingTextEl) shippingTextEl.textContent = `Add ${formatPrice(FREE_SHIPPING_THRESHOLD)} more for FREE Shipping!`;
        return;
    }

    const rawSubtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const discountAmount = Math.round(rawSubtotal * (appliedDiscountPercent / 100));
    const finalTotal = Math.max(0, rawSubtotal - discountAmount);

    drawerList.innerHTML = items.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${escapeHTML(item.name)}" class="cart-item-img">
            <div class="cart-item-info">
                <h4 class="cart-item-title">${escapeHTML(item.name)}</h4>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
                <div class="cart-item-controls">
                    <div class="qty-picker">
                        <button type="button" onclick="updateCartQty('${item.id}', -1)">−</button>
                        <span>${item.qty}</span>
                        <button type="button" onclick="updateCartQty('${item.id}', 1)">+</button>
                    </div>
                    <button type="button" onclick="removeFromCart('${item.id}')" class="remove-item-btn" title="Remove item">
                        ✕
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    if (subtotalEl) subtotalEl.textContent = formatPrice(rawSubtotal);
    if (grandTotalEl) grandTotalEl.textContent = formatPrice(finalTotal);

    // Free shipping calculation
    if (shippingBarFill && shippingTextEl) {
        const percent = Math.min(100, (rawSubtotal / FREE_SHIPPING_THRESHOLD) * 100);
        shippingBarFill.style.width = `${percent}%`;
        if (rawSubtotal >= FREE_SHIPPING_THRESHOLD) {
            shippingTextEl.textContent = '🎉 Congratulations! You unlocked FREE Express Shipping!';
        } else {
            const needed = FREE_SHIPPING_THRESHOLD - rawSubtotal;
            shippingTextEl.textContent = `Add ${formatPrice(needed)} more to unlock FREE Express Shipping!`;
        }
    }
}

function applyPromoCode() {
    const input = document.querySelector('#promo-input');
    if (!input) return;
    const code = input.value.trim().toUpperCase();

    if (code === 'VELOURA15') {
        appliedDiscountPercent = 15;
        showToast('Code VELOURA15 applied! 15% OFF discount!');
        renderCartDrawer();
    } else if (code === 'BEAUTY20') {
        appliedDiscountPercent = 20;
        showToast('Code BEAUTY20 applied! 20% OFF discount!');
        renderCartDrawer();
    } else {
        showToast('Invalid promo code. Try VELOURA15');
    }
}

// ==========================================================================
// WISHLIST STATE MANAGEMENT
// ==========================================================================

function getWishlistItems() {
    try {
        return JSON.parse(localStorage.getItem('veloura-wishlist-ids')) || [];
    } catch (e) {
        return [];
    }
}

function isWishlisted(id) {
    return getWishlistItems().includes(String(id));
}

function toggleWishlist(productId) {
    let list = getWishlistItems();
    const strId = String(productId);
    const index = list.indexOf(strId);

    if (index > -1) {
        list.splice(index, 1);
        showToast('Removed from Wishlist.');
    } else {
        list.push(strId);
        showToast('Added to Wishlist! 💖');
    }

    try {
        localStorage.setItem('veloura-wishlist-ids', JSON.stringify(list));
    } catch (e) {}

    updateHeaderBadges();
    
    // Update any heart icons on active page
    document.querySelectorAll(`[data-wishlist-id="${productId}"]`).forEach(btn => {
        btn.classList.toggle('active', list.includes(strId));
    });
}

// ==========================================================================
// BADGE COUNTER UPDATES
// ==========================================================================

function updateHeaderBadges() {
    const cartBadge = document.querySelector('#cart-badge-count');
    const wishlistBadge = document.querySelector('#wishlist-badge-count');
    
    const cartCount = getCartTotalCount();
    const wishlistCount = getWishlistItems().length;

    if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.classList.add('bump');
        setTimeout(() => cartBadge.classList.remove('bump'), 300);
    }
    if (wishlistBadge) {
        wishlistBadge.textContent = wishlistCount;
    }
}

// ==========================================================================
// TOAST SYSTEM
// ==========================================================================

function showToast(msg) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `<span>✨</span> <span>${escapeHTML(msg)}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ==========================================================================
// QUICK VIEW MODAL
// ==========================================================================

function openQuickView(product) {
    let modal = document.querySelector('#quickview-modal');
    if (!modal) return;

    document.querySelector('#qv-image').src = product.image;
    document.querySelector('#qv-category').textContent = product.category;
    document.querySelector('#qv-title').textContent = product.name;
    document.querySelector('#qv-price').textContent = formatPrice(product.discount ? salePrice(product) : product.price);
    document.querySelector('#qv-desc').textContent = product.desc;
    
    const benefitsEl = document.querySelector('#qv-benefits');
    if (benefitsEl) {
        benefitsEl.innerHTML = product.benefits.map(b => `<span class="benefit-chip">✦ ${escapeHTML(b)}</span>`).join('');
    }

    const addBtn = document.querySelector('#qv-add-cart-btn');
    if (addBtn) {
        addBtn.onclick = () => {
            addToCart(product, 1);
            closeQuickView();
        };
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeQuickView() {
    const modal = document.querySelector('#quickview-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ==========================================================================
// SEARCH MODAL & OVERLAY
// ==========================================================================

function toggleSearchModal(open) {
    const modal = document.querySelector('#search-modal');
    if (!modal) return;
    if (open) {
        modal.classList.add('active');
        document.querySelector('#search-input-field')?.focus();
        document.body.style.overflow = 'hidden';
    } else {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

async function handleLiveSearch(query) {
    const resultsContainer = document.querySelector('#search-results-grid');
    if (!resultsContainer) return;

    query = query.trim().toLowerCase();
    if (!query) {
        resultsContainer.innerHTML = '<p style="text-align:center; color:#888; margin-top:30px;">Type keywords like "shampoo", "lipstick", "serum"...</p>';
        return;
    }

    if (cachedProductsList.length === 0) {
        cachedProductsList = await fetchProducts();
    }

    const matched = cachedProductsList.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query) ||
        p.desc.toLowerCase().includes(query)
    );

    if (matched.length === 0) {
        resultsContainer.innerHTML = `<p style="text-align:center; color:#888; margin-top:30px;">No products found for "${escapeHTML(query)}".</p>`;
        return;
    }

    resultsContainer.innerHTML = matched.map(p => productCardHTML(p)).join('');
}

// ==========================================================================
// CARD HTML GENERATOR
// ==========================================================================

function productCardHTML(p) {
    const hasDiscount = p.discount > 0;
    const currentPrice = hasDiscount ? salePrice(p) : p.price;
    const isWished = isWishlisted(p.id);

    return `
        <article class="product-card">
            <div class="product-card-top">
                <img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy">
                ${hasDiscount ? `<span class="discount-badge">-${p.discount}%</span>` : ''}
                <span class="rating-badge">★ ${p.rating.toFixed(1)}</span>
                <div class="card-overlay-actions">
                    <button type="button" class="overlay-btn" onclick="triggerQuickView('${p.id}')" title="Quick View">
                        👁️
                    </button>
                    <button type="button" class="overlay-btn ${isWished ? 'active' : ''}" data-wishlist-id="${p.id}" onclick="toggleWishlist('${p.id}')" title="Add to Wishlist">
                        ${isWished ? '♥' : '♡'}
                    </button>
                </div>
            </div>
            <div class="product-card-body">
                <span class="product-category">${escapeHTML(p.category)}</span>
                <h3 class="product-title"><a href="product.html?id=${encodeURIComponent(p.id)}">${escapeHTML(p.name)}</a></h3>
                <p class="product-subtitle">${escapeHTML(p.subtitle)}</p>
                <div class="product-card-footer">
                    <div class="price-box">
                        <span class="current-price">${formatPrice(currentPrice)}</span>
                        ${hasDiscount ? `<span class="original-price">${formatPrice(p.price)}</span>` : ''}
                    </div>
                    <button type="button" class="add-cart-btn" onclick="triggerAddToCart('${p.id}')">
                        + Add
                    </button>
                </div>
            </div>
        </article>`;
}

async function triggerQuickView(productId) {
    if (cachedProductsList.length === 0) cachedProductsList = await fetchProducts();
    const product = cachedProductsList.find(p => String(p.id) === String(productId));
    if (product) openQuickView(product);
}

async function triggerAddToCart(productId) {
    if (cachedProductsList.length === 0) cachedProductsList = await fetchProducts();
    const product = cachedProductsList.find(p => String(p.id) === String(productId));
    if (product) addToCart(product, 1);
}

// Initialize listeners on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderBadges();
    renderCartDrawer();
});


// ==========================================================================
// CHECKOUT (POST /api/orders, protected) & AUTH UI
// ==========================================================================

async function checkoutCart() {
    const items = getCartItems();
    if (!items.length) { showToast('Keranjang masih kosong.'); return; }
    if (!getToken()) {
        showToast('Silakan login dulu untuk checkout.');
        setTimeout(() => { location.href = 'login.html'; }, 1000);
        return;
    }
    const btn = document.querySelector('.checkout-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Memproses...'; }
    try {
        const res = await apiFetch('/orders', { method: 'POST', body: { items: items.map(i => ({ id: i.id, qty: i.qty })) } });
        saveCartItems([]);
        try {
            sessionStorage.removeItem(CACHE_KEY);
        } catch (e) {}

        toggleCartDrawer(false);

        showToast(`Pesanan ${res.data.code} berhasil dibuat! 🎉`);

        setTimeout(() => {
            location.href = 'orders.html';
        }, 1000);
    } catch (e) {
        showToast(e.errors?.items?.[0] || e.message);
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = 'Checkout Now ➔'; }
    }
}

async function logoutUser() {
    try { await apiFetch('/auth/logout', { method: 'POST' }); } catch (e) {}
    clearSession();
    location.href = SITE_ROOT + 'index.html';
}

function updateAuthUI() {
    const btn = document.querySelector('.sign-in-btn');
    const user = getSessionUser();

    if (!btn) return;

    /* =========================
       BELUM LOGIN
    ========================= */

    if (!user || !getToken()) {
        return;
    }

    /* =========================
       LOGIN
    ========================= */

    btn.outerHTML = `
        <div class="user-menu">

            <button
                type="button"
                class="user-menu-btn"
                aria-label="Account menu"
                title="Account"
            >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="8" r="4"></circle>
                    <path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"></path>
                </svg>
            </button>

            <div class="user-dropdown">

                <div class="account-info">

                    <div class="account-avatar">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <circle cx="12" cy="8" r="4"></circle>
                            <path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"></path>
                        </svg>
                    </div>

                    <div>
                        <div class="account-name">
                            Hi, ${escapeHTML(user.name)}
                        </div>

                        <div class="account-type">
                            ${user.role === 'admin'
                                ? 'Administrator'
                                : 'Customer Account'}
                        </div>
                    </div>

                </div>


                <!-- MY ORDERS -->
                ${
                    user.role !== 'admin'
                        ? `
                        <a
                            href="orders.html"
                            class="user-dropdown-item"
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M6 3h12v18H6z"></path>
                                <path d="M9 7h6"></path>
                                <path d="M9 11h6"></path>
                                <path d="M9 15h4"></path>
                            </svg>

                            <span>My Orders</span>
                        </a>
                        `
                        : `
                        <a
                            href="admin/index.html"
                            class="user-dropdown-item"
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M4 4h16v16H4z"></path>
                                <path d="M8 8h8"></path>
                                <path d="M8 12h8"></path>
                                <path d="M8 16h5"></path>
                            </svg>

                            <span>Admin Dashboard</span>
                        </a>
                        `
                }


                <a
                    href="#"
                    class="user-dropdown-item"
                    onclick="event.preventDefault(); showToast('Profile coming soon!')"
                >
                    <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4"></circle>
                        <path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"></path>
                    </svg>

                    <span>My Profile</span>
                </a>


                <div class="user-dropdown-divider"></div>


                <button
                    type="button"
                    class="user-dropdown-item logout"
                    onclick="logoutUser()"
                >
                    <svg viewBox="0 0 24 24">
                        <path d="M10 17l5-5-5-5"></path>
                        <path d="M15 12H3"></path>
                        <path d="M21 3v18"></path>
                    </svg>

                    <span>Logout</span>
                </button>

            </div>
        </div>
    `;


    /* =========================
       DROPDOWN INTERACTION
    ========================= */

    const userMenu = document.querySelector('.user-menu');
    const userMenuBtn = document.querySelector('.user-menu-btn');

    if (!userMenu || !userMenuBtn) return;


    userMenuBtn.addEventListener('click', function (event) {

        event.stopPropagation();

        userMenu.classList.toggle('active');

    });


    document.addEventListener('click', function (event) {

        if (!userMenu.contains(event.target)) {
            userMenu.classList.remove('active');
        }

    });
}

document.addEventListener('DOMContentLoaded', updateAuthUI);
