/* ==========================================================================
   VELOURA BEAUTY - HOMEPAGE LOGIC
   ========================================================================== */

const newArrivalsGrid = document.querySelector('#new-arrivals-grid');
const bestSellersGrid = document.querySelector('#best-sellers-grid');
const saleGrid = document.querySelector('#sale-grid');
const homeGrids = [newArrivalsGrid, bestSellersGrid, saleGrid];

function renderSkeletonLoading(container) {
    if (!container) return;
    container.innerHTML = Array(4).fill(0).map(() => `
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

function renderErrorState(container, error, retryFn) {
    if (!container) return;
    container.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:40px 20px;">
            <div style="font-size:32px; margin-bottom:10px;">⚠️</div>
            <h3 style="font-family:var(--font-serif); font-size:20px;">Unable to load products</h3>
            <p style="color:#777; font-size:14px; margin:6px 0 16px;">${error.message}</p>
            <button type="button" class="primary-cta" style="padding:10px 24px; font-size:13px;" onclick="${retryFn.name}()">Try Again</button>
        </div>`;
}

function pickSections(list) {
    const used = new Set();
    const take = (items) => {
        items.forEach(p => used.add(p.id));
        return items;
    };

    // New Arrivals: 1 from each category
    const newArrivals = take(
        ['Skincare', 'Makeup', 'Haircare', 'Bodycare']
            .map(c => list.find(p => p.category === c))
            .filter(Boolean)
    );

    // Best Sellers: highest rated remaining
    const bestSellers = take(
        list.filter(p => !used.has(p.id))
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 4)
    );

    // Sale: largest discount remaining
    const sale = list.filter(p => !used.has(p.id) && p.discount > 0)
        .sort((a, b) => b.discount - a.discount)
        .slice(0, 4);

    return { newArrivals, bestSellers, sale };
}

async function loadHome() {
    homeGrids.forEach(renderSkeletonLoading);

    try {
        const list = await loadProducts();
        const { newArrivals, bestSellers, sale } = pickSections(list);

        if (newArrivalsGrid) newArrivalsGrid.innerHTML = newArrivals.map(p => productCardHTML(p)).join('');
        if (bestSellersGrid) bestSellersGrid.innerHTML = bestSellers.map(p => productCardHTML(p)).join('');
        if (saleGrid) saleGrid.innerHTML = sale.map(p => productCardHTML(p)).join('');

    } catch (error) {
        homeGrids.forEach(grid => renderErrorState(grid, error, loadHome));
    }
}

document.addEventListener('DOMContentLoaded', loadHome);
