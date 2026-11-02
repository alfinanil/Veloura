<?php
declare(strict_types=1);

namespace App\Core;

use PDO;

/** Koneksi PDO tunggal + migration & seeder sederhana. */
final class Database
{
    private static ?PDO $pdo = null;

    public static function pdo(): PDO
    {
        if (self::$pdo === null) {
            $path = Env::get('DB_PATH', 'database/veloura.sqlite');
            if (!str_starts_with($path, '/')) $path = dirname(__DIR__, 2) . '/' . $path;
            @mkdir(dirname($path), 0775, true);
            self::$pdo = new PDO('sqlite:' . $path, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            self::$pdo->exec('PRAGMA foreign_keys = ON');
            self::migrate();
        }
        return self::$pdo;
    }

    private static function migrate(): void
    {
        $db = self::$pdo;
        $db->exec(<<<SQL
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'customer', phone TEXT, active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, description TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  subtitle TEXT, description TEXT, price INTEGER NOT NULL, discount INTEGER NOT NULL DEFAULT 0, stock INTEGER NOT NULL DEFAULT 0,
  rating REAL NOT NULL DEFAULT 4.8, review_count INTEGER NOT NULL DEFAULT 0, benefits TEXT, image TEXT, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT NOT NULL UNIQUE, user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL, total INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'pending', created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER, name TEXT NOT NULL, price INTEGER NOT NULL, qty INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
CREATE TABLE IF NOT EXISTS revoked_tokens (jti TEXT PRIMARY KEY, exp INTEGER NOT NULL);
SQL);
        if ((int) $db->query('SELECT COUNT(*) FROM users')->fetchColumn() === 0) Seeder::run($db);
    }
}
