<?php
declare(strict_types=1);

/** Front controller: autoload PSR-4 -> CORS -> routing. Jalankan: php -S localhost:8000 -t public */

use App\Controllers\{AuthController, CategoryController, CustomerController, DashboardController, OrderController, ProductController, SettingController};
use App\Core\{Env, Request, Response, Router};
use App\Middleware\{AdminMiddleware, AuthMiddleware};

$root = dirname(__DIR__);
spl_autoload_register(function (string $class) use ($root) {
    $file = $root . '/src/' . str_replace('\\', '/', substr($class, 4)) . '.php';
    if (str_starts_with($class, 'App\\') && is_file($file)) require $file;
});

Env::load($root . '/.env');
if (!is_file($root . '/.env') && !Env::get('JWT_SECRET')) putenv('JWT_SECRET=dev-only-secret-change-me-in-env');
ini_set('display_errors', '0');

// CORS: hanya origin yang terdaftar di CORS_ALLOWED_ORIGINS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = array_map('trim', explode(',', (string) Env::get('CORS_ALLOWED_ORIGINS', 'http://127.0.0.1:5501,http://localhost:5501,http://127.0.0.1:5500,http://localhost:5500,http://localhost:5173')));
if ($origin && in_array($origin, $allowed, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, Accept');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') { http_response_code(204); exit; }

set_exception_handler(function (Throwable $e) {
    Response::error(Env::bool('APP_DEBUG') ? $e->getMessage() : 'Terjadi kesalahan pada server.', 500);
});

$req = Request::capture();

// File upload publik (setara `php artisan storage:link`)
if (preg_match('#^/storage/([\w.-]+)$#', $req->path, $m) && is_file("$root/storage/uploads/$m[1]")) {
    header('Content-Type: ' . mime_content_type("$root/storage/uploads/$m[1]"));
    header('Cache-Control: public, max-age=86400');
    readfile("$root/storage/uploads/$m[1]");
    exit;
}

$auth = [AuthMiddleware::class];
$admin = [AuthMiddleware::class, AdminMiddleware::class];
$r = new Router();

$r->add('POST', '/api/auth/register', [AuthController::class, 'register']);
$r->add('POST', '/api/auth/login', [AuthController::class, 'login']);
$r->add('GET', '/api/auth/me', [AuthController::class, 'me'], $auth);
$r->add('POST', '/api/auth/logout', [AuthController::class, 'logout'], $auth);
$r->add('POST', '/api/auth/change-password', [AuthController::class, 'changePassword'], $auth);

$r->add('GET', '/api/products', [ProductController::class, 'index']);
$r->add('GET', '/api/products/{id}', [ProductController::class, 'show']);
$r->add('POST', '/api/products', [ProductController::class, 'store'], $admin);
$r->add('PATCH', '/api/products/{id}', [ProductController::class, 'update'], $admin);
$r->add('DELETE', '/api/products/{id}', [ProductController::class, 'destroy'], $admin);

$r->add('GET', '/api/categories', [CategoryController::class, 'index']);
$r->add('POST', '/api/categories', [CategoryController::class, 'store'], $admin);
$r->add('PATCH', '/api/categories/{id}', [CategoryController::class, 'update'], $admin);
$r->add('DELETE', '/api/categories/{id}', [CategoryController::class, 'destroy'], $admin);

$r->add('POST', '/api/orders', [OrderController::class, 'store'], $auth);

$r->add('GET', '/api/my-orders', [OrderController::class, 'myOrders'], $auth);
$r->add('GET', '/api/my-orders/{id}', [OrderController::class, 'myOrder'], $auth);

$r->add('GET', '/api/orders', [OrderController::class, 'index'], $admin);
$r->add('GET', '/api/orders/{id}', [OrderController::class, 'show'], $admin);
$r->add('PATCH', '/api/orders/{id}/status', [OrderController::class, 'updateStatus'], $admin);
$r->add('DELETE', '/api/orders/{id}', [OrderController::class, 'destroy'], $admin);

$r->add('GET', '/api/customers', [CustomerController::class, 'index'], $admin);
$r->add('GET', '/api/customers/{id}', [CustomerController::class, 'show'], $admin);
$r->add('PATCH', '/api/customers/{id}', [CustomerController::class, 'update'], $admin);
$r->add('DELETE', '/api/customers/{id}', [CustomerController::class, 'destroy'], $admin);

$r->add('GET', '/api/admin/dashboard', [DashboardController::class, 'index'], $admin);
$r->add('GET', '/api/admin/settings', [SettingController::class, 'index'], $admin);
$r->add('PATCH', '/api/admin/settings', [SettingController::class, 'update'], $admin);

$r->dispatch($req);
