<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Env;

final class Product extends Model
{
    protected static string $table = 'products';
    protected static array $fillable = ['name', 'category_id', 'subtitle', 'description', 'price', 'discount', 'stock', 'rating', 'benefits', 'image'];

    public static function search(string $q = '', string $category = ''): array
    {
        return self::query("SELECT p.*, c.name AS category FROM products p LEFT JOIN categories c ON c.id=p.category_id
            WHERE (p.name LIKE :q OR p.description LIKE :q) AND (:c = '' OR c.name = :c) ORDER BY p.id DESC", ['q' => "%$q%", 'c' => $category]);
    }

    public static function withCategory(int $id): ?array
    {
        return self::query('SELECT p.*, c.name AS category FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.id=?', [$id])[0] ?? null;
    }

    /** Resource: bentuk JSON yang dipakai frontend (mirip API Resource Laravel). */
    public static function toResource(array $p): array
    {
        $img = (string) $p['image'];
        return [
            'id' => (int) $p['id'], 'name' => $p['name'], 'category' => $p['category'] ?? null, 'category_id' => $p['category_id'],
            'subtitle' => (string) $p['subtitle'], 'desc' => (string) $p['description'], 'price' => (int) $p['price'], 'discount' => (int) $p['discount'],
            'stock' => (int) $p['stock'], 'rating' => (float) $p['rating'], 'reviewCount' => (int) $p['review_count'],
            'benefits' => json_decode($p['benefits'] ?: '[]', true) ?: [],
            'image' => str_starts_with($img, 'uploads/') ? rtrim((string) Env::get('APP_URL', 'http://localhost:8000'), '/') . '/storage/' . substr($img, 8) : $img,
        ];
    }
}
