<?php
declare(strict_types=1);

namespace App\Core;

/** JWT HS256 sederhana (header.payload.signature). */
final class Jwt
{
    private static function secret(): string
    {
        $s = Env::get('JWT_SECRET');
        if (!$s) Response::error('JWT_SECRET belum diisi di .env', 500);
        return $s;
    }

    private static function b64(string $d): string { return rtrim(strtr(base64_encode($d), '+/', '-_'), '='); }
    private static function unb64(string $d): string { return base64_decode(strtr($d, '-_', '+/')); }

    public static function encode(array $claims): string
    {
        $h = self::b64(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $p = self::b64(json_encode($claims));
        return "$h.$p." . self::b64(hash_hmac('sha256', "$h.$p", self::secret(), true));
    }

    public static function decode(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;
        $sig = self::b64(hash_hmac('sha256', "$parts[0].$parts[1]", self::secret(), true));
        if (!hash_equals($sig, $parts[2])) return null;
        $claims = json_decode(self::unb64($parts[1]), true);
        return (is_array($claims) && ($claims['exp'] ?? 0) > time()) ? $claims : null;
    }
}
