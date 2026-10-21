@echo off
chcp 65001 >nul
cd /d "%~dp0kimatik_lab"
call "%~dp0kimatik_lab\baslat_masaustu.bat" %*
exit /b 0
