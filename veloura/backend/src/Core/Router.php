<?php
declare(strict_types=1);

namespace App\Core;

final class Router
{
    private array $routes = [];

    public function add(string $method, string $pattern, array $handler, array $middleware = []): void
    {
        $regex = '#^' . preg_replace('#\{(\w+)\}#', '(?P<$1>[^/]+)', $pattern) . '$#';
        $this->routes[] = compact('method', 'regex', 'handler', 'middleware');
    }

    public function dispatch(Request $req): never
    {
        $pathMatched = false;
        foreach ($this->routes as $r) {
            if (!preg_match($r['regex'], $req->path, $m)) continue;
            $pathMatched = true;
            if ($r['method'] !== $req->method) continue;

            $req->params = array_filter($m, 'is_string', ARRAY_FILTER_USE_KEY);
            foreach ($r['middleware'] as $mw) (new $mw())->handle($req);
            [$class, $action] = $r['handler'];
            Response::json((new $class())->$action($req));
        }
        Response::error($pathMatched ? 'Method tidak diizinkan.' : 'Endpoint tidak ditemukan.', $pathMatched ? 405 : 404);
    }
}
