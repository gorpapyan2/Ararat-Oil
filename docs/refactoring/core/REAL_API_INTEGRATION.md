# Real API Integration Challenges & Solutions

## Current Challenges

During our implementation of the real API integration, we identified several challenges that need to be addressed:

1. **API Method Naming Inconsistency**
   - Some API modules export methods like `getAll` while the underlying functions use names like `getFuelSupplies`
   - This inconsistency creates linter errors when components try to use these methods

2. **Type Incompatibility**
   - The `FuelSupply` type defined in the core API differs from the one used in components
   - Frontend components expect fields like `quantity_liters` while the API type uses `quantity`

3. **Query Parameter Support**
   - The current API implementation doesn't support passing query parameters to filter results
   - Backend services will need to be updated to handle filtering, pagination, and sorting

4. **Error Handling Variations**
   - Some components expect different error structures than what the API provides
   - Need consistent error handling across all components

## Implementation Plan

### 1. API Module Standardization

1. **Standardize API Module Exports**
   ```typescript
   // Before (inconsistent)
   export const fuelSuppliesApi = {
     getAll: getFuelSupplies,
     // other methods...
   };
   
   // After (standardized)
   export const fuelSuppliesApi = {
     getFuelSupplies,
     getFuelSupplyById,
     createFuelSupply,
     updateFuelSupply,
     deleteFuelSupply
   };
   ```

2. **Update Components to Use Correct Method Names**
   ```typescript
   // Before
   const response = await fuelSuppliesApi.getAll();
   
   // After
   const response = await fuelSuppliesApi.getFuelSupplies();
   ```

### 2. Type Adapter Pattern

Implement adapter functions to convert between API and frontend types:

```typescript
// Type adapter for fuel supplies
function adaptApiSupplyToFrontend(apiSupply: ApiFuelSupply): FrontendFuelSupply {
  return {
    id: apiSupply.id,
    provider_id: apiSupply.supplier_id,
    tank_id: apiSupply.tank_id || "",
    quantity_liters: apiSupply.quantity,
    price_per_liter: apiSupply.unit_price,
    total_cost: apiSupply.total_price,
    delivery_date: apiSupply.delivery_date,
    // Map other fields
  };
}

// Use in API functions
export async function getFuelSupplies(): Promise<ApiResponse<FrontendFuelSupply[]>> {
  const response = await fetchFromFunction<ApiFuelSupply[]>(ENDPOINT);
  
  if (response.data) {
    return {
      data: response.data.map(adaptApiSupplyToFrontend),
      metadata: response.metadata
    };
  }
  
  return response as ApiResponse<FrontendFuelSupply[]>;
}
```

### 3. Query Parameter Support

1. **Standardize Query Parameter Format**

   Define a consistent format for query parameters:

   ```typescript
   export interface QueryParams {
     search?: string;
     filter?: Record<string, any>;
     sort?: { field: string; direction: 'asc' | 'desc' };
     pagination?: { page: number; limit: number };
   }
   ```

2. **Update API Functions to Accept Query Parameters**

   ```typescript
   export async function getFuelSupplies(
     params?: QueryParams
   ): Promise<ApiResponse<FuelSupply[]>> {
     // Format params for the backend API
     const queryParams = formatQueryParams(params);
     
     return fetchFromFunction<FuelSupply[]>(ENDPOINT, { queryParams });
   }
   ```

3. **Implement Backend Support**

   Ensure the backend functions handle these parameters consistently.

### 4. Phased Rollout

To ensure a smooth transition to real API implementation:

1. **Mock API Phase**
   - Use mock data that matches the expected API response structure
   - Implement full interface but return canned responses

2. **Hybrid Phase**
   - Connect to real backend endpoints where available
   - Fall back to mock data for endpoints still under development

3. **Full API Phase**
   - Connect to all real backend endpoints
   - Remove mock fallbacks

### 5. Implementation Sequence

1. Read-only endpoints first (GET requests)
2. Create operations (POST requests)
3. Update operations (PUT/PATCH requests)
4. Delete operations (DELETE requests)

## Testing Strategy

1. **Unit Tests for API Modules**
   - Test each API function in isolation
   - Mock the fetchFromFunction to return expected responses

2. **Integration Tests**
   - Test the interaction between components and API modules
   - Use test doubles for the backend server

3. **End-to-End Tests**
   - Test the complete system with real API calls
   - Focus on critical user flows

## Error Handling Strategy

1. **Standardize Error Format**
   ```typescript
   export interface ApiError {
     message: string;
     code: string;
     details?: any;
   }
   ```

2. **Implement Consistent Error Handling**
   ```typescript
   try {
     const response = await api.getFuelSupplies();
     if (response.error) {
       // Handle API-level error
       handleApiError(response.error);
       return;
     }
     // Process data
   } catch (error) {
     // Handle unexpected errors
     handleUnexpectedError(error);
   }
   ```

## Conclusion

By addressing these challenges systematically, we can successfully transition from mock implementations to real API calls. The key is to maintain consistency in naming, types, and error handling while providing a smooth experience during the transition period. 