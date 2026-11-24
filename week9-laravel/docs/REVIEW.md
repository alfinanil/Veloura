# Review Week 9 - What Did You Learn?

Draft jawaban, silakan diedit dengan bahasamu sendiri.

**1. Apa fungsi Migration?**
Migration mendefinisikan dan mengelola struktur tabel database lewat kode PHP, bukan membuat tabel manual di phpMyAdmin.
Perubahan struktur tercatat di repo dan bisa dijalankan ulang dengan `php artisan migrate`.
Di Veloura: tabel `categories` dan `products`.

**2. Apa fungsi Model?**
Model merepresentasikan satu tabel dalam bentuk class. `Product` mewakili tabel `products`,
berisi `$fillable` (kolom yang boleh diisi) dan relasi ke `Category`.

**3. Apa fungsi Eloquent?**
Eloquent adalah ORM Laravel: data database diakses sebagai object lewat Model,
tanpa menulis query SQL manual seperti `SELECT * FROM products`.

**4. Apa perbedaan `Product::all()` dan `Product::find(1)`?**
`Product::all()` mengambil semua baris dan mengembalikan banyak object (collection).
`Product::find(1)` mengambil satu baris berdasarkan id dan mengembalikan satu object (atau `null` jika tidak ada).

**5. Apa yang dimaksud CRUD?**
Create (tambah data), Read (tampilkan data), Update (ubah data), Delete (hapus data).
Di Veloura: tambah produk, lihat daftar produk, edit produk, hapus produk.

**Pertanyaan utama: apa yang berubah ketika Veloura mulai menggunakan database?**
Data tidak lagi di-hardcode di file (seperti `products.json` atau array di PHP).
Data tersimpan di database, dibaca oleh Laravel lewat Eloquent, lalu ditampilkan lewat View.
Menambah, mengubah, atau menghapus produk langsung mengubah isi halaman tanpa edit kode.
