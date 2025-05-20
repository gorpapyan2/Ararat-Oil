#!/usr/bin/env node

/**
 * This script creates bridge components for migrated feature components.
 * It converts the original components in src/components to bridge components
 * that re-export the feature components with deprecation notices.
 * 
 * Usage: node scripts/create-feature-bridge-components.js
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

async function createBridgeComponent(componentDir, componentFile, featureDir) {
  const sourceFile = path.join(rootDir, 'src', 'components', componentDir, componentFile);
  const featureComponent = path.join('@/features', featureDir, 'components', componentFile);
  
  try {
    // Check if the file exists
    try {
      await fs.access(sourceFile);
    } catch (error) {
      return {
        status: 'error',
        message: `Source file ${sourceFile} does not exist.`
      };
    }
    
    // Read the content of the source file to check if it's already a bridge
    const content = await fs.readFile(sourceFile, 'utf8');
    
    // Check if the file is already a bridge component
    if (content.includes(`from "@/features/${featureDir}/components/`) || 
        content.includes(`from '@/features/${featureDir}/components/`)) {
      return {
        status: 'skip',
        message: `Component ${componentFile} is already a bridge component.`
      };
    }
    
    // Extract component name (remove file extension)
    const componentName = path.basename(componentFile, '.tsx');
    
    // Create a backup of the original file
    const backupFile = `${sourceFile}.original`;
    await fs.copyFile(sourceFile, backupFile);
    
    // Import feature component without extension
    const featureImportPath = `@/features/${featureDir}/components/${componentName}`;
    
    // Create bridge component content
    const bridgeContent = `/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('${featureImportPath}')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { ${componentName} as Feature${componentName} } from "${featureImportPath}";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('${featureImportPath}')}
 */
export default function ${componentName}() {
  // Issue a deprecation warning
  useEffect(() => {
    console.warn(
      '[Deprecation Warning] ${componentName} in src/components/${componentDir}/${componentFile} is deprecated. ' +
      'Use ${componentName} from ${featureImportPath} instead. ' +
      'This component will be removed on 2023-12-22.'
    );
  }, []);
  
  // Re-export the feature component
  return <Feature${componentName} />;
}
`;
    
    // Write the bridge component
    await fs.writeFile(sourceFile, bridgeContent, 'utf8');
    
    return {
      status: 'success',
      message: `Created bridge component for ${componentFile} pointing to ${featureImportPath}`
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Error creating bridge component for ${componentFile}: ${error.message}`
    };
  }
}

async function createBridgeComponents() {
  console.log('Creating bridge components for migrated feature components...');
  
  // Find all component directories
  const componentDirs = Object.keys(FEATURE_MAPPING);
  
  // Track results
  const results = {
    success: [],
    skipped: [],
    error: []
  };
  
  for (const componentDir of componentDirs) {
    const featureDir = FEATURE_MAPPING[componentDir];
    
    // Check if the component directory exists
    try {
      await fs.access(path.join(rootDir, 'src', 'components', componentDir));
    } catch (error) {
      console.log(`Skipping ${componentDir} - directory does not exist`);
      continue;
    }
    
    // Get all TypeScript files in the component directory
    const componentFiles = globSync(`src/components/${componentDir}/*.tsx`, { cwd: rootDir })
      .map(file => path.basename(file));
    
    if (componentFiles.length === 0) {
      console.log(`No components found in ${componentDir}`);
      continue;
    }
    
    console.log(`\nFound ${componentFiles.length} components in ${componentDir} to convert to bridge components`);
    
    // Create bridge component for each file
    for (const componentFile of componentFiles) {
      console.log(`Creating bridge component for ${componentFile}...`);
      
      const result = await createBridgeComponent(componentDir, componentFile, featureDir);
      
      if (result.status === 'success') {
        results.success.push(result.message);
        console.log(`✅ ${result.message}`);
      } else if (result.status === 'skip') {
        results.skipped.push(result.message);
        console.log(`⚠️ ${result.message}`);
      } else {
        results.error.push(result.message);
        console.log(`❌ ${result.message}`);
      }
    }
  }
  
  // Summary
  console.log('\n📊 Bridge Component Creation Summary:');
  console.log(`✅ Successfully created: ${results.success.length} bridge components`);
  console.log(`⚠️ Skipped: ${results.skipped.length} components (already bridges)`);
  console.log(`❌ Errors: ${results.error.length}`);
  
  if (results.success.length > 0) {
    console.log('\n✅ Successfully created bridge components:');
    results.success.forEach(msg => console.log(`  - ${msg}`));
  }
  
  if (results.skipped.length > 0) {
    console.log('\n⚠️ Skipped components:');
    results.skipped.forEach(msg => console.log(`  - ${msg}`));
  }
  
  if (results.error.length > 0) {
    console.log('\n❌ Errors:');
    results.error.forEach(msg => console.log(`  - ${msg}`));
  }
}

// Run the script
createBridgeComponents().catch(error => {
  console.error('Error creating bridge components:', error);
  process.exit(1);
}); 