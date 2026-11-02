<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\{Env, Jwt, Request, Response, Validator};
use App\Models\{RevokedToken, User};

final class AuthController extends Controller
{
    private function issueToken(array $user): array
    {
        $ttl = (int) Env::get('JWT_TTL_MINUTES', '120') * 60;
        $claims = ['sub' => $user['id'], 'role' => $user['role'], 'jti' => bin2hex(random_bytes(8)), 'iat' => time(), 'exp' => time() + $ttl];
        return ['user' => $this->safeUser($user), 'token' => Jwt::encode($claims), 'expires_in' => $ttl];
    }

    public function register(Request $r): array
    {
        $d = Validator::validate($r->all(), ['name' => 'required|max:100', 'email' => 'required|email', 'password' => 'required|min:6']);
        if (User::findByEmail($d['email'])) Response::error('Data tidak valid.', 422, ['email' => ['Email sudah terdaftar.']]);
        $user = User::create(['name' => $d['name'], 'email' => $d['email'], 'password' => password_hash($d['password'], PASSWORD_DEFAULT), 'role' => 'customer']);
        http_response_code(201);
        return $this->ok($this->issueToken($user), 'Registrasi berhasil.');
    }

    public function login(Request $r): array
    {
        $d = Validator::validate($r->all(), ['email' => 'required|email', 'password' => 'required']);
        $user = User::findByEmail($d['email']);
        if (!$user || !password_verify($d['password'], $user['password'])) Response::error('Email atau password salah.', 401);
        if (!$user['active']) Response::error('Akun dinonaktifkan.', 403);
        return $this->ok($this->issueToken($user), 'Login berhasil.');
    }

    public function me(Request $r): array
    {
        return $this->ok($this->safeUser($r->user));
    }

    public function logout(Request $r): array
    {
        RevokedToken::revoke($r->user['_claims']['jti'], (int) $r->user['_claims']['exp']);
        return $this->ok(null, 'Logout berhasil.');
    }

    public function changePassword(Request $r): array
    {
        $d = Validator::validate($r->all(), ['current_password' => 'required', 'new_password' => 'required|min:6']);
        $user = User::find((int) $r->user['id']);
        if (!password_verify($d['current_password'], $user['password'])) Response::error('Data tidak valid.', 422, ['current_password' => ['Password saat ini salah.']]);
        User::update((int) $user['id'], ['password' => password_hash($d['new_password'], PASSWORD_DEFAULT)]);
        return $this->ok(null, 'Password diperbarui.');
    }
}
