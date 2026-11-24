<?php

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Veloura - Product Management (Week 9)
|--------------------------------------------------------------------------
| Alur: USER -> Route -> Model (Product) -> Eloquent -> Database -> View -> USER
|
| Sesuai materi Pertemuan 9, route langsung memakai Model Eloquent.
| Controller, Routing lanjutan, dan Validation mendalam dibahas di Pertemuan 10,
| jadi aturan validasi di bawah ini sengaja dibuat sederhana.
*/

$rules = [
    'name'        => ['required', 'string', 'max:150'],
    'category_id' => ['required', 'exists:categories,id'],
    'subtitle'    => ['nullable', 'string', 'max:150'],
    'description' => ['required', 'string'],
    'price'       => ['required', 'integer', 'min:0'],
    'discount'    => ['required', 'integer', 'between:0,100'],
    'stock'       => ['required', 'integer', 'min:0'],
    'image'       => ['nullable', 'string', 'max:255'],
];

$messages = [
    'required' => ':attribute wajib diisi.',
    'integer'  => ':attribute harus berupa angka bulat.',
    'min'      => ':attribute minimal :min.',
    'max'      => ':attribute maksimal :max karakter.',
    'between'  => ':attribute harus di antara :min dan :max.',
    'exists'   => ':attribute tidak valid.',
];

$attributes = [
    'name'        => 'Nama produk',
    'category_id' => 'Kategori',
    'subtitle'    => 'Subjudul',
    'description' => 'Deskripsi',
    'price'       => 'Harga',
    'discount'    => 'Diskon',
    'stock'       => 'Stok',
    'image'       => 'Gambar',
];

Route::get('/', fn () => redirect()->route('products.index'));

// TASK 02 - Uji Eloquent: Product::all(), Product::find(1), Product::create()
// Buka /test-eloquent            -> all() dan find(1)
// Buka /test-eloquent?create=1   -> sekaligus menyimpan 1 produk baru lewat create()
Route::get('/test-eloquent', function (Request $request) {
    $result = [
        'all()'   => Product::all()->count() . ' produk (banyak object)',
        'find(1)' => Product::find(1),           // satu object, atau null jika id tidak ada
    ];

    if ($request->boolean('create')) {
        $result['create()'] = Product::create([
            'name'        => 'Velvet Rose Lip Tint',
            'category_id' => Category::where('name', 'Makeup')->value('id'),
            'description' => 'Produk uji Task 02 Veloura.',
            'price'       => 79000,
            'discount'    => 0,
            'stock'       => 25,
        ]);
    }

    return $result;
})->name('test.eloquent');


// READ - tampilkan semua produk
Route::get('/products', function () {
    return view('products.index', [
        'products' => Product::with('category')->orderBy('id')->get(),
    ]);
})->name('products.index');

// CREATE - form tambah produk
Route::get('/products/create', function () {
    return view('products.create', [
        'product'    => new Product(['discount' => 0, 'stock' => 0]),
        'categories' => Category::orderBy('name')->get(),
    ]);
})->name('products.create');

// CREATE - simpan produk baru ke database
Route::post('/products', function (Request $request) use ($rules, $messages, $attributes) {
    $data = $request->validate($rules, $messages, $attributes);

    Product::create($data);

    return redirect()->route('products.index')->with('success', 'Produk berhasil ditambahkan.');
})->name('products.store');

// UPDATE - form edit produk
Route::get('/products/{product}/edit', function (Product $product) {
    return view('products.edit', [
        'product'    => $product,
        'categories' => Category::orderBy('name')->get(),
    ]);
})->name('products.edit');

// UPDATE - simpan perubahan
Route::put('/products/{product}', function (Request $request, Product $product) use ($rules, $messages, $attributes) {
    $data = $request->validate($rules, $messages, $attributes);

    $product->update($data);

    return redirect()->route('products.index')->with('success', 'Produk berhasil diperbarui.');
})->name('products.update');

// DELETE - hapus produk
Route::delete('/products/{product}', function (Product $product) {
    $product->delete();

    return redirect()->route('products.index')->with('success', 'Produk berhasil dihapus.');
})->name('products.destroy');
