#!/usr/bin/env node

/**
 * Button Import Migration Script
 * 
 * This script helps migrate button imports to the new standardized button system.
 * It identifies old button import patterns and suggests replacements.
 * 
 * Usage:
 *   node scripts/update-button-imports.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const SRC_DIR = path.resolve(__dirname, '../src');
const OUTPUT_FILE = path.resolve(__dirname, '../button-migration-report.md');
const FILE_PATTERN = '**/*.{tsx,ts,jsx,js}';

// Button import patterns to identify
const IMPORT_PATTERNS = [
  {
    pattern: /import\s+{\s*(?:[^}]*,\s*)?Button(?:\s*,[^}]*)?\s*}\s+from\s+['"]@\/core\/components\/ui\/button['"]/g,
    replacement: `import { Button } from "@/core/components/ui/buttons"`
  },
  {
    pattern: /import\s+{\s*(?:[^}]*,\s*)?IconButton(?:\s*,[^}]*)?\s*}\s+from\s+['"]@\/core\/components\/ui\/icon-button['"]/g,
    replacement: `import { IconButton } from "@/core/components/ui/buttons"`
  },
  {
    pattern: /import\s+{\s*(?:[^}]*,\s*)?LoadingButton(?:\s*,[^}]*)?\s*}\s+from\s+['"]@\/core\/components\/ui\/loading-button['"]/g,
    replacement: `import { LoadingButton } from "@/core/components/ui/buttons"`
  },
  {
    pattern: /import\s+{\s*(?:[^}]*,\s*)?ActionButton(?:\s*,[^}]*)?\s*}\s+from\s+['"]@\/core\/components\/ui\/action-button['"]/g,
    replacement: `import { ActionButton } from "@/core/components/ui/buttons"`
  },
  {
    pattern: /import\s+{\s*(?:[^}]*,\s*)?CreateButton(?:\s*,[^}]*)?\s*}\s+from\s+['"]@\/core\/components\/ui\/create-button['"]/g,
    replacement: `import { CreateButton } from "@/core/components/ui/buttons"`
  },
  // Add more patterns as needed
];

// Find all source files
const files = glob.sync(FILE_PATTERN, { cwd: SRC_DIR, absolute: true });
console.log(`Analyzing ${files.length} files...`);

// Results storage
const results = [];
let totalMatches = 0;

// Process each file
files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(SRC_DIR, filePath);
    
    // Check for button import patterns
    let fileMatches = 0;
    const matchDetails = [];
    
    IMPORT_PATTERNS.forEach(({ pattern, replacement }) => {
      const matches = content.match(pattern);
      if (matches) {
        fileMatches += matches.length;
        
        matchDetails.push({
          count: matches.length,
          oldImport: matches[0],
          newImport: replacement
        });
      }
    });
    
    // If matches found, add to results
    if (fileMatches > 0) {
      results.push({
        file: relativePath,
        matches: fileMatches,
        details: matchDetails
      });
      totalMatches += fileMatches;
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
});

// Generate migration report
let report = `# Button Import Migration Report\n\n`;
report += `Generated on ${new Date().toLocaleString()}\n\n`;
report += `**Total files to update**: ${results.length}\n`;
report += `**Total imports to update**: ${totalMatches}\n\n`;

// Add detailed results
report += `## Files to Update\n\n`;
results.forEach(result => {
  report += `### ${result.file}\n\n`;
  report += `Found ${result.matches} button imports to update:\n\n`;
  
  result.details.forEach((detail, index) => {
    report += `#### Update ${index + 1}:\n\n`;
    report += "```typescript\n";
    report += `// Old import:\n${detail.oldImport}\n\n`;
    report += `// New import:\n${detail.newImport}\n`;
    report += "```\n\n";
  });
});

// Add migration guide
report += `## Migration Guide\n\n`;
report += `To update your imports, follow these steps:\n\n`;
report += `1. Replace individual button imports with the new consolidated imports\n`;
report += `2. Update any component props if needed (refer to documentation)\n`;
report += `3. Test your changes to ensure everything works as expected\n\n`;

report += `### Example\n\n`;
report += "```typescript\n";
report += `// Old approach - multiple imports\n`;
report += `import { Button } from "@/core/components/ui/button";\n`;
report += `import { IconButton } from "@/core/components/ui/icon-button";\n`;
report += `import { LoadingButton } from "@/core/components/ui/loading-button";\n\n`;
report += `// New approach - single import\n`;
report += `import { Button, IconButton, LoadingButton } from "@/core/components/ui/buttons";\n`;
report += "```\n\n";

report += `## New Features\n\n`;
report += `The new button system provides several improvements:\n\n`;
report += `- Consistent props and behavior across all button variants\n`;
report += `- Improved accessibility with better aria support\n`;
report += `- Comprehensive TypeScript type definitions\n`;
report += `- Consistent styling and variants\n`;
report += `- Composable button components\n`;

// Write report to file
fs.writeFileSync(OUTPUT_FILE, report);

console.log(`\nMigration analysis complete! Generated report: ${OUTPUT_FILE}`);
console.log(`Found ${totalMatches} button imports to update in ${results.length} files.`);
console.log(`\nNext steps:`);
console.log(`1. Review the migration report`);
console.log(`2. Update imports gradually, testing as you go`);
console.log(`3. Refer to the button component documentation for usage details\n`); 