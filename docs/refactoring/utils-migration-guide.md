# Utility & Schema Migration Guide

This document provides a guide for migrating utilities from the old location to the new structure. The goal is to make the codebase more maintainable and better organized.

## Utility Migration

### New Structure

Utilities are now organized into:

1. **Shared utilities** - Used across many features
   - Located in `src/shared/utils/`
   - Organized by domain: `dom.ts`, `formatting.ts`, `object.ts`, etc.
   - Exported via `src/shared/utils/index.ts`

2. **Feature-specific utilities** - Only used within a feature
   - Located in the feature folder: `src/features/[feature-name]/utils.ts`
   - No export outside the feature boundary

### Migration Process

1. **Find and replace imports**
   ```
   Old: import { someUtil } from "@/lib/utils"
   New: import { someUtil } from "@/shared/utils"
   ```

2. **Run the migration utility**
   ```
   npm run utils:migrate
   ```
   This tool will help identify files that need updating.

3. **Move feature-specific utilities**
   If a utility is only used in one feature, move it to that feature's folder.

## Schema Migration

### New Structure

Zod schemas are now organized into:

1. **Shared schemas** - Common validation patterns used across features
   - Located in `src/shared/schemas/`
   - Common patterns are in `common.ts`
   - Exported via `src/shared/schemas/index.ts`

2. **Feature-specific schemas** - Validation schemas for a specific feature
   - Located in the feature folder: `src/features/[feature-name]/schemas.ts`
   - Import common schemas from `@/shared/schemas`

### Migration Process

1. **Find and replace imports**
   ```
   Old: import { someSchema } from "@/lib/schemas/common"
   New: import { someSchema } from "@/shared/schemas"
   ```

2. **Move feature-specific schemas**
   If a schema is only used in one feature, move it to that feature's folder and import common schemas.

## Example Structure

```
src/
├── shared/
│   ├── utils/
│   │   ├── dom.ts
│   │   ├── formatting.ts
│   │   ├── object.ts
│   │   └── index.ts
│   └── schemas/
│       ├── common.ts
│       └── index.ts
└── features/
    ├── auth/
    │   ├── utils.ts
    │   └── schemas.ts
    └── profile/
        ├── utils.ts
        └── schemas.ts
```

## Migration Checklist

- [x] Migrate shared utility functions to appropriate files in `src/shared/utils/`
- [x] Migrate shared schemas to `src/shared/schemas/`
- [x] Create feature-specific utility files
- [x] Create feature-specific schema files
- [x] Update imports in all files
- [x] Test all features to ensure nothing is broken
- [x] Delete old utility and schema files 