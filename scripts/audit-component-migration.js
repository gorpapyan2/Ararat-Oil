#!/usr/bin/env node

/**
 * This script audits the component migration process, identifying any components
 * that may have been missed or that need additional attention.
 * 
 * Usage: node scripts/audit-component-migration.js
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

// Define directories that were moved to shared/components
const SHARED_DIRECTORIES = [
  'unified',
  'dialogs',
  'sidebar',
  'enhanced',
  'shared',
  'dev'
];

// Define UI directories that should remain in components
const UI_DIRECTORIES = [
  'ui'
];

async function auditComponentMigration() {
  console.log('🔍 Auditing component migration...');
  
  // Check what directories remain in src/components
  const remainingDirs = await fs.readdir(path.join(rootDir, 'src', 'components'));
  
  const unmappedDirs = remainingDirs.filter(dir => {
    return !FEATURE_MAPPING[dir] && 
           !SHARED_DIRECTORIES.includes(dir) && 
           !UI_DIRECTORIES.includes(dir);
  });
  
  if (unmappedDirs.length > 0) {
    console.log('\n⚠️ Found unmapped component directories:');
    for (const dir of unmappedDirs) {
      console.log(`  - ${dir}`);
    }
    console.log('\nThese directories should be reviewed and either mapped to a feature or moved to shared/components.');
  } else {
    console.log('✅ All component directories are properly mapped or categorized.');
  }
  
  // Check bridge components in each feature-specific directory
  const results = {
    notBridged: [],
    missingInFeature: [],
    uiComponents: []
  };
  
  for (const [componentDir, featureDir] of Object.entries(FEATURE_MAPPING)) {
    try {
      // Check if the component directory exists
      try {
        await fs.access(path.join(rootDir, 'src', 'components', componentDir));
      } catch (error) {
        console.log(`Directory not found: src/components/${componentDir}`);
        continue;
      }
      
      // Get all TypeScript files in the component directory
      const componentFiles = globSync(`src/components/${componentDir}/*.tsx`, { cwd: rootDir })
        .map(file => path.basename(file));
      
      if (componentFiles.length === 0) {
        continue;
      }
      
      for (const componentFile of componentFiles) {
        const sourceFile = path.join(rootDir, 'src', 'components', componentDir, componentFile);
        const featureFile = path.join(rootDir, 'src', 'features', featureDir, 'components', componentFile);
        
        // Read the source file
        const content = await fs.readFile(sourceFile, 'utf8');
        
        // Check if it's a bridge component
        const isBridgeComponent = 
          content.includes(`from "@/features/${featureDir}/components/`) || 
          content.includes(`from '@/features/${featureDir}/components/`);
        
        if (!isBridgeComponent) {
          results.notBridged.push(`${componentDir}/${componentFile}`);
        }
        
        // Check if the feature component exists
        try {
          await fs.access(featureFile);
        } catch (error) {
          // Feature component doesn't exist
          results.missingInFeature.push(`${componentDir}/${componentFile} → features/${featureDir}/components/${componentFile}`);
        }
      }
    } catch (error) {
      console.error(`Error processing ${componentDir}:`, error);
    }
  }
  
  // Check UI components
  for (const uiDir of UI_DIRECTORIES) {
    try {
      const uiFiles = globSync(`src/components/${uiDir}/*.tsx`, { cwd: rootDir })
        .map(file => path.basename(file));
      
      for (const uiFile of uiFiles) {
        results.uiComponents.push(`${uiDir}/${uiFile}`);
      }
    } catch (error) {
      console.error(`Error processing UI directory ${uiDir}:`, error);
    }
  }
  
  // Report findings
  if (results.notBridged.length > 0) {
    console.log('\n⚠️ Components that are not properly bridged:');
    for (const component of results.notBridged) {
      console.log(`  - ${component}`);
    }
    console.log('\nThese components should be converted to bridge components pointing to their feature counterparts.');
  } else {
    console.log('✅ All feature components have been properly bridged.');
  }
  
  if (results.missingInFeature.length > 0) {
    console.log('\n⚠️ Components missing in feature directories:');
    for (const component of results.missingInFeature) {
      console.log(`  - ${component}`);
    }
    console.log('\nThese components need to be migrated to their feature directories.');
  } else {
    console.log('✅ All components have corresponding feature components.');
  }
  
  console.log(`\n📊 UI Components Count: ${results.uiComponents.length}`);
  
  // Check for direct imports of components from src/components (except UI)
  console.log('\n🔍 Checking for direct imports of components...');
  
  const importCount = await checkDirectImports();
  
  if (importCount > 0) {
    console.log(`\n⚠️ Found ${importCount} direct imports of components that should be updated to use feature components.`);
  } else {
    console.log('✅ No direct imports of components found that need to be updated.');
  }
  
  console.log('\n🏁 Audit Complete');
}

async function checkDirectImports() {
  // Get all TypeScript/JavaScript files
  const files = globSync('src/**/*.{ts,tsx,js,jsx}', { cwd: rootDir });
  
  let directImportCount = 0;
  
  for (const file of files) {
    // Skip files in the components directory and bridge components
    if (file.includes('src/components/')) {
      continue;
    }
    
    const filePath = path.join(rootDir, file);
    let content;
    
    try {
      content = await fs.readFile(filePath, 'utf8');
    } catch (error) {
      continue;
    }
    
    // Check for imports from component directories that should be from features
    for (const [componentDir, featureDir] of Object.entries(FEATURE_MAPPING)) {
      const importRegex = new RegExp(`from\\s+['"]@/components/${componentDir}/`, 'g');
      const matches = content.match(importRegex);
      
      if (matches) {
        directImportCount += matches.length;
        console.log(`  - ${file} imports from @/components/${componentDir}/`);
      }
    }
  }
  
  return directImportCount;
}

// Run the audit
auditComponentMigration().catch(error => {
  console.error('Error during audit:', error);
  process.exit(1);
}); 