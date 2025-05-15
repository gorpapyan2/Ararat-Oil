# Type Adapter Pattern

## Overview

The Type Adapter pattern is used to convert between the core API types and the application types. This pattern is especially useful when the API response format differs from what the application components expect.

## Implementation

Type adapters are implemented in the `src/core/api/adapters` directory. Each adapter file contains functions for converting between the API types and application types.

### Directory Structure

```
src/core/api/
  ├── adapters/
  │   ├── index.ts            # Exports all adapters
  │   ├── employeeAdapter.ts  # Employee type adapters
  │   ├── profitLossAdapter.ts # Profit-Loss type adapters
  │   └── ... (other adapters)
  ├── endpoints/              # API endpoint functions
  ├── types.ts                # API type definitions
  └── index.ts                # Exports all API related functionality
```

## Example Adapter

Here's an example of an adapter for converting between API Employee and application Employee types:

```typescript
// src/core/api/adapters/employeeAdapter.ts
import { Employee as ApiEmployee } from '@/core/api/types';
import { Employee as AppEmployee, EmployeeStatus } from '@/types';

/**
 * Converts a core API Employee to the application Employee type
 */
export function adaptApiEmployeeToAppEmployee(apiEmployee: ApiEmployee): AppEmployee {
  // Map the API status string to the app's EmployeeStatus enum
  let status: EmployeeStatus = "active";
  
  if (apiEmployee.status === "on_leave") {
    status = "on_leave";
  } else if (apiEmployee.status === "inactive" || apiEmployee.status === "terminated") {
    status = "terminated";
  }

  return {
    id: apiEmployee.id,
    name: apiEmployee.name,
    position: apiEmployee.position,
    contact: apiEmployee.contact,
    salary: apiEmployee.salary,
    hire_date: apiEmployee.hire_date,
    status: status,
    created_at: apiEmployee.created_at
  };
}
```

## Usage in Components

Type adapters should be used in components that interact with the API. Here's an example of using the Employee adapter in a React component:

```typescript
import { useQuery } from "@tanstack/react-query";
import { employeesApi, adapters } from "@/core/api";

function EmployeeList() {
  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await employeesApi.getEmployees();
      // Use adapter to convert API response to application type
      return adapters.adaptApiEmployeesToAppEmployees(response.data || []);
    },
  });
  
  // Now 'employees' is of type AppEmployee[] and can be safely used with components
  // that expect that type
}
```

## Benefits

1. **Type Safety**: Ensures that components receive the expected types, preventing runtime errors.
2. **Separation of Concerns**: Keeps API type definitions separate from application type definitions.
3. **Flexibility**: Allows the API and application types to evolve independently.
4. **Maintainability**: Makes it easier to update the application when the API changes.

## Best Practices

1. **Keep Adapters Simple**: Adapters should only convert between types, not perform business logic.
2. **Use Explicit Naming**: Name adapter functions clearly to indicate the direction of conversion.
3. **Handle Edge Cases**: Ensure adapters handle null, undefined, and other edge cases gracefully.
4. **Create Bidirectional Adapters**: When possible, create adapters for both directions to support full CRUD operations.
5. **Use Type Guards**: If necessary, implement type guards to verify type conversions at runtime.

# Type Adapters Guide

## Overview

Type adapters provide a consistent way to convert between API data types and application data types. This conversion is necessary because:

1. The API types may have different property names than what components expect
2. Some properties may need transformation or formatting
3. Default values or fallbacks may need to be applied

## Available Adapters

The following type adapters are available:

- `employeeAdapter`: Converts between API Employee and application Employee types
- `profitLossAdapter`: Converts between API ProfitLoss and application ProfitLossSummary types
- `salesAdapter`: Converts between API Sale and application Sale types
- `expensesAdapter`: Converts between API Expense and application Expense types

## Importing Adapters

You can import the adapters from the core API module:

```typescript
import { adapters } from '@/core/api';
```

Or import specific adapter functions directly:

```typescript
import { 
  adaptApiEmployeeToAppEmployee, 
  adaptAppEmployeeToApiEmployee 
} from '@/core/api/adapters';
```

## Using Adapters

Each adapter provides functions to convert in both directions:

### API to App Conversion

Convert API data to application data format:

```typescript
// For a single item
const apiEmployee = await employeesApi.getEmployeeById(id);
const appEmployee = adapters.adaptApiEmployeeToAppEmployee(apiEmployee.data);

// For an array of items
const apiEmployees = await employeesApi.getEmployees();
const appEmployees = adapters.adaptApiEmployeesToAppEmployees(apiEmployees.data);
```

### App to API Conversion

Convert application data to API format (useful when sending data to the API):

```typescript
// For a single item
const appEmployee = { /* ... */ };
const apiEmployee = adapters.adaptAppEmployeeToApiEmployee(appEmployee);
await employeesApi.createEmployee(apiEmployee);

// For an array of items
const appEmployees = [ /* ... */ ];
const apiEmployees = adapters.adaptAppEmployeesToApiEmployees(appEmployees);
```

## Implementing a New Adapter

If you need to create a new adapter, follow these steps:

1. Create a new file in the `src/core/api/adapters` directory (e.g., `myEntityAdapter.ts`)
2. Implement adapter functions to convert in both directions
3. Export the adapter from the adapters index file (`src/core/api/adapters/index.ts`)

Here's a template for a new adapter:

```typescript
/**
 * Entity Type Adapter
 * 
 * This file provides adapter functions to convert between the core API Entity type
 * and the application's Entity type as defined in src/types/index.ts.
 */

import { Entity as ApiEntity } from '@/core/api/types';
import { Entity as AppEntity } from '@/types';

/**
 * Converts a core API Entity to the application Entity type
 */
export function adaptApiEntityToAppEntity(apiEntity: ApiEntity): AppEntity {
  return {
    // Map properties here
    id: apiEntity.id,
    // ...other properties
  };
}

/**
 * Converts an array of core API Entities to application Entity types
 */
export function adaptApiEntitiesToAppEntities(apiEntities: ApiEntity[]): AppEntity[] {
  return apiEntities.map(adaptApiEntityToAppEntity);
}

/**
 * Converts an application Entity to the core API Entity type
 */
export function adaptAppEntityToApiEntity(appEntity: AppEntity): Omit<ApiEntity, 'created_at' | 'updated_at'> {
  return {
    // Map properties here
    id: appEntity.id,
    // ...other properties
  };
}

/**
 * Converts an array of application Entities to core API Entity types
 */
export function adaptAppEntitiesToApiEntities(appEntities: AppEntity[]): Omit<ApiEntity, 'created_at' | 'updated_at'>[] {
  return appEntities.map(adaptAppEntityToApiEntity);
}
```

## Best Practices

1. Always handle missing or undefined properties
2. Provide sensible defaults for required properties
3. Apply type casts where necessary to ensure type safety
4. Add comments to explain any complex transformations
5. Write unit tests for each adapter function

## Testing Adapters

Unit tests for adapters should verify that properties are correctly mapped in both directions.
See the test files in `src/core/api/adapters/__tests__/` for examples. 