#!/usr/bin/env node

/**
 * This script converts components with deprecation notices into bridge components
 * that re-export their feature counterparts.
 * 
 * Usage:
 * node scripts/create-bridge-components.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file and directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root directory of the project
const ROOT_DIR = path.resolve(__dirname, '..');

// Path to the deprecation schedule
const SCHEDULE_PATH = path.join(ROOT_DIR, 'docs/refactoring/component-deprecation-schedule.md');

try {
  console.log('Reading schedule file from:', SCHEDULE_PATH);

  // Read the deprecation schedule
  const scheduleContent = fs.readFileSync(SCHEDULE_PATH, 'utf8');
  console.log('Schedule file read successfully, length:', scheduleContent.length);

  // Extract components from the schedule table
  function extractComponents() {
    try {
      const components = [];
      const lines = scheduleContent.split('\n');
      console.log(`Found ${lines.length} lines in the schedule file`);
      
      // Find the table start
      const tableStartIndex = lines.findIndex(line => line.includes('| Component | Path |'));
      console.log('Table starts at line:', tableStartIndex);
      
      if (tableStartIndex === -1) {
        console.error('Could not find component table in the deprecation schedule');
        process.exit(1);
      }
      
      // Skip the header and separator rows
      let i = tableStartIndex + 2;
      
      // Process each table row
      while (i < lines.length && lines[i].startsWith('|')) {
        const parts = lines[i].split('|').map(part => part.trim());
        
        if (parts.length >= 6) {
          components.push({
            name: parts[1],
            path: parts[2],
            deprecatedOn: parts[3],
            removalDate: parts[4],
            replacement: parts[5],
          });
        }
        
        i++;
      }
      
      console.log(`Extracted ${components.length} components from the table`);
      return components;
    } catch (err) {
      console.error('Error extracting components:', err);
      process.exit(1);
    }
  }

  // Convert a component to a bridge component
  function createBridgeComponent(component) {
    try {
      const filePath = path.join(ROOT_DIR, component.path);
      console.log(`Processing file: ${filePath}`);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return false;
      }
      
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Check if it's already a bridge component
      if (content.includes('return <Feature') || content.includes('Feature' + component.name)) {
        console.log(`Already a bridge component: ${filePath}`);
        return false;
      }
      
      // Check if the component is using named or default export
      const isDefaultExport = content.includes(`export default function ${component.name}`) || 
                             content.includes(`export default class ${component.name}`);
      
      // Import the feature component path from replacement
      const featureImport = component.replacement;
      const componentParts = featureImport.split('/');
      const featureName = componentParts[componentParts.length - 1];
      
      // Create the bridge component content
      const bridgeContent = `/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('${component.replacement}')}
 * 
 * Deprecation Date: ${component.deprecatedOn}
 * Planned Removal Date: ${component.removalDate}
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { ${featureName} as Feature${component.name} } from "${component.replacement}";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('${component.replacement}')}
 */
${isDefaultExport ? 'export default' : 'export'} function ${component.name}(props) {
  // Issue a deprecation warning
  useEffect(() => {
    console.warn(
      '[Deprecation Warning] ${component.name} in ${component.path} is deprecated. ' +
      'Use ${featureName} from ${component.replacement} instead. ' +
      'This component will be removed on ${component.removalDate}.'
    );
  }, []);
  
  // Re-export the feature component
  return <Feature${component.name} {...props} />;
}
`;
      
      // Backup the original file
      const backupPath = `${filePath}.backup`;
      fs.writeFileSync(backupPath, content, 'utf8');
      console.log(`Backed up original file to: ${backupPath}`);
      
      // Write the bridge component to the file
      fs.writeFileSync(filePath, bridgeContent, 'utf8');
      console.log(`Created bridge component in ${filePath}`);
      return true;
    } catch (err) {
      console.error(`Error processing component ${component.name}:`, err);
      return false;
    }
  }

  // Run the script
  async function main() {
    try {
      const components = extractComponents();
      console.log(`Found ${components.length} components to process.`);
      
      // Process all components
      let successCount = 0;
      let skipCount = 0;
      let failCount = 0;
      
      for (const component of components) {
        try {
          const result = createBridgeComponent(component);
          if (result) {
            console.log(`✅ Converted ${component.name} to bridge component`);
            successCount++;
          } else {
            console.log(`⚠️ Skipped ${component.name}`);
            skipCount++;
          }
        } catch (error) {
          console.error(`❌ Error processing ${component.name}:`, error);
          failCount++;
        }
      }
      
      console.log(`\nBridge Component Conversion Summary:`);
      console.log(`✅ Successfully converted: ${successCount}`);
      console.log(`⚠️ Skipped components: ${skipCount}`);
      console.log(`❌ Failed conversions: ${failCount}`);
      
    } catch (err) {
      console.error('Error in main function:', err);
      process.exit(1);
    }
  }

  main().catch(err => {
    console.error('Unhandled error in main:', err);
    process.exit(1);
  });
} catch (err) {
  console.error('Error loading script:', err);
  process.exit(1);
} 