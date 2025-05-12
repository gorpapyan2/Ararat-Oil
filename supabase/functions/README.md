# Supabase Edge Functions

This directory contains Edge Functions that handle the business logic for the Ararat OIL application.

## Architecture

The Edge Functions are organized as follows:

- `_shared/`: Shared utilities and types used across all functions
  - `api.ts`: Utilities for handling API responses, errors, and CORS
  - `database.ts`: Database client creation and error handling
  - `types.ts`: Type definitions shared across functions
  
- Function directories:
  - `fuel-supplies/`: Handles fuel supply operations (CRUD)
  - `shifts/`: Handles shift operations (start, close, payment methods)
  - More functions will be added as needed

## Local Development

### Prerequisites

1. [Supabase CLI](https://supabase.com/docs/guides/cli) installed
2. [Deno](https://deno.land/) installed

### Setup

1. Start the local Supabase stack:

```bash
supabase start
```

2. Deploy functions to the local environment:

```bash
supabase functions deploy fuel-supplies --no-verify-jwt
supabase functions deploy shifts --no-verify-jwt
```

For production, you would remove the `--no-verify-jwt` flag to ensure authentication.

### Testing Functions Locally

You can test functions using curl:

```bash
# Get all fuel supplies
curl http://localhost:54321/functions/v1/fuel-supplies -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create a new fuel supply
curl -X POST http://localhost:54321/functions/v1/fuel-supplies \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"delivery_date":"2023-01-01", "provider_id":"123", "tank_id":"456", "quantity_liters":1000, "price_per_liter":1.5, "employee_id":"789"}'
```

## Production Deployment

To deploy to production:

1. Link to your Supabase project:

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

2. Deploy the functions:

```bash
supabase functions deploy fuel-supplies
supabase functions deploy shifts
```

## Environment Variables

The following environment variables are used by the Edge Functions:

- `SUPABASE_URL`: URL of your Supabase project
- `SUPABASE_ANON_KEY`: Anon key for your Supabase project
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin operations

These are automatically set by Supabase in the hosted environment.

## Client Usage

The client-side code uses the Edge Functions through the API service in `src/services/api.ts`. This provides a consistent interface for working with the Edge Functions, handling authentication and error management.

Example usage:

```typescript
import { fuelSuppliesApi } from '@/services/api';

// Get all fuel supplies
const { data, error } = await fuelSuppliesApi.getAll();

// Create a new fuel supply
const { data, error } = await fuelSuppliesApi.create({
  delivery_date: '2023-01-01',
  provider_id: '123',
  tank_id: '456',
  quantity_liters: 1000,
  price_per_liter: 1.5,
  employee_id: '789'
});
``` 