@echo off
echo =================================
echo Supabase Edge Functions Deployment
echo =================================
echo.

echo Checking if Supabase CLI is installed...
supabase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Supabase CLI not found!
    echo.
    echo Please install it first:
    echo npm install -g @supabase/cli
    echo.
    echo Or using scoop:
    echo scoop install supabase
    pause
    exit /b 1
)

echo ✅ Supabase CLI found!
echo.

echo Linking to Supabase project...
supabase link --project-ref qnghvjeunmicykrzpeog

if %errorlevel% neq 0 (
    echo ❌ Failed to link to Supabase project
    echo Please check your credentials and try again
    pause
    exit /b 1
)

echo.
echo Deploying Edge Functions...
echo.

echo 📦 Deploying dashboard function...
supabase functions deploy dashboard

echo 📦 Deploying profit-loss function...
supabase functions deploy profit-loss

echo 📦 Deploying finance function...
supabase functions deploy finance

echo 📦 Deploying sales function...
supabase functions deploy sales

echo 📦 Deploying expenses function...
supabase functions deploy expenses

echo 📦 Deploying tanks function...
supabase functions deploy tanks

echo.
echo =================================
echo ✅ Deployment Complete!
echo =================================
echo.
echo The Edge Functions are now deployed and ready to use.
echo Your application will now use real Supabase data instead of mock data.
echo.
echo Test the functions at:
echo https://qnghvjeunmicykrzpeog.supabase.co/functions/v1/
echo.
pause 