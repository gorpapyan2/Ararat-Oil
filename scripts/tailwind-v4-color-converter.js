/**
 * Tailwind CSS v4 Color Converter
 * 
 * This script scans the codebase for color patterns that need to be updated
 * for Tailwind CSS v4 compatibility.
 * 
 * It performs three main conversions:
 * 1. Hex colors to RGB format
 * 2. HSL variable formats to RGB variables
 * 3. Updates CSS variable references to use --color- prefix
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Convert hex to RGB
function hexToRgb(hex) {
  // Remove hash if present
  hex = hex.replace(/^#/, '');
  
  // Handle shorthand hex (e.g., #fff)
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgb(${r} ${g} ${b})`;
}

// HSL to RGB conversion (simplified for common values)
// For more accurate conversion, consider using a color library
function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`;
}

// Common color mapping for well-known values
const commonColors = {
  // Grays
  '#f9fafb': 'rgb(249 250 251)', // gray-50
  '#f3f4f6': 'rgb(243 244 246)', // gray-100
  '#e5e7eb': 'rgb(229 231 235)', // gray-200
  '#d1d5db': 'rgb(209 213 219)', // gray-300
  '#9ca3af': 'rgb(156 163 175)', // gray-400
  '#6b7280': 'rgb(107 114 128)', // gray-500
  '#4b5563': 'rgb(75 85 99)',    // gray-600
  '#374151': 'rgb(55 65 81)',    // gray-700
  '#1f2937': 'rgb(31 41 55)',    // gray-800
  '#111827': 'rgb(17 24 39)',    // gray-900
  
  // Brand colors
  '#3AA655': 'rgb(58 166 85)',   // primary
  '#F6C90E': 'rgb(246 201 14)',  // accent
  
  // Common colors
  '#ffffff': 'rgb(255 255 255)', // white
  '#000000': 'rgb(0 0 0)',       // black
};

// Process CSS files
function processCssFiles() {
  console.log('Processing CSS files...');
  const cssFiles = glob.sync('src/**/*.css');
  
  cssFiles.forEach(file => {
    console.log(`Checking ${file}`);
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    // Update HSL variables to RGB format
    const hslVarPattern = /--([\w-]+):\s*(\d+)\s+(\d+)%\s+(\d+)%;/g;
    content = content.replace(hslVarPattern, (match, name, h, s, l) => {
      changed = true;
      const rgbValue = hslToRgb(parseInt(h), parseInt(s), parseInt(l));
      return `--color-${name}: ${rgbValue};`;
    });
    
    // Update hex colors
    const hexColorPattern = /#[0-9a-f]{3,6}\b/gi;
    content = content.replace(hexColorPattern, match => {
      changed = true;
      if (commonColors[match.toLowerCase()]) {
        return commonColors[match.toLowerCase()];
      }
      return hexToRgb(match);
    });
    
    if (changed) {
      console.log(`✅ Updated ${file}`);
      fs.writeFileSync(file, content, 'utf8');
    }
  });
}

// Process React component files
function processComponentFiles() {
  console.log('Processing component files...');
  const componentFiles = glob.sync('src/**/*.{tsx,jsx}');
  
  componentFiles.forEach(file => {
    console.log(`Checking ${file}`);
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    // Replace hex colors in className strings
    const classNameHexPattern = /(className=["'].*?)(#[0-9a-f]{3,6})(.*?["'])/gi;
    content = content.replace(classNameHexPattern, (match, prefix, hexColor, suffix) => {
      changed = true;
      const rgbColor = commonColors[hexColor.toLowerCase()] || hexToRgb(hexColor);
      return `${prefix}${rgbColor}${suffix}`;
    });
    
    // Replace HSL variables in className strings
    const hslVarPattern = /(className=["'].*?)hsl\(var\(--([\w-]+)\)\)(.*?["'])/gi;
    content = content.replace(hslVarPattern, (match, prefix, varName, suffix) => {
      changed = true;
      return `${prefix}var(--color-${varName})${suffix}`;
    });
    
    // Replace bg-background with proper CSS variable
    const backgroundClassPattern = /(className=["'].*?)bg-background(.*?["'])/gi;
    content = content.replace(backgroundClassPattern, (match, prefix, suffix) => {
      // Don't mark as changed, just being cautious with this replacement
      return match; // Keep as is for now, just verify
    });
    
    if (changed) {
      console.log(`✅ Updated ${file}`);
      fs.writeFileSync(file, content, 'utf8');
    }
  });
}

// Check imports and update tailwind import syntax
function processImports() {
  console.log('Checking for Tailwind imports...');
  const cssFiles = glob.sync('src/**/*.css');
  
  cssFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    // Replace @tailwind directives with @import
    if (content.includes('@tailwind')) {
      changed = true;
      content = content.replace(/@tailwind base;/g, '@import "tailwindcss";');
      content = content.replace(/@tailwind components;/g, '/* Components included in tailwindcss import */');
      content = content.replace(/@tailwind utilities;/g, '/* Utilities included in tailwindcss import */');
    }
    
    if (changed) {
      console.log(`✅ Updated imports in ${file}`);
      fs.writeFileSync(file, content, 'utf8');
    }
  });
}

// Main execution
function main() {
  console.log('🔍 Starting Tailwind CSS v4 color conversion...');
  
  processImports();
  processCssFiles();
  processComponentFiles();
  
  console.log('✅ Conversion complete!');
}

main(); 