<?php
declare(strict_types=1);

namespace App\Models;

final class Order extends Model
{
    protected static string $table = 'orders';
    protected static array $fillable = ['code', 'user_id', 'customer_name', 'total', 'status'];
    public const STATUSES = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];

    public static function filtered(string $status = '', string $q = ''): array
    {
        return self::query("SELECT o.*, (SELECT COALESCE(SUM(qty),0) FROM order_items i WHERE i.order_id=o.id) AS items_count FROM orders o
            WHERE (:s = '' OR o.status = :s) AND (o.code LIKE :q OR o.customer_name LIKE :q) ORDER BY o.id DESC", ['s' => $status, 'q' => "%$q%"]);
    }

    public static function items(int $orderId): array
    {
        return self::query('SELECT * FROM order_items WHERE order_id = ?', [$orderId]);
    }

    public static function forUser(int $userId): array
    {
        return self::query(
            "SELECT o.*,
                (
                    SELECT COALESCE(SUM(qty), 0)
                    FROM order_items i
                    WHERE i.order_id = o.id
                ) AS items_count
            FROM orders o
            WHERE o.user_id = ?
            ORDER BY o.id DESC",
            [$userId]
        );
    }

    public static function addItem(int $orderId, ?int $productId, string $name, int $price, int $qty): void
    {
        self::db()->prepare('INSERT INTO order_items (order_id,product_id,name,price,qty) VALUES (?,?,?,?,?)')->execute([$orderId, $productId, $name, $price, $qty]);
    }

    public static function nextCode(): string
    {
        $n = (int) self::db()->query('SELECT COALESCE(MAX(CAST(SUBSTR(code,3) AS INTEGER)),119)+1 FROM orders')->fetchColumn();
        return 'VL' . str_pad((string) $n, 5, '0', STR_PAD_LEFT);
    }
}
