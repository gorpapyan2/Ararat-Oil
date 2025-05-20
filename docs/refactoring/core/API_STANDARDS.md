# API Implementation Standards

## Overview
This document outlines the standards and best practices for API implementation in our application, based on lessons learned during the core API migration project.

## API Module Structure

### Directory Organization
All API modules must be located in the centralized structure:
```
src/core/api/
  ├── adapters/         # Type adapters for data transformation
  ├── endpoints/        # API endpoint implementations
  ├── types/            # API-related type definitions
  ├── utils/            # Utility functions for API operations
  └── index.ts          # Main export file
```

### Endpoint Implementation
Each API module should follow this pattern:

```typescript
// src/core/api/endpoints/example.ts
import { ApiResponse } from "../types/api-response";
import { client } from "../client";
import { ExampleItem } from "../types/example";
import { exampleAdapter } from "../adapters/exampleAdapter";

export const exampleApi = {
  // Get all items with optional filters
  getExamples: async (filters?: ExampleFilters): Promise<ApiResponse<ExampleItem[]>> => {
    try {
      const response = await client.get("/examples", { params: filters });
      return {
        data: response.data.map(exampleAdapter.fromApiData),
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Unknown error occurred")
      };
    }
  },

  // Get a single item by ID
  getExampleById: async (id: string): Promise<ApiResponse<ExampleItem>> => {
    try {
      const response = await client.get(`/examples/${id}`);
      return {
        data: exampleAdapter.fromApiData(response.data),
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Unknown error occurred")
      };
    }
  },

  // Create a new item
  createExample: async (example: CreateExampleRequest): Promise<ApiResponse<ExampleItem>> => {
    try {
      const apiData = exampleAdapter.toApiData(example);
      const response = await client.post("/examples", apiData);
      return {
        data: exampleAdapter.fromApiData(response.data),
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Unknown error occurred")
      };
    }
  },

  // Update an existing item
  updateExample: async (id: string, example: UpdateExampleRequest): Promise<ApiResponse<ExampleItem>> => {
    try {
      const apiData = exampleAdapter.toApiData(example);
      const response = await client.put(`/examples/${id}`, apiData);
      return {
        data: exampleAdapter.fromApiData(response.data),
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Unknown error occurred")
      };
    }
  },

  // Delete an item
  deleteExample: async (id: string): Promise<ApiResponse<boolean>> => {
    try {
      await client.delete(`/examples/${id}`);
      return {
        data: true,
        error: null
      };
    } catch (error) {
      return {
        data: false,
        error: error instanceof Error ? error : new Error("Unknown error occurred")
      };
    }
  }
};
```

## Naming Conventions

### API Method Names
Methods should follow the entity-based naming pattern:

| Operation | Pattern | Example |
|-----------|---------|---------|
| List/Get All | `get<Entity>s` | `getEmployees()` |
| Get One | `get<Entity>ById` | `getEmployeeById(id)` |
| Create | `create<Entity>` | `createEmployee(data)` |
| Update | `update<Entity>` | `updateEmployee(id, data)` |
| Delete | `delete<Entity>` | `deleteEmployee(id)` |
| Custom | `<verb><Entity>` | `activateEmployee(id)` |

### Type Definitions
Types should be defined with clear naming patterns:

```typescript
// Base entity type
export interface Employee {
  id: string;
  name: string;
  // ...other properties
}

// Request types
export interface CreateEmployeeRequest {
  name: string;
  // ...other properties (no id)
}

export interface UpdateEmployeeRequest {
  name?: string;
  // ...other properties (all optional, no id)
}

// Response wrapper
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}
```

## Type Adapters

Type adapters should be implemented when the API response structure differs from the UI model:

```typescript
// src/core/api/adapters/exampleAdapter.ts
import { Example, ExampleApiResponse } from "../types/example";

export const exampleAdapter = {
  // Convert API data to UI model
  fromApiData: (apiData: ExampleApiResponse): Example => {
    return {
      id: apiData.id,
      name: apiData.name || "Unnamed",
      createdAt: new Date(apiData.created_at),
      // ...transform other fields
    };
  },

  // Convert UI model to API data format
  toApiData: (uiData: Partial<Example>): Partial<ExampleApiResponse> => {
    const result: Partial<ExampleApiResponse> = {};
    
    if (uiData.name !== undefined) {
      result.name = uiData.name;
    }
    
    // ...transform other fields
    
    return result;
  }
};
```

## Internationalization

All API-related messages should use the translation helpers:

```typescript
import { apiNamespaces, getApiErrorMessage, getApiSuccessMessage } from "@/i18n/i18n";

// Error message
const errorMessage = getApiErrorMessage(apiNamespaces.employees, 'create');

// Success message
const successMessage = getApiSuccessMessage(apiNamespaces.employees, 'update', 'employee');

// Action label
const actionLabel = getApiActionLabel(apiNamespaces.employees, 'list');
```

Important notes:
- The namespace must exactly match the API endpoint name (e.g., `apiNamespaces.finances` not `apiNamespaces.finance`)
- Always provide fallback text in components for cases where translations aren't available

## Component Integration

When using API modules in components:

```typescript
import { employeeApi } from "@/core/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiNamespaces, getApiErrorMessage, getApiSuccessMessage } from "@/i18n/i18n";

// In a React component:
const { data, isLoading, error } = useQuery({
  queryKey: ["employees"],
  queryFn: employeeApi.getEmployees
});

const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: employeeApi.createEmployee,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["employees"] });
    toast({
      title: t("common.success"),
      description: getApiSuccessMessage(apiNamespaces.employees, 'create', 'employee')
    });
  },
  onError: (error) => {
    toast({
      title: t("common.error"),
      description: getApiErrorMessage(apiNamespaces.employees, 'create', 'employee'),
      variant: "destructive"
    });
  }
});
```

## Testing

Each API module should have comprehensive tests:

```typescript
// src/core/api/endpoints/__tests__/example.test.ts
import { exampleApi } from "../example";
import { client } from "../../client";

// Mock the client
jest.mock("../../client");
const mockClient = client as jest.Mocked<typeof client>;

describe("Example API", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("getExamples", () => {
    it("should return examples when successful", async () => {
      // Arrange
      const mockData = [{ id: "1", name: "Test" }];
      mockClient.get.mockResolvedValueOnce({ data: mockData });

      // Act
      const result = await exampleApi.getExamples();

      // Assert
      expect(result.data).toHaveLength(1);
      expect(result.error).toBeNull();
      expect(mockClient.get).toHaveBeenCalledWith("/examples", { params: undefined });
    });

    it("should handle errors", async () => {
      // Arrange
      const mockError = new Error("Network error");
      mockClient.get.mockRejectedValueOnce(mockError);

      // Act
      const result = await exampleApi.getExamples();

      // Assert
      expect(result.data).toBeNull();
      expect(result.error).toBe(mockError);
    });
  });

  // Additional tests for other methods...
});
```

## Common Pitfalls to Avoid

1. **Inconsistent Naming**: Always use the entity-based naming convention for methods.
2. **Missing Error Handling**: Every API call should include proper error handling.
3. **Incomplete Type Definitions**: Ensure all types are properly defined and imported.
4. **Hardcoded Messages**: Never hardcode error or success messages; use translation helpers.
5. **Direct API Access**: Always use the API modules rather than directly calling the client.
6. **Missing Adapters**: Use adapters when transforming between API and UI data models.
7. **Namespace Mismatches**: Ensure translation namespaces exactly match the API endpoint names. 