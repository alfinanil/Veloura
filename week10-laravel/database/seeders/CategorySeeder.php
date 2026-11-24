<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Skincare', 'description' => 'Serum, moisturizer & cleanser'],
            ['name' => 'Makeup', 'description' => 'Lipstick, blush & powder'],
            ['name' => 'Haircare', 'description' => 'Shampoo, serum & masks'],
            ['name' => 'Bodycare', 'description' => 'Lotion & body scrub'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['name' => $category['name']], $category);
        }
    }
}
