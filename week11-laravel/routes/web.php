<?php

use App\Http\Controllers\ProductController;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Veloura - Product Management (Week 10)
|--------------------------------------------------------------------------
| Alur: USER -> Route -> Controller -> Validation -> Model -> Eloquent -> Database -> View
|
| Week 9 : logika CRUD ada di dalam route (closure).
| Week 10: route hanya mengarahkan ke ProductController.
|
| HTTP method: GET (read) | POST (create) | PUT (update) | DELETE (delete)
*/

Route::get('/', fn () => redirect()->route('products.index'));

// Uji Eloquent dari Week 9 (Task 02) - tetap dipertahankan
Route::get('/test-eloquent', function (Request $request) {
    $result = [
        'all()'   => Product::all()->count() . ' produk (banyak object)',
        'find(1)' => Product::find(1),
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

Route::get('/products',            [ProductController::class, 'index'])->name('products.index');    // READ
Route::get('/products/create',     [ProductController::class, 'create'])->name('products.create');  // FORM
Route::post('/products',           [ProductController::class, 'store'])->name('products.store');    // CREATE
Route::get('/products/{id}/edit',  [ProductController::class, 'edit'])->name('products.edit');      // FORM EDIT
Route::put('/products/{id}',       [ProductController::class, 'update'])->name('products.update');  // UPDATE
Route::delete('/products/{id}',    [ProductController::class, 'destroy'])->name('products.destroy'); // DELETE
