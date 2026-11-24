<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Data awal sama dengan seeder backend Veloura sebelumnya (8 produk).
        $products = [
            ['Hydration Glow Serum', 'Skincare', 'Hyaluronic Acid & Niacinamide', 'Ultra-hydrating facial serum with hyaluronic acid and niacinamide to restore radiant glow.', 135000, 15, 40, 'images/skincare.jpg'],
            ['Vitamin C Brightening Cream', 'Skincare', 'Antioxidant Radiance Booster', 'Lightweight moisturizer with stable Vitamin C to brighten dull complexion.', 145000, 10, 32, 'images/skincare.jpg'],
            ['Velvet Matte Rose Lipstick', 'Makeup', 'Long-Wear Satin Finish', 'Velvety matte lipstick with rich pigmentation and jojoba oil.', 89000, 20, 60, 'images/makeup.jpg'],
            ['Radiant Glow Blush Powder', 'Makeup', 'Soft Peach Luminizer', 'Silky powder blush with light-reflecting micro-pearls.', 95000, 0, 45, 'images/makeup.jpg'],
            ['Botanical Hydrating Shampoo', 'Haircare', 'Argan Oil & Aloe Vera Formula', 'Nourishing shampoo that cleanses and restores shine without harsh sulfates.', 95000, 15, 50, 'images/haircare.jpg'],
            ['Golden Silk Hair Repair Serum', 'Haircare', 'Heat Protectant & Frizz Control', 'Leave-in treatment with keratin and golden argan oil.', 125000, 10, 28, 'images/haircare.jpg'],
            ['Velvet Rose Silky Body Lotion', 'Bodycare', 'Soft & Non-Sticky Hydration', 'Fast-absorbing body lotion with shea butter and rose essence.', 85000, 20, 70, 'images/bodycare.jpg'],
            ['Pink Himalayan Salt Body Scrub', 'Bodycare', 'Smooth & Glow Exfoliator', 'Exfoliating scrub with sweet almond oil and coconut blossom.', 99000, 0, 35, 'images/bodycare.jpg'],
        ];

        foreach ($products as [$name, $category, $subtitle, $description, $price, $discount, $stock, $image]) {
            Product::updateOrCreate(
                ['name' => $name],
                [
                    'category_id' => Category::where('name', $category)->value('id'),
                    'subtitle' => $subtitle,
                    'description' => $description,
                    'price' => $price,
                    'discount' => $discount,
                    'stock' => $stock,
                    'image' => $image,
                ]
            );
        }
    }
}
