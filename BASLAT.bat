@echo off
chcp 65001 >nul
title KUR'AN-I KERIM - Proje Baslatici
color 0F

cd /d "%~dp0"

echo.
echo ===============================================================================
echo                      KUR'AN-I KERIM - PROJE BASLATICI
echo ===============================================================================
echo.
echo   [1] KUR'AN-I KERIM - Tilavet, Tecvid ve Ayet Inceleme Atolyesi (Tarayici Modu)
echo       - Konum: kimatik_lab\
echo       - Adres: http://localhost:8000/
echo.
echo   [2] KUR'AN-I KERIM - Masaustu Pencere Modu (Chrome / Edge App Penceresi)
echo.
echo ===============================================================================
echo 3 saniye icinde secim yapabilirsiniz (varsayilan: [1] Tarayici Modu)...

choice /c 12 /t 3 /d 1 /n /m "Seciminiz [1, 2] -> "
set PRJ_SECIM=%ERRORLEVEL%

if "%PRJ_SECIM%"=="1" (
    echo.
    echo Kur'an-i Kerim Atolyesi baslatiliyor...
    cd /d "%~dp0kimatik_lab"
    call "%~dp0kimatik_lab\baslat.bat"
    exit /b 0
)

if "%PRJ_SECIM%"=="2" (
    echo.
    echo Kur'an-i Kerim Masaustu Pencere Modu aciliyor...
    cd /d "%~dp0kimatik_lab"
    call "%~dp0kimatik_lab\baslat_masaustu.bat"
    exit /b 0
)
