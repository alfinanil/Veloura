/* Orders: filter, ubah status, detail, hapus */
const STATUSES = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];

window.renderPage = function (main) {
    main.innerHTML = `<div class="mb-6 flex flex-wrap items-center gap-3">
        <input id="q" type="search" placeholder="Cari kode / pelanggan..." class="field max-w-xs" aria-label="Cari pesanan">
        <select id="st" class="field max-w-[180px]" aria-label="Filter status"><option value="">Semua status</option>${STATUSES.map(s => `<option value="${s}">${s}</option>`).join('')}</select></div>
        <section class="card overflow-x-auto" id="list"></section>`;
    $('#q').oninput = debounce(load);
    $('#st').onchange = load;
    load();
};

async function load() {
    const list = $('#list');
    list.innerHTML = loadingHTML();
    try {
        const { data } = await apiFetch('/orders?' + new URLSearchParams({ q: $('#q').value, status: $('#st').value }));
        if (!data.length) { list.innerHTML = emptyHTML('Tidak ada pesanan.'); return; }
        list.innerHTML = `<table class="w-full min-w-[760px]"><thead class="bg-brand-50/60"><tr>${['Order', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Actions'].map(h => `<th class="th">${h}</th>`).join('')}</tr></thead>
            <tbody class="divide-y divide-line">${data.map(o => `<tr><td class="td font-medium">#${esc(o.code)}</td><td class="td">${esc(o.customer_name)}</td><td class="td text-slate-500">${fmtDate(o.created_at)}</td>
            <td class="td">${o.items_count}</td><td class="td">${rupiah(o.total)}</td>
            <td class="td"><select class="field !w-auto !py-1" data-status="${o.id}" aria-label="Status pesanan ${esc(o.code)}">${STATUSES.map(s => `<option ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}</select></td>
            <td class="td whitespace-nowrap"><button type="button" class="btn-ghost" data-view="${o.id}">View</button> <button type="button" class="btn-danger" data-del="${o.id}">Delete</button></td></tr>`).join('')}</tbody></table>`;
        $$('[data-status]', list).forEach(s => s.onchange = async () => {
            try { await apiFetch(`/orders/${s.dataset.status}/status`, { method: 'PATCH', body: { status: s.value } }); toast('Status diperbarui.'); }
            catch (e) { toast(e.message, 'err'); load(); }
        });
        $$('[data-view]', list).forEach(b => b.onclick = () => view(b.dataset.view));
        $$('[data-del]', list).forEach(b => b.onclick = async () => {
            if (!(await confirmBox('Hapus pesanan ini?'))) return;
            try { await apiFetch(`/orders/${b.dataset.del}`, { method: 'DELETE' }); toast('Pesanan dihapus.'); load(); } catch (e) { toast(e.message, 'err'); }
        });
    } catch (e) { list.innerHTML = errorHTML(e.message); }
}

async function view(id) {
    try {
        const { data: o } = await apiFetch(`/orders/${id}`);
        openModal(`Order #${o.code}`, `<dl class="grid grid-cols-2 gap-3 text-sm"><dt class="text-slate-500">Customer</dt><dd>${esc(o.customer_name)}</dd><dt class="text-slate-500">Date</dt><dd>${fmtDate(o.created_at)}</dd><dt class="text-slate-500">Status</dt><dd>${statusBadge(o.status)}</dd></dl>
            <table class="mt-5 w-full text-sm"><thead><tr class="border-b border-line text-left text-xs uppercase text-slate-500"><th class="py-2">Item</th><th>Qty</th><th class="text-right">Price</th></tr></thead>
            <tbody>${o.items.map(i => `<tr class="border-b border-line"><td class="py-2">${esc(i.name)}</td><td>${i.qty}</td><td class="text-right">${rupiah(i.price * i.qty)}</td></tr>`).join('')}</tbody></table>
            <p class="mt-4 text-right text-lg font-bold">Total: ${rupiah(o.total)}</p>`);
    } catch (e) { toast(e.message, 'err'); }
}
