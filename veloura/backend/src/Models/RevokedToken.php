<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Database;

final class RevokedToken
{
    public static function revoke(string $jti, int $exp): void
    {
        Database::pdo()->prepare('INSERT OR IGNORE INTO revoked_tokens (jti,exp) VALUES (?,?)')->execute([$jti, $exp]);
        Database::pdo()->prepare('DELETE FROM revoked_tokens WHERE exp < ?')->execute([time()]);
    }

    public static function isRevoked(string $jti): bool
    {
        $st = Database::pdo()->prepare('SELECT 1 FROM revoked_tokens WHERE jti = ?');
        $st->execute([$jti]);
        return (bool) $st->fetchColumn();
    }
}
