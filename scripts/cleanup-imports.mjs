#!/usr/bin/env node

/**
 * Import Cleanup Script
 * 
 * This script automatically identifies and removes unused imports
 * from TypeScript/JavaScript files to reduce bundle size.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ImportCleaner {
  constructor() {
    this.projectRoot = process.cwd();
    this.srcPath = path.join(this.projectRoot, 'src');
    this.results = {
      filesProcessed: 0,
      importsRemoved: 0,
      bytesRecovered: 0,
      errors: []
    };
  }

  async cleanup() {
    console.log('🧹 Starting Import Cleanup...\n');
    
    try {
      const files = await this.findSourceFiles();
      console.log(`📁 Found ${files.length} source files to process\n`);
      
      for (const filePath of files) {
        await this.processFile(filePath);
      }
      
      this.generateReport();
    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
    }
  }

  async findSourceFiles() {
    const files = [];
    await this.walkDirectory(this.srcPath, files);
    return files.filter(file => /\.(ts|tsx|js|jsx)$/.test(file));
  }

  async walkDirectory(dir, files) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
        await this.walkDirectory(fullPath, files);
      } else if (stat.isFile()) {
        files.push(fullPath);
      }
    }
  }

  async processFile(filePath) {
    try {
      const originalContent = fs.readFileSync(filePath, 'utf8');
      const cleanedContent = this.removeUnusedImports(originalContent, filePath);
      
      if (originalContent !== cleanedContent) {
        const bytesSaved = Buffer.byteLength(originalContent, 'utf8') - Buffer.byteLength(cleanedContent, 'utf8');
        
        // Write the cleaned content back to file
        fs.writeFileSync(filePath, cleanedContent, 'utf8');
        
        this.results.bytesRecovered += bytesSaved;
        this.results.importsRemoved++;
        
        console.log(`✅ Cleaned: ${path.relative(this.projectRoot, filePath)} (${bytesSaved} bytes saved)`);
      }
      
      this.results.filesProcessed++;
    } catch (error) {
      this.results.errors.push({
        file: path.relative(this.projectRoot, filePath),
        error: error.message
      });
      console.warn(`⚠️  Error processing ${path.relative(this.projectRoot, filePath)}: ${error.message}`);
    }
  }

  removeUnusedImports(content, filePath) {
    const lines = content.split('\n');
    const imports = [];
    const usedIdentifiers = new Set();
    
    // First pass: Extract all imports
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const importMatch = this.parseImportLine(line);
      
      if (importMatch) {
        imports.push({
          lineIndex: i,
          line,
          ...importMatch
        });
      }
    }
    
    // Second pass: Find used identifiers in the code
    const codeWithoutImports = lines
      .filter((_, index) => !imports.some(imp => imp.lineIndex === index))
      .join('\n');
    
    for (const importItem of imports) {
      for (const identifier of importItem.identifiers) {
        if (this.isIdentifierUsed(identifier, codeWithoutImports, filePath)) {
          usedIdentifiers.add(identifier);
        }
      }
    }
    
    // Third pass: Remove unused imports
    const cleanedLines = [...lines];
    let removedCount = 0;
    
    for (const importItem of imports.reverse()) { // Reverse to maintain line indices
      const usedFromThisImport = importItem.identifiers.filter(id => usedIdentifiers.has(id));
      
      if (usedFromThisImport.length === 0) {
        // Remove entire import line
        cleanedLines.splice(importItem.lineIndex - removedCount, 1);
        removedCount++;
      } else if (usedFromThisImport.length < importItem.identifiers.length) {
        // Partially clean the import
        const newImportLine = this.rebuildImportLine(importItem, usedFromThisImport);
        cleanedLines[importItem.lineIndex - removedCount] = newImportLine;
      }
    }
    
    return cleanedLines.join('\n');
  }

  parseImportLine(line) {
    // Handle different import patterns
    const patterns = [
      // import { a, b, c } from 'module'
      /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]([^'"]+)['"]/,
      // import * as name from 'module'
      /import\s*\*\s*as\s*(\w+)\s*from\s*['"]([^'"]+)['"]/,
      // import defaultName from 'module'
      /import\s+(\w+)\s*from\s*['"]([^'"]+)['"]/,
      // import 'module' (side effect)
      /import\s*['"]([^'"]+)['"]/,
    ];
    
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        if (match[1] && match[2]) {
          if (line.includes('{')) {
            // Named imports
            const identifiers = match[1]
              .split(',')
              .map(id => id.trim().replace(/\s+as\s+\w+/, '').replace(/\w+\s+as\s+/, ''))
              .filter(id => id);
            
            return {
              type: 'named',
              identifiers,
              module: match[2],
              originalLine: line
            };
          } else if (line.includes('* as')) {
            // Namespace import
            return {
              type: 'namespace',
              identifiers: [match[1]],
              module: match[2],
              originalLine: line
            };
          } else {
            // Default import
            return {
              type: 'default',
              identifiers: [match[1]],
              module: match[2],
              originalLine: line
            };
          }
        } else if (match[1]) {
          // Side effect import
          return {
            type: 'side-effect',
            identifiers: [],
            module: match[1],
            originalLine: line
          };
        }
      }
    }
    
    return null;
  }

  isIdentifierUsed(identifier, code, filePath) {
    // Skip certain patterns that might be false positives
    if (identifier === 'React' && filePath.endsWith('.tsx')) {
      // React is used implicitly in JSX
      return true;
    }
    
    if (identifier === 'type' || identifier === 'interface') {
      // TypeScript keywords
      return true;
    }
    
    // Check for usage in code
    const patterns = [
      // Direct usage: identifier(, identifier., identifier<, etc.
      new RegExp(`\\b${this.escapeRegExp(identifier)}\\b(?=[\\s\\(\\.<>\\[\\,\\;\\:])`),
      // JSX component usage: <identifier, </identifier>
      new RegExp(`<\\/?${this.escapeRegExp(identifier)}[\\s>]`),
      // Type usage: : identifier, as identifier
      new RegExp(`[:\\s]${this.escapeRegExp(identifier)}[\\s\\|\\&\\<\\>\\[\\,\\;]`),
    ];
    
    return patterns.some(pattern => pattern.test(code));
  }

  rebuildImportLine(importItem, usedIdentifiers) {
    switch (importItem.type) {
      case 'named':
        return `import { ${usedIdentifiers.join(', ')} } from '${importItem.module}';`;
      case 'namespace':
      case 'default':
        return importItem.originalLine; // Keep as is if used
      default:
        return importItem.originalLine;
    }
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  generateReport() {
    console.log('\n📊 IMPORT CLEANUP REPORT');
    console.log('='.repeat(40));
    console.log(`📁 Files Processed: ${this.results.filesProcessed}`);
    console.log(`🧹 Files with Cleaned Imports: ${this.results.importsRemoved}`);
    console.log(`💾 Bytes Recovered: ${this.results.bytesRecovered.toLocaleString()} bytes`);
    console.log(`📦 Estimated Bundle Size Reduction: ${(this.results.bytesRecovered / 1024).toFixed(2)} KB`);
    
    if (this.results.errors.length > 0) {
      console.log(`\n⚠️  Errors: ${this.results.errors.length}`);
      this.results.errors.forEach(error => {
        console.log(`   • ${error.file}: ${error.error}`);
      });
    }
    
    console.log('\n🎯 RECOMMENDATIONS:');
    console.log('1. Review the cleaned files to ensure functionality is preserved');
    console.log('2. Run tests to verify no imports were incorrectly removed');
    console.log('3. Consider using ESLint rules to prevent unused imports in the future');
    console.log('4. Use tree-shaking compatible imports when possible');
    
    if (this.results.bytesRecovered > 0) {
      console.log('\n✨ Cleanup completed successfully!');
    } else {
      console.log('\n✅ No unused imports found - codebase is already clean!');
    }
  }
}

// Additional cleanup functions
class AdditionalOptimizations {
  static optimizeLucideImports(content) {
    // Convert individual icon imports to use centralized icon system
    const iconImportPattern = /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]lucide-react['"]/g;
    
    let hasLucideImports = false;
    const iconNames = new Set();
    
    // Extract all lucide icon names
    content = content.replace(iconImportPattern, (match, icons) => {
      hasLucideImports = true;
      icons.split(',').forEach(icon => {
        const cleanIcon = icon.trim().replace(/\s+as\s+\w+/, '');
        iconNames.add(cleanIcon);
      });
      return ''; // Remove the import
    });
    
    if (hasLucideImports && iconNames.size > 0) {
      // Add centralized icon import
      const iconImport = `import { ${Array.from(iconNames).join(', ')} } from '@/shared/components/ui/icons';\n`;
      
      // Find the best place to insert the import (after other imports)
      const lines = content.split('\n');
      let insertIndex = 0;
      
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ') || lines[i].startsWith('import{')) {
          insertIndex = i + 1;
        } else if (lines[i].trim() === '' && insertIndex > 0) {
          break;
        }
      }
      
      lines.splice(insertIndex, 0, iconImport);
      content = lines.join('\n');
    }
    
    return content;
  }
  
  static removeConsoleStatements(content) {
    // Remove console.log statements (but keep console.error, console.warn)
    return content.replace(/console\.log\([^)]*\);?\s*/g, '');
  }
  
  static optimizeTypeImports(content) {
    // Convert type imports to use 'import type' syntax
    return content.replace(
      /import\s*\{\s*([^}]*(?:type\s+\w+|interface\s+\w+)[^}]*)\s*\}\s*from/g,
      'import type { $1 } from'
    );
  }
}

// Run cleanup if called directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('cleanup-imports.mjs')) {
  const cleaner = new ImportCleaner();
  cleaner.cleanup().catch(console.error);
}

export { ImportCleaner, AdditionalOptimizations }; 