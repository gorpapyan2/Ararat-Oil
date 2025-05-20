# Removing Legacy Components

This document outlines the process for safely removing legacy components after the migration period has ended.

## Prerequisites

Before removing any legacy components, ensure:

1. All feature migrations are complete
2. Deprecation monitoring shows zero or minimal usage
3. The removal date specified in the deprecation notices has passed
4. All tests pass with the new component structure

## Step-by-Step Removal Process

### 1. Final Usage Audit

Run a complete audit of the codebase to identify any remaining usages:

```bash
# Find all imports from the legacy component directories
grep -r "from '@/components/" --include="*.tsx" --include="*.ts" src/
```

For any remaining usages:
- Update imports to use the new component paths
- Test the changes to ensure functionality is preserved

### 2. Remove Bridge Components

Once all direct imports have been updated, remove the bridge components:

```bash
# Example: removing transaction components bridges
rm -rf src/components/transactions/
```

### 3. Run Type Checking and Tests

```bash
# Run TypeScript type checking
npx tsc --noEmit

# Run unit tests
npm test

# Run integration tests
npm run test:integration
```

### 4. Update ESLint Rules

Update the custom ESLint rule to error on any imports from removed directories:

```js
// eslint-config/rules/no-deprecated-imports.js
module.exports = {
  // ... existing configuration
  create(context) {
    // Array of completely removed paths
    const removedPaths = [
      '@/components/transactions',
      '@/components/expenses',
      // Add other removed paths
    ];

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        
        for (const path of removedPaths) {
          if (importPath.startsWith(path)) {
            context.report({
              node,
              message: `Import from removed path "${importPath}". This component has been completely removed.`
            });
            break;
          }
        }
        
        // ... existing checks
      }
    };
  }
};
```

### 5. Update Documentation

1. Update component documentation to remove references to legacy paths
2. Update migration documentation to indicate the completion of removal
3. Remove deprecation guides for removed components

## Rollback Plan

In case removing components causes unexpected issues:

1. Temporarily restore bridge components
2. Create a migration ticket to properly resolve the issue
3. Follow the deprecation process again with a new removal date

## Complete Cleanup

After confirming that all components have been successfully migrated and no issues have arisen:

1. Remove the entire legacy components directory:

```bash
# Backup just in case
cp -r src/components src/components.bak

# Remove the directory
rm -rf src/components

# Commit changes
git add src/
git commit -m "chore: remove legacy components directory after migration"
```

2. Update build configurations to remove any special handling for legacy components

3. Remove deprecation monitoring code if no longer needed:
   - Remove the monitoring dashboard
   - Simplify the deprecation utilities

## Post-Removal Verification

After removal, verify:

1. All builds succeed without errors
2. All tests pass
3. The application functions correctly in development and production
4. Documentation is up to date

## Timeline

For a smooth transition, follow this timeline:

1. **Week 1**: Audit remaining usages and update imports
2. **Week 2**: Remove bridge components in small batches, testing after each batch
3. **Week 3**: Update linting rules and documentation
4. **Week 4**: Complete final cleanup and verification

## Troubleshooting

If issues arise during removal:

1. Check application logs for runtime errors
2. Verify that all imports have been updated correctly
3. Look for dynamic imports or lazy-loaded components that might still reference old paths
4. Check for references in test files or storybook configurations 