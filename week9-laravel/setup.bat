@echo off
setlocal
cd /d "%~dp0"

echo ==================================================
echo   Veloura - Week 9 (Laravel + Migration + CRUD)
echo ==================================================
echo.

where php >nul 2>nul
if errorlevel 1 goto nophp
where composer >nul 2>nul
if errorlevel 1 goto nocomposer

if exist vendor\autoload.php goto havevendor

echo [1/5] Mengunduh kerangka Laravel via Composer - butuh internet, beberapa menit...
if exist _skeleton rmdir /s /q _skeleton
call composer create-project laravel/laravel:^12.0 _skeleton --prefer-dist --no-scripts --no-interaction
if errorlevel 1 goto fail

echo      Menggabungkan kerangka Laravel dengan file Week 9 - file Week 9 tidak ditimpa...
robocopy _skeleton . /E /XC /XN /XO /NFL /NDL /NJH /NJS /NP >nul
if errorlevel 8 goto fail
rmdir /s /q _skeleton
goto env

:havevendor
echo [1/5] Kerangka Laravel sudah ada, dilewati.

:env
echo [2/5] Menyiapkan file .env...
if not exist .env copy .env.example .env >nul

echo [3/5] Membuat APP_KEY...
call php artisan key:generate --force
if errorlevel 1 goto fail
call php artisan package:discover --ansi

echo [4/5] Membuat database veloura jika belum ada...
where mysql >nul 2>nul
if errorlevel 1 goto nomysql
mysql -uroot -e "CREATE DATABASE IF NOT EXISTS veloura CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if errorlevel 1 goto dbfail
goto migrate

:nomysql
echo      Perintah mysql tidak ditemukan. Pastikan database bernama veloura sudah dibuat
echo      lewat HeidiSQL atau phpMyAdmin Laragon.

:migrate
echo [5/5] Menjalankan migration dan seeder...
call php artisan migrate --seed --force
if errorlevel 1 goto dbfail

echo.
echo ==================================================
echo   SELESAI
echo   Jalankan:  php artisan serve
echo   Lalu buka: http://127.0.0.1:8000
echo ==================================================
endlocal
exit /b 0

:nophp
echo [ERROR] php tidak ditemukan.
echo Buka Laragon, klik tombol Terminal, lalu jalankan setup.bat dari terminal tersebut.
exit /b 1

:nocomposer
echo [ERROR] composer tidak ditemukan.
echo Buka Laragon, klik tombol Terminal, lalu jalankan setup.bat dari terminal tersebut.
exit /b 1

:dbfail
echo.
echo [ERROR] Koneksi database gagal.
echo Pastikan MySQL di Laragon sudah Start, lalu jalankan setup.bat lagi.
exit /b 1

:fail
echo.
echo [ERROR] Langkah di atas gagal. Baca pesan error di atas, perbaiki, lalu jalankan setup.bat lagi.
echo Jika composer menolak karena versi PHP, ganti versi PHP di Laragon: Menu - PHP - Version.
exit /b 1
