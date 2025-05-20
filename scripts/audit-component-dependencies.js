#!/usr/bin/env node

/**
 * This script audits the codebase for component dependencies after migration.
 * It helps identify:
 * 1. Missing target components that bridge components reference
 * 2. Files that still reference the old component paths
 * 3. Potential circular dependencies in the new component structure
 * 
 * Usage: node scripts/audit-component-dependencies.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';
import chalk from 'chalk';

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Files/paths to exclude
const EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/*.d.ts',
  '**/backups/**',
  '**/src/pages/form-showcase.tsx',
  '**/src/pages/form-showcase-new.tsx'
];

/**
 * Extracts import statements from a file
 */
async function extractImports(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const lines = content.split('\n');
    
    const importLines = lines.filter(line => 
      (line.includes('import ') && line.includes(' from ')) && 
      !line.trim().startsWith('//') // Skip commented lines
    );
    
    return importLines.map(line => {
      const match = line.match(/from\s+['"]([^'"]+)['"]/);
      return match ? match[1] : null;
    }).filter(Boolean);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

/**
 * Checks if a file exists
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolves an import path to a file path
 */
function resolveImportPath(importPath, fromFile) {
  if (importPath.startsWith('@/')) {
    // Resolve aliased imports
    return path.join(rootDir, 'src', importPath.substring(2));
  } else if (importPath.startsWith('./') || importPath.startsWith('../')) {
    // Resolve relative imports
    return path.resolve(path.dirname(fromFile), importPath);
  }
  // Skip node_modules imports
  return null;
}

/**
 * Checks for old component paths
 */
async function checkOldComponentPaths() {
  console.log(chalk.blue('\n📊 Checking for old component paths...'));
  
  const sourceFiles = globSync('src/**/*.{ts,tsx,js,jsx}', {
    cwd: rootDir,
    ignore: EXCLUDE_PATTERNS
  });
  
  const filesWithOldImports = [];
  
  for (const file of sourceFiles) {
    const filePath = path.join(rootDir, file);
    const imports = await extractImports(filePath);
    
    const oldImports = imports.filter(imp => 
      imp.includes('@/components/')
    );
    
    if (oldImports.length > 0) {
      filesWithOldImports.push({
        file,
        imports: oldImports
      });
    }
  }
  
  if (filesWithOldImports.length > 0) {
    console.log(chalk.yellow(`Found ${filesWithOldImports.length} files with old component imports:`));
    filesWithOldImports.forEach(item => {
      console.log(chalk.gray(`  - ${item.file}`));
      item.imports.forEach(imp => console.log(chalk.red(`      ${imp}`)));
    });
  } else {
    console.log(chalk.green('✅ No files with old component imports found'));
  }
  
  return filesWithOldImports;
}

/**
 * Checks for missing target files
 */
async function checkMissingTargets() {
  console.log(chalk.blue('\n📊 Checking for missing target files...'));
  
  const sourceFiles = globSync('src/**/*.{ts,tsx,js,jsx}', {
    cwd: rootDir,
    ignore: EXCLUDE_PATTERNS
  });
  
  const missingTargets = [];
  
  for (const file of sourceFiles) {
    const filePath = path.join(rootDir, file);
    const imports = await extractImports(filePath);
    
    for (const importPath of imports) {
      // Skip node_modules and relative imports to index files
      if (importPath.startsWith('@/') && 
          (importPath.includes('/features/') || 
           importPath.includes('/core/') ||
           importPath.includes('/shared/'))) {
        
        // Try to resolve the import to a file
        let resolvedPath = resolveImportPath(importPath, filePath);
        
        // Try common extensions
        const extensions = ['.ts', '.tsx', '.js', '.jsx'];
        let exists = false;
        
        for (const ext of extensions) {
          const pathWithExt = `${resolvedPath}${ext}`;
          if (await fileExists(pathWithExt)) {
            exists = true;
            break;
          }
        }
        
        // Try index files
        if (!exists) {
          for (const ext of extensions) {
            const indexPath = path.join(resolvedPath, `index${ext}`);
            if (await fileExists(indexPath)) {
              exists = true;
              break;
            }
          }
        }
        
        if (!exists) {
          missingTargets.push({
            file,
            import: importPath,
            resolvedPath
          });
        }
      }
    }
  }
  
  if (missingTargets.length > 0) {
    console.log(chalk.yellow(`Found ${missingTargets.length} missing import targets:`));
    missingTargets.forEach(item => {
      console.log(chalk.gray(`  - In ${item.file}:`));
      console.log(chalk.red(`      Import: ${item.import}`));
      console.log(chalk.gray(`      Resolved to: ${item.resolvedPath}`));
    });
  } else {
    console.log(chalk.green('✅ No missing import targets found'));
  }
  
  return missingTargets;
}

/**
 * Checks for circular dependencies
 */
async function checkCircularDependencies() {
  console.log(chalk.blue('\n📊 Checking for circular dependencies...'));
  
  const sourceFiles = globSync('src/**/*.{ts,tsx,js,jsx}', {
    cwd: rootDir,
    ignore: EXCLUDE_PATTERNS
  });
  
  const dependencyGraph = {};
  
  // Build dependency graph
  for (const file of sourceFiles) {
    const filePath = path.join(rootDir, file);
    const imports = await extractImports(filePath);
    
    const relativeFilePath = path.relative(rootDir, filePath);
    dependencyGraph[relativeFilePath] = [];
    
    for (const importPath of imports) {
      if (importPath.startsWith('@/')) {
        // Resolve aliased imports
        const resolvedPath = resolveImportPath(importPath, filePath);
        
        if (resolvedPath) {
          const relativeResolvedPath = path.relative(rootDir, resolvedPath);
          dependencyGraph[relativeFilePath].push(relativeResolvedPath);
        }
      }
    }
  }
  
  // Find circular dependencies
  const visited = {};
  const recursionStack = {};
  const circularDependencies = [];
  
  function dfs(node, path = []) {
    visited[node] = true;
    recursionStack[node] = true;
    path.push(node);
    
    const dependencies = dependencyGraph[node] || [];
    
    for (const dep of dependencies) {
      // Add extension if needed for comparison
      let depWithExt = dep;
      if (!depWithExt.endsWith('.ts') && !depWithExt.endsWith('.tsx') && 
          !depWithExt.endsWith('.js') && !depWithExt.endsWith('.jsx')) {
        // Try to find the file with an extension
        for (const ext of ['.ts', '.tsx', '.js', '.jsx']) {
          if (dependencyGraph[`${dep}${ext}`]) {
            depWithExt = `${dep}${ext}`;
            break;
          }
        }
      }
      
      if (!visited[depWithExt]) {
        const result = dfs(depWithExt, [...path]);
        if (result) return result;
      } else if (recursionStack[depWithExt]) {
        // Found a cycle
        const cycleStart = path.indexOf(depWithExt);
        if (cycleStart !== -1) {
          return path.slice(cycleStart).concat(depWithExt);
        }
      }
    }
    
    recursionStack[node] = false;
    return null;
  }
  
  for (const node in dependencyGraph) {
    if (!visited[node]) {
      const cycle = dfs(node);
      if (cycle) {
        circularDependencies.push(cycle);
      }
    }
  }
  
  if (circularDependencies.length > 0) {
    console.log(chalk.yellow(`Found ${circularDependencies.length} circular dependencies:`));
    circularDependencies.forEach((cycle, i) => {
      console.log(chalk.gray(`  - Cycle ${i + 1}:`));
      cycle.forEach((node, j) => {
        console.log(chalk.red(`      ${j + 1}. ${node}`));
      });
    });
  } else {
    console.log(chalk.green('✅ No circular dependencies found'));
  }
  
  return circularDependencies;
}

/**
 * Main function
 */
async function main() {
  console.log(chalk.cyan.bold('🔍 Starting Component Dependency Audit...'));
  
  const oldPaths = await checkOldComponentPaths();
  const missingTargets = await checkMissingTargets();
  const circularDependencies = await checkCircularDependencies();
  
  console.log(chalk.cyan.bold('\n📋 Audit Summary:'));
  console.log(chalk.white(`- Files with old component imports: ${oldPaths.length}`));
  console.log(chalk.white(`- Missing import targets: ${missingTargets.length}`));
  console.log(chalk.white(`- Circular dependencies: ${circularDependencies.length}`));
  
  // Generate report
  const report = `# Component Dependency Audit Report

## Summary

- Date: ${new Date().toISOString().split('T')[0]}
- Files with old component imports: ${oldPaths.length}
- Missing import targets: ${missingTargets.length}
- Circular dependencies: ${circularDependencies.length}

## Old Component Imports

${oldPaths.length > 0 ? 
  oldPaths.map(item => 
    `### ${item.file}\n${item.imports.map(imp => `- \`${imp}\``).join('\n')}`
  ).join('\n\n') : 
  'None'}

