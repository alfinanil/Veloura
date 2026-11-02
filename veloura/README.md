# Veloura Beauty — Storefront + Admin Dashboard + REST API

Proyek Pemrograman Web (Modul 1–6, Lab Informatika UMM).

## Penerapan Modul
| Modul | Penerapan |
|---|---|
| 1 – Web modern | HTML5 semantik, **Tailwind CSS v4** (`src/main.css` + `@theme`) untuk Admin Dashboard, Flexbox/Grid, responsif `sm: md: lg: xl:` |
| 2 – JavaScript & DOM | Manipulasi DOM, `fetch` async/await, event listener, `localStorage`, status HTTP, `escapeHTML` anti-XSS |
| 3 – PHP prosedural & OOP | `backend/src`: class, constructor promotion, encapsulation, inheritance (`Model`, `Controller`), interface `Middleware`, namespace PSR-4 + autoloader, type hinting & return type |
| 4 – REST API & ORM | CRUD produk/kategori/pesanan/pelanggan, validasi 422, model ala Eloquent, migration + seeder, resource JSON |
| 5 – Auth, middleware, storage | JWT HS256, `AuthMiddleware` & `AdminMiddleware`, role admin/customer, upload gambar, CORS |
| 6 – Integrasi, dokumentasi, deploy | `api.js` (base URL terpusat), loading/error state, token Bearer, logout mencabut token, README, `.env.example`, `docs/API.md`, Postman collection |

## Struktur
```
veloura/
├── index.html shop.html product.html login.html + api.js common.js login.js ...  # storefront
├── admin/            # dashboard admin (Tailwind v4)
├── src/main.css      # sumber Tailwind (@theme) -> admin/assets/output.css
├── backend/          # REST API PHP OOP (SQLite): public/index.php, src/{Core,Models,Controllers,Middleware}
├── docs/             # API.md + Veloura.postman_collection.json
└── images/           # logo.png, logo-128.png, favicon.png, ...
```

## Menjalankan (lokal)
Kebutuhan: PHP 8.1+ (`pdo_sqlite`, `fileinfo`). Node.js hanya jika ingin mengubah Tailwind.

1. **Backend**
   ```bash
   cd backend
   cp .env.example .env     # ganti JWT_SECRET: php -r "echo bin2hex(random_bytes(32));"
   php -S localhost:8000 -t public public/index.php
   ```
   Database SQLite dibuat & di-seed otomatis pada request pertama.
2. **Frontend**: buka folder proyek dengan VS Code **Live Server** (port 5501) lalu buka `index.html`.
3. *(Opsional)* `npm install && npm run dev:css` untuk mengubah desain admin (`npm run build:css` untuk produksi).

### Akun demo
| Role | Email | Password |
|---|---|---|
| Admin | admin@veloura.com | admin123 |
| Customer | sarah@mail.com | password123 |

Login admin → otomatis ke `admin/index.html`. Customer yang checkout → pesanan muncul di Admin → Orders.

## Deploy (opsional)
- **Backend → Railway**: Root Directory `backend`, start command `php -S 0.0.0.0:$PORT -t public public/index.php`. Variables: `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://<domain-railway>`, `JWT_SECRET` baru, `CORS_ALLOWED_ORIGINS=https://<domain-vercel>`. Pasang **Volume** untuk `storage/uploads` dan folder `database` agar data tidak hilang saat redeploy.
- **Frontend → Vercel**: Preset *Other*, tanpa build command. Ubah `API_ORIGIN` di `api.js` ke domain Railway.

## Catatan keamanan
Token JWT di `localStorage` (penyederhanaan pembelajaran, lihat Modul 6). Teks pengguna di-escape sebelum `innerHTML`. Password di-hash, upload divalidasi MIME asli & ukuran.
