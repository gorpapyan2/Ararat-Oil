# Fuel Prices Feature

## Overview

The Fuel Prices feature allows management of fuel prices across different fuel types. It enables users to:

- View current fuel prices for different fuel types
- Update prices with effective dates
- View price history and track changes
- Retrieve price statistics and summaries

## Architecture

The feature follows the standardized feature-based architecture:

```
src/features/fuel-prices/
├── hooks/                 # React Query hooks
│   ├── useFuelPrices.ts  # Hooks for data fetching and mutations
│   └── index.ts          # Export file
├── services/             # API service functions
│   ├── fuel-prices.service.ts # Original service implementation 
│   └── index.ts          # Adapter implementation
├── types/                # TypeScript type definitions
│   ├── fuel-prices.types.ts # Feature-specific types
│   └── index.ts          # Export file
└── index.ts             # Feature-level exports
```

## Types

The main types in this feature are:

- `FuelPrice`: Represents a fuel price record with type, amount, and effective date
- `FuelPriceFormData`: Data required to create a new fuel price
- `FuelPriceFilters`: Filter options for retrieving fuel prices
- `FuelPriceSummary`: Aggregated price statistics

## Services

The service layer provides the following functions:

- `getFuelPrices(filters?)`: Get all fuel prices with optional filtering
- `getFuelPriceById(id)`: Get a specific fuel price by ID
- `createFuelPrice(data)`: Create a new fuel price
- `updateFuelPrice(id, data)`: Update an existing fuel price
- `deleteFuelPrice(id)`: Delete a fuel price
- `getCurrentPrices()`: Get the current prices for each fuel type
- `getPriceSummary()`: Get price statistics and summaries

## Hooks

The feature provides React Query hooks for data fetching and mutations:

- `useFuelPrices(filters?)`: Hook for fetching fuel prices with optional filters
- `useFuelPriceById(id)`: Hook for fetching a specific fuel price
- `useCurrentPrices()`: Hook for fetching current fuel prices
- `usePriceSummary()`: Hook for fetching price statistics
- `useCreateFuelPrice()`: Mutation hook for creating a new fuel price
- `useUpdateFuelPrice()`: Mutation hook for updating an existing fuel price
- `useDeleteFuelPrice()`: Mutation hook for deleting a fuel price

## Usage Examples

### Fetching Fuel Prices

```tsx
import { useFuelPrices } from '@/features/fuel-prices';

function FuelPricesList() {
  const { data: fuelPrices, isLoading, error } = useFuelPrices();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {fuelPrices.map(price => (
        <li key={price.id}>
          {price.fuel_type}: {price.price_per_liter} AMD
        </li>
      ))}
    </ul>
  );
}
```

### Updating a Fuel Price

```tsx
import { useUpdateFuelPrice } from '@/features/fuel-prices';

function UpdatePriceForm({ priceId }) {
  const [price, setPrice] = useState(0);
  const updateMutation = useUpdateFuelPrice();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      id: priceId,
      data: {
        price_per_liter: price,
        effective_date: new Date().toISOString()
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="number" 
        value={price} 
        onChange={e => setPrice(Number(e.target.value))} 
      />
      <button type="submit">Update Price</button>
    </form>
  );
}
```

## Error Handling

All service functions include proper error handling. API errors are caught and processed in a consistent manner:

- Fetch operations: Errors are thrown with descriptive messages
- Mutation operations: Failed mutations include error details
- React Query hooks: Errors are available through the `error` property

## Future Improvements

Planned enhancements for the feature:

1. Add caching strategies for better performance
2. Implement batch price updates for multiple fuel types
3. Add analytics and price trend visualization components
4. Improve filtering with more options like date ranges and comparison 