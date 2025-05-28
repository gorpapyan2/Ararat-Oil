# File Structure Guidelines

## Overview

This document outlines the standard file structure and naming conventions for our codebase. Following these guidelines will ensure consistency, improve discoverability, and make the codebase more maintainable.

## Directory Structure

### Root Structure

```
src/
├── components/       # UI components
├── pages/            # Page components (routes)
├── hooks/            # Custom React hooks
├── lib/              # Core utilities and libraries
├── services/         # API and service functions
├── store/            # State management
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── styles/           # Global styles and theme
├── i18n/             # Internationalization files
├── test/             # Test utilities and setup
├── docs/             # Documentation
└── migrations/       # Migration utilities
```

### Components Directory

Components should be organized by function and responsibility:

```
components/
├── ui/               # Design system components
│   ├── primitives/   # Base components
│   ├── composed/     # Specialized components
│   └── __tests__/    # Component tests
├── features/         # Feature-specific components
│   ├── sales/        # Sales feature components
│   ├── expenses/     # Expenses feature components
│   └── etc.
├── layouts/          # Layout components
│   ├── dashboard/    # Dashboard layouts
│   ├── auth/         # Authentication layouts
│   └── etc.
└── shared/           # Shared/global components
    ├── navbar/       # Navigation components
    ├── footer/       # Footer components
    └── etc.
```

### Pages Directory

Pages should follow the route structure:

```
pages/
├── dashboard/        # Dashboard pages
├── settings/         # Settings pages
├── auth/             # Authentication pages
└── etc.
```

### Hooks Directory

Hooks should be organized by functionality:

```
hooks/
├── use-form/         # Form-related hooks
├── use-data/         # Data fetching hooks
├── use-ui/           # UI-related hooks
└── etc.
```

## Naming Conventions

### File Naming

1. **Component Files**:

   - Use PascalCase for React component files: `Button.tsx`, `DialogContent.tsx`
   - Use kebab-case for utility files: `form-utils.ts`, `date-helpers.ts`
   - Test files should match the file they're testing with `.test` or `.spec` suffix: `Button.test.tsx`

2. **Hook Files**:

   - Use kebab-case with `use-` prefix: `use-form.ts`, `use-local-storage.ts`

3. **Utility Files**:

   - Use kebab-case: `string-utils.ts`, `validation-helpers.ts`

4. **Type Files**:
   - Use kebab-case with descriptive names: `user-types.ts`, `api-responses.ts`

### Component Naming

1. **Component Names**:

   - Use PascalCase: `Button`, `Card`, `UserProfile`
   - Be descriptive and clear about the component's purpose
   - Prefix UI variants: `PrimaryButton`, `OutlineCard`

2. **Hook Names**:

   - Use camelCase with `use` prefix: `useForm`, `useLocalStorage`

3. **Function Names**:

   - Use camelCase: `formatDate`, `validateEmail`
   - Use verb prefixes for actions: `handleSubmit`, `fetchData`

4. **Type Names**:
   - Use PascalCase: `UserProfile`, `ApiResponse`
   - Use descriptive suffixes: `UserProfileProps`, `ThemeOptions`

## Import Order and Structure

Organize imports in the following order:

1. External libraries and frameworks
2. Internal modules from other directories
3. Components from the same directory
4. Types and interfaces
5. Assets and styles

Example:

```tsx
// External libraries
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// Internal modules
import { api } from "@/services/api";
import { useToast } from "@/hooks";

// Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Types and interfaces
import type { User, UserResponse } from "@/types";

// Assets and styles
import styles from "./styles.module.css";
```

## Documentation Guidelines

1. **Component Documentation**:

   - Include a JSDoc comment above each component
   - Document props using TypeScript interface comments
   - Provide examples for complex usage

2. **Function Documentation**:

   - Document parameters and return values
   - Explain side effects or important behavior

3. **Type Documentation**:
   - Document complex types
   - Explain constraints or requirements

## Cleanup Roadmap

Our cleanup efforts will proceed in phases:

### Phase 1: Directory Structure Standardization (1 week)

1. **Reorganize Component Directory**:

   - Move UI components to `components/ui/`
   - Create proper subdirectories for features
   - Update imports and ensure tests pass

2. **Create Missing Directories**:
   - Ensure all standard directories exist
   - Move files to appropriate locations

### Phase 2: File Naming Standardization (1 week)

1. **Rename Component Files**:

   - Update to follow PascalCase convention
   - Fix imports across the codebase
   - Verify functionality after changes

2. **Rename Utility Files**:
   - Update to follow kebab-case convention
   - Update imports and verify functionality

### Phase 3: Remove Duplicate and Deprecated Code (2 weeks)

1. **Identify Deprecated Components**:

   - Use imports analysis to find unused components
   - Create list of components targeted for removal

2. **Remove Showcase Components**:

   - Remove unused demonstration components
   - Update documentation as needed

3. **Consolidate Similar Components**:
   - Find and merge similar functionality
   - Create migration paths for consumers

### Phase 4: Documentation Updates (1 week)

1. **Update Component Documentation**:

   - Ensure all components have proper JSDoc comments
   - Update README files in directories

2. **Create Component Showcases**:
   - Update or create showcase pages
   - Ensure examples are current and functional

## Best Practices

### Component Organization

1. **Single Responsibility**:

   - Each component should do one thing well
   - Extract complex logic to custom hooks
   - Separate rendering from business logic

2. **Composability**:

   - Design components to be composed together
   - Use children props for flexible layouts
   - Avoid deeply nested component hierarchies

3. **Prop Consistency**:
   - Use consistent naming for similar props
   - Follow common patterns (e.g., `isOpen`, `onOpenChange`)
   - Use descriptive prop names

### Code Style

1. **Formatting**:

   - Use Prettier for consistent formatting
   - Follow ESLint rules
   - Maintain consistent indentation

2. **Comments**:

   - Comment complex logic or algorithms
   - Avoid unnecessary comments for clear code
   - Use JSDoc for public APIs

3. **Testing**:
   - Write tests for all components
   - Test edge cases and accessibility
   - Keep tests close to implementation

## Implementation Checklist

- [ ] Update ESLint and Prettier configuration
- [ ] Create script to analyze file structure
- [ ] Implement directory restructuring
- [ ] Update build process for new structure
- [ ] Create migration guides for team
- [ ] Update documentation with new standards
- [ ] Schedule reviews of restructured code

## Timeline

- **Phase 1**: 1 week (Directory Structure)
- **Phase 2**: 1 week (File Naming)
- **Phase 3**: 2 weeks (Code Cleanup)
- **Phase 4**: 1 week (Documentation)

Total: 5 weeks
