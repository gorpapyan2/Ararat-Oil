# Architecture Overview

## Feature-Based Architecture

Our application follows a feature-based architecture, where each feature is a self-contained module with its own components, services, types, and utilities.

### Directory Structure

```
src/
├── features/                 # Feature modules
│   ├── feature-name/         # Specific feature
│   │   ├── components/       # UI components
│   │   ├── hooks/            # React hooks
│   │   ├── services/         # API services
│   │   ├── store/            # State management
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions
│   │   └── index.ts          # Public API
├── shared/                   # Shared code
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Shared hooks
│   ├── utils/                # Shared utilities
│   └── types/                # Shared types
├── services/                 # Core services
│   ├── supabase.ts           # Database client
│   ├── api.ts                # API client
│   └── auth.ts               # Authentication service
└── ...
```

## Domain Model vs Database Model

We maintain a clear separation between domain models and database models to improve maintainability and decouple business logic from database structures.

### Data Mappers

Each feature implements mapper functions to convert between database records and domain models:

```typescript
// Example mapper usage
const domainModel = mapDbToDomain(dbRecord);
const dbRecord = mapDomainToDb(domainModel);
```

Benefits:
- Clear separation of concerns
- Type safety throughout the application
- Better abstraction of database implementation details
- Easier testing and maintenance

## Features Overview

### Completed Features

#### Employees
- Domain models for employee data
- Services for CRUD operations
- Mappers for data transformation
- Type definitions
- Unit tests for mappers

#### Tanks
- Tank management UI components
- Services for tank operations
- Edge functions for data processing
- Integration with fuel management

### In Progress Features

#### Fuel Sales
- Point of sale functionality
- Sales reporting
- Integration with inventory

#### Finance
- Financial reporting
- Expense tracking
- Revenue monitoring

## Dependencies and Circular References

To avoid circular dependencies, we follow these guidelines:

1. Core services are imported from their respective modules:
   ```typescript
   // Good
   import { supabase } from '@/services/supabase';
   
   // Bad - can create circular dependencies
   import { supabase } from '@/lib/supabase';
   ```

2. Features only export what's needed by other features:
   ```typescript
   // In src/features/feature-name/index.ts
   export { featureService } from './services/featureService';
   export type { FeatureType } from './types/feature.types';
   ```

3. Shared utilities are kept in the shared directory:
   ```typescript
   import { formatDate } from '@/shared/utils/date';
   ```

## Testing Strategy

- Unit tests for utilities and mappers
- Component tests for UI components
- Integration tests for feature workflows
- E2E tests for critical user journeys

## Refactoring Progress

1. ✅ Restructure feature directories
2. ✅ Fix circular dependencies
3. ✅ Implement proper type definitions
4. ✅ Create data mappers with tests
5. ✅ Update service imports
6. ✅ Migrate UI components
7. ✅ Update documentation

## Feature Refactoring Status

| Feature | Structure | Types | Mappers | Services | Components | Documentation | 
|---------|-----------|-------|---------|----------|------------|---------------|
| Employees | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tanks | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Fuel Sales | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| Finance | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Auth | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | 