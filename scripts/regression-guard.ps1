# Astrologica Architectural Regression Guards
$ErrorActionPreference = "Stop"

Write-Host "Running Architectural Regression Guards..." -ForegroundColor Cyan

# 1. Ephemeris libraries in core
$pyswisseph = Get-ChildItem -Recurse -Include *.py,*.js,*.ts,*.tsx -Path services,packages,apps -Exclude *test* -ErrorAction SilentlyContinue | Select-String -Pattern "pyswisseph" -SimpleMatch
if ($pyswisseph) {
    Write-Error "Regression Guard Failed: pyswisseph detected in core codebase!"
}

$flatlib = Get-ChildItem -Recurse -Include *.py,*.js,*.ts,*.tsx -Path services,packages,apps -Exclude *test* -ErrorAction SilentlyContinue | Select-String -Pattern "flatlib" -SimpleMatch
if ($flatlib) {
    Write-Error "Regression Guard Failed: flatlib detected in core codebase!"
}

# 2. html2canvas
$html2canvas = Get-ChildItem -Recurse -Include *.js,*.jsx,*.ts,*.tsx,package.json -Path apps/web/src,packages -Exclude *test* -ErrorAction SilentlyContinue | Select-String -Pattern "html2canvas" -SimpleMatch
if ($html2canvas) {
    Write-Error "Regression Guard Failed: html2canvas detected!"
}

# 3. timezones[0]
$tzZero = Get-ChildItem -Recurse -Include *.py,*.js,*.jsx,*.ts,*.tsx -Path services,packages,apps -Exclude *test* -ErrorAction SilentlyContinue | Select-String -Pattern "timezones[0]" -SimpleMatch
if ($tzZero) {
    Write-Error "Regression Guard Failed: timezones[0] bug detected!"
}

Write-Host "[PASS] All Architectural Regression Guards Passed!" -ForegroundColor Green
exit 0
