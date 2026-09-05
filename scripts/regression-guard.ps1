# Astrologica Architectural Regression Guards
$ErrorActionPreference = "Stop"

Write-Host "Running Architectural Regression Guards..." -ForegroundColor Cyan

# 1. Ephemeris libraries in core
$pyswisseph = Get-ChildItem -Recurse -Include *.py,*.js,*.ts,*.tsx -Path services,packages,apps,modules -Exclude *test*,*spec*,__tests__,node_modules,dist -ErrorAction SilentlyContinue | Select-String -Pattern "pyswisseph" -SimpleMatch
if ($pyswisseph) {
    Write-Error "Regression Guard Failed: pyswisseph detected in core codebase!"
}

$flatlib = Get-ChildItem -Recurse -Include *.py,*.js,*.ts,*.tsx -Path services,packages,apps,modules -Exclude *test*,*spec*,__tests__,node_modules,dist -ErrorAction SilentlyContinue | Select-String -Pattern "flatlib" -SimpleMatch
if ($flatlib) {
    Write-Error "Regression Guard Failed: flatlib detected in core codebase!"
}

# 2. html2canvas dependencies and imports
$html2canvasDeps = Get-ChildItem -Recurse -Include package.json -Path apps,packages,modules -Exclude node_modules -ErrorAction SilentlyContinue | Select-String -Pattern '"html2canvas"' -SimpleMatch
if ($html2canvasDeps) {
    Write-Error "Regression Guard Failed: html2canvas detected in package.json!"
}

$html2canvasSrc = Get-ChildItem -Recurse -Include *.js,*.jsx,*.ts,*.tsx -Path apps/web/src,packages,modules -Exclude *test*,*spec*,__tests__,node_modules,dist -ErrorAction SilentlyContinue | Select-String -Pattern "html2canvas" -SimpleMatch
if ($html2canvasSrc) {
    Write-Error "Regression Guard Failed: html2canvas detected in source files!"
}

# 3. timezones[0]
$tzZero = Get-ChildItem -Recurse -Include *.py,*.js,*.jsx,*.ts,*.tsx -Path services,packages,apps,modules -Exclude *test*,*spec*,__tests__,node_modules,dist -ErrorAction SilentlyContinue | Select-String -Pattern "timezones[0]" -SimpleMatch
if ($tzZero) {
    Write-Error "Regression Guard Failed: timezones[0] bug detected!"
}

# 4. Sync requests in async defs
$syncRequests = Get-ChildItem -Recurse -Include *.py -Path services/api/app -Exclude *test*,*spec*,__tests__ -ErrorAction SilentlyContinue | Select-String -Pattern "import requests" -SimpleMatch
if ($syncRequests) {
    Write-Error "Regression Guard Failed: synchronous requests library detected in backend!"
}

Write-Host "[PASS] All Architectural Regression Guards Passed!" -ForegroundColor Green
exit 0
