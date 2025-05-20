#!/usr/bin/env node

/**
 * Utility Migration Finder
 * 
 * This script helps find files that need to be updated to use the new
 * utils structure after the refactoring.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the patterns to search for
const PATTERNS = [
  {
    type: 'old-utils',
    regex: /from ['"]@\/lib\/utils['"]/,
    message: 'Import from old utils path',
    fix: 'Update to import from @/shared/utils'
  },
  {
    type: 'old-formatters',
    regex: /from ['"]@\/lib\/formatters['"]/,
    message: 'Import from old formatters path',
    fix: 'Update to import from @/shared/utils/formatting or @/shared/utils'
  },
  {
    type: 'old-design-system',
    regex: /from ['"]@\/lib\/design-system['"]/,
    message: 'Import from old design system path',
    fix: 'Update to import from @/core/design'
  },
  {
    type: 'old-schemas',
    regex: /from ['"]@\/lib\/schemas\/common['"]/,
    message: 'Import from old schemas path',
    fix: 'Update to import from @/shared/schemas'
  },
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

// Check file for pattern matches
function findPatternsInFile(filePath, patterns) {
  const content = fs.readFileSync(filePath, 'utf8');
  const results = {};
  
  patterns.forEach(pattern => {
    if (pattern.regex.test(content)) {
      // Extract the line containing the match
      const lines = content.split('\n');
      const matchingLines = lines.filter(line => pattern.regex.test(line));
      
      matchingLines.forEach(line => {
        if (!results[pattern.type]) {
          results[pattern.type] = [];
        }
        results[pattern.type].push(`${filePath}: ${line.trim()}`);
      });
    }
  });
  
  return results;
}

// Main function
function findMigrationNeeds() {
  console.log('🔍 Scanning codebase for imports that need migration...\n');
  
  let totalFound = 0;
  const results = {};
  
  try {
    // Find all relevant files in src directory
    const projectRoot = path.resolve(path.join(__dirname, '..'));
    const files = findFilesRecursively(path.join(projectRoot, 'src'));
    
    // Check each file for pattern matches
    files.forEach(file => {
      const fileResults = findPatternsInFile(file, PATTERNS);
      
      // Merge results
      Object.entries(fileResults).forEach(([type, matches]) => {
        if (!results[type]) {
          results[type] = [];
        }
        results[type].push(...matches);
        totalFound += matches.length;
      });
    });
    
    // Print results
    if (totalFound === 0) {
      console.log('✅ No imports found that need migration!');
    } else {
      console.log(`⚠️ Found ${totalFound} imports that need to be migrated:\n`);
      
      PATTERNS.forEach(pattern => {
        const typeResults = results[pattern.type];
        if (typeResults && typeResults.length > 0) {
          console.log(`\n📁 ${pattern.message}`);
          console.log(`💡 ${pattern.fix}`);
          console.log('-'.repeat(50));
          
          typeResults.forEach(match => {
            console.log(match);
          });
        }
      });
      
      console.log('\n\n📝 Follow the migration guide at docs/refactoring/utils-migration-guide.md');
    }
  } catch (error) {
    console.error('Error scanning files:', error);
  }
}

// Run the main function
findMigrationNeeds(); 