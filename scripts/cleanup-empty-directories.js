#!/usr/bin/env node

/**
 * This script identifies and optionally removes empty directories
 * in src/components after component migration.
 * 
 * Usage: node scripts/cleanup-empty-directories.js [--dry-run]
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Check if we're in dry run mode
const isDryRun = process.argv.includes('--dry-run');

/**
 * Checks if a directory is empty or only contains empty directories
 * @param {string} dirPath - The path to check
 * @returns {Promise<boolean>} - True if empty, false otherwise
 */
async function isDirectoryEmpty(dirPath) {
  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    
    // No items means it's empty
    if (items.length === 0) {
      return true;
    }
    
    // Check if all items are directories and they're all empty
    for (const item of items) {
      // If it's a file, the directory is not empty
      if (!item.isDirectory()) {
        return false;
      }
      
      // Recursively check if the subdirectory is empty
      const subdirPath = path.join(dirPath, item.name);
      const subdirEmpty = await isDirectoryEmpty(subdirPath);
      
      // If any subdirectory is not empty, the directory is not empty
      if (!subdirEmpty) {
        return false;
      }
    }
    
    // All items are directories and they're all empty
    return true;
  } catch (error) {
    console.error(`Error checking if directory is empty: ${dirPath}`, error);
    return false;
  }
}

/**
 * Recursively removes a directory and all its contents
 * @param {string} dirPath - The path to remove
 */
async function removeEmptyDirectory(dirPath) {
  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    
    // Remove all subdirectories first
    for (const item of items) {
      if (item.isDirectory()) {
        const subdirPath = path.join(dirPath, item.name);
        await removeEmptyDirectory(subdirPath);
      }
    }
    
    // Remove the directory itself
    await fs.rmdir(dirPath);
    console.log(`Removed empty directory: ${dirPath}`);
  } catch (error) {
    console.error(`Error removing directory: ${dirPath}`, error);
  }
}

/**
 * Checks for empty directories in src/components and removes them
 */
async function cleanupEmptyDirectories() {
  const componentsDir = path.join(rootDir, 'src', 'components');
  
  try {
    // Check if components directory exists
    await fs.access(componentsDir);
  } catch (error) {
    console.error(`Components directory not found: ${componentsDir}`);
    return;
  }
  
  // Get all subdirectories in components
  const items = await fs.readdir(componentsDir, { withFileTypes: true });
  const directories = items.filter(item => item.isDirectory());
  
  console.log(`Found ${directories.length} directories in src/components`);
  
  const emptyDirs = [];
  
  // Check each directory
  for (const dir of directories) {
    const dirPath = path.join(componentsDir, dir.name);
    const isEmpty = await isDirectoryEmpty(dirPath);
    
    if (isEmpty) {
      emptyDirs.push(dirPath);
      console.log(`Found empty directory: ${dirPath}`);
    }
  }
  
  // Remove empty directories if not in dry run mode
  if (!isDryRun) {
    if (emptyDirs.length > 0) {
      console.log(`\nRemoving ${emptyDirs.length} empty directories...`);
      
      for (const dirPath of emptyDirs) {
        await removeEmptyDirectory(dirPath);
      }
      
      console.log('\n✅ Empty directories removed!');
    } else {
      console.log('\n✅ No empty directories found!');
    }
  } else {
    if (emptyDirs.length > 0) {
      console.log(`\nFound ${emptyDirs.length} empty directories that would be removed in a real run:`);
      for (const dirPath of emptyDirs) {
        console.log(`  - ${dirPath}`);
      }
      console.log('\nRun without --dry-run to actually remove these directories');
    } else {
      console.log('\n✅ No empty directories found!');
    }
  }
  
  // Create report
  const report = `# Empty Directories Cleanup Report

## Summary

- Date: ${new Date().toISOString().split('T')[0]}
- Mode: ${isDryRun ? 'Dry run (no changes made)' : 'Actual run (directories removed)'}
- Empty directories found: ${emptyDirs.length}
${emptyDirs.length > 0 ? '\n## Empty Directories\n\n' + emptyDirs.map(dir => `- \`${dir}\``).join('\n') : ''}

## Next Steps

1. Run TypeScript type checking to ensure no errors were introduced
2. Verify the application functions correctly
3. Continue with the next steps in the refactoring process:
   - Update remaining import statements
   - Test the application thoroughly
   - Enhance component documentation
`;

  // Write report
  const reportPath = path.join(rootDir, 'docs', 'refactoring', 'empty-directories-cleanup-report.md');
  await fs.writeFile(reportPath, report, 'utf8');
  
  console.log(`\n📄 Report saved to ${reportPath}`);
}

// Run the script
cleanupEmptyDirectories().catch(error => {
  console.error('Error during empty directory cleanup:', error);
  process.exit(1);
}); 