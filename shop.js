const grid = document.querySelector('#product-grid');
const chips = document.querySelectorAll('.filter-chip');
const sortSelect = document.querySelector('#sort');
const emptyMessage = document.querySelector('#empty-message');
const statusBadge = document.querySelector('#data-status');

let allProducts = [];
let activeCategory = 'All';
let requestId = 0; // penanda request terbaru (kalau chip diklik berkali-kali)

// Keterangan status data: loading / success / error
function setStatus(type, text) {
    statusBadge.className = 'data-status ' + type;
    statusBadge.textContent = text;
}

// Tampilkan produk sesuai kategori & urutan. Mengembalikan jumlah produk yang tampil.
function renderProducts() {
    if (allProducts.length === 0) return 0; // data belum siap

    const list = allProducts.filter((p) => activeCategory === 'All' || p.category === activeCategory);

    if (sortSelect.value === 'low') list.sort((a, b) => a.price - b.price);
    if (sortSelect.value === 'high') list.sort((a, b) => b.price - a.price);
    if (sortSelect.value === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

    grid.innerHTML = list.map(cardHTML).join('');
    emptyMessage.hidden = list.length > 0;
    return list.length;
}

// Muat data: loading -> sukses / error. Dipanggil saat halaman dibuka DAN setiap ganti kategori.
async function loadShop() {
    const id = ++requestId;
    const label = activeCategory === 'All' ? 'semua produk' : `kategori ${activeCategory}`;

    emptyMessage.hidden = true;
    setStatus('loading', `Memuat ${label}...`);
    showLoading(grid, `Mengambil ${label}...`);

    try {
        const data = await loadData();
        if (id !== requestId) return; // sudah ada request yang lebih baru

        allProducts = data.products;
        const count = renderProducts();
        setStatus('success', `Data berhasil dimuat`);
    } catch (error) {
        if (id !== requestId) return;

        showError(grid, error, loadShop);
        setStatus('error', 'Data gagal dimuat');
    }
}

// Event: klik chip kategori -> tampilkan loading lalu muat data
chips.forEach((chip) => {
    chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        activeCategory = chip.dataset.category;
        loadShop();
    });
});

// Event: ganti urutan (langsung, tanpa loading)
sortSelect.addEventListener('change', renderProducts);

loadShop();