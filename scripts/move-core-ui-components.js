#!/usr/bin/env node

/**
 * This script moves UI components from src/components/ui to src/core/components/ui
 * It organizes them into primitives and composed subdirectories based on naming patterns
 * and updates imports across the codebase.
 * 
 * Usage: node scripts/move-core-ui-components.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';
import { execSync } from 'child_process';

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Source and destination directories
const SOURCE_DIR = path.join(rootDir, 'src', 'components', 'ui');
const DEST_DIR = path.join(rootDir, 'src', 'core', 'components', 'ui');

// Patterns for identifying primitive UI components
const PRIMITIVE_PATTERNS = [
  'button',
  'input',
  'select',
  'checkbox',
  'radio',
  'toggle',
  'switch',
  'form',
  'modal',
  'dialog',
  'toast',
  'alert',
  'spinner',
  'loader',
  'progress',
  'tabs',
  'accordion',
  'table',
  'menu',
  'badge',
  'label',
  'card',
  'avatar',
  'icon',
  'tooltip',
  'popover',
  'dropdown',
  'navigation',
  'breadcrumb',
  'skeleton'
];

async function moveUIComponents() {
  console.log('🔍 Starting UI component migration...');

  try {
    // 1. Create destination directories
    await fs.mkdir(path.join(DEST_DIR, 'primitives'), { recursive: true });
    await fs.mkdir(path.join(DEST_DIR, 'composed'), { recursive: true });
    console.log('✅ Created destination directories');

    // 2. Get all component files from the UI directory
    let componentFiles = [];
    
    try {
      componentFiles = globSync('**/*.{tsx,jsx}', { 
        cwd: SOURCE_DIR,
        ignore: ['**/node_modules/**', '**/dist/**', '**/__tests__/**', '**/*.test.*', '**/*.spec.*']
      });
    } catch (error) {
      console.error('❌ Error finding component files:', error);
      process.exit(1);
    }

    console.log(`📋 Found ${componentFiles.length} UI components to migrate`);

    // 3. Process each component
    const migratedComponents = [];
    
    for (const file of componentFiles) {
      const sourceFilePath = path.join(SOURCE_DIR, file);
      
      // Skip if the file already has a subdirectory structure
      if (file.includes('/primitives/') || file.includes('/composed/') || file.includes('/styled/')) {
        // Keep existing structure
        const subdirPath = path.dirname(file);
        const destSubdirPath = path.join(DEST_DIR, subdirPath);
        
        // Create the subdirectory if it doesn't exist
        await fs.mkdir(destSubdirPath, { recursive: true });
        
        // Move the file to the same structure in the destination
        const destFilePath = path.join(DEST_DIR, file);
        await fs.copyFile(sourceFilePath, destFilePath);
        
        migratedComponents.push({
          source: sourceFilePath,
          destination: destFilePath,
          category: 'existing structure'
        });
      } else {
        // Determine if it's a primitive or composed component
        const fileName = path.basename(file);
        const isPrimitive = PRIMITIVE_PATTERNS.some(pattern => 
          fileName.toLowerCase().includes(pattern.toLowerCase())
        );
        
        // Choose the appropriate subdirectory
        const subdir = isPrimitive ? 'primitives' : 'composed';
        const destFilePath = path.join(DEST_DIR, subdir, fileName);
        
        // Copy the file to the destination
        await fs.copyFile(sourceFilePath, destFilePath);
        
        migratedComponents.push({
          source: sourceFilePath,
          destination: destFilePath,
          category: isPrimitive ? 'primitive' : 'composed'
        });
      }
    }

    console.log('✅ Copied all UI components to their new locations');
    
    // 4. Update imports in the codebase
    console.log('🔄 Updating imports across the codebase...');
    
    // Build a regex pattern for all the component files
    const componentBasenames = componentFiles.map(file => path.basename(file, path.extname(file)));
    const importRegexPattern = `from ['"]@/components/ui(?:/[^'"]*)?/(${componentBasenames.join('|')})['"]`;
    const importRegex = new RegExp(importRegexPattern, 'g');
    
    // Find all TypeScript and JavaScript files
    const codeFiles = globSync('src/**/*.{ts,tsx,js,jsx}', { 
      cwd: rootDir,
      ignore: ['**/node_modules/**', '**/dist/**']
    });
    
    let updatedFiles = 0;
    
    for (const file of codeFiles) {
      const filePath = path.join(rootDir, file);
      let content = await fs.readFile(filePath, 'utf8');
      
      const originalContent = content;
      
      // Update import paths
      for (const component of migratedComponents) {
        const componentName = path.basename(component.source, path.extname(component.source));
        const relativeSourceDir = path.relative(SOURCE_DIR, path.dirname(component.source));
        const relativeDestDir = path.relative(DEST_DIR, path.dirname(component.destination));
        
        // Match both direct imports and subdir imports
        const oldImport1 = `from '@/components/ui/${componentName}'`;
        const oldImport2 = relativeSourceDir ? `from '@/components/ui/${relativeSourceDir}/${componentName}'` : oldImport1;
        
        const newImport = relativeDestDir === '.' 
          ? `from '@/core/components/ui/${componentName}'`
          : `from '@/core/components/ui/${relativeDestDir}/${componentName}'`;
        
        content = content.replace(new RegExp(oldImport1, 'g'), newImport);
        if (oldImport2 !== oldImport1) {
          content = content.replace(new RegExp(oldImport2, 'g'), newImport);
        }
      }
      
      // Write the file if changes were made
      if (content !== originalContent) {
        await fs.writeFile(filePath, content, 'utf8');
        updatedFiles++;
      }
    }
    
    console.log(`✅ Updated imports in ${updatedFiles} files`);
    
    // 5. Create a Markdown report
    await generateMigrationReport(migratedComponents, updatedFiles);
    
    console.log('\n✅ UI component migration complete! Details saved to docs/refactoring/ui-component-migration.md');
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
}

