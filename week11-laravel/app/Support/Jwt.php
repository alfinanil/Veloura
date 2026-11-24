<?php

namespace App\Support;

use InvalidArgumentException;
use RuntimeException;

/**
 * WEEK 11 - JWT HS256 sederhana: header.payload.signature
 *
 *  header    : {"alg":"HS256","typ":"JWT"}
 *  payload   : klaim (sub = id user, email, iat, exp)
 *  signature : HMAC-SHA256(header.payload, secret)
 */
final class Jwt
{
    private static function secret(): string
    {
        $secret = (string) config('jwt.secret');

        if ($secret === '') {
            throw new RuntimeException('JWT_SECRET / APP_KEY belum diisi di .env');
        }

        return $secret;
    }

    private static function b64(string $data): string
    {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function unb64(string $data): string
    {
        return (string) base64_decode(strtr($data, '-_', '+/'));
    }

    private static function sign(string $input): string
    {
        return self::b64(hash_hmac('sha256', $input, self::secret(), true));
    }

    /** Membuat token baru. */
    public static function encode(array $claims, ?int $ttl = null): string
    {
        $now = time();
        $claims = $claims + ['iat' => $now, 'exp' => $now + ($ttl ?? (int) config('jwt.ttl', 3600))];

        $header  = self::b64(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $payload = self::b64(json_encode($claims));

        return "$header.$payload." . self::sign("$header.$payload");
    }

    /**
     * Memverifikasi token dan mengembalikan klaimnya.
     *
     * @throws InvalidArgumentException  "Token is invalid." / "Token has expired."
     */
    public static function decode(string $token): array
    {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            throw new InvalidArgumentException('Token is invalid.');
        }

        [$header, $payload, $signature] = $parts;

        $head = json_decode(self::unb64($header), true);

        if (! is_array($head) || ($head['alg'] ?? null) !== 'HS256') {
            throw new InvalidArgumentException('Token is invalid.');
        }

        // Tanda tangan harus cocok -> token tidak dipalsukan / diubah
        if (! hash_equals(self::sign("$header.$payload"), $signature)) {
            throw new InvalidArgumentException('Token is invalid.');
        }

        $claims = json_decode(self::unb64($payload), true);

        if (! is_array($claims)) {
            throw new InvalidArgumentException('Token is invalid.');
        }

        if (($claims['exp'] ?? 0) < time()) {
            throw new InvalidArgumentException('Token has expired.');
        }

        return $claims;
    }
}
