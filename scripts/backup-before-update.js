#!/usr/bin/env node

/**
 * Backup Script
 * 
 * Creates a backup of codebase files before running the import updater.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get current date and time for backup directory name
const getBackupDirName = () => {
  const now = new Date();
  return `backup-${now.getFullYear()}-${
    String(now.getMonth() + 1).padStart(2, '0')
  }-${
    String(now.getDate()).padStart(2, '0')
  }_${
    String(now.getHours()).padStart(2, '0')
  }-${
    String(now.getMinutes()).padStart(2, '0')
  }-${
    String(now.getSeconds()).padStart(2, '0')
  }`;
};

// Check if a directory should be excluded
function shouldExclude(dirPath) {
  const excludeDirs = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    'backup'
  ];
  
  const basename = path.basename(dirPath);
  return excludeDirs.includes(basename);
}

// Check if a file should be included in backup
function shouldIncludeFile(filePath) {
  const allowedExtensions = ['.js', '.jsx', '.ts', '.tsx'];
  const ext = path.extname(filePath);
  return allowedExtensions.includes(ext);
}

// Create directory recursively if it doesn't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Copy file with directory structure
function copyFile(sourcePath, targetDir, projectRoot) {
  // Get relative path to preserve directory structure
  const relativePath = path.relative(projectRoot, sourcePath);
  const targetPath = path.join(targetDir, relativePath);
  
  // Create target directory if it doesn't exist
  ensureDirectoryExists(path.dirname(targetPath));
  
  // Copy the file
  fs.copyFileSync(sourcePath, targetPath);
  return relativePath;
}

// Find and backup files
function findAndBackupFiles(sourceDir, backupDir, projectRoot, fileList = []) {
  if (shouldExclude(sourceDir)) return fileList;
  
  const files = fs.readdirSync(sourceDir);
  
  files.forEach(file => {
    const sourcePath = path.join(sourceDir, file);
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      findAndBackupFiles(sourcePath, backupDir, projectRoot, fileList);
    } else if (shouldIncludeFile(sourcePath)) {
      const relativePath = copyFile(sourcePath, backupDir, projectRoot);
      fileList.push(relativePath);
    }
  });
  
  return fileList;
}

// Main function
async function createBackup() {
  console.log('📦 Creating backup of codebase files before updating imports...\n');
  
  try {
    // Set up paths
    const projectRoot = path.resolve(path.join(__dirname, '..'));
    const backupName = getBackupDirName();
    const backupDir = path.join(projectRoot, 'backup', backupName);
    
    // Create backup directory
    ensureDirectoryExists(backupDir);
    
    // Find and backup source files
    const srcDir = path.join(projectRoot, 'src');
    const backedUpFiles = findAndBackupFiles(srcDir, backupDir, projectRoot);
    
    console.log(`✅ Backup completed! Backed up ${backedUpFiles.length} files to:\n${backupDir}`);
    console.log('\nYou can now safely run the import updater:');
    console.log('npm run utils:update-imports');
    
    // Create restore script in backup directory
    const restoreScriptPath = path.join(backupDir, 'restore.js');
    const restoreScript = `
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
    console.log(\`Restored: \${relativePath}\`);
    restoredCount++;
  });
  
  console.log(\`\\n✅ Restore completed! Restored \${restoredCount} files.\\n\`);
}

// Run restore
restoreFiles();
`;
    
    fs.writeFileSync(restoreScriptPath, restoreScript, 'utf8');
    console.log('\nA restore script has been created in the backup directory.');
    console.log('To restore the backup, run:');
    console.log(`node ${path.relative(projectRoot, restoreScriptPath)}`);
    
  } catch (error) {
    console.error('❌ Error creating backup:', error);
  }
}

// Run the main function
createBackup(); 