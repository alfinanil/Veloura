# Review Week 11 - JWT Authentication

Draft jawaban, silakan diedit dengan bahasamu sendiri.

**1. Apa itu authentication?**
Proses memastikan identitas pengguna ("siapa kamu?") sebelum ia boleh mengakses resource tertentu, misalnya lewat email dan password.

**2. Apa perbedaan session dan token?**
Session menyimpan status login di server (client hanya membawa ID session), sehingga server harus mengingat setiap pengguna.
Token (JWT) membawa informasi identitas di dalam token itu sendiri dan dikirim client di setiap request, jadi server tidak perlu menyimpan session (stateless). Untuk REST API dipakai token.

**3. Apa itu JWT?**
JSON Web Token: token berbentuk `header.payload.signature`. Header berisi algoritma (HS256), payload berisi data seperti id user dan waktu kedaluwarsa,
signature adalah tanda tangan HMAC dengan kunci rahasia server agar token tidak bisa dipalsukan.

**4. Mengapa JWT digunakan pada REST API?**
REST API bersifat stateless dan dipakai banyak client (web, mobile, Postman). JWT memungkinkan setiap request membuktikan identitasnya sendiri tanpa session di server,
dan API bisa dilindungi dari akses sembarang orang.

**5. Dari mana JWT diperoleh?**
Dari endpoint login: `POST /api/login` dengan email dan password yang benar. Server memverifikasi credential, membuat JWT, lalu mengirimnya sebagai `access_token` di response JSON.

**6. Bagaimana client mengirim JWT?**
Lewat header HTTP pada setiap request: `Authorization: Bearer <token>`.

**7. Apa fungsi middleware?**
Middleware adalah penjaga di antara Route dan Controller. `JwtMiddleware` memeriksa token pada setiap request ke protected route;
jika valid request diteruskan ke Controller, jika tidak langsung ditolak dengan 401.

**8. Apa yang terjadi jika token tidak valid?**
Request ditolak dengan status 401 Unauthorized dan pesan JSON (`Token is invalid.` atau `Token has expired.`); Controller tidak dijalankan dan database tidak disentuh.

**9. Apa hubungan JWT dengan protected route?**
Protected route adalah route yang hanya bisa diakses jika JWT valid. JWT adalah "tiket masuk"-nya, middleware adalah petugas yang memeriksa tiket itu.
Di Veloura: `/api/products` hanya bisa diakses dengan token.

**10. Bagaimana alur login sampai API dapat diakses?**
User login (email + password) -> Laravel memverifikasi credential di database -> server membuat JWT -> JWT dikirim ke client ->
client mengirim JWT di header `Authorization: Bearer` -> Middleware memverifikasi -> Controller -> Model -> Database -> response JSON.

**Pertanyaan utama: apa yang berubah ketika REST API Veloura mulai menggunakan JWT authentication?**
Sebelumnya siapa pun bisa memanggil `/api/products`. Sekarang pengguna harus login lebih dulu, mendapat token, dan mengirimnya di setiap request.
Request tanpa token atau dengan token salah ditolak (401), sedangkan token valid dapat mengakses API. Data produk jadi lebih aman.
