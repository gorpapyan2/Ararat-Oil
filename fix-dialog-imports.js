#!/usr/bin/env node

/**
 * Fix dialog import paths across the project
 * This script searches for files importing dialog components from wrong paths
 * and updates them to the correct path.
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
  try {
    // Find all files importing dialog components
    const { stdout } = await execAsync('grep -r "import {.*Dialog.*} from" src --include="*.tsx" --include="*.jsx" --include="*.ts"');
    
    const filesToFix = new Set();
    stdout.split('\n').forEach(line => {
      if (!line) return;
      
      // Extract filename
      const match = line.match(/^([^:]+):/);
      if (match && match[1]) {
        filesToFix.add(match[1]);
      }
    });
    
    console.log(`Found ${filesToFix.size} files with potentially incorrect dialog imports`);
    
    // Process each file
    for (const filePath of filesToFix) {
      try {
        // Read the file
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Replace various incorrect paths with the correct one
        let newContent = content;
        
        // Replace primitives/dialog with dialog
        newContent = newContent.replace(
          /import\s+{([^}]+)}\s+from\s+['"]@\/core\/components\/ui\/primitives\/dialog['"]/g,
          "import {$1} from '@/core/components/ui/dialog'"
        );
        
        // Replace styled/dialog with dialog
        newContent = newContent.replace(
          /import\s+{([^}]+)}\s+from\s+['"]@\/core\/components\/ui\/styled\/dialog['"]/g,
          "import {$1} from '@/core/components/ui/dialog'"
        );
        
        // If the content changed, write it back
        if (newContent !== content) {
          fs.writeFileSync(filePath, newContent, 'utf8');
          console.log(`✅ Fixed imports in ${filePath}`);
        } else {
          console.log(`⏭️  No changes needed in ${filePath}`);
        }
        
      } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
      }
    }
    
    console.log('Dialog import paths fixed successfully!');
  } catch (error) {
    console.error('Error executing grep command:', error);
    process.exit(1);
  }
}

main(); 