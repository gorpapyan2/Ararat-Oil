# DataTable Component

A comprehensive, accessible, and responsive data table component for displaying and interacting with tabular data.

## Features

- **Responsive Layout**: Automatically switches between table (desktop) and card (mobile) views
- **Sorting**: Click on column headers to sort data
- **Filtering**: Filter data by individual columns or global search
- **Pagination**: Navigate through pages of data
- **Selection**: Select rows for batch operations
- **Customization**: Extensive customization options for display and behavior
- **Accessibility**: ARIA attributes and keyboard navigation support
- **Internationalization**: Built-in i18n support

## Usage

```tsx
import { DataTable } from "@/components/ui/data-table";

// Define your data type
interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive";
}

// Sample data
const users: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", status: "active" },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "inactive",
  },
];

// Define columns
const columns = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "default" : "destructive"}
      >
        {row.original.status}
      </Badge>
    ),
  },
];

// Use the DataTable component
function MyComponent() {
  return (
    <DataTable
      data={users}
      columns={columns}
      title="Users"
      enableExport={true}
    />
  );
}
```

## Mobile View Customization

The DataTable automatically switches to a card view on mobile devices. You can customize this view with the `mobileCardRenderer` prop:

```tsx
function MyComponent() {
  const mobileCardRenderer = (user: User) => (
    <Card>
      <CardContent>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <Badge>{user.status}</Badge>
      </CardContent>
    </Card>
  );

  return (
    <DataTable
      data={users}
      columns={columns}
      mobileCardRenderer={mobileCardRenderer}
    />
  );
}
```

## Props

| Prop                      | Type                                              | Default             | Description                                      |
| ------------------------- | ------------------------------------------------- | ------------------- | ------------------------------------------------ |
| `data`                    | `TData[]`                                         | Required            | The data to display in the table                 |
| `columns`                 | `ColumnDef<TData, TValue>[]`                      | Required            | Column definitions for the table                 |
| `enableFilters`           | `boolean`                                         | `true`              | Enable column-specific filtering                 |
| `enableGlobalFilter`      | `boolean`                                         | `true`              | Enable global search across all columns          |
| `enableColumnVisibility`  | `boolean`                                         | `true`              | Enable toggling column visibility                |
| `enableSorting`           | `boolean`                                         | `true`              | Enable column sorting                            |
| `enablePagination`        | `boolean`                                         | `true`              | Enable pagination                                |
| `enableRowSelection`      | `boolean`                                         | `false`             | Enable row selection                             |
| `enableExport`            | `boolean`                                         | `false`             | Enable data export                               |
| `className`               | `string`                                          | `undefined`         | Additional CSS class for the table container     |
| `title`                   | `string`                                          | `undefined`         | Table title                                      |
| `subtitle`                | `string`                                          | `undefined`         | Table subtitle                                   |
| `mobileCardRenderer`      | `(item: TData, index: number) => React.ReactNode` | `undefined`         | Custom renderer for mobile card view             |
| `emptyMessage`            | `string`                                          | `"No data"`         | Message to display when there's no data          |
| `loadingMessage`          | `string`                                          | `undefined`         | Message to display while loading                 |
| `isLoading`               | `boolean`                                         | `false`             | Whether the table is in a loading state          |
| `loadingRows`             | `number`                                          | `5`                 | Number of skeleton rows to show when loading     |
| `pageCount`               | `number`                                          | `undefined`         | For manual pagination, the total number of pages |
| `pageSizeOptions`         | `number[]`                                        | `[10, 25, 50, 100]` | Available page size options                      |
| `defaultPageSize`         | `number`                                          | `10`                | Default page size                                |
| `onRowClick`              | `(item: TData) => void`                           | `undefined`         | Callback when a row is clicked                   |
| `onExport`                | `() => void`                                      | `undefined`         | Callback when export button is clicked           |
| `onRowSelectionChange`    | `(rowSelection: RowSelectionState) => void`       | `undefined`         | Callback when row selection changes              |
| `initialSorting`          | `SortingState`                                    | `[]`                | Initial sorting state                            |
| `initialFilters`          | `ColumnFiltersState`                              | `[]`                | Initial filters state                            |
| `initialColumnVisibility` | `VisibilityState`                                 | `{}`                | Initial column visibility state                  |
| `globalFilterFn`          | `FilterFn<TData>`                                 | `undefined`         | Custom global filter function                    |

## Advanced Example

For a complete example showing various features, see the `DataTableExample` component in `src/components/examples/DataTableExample.tsx`.
