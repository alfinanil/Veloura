<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Database;
use PDO;

/** Base model (mirip Eloquent): tiap model hanya menentukan tabel & kolom yang boleh diisi. */
abstract class Model
{
    protected static string $table;
    protected static array $fillable = [];

    protected static function db(): PDO { return Database::pdo(); }

    public static function query(string $sql, array $args = []): array
    {
        $st = static::db()->prepare($sql);
        $st->execute($args);
        return $st->fetchAll();
    }

    public static function all(string $order = 'id DESC'): array
    {
        return static::query('SELECT * FROM ' . static::$table . " ORDER BY $order");
    }

    public static function find(int $id): ?array
    {
        return static::query('SELECT * FROM ' . static::$table . ' WHERE id = ?', [$id])[0] ?? null;
    }

    public static function create(array $data): array
    {
        $data = array_intersect_key($data, array_flip(static::$fillable)) + ['created_at' => date('Y-m-d H:i:s')];
        $ph = implode(',', array_fill(0, count($data), '?'));
        static::db()->prepare('INSERT INTO ' . static::$table . ' (' . implode(',', array_keys($data)) . ") VALUES ($ph)")->execute(array_values($data));
        return static::find((int) static::db()->lastInsertId());
    }

    public static function update(int $id, array $data): ?array
    {
        $data = array_intersect_key($data, array_flip(static::$fillable));
        if ($data) {
            $set = implode(',', array_map(fn($k) => "$k = ?", array_keys($data)));
            static::db()->prepare('UPDATE ' . static::$table . " SET $set WHERE id = ?")->execute([...array_values($data), $id]);
        }
        return static::find($id);
    }

    public static function delete(int $id): void
    {
        static::db()->prepare('DELETE FROM ' . static::$table . ' WHERE id = ?')->execute([$id]);
    }
}
