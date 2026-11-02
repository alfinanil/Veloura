<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Response;

abstract class Controller
{
    protected function notFound(string $what = 'Data'): never
    {
        Response::error("$what tidak ditemukan.", 404);
    }

    protected function ok(mixed $data = null, string $message = 'OK'): array
    {
        return ['message' => $message, 'data' => $data];
    }

    protected function safeUser(array $u): array
    {
        unset($u['password'], $u['_claims']);
        return $u + ['active' => (bool) ($u['active'] ?? 1)];
    }
}
