# Table Component Migration Guide

> **IMPORTANT UPDATE:** The `UnifiedDataTable` component has been completely removed from the codebase. All components have been successfully migrated to use `StandardizedDataTable`. This guide remains as a historical reference of the migration process.

This guide will help you migrate from older table implementations to our new standardized table components.

## Migration Overview

We've implemented a comprehensive 3-layer architecture for table components:

1. **Primitives Layer**: Base unstyled components in `src/components/ui/primitives/table.tsx`
2. **Styled Layer**: Design system components in `src/components/ui/table.tsx`
3. **Composed Layer**: Enhanced components in `src/components/ui/composed/data-table.tsx`

## 1. Basic Table Components Migration

### Before:

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui-custom/table";

function MyTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
```

### After:

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

function MyTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
```

The API for the basic components is largely the same, so in most cases, you'll only need to update the import path.

## 2. Migrating from MobileAwareDataTable

If you're using the now-deprecated `MobileAwareDataTable`, migrate to the new `DataTable` component which has better mobile support, sorting, filtering, and pagination built-in.

### Before:

```tsx
import { MobileAwareDataTable } from "@/components/ui/mobile-aware-data-table";

function MyPage() {
  const columns = [
    { id: "name", header: "Name", accessorKey: "name" },
    { id: "email", header: "Email", accessorKey: "email" },
    // ... other columns
  ];

  const mobileCardRenderer = (item, index) => (
    <div>
      <h3>{item.name}</h3>
      <p>{item.email}</p>
    </div>
  );

  return (
    <MobileAwareDataTable
      data={data}
      columns={columns}
      mobileCardRenderer={mobileCardRenderer}
      enableFiltering={true}
      enableExport={true}
      isLoading={isLoading}
      pageSize={10}
      onRowClick={handleRowClick}
      title="Users"
    />
  );
}
```

### After:

```tsx
import { DataTable } from "@/components/ui/composed/data-table";

function MyPage() {
  const columns = [
    { header: "Name", accessorKey: "name" },
    {
      header: "Email",
      accessorKey: "email",
      // Custom cell renderer for mobile view
      cell: (row) => (
        <div className="md:hidden">
          <div className="font-medium">{row.name}</div>
          <div className="text-sm text-muted-foreground">{row.email}</div>
        </div>
      ),
    },
    // ... other columns
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      enableSorting={true}
      enableFiltering={true}
      enablePagination={true}
      pageSize={10}
      loading={isLoading}
      onRowClick={handleRowClick}
      caption="Users"
    />
  );
}
```

### Key Differences:

1. **Import Path**: Use `@/components/ui/composed/data-table` instead of `@/components/ui/mobile-aware-data-table`

2. **Props Changes**:

   - `mobileCardRenderer` → Use custom `cell` renderers with responsive classes
   - `enableExport` → Not directly supported (implement your own export button)
   - `isLoading` → `loading`
   - `title` → `caption` (appears as a table caption rather than a header)

3. **Mobile Handling**: Instead of using a separate card renderer, you can:

   - Use responsive utility classes in cell renderers
   - Apply different styles using media queries
   - Take advantage of the built-in responsive behavior

4. **Additional Features**:
   - `enableSorting` allows for column sorting
   - `enableFiltering` adds a global filter input
   - Each column can have a custom filter function

## 3. Migrating from Custom DataTable Implementations

If you have complex custom DataTable implementations, consider using the new DataTable component which offers flexibility and powerful features.

### Before (custom implementation):

```tsx
import { Table } from "@/components/ui-custom/table";
import { useState } from "react";

function MyDataTable({ data }) {
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");

  // Custom sorting logic
  const handleSort = (field) => {
    // ... sorting implementation
  };

  // Custom filtering logic
  const handleFilter = (e) => {
    setSearchTerm(e.target.value);
    // ... filtering implementation
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleFilter}
        placeholder="Search..."
      />
      <Table>
        {/* ... table implementation with custom sorting/filtering */}
      </Table>
    </div>
  );
}
```

### After:

```tsx
import { DataTable } from "@/components/ui/composed/data-table";

function MyDataTable({ data }) {
  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      header: "Email",
      accessorKey: "email",
      enableSorting: true,
    },
    // ... other columns
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      enableSorting={true}
      enableFiltering={true}
      enablePagination={true}
    />
  );
}
```

The new DataTable component handles sorting, filtering, and pagination automatically, eliminating the need for custom implementations.

## 4. Advanced Features

### Column Definition:

```tsx
const columns = [
  {
    header: "Name",
    accessorKey: "name",
    enableSorting: true,
    cell: (row) => <span className="font-bold">{row.name}</span>,
  },
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
    header: "Actions",
    id: "actions",
    cell: (row) => <Button onClick={() => handleAction(row)}>Edit</Button>,
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: (row) => new Date(row.createdAt).toLocaleDateString(),
  },
];
```

### Footer Calculation:

```tsx
const columns = [
  {
    header: "Amount",
    accessorKey: "amount",
    footer: (data) => {
      const total = data.reduce((acc, item) => acc + item.amount, 0);
      return `Total: ${total.toFixed(2)}`;
    },
  },
];
```

### Server-Side Data Handling:

The DataTable component now supports server-side data handling for pagination, sorting, and filtering:

