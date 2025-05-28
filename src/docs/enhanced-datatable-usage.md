# Enhanced DataTable Usage Guide

This guide provides examples of how to use the enhanced DataTable component with its advanced features: server-side data handling, export functionality, and row selection with batch actions.

## Basic Usage

```tsx
import { DataTable } from "@/components/ui/composed/data-table";

function SimpleTable() {
  const data = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Editor" },
  ];

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Role", accessorKey: "role" },
  ];

  return <DataTable data={data} columns={columns} />;
}
```

## Client-Side Sorting, Filtering, and Pagination

Enable sorting, filtering, and pagination for client-side data:

```tsx
import { DataTable } from "@/components/ui/composed/data-table";

function EnhancedTable() {
  const data = [
    /* ... data array ... */
  ];
  const columns = [
    /* ... columns ... */
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      enableSorting={true}
      enableFiltering={true}
      enablePagination={true}
      pageSize={10}
    />
  );
}
```

## Server-Side Data Handling

Use the server-side options to handle pagination, sorting, and filtering on the server:

```tsx
import { useState, useEffect } from "react";
import { DataTable, SortDirection } from "@/components/ui/composed/data-table";
import { fetchUsers } from "@/services/api";

function ServerSideTable() {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("none");
  const [filterValue, setFilterValue] = useState("");

  const columns = [
    { header: "Name", accessorKey: "name", enableSorting: true },
    { header: "Email", accessorKey: "email", enableSorting: true },
    { header: "Role", accessorKey: "role" },
  ];

  // Fetch data from the server when parameters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchUsers({
          page,
          pageSize,
          sortField,
          sortDirection,
          filter: filterValue,
        });

        setData(response.data);
        setTotalCount(response.total);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, sortField, sortDirection, filterValue]);

  // Handle server-side pagination changes
  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  // Handle server-side sort changes
  const handleSortChange = (
    column: string | null,
    direction: SortDirection
  ) => {
    setSortField(column);
    setSortDirection(direction);
  };

  // Handle server-side filter changes
  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    // Reset to first page when filter changes
    setPage(1);
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      enableSorting={true}
      enableFiltering={true}
      enablePagination={true}
      pageSize={pageSize}
      serverSide={{
        enabled: true,
        totalCount,
        onPaginationChange: handlePaginationChange,
        onSortChange: handleSortChange,
        onFilterChange: handleFilterChange,
        filterDebounce: 500, // Debounce time in ms
      }}
    />
  );
}
```

## Export Functionality

Enable CSV export functionality with custom options:

```tsx
import { DataTable } from "@/components/ui/composed/data-table";

function ExportableTable() {
  const data = [
    /* ... data array ... */
  ];

  const columns = [
    {
      header: "Name",
      accessorKey: "name",
      // Include in export (default is true)
      includeInExport: true,
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      // Format date for display
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
      // Format date for export
      exportFormatter: (value) => new Date(value).toISOString(),
    },
    {
      header: "Actions",
      accessorKey: "id",
      cell: (row) => <button onClick={() => handleEdit(row.id)}>Edit</button>,
      // Exclude action column from export
      includeInExport: false,
    },
  ];

  // Custom export handler (optional)
  const handleCustomExport = (data, columns) => {
    // Implement custom export logic here
    console.log("Exporting data:", data);
    console.log("Using columns:", columns);

    // Example: Convert to different format, send to server, etc.
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      exportOptions={{
        enabled: true,
        filename: "users-export.csv",
        exportAll: true, // Export all filtered data, not just current page
        // onExport: handleCustomExport, // Optional custom handler
      }}
    />
  );
}
```

## Row Selection with Batch Actions

Enable row selection with batch actions:

