#!/usr/bin/env node

/**
 * This script enhances monitoring of deprecated component usage by
 * adding an advanced tracking system that captures console warnings.
 * 
 * This enables developers to see which deprecated components are still
 * being used in the application and prioritize their replacement.
 * 
 * Usage: node scripts/monitor-deprecated-components.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Define feature mapping from component directory to feature directory
const FEATURE_MAPPING = {
  'dashboard': 'dashboard',
  'transactions': 'finance',
  'expenses': 'finance',
  'petrol-providers': 'petrol-providers',
  'fuel-supplies': 'fuel-supplies',
  'filling-systems': 'filling-systems',
  'fuel': 'fuel',
  'employees': 'employees',
  'settings': 'auth',
  'shifts': 'finance',
  'todo': 'todo'
};

async function enhanceDeprecationMonitoring() {
  console.log('🔍 Enhancing deprecation monitoring for bridge components...');
  
  // Find all bridge components
  const bridgeComponents = [];
  
  for (const [componentDir, featureDir] of Object.entries(FEATURE_MAPPING)) {
    try {
      // Check if the component directory exists
      try {
        await fs.access(path.join(rootDir, 'src', 'components', componentDir));
      } catch (error) {
        continue;
      }
      
      // Get all TypeScript files in the component directory
      const componentFiles = globSync(`src/components/${componentDir}/*.tsx`, { cwd: rootDir });
      
      for (const componentFile of componentFiles) {
        const sourceFile = path.join(rootDir, componentFile);
        const content = await fs.readFile(sourceFile, 'utf8');
        
        // Check if it's a bridge component
        const isBridgeComponent = 
          content.includes(`from "@/features/${featureDir}/components/`) || 
          content.includes(`from '@/features/${featureDir}/components/`);
        
        if (isBridgeComponent) {
          bridgeComponents.push(componentFile);
        }
      }
    } catch (error) {
      console.error(`Error processing ${componentDir}:`, error);
    }
  }
  
  console.log(`\nFound ${bridgeComponents.length} bridge components to enhance with monitoring.`);
  
  // Generate monitoring utils
  await generateMonitoringUtils();
  
  // Enhance bridge components with advanced monitoring
  const results = {
    enhanced: [],
    skipped: [],
    error: []
  };
  
  for (const componentFile of bridgeComponents) {
    try {
      const result = await enhanceBridgeComponent(componentFile);
      
      if (result.status === 'success') {
        results.enhanced.push(result.message);
        console.log(`✅ ${result.message}`);
      } else if (result.status === 'skip') {
        results.skipped.push(result.message);
        console.log(`⚠️ ${result.message}`);
      } else {
        results.error.push(result.message);
        console.log(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error(`Error enhancing ${componentFile}:`, error);
      results.error.push(`Error enhancing ${componentFile}: ${error.message}`);
    }
  }
  
  // Generate usage tracking component
  await generateUsageTrackingComponent();
  
  // Summary
  console.log('\n📊 Enhancement Summary:');
  console.log(`✅ Successfully enhanced: ${results.enhanced.length} components`);
  console.log(`⚠️ Skipped: ${results.skipped.length} components`);
  console.log(`❌ Errors: ${results.error.length}`);
  
  if (results.enhanced.length > 0) {
    console.log('\n✅ Successfully enhanced components:');
    results.enhanced.forEach(msg => console.log(`  - ${msg}`));
  }
  
  if (results.skipped.length > 0) {
    console.log('\n⚠️ Skipped components:');
    results.skipped.forEach(msg => console.log(`  - ${msg}`));
  }
  
  if (results.error.length > 0) {
    console.log('\n❌ Errors:');
    results.error.forEach(msg => console.log(`  - ${msg}`));
  }
  
  console.log('\n🧪 Monitoring is now enhanced. Follow these steps to use it:');
  console.log('1. Import the DeprecationTracker in your app entry point (main.tsx or App.tsx)');
  console.log('2. Use the component: <DeprecationTracker />')
  console.log('3. Open the browser console and check for the "Deprecation Usage Report" during development');
  console.log('4. Use localStorage.getItem("deprecation_usage") to access the recorded usage data');
}

async function generateMonitoringUtils() {
  console.log('\nGenerating monitoring utilities...');
  
  const monitoringUtil = `/**
 * Utilities for monitoring deprecated component usage
 * 
 * This module provides enhanced tracking and reporting of deprecated component usage
 * to help teams prioritize migration efforts.
 */

