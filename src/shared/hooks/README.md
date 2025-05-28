# Shared Hooks Architecture

This directory contains shared hooks that can be used across the application. These hooks encapsulate common functionality and provide a consistent API for all features.

## Directory Structure

```
hooks/
├── base/               # Base hooks for fundamental UI patterns
│   ├── types.ts        # Common type definitions
│   ├── useBaseDialog.ts # Basic dialog functionality
│   └── useEntityDialog.ts # Extended dialog for CRUD operations
├── form/               # Form-related hooks
│   ├── useZodForm.ts   # React Hook Form + Zod integration
│   ├── useFormSubmitHandler.ts # Form submission utilities
│   ├── useFormValidation.ts # Form validation utilities
│   └── useCommonValidation.ts # Common validation patterns
├── ui/                 # UI-related hooks
│   └── useToast.ts     # Toast notification utilities
└── index.ts            # Main entry point that re-exports all hooks
```

## Usage Guidelines

### Base Hooks

Base hooks provide fundamental functionality that can be extended by feature-specific hooks.

```typescript
// Example: Using the base entity dialog hook
import { useEntityDialog } from "@/shared/hooks/base";

function useEmployeeDialog(options) {
  return useEntityDialog({
    entityName: "employee",
    ...options,
  });
}
```

### Form Hooks

Form hooks simplify form handling with validation and submission utilities.

```typescript
// Example: Using the Zod form hook
import { useZodForm } from "@/shared/hooks/form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
});

function MyForm() {
  const form = useZodForm({
    schema,
    defaultValues: {
      name: "",
      email: "",
    },
  });

  // Use the form with React Hook Form components
}
```

### UI Hooks

UI hooks provide utilities for common UI patterns.

```typescript
// Example: Using the toast hook
import { useToast } from "@/shared/hooks/ui";

function MyComponent() {
  const { toast, success, error } = useToast();

  const handleAction = () => {
    // Show a success toast
    success({
      title: "Success",
      description: "Operation completed successfully",
    });
  };
}
```

## Creating New Hooks

When creating new hooks:

1. Place them in the appropriate category folder
2. Follow the naming convention: `use[Feature][Pattern]`
3. Export them from the category's index.ts file
4. Add proper JSDoc documentation
5. Create examples in the HooksShowcase component

## Demo

To see these hooks in action, visit the [Hooks Showcase](/dev/hooks-showcase) page in the development tools section.
