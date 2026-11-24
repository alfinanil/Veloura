<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Support\ProductRules;
use Illuminate\Http\Request;

/**
 * WEEK 10 - TASK 01 & 02
 * Alur: USER -> Route -> Controller -> Validation -> Model -> Eloquent -> Database -> View
 *
 * Proses CRUD yang di Week 9 ada di dalam route (closure) dipindahkan ke Controller.
 * Pada store() dan update() ditambahkan Request & Validation.
 */
class ProductController extends Controller
{
    // READ - tampilkan semua produk
    public function index()
    {
        $products = Product::with('category')->orderBy('id')->get();

        return view('products.index', compact('products'));
    }

    // FORM - tambah produk
    public function create()
    {
        return view('products.create', [
            'product'    => new Product(['discount' => 0, 'stock' => 0]),
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    // CREATE - terima Request, validasi, simpan
    public function store(Request $request)
    {
        // Tidak valid -> otomatis kembali ke form + pesan error + input lama
        $data = $request->validate(
            ProductRules::rules(),
            ProductRules::messages(),
            ProductRules::attributes()
        );

        Product::create($data);

        return redirect()->route('products.index')->with('success', 'Produk berhasil ditambahkan.');
    }

    // FORM EDIT - tampilkan data lama
    public function edit($id)
    {
        return view('products.edit', [
            'product'    => Product::findOrFail($id),
            'categories' => Category::orderBy('name')->get(),
        ]);
    }

    // UPDATE - terima Request, validasi, simpan perubahan
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $data = $request->validate(
            ProductRules::rules(),
            ProductRules::messages(),
            ProductRules::attributes()
        );

        $product->update($data);

        return redirect()->route('products.index')->with('success', 'Produk berhasil diperbarui.');
    }

    // DELETE - hapus produk
    public function destroy($id)
    {
        Product::findOrFail($id)->delete();

        return redirect()->route('products.index')->with('success', 'Produk berhasil dihapus.');
    }
}