```tsx
// Server-side state management
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(10);
const [sortField, setSortField] = useState(null);
const [sortDirection, setSortDirection] = useState("none");
const [filterValue, setFilterValue] = useState("");
const [totalCount, setTotalCount] = useState(0);

// Fetch data from API when params change
useEffect(() => {
  // Your API fetching logic
  fetchData({
    page,
    pageSize,
    sortField,
    sortDirection,
    filter: filterValue,
  }).then((response) => {
    setData(response.data);
    setTotalCount(response.total);
  });
}, [page, pageSize, sortField, sortDirection, filterValue]);

// Pass the server-side options to DataTable
<DataTable
  data={data}
  columns={columns}
  serverSide={{
    enabled: true,
    totalCount,
    onPaginationChange: (newPage, newPageSize) => {
      setPage(newPage);
      setPageSize(newPageSize);
    },
    onSortChange: (column, direction) => {
      setSortField(column);
      setSortDirection(direction);
    },
    onFilterChange: (value) => {
      setFilterValue(value);
      setPage(1); // Reset to first page when filter changes
    },
    filterDebounce: 500, // Debounce filter changes by 500ms
  }}
  enableSorting={true}
  enableFiltering={true}
  enablePagination={true}
/>;
```

### Export Functionality:

The DataTable now supports CSV export with customizable options:

```tsx
const columns = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: (row) => new Date(row.createdAt).toLocaleDateString(),
    // Format for export
    exportFormatter: (value) => new Date(value).toISOString(),
    // Include in export (default is true)
    includeInExport: true,
  },
  {
    header: "Actions",
    accessorKey: "id",
    cell: (row) => <Button>Edit</Button>,
    // Exclude from export
    includeInExport: false,
  },
];

<DataTable
  data={data}
  columns={columns}
  exportOptions={{
    enabled: true,
    filename: "users-export.csv",
    exportAll: true, // Export all filtered data, not just current page
    // Optional custom export handler
    onExport: (dataToExport, columnsToExport) => {
      // Custom export logic
    },
  }}
/>;
```

### Row Selection with Batch Actions:

The DataTable now supports row selection with batch actions:

```tsx
<DataTable
  data={data}
  columns={columns}
  selectionOptions={{
    enabled: true,
    // Called when selection changes
    onSelectionChange: (selectedRows) => {
      console.log("Selected rows:", selectedRows);
    },
    // Batch actions to show when rows are selected
    batchActions: [
      {
        label: "Delete",
        icon: <Trash2 className="h-4 w-4" />,
        onClick: (selectedRows) => {
          deleteUsers(selectedRows);
        },
      },
      {
        label: "Archive",
        icon: <Archive className="h-4 w-4" />,
        onClick: (selectedRows) => {
          archiveUsers(selectedRows);
        },
      },
    ],
    // Control which rows can be selected
    canSelectRow: (row) => row.status !== "locked",
  }}
/>
```

## 5. Testing

When migrating, be sure to update your tests. Here's a simple example:

```tsx
import { render, screen } from "@testing-library/react";
import { DataTable } from "@/components/ui/composed/data-table";

test("DataTable renders with data", () => {
  const data = [{ id: 1, name: "Test User" }];
  const columns = [{ header: "Name", accessorKey: "name" }];

  render(<DataTable data={data} columns={columns} />);

  expect(screen.getByText("Test User")).toBeInTheDocument();
});
```

For testing the advanced features:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { DataTable } from "@/components/ui/composed/data-table";

test("DataTable handles server-side pagination", () => {
  const handlePaginationChange = jest.fn();
  const data = [
    /* test data */
  ];
  const columns = [
    /* test columns */
  ];

  render(
    <DataTable
      data={data}
      columns={columns}
      enablePagination={true}
      serverSide={{
        enabled: true,
        totalCount: 100,
        onPaginationChange: handlePaginationChange,
      }}
    />
  );

  // Click on next page button
  fireEvent.click(screen.getByText("2"));

  // Check if handler was called with correct arguments
  expect(handlePaginationChange).toHaveBeenCalledWith(2, 10);
});

test("DataTable handles row selection", () => {
  const handleSelectionChange = jest.fn();
  const data = [
    { id: 1, name: "User 1" },
    { id: 2, name: "User 2" },
  ];
  const columns = [{ header: "Name", accessorKey: "name" }];

  render(
    <DataTable
      data={data}
      columns={columns}
      selectionOptions={{
        enabled: true,
        onSelectionChange: handleSelectionChange,
      }}
    />
  );

  // Find and click the first row's checkbox
  const checkbox = screen.getAllByRole("checkbox")[1]; // First checkbox after the "select all"
  fireEvent.click(checkbox);

  // Check if handler was called with selected rows
  expect(handleSelectionChange).toHaveBeenCalledWith([
    { id: 1, name: "User 1" },
  ]);
});
```

## Need Help?

Refer to the following resources for more detailed documentation:

- [Table Component Standardization Guide](./table-standardization-guide.md)
- [Enhanced DataTable Usage Guide](./enhanced-datatable-usage.md)
- [UI Component Standardization Plan](./ui-component-standardization-plan.md)

For examples of using the new advanced features, see the `src/components/fuel-supplies/data-table/FuelSuppliesDataTable.tsx` component.

If you need assistance, please contact the UI team.
