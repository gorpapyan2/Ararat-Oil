# Fuel Supplies Feature

## Overview

The Fuel Supplies feature manages the tracking and recording of fuel deliveries to the gas station. It provides functionality for creating, viewing, updating, and deleting fuel supply records, as well as filtering and summarizing supply data.

## Feature Structure

```
src/features/fuel-supplies/
├── components/             # UI components specific to fuel supplies
│   ├── FuelSuppliesTable.tsx
│   ├── FuelSuppliesManagerStandardized.tsx
│   ├── FuelSuppliesFormStandardized.tsx
│   ├── ConfirmDeleteDialogStandardized.tsx
│   ├── ConfirmAddDialogStandardized.tsx
│   └── summary/
│       └── FuelSuppliesSummary.tsx
├── hooks/                  # Custom hooks for data operations and state management
│   ├── useFuelSupplies.ts
│   ├── useFuelSupplies.test.ts
│   └── useFuelSuppliesFilters.ts
├── services/               # API service functions
│   ├── index.ts
│   └── fuelSuppliesService.ts
├── types/                  # TypeScript type definitions
│   ├── index.ts
│   └── fuel-supplies.types.ts
└── index.ts                # Main feature exports
```

## Core Types

The feature defines the following key types:

```typescript
// FuelSupply - represents a single fuel supply record
export interface FuelSupply {
  id: string;
  delivery_date: string;
  provider_id: string;
  tank_id: string;
  quantity_liters: number;
  price_per_liter: number;
  total_cost: number;
  comments: string;
  shift_id: string;
  payment_method: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  // Relations (optional)
  provider?: {
    id: string;
    name: string;
  };
  tank?: {
    id: string;
    name: string;
    fuel_type: string;
  };
  employee?: {
    id: string;
    name: string;
  };
}

// Create and update request types
export type CreateFuelSupplyRequest = Omit<
  FuelSupply,
  "id" | "provider" | "tank" | "employee" | "created_at" | "updated_at"
>;

export type UpdateFuelSupplyRequest = Partial<CreateFuelSupplyRequest>;
```

## API Service

The feature provides a service layer that interfaces with the core API:

```typescript
export const fuelSuppliesService = {
  getFuelSupplies: (filters?: {...}) => Promise<FuelSupply[]>,
  createFuelSupply: (data: CreateFuelSupplyRequest) => Promise<FuelSupply>,
  updateFuelSupply: (id: string, data: UpdateFuelSupplyRequest) => Promise<FuelSupply>,
  deleteFuelSupply: (id: string) => Promise<{success: boolean}>
}
```

## React Query Hooks

### useFuelSupplies

The main hook for interacting with fuel supplies data:

```typescript
export function useFuelSupplies(filters?: FuelSuppliesFilters) {
  // Returns an object with:
  return {
    supplies: FuelSupply[],        // The current list of supplies
    isLoading: boolean,            // Loading state
    isError: boolean,              // Error state
    error: Error | null,           // Error object if any
    createSupply: MutationResult,  // Mutation for creating supplies
    updateSupply: MutationResult,  // Mutation for updating supplies
    deleteSupply: MutationResult   // Mutation for deleting supplies
  };
}
```

### useFuelSuppliesFilters

A hook for managing filters for fuel supplies:

```typescript
export function useFuelSuppliesFilters() {
  // Returns an object with:
  return {
    filters: FuelSuppliesFilters,        // Current filters
    updateFilters: (newFilters) => void, // Update filters
    resetFilters: () => void,            // Reset filters to default
    filterOptions: {...}                 // Available filter options
  };
}
```

## Components

### FuelSuppliesManagerStandardized

The main component for managing fuel supplies. It shows a table of supplies, provides filtering options, and handles CRUD operations.

```tsx
<FuelSuppliesManagerStandardized
  onRenderAction={(actionElement) => {...}}  // Optional callback for rendering action elements
/>
```

### FuelSuppliesTable

Displays a table of fuel supplies with sorting, pagination, and action buttons.

```tsx
<FuelSuppliesTable
  supplies={FuelSupply[]}
  onEdit={(id) => {...}}
  onDelete={(id) => {...}}
  isLoading={boolean}
/>
```

### FuelSuppliesFormStandardized

A form for creating or editing fuel supplies.

```tsx
<FuelSuppliesFormStandardized
  defaultValues={Partial<FuelSupply>}
  onSubmit={(data) => {...}}
  isSubmitting={boolean}
/>
```

## Usage Example

```tsx
import { useFuelSupplies, FuelSuppliesTable } from '@/features/fuel-supplies';

function FuelSuppliesPage() {
  const { 
    supplies, 
    isLoading,
    deleteSupply 
  } = useFuelSupplies();

  const handleDelete = async (id: string) => {
    await deleteSupply.mutateAsync(id);
  };

  return (
    <div>
      <h1>Fuel Supplies</h1>
      <FuelSuppliesTable
        supplies={supplies}
        isLoading={isLoading}
        onDelete={handleDelete}
      />
    </div>
  );
}
```

## Integration with Other Features

The Fuel Supplies feature integrates with:

1. **Tanks Feature** - Supplies are added to specific tanks
2. **Providers Feature** - Supplies are sourced from specific providers
3. **Shifts Feature** - Supplies are recorded during specific shifts
4. **Employees Feature** - Supplies are managed by specific employees

## Future Improvements

- Add server-side filtering and pagination
- Implement bulk operations (e.g., delete multiple supplies)
- Add advanced reporting and analytics
- Enhance error handling with more specific error messages
- Improve performance with optimistic updates 