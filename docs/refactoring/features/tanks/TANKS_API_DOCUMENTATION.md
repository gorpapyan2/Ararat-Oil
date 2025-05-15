# Tanks Feature API Documentation

## Overview
The Tanks feature provides a complete system for managing fuel tanks, including CRUD operations, level management, and history tracking. This documentation covers the API endpoints, service methods, and component usage.

## Edge Function Endpoints

### Tanks Collection
- **GET** `/tanks`
  - Fetches all tanks
  - Returns: `{ tanks: FuelTank[] }`

- **POST** `/tanks`
  - Creates a new tank
  - Body: `CreateTankRequest`
  - Returns: `{ tank: FuelTank }`

### Individual Tank
- **GET** `/tank`
  - Fetches a specific tank
  - Body: `{ id: string }`
  - Returns: `{ tank: FuelTank }`

- **PUT** `/tank`
  - Updates a tank
  - Body: `{ id: string, ...UpdateTankRequest }`
  - Returns: `{ tank: FuelTank }`

- **DELETE** `/tank`
  - Deletes a tank
  - Body: `{ id: string }`
  - Returns: `{ success: boolean }`

### Level Changes
- **GET** `/level-changes`
  - Fetches level changes for a tank
  - Body: `{ tankId: string }`
  - Returns: `{ levelChanges: TankLevelChange[] }`

- **POST** `/level-changes`
  - Adjusts tank level
  - Body: `{ tankId: string, ...TankLevelAdjustment }`
  - Returns: `{ levelChange: TankLevelChange }`

### Summary
- **GET** `/summary`
  - Fetches tank statistics
  - Returns: `{ summary: TankSummary }`

### Fuel Types
- **GET** `/fuel-types`
  - Fetches available fuel types
  - Returns: `{ fuelTypes: { id: string; name: string }[] }`

## Service Methods

### `tanksService`

```typescript
// Fetch all tanks
getTanks(): Promise<FuelTank[]>

// Fetch a specific tank
getTankById(id: string): Promise<FuelTank>

// Create a new tank
createTank(tank: CreateTankRequest): Promise<FuelTank>

// Update a tank
updateTank(id: string, updates: UpdateTankRequest): Promise<FuelTank>

// Delete a tank
deleteTank(id: string): Promise<void>

// Get tank level changes
getTankLevelChanges(tankId: string): Promise<TankLevelChange[]>

// Adjust tank level
adjustTankLevel(tankId: string, adjustment: TankLevelAdjustment): Promise<TankLevelChange>

// Get tank summary
getSummary(): Promise<TankSummary>

// Get fuel types
getFuelTypes(): Promise<{ id: string; name: string }[]>
```

## Component Usage

### TankManager
The main component for managing tanks. It handles the list of tanks and provides actions for adding new tanks and editing levels.

```tsx
import { TankManager } from '@/features/tanks/components/TankManager';

function TanksPage() {
  return (
    <div>
      <h1>Tanks Management</h1>
      <TankManager />
    </div>
  );
}
```

With custom action rendering:
```tsx
function TanksPage() {
  const handleRenderAction = (actionNode: React.ReactNode) => {
    // Render actions in a custom location
    return <div className="custom-actions">{actionNode}</div>;
  };

  return (
    <div>
      <h1>Tanks Management</h1>
      <TankManager onRenderAction={handleRenderAction} />
    </div>
  );
}
```

### TankList
Displays a grid of tank cards with their current levels and details.

```tsx
import { TankList } from '@/features/tanks/components/TankList';

function TanksList() {
  const { data: tanks, isLoading } = useQuery({
    queryKey: ['tanks'],
    queryFn: tanksService.getTanks,
  });

  return (
    <TankList
      tanks={tanks || []}
      isLoading={isLoading}
      isEditMode={false}
      onEditComplete={() => {}}
    />
  );
}
```

### TankFormDialog
Dialog for creating and editing tanks.

```tsx
import { TankFormDialog } from '@/features/tanks/components/TankFormDialog';

function TankForm() {
  const [open, setOpen] = useState(false);
  const { data: fuelTypes = [] } = useQuery({
    queryKey: ['fuel-types'],
    queryFn: tanksService.getFuelTypes,
  });

  return (
    <TankFormDialog
      open={open}
      onOpenChange={setOpen}
      fuelTypes={fuelTypes}
    />
  );
}
```

### TankLevelEditor
Component for adjusting tank levels.

```tsx
import { TankLevelEditor } from '@/features/tanks/components/TankLevelEditor';

function LevelEditor({ tank }) {
  return (
    <TankLevelEditor
      tank={tank}
      onComplete={() => {
        // Handle completion
      }}
    />
  );
}
```

### TankHistory
Displays the history of level changes for a tank.

```tsx
import { TankHistory } from '@/features/tanks/components/TankHistory';

function TankHistoryView({ tankId }) {
  return <TankHistory tankId={tankId} />;
}
```

## Type Definitions

### FuelTank
```typescript
interface FuelTank {
  id: string;
  name: string;
  fuel_type_id: string;
  capacity: number;
  current_level: number;
  created_at: string;
  updated_at: string;
}
```

### TankLevelChange
```typescript
interface TankLevelChange {
  id: string;
  tank_id: string;
  previous_level: number;
  new_level: number;
  change_amount: number;
  type: 'add' | 'subtract';
  notes?: string;
  created_at: string;
}
```

### CreateTankRequest
```typescript
interface CreateTankRequest {
  name: string;
  fuel_type_id: string;
  capacity: number;
  current_level: number;
}
```

### UpdateTankRequest
```typescript
interface UpdateTankRequest {
  name?: string;
  fuel_type_id?: string;
  capacity?: number;
  current_level?: number;
}
```

### TankLevelAdjustment
```typescript
interface TankLevelAdjustment {
  amount: number;
  type: 'add' | 'subtract';
}
```

### TankSummary
```typescript
interface TankSummary {
  total_tanks: number;
  active_tanks: number;
  total_capacity: number;
  total_current_level: number;
  low_level_tanks: number;
  critical_level_tanks: number;
}
```

## Error Handling
All service methods include error handling and will throw errors with descriptive messages. Components use toast notifications to display error messages to users.

## Best Practices
1. Always use the service methods instead of direct API calls
2. Handle loading states in components
3. Implement proper error handling
4. Use the provided types for type safety
5. Follow the component composition pattern
6. Use React Query for data fetching and caching
7. Implement proper form validation
8. Use the translation system for all user-facing text 