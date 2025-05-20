#!/usr/bin/env node

/**
 * Import Path Updater
 * 
 * This script automatically updates import paths from old lib/ paths
 * to the new shared/utils and core/design paths.
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
    pattern: /from\s+["']@\/lib\/utils["']/g,
    replacement: 'from "@/shared/utils"',
  },
  {
    pattern: /from\s+["']@\/lib\/formatters["']/g,
    replacement: 'from "@/shared/utils"',
  },
  {
    pattern: /from\s+["']@\/lib\/design-system["']/g,
    replacement: 'from "@/core/design"',
  },
  {
    pattern: /from\s+["']@\/lib\/schemas\/common["']/g,
    replacement: 'from "@/shared/schemas"',
  },
  {
    pattern: /from\s+["']@\/lib\/supabase["']/g,
    replacement: 'from "@/core/api/supabase"',
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
    'docs'
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
  console.log('🔄 Starting automated import path updates...\n');
  
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