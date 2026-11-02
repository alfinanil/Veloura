/* ==========================================================================
   VELOURA - API CLIENT (Modul 6: base URL terpusat, fetch, JWT, error handling)
   ========================================================================== */

// Ganti ke URL backend production (Railway) saat deploy, atau set window.VELOURA_API_ORIGIN sebelum script ini.
const API_ORIGIN = window.VELOURA_API_ORIGIN ||
    (['localhost', '127.0.0.1', ''].includes(location.hostname) ? 'http://localhost:8000' : 'https://GANTI-DENGAN-BACKEND-ANDA.up.railway.app');
const API_URL = API_ORIGIN + '/api';
const TOKEN_KEY = 'veloura-token';
const USER_KEY = 'veloura-user-session';
const SITE_ROOT = window.VELOURA_ROOT || ''; // '../' di halaman admin

const getToken = () => localStorage.getItem(TOKEN_KEY);
const getSessionUser = () => { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch (e) { return null; } };

function saveSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

/** Cegah XSS: selalu escape teks buatan pengguna sebelum masuk innerHTML. */
function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/**
 * Pembungkus fetch. Mengembalikan body JSON bila sukses; melempar ApiError berisi status & error per field (422).
 * Body berupa FormData dikirim tanpa Content-Type manual (browser mengisi boundary).
 */
class ApiError extends Error {
    constructor(message, status = 0, errors = {}) {
        super(message);
        this.status = status;
        this.errors = errors;
    }
}

async function apiFetch(path, { method = 'GET', body = null, auth = true } = {}) {
    const headers = { Accept: 'application/json' };
    const token = getToken();
    if (auth && token) headers.Authorization = `Bearer ${token}`;

    let payload = body;
    if (body && !(body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
        payload = JSON.stringify(body);
    }

    let response;
    try {
        response = await fetch(API_URL + path, { method, headers, body: payload });
    } catch (e) {
        throw new ApiError('Server API tidak dapat dihubungi. Pastikan backend berjalan dan CORS sudah benar.');
    }

    const result = await response.json().catch(() => ({}));
    if (response.status === 401 && auth && token) {
        clearSession();
        if (!location.pathname.endsWith('login.html')) location.href = SITE_ROOT + 'login.html';
    }
    if (!response.ok) throw new ApiError(result.message || `Error ${response.status}`, response.status, result.errors || {});
    return result;
}
