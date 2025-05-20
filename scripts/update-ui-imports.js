#!/usr/bin/env node

/**
 * UI Component Import Path Updater
 * 
 * This script automatically updates import paths for UI components
 * to their new locations after reorganization.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define import maps - old import to new import
const IMPORT_MAPS = [
  {
    pattern: /from\s+["']@\/core\/components\/ui\/button["']/g,
    replacement: 'from "@/core/components/ui/primitives/button"',
  },
  {
    pattern: /from\s+["']@\/core\/components\/ui\/card["']/g,
    replacement: 'from "@/core/components/ui/primitives/card"',
  },
  {
    pattern: /from\s+["']@\/core\/components\/ui\/form["']/g,
    replacement: 'from "@/core/components/ui/primitives/form"',
  },
  {
    pattern: /from\s+["']@\/core\/components\/ui\/toaster["']/g,
    replacement: 'from "@/core/components/ui/primitives/toast"',
  },
  {
    pattern: /from\s+["']@\/core\/components\/ui\/toggle["']/g,
    replacement: 'from "@/core/components/ui/primitives/toggle"',
  },
  {
    pattern: /from\s+["']@\/core\/components\/ui\/input["']/g,
    replacement: 'from "@/core/components/ui/primitives/input"',
  },
  {
    pattern: /from\s+["']@\/core\/components\/ui\/select["']/g,
    replacement: 'from "@/core/components/ui/primitives/select"',
  },
  {
    pattern: /from\s+["']@\/core\/components\/ui\/progress["']/g,
    replacement: 'from "@/core/components/ui/primitives/progress"',
  },
  {
    pattern: /from\s+["']@\/core\/components\/ui\/radio-group["']/g,
    replacement: 'from "@/core/components/ui/primitives/radio-group"',
  },
  {
    pattern: /from\s+["']@\/core\/components\/ui\/sheet["']/g,
    replacement: 'from "@/core/components/ui/primitives/sheet"',
  },
  {
    pattern: /from\s+["']@\/core\/components\/ui\/dialog["']/g,
    replacement: 'from "@/core/components/ui/primitives/dialog"',
  },
  {
    pattern: /from\s+["']\.\/components\/ui\/toaster["']/g,
    replacement: 'from "@/core/components/ui/primitives/toast"',
  },
  {
    pattern: /from\s+["']@\/core\/components\/ui\/composed\/cards["']/g,
    replacement: 'from "@/core/components/ui/composed/card"',
  },
  {
    pattern: /from\s+["']@\/core\/components\/ui\/composed\/dialog["']/g,
    replacement: 'from "@/core/components/ui/composed/dialog"',
  }
];

// Check if a directory should be excluded
function shouldExclude(dirPath) {
  const excludeDirs = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    'scripts',
    'docs',
    'backup'
  ];
  
  const basename = path.basename(dirPath);
  return excludeDirs.includes(basename);
}

// Check if a file should be included in search
function shouldIncludeFile(filePath) {
  const allowedExtensions = ['.js', '.jsx', '.ts', '.tsx'];
  const ext = path.extname(filePath);
  return allowedExtensions.includes(ext);
}

// Recursively find all relevant files in directory
function findFilesRecursively(dir, fileList = []) {
  if (shouldExclude(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findFilesRecursively(filePath, fileList);
    } else if (shouldIncludeFile(filePath)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Update imports in a file
function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let updated = false;
  
  IMPORT_MAPS.forEach(map => {
    if (map.pattern.test(content)) {
      content = content.replace(map.pattern, map.replacement);
      updated = true;
    }
  });
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// Main function
async function updateImports() {
  console.log('🔄 Starting automated UI component import path updates...\n');
  
  try {
    // Find all relevant files in src directory
    const projectRoot = path.resolve(path.join(__dirname, '..'));
    const files = findFilesRecursively(path.join(projectRoot, 'src'));
    
    console.log(`Found ${files.length} files to check for updates.`);
    
    let updatedCount = 0;
    
    // Update each file
    files.forEach(file => {
      const wasUpdated = updateImportsInFile(file);
      if (wasUpdated) {
        console.log(`✅ Updated imports in: ${path.relative(projectRoot, file)}`);
        updatedCount++;
      }
    });
    
    console.log(`\n🎉 Completed! Updated imports in ${updatedCount} files.`);
    
    if (updatedCount === 0) {
      console.log('No files needed updates. All imports are already using the new paths.');
    }
  } catch (error) {
    console.error('❌ Error updating imports:', error);
  }
}

// Run the main function
updateImports(); 