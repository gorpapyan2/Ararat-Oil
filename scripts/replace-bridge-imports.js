#!/usr/bin/env node

/**
 * This script finds all usages of bridge components and replaces their imports
 * with the corresponding feature component import.
 *
 * Usage:
 * node scripts/replace-bridge-imports.js
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

// Helper to get all bridge components and their feature replacements
function getBridgeComponents() {
  // Read the deprecation schedule
  const schedulePath = path.join(ROOT_DIR, 'docs/refactoring/component-deprecation-schedule.md');
  const scheduleContent = fs.readFileSync(schedulePath, 'utf8');
  const components = [];
  const lines = scheduleContent.split('\n');
  const tableStartIndex = lines.findIndex(line => line.includes('| Component | Path |'));
  if (tableStartIndex === -1) throw new Error('Could not find component table in the deprecation schedule');
  let i = tableStartIndex + 2;
  while (i < lines.length && lines[i].startsWith('|')) {
    const parts = lines[i].split('|').map(part => part.trim());
    if (parts.length >= 6) {
      components.push({
        name: parts[1],
        path: parts[2],
        replacement: parts[5],
      });
    }
    i++;
  }
  return components;
}

// Find all files that import a given component
function findImportUsages(componentName) {
  return new Promise((resolve, reject) => {
    glob('src/**/*.{tsx,ts}', { cwd: ROOT_DIR }, (err, files) => {
      if (err) return reject(err);
      const usageFiles = [];
      for (const file of files) {
        const fullPath = path.join(ROOT_DIR, file);
        const content = fs.readFileSync(fullPath, 'utf-8');
        // Look for import { ComponentName } or import ComponentName
        const importRegex = new RegExp(`import\\s+({[^}]*\\b${componentName}\\b[^}]*}|${componentName})\\s+from`);
        if (importRegex.test(content)) {
          usageFiles.push({ file, fullPath, content });
        }
      }
      resolve(usageFiles);
    });
  });
}

// Replace the import in a file
function replaceImportInFile({ file, fullPath, content }, bridgePath, featureImport, componentName) {
  // Replace the import path
  const newContent = content.replace(
    new RegExp(`(import\\s+[^;]*\\b${componentName}\\b[^;]*from\\s+['"])${bridgePath.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}(['"])`, 'g'),
    `$1${featureImport}$2`
  );
  if (newContent !== content) {
    fs.writeFileSync(fullPath, newContent, 'utf-8');
    console.log(`✅ Updated import in ${file}`);
    return true;
  }
  return false;
}

// Main function
async function main() {
  const bridgeComponents = getBridgeComponents();
  let totalUpdated = 0;
  for (const { name, path: bridgePath, replacement } of bridgeComponents) {
    // Only process .tsx/.ts files
    if (!bridgePath.endsWith('.tsx') && !bridgePath.endsWith('.ts')) continue;
    // Find all usages
    const usageFiles = await findImportUsages(name);
    if (usageFiles.length === 0) continue;
    // Replace imports in each file
    for (const usage of usageFiles) {
      const updated = replaceImportInFile(usage, bridgePath.replace(/^src\//, '@/'), replacement, name);
      if (updated) totalUpdated++;
    }
  }
  console.log(`\nSummary: Updated imports in ${totalUpdated} files.`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
}); 