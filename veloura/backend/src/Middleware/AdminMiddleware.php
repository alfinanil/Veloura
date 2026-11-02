<?php
declare(strict_types=1);

namespace App\Middleware;

use App\Core\{Request, Response};

final class AdminMiddleware implements Middleware
{
    public function handle(Request $req): void
    {
        if (($req->user['role'] ?? '') !== 'admin') Response::error('Forbidden. Hanya admin.', 403);
    }
}
