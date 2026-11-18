@echo off
title EDGE.NODE IoT - Dashboard Monitoring Suhu dan Kelembapan DHT22
echo ======================================================================
echo   EDGE.NODE IoT - DHT22 Telemetry Sensor Monitoring Dashboard
echo   Framework : Next.js 14 (React 18 + Tailwind CSS + TypeScript)
echo   Firebase  : https://jaya-amin-project-default-rtdb.asia-southeast1.firebasedatabase.app/
echo ======================================================================
echo.

set PATH=C:\Users\E1404F\AppData\Local\Programs\nodejs;%PATH%
cd /d "%~dp0"

echo Membuka browser di http://localhost:3000 ...
start http://localhost:3000

echo Menjalankan server Next.js...
call npm run dev
pause
