# Fuel Sales Feature

## Overview

The Fuel Sales feature manages all aspects of fuel sales transactions. It enables users to:

- Record and track fuel sales across different filling systems and fuel types
- View detailed sale information including quantity, price, and payment status
- Generate reports and statistics on sales performance
- Export sales data for accounting and analysis

## Architecture

The feature follows the standardized feature-based architecture:

```
src/features/fuel-sales/
├── hooks/                 # React Query hooks
│   ├── useFuelSales.ts   # Hooks for data fetching and mutations
│   └── index.ts          # Export file
├── services/             # API service functions
│   ├── adapters.ts       # Type conversion functions
│   ├── fuel-sales.service.ts # Main service implementation 
│   └── index.ts          # Export file + summary function
├── types/                # TypeScript type definitions
│   ├── fuel-sales.types.ts # Feature-specific types
│   └── index.ts          # Export file
├── components/           # React components
│   └── [various components] 
└── index.ts              # Feature-level exports
```

## Types

The main types in this feature are:

- `FuelSale`: Represents a fuel sale record with details like filling system, quantity, price, etc.
- `FuelSaleFormData`: Data required to create a new fuel sale
- `FuelSaleFilters`: Filter options for retrieving fuel sales
- `FuelSaleExportOptions`: Options for exporting fuel sales data
- `FuelSaleSummary`: Aggregated sales statistics

## Services

The service layer provides the following functions:

- `getFuelSales(filters?)`: Get all fuel sales with optional filtering
- `getFuelSaleById(id)`: Get a specific fuel sale by ID
- `createFuelSale(data)`: Create a new fuel sale
- `updateFuelSale(id, data)`: Update an existing fuel sale
- `deleteFuelSale(id)`: Delete a fuel sale
- `getLatestFuelSale(fillingSystemId)`: Get the latest sale for a specific filling system
- `getFuelSalesCount()`: Get the total count of fuel sales
- `getFuelSalesSummary(dateRange?)`: Get sales statistics and summaries
- `exportFuelSales(options)`: Export sales data in various formats

## Hooks

The feature provides React Query hooks for data fetching and mutations:

- `useFuelSales(filters?)`: Hook for fetching fuel sales with optional filters
- `useFuelSaleById(id)`: Hook for fetching a specific fuel sale
- `useLatestFuelSale(fillingSystemId)`: Hook for fetching the latest sale for a filling system
- `useFuelSalesCount()`: Hook for fetching the total count of fuel sales
- `useFuelSalesSummary(dateRange?)`: Hook for fetching sales statistics
- `useCreateFuelSale()`: Mutation hook for creating a new fuel sale
- `useUpdateFuelSale()`: Mutation hook for updating an existing fuel sale
- `useDeleteFuelSale()`: Mutation hook for deleting a fuel sale

## Usage Examples

### Fetching Fuel Sales with Filtering

```tsx
import { useFuelSales } from '@/features/fuel-sales';

function FuelSalesList() {
  const filters = {
    date_range: {
      start: '2023-01-01',
      end: '2023-01-31'
    },
    payment_method: 'cash'
  };
  
  const { data: fuelSales, isLoading, error } = useFuelSales(filters);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {fuelSales.map(sale => (
        <li key={sale.id}>
          {sale.filling_system_name}: {sale.quantity} L - {sale.total_price} AMD
        </li>
      ))}
    </ul>
  );
}
```

### Creating a New Fuel Sale

```tsx
import { useCreateFuelSale } from '@/features/fuel-sales';

function FuelSaleForm() {
  const createMutation = useCreateFuelSale();
  
  const handleSubmit = (formData) => {
    createMutation.mutate({
      filling_system_id: formData.fillingSystemId,
      fuel_type_id: formData.fuelTypeId,
      quantity: formData.quantity,
      price_per_liter: formData.pricePerLiter,
      total_price: formData.quantity * formData.pricePerLiter,
      payment_method: formData.paymentMethod,
      employee_id: formData.employeeId,
      shift_id: formData.shiftId
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### Getting Sales Summary

```tsx
import { useFuelSalesSummary } from '@/features/fuel-sales';

function SalesSummary() {
  const dateRange = {
    start: '2023-01-01',
    end: '2023-12-31'
  };
  
  const { data: summary, isLoading } = useFuelSalesSummary(dateRange);
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      <h2>Sales Summary for 2023</h2>
      <p>Total Sales: {summary.total_sales} AMD</p>
      <p>Total Quantity: {summary.total_quantity} L</p>
      <p>Average Price: {summary.average_price} AMD/L</p>
      
      <h3>Sales by Fuel Type</h3>
      {Object.entries(summary.sales_by_fuel_type).map(([type, data]) => (
        <div key={type}>
          {type}: {data.quantity} L - {data.amount} AMD
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

All service functions include proper error handling:

- API errors are caught and processed consistently
- Error messages are logged for debugging
- Failed operations return appropriate null/error responses
- React Query hooks propagate errors for UI handling

## Future Improvements

Planned enhancements for the feature:

1. Implement real-time sales tracking
2. Add support for batch operations (creating multiple sales at once)
3. Enhance reporting capabilities with more statistical analysis
4. Introduce data visualization components for sales trends
5. Implement advanced filtering options for complex queries 