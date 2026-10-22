@echo off
chcp 65001 >nul
title KUR'AN-I KERIM - Tilavet, Tecvid ve Ayet Inceleme Atolyesi
color 0F

cd /d "%~dp0"

echo.
echo ===============================================================================
echo   KUR'AN-I KERIM - TILAVET, TECVID VE AYET INCELEME ATOLYESI
echo ===============================================================================
echo.
echo   [GUNCEL DOSYA VE REFERANS BILGISI]
echo   -----------------------------------------------------------------------------
echo   * Ana Mushaf ve Tilavet Atolyesi  : index.html       (Port 8000 /)
echo   * Tilavet Akademisi & Makam Okulu : index.html#tab-akademi
echo   * Ayet Inceleme ve Esbab-i Nuzul  : inceleme.html    (Port 8000 /inceleme.html)
echo   * Tilavet ve Uthmani Hat Motoru   : tilavet_engine.js
echo   * Tilavet Akademisi Motoru        : tilavet_akademi_engine.js & tilavet_audio_lab.js
echo   * 114 Sure ve Tefsir Motoru       : inceleme_engine.js
echo   * UI ve HUD Katmani               : ui.js
echo   * Obsidyen Altin Tema Stili       : style.css & tilavet_akademi.css
echo ===============================================================================
echo.

REM 1. Port 8000 ve Saglik Kontrolu
powershell -NoProfile -Command "$ok = $false; try { $r = Invoke-WebRequest -Uri 'http://localhost:8000/index.html' -TimeoutSec 2 -UseBasicParsing; if ($r.StatusCode -eq 200 -and $r.Headers['Cache-Control']) { $ok = $true } } catch {}; if (-not $ok) { Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }; exit 1 } else { exit 0 }" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [1/2] Yerel Python HTTP Sunucusu (Port 8000) baslatiliyor...
    powershell -NoProfile -WindowStyle Hidden -Command "Start-Process -WindowStyle Hidden python -ArgumentList 'sunucu.py 8000' -WorkingDirectory '%~dp0'"
    timeout /t 1 /nobreak >nul
) else (
    echo [1/2] Yerel HTTP Sunucusu (Port 8000) aktif durumda calisiyor.
)

echo.
echo [2/2] Baslatma Secenekleri:
echo       [1] Ana Mushaf ve Tilavet Atolyesini Ac (index.html) [Varsayilan]
echo       [2] Tilavet Akademisi & Makam Okulunu Ac (index.html#tab-akademi)
echo       [3] Ayet Inceleme ve Esbab-i Nuzul Sayfasini Ac (inceleme.html)
echo       [4] Masaustu Bagimsiz Pencere Modunda Ac (Chrome/Edge App)
echo       [5] Masaustu Kisayollarini Yenile
echo.
echo 3 saniye icinde tuslayabilirsiniz (otomatik 1 acilir)...

choice /c 12345 /t 3 /d 1 /n /m "Seciminiz [1, 2, 3, 4, 5] -> "
set SECIM=%ERRORLEVEL%

if "%SECIM%"=="1" (
    echo.
    echo Ana Mushaf ve Tilavet Atolyesi aciliyor: http://localhost:8000/index.html
    start "" "http://localhost:8000/index.html"
)
if "%SECIM%"=="2" (
    echo.
    echo Tilavet Akademisi aciliyor: http://localhost:8000/index.html#tab-akademi
    start "" "http://localhost:8000/index.html#tab-akademi"
)
if "%SECIM%"=="3" (
    echo.
    echo Ayet Inceleme ve Tefsir Meclisi aciliyor: http://localhost:8000/inceleme.html
    start "" "http://localhost:8000/inceleme.html"
)
if "%SECIM%"=="4" (
    echo.
    echo Masaustu Pencere Modu baslatiliyor...
    call "%~dp0baslat_masaustu.bat"
)
if "%SECIM%"=="5" (
    echo.
    echo Masaustu kisayollari yenileniyor...
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0create_shortcut.ps1"
    timeout /t 1 /nobreak >nul
    start "" "http://localhost:8000/index.html"
)

echo.
echo ===============================================================================
echo   Sistem aktif: http://localhost:8000/
echo   Uygulamayi kapatmak icin bu pencereyi kapatabilirsiniz.
echo ===============================================================================
echo.
pause
