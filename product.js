const params = new URLSearchParams(window.location.search);
const page = document.querySelector('#product-page');
const pageTemplate = page.innerHTML; // disimpan, dipakai lagi setelah data selesai dimuat

async function loadProduct() {
    showLoading(page, 'Mengambil detail produk...');

    let list;
    try {
        list = (await loadData()).products;
    } catch (error) {
        showError(page, error, loadProduct);
        return;
    }

    const product = list.find((p) => String(p.id) === params.get('id'));

    if (!product) {
        page.innerHTML =
            '<p class="not-found">Produk tidak ditemukan. <a href="shop.html">Kembali ke Shop</a></p>';
        return;
    }

    page.innerHTML = pageTemplate;
    renderProduct(product, list);
}

function renderProduct(product, list) {
    // Isi halaman dengan data produk
    document.title = `${product.name} - Veloura`;
    document.querySelector('#crumb-category').textContent = product.category;
    document.querySelector('#crumb-name').textContent = product.name;
    document.querySelector('#detail-name').textContent = product.name;
    document.querySelector('#detail-subtitle').textContent = product.subtitle;
    document.querySelector('#detail-price').textContent = formatPrice(product.price);
    document.querySelector('#detail-rating').innerHTML =
        '★★★★★ <span>(120 reviews)</span>';
    document.querySelector('#detail-desc').textContent = product.desc;
    document.querySelector('#detail-image').style.backgroundImage = `url('${product.image}')`;
    document.querySelector('#detail-benefits').innerHTML =
        product.benefits.map((b) => `<li>${b}</li>`).join('');

    // You May Also Like (kategori yang sama dulu)
    const related = list
        .filter((p) => p.id !== product.id)
        .sort((a, b) => (b.category === product.category) - (a.category === product.category))
        .slice(0, 4);
    document.querySelector('#related-grid').innerHTML = related.map(cardHTML).join('');

    // Quantity
    let qty = 1;
    const qtyValue = document.querySelector('#qty-value');

    document.querySelector('#qty-plus').addEventListener('click', () => {
        if (qty < 10) {
            qty++;
            qtyValue.textContent = qty;
        }
    });

    document.querySelector('#qty-minus').addEventListener('click', () => {
        if (qty > 1) {
            qty--;
            qtyValue.textContent = qty;
        }
    });

    // Add to Cart
    document.querySelector('#add-cart').addEventListener('click', () => {
        addToCart(qty);
        showToast(`${qty} × ${product.name} ditambahkan ke keranjang`);
    });

    // Wishlist
    const wishlistButton = document.querySelector('#wishlist-btn');

    wishlistButton.addEventListener('click', () => {
        const active = wishlistButton.classList.toggle('active');
        wishlistButton.textContent = active ? '♥ In Wishlist' : '♡ Add to Wishlist';
        showToast(active ? 'Ditambahkan ke wishlist' : 'Dihapus dari wishlist');
    });
}

loadProduct();