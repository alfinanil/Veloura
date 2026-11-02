<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Models\Model;

final class DashboardController extends Controller
{
    /** Persentase pertumbuhan bulan ini vs bulan lalu (null jika bulan lalu 0). */
    private function growth(string $sql): ?int
    {
        $cur = (float) Model::query($sql . " AND created_at >= date('now','start of month')")[0]['v'];
        $prev = (float) Model::query($sql . " AND created_at >= date('now','start of month','-1 month') AND created_at < date('now','start of month')")[0]['v'];
        return $prev > 0 ? (int) round(($cur - $prev) / $prev * 100) : null;
    }

    public function index(Request $r): array
    {
        $v = fn(string $sql) => (int) Model::query($sql)[0]['v'];
        return $this->ok([
            'stats' => [
                'products' => ['value' => $v('SELECT COUNT(*) v FROM products'), 'growth' => $this->growth('SELECT COUNT(*) v FROM products WHERE 1=1')],
                'orders' => ['value' => $v('SELECT COUNT(*) v FROM orders'), 'growth' => $this->growth('SELECT COUNT(*) v FROM orders WHERE 1=1')],
                'customers' => ['value' => $v("SELECT COUNT(*) v FROM users WHERE role='customer'"), 'growth' => $this->growth("SELECT COUNT(*) v FROM users WHERE role='customer'")],
                'revenue' => ['value' => $v("SELECT COALESCE(SUM(total),0) v FROM orders WHERE status!='cancelled'"), 'growth' => $this->growth("SELECT COALESCE(SUM(total),0) v FROM orders WHERE status!='cancelled'")],
            ],
            'recent_orders' => Model::query('SELECT id, code, customer_name, total, status, created_at FROM orders ORDER BY id DESC LIMIT 5'),
            'low_stock' => Model::query('SELECT id, name, stock FROM products WHERE stock <= 30 ORDER BY stock LIMIT 5'),
        ]);
    }
}
