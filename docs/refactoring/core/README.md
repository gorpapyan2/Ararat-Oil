# Core API Module Documentation

## Overview
This directory contains the documentation for our standardized Core API Module. This module centralizes all API interactions into a well-structured, type-safe pattern with consistent error handling and internationalization.

## Quick Start
To use the Core API Module in a component:

```typescript
import { employeeApi, ApiResponse, Employee } from "@/core/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiNamespaces, getApiErrorMessage, getApiSuccessMessage } from "@/i18n/i18n";

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ["employees"],
  queryFn: employeeApi.getEmployees
});

// Create data
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: employeeApi.createEmployee,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["employees"] });
    // Use translation helper for success message
    toast({
      title: t("common.success"),
      description: getApiSuccessMessage(apiNamespaces.employees, 'create')
    });
  },
  onError: (error) => {
    // Use translation helper for error message
    toast({
      title: t("common.error"),
      description: getApiErrorMessage(apiNamespaces.employees, 'create'),
      variant: "destructive"
    });
  }
});
```

## Documentation

### Implementation Guides

1. [**API Standards**](./API_STANDARDS.md)
   - Core API Module structure and coding patterns
   - Naming conventions for methods and types
   - Error handling patterns
   - Integration with components

2. [**Type Adapters Guide**](./TYPE_ADAPTERS.md)
   - Understanding the adapter pattern
   - Implementing data transformations
   - Handling API to UI model conversions

3. [**Internationalization Guide**](./I18N_QUICKREF.md)
   - Using translation helpers for API messages
   - Implementing consistent error and success messages
   - Handling fallback texts

### Project Status

The [**Core API Migration Summary**](./FINAL_STEPS.md) provides a comprehensive overview of:
- Project achievements and progress
- Technical implementation details
- Pending items and next steps
- Lessons learned during the migration

## Directory Structure

The Core API Module is organized as follows:

```
src/core/api/
  ├── adapters/          # Type adapters for data transformation
  │   ├── employeeAdapter.ts
  │   ├── salesAdapter.ts
  │   └── ...
  ├── endpoints/         # API endpoint implementations
  │   ├── employees.ts
  │   ├── sales.ts
  │   └── ...
  ├── types/             # API-related type definitions
  │   ├── api-response.ts
  │   ├── employee.ts
  │   └── ...
  ├── utils/             # Utility functions for API operations
  ├── client.ts          # Base API client
  └── index.ts           # Main export file
```

## Getting Started with Development

1. **Creating a new API module**
   - Check out the [API Standards](./API_STANDARDS.md) for detailed guidance
   - Use existing modules as templates
   - Ensure consistent naming and error handling

2. **Running tests**
   - Unit tests are in `__tests__` directories
   - Run with `npm test`

3. **Updating documentation**
   - Keep this documentation up to date as changes are made
   - Add new findings and best practices to relevant guides 