/**
 * Fix Tailwind v4 Opacity Syntax
 * 
 * This script scans the codebase for deprecated opacity syntax patterns and converts them
 * to the Tailwind v4 slash notation format.
 * 
 * Examples of fixes:
 * - bg-primary bg-opacity-10 → bg-primary/10
 * - border-gray-200 border-opacity-50 → border-gray-200/50
 * - text-primary text-opacity-70 → text-primary/70
 */

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

// Patterns to search for and replace
const patterns = [
  // bg-opacity patterns
  {
    regex: /(bg-[^\s"']+)\s+bg-opacity-(\d+)/g,
    replacement: (match, bgColor, opacity) => {
      // Convert $2 to 20
      if (opacity === '$2') opacity = '20';
      return `${bgColor}/${opacity}`;
    }
  },
  // border-opacity patterns
  {
    regex: /(border-[^\s"']+)\s+border-opacity-(\d+)/g,
    replacement: (match, borderColor, opacity) => {
      // Convert $2 to 20
      if (opacity === '$2') opacity = '20';
      return `${borderColor}/${opacity}`;
    }
  },
  // text-opacity patterns
  {
    regex: /(text-[^\s"']+)\s+text-opacity-(\d+)/g,
    replacement: (match, textColor, opacity) => {
      // Convert $2 to 20
      if (opacity === '$2') opacity = '20';
      return `${textColor}/${opacity}`;
    }
  }
];

// File extensions to process
const fileExtensions = ['.tsx', '.jsx', '.js', '.ts', '.css'];

// Check if a file should be processed
function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  return fileExtensions.includes(ext) && !filePath.includes('node_modules');
}

// Process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    // Apply all patterns
    patterns.forEach(pattern => {
      const newContent = content.replace(pattern.regex, pattern.replacement);
      if (newContent !== content) {
        hasChanges = true;
        content = newContent;
      }
    });
    
    // Write changes back to file if needed
    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return 1;
    }
    
    return 0;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return 0;
  }
}

// Main execution function
function main() {
  console.log('🔍 Scanning for files with deprecated opacity syntax...');
  
  // Get all files in the src directory
  const files = globSync(['src/**/*'], { nodir: true });
  
  let updatedCount = 0;
  
  // Process each file
  files.forEach(file => {
    if (shouldProcessFile(file)) {
      updatedCount += processFile(file);
    }
  });
  
  console.log(`\n✨ Done! Updated ${updatedCount} files.`);
}

// Run the script
main(); 