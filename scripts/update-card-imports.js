/**
 * Script to update card component imports across the codebase
 * 
 * This script finds and replaces import statements for the old card components
 * with imports from the new standardized card system.
 * 
 * Usage:
 * node update-card-imports.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const srcDir = path.resolve(__dirname, '../src');
const fileExtensions = ['.tsx', '.ts', '.jsx', '.js'];
const dryRun = false; // Set to true to just print changes without modifying files

// Import patterns to replace
const importReplacements = [
  // Replace core card imports
  {
    pattern: /import\s+\{([^}]*)\}\s+from\s+["']@\/core\/components\/ui\/card["'];/g,
    replacement: 'import {$1} from "@/core/components/ui/cards";'
  },
  // Replace primitive cards imports
  {
    pattern: /import\s+\{([^}]*)\}\s+from\s+["']@\/core\/components\/ui\/primitives\/cards["'];/g,
    replacement: 'import {$1} from "@/core/components/ui/cards";'
  },
  // Replace composed cards imports
  {
    pattern: /import\s+\{([^}]*)\}\s+from\s+["']@\/core\/components\/ui\/composed\/cards["'];/g,
    replacement: 'import {$1} from "@/core/components/ui/cards";'
  }
];

// Find all eligible files
function findFiles(dir, extensions, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFiles(filePath, extensions, fileList);
    } else if (extensions.includes(path.extname(file))) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Process a single file
function processFile(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let hasChanges = false;
  
  // Apply each replacement pattern
  for (const { pattern, replacement } of importReplacements) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      hasChanges = true;
    }
  }
  
  // Only write changes if we're not in dry run mode and changes were made
  if (hasChanges) {
    if (dryRun) {
      console.log(`  Would update: ${filePath}`);
    } else {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  Updated: ${filePath}`);
    }
  }
  
  return hasChanges;
}

// Main function
function main() {
  console.log('Starting card import update script...');
  console.log(`Mode: ${dryRun ? 'Dry run' : 'Production'}`);
  console.log('-----------------------------------');
  
  // Find all files to process
  const files = findFiles(srcDir, fileExtensions);
  console.log(`Found ${files.length} files to scan`);
  
  // Process each file
  let totalChanges = 0;
  let totalChangedFiles = 0;
  
  for (const file of files) {
    const fileChanged = processFile(file);
    if (fileChanged) {
      totalChangedFiles++;
    }
  }
  
  console.log('-----------------------------------');
  console.log(`Updated ${totalChangedFiles} files`);
  console.log('Card import update complete!');
}

// Run the script
main(); 