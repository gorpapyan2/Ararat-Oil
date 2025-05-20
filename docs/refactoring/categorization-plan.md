# Component Categorization Plan

## Current Analysis

After analyzing the codebase, we've identified:

- **347 uncategorized components** across various directories
- Multiple instances of component duplication between `src/components/` and `src/features/` directories
- UI components that should be moved to `src/core/components`
- Feature-specific components that should be in their respective feature directories
- Shared utility components that belong in `src/shared/components`

## Categorization Strategy

Based on the analysis, we'll categorize components into three main areas:

### 1. Core Components

Components that provide fundamental UI building blocks:

- All components in `src/components/ui` should be moved to `src/core/components/ui`
- UI primitives (`button.tsx`, `input.tsx`, etc.) should be in `src/core/components/ui/primitives`
- Composed UI components should be in `src/core/components/ui/composed`

### 2. Feature Components

Components specific to business features:

- Components in feature-specific directories (e.g., `src/components/fuel-supplies`) should be moved to `src/features/fuel-supplies/components`
- Feature mappings:
  - `dashboard` → `dashboard`
  - `transactions`, `expenses`, `shifts` → `finance`
  - `petrol-providers` → `petrol-providers`
  - `fuel-supplies` → `fuel-supplies`
  - `filling-systems` → `filling-systems`
  - `fuel` → `fuel`
  - `employees` → `employees`
  - `settings` → `auth`
  - `todo` → `todo`

### 3. Shared Components

Components used across multiple features:

- Components in `src/components/unified`, `src/components/dialogs`, `src/components/sidebar`, `src/components/enhanced`, `src/components/shared`, and `src/components/dev` should be moved to `src/shared/components`

## Implementation Phases

### Phase 1: Core UI Components

1. Create `src/core/components/ui` directory structure if it doesn't exist
2. Move all components from `src/components/ui` to `src/core/components/ui`
3. Organize into subdirectories (`primitives`, `composed`, `styled`)
4. Update imports to maintain backward compatibility

### Phase 2: Feature-Specific Components

1. For each feature domain:
   - Create feature directory if it doesn't exist
   - Move related components to the feature's components directory
   - Update imports across the codebase

2. Prioritize by business importance:
   - Finance components (transactions, expenses)
   - Fuel-related components (fuel supplies, petrol providers)
   - Employee management
   - Other feature areas

### Phase 3: Shared Components

1. Move remaining shared utility components to `src/shared/components`
2. Organize into logical subdirectories
3. Update imports

### Phase 4: Cleanup and Documentation

1. Remove any empty directories
2. Identify and resolve duplicate components
3. Update documentation
4. Add deprecation notices to bridge components
5. Create migration guide for developers

## Handling Duplication

Many components appear to exist in both `src/components/` and `src/features/` directories. For these:

1. Compare implementations to determine which is the canonical version
2. Keep the most up-to-date version in the correct location
3. Create bridge components for backward compatibility if needed
4. Add deprecation notices to legacy components

## Next Steps

1. **Core UI Migration**: Move all UI components to `src/core/components/ui`
2. **Feature Components**: Start with one feature area (e.g., finance) as a pilot
3. **Update Import Script**: Enhance the script to handle the more complex moves
4. **Integration Testing**: Test after each phase to ensure no regressions
5. **Documentation**: Update developer guidelines with new component organization

## Timeline

- Phase 1 (Core UI): 1-2 days
- Phase 2 (Feature Components): 3-5 days, depending on complexity
- Phase 3 (Shared Components): 1-2 days
- Phase 4 (Cleanup): 1-2 days

## Risks and Mitigations

- **Breaking Changes**: Use bridge components and gradual migration
- **Import Errors**: Comprehensive testing after each component move
- **Duplicate Logic**: Identify and consolidate duplicated code
- **Developer Confusion**: Provide clear documentation and communication 