# Linter Fixes

## Fixed Issues in TankFormStandardized.tsx

### Issue 1: Type Error in mutation.mutate Call

The first issue was a TypeScript type mismatch error where the `formData` object was optional but the mutation function expected non-optional properties:

```typescript
// Error:
// Argument of type '{ name?: string; fuel_type?: "petrol" | "diesel" | "cng"; capacity?: number; current_level?: number; }'
// is not assignable to parameter of type 'Omit<FuelTank, "id" | "created_at">'.
mutation.mutate(formData);
```

#### Solution:

We created a properly typed object that explicitly meets the expected type of the `createFuelTank` function:

```typescript
const tankData: Omit<FuelTank, "id" | "created_at"> = {
  name: formData.name,
  fuel_type: formData.fuel_type,
  capacity: formData.capacity,
  current_level: formData.current_level || 0,
};
mutation.mutate(tankData);
```

### Issue 2: Missing Required Prop on Dialog Component

The second issue was that the Dialog component was missing a required 'title' prop:

```typescript
// Error:
// Property 'title' is missing in type '{ children: Element; open: boolean; onOpenChange: (open: boolean) => void; }'
// but required in type 'DialogPrimitiveProps'.
<Dialog open={isOpen} onOpenChange={onOpenChange}>
```

#### Solution:

We added the required 'title' prop to the Dialog component:

```typescript
<Dialog
  open={isOpen}
  onOpenChange={onOpenChange}
  title="Add New Fuel Tank"
>
```

## Benefits of These Fixes

1. **Improved Type Safety**: The explicit type cast ensures we're passing the correct data structure to the mutation function.
2. **Better Component Compliance**: Adding the required title prop ensures the Dialog component meets its interface requirements.
3. **Improved Developer Experience**: Fixed linter errors provide clearer feedback to developers.

## General Recommendations for Preventing Similar Issues

1. Always ensure form data matches the expected types in mutation functions, especially when using optional fields.
2. Check component prop requirements, especially when using UI components from libraries.
3. Run linters regularly during development to catch type and prop issues early.
