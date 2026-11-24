<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Support\Jwt;
use Closure;
use Illuminate\Http\Request;
use InvalidArgumentException;
use Symfony\Component\HttpFoundation\Response;

/**
 * WEEK 11 - JWT Middleware
 *   Tanpa token     -> 401 "Unauthenticated."
 *   Token tidak sah -> 401 "Token is invalid." / "Token has expired."
 *   Token valid     -> request diteruskan ke Controller
 */
class JwtMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();   // dari header "Authorization: Bearer <token>"

        if (! $token) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        try {
            $claims = Jwt::decode($token);
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 401);
        }

        $user = User::find($claims['sub'] ?? 0);

        if (! $user) {
            return response()->json(['message' => 'Token is invalid.'], 401);
        }

        // Jadikan user ini sebagai user yang sedang login pada request
        $request->setUserResolver(fn () => $user);

        return $next($request);
    }
}
