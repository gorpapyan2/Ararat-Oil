#!/usr/bin/env node

/**
 * This script finds and updates imports that still reference the old component paths.
 * It can be run in two modes:
 * 1. Audit mode (default): Lists all files with old imports without making changes
 * 2. Update mode: Updates imports to use new paths
 * 
 * Usage: node scripts/update-remaining-imports.js [--update]
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Check if we're in update mode
const isUpdateMode = process.argv.includes('--update');

// Define directory mappings from components to their new locations
const DIRECTORY_MAPPINGS = {
  // Feature components
  'components/todo': 'features/todo/components',
  'components/petrol-providers': 'features/petrol-providers/components',
  'components/fuel-supplies': 'features/fuel-supplies/components',
  'components/fuel': 'features/fuel/components',
  'components/dashboard': 'features/dashboard/components',
  'components/employees': 'features/employees/components',
  'components/transactions': 'features/finance/components',
  'components/expenses': 'features/finance/components',
  'components/shifts': 'features/finance/components',
  'components/filling-systems': 'features/filling-systems/components',
  'components/settings': 'features/auth/components',
  
  // Shared components
  'components/unified': 'shared/components/unified',
  'components/dialogs': 'shared/components/dialogs',
  'components/sidebar': 'shared/components/sidebar',
  'components/enhanced': 'shared/components/enhanced',
  'components/shared': 'shared/components/shared',
  'components/dev': 'shared/components/dev',
  
  // UI components
  'components/ui': 'core/components/ui',
};

/**
 * Finds and updates imports that reference old component paths
 */
async function updateImports() {
  console.log(`🔍 ${isUpdateMode ? 'Updating' : 'Auditing'} imports that reference old component paths...`);
  
  // Get all TypeScript and JavaScript files
  const sourceFiles = globSync('src/**/*.{ts,tsx,js,jsx}', {
    cwd: rootDir,
    ignore: ['**/node_modules/**', '**/dist/**', '**/*.d.ts']
  });
  
  console.log(`Found ${sourceFiles.length} source files to analyze`);
  
  let filesWithOldImports = 0;
  let totalOldImports = 0;
  let updatedFiles = 0;
  let updatedImports = 0;
  
  const importAudit = {};
  
  // Process each file
  for (const file of sourceFiles) {
    const filePath = path.join(rootDir, file);
    let content = await fs.readFile(filePath, 'utf8');
    const originalContent = content;
    
    // Skip bridge components
    if (
      content.includes('BRIDGE COMPONENT') || 
      content.includes('logDeprecatedUsage') || 
      content.includes('createBridgeComponent')
    ) {
      continue;
    }
    
    let fileOldImports = 0;
    let fileUpdatedImports = 0;
    
    // Check for imports from old component paths
    const importRegex = /from\s+['"](@\/)?((components)\/[^'"]+)['"]/g;
    let match;
    
    // Store all matches to check later
    const matches = [];
    while ((match = importRegex.exec(content)) !== null) {
      matches.push(match);
    }
    
    // Skip if no matches
    if (matches.length === 0) {
      continue;
    }
    
    // Process matches (in reverse to handle overlapping matches)
    for (let i = matches.length - 1; i >= 0; i--) {
      match = matches[i];
      const importPath = match[2];
      
      // Check if this import path should be updated
      let shouldUpdate = false;
      let newPath = '';
      
      for (const [oldPath, newPathBase] of Object.entries(DIRECTORY_MAPPINGS)) {
        if (importPath.startsWith(oldPath)) {
          // Replace old import path with new path
          newPath = importPath.replace(oldPath, newPathBase);
          shouldUpdate = true;
          break;
        }
      }
      
      if (shouldUpdate) {
        fileOldImports++;
        totalOldImports++;
        
        // Track import audit
        importAudit[importPath] = (importAudit[importPath] || 0) + 1;
        
        // Skip if audit mode
        if (!isUpdateMode) {
          continue;
        }
        
        // Update import path
        const start = match.index;
        const end = match.index + match[0].length;
        const newImport = `from '${match[1] || '@/'}${newPath}'`;
        content = content.substring(0, start) + newImport + content.substring(end);
        
        fileUpdatedImports++;
        updatedImports++;
      }
    }
    
    // Update file if changes were made
    if (fileOldImports > 0) {
      filesWithOldImports++;
      console.log(`${file}: ${fileOldImports} old imports found`);
      
      if (isUpdateMode && content !== originalContent) {
        await fs.writeFile(filePath, content, 'utf8');
        updatedFiles++;
      }
    }
  }
  
  // Print summary
  console.log(`\n📊 ${isUpdateMode ? 'Update' : 'Audit'} Summary:`);
  console.log(`  - Files with old imports: ${filesWithOldImports}`);
  console.log(`  - Total old imports found: ${totalOldImports}`);
  
  if (isUpdateMode) {
    console.log(`  - Files updated: ${updatedFiles}`);
    console.log(`  - Imports updated: ${updatedImports}`);
  }
  
  // Print top old imports
  if (totalOldImports > 0) {
    console.log('\n🔝 Top old imports:');
    
    Object.entries(importAudit)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([importPath, count]) => {
        console.log(`  - ${importPath}: ${count} occurrences`);
      });
  }
  
  // Generate report
  const report = `# ${isUpdateMode ? 'Import Update' : 'Import Audit'} Report

## Summary

- Date: ${new Date().toISOString().split('T')[0]}
- Mode: ${isUpdateMode ? 'Update (imports modified)' : 'Audit (no changes made)'}
- Files with old imports: ${filesWithOldImports}
- Total old imports found: ${totalOldImports}
${isUpdateMode ? `- Files updated: ${updatedFiles}\n- Imports updated: ${updatedImports}` : ''}

${totalOldImports > 0 ? `
## Top Old Imports

${Object.entries(importAudit)
  .sort((a, b) => b[1] - a[1])
  .map(([importPath, count]) => `- \`${importPath}\`: ${count} occurrences`)
  .join('\n')}
` : ''}

## Next Steps

1. ${isUpdateMode ? 'Run TypeScript type checking and tests to ensure the updates did not break anything' : 'Run this script with --update to fix the old imports'}
2. ${isUpdateMode ? 'Use the deprecation monitoring dashboard to track any remaining usage' : 'Review the list of old imports to ensure they should all be updated'}
3. Continue with the refactoring process:
   - Enhance component documentation
   - Standardize component APIs
   - Increase test coverage
`;

  // Write report
  const reportPath = path.join(
    rootDir, 
    'docs', 
    'refactoring', 
    `${isUpdateMode ? 'import-update' : 'import-audit'}-report.md`
  );
  await fs.writeFile(reportPath, report, 'utf8');
  
  console.log(`\n📄 Report saved to ${reportPath}`);
}

// Run the script
updateImports().catch(error => {
  console.error('Error during import update:', error);
  process.exit(1);
}); 