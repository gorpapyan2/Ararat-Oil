#!/usr/bin/env node

/**
 * Verify Component Migrations
 * 
 * This script checks all UI components to verify they properly follow the migration pattern:
 * 1. Implementation in primitives directory
 * 2. Re-export file in ui directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CORE_COMPONENTS_DIR = path.resolve(__dirname, '../src/core/components');
const UI_DIR = path.join(CORE_COMPONENTS_DIR, 'ui');
const PRIMITIVES_DIR = path.join(UI_DIR, 'primitives');

// Track statistics
const stats = {
  primitiveComponentsFound: 0,
  reExportFilesFound: 0,
  missingReExports: [],
  incorrectReExports: [],
  validMigrations: [],
};

// Utility functions
function getComponentNameFromFile(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

function logResult(message, items = []) {
  console.log(message);
  if (items.length > 0) {
    items.forEach(item => console.log(`  - ${item}`));
  }
  console.log('');
}

// Main verification function
async function verifyComponentMigrations() {
  console.log('🔍 Verifying component migrations...\n');

  try {
    // 1. Get all primitive components
    const primitiveFiles = fs.readdirSync(PRIMITIVES_DIR)
      .filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'));
    
    stats.primitiveComponentsFound = primitiveFiles.length;
    
    // 2. For each primitive, check for re-export file
    primitiveFiles.forEach(primitiveFile => {
      const componentName = getComponentNameFromFile(primitiveFile);
      const expectedReExportPath = path.join(UI_DIR, `${componentName}.tsx`);
      const kebabExpectedReExportPath = path.join(UI_DIR, 
        componentName.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-/, '') + '.tsx');
      
      // Skip checking re-exports for utility components that aren't meant to be directly imported
      if (componentName.endsWith('-utils') || componentName === 'primitives') {
        return;
      }
      
      // Check if re-export file exists (either in Pascal or kebab case)
      if (fs.existsSync(expectedReExportPath) || fs.existsSync(kebabExpectedReExportPath)) {
        const reExportPath = fs.existsSync(expectedReExportPath) ? expectedReExportPath : kebabExpectedReExportPath;
        stats.reExportFilesFound++;
        
        // Verify re-export content
        const content = fs.readFileSync(reExportPath, 'utf8');
        
        // Check for typical re-export pattern
        if (content.includes(`from "@/core/components/ui/primitives/${componentName}"`) || 
            content.includes(`from "@/core/components/ui/primitives/${componentName.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-/, '')}"`) ||
            // Handle special cases where export might be differently named
            content.includes('@/core/components/ui/primitives/')) {
          stats.validMigrations.push(componentName);
        } else {
          stats.incorrectReExports.push(`${componentName} (${path.basename(reExportPath)}) - Missing proper import from primitives`);
        }
      } else {
        stats.missingReExports.push(componentName);
      }
    });
    
    // 3. Output results
    logResult(`✅ Found ${stats.primitiveComponentsFound} primitive components`);
    logResult(`✅ Found ${stats.reExportFilesFound} re-export files`);
    
    if (stats.validMigrations.length > 0) {
      logResult(`✅ ${stats.validMigrations.length} components are properly migrated:`, stats.validMigrations);
    }
    
    if (stats.missingReExports.length > 0) {
      logResult(`❌ ${stats.missingReExports.length} components are missing re-export files:`, stats.missingReExports);
    }
    
    if (stats.incorrectReExports.length > 0) {
      logResult(`⚠️ ${stats.incorrectReExports.length} components have incorrect re-export files:`, stats.incorrectReExports);
    }
    
    // 4. Final summary
    console.log('📊 Final Score:');
    const score = Math.round((stats.validMigrations.length / stats.primitiveComponentsFound) * 100);
    console.log(`${score}% of components are properly migrated (${stats.validMigrations.length}/${stats.primitiveComponentsFound})`);
    
    const exitCode = stats.missingReExports.length === 0 && stats.incorrectReExports.length === 0 ? 0 : 1;
    process.exit(exitCode);
    
  } catch (error) {
    console.error('Error verifying component migrations:', error);
    process.exit(1);
  }
}

// Run the verification
verifyComponentMigrations(); 