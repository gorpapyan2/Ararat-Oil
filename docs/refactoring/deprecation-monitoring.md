# Deprecation Monitoring Guide

This document describes how we track and monitor the usage of deprecated components during our architecture refactoring.

## Monitoring Infrastructure

We've implemented a comprehensive monitoring system for deprecated components with the following features:

1. **Runtime Logging**: Console warnings in development environment
2. **Usage Tracking**: Anonymous usage statistics collected during development
3. **Build-time Analysis**: Static analysis during build process
4. **Dashboard Reporting**: Visualization of deprecated component usage

## Usage Tracking Implementation

### 1. Deprecation Logger Utility

The core of our monitoring system is the `logDeprecatedUsage` utility:

```typescript
// src/utils/deprecation.ts

interface DeprecationInfo {
  component: string;
  oldPath: string;
  newPath: string;
  removalDate: string;
}

// In-memory store for local development tracking
const usageTracker: Record<string, number> = {};

export function logDeprecatedUsage(info: DeprecationInfo): void {
  const { component, oldPath, newPath, removalDate } = info;
  
  // Track usage count
  if (!usageTracker[component]) {
    usageTracker[component] = 0;
  }
  usageTracker[component]++;

  // Log warning in development only
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[DEPRECATED] The component "${component}" imported from "${oldPath}" ` +
      `is deprecated and will be removed after ${removalDate}. ` +
      `Please update your import to "${newPath}".`
    );
  }

  // In development, send anonymous usage data for monitoring
  if (process.env.NODE_ENV === 'development') {
    sendAnonymousUsageData({
      type: 'deprecated-component',
      component,
      oldPath,
      count: usageTracker[component]
    });
  }
}

// Utility to get current usage stats (for development tools)
export function getDeprecationStats(): Record<string, number> {
  return { ...usageTracker };
}

// Send anonymous usage data to our internal tracking endpoint
function sendAnonymousUsageData(data: any): void {
  // Implementation details omitted for brevity
  // This sends anonymous usage data to a tracking endpoint
  // No personal information or code is transmitted
}
```

### 2. Bridge Component Integration

Every bridge component uses the logging utility:

```tsx
// src/components/transactions/TransactionList.tsx (BRIDGE COMPONENT)
import { TransactionList } from '@/features/finance/components/TransactionList';
import { logDeprecatedUsage } from '@/utils/deprecation';

if (process.env.NODE_ENV === 'development') {
  logDeprecatedUsage({
    component: 'TransactionList',
    oldPath: '@/components/transactions/TransactionList',
    newPath: '@/features/finance/components/TransactionList',
    removalDate: '2023-12-31'
  });
}

export default TransactionList;
```

## Monitoring Dashboard

For development and QA environments, we've added a hidden monitoring dashboard accessible at the `/dev/deprecation-stats` route (when in development mode).

### Implementation

```tsx
// src/features/dev/pages/DeprecationStats.tsx
import { useState, useEffect } from 'react';
import { getDeprecationStats } from '@/utils/deprecation';

export function DeprecationStatsPage() {
  const [stats, setStats] = useState<Record<string, number>>({});
  
  useEffect(() => {
    const updateStats = () => {
      setStats(getDeprecationStats());
    };
    
    // Update initially and every 5 seconds
    updateStats();
    const interval = setInterval(updateStats, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Deprecated Component Usage</h1>
      
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-2 border">Component</th>
            <th className="text-left p-2 border">Usage Count</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(stats).length > 0 ? (
            Object.entries(stats)
              .sort(([, countA], [, countB]) => countB - countA)
              .map(([component, count]) => (
                <tr key={component} className="border-b">
                  <td className="p-2 border">{component}</td>
                  <td className="p-2 border">{count}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={2} className="p-2 text-center">
                No deprecated components used yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
```

## Static Analysis

In addition to runtime monitoring, we use static analysis to detect deprecated imports during the build process.

### ESLint Rule

We've added a custom ESLint rule to detect deprecated imports:

```js
// eslint-config/rules/no-deprecated-imports.js
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Detect imports from deprecated paths',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    // Array of deprecated import paths and their replacements
    const deprecatedPaths = [
      { 
        old: '@/components/transactions', 
        new: '@/features/finance/components' 
      },
      // Additional mappings...
    ];

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        
        for (const pathMapping of deprecatedPaths) {
          if (importPath.startsWith(pathMapping.old)) {
            const newPath = importPath.replace(
              pathMapping.old, 
              pathMapping.new
            );
            
            context.report({
              node,
              message: `Import from deprecated path "${importPath}". ` +
                       `Use "${newPath}" instead.`,
              fix(fixer) {
                return fixer.replaceText(
                  node.source,
                  `'${newPath}'`
                );
              }
            });
            
            break;
          }
        }
      }
    };
  }
};
```

## Usage Reports

We generate weekly reports from our monitoring data to track migration progress:

1. **Most Frequently Used**: Components with highest usage counts
2. **Adoption Rate**: Percentage of codebase migrated to new paths
3. **Trend Analysis**: Usage patterns over time

## Enforcement Timeline

Our deprecation enforcement follows this timeline:

1. **Current Phase**: Warnings only (console logs in development)
2. **Intermediate Phase**: ESLint errors in CI pipeline
3. **Final Phase**: Build-time errors for deprecated imports

## Adding New Deprecations

To add monitoring for a newly deprecated component:

1. Create a bridge component at the old import path
2. Use the `logDeprecatedUsage` utility
3. Update the ESLint rule with the new path mapping
4. Add documentation to the migration guides 