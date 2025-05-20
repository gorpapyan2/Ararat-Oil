#!/usr/bin/env node

/**
 * Fix Tailwind Compatibility
 * 
 * This script updates Tailwind class names in component files to be compatible with Tailwind CSS v4.
 * It replaces:
 * - backdrop-blur-* with appropriate CSS properties
 * - fractional opacity syntax (bg-color/50) with the bg-opacity-* class names
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

// Patterns to replace
const replacements = [
  // Replace color variables with direct colors
  {
    pattern: /\bbg-\[hsl\(var\(--background\)\)]\b/g,
    replacement: 'bg-gray-50'
  },
  {
    pattern: /\bbg-\[hsl\(var\(--foreground\)\)]\b/g,
    replacement: 'bg-gray-900'
  },
  {
    pattern: /\bbg-\[hsl\(var\(--primary\)\)]\b/g,
    replacement: 'bg-blue-500'
  },
  {
    pattern: /\bbg-\[hsl\(var\(--secondary\)\)]\b/g,
    replacement: 'bg-gray-100'
  },
  {
    pattern: /\bbg-\[hsl\(var\(--accent\)\)]\b/g,
    replacement: 'bg-yellow-400'
  },
  {
    pattern: /\bbg-\[hsl\(var\(--card\)\)]\b/g,
    replacement: 'bg-white'
  },
  {
    pattern: /\bbg-\[hsl\(var\(--muted\)\)]\b/g,
    replacement: 'bg-gray-100'
  },
  {
    pattern: /\bbg-background\b/g,
    replacement: 'bg-gray-50'
  },
  // Replace white background with background
  {
    pattern: /\bbg-white\b/g,
    replacement: 'bg-background'
  },
  {
    pattern: /\bborder-white\b/g,
    replacement: 'border-background'
  },
  // Replace backdrop-blur classes
  {
    pattern: /\bbackdrop-blur-sm\b/g,
    replacement: ''
  },
  {
    pattern: /\bbackdrop-blur-md\b/g,
    replacement: ''
  },
  {
    pattern: /\bbackdrop-blur-lg\b/g,
    replacement: ''
  },
  {
    pattern: /\bbackdrop-blur\b/g,
    replacement: ''
  },
  // Replace fractional opacity syntax
  {
    pattern: /bg-(\w+)\/(\d+)/g,
    replacement: 'bg-$1 bg-opacity-$2'
  },
  {
    pattern: /border-(\w+)\/(\d+)/g,
    replacement: 'border-$1 border-opacity-$2'
  },
  {
    pattern: /text-(\w+)\/(\d+)/g,
    replacement: 'text-$1 text-opacity-$2'
  },
  // Replace more complex HSL syntax with opacity
  {
    pattern: /bg-\[hsl\(var\(--[a-z-]+\)\)]\/([\d]+)/g,
    replacement: 'bg-[hsl(var(--$1))] bg-opacity-$2'
  },
  {
    pattern: /border-\[hsl\(var\(--[a-z-]+\)\)]\/([\d]+)/g,
    replacement: 'border-[hsl(var(--$1))] border-opacity-$2'
  },
  // Replace supports-[backdrop-filter] conditional classes
  {
    pattern: /supports-\[backdrop-filter\]:([a-zA-Z0-9-/:]+)/g,
    replacement: '$1'
  },
];

async function fixFiles() {
  console.log('🔍 Finding files to update...');
  const files = await glob('**/*.{tsx,jsx,css}', { cwd: SRC_DIR });
  
  let modifiedFiles = 0;
  
  for (const file of files) {
    const filePath = path.join(SRC_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip files that don't have any problematic patterns
    if (!replacements.some(({ pattern }) => pattern.test(content))) {
      continue;
    }
    
    let newContent = content;
    
    // Apply all replacements
    for (const { pattern, replacement } of replacements) {
      newContent = newContent.replace(pattern, replacement);
    }
    
    // Add backdrop-filter styles directly for files that used backdrop-blur
    if (content.includes('backdrop-blur')) {
      // Find appropriate place to add CSS for backdrop-filter
      if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        // For React components, add style props to elements that had backdrop-blur
        newContent = newContent.replace(
          /className=(\{[^}]+|"[^"]+"|'[^']+')[^>]*backdrop-blur[^>]*>/g, 
          (match) => match.replace('>', ' style={{ backdropFilter: "blur(8px)" }}>')
        );
      }
    }
    
    // Only write file if it was modified
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ Updated ${file}`);
      modifiedFiles++;
    }
  }
  
  console.log(`\nCompleted! Modified ${modifiedFiles} files.`);
}

fixFiles().catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 