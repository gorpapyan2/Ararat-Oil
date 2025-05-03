# Standardization Next Steps

## Overview

This document outlines the remaining steps in our UI component standardization effort. Most of our standardization work is complete, with dialogs, tables, and forms successfully standardized. The remaining tasks focus on testing, documentation improvements, and a few minor component updates.

## Next Priorities (In Order)

### 1. Update Hooks Import Structure

**Status**: In Progress
**Description**: We need to ensure consistent importing from centralized hook files.
**Tasks**:
- [x] Review and update `useToast` import paths (change imports from @/hooks/useToast to @/hooks)
- [x] Update `toast` imports to use the same consistent pattern
- [ ] Fix type issues with toast `variant` properties
- [x] Create a `toast.d.ts` file to extend the ToastOptions type
- [x] Update `src/hooks/index.ts` to properly export useToast and toast

### 2. Add Testing for Standardized Components

**Status**: Not Started
**Description**: Add unit tests for our standardized components to ensure stability.
**Tasks**:
- [ ] Create test plan for standardized dialog components
- [ ] Write tests for core dialog components (StandardDialog, ConfirmDialog, AlertDialog)
- [ ] Write tests for dialog hooks (useDialog, useConfirmDialog, etc.)
- [ ] Create test plan for standardized form components
- [ ] Write tests for form field components (FormInput, FormSelect, etc.)
- [ ] Write tests for form hooks (useZodForm, useFormSubmitHandler)

### 3. Complete Component Documentation

**Status**: 90% Complete
**Description**: Finalize documentation for all standardized components.
**Tasks**:
- [ ] Update dialog documentation with controller pattern examples
- [ ] Add usage examples for nested dialogs
- [ ] Create interactive examples for table customization
- [ ] Add error handling documentation for forms
- [ ] Create comprehensive API reference for dialog controllers

### 4. Create Developer Guide for New Components

**Status**: Not Started
**Description**: Create a guide for developers to help them create new components that follow our standardization patterns.
**Tasks**:
- [ ] Document the component creation process
- [ ] Create templates for new standardized components
- [ ] Define conventions for naming, file structure, and imports
- [ ] Provide examples of proper standardized component implementation

### 5. Performance Optimization

**Status**: Not Started
**Description**: Review and optimize performance of standardized components.
**Tasks**:
- [ ] Audit render performance of dialog components
- [ ] Optimize table rendering for large datasets
- [ ] Add memoization where appropriate
- [ ] Implement virtualization for large tables

### 6. Implement Final Specialized Components

**Status**: Partially Complete
**Description**: Implement the remaining specialized components from our standardization plan.
**Tasks**:
- [ ] Implement nested dialog example
- [ ] Create dynamic content dialog example
- [ ] Design and implement infinite scroll table variant
- [ ] Create specialized form with dynamic field generation

## Completed Work

### Form Standardization
- Created MultiPaymentMethodFormStandardized as a standardized version of MultiPaymentMethodForm
- Updated Shifts.tsx and ShiftClose.tsx to use the new standardized form
- Updated form-standardization-status.md to include our work

### Hooks Import Structure
- Created toast.d.ts file to extend the ToastOptions type
- Updated hooks/index.ts to export both useToast and toast
- Updated useToast.ts to use the new types

## Detailed Implementation Plan

### Update Hooks Import Structure

1. First, check all files importing `useToast` to ensure they use the centralized import from `@/hooks`:
   ```typescript
   // Change this:
   import { useToast } from "@/hooks/useToast";
   
   // To this:
   import { useToast } from "@/hooks";
   ```

2. Update all direct `toast` imports to follow the same pattern:
   ```typescript
   // Change this:
   import { toast } from "@/hooks/useToast";
   
   // To this:
   import { toast } from "@/hooks";
   ```

3. Update `src/hooks/index.ts` to ensure it properly exports both `useToast` and `toast`:
   ```typescript
   export { useToast, toast } from './useToast';
   ```

4. Fix the `variant` property issues by extending the ToastOptions type:
   ```typescript
   // In src/types/toast.d.ts
   import { ToastOptions as OriginalToastOptions } from '@/components/ui/toast';
   
   export interface ToastOptions extends OriginalToastOptions {
     variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
   }
   ```

### Add Testing for Components

1. Set up test infrastructure:
   - Install and configure testing libraries (Jest, Testing Library)
   - Create test utilities and helpers

2. Create test plans:
   - Identify critical components to test
   - Define test coverage goals
   - Create test templates for consistent testing

3. Implement tests for core components:
   - Write tests for props, rendering, and accessibility
   - Test component state and user interactions
   - Test error handling and edge cases

### Complete Documentation

1. Review current documentation:
   - Identify gaps in current documentation
   - Verify accuracy of existing documentation
   - Check for consistency in documentation style

2. Create missing documentation:
   - Add examples for advanced use cases
   - Document component APIs in detail
   - Create troubleshooting guides

3. Improve existing documentation:
   - Add more code examples
   - Include best practices
   - Add visual diagrams where needed

## Timeline

- **Week 1-2**: Complete hooks import structure and fix toast type issues
- **Week 3-4**: Set up testing infrastructure and implement core tests
- **Week 5-8**: Complete documentation and create developer guides
- **Week 9-12**: Implement performance optimizations and specialized components

## Success Criteria

- All components use consistent import patterns
- Core components have at least 80% test coverage
- All standardized components have complete documentation
- Developer guide is available for new component creation
- Performance metrics show improvement in component rendering time 