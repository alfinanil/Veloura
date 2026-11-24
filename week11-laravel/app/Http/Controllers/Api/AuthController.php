<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\Jwt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

/**
 * WEEK 11 - TASK 01: JWT Login
 *
 * POST /api/login
 *   body    : {"email": "...", "password": "..."}
 *   200     : {"access_token": "...", "token_type": "bearer", "expires_in": 3600, "user": {...}}
 *   401     : email atau password salah (user tidak ditemukan juga 401)
 *   422     : email / password kosong
 */
class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => ['required', 'email'],
            'password' => ['required', 'string'],
        ], [
            'required' => ':attribute wajib diisi.',
            'email'    => ':attribute harus berupa alamat email yang valid.',
        ], [
            'email'    => 'Email',
            'password' => 'Password',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first(),
                'errors'  => $validator->errors()->toArray(),
            ], 422);
        }

        $user = User::where('email', $request->input('email'))->first();

        // Pesan sengaja sama untuk "user tidak ada" dan "password salah"
        // supaya penyerang tidak bisa menebak email mana yang terdaftar.
        if (! $user || ! Hash::check($request->input('password'), $user->password)) {
            return response()->json(['message' => 'Email atau password salah.'], 401);
        }

        $ttl = (int) config('jwt.ttl', 3600);

        return response()->json([
            'access_token' => Jwt::encode(['sub' => $user->id, 'email' => $user->email], $ttl),
            'token_type'   => 'bearer',
            'expires_in'   => $ttl,
            'user'         => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
            ],
        ], 200);
    }

    // GET /api/me - contoh protected route: siapa yang sedang login
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json(['data' => [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
        ]], 200);
    }
}
