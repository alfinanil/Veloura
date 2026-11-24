<?php

use App\Http\Controllers\Api\ProductController;
use App\Models\Category;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Veloura REST API (Week 10 - Task 03)  ->  semua URL diawali /api
|--------------------------------------------------------------------------
| GET    /api/products        index    -> 200
| POST   /api/products        store    -> 201 / 422
| GET    /api/products/{id}   show     -> 200 / 404
| PUT    /api/products/{id}   update   -> 200 / 404 / 422
| DELETE /api/products/{id}   destroy  -> 200 / 404
|
| Dibuka tanpa login agar bisa diuji di Postman sesuai materi.
*/

// Daftar kategori, untuk mengetahui category_id saat membuat produk
Route::get('/categories', fn () => response()->json([
    'data' => Category::orderBy('id')->get(),
]));

// ->names('api.products') agar nama route tidak bentrok dengan route web (products.index, dst.)
Route::apiResource('products', ProductController::class)->names('api.products');
