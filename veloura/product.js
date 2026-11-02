/* ==========================================================================
   VELOURA BEAUTY - PRODUCT DETAIL & REVIEW LOGIC
   ========================================================================== */

const params = new URLSearchParams(window.location.search);
let currentProduct = null;
let currentQuantity = 1;

async function initProductPage() {
    let list;
    try {
        list = await loadProducts();
    } catch (e) {
        showToast('Failed to load product details.');
        return;
    }

    const id = params.get('id');
    currentProduct = list.find(p => String(p.id) === String(id)) || list[0];

    if (!currentProduct) {
        document.querySelector('#product-detail-page').innerHTML = `
            <div style="text-align:center; padding:100px 20px;">
                <h2>Product Not Found</h2>
                <a href="shop.html" class="primary-cta" style="margin-top:20px; display:inline-block;">Return to Shop</a>
            </div>`;
        return;
    }

    renderProductDetails(currentProduct, list);
}

function renderProductDetails(p, allProducts) {
    document.title = `${p.name} - Veloura Beauty`;

    const crumbCat = document.querySelector('#crumb-category');
    const crumbName = document.querySelector('#crumb-name');
    if (crumbCat) crumbCat.textContent = p.category;
    if (crumbName) crumbName.textContent = p.name;

    document.querySelector('#detail-image').src = p.image;
    document.querySelector('#detail-category').textContent = p.category;
    document.querySelector('#detail-title').textContent = p.name;
    document.querySelector('#detail-subtitle').textContent = p.subtitle;

    const actualPrice = p.discount ? salePrice(p) : p.price;
    document.querySelector('#detail-price').textContent = formatPrice(actualPrice);
    
    const oldPriceEl = document.querySelector('#detail-old-price');
    if (oldPriceEl) {
        oldPriceEl.textContent = p.discount ? formatPrice(p.price) : '';
    }

    document.querySelector('#detail-rating-text').textContent = `${p.rating.toFixed(1)} (${p.reviewCount} reviews)`;
    document.querySelector('#detail-desc').textContent = p.desc;

    const benefitsEl = document.querySelector('#detail-benefits');
    if (benefitsEl) {
        benefitsEl.innerHTML = p.benefits.map(b => `<span class="benefit-chip">✦ ${b}</span>`).join('');
    }

    // Wishlist Heart state
    const wishlistBtn = document.querySelector('#detail-wishlist-btn');
    if (wishlistBtn) {
        const active = isWishlisted(p.id);
        wishlistBtn.textContent = active ? '♥' : '♡';
        wishlistBtn.onclick = () => {
            toggleWishlist(p.id);
            wishlistBtn.textContent = isWishlisted(p.id) ? '♥' : '♡';
        };
    }

    // Quantity Picker
    const qtyValEl = document.querySelector('#detail-qty-val');
    document.querySelector('#qty-plus-btn').onclick = () => {
        currentQuantity++;
        if (qtyValEl) qtyValEl.textContent = currentQuantity;
    };
    document.querySelector('#qty-minus-btn').onclick = () => {
        if (currentQuantity > 1) {
            currentQuantity--;
            if (qtyValEl) qtyValEl.textContent = currentQuantity;
        }
    };

    // Add to Cart
    document.querySelector('#detail-add-cart-btn').onclick = () => {
        addToCart(p, currentQuantity);
    };

    // Related Products
    const related = allProducts
        .filter(item => item.id !== p.id)
        .sort((a, b) => (b.category === p.category) - (a.category === p.category))
        .slice(0, 4);

    const relatedGrid = document.querySelector('#related-products-grid');
    if (relatedGrid) {
        relatedGrid.innerHTML = related.map(item => productCardHTML(item)).join('');
    }
}

function toggleAccordion(btn) {
    const item = btn.closest('.accordion-item');
    if (item) {
        item.classList.toggle('active');
    }
}

function handleReviewSubmit(e) {
    e.preventDefault();
    const name = document.querySelector('#review-name').value.trim();
    const rating = document.querySelector('#review-rating-select').value;
    const comment = document.querySelector('#review-comment').value.trim();

    const starStr = '★'.repeat(rating) + '☆'.repeat(5 - rating);

    const listBox = document.querySelector('#reviews-list-box');
    if (listBox) {
        const newReview = document.createElement('div');
        newReview.className = 'review-card';
        newReview.innerHTML = `
            <div class="review-header">
                <span class="review-author">${name} <small style="color:var(--brand); font-weight:normal;">(Verified Buyer)</small></span>
                <span class="review-rating">${starStr}</span>
            </div>
            <p style="font-size:14px; color:var(--text-secondary);">${comment}</p>
        `;
        listBox.prepend(newReview);
    }

    showToast('Thank you for sharing your review! ✨');
    document.querySelector('#add-review-form').reset();
}

document.addEventListener('DOMContentLoaded', initProductPage);
