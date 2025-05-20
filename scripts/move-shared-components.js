#!/usr/bin/env node

/**
 * This script moves shared utility components from various src/components/{dir} 
 * to src/shared/components/{dir}
 * and updates imports across the codebase.
 * 
 * Usage: node scripts/move-shared-components.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Define shared component directories
const SHARED_DIRECTORIES = [
  'unified',
  'dialogs',
  'sidebar',
  'enhanced',
  'shared',
  'dev'
];

async function moveSharedComponents() {
  console.log('🔍 Starting shared components migration...');
  
  // Create the base destination directory
  const baseDestDir = path.join(rootDir, 'src', 'shared', 'components');
  await fs.mkdir(baseDestDir, { recursive: true });
  console.log('✅ Confirmed destination directory exists:', baseDestDir);
  
  // Track all migrated components for import updating
  const migratedComponents = [];
  let totalFiles = 0;
  
  // Process each shared directory
  for (const sharedDir of SHARED_DIRECTORIES) {
    const sourcePath = path.join(rootDir, 'src', 'components', sharedDir);
    const destPath = path.join(baseDestDir, sharedDir);
    
    // Check if source directory exists
    try {
      await fs.access(sourcePath);
    } catch (error) {
      console.log(`⚠️ Directory ${sourcePath} doesn't exist, skipping...`);
      continue;
    }
    
    // Create destination directory
    await fs.mkdir(destPath, { recursive: true });
    
    // Find all component files in this directory (including subdirectories)
    const componentFiles = globSync('**/*.{tsx,jsx}', { 
      cwd: sourcePath,
      ignore: ['**/node_modules/**', '**/dist/**', '**/__tests__/**', '**/*.test.*', '**/*.spec.*']
    });
    
    if (componentFiles.length === 0) {
      console.log(`⚠️ No component files found in ${sourcePath}, skipping...`);
      continue;
    }
    
    console.log(`📂 Processing directory: ${sharedDir} (${componentFiles.length} files)`);
    totalFiles += componentFiles.length;
    
    // Process each component file
    for (const file of componentFiles) {
      const sourceFilePath = path.join(sourcePath, file);
      const relativeDir = path.dirname(file);
      
      // Create subdirectory in destination if needed
      if (relativeDir !== '.') {
        await fs.mkdir(path.join(destPath, relativeDir), { recursive: true });
      }
      
      // Copy the file to destination
      const destFilePath = path.join(destPath, file);
      await fs.copyFile(sourceFilePath, destFilePath);
      
      migratedComponents.push({
        source: sourceFilePath,
        destination: destFilePath,
        componentDir: sharedDir,
        relativePath: file
      });
      
      console.log(`  ✅ Migrated: ${path.basename(file)}`);
    }
  }
  
  if (totalFiles === 0) {
    console.log(`⚠️ No files were found to migrate.`);
    return;
  }
  
  console.log(`✅ Copied ${totalFiles} component files to shared directories`);
  
  // Update imports across the codebase
  console.log('🔄 Updating imports across the codebase...');
  
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
    
    // Update import paths for each migrated component
    for (const component of migratedComponents) {
      const componentName = path.basename(component.source, path.extname(component.source));
      const relativeSourcePath = path.dirname(component.relativePath);
      
      // Different import patterns to replace
      const importPatterns = [
        // Simple direct import
        {
          oldImport: `from '@/components/${component.componentDir}/${componentName}'`,
          newImport: `from '@/shared/components/${component.componentDir}/${componentName}'`
        },
        // Import from subdirectory
        {
          oldImport: relativeSourcePath !== '.' ? 
            `from '@/components/${component.componentDir}/${relativeSourcePath}/${componentName}'` : null,
          newImport: relativeSourcePath !== '.' ? 
            `from '@/shared/components/${component.componentDir}/${relativeSourcePath}/${componentName}'` : null
        },
        // Import with destructuring 
        {
          oldImport: `from '@/components/${component.componentDir}'`,
          newImport: `from '@/shared/components/${component.componentDir}'`
        }
      ];
      
      // Apply all import pattern replacements
      for (const pattern of importPatterns) {
        if (pattern.oldImport && content.includes(pattern.oldImport)) {
          content = content.replace(new RegExp(pattern.oldImport.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), pattern.newImport);
        }
      }
    }
    
    // Write the file if changes were made
    if (content !== originalContent) {
      await fs.writeFile(filePath, content, 'utf8');
      updatedFiles++;
    }
  }
  
  console.log(`✅ Updated imports in ${updatedFiles} files`);
  
  // Generate migration report
  await generateMigrationReport(migratedComponents, updatedFiles);
  
  console.log(`\n✅ Shared components migration complete!`);
  console.log(`Details saved to docs/refactoring/shared-components-migration.md`);
}

async function generateMigrationReport(migratedComponents, updatedFiles) {
  // Group components by source directory
  const bySourceDir = {};
  migratedComponents.forEach(comp => {
    const dir = comp.componentDir;
    if (!bySourceDir[dir]) {
      bySourceDir[dir] = [];
    }
    bySourceDir[dir].push(comp);
  });
  
  // Generate report content
  const report = `# Shared Components Migration Report

## Overview

This report documents the migration of shared utility components from \`src/components/{dir}\` to \`src/shared/components/{dir}\`.

## Summary

- **Total components migrated**: ${migratedComponents.length}
- **Files with updated imports**: ${updatedFiles}

## Source Directories

${Object.keys(bySourceDir).map(dir => `- \`src/components/${dir}\` → \`src/shared/components/${dir}\` (${bySourceDir[dir].length} components)`).join('\n')}

## Migrated Components

${Object.keys(bySourceDir).map(dir => `
### From \`src/components/${dir}\`

${bySourceDir[dir].map(comp => {
  const relativePath = path.dirname(comp.relativePath) !== '.' ? `${path.dirname(comp.relativePath)}/` : '';
  return `- \`${path.basename(comp.source)}\` → \`src/shared/components/${dir}/${relativePath}${path.basename(comp.source)}\``;
}).join('\n')}
`).join('\n')}

## Next Steps

1. Verify that the application works correctly with updated component locations
2. Run tests to ensure no functionality was broken
3. Update component documentation to reflect new locations
4. Consider creating bridge components for backward compatibility if needed
`;

  const reportDir = path.join(rootDir, 'docs', 'refactoring');
  await fs.mkdir(reportDir, { recursive: true });
  await fs.writeFile(path.join(reportDir, 'shared-components-migration.md'), report);
  
  // Update the overall migration progress document
  let progressFilePath = path.join(reportDir, 'migration-progress.md');
  let progressContent;
  
  try {
    progressContent = await fs.readFile(progressFilePath, 'utf8');
  } catch (error) {
    console.warn(`⚠️ Migration progress file not found at ${progressFilePath}`);
    return;
  }
  
  // Update the progress document with shared components migration info
  const sharedProgressMark = `
### Phase 3: Shared Components ✅

**Status**: Complete

- Migrated ${migratedComponents.length} shared utility components
- Moved components from ${Object.keys(bySourceDir).length} directories to \`src/shared/components\`
- Updated imports in ${updatedFiles} files`;
  
  // Replace the shared components section
  progressContent = progressContent.replace(
    /### Phase 3: Shared Components.*?(?=### Phase 4:|$)/s,
    sharedProgressMark
  );
  
  await fs.writeFile(progressFilePath, progressContent, 'utf8');
}

// Run the script
moveSharedComponents().catch(error => {
  console.error('Error during component migration:', error);
  process.exit(1);
}); 