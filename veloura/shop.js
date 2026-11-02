/* ==========================================================================
   VELOURA BEAUTY - SHOP CATALOG LOGIC
   ========================================================================== */

let shopProductsList = [];
let activeCategoryFilter = 'All';
let maxPriceFilter = 300000;
let searchQuery = '';

const shopGrid = document.querySelector('#shop-product-grid');
const emptyState = document.querySelector('#shop-empty-state');
const catalogCountInfo = document.querySelector('#catalog-count-info');
const categoryChipBtns = document.querySelectorAll('.category-chip-btn');
const shopSearchInput = document.querySelector('#shop-search-input');
const shopSortSelect = document.querySelector('#shop-sort');

async function initShopCatalog() {
    // Read category from URL param if available (e.g. ?category=Skincare)
    const urlCategory = new URLSearchParams(window.location.search).get('category');
    if (urlCategory) {
        activeCategoryFilter = urlCategory;
        categoryChipBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === urlCategory);
        });
    }

    renderShopSkeleton();

    try {
        shopProductsList = await loadProducts();
        updateCategoryItemCounts();
        renderShopCatalog();
    } catch (e) {
        if (shopGrid) {
            shopGrid.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:50px;">Failed to load catalog. ${e.message}</p>`;
        }
    }
}

function updateCategoryItemCounts() {
    const counts = { All: shopProductsList.length, Skincare: 0, Makeup: 0, Haircare: 0, Bodycare: 0 };
    shopProductsList.forEach(p => {
        if (counts[p.category] !== undefined) counts[p.category]++;
    });

    Object.keys(counts).forEach(cat => {
        const el = document.querySelector(`#count-${cat.toLowerCase()}`);
        if (el) el.textContent = counts[cat];
    });
}

function renderShopSkeleton() {
    if (!shopGrid) return;
    shopGrid.innerHTML = Array(8).fill(0).map(() => `
        <div class="product-card" style="opacity:0.6; pointer-events:none;">
            <div class="product-card-top" style="background:#f0e6e8; animation: pulse 1.5s infinite ease-in-out;"></div>
            <div class="product-card-body">
                <div style="height:12px; width:40%; background:#e8dadc; margin-bottom:10px; border-radius:4px;"></div>
                <div style="height:18px; width:80%; background:#e8dadc; margin-bottom:10px; border-radius:4px;"></div>
                <div style="height:14px; width:60%; background:#f0e6e8; margin-top:auto; border-radius:4px;"></div>
            </div>
        </div>
    `).join('');
}

function updatePriceSlider(val) {
    maxPriceFilter = Number(val);
    const label = document.querySelector('#price-slider-val');
    if (label) label.textContent = formatPrice(maxPriceFilter);
    renderShopCatalog();
}

function renderShopCatalog() {
    if (!shopGrid || shopProductsList.length === 0) return;

    let filtered = shopProductsList.filter(p => {
        const matchesCategory = (activeCategoryFilter === 'All' || p.category === activeCategoryFilter);
        const pPrice = p.discount ? salePrice(p) : p.price;
        const matchesPrice = pPrice <= maxPriceFilter;
        const matchesSearch = !searchQuery || 
            p.name.toLowerCase().includes(searchQuery) || 
            p.category.toLowerCase().includes(searchQuery) ||
            p.desc.toLowerCase().includes(searchQuery);

        return matchesCategory && matchesPrice && matchesSearch;
    });

    // Sorting
    const sortVal = shopSortSelect ? shopSortSelect.value : 'featured';
    if (sortVal === 'low') filtered.sort((a, b) => (a.discount ? salePrice(a) : a.price) - (b.discount ? salePrice(b) : b.price));
    if (sortVal === 'high') filtered.sort((a, b) => (b.discount ? salePrice(b) : b.price) - (a.discount ? salePrice(a) : a.price));
    if (sortVal === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    if (sortVal === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

    if (catalogCountInfo) {
        catalogCountInfo.textContent = `Showing ${filtered.length} of ${shopProductsList.length} products`;
    }

    if (filtered.length === 0) {
        shopGrid.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
    } else {
        shopGrid.style.display = 'grid';
        if (emptyState) emptyState.style.display = 'none';
        shopGrid.innerHTML = filtered.map(p => productCardHTML(p)).join('');
    }
}

function resetShopFilters() {
    activeCategoryFilter = 'All';
    maxPriceFilter = 300000;
    searchQuery = '';
    if (shopSearchInput) shopSearchInput.value = '';
    const rangeInput = document.querySelector('#price-range');
    if (rangeInput) rangeInput.value = 300000;
    updatePriceSlider(300000);
    
    categoryChipBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.category === 'All'));
    renderShopCatalog();
}

// Event Listeners
categoryChipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryChipBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategoryFilter = btn.dataset.category;
        renderShopCatalog();
    });
});

if (shopSearchInput) {
    shopSearchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderShopCatalog();
    });
}

document.addEventListener('DOMContentLoaded', initShopCatalog);
