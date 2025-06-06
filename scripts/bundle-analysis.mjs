#!/usr/bin/env node

/**
 * Bundle Size Analysis & Optimization Script
 * 
 * This script performs comprehensive analysis of the codebase to identify:
 * - Unused imports and dependencies
 * - Duplicate code patterns
 * - Large dependencies that could be optimized
 * - Bundle size optimization opportunities
 * - Code splitting potential
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class BundleAnalyzer {
  constructor() {
    this.projectRoot = process.cwd();
    this.srcPath = path.join(this.projectRoot, 'src');
    this.results = {
      unusedImports: [],
      duplicateCode: [],
      largeDependencies: [],
      optimizationOpportunities: [],
      summary: {}
    };
  }

  // Main analysis function
  async analyze() {
    console.log('🔍 Starting Bundle Analysis...\n');
    
    try {
      await this.analyzePackageJson();
      await this.scanSourceFiles();
      await this.findUnusedImports();
      await this.findDuplicateCode();
      await this.analyzeLucideIconUsage();
      await this.suggestOptimizations();
      await this.generateReport();
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
    }
  }

  // Analyze package.json for large dependencies
  async analyzePackageJson() {
    console.log('📦 Analyzing dependencies...');
    
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (!fs.existsSync(packagePath)) return;

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    // Check for commonly large dependencies
    const largeDeps = [
      'lodash', 'moment', 'rxjs', 'three', 'd3', 'chart.js',
      'react-router-dom', 'material-ui', 'antd'
    ];

    largeDeps.forEach(dep => {
      if (allDeps[dep]) {
        this.results.largeDependencies.push({
          name: dep,
          version: allDeps[dep],
          suggestion: this.getLargeDependencySuggestion(dep)
        });
      }
    });

    this.results.summary.totalDependencies = Object.keys(allDeps).length;
    console.log(`✅ Found ${Object.keys(allDeps).length} dependencies`);
  }

  // Scan all TypeScript/JavaScript files
  async scanSourceFiles() {
    console.log('📂 Scanning source files...');
    
    this.sourceFiles = [];
    await this.walkDirectory(this.srcPath);
    
    this.results.summary.totalFiles = this.sourceFiles.length;
    console.log(`✅ Scanned ${this.sourceFiles.length} source files`);
  }

  // Walk directory recursively
  async walkDirectory(dir) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        await this.walkDirectory(filePath);
      } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
        this.sourceFiles.push(filePath);
      }
    }
  }

  // Find unused imports
  async findUnusedImports() {
    console.log('🔍 Finding unused imports...');
    
    for (const filePath of this.sourceFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      const unusedImports = this.analyzeImports(content, filePath);
      
      if (unusedImports.length > 0) {
        this.results.unusedImports.push({
          file: path.relative(this.projectRoot, filePath),
          unused: unusedImports
        });
      }
    }
    
    console.log(`✅ Found ${this.results.unusedImports.length} files with unused imports`);
  }

  // Analyze imports in a file
  analyzeImports(content, filePath) {
    const lines = content.split('\n');
    const imports = [];
    const usedIdentifiers = new Set();
    
    // Extract imports
    for (const line of lines) {
      const importMatch = line.match(/import\s+(?:\{([^}]+)\}|\*\s+as\s+(\w+)|(\w+))\s+from\s+['"]([^'"]+)['"]/);
      if (importMatch) {
        if (importMatch[1]) {
          // Named imports
          const namedImports = importMatch[1].split(',').map(s => s.trim().replace(/\s+as\s+\w+/, ''));
          imports.push(...namedImports.map(name => ({ name: name.trim(), type: 'named', from: importMatch[4] })));
        } else if (importMatch[2]) {
          // Namespace import
          imports.push({ name: importMatch[2], type: 'namespace', from: importMatch[4] });
        } else if (importMatch[3]) {
          // Default import
          imports.push({ name: importMatch[3], type: 'default', from: importMatch[4] });
        }
      }
    }
    
    // Find used identifiers in the rest of the file
    const codeWithoutImports = content.replace(/import[^;]+;/g, '');
    for (const importItem of imports) {
      const regex = new RegExp(`\\b${importItem.name}\\b`, 'g');
      if (regex.test(codeWithoutImports)) {
        usedIdentifiers.add(importItem.name);
      }
    }
    
    // Return unused imports
    return imports.filter(imp => !usedIdentifiers.has(imp.name));
  }

  // Find duplicate code patterns
  async findDuplicateCode() {
    console.log('🔍 Finding duplicate code...');
    
    const codeBlocks = new Map();
    
    for (const filePath of this.sourceFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      // Look for duplicate code blocks (5+ lines)
      for (let i = 0; i < lines.length - 4; i++) {
        const block = lines.slice(i, i + 5).join('\n').trim();
        if (block.length > 100) { // Ignore small blocks
          const blockHash = this.hashCode(block);
          
          if (!codeBlocks.has(blockHash)) {
            codeBlocks.set(blockHash, []);
          }
          
          codeBlocks.get(blockHash).push({
            file: path.relative(this.projectRoot, filePath),
            startLine: i + 1,
            block: block.substring(0, 100) + '...'
          });
        }
      }
    }
    
    // Find duplicates
    for (const [hash, locations] of codeBlocks) {
      if (locations.length > 1) {
        this.results.duplicateCode.push({
          locations,
          suggestion: 'Consider extracting this into a reusable function or component'
        });
      }
    }
    
    console.log(`✅ Found ${this.results.duplicateCode.length} potential code duplications`);
  }

  // Analyze Lucide Icon usage
  async analyzeLucideIconUsage() {
    console.log('🎨 Analyzing Lucide icon usage...');
    
    const allIcons = new Set();
    const usedIcons = new Set();
    let totalIconImports = 0;
    
    for (const filePath of this.sourceFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Find lucide-react imports
      const lucideImports = content.match(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/g);
      if (lucideImports) {
        for (const importLine of lucideImports) {
          const icons = importLine.match(/\{([^}]+)\}/)[1]
            .split(',')
            .map(icon => icon.trim().replace(/\s+as\s+\w+/, ''));
          
          totalIconImports += icons.length;
          icons.forEach(icon => allIcons.add(icon.trim()));
          
          // Check which icons are actually used
          icons.forEach(icon => {
            const cleanIcon = icon.trim();
            const regex = new RegExp(`\\b${cleanIcon}\\b`, 'g');
            if (regex.test(content)) {
              usedIcons.add(cleanIcon);
            }
          });
        }
      }
    }
    
    const unusedIcons = Array.from(allIcons).filter(icon => !usedIcons.has(icon));
    
    if (unusedIcons.length > 0) {
      this.results.optimizationOpportunities.push({
        type: 'unused-icons',
        impact: 'medium',
        description: `${unusedIcons.length} unused Lucide icons found`,
        suggestion: 'Remove unused icon imports to reduce bundle size',
        details: unusedIcons
      });
    }
    
    if (totalIconImports > 20) {
      this.results.optimizationOpportunities.push({
        type: 'icon-optimization',
        impact: 'high',
        description: `${totalIconImports} icon imports found across ${allIcons.size} unique icons`,
        suggestion: 'Consider using a centralized icon system to improve tree-shaking',
        details: {
          totalImports: totalIconImports,
          uniqueIcons: allIcons.size,
          usedIcons: usedIcons.size
        }
      });
    }
    
    console.log(`✅ Analyzed ${totalIconImports} icon imports (${usedIcons.size} used, ${unusedIcons.length} unused)`);
  }

  // Suggest optimizations
  async suggestOptimizations() {
    console.log('💡 Generating optimization suggestions...');
    
    // Bundle splitting suggestions
    if (this.sourceFiles.length > 50) {
      this.results.optimizationOpportunities.push({
        type: 'code-splitting',
        impact: 'high',
        description: 'Large codebase detected',
        suggestion: 'Implement route-based code splitting with React.lazy()',
        details: `${this.sourceFiles.length} source files found`
      });
    }
    
    // Component optimization
    const pageComponents = this.sourceFiles.filter(file => 
      file.includes('Page.tsx') || file.includes('pages/')
    );
    
    if (pageComponents.length > 10) {
      this.results.optimizationOpportunities.push({
        type: 'lazy-loading',
        impact: 'medium',
        description: `${pageComponents.length} page components found`,
        suggestion: 'Implement lazy loading for page components',
        details: pageComponents.map(file => path.relative(this.projectRoot, file))
      });
    }
    
    // Large file detection
    for (const filePath of this.sourceFiles) {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n').length;
      
      if (lines > 500) {
        this.results.optimizationOpportunities.push({
          type: 'large-file',
          impact: 'medium',
          description: `Large file detected: ${path.relative(this.projectRoot, filePath)}`,
          suggestion: 'Consider breaking down into smaller components',
          details: `${lines} lines`
        });
      }
    }
    
    console.log(`✅ Generated ${this.results.optimizationOpportunities.length} optimization suggestions`);
  }

  // Generate comprehensive report
  async generateReport() {
    console.log('\n📊 BUNDLE ANALYSIS REPORT');
    console.log('='.repeat(50));
    
    // Summary
    console.log('\n📈 SUMMARY:');
    console.log(`• Total Source Files: ${this.results.summary.totalFiles}`);
    console.log(`• Total Dependencies: ${this.results.summary.totalDependencies}`);
    console.log(`• Files with Unused Imports: ${this.results.unusedImports.length}`);
    console.log(`• Code Duplications Found: ${this.results.duplicateCode.length}`);
    console.log(`• Optimization Opportunities: ${this.results.optimizationOpportunities.length}`);
    
    // Large Dependencies
    if (this.results.largeDependencies.length > 0) {
      console.log('\n📦 LARGE DEPENDENCIES:');
      this.results.largeDependencies.forEach(dep => {
        console.log(`• ${dep.name} (${dep.version})`);
        console.log(`  └─ ${dep.suggestion}`);
      });
    }
    
    // Optimization Opportunities
    if (this.results.optimizationOpportunities.length > 0) {
      console.log('\n💡 OPTIMIZATION OPPORTUNITIES:');
      this.results.optimizationOpportunities
        .sort((a, b) => this.getImpactScore(b.impact) - this.getImpactScore(a.impact))
        .forEach((opp, index) => {
          console.log(`${index + 1}. [${opp.impact.toUpperCase()}] ${opp.description}`);
          console.log(`   └─ ${opp.suggestion}`);
        });
    }
    
    // Unused Imports (top 10)
    if (this.results.unusedImports.length > 0) {
      console.log('\n🗑️  UNUSED IMPORTS (Top 10):');
      this.results.unusedImports.slice(0, 10).forEach(file => {
        console.log(`• ${file.file}:`);
        file.unused.forEach(imp => {
          console.log(`  └─ ${imp.name} from '${imp.from}'`);
        });
      });
      
      if (this.results.unusedImports.length > 10) {
        console.log(`  ... and ${this.results.unusedImports.length - 10} more files`);
      }
    }
    
    // Code Duplications (top 5)
    if (this.results.duplicateCode.length > 0) {
      console.log('\n📋 CODE DUPLICATIONS (Top 5):');
      this.results.duplicateCode.slice(0, 5).forEach((dup, index) => {
        console.log(`${index + 1}. Found in ${dup.locations.length} locations:`);
        dup.locations.forEach(loc => {
          console.log(`   • ${loc.file}:${loc.startLine}`);
        });
        console.log(`   └─ ${dup.suggestion}`);
      });
    }
    
    // Recommendations
    console.log('\n🎯 RECOMMENDED ACTIONS:');
    console.log('1. Remove unused imports to reduce bundle size');
    console.log('2. Implement centralized icon management system ✅ (Already created!)');
    console.log('3. Add route-based code splitting with React.lazy()');
    console.log('4. Extract duplicate code into reusable utilities');
    console.log('5. Consider lazy loading for large components');
    console.log('6. Use dynamic imports for conditional features');
    
    // Save detailed report
    const reportPath = path.join(this.projectRoot, 'bundle-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`\n💾 Detailed report saved to: ${reportPath}`);
    
    console.log('\n✨ Analysis completed!');
  }

  // Helper methods
  getLargeDependencySuggestion(dep) {
    const suggestions = {
      'lodash': 'Consider using individual lodash packages or native JS methods',
      'moment': 'Replace with date-fns or dayjs for smaller bundle size',
      'rxjs': 'Only import needed operators, use tree-shaking',
      'three': 'Use dynamic imports for 3D features',
      'd3': 'Import only needed D3 modules',
      'chart.js': 'Consider lighter alternatives like recharts',
      'react-router-dom': 'Use code splitting with route-based lazy loading',
      'material-ui': 'Import components individually, use tree-shaking',
      'antd': 'Import components individually, use babel-plugin-import'
    };
    
    return suggestions[dep] || 'Consider if this dependency is necessary';
  }

  getImpactScore(impact) {
    const scores = { high: 3, medium: 2, low: 1 };
    return scores[impact] || 0;
  }

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }
}

// Run analysis if called directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('bundle-analysis.mjs')) {
  const analyzer = new BundleAnalyzer();
  analyzer.analyze().catch(console.error);
}

export default BundleAnalyzer; 