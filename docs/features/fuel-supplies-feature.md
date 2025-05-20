# Fuel Supplies Feature

## Overview

The Fuel Supplies feature manages all aspects of fuel deliveries to the station, including recording purchases from providers, tracking inventory changes, and managing the financial aspects of fuel supply.

## Structure

The feature follows the standard feature-based architecture with the following components:

```
src/features/fuel-supplies/
├── components/             # UI components
│   ├── FuelSuppliesManagerStandardized.tsx
│   ├── FuelSuppliesFormStandardized.tsx
│   ├── FuelSuppliesTable.tsx
│   ├── ConfirmAddDialogStandardized.tsx
│   ├── ConfirmDeleteDialogStandardized.tsx
│   └── summary/
│       └── FuelSuppliesSummary.tsx
├── hooks/                  # React hooks
│   ├── useFuelSupplies.ts
│   └── useFuelSuppliesFilters.ts
├── services/               # API services
│   └── fuelSuppliesService.ts
├── types/                  # TypeScript types
│   ├── index.ts
│   └── fuel-supplies.types.ts
└── index.ts                # Public API
```

## Key Components

### FuelSuppliesManagerStandardized

The main component that orchestrates the fuel supplies feature. It handles:
- Displaying the list of fuel supplies
- Managing add/edit/delete operations
- Filtering and searching functionality

### FuelSuppliesFormStandardized

Handles the form for adding or editing fuel supplies, with validation and provider/tank selection.

### FuelSuppliesTable

Displays fuel supplies in a tabular format with sorting and pagination.

### FuelSuppliesSummary

Provides aggregated statistics on fuel supplies, including total quantity, cost, and average price.

## Usage

```tsx
// Import from feature
import { FuelSuppliesManagerStandardized } from '@/features/fuel-supplies';

// Use in a page component
function FuelSuppliesPage() {
  return (
    <div>
      <h1>Fuel Supplies</h1>
      <FuelSuppliesManagerStandardized />
    </div>
  );
}
```

## Types

```typescript
// Main entity type
interface FuelSupply {
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
  // Optional related entities
  provider?: { id: string; name: string };
  tank?: { id: string; name: string; fuel_type: string };
  employee?: { id: string; name: string };
}

// Create request type
type CreateFuelSupplyRequest = Omit<
  FuelSupply,
  "id" | "provider" | "tank" | "employee" | "created_at" | "updated_at"
>;

// Update request type
type UpdateFuelSupplyRequest = Partial<CreateFuelSupplyRequest>;
```

## Integration Points

- **Tanks Feature**: Fuel supplies update tank levels when added
- **Finance Feature**: Fuel supplies are tracked as expenses
- **Providers API**: Provides data about fuel suppliers

## Future Improvements

- Add batch import functionality for fuel supplies
- Implement advanced reporting capabilities
- Add delivery scheduling and reminder functionality
- Integration with payment processing systems 