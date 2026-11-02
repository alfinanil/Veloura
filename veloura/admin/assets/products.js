/* Products: CRUD + upload gambar (FormData) + method spoofing untuk PATCH */
let categories = [];
let editing = null;

const params = new URLSearchParams(location.search);

window.renderPage = async function (main) {
    main.innerHTML = loadingHTML();
    try { categories = (await apiFetch('/categories', { auth: false })).data; } catch (e) { main.innerHTML = errorHTML(e.message); return; }

    main.innerHTML = `
        <div class="mb-6 flex flex-wrap items-center gap-3">
            <input id="q" type="search" placeholder="Cari produk..." class="field max-w-xs" aria-label="Cari produk">
            <select id="cat" class="field max-w-[180px]" aria-label="Filter kategori"><option value="">Semua kategori</option>${categories.map(c => `<option>${esc(c.name)}</option>`).join('')}</select>
            <button type="button" id="add" class="btn-primary ml-auto">${icon('plus', 'size-4')} Add Product</button>
        </div>
        <section class="card overflow-x-auto" id="list"></section>`;
    $('#q').oninput = debounce(loadProducts);
    $('#cat').onchange = loadProducts;
    $('#add').onclick = () => openForm(null);
    await loadProducts();
    if (params.get('new')) openForm(null);
};

async function loadProducts() {
    const list = $('#list');
    list.innerHTML = loadingHTML();
    try {
        const qs = new URLSearchParams({ q: $('#q').value, category: $('#cat').value });
        const { data } = await apiFetch('/products?' + qs, { auth: false });
        if (!data.length) { list.innerHTML = emptyHTML('Tidak ada produk.'); return; }
        list.innerHTML = `<table class="w-full min-w-[720px]"><thead class="bg-brand-50/60"><tr>${['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => `<th class="th">${h}</th>`).join('')}</tr></thead>
            <tbody class="divide-y divide-line">${data.map(p => `<tr>
                <td class="td"><div class="flex items-center gap-3"><img src="${esc(imgSrc(p.image))}" alt="" class="size-12 object-cover"><div><p class="font-medium">${esc(p.name)}</p><p class="text-xs text-slate-500">${esc(p.subtitle)}</p></div></div></td>
                <td class="td">${esc(p.category || '-')}</td>
                <td class="td">${rupiah(p.price)}${p.discount ? ` <span class="badge bg-brand-100 text-brand-700">-${p.discount}%</span>` : ''}</td>
                <td class="td ${p.stock < 10 ? 'font-semibold text-red-500' : ''}">${p.stock}</td>
                <td class="td whitespace-nowrap"><button type="button" class="btn-ghost" data-edit="${p.id}">Edit</button> <button type="button" class="btn-danger" data-del="${p.id}">Delete</button></td></tr>`).join('')}</tbody></table>`;
        $$('[data-edit]', list).forEach(b => b.onclick = () => openForm(data.find(p => p.id == b.dataset.edit)));
        $$('[data-del]', list).forEach(b => b.onclick = () => removeProduct(b.dataset.del));
    } catch (e) { list.innerHTML = errorHTML(e.message); }
}

function openForm(p) {
    editing = p;
    const v = k => esc(p?.[k] ?? '');
    const m = openModal(p ? 'Edit Product' : 'Add Product', `<form id="pf" class="space-y-4" novalidate>
        <div><label class="label" for="name">Name</label><input id="name" name="name" class="field" value="${v('name')}" required>${fieldErr('name')}</div>
        <div class="grid grid-cols-2 gap-4">
            <div><label class="label" for="category_id">Category</label><select id="category_id" name="category_id" class="field">${categories.map(c => `<option value="${c.id}" ${p?.category_id == c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('')}</select>${fieldErr('category_id')}</div>
            <div><label class="label" for="subtitle">Subtitle</label><input id="subtitle" name="subtitle" class="field" value="${v('subtitle')}">${fieldErr('subtitle')}</div></div>
        <div><label class="label" for="description">Description</label><textarea id="description" name="description" rows="3" class="field">${v('desc')}</textarea>${fieldErr('description')}</div>
        <div class="grid grid-cols-3 gap-4">
            <div><label class="label" for="price">Price (Rp)</label><input id="price" name="price" type="number" min="0" class="field" value="${v('price')}">${fieldErr('price')}</div>
            <div><label class="label" for="discount">Discount %</label><input id="discount" name="discount" type="number" min="0" max="90" class="field" value="${p?.discount ?? 0}">${fieldErr('discount')}</div>
            <div><label class="label" for="stock">Stock</label><input id="stock" name="stock" type="number" min="0" class="field" value="${p?.stock ?? 0}">${fieldErr('stock')}</div></div>
        <div><label class="label" for="benefits">Benefits (pisahkan dengan koma)</label><input id="benefits" name="benefits" class="field" value="${esc((p?.benefits || []).join(', '))}">${fieldErr('benefits')}</div>
        <div><label class="label" for="image">Image (JPG/PNG/WEBP, maks 2MB)${p ? ' — kosongkan untuk mempertahankan gambar lama' : ''}</label>
            <div class="flex items-center gap-4"><img id="preview" src="${p ? esc(imgSrc(p.image)) : '../images/logo-128.png'}" alt="Preview" class="size-16 object-cover border border-line">
            <input id="image" name="image" type="file" accept="image/*" class="text-sm"></div>${fieldErr('image')}</div>
        <div class="flex justify-end gap-2 pt-2"><button type="button" class="btn-ghost" data-close>Cancel</button><button type="submit" class="btn-primary">Save</button></div></form>`, { wide: true });

    $('#image', m).onchange = e => { const f = e.target.files[0]; if (f) $('#preview', m).src = URL.createObjectURL(f); };
    $('#pf', m).onsubmit = e => {
        e.preventDefault();
        submitForm(e.target, async () => {
            const fd = new FormData(e.target);
            if (!fd.get('image')?.size) fd.delete('image');
            if (editing) fd.append('_method', 'PATCH'); // PHP tidak mem-parsing multipart untuk PATCH
            await apiFetch(editing ? `/products/${editing.id}` : '/products', { method: 'POST', body: fd });
            bumpStoreCache(); closeModal(); toast(editing ? 'Produk diperbarui.' : 'Produk ditambahkan.'); loadProducts();
        });
    };
}

async function removeProduct(id) {
    if (!(await confirmBox('Hapus produk ini? Tindakan tidak bisa dibatalkan.'))) return;
    try { await apiFetch(`/products/${id}`, { method: 'DELETE' }); bumpStoreCache(); toast('Produk dihapus.'); loadProducts(); }
    catch (e) { toast(e.message, 'err'); }
}
