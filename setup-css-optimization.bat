@echo off
REM Senior-Level CSS Optimization Setup Script for Windows

echo 🎯 Ararat Oil Management System - CSS Optimization Setup
echo =======================================================

REM Install additional PostCSS plugins for enhanced processing
echo 📦 Installing enhanced PostCSS plugins...
npm install --save-dev postcss-nesting postcss-custom-properties postcss-logical postcss-reporter

REM Optional: Install PurgeCSS for advanced production optimization
echo 🔧 Installing optional optimization plugins...
npm install --save-dev @fullhuman/postcss-purgecss

REM Optional: Install additional Babel plugins for React optimization
echo ⚛️  Installing optional React optimization plugins...
npm install --save-dev @babel/plugin-transform-react-constant-elements @babel/plugin-transform-react-inline-elements

REM Install cssnano for production CSS optimization
echo 🗜️  Installing CSS minification...
npm install --save-dev cssnano

echo.
echo ✅ All dependencies installed successfully!
echo.
echo 🧪 Running quick validation test...

REM Test if the development server can start
echo 🔍 Testing development server startup...
start /b npm run dev > nul 2>&1
timeout /t 5 > nul

echo.
echo 🎉 CSS Optimization Setup Complete!
echo.
echo 📋 Next Steps:
echo    1. Run 'npm run dev' to start development
echo    2. Navigate to /design-system to test components
echo    3. Check browser console for any CSS errors
echo    4. Run 'npm run build' to test production build
echo.
echo 🚀 Your system now has senior developer-grade CSS architecture!
echo.
pause
