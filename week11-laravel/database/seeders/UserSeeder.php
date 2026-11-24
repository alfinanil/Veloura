<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Akun untuk uji login JWT (hanya untuk pengembangan lokal)
        User::updateOrCreate(
            ['email' => 'admin@veloura.test'],
            [
                'name'     => 'Veloura Admin',
                'password' => Hash::make('password123'),
            ]
        );
    }
}
