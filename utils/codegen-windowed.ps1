param(
    [string]$Url = "https://cenvicagencydev.alliancetek.net/",
    [int]$Width = 1400,
    [int]$Height = 900
)

if (-not $Url) {
    Write-Host "Usage: .\utils\codegen-windowed.ps1 -Url <url> [-Width <width>] [-Height <height>]"
    Write-Host "Example: .\utils\codegen-windowed.ps1 -Url https://cenvicagencydev.alliancetek.net/"
    exit 1
}

Write-Host "Starting Codegen in windowed mode ($($Width)x$($Height))"
Write-Host "URL: $Url"
Write-Host ""

# Launch codegen with Chromium flags to disable full-screen
$env:PLAYWRIGHT_ARGS = "--disable-fullscreen --window-size=$Width,$Height"

# Start codegen
& npx.cmd playwright codegen --browser=chromium $Url
