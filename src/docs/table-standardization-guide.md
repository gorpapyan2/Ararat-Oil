# Table Component Standardization Guide

## Overview

This guide documents the standardization of table components in our application. We've implemented a 3-layer architecture to provide flexibility, maintainability, and consistency across our UI.

## Architecture

Our table components follow a 3-layer architecture:

1. **Primitives Layer**: Base unstyled components with proper accessibility in `src/components/ui/primitives/table.tsx`
2. **Styled Layer**: Components with design system styles in `src/components/ui/table.tsx`
3. **Composed Layer**: Enhanced components for specific use cases in `src/components/ui/composed/data-table.tsx`
4. **Backwards Compatibility Layer**: Components that maintain compatibility with existing code in `src/components/ui-custom/table.tsx`

## Component Documentation

### Primitives Layer

Located in `src/components/ui/primitives/table.tsx`, these components provide the structural foundation without styling:

- `TablePrimitive`: The root table component
- `TableHeaderPrimitive`: Container for table header rows
- `TableBodyPrimitive`: Container for table body rows
- `TableFooterPrimitive`: Container for table footer rows
- `TableRowPrimitive`: Table row component
- `TableHeadPrimitive`: Table header cell
- `TableCellPrimitive`: Table data cell
- `TableCaptionPrimitive`: Table caption component

These primitives focus on structure and accessibility, with no styling applied.

### Styled Layer

Located in `src/components/ui/table.tsx`, these components apply our design system styles:

- `Table`: Enhanced with features like responsive container, border styles, and width control
- `TableHeader`: Styled header with proper spacing and borders
- `TableBody`: Container for body rows with spacing
- `TableFooter`: Styled footer with background and typography
- `TableRow`: Styled rows with hover effects and selection states
- `TableHead`: Header cells with typography and alignment
- `TableCell`: Data cells with proper padding and alignment
- `TableCaption`: Caption with appropriate typography

#### Table Props

```tsx
interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  fullWidth?: boolean;
  borderStyle?: "default" | "minimal" | "none";
  loading?: boolean;
}
```

- `fullWidth`: Controls whether the table takes up 100% width
- `borderStyle`: Controls the border styling of the table
- `loading`: Shows a loading overlay when true

#### TableRow Props

```tsx
interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
}
```

- `selected`: Applies selected styling to the row

### Composed Layer

Located in `src/components/ui/composed/data-table.tsx`, these specialized components provide enhanced functionality:

#### DataTable

A full-featured data table with sorting, filtering, and pagination capabilities.

```tsx
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  caption?: string;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  loading?: boolean;
  onRowClick?: (row: T) => void;
  noResultsMessage?: string;
  className?: string;
}

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (row: T) => React.ReactNode;
  enableSorting?: boolean;
  footer?: string | ((rows: T[]) => React.ReactNode);
}
```

Features:

- Data sorting by clicking column headers
- Client-side filtering with instant results
- Pagination with configurable page size
- Custom cell rendering
- Loading states
- Row click handlers
- Footer calculation

#### DataTableSkeleton

A skeleton loader component for the DataTable:

```tsx
function DataTableSkeleton({
  columns = 3,
  rows = 5,
}: {
  columns?: number;
  rows?: number;
});
```

### Backwards Compatibility Layer

Located in `src/components/ui-custom/table.tsx`, these components maintain compatibility with existing code while using the new standardized components under the hood. They include additional features like:

- Sticky headers
- Loading states
- Row click handlers
- Built-in sorting

## Usage Examples

### Basic Table

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

function BasicTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>Developer</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>Designer</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
```

### DataTable with Sorting and Filtering

```tsx
import { DataTable } from "@/components/ui/composed/data-table";

function SortableFilterableTable() {
  const data = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Developer" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Designer" },
    // ...more data
  ];

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Role", accessorKey: "role" },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      enableSorting={true}
      enableFiltering={true}
      caption="Employee Directory"
    />
  );
}
```

### Advanced DataTable with Custom Cells

```tsx
import { DataTable } from "@/components/ui/composed/data-table";
import { Badge } from "@/components/ui/badge";

function AdvancedDataTable() {
  const data = [
    /* ...data */
  ];

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <Badge variant={row.status === "active" ? "success" : "destructive"}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Last Login",
      accessorKey: "lastLogin",
      cell: (row) => new Date(row.lastLogin).toLocaleDateString(),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      enableSorting={true}
      enableFiltering={true}
      enablePagination={true}
      pageSize={10}
      onRowClick={(row) => console.log("Clicked row:", row)}
    />
  );
}
```

## Migration Guide

### Migrating from Old Table Components

1. Replace imports from `@/components/ui-custom/table` with imports from `@/components/ui/table`:

```diff
- import { Table, TableHeader, TableBody, /* ... */ } from '@/components/ui-custom/table';
+ import { Table, TableHeader, TableBody, /* ... */ } from '@/components/ui/table';
```

2. For data tables, replace custom implementations with the `DataTable` component:

```diff
- import { Table, TableHeader, /* ... */ } from '@/components/ui-custom/table';
+ import { DataTable } from '@/components/ui/composed/data-table';

function MyDataTable() {
-  // Custom sorting, filtering, pagination logic
-  return (
-    <Table>
-      {/* Complex table implementation */}
-    </Table>
-  );
+  return (
+    <DataTable
+      data={data}
+      columns={columns}
+      enableSorting={true}
+      enableFiltering={true}
+      enablePagination={true}
+    />
+  );
}
```

### Props Changes

Some props have been renamed or their behavior slightly adjusted:

| Old Prop                  | New Prop       | Notes                         |
| ------------------------- | -------------- | ----------------------------- |
| `isSticky`                | `stickyHeader` | On the `Table` component      |
| `isLoading`               | `loading`      | On the `Table` component      |
| `onClick` + `isClickable` | `onRowClick`   | On `DataTable` for row clicks |

## Testing

All table components have comprehensive tests located in:

- `src/components/ui/primitives/__tests__/table.test.tsx`
- `src/components/ui/__tests__/table.test.tsx`
- `src/components/ui/composed/__tests__/data-table.test.tsx`
- `src/components/ui-custom/__tests__/table.test.tsx`

When making changes to table components, ensure all tests pass by running:

```
npm run test
```

## Future Improvements

- Add server-side pagination support to `DataTable`
- Add column resizing capability
- Implement row selection with checkboxes
- Add export functionality (CSV, Excel)
- Add custom filtering for specific column types
