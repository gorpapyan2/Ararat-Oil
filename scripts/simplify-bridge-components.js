#!/usr/bin/env node

/**
 * This script simplifies bridge components by removing props forwarding
 * and just rendering the feature component directly.
 * 
 * Usage:
 * node scripts/simplify-bridge-components.js
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
  try {
    const files = await new Promise((resolve, reject) => {
      glob('src/components/**/*.{tsx,ts}', { cwd: ROOT_DIR }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    
    console.log(`Found ${files.length} total component files`);
    
    // Filter to find only bridge components
    const bridgeComponentFiles = [];
    for (const file of files) {
      try {
        console.log(`Reading file: ${file}`);
        const fullPath = path.join(ROOT_DIR, file);
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        const hasDeprecationComment = content.includes('@deprecated');
        console.log(`  Has @deprecated: ${hasDeprecationComment}`);
        
        const hasBridgePattern = content.includes('return <Feature') || 
                                content.includes('as Feature');
        console.log(`  Has bridge pattern: ${hasBridgePattern}`);
        
        if (hasDeprecationComment && hasBridgePattern) {
          console.log(`  ✅ Bridge component found: ${file}`);
          bridgeComponentFiles.push(file);
        }
      } catch (e) {
        console.error(`Error reading file ${file}:`, e);
      }
    }
    
    console.log(`Identified ${bridgeComponentFiles.length} bridge components`);
    return bridgeComponentFiles;
  } catch (error) {
    console.error('Error finding bridge components:', error);
    throw error;
  }
}

// Simplify a bridge component
function simplifyBridgeComponent(filePath) {
  const fullPath = path.join(ROOT_DIR, filePath);
  console.log(`Processing: ${fullPath}`);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf-8');
    
    // Check if the component was already simplified (no props or {...props})
    if (!content.includes('props') || !content.includes('{...props}')) {
      console.log(`Component ${filePath} already simplified`);
      return false;
    }
    
    // Add import for React if not already there
    if (!content.includes('import React')) {
      content = content.replace(
        /import\s*{/,
        'import React, {'
      );
    }
    
    // Remove props parameter from function definition
    content = content.replace(
      /function\s+(\w+)\s*\(props\s*:.*?\)\s*{/,
      'function $1() {'
    );
    
    // For default exports
    content = content.replace(
      /export default function\s+(\w+)\s*\(props\s*:.*?\)\s*{/,
      'export default function $1() {'
    );
    
    // Remove {...props} from return statement
    content = content.replace(
      /<Feature\w+\s*{\.\.\.props\s*}.*?>/g,
      '<Feature$&'.replace(/{\.\.\.props\s*}/, '').replace('Feature<', '<')
    );
    
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Simplified ${filePath}`);
    return true;
  } catch (err) {
    console.error(`Error simplifying ${filePath}:`, err);
    return false;
  }
}

// Main function
async function main() {
  try {
    console.log('Finding bridge components...');
    const componentFiles = await findBridgeComponents();
    console.log(`Found ${componentFiles.length} bridge components to process.`);
    
    let simplifiedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    for (const file of componentFiles) {
      try {
        const result = simplifyBridgeComponent(file);
        if (result) {
          simplifiedCount++;
        } else {
          skippedCount++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error);
        errorCount++;
      }
    }
    
    console.log('\nBridge Component Simplification Summary:');
    console.log(`✅ Successfully simplified: ${simplifiedCount}`);
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