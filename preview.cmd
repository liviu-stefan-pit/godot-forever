@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is required to preview the course.
  echo Install it from https://nodejs.org/ and run this file again.
  pause
  exit /b 1
)

powershell -NoProfile -Command "try { $l = New-Object System.Net.Sockets.TcpListener([Net.IPAddress]::Loopback, 8765); $l.Start(); $l.Stop(); exit 0 } catch { exit 1 }" >nul 2>&1
if errorlevel 1 (
  echo Port 8765 is already in use.
  echo Another preview may be running. Close that window, then run this file again.
  pause
  exit /b 1
)

echo Course preview: http://localhost:8765/
echo Close this window to stop it.
echo Progress stays in this browser under localStorage key godotcourse.v1.
start "" cmd /c "timeout /t 1 /nobreak >nul & start "" http://localhost:8765/"
node _authoring\serve.js 8765
if errorlevel 1 pause
