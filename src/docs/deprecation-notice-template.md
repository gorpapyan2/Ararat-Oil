# Deprecation Notice Template

## Component File JSDoc Template

```typescript
/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/feature-name/components/ComponentNameStandardized')}
 * 
 * Deprecation Date: [Date]
 * Planned Removal Date: [Date - typically 3-6 months later]
 * Migration Guide: [Link to documentation, if applicable]
 */
```

## Component-Level JSDoc Template

```typescript
/**
 * @deprecated This component is deprecated. Use ComponentNameStandardized instead.
 * See the feature components for the replacement.
 */
export function DeprecatedComponent() {
  console.warn(
    '[Deprecation Warning] DeprecatedComponent is deprecated. ' +
    'Use ComponentNameStandardized from @/features/feature-name/components instead. ' +
    'This component will be removed on [Removal Date].'
  );
  
  // Component implementation
}
```

## Console Warning Implementation

```typescript
// At the beginning of the component function
useEffect(() => {
  console.warn(
    '[Deprecation Warning] ComponentName is deprecated and will be removed after [Removal Date]. ' +
    'Please use ComponentNameStandardized from @/features/feature-name/components instead.'
  );
}, []);
```

## Bridge Component Template

For components that are imported in many places, creating a bridge component can minimize breaking changes:

```typescript
/**
 * @deprecated This component is a bridge to the standardized version. 
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/feature-name/components/ComponentNameStandardized')}
 */
import { ComponentNameStandardized } from '@/features/feature-name/components';

// Re-export the standardized component + issue warning
export function DeprecatedComponent(props) {
  console.warn(
    '[Deprecation Warning] DeprecatedComponent is deprecated. ' +
    'Use ComponentNameStandardized from @/features/feature-name/components instead. ' +
    'This component will be removed on [Removal Date].'
  );
  
  return <ComponentNameStandardized {...props} />;
}
```

## Implementation Guidelines

1. **Add File-Level JSDoc**: Add the file-level JSDoc at the top of the file.
2. **Add Component-Level JSDoc**: Add the component-level JSDoc right before the component definition.
3. **Implement Console Warning**: Add a useEffect hook with the console warning message.
4. **For Widely Used Components**: Consider creating a bridge component that re-exports the standardized component.
5. **Update Documentation**: Update migration guides to reference the deprecation timeline.

## Deprecation Timeline

- **Deprecation Date**: The date the deprecation notice is added.
- **Removal Date**: Typically 3-6 months after the deprecation date, depending on the component's usage.
- **Warning Period**: During this period, console warnings will help identify usages in development.
- **Removal**: After the removal date, the component will be deleted from the codebase.

## Tracking

Track deprecated components in a central document:

```markdown
| Component | Deprecated On | Removal Date | Replacement | Status |
|-----------|---------------|--------------|-------------|--------|
| `ComponentName` | YYYY-MM-DD | YYYY-MM-DD | `@/features/feature-name/components/ComponentNameStandardized` | Deprecated |
``` 