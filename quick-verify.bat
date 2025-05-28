@echo off
echo 🔍 Quick Server Verification
echo ============================
echo.

echo Checking running servers...
echo.

echo 🔵 Test Server (should be on port 3002):
start http://localhost:3002
echo    ✅ Opened: http://localhost:3002
echo.

echo 🔵 Main Server (should be on port 3005):  
start http://localhost:3005
echo    ✅ Opened: http://localhost:3005
echo.

echo 📋 WHAT TO EXPECT:
echo.
echo 🧪 TEST SERVER (port 3002):
echo    - Shows "🚀 Test App Loaded Successfully!"
echo    - React version and timestamp
echo    - Clickable test button
echo.
echo 🏠 MAIN SERVER (port 3005):
echo    - Shows your full application
echo    - Should load without blank page
echo.
echo 🎯 SUCCESS INDICATORS:
echo    ✅ No blank white pages
echo    ✅ React components load properly  
echo    ✅ Interactive elements work
echo    ✅ No console errors (press F12 to check)
echo.

pause 