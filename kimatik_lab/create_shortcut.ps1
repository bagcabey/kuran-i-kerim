$desktopPath = [System.IO.Path]::Combine([System.Environment]::GetFolderPath('Desktop'))
if (-not (Test-Path $desktopPath)) {
    $desktopPath = "C:\Users\omerb\OneDrive\Desktop"
}

$labPath = "C:\Users\omerb\OneDrive\Desktop\YAZARLIK 101\kimatik_lab"
$vbsPath = Join-Path $labPath "baslat_sessiz.vbs"

$iconPath = "C:\Program Files\Google\Chrome\Application\chrome.exe,0"
if (-not (Test-Path "C:\Program Files\Google\Chrome\Application\chrome.exe")) {
    if (Test-Path "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe") {
        $iconPath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe,0"
    } else {
        $iconPath = "C:\Windows\System32\shell32.dll,221"
    }
}

$wsh = New-Object -ComObject WScript.Shell

# 1. Guncel Kisayol: Kuran-i Kerim - Tilavet ve Tefsir
$newLnkPath = Join-Path $desktopPath "Kuran-i Kerim - Tilavet ve Tefsir.lnk"
$sc1 = $wsh.CreateShortcut($newLnkPath)
$sc1.TargetPath = "wscript.exe"
$sc1.Arguments = "`"$vbsPath`""
$sc1.WorkingDirectory = $labPath
$sc1.Description = "Kuran-i Kerim - Medine Mushafi, Tilavet, Tecvid ve Tefsir Meclisi"
$sc1.IconLocation = $iconPath
$sc1.Save()

# 2. Eski Kisayol (CYMATIQUE) da ayni guncel dosyalara baglandi
$oldLnkPath = Join-Path $desktopPath "CYMATIQUE - Kuran ve Tilavet.lnk"
$sc2 = $wsh.CreateShortcut($oldLnkPath)
$sc2.TargetPath = "wscript.exe"
$sc2.Arguments = "`"$vbsPath`""
$sc2.WorkingDirectory = $labPath
$sc2.Description = "Kuran-i Kerim - Medine Mushafi, Tilavet, Tecvid ve Tefsir Meclisi"
$sc2.IconLocation = $iconPath
$sc2.Save()

Write-Host "Yeni kisayol olusturuldu: $newLnkPath"
Write-Host "Eski kisayol guncellendi: $oldLnkPath"