// Track component usage with timestamps
export const trackDeprecatedComponentUsage = (componentName, path, replacementPath) => {
  try {
    // Get existing tracking data
    const existingData = localStorage.getItem('deprecation_usage');
    const trackingData = existingData ? JSON.parse(existingData) : {};
    
    // Update component usage count and last used timestamp
    if (!trackingData[componentName]) {
      trackingData[componentName] = {
        path,
        replacementPath,
        usageCount: 0,
        firstUsed: new Date().toISOString(),
        lastUsed: null,
        usageDates: []
      };
    }
    
    trackingData[componentName].usageCount += 1;
    trackingData[componentName].lastUsed = new Date().toISOString();
    
    // Store last 10 usage dates for frequency analysis
    trackingData[componentName].usageDates.push(new Date().toISOString());
    if (trackingData[componentName].usageDates.length > 10) {
      trackingData[componentName].usageDates.shift();
    }
    
    // Save updated tracking data
    localStorage.setItem('deprecation_usage', JSON.stringify(trackingData));
    
    // Standard console warning with enhanced information
    console.warn(
      \`[Deprecation Warning] \${componentName} (\${path}) is deprecated. \` +
      \`Use \${replacementPath} instead. \` +
      \`This component will be removed on 2023-12-22. \` +
      \`Usage count: \${trackingData[componentName].usageCount}\`
    );
    
    // Every 10 usages, show a more detailed report in console
    if (trackingData[componentName].usageCount % 10 === 0) {
      console.groupCollapsed(\`🔍 Detailed usage report for \${componentName}\`);
      console.table({
        Component: componentName,
        Path: path,
        Replacement: replacementPath,
        'Usage Count': trackingData[componentName].usageCount,
        'First Used': trackingData[componentName].firstUsed,
        'Last Used': trackingData[componentName].lastUsed
      });
      console.groupEnd();
    }
  } catch (error) {
    // Fallback to standard console warning if tracking fails
    console.warn(
      \`[Deprecation Warning] \${componentName} (\${path}) is deprecated. \` +
      \`Use \${replacementPath} instead. \` +
      \`This component will be removed on 2023-12-22.\`
    );
  }
};

// Get a summary of all deprecated component usage
export const getDeprecationUsageSummary = () => {
  try {
    const existingData = localStorage.getItem('deprecation_usage');
    if (!existingData) return null;
    
    const trackingData = JSON.parse(existingData);
    
    // Transform data for reporting
    const summary = Object.entries(trackingData).map(([name, data]) => ({
      component: name,
      path: data.path,
      replacement: data.replacementPath,
      usageCount: data.usageCount,
      lastUsed: data.lastUsed,
      daysSinceLastUsage: data.lastUsed ? 
        Math.floor((new Date() - new Date(data.lastUsed)) / (1000 * 60 * 60 * 24)) : 
        'Never'
    }));
    
    // Sort by usage count (highest first)
    return summary.sort((a, b) => b.usageCount - a.usageCount);
  } catch (error) {
    console.error('Error getting deprecation usage summary:', error);
    return null;
  }
};

// Clear tracked usage data (for testing)
export const clearDeprecationUsageData = () => {
  localStorage.removeItem('deprecation_usage');
};
`;

  const utilsDir = path.join(rootDir, 'src', 'utils', 'deprecation');
  await fs.mkdir(utilsDir, { recursive: true });
  await fs.writeFile(path.join(utilsDir, 'tracking.ts'), monitoringUtil);
  
  console.log('✅ Generated tracking utilities at src/utils/deprecation/tracking.ts');
}

async function generateUsageTrackingComponent() {
  console.log('\nGenerating usage tracking component...');
  
  const trackingComponent = `/**
 * Component for tracking and reporting usage of deprecated components
 * 
 * This component doesn't render anything visible but provides a centralized
 * way to monitor and report on deprecated component usage throughout the app.
 */
import { useEffect } from 'react';
import { getDeprecationUsageSummary } from '@/utils/deprecation/tracking';

export const DeprecationTracker = () => {
  useEffect(() => {
    // Show deprecation usage report in development
    if (process.env.NODE_ENV === 'development') {
      const reportDeprecationUsage = () => {
        const summary = getDeprecationUsageSummary();
        
        if (summary && summary.length > 0) {
          console.groupCollapsed('📊 Deprecation Usage Report');
          console.table(summary);
          console.groupEnd();
          
          // Highlight the most used deprecated components
          const mostUsed = summary.slice(0, 3);
          if (mostUsed.length > 0) {
            console.log(
              '🚨 Migration Priority: These deprecated components are used most frequently and ' +
              'should be prioritized for migration:'
            );
            mostUsed.forEach(item => {
              console.log(\`  • \${item.component}: \${item.usageCount} uses, replace with \${item.replacement}\`);
            });
          }
        }
      };
      
      // Run the report on mount and then every 60 seconds if the app stays open
      reportDeprecationUsage();
      const intervalId = setInterval(reportDeprecationUsage, 60000);
      
      return () => clearInterval(intervalId);
    }
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default DeprecationTracker;
`;

  const componentsDir = path.join(rootDir, 'src', 'shared', 'components', 'dev');
  await fs.mkdir(componentsDir, { recursive: true });
  await fs.writeFile(path.join(componentsDir, 'DeprecationTracker.tsx'), trackingComponent);
  
  console.log('✅ Generated tracking component at src/shared/components/dev/DeprecationTracker.tsx');
}

async function enhanceBridgeComponent(componentFile) {
  const filePath = path.join(rootDir, componentFile);
  
  try {
    // Read the content of the file
    const content = await fs.readFile(filePath, 'utf8');
    
    // Check if monitoring is already implemented
    if (content.includes('@/utils/deprecation/tracking')) {
      return {
        status: 'skip',
        message: `${componentFile} already has enhanced monitoring`
      };
    }
    
    // Extract component name, path and replacement from the content
    const componentName = path.basename(componentFile, '.tsx');
    const componentPath = componentFile.replace('src/', '@/');
    
    // Find the feature import path
    const featurePathMatch = content.match(/from\s+["'](@\/features\/[^'"]+)["']/);
    if (!featurePathMatch) {
      return {
        status: 'error',
        message: `Could not find feature import path in ${componentFile}`
      };
    }
    
    const featurePath = featurePathMatch[1];
    
    // Update the import statements
    let updatedContent = content.replace(
      "import React, { useEffect } from \"react\";",
      "import React, { useEffect } from \"react\";\nimport { trackDeprecatedComponentUsage } from \"@/utils/deprecation/tracking\";"
    );
    
    // Replace the useEffect block with tracking
    const originalWarningRegex = /useEffect\(\s*\(\)\s*=>\s*{\s*console\.warn\([^;]+\);\s*},\s*\[\]\s*\);/;
    const enhancedWarning = `useEffect(() => {
    trackDeprecatedComponentUsage(
      "${componentName}",
      "${componentPath}",
      "${featurePath}"
    );
  }, []);`;
    
    updatedContent = updatedContent.replace(originalWarningRegex, enhancedWarning);
    
    // Create a backup
    await fs.writeFile(`${filePath}.before-monitoring`, content);
    
    // Write the updated content
    await fs.writeFile(filePath, updatedContent);
    
    return {
      status: 'success',
      message: `Enhanced monitoring for ${componentFile}`
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Error enhancing ${componentFile}: ${error.message}`
    };
  }
}

// Run the script
enhanceDeprecationMonitoring().catch(error => {
  console.error('Error enhancing deprecation monitoring:', error);
  process.exit(1);
}); 