```tsx
import { DataTable } from "@/components/ui/composed/data-table";
import { Trash2, Archive, Mail } from "lucide-react";
import { useToast } from "@/hooks";

function SelectableTable() {
  const { toast } = useToast();
  const data = [
    /* ... data array ... */
  ];
  const columns = [
    /* ... columns ... */
  ];

  // Batch action handlers
  const handleDelete = (selectedRows) => {
    toast({
      title: "Deleting items",
      description: `Deleting ${selectedRows.length} items`,
    });
    console.log("Delete:", selectedRows);
    // Implement delete logic here
  };

  const handleArchive = (selectedRows) => {
    toast({
      title: "Archiving items",
      description: `Archiving ${selectedRows.length} items`,
    });
    console.log("Archive:", selectedRows);
    // Implement archive logic here
  };

  const handleEmail = (selectedRows) => {
    toast({
      title: "Sending email",
      description: `Emailing ${selectedRows.length} users`,
    });
    console.log("Email:", selectedRows);
    // Implement email logic here
  };

  // Optional: Control which rows can be selected
  const canSelectRow = (row) => {
    // Example: Only allow selection of active users
    return row.status === "active";
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      selectionOptions={{
        enabled: true,
        onSelectionChange: (selectedRows) => {
          console.log("Selection changed:", selectedRows);
        },
        batchActions: [
          {
            label: "Delete",
            icon: <Trash2 className="h-4 w-4 mr-2" />,
            onClick: handleDelete,
          },
          {
            label: "Archive",
            icon: <Archive className="h-4 w-4 mr-2" />,
            onClick: handleArchive,
          },
          {
            label: "Email",
            icon: <Mail className="h-4 w-4 mr-2" />,
            onClick: handleEmail,
          },
        ],
        canSelectRow: canSelectRow,
      }}
    />
  );
}
```

## Combining All Features

Combine server-side data handling, export, and row selection:

```tsx
import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/composed/data-table";
import { Trash2, Download, Mail } from "lucide-react";
import { fetchUsers, deleteUsers, emailUsers } from "@/services/api";
import { useToast } from "@/hooks";

function AdvancedTable() {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Server-side state
  const [queryParams, setQueryParams] = useState({
    page: 1,
    pageSize: 10,
    sortField: null,
    sortDirection: "none",
    filter: "",
  });

  const columns = [
    { header: "Name", accessorKey: "name", enableSorting: true },
    { header: "Email", accessorKey: "email", enableSorting: true },
    { header: "Role", accessorKey: "role" },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
      exportFormatter: (value) => new Date(value).toISOString(),
    },
  ];

  // Fetch data from the server
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchUsers(queryParams);
        setData(response.data);
        setTotalCount(response.total);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [queryParams, toast]);

  // Batch action handlers
  const handleDelete = async (selectedRows) => {
    setLoading(true);
    try {
      await deleteUsers(selectedRows.map((row) => row.id));
      toast({
        title: "Success",
        description: `Deleted ${selectedRows.length} users`,
      });
      // Refresh data
      const response = await fetchUsers(queryParams);
      setData(response.data);
      setTotalCount(response.total);
    } catch (error) {
      console.error("Error deleting users:", error);
      toast({
        title: "Error",
        description: "Failed to delete users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmail = (selectedRows) => {
    toast({
      title: "Sending email",
      description: `Emailing ${selectedRows.length} users`,
    });
    emailUsers(selectedRows.map((row) => row.email));
  };

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      enableSorting={true}
      enableFiltering={true}
      enablePagination={true}
      pageSize={queryParams.pageSize}
      noResultsMessage="No users found"
      // Server-side options
      serverSide={{
        enabled: true,
        totalCount,
        onPaginationChange: (page, pageSize) =>
          setQueryParams((prev) => ({ ...prev, page, pageSize })),
        onSortChange: (sortField, sortDirection) =>
          setQueryParams((prev) => ({ ...prev, sortField, sortDirection })),
        onFilterChange: (filter) =>
          setQueryParams((prev) => ({ ...prev, filter, page: 1 })),
        filterDebounce: 500,
      }}
      // Export options
      exportOptions={{
        enabled: true,
        filename: "users-export.csv",
        exportAll: true,
      }}
      // Selection options
      selectionOptions={{
        enabled: true,
        batchActions: [
          {
            label: "Delete",
            icon: <Trash2 className="h-4 w-4 mr-2" />,
            onClick: handleDelete,
          },
          {
            label: "Email",
            icon: <Mail className="h-4 w-4 mr-2" />,
            onClick: handleEmail,
          },
        ],
        canSelectRow: (row) => row.status !== "locked",
      }}
    />
  );
}
```

## Best Practices

1. **Server-Side Performance**:

   - Use debouncing for filtering to reduce unnecessary API calls
   - Keep track of total count to properly calculate pagination
   - Reset to page 1 when filter or sort changes

2. **Export Customization**:

   - Use `includeInExport` to control which columns are exported
   - Provide `exportFormatter` for columns that need special formatting
   - Consider using `exportAll: true` for large datasets

3. **Row Selection**:

   - Use `canSelectRow` to disable selection for specific rows
   - Implement batch actions that make sense for your data
   - Clear selection when making changes that affect the data

4. **Accessibility**:
   - The DataTable includes proper ARIA attributes for accessibility
   - Keyboard navigation is supported for both table and selection controls
   - Use descriptive labels for batch actions
