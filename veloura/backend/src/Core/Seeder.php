<?php
declare(strict_types=1);

namespace App\Core;

use PDO;

final class Seeder
{
    public static function run(PDO $db): void
    {
        $now = fn(int $daysAgo = 0): string => date('Y-m-d H:i:s', strtotime("-$daysAgo days"));
        $u = $db->prepare('INSERT INTO users (name,email,password,role,phone,created_at) VALUES (?,?,?,?,?,?)');
        $u->execute(['Administrator', 'admin@veloura.com', password_hash('admin123', PASSWORD_DEFAULT), 'admin', '081200000000', $now(60)]);
        foreach ([['Sarah', 'sarah@mail.com', 40], ['Amanda', 'amanda@mail.com', 35], ['Jessica', 'jessica@mail.com', 12], ['Putri', 'putri@mail.com', 3]] as $i => [$n, $e, $d]) {
            $u->execute([$n, $e, password_hash('password123', PASSWORD_DEFAULT), 'customer', '08130000000' . $i, $now($d)]);
        }

        $c = $db->prepare('INSERT INTO categories (name,description,created_at) VALUES (?,?,?)');
        foreach ([['Skincare', 'Serum, moisturizer & cleanser'], ['Makeup', 'Lipstick, blush & powder'], ['Haircare', 'Shampoo, serum & masks'], ['Bodycare', 'Lotion & body scrub']] as [$n, $d]) {
            $c->execute([$n, $d, $now(60)]);
        }

        $p = $db->prepare('INSERT INTO products (name,category_id,subtitle,description,price,discount,stock,rating,review_count,benefits,image,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)');
        $rows = [
            ['Hydration Glow Serum', 1, 'Hyaluronic Acid & Niacinamide', 'Ultra-hydrating facial serum with hyaluronic acid and niacinamide to restore radiant glow.', 135000, 15, 40, 4.9, 240, ['Plumping Moisture', 'Pore Refining', '100% Vegan'], 'images/skincare.jpg'],
            ['Vitamin C Brightening Cream', 1, 'Antioxidant Radiance Booster', 'Lightweight moisturizer with stable Vitamin C to brighten dull complexion.', 145000, 10, 32, 4.8, 185, ['Brightening', 'Fades Dark Spots', 'Daily Defense'], 'images/skincare.jpg'],
            ['Velvet Matte Rose Lipstick', 2, 'Long-Wear Satin Finish', 'Velvety matte lipstick with rich pigmentation and jojoba oil.', 89000, 20, 60, 4.9, 310, ['8h Long Wear', 'Non-Drying', 'Rich Pigment'], 'images/makeup.jpg'],
            ['Radiant Glow Blush Powder', 2, 'Soft Peach Luminizer', 'Silky powder blush with light-reflecting micro-pearls.', 95000, 0, 45, 4.7, 128, ['Natural Flush', 'Seamless Blend'], 'images/makeup.jpg'],
            ['Botanical Hydrating Shampoo', 3, 'Argan Oil & Aloe Vera Formula', 'Nourishing shampoo that cleanses and restores shine without harsh sulfates.', 95000, 15, 50, 4.9, 142, ['Sulfate-Free', 'Deep Moisture'], 'images/haircare.jpg'],
            ['Golden Silk Hair Repair Serum', 3, 'Heat Protectant & Frizz Control', 'Leave-in treatment with keratin and golden argan oil.', 125000, 10, 28, 4.8, 89, ['Frizz Control', 'Heat Protection'], 'images/haircare.jpg'],
            ['Velvet Rose Silky Body Lotion', 4, 'Soft & Non-Sticky Hydration', 'Fast-absorbing body lotion with shea butter and rose essence.', 85000, 20, 70, 4.9, 210, ['24h Moisture', 'Fast Absorbing'], 'images/bodycare.jpg'],
            ['Pink Himalayan Salt Body Scrub', 4, 'Smooth & Glow Exfoliator', 'Exfoliating scrub with sweet almond oil and coconut blossom.', 99000, 0, 35, 4.7, 76, ['Gentle Exfoliation', 'Radiant Glow'], 'images/bodycare.jpg'],
        ];
        foreach ($rows as $i => $r) {
            $r[9] = json_encode($r[9]);
            $p->execute([...$r, $now($i < 5 ? 10 : 45)]);
        }

        $o = $db->prepare('INSERT INTO orders (code,user_id,customer_name,total,status,created_at) VALUES (?,?,?,?,?,?)');
        $oi = $db->prepare('INSERT INTO order_items (order_id,product_id,name,price,qty) VALUES (?,?,?,?,?)');
        $orders = [
            [120, 2, 'Sarah', 'completed', 36, [[1, 1], [3, 1]]], [121, 3, 'Amanda', 'completed', 30, [[5, 2]]],
            [122, 4, 'Jessica', 'completed', 21, [[2, 1]]], [123, 2, 'Sarah', 'shipped', 8, [[7, 1], [8, 1]]],
            [124, 5, 'Putri', 'completed', 5, [[4, 2]]], [125, 3, 'Amanda', 'cancelled', 4, [[6, 1]]],
            [126, 4, 'Jessica', 'shipped', 2, [[7, 2]]], [127, 3, 'Amanda', 'processing', 1, [[1, 1], [2, 1], [3, 1]]],
            [128, 2, 'Sarah', 'completed', 0, [[1, 1], [8, 1]]],
        ];
        foreach ($orders as [$n, $uid, $name, $st, $d, $items]) {
            $total = 0;
            $lines = [];
            foreach ($items as [$pid, $q]) {
                $pr = $db->query("SELECT name, price, discount FROM products WHERE id = $pid")->fetch();
                $price = (int) (round($pr['price'] * (1 - $pr['discount'] / 100) / 1000) * 1000);
                $total += $price * $q;
                $lines[] = [$pid, $pr['name'], $price, $q];
            }
            $o->execute(['VL' . str_pad((string) $n, 5, '0', STR_PAD_LEFT), $uid, $name, $total, $st, $now($d)]);
            $oid = (int) $db->lastInsertId();
            foreach ($lines as $l) $oi->execute([$oid, ...$l]);
        }

        $s = $db->prepare('INSERT INTO settings (key,value) VALUES (?,?)');
        foreach ([['store_name', 'Veloura Beauty'], ['store_email', 'hello@veloura.com'], ['store_phone', '+62 812-3456-7890'],
                  ['store_address', 'Jakarta, Indonesia'], ['free_shipping_threshold', '200000'], ['promo_code', 'VELOURA15']] as $row) {
            $s->execute($row);
        }
    }
}
