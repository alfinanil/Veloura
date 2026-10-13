// =========================
// DATA (Sprint 03)
// =========================
// Semua data produk disimpan di products.json, lalu dimuat dengan fetch().
const DATA_URL = 'products.json';

async function fetchData() {
    // Tambahkan ?demo=error di URL untuk mensimulasikan data yang gagal dimuat (buat demo)
    const demoError = new URLSearchParams(window.location.search).get('demo') === 'error';
    const url = demoError ? 'file-tidak-ada.json' : DATA_URL;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`${url} gagal dimuat (status ${response.status})`);
    }
    return response.json();
}

// Sama seperti fetchData(), tapi loading ditahan minimal beberapa saat
// supaya tampilan loading sempat terlihat (file JSON lokal sangat cepat).
async function loadData(minMs = 600) {
    const [data] = await Promise.all([
        fetchData(),
        new Promise((resolve) => setTimeout(resolve, minMs))
    ]);
    return data;
}

// =========================
// STATE: loading & error
// =========================
function showLoading(container, text = 'Mengambil data...') {
    container.innerHTML = `
        <div class="state-box">
            <div class="spinner"></div>
            <p>${text}</p>
        </div>`;
}

function showError(container, error, retry) {
    container.innerHTML = `
        <div class="state-box error">
            <div class="error-icon">!</div>
            <h3>Gagal mengambil data</h3>
            <p>Terjadi kesalahan saat mengambil data. Silakan coba lagi.</p>
            <small>${error.message}</small>
            <button type="button" class="primary-btn retry-btn">Coba Lagi</button>
        </div>`;
    container.querySelector('.retry-btn').addEventListener('click', retry);
}

// =========================
// HELPER
// =========================
function formatPrice(number) {
    return 'Rp' + number.toLocaleString('id-ID');
}

function cardHTML(p) {
    return `
        <article class="shop-card">
            <div class="shop-card-image" style="background-image: url('${p.image}')"></div>
            <div class="shop-card-info">
                <h3>${p.name}</h3>
                <span class="subtitle">${p.subtitle}</span>
                <p class="price">${formatPrice(p.price)}</p>
                <a href="product.html?id=${p.id}" class="view-button">View Product</a>
            </div>
        </article>`;
}

// Keranjang (jumlahnya disimpan supaya tetap ada saat pindah halaman)
function getCartCount() {
    try {
        return Number(localStorage.getItem('veloura-cart')) || 0;
    } catch (error) {
        return 0;
    }
}

function updateCartBadge() {
    const badge = document.querySelector('#cart-count');
    if (badge) badge.textContent = getCartCount();
}

function addToCart(qty) {
    try {
        localStorage.setItem('veloura-cart', getCartCount() + qty);
    } catch (error) {}
    updateCartBadge();
}

// Notifikasi kecil
let toast, toastTimer;

function showToast(message) {
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

document.addEventListener('DOMContentLoaded', updateCartBadge);