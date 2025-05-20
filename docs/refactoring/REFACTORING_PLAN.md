# Feature-Based Architecture Refactoring Plan

## Overview
This document outlines the plan to refactor the application into a feature-based architecture. The goal is to improve maintainability, scalability, and code organization by organizing code around business features rather than technical concerns.

## Directory Structure
```
src/
├── features/                    # Feature modules
│   ├── auth/                   # Authentication feature
│   │   ├── components/        # Auth-specific components
│   │   ├── hooks/            # Auth-specific hooks
│   │   ├── services/         # Auth services
│   │   ├── types/            # Auth types
│   │   └── index.ts          # Public API
│   ├── sales/                 # Sales feature
│   ├── fuel-sales/           # Fuel sales feature
│   ├── fuel-supplies/        # Fuel supplies feature
│   ├── finance/              # Finance feature
│   ├── employees/            # Employees feature
│   ├── petrol-providers/     # Petrol providers feature
│   ├── tanks/               # Tanks management feature
│   ├── shifts/              # Shifts management feature
│   ├── filling-systems/     # Filling systems feature
│   ├── expenses/            # Expenses feature
│   ├── settings/            # Settings feature
│   └── dashboard/           # Dashboard feature
├── shared/                     # Shared code
│   ├── components/            # Shared UI components
│   │   ├── ui/              # Basic UI components
│   │   ├── forms/           # Form components
│   │   ├── tables/          # Table components
│   │   ├── dialogs/         # Dialog components
│   │   └── layout/          # Layout components
│   ├── hooks/                # Shared hooks
│   ├── utils/                # Shared utilities
│   ├── types/                # Shared types
│   └── constants/            # Shared constants
├── core/                      # Core application code
│   ├── config/               # App configuration
│   ├── store/                # Global state management
│   ├── api/                  # API client setup
│   └── i18n/                 # Internationalization
└── layouts/                   # Layout components
```

## Refactoring Phases

### Phase 1: Setup and Planning ✅
- [x] Create new directory structure
- [x] Create documentation structure
- [x] Identify all features
- [x] Create feature documentation
- [x] Plan shared components migration
- [x] Plan core functionality migration

### Phase 2: Feature Migration ✅
- [x] Dashboard feature migration
- [x] Sales feature migration
- [x] Fuel-sales feature migration
- [x] Fuel-supplies feature migration
- [x] Employees feature migration
- [x] Auth feature migration
  - [x] Edge function integration
  - [x] Session management
  - [x] Password reset flow
  - [x] Type system updates
  - [x] Service layer updates
  - [x] Hook updates
- [x] Finance feature migration
- [x] Petrol providers feature migration
- [x] Tanks feature migration
- [x] Shifts feature migration
- [x] Filling systems feature migration
- [x] Expenses feature migration
- [x] Settings feature migration

### Phase 3: Shared Code Migration ✅
- [x] UI components standardization
- [x] Dialog components standardization
- [x] Form components standardization
- [x] Table components standardization
- [x] Hooks migration
- [x] Utils migration
- [x] Types migration
- [x] Constants migration

### Phase 4: Core Functionality Migration 🚧
- [x] Configuration setup
- [x] API client setup
  - [x] API Module Standardization (14/14 completed)
  - [x] API Method Standardization (14/14 completed)
  - [x] Type Adapter Implementation (4/4 implemented)
  - [x] API Response Typing
  - [x] Error Handling Standardization
- [x] i18n setup
  - [x] Translation helpers implementation
  - [x] API-related translations configuration
  - [x] Component localization (15/15 completed)
- [x] Store migration
- [x] Authentication setup
- [x] Error handling setup
- [🔄] Logging setup

### Phase 5: Cleanup and Testing 🚧
- [x] Update imports
- [x] Fix broken references
- [🔄] Run tests (3/4 test categories implemented)
- [🔄] Verify functionality
- [x] Remove old directories
- [🔄] Update documentation (2/5 guides completed)

## Feature Migration Guidelines

