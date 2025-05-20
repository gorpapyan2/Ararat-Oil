#!/usr/bin/env node

/**
 * This script moves feature-specific components from src/components/{feature} to src/features/{feature}/components
 * It handles the specific feature domain mapping and updates imports across the codebase.
 * 
 * Usage: node scripts/move-feature-components.js [feature]
 * Example: node scripts/move-feature-components.js finance
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

// Get the feature to migrate from command line arguments
const featureArg = process.argv[2];
if (!featureArg) {
  console.error('Please specify a feature to migrate:');
  console.error('Usage: node scripts/move-feature-components.js [feature]');
  console.error('Available features:');
  const availableFeatures = [...new Set(Object.values(FEATURE_MAPPING))];
  availableFeatures.forEach(feature => {
    console.error(`  - ${feature}`);
  });
  process.exit(1);
}

// Validate the feature argument
const targetFeature = featureArg.toLowerCase();
if (!Object.values(FEATURE_MAPPING).includes(targetFeature)) {
  console.error(`Error: Feature "${targetFeature}" is not recognized.`);
  console.error('Available features:');
  const availableFeatures = [...new Set(Object.values(FEATURE_MAPPING))];
  availableFeatures.forEach(feature => {
    console.error(`  - ${feature}`);
  });
  process.exit(1);
}

// Get source directories for the selected feature
const sourceDirectories = Object.entries(FEATURE_MAPPING)
  .filter(([_, featureDir]) => featureDir === targetFeature)
  .map(([componentDir, _]) => componentDir);

if (sourceDirectories.length === 0) {
  console.error(`Error: No source directories found for feature "${targetFeature}".`);
  process.exit(1);
}

async function moveFeatureComponents() {
  console.log(`🔍 Starting component migration for feature: ${targetFeature}`);
  console.log(`Source directories: ${sourceDirectories.join(', ')}`);

  // Create destination directory
  const destDir = path.join(rootDir, 'src', 'features', targetFeature, 'components');
  await fs.mkdir(destDir, { recursive: true });
  console.log(`✅ Created destination directory: ${destDir}`);

  // Track all migrated components for import updating
  const migratedComponents = [];
  let totalFiles = 0;

  // Process each source directory for this feature
  for (const sourceDir of sourceDirectories) {
    const sourcePath = path.join(rootDir, 'src', 'components', sourceDir);
    
    // Check if source directory exists
    try {
      await fs.access(sourcePath);
    } catch (error) {
      console.log(`⚠️ Directory ${sourcePath} doesn't exist, skipping...`);
      continue;
    }
    
    // Find all component files in this directory (including subdirectories)
    const componentFiles = globSync('**/*.{tsx,jsx}', { 
      cwd: sourcePath,
      ignore: ['**/node_modules/**', '**/dist/**', '**/__tests__/**', '**/*.test.*', '**/*.spec.*']
    });
    
    if (componentFiles.length === 0) {
      console.log(`⚠️ No component files found in ${sourcePath}, skipping...`);
      continue;
    }
    
    console.log(`📂 Processing directory: ${sourceDir} (${componentFiles.length} files)`);
    totalFiles += componentFiles.length;
    
    // Process each component file
    for (const file of componentFiles) {
      const sourceFilePath = path.join(sourcePath, file);
      const relativeDir = path.dirname(file);
      
      // Create subdirectory in destination if needed
      if (relativeDir !== '.') {
        await fs.mkdir(path.join(destDir, relativeDir), { recursive: true });
      }
      
      // Copy the file to destination
      const destFilePath = path.join(destDir, file);
      await fs.copyFile(sourceFilePath, destFilePath);
      
      migratedComponents.push({
        source: sourceFilePath,
        destination: destFilePath,
        componentDir: sourceDir,
        relativePath: file
      });
      
      console.log(`  ✅ Migrated: ${path.basename(file)}`);
    }
  }
  
  if (totalFiles === 0) {
    console.log(`⚠️ No files were found to migrate for feature: ${targetFeature}`);
    return;
  }
  
  console.log(`✅ Copied ${totalFiles} component files to feature directory`);
  
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
          newImport: `from '@/features/${targetFeature}/components/${componentName}'`
        },
        // Import from subdirectory
        {
          oldImport: relativeSourcePath !== '.' ? 
            `from '@/components/${component.componentDir}/${relativeSourcePath}/${componentName}'` : null,
          newImport: relativeSourcePath !== '.' ? 
            `from '@/features/${targetFeature}/components/${relativeSourcePath}/${componentName}'` : null
        },
        // Import with destructuring 
        {
          oldImport: `from '@/components/${component.componentDir}'`,
          newImport: `from '@/features/${targetFeature}/components'`
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
  await generateMigrationReport(migratedComponents, updatedFiles, targetFeature);
  
  console.log(`\n✅ Feature component migration complete for "${targetFeature}"!`);
  console.log(`Details saved to docs/refactoring/feature-${targetFeature}-migration.md`);
}

async function generateMigrationReport(migratedComponents, updatedFiles, feature) {
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
  const report = `# ${feature.charAt(0).toUpperCase() + feature.slice(1)} Feature Components Migration Report

## Overview

This report documents the migration of components related to the "${feature}" feature from component directories to \`src/features/${feature}/components\`.

## Summary

- **Total components migrated**: ${migratedComponents.length}
- **Files with updated imports**: ${updatedFiles}

## Source Directories

${Object.keys(bySourceDir).map(dir => `- \`src/components/${dir}\` → \`src/features/${feature}/components\` (${bySourceDir[dir].length} components)`).join('\n')}

## Migrated Components

${Object.keys(bySourceDir).map(dir => `
### From \`src/components/${dir}\`

${bySourceDir[dir].map(comp => {
  const relativePath = path.dirname(comp.relativePath) !== '.' ? `${path.dirname(comp.relativePath)}/` : '';
  return `- \`${path.basename(comp.source)}\` → \`src/features/${feature}/components/${relativePath}${path.basename(comp.source)}\``;
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
  await fs.writeFile(path.join(reportDir, `feature-${feature}-migration.md`), report);
  
  // Update the overall migration progress document
  let progressFilePath = path.join(reportDir, 'migration-progress.md');
  let progressContent;
  
  try {
    progressContent = await fs.readFile(progressFilePath, 'utf8');
  } catch (error) {
    console.warn(`⚠️ Migration progress file not found at ${progressFilePath}`);
    return;
  }
  
  // Update the progress document with this feature's migration info
  const featureProgressMark = `- ${feature}: ✅ Migrated ${migratedComponents.length} components, updated ${updatedFiles} imports`;
  
  if (progressContent.includes(`- ${feature}:`)) {
    // Update existing entry
    progressContent = progressContent.replace(
      new RegExp(`- ${feature}:.*`, 'g'),
      featureProgressMark
    );
  } else {
    // Add new entry to Phase 2 section
    progressContent = progressContent.replace(
      /### Phase 2: Feature-Specific Components.*?\*\*Status\*\*: In progress/s,
      match => `${match}\n${featureProgressMark}`
    );
  }
  
  await fs.writeFile(progressFilePath, progressContent, 'utf8');
}

// Run the script
moveFeatureComponents().catch(error => {
  console.error('Error during component migration:', error);
  process.exit(1);
}); 