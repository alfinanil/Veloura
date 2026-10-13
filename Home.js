const newArrivalsGrid = document.querySelector('#new-arrivals-grid');
const bestSellersGrid = document.querySelector('#best-sellers-grid');
const saleGrid = document.querySelector('#sale-grid');
const allGrids = [newArrivalsGrid, bestSellersGrid, saleGrid];

// Satu kartu produk di halaman Home
function homeCard(p, onSale) {
    const price = onSale
        ? `<del class="mr-2 text-[#999]">${formatPrice(p.oldPrice)}</del>
           <strong class="text-brand">${formatPrice(p.price)}</strong>`
        : formatPrice(p.price);

    const imageStyle = p.image ? ` style="background-image: url('${p.image}')"` : '';
    const link = p.id ? `product.html?id=${p.id}` : '#';

    return `
        <a href="${link}" class="block h-full">
            <article class="product-card flex h-full flex-col border border-[#e5e5e5] p-[15px] hover:shadow-md">
                <div class="mb-[15px] h-[220px] w-full border border-neutral-200 bg-[#f4f4f4] bg-cover bg-center"${imageStyle}></div>
                <h3 class="mb-2 text-[15px]">${p.name}</h3>
                <p class="mt-auto text-sm">${price}</p>
            </article>
        </a>`;
}

// Loading & error (versi Tailwind, karena index.html tidak memakai style.css)
function homeLoading(container) {
    container.innerHTML = `
        <div class="col-span-full py-10 text-center text-[#666]">
            <div class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#f3d9df] border-t-brand"></div>
            <p class="mt-3 text-sm">Mengambil data...</p>
        </div>`;
}

function homeError(container, error, retry) {
    container.innerHTML = `
        <div class="col-span-full py-10 text-center text-[#666]">
            <div class="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#c0392b] text-2xl font-bold text-white">!</div>
            <h3 class="font-serif text-[#222]">Gagal mengambil data</h3>
            <p class="mt-2 text-sm">Terjadi kesalahan saat mengambil data. Silakan coba lagi.</p>
            <small class="my-2 block text-[#999]">${error.message}</small>
            <button type="button" class="retry-btn rounded bg-brand px-7 py-2.5 text-sm text-white hover:bg-brand-dark">Coba Lagi</button>
        </div>`;
    container.querySelector('.retry-btn').addEventListener('click', retry);
}

async function loadHome() {
    allGrids.forEach(homeLoading);

    try {
        const data = await loadData();

        // Kalau item Home punya "id" produk, datanya (nama, harga, gambar) diambil dari
        // bagian "products", jadi cukup ubah sekali di sana.
        const withProduct = (item) => {
            const product = data.products.find((p) => p.id === item.id);
            return product ? { ...item, ...product } : item;
        };

        newArrivalsGrid.innerHTML = data.home.newArrivals.map((p) => homeCard(withProduct(p), false)).join('');
        bestSellersGrid.innerHTML = data.home.bestSellers.map((p) => homeCard(withProduct(p), false)).join('');
        saleGrid.innerHTML = data.home.sale.map((p) => homeCard(withProduct(p), true)).join('');
    } catch (error) {
        allGrids.forEach((grid) => homeError(grid, error, loadHome));
    }
}

loadHome();