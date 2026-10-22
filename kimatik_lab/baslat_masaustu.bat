@echo off
chcp 65001 >nul
title KUR'AN-I KERIM - Masaustu Uygulamasi
cd /d "%~dp0"

REM 1. Hedef Sayfa Belirleme (Varsayilan: index.html)
set "TARGET_PAGE=index.html"
if /i "%~1"=="inceleme" set "TARGET_PAGE=inceleme.html"
if /i "%~1"=="inceleme.html" set "TARGET_PAGE=inceleme.html"

REM 2. Port 8000 ve Saglik Kontrolu (Yanit vermiyorsa temizleyip yeniden baslat)
powershell -NoProfile -WindowStyle Hidden -Command "$ok = $false; try { $r = Invoke-WebRequest -Uri 'http://localhost:8000/index.html' -TimeoutSec 2 -UseBasicParsing; if ($r.StatusCode -eq 200 -and $r.Headers['Cache-Control']) { $ok = $true } } catch {}; if (-not $ok) { Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }; Start-Process -WindowStyle Hidden python -ArgumentList 'sunucu.py 8000' -WorkingDirectory '%~dp0' }"

REM 3. Sunucunun hazir olmasi icin kisa bekleme
powershell -NoProfile -Command "Start-Sleep -Milliseconds 400"

REM 4. Masaustu Bagimsiz Pencere Modunda Baslat
set "TARGET_URL=http://localhost:8000/%TARGET_PAGE%"

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --app="%TARGET_URL%" --window-size=1440,920
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --app="%TARGET_URL%" --window-size=1440,920
) else if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    start "" "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" --app="%TARGET_URL%" --window-size=1440,920
) else if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app="%TARGET_URL%" --window-size=1440,920
) else if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --app="%TARGET_URL%" --window-size=1440,920
) else (
    start "" "%TARGET_URL%"
)

exit /b 0
