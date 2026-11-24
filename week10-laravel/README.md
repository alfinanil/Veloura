# Veloura - Week 10: Controller, Routing & Validation

Lanjutan Sprint 07 (Week 9). Database, tabel, dan Model **sama dengan Week 9**; yang berubah adalah alur aplikasinya:

```
USER -> Route -> Controller -> Validation -> Model -> Eloquent -> Database -> View / JSON
```
Pemetaan dari materi: *Program PresidentKu* -> **Product Veloura** (sama seperti Week 9).

## Cara menjalankan
1. Letakkan folder `week10-laravel` ini di `D:\INFORMATIC\laragon\www\veloura\` (sejajar dengan `week9-laravel`).
2. Laragon -> **Start All** (MySQL harus hidup).
3. Buka Terminal Laragon / VS Code:
   ```bat
   cd D:\INFORMATIC\laragon\www\veloura\week10-laravel
   setup.bat
   php artisan serve
   ```
4. Web: http://127.0.0.1:8000/products  |  API: http://127.0.0.1:8000/api/products

`setup.bat` memakai kerangka Laravel dari `week9-laravel` kalau ada (tanpa download). Kalau tidak ada, ia mengunduh Laravel via Composer (butuh internet).
Database `veloura` dan tabelnya sama dengan Week 9, jadi data tidak ganda.

Cek semua route: `php artisan route:list` (harus ada `api/products`).

## Isi Week 10
| Tugas | File |
|---|---|
| Task 01 - CRUD ke Controller | `app/Http/Controllers/ProductController.php`, `routes/web.php` |
| Task 02 - Request & Validation | `ProductController@store/update` + `app/Support/ProductRules.php` (required, max:100, dst.). Error tampil di form (`@error`) |
| Task 03 - RESTful Product API | `app/Http/Controllers/Api/ProductController.php`, `routes/api.php` (`apiResource`) |
| Mengaktifkan route API | `bootstrap/app.php` (`api: routes/api.php`, error `/api/*` berbentuk JSON) |
| API testing | `docs/Veloura-Week10.postman_collection.json` |
| Jawaban review | `docs/REVIEW.md` |

## Endpoint API
| Method | URL | Status |
|---|---|---|
| GET | `/api/products` | 200 |
| POST | `/api/products` | 201 / 422 |
| GET | `/api/products/{id}` | 200 / 404 |
| PUT | `/api/products/{id}` | 200 / 404 / 422 |
| DELETE | `/api/products/{id}` | 200 / 404 |
| GET | `/api/categories` | 200 (bantuan untuk `category_id`) |

Body POST/PUT (JSON): `name`, `category_id`, `description`, `price`, `discount`, `stock` wajib; `subtitle`, `image` opsional.

## Uji
**Browser** (`/products`): Tambah dengan form kosong -> muncul "Nama produk wajib diisi." dst. Isi nama > 100 karakter -> "Nama produk maksimal 100 karakter.". Isian valid -> tersimpan.

**Postman**: Import `docs/Veloura-Week10.postman_collection.json`, lalu Run collection. Urutan 00-08 mewakili slide Demo & API Testing; setiap request punya cek status otomatis (200, 201, 200, 200, 200, 422, 422, 404).

## Checklist Sprint 08
- [ ] Controller dibuat, CRUD dipindahkan, Controller menerima Request
- [ ] Routing GET, POST, PUT, DELETE
- [ ] Validation: required, max length, validation error, data valid tersimpan
- [ ] REST API: GET, POST, GET detail, UPDATE, DELETE, JSON response
- [ ] HTTP: status code tepat, endpoint diuji, API testing berhasil
- [ ] Commit & Push

## Commit & Push
Dari root repo (`veloura`):
```bat
cd D:\INFORMATIC\laragon\www\veloura
git add week10-laravel
git commit -m "Week 10: Controller, Routing, Validation, REST API produk"
git push origin main
```
