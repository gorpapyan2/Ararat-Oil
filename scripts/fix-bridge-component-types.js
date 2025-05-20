#!/usr/bin/env node

/**
 * This script fixes type issues in bridge components by adding proper typing to props.
 * It replaces 'any' type with React.ComponentProps<typeof Feature{Component}>.
 * 
 * Usage:
 * node scripts/fix-bridge-component-types.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as globModule from 'glob';
const { glob } = globModule;

// Get current file and directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root directory of the project
const ROOT_DIR = path.resolve(__dirname, '..');

// Find all bridge components
async function findBridgeComponents() {
  return new Promise((resolve, reject) => {
    glob('src/components/**/*.{tsx,ts}', { cwd: ROOT_DIR }, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      
      console.log(`Found ${files.length} total component files`);
      
      // Filter to find only bridge components
      const bridgeComponentFiles = [];
      for (const file of files) {
        try {
          const content = fs.readFileSync(path.join(ROOT_DIR, file), 'utf-8');
          const isDeprecated = content.includes('@deprecated');
          const hasBridgePattern = content.includes('return <Feature') || content.includes('as Feature');
          
          if (isDeprecated && hasBridgePattern) {
            console.log(`Bridge component found: ${file}`);
            bridgeComponentFiles.push(file);
          }
        } catch (e) {
          console.error(`Error reading file ${file}:`, e);
        }
      }
      
      console.log(`Identified ${bridgeComponentFiles.length} bridge components`);
      resolve(bridgeComponentFiles);
    });
  });
}

// Fix the type issues in a bridge component
function fixComponentTypes(filePath) {
  const fullPath = path.join(ROOT_DIR, filePath);
  console.log(`Processing: ${fullPath}`);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf-8');
    
    // Check if the file already has proper typing
    if (content.includes('ComponentProps<typeof Feature')) {
      console.log(`Component ${filePath} already has proper typing`);
      return false;
    }
    
    // Replace 'props: any' with proper typing
    content = content.replace(
      /(props\s*:\s*)any(\s*\))/,
      '$1React.ComponentProps<typeof Feature$3'
    );
    
    // If the component uses default export, handle that pattern
    content = content.replace(
      /(export default function \w+\()props\s*:\s*any(\s*\))/,
      '$1props: React.ComponentProps<typeof Feature$2'
    );
    
    // Add import for React if it's not already there
    if (!content.includes('import React')) {
      content = content.replace(
        /import\s*{/,
        'import React, {'
      );
    }
    
    // Extract the component name from the file content
    const componentNameMatch = content.match(/function\s+(\w+)/);
    if (!componentNameMatch) {
      console.warn(`Could not extract component name from ${filePath}`);
      return false;
    }
    
    const componentName = componentNameMatch[1];
    
    // Replace any remaining bad props typing with specific component props
    content = content.replace(
      new RegExp(`props\\s*:\\s*any\\s*\\)`, 'g'),
      `props: React.ComponentProps<typeof Feature${componentName}>)`
    );
    
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Fixed types in ${filePath}`);
    return true;
  } catch (err) {
    console.error(`Error fixing types in ${filePath}:`, err);
    return false;
  }
}

// Main function
async function main() {
  try {
    console.log('Finding bridge components...');
    const componentFiles = await findBridgeComponents();
    console.log(`Found ${componentFiles.length} bridge components to process.`);
    
    let fixedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const file of componentFiles) {
      try {
        const result = fixComponentTypes(file);
        if (result) {
          fixedCount++;
        } else {
          skippedCount++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error);
        errorCount++;
      }
    }
    
    console.log('\nType Fixing Summary:');
    console.log(`✅ Fixed type issues: ${fixedCount}`);
    console.log(`⚠️ Skipped components: ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    
  } catch (err) {
    console.error('Error in main function:', err);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
}); 