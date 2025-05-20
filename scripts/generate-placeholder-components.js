#!/usr/bin/env node

/**
 * This script generates placeholder components for all missing components
 * identified in the component dependency audit.
 * 
 * It reads the dependency-audit-report.md file and creates placeholder
 * components for each missing import target.
 * 
 * Usage: node scripts/generate-placeholder-components.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Components that need special handling or custom templates
const SPECIAL_COMPONENTS = {
  // Component name to template mapping
  'ThemeSwitcher': 'theme-switcher',
  'ButtonShowcase': 'button-showcase',
  'SearchBar': 'search-bar',
};

const REACT_IMPORT = "import * as React from 'react';\n";

/**
 * Template for a basic UI component
 */
function generateBasicComponentTemplate(componentName) {
  // Convert component name to CSS class name format (camelCase to kebab-case)
  const className = componentName.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  
  return `${REACT_IMPORT}
import { cn } from '@/utils/cn';

export interface ${componentName}Props extends React.HTMLAttributes<HTMLDivElement> {
  // Add specific props here
}

/**
 * ${componentName} component
 * 
 * @placeholder This is a placeholder component that needs proper implementation
 */
export function ${componentName}({ className, ...props }: ${componentName}Props) {
  return (
    <div 
      className={cn('${className}', className)}
      {...props}
    >
      {/* Placeholder for ${componentName} implementation */}
      <div className="p-4 border border-dashed border-gray-300 rounded-md text-center text-gray-500">
        ${componentName} (Placeholder)
      </div>
    </div>
  );
}
`;
}

/**
 * Template for a button component
 */
function generateButtonComponentTemplate(componentName) {
  return `${REACT_IMPORT}
import { Button } from '@/core/components/ui/button';
import { cn } from '@/utils/cn';

export interface ${componentName}Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Add specific props here
}

/**
 * ${componentName} component
 * 
 * @placeholder This is a placeholder component that needs proper implementation
 */
export function ${componentName}({ className, children, ...props }: ${componentName}Props) {
  return (
    <Button 
      className={cn('${componentName.toLowerCase()}', className)}
      {...props}
    >
      {children || '${componentName} (Placeholder)'}
    </Button>
  );
}
`;
}

/**
 * Template for an input component
 */
function generateInputComponentTemplate(componentName) {
  return `${REACT_IMPORT}
import { cn } from '@/utils/cn';

export interface ${componentName}Props extends React.InputHTMLAttributes<HTMLInputElement> {
  // Add specific props here
}

/**
 * ${componentName} component
 * 
 * @placeholder This is a placeholder component that needs proper implementation
 */
export function ${componentName}({ className, ...props }: ${componentName}Props) {
  return (
    <input 
      className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background', className)}
      {...props}
    />
  );
}
`;
}

/**
 * Template for a composed component
 */
function generateComposedComponentTemplate(componentName) {
  return `${REACT_IMPORT}
import { cn } from '@/utils/cn';

/**
 * ${componentName} component
 * 
 * @placeholder This is a placeholder component that needs proper implementation
 */
export function ${componentName}({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn('composed-${componentName.toLowerCase()}', className)}
      {...props}
    >
      {children || (
        <div className="p-4 border border-dashed border-gray-300 rounded-md text-center text-gray-500">
          ${componentName} (Placeholder)
        </div>
      )}
    </div>
  );
}
`;
}

/**
 * Template for theme switcher component
 */
function generateThemeSwitcherTemplate() {
  return `${REACT_IMPORT}
import { Button } from '@/core/components/ui/button';
import { cn } from '@/utils/cn';

/**
 * ThemeSwitcher component
 * 
 * @placeholder This is a placeholder component that needs proper implementation
 */
export function ThemeSwitcher({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn('theme-switcher', className)}
      {...props}
    >
      <Button variant="outline" size="sm">
        Toggle Theme
      </Button>
    </div>
  );
}
`;
}

/**
 * Template for search bar component
 */
function generateSearchBarTemplate() {
  return `${REACT_IMPORT}
import { cn } from '@/utils/cn';

interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

/**
 * SearchBar component
 * 
 * @placeholder This is a placeholder component that needs proper implementation
 */
export function SearchBar({ 
  className, 
  onSearch,
  placeholder = "Search...",
  ...props 
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const query = new FormData(form).get('query') as string;
    if (onSearch) onSearch(query);
  };

  return (
    <div 
      className={cn('search-bar', className)}
      {...props}
    >
      <form onSubmit={handleSubmit} className="flex w-full">
        <input 
          type="search"
          name="query"
          placeholder={placeholder}
          className="flex h-10 w-full rounded-l-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        />
        <button 
          type="submit"
          className="h-10 rounded-r-md border border-l-0 border-input bg-background px-3 py-2 text-sm font-medium"
        >
          Search
        </button>
      </form>
    </div>
  );
}
`;
}

/**
 * Template for button showcase component
 */
function generateButtonShowcaseTemplate() {
  return `${REACT_IMPORT}
import { cn } from '@/utils/cn';

/**
 * ButtonShowcase component for displaying different button variations
 * 
 * @placeholder This is a placeholder component that needs proper implementation
 */
export function ButtonShowcase({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn('button-showcase space-y-8', className)}
      {...props}
    >
      <div className="p-4 border border-dashed border-gray-300 rounded-md text-center text-gray-500">
        ButtonShowcase (Placeholder) - This component will display various button types
      </div>
    </div>
  );
}
`;
}

/**
 * Determines the appropriate template for a component
 */
function getTemplateForComponent(componentName, importPath) {
  // Check if it's a special component
  if (SPECIAL_COMPONENTS[componentName]) {
    const templateName = SPECIAL_COMPONENTS[componentName];
    switch (templateName) {
      case 'theme-switcher':
        return generateThemeSwitcherTemplate();
      case 'search-bar':
        return generateSearchBarTemplate();
      case 'button-showcase':
        return generateButtonShowcaseTemplate();
    }
  }

  // Button variants
  if (componentName.toLowerCase().includes('button')) {
    return generateButtonComponentTemplate(componentName);
  }

  // Input components
  if (['Input', 'Select', 'Textarea', 'Checkbox', 'Radio', 'Switch'].includes(componentName)) {
    return generateInputComponentTemplate(componentName);
  }

  // Composed components
  if (importPath.includes('/composed/')) {
    return generateComposedComponentTemplate(componentName);
  }

  // Default to basic component
  return generateBasicComponentTemplate(componentName);
}

/**
 * Extracts component name from import path
 */
function getComponentNameFromPath(importPath) {
  const parts = importPath.split('/');
  const lastPart = parts[parts.length - 1];
  
  // Handle special cases like kebab-case
  if (lastPart.includes('-')) {
    return lastPart.split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }
  
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
}

/**
 * Creates a placeholder component file
 */
async function createPlaceholderComponent(importPath, resolvedPath) {
  try {
    // Extract the component name from the import path
    const componentName = getComponentNameFromPath(importPath.split('/').pop());
    
    // Get the appropriate template
    const template = getTemplateForComponent(componentName, importPath);
    
    // Ensure directory exists
    const dirPath = path.dirname(resolvedPath);
    await fs.mkdir(dirPath, { recursive: true });
    
    // Create the file with the template
    const filePath = `${resolvedPath}.tsx`;
    await fs.writeFile(filePath, template);
    
    return { componentName, filePath, success: true };
  } catch (error) {
    console.error(`Error creating placeholder for ${importPath}:`, error);
    return { importPath, success: false, error: error.message };
  }
}

/**
 * Parses the dependency audit report to extract missing components
 */
async function parseDependencyAuditReport() {
  try {
    const reportPath = path.join(rootDir, 'docs', 'refactoring', 'dependency-audit-report.md');
    const content = await fs.readFile(reportPath, 'utf8');
    
    // Extract missing import targets section
    const missingTargetsSection = content.split('## Missing Import Targets')[1].split('## Circular Dependencies')[0];
    
    // Parse each missing target
    const missingTargets = [];
    const pattern = /### (.+?)\n- Import: `(.+?)`\n- Resolved path: `(.+?)`/g;
    
    let match;
    while ((match = pattern.exec(missingTargetsSection)) !== null) {
      const [, sourceFile, importPath, resolvedPath] = match;
      missingTargets.push({ sourceFile, importPath, resolvedPath });
    }
    
    return missingTargets;
  } catch (error) {
    console.error('Error parsing dependency audit report:', error);
    return [];
  }
}

/**
 * Creates placeholder components for all missing targets
 */
async function createPlaceholderComponents(missingTargets) {
  const results = {
    success: 0,
    failed: 0,
    details: []
  };
  
  const processedPaths = new Set();
  
  for (const { sourceFile, importPath, resolvedPath } of missingTargets) {
    // Skip if we've already processed this path
    if (processedPaths.has(resolvedPath)) continue;
    processedPaths.add(resolvedPath);
    
    const result = await createPlaceholderComponent(importPath, resolvedPath);
    
    if (result.success) {
      results.success++;
      results.details.push({
        sourceFile,
        importPath,
        componentName: result.componentName,
        filePath: result.filePath,
        status: 'success'
      });
    } else {
      results.failed++;
      results.details.push({
        sourceFile,
        importPath,
        status: 'failed',
        error: result.error
      });
    }
  }
  
  return results;
}

/**
 * Generates a report of placeholder component creation
 */
async function generatePlaceholderReport(results) {
  const report = `# Placeholder Components Creation Report

## Summary

- Date: ${new Date().toISOString().split('T')[0]}
- Total components created: ${results.success}
- Failed to create: ${results.failed}

## Successfully Created Components

${results.details
  .filter(item => item.status === 'success')
  .map(item => `- ${item.componentName} (${item.filePath.replace(rootDir, '')})`)
  .join('\n')}

## Failed Components

${results.details
  .filter(item => item.status === 'failed')
  .map(item => `- ${item.importPath} (Error: ${item.error})`)
  .join('\n') || 'None'}

## Next Steps

1. Implement proper functionality for these placeholder components
2. Prioritize components based on the implementation plan
3. Run TypeScript type checking to verify all imports are resolved
`;

  const reportPath = path.join(rootDir, 'docs', 'refactoring', 'placeholder-components-report.md');
  await fs.writeFile(reportPath, report);
  
  return reportPath;
}

/**
 * Main function
 */
async function main() {
  console.log(chalk.cyan.bold('🔍 Generating placeholder components...'));
  
  // Parse the dependency audit report
  const missingTargets = await parseDependencyAuditReport();
  console.log(chalk.blue(`Found ${missingTargets.length} missing component targets to generate.`));
  
  // Create placeholder components
  const results = await createPlaceholderComponents(missingTargets);
  
  // Generate report
  const reportPath = await generatePlaceholderReport(results);
  
  console.log(chalk.green.bold(`✅ Successfully created ${results.success} placeholder components.`));
  if (results.failed > 0) {
    console.log(chalk.yellow.bold(`⚠️ Failed to create ${results.failed} components.`));
  }
  console.log(chalk.gray(`📄 Report saved to ${reportPath}`));
  
  console.log(chalk.cyan.bold('\nPlaceholder components have been created. Next steps:'));
  console.log(chalk.white('1. Run TypeScript type checking to verify all imports are resolved'));
  console.log(chalk.white('2. Begin implementing actual functionality based on the implementation plan'));
}

main().catch(error => {
  console.error('Error generating placeholder components:', error);
  process.exit(1);
}); 