@echo off
echo 🚀 Starting React App Debug Session...
echo.
echo This will:
echo 1. Clean any stale processes
echo 2. Start the development server
echo 3. Open browser to test the app
echo.
pause

echo 🧹 Cleaning stale processes...
taskkill /f /im node.exe 2>nul
echo.

echo 📦 Starting development server...
echo Check http://localhost:3003 when ready
echo.

npm run dev 