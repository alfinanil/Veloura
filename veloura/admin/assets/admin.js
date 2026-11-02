/* ==========================================================================
   VELOURA ADMIN - SHARED LAYOUT, AUTH GUARD & HELPERS (JavaScript murni + DOM)
   ========================================================================== */

const ICONS = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    box: '<path d="M4 7h16v13H4z"/><path d="M3 4h18v3H3z"/><path d="M10 12h4"/>',
    order: '<path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.4c2 .7 3.5 2.4 3.5 5.6"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    out: '<path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
    dollar: '<path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', check: '<path d="M5 13l4 4L19 7"/>', heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', tag: '<path d="M3 12V3h9l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1"/>',
};
const icon = (name, cls = 'size-5') =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

const NAV = [
    { id: 'dashboard', href: 'index.html', label: 'Dashboard', icon: 'grid', group: 'MAIN MENU' },
    { id: 'products', href: 'products.html', label: 'Products', icon: 'box', group: 'MAIN MENU' },
    { id: 'categories', href: 'categories.html', label: 'Categories', icon: 'grid', group: 'MAIN MENU' },
    { id: 'orders', href: 'orders.html', label: 'Orders', icon: 'order', group: 'MAIN MENU' },
    { id: 'customers', href: 'customers.html', label: 'Customers', icon: 'users', group: 'MAIN MENU' },
    { id: 'settings', href: 'settings.html', label: 'Settings', icon: 'cog', group: 'OTHERS' },
];
const PAGE_META = {
    dashboard: u => ['Dashboard', `Welcome back, ${u.name}.`], products: () => ['Products', 'Manage your product catalog'],
    categories: () => ['Categories', 'Organize products into collections'], orders: () => ['Orders', 'Track and update customer orders'],
    customers: () => ['Customers', 'View and manage registered customers'], settings: () => ['Settings', 'Store information and account security'],
};

// ---------- helpers ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = escapeHTML;
const rupiah = n => 'Rp' + Math.round(Number(n) || 0).toLocaleString('id-ID');
const fmtDate = s => new Date(String(s).replace(' ', 'T')).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
const imgSrc = url => (!url ? '../images/logo-128.png' : /^https?:/.test(url) ? url : '../' + url);
const debounce = (fn, ms = 300) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const bumpStoreCache = () => { try { sessionStorage.removeItem('veloura-products-v4'); } catch (e) {} };

const STATUS_STYLE = {
    completed: 'bg-green-50 text-green-700', processing: 'bg-yellow-50 text-yellow-700', shipped: 'bg-blue-50 text-blue-700',
    pending: 'bg-slate-100 text-slate-600', cancelled: 'bg-red-50 text-red-600',
};
const statusBadge = s => `<span class="badge ${STATUS_STYLE[s] || STATUS_STYLE.pending}">${esc(s[0].toUpperCase() + s.slice(1))}</span>`;

function toast(message, type = 'ok') {
    const t = document.createElement('div');
    t.className = `rounded-md px-4 py-3 text-sm font-medium text-white shadow-lg ${type === 'ok' ? 'bg-brand-600' : 'bg-red-600'}`;
    t.textContent = message;
    $('#toast-root').appendChild(t);
    setTimeout(() => t.remove(), 3000);
}

const loadingHTML = (text = 'Memuat data...') => `<div class="py-16 text-center text-sm text-slate-500"><span class="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600 align-[-3px]"></span>${text}</div>`;
const errorHTML = msg => `<div class="py-16 text-center"><p class="text-3xl">⚠️</p><p class="mt-2 font-semibold">Gagal memuat data</p><p class="mt-1 text-sm text-slate-500">${esc(msg)}</p><button type="button" class="btn-primary mt-4" onclick="location.reload()">Coba lagi</button></div>`;
const emptyHTML = text => `<p class="py-12 text-center text-sm text-slate-500">${esc(text)}</p>`;

/** Modal generik: body berisi HTML (sudah di-escape oleh pemanggil). Mengembalikan elemen modal. */
function openModal(title, bodyHTML, { wide = false } = {}) {
    closeModal();
    const wrap = document.createElement('div');
    wrap.id = 'modal';
    wrap.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4';
    wrap.innerHTML = `<div class="max-h-[90vh] w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} overflow-y-auto bg-white shadow-xl" role="dialog" aria-modal="true" aria-label="${esc(title)}">
        <div class="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 class="font-serif text-xl">${esc(title)}</h2>
            <button type="button" data-close class="text-2xl leading-none text-slate-400 hover:text-ink" aria-label="Tutup">&times;</button>
        </div><div class="px-6 py-5">${bodyHTML}</div></div>`;
    wrap.addEventListener('click', e => { if (e.target === wrap || e.target.closest('[data-close]')) closeModal(); });
    $('#modal-root').appendChild(wrap);
    return wrap;
}
const closeModal = () => $('#modal')?.remove();

