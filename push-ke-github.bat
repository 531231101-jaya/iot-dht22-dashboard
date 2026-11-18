@echo off
title Push Project ke GitHub (iot-dht22-dashboard)
echo ======================================================================
echo   Mengirim (Push) Kode Dashboard ke GitHub
echo   Repositori: https://github.com/531231101-jaya/iot-dht22-dashboard.git
echo ======================================================================
echo.

set PATH=C:\Users\E1404F\AppData\Local\Programs\Git\cmd;C:\Users\E1404F\AppData\Local\Programs\gh;%PATH%
cd /d "%~dp0"

git remote remove origin 2>nul
git remote add origin https://github.com/531231101-jaya/iot-dht22-dashboard.git

echo Menjalankan git push ke GitHub...
echo (Jika jendela browser muncul untuk konfirmasi akun, cukup klik 'Authorize' / 'Sign in with browser')
echo.
git push -u origin main

echo.
echo ======================================================================
echo   Selesai! Cek repositori Anda di GitHub.
echo ======================================================================
pause
