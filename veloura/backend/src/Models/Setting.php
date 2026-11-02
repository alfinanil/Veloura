<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Database;

final class Setting
{
    public static function all(): array
    {
        return array_column(Database::pdo()->query('SELECT key, value FROM settings')->fetchAll(), 'value', 'key');
    }

    public static function set(string $key, string $value): void
    {
        Database::pdo()->prepare('INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value')->execute([$key, $value]);
    }
}
