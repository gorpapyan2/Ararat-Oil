# State Management Migration Guide

This document provides instructions for migrating from the old state management structure to the new core module structure.

## Overview

State management components have been migrated from `src/store/` to `src/core/store/` to improve organization and maintainability. The migration includes:

1. Enhanced type safety with TypeScript's advanced features
2. Comprehensive documentation
3. Type-safe selectors for derived state
4. Consistent naming conventions
5. Centralized exports
6. Unit tests

## Migrated Components

### App Store
- **Old location**: `src/store/useAppStore.ts`
- **New location**: `src/core/store/appStore.ts`
- **Import**: `import { useAppStore, initThemeListener, selectToasts, ... } from '@/core/store';`

### Todo Store
- **Old location**: `src/store/useTodoStore.ts`
- **New location**: `src/core/store/todoStore.ts`
- **Import**: `import { useTodoStore, getFilteredTodos, selectActiveTodos, ... } from '@/core/store';`

## Type Improvements

### Constants with Const Assertions
We now use TypeScript's const assertions for better type safety:

```typescript
// Before
export type FilterType = "all" | "active" | "completed";

// After
export const FILTER_TYPES = ['all', 'active', 'completed'] as const;
export type FilterType = typeof FILTER_TYPES[number];
```

### Selectors Pattern
We added type-safe selectors to extract derived data from the state:

```typescript
// Type-safe selector
export const selectTotalTodos = (state: TodoState): number => 
  state.todos.length;

// Usage in components
const totalTodos = useAppStore(selectTotalTodos);
// or
const todoState = useTodoStore();
const totalTodos = selectTotalTodos(todoState);
```

## Migration Steps

### Step 1: Update imports
Replace all imports from the old locations with imports from the new centralized export:

```typescript
// Before
import { useAppStore } from '@/store/useAppStore';
import { useTodoStore } from '@/store/useTodoStore';

// After
import { useAppStore, useTodoStore } from '@/core/store';
```

### Step 2: Use the selectors for derived state
Use the new selectors instead of directly accessing and computing state:

```typescript
// Before
const todos = useTodoStore(state => state.todos);
const activeTodos = todos.filter(todo => !todo.completed).length;

// After
import { selectActiveTodos } from '@/core/store';
const activeTodos = useTodoStore(selectActiveTodos);
// Or with the state directly
const todoState = useTodoStore();
const activeTodos = selectActiveTodos(todoState);
```

### Step 3: Use the helper functions for more complex logic
The migration adds helper functions for complex operations:

```typescript
// Before
const filteredTodos = useMemo(() => {
  // Complex filtering & sorting logic
  return [...filtered].sort(/* complex sorting */);
}, [todos, filter, sort, search]);

// After
import { getFilteredTodos } from '@/core/store';
const todoState = useTodoStore();
const filteredTodos = getFilteredTodos(todoState);
```

### Step 4: Update config references
The app store now uses constants from the core config module:

```typescript
// Before
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
  .matches ? "dark" : "light";

// After (using constants)
const systemTheme = window.matchMedia(THEME_CONFIG.SYSTEM_DARK_MODE_QUERY)
  .matches ? THEME_CONFIG.THEME_CLASSES.DARK : THEME_CONFIG.THEME_CLASSES.LIGHT;
```

## Differences from Previous Implementation

### App Store
- Uses the Theme type from core config (`@/core/config`) instead of hardcoded values
- Uses theme constants from `THEME_CONFIG`
- Adds type-safe selectors for all state properties
- Extracts constants and improves documentation
- Includes comprehensive unit tests

### Todo Store
- Uses const assertions for types like FilterType, SortType, etc.
- Adds selectors for derived state (counts, filtered data, etc.)
- Adds helper functions like `getFilteredTodos` to centralize logic
- Improves code organization and documentation
- Includes comprehensive unit tests

## Testing After Migration

After updating imports, ensure that:

1. Theme switching still works correctly
2. Toast notifications appear properly
3. Sidebar collapse/expand functionality works
4. Todo operations continue to function as expected
5. Todo filtering, sorting, and searching work correctly
6. Run the unit tests to verify state management behavior: `npm test -- --testPathPattern=core/store`

## Rollback Plan

If issues arise, you can temporarily switch back to the old stores:

```typescript
// Rollback to old store
import { useAppStore } from '@/store/useAppStore';
```

## Next Steps

1. Update all remaining imports in the application to use the new centralized exports
2. Consider using the selector pattern more consistently across the application
3. Add additional tests for edge cases
4. Consider migrating to a more modular approach with slices for larger state needs
5. Document best practices for using the store in the codebase 