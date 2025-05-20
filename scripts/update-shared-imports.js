#!/usr/bin/env node

/**
 * This script updates import statements in all TypeScript/JavaScript files
 * from @/components/{dir} to @/shared/components/{dir} for directories
 * that have been moved to the shared components directory.
 * 
 * Usage: node scripts/update-shared-imports.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

// Define the moved directories
const MOVED_DIRECTORIES = [
  'unified',
  'dialogs',
  'sidebar',
  'enhanced',
  'shared',
  'dev'
];

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function updateImports() {
  console.log('Updating imports for moved components...');
  
  // Get all TypeScript/JavaScript files
  const files = globSync('src/**/*.{ts,tsx,js,jsx}', { cwd: rootDir });
  
  let totalFilesUpdated = 0;
  let totalImportsUpdated = 0;
  
  for (const file of files) {
    const filePath = path.join(rootDir, file);
    let content;
    
    try {
      content = await fs.readFile(filePath, 'utf8');
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      continue;
    }
    
    let updatedContent = content;
    let fileUpdated = false;
    
    for (const dir of MOVED_DIRECTORIES) {
      // Match import statements for the specific directory
      // This handles various import formats including:
      // - import X from '@/components/dir/...'
      // - import { X } from '@/components/dir/...'
      // - import * as X from '@/components/dir/...'
      const importRegex = new RegExp(`(from\\s+['"])@/components/${dir}(/[^'"]*['"])`, 'g');
      
      const newContent = updatedContent.replace(importRegex, (match, prefix, suffix) => {
        totalImportsUpdated++;
        return `${prefix}@/shared/components/${dir}${suffix}`;
      });
      
      if (newContent !== updatedContent) {
        updatedContent = newContent;
        fileUpdated = true;
      }
    }
    
    if (fileUpdated) {
      try {
        await fs.writeFile(filePath, updatedContent, 'utf8');
        totalFilesUpdated++;
        console.log(`✅ Updated imports in: ${file}`);
      } catch (error) {
        console.error(`Error writing file ${filePath}:`, error);
      }
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`Total files updated: ${totalFilesUpdated}`);
  console.log(`Total import statements updated: ${totalImportsUpdated}`);
  
  if (totalFilesUpdated === 0) {
    console.log('\nℹ️ No files were updated. This could mean either:');
    console.log('   - There are no imports from the moved directories');
    console.log('   - Imports might be using a different pattern than expected');
    console.log('   - Imports may have already been updated');
  }
}

updateImports().catch(error => {
  console.error('Error updating imports:', error);
  process.exit(1);
}); 