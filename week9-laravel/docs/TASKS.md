# Task Week 9 di Veloura

Materi Week 9 memakai tema PresidentKu (entitas **Program**). Di Veloura entitasnya **Product**
(`programs` -> `products`, `nama` -> `name`, `deskripsi` -> `description`).
Tema, warna, logo, dan data tetap Veloura.

## Task 01 - Create Database Structure
Migration: `database/migrations/2026_11_24_000002_create_products_table.php`
(kolom minimal sama dengan slide: `id`, `name`, `description`, `timestamps`; ditambah kolom khas Veloura: harga, diskon, stok, gambar, kategori).
```bat
php artisan migrate
```
- [ ] Migration berhasil, tabel `products` ada, tanpa error

## Task 02 - Build Product Model
Model: `app/Models/Product.php` (`extends Model`, ada `$fillable`).
Uji Eloquent (versi Veloura dari contoh di slide):
- http://127.0.0.1:8000/test-eloquent -> `Product::all()` (banyak object) dan `Product::find(1)` (satu object)
- http://127.0.0.1:8000/test-eloquent?create=1 -> ditambah `Product::create()`, lalu cek barisnya di database
- [ ] `all()` berhasil  - [ ] `find()` berhasil  - [ ] `create()` berhasil  - [ ] data masuk database

## Task 03 - Build Product CRUD (Product Management)
http://127.0.0.1:8000/products

| CRUD | Fitur Veloura |
|---|---|
| Create | Tambah Produk |
| Read | Daftar Produk |
| Update | Edit Produk |
| Delete | Hapus Produk (konfirmasi) |

Kode di `routes/web.php`, tampilan di `resources/views/products/`.
Data selalu dari database, bukan hard-code di HTML.

## Demo (slide 14)
1. Tunjukkan tabel `products` di HeidiSQL.
2. Tambah produk, lalu data bertambah di database.
3. Buka daftar produk, lalu data tampil.
4. Edit produk, lalu data berubah.
5. Hapus produk, lalu data berkurang.
6. Tunjukkan kode: migration, model, Eloquent.

Jawaban refleksi: `docs/REVIEW.md`.
