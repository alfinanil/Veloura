<?php
declare(strict_types=1);

namespace App\Core;

/** Membungkus request HTTP: method (dengan method spoofing), body JSON/form, query, file, token Bearer. */
final class Request
{
    public array $params = [];
    public ?array $user = null;

    public function __construct(
        public readonly string $method,
        public readonly string $path,
        public readonly array $query,
        private readonly array $body,
        public readonly array $files,
        private readonly array $headers,
    ) {}

    public static function capture(): self
    {
        $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $path = rawurldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/');
        $headers = array_change_key_case(function_exists('getallheaders') ? getallheaders() : [], CASE_LOWER);

        $raw = file_get_contents('php://input');
        $body = $_POST;
        if ($raw && str_contains($headers['content-type'] ?? '', 'application/json')) {
            $body = json_decode($raw, true) ?? [];
        }
        // Method spoofing: PHP tidak mem-parsing multipart untuk PATCH/PUT (Modul 6)
        if ($method === 'POST' && isset($body['_method'])) {
            $method = strtoupper((string) $body['_method']);
            unset($body['_method']);
        }
        return new self($method, $path, $_GET, $body, $_FILES, $headers);
    }

    public function input(string $key, mixed $default = null): mixed { return $this->body[$key] ?? $default; }

    public function all(): array { return $this->body; }

    public function file(string $key): ?array
    {
        $f = $this->files[$key] ?? null;
        return ($f && $f['error'] !== UPLOAD_ERR_NO_FILE) ? $f : null;
    }

    public function bearerToken(): ?string
    {
        return preg_match('/^Bearer\s+(.+)$/i', $this->headers['authorization'] ?? '', $m) ? $m[1] : null;
    }
}
