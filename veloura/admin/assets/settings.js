/* Settings: info toko (PATCH /admin/settings) + ganti password */
window.renderPage = async function (main) {
    main.innerHTML = loadingHTML();
    let s;
    try { ({ data: s } = await apiFetch('/admin/settings')); } catch (e) { main.innerHTML = errorHTML(e.message); return; }
    const f = (name, label, type = 'text') => `<div><label class="label" for="${name}">${label}</label><input id="${name}" name="${name}" type="${type}" class="field" value="${esc(s[name] ?? '')}">${fieldErr(name)}</div>`;

    main.innerHTML = `<div class="grid gap-6 xl:grid-cols-2">
        <section class="card p-6" aria-labelledby="si"><h2 id="si" class="font-serif text-2xl">Store Information</h2>
            <form id="store-form" class="mt-5 space-y-4" novalidate>${f('store_name', 'Store name')}${f('store_email', 'Email', 'email')}${f('store_phone', 'Phone')}${f('store_address', 'Address')}
            ${f('free_shipping_threshold', 'Free shipping threshold (Rp)', 'number')}${f('promo_code', 'Promo code')}<button type="submit" class="btn-primary">Save changes</button></form></section>
        <section class="card p-6 self-start" aria-labelledby="pw"><h2 id="pw" class="font-serif text-2xl">Change Password</h2>
            <form id="pw-form" class="mt-5 space-y-4" novalidate>
            <div><label class="label" for="current_password">Current password</label><input id="current_password" name="current_password" type="password" class="field">${fieldErr('current_password')}</div>
            <div><label class="label" for="new_password">New password</label><input id="new_password" name="new_password" type="password" class="field">${fieldErr('new_password')}</div>
            <button type="submit" class="btn-primary">Update password</button></form></section></div>`;

    $('#store-form').onsubmit = e => { e.preventDefault(); submitForm(e.target, async () => { await apiFetch('/admin/settings', { method: 'PATCH', body: Object.fromEntries(new FormData(e.target)) }); toast('Pengaturan disimpan.'); }); };
    $('#pw-form').onsubmit = e => { e.preventDefault(); submitForm(e.target, async () => { await apiFetch('/auth/change-password', { method: 'POST', body: Object.fromEntries(new FormData(e.target)) }); e.target.reset(); toast('Password diperbarui.'); }); };
};