async function generateMigrationReport(migratedComponents, updatedFiles) {
  // Group components by category
  const primitiveComponents = migratedComponents.filter(c => c.category === 'primitive');
  const composedComponents = migratedComponents.filter(c => c.category === 'composed');
  const structuredComponents = migratedComponents.filter(c => c.category === 'existing structure');
  
  const report = `# UI Component Migration Report

## Overview

This report documents the migration of UI components from \`src/components/ui\` to \`src/core/components/ui\`.

## Summary

- **Total components migrated**: ${migratedComponents.length}
  - Primitive UI components: ${primitiveComponents.length}
  - Composed UI components: ${composedComponents.length}
  - Components with existing structure: ${structuredComponents.length}
- **Files with updated imports**: ${updatedFiles}

## Migrated Components

### Primitive UI Components

The following basic UI building blocks have been moved to \`src/core/components/ui/primitives\`:

${primitiveComponents.map(c => `- \`${path.basename(c.source)}\` → \`${c.destination.replace(rootDir, '')}\``).join('\n')}

### Composed UI Components

The following composed UI components have been moved to \`src/core/components/ui/composed\`:

${composedComponents.map(c => `- \`${path.basename(c.source)}\` → \`${c.destination.replace(rootDir, '')}\``).join('\n')}

### Components with Existing Structure

The following components maintained their existing directory structure:

${structuredComponents.map(c => `- \`${c.source.replace(rootDir, '')}\` → \`${c.destination.replace(rootDir, '')}\``).join('\n')}

## Next Steps

1. Run tests to ensure the application works correctly with the new component locations
2. Update any TypeScript paths configurations if necessary
3. Proceed with moving feature-specific components to their respective feature directories
4. Review and update documentation to reflect the new component organization
`;

  const reportDir = path.join(rootDir, 'docs', 'refactoring');
  await fs.mkdir(reportDir, { recursive: true });
  await fs.writeFile(path.join(reportDir, 'ui-component-migration.md'), report);
}

// Run the script
moveUIComponents().catch(error => {
  console.error('Error during component migration:', error);
  process.exit(1);
}); 