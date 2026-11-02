<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\{Database, Request, Response, Validator};
use App\Models\{Order, Product, Setting};

final class OrderController extends Controller
{
    public function index(Request $r): array
    {
        return $this->ok(Order::filtered((string) ($r->query['status'] ?? ''), (string) ($r->query['q'] ?? '')));
    }

    public function show(Request $r): array
    {
        $o = Order::find((int) $r->params['id']) ?? $this->notFound('Pesanan');
        return $this->ok($o + ['items' => Order::items((int) $o['id'])]);
    }

    /** Checkout dari storefront (user login). Harga dihitung ulang di server, bukan percaya klien. */
    public function store(Request $r): array
    {
        $items = $r->input('items');
        if (!is_array($items) || !$items) Response::error('Data tidak valid.', 422, ['items' => ['Keranjang kosong.']]);

        $pdo = Database::pdo();
        $pdo->beginTransaction();
        $total = 0;
        $lines = [];
        foreach ($items as $it) {
            $p = Product::find((int) ($it['id'] ?? 0));
            $qty = max(1, (int) ($it['qty'] ?? 1));
            if (!$p) { $pdo->rollBack(); Response::error('Produk tidak ditemukan.', 422); }
            if ($p['stock'] < $qty) { $pdo->rollBack(); Response::error("Stok {$p['name']} tidak cukup.", 422, ['items' => ["Stok {$p['name']} tersisa {$p['stock']}."]]); }
            $price = (int) (round($p['price'] * (1 - $p['discount'] / 100) / 1000) * 1000);
            $total += $price * $qty;
            $lines[] = [$p, $price, $qty];
        }
        $order = Order::create(['code' => Order::nextCode(), 'user_id' => $r->user['id'], 'customer_name' => $r->user['name'], 'total' => $total, 'status' => 'pending']);
        foreach ($lines as [$p, $price, $qty]) {
            Order::addItem((int) $order['id'], (int) $p['id'], $p['name'], $price, $qty);
            Product::update((int) $p['id'], ['stock' => $p['stock'] - $qty]);
        }
        $pdo->commit();
        http_response_code(201);
        return $this->ok($order, 'Pesanan dibuat.');
    }

    /**
 * Menampilkan pesanan milik customer yang sedang login.
 */
public function myOrders(Request $r): array
{
    $orders = Order::forUser((int) $r->user['id']);

    foreach ($orders as &$order) {
        $order['items'] = Order::items((int) $order['id']);
    }

    return $this->ok($orders);
}

/**
 * Menampilkan detail satu pesanan milik customer yang sedang login.
 */
public function myOrder(Request $r): array
{
    $order = Order::find((int) $r->params['id']);

    if (!$order || (int) $order['user_id'] !== (int) $r->user['id']) {
        return $this->notFound('Pesanan');
    }

    return $this->ok(
        $order + [
            'items' => Order::items((int) $order['id'])
        ]
    );
}

    public function updateStatus(Request $r): array
    {
        $o = Order::find((int) $r->params['id']) ?? $this->notFound('Pesanan');
        $d = Validator::validate($r->all(), ['status' => 'required|in:' . implode(',', Order::STATUSES)]);
        return $this->ok(Order::update((int) $o['id'], $d), 'Status diperbarui.');
    }

    public function destroy(Request $r): array
    {
        Order::find((int) $r->params['id']) ?? $this->notFound('Pesanan');
        Order::delete((int) $r->params['id']);
        return $this->ok(null, 'Pesanan dihapus.');
    }
}
