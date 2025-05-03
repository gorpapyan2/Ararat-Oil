/**
 * Component Audit Script
 * 
 * This script analyzes the codebase to identify:
 * 1. Component usage
 * 2. Duplicated components
 * 3. Unused components
 * 4. Inconsistent naming patterns
 * 
 * Run with Node.js: node component-audit-script.js
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

// Promisify fs methods
const readdir = util.promisify(fs.readdir);
const stat = util.promisify(fs.stat);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Configuration
const SRC_DIR = path.resolve(__dirname, 'src');
const UI_DIRS = [
  path.resolve(SRC_DIR, 'components/ui'),
  path.resolve(SRC_DIR, 'components/ui-custom')
];
const COMPONENT_DIRS = [
  path.resolve(SRC_DIR, 'components')
];
const OUTPUT_FILE = path.resolve(__dirname, 'component-audit-results.md');

// Track components
const components = new Map();
const componentUsage = new Map();
const potentialDuplicates = new Set();
const namingInconsistencies = [];

/**
 * Walk directory recursively to find all files
 */
async function walkDir(dir) {
  const files = await readdir(dir);
  const allFiles = await Promise.all(
    files.map(async file => {
      const filePath = path.join(dir, file);
      const stats = await stat(filePath);
      
      if (stats.isDirectory()) {
        return walkDir(filePath);
      } else if (stats.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts'))) {
        return filePath;
      }
      return [];
    })
  );
  
  return allFiles.flat();
}

/**
 * Parse component information from file
 */
async function parseComponent(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const dirName = path.basename(path.dirname(filePath));
    
    // Check if this is a component file
    const isComponent = content.includes('React.') || 
                        content.includes('from "react"') || 
                        content.includes("from 'react'");
    
    if (!isComponent) return;
    
    // Extract exported components
    const exportMatches = content.match(/export\s+(?:const|function|class|interface|type)\s+([A-Za-z0-9_]+)/g) || [];
    const namedExportMatches = content.match(/export\s+{\s*([^}]+)\s*}/g) || [];
    
    let exports = exportMatches.map(match => {
      const parts = match.split(/\s+/);
      return parts[parts.length - 1];
    });
    
    // Handle named exports like: export { Button, ButtonProps }
    namedExportMatches.forEach(match => {
      const names = match.replace(/export\s+{\s*|\s*}/g, '').split(',');
      names.forEach(name => {
        exports.push(name.trim());
      });
    });
    
    // Handle default export
    if (content.includes('export default')) {
      // Extract the component name from default export
      const defaultExportMatch = content.match(/export\s+default\s+([A-Za-z0-9_]+)/) || 
                                content.match(/const\s+([A-Za-z0-9_]+)\s+=.*\nexport\s+default\s+\1/);
      
      if (defaultExportMatch && defaultExportMatch[1]) {
        exports.push(defaultExportMatch[1]);
      } else {
        // For anonymous default exports, use filename
        const componentName = fileName.replace(/\.(tsx|ts)$/, '');
        exports.push(componentName);
      }
    }
    
    // Store component info
    exports.forEach(componentName => {
      // Skip utility types or interfaces
      if (componentName.endsWith('Props') || componentName.endsWith('Type') || componentName.endsWith('Context')) {
        return;
      }
      
      components.set(componentName, {
        name: componentName,
        filePath,
        fileName,
        directory: dirName,
        exports
      });
      
      // Track usage (initialize to 0)
      componentUsage.set(componentName, 0);
      
      // Check for naming inconsistency
      const fileBaseName = fileName.replace(/\.(tsx|ts)$/, '');
      if (componentName.toLowerCase() !== fileBaseName.toLowerCase() && 
          !fileBaseName.includes('-') && !['index'].includes(fileBaseName)) {
        namingInconsistencies.push({
          componentName,
          fileName,
          filePath
        });
      }
    });
  } catch (err) {
    console.error(`Error parsing ${filePath}:`, err);
  }
}

/**
 * Find component usage throughout the codebase
 */
async function findComponentUsage(filePath) {
  try {
    const content = await readFile(filePath, 'utf8');
    
    // For each component, check if it's used in this file
    for (const [componentName, component] of components.entries()) {
      // Skip checking the component's own file
      if (filePath === component.filePath) continue;
      
      // Look for common usage patterns
      const patterns = [
        `<${componentName}`,             // JSX: <Button
        `<${componentName}>`,            // JSX: <Button>
        ` ${componentName} `,            // Variable: const Button
        `import { ${componentName} }`,   // Named import
        `import ${componentName} from`,  // Default import
      ];
      
      for (const pattern of patterns) {
        if (content.includes(pattern)) {
          componentUsage.set(componentName, componentUsage.get(componentName) + 1);
          break;
        }
      }
    }
  } catch (err) {
    console.error(`Error finding usage in ${filePath}:`, err);
  }
}

/**
 * Find potential duplicate components
 */
