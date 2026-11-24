# Review Week 10 - Controller, Routing & Validation

Draft jawaban, silakan diedit dengan bahasamu sendiri.

**1. Apa fungsi Controller?**
Controller menerima request, mengatur prosesnya (memanggil Model, menjalankan validasi), lalu menghasilkan response berupa view atau JSON.
Di Veloura: `ProductController` mengatur CRUD produk.

**2. Apa fungsi Route?**
Route menghubungkan URL + HTTP method ke Controller dan method yang akan dijalankan,
misalnya `GET /products` -> `ProductController@index`.

**3. Apa yang diterima Controller?**
Object `Request` yang berisi input pengguna (form, query string, JSON body), misalnya `$request->name` atau `$request->validate(...)`.

**4. Mengapa validation dilakukan?**
Agar hanya data yang memenuhi aturan yang masuk database: mencegah data kosong atau salah format,
menjaga integritas data, dan memberi pesan error yang jelas. Contoh: nama produk wajib diisi dan maksimal 100 karakter, harga harus angka.

**5. Apa perbedaan HTML response dan JSON response?**
HTML response adalah halaman jadi (View/Blade) untuk dibaca manusia di browser. JSON response adalah data terstruktur
yang dipakai aplikasi lain (frontend, mobile, Postman). Di Veloura: `/products` mengembalikan HTML, `/api/products` mengembalikan JSON.

**6. Apa fungsi HTTP method?**
Menentukan jenis operasi: GET (membaca), POST (membuat), PUT/PATCH (mengubah), DELETE (menghapus).

**7. Apa arti status 200, 201, 404, dan 422?**
200 = request berhasil. 201 = data berhasil dibuat. 404 = data/resource tidak ditemukan. 422 = data tidak lolos validasi.

**8. Bagaimana alur request sampai database?**
User mengirim request -> Route mencocokkan URL -> Controller menerima Request -> Validation memeriksa data ->
Model -> Eloquent -> Database menyimpan/mengambil -> Response (view atau JSON) dikirim ke user.

**Pertanyaan utama: apa yang berubah ketika CRUD Veloura mulai memiliki Controller, Routing, dan Validation?**
Logika tidak lagi ditulis langsung di route. Route hanya mengarahkan ke Controller, Controller mengatur proses,
dan Validation menyaring input sebelum masuk database. Hasilnya aplikasi lebih terstruktur, lebih aman dari data tidak valid,
mudah dirawat, dan siap dipakai sebagai REST API.