## Missing Import Targets

${missingTargets.length > 0 ? 
  missingTargets.map(item => 
    `### ${item.file}\n- Import: \`${item.import}\`\n- Resolved path: \`${item.resolvedPath}\``
  ).join('\n\n') : 
  'None'}

## Circular Dependencies

${circularDependencies.length > 0 ? 
  circularDependencies.map((cycle, i) => 
    `### Cycle ${i + 1}\n${cycle.map((node, j) => `${j + 1}. \`${node}\``).join('\n')}`
  ).join('\n\n') : 
  'None'}

## Next Steps

${oldPaths.length > 0 ? '- Update files to use new component paths\n' : ''}${missingTargets.length > 0 ? '- Create missing target components\n' : ''}${circularDependencies.length > 0 ? '- Resolve circular dependencies\n' : ''}${oldPaths.length === 0 && missingTargets.length === 0 && circularDependencies.length === 0 ? '- No issues to address' : ''}
`;

  const reportPath = path.join(rootDir, 'docs', 'refactoring', 'dependency-audit-report.md');
  await fs.writeFile(reportPath, report, 'utf8');
  
  console.log(chalk.gray(`\n📄 Report saved to ${reportPath}`));
  
  if (oldPaths.length === 0 && missingTargets.length === 0 && circularDependencies.length === 0) {
    console.log(chalk.green.bold('\n✅ No dependency issues found! The codebase is in good shape.'));
  } else {
    console.log(chalk.yellow.bold('\n⚠️ Some dependency issues found. See the report for details.'));
  }
}

main().catch(error => {
  console.error('Error during dependency audit:', error);
  process.exit(1);
}); 