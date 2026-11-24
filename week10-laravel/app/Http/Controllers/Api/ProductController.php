<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Support\ProductRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

/**
 * WEEK 10 - TASK 03: RESTful Product API (response JSON + HTTP status code)
 *
 * GET    /api/products        -> 200  semua produk
 * POST   /api/products        -> 201  buat produk   (422 jika tidak valid)
 * GET    /api/products/{id}   -> 200  detail        (404 jika tidak ada)
 * PUT    /api/products/{id}   -> 200  ubah produk   (404 / 422)
 * DELETE /api/products/{id}   -> 200  hapus produk  (404 jika tidak ada)
 */
class ProductController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Product::with('category')->orderBy('id')->get(),
        ], 200);
    }

    public function show($id)
    {
        $product = Product::with('category')->find($id);

        if (! $product) {
            return $this->notFound();
        }

        return response()->json(['data' => $product], 200);
    }

    public function store(Request $request)
    {
        $validator = $this->validator($request);

        if ($validator->fails()) {
            return $this->invalid($validator);
        }

        $product = Product::create($validator->validated());

        return response()->json([
            'message' => 'Produk berhasil ditambahkan',
            'data'    => $product->load('category'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (! $product) {
            return $this->notFound();
        }

        $validator = $this->validator($request);

        if ($validator->fails()) {
            return $this->invalid($validator);
        }

        $product->update($validator->validated());

        return response()->json([
            'message' => 'Produk berhasil diperbarui',
            'data'    => $product->fresh()->load('category'),
        ], 200);
    }

    public function destroy($id)
    {
        $product = Product::find($id);

        if (! $product) {
            return $this->notFound();
        }

        $product->delete();

        return response()->json(['message' => 'Produk berhasil dihapus'], 200);
    }

    private function validator(Request $request)
    {
        return Validator::make(
            $request->all(),
            ProductRules::rules(),
            ProductRules::messages(),
            ProductRules::attributes()
        );
    }

    // HTTP 422 - data tidak memenuhi aturan validasi
    private function invalid($validator)
    {
        return response()->json([
            'message' => $validator->errors()->first(),
            'errors'  => $validator->errors()->toArray(),
        ], 422);
    }

    // HTTP 404 - data tidak ditemukan
    private function notFound()
    {
        return response()->json(['message' => 'Produk tidak ditemukan'], 404);
    }
}
