/**
 * Tailwind v4 Compatibility Checker
 * 
 * This script scans the codebase for patterns that might cause issues with Tailwind CSS v4.
 * It checks for:
 * 1. Direct CSS variable references like [var(--color-...)]
 * 2. HSL color formats that should be RGB
 * 3. Old opacity syntax (bg-opacity, text-opacity, border-opacity)
 * 4. Incorrect theme function calls
 */

import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';
import chalk from 'chalk';

// Patterns to check for
const patterns = [
  {
    name: 'Direct CSS Variable References',
    regex: /\[\s*var\(--color-[^)]+\)\s*\]/g,
    suggestion: 'Use utility classes like "bg-primary" instead of "bg-[var(--color-primary)]"'
  },
  {
    name: 'HSL Color Format',
    regex: /hsl\(var\(--[^)]+\)\)/g,
    suggestion: 'Use RGB format for colors: "rgb(255 255 255)" instead of HSL'
  },
  {
    name: 'Old Opacity Syntax',
    regex: /(bg|text|border)-opacity-\d+/g,
    suggestion: 'Use slash notation for opacity: "bg-primary/10" instead of "bg-primary bg-opacity-10"'
  },
  {
    name: 'Special Opacity Value',
    regex: /opacity-\$2/g,
    suggestion: 'Use numerical opacity value: "bg-primary/20" instead of "bg-primary bg-opacity-$2"'
  },
  {
    name: 'Theme Function Calls',
    regex: /theme\((['"]).*?\1\)/g,
    suggestion: 'Use direct color references or CSS variables'
  }
];

// File extensions to check
const fileExtensions = ['.tsx', '.jsx', '.js', '.ts', '.css'];

// Check if a file should be processed
function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  return fileExtensions.includes(ext) && 
         !filePath.includes('node_modules') && 
         !filePath.includes('backup');
}

// Check a single file for incompatible patterns
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Check for each pattern
    patterns.forEach(pattern => {
      const matches = content.match(pattern.regex);
      if (matches && matches.length > 0) {
        issues.push({
          pattern: pattern.name,
          count: matches.length,
          suggestion: pattern.suggestion,
          examples: matches.slice(0, 3) // First 3 examples
        });
      }
    });
    
    return { filePath, issues };
  } catch (error) {
    console.error(`❌ Error checking ${filePath}:`, error.message);
    return { filePath, issues: [] };
  }
}

// Main execution function
function main() {
  console.log(chalk.blue('🔍 Scanning codebase for Tailwind CSS v4 compatibility issues...'));
  
  // Get all files in the src directory
  const files = globSync(['src/**/*'], { nodir: true });
  
  let totalIssues = 0;
  const fileIssues = [];
  
  // Process each file
  files.forEach(file => {
    if (shouldProcessFile(file)) {
      const result = checkFile(file);
      
      if (result.issues.length > 0) {
        fileIssues.push(result);
        totalIssues += result.issues.reduce((sum, issue) => sum + issue.count, 0);
      }
    }
  });
  
  // Display results
  if (fileIssues.length === 0) {
    console.log(chalk.green('\n✨ No Tailwind CSS v4 compatibility issues found!'));
  } else {
    console.log(chalk.yellow(`\n⚠️ Found ${totalIssues} potential compatibility issues in ${fileIssues.length} files:`));
    
    fileIssues.forEach(fileIssue => {
      console.log(chalk.cyan(`\nFile: ${fileIssue.filePath}`));
      fileIssue.issues.forEach(issue => {
        console.log(`  ${chalk.yellow(issue.pattern)}: ${issue.count} occurrences`);
        console.log(`    ${chalk.gray('Suggestion:')} ${issue.suggestion}`);
        console.log(`    ${chalk.gray('Examples:')} ${issue.examples.join(', ')}`);
      });
    });
    
    console.log(chalk.yellow('\nRun the appropriate fix scripts to resolve these issues:'));
    console.log(chalk.gray('  npm run tailwind:convert-colors     # Fix color format issues'));
    console.log(chalk.gray('  npm run fix:opacity-syntax          # Fix opacity syntax issues'));
  }
}

// Run the script
main(); 