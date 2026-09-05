#!/usr/bin/env bash
set -eo pipefail

echo "Running Architectural Regression Guards..."

# 1. Ephemeris libraries in core
if grep -rnwi --exclude="*test*" "pyswisseph" services/ packages/ apps/ 2>/dev/null; then
  echo "Regression Guard Failed: pyswisseph detected in core codebase!"
  exit 1
fi

if grep -rnwi --exclude="*test*" "flatlib" services/ packages/ apps/ 2>/dev/null; then
  echo "Regression Guard Failed: flatlib detected in core codebase!"
  exit 1
fi

# 2. html2canvas
if grep -rnwi --exclude="*test*" "html2canvas" apps/web/src/ packages/ 2>/dev/null; then
  echo "Regression Guard Failed: html2canvas detected!"
  exit 1
fi

# 3. timezones[0]
if grep -rnwi --exclude="*test*" "timezones\[0\]" services/ packages/ apps/ 2>/dev/null; then
  echo "Regression Guard Failed: timezones[0] bug detected!"
  exit 1
fi

echo "✔ All Architectural Regression Guards Passed!"
exit 0
