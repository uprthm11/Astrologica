#!/usr/bin/env bash
set -eo pipefail

echo "Running Architectural Regression Guards..."

# 1. Ephemeris libraries in core
if grep -rnwi --exclude-dir=__tests__ --exclude-dir=tests --exclude-dir=node_modules --exclude-dir=dist --exclude="*.test.*" --exclude="*.spec.*" --exclude="test_*" "pyswisseph" services/ packages/ apps/ modules/ 2>/dev/null; then
  echo "Regression Guard Failed: pyswisseph detected in core codebase!"
  exit 1
fi

if grep -rnwi --exclude-dir=__tests__ --exclude-dir=tests --exclude-dir=node_modules --exclude-dir=dist --exclude="*.test.*" --exclude="*.spec.*" --exclude="test_*" "flatlib" services/ packages/ apps/ modules/ 2>/dev/null; then
  echo "Regression Guard Failed: flatlib detected in core codebase!"
  exit 1
fi

# 2. html2canvas dependencies and imports
if grep -rn --include="package.json" --exclude-dir=node_modules '"html2canvas"' apps/ packages/ modules/ package.json 2>/dev/null; then
  echo "Regression Guard Failed: html2canvas detected in package.json dependencies!"
  exit 1
fi

if grep -rnwi --exclude-dir=__tests__ --exclude-dir=tests --exclude-dir=node_modules --exclude-dir=dist --exclude="*.test.*" --exclude="*.spec.*" --exclude="test_*" "html2canvas" apps/web/src/ packages/ modules/ 2>/dev/null; then
  echo "Regression Guard Failed: html2canvas detected in source files!"
  exit 1
fi

# 3. timezones[0]
if grep -rnwi --exclude-dir=__tests__ --exclude-dir=tests --exclude-dir=node_modules --exclude-dir=dist --exclude="*.test.*" --exclude="*.spec.*" --exclude="test_*" "timezones\[0\]" services/ packages/ apps/ modules/ 2>/dev/null; then
  echo "Regression Guard Failed: timezones[0] bug detected!"
  exit 1
fi

# 4. Sync requests in async defs
if grep -rn --exclude-dir=__tests__ --exclude-dir=tests --exclude-dir=node_modules --exclude-dir=dist --exclude="*.test.*" --exclude="*.spec.*" --exclude="test_*" "import requests" services/api/app/ 2>/dev/null; then
  echo "Regression Guard Failed: synchronous requests library detected in backend!"
  exit 1
fi

echo "✔ All Architectural Regression Guards Passed!"
exit 0
