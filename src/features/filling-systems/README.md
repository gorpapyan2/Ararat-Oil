# Filling Systems Feature

This feature module manages fuel dispensing systems, including creating, updating, and associating them with fuel tanks. It provides components for managing filling systems and diagnosing issues with tank associations.

## Directory Structure

```
filling-systems/
├── components/                     # Feature-specific components
│   ├── FillingSystemManagerStandardized.tsx   # Main manager component
│   ├── FillingSystemFormStandardized.tsx      # Form for creating filling systems
│   ├── FillingSystemList.tsx                  # List of filling systems
│   ├── FillingSystemHeader.tsx                # Header with actions
│   ├── ConfirmDeleteDialogStandardized.tsx    # Delete confirmation dialog
│   └── TankDiagnostics.tsx                    # Tank diagnostics tool
├── hooks/                          # Feature-specific hooks
│   └── useFillingSystem.ts         # Custom hook for filling system operations
├── services/                       # Feature-specific services
│   └── fillingSystemsService.ts    # Service for API interactions
├── types/                          # Feature-specific type definitions
│   └── index.ts                    # Type definitions
└── index.ts                        # Public API exports
```

## Usage

### Importing Components

```tsx
import { 
  FillingSystemManagerStandardized,
  FillingSystemFormStandardized,
  TankDiagnostics 
} from '@/features/filling-systems';
```

### Using the Manager Component

The `FillingSystemManagerStandardized` component is the main entry point for managing filling systems:

```tsx
import { FillingSystemManagerStandardized } from '@/features/filling-systems';

function MyPage() {
  return (
    <div>
      <h1>Filling Systems Management</h1>
      <FillingSystemManagerStandardized onRenderAction={(action) => {
        // Handle action rendering
      }} />
    </div>
  );
}
```

### Using the Custom Hook

```tsx
import { useFillingSystem } from '@/features/filling-systems';

function MyComponent() {
  const { 
    getFillingSystemsQuery,
    getFillingSystemQuery,
    createFillingSystem,
    updateFillingSystem,
    deleteFillingSystem
  } = useFillingSystem();
  
  // Use these functions to interact with filling systems
}
```

## Type Definitions

The feature exports several TypeScript interfaces:

- `FillingSystem`: Represents a filling system entity
- `CreateFillingSystemRequest`: For creating new filling systems
- `UpdateFillingSystemRequest`: For updating existing filling systems
- `FillingSystemFilters`: For filtering filling systems
- `FillingSystemStats`: For filling system statistics

## Internationalization

This feature uses the API translation helpers for internationalization:

```tsx
import { apiNamespaces, getApiActionLabel } from '@/i18n/i18n';

// Get translated title
const title = t("fillingSystems.title") || 
  getApiActionLabel(apiNamespaces.fillingSystems, 'list');
```

## Diagnostics

The feature includes a diagnostics tool that can help identify issues with tank associations:

```tsx
import { TankDiagnostics } from '@/features/filling-systems';

function DiagnosticsPage() {
  return (
    <div>
      <h1>System Diagnostics</h1>
      <TankDiagnostics />
    </div>
  );
}
``` 