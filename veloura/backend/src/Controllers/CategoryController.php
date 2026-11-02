<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\{Request, Response, Validator};
use App\Models\Category;

final class CategoryController extends Controller
{
    public function index(Request $r): array { return $this->ok(Category::withCounts()); }

    public function store(Request $r): array
    {
        $d = $this->payload($r);
        http_response_code(201);
        return $this->ok(Category::create($d), 'Kategori dibuat.');
    }

    public function update(Request $r): array
    {
        $id = (int) $r->params['id'];
        Category::find($id) ?? $this->notFound('Kategori');
        return $this->ok(Category::update($id, $this->payload($r, $id)), 'Kategori diperbarui.');
    }

    public function destroy(Request $r): array
    {
        Category::find((int) $r->params['id']) ?? $this->notFound('Kategori');
        Category::delete((int) $r->params['id']);
        return $this->ok(null, 'Kategori dihapus.');
    }

    private function payload(Request $r, int $ignoreId = 0): array
    {
        $d = Validator::validate($r->all(), ['name' => 'required|max:60', 'description' => 'max:200']);
        $dup = Category::query('SELECT id FROM categories WHERE name = ? AND id != ?', [$d['name'], $ignoreId]);
        if ($dup) Response::error('Data tidak valid.', 422, ['name' => ['Nama kategori sudah ada.']]);
        return $d;
    }
}
