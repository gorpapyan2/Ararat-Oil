# StandardizedDataTable Usage Guide

## Overview

The `StandardizedDataTable` component provides a consistent, feature-rich table implementation for displaying and interacting with tabular data across the application. It is built on top of the primitive table components and includes advanced features like sorting, filtering, pagination, and row actions.

## Features

- **Data Display**: Renders tabular data with customizable columns
- **Sorting**: Client and server-side sorting capabilities
- **Filtering**: Global and column-specific filtering
- **Pagination**: Built-in pagination with customizable page sizes
- **Row Actions**: Standard edit and delete actions with customizable handlers
- **Loading States**: Proper handling of loading states with skeleton loaders
- **Export**: Options for exporting data to CSV or other formats

## Component Location

```
src/shared/components/unified/StandardizedDataTable.tsx
```

## Basic Usage

```tsx
import { StandardizedDataTable } from '@/shared/components/unified/StandardizedDataTable';

function MyFeatureTable() {
  const data = [
    { id: 1, name: 'Item 1', price: 10.99, category: 'Electronics' },
    { id: 2, name: 'Item 2', price: 24.99, category: 'Books' },
    // ...more data
  ];
  
  const columns = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Price', accessorKey: 'price' },
    { header: 'Category', accessorKey: 'category' },
  ];
  
  return (
    <StandardizedDataTable
      title="My Feature Items"
      columns={columns}
      data={data}
    />
  );
}
```

## Props Reference

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Optional title for the table |
| `columns` | `Array` | Column definitions (required) |
| `data` | `Array` | Data array (required) |
| `loading` | `boolean` | Whether data is loading |
| `onRowClick` | `function` | Handler for row click |
| `onEdit` | `function` | Handler for edit action |
| `onDelete` | `function` | Handler for delete action |
| `filters` | `object` | Current filter state |
| `onFilterChange` | `function` | Handler for filter changes |
| `totalRows` | `number` | Total rows (for server-side) |
| `serverSide` | `boolean` | Whether to use server-side mode |
| `onPageChange` | `function` | Handler for page changes |
| `onSortChange` | `function` | Handler for sort changes |
| `exportOptions` | `object` | Configuration for data export |
| `className` | `string` | Custom CSS class |

## Advanced Usage Examples

### Custom Cell Rendering

```tsx
const columns = [
  { 
    header: 'Status', 
    accessorKey: 'status',
    cell: (value, row) => (
      <Badge variant={value === 'active' ? 'success' : 'destructive'}>
        {value}
      </Badge>
    )
  },
  {
    header: 'Created At',
    accessorKey: 'createdAt',
    cell: (value) => createDateCell(value)
  }
];
```

### Server-Side Pagination & Sorting

```tsx
function ServerSideTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState({ column: null, direction: 'asc' });
  const [filters, setFilters] = useState({});
  
  const { data, isLoading, total } = useServerSideData({
    page,
    pageSize,
    sort,
    filters
  });
  
  return (
    <StandardizedDataTable
      columns={columns}
      data={data}
      loading={isLoading}
      totalRows={total}
      serverSide={true}
      onPageChange={(page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
      }}
      onSortChange={(column, direction) => {
        setSort({ column, direction });
      }}
      filters={filters}
      onFilterChange={setFilters}
    />
  );
}
```

### Row Actions

```tsx
function TableWithActions() {
  const handleEdit = (id) => {
    console.log(`Edit item ${id}`);
    // Open edit dialog or navigate to edit page
  };
  
  const handleDelete = (id) => {
    console.log(`Delete item ${id}`);
    // Show confirmation dialog before deleting
  };
  
  return (
    <StandardizedDataTable
      columns={columns}
      data={data}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
```

### Data Export

```tsx
<StandardizedDataTable
  columns={columns}
  data={data}
  exportOptions={{
    enabled: true,
    filename: 'my-data-export',
    exportAll: true
  }}
/>
```

## Helper Functions

The StandardizedDataTable exports several helper functions to make common cell rendering tasks easier:

```tsx
import { 
  createBadgeCell, 
  createDateCell,
  createCurrencyCell,
  createNumberCell
} from '@/shared/components/unified/StandardizedDataTable';

const columns = [
  { 
    header: 'Status',
    accessorKey: 'status',
    cell: (value) => createBadgeCell(value, 'success')
  },
  {
    header: 'Date',
    accessorKey: 'date',
    cell: (value) => createDateCell(value)
  },
  {
    header: 'Price',
    accessorKey: 'price',
    cell: (value) => createCurrencyCell(value)
  },
  {
    header: 'Quantity',
    accessorKey: 'quantity',
    cell: (value) => createNumberCell(value, 0)
  }
];
```

## Migrating from Custom Table Implementations

When migrating from a custom table implementation to StandardizedDataTable:

1. Replace imports from your custom implementation with `StandardizedDataTable`
2. Map your existing columns to the `columns` format required by StandardizedDataTable
3. Move any custom cell rendering logic to column cell functions
4. Replace pagination, sorting, and filtering logic with StandardizedDataTable props

### Before:
```tsx
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';

function MyCustomTable({ data }) {
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  // Custom pagination logic
  
  return (
    <Table>
      <TableHeader>
        {/* Custom header implementation */}
      </TableHeader>
      <TableBody>
        {/* Custom row rendering */}
      </TableBody>
    </Table>
  );
}
```

### After:
```tsx
import { StandardizedDataTable } from '@/shared/components/unified/StandardizedDataTable';

function MyStandardizedTable({ data }) {
  const columns = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Price', accessorKey: 'price' },
    // More columns
  ];
  
  return (
    <StandardizedDataTable
      columns={columns}
      data={data}
    />
  );
}
```

## Best Practices

1. **Column Definitions**: Define columns outside the component render when possible
2. **Cell Rendering**: Use helper functions for common cell rendering tasks
3. **Server-Side Operation**: For large datasets, use server-side mode with proper handler functions
4. **Filtering**: Consider which columns should be filterable and provide appropriate filter UI
5. **Accessibility**: Ensure table has proper accessibility attributes and keyboard navigation

By following this guide, you should be able to implement consistent tables across the application that provide a great user experience while reducing code duplication. 