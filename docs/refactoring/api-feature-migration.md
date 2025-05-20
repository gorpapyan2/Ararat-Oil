# API Feature Migration Guide

This document provides an overview of our approach to migrating features to the new standardized API architecture.

## Core API Implementation

The core API is implemented in `src/core/api` and follows these principles:

- **Type-safe**: All API endpoints and responses are properly typed
- **Consistent error handling**: All API calls use the same error handling pattern
- **Feature-agnostic**: The core API is not tied to any specific feature
- **Extensible**: New endpoints can be easily added with minimal boilerplate

## Completed Migrations

The following features have been migrated to the new API architecture:

- **Tanks**: Full implementation with service, hooks, and components
- **Filling Systems**: Complete implementation with proper type safety
- **Employees**: Migrated with comprehensive React Query hooks
- **Petrol Providers**: Fully migrated with improved error handling
- **Finance**: Complete implementation with transaction management
- **Dashboard**: Migrated with real-time data updates

## Next Targets

These features are next in line for migration:

- **Fuel Sales**: Requires implementation of specialized filters
- **Supplies**: Needs migration to new API pattern
- **Reporting**: Complex feature requiring careful planning

## Feature Service Implementation

Each feature should implement its own service layer that uses the core API. This service layer should:

1. Define feature-specific types
2. Implement adapter functions for converting between API types and feature types
3. Provide a consistent API for the feature
4. Include proper error handling

## Type Mapping Patterns

When implementing feature services, follow these patterns for type mapping:

### API to Feature Mapping

```typescript
// Define the API response type
export interface ApiPetrolProvider {
  id: string;
  name: string;
  contact_info: string;
  is_active: boolean;
  created_at: string;
}

// Define the feature type
export interface PetrolProvider {
  id: string;
  name: string;
  contactInfo: string;
  isActive: boolean;
  createdAt: Date;
}

// Implement the adapter function
export function adaptApiToPetrolProvider(api: ApiPetrolProvider): PetrolProvider {
  return {
    id: api.id,
    name: api.name,
    contactInfo: api.contact_info,
    isActive: api.is_active,
    createdAt: new Date(api.created_at)
  };
}
```

### Feature to API Mapping

```typescript
// Define the API request type
export interface CreatePetrolProviderRequest {
  name: string;
  contact_info: string;
  is_active: boolean;
}

// Define the feature form data type
export interface PetrolProviderFormData {
  name: string;
  contactInfo: string;
  isActive: boolean;
}

// Implement the adapter function
export function adaptPetrolProviderToApiRequest(
  provider: PetrolProviderFormData
): CreatePetrolProviderRequest {
  return {
    name: provider.name,
    contact_info: provider.contactInfo,
    is_active: provider.isActive
  };
}
```

## Error Handling

Implement consistent error handling in the feature service:

```typescript
async function getPetrolProviders(): Promise<PetrolProvider[]> {
  try {
    const response = await petrolProvidersApi.getPetrolProviders();
    return response.data.map(adaptApiToPetrolProvider);
  } catch (error) {
    console.error('Failed to fetch petrol providers:', error);
    throw new Error('Failed to fetch petrol providers');
  }
}
```

## Migration Checklist

- [ ] Define feature types with proper naming conventions
- [ ] Create API response and request types
- [ ] Implement adapter functions for type conversion
- [ ] Build service functions using the core API
- [ ] Add comprehensive error handling
- [ ] Create React Query hooks for the feature
- [ ] Update components to use the new hooks
- [ ] Add unit tests for the feature service
- [ ] Update documentation for the feature 