function confirmBox(message) {
    return new Promise(resolve => {
        const m = openModal('Konfirmasi', `<p class="text-sm text-slate-600">${esc(message)}</p>
            <div class="mt-6 flex justify-end gap-2"><button type="button" class="btn-ghost" data-close>Batal</button><button type="button" id="confirm-yes" class="btn-primary">Ya, lanjutkan</button></div>`);
        $('#confirm-yes', m).onclick = () => { closeModal(); resolve(true); };
        m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-close]')) resolve(false); });
    });
}

/** Tampilkan error validasi 422 per field di elemen [data-error="nama_field"]. */
function showFieldErrors(form, errors = {}) {
    $$('[data-error]', form).forEach(el => { el.textContent = errors[el.dataset.error]?.[0] || ''; });
}

/** Jalankan aksi async pada tombol submit dengan loading state + penanganan error/422. */
async function submitForm(form, action) {
    const btn = $('button[type="submit"]', form);
    const label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Menyimpan...';
    showFieldErrors(form);
    try { await action(); }
    catch (e) {
        if (e.status === 422) showFieldErrors(form, e.errors); else toast(e.message, 'err');
    } finally { btn.disabled = false; btn.textContent = label; }
}

const fieldErr = name => `<p data-error="${name}" class="mt-1 text-xs text-red-600"></p>`;

// ---------- layout ----------
function renderShell(user, page) {
    const groups = [...new Set(NAV.map(n => n.group))];
    $('#sidebar').innerHTML = `
        <a href="index.html" class="flex items-center gap-3 border-b border-line px-8 py-6">
            <img src="../images/logo-128.png" alt="Logo Veloura" class="size-11 object-contain">
            <span class="font-serif text-2xl tracking-[0.2em]">VELOURA</span>
        </a>
        <nav class="flex-1 overflow-y-auto px-4 py-8">${groups.map((g, i) => `
            ${i ? '<hr class="my-6 border-line">' : ''}
            <p class="mb-4 px-4 text-xs font-bold tracking-[0.25em] text-slate-400">${g}</p>
            <ul class="space-y-2">${NAV.filter(n => n.group === g).map(n => `
                <li><a href="${n.href}" class="flex items-center gap-3 rounded-md px-4 py-3 text-[15px] transition ${n.id === page ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-brand-50'}" ${n.id === page ? 'aria-current="page"' : ''}>${icon(n.icon)}${n.label}</a></li>`).join('')}
            </ul>`).join('')}
        </nav>
        <div class="border-t border-line p-4">
            <button type="button" id="logout-btn" class="flex w-full cursor-pointer items-center gap-3 rounded-md px-4 py-3 text-[15px] text-slate-700 hover:bg-brand-50">${icon('out')}Logout</button>
        </div>`;

    const [title, sub] = PAGE_META[page](user);
    $('#topbar').innerHTML = `
        <div class="flex items-center gap-4">
            <button type="button" id="menu-btn" class="cursor-pointer lg:hidden" aria-label="Buka menu">${icon('menu', 'size-6')}</button>
            <div><h1 class="font-serif text-2xl sm:text-3xl">${esc(title)}</h1><p class="text-sm text-slate-500">${esc(sub)}</p></div>
        </div>
        <div class="flex items-center gap-3">
            <span class="grid size-12 place-items-center rounded-full bg-brand-100 text-brand-600">${icon('user')}</span>
            <div class="hidden text-sm sm:block"><p class="font-medium">${esc(user.name)}</p><p class="text-xs text-slate-500">Admin</p></div>
        </div>`;

    const toggle = open => { $('#sidebar').classList.toggle('-translate-x-full', !open); $('#backdrop').classList.toggle('hidden', !open); };
    $('#menu-btn').onclick = () => toggle(true);
    $('#backdrop').onclick = () => toggle(false);
    $('#logout-btn').onclick = async () => {
        try { await apiFetch('/auth/logout', { method: 'POST' }); } catch (e) {}
        clearSession();
        location.href = '../login.html';
    };
}

/** Route guard: wajib login & role admin (diverifikasi server lewat GET /auth/me). */
async function guardAdmin() {
    if (!getToken()) { location.href = '../login.html'; return null; }
    try {
        const { data } = await apiFetch('/auth/me');
        if (data.role !== 'admin') { location.href = '../index.html'; return null; }
        return data;
    } catch (e) {
        if (e.status === 0) { document.body.innerHTML = `<div class="p-10">${errorHTML(e.message)}</div>`; }
        return null;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const page = document.body.dataset.page;
    const user = await guardAdmin();
    if (!user) return;
    renderShell(user, page);
    window.renderPage($('#content'), user);
});
