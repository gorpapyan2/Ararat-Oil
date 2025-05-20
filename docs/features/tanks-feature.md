# Tanks Feature

## Overview

The Tanks feature manages fuel storage tanks at the station, including tracking capacity, current levels, fuel types, and maintenance status. It provides components and services for monitoring inventory levels and managing tank operations.

## Structure

The feature follows the standard feature-based architecture with the following components:

```
src/features/tanks/
├── components/             # UI components
│   ├── TankManager.tsx
│   ├── TankFormDialog.tsx
│   ├── TankList.tsx
│   ├── TankController.tsx
│   ├── TankLevelEditor.tsx
│   └── TankHistory.tsx
├── services/               # API services
│   └── tanksService.ts
├── types/                  # TypeScript types
│   └── index.ts
└── index.ts                # Public API
```

## Key Components

### TankManager

The main component that orchestrates the tanks feature. It handles:
- Displaying the list of tanks and their status
- Managing add/edit/delete operations
- Monitoring fuel levels and capacity

### TankFormDialog

Handles the form for adding or editing tanks, with validation and fuel type selection.

### TankList

Displays tanks in a list format with status indicators, current levels, and action buttons.

### TankLevelEditor

Provides interface for manually adjusting tank levels, useful for corrections and calibration.

### TankHistory

Shows the history of level changes, deliveries, and dispensing activities for a tank.

## Usage

```tsx
// Import from feature
import { TankManager } from '@/features/tanks';

// Use in a page component
function TanksPage() {
  return (
    <div>
      <h1>Fuel Tanks</h1>
      <TankManager />
    </div>
  );
}
```

## Types

```typescript
// Main entity type
interface Tank {
  id: string;
  name: string;
  capacity: number;
  current_level: number;
  fuel_type_id: string;
  status: 'active' | 'inactive' | 'maintenance';
  location?: string;
  last_maintenance_date?: string;
  created_at: string;
  updated_at: string;
}

// Create request type
interface CreateTankRequest {
  name: string;
  capacity: number;
  current_level: number;
  fuel_type_id: string;
  status: 'active' | 'inactive' | 'maintenance';
  location?: string;
}

// Update request type
type UpdateTankRequest = Partial<CreateTankRequest>;
```

## Integration Points

- **Filling Systems Feature**: Tanks are connected to filling systems
- **Fuel Supplies Feature**: Fuel deliveries update tank levels
- **Inventory Feature**: Tank levels affect inventory reports

## Future Improvements

- Add automated alerts for low fuel levels
- Implement tank maintenance scheduling
- Add real-time monitoring with IoT sensors
- Improve reporting with usage patterns and forecasting 