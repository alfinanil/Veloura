<?php
declare(strict_types=1);

namespace App\Models;

final class User extends Model
{
    protected static string $table = 'users';
    protected static array $fillable = ['name', 'email', 'password', 'role', 'phone', 'active'];

    public static function findByEmail(string $email): ?array
    {
        return self::query('SELECT * FROM users WHERE email = ?', [$email])[0] ?? null;
    }

    /** Pelanggan + jumlah & total pesanan (tanpa pesanan batal). */
    public static function customers(string $q = ''): array
    {
        return self::query("SELECT u.id,u.name,u.email,u.phone,u.active,u.created_at,
            (SELECT COUNT(*) FROM orders o WHERE o.user_id=u.id) AS orders_count,
            (SELECT COALESCE(SUM(total),0) FROM orders o WHERE o.user_id=u.id AND o.status!='cancelled') AS total_spent
            FROM users u WHERE u.role='customer' AND (u.name LIKE :q OR u.email LIKE :q) ORDER BY u.id DESC", ['q' => "%$q%"]);
    }
}
