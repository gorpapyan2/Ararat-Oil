import React, { useState, useEffect, useMemo } from 'react';
import { FilterX, Download, Filter, Pencil as PencilIcon, Trash2 as TrashIcon } from 'lucide-react';
import { 
  DataTable, 
  type SortDirection,
  type ServerSideOptions,
  type ExportOptions,
  type SelectionOptions
} from '@/core/components/ui/primitives/data-table';
import { Button } from '@/core/components/ui/primitives/button';
import { Badge } from '@/core/components/ui/primitives/badge';
import { formatDate, formatCurrency, formatNumber } from "@/shared/utils";

export interface FiltersShape {
  // Common filters
  startDate?: Date;
  endDate?: Date;
  status?: string;
  searchTerm?: string;
  
  // Fuel supplies filters
  supplier?: string;
  fuelType?: string;
  
  // Sales filters
  customer?: string;
  product?: string;
  
  // Expenses filters
  category?: string;
  paymentMethod?: string;
}

export interface StandardizedDataTableProps<TData extends object> {
  title?: string;
  columns: {
    header: string;
    accessorKey: keyof TData;
    cell?: (value: any, row: TData) => React.ReactNode;
    enableSorting?: boolean;
    footer?: string | ((rows: TData[]) => React.ReactNode);
    meta?: {
      className?: string;
    };
  }[];
  data: TData[];
  loading?: boolean;
  onRowClick?: (row: TData) => void;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  filters?: FiltersShape;
  onFilterChange?: (filters: FiltersShape) => void;
  totalRows?: number;
  serverSide?: boolean;
  onPageChange?: (page: number, pageSize: number) => void;
  onSortChange?: (column: keyof TData | null, direction: SortDirection) => void;
  exportOptions?: {
    enabled?: boolean;
    filename?: string;
    exportAll?: boolean;
  };
  className?: string;
}

export function StandardizedDataTable<TData extends object>({
  title,
  columns,
  data,
  loading = false,
  onRowClick,
  onEdit,
  onDelete,
  filters,
  onFilterChange,
  totalRows = 0,
  serverSide = false,
  onPageChange,
  onSortChange,
  exportOptions,
  className,
}: StandardizedDataTableProps<TData>) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  
  // Ensure data is always an array
  const safeData = useMemo(() => Array.isArray(data) ? data : [], [data]);

  // Debug data
  console.log('StandardizedDataTable received data:', {
    dataLength: data?.length ?? 0,
    safeDataLength: safeData.length,
    firstItem: safeData.length > 0 ? JSON.stringify(safeData[0]) : null,
    columnsCount: columns.length,
    columnKeys: columns.map(col => col.accessorKey.toString()),
  });

  // Convert our column format to the format expected by the DataTable
  const tableColumns = useMemo(() => {
    const cols = columns.map(column => ({
      accessorKey: column.accessorKey.toString(),
      header: column.header,
      cell: column.cell 
        ? ({ getValue, row }: any) => column.cell!(getValue(), row.original)
        : undefined,
      enableSorting: column.enableSorting ?? true,
      footer: column.footer,
      meta: column.meta
    }));
    
    // Add actions column if onEdit or onDelete are provided
    if (onEdit || onDelete) {
      cols.push({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }: any) => {
          const rowData = row.original;
          const id = (rowData as any).id;
          
          return (
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(id);
                  }}
                  aria-label="Edit"
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(id);
                  }}
                  aria-label="Delete"
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        },
        enableSorting: false
      });
    }
    
    return cols;
  }, [columns, onEdit, onDelete]);

  // Handle server-side pagination
  useEffect(() => {
    if (serverSide && onPageChange) {
      onPageChange(pagination.pageIndex + 1, pagination.pageSize);
    }
  }, [pagination, serverSide, onPageChange]);

  // Handle server-side sorting
  useEffect(() => {
    if (serverSide && onSortChange && sorting.length > 0) {
      const column = sorting[0].id as keyof TData;
      const direction = sorting[0].desc ? 'desc' : 'asc';
      onSortChange(column, direction);
    } else if (serverSide && onSortChange && sorting.length === 0) {
      onSortChange(null, false);
    }
  }, [sorting, serverSide, onSortChange]);

  // Configure server-side options if enabled
  const serverSideOptions: ServerSideOptions<TData> | undefined = serverSide
    ? {
        enabled: true,
        totalRows: totalRows,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onGlobalFilterChange: (filter) => {
          setGlobalFilter(filter);
          if (onFilterChange && filters) {
            onFilterChange({
              ...filters,
              searchTerm: filter,
            });
          }
        },
      }
    : undefined;

  // Configure export options if enabled
  const dataTableExportOptions: ExportOptions<TData> | undefined = exportOptions?.enabled
    ? {
        enabled: true,
        filename: exportOptions.filename,
        exportFormatter: (data) => data,
      }
    : undefined;

  return (
    <DataTable
      title={title}
      columns={tableColumns}
      data={safeData}
      loading={loading}
      initialSorting={[]}
      defaultPageSize={10}
      pageSizeOptions={[5, 10, 20, 50, 100]}
      globalFilterPlaceholder="Search all columns..."
      noResultsMessage="No results found"
      serverSide={serverSideOptions}
      export={dataTableExportOptions}
      className={className}
    />
  );
}

// Helper functions for creating common table cells
export const createBadgeCell = (value: string, variant: 'default' | 'success' | 'warning' | 'destructive' | 'outline' | 'secondary' | 'pending' | 'approved' | 'denied' | 'active' | 'inactive') => {
  return <Badge variant={variant}>{value}</Badge>;
};

export const createDateCell = (value: string | Date, formatString?: string) => {
  return formatDate(value, formatString);
};

export const createCurrencyCell = (value: number) => {
  return formatCurrency(value);
};

export const createNumberCell = (value: number, decimals: number = 2) => {
  return formatNumber(value, decimals);
};

export const createActionsColumn = <TData extends { id: string | number }>(
  onEdit?: (id: string | number) => void,
  onDelete?: (id: string | number) => void
) => {
  return {
    id: 'actions',
    header: 'Actions',
    cell: (_, row: TData) => {
      return (
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onEdit(row.id);
              }}
              aria-label="Edit"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onDelete(row.id);
              }}
              aria-label="Delete"
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
    enableSorting: false
  };
}; 