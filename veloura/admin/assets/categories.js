/* Categories: CRUD sederhana */
window.renderPage = async function (main) {
    main.innerHTML = `<div class="mb-6 flex"><button type="button" id="add" class="btn-primary ml-auto">${icon('plus', 'size-4')} Add Category</button></div><section class="card overflow-x-auto" id="list"></section>`;
    $('#add').onclick = () => openForm(null);
    load();
};

async function load() {
    const list = $('#list');
    list.innerHTML = loadingHTML();
    try {
        const { data } = await apiFetch('/categories', { auth: false });
        list.innerHTML = data.length ? `<table class="w-full min-w-[560px]"><thead class="bg-brand-50/60"><tr>${['Name', 'Description', 'Products', 'Actions'].map(h => `<th class="th">${h}</th>`).join('')}</tr></thead>
            <tbody class="divide-y divide-line">${data.map(c => `<tr><td class="td font-medium">${esc(c.name)}</td><td class="td text-slate-500">${esc(c.description || '-')}</td><td class="td">${c.products_count}</td>
            <td class="td whitespace-nowrap"><button type="button" class="btn-ghost" data-edit="${c.id}">Edit</button> <button type="button" class="btn-danger" data-del="${c.id}">Delete</button></td></tr>`).join('')}</tbody></table>` : emptyHTML('Belum ada kategori.');
        $$('[data-edit]', list).forEach(b => b.onclick = () => openForm(data.find(c => c.id == b.dataset.edit)));
        $$('[data-del]', list).forEach(b => b.onclick = async () => {
            if (!(await confirmBox('Hapus kategori ini? Produk di dalamnya akan menjadi tanpa kategori.'))) return;
            try { await apiFetch(`/categories/${b.dataset.del}`, { method: 'DELETE' }); bumpStoreCache(); toast('Kategori dihapus.'); load(); } catch (e) { toast(e.message, 'err'); }
        });
    } catch (e) { list.innerHTML = errorHTML(e.message); }
}

function openForm(c) {
    const m = openModal(c ? 'Edit Category' : 'Add Category', `<form class="space-y-4" novalidate>
        <div><label class="label" for="name">Name</label><input id="name" name="name" class="field" value="${esc(c?.name || '')}">${fieldErr('name')}</div>
        <div><label class="label" for="description">Description</label><input id="description" name="description" class="field" value="${esc(c?.description || '')}">${fieldErr('description')}</div>
        <div class="flex justify-end gap-2"><button type="button" class="btn-ghost" data-close>Cancel</button><button type="submit" class="btn-primary">Save</button></div></form>`);
    $('form', m).onsubmit = e => {
        e.preventDefault();
        submitForm(e.target, async () => {
            await apiFetch(c ? `/categories/${c.id}` : '/categories', { method: c ? 'PATCH' : 'POST', body: Object.fromEntries(new FormData(e.target)) });
            bumpStoreCache(); closeModal(); toast('Kategori disimpan.'); load();
        });
    };
}
