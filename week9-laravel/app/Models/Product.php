<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'subtitle',
        'description',
        'price',
        'discount',
        'stock',
        'image',
    ];

    // Relasi sederhana: setiap produk milik satu kategori.
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // Harga setelah diskon, dibulatkan ke ribuan (sama seperti backend Veloura sebelumnya).
    public function getFinalPriceAttribute(): int
    {
        return (int) (round($this->price * (1 - $this->discount / 100) / 1000) * 1000);
    }
}
