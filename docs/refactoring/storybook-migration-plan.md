# Storybook Migration Plan

## Overview

This document outlines the plan to migrate Storybook stories from the central `src/stories` directory to a feature-based architecture, aligning with our current project structure.

## Current Structure

- `src/stories/` - All Storybook stories and components are centralized here
  - Button.stories.tsx
  - Card.stories.tsx
  - DatePicker.stories.tsx
  - DateRangePicker.stories.tsx
  - Header.stories.ts
  - Page.stories.ts
  - etc.

## Target Structure

Stories should be co-located with their respective components in the feature-based architecture:

```
src/
├── features/
│   ├── feature-name/
│   │   ├── components/
│   │   │   ├── ComponentName.tsx
│   │   │   └── ComponentName.stories.tsx
│   ├── shared/
│   │   ├── ui/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.stories.tsx
```

## Migration Steps

1. **Categorize Components**
   - Identify which feature each component belongs to
   - For general UI components, place them in `shared/ui`

2. **Create Stories Directory Structure**
   - Add `.stories.tsx` files next to their component implementations
   - Update imports to use proper feature-based paths

3. **Update Storybook Configuration**
   - Ensure Storybook can find stories in the new locations
   - Organize stories by feature in Storybook sidebar

4. **Implement Component Showcases**
   - Create feature-specific showcases for component demonstration
   - Update component-showcase route to display all migrated components

## Component Categorization

| Component | Target Location |
|-----------|----------------|
| Button | shared/ui/Button |
| Card | shared/ui/Card |
| DatePicker | shared/ui/DatePicker |
| DateRangePicker | shared/ui/DateRangePicker |
| Header | features/layout/components |
| Page | features/layout/components |

## Implementation Timeline

1. Create directory structure - Day 1
2. Migrate shared UI components - Day 1
3. Migrate feature-specific components - Day 2
4. Update Storybook configuration - Day 2
5. Test and verify - Day 3

## Accessibility and Design System Considerations

All migrated stories should maintain:
- Proper olive-lime color palette (#000000, #3E432E, #616F39, #A7D129)
- Accessibility standards
- Consistent component API

## Next Steps

1. Implement story migration for shared components
2. Create a shared component library with documentation
3. Update all feature components to use the shared components
4. Implement comprehensive Storybook documentation
