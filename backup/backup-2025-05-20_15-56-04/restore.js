
#!/usr/bin/env node

/**
 * Restore Script
 * 
 * Restores files from this backup to the original location.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Project root is two levels up from this script
const projectRoot = path.resolve(path.join(__dirname, '../..'));

// Copy a file with directory structure
function copyFile(sourcePath, targetPath) {
  // Create target directory if it doesn't exist
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  // Copy the file
  fs.copyFileSync(sourcePath, targetPath);
}

// Restore files
function restoreFiles() {
  console.log('🔄 Restoring files from backup...');
  
  // Get all files in backup directory (recursively)
  function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
        getAllFiles(filePath, fileList);
      } else if (stat.isFile() && file !== 'restore.js') {
        fileList.push(filePath);
      }
    });
    
    return fileList;
  }
  
  const backupDir = __dirname;
  const allBackupFiles = getAllFiles(backupDir);
  
  let restoredCount = 0;
  
  // Copy each file back to its original location
  allBackupFiles.forEach(backupFile => {
    // Get the path relative to the backup directory
    const relativePath = path.relative(backupDir, backupFile);
    const targetPath = path.join(projectRoot, relativePath);
    
    copyFile(backupFile, targetPath);
    console.log(`Restored: ${relativePath}`);
    restoredCount++;
  });
  
  console.log(`\n✅ Restore completed! Restored ${restoredCount} files.\n`);
}

// Run restore
restoreFiles();
