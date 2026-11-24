<?php

return [
    // Kunci rahasia penanda tangan token. Jika JWT_SECRET kosong, dipakai APP_KEY.
    'secret' => env('JWT_SECRET') ?: env('APP_KEY'),

    // Masa berlaku token (detik). Default 1 jam.
    'ttl' => (int) env('JWT_TTL', 3600),
];
