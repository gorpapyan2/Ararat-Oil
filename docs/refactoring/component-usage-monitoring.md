# Monitoring Deprecated Component Usage

## Overview

This document outlines our approach to monitoring the usage of deprecated components during the transition period before their removal. Having visibility into which deprecated components are still being used allows us to prioritize migration efforts and ensure a smooth transition to the feature-based architecture.

## Monitoring Tools

We've implemented a comprehensive monitoring system that provides insights into deprecated component usage:

### 1. Console Warnings

All bridge components issue console warnings when they are used. These warnings:
- Identify the deprecated component
- Specify the recommended replacement
- Indicate the planned removal date
- Track usage frequency

### 2. Enhanced Tracking System

The enhanced tracking system provides detailed usage statistics:

- **Usage Counts**: How many times each deprecated component is used
- **First Used**: When the component was first encountered
- **Last Used**: Most recent usage timestamp
- **Usage Patterns**: Frequency analysis to help prioritize replacements

### 3. Centralized Usage Dashboard

The `DeprecationTracker` component provides a centralized dashboard in the console during development:

- Summary tables of all deprecated component usage
- Rankings of most frequently used components
- Migration priority recommendations
- Usage trends over time

## Implementation

### Setup

1. Run the monitoring enhancement script:
   ```
   node scripts/monitor-deprecated-components.js
   ```

2. Add the tracking component to your application entry point (e.g., `App.tsx`):
   ```tsx
   import DeprecationTracker from '@/shared/components/dev/DeprecationTracker';

   function App() {
     return (
       <>
         <DeprecationTracker />
         {/* Rest of your app */}
       </>
     );
   }
   ```

### Analyzing Results

Open your browser's console during development to see:

1. Individual deprecation warnings when deprecated components are used
2. Detailed usage reports every 10 usages of a component
3. The deprecation dashboard summary (refreshes every 60 seconds)

### Extracting Usage Data

To extract usage data for analysis or reporting:

```javascript
// In browser console
const usageData = localStorage.getItem('deprecation_usage');
const parsedData = JSON.parse(usageData);
console.table(parsedData);

// Or copy to clipboard
copy(parsedData);
```

## Monitoring Schedule

- **Daily Development**: Review console warnings during regular development
- **Weekly Review**: Analyze the usage dashboard to identify trends
- **Monthly Report**: Generate a comprehensive report of remaining deprecated components
- **Quarterly Planning**: Use usage data to prioritize remaining migrations

## Feature Flags

For components with high usage that can't be immediately migrated, consider implementing feature flags:

```tsx
// Example of feature flag for controlling deprecation
{process.env.ENABLE_DEPRECATED_WARNINGS && <DeprecationTracker />}
```

## Next Steps

1. **Analyze Initial Data**: After 1-2 weeks of development, analyze the collected data
2. **Prioritize High-Usage Components**: Focus migration efforts on frequently used components
3. **Update Documentation**: Document common migration patterns for high-use components
4. **Implement CI Checks**: Add CI checks that fail when new usage of deprecated components is detected

## Summary

This monitoring system provides visibility into deprecated component usage, helping us make data-driven decisions about migration priorities. By understanding which components are still being used and how frequently, we can ensure a smoother transition to our feature-based architecture while minimizing disruption to development workflows. 