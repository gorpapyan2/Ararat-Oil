# Tanks Feature Migration Guide

## Overview
This document outlines the migration of the tanks feature to use Supabase Edge Functions and the new feature-based architecture. The migration improves security, maintainability, and adds new functionality for tank management.

## Changes Made

### 1. Edge Function Integration
- Created a new edge function at `supabase/functions/tanks/index.ts`
- Handles all CRUD operations for tanks
- Implements tank level management
- Added new summary endpoint for tank statistics
- Includes proper error handling and authentication checks

### 2. Service Layer Updates
- Updated `tanksService.ts` to use edge functions
- Added new methods for tank level management
- Added new `getSummary` method for tank statistics
- Improved error handling with try-catch blocks
- Standardized response formats
- Maintained type safety throughout

### 3. Type System
- Created comprehensive types for tanks and related entities
- Added new types for tank level changes and adjustments
- Added new `TankSummary` type for statistics
- Enhanced type safety in service methods

## How to Use

### Basic Tank Operations
```typescript
// Get all tanks
const tanks = await tanksService.getTanks();

// Get a specific tank
const tank = await tanksService.getTankById(id);

// Create a new tank
const newTank = await tanksService.createTank({
  name: 'Tank Name',
  fuel_type_id: 'fuel-type-id',
  capacity: 1000,
  current_level: 0,
  is_active: true
});

// Update a tank
const updatedTank = await tanksService.updateTank(id, {
  name: 'Updated Name',
  // ... other fields
});

// Delete a tank
await tanksService.deleteTank(id);
```

### Tank Level Management
```typescript
// Get tank level changes
const levelChanges = await tanksService.getTankLevelChanges(tankId);

// Adjust tank level
const levelChange = await tanksService.adjustTankLevel(tankId, {
  change_amount: 100,
  change_type: 'add',
  reason: 'Fuel supply received'
});
```

### Tank Statistics
```typescript
// Get tank statistics
const summary = await tanksService.getSummary();
// Returns: {
//   totalTanks: number,
//   activeTanks: number,
//   totalCapacity: number,
//   totalCurrentLevel: number,
//   lowLevelTanks: number,
//   criticalLevelTanks: number
// }
```

## Migration Steps

1. Update imports in components:
   ```typescript
   import { tanksService } from '@/features/tanks/services/tanksService';
   ```

2. Update service calls:
   - Replace direct Supabase calls with edge function calls
   - Add error handling with try-catch blocks
   - Update response handling to match new format

3. Add tank level management:
   - Implement level adjustment functionality
   - Add level change history
   - Use the new level management methods

4. Add summary functionality:
   - Implement tank statistics in components
   - Use the new `getSummary` method for dashboard data

## Testing

1. Test Tank Operations:
   - Create a new tank
   - Update tank details
   - Delete a tank
   - Verify tank data integrity

2. Test Level Management:
   - Add fuel to a tank
   - Remove fuel from a tank
   - Check level change history
   - Verify level calculations

3. Test Summary Functionality:
   - Verify tank statistics
   - Check active tank count
   - Validate level calculations
   - Test low/critical level detection

4. Test Error Handling:
   - Invalid tank data
   - Network errors
   - Authentication errors
   - Level adjustment validation

## Security Considerations

- All operations require authentication
- Data access is restricted to authorized users
- Input validation is performed on the edge function
- Sensitive data is properly handled
- Level changes are tracked with user attribution

## Performance Impact

- Reduced client-side code
- Improved error handling
- Better data validation
- Enhanced security with edge functions
- Optimized database queries

## Rollback Plan

If issues arise, you can revert to the previous implementation:

1. Restore the original `tanksService.ts`
2. Remove the edge function
3. Update components to use direct Supabase calls
4. Revert to previous level management implementation

## Next Steps

1. Add tank maintenance tracking
2. Implement tank calibration features
3. Add tank inspection scheduling
4. Enhance level monitoring with alerts
5. Add tank analytics dashboard
6. Implement tank capacity planning 