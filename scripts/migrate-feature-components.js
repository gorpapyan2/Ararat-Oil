#!/usr/bin/env node

/**
 * This script helps migrate feature-specific components from src/components directory 
 * to their appropriate feature directories in src/features
 * 
 * Usage: node scripts/migrate-feature-components.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';
import readline from 'readline';

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
  'todo': 'todo' // This might need a new feature directory
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function ensureFeatureDirectoryExists(featureDir) {
  const componentsDir = path.join(featureDir, 'components');
  try {
    await fs.mkdir(componentsDir, { recursive: true });
    return true;
  } catch (error) {
    console.error(`Error creating directory ${componentsDir}:`, error);
    return false;
  }
}

async function migrateComponent(componentDir, componentFile, featureDir) {
  const sourceFile = path.join(rootDir, 'src', 'components', componentDir, componentFile);
  const destinationDir = path.join(rootDir, 'src', 'features', featureDir, 'components');
  const destinationFile = path.join(destinationDir, componentFile);
  
  try {
    // Ensure the destination directory exists
    await fs.mkdir(destinationDir, { recursive: true });
    
    // Read the content of the source file
    const content = await fs.readFile(sourceFile, 'utf8');
    
    // Check if the file is already a bridge component (pointing to the feature component)
    if (content.includes(`from "@/features/${featureDir}/components/`) || 
        content.includes(`from '@/features/${featureDir}/components/`)) {
      return {
        status: 'skip',
        message: `Component ${componentFile} is already a bridge component pointing to the feature component.`
      };
    }
    
    // Copy the file to the destination
    await fs.copyFile(sourceFile, destinationFile);
    
    // Create a backup of the original component
    const backupFile = `${sourceFile}.backup`;
    await fs.copyFile(sourceFile, backupFile);
    
    return {
      status: 'success',
      message: `Migrated ${componentFile} to ${destinationFile} (Backup created at ${backupFile})`
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Error migrating ${componentFile}: ${error.message}`
    };
  }
}

async function migrateFeatureComponents() {
  console.log('Analyzing components to migrate...');
  
  // Find all component directories
  const componentDirs = (await fs.readdir(path.join(rootDir, 'src', 'components')))
    .filter(dir => !['ui', 'unified', 'dialogs', 'sidebar', 'enhanced', 'shared', 'dev'].includes(dir));
  
  // Track migration results
  const results = {
    success: [],
    skipped: [],
    error: []
  };
  
  for (const componentDir of componentDirs) {
    const featureDir = FEATURE_MAPPING[componentDir];
    
    if (!featureDir) {
      console.log(`⚠️ No feature mapping found for directory: ${componentDir}`);
      const answer = await prompt(`Enter feature directory for ${componentDir} (or 'skip' to ignore): `);
      
      if (answer.toLowerCase() === 'skip') {
        console.log(`Skipping ${componentDir}`);
        continue;
      }
      
      if (answer) {
        FEATURE_MAPPING[componentDir] = answer;
      } else {
        console.log(`Skipping ${componentDir}`);
        continue;
      }
    }
    
    // Get all TypeScript files in the component directory
    const componentFiles = globSync(`src/components/${componentDir}/*.tsx`, { cwd: rootDir })
      .map(file => path.basename(file));
    
    console.log(`\nFound ${componentFiles.length} components in ${componentDir} to migrate to ${FEATURE_MAPPING[componentDir]}`);
    
    // Ensure the feature directory exists
    if (!(await ensureFeatureDirectoryExists(path.join(rootDir, 'src', 'features', FEATURE_MAPPING[componentDir])))) {
      results.error.push(`Failed to create feature directory for ${FEATURE_MAPPING[componentDir]}`);
      continue;
    }
    
    // Migrate each component
    for (const componentFile of componentFiles) {
      console.log(`Migrating ${componentFile} to features/${FEATURE_MAPPING[componentDir]}/components/...`);
      
      const result = await migrateComponent(componentDir, componentFile, FEATURE_MAPPING[componentDir]);
      
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
  console.log('\n📊 Migration Summary:');
  console.log(`✅ Successfully migrated: ${results.success.length} components`);
  console.log(`⚠️ Skipped: ${results.skipped.length} components`);
  console.log(`❌ Errors: ${results.error.length}`);
  
  if (results.success.length > 0) {
    console.log('\n✅ Successfully migrated components:');
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
  
  console.log('\n⚠️ Note: This script only copies components to their feature directories.');
  console.log('You should update imports in your codebase and consider creating bridge components');
  console.log('for backward compatibility before removing the original components.');
}

// Main function
async function main() {
  try {
    await migrateFeatureComponents();
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    rl.close();
  }
}

main(); 