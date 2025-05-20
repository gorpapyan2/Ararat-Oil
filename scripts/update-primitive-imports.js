#!/usr/bin/env node

/**
 * This script updates imports from primitives to use the re-exported components
 * For example:
 * - Changes: import { Button } from "@/core/components/ui/primitives/button";
 * - To: import { Button } from "@/core/components/ui/button";
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import patterns to replace
const IMPORT_MAPS = [
  // Button component import fixes
  {
    pattern: /import\s+\{([^}]+)\}\s+from\s+["']@\/core\/components\/ui\/primitives\/button["'];/g,
    replacement: 'import {$1} from "@/core/components/ui/button";'
  },
  // Card component import fixes
  {
    pattern: /import\s+\{([^}]+)\}\s+from\s+["']@\/core\/components\/ui\/primitives\/card["'];/g,
    replacement: 'import {$1} from "@/core/components/ui/card";'
  },
  // Form component import fixes
  {
    pattern: /import\s+\{([^}]+)\}\s+from\s+["']@\/core\/components\/ui\/primitives\/form["'];/g,
    replacement: 'import {$1} from "@/core/components/ui/form";'
  },
  // Toast component import fixes
  {
    pattern: /import\s+\{([^}]+)\}\s+from\s+["']@\/core\/components\/ui\/primitives\/toast["'];/g,
    replacement: 'import {$1} from "@/core/components/ui/toast";'
  },
  // Sheet component import fixes
  {
    pattern: /import\s+\{([^}]+)\}\s+from\s+["']@\/core\/components\/ui\/primitives\/sheet["'];/g,
    replacement: 'import {$1} from "@/core/components/ui/sheet";'
  },
  // Tooltip component import fixes
  {
    pattern: /import\s+\{([^}]+)\}\s+from\s+["']@\/core\/components\/ui\/primitives\/tooltip["'];/g,
    replacement: 'import {$1} from "@/core/components/ui/tooltip";'
  },
  // Other primitives
  {
    pattern: /import\s+\{([^}]+)\}\s+from\s+["']@\/core\/components\/ui\/primitives\/([^"']+)["'];/g,
    replacement: 'import {$1} from "@/core/components/ui/primitives/$2";'
  }
];

// Directories to exclude
const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', 'build', 'public', 'backup'];

// Extensions to include
const INCLUDED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];

// Check if a directory should be excluded
function shouldExcludeDir(dirPath) {
  const basename = path.basename(dirPath);
  return EXCLUDED_DIRS.includes(basename);
}

// Check if a file should be included
function shouldIncludeFile(filePath) {
  const extension = path.extname(filePath);
  return INCLUDED_EXTENSIONS.includes(extension);
}

// Find all files recursively
function findFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!shouldExcludeDir(filePath)) {
        fileList = findFilesRecursively(filePath, fileList);
      }
    } else if (shouldIncludeFile(filePath)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Update imports in a file
function updateImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    IMPORT_MAPS.forEach(({ pattern, replacement }) => {
      content = content.replace(pattern, replacement);
    });
    
    // Only write to the file if changes were made
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

// Main function to update imports
function updateImports() {
  console.log('Starting primitive import updates...');
  
  // Find all files in the src directory
  const srcDir = path.resolve(process.cwd(), 'src');
  const files = findFilesRecursively(srcDir);
  
  console.log(`Found ${files.length} files to check for imports.`);
  
  let updatedCount = 0;
  
  // Process each file
  files.forEach(filePath => {
    const wasUpdated = updateImportsInFile(filePath);
    if (wasUpdated) {
      updatedCount++;
      console.log(`Updated imports in: ${filePath}`);
    }
  });
  
  console.log(`Import updates completed. Updated ${updatedCount} files.`);
}

try {
  updateImports();
} catch (error) {
  console.error('Error during import update:', error);
  process.exit(1);
} 