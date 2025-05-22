# Responsive Table Guide

This guide documents our responsive table implementation, which intelligently adapts to different screen sizes and devices to provide an optimal user experience.

## Overview

The `ResponsiveDataTable` component is a wrapper around our `StandardizedDataTable` that automatically adapts its presentation based on the device's screen size. It provides:

- A card-based layout for mobile devices
- An optimized column set for tablet devices
- The full table experience for desktop devices

## Usage

### Basic Implementation

To use the responsive table, simply replace your `StandardizedDataTable` with `ResponsiveDataTable`:

```tsx
import { ResponsiveDataTable } from "@/shared/components/unified/ResponsiveDataTable";

// Then in your component
return (
  <ResponsiveDataTable
    title="Employees"
    columns={columns}
    data={employees}
    loading={isLoading}
    onEdit={handleEdit}
    onDelete={handleDelete}
    // ...other props
  />
);
```

The component will automatically detect the device size and render the appropriate view without any additional configuration.

## View Types

### Desktop View

On desktop devices (> 1024px width), the component renders the full `StandardizedDataTable` with all columns, features, and interactions.

### Tablet View (768px - 1024px)

On tablet devices, the component:

1. Shows a reduced set of columns (4 most important columns + actions)
2. Provides a drawer for filters
3. Optimizes touch interactions
4. Displays a badge indicating how many columns are hidden

### Mobile View (< 768px)

On mobile devices, the component replaces the table with:

1. A card-based layout with expandable/collapsible rows
2. Primary information visible at all times
3. Secondary information available by expanding the cards
4. Simplified pagination
5. Touch-optimized action buttons

## Accessibility

The responsive implementation maintains all the accessibility features of the standard table:

- Proper ARIA roles and labels for all elements
- Keyboard navigation support
- Screen reader support
- Focus management
- Visually hidden text for additional context

## Customizing Responsive Behavior

The responsive behavior is managed automatically, but you can customize certain aspects:

### Column Prioritization

Columns are prioritized in the order they appear in your `columns` array:

- Mobile view: First column is the primary information, next two columns are secondary, remaining columns appear in the expanded view
- Tablet view: First four columns are shown, plus actions column

Order your columns with this prioritization in mind.

### Tablet Column Count

The default tablet view shows the first 4 columns. You can modify this by editing the `TabletDataView` component in `ResponsiveDataTable.tsx`:

```tsx
// This determines how many columns to show in tablet view
const essentialColumns = columns.slice(0, 4); // Change 4 to your preferred number
```

## Implementing in Feature-Specific Tables

See the implementation in `EmployeesTableStandardized.tsx` for a complete example:

```tsx
import { ResponsiveDataTable } from "@/shared/components/unified/ResponsiveDataTable";

export function EmployeesTableStandardized({
  // props
}) {
  // define columns, handlers, etc.
  
  return (
    <ResponsiveDataTable
      title={t('employees:title')}
      columns={columns}
      data={employees}
      // other props
    />
  );
}
```

## Performance Considerations

The responsive implementation uses the `useIsMobile` and `useIsTablet` hooks from our responsive hooks package, which are optimized for performance. These hooks:

1. Only re-render when the screen size crosses a breakpoint
2. Use debounced resize event listeners
3. Are memoized to prevent unnecessary re-renders

## Future Enhancements

Planned enhancements to the responsive table implementation:

1. Mobile-specific filtering interface
2. Swipe gestures for row actions
3. Infinite scrolling option for mobile
4. Pull-to-refresh functionality
5. Column visibility toggle for tablet view 