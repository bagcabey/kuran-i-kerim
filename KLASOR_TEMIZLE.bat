@echo off
chcp 65001 >nul
title YAZARLIK 101 - Klasor temizligi
cd /d "%~dp0"
echo.
echo ===============================================================
echo   KLASOR TEMIZLIGI  (Kur'an-i Kerim uygulamasi: kimatik_lab)
echo ===============================================================
echo.
echo  1. ADIM - Kur'an projesiyle ilgisi olmayan / gereksiz ogeler:
echo     - ders_kitabi\          (Edebiyat Kurami ders kitabi - farkli proje)
echo     - backup_pre_v3\        (eski yedek; icinde KPSS-Takip ve ders kitabi kopyalari)
echo     - temp_chrome_profile\  (gecici tarayici profili)
echo     - __pycache__\          (Python onbellegi)
echo     - node_modules\         (calisan uygulama kullanmiyor; npm install ile geri gelir)
echo     - kimatik_lab\screen_*.png ve UI_UX_RADICAL_TRANSFORMATION_MASTERPLAN.md (eski ekran goruntuleri/notlar)
echo.
choice /c EH /n /m "  Bunlar silinsin mi? [E = Evet, H = Hayir] -> "
if errorlevel 2 goto adim2
if exist "ders_kitabi" rd /s /q "ders_kitabi"
if exist "backup_pre_v3" rd /s /q "backup_pre_v3"
if exist "temp_chrome_profile" rd /s /q "temp_chrome_profile"
if exist "__pycache__" rd /s /q "__pycache__"
if exist "node_modules" rd /s /q "node_modules"
del /q "kimatik_lab\screen_*.png" 2>nul
del /q "kimatik_lab\UI_UX_RADICAL_TRANSFORMATION_MASTERPLAN.md" 2>nul
echo   1. adim tamamlandi.

:adim2
echo.
echo  2. ADIM (istege bagli) - Kur'an projesinin ESKI React/Node surumu.
echo     Calisan uygulama (kimatik_lab) bunlari KULLANMIYOR:
echo     - src\ server\ db\ tests\ scripts\ makam_okulu\ data\ docs\
echo     - package.json, package-lock.json, tsconfig.json, vitest.config.ts
echo.
choice /c EH /n /m "  Bunlar da silinsin mi? [E = Evet, H = Hayir] -> "
if errorlevel 2 goto bitti
for %%D in (src server db tests scripts makam_okulu data docs) do if exist "%%D" rd /s /q "%%D"
for %%F in (package.json package-lock.json tsconfig.json vitest.config.ts) do if exist "%%F" del /q "%%F"
echo   2. adim tamamlandi.

:bitti
echo.
echo  Bitti. Uygulamayi BASLAT.bat ile acabilirsiniz.
echo  Not: OneDrive silinen dosyalari 30 gun boyunca Geri Donusum Kutusu'nda tutar.
echo.
pause
