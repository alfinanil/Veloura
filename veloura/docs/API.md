# Dokumentasi Endpoint API Veloura

Base URL lokal: `http://localhost:8000/api` · Format: JSON · Auth: `Authorization: Bearer <token JWT>`
Respons sukses: `{ "message": "...", "data": ... }` · Error validasi: status `422` + `{ "message", "errors": { field: [pesan] } }`

| Method | Endpoint | Auth | Role | Deskripsi |
|---|---|---|---|---|
| POST | /auth/register | Tidak | - | Daftar akun baru (role `customer`), mengembalikan token |
| POST | /auth/login | Tidak | - | Login, mengembalikan token JWT |
| GET | /auth/me | Ya (Bearer) | Semua | Profil pengguna aktif |
| POST | /auth/logout | Ya (Bearer) | Semua | Mencabut token di server (blacklist `jti`) |
| POST | /auth/change-password | Ya (Bearer) | Semua | Ganti password |
| GET | /products | Tidak | - | Daftar produk (`?q=`, `?category=`) |
| GET | /products/{id} | Tidak | - | Detail produk |
| POST | /products | Ya (Bearer) | admin | Tambah produk (multipart/form-data, field `image` opsional) |
| PATCH | /products/{id} | Ya (Bearer) | admin | Ubah produk. Dengan file: kirim `POST` + field `_method=PATCH` |
| DELETE | /products/{id} | Ya (Bearer) | admin | Hapus produk |
| GET | /categories | Tidak | - | Daftar kategori + jumlah produk |
| POST | /categories | Ya (Bearer) | admin | Tambah kategori |
| PATCH | /categories/{id} | Ya (Bearer) | admin | Ubah kategori |
| DELETE | /categories/{id} | Ya (Bearer) | admin | Hapus kategori |
| POST | /orders | Ya (Bearer) | Semua | Checkout `{ items: [{ id, qty }] }`; harga dihitung server |
| GET | /orders | Ya (Bearer) | admin | Daftar pesanan (`?status=`, `?q=`) |
| GET | /orders/{id} | Ya (Bearer) | admin | Detail pesanan + item |
| PATCH | /orders/{id}/status | Ya (Bearer) | admin | Ubah status: pending, processing, shipped, completed, cancelled |
| DELETE | /orders/{id} | Ya (Bearer) | admin | Hapus pesanan |
| GET | /customers | Ya (Bearer) | admin | Daftar pelanggan (`?q=`) |
| GET | /customers/{id} | Ya (Bearer) | admin | Detail + riwayat pesanan |
| PATCH | /customers/{id} | Ya (Bearer) | admin | Ubah nama, telepon, status aktif |
| DELETE | /customers/{id} | Ya (Bearer) | admin | Hapus pelanggan |
| GET | /admin/dashboard | Ya (Bearer) | admin | Statistik, pesanan terbaru, stok menipis |
| GET | /admin/settings | Ya (Bearer) | admin | Pengaturan toko |
| PATCH | /admin/settings | Ya (Bearer) | admin | Simpan pengaturan toko |

Status HTTP: `200/201` sukses · `401` belum login/token tidak valid · `403` bukan admin · `404` tidak ditemukan · `422` validasi gagal · `500` error server.