function findDuplicates() {
  // Group components by name (case-insensitive)
  const nameGroups = new Map();
  
  for (const [name, component] of components.entries()) {
    const lowerName = name.toLowerCase();
    
    if (!nameGroups.has(lowerName)) {
      nameGroups.set(lowerName, []);
    }
    
    nameGroups.get(lowerName).push(component);
  }
  
  // Find groups with similar names or in different UI directories
  for (const [lowerName, group] of nameGroups.entries()) {
    if (group.length > 1) {
      group.forEach(component => {
        potentialDuplicates.add(component.name);
      });
    }
  }
  
  // Check for component pairs with similar functionality
  // This is a simple heuristic looking at UI components with similar names
  const similarComponentPairs = [
    ['Card', 'DataCard'],
    ['Table', 'DataTable'],
    ['Button', 'ButtonGroup'],
    ['List', 'ListView'],
    ['Input', 'TextField'],
    ['Mobile', 'Responsive'],
    ['Toast', 'Notification'],
    ['Theme', 'ThemeSwitcher', 'ThemeToggle'],
  ];
  
  for (const pair of similarComponentPairs) {
    const components = pair.filter(name => {
      for (const [componentName] of components.entries()) {
        if (componentName.includes(name)) {
          return true;
        }
      }
      return false;
    });
    
    if (components.length > 1) {
      for (const [componentName] of components.entries()) {
        potentialDuplicates.add(componentName);
      }
    }
  }
}

/**
 * Generate audit report
 */
async function generateReport() {
  // Sort components by usage
  const sortedComponents = [...components.entries()]
    .map(([name, component]) => ({
      ...component,
      usage: componentUsage.get(name) || 0,
      isDuplicate: potentialDuplicates.has(name)
    }))
    .sort((a, b) => b.usage - a.usage);
  
  // Generate markdown report
  let report = '# Component Audit Results\n\n';
  
  // Summary
  report += '## Summary\n\n';
  report += `- Total Components: ${components.size}\n`;
  report += `- Unused Components: ${sortedComponents.filter(c => c.usage === 0).length}\n`;
  report += `- Potential Duplicates: ${potentialDuplicates.size}\n`;
  report += `- Naming Inconsistencies: ${namingInconsistencies.length}\n\n`;
  
  // UI Components
  report += '## UI Components\n\n';
  report += '| Component | File | Directory | Usage | Potential Duplicate |\n';
  report += '|-----------|------|-----------|-------|--------------------|n';
  
  sortedComponents
    .filter(c => c.directory.includes('ui'))
    .forEach(component => {
      report += `| ${component.name} | ${component.fileName} | ${component.directory} | ${component.usage} | ${component.isDuplicate ? '✅' : '❌'} |\n`;
    });
  
  report += '\n';
  
  // Duplicates
  report += '## Potential Duplicates\n\n';
  
  if (potentialDuplicates.size > 0) {
    report += '| Component | File | Directory |\n';
    report += '|-----------|------|----------|\n';
    
    for (const name of potentialDuplicates) {
      const component = components.get(name);
      report += `| ${component.name} | ${component.fileName} | ${component.directory} |\n`;
    }
  } else {
    report += 'No potential duplicates found.\n';
  }
  
  report += '\n';
  
  // Unused Components
  report += '## Unused Components\n\n';
  
  const unusedComponents = sortedComponents.filter(c => c.usage === 0);
  
  if (unusedComponents.length > 0) {
    report += '| Component | File | Directory |\n';
    report += '|-----------|------|----------|\n';
    
    unusedComponents.forEach(component => {
      report += `| ${component.name} | ${component.fileName} | ${component.directory} |\n`;
    });
  } else {
    report += 'No unused components found.\n';
  }
  
  report += '\n';
  
  // Naming Inconsistencies
  report += '## Naming Inconsistencies\n\n';
  
  if (namingInconsistencies.length > 0) {
    report += '| Component | File | Path |\n';
    report += '|-----------|------|------|\n';
    
    namingInconsistencies.forEach(({ componentName, fileName, filePath }) => {
      report += `| ${componentName} | ${fileName} | ${filePath} |\n`;
    });
  } else {
    report += 'No naming inconsistencies found.\n';
  }
  
  // Write report to file
  await writeFile(OUTPUT_FILE, report);
  console.log(`Report generated at ${OUTPUT_FILE}`);
}

/**
 * Main execution function
 */
async function main() {
  try {
    // Get all UI components first
    for (const dir of UI_DIRS) {
      const files = await walkDir(dir);
      
      for (const file of files) {
        await parseComponent(file);
      }
    }
    
    console.log(`Found ${components.size} components`);
    
    // Get all other files to check component usage
    for (const dir of COMPONENT_DIRS) {
      const files = await walkDir(dir);
      
      for (const file of files) {
        await findComponentUsage(file);
      }
    }
    
    // Also check src directory for component usage in pages, etc.
    const srcFiles = await walkDir(SRC_DIR);
    for (const file of srcFiles) {
      await findComponentUsage(file);
    }
    
    // Find potential duplicates
    findDuplicates();
    
    // Generate report
    await generateReport();
    
  } catch (err) {
    console.error('Error:', err);
  }
}

// Run the script
main(); 