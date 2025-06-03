# Architecture Documentation

## Overview

This project follows a **feature-based architecture** with clean separation of concerns between `core`, `shared`, and `features` directories. This structure promotes maintainability, scalability, and code reusability.

## Directory Structure

```
src/
├── core/           # Core infrastructure and foundational components
├── shared/         # Reusable utilities, hooks, and components
├── features/       # Business logic organized by domain
├── hooks/          # Aggregation layer for hook exports
├── utils/          # Aggregation layer for utility exports
└── ...             # Configuration, styling, and setup files
```

## Core Architecture Principles

### 1. **Core Directory** (`src/core/`)
Contains foundational infrastructure that the entire application depends on:

- **API layer**: HTTP clients, authentication, data fetching
- **Design system**: UI components, themes, design tokens
- **Configuration**: App-wide settings, environment variables
- **Types**: Core TypeScript definitions and schemas
- **Providers**: React context providers and global state
- **Error handling**: Global error boundaries and utilities

**Examples:**
- `src/core/components/ui/` - Design system components
- `src/core/hooks/` - Infrastructure hooks (auth, theme, storage)
- `src/core/api/` - API clients and configuration
- `src/core/types/` - Core type definitions

### 2. **Shared Directory** (`src/shared/`)
Contains reusable code that can be used across multiple features:

- **Generic utilities**: Date formatting, validation, helpers
- **Common hooks**: Form handling, responsive design, etc.
- **Reusable components**: Generic components not tied to business logic
- **Constants**: Shared constants and enums
- **Schemas**: Validation schemas used across features

**Examples:**
- `src/shared/utils/formatting.ts` - Date and number formatting
- `src/shared/hooks/use-form.ts` - Generic form management
- `src/shared/components/` - Reusable business-agnostic components
- `src/shared/constants/` - Application-wide constants

### 3. **Features Directory** (`src/features/`)
Contains business logic organized by domain/feature:

Each feature is self-contained with its own:
- Components
- Hooks  
- Pages
- Types
- Utils (feature-specific)

**Current Features:**
- `auth/` - Authentication and user management
- `dashboard/` - Main dashboard and navigation
- `fuel-management/` - Fuel operations and tracking
- `finance/` - Financial operations and reporting
- `employees/` - Employee management
- `inventory/` - Inventory tracking
- `reports/` - Business reporting
- `settings/` - Application configuration
- And more...

### 4. **Aggregation Layers**

#### Hooks (`src/hooks/`)
Provides a unified export point for all hooks:
```typescript
// Import from anywhere in the app
import { useAuth, useToast, useLocalStorage } from '@/hooks';
```

#### Utils (`src/utils/`)
Provides a unified export point for all utilities:
```typescript
// Import from anywhere in the app
import { formatDate, cn, formatCurrency } from '@/utils';
```

## Import Patterns

### Recommended Import Patterns

```typescript
// ✅ Use aggregation layers for common utilities
import { useAuth, useToast } from '@/hooks';
import { formatDate, cn } from '@/utils';

// ✅ Import directly from core for infrastructure
import { Button } from '@/core/components/ui/button';
import { apiClient } from '@/core/api/client';

// ✅ Import directly from shared for specific utilities
import { useZodForm } from '@/shared/hooks/use-form';
import { ValidationSchema } from '@/shared/schemas/validation';

// ✅ Import from specific features when needed
import { FuelTankCard } from '@/features/fuel-management/components/FuelTankCard';
```

### Anti-patterns to Avoid

```typescript
// ❌ Don't import across features directly
import { AuthForm } from '@/features/auth/components/AuthForm'; // in fuel-management

// ❌ Don't bypass aggregation layers for common utilities
import { useLocalStorage } from '@/core/hooks/useLocalStorage'; // Use @/hooks instead

// ❌ Don't import internal utilities from other features
import { calculateFuelCost } from '@/features/fuel-management/utils/calculations'; // in inventory
```

## Benefits of This Architecture

### 1. **Maintainability**
- Clear separation of concerns
- Easy to locate code by domain
- Consistent structure across features

### 2. **Scalability**
- Features can be developed independently
- Easy to add new features without affecting existing ones
- Shared code promotes reusability

### 3. **Developer Experience**
- Intuitive file organization
- Aggregation layers provide simple import paths
- Clear boundaries between different types of code

### 4. **Code Quality**
- Prevents circular dependencies
- Encourages proper abstraction
- Makes testing easier with isolated features

## Migration from Old Structure

The following changes were made during the cleanup:

### Removed
- ❌ Template code (`src/features/todo/`, `src/features/new/`)
- ❌ Demo components (`src/components/DesignShowcase.tsx`)
- ❌ Duplicate utilities and hooks
- ❌ Deprecation tracking utilities
- ❌ Development-only debug tools
- ❌ Empty type definition files

### Reorganized
- ✅ Moved utilities to `shared/` or `core/` based on purpose
- ✅ Consolidated duplicate hooks and utilities
- ✅ Organized types by their scope (core vs shared)
- ✅ Created proper aggregation layers
- ✅ Moved feature-specific pages to appropriate features

## Guidelines for Future Development

### Adding New Features
1. Create a new directory under `src/features/`
2. Follow the established structure within the feature
3. Use shared utilities and core components when possible
4. Only create feature-specific utilities when necessary

### Adding Shared Code
1. Consider if it belongs in `core/` (infrastructure) or `shared/` (reusable)
2. Update the appropriate aggregation layer (`src/hooks/` or `src/utils/`)
3. Ensure proper TypeScript exports

### Modifying Core Code
1. Consider the impact on all features
2. Maintain backward compatibility when possible
3. Update documentation and types accordingly

This architecture provides a solid foundation for a scalable, maintainable codebase that can grow with your business needs. 