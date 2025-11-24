@echo off
echo.
echo ========================================
echo   Starting QBox Backend Server
echo ========================================
echo.
echo Server will start on http://localhost:5000
echo.
echo For Android Emulator: http://10.0.2.2:5000
echo For Real Device: http://10.207.41.84:5000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

node server.js

pause
