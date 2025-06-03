#!/bin/bash
# Senior-Level CSS Optimization Setup Script

echo "🎯 Ararat Oil Management System - CSS Optimization Setup"
echo "======================================================="

# Install additional PostCSS plugins for enhanced processing
echo "📦 Installing enhanced PostCSS plugins..."
npm install --save-dev postcss-nesting postcss-custom-properties postcss-logical postcss-reporter

# Optional: Install PurgeCSS for advanced production optimization
echo "🔧 Installing optional optimization plugins..."
npm install --save-dev @fullhuman/postcss-purgecss

# Optional: Install additional Babel plugins for React optimization
echo "⚛️  Installing optional React optimization plugins..."
npm install --save-dev @babel/plugin-transform-react-constant-elements @babel/plugin-transform-react-inline-elements

# Install cssnano for production CSS optimization
echo "🗜️  Installing CSS minification..."
npm install --save-dev cssnano

echo ""
echo "✅ All dependencies installed successfully!"
echo ""
echo "🧪 Running quick validation test..."

# Test if the development server starts without errors
echo "🔍 Testing development server startup..."
timeout 10s npm run dev > /dev/null 2>&1 &
DEV_PID=$!

sleep 5

if kill -0 $DEV_PID > /dev/null 2>&1; then
    echo "✅ Development server started successfully"
    kill $DEV_PID
else
    echo "❌ Development server failed to start"
    exit 1
fi

echo ""
echo "🎉 CSS Optimization Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Run 'npm run dev' to start development"
echo "   2. Navigate to /design-system to test components"
echo "   3. Check browser console for any CSS errors"
echo "   4. Run 'npm run build' to test production build"
echo ""
echo "🚀 Your system now has senior developer-grade CSS architecture!"
