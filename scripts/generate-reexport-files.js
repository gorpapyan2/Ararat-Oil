#!/usr/bin/env node

/**
 * Generate Re-export Files
 * 
 * This script generates re-export files for components in the primitives directory
 * that don't already have them, helping complete the component migration.
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
  primitiveComponentsScanned: 0,
  reExportFilesCreated: 0,
  reExportFilesUpdated: 0,
  skipped: 0,
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

// Generate re-export file content based on component exports
function generateReExportContent(componentName, originalPath) {
  // Read the original file to parse exports
  const content = fs.readFileSync(originalPath, 'utf8');
  
  // Look for export patterns
  const exportMatches = content.match(/export\s+(const|function|interface|type|class|enum)\s+([A-Za-z0-9_]+)/g) || [];
  const namedExportMatches = content.match(/export\s+{([^}]+)}/g) || [];
  
  // Gather exported names
  let exportedNames = [];
  
  // Process regular exports (const, function, interface, etc.)
  exportMatches.forEach(match => {
    const parts = match.split(/\s+/);
    if (parts.length >= 3) {
      exportedNames.push(parts[2]);
    }
  });
  
  // Process named exports
  namedExportMatches.forEach(match => {
    const content = match.replace(/export\s+{/, '').replace(/}/, '');
    const names = content.split(',').map(name => name.trim());
    exportedNames = [...exportedNames, ...names];
  });
  
  // Create import path
  const kebabComponentName = componentName.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-/, '');
  const importPath = `@/core/components/ui/primitives/${kebabComponentName}`;
  
  // Create unique list of exports
  const uniqueExports = [...new Set(exportedNames)].filter(Boolean);
  
  // Handle case where no exports are found (fallback to component name)
  if (uniqueExports.length === 0) {
    uniqueExports.push(componentName);
  }
  
  // Generate re-export content
  return `/**
 * This file re-exports ${componentName} components from the primitives directory.
 * This helps maintain backward compatibility with existing imports.
 */

export { 
  ${uniqueExports.join(',\n  ')} 
} from "${importPath}";
`;
}

// Main function to generate re-export files
async function generateReExportFiles() {
  console.log('🔍 Generating re-export files...\n');

  try {
    // 1. Get all primitive components
    const primitiveFiles = fs.readdirSync(PRIMITIVES_DIR)
      .filter(file => file.endsWith('.tsx') || file.endsWith('.jsx'));
    
    stats.primitiveComponentsScanned = primitiveFiles.length;
    
    // 2. For each primitive, check for existing re-export file and create if needed
    for (const primitiveFile of primitiveFiles) {
      const componentName = getComponentNameFromFile(primitiveFile);
      const kebabComponentName = componentName.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-/, '');
      
      // Use same casing as the primitive file
      const firstLetterIsUpperCase = /^[A-Z]/.test(componentName);
      
      // Expected re-export paths (PascalCase or kebab-case)
      const possibleReExportPaths = [
        path.join(UI_DIR, `${componentName}.tsx`),
        path.join(UI_DIR, `${kebabComponentName}.tsx`)
      ];
      
      // Path to use for re-export (prefer same casing as original)
      const reExportPath = firstLetterIsUpperCase 
        ? possibleReExportPaths[0] 
        : possibleReExportPaths[1];
      
      // Skip certain utility files
      if (componentName.endsWith('-utils') || componentName === 'primitives') {
        stats.skipped++;
        continue;
      }
      
      const originalPath = path.join(PRIMITIVES_DIR, primitiveFile);
      const reExportContent = generateReExportContent(componentName, originalPath);
      
      // Check if any of the possible paths exist
      const existingPath = possibleReExportPaths.find(p => fs.existsSync(p));
      
      if (existingPath) {
        // Read existing file
        const existingContent = fs.readFileSync(existingPath, 'utf8');
        
        // Check if it's already a proper re-export
        if (existingContent.includes(`from "@/core/components/ui/primitives/${componentName}"`) ||
            existingContent.includes(`from "@/core/components/ui/primitives/${kebabComponentName}"`)) {
          console.log(`✅ Re-export already exists for ${componentName}`);
          continue;
        }
        
        // Update existing file with proper re-export
        fs.writeFileSync(existingPath, reExportContent);
        console.log(`🔄 Updated re-export for ${componentName} at ${path.relative(process.cwd(), existingPath)}`);
        stats.reExportFilesUpdated++;
      } else {
        // Create new re-export file
        fs.writeFileSync(reExportPath, reExportContent);
        console.log(`✨ Created re-export for ${componentName} at ${path.relative(process.cwd(), reExportPath)}`);
        stats.reExportFilesCreated++;
      }
    }
    
    // 3. Output results
    console.log('\n📊 Results:');
    console.log(`Total components scanned: ${stats.primitiveComponentsScanned}`);
    console.log(`Re-export files created: ${stats.reExportFilesCreated}`);
    console.log(`Re-export files updated: ${stats.reExportFilesUpdated}`);
    console.log(`Components skipped: ${stats.skipped}`);
    console.log(`\n✅ Done!`);
    
  } catch (error) {
    console.error('Error generating re-export files:', error);
    process.exit(1);
  }
}

// Run the generator
generateReExportFiles(); 