### Each Feature Should Include:
1. **Types** (`types/`)
   - Feature-specific interfaces
   - API response types
   - Form data types
   - Filter types

2. **Services** (`services/`)
   - API integration
   - Data transformation
   - Error handling
   - Edge function integration

3. **Hooks** (`hooks/`)
   - Data fetching
   - State management
   - Form handling
   - Feature-specific logic

4. **Components** (`components/`)
   - Feature-specific UI
   - Form components
   - Table components
   - Dialog components

5. **Public API** (`index.ts`)
   - Exported components
   - Exported hooks
   - Exported types
   - Exported utilities

### Migration Steps for Each Feature:
1. Create feature directory structure
2. Define types and interfaces
3. Implement services with edge functions
4. Create React Query hooks
5. Migrate and standardize components
6. Update imports and exports
7. Test functionality
8. Remove old code

## Current Status

### Completed Features ✅
1. **Dashboard Feature**
   - Components migrated
   - Services implemented
   - Types defined
   - API translation helpers integrated
   - No deprecated code

2. **Sales Feature**
   - Components migrated
   - Form components organized
   - Hooks implemented
   - Services structured
   - API translation helpers integrated
   - No linter errors

3. **Fuel-sales Feature**
   - Edge function integration
   - Modern architecture
   - Type safety
   - React Query implementation
   - API translation helpers integrated

4. **Fuel-supplies Feature**
   - Edge function integration
   - Standardized components
   - Type definitions
   - Service layer
   - API translation helpers integrated

5. **Employees Feature**
   - Complete feature structure
   - Edge function integration
   - Standardized components
   - Type safety
   - API translation helpers integrated

6. **Auth Feature**
   - Edge function integration
   - Session management
   - Password reset flow
   - Type system updates
   - Service layer updates
   - Hook updates
   - Security improvements
   - API translation helpers integrated

7. **Finance Feature**
   - Edge function integration
   - Transaction management
   - Expense tracking
   - Profit/loss calculations
   - API translation helpers integrated

8. **Petrol Providers Feature**
   - Edge function integration
   - Provider management
   - Statistics and summary
   - Search functionality
   - Error handling
   - API translation helpers integrated

9. **Tanks Feature**
   - Edge function integration
   - Tank management
   - Fuel level monitoring
   - Type definitions
   - API translation helpers integrated

10. **Shifts Feature**
    - Edge function integration
    - Shift management
    - Employee assignments
    - Type definitions
    - API translation helpers integrated

11. **Filling Systems Feature** ✅
    - Edge function integration
    - Complete feature structure with components, hooks, services and types
    - Filling system management
    - Tank associations
    - Type definitions
    - Diagnostics tools
    - API translation helpers integrated
    - Form validation and error handling
    - All pages using feature-based architecture

12. **Expenses Feature**
    - Edge function integration
    - Expense tracking
    - Reporting
    - Type definitions
    - API translation helpers integrated

13. **Settings Feature**
    - Configuration management
    - User preferences
    - System settings
    - API translation helpers integrated

### Core Functionality Completed ✅

1. **API Standardization**
   - API Module Standardization (14/14 completed)
   - API Method Standardization (14/14 completed) 
   - API Response Typing with `ApiResponse<T>`
   - Error handling standardization
   - Type Adapters (4/4 implemented)
   - API Documentation

2. **i18n Migration**
   - Translation helpers created
   - API-related message standardization
   - Component localization completed (15/15 components)
   - Consistent error and success messages
   - Fallback text support

### In Progress 🚧

1. **Testing**
   - ✅ API Client Tests
   - ✅ Adapter Tests
   - ✅ Translation Helper Tests
   - 🔄 API Method Tests
   - 🔄 Integration Tests

2. **Documentation**
   - ✅ Type Adapters Guide
   - ✅ i18n Migration Guide
   - 🔄 API Method Standardization Guidelines
   - 🔄 Testing Strategy Documentation
   - 🔄 Component Update Guidelines

### Next Steps
1. Complete API Method Tests
2. Finish remaining documentation guides
3. Perform integration testing
4. Refine error handling based on user feedback
5. Implement performance monitoring for API calls

## Documentation
- Each feature has its own documentation in `docs/features/`
- Migration progress is tracked in `docs/refactoring/`
- Component standards in `docs/standards/`
- API documentation in `docs/api/`
- Core API documentation in `docs/refactoring/core/`

## Testing Strategy
1. Unit tests for services and hooks
2. Component tests for UI
3. Integration tests for features
4. E2E tests for critical flows

## Performance Considerations
1. Code splitting by feature
2. Lazy loading of components
3. Optimized data fetching
4. Caching strategies
5. API call monitoring

## Security Considerations
1. Edge function authentication
2. Data validation
3. Error handling
4. Access control

## Maintenance
1. Regular dependency updates
2. Code quality checks
3. Performance monitoring
4. Documentation updates

## Completed Core Functionality

### API Standardization ✅
- Moved API modules from scattered services to centralized `src/core/api/endpoints`
- Standardized method naming (e.g., `getSales` instead of `getAll`)
- Implemented consistent response typing with `ApiResponse<T>`
- Added proper error handling and type transformations
- Implemented type adapters for data transformation
- Updated all components to use the new API structure

### i18n Migration ✅
- Created standardized API translation helpers in `src/i18n/api-translations.ts`
- Updated `i18n.ts` to export these helpers
- Added unit tests for translation helpers
- Updated all components to use these helpers
- Implemented consistent error and success messages

## Testing Progress
- API Client Tests: ✅
- Adapter Tests: ✅
- Translation Helper Tests: ✅
- API Method Tests: 🔄
- Integration Tests: 🔄
- Component Tests: 🔄

## Lessons Learned
- The API namespace must match the endpoint precisely (e.g., use `apiNamespaces.finances` not `apiNamespaces.finance`)
- Type adapters proved valuable for maintaining consistency between API and UI models
- The standardized translation approach significantly improved user experience with consistent messaging
- Component updates should be done systematically to ensure consistent import patterns

## Timeline for Remaining Work

| Task | Priority | Estimated Time |
|------|----------|----------------|
| Complete API Method Tests | High | 1 week |
| Finish Documentation | Medium | 1 week |
| Perform Integration Testing | High | 2 weeks |
| Refine Error Handling | Medium | 1 week |
| Implement Performance Monitoring | Low | 1 week |

## Success Metrics
- Reduced client-side code
- Improved error handling
- Enhanced security
- Better maintainability
- Comprehensive documentation
- Complete test coverage

## Feature-Based Migration Progress

The following features have been successfully migrated to the feature-based architecture:

### Completed ✅

1. **Tanks Feature**
   - Moved components from `src/components/tanks` to `src/features/tanks/components`
   - Created proper type definitions in `src/features/tanks/types`
   - Set up services layer in `src/features/tanks/services`
   - Added feature index file for public exports

2. **Filling Systems Feature**
   - Moved components from `src/components/filling-systems` to `src/features/filling-systems/components`
   - Created proper type definitions in `src/features/filling-systems/types`
   - Added service layer with API adapters in `src/features/filling-systems/services`
   - Implemented custom hooks in `src/features/filling-systems/hooks`
   - Added feature index file for public exports

3. **Fuel Supplies Feature**
   - Moved components from `src/components/fuel-supplies` to `src/features/fuel-supplies/components`
   - Standardized type definitions in `src/features/fuel-supplies/types`
   - Added service layer with API adapters in `src/features/fuel-supplies/services`
   - Implemented filtering and data hooks in `src/features/fuel-supplies/hooks`
   - Added feature index file for public exports

### In Progress 🔄

4. **Sales Feature**
   - Components partially migrated
   - Services integration needed
   - Type definitions incomplete

5. **Financial Feature**
   - Initial structure created
   - Migration planning in progress

### Planned 📋

6. **Dashboard Feature**
7. **Employee Management Feature**
8. **Settings Feature** 