<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Models\Category;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Veloura REST API + JWT Authentication (Week 11)  ->  semua URL diawali /api
|--------------------------------------------------------------------------
| PUBLIC    POST /api/login        dapatkan JWT      (maks. 10x per menit)
| PUBLIC    GET  /api/categories   daftar kategori (bantuan untuk category_id)
|
| PROTECTED (wajib header: Authorization: Bearer <token>)
|           GET    /api/me
|           GET    /api/products        -> 200
|           POST   /api/products        -> 201 / 422
|           GET    /api/products/{id}   -> 200 / 404
|           PUT    /api/products/{id}   -> 200 / 404 / 422
|           DELETE /api/products/{id}   -> 200 / 404
|           (tanpa token / token salah  -> 401)
*/

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

Route::get('/categories', fn () => response()->json([
    'data' => Category::orderBy('id')->get(),
]));

Route::middleware('jwt')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);

    // ->names('api.products' ) agar tidak bentrok dengan nama route web (products.index, dst.)
    Route::apiResource('products', ProductController::class)->names('api.products');
});
