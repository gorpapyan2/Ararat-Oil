#!/usr/bin/env node

/**
 * This script updates import statements in all TypeScript/JavaScript files
 * to use feature components directly instead of the original components in src/components.
 * 
 * Usage: node scripts/update-feature-imports.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Define feature mapping from component directory to feature directory
const FEATURE_MAPPING = {
  'dashboard': 'dashboard',
  'transactions': 'finance',
  'expenses': 'finance',
  'petrol-providers': 'petrol-providers',
  'fuel-supplies': 'fuel-supplies',
  'filling-systems': 'filling-systems',
  'fuel': 'fuel',
  'employees': 'employees',
  'settings': 'auth',
  'shifts': 'finance',
  'todo': 'todo'
};

async function updateImports() {
  console.log('Updating imports to use feature components...');
  
  // Get all TypeScript/JavaScript files
  const files = globSync('src/**/*.{ts,tsx,js,jsx}', { cwd: rootDir });
  
  let totalFilesUpdated = 0;
  let totalImportsUpdated = 0;
  
  for (const file of files) {
    // Skip files in the components directory
    if (file.includes('src/components/')) {
      continue;
    }
    
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
    
    // Update imports for each component directory
    for (const [componentDir, featureDir] of Object.entries(FEATURE_MAPPING)) {
      // Regular expression to match import statements from the component directory
      // This covers common import patterns like:
      // import Component from '@/components/dir/Component'
      // import { Component } from '@/components/dir/Component'
      const importRegex = new RegExp(`(from\\s+['"])@/components/${componentDir}/([^'"]+)(['"])`, 'g');
      
      // Replace with feature component imports
      const newContent = updatedContent.replace(importRegex, (match, prefix, component, suffix) => {
        totalImportsUpdated++;
        return `${prefix}@/features/${featureDir}/components/${component}${suffix}`;
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
    console.log('   - There are no imports from the component directories');
    console.log('   - Imports might be using a different pattern than expected');
    console.log('   - Imports may have already been updated to use feature components');
  }
}

// Run the script
updateImports().catch(error => {
  console.error('Error updating imports:', error);
  process.exit(1);
}); 