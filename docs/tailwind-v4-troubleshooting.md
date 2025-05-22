# Tailwind CSS v4 Troubleshooting Guide

This document provides solutions for common issues encountered during or after the Tailwind CSS v4 migration.

## Common Issues and Solutions

### 1. Blank White Screen After Migration

**Symptoms:**
- Application shows a blank white screen with no visible UI elements
- No errors in the browser UI (just white space)
- May see errors in the browser console about CSS processing
- CSS errors like `@import must precede all other statements (besides @charset or empty @layer)`

**Solutions:**

1. **Fix CSS Import Order - Advanced Approach**:
   ```css
   /* Create a dedicated imports-only file (src/styles/imports.css) */
   /* This file contains ONLY imports - nothing else */
   @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap");
   @import "tailwindcss";
   @import url('./preflight.css');
   @import url('./custom-tailwind.css');
   
   /* Then in your main index.css, just import this file first */
   @import url('./styles/imports.css');
   
   /* Then add the rest of your CSS */
   :root {
     --color-background: 255 255 255;
     /* other variables */
   }
   ```

2. **Install PostCSS Import Plugin**:
   ```bash
   npm install postcss-import --save-dev
   ```

3. **Update PostCSS Configuration**:
   ```js
   // postcss.config.mjs
   export default {
     plugins: {
       'postcss-import': {}, // Add this first to process imports correctly
       '@tailwindcss/postcss': {
         // Config here
       },
       autoprefixer: {},
     },
   };
   ```

4. **Update Vite Configuration**:
   ```js
   // vite.config.ts
   css: {
     devSourcemap: true,
     preprocessorOptions: {
       css: {
         charset: false,
         additionalData: '/* Ensure imports first */\n',
       },
     },
   },
   ```

2. **Clear Vite's Dependency Cache**:
   ```bash
   # For Unix-like systems
   rm -rf node_modules/.vite
   
   # For Windows PowerShell
   if (Test-Path node_modules/.vite) { Remove-Item -Recurse -Force node_modules/.vite }
   ```

3. **Restart Server with Force Flag**:
   ```bash
   npm run dev -- --force
   ```

5. **Use Debug Pages to Isolate Problems**:
   If you're still seeing a blank white screen after trying the CSS fixes, use the built-in diagnostic pages to isolate the issue:
   
   - `/diagnostic.html` - Tests CSS variables and theme switching without React
   - `/js-test.html` - Tests basic JavaScript functionality
   - `/debug.html` - Loads a simplified React application
   
   ```bash
   # Start the server in debug mode
   npm run dev:debug
   
   # Or run with StrictMode disabled if there are React rendering issues
   npm run dev:nostrictmode
   ```

6. **Gradually Re-Enable Features**:
   If the diagnostic pages work but the main app doesn't:
   
   1. Try simplifying the App component temporarily
   2. Remove or comment out complex providers one by one
   3. Check for circular dependencies or lazy-loaded components that might be failing

### 2. Color Format Errors

**Symptoms:**
- Errors about HSL color format
- CSS variables not being recognized
- Color opacity not working correctly

**Solutions:**

1. **Run the Color Converter Script**:
   ```bash
   npm run tailwind:convert-colors
   ```

2. **Update Manual Color References**:
   - Replace `hsl(var(--primary))` with `var(--color-primary)`
   - Replace `hsl(var(--background))` with `var(--color-background)`
   - Ensure color variables use RGB format

3. **Fix Opacity Syntax**:
   - Replace `bg-primary bg-opacity-10` with `bg-primary/10`
   - Replace `text-gray-500 text-opacity-80` with `text-gray-500/80`

### 3. CSS Variable Errors

**Symptoms:**
- Errors about CSS variables not being found
- Missing `--color-` prefix in variable names
- Theme function failing to resolve

**Solutions:**

1. **Update Variable Names**:
   - Ensure all color variables use the `--color-` prefix
   - Example: `--primary` should be `--color-primary`

2. **Check Theme Provider**:
   - Make sure theme provider is correctly setting CSS variables
   - Verify dark mode switching works with updated variables

3. **Add Emergency Fallback Styles**:
   ```css
   /* Add these to index.css as a fallback */
   :root {
     --color-background: 255 255 255;
     --color-foreground: 15 23 42;
     --color-primary: 58 166 85;
     /* Add more as needed */
   }
   ```

### 4. Type Errors in Components

**Symptoms:**
- TypeScript errors in components using date or color related functionality
- Errors in the DateRangePicker or Calendar components
- Type mismatches between selected dates and component props

**Solutions:**

1. **Update Component Props Types**:
   - Ensure DateRange type is properly defined
   - Update component interfaces to match the new structure
   - Fix any type mismatches in event handlers

2. **Check DateRangePicker and Calendar Integration**:
   - Verify that both components are using compatible prop types
   - Ensure the DateRange type is consistently defined

### 5. Diagnostic Tools

1. **Run the Compatibility Checker**:
   ```bash
   npm run check:tailwind-v4
   ```

2. **View the Success Page**:
   Open http://localhost:3008/migration-success.html in your browser to verify that the migration was successful.

3. **Inspect CSS Variables in Browser**:
   Open browser DevTools, go to the Elements tab, and examine the CSS variables on the `:root` element.

## When to Seek Additional Help

If you've tried all the solutions above and are still experiencing issues:

1. Check the `docs/fixes-applied.md` file for more detailed fixes
2. Review the `tailwind-v4-migration.md` document for the full migration process
3. Create an issue in the project repository with:
   - A clear description of the problem
   - Steps to reproduce
   - Browser console errors
   - Details about your environment (OS, Node version, browser)

## Environment Compatibility

This migration has been tested and confirmed working on:
- Windows 10/11 with Node.js 18+
- Chrome 120+, Firefox 120+, Edge 120+
- Vite 5.0+ 