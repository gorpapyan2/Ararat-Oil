@echo off
echo 🧪 Quick Application Test
echo =========================
echo.

echo Testing for window.require error fix...
echo.

echo 1. Starting development server...
start "Dev Server" cmd /c "npm run dev"

echo.
echo 2. Waiting for server to start...
timeout /t 8 >nul

echo.
echo 3. Opening application to test...
start http://localhost:3005

echo.
echo 📋 Check for these in the browser console:
echo ✅ NO "window.require is not a function" errors
echo ✅ Application loads without blank screen
echo ✅ React components render properly
echo ✅ No module loading errors
echo.

echo 4. Testing production build...
echo.
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo ✅ Production build successful!
    echo.
    echo 5. Starting preview server...
    start "Preview Server" cmd /c "npm run preview"
    echo.
    echo ⏳ Waiting for preview server...
    timeout /t 5 >nul
    echo.
    echo Opening production build...
    start http://localhost:4173
    echo.
    echo 🎯 Test both development and production modes!
) else (
    echo ❌ Production build failed - check for remaining issues
)

echo.
echo ✨ Test complete! Check both browser windows.
echo.
pause 