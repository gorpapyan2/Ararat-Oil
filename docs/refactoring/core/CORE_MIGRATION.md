# Core Functionality Migration

This document tracks the migration of core application functionality.

## Configuration
**Current Location**: `src/config/`
**Target Location**: `src/core/config/`

### Files to Migrate
- [ ] Environment configuration
- [ ] API configuration
- [ ] Feature flags
- [ ] Constants
- [ ] Theme configuration
- [ ] Route configuration

## State Management
**Current Location**: `src/store/`
**Target Location**: `src/core/store/`

### Files to Migrate
- [ ] Store setup
- [ ] Root reducer
- [ ] Middleware configuration
- [ ] Action creators
- [ ] Selectors
- [ ] State types

## API Client
**Current Location**: `src/services/`
**Target Location**: `src/core/api/`

### Files to Migrate
- [ ] API client setup
- [ ] Request interceptors
- [ ] Response interceptors
- [ ] Error handling
- [ ] API types
- [ ] API utilities

## Internationalization
**Current Location**: `src/i18n/`
**Target Location**: `src/core/i18n/`

### Files to Migrate
- [ ] i18n setup
- [ ] Translation files
- [ ] Language utilities
- [ ] Format utilities
- [ ] Locale configuration

## Migration Guidelines
1. Keep core functionality minimal and essential
2. Ensure proper error handling
3. Maintain type safety
4. Document all configurations
5. Follow consistent patterns
6. Implement proper testing
7. Consider performance implications

## Progress Tracking
- [ ] Configuration Migration
  - [ ] Environment setup
  - [ ] API configuration
  - [ ] Feature flags
  - [ ] Constants
- [ ] State Management Migration
  - [ ] Store setup
  - [ ] Reducers
  - [ ] Actions
  - [ ] Selectors
- [ ] API Client Migration
  - [ ] Client setup
  - [ ] Interceptors
  - [ ] Error handling
  - [ ] Utilities
- [ ] i18n Migration
  - [ ] Setup
  - [ ] Translations
  - [ ] Utilities
  - [ ] Configuration

## Next Steps
1. Review current implementation
2. Create migration plan for each area
3. Update imports in existing code
4. Test functionality after migration
5. Update documentation

## Notes
- Core functionality should be minimal and essential
- Ensure proper error handling and logging
- Maintain type safety throughout
- Consider performance implications
- Keep documentation up to date
- Follow consistent patterns
- Implement proper testing 