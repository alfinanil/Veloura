<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\{Request, Validator};
use App\Models\Setting;

final class SettingController extends Controller
{
    public function index(Request $r): array { return $this->ok(Setting::all()); }

    public function update(Request $r): array
    {
        $d = Validator::validate($r->all(), ['store_name' => 'required|max:80', 'store_email' => 'required|email', 'store_phone' => 'max:30',
            'store_address' => 'max:200', 'free_shipping_threshold' => 'required|integer|min:0', 'promo_code' => 'max:30']);
        foreach ($d as $k => $v) Setting::set($k, (string) $v);
        return $this->ok(Setting::all(), 'Pengaturan disimpan.');
    }
}
