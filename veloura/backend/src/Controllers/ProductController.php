<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\{Request, Response, Validator};
use App\Models\{Category, Product};

final class ProductController extends Controller
{
    private const RULES = ['name' => 'required|max:120', 'category_id' => 'required|integer', 'subtitle' => 'max:160', 'description' => 'max:1000',
        'price' => 'required|integer|min:0', 'discount' => 'integer|min:0|max:90', 'stock' => 'integer|min:0', 'benefits' => 'max:500'];

    public function index(Request $r): array
    {
        $rows = Product::search((string) ($r->query['q'] ?? ''), (string) ($r->query['category'] ?? ''));
        return $this->ok(array_map([Product::class, 'toResource'], $rows));
    }

    public function show(Request $r): array
    {
        $p = Product::withCategory((int) $r->params['id']) ?? $this->notFound('Produk');
        return $this->ok(Product::toResource($p));
    }

    public function store(Request $r): array
    {
        $d = $this->payload($r);
        $d['image'] = $this->upload($r) ?? 'images/skincare.jpg';
        $p = Product::create($d);
        http_response_code(201);
        return $this->ok(Product::toResource(Product::withCategory((int) $p['id'])), 'Produk dibuat.');
    }

    public function update(Request $r): array
    {
        $id = (int) $r->params['id'];
        Product::find($id) ?? $this->notFound('Produk');
        $d = $this->payload($r);
        if ($img = $this->upload($r)) $d['image'] = $img; // file opsional saat update
        Product::update($id, $d);
        return $this->ok(Product::toResource(Product::withCategory($id)), 'Produk diperbarui.');
    }

    public function destroy(Request $r): array
    {
        Product::find((int) $r->params['id']) ?? $this->notFound('Produk');
        Product::delete((int) $r->params['id']);
        return $this->ok(null, 'Produk dihapus.');
    }

    private function payload(Request $r): array
    {
        $d = Validator::validate($r->all(), self::RULES);
        if (!Category::find((int) $d['category_id'])) Response::error('Data tidak valid.', 422, ['category_id' => ['Kategori tidak ada.']]);
        $d['description'] = $d['description'] ?? '';
        $d['discount'] = (int) ($d['discount'] ?? 0);
        $d['stock'] = (int) ($d['stock'] ?? 0);
        $d['benefits'] = json_encode(array_values(array_filter(array_map('trim', explode(',', (string) ($d['benefits'] ?? ''))))));
        return $d;
    }

    /** Upload gambar ke storage/uploads, validasi tipe (MIME asli) & ukuran maks 2MB. */
    private function upload(Request $r): ?string
    {
        $f = $r->file('image');
        if (!$f) return null;
        $mime = $f['error'] === UPLOAD_ERR_OK ? mime_content_type($f['tmp_name']) : '';
        $ext = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'][$mime] ?? null;
        if (!$ext) Response::error('Data tidak valid.', 422, ['image' => ['File harus JPG, PNG, atau WEBP.']]);
        if ($f['size'] > 2 * 1024 * 1024) Response::error('Data tidak valid.', 422, ['image' => ['Ukuran maksimal 2MB.']]);
        $name = bin2hex(random_bytes(10)) . '.' . $ext;
        move_uploaded_file($f['tmp_name'], dirname(__DIR__, 2) . '/storage/uploads/' . $name);
        return 'uploads/' . $name;
    }
}
