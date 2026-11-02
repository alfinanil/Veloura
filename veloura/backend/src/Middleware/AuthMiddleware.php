<?php
declare(strict_types=1);

namespace App\Middleware;

use App\Core\{Jwt, Request, Response};
use App\Models\{RevokedToken, User};

/** Memastikan request membawa JWT valid, belum di-logout, dan akun aktif. */
final class AuthMiddleware implements Middleware
{
    public function handle(Request $req): void
    {
        $token = $req->bearerToken();
        $claims = $token ? Jwt::decode($token) : null;
        if (!$claims || RevokedToken::isRevoked($claims['jti'])) Response::error('Unauthenticated. Silakan login.', 401);

        $user = User::find((int) $claims['sub']);
        if (!$user || !$user['active']) Response::error('Akun tidak ditemukan atau nonaktif.', 401);

        unset($user['password']);
        $req->user = $user + ['_claims' => $claims];
    }
}
