@echo off
setlocal

set "PORT=8766"
set "PYTHON_LAUNCHER="
cd /d "%~dp0"

where py >nul 2>nul
if not errorlevel 1 set "PYTHON_LAUNCHER=py"

if not defined PYTHON_LAUNCHER (
  where python >nul 2>nul
  if not errorlevel 1 set "PYTHON_LAUNCHER=python"
)

if not defined PYTHON_LAUNCHER (
  echo Python 3 was not found. Install Python, then run this file again.
  pause
  exit /b 1
)

netstat -ano -p tcp | findstr /R /C:"127.0.0.1:%PORT% .*LISTENING" >nul
if errorlevel 1 (
  rem Port is available.
) else (
  "%PYTHON_LAUNCHER%" -c "import urllib.request; response=urllib.request.urlopen('http://127.0.0.1:%PORT%/src/js/checklist-state.mjs', timeout=2); assert response.status == 200 and 'javascript' in response.headers.get('Content-Type', '')" >nul 2>nul
  if not errorlevel 1 goto server_ready
  echo Port %PORT% is in use by another service. Close it and try again.
  pause
  exit /b 1
)

start "RENTSAFE local server" /D "%~dp0" %PYTHON_LAUNCHER% -u "src\server.py" --port %PORT%
echo Starting RENTSAFE at http://127.0.0.1:%PORT%/

set "ATTEMPTS=0"
:wait_for_server
"%PYTHON_LAUNCHER%" -c "import urllib.request; response=urllib.request.urlopen('http://127.0.0.1:%PORT%/src/js/checklist-state.mjs', timeout=2); assert response.status == 200 and 'javascript' in response.headers.get('Content-Type', '')" >nul 2>nul
if not errorlevel 1 goto server_ready
set /a ATTEMPTS+=1
if %ATTEMPTS% GEQ 10 goto server_failed
timeout /t 1 /nobreak >nul
goto wait_for_server

:server_ready
echo RENTSAFE is ready. Leave the server window open; press Ctrl+C there to stop it.
start "" "http://127.0.0.1:%PORT%/"
exit /b 0

:server_failed
echo The server did not start. Check the RENTSAFE server window for the error.
pause
exit /b 1
