# API Method Naming Standardization

This document defines the standard method naming conventions for all API modules in the core API.

## General Principles

1. Method names should be descriptive and follow a consistent pattern
2. Use HTTP verb prefixes (get, create, update, delete) followed by the entity name
3. Use plural for collection operations and singular for individual item operations
4. Export both individual functions and an API object with the same method names

## Standard Method Names

| Operation | Method Name | Example |
|-----------|-------------|---------|
| Get All | `getEntityName` | `getFuelPrices` |
| Get By ID | `getEntityNameById` | `getFuelPriceById` |
| Create | `createEntityName` | `createFuelPrice` |
| Update | `updateEntityName` | `updateFuelPrice` |
| Delete | `deleteEntityName` | `deleteFuelPrice` |
| Custom Query | `queryEntityName` | `queryFuelPrices` |

## Implementation Example

```typescript
// Individual exported functions
export async function getFuelPrices(): Promise<ApiResponse<FuelPrice[]>> {
  // implementation
}

export async function getFuelPriceById(id: string): Promise<ApiResponse<FuelPrice>> {
  // implementation
}

export async function createFuelPrice(data: FuelPriceCreate): Promise<ApiResponse<FuelPrice>> {
  // implementation
}

export async function updateFuelPrice(id: string, data: FuelPriceUpdate): Promise<ApiResponse<FuelPrice>> {
  // implementation
}

export async function deleteFuelPrice(id: string): Promise<ApiResponse<{ success: boolean }>> {
  // implementation
}

// API object with the same method names
export const fuelPricesApi = {
  getFuelPrices,
  getFuelPriceById,
  createFuelPrice,
  updateFuelPrice,
  deleteFuelPrice
};
```

## Migration Strategy

1. Update each API module to follow this naming convention
2. Update all components to use the new method names
3. Remove any deprecated aliases (like `getAll`)

## Benefits

- Consistent API method naming across the codebase
- Improved code readability and maintainability
- Easier to understand the purpose of each method
- Better IDE autocompletion and type safety 