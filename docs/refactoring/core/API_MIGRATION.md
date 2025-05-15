# API Client Migration Guide

This document provides instructions for migrating from the old API client structure to the new core module structure.

## Overview

API client components have been migrated from `src/services/` to `src/core/api/` to improve organization, maintainability, and type safety. The migration includes:

1. Enhanced type safety with TypeScript interfaces
2. Improved error handling
3. Consistent response structure
4. Centralized configuration
5. Modular organization by endpoint
6. Unit testable design

## Migrated Components

### Core API Client
- **Old location**: `src/services/api.ts`
- **New location**: `src/core/api/client.ts`
- **Import**: `import { fetchFromFunction, ApiResponse } from '@/core/api';`

### Supabase Client
- **Old location**: `src/services/supabase.ts`
- **New location**: `src/core/api/supabase.ts`
- **Import**: `import { supabase } from '@/core/api';`

### API Endpoints
- **Old location**: Various files in `src/services/`
- **New location**: Files in `src/core/api/endpoints/`
- **Import**: `import { fuelSuppliesApi, shiftsApi, salesApi, employeesApi, fuelPricesApi, financialsApi } from '@/core/api';`

## Key Improvements

### Type-Safe Responses
All API functions now return a consistent `ApiResponse<T>` type that includes proper typing for data, errors, and metadata:

```typescript
export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  status?: number;
  metadata?: {
    requestId?: string;
    timestamp?: number;
    [key: string]: any;
  };
}
```

### Improved Error Handling
The API client now has structured error handling that categorizes errors into specific types:

```typescript
export enum API_ERROR_TYPE {
  NETWORK = 'network',
  TIMEOUT = 'timeout',
  SERVER = 'server',
  AUTH = 'auth',
  VALIDATION = 'validation',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  UNKNOWN = 'unknown',
}
```

### Centralized Configuration
All API configuration is now stored in `src/core/config/api.ts`, including base URLs, timeouts, and endpoints.

## Migration Steps

### Step 1: Update imports
Replace all imports from the old locations with imports from the new centralized export:

```typescript
// Before
import { fetchFromFunction } from '@/services/api';
import { supabase } from '@/services/supabase';
import { fuelSuppliesApi } from '@/services/api';
import { salesApi } from '@/services/api';
import { employeesApi } from '@/services/api';
import { fuelPricesApi } from '@/services/api';
import { financialsApi } from '@/services/api';

// After
import { fetchFromFunction, supabase, fuelSuppliesApi, salesApi, employeesApi, fuelPricesApi, financialsApi } from '@/core/api';
```

### Step 2: Update response handling
Update code that handles API responses to use the new structured response format:

```typescript
// Before
const { data, error } = await fuelSuppliesApi.getAll();
if (error) {
  console.error(error);
  return;
}
// Use data

// After
const response = await fuelSuppliesApi.getAll();
if (response.error) {
  // Error is now typed with specific error information
  const { type, message, status } = response.error;
  console.error(`Error (${type}): ${message}`);
  return;
}
// Use response.data
```

### Step 3: Use specific error handling
Take advantage of typed errors for better error handling:

```typescript
import { API_ERROR_TYPE } from '@/core/api';

const response = await fuelSuppliesApi.getAll();
if (response.error) {
  if (response.error.type === API_ERROR_TYPE.NETWORK) {
    // Show network error message
  } else if (response.error.type === API_ERROR_TYPE.AUTH) {
    // Redirect to login page
  } else {
    // Handle other errors
  }
}
```

## Testing After Migration

After updating imports, ensure that:

1. API calls still function correctly
2. Error handling works as expected
3. Authentication flows remain intact
4. Data fetching and mutations work properly

## Rollback Plan

If issues arise, you can temporarily switch back to the old services:

```typescript
// Rollback to old API client
import { fuelSuppliesApi } from '@/services/api';
```

## Next Steps

1. Complete the migration of all remaining endpoints from `src/services/` to `src/core/api/endpoints/`
2. Add unit tests for each endpoint
3. Update all imports in the application
4. Remove old files once all functionality has been verified
5. Update documentation for API usage 

## Usage Examples

### Basic API Usage

Here's a complete example of using the new API client structure:

```tsx
import React, { useEffect, useState } from 'react';
import { 
  fuelTypesApi, 
  getFuelSupplies, 
  ApiResponse, 
  FuelType, 
  API_ERROR_TYPE 
} from '@/core/api';

const FuelTypesComponent: React.FC = () => {
  const [fuelTypes, setFuelTypes] = useState<FuelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFuelTypes = async () => {
      setLoading(true);
      
      // Using the API object approach
      const response = await fuelTypesApi.getActive();
      
      if (response.error) {
        // Use the typed error
        if (response.error.type === API_ERROR_TYPE.NETWORK) {
          setError('Network error. Please check your internet connection.');
        } else if (response.error.type === API_ERROR_TYPE.AUTH) {
          setError('Authentication error. Please log in again.');
        } else {
          setError(`Error: ${response.error.message}`);
        }
      } else {
        // Access the strongly typed data
        setFuelTypes(response.data || []);
      }
      
      setLoading(false);
    };

    loadFuelTypes();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul>
        {fuelTypes.map(fuelType => (
          <li key={fuelType.id} style={{ color: fuelType.color }}>
            {fuelType.name} - ${fuelType.price_per_liter.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FuelTypesComponent;
```

### Using Direct Function Calls

Alternatively, you can use the individual function exports:

```tsx
// Using direct function import
import { getFuelTypes, FuelType, ApiResponse } from '@/core/api';

const loadFuelTypes = async (): Promise<FuelType[]> => {
  const response = await getFuelTypes();
  
  if (response.error) {
    console.error('Failed to load fuel types:', response.error);
    return [];
  }
  
  return response.data || [];
};
```

### Error Handling

The new API client provides improved error handling:

```tsx
import { tanksApi, API_ERROR_TYPE } from '@/core/api';

const handleApiError = (error: any) => {
  switch (error.type) {
    case API_ERROR_TYPE.NETWORK:
      // Handle network errors
      return 'Network error. Please check your connection.';
      
    case API_ERROR_TYPE.AUTH:
      // Handle auth errors, perhaps redirect to login
      return 'You need to log in again.';
      
    case API_ERROR_TYPE.VALIDATION:
      // Handle validation errors
      return `Validation error: ${error.message}`;
      
    case API_ERROR_TYPE.NOT_FOUND:
      // Handle not found errors
      return 'The requested resource was not found.';
      
    default:
      // Handle other errors
      return `An error occurred: ${error.message}`;
  }
};

// Example usage
const updateTank = async (id: string, data: any) => {
  const response = await tanksApi.update(id, data);
  
  if (response.error) {
    const errorMessage = handleApiError(response.error);
    showErrorToast(errorMessage);
    return false;
  }
  
  return true;
};
```

### Advanced Usage with React Query

The new API client works well with libraries like React Query:

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expensesApi, Expense } from '@/core/api';

// Query hook
export const useExpenses = () => {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const response = await expensesApi.getAll();
      if (response.error) throw response.error;
      return response.data || [];
    }
  });
};

// Mutation hook
export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (expenseData: Omit<Expense, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await expensesApi.create(expenseData);
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    }
  });
};

// Component usage
const ExpensesList = () => {
  const { data: expenses, isLoading, error } = useExpenses();
  const createExpenseMutation = useCreateExpense();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {/* Render expenses */}
      <button
        onClick={() => createExpenseMutation.mutate({
          category: 'Maintenance',
          amount: 100,
          description: 'Equipment repair',
          payment_status: 'paid',
          created_by: 'user-123'
        })}
      >
        Add Expense
      </button>
    </div>
  );
};
``` 