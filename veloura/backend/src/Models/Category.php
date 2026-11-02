<?php
declare(strict_types=1);

namespace App\Models;

final class Category extends Model
{
    protected static string $table = 'categories';
    protected static array $fillable = ['name', 'description'];

    public static function withCounts(): array
    {
        return self::query('SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id=c.id) AS products_count FROM categories c ORDER BY c.id');
    }
}
