#!/usr/bin/env node

/**
 * This script converts remaining components in src/components to bridge components
 * that point to their counterparts in the feature, core, or shared directories.
 * 
 * It identifies components that are not already bridge components and:
 * 1. Creates a bridge component that imports from the new location
 * 2. Adds deprecation notices
 * 3. Logs the conversion
 * 
 * Usage: node scripts/create-remaining-bridge-components.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Define directory mappings from components to their new locations
const DIRECTORY_MAPPINGS = {
  // Feature components
  'todo': '@/features/todo/components',
  'petrol-providers': '@/features/petrol-providers/components',
  'fuel-supplies': '@/features/fuel-supplies/components',
  'fuel': '@/features/fuel/components',
  'dashboard': '@/features/dashboard/components',
  'employees': '@/features/employees/components',
  'transactions': '@/features/finance/components',
  'expenses': '@/features/finance/components',
  'shifts': '@/features/finance/components',
  'filling-systems': '@/features/filling-systems/components',
  'settings': '@/features/auth/components',
  
  // Shared components
  'unified': '@/shared/components/unified',
  'dialogs': '@/shared/components/dialogs',
  'sidebar': '@/shared/components/sidebar',
  'enhanced': '@/shared/components/enhanced',
  'shared': '@/shared/components/shared',
  'dev': '@/shared/components/dev',
  
  // UI components
  'ui': '@/core/components/ui',
};

// Components that should be skipped (already bridge components or special cases)
const SKIP_FILES = [
  '.DS_Store',
  'index.ts',
  'index.tsx',
  'types.ts',
  'types.tsx',
  'constants.ts',
  'utils.ts',
  'styles.ts',
  'styles.css',
];

/**
 * Checks if a file is already a bridge component by looking for imports 
 * from feature or shared directories and deprecation warnings
 */
async function isBridgeComponent(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    
    // Check for imports from feature, core, or shared directories
    const hasNewImport = (
      content.includes('from \'@/features/') || 
      content.includes('from "@/features/') ||
      content.includes('from \'@/core/') || 
      content.includes('from "@/core/') ||
      content.includes('from \'@/shared/') || 
      content.includes('from "@/shared/')
    );
    
    // Check for deprecation utility usage
    const hasDeprecationNotice = (
      content.includes('logDeprecatedUsage') ||
      content.includes('createBridgeComponent')
    );
    
    return hasNewImport && hasDeprecationNotice;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return false;
  }
}

/**
 * Creates a bridge component that imports from the new location
 */
async function createBridgeComponent(filePath, componentDir) {
  try {
    // Get component name and new path
    const fileName = path.basename(filePath);
    const componentName = path.basename(filePath, path.extname(filePath));
    
    // Skip if it's in the skip list
    if (SKIP_FILES.includes(fileName)) {
      return { status: 'skipped', message: `Skipped ${fileName} (in skip list)` };
    }
    
    // Skip if already a bridge component
    if (await isBridgeComponent(filePath)) {
      return { status: 'skipped', message: `Skipped ${fileName} (already a bridge component)` };
    }
    
    // Determine the new import path
    const newImportBase = DIRECTORY_MAPPINGS[componentDir];
    if (!newImportBase) {
      return { status: 'error', message: `No mapping defined for directory ${componentDir}` };
    }
    
    const newImportPath = `${newImportBase}/${componentName}`;
    
    // Create bridge component content
    const bridgeContent = `/**
 * BRIDGE COMPONENT
 * This is a temporary bridge component that imports from the new location.
 * It will be removed once all imports are updated.
 */
import { ${componentName} } from '${newImportPath}';
import { logDeprecatedUsage } from '@/utils/deprecation';

// Log deprecation warning in development
if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: '${componentName}',
    oldPath: '@/components/${componentDir}/${componentName}',
    newPath: '${newImportPath}',
    removalDate: '2024-06-30'
  });
}

// Re-export the component
export default ${componentName};
`;

    // Backup the original file
    const backupPath = `${filePath}.original`;
    await fs.copyFile(filePath, backupPath);
    
    // Write the bridge component
    await fs.writeFile(filePath, bridgeContent, 'utf8');
    
    return { status: 'success', message: `Created bridge component for ${fileName}` };
  } catch (error) {
    console.error(`Error creating bridge component for ${filePath}:`, error);
    return { status: 'error', message: `Error: ${error.message}` };
  }
}

/**
 * Process a directory of components
 */
async function processDirectory(dir) {
  const componentsDir = path.join(rootDir, 'src', 'components', dir);
  
  try {
    // Check if directory exists
    await fs.access(componentsDir);
  } catch (error) {
    console.log(`Directory ${componentsDir} doesn't exist, skipping...`);
    return { processed: 0, skipped: 0, errors: 0 };
  }
  
  // Get all component files
  const componentFiles = globSync('**/*.{tsx,jsx}', {
    cwd: componentsDir,
    ignore: ['**/node_modules/**', '**/dist/**', '**/*.test.*', '**/*.spec.*', '**/__tests__/**']
  });
  
  if (componentFiles.length === 0) {
    console.log(`No component files found in ${dir}, skipping...`);
    return { processed: 0, skipped: 0, errors: 0 };
  }
  
  console.log(`Processing ${componentFiles.length} components in ${dir}...`);
  
  let processed = 0;
  let skipped = 0;
  let errors = 0;
  
  // Process each component file
  for (const file of componentFiles) {
    const filePath = path.join(componentsDir, file);
    const result = await createBridgeComponent(filePath, dir);
    
    console.log(`  ${result.status}: ${result.message}`);
    
    if (result.status === 'success') processed++;
    else if (result.status === 'skipped') skipped++;
    else errors++;
  }
  
  return { processed, skipped, errors };
}

/**
 * Main function
 */
async function main() {
  console.log('🔄 Converting remaining components to bridge components...');
  
  let totalProcessed = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  
  // Process each component directory
  for (const dir of Object.keys(DIRECTORY_MAPPINGS)) {
    const { processed, skipped, errors } = await processDirectory(dir);
    
    totalProcessed += processed;
    totalSkipped += skipped;
    totalErrors += errors;
  }
  
  console.log('\n✅ Bridge component conversion complete!');
  console.log(`📊 Summary:`);
  console.log(`  - Created ${totalProcessed} bridge components`);
  console.log(`  - Skipped ${totalSkipped} components`);
  console.log(`  - Encountered ${totalErrors} errors`);
  
  // Generate report
  const report = `# Bridge Component Conversion Report

## Summary

- Date: ${new Date().toISOString().split('T')[0]}
- Created ${totalProcessed} bridge components
- Skipped ${totalSkipped} components
- Encountered ${totalErrors} errors

## Details

Bridge components are temporary components that import from the new location and re-export the component.
They include deprecation warnings to encourage developers to update their imports.

### Directory Mappings

${Object.entries(DIRECTORY_MAPPINGS)
  .map(([oldDir, newPath]) => `- \`src/components/${oldDir}\` → \`${newPath}\``)
  .join('\n')}

## Next Steps

1. Continue updating imports across the codebase to use the new component paths
2. Run tests to ensure the application works correctly with bridge components
3. Monitor usage of deprecated components using the deprecation dashboard
4. Follow the removal plan in \`docs/refactoring/removing-legacy-components.md\`
`;

  // Write report
  const reportPath = path.join(rootDir, 'docs', 'refactoring', 'bridge-components-report.md');
  await fs.writeFile(reportPath, report, 'utf8');
  
  console.log(`📄 Report saved to ${reportPath}`);
}

// Run the script
main().catch(error => {
  console.error('Error during bridge component creation:', error);
  process.exit(1);
}); 