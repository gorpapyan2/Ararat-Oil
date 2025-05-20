/**
 * Hook Standardization Verification Script
 * 
 * This script analyzes React Query hook implementations across the codebase
 * to verify they follow the standardization guidelines defined in:
 * docs/refactoring/hook-standardization-guide.md
 * 
 * Run with: node scripts/verify-hook-standards.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const SRC_DIR = path.resolve(__dirname, '../src');
const FEATURES_DIR = path.resolve(SRC_DIR, 'features');
const OUTPUT_FILE = path.resolve(__dirname, '../hook-standards-report.json');

// Standards to verify
const STANDARDS = {
  QUERY_KEYS_AS_ARRAYS: 'queryKeysAsArrays',
  PROPER_GENERICS: 'properGenerics',
  STALETIME_CONFIG: 'staleTimeConfig',
  COMBINED_STATES: 'combinedStates',
  CONSISTENT_RETURNS: 'consistentReturns'
};

// Colors for console output
const COLORS = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m'
};

// Verification results
const results = {
  summary: {
    totalHooks: 0,
    passedAllChecks: 0,
    issuesFound: 0
  },
  featureResults: {},
  issuesByType: {
    [STANDARDS.QUERY_KEYS_AS_ARRAYS]: [],
    [STANDARDS.PROPER_GENERICS]: [],
    [STANDARDS.STALETIME_CONFIG]: [],
    [STANDARDS.COMBINED_STATES]: [],
    [STANDARDS.CONSISTENT_RETURNS]: []
  }
};

// Create scripts directory if it doesn't exist
if (!fs.existsSync(path.dirname(OUTPUT_FILE))) {
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  console.log(`${COLORS.BLUE}Created scripts directory${COLORS.RESET}`);
}

/**
 * Get all feature directories
 */
function getFeatureDirectories() {
  try {
    return fs.readdirSync(FEATURES_DIR)
      .filter(dir => {
        const fullPath = path.join(FEATURES_DIR, dir);
        return fs.statSync(fullPath).isDirectory();
      });
  } catch (error) {
    console.error(`${COLORS.RED}Error reading features directory:${COLORS.RESET}`, error);
    return [];
  }
}

/**
 * Find hook files in a feature directory
 */
function findHookFiles(featureName) {
  const hooksDir = path.join(FEATURES_DIR, featureName, 'hooks');
  
  try {
    if (!fs.existsSync(hooksDir)) {
      return [];
    }
    
    return fs.readdirSync(hooksDir)
      .filter(file => {
        const fullPath = path.join(hooksDir, file);
        return fs.statSync(fullPath).isFile() && 
               (file.endsWith('.ts') || file.endsWith('.tsx')) &&
               !file.includes('.test.') &&
               !file.includes('.spec.');
      })
      .map(file => path.join(hooksDir, file));
  } catch (error) {
    console.error(`${COLORS.RED}Error finding hook files for ${featureName}:${COLORS.RESET}`, error);
    return [];
  }
}

/**
 * Read file content
 */
function readFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`${COLORS.RED}Error reading file ${filePath}:${COLORS.RESET}`, error);
    return '';
  }
}

/**
 * Simple pattern-based checks for hook standards
 */
function checkHookStandards(filePath, content) {
  const fileName = path.basename(filePath);
  const hookChecks = {
    [STANDARDS.QUERY_KEYS_AS_ARRAYS]: {
      pass: !content.includes("queryKey: '") && 
            !content.includes('queryKey: "') &&
            (content.includes('queryKey: [') || 
             content.includes('QUERY_KEYS')),
      details: 'Query keys should be defined as arrays, not strings'
    },
    
    [STANDARDS.PROPER_GENERICS]: {
      pass: (content.includes('useQuery<') || !content.includes('useQuery')) &&
            (content.includes('useMutation<') || !content.includes('useMutation')),
      details: 'useQuery and useMutation should include proper TypeScript generics'
    },
    
    [STANDARDS.STALETIME_CONFIG]: {
      pass: content.includes('staleTime:'),
      details: 'Queries should have a staleTime configuration'
    },
    
    [STANDARDS.COMBINED_STATES]: {
      pass: (content.includes('isLoading') || !content.includes('useQuery')) &&
            (content.includes('error') || !content.includes('useQuery')),
      details: 'Hooks should expose isLoading and error states'
    },
    
    [STANDARDS.CONSISTENT_RETURNS]: {
      pass: content.includes('return {') && !content.includes('return useQuery'),
      details: 'Hooks should return an object with consistent property names, not the direct query result'
    }
  };

  // Determine if all checks passed
  const allPassed = Object.values(hookChecks).every(check => check.pass);
  
  // Collect failed checks
  const failedChecks = Object.entries(hookChecks)
    .filter(([_, check]) => !check.pass)
    .map(([standardKey, check]) => ({
      standard: standardKey,
      details: check.details
    }));
  
  return {
    fileName,
    filePath,
    passedAllChecks: allPassed,
    checks: hookChecks,
    failedChecks
  };
}

/**
 * Verify a single feature's hooks
 */
function verifyFeatureHooks(featureName) {
  console.log(`\n${COLORS.CYAN}Verifying hooks for ${featureName} feature...${COLORS.RESET}`);
  
  const hookFiles = findHookFiles(featureName);
  if (hookFiles.length === 0) {
    console.log(`${COLORS.YELLOW}No hook files found for ${featureName}${COLORS.RESET}`);
    return {
      totalHooks: 0,
      passedAllChecks: 0,
      hookResults: []
    };
  }
  
  const hookResults = hookFiles.map(filePath => {
    const content = readFileContent(filePath);
    const checkResults = checkHookStandards(filePath, content);
    
    // Log results for this hook
    const statusColor = checkResults.passedAllChecks ? COLORS.GREEN : COLORS.RED;
    const status = checkResults.passedAllChecks ? 'PASSED' : 'FAILED';
    console.log(`${statusColor}${status}${COLORS.RESET} ${path.basename(filePath)}`);
    
    if (!checkResults.passedAllChecks) {
      checkResults.failedChecks.forEach(issue => {
        console.log(`  ${COLORS.RED}✗ ${issue.details}${COLORS.RESET}`);
      });
    }
    
    return checkResults;
  });
  
  const passedAllChecks = hookResults.filter(r => r.passedAllChecks).length;
  
  return {
    totalHooks: hookResults.length,
    passedAllChecks,
    hookResults
  };
}

/**
 * Update the package.json to add the verification script
 */
function updatePackageJson() {
  try {
    const packageJsonPath = path.resolve(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    if (!packageJson.scripts['verify-hooks']) {
      packageJson.scripts['verify-hooks'] = 'node scripts/verify-hook-standards.js';
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log(`${COLORS.GREEN}Added 'verify-hooks' script to package.json${COLORS.RESET}`);
    }
  } catch (error) {
    console.error(`${COLORS.RED}Error updating package.json:${COLORS.RESET}`, error);
  }
}

/**
 * Main function to run the verification
 */
function runVerification() {
  console.log(`${COLORS.MAGENTA}React Query Hook Standards Verification${COLORS.RESET}`);
  console.log('='.repeat(50));
  
  const featureNames = getFeatureDirectories();
  console.log(`Found ${featureNames.length} features to verify`);
  
  // Verify each feature
  let totalIssuesFound = 0;
  
  featureNames.forEach(featureName => {
    const featureResult = verifyFeatureHooks(featureName);
    results.summary.totalHooks += featureResult.totalHooks;
    results.summary.passedAllChecks += featureResult.passedAllChecks;
    
    results.featureResults[featureName] = featureResult;
    
    // Collect issues by type
    featureResult.hookResults.forEach(hookResult => {
      if (!hookResult.passedAllChecks) {
        hookResult.failedChecks.forEach(issue => {
          results.issuesByType[issue.standard].push({
            feature: featureName,
            file: hookResult.fileName,
            details: issue.details
          });
          totalIssuesFound++;
        });
      }
    });
  });
  
  results.summary.issuesFound = totalIssuesFound;
  
  // Print summary
  console.log('\n='.repeat(50));
  console.log(`${COLORS.MAGENTA}Verification Summary${COLORS.RESET}`);
  console.log(`Total hooks analyzed: ${results.summary.totalHooks}`);
  console.log(`Hooks passing all checks: ${results.summary.passedAllChecks}/${results.summary.totalHooks} (${Math.round(results.summary.passedAllChecks / results.summary.totalHooks * 100)}%)`);
  console.log(`Total issues found: ${totalIssuesFound}`);
  
  // Print issues by type
  console.log('\n='.repeat(50));
  console.log(`${COLORS.MAGENTA}Issues by Type${COLORS.RESET}`);
  
  Object.entries(results.issuesByType).forEach(([standard, issues]) => {
    if (issues.length > 0) {
      const standardName = standard
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
      
      console.log(`\n${COLORS.YELLOW}${standardName} (${issues.length} issues)${COLORS.RESET}`);
      issues.forEach(issue => {
        console.log(`  ${COLORS.RED}✗ ${issue.feature}/${issue.file}: ${issue.details}${COLORS.RESET}`);
      });
    }
  });
  
  // Write results to file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`\n${COLORS.GREEN}Report saved to ${OUTPUT_FILE}${COLORS.RESET}`);
  
  // Update package.json
  updatePackageJson();
}

// Run the verification
runVerification(); 