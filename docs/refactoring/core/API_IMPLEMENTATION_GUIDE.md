# API Implementation Guide

This document provides guidelines for replacing mock API implementations with real API calls when backend services are ready.

## Transition Strategy

The current implementation uses mock data for some API endpoints. As backend services become available, these mock implementations should be replaced with actual API calls.

## Implementation Steps

1. **Identify Mock Implementations**

   Mock implementations typically return hardcoded data and are usually located in:
   - `src/core/api/services/*`
   - `src/core/api/endpoints/*`

2. **Update Endpoint Functions**

   For each mock implementation:
   
   ```typescript
   // Before (mock implementation)
   export const getSomeData = async (): Promise<ApiResponse<SomeData>> => {
     try {
       // Mock data
       const data = { id: "1", name: "Test" };
       return { data };
     } catch (error) {
       return { error: { message: "Error", type: API_ERROR_TYPE.UNKNOWN } };
     }
   };
   
   // After (real implementation)
   export const getSomeData = async (): Promise<ApiResponse<SomeData>> => {
     try {
       return await fetchFromFunction<SomeData>('some-data-endpoint');
     } catch (error) {
       return { 
         error: { 
           message: error instanceof Error ? error.message : "Unknown error",
           type: API_ERROR_TYPE.UNKNOWN 
         }
       };
     }
   };
   ```

3. **Parameter Mapping**

   Ensure query parameters and request body data match the backend API expectations:
   
   ```typescript
   export const getSomeData = async (
     filters?: SomeFilters
   ): Promise<ApiResponse<SomeData>> => {
     try {
       // Convert frontend filter format to API expected format
       const queryParams = {
         filter_type: filters?.type,
         start_date: filters?.dateRange?.from?.toISOString(),
         // ...more parameter mappings
       };
       
       return await fetchFromFunction<SomeData>(
         'some-data-endpoint', 
         { queryParams }
       );
     } catch (error) {
       // Error handling
     }
   };
   ```

4. **Response Type Mapping**

   If the API response structure differs from the expected frontend types, implement adapters:
   
   ```typescript
   export const getSomeData = async (): Promise<ApiResponse<FrontendType>> => {
     try {
       const response = await fetchFromFunction<ApiResponseType>('some-endpoint');
       
       // Transform API response to frontend expected format
       if (response.data) {
         const transformedData = transformApiResponse(response.data);
         return { data: transformedData };
       }
       
       return response;
     } catch (error) {
       // Error handling
     }
   };
   
   // Helper function to transform API response to frontend format
   function transformApiResponse(apiData: ApiResponseType): FrontendType {
     return {
       id: apiData.id,
       name: apiData.name,
       // Map other fields as needed
     };
   }
   ```

5. **Testing The Integration**

   Before deploying:
   
   - Implement unit tests for the new API calls
   - Test the integration in a development environment
   - Verify error handling works correctly
   - Check that all components using the API still function as expected

## Example: Implementing Fuel Management API

Below is a complete example of transitioning the Fuel Management dashboard API from mock to real implementation:

```typescript
// src/core/api/services/fuel-management.ts

import { FuelManagementSummary } from "@/types";
import { ApiResponse } from "../client";
import { API_ERROR_TYPE } from "@/core/config/api";
import { fetchFromFunction } from "../client";

interface FuelManagementFilters {
  dateRange?: { from: Date; to: Date };
  tankId?: string;
  fuelType?: string;
}

export const getFuelManagementSummary = async (
  filters?: FuelManagementFilters
): Promise<ApiResponse<FuelManagementSummary>> => {
  try {
    // Convert frontend filters to API expected format
    const queryParams: Record<string, any> = {};
    
    if (filters?.dateRange?.from && filters?.dateRange?.to) {
      queryParams.from_date = filters.dateRange.from.toISOString();
      queryParams.to_date = filters.dateRange.to.toISOString();
    }
    
    if (filters?.tankId) {
      queryParams.tank_id = filters.tankId;
    }
    
    if (filters?.fuelType && filters.fuelType !== 'all') {
      queryParams.fuel_type = filters.fuelType;
    }
    
    // Make the actual API call
    return await fetchFromFunction<FuelManagementSummary>(
      'fuel-management/dashboard', 
      { queryParams }
    );
  } catch (error) {
    console.error("Error fetching fuel management summary:", error);
    return { 
      error: { 
        message: error instanceof Error ? error.message : "Unknown error occurred",
        type: API_ERROR_TYPE.UNKNOWN
      } 
    };
  }
};
```

## Backward Compatibility

To maintain backward compatibility during transition:

1. Implement feature flags to toggle between mock and real implementations
2. Add fallback to mock data if API calls fail
3. Consider implementing a mock API server that matches the expected API contract

## Fallback Strategy

```typescript
export const getSomeData = async (): Promise<ApiResponse<SomeData>> => {
  try {
    // Try to fetch from real API
    const response = await fetchFromFunction<SomeData>('some-endpoint');
    return response;
  } catch (error) {
    console.error("API call failed, using mock data:", error);
    
    // Fallback to mock data
    if (process.env.NODE_ENV === 'development') {
      return { 
        data: MOCK_DATA,
        metadata: { isMockData: true }
      };
    }
    
    // In production, return the error
    return { 
      error: { 
        message: error instanceof Error ? error.message : "Unknown error",
        type: API_ERROR_TYPE.UNKNOWN 
      } 
    };
  }
};
```

By following these guidelines, the transition from mock data to real API implementation should be smooth and maintainable. 