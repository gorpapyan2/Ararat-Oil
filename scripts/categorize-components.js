#!/usr/bin/env node

/**
 * This script analyzes and categorizes all components in the codebase
 * to help determine which ones should be moved to core, feature, or shared directories.
 * 
 * Usage: node scripts/categorize-components.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Define directories that have already been properly categorized
const ALREADY_MIGRATED = [
  'src/features',
  'src/shared/components',
  'src/core/components'
];

// Define feature mapping from component directory to feature directory
const FEATURE_MAPPING = {
  'dashboard': 'dashboard',
  'transactions': 'finance',
  'expenses': 'finance',
  'petrol-providers': 'petrol-providers',
  'fuel-supplies': 'fuel-supplies',
  'filling-systems': 'filling-systems',
  'fuel': 'fuel',
  'employees': 'employees',
  'settings': 'auth',
  'shifts': 'finance',
  'todo': 'todo'
};

// Define directories that should be in shared components
const SHARED_DIRECTORIES = [
  'unified',
  'dialogs',
  'sidebar',
  'enhanced',
  'shared',
  'dev'
];

// UI components that could be categorized as core components
const CORE_UI_PATTERNS = [
  'button',
  'input',
  'select',
  'checkbox',
  'radio',
  'toggle',
  'switch',
  'form',
  'modal',
  'dialog',
  'toast',
  'alert',
  'spinner',
  'loader',
  'progress',
  'tabs',
  'accordion',
  'table',
  'menu',
  'badge',
  'label',
  'card',
  'avatar',
  'icon',
  'tooltip',
  'popover',
  'dropdown',
  'navigation',
  'breadcrumb',
  'skeleton',
  'theme'
];

async function categorizeComponents() {
  console.log('🔍 Analyzing and categorizing components...');
  
  // Get all component files
  const files = globSync('src/**/*.{tsx,jsx}', { 
    ignore: ['**/node_modules/**', '**/dist/**', '**/__tests__/**', '**/*.test.*', '**/*.spec.*']
  });
  
  const categories = {
    core: [],
    feature: [],
    shared: [],
    alreadyMigrated: [],
    uncategorized: []
  };
  
  for (const file of files) {
    // Get the file name and directory structure
    const fileName = path.basename(file);
    const pathParts = file.split('/');
    const parentDir = pathParts[pathParts.length - 2];
    const grandparentDir = pathParts.length > 2 ? pathParts[pathParts.length - 3] : '';
    
    // Check if it's already in the right place
    if (ALREADY_MIGRATED.some(dir => file.startsWith(dir))) {
      categories.alreadyMigrated.push(file);
      continue;
    }
    
    // Check if it's a UI component that should be in core
    if (file.includes('src/components/ui')) {
      // Check if it's a primitives UI component (should definitely be in core)
      if (file.includes('/ui/primitives/') || !file.includes('/ui/composed/')) {
        categories.core.push({
          file,
          suggestedPath: `src/core/components/ui/${fileName}`,
          reason: 'UI primitive component'
        });
      } else {
        // It's a composed UI component, which could still be core but might be shared
        categories.core.push({
          file,
          suggestedPath: `src/core/components/ui/${fileName}`,
          reason: 'UI composed component'
        });
      }
      continue;
    }
    
    // Check if it's a shared component
    if (SHARED_DIRECTORIES.includes(parentDir)) {
      categories.shared.push({
        file,
        suggestedPath: `src/shared/components/${parentDir}/${fileName}`,
        reason: 'Shared utility component'
      });
      continue;
    }
    
    // Check if it's a feature component
    const featureDir = FEATURE_MAPPING[parentDir];
    if (featureDir) {
      categories.feature.push({
        file,
        suggestedPath: `src/features/${featureDir}/components/${fileName}`,
        reason: `Feature-specific ${featureDir} component`
      });
      continue;
    }
    
    // If we get here, it's uncategorized
    categories.uncategorized.push({
      file,
      suggestedPath: 'Unknown',
      reason: 'Could not determine appropriate category'
    });
  }
  
  // Generate report
  console.log('\n📊 Component Categorization Summary:');
  console.log(`Already in correct location: ${categories.alreadyMigrated.length} components`);
  console.log(`Core components: ${categories.core.length}`);
  console.log(`Feature components: ${categories.feature.length}`);
  console.log(`Shared components: ${categories.shared.length}`);
  console.log(`Uncategorized: ${categories.uncategorized.length}`);
  
  // Print details
  if (categories.core.length > 0) {
    console.log('\n🔷 Core Components (should be moved to src/core/components):');
    categories.core.forEach(item => {
      console.log(`  - ${item.file} → ${item.suggestedPath} (${item.reason})`);
    });
  }
  
  if (categories.feature.length > 0) {
    console.log('\n🔶 Feature Components (should be moved to respective feature directories):');
    categories.feature.forEach(item => {
      console.log(`  - ${item.file} → ${item.suggestedPath} (${item.reason})`);
    });
  }
  
  if (categories.shared.length > 0) {
    console.log('\n🔹 Shared Components (should be moved to src/shared/components):');
    categories.shared.forEach(item => {
      console.log(`  - ${item.file} → ${item.suggestedPath} (${item.reason})`);
    });
  }
  
  if (categories.uncategorized.length > 0) {
    console.log('\n⚠️ Uncategorized Components (need manual review):');
    // Group uncategorized components by directory to help spot patterns
    const byDirectory = {};
    categories.uncategorized.forEach(item => {
      const dir = path.dirname(item.file);
      if (!byDirectory[dir]) {
        byDirectory[dir] = [];
      }
      byDirectory[dir].push(item.file);
    });
    
    // Print by directory
    Object.keys(byDirectory).sort().forEach(dir => {
      console.log(`  Directory: ${dir}`);
      byDirectory[dir].forEach(file => {
        console.log(`    - ${path.basename(file)}`);
      });
    });
  }
  
  // Generate markdown report
  await generateMarkdownReport(categories);
  
  console.log('\n✅ Analysis complete. Detailed report saved to docs/refactoring/component-categorization.md');
}

async function generateMarkdownReport(categories) {
  const report = `# Component Categorization Report

## Overview

This report categorizes components in the codebase to help determine which ones should be moved to core, feature, or shared directories.

## Summary

- **Already in correct location**: ${categories.alreadyMigrated.length} components
- **Core components**: ${categories.core.length} components
- **Feature components**: ${categories.feature.length} components
- **Shared components**: ${categories.shared.length} components
- **Uncategorized**: ${categories.uncategorized.length} components

## Core Components

These UI primitive components should be moved to \`src/core/components\`:

${categories.core.map(item => `- \`${item.file}\` → \`${item.suggestedPath}\` (${item.reason})`).join('\n')}

## Feature Components

These feature-specific components should be moved to their respective feature directories:

${categories.feature.map(item => `- \`${item.file}\` → \`${item.suggestedPath}\` (${item.reason})`).join('\n')}

## Shared Components

These utility components should be moved to \`src/shared/components\`:

${categories.shared.map(item => `- \`${item.file}\` → \`${item.suggestedPath}\` (${item.reason})`).join('\n')}

## Uncategorized Components

These components need manual review to determine their appropriate location:

${(() => {
  // Group uncategorized components by directory to help spot patterns
  const byDirectory = {};
  categories.uncategorized.forEach(item => {
    const dir = path.dirname(item.file);
    if (!byDirectory[dir]) {
      byDirectory[dir] = [];
    }
    byDirectory[dir].push(item.file);
  });
  
  // Generate markdown with directory grouping
  return Object.keys(byDirectory).sort().map(dir => {
    return `### Directory: ${dir}\n\n${byDirectory[dir].map(file => `- \`${file}\``).join('\n')}`;
  }).join('\n\n');
})()}

## Next Steps

1. Move core UI components to \`src/core/components\`
2. Move remaining feature components to their respective feature directories
3. Move shared utility components to \`src/shared/components\`
4. Review uncategorized components manually
5. Update imports across the codebase
6. Create bridge components for backward compatibility

## Implementation Plan

1. Start by moving the core components
2. Then move the feature components
3. Finally move the shared components
4. Address the uncategorized components after manual review
`;

  const reportDir = path.join(rootDir, 'docs', 'refactoring');
  await fs.mkdir(reportDir, { recursive: true });
  await fs.writeFile(path.join(reportDir, 'component-categorization.md'), report);
}

// Run the script
categorizeComponents().catch(error => {
  console.error('Error categorizing components:', error);
  process.exit(1);
}); 