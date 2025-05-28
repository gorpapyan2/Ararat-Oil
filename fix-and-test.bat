@echo off
echo 🔧 React App Fix and Test Script
echo =================================
echo.

echo Step 1: Cleaning up...
echo Stopping any existing Node processes...
taskkill /f /im node.exe 2>nul
echo.

echo Step 2: Clearing caches...
if exist "node_modules\.vite" (
    echo Removing Vite cache...
    rmdir /s /q "node_modules\.vite"
)
echo.

echo Step 3: Testing basic React app...
echo Starting test server...
start "Test Server" cmd /c "npm run dev -- --mode test && pause"
echo.
echo ⏳ Waiting 10 seconds for server to start...
timeout /t 10 >nul
echo.

echo Step 4: Opening browser for manual test...
echo Opening test URL: http://localhost:3003
start http://localhost:3003
echo.

echo Step 5: Manual verification...
echo.
echo ✅ EXPECTED RESULTS:
echo    - Browser should open automatically
echo    - Page should show "🚀 Test App Loaded Successfully!"
echo    - Should see React version and timestamp
echo    - Test button should work when clicked
echo.
echo ❌ IF YOU SEE A BLANK PAGE:
echo    1. Press F12 to open Developer Tools
echo    2. Check the Console tab for errors
echo    3. Check the Network tab to see if files are loading
echo    4. Try refreshing with Ctrl+Shift+R
echo.
echo 🔧 ALTERNATIVE TESTS:
echo    - Try: http://localhost:3004 (if 3003 doesn't work)
echo    - Try: http://localhost:3005 (if 3004 doesn't work)
echo.

pause
echo.
echo Step 6: Testing normal app mode...
echo Stopping test server...
taskkill /f /im node.exe 2>nul
timeout /t 2 >nul
echo.
echo Starting normal app...
start "Main App" cmd /c "npm run dev && pause"
echo.
echo ⏳ Waiting 10 seconds for server to start...
timeout /t 10 >nul
echo.
echo Opening normal app...
start http://localhost:3003
echo.
echo ✅ EXPECTED RESULTS FOR NORMAL APP:
echo    - Should show "✅ React App Working!"
echo    - Loading spinner initially (1 second)
echo    - Debug information panel
echo    - Two test buttons that work
echo.

echo 🎯 TROUBLESHOOTING COMPLETE!
echo.
echo If both tests fail, the issue might be:
echo 1. Browser cache - try incognito mode
echo 2. Antivirus/firewall blocking localhost
echo 3. Network configuration issues
echo 4. Node.js/npm installation problems
echo.
pause 