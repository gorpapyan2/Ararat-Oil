#!/usr/bin/env node

/**
 * Bundle Size Analyzer
 * 
 * This script analyzes the built application to identify:
 * - Large chunks and their contents
 * - Potential tree-shaking opportunities
 * - Import optimization suggestions
 * - Performance budget violations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  budgets: {
    main: 2.5 * 1024 * 1024, // 2.5MB
    chunk: 400 * 1024,       // 400KB
    total: 3 * 1024 * 1024   // 3MB
  },
  thresholds: {
    warning: 0.05, // 5% size increase
    error: 0.10    // 10% size increase
  }
};

class BundleAnalyzer {
  constructor() {
    this.buildDir = path.join(process.cwd(), 'dist');
    this.results = {
      files: [],
      totalSize: 0,
      violations: [],
      suggestions: []
    };
  }

  analyze() {
    console.log('🔍 Analyzing bundle size...\n');
    
    if (!fs.existsSync(this.buildDir)) {
      console.error('❌ Build directory not found. Run `npm run build` first.');
      process.exit(1);
    }

    this.analyzeBuildFiles();
    this.checkBudgets();
    this.generateSuggestions();
    this.printReport();
  }

  analyzeBuildFiles() {
    const files = this.getJavaScriptFiles(this.buildDir);
    
    files.forEach(file => {
      const size = fs.statSync(file).size;
      const relativePath = path.relative(this.buildDir, file);
      
      this.results.files.push({
        path: relativePath,
        size,
        sizeFormatted: this.formatBytes(size)
      });
      
      this.results.totalSize += size;
    });

    // Sort by size (largest first)
    this.results.files.sort((a, b) => b.size - a.size);
  }

  getJavaScriptFiles(dir) {
    let files = [];
    
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(this.getJavaScriptFiles(fullPath));
      } else if (item.endsWith('.js') || item.endsWith('.mjs')) {
        files.push(fullPath);
      }
    });
    
    return files;
  }

  checkBudgets() {
    // Check main bundle budget
    const mainFile = this.results.files.find(f => 
      f.path.includes('index') && !f.path.includes('chunk')
    );
    
    if (mainFile && mainFile.size > CONFIG.budgets.main) {
      this.results.violations.push({
        type: 'budget',
        file: mainFile.path,
        message: `Main bundle (${mainFile.sizeFormatted}) exceeds budget (${this.formatBytes(CONFIG.budgets.main)})`
      });
    }

    // Check chunk budgets
    this.results.files.forEach(file => {
      if (file.path.includes('chunk') && file.size > CONFIG.budgets.chunk) {
        this.results.violations.push({
          type: 'budget',
          file: file.path,
          message: `Chunk (${file.sizeFormatted}) exceeds budget (${this.formatBytes(CONFIG.budgets.chunk)})`
        });
      }
    });

    // Check total budget
    if (this.results.totalSize > CONFIG.budgets.total) {
      this.results.violations.push({
        type: 'budget',
        file: 'total',
        message: `Total bundle size (${this.formatBytes(this.results.totalSize)}) exceeds budget (${this.formatBytes(CONFIG.budgets.total)})`
      });
    }
  }

  generateSuggestions() {
    // Suggest code splitting for large chunks
    this.results.files.forEach(file => {
      if (file.size > 300 * 1024) { // 300KB
        this.results.suggestions.push({
          type: 'code-splitting',
          file: file.path,
          message: `Consider code splitting for ${file.path} (${file.sizeFormatted})`
        });
      }
    });

    // Check for common optimization opportunities
    if (this.results.files.length > 10) {
      this.results.suggestions.push({
        type: 'chunking',
        message: 'Consider optimizing chunk splitting strategy - many small chunks detected'
      });
    }

    // Suggest tree-shaking analysis for large bundles
    if (this.results.totalSize > 2 * 1024 * 1024) { // 2MB
      this.results.suggestions.push({
        type: 'tree-shaking',
        message: 'Consider analyzing imports for tree-shaking opportunities'
      });
    }
  }

  printReport() {
    console.log('📊 Bundle Analysis Report\n');
    console.log('=' .repeat(50));
    
    // Summary
    console.log(`\n📦 Bundle Summary:`);
    console.log(`   Total Size: ${this.formatBytes(this.results.totalSize)}`);
    console.log(`   Files: ${this.results.files.length}`);
    console.log(`   Largest File: ${this.results.files[0]?.sizeFormatted || 'N/A'}`);

    // File breakdown
    console.log(`\n📄 Largest Files:`);
    this.results.files.slice(0, 10).forEach((file, index) => {
      const icon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📄';
      console.log(`   ${icon} ${file.path} - ${file.sizeFormatted}`);
    });

    // Budget violations
    if (this.results.violations.length > 0) {
      console.log(`\n⚠️  Budget Violations:`);
      this.results.violations.forEach(violation => {
        console.log(`   ❌ ${violation.message}`);
      });
    } else {
      console.log(`\n✅ All budgets are within limits!`);
    }

    // Suggestions
    if (this.results.suggestions.length > 0) {
      console.log(`\n💡 Optimization Suggestions:`);
      this.results.suggestions.forEach(suggestion => {
        console.log(`   💡 ${suggestion.message}`);
      });
    }

    // Performance grade
    const grade = this.calculateGrade();
    console.log(`\n🎯 Performance Grade: ${grade.letter} (${grade.score}/100)`);
    console.log(`   ${grade.message}`);
    
    console.log('\n' + '=' .repeat(50));
  }

  calculateGrade() {
    let score = 100;
    
    // Deduct points for budget violations
    score -= this.results.violations.length * 15;
    
    // Deduct points for large total size
    if (this.results.totalSize > CONFIG.budgets.total) {
      const excess = (this.results.totalSize - CONFIG.budgets.total) / CONFIG.budgets.total;
      score -= Math.min(excess * 20, 30);
    }
    
    // Deduct points for many chunks
    if (this.results.files.length > 15) {
      score -= 10;
    }
    
    score = Math.max(0, Math.round(score));
    
    let letter, message;
    if (score >= 90) {
      letter = 'A';
      message = 'Excellent bundle optimization!';
    } else if (score >= 80) {
      letter = 'B';
      message = 'Good bundle size, minor optimizations possible.';
    } else if (score >= 70) {
      letter = 'C';
      message = 'Acceptable bundle size, consider optimizations.';
    } else if (score >= 60) {
      letter = 'D';
      message = 'Bundle size needs improvement.';
    } else {
      letter = 'F';
      message = 'Critical bundle size issues need immediate attention.';
    }
    
    return { score, letter, message };
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run analyzer
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.analyze();
}

module.exports = BundleAnalyzer; 