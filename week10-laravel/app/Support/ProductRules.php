<?php

namespace App\Support;

/**
 * WEEK 10 - Aturan validasi produk Veloura.
 * Dipakai bersama oleh ProductController (web) dan Api\ProductController (REST API),
 * supaya aturan & pesan error-nya selalu sama.
 */
class ProductRules
{
    public static function rules(): array
    {
        return [
            'name'        => ['required', 'string', 'max:100'],
            'category_id' => ['required', 'exists:categories,id'],
            'subtitle'    => ['nullable', 'string', 'max:150'],
            'description' => ['required', 'string'],
            'price'       => ['required', 'integer', 'min:0'],
            'discount'    => ['required', 'integer', 'between:0,100'],
            'stock'       => ['required', 'integer', 'min:0'],
            'image'       => ['nullable', 'string', 'max:255'],
        ];
    }

    public static function messages(): array
    {
        return [
            'required' => ':attribute wajib diisi.',
            'integer'  => ':attribute harus berupa angka bulat.',
            'min'      => ':attribute minimal :min.',
            'max'      => ':attribute maksimal :max karakter.',
            'between'  => ':attribute harus di antara :min dan :max.',
            'exists'   => ':attribute tidak valid.',
        ];
    }

    public static function attributes(): array
    {
        return [
            'name'        => 'Nama produk',
            'category_id' => 'Kategori',
            'subtitle'    => 'Subjudul',
            'description' => 'Deskripsi',
            'price'       => 'Harga',
            'discount'    => 'Diskon',
            'stock'       => 'Stok',
            'image'       => 'Gambar',
        ];
    }
}
