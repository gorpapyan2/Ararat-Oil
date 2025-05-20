# Sales Feature

## Overview

The Sales feature manages all aspects of sales transactions at the station, including recording sales, tracking payment methods, and generating reports. It provides a comprehensive set of components and services for managing sales data.

## Structure

The feature follows the standard feature-based architecture with the following components:

```
src/features/sales/
├── components/             # UI components
│   ├── SalesTable.tsx
│   ├── SalesFormStandardized.tsx
│   ├── SalesDialogsStandardized.tsx
│   ├── SalesFilterPanel.tsx
│   ├── SalesFilters.tsx
│   ├── SalesRangesFilters.tsx
│   ├── SalesHeader.tsx
│   ├── SalesController.tsx
│   ├── SalesDatePicker.tsx
│   ├── SalesSearchBar.tsx
│   ├── SalesSystemSelect.tsx
│   ├── ShiftControl.tsx
│   ├── NewSaleButton.tsx
│   └── form/               # Form-specific components
│       └── PriceAndEmployeeInputs.tsx
├── hooks/                  # React hooks
│   ├── useSalesMutations.ts
│   └── useSalesFilters.ts
├── services/               # API services
│   └── sales.ts
├── types/                  # TypeScript types
│   └── index.ts
└── index.ts                # Public API
```

## Key Components

### SalesTable

The main component for displaying sales data in a tabular format with sorting, filtering, and pagination capabilities.

### SalesFormStandardized

Handles the form for adding or editing sales entries, with validation and field management.

### SalesFilterPanel

Provides a comprehensive filtering interface combining both basic filters and range-based filters.

### SalesController

Orchestrates the sales management interface, handling the interaction between different sales components.

## Usage

```tsx
// Import from feature
import { 
  SalesTable, 
  SalesController, 
  SalesFilterPanel 
} from '@/features/sales';

// Use in a page component
function SalesPage() {
  return (
    <div>
      <h1>Sales</h1>
      <SalesFilterPanel />
      <SalesTable 
        sales={salesData}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
```

## Types

```typescript
// Main entity type
interface Sale {
  id: string;
  amount: number;
  quantityLiters: number;
  unitPrice: number;
  saleDate: Date;
  fuelType: FuelTypeCode;
  vehiclePlate?: string;
  customerName?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date | null;
  // Optional fields
  fillingSystemId?: string;
  fillingSystemName?: string;
  meterStart?: number;
  meterEnd?: number;
  shiftId?: string;
}

// Create request type
interface CreateSaleRequest {
  amount: number;
  quantityLiters: number;
  unitPrice: number;
  saleDate: Date | string;
  fuelType: FuelTypeCode;
  // ... other fields
}

// Filter options
interface SalesFilters {
  searchTerm?: string;
  dateRange?: { from: Date; to?: Date };
  fuelType?: FuelTypeCode | 'all';
  // ... other filter options
}
```

## Services

The Sales feature includes the following services:

- `fetchSales`: Get sales data with filtering
- `createSale`: Create a new sale record
- `updateSale`: Update an existing sale
- `deleteSale`: Delete a sale record
- `exportSales`: Export sales data in CSV format

## Integration Points

- **Filling Systems Feature**: Sales are associated with specific filling systems
- **Tanks Feature**: Sales impact fuel levels in tanks
- **Finance Feature**: Sales contribute to financial reports and accounting
- **Employees Feature**: Sales are associated with employees or shifts

## Future Improvements

- Add real-time sales monitoring
- Implement advanced analytics and reporting
- Add receipt generation and printing
- Enhance customer management capabilities
- Integrate with loyalty programs 