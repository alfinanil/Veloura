/* Customers: cari, detail + riwayat pesanan, edit, aktif/nonaktif, hapus */
window.renderPage = function (main) {
    main.innerHTML = `<div class="mb-6"><input id="q" type="search" placeholder="Cari nama / email..." class="field max-w-xs" aria-label="Cari pelanggan"></div><section class="card overflow-x-auto" id="list"></section>`;
    $('#q').oninput = debounce(load);
    load();
};

async function load() {
    const list = $('#list');
    list.innerHTML = loadingHTML();
    try {
        const { data } = await apiFetch('/customers?q=' + encodeURIComponent($('#q').value));
        if (!data.length) { list.innerHTML = emptyHTML('Tidak ada pelanggan.'); return; }
        list.innerHTML = `<table class="w-full min-w-[820px]"><thead class="bg-brand-50/60"><tr>${['Customer', 'Phone', 'Orders', 'Total Spent', 'Joined', 'Status', 'Actions'].map(h => `<th class="th">${h}</th>`).join('')}</tr></thead>
            <tbody class="divide-y divide-line">${data.map(c => `<tr><td class="td"><p class="font-medium">${esc(c.name)}</p><p class="text-xs text-slate-500">${esc(c.email)}</p></td><td class="td">${esc(c.phone || '-')}</td>
            <td class="td">${c.orders_count}</td><td class="td">${rupiah(c.total_spent)}</td><td class="td text-slate-500">${fmtDate(c.created_at)}</td>
            <td class="td"><span class="badge ${c.active ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}">${c.active ? 'Active' : 'Disabled'}</span></td>
            <td class="td whitespace-nowrap"><button type="button" class="btn-ghost" data-view="${c.id}">View</button> <button type="button" class="btn-ghost" data-edit="${c.id}">Edit</button>
            <button type="button" class="btn-ghost" data-toggle="${c.id}">${c.active ? 'Disable' : 'Enable'}</button> <button type="button" class="btn-danger" data-del="${c.id}">Delete</button></td></tr>`).join('')}</tbody></table>`;
        const find = id => data.find(c => c.id == id);
        $$('[data-view]', list).forEach(b => b.onclick = () => view(b.dataset.view));
        $$('[data-edit]', list).forEach(b => b.onclick = () => edit(find(b.dataset.edit)));
        $$('[data-toggle]', list).forEach(b => b.onclick = async () => {
            const c = find(b.dataset.toggle);
            try { await apiFetch(`/customers/${c.id}`, { method: 'PATCH', body: { name: c.name, phone: c.phone || '', active: c.active ? '0' : '1' } }); toast('Status pelanggan diperbarui.'); load(); } catch (e) { toast(e.message, 'err'); }
        });
        $$('[data-del]', list).forEach(b => b.onclick = async () => {
            if (!(await confirmBox('Hapus pelanggan ini? Riwayat pesanan tetap tersimpan.'))) return;
            try { await apiFetch(`/customers/${b.dataset.del}`, { method: 'DELETE' }); toast('Pelanggan dihapus.'); load(); } catch (e) { toast(e.message, 'err'); }
        });
    } catch (e) { list.innerHTML = errorHTML(e.message); }
}

async function view(id) {
    try {
        const { data: c } = await apiFetch(`/customers/${id}`);
        openModal(c.name, `<p class="text-sm text-slate-500">${esc(c.email)} · ${esc(c.phone || '-')}</p><h3 class="mt-5 font-serif text-lg">Order history</h3>
            ${c.orders.length ? `<ul class="mt-2 divide-y divide-line text-sm">${c.orders.map(o => `<li class="flex items-center justify-between py-2"><span>#${esc(o.code)} · ${fmtDate(o.created_at)}</span><span>${rupiah(o.total)} ${statusBadge(o.status)}</span></li>`).join('')}</ul>` : emptyHTML('Belum ada pesanan.')}`);
    } catch (e) { toast(e.message, 'err'); }
}

function edit(c) {
    const m = openModal('Edit Customer', `<form class="space-y-4" novalidate>
        <div><label class="label" for="name">Name</label><input id="name" name="name" class="field" value="${esc(c.name)}">${fieldErr('name')}</div>
        <div><label class="label" for="phone">Phone</label><input id="phone" name="phone" class="field" value="${esc(c.phone || '')}">${fieldErr('phone')}</div>
        <div class="flex justify-end gap-2"><button type="button" class="btn-ghost" data-close>Cancel</button><button type="submit" class="btn-primary">Save</button></div></form>`);
    $('form', m).onsubmit = e => {
        e.preventDefault();
        submitForm(e.target, async () => {
            await apiFetch(`/customers/${c.id}`, { method: 'PATCH', body: { ...Object.fromEntries(new FormData(e.target)), active: c.active ? '1' : '0' } });
            closeModal(); toast('Pelanggan diperbarui.'); load();
        });
    };
}
