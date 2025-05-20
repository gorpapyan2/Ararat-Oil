#!/usr/bin/env node

/**
 * Check Migration Issues
 * 
 * This script checks for potential issues in the migrated components,
 * such as inconsistent prop types between primitives and re-exports.
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

// Track issues
const issues = {
  missingTypes: [],
  missingExports: [],
  typeMismatches: [],
  circularDependencies: [],
  unusedPrimitives: [],
};

// Utility functions
function getComponentNameFromFile(filePath) {
  return path.basename(filePath, path.extname(filePath));
}

// Check for type exports in primitive and re-export
function checkTypeExports(primitiveFile, reExportFile) {
  const primitiveContent = fs.readFileSync(primitiveFile, 'utf8');
  const reExportContent = fs.readFileSync(reExportFile, 'utf8');
  
  // Find exported types in primitive file
  const typeExportMatches = primitiveContent.match(/export\s+(interface|type)\s+([A-Za-z0-9_]+)/g) || [];
  const exportedTypes = typeExportMatches.map(match => {
    const parts = match.split(/\s+/);
    return parts.length >= 3 ? parts[2] : null;
  }).filter(Boolean);
  
  // Check if they're re-exported
  exportedTypes.forEach(typeName => {
    if (!reExportContent.includes(`type ${typeName}`) && 
        !reExportContent.includes(`${typeName},`) && 
        !reExportContent.includes(`, ${typeName}`) && 
        !reExportContent.includes(`${typeName} }`) && 
        !reExportContent.includes(`${typeName}\n`)) {
      issues.missingTypes.push(`${path.basename(primitiveFile)} defines "${typeName}" but it's not re-exported in ${path.basename(reExportFile)}`);
    }
  });
}

// Check for circular dependencies
function checkCircularDependencies(reExportFile) {
  const content = fs.readFileSync(reExportFile, 'utf8');
  
  // If a reExport file imports from any other file in the ui directory
  const importLines = content.match(/^import.+from\s+["']@\/core\/components\/ui\/[^/]+["'];/gm) || [];
  
  if (importLines.length > 0) {
    importLines.forEach(line => {
      if (!line.includes('primitives')) {
        issues.circularDependencies.push(`${path.basename(reExportFile)} has potential circular dependency: ${line.trim()}`);
      }
    });
  }
}

// Main function to check for issues
async function checkMigrationIssues() {
  console.log('🔍 Checking for migration issues...\n');

  try {
    // 1. Get all primitive components
    const primitiveFiles = fs.readdirSync(PRIMITIVES_DIR)
      .filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'));
    
    console.log(`Scanning ${primitiveFiles.length} components...\n`);
    
    // 2. For each primitive, check for issues
    for (const primitiveFile of primitiveFiles) {
      const componentName = getComponentNameFromFile(primitiveFile);
      const kebabComponentName = componentName.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-/, '');
      
      // Expected re-export paths (PascalCase or kebab-case)
      const possibleReExportPaths = [
        path.join(UI_DIR, `${componentName}.tsx`),
        path.join(UI_DIR, `${kebabComponentName}.tsx`)
      ];
      
      // Skip certain utility files
      if (componentName.endsWith('-utils') || componentName === 'primitives') {
        continue;
      }
      
      // Find the re-export file
      const reExportPath = possibleReExportPaths.find(p => fs.existsSync(p));
      
      if (!reExportPath) {
        issues.missingExports.push(`No re-export file found for ${componentName}`);
        continue;
      }
      
      // Check issues
      const primitivePath = path.join(PRIMITIVES_DIR, primitiveFile);
      checkTypeExports(primitivePath, reExportPath);
      checkCircularDependencies(reExportPath);
    }
    
    // Check for re-export files that point to non-existent primitives
    const uiFiles = fs.readdirSync(UI_DIR)
      .filter(file => (file.endsWith('.tsx') || file.endsWith('.jsx')) && !file.includes('composed'));
    
    for (const uiFile of uiFiles) {
      const content = fs.readFileSync(path.join(UI_DIR, uiFile), 'utf8');
      const importMatches = content.match(/from\s+["']@\/core\/components\/ui\/primitives\/([^'"]+)["']/g) || [];
      
      importMatches.forEach(match => {
        const importPath = match.match(/primitives\/([^'"]+)/)[1];
        const possiblePaths = [
          path.join(PRIMITIVES_DIR, `${importPath}.tsx`),
          path.join(PRIMITIVES_DIR, `${importPath}.jsx`)
        ];
        
        if (!possiblePaths.some(p => fs.existsSync(p))) {
          issues.unusedPrimitives.push(`${uiFile} imports from non-existent primitive: ${importPath}`);
        }
      });
    }
    
    // Output results
    console.log('📊 Results:');
    
    if (issues.missingTypes.length > 0) {
      console.log('\n⚠️ Missing Type Exports:');
      issues.missingTypes.forEach(issue => console.log(`  - ${issue}`));
    }
    
    if (issues.missingExports.length > 0) {
      console.log('\n⚠️ Missing Re-exports:');
      issues.missingExports.forEach(issue => console.log(`  - ${issue}`));
    }
    
    if (issues.circularDependencies.length > 0) {
      console.log('\n⚠️ Potential Circular Dependencies:');
      issues.circularDependencies.forEach(issue => console.log(`  - ${issue}`));
    }
    
    if (issues.unusedPrimitives.length > 0) {
      console.log('\n⚠️ References to Non-existent Primitives:');
      issues.unusedPrimitives.forEach(issue => console.log(`  - ${issue}`));
    }
    
    if (Object.values(issues).every(arr => arr.length === 0)) {
      console.log('\n✅ No issues found! All components appear to be properly migrated.');
    } else {
      console.log(`\n⚠️ Found ${Object.values(issues).reduce((acc, arr) => acc + arr.length, 0)} issues to fix.`);
    }
    
  } catch (error) {
    console.error('Error checking migration issues:', error);
    process.exit(1);
  }
}

// Run the checker
checkMigrationIssues(); 