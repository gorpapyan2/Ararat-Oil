#!/usr/bin/env node

/**
 * Component Implementation Workflow Script
 * 
 * This script helps automate and track the implementation of UI components.
 * It provides a workflow for implementing, testing, and documenting components.
 * 
 * Usage:
 * - npm run implement-component -- --name=ComponentName --category=ui|composed
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import minimist from 'minimist';

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Parse command line arguments
const argv = minimist(process.argv.slice(2));

// Get component name and category from arguments
const componentName = argv.name;
const componentCategory = argv.category || 'ui'; // Default to 'ui' if not specified

// Templates for different component types
const COMPONENT_TEMPLATES = {
  ui: (name) => `import * as React from 'react';
import { cn } from '@/utils/cn';

export interface ${name}Props extends React.HTMLAttributes<HTMLDivElement> {
  // Add component-specific props here
}

/**
 * ${name} component
 * 
 * @example
 * \`\`\`tsx
 * <${name}>Example content</${name}>
 * \`\`\`
 */
export const ${name} = React.forwardRef<HTMLDivElement, ${name}Props>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('${name.toLowerCase()}', className)}
        {...props}
      />
    );
  }
);

${name}.displayName = '${name}';

export default ${name};
`,
  
  composed: (name) => `import * as React from 'react';
import { cn } from '@/utils/cn';

export interface ${name}Props extends React.HTMLAttributes<HTMLDivElement> {
  // Add component-specific props here
}

/**
 * ${name} component
 * 
 * This is a composed component that combines multiple primitive components.
 * 
 * @example
 * \`\`\`tsx
 * <${name}>Example content</${name}>
 * \`\`\`
 */
export const ${name} = React.forwardRef<HTMLDivElement, ${name}Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('${name.toLowerCase()}-container', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

${name}.displayName = '${name}';

// Add additional sub-components as needed

export default ${name};
`,
};

// Test template
const TEST_TEMPLATE = (name) => `import { render, screen } from '@testing-library/react';
import { ${name} } from './${name.toLowerCase()}';

describe('${name}', () => {
  it('renders correctly', () => {
    render(<${name}>Test content</${name}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<${name} className="custom-class">Test content</${name}>);
    const element = screen.getByText('Test content');
    expect(element).toHaveClass('custom-class');
  });

  // Add more tests as needed
});
`;

// Component implementation status enum
const IMPLEMENTATION_STATUS = {
  PLACEHOLDER: 'placeholder',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
};

/**
 * Get the component directory based on category
 */
function getComponentDirectory(category) {
  if (category === 'composed') {
    return path.join(rootDir, 'src', 'core', 'components', 'ui', 'composed');
  }
  return path.join(rootDir, 'src', 'core', 'components', 'ui');
}

/**
 * Check if the component file exists
 */
async function checkComponentExists(componentName, category) {
  const componentDir = getComponentDirectory(category);
  const componentPath = path.join(componentDir, `${componentName.toLowerCase()}.tsx`);
  
  try {
    await fs.access(componentPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Create a new component file
 */
async function createComponent(componentName, category) {
  const componentDir = getComponentDirectory(category);
  const componentPath = path.join(componentDir, `${componentName.toLowerCase()}.tsx`);
  const testPath = path.join(componentDir, `${componentName.toLowerCase()}.test.tsx`);
  
  // Create directory if it doesn't exist
  await fs.mkdir(componentDir, { recursive: true });
  
  // Create component file
  await fs.writeFile(componentPath, COMPONENT_TEMPLATES[category](componentName));
  
  // Create test file
  await fs.writeFile(testPath, TEST_TEMPLATE(componentName));
  
  return { componentPath, testPath };
}

/**
 * Update the implementation status in tracking file
 */
async function updateImplementationStatus(componentName, status) {
  const statusFile = path.join(rootDir, 'docs', 'refactoring', 'implementation-status.md');
  
  try {
    let content = await fs.readFile(statusFile, 'utf8');
    
    // Simple update logic - can be improved for more complex cases
    if (status === IMPLEMENTATION_STATUS.COMPLETED) {
      const date = new Date().toISOString().split('T')[0];
      const newEntry = `| ${componentName} | Core UI ${componentCategory === 'composed' ? 'Composed' : 'Primitive'} | Complete | ${date} |`;
      
      // Add to implemented components section
      const implementedSection = content.split('## Components Implemented')[1].split('##')[0];
      const updatedSection = implementedSection + '\n' + newEntry;
      content = content.replace(implementedSection, updatedSection);
      
      // Update summary count
      const summaryMatch = content.match(/Components fully implemented: (\d+)/);
      if (summaryMatch) {
        const currentCount = parseInt(summaryMatch[1], 10);
        const newCount = currentCount + 1;
        content = content.replace(/Components fully implemented: \d+/, `Components fully implemented: ${newCount}`);
        
        // Also update remaining count
        const remainingMatch = content.match(/Components remaining: (\d+)/);
        if (remainingMatch) {
          const currentRemaining = parseInt(remainingMatch[1], 10);
          const newRemaining = currentRemaining - 1;
          content = content.replace(/Components remaining: \d+/, `Components remaining: ${newRemaining}`);
        }
      }
    }
    
    await fs.writeFile(statusFile, content);
  } catch (error) {
    console.error('Error updating implementation status:', error);
  }
}

/**
 * Main function
 */
async function main() {
  // Validate component name
  if (!componentName) {
    console.error(chalk.red('Error: Component name is required. Use --name=ComponentName'));
    process.exit(1);
  }
  
  // Validate component category
  if (componentCategory !== 'ui' && componentCategory !== 'composed') {
    console.error(chalk.red('Error: Component category must be either "ui" or "composed"'));
    process.exit(1);
  }
  
  console.log(chalk.cyan(`Starting implementation workflow for ${componentName} (${componentCategory})`));
  
  // Check if component already exists
  const exists = await checkComponentExists(componentName, componentCategory);
  if (exists) {
    console.log(chalk.yellow(`Component ${componentName} already exists. Replacing it...`));
  }
  
  try {
    // Create component files
    const { componentPath, testPath } = await createComponent(componentName, componentCategory);
    console.log(chalk.green(`Created component at ${componentPath}`));
    console.log(chalk.green(`Created test file at ${testPath}`));
    
    // Update status tracking
    await updateImplementationStatus(componentName, IMPLEMENTATION_STATUS.COMPLETED);
    console.log(chalk.green('Updated implementation status'));
    
    console.log(chalk.cyan('\nNext steps:'));
    console.log(chalk.white('1. Implement the component functionality'));
    console.log(chalk.white('2. Write tests'));
    console.log(chalk.white('3. Update documentation'));
    console.log(chalk.white(`4. Run tests: npm test -- ${componentName.toLowerCase()}`));
  } catch (error) {
    console.error(chalk.red('Error creating component:'), error);
    process.exit(1);
  }
}

main(); 