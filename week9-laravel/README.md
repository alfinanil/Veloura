# Veloura - Week 9: Laravel + CRUD + Database

Pemindahan pengelolaan data **produk Veloura** dari PHP manual ke **Laravel + MySQL (Laragon)**.
Pemetaan dari materi: *Program PresidentKu* -> **Product Veloura** (`nama` -> `name`, `deskripsi` -> `description`).

## Cara menjalankan (Laragon)

1. Letakkan folder `veloura` ini di `C:\laragon\www\`.
2. Buka Laragon, klik **Start All** (Apache/Nginx + MySQL harus hidup).
3. Klik tombol **Terminal** di Laragon, lalu:
   ```bat
   cd C:\laragon\www\veloura\week9-laravel
   setup.bat
   php artisan serve
   ```
4. Buka http://127.0.0.1:8000

`setup.bat` otomatis: mengunduh kerangka Laravel 12 (butuh internet), membuat `.env` dan `APP_KEY`,
membuat database `veloura`, lalu menjalankan `migrate --seed`. File Week 9 di folder ini tidak ditimpa.

Butuh PHP 8.2+ (Laragon terbaru sudah memenuhi). Kalau Composer menolak karena versi PHP, ganti di Laragon: Menu > PHP > Version.

### Atau manual
```bat
composer create-project laravel/laravel:^12.0 _skeleton --no-scripts
robocopy _skeleton . /E /XC /XN /XO
rmdir /s /q _skeleton
copy .env.example .env
php artisan key:generate
mysql -uroot -e "CREATE DATABASE IF NOT EXISTS veloura"
php artisan migrate --seed
php artisan serve
```

## Isi Week 9

| Materi | File |
|---|---|
| Migration | `database/migrations/*_create_categories_table.php`, `*_create_products_table.php` |
| Model + `$fillable` | `app/Models/Product.php`, `app/Models/Category.php` |
| Relasi sederhana | `Category hasMany Product`, `Product belongsTo Category` |
| Eloquent ORM | `Product::all/find/create/update/delete` dipakai di `routes/web.php` |
| Seeder (data awal dari database) | `database/seeders/*` (4 kategori, 8 produk dari backend Veloura lama) |
| Route + CRUD | `routes/web.php` |
| View (Blade) | `resources/views/layouts`, `resources/views/products` |
| Tampilan Veloura | `public/css/veloura.css`, warna & font sama dengan admin Veloura |

### Route CRUD

| Method | URL | Fungsi |
|---|---|---|
| GET | `/products` | READ - daftar produk |
| GET | `/products/create` | form tambah |
| POST | `/products` | CREATE - simpan |
| GET | `/products/{id}/edit` | form edit |
| PUT | `/products/{id}` | UPDATE - simpan perubahan |
| DELETE | `/products/{id}` | DELETE - hapus (ada konfirmasi) |

Sesuai catatan di materi, Controller dan Validation mendalam baru dibahas di Pertemuan 10.
Karena itu route langsung memakai Model Eloquent, dan validasinya sengaja sederhana.

## Checklist Sprint 07

Ditandai setelah kamu menjalankan `setup.bat` dan mencoba di browser.

- [ ] Laravel berjalan (`php artisan serve`)
- [ ] Database terhubung (`setup.bat` tanpa error)
- [ ] Migration dibuat -> sudah ada di repo
- [ ] Table `products` tersedia -> cek di HeidiSQL
- [ ] Model `Product` dibuat -> sudah ada di repo
- [ ] Create, Read, Update, Delete berhasil di browser
- [ ] Data berasal dari database (tidak hard-code)
- [ ] Halaman Veloura sebelumnya tidak berubah (folder lama tidak disentuh)
- [ ] Commit & Push

## Commit & Push

Dijalankan dari root repo (`veloura`), setelah `setup.bat` berhasil.
`.gitignore` di folder ini sudah mengecualikan `vendor/` dan `.env`.

```bat
cd C:\laragon\www\veloura
git add week9-laravel
git commit -m "Week 9: Laravel + Migration + Model + Eloquent CRUD produk"
git push origin main
```

Panduan Task 01-03 dan demo: `docs/TASKS.md`. Jawaban refleksi (slide Review): `docs/REVIEW.md`.
