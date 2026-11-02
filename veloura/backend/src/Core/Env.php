<?php
declare(strict_types=1);

namespace App\Core;

/** Membaca file .env lalu menyediakan akses nilai konfigurasi (Modul 3: class + static). */
final class Env
{
    private static array $values = [];

    public static function load(string $file): void
    {
        if (!is_file($file)) return;
        foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#' || !str_contains($line, '=')) continue;
            [$k, $v] = explode('=', $line, 2);
            self::$values[trim($k)] = trim($v, " \t\"'");
        }
    }

    public static function get(string $key, ?string $default = null): ?string
    {
        $env = getenv($key);
        return $env !== false && $env !== '' ? $env : (self::$values[$key] ?? $default);
    }

    public static function bool(string $key, bool $default = false): bool
    {
        return filter_var(self::get($key, $default ? 'true' : 'false'), FILTER_VALIDATE_BOOLEAN);
    }
}
