# Codebase Cleanup Recommendations

## Duplicate Code and Component Issues

### 1. Toast Implementation Duplication
- **Problem**: Two toast hooks implementations: `useToast.ts` and `use-toast.ts`
- **Recommendation**: Consolidate into a single implementation. The `use-toast.ts` appears to be from shadcn/ui while `useToast.ts` uses the app's store. Standardize on one approach.
- **Action**: Remove `use-toast.ts` and update all components to use `useToast.ts` since it appears to be integrated with the app's state management.

### 2. UI Components Duplication
- **Problem**: Duplicate card components in `src/components/ui/card.tsx` and `src/components/ui-custom/card.tsx`
- **Recommendation**: The custom card extends the base card. This pattern should be reviewed:
  - Either use a clear composition pattern where base components are in `ui/` and specialized versions in `ui-custom/`
  - Or consolidate into a single component with variants
- **Action**: Standardize approach across all UI components; consider documentation that explains the extension pattern.

### 3. Mobile Detection Duplication
- **Problem**: Multiple mobile detection hooks: `use-mobile.tsx` and `use-media-query.ts`
- **Recommendation**: Consolidate into a single, comprehensive responsive hook solution as mentioned in the TODO.ui-ux-accessibility.md file.
- **Action**: Keep `use-media-query.ts` as the core implementation and refactor `use-mobile.tsx` to use it.

## Folder Structure Issues

### 1. Inconsistent Component Naming
- **Problem**: Mixture of kebab-case and PascalCase for component files
- **Recommendation**: Standardize on a single naming convention (preferably kebab-case for files and PascalCase for components)
- **Action**: Refactor filenames to follow a consistent pattern.

### 2. UI Component Organization
- **Problem**: Spread of UI components across multiple directories with overlapping responsibilities
- **Recommendation**: Establish clear boundaries between base components, business domain components, and page-specific components
- **Action**: Create a component architecture document and refactor the directory structure accordingly.

## Unused Code and Dead Files

1. Check the imports of `ui/ThemeSwitcher.tsx` vs. root `ThemeToggle.tsx` component - potential duplication
2. `ui/use-toast.ts` is essentially a re-export that could be eliminated
3. `ui/ThemeShowcase.tsx` and `ui/ButtonShowcase.tsx` appear to be development files that might not be needed in production

## State Management Improvements

1. As mentioned in TODO.state-management.md, consider implementing Zustand for global state
2. Current approach with `useAppStore` appears inconsistent across features

## Best Practices to Implement

1. Implement comprehensive TypeScript types across the codebase
2. Address accessibility concerns in UI components as outlined in TODO files
3. Standardize form handling and validation
4. Implement consistent error handling strategies

## Immediate Clean-up Actions

1. Consolidate toast implementations
2. Merge mobile detection hooks
3. Address component naming consistency
4. Remove unused showcase components
5. Standardize on a single card implementation pattern

## Long-term Improvements

1. Implement global state management
2. Complete i18n integration
3. Enhance error handling and logging
4. Improve accessibility compliance 