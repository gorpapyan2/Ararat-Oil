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

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

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

  async analyze() {
    console.log('🔍 Analyzing bundle size...\n');
    
    if (!fs.existsSync(this.buildDir)) {
      console.error('❌ Build directory not found. Run `npm run build` first.');
      process.exit(1);
    }

    await this.analyzeBuildFiles();
    await this.checkBudgets();
    await this.generateSuggestions();
    await this.printReport();
  }

  async analyzeBuildFiles() {
    const files = await this.getJavaScriptFiles(this.buildDir);
    
    for (const file of files) {
      const size = fs.statSync(file).size;
      const relativePath = path.relative(this.buildDir, file);
      
      this.results.files.push({
        path: relativePath,
        size,
        sizeFormatted: this.formatBytes(size)
      });
      
      this.results.totalSize += size;
    }

    // Sort by size (largest first)
    this.results.files.sort((a, b) => b.size - a.size);
  }

  async getJavaScriptFiles(dir) {
    let files = [];
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(await this.getJavaScriptFiles(fullPath));
      } else if (item.endsWith('.js') || item.endsWith('.mjs')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  async checkBudgets() {
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
    for (const file of this.results.files) {
      if (file.path.includes('chunk') && file.size > CONFIG.budgets.chunk) {
        this.results.violations.push({
          type: 'budget',
          file: file.path,
          message: `Chunk (${file.sizeFormatted}) exceeds budget (${this.formatBytes(CONFIG.budgets.chunk)})`
        });
      }
    }

    // Check total budget
    if (this.results.totalSize > CONFIG.budgets.total) {
      this.results.violations.push({
        type: 'budget',
        file: 'total',
        message: `Total bundle size (${this.formatBytes(this.results.totalSize)}) exceeds budget (${this.formatBytes(CONFIG.budgets.total)})`
      });
    }
  }

  async generateSuggestions() {
    // Suggest code splitting for large chunks
    for (const file of this.results.files) {
      if (file.size > 300 * 1024) { // 300KB
        this.results.suggestions.push({
          type: 'code-splitting',
          file: file.path,
          message: `Consider code splitting for ${file.path} (${file.sizeFormatted})`
        });
      }
    }

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

  async printReport() {
    console.log(`${COLORS.bold}${COLORS.cyan}📊 BUNDLE SIZE ANALYSIS REPORT${COLORS.reset}`);
    console.log('='.repeat(60));
    console.log();

    // Summary
    console.log(`${COLORS.bold}📈 SUMMARY:${COLORS.reset}`);
    console.log(`• Total Bundle Size: ${this.formatSize(this.results.totalSize)}`);
    console.log(`• Number of Files: ${this.results.files.length}`);
    console.log(`• Budget Status: ${this.results.violations.length === 0 ? 
                 `${COLORS.green}✅ Within budget${COLORS.reset}` : 
                 `${COLORS.red}❌ Over budget${COLORS.reset}`}`);
    console.log();

    // Largest files
    if (this.results.files.length > 0) {
      console.log(`${COLORS.bold}📦 LARGEST FILES:${COLORS.reset}`);
      this.results.files.slice(0, 10).forEach(file => {
        const sizeStr = this.formatSize(file.size);
        const percentage = ((file.size / this.results.totalSize) * 100).toFixed(1);
        console.log(`• ${file.path} (${sizeStr} - ${percentage}%)`);
      });
      console.log();
    }

    // Budget violations
    if (this.results.violations.length > 0) {
      console.log(`${COLORS.bold}⚠️  BUDGET VIOLATIONS:${COLORS.reset}`);
      this.results.violations.forEach(violation => {
        console.log(`• ${violation.type}: ${violation.message}`);
      });
      console.log();
    }

    // Optimization suggestions
    if (this.results.suggestions.length > 0) {
      console.log(`${COLORS.bold}💡 OPTIMIZATION SUGGESTIONS:${COLORS.reset}`);
      this.results.suggestions.forEach((suggestion, index) => {
        console.log(`${index + 1}. [${suggestion.priority}] ${suggestion.message}`);
        if (suggestion.details) {
          console.log(`   └─ ${suggestion.details}`);
        }
      });
      console.log();
    }

    // Performance impact
    this.printPerformanceImpact();
  }

  printPerformanceImpact() {
    console.log(`${COLORS.bold}⚡ PERFORMANCE IMPACT:${COLORS.reset}`);
    
    const totalSizeMB = this.results.totalSize / (1024 * 1024);
    
    // Estimate download times for different connection speeds
    const connectionSpeeds = {
      'Slow 3G': 0.4, // 400 Kbps
      'Fast 3G': 1.6, // 1.6 Mbps
      '4G': 5.0,      // 5 Mbps
      'WiFi': 25.0    // 25 Mbps
    };

    Object.entries(connectionSpeeds).forEach(([name, speedMbps]) => {
      const downloadTime = (totalSizeMB / speedMbps).toFixed(1);
      console.log(`• ${name}: ~${downloadTime}s download time`);
    });
    
    console.log();
    console.log(`${COLORS.bold}🎯 RECOMMENDATIONS:${COLORS.reset}`);
    
    if (totalSizeMB > 2) {
      console.log('• Consider implementing lazy loading for routes');
      console.log('• Use dynamic imports for large dependencies');
      console.log('• Enable tree shaking in your bundler');
    }
    
    if (totalSizeMB > 5) {
      console.log('• Break down large components into smaller chunks');
      console.log('• Consider using a CDN for large assets');
    }
  }

  formatSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async runAnalysis() {
    console.log('🔍 Starting bundle analysis...\n');
    
    try {
      // Check if build directory exists
      if (!fs.existsSync(this.buildDir)) {
        console.log(`${COLORS.yellow}⚠️  Build directory not found. Running build first...${COLORS.reset}`);
        try {
          execSync('npm run build', { stdio: 'inherit' });
        } catch (error) {
          console.error(`${COLORS.red}❌ Build failed:${COLORS.reset}`, error.message);
          return;
        }
      }

      await this.analyze();
      
      console.log(`${COLORS.green}✅ Bundle analysis completed!${COLORS.reset}`);
      
    } catch (error) {
      console.error(`${COLORS.red}❌ Analysis failed:${COLORS.reset}`, error.message);
    }
  }
}

// Run the analyzer if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('bundle-analyzer.mjs')) {
  const analyzer = new BundleAnalyzer();
  analyzer.runAnalysis().catch(console.error);
}

export default BundleAnalyzer; 