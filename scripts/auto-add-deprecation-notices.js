#!/usr/bin/env node

/**
 * This script automatically adds deprecation notices to components that have been migrated to the feature-based architecture.
 * It runs with option 1 (add deprecation notices) without requiring user input.
 * 
 * Usage:
 * node scripts/auto-add-deprecation-notices.js
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

  // Add deprecation notice to a component file
  function addDeprecationNotice(component) {
    try {
      const filePath = path.join(ROOT_DIR, component.path);
      console.log(`Processing file: ${filePath}`);
      
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return false;
      }
      
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Check if the deprecation notice is already there
      if (content.includes('@deprecated')) {
        console.log(`Deprecation notice already exists in ${filePath}`);
        return false;
      }
      
      // Create the file-level JSDoc
      const fileJSDoc = `/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('${component.replacement}')}
 * 
 * Deprecation Date: ${component.deprecatedOn}
 * Planned Removal Date: ${component.removalDate}
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
`;
      
      // Determine if this is a TypeScript file
      const isTypeScript = filePath.endsWith('.tsx') || filePath.endsWith('.ts');
      
      // Insert the deprecation notice at the top of the file
      if (isTypeScript) {
        // Add the import for useEffect if not already there
        const hasUseEffectImport = content.includes('import { useEffect }') || 
                                  content.includes('import React, { useEffect }') ||
                                  content.includes('import React from "react"');
                                  
        if (!hasUseEffectImport) {
          // Add useEffect import to existing React import or add new import
          if (content.includes('import React')) {
            content = content.replace(
              /import React(.*) from ['"]react['"];/,
              (match, imports) => {
                if (imports.includes('useEffect')) {
                  return match;
                }
                if (imports === '') {
                  return `import React, { useEffect } from 'react';`;
                }
                return `import React,${imports}, useEffect } from 'react';`;
              }
            );
          } else {
            // Add new import at top of file
            content = `import { useEffect } from 'react';\n${content}`;
          }
        }
        
        // Find the component definition
        const componentRegex = new RegExp(`export (function|const) ${component.name}\\s*(?:\\(|=\\s*\\(|:\\s*React\\.FC)`);
        const componentMatch = content.match(componentRegex);
        
        if (!componentMatch) {
          console.warn(`Could not find component definition for ${component.name} in ${filePath}`);
          return false;
        }
        
        // Add the file-level JSDoc at the top of the file
        content = fileJSDoc + content;
        
        // Add the component-level JSDoc before the component definition
        const componentJSDoc = `
/**
 * @deprecated This component is deprecated. Use ${component.name} from ${component.replacement.split('/').slice(0, -1).join('/')} instead.
 * See the feature components for the replacement.
 */
`;
        
        content = content.replace(
          componentRegex,
          match => `${componentJSDoc}${match}`
        );
        
        // Add the useEffect hook for the warning message
        const bodyOpeningBraceIndex = content.indexOf('{', componentMatch.index);
        if (bodyOpeningBraceIndex === -1) {
          console.warn(`Could not find component body for ${component.name} in ${filePath}`);
          return false;
        }
        
        const deprecationWarning = `
  // Issue a deprecation warning
  useEffect(() => {
    console.warn(
      '[Deprecation Warning] ${component.name} in ${component.path} is deprecated. ' +
      'Use ${component.name} from ${component.replacement} instead. ' +
      'This component will be removed on ${component.removalDate}.'
    );
  }, []);
`;
        
        // Insert the deprecation warning after the opening brace
        content = content.slice(0, bodyOpeningBraceIndex + 1) +
                deprecationWarning +
                content.slice(bodyOpeningBraceIndex + 1);
      }
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Added deprecation notice to ${filePath}`);
      return true;
    } catch (err) {
      console.error(`Error processing component ${component.name}:`, err);
      return false;
    }
  }

  // Run with option 1 - add deprecation notices
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
          const result = addDeprecationNotice(component);
          if (result) {
            console.log(`✅ Added deprecation notice to ${component.name}`);
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
      
      console.log(`\nDeprecation Notice Summary:`);
      console.log(`✅ Successfully added notices: ${successCount}`);
      console.log(`⚠️ Skipped components: ${skipCount}`);
      console.log(`❌ Failed components: ${failCount}`);
      
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