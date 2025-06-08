
#!/usr/bin/env node

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
    
    // Extract imports and find used identifiers
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
    
    // Find used identifiers
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
    
    // Remove unused imports
    const cleanedLines = [...lines];
    let removedCount = 0;
    
    for (const importItem of imports.reverse()) {
      const usedFromThisImport = importItem.identifiers.filter(id => usedIdentifiers.has(id));
      
      if (usedFromThisImport.length === 0) {
        cleanedLines.splice(importItem.lineIndex - removedCount, 1);
        removedCount++;
      }
    }
    
    return cleanedLines.join('\n');
  }

  parseImportLine(line) {
    const namedImportPattern = /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]([^'"]+)['"]/;
    const match = line.match(namedImportPattern);
    
    if (match) {
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
    }
    
    return null;
  }

  isIdentifierUsed(identifier, code, filePath) {
    if (identifier === 'React' && filePath.endsWith('.tsx')) {
      return true;
    }
    
    const pattern = new RegExp(`\\b${this.escapeRegExp(identifier)}\\b`);
    return pattern.test(code);
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  generateReport() {
    console.log('\n📊 CLEANUP REPORT');
    console.log('='.repeat(40));
    console.log(`📁 Files Processed: ${this.results.filesProcessed}`);
    console.log(`🧹 Files Cleaned: ${this.results.importsRemoved}`);
    console.log(`💾 Bytes Recovered: ${this.results.bytesRecovered.toLocaleString()}`);
    
    if (this.results.errors.length > 0) {
      console.log(`\n⚠️  Errors: ${this.results.errors.length}`);
      this.results.errors.forEach(error => {
        console.log(`   • ${error.file}: ${error.error}`);
      });
    }
    
    console.log('\n✨ Cleanup completed!');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const cleaner = new ImportCleaner();
  cleaner.cleanup().catch(console.error);
}

export { ImportCleaner };
