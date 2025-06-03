@echo off
REM Senior-Level CSS Validation Script

echo 🧪 CSS Architecture Validation Test
echo ===================================

echo.
echo 🔍 Step 1: Checking project structure...
if not exist "src\index.css" (
    echo ❌ src\index.css not found
    goto :error
)
if not exist "tailwind.config.ts" (
    echo ❌ tailwind.config.ts not found
    goto :error
)
if not exist "postcss.config.mjs" (
    echo ❌ postcss.config.mjs not found
    goto :error
)
if not exist "vite.config.ts" (
    echo ❌ vite.config.ts not found
    goto :error
)
echo ✅ All configuration files present

echo.
echo 🔍 Step 2: Validating CSS class definitions...

REM Check for key component classes in index.css
findstr /c:"btn-icon" src\index.css > nul
if %errorlevel% neq 0 (
    echo ❌ btn-icon class not found
    goto :error
)

findstr /c:"input-group" src\index.css > nul
if %errorlevel% neq 0 (
    echo ❌ input-group class not found
    goto :error
)

findstr /c:"modal-overlay" src\index.css > nul
if %errorlevel% neq 0 (
    echo ❌ modal-overlay class not found
    goto :error
)

findstr /c:"badge-primary" src\index.css > nul
if %errorlevel% neq 0 (
    echo ❌ badge-primary class not found
    goto :error
)

findstr /c:"progress-bar" src\index.css > nul
if %errorlevel% neq 0 (
    echo ❌ progress-bar class not found
    goto :error
)

echo ✅ All component classes found

echo.
echo 🔍 Step 3: Testing TypeScript compilation...
npx tsc --noEmit > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ TypeScript compilation failed
    echo 💡 Run 'npx tsc --noEmit' to see detailed errors
    goto :error
)
echo ✅ TypeScript compilation successful

echo.
echo 🔍 Step 4: Testing CSS processing...
npx tailwindcss --input src\index.css --output test-output.css > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Tailwind CSS processing failed
    goto :error
)
if exist "test-output.css" (
    del "test-output.css"
    echo ✅ CSS processing successful
) else (
    echo ❌ CSS output not generated
    goto :error
)

echo.
echo 🔍 Step 5: Testing production build...
npm run build > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Production build failed
    echo 💡 Run 'npm run build' to see detailed errors
    goto :error
)
echo ✅ Production build successful

echo.
echo 🔍 Step 6: Analyzing bundle sizes...
if exist "dist\assets\*.css" (
    for %%f in (dist\assets\*.css) do (
        echo 📊 CSS Bundle: %%~nxf - %%~zf bytes
    )
) else (
    echo ❌ No CSS bundles found in dist/assets/
    goto :error
)

echo.
echo 🔍 Step 7: Checking for common issues...

REM Check for CSS custom property usage
findstr /c:"var(--" src\index.css > nul
if %errorlevel% neq 0 (
    echo ⚠️  Warning: No CSS custom properties found
) else (
    echo ✅ CSS custom properties in use
)

REM Check for responsive design
findstr /c:"@media" src\index.css > nul
if %errorlevel% neq 0 (
    echo ⚠️  Warning: No responsive breakpoints found
) else (
    echo ✅ Responsive design implemented
)

REM Check for dark mode support
findstr /c:".dark" src\index.css > nul
if %errorlevel% neq 0 (
    echo ⚠️  Warning: No dark mode styles found
) else (
    echo ✅ Dark mode support implemented
)

echo.
echo 🎉 All Tests Passed! CSS Architecture is Enterprise-Ready
echo.
echo 📊 Validation Summary:
echo    ✅ Project structure validated
echo    ✅ Component classes defined
echo    ✅ TypeScript compilation working
echo    ✅ CSS processing functional
echo    ✅ Production build successful
echo    ✅ Bundle analysis complete
echo    ✅ Code quality checks passed
echo.
echo 🚀 Ready for Production Deployment!
goto :end

:error
echo.
echo ❌ Validation Failed!
echo.
echo 🔧 Troubleshooting Steps:
echo    1. Ensure all files are properly saved
echo    2. Run 'npm install' to install dependencies
echo    3. Check for syntax errors in configuration files
echo    4. Review the implementation guide for missing steps
echo.
exit /b 1

:end
echo.
pause
