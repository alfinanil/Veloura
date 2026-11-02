<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\{Request, Response, Validator};
use App\Models\{Order, User};

final class CustomerController extends Controller
{
    public function index(Request $r): array { return $this->ok(User::customers((string) ($r->query['q'] ?? ''))); }

    public function show(Request $r): array
    {
        $u = User::find((int) $r->params['id']);
        if (!$u || $u['role'] !== 'customer') $this->notFound('Pelanggan');
        $orders = Order::query('SELECT id, code, total, status, created_at FROM orders WHERE user_id = ? ORDER BY id DESC', [$u['id']]);
        return $this->ok($this->safeUser($u) + ['orders' => $orders]);
    }

    public function update(Request $r): array
    {
        $u = User::find((int) $r->params['id']);
        if (!$u || $u['role'] !== 'customer') $this->notFound('Pelanggan');
        $d = Validator::validate($r->all(), ['name' => 'required|max:100', 'phone' => 'max:30', 'active' => 'in:0,1']);
        if (isset($d['active'])) $d['active'] = (int) $d['active'];
        return $this->ok($this->safeUser(User::update((int) $u['id'], $d)), 'Pelanggan diperbarui.');
    }

    public function destroy(Request $r): array
    {
        $u = User::find((int) $r->params['id']);
        if (!$u || $u['role'] !== 'customer') $this->notFound('Pelanggan');
        User::delete((int) $u['id']);
        return $this->ok(null, 'Pelanggan dihapus.');
    }
}
