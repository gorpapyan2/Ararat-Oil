@echo off
echo 🔍 React App Diagnostic Report
echo ============================
echo.

echo 📂 Current Directory:
cd
echo.

echo 📦 Package Manager Status:
npm --version
echo.

echo 🔧 Node.js Version:
node --version
echo.

echo 📋 Project Dependencies Status:
echo Checking if node_modules exists...
if exist "node_modules\" (
    echo ✅ node_modules directory exists
) else (
    echo ❌ node_modules directory missing - run 'npm install'
)
echo.

echo 📄 Key Files Check:
if exist "package.json" (
    echo ✅ package.json exists
) else (
    echo ❌ package.json missing
)

if exist "src\App.tsx" (
    echo ✅ src\App.tsx exists
) else (
    echo ❌ src\App.tsx missing
)

if exist "src\main.tsx" (
    echo ✅ src\main.tsx exists
) else (
    echo ❌ src\main.tsx missing
)

if exist "index.html" (
    echo ✅ index.html exists
) else (
    echo ❌ index.html missing
)
echo.

echo 🌐 Port Status:
echo Checking for processes on ports 3000-3010...
netstat -an | findstr ":300"
echo.

echo 🔍 Recent Log Files:
if exist "npm-debug.log" (
    echo ⚠️  npm-debug.log found - there may be npm issues
) else (
    echo ✅ No npm debug logs found
)
echo.

echo ✨ Diagnostic Complete!
echo.
echo 💡 To start the app:
echo    npm run dev
echo.
echo 💡 To run in safe mode:
echo    npm run dev:safe
echo.
pause 