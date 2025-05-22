import React, { useState, useEffect, useMemo, useCallback, KeyboardEvent } from 'react';
import { FilterX, Download, Filter, Pencil as PencilIcon, Trash2 as TrashIcon } from 'lucide-react';
import { 
  DataTable, 
  type SortDirection,
  type ServerSideOptions,
  type ExportOptions,
  type SelectionOptions
} from "@/core/components/ui/primitives/data-table";
import { Button } from "@/core/components/ui/button";
import { Badge } from "@/core/components/ui/primitives/badge";
import { formatDate, formatCurrency } from "@/shared/utils";

// Define a utility function for formatting numbers that doesn't rely on the utils export
function formatNumberLocal(
  value: number | string,
  decimals: number = 2,
  thousandsSep: string = ',',
  decimalSep: string = '.'
): string {
  // Handle non-numeric inputs
  if (value === null || value === undefined) return '';
  
  // Convert to number if string
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(num)) return '';
  
  // Format the number
  const fixedNum = num.toFixed(decimals);
  const parts = fixedNum.split('.');
  
  // Add thousands separators
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
  
  // Join with decimal separator
  return parts.join(decimalSep);
}

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

// Interface for keyboard navigation options
export interface KeyboardNavigationOptions<TData> {
  enabled: boolean;
  rowFocusKey?: keyof TData; // Key to use for identifying rows when navigating
  onKeyDown?: (event: KeyboardEvent<HTMLTableRowElement>, row: TData) => void;
  focusOnLoad?: boolean; // Whether to focus the first row on load
}

// Define a column type that matches what the DataTable expects
export interface StandardizedDataTableColumn<TData> {
  id?: string;
  header: string;
  accessorKey: keyof TData | string;
  cell?: (value: any, row: TData) => React.ReactNode;
  enableSorting?: boolean;
  footer?: string | ((rows: TData[]) => React.ReactNode);
  meta?: {
    className?: string;
    ariaLabel?: string;
  };
}

export interface StandardizedDataTableProps<TData extends object> {
  title?: string;
  columns: StandardizedDataTableColumn<TData>[];
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
  // Accessibility props
  "aria-label"?: string;
  "aria-describedby"?: string;
  getRowAriaLabel?: (row: TData) => string;
  keyboardNavigation?: KeyboardNavigationOptions<TData>;
  // Search features
  highlightSearchResults?: boolean;
  searchDebounceMs?: number;
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
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
  getRowAriaLabel,
  keyboardNavigation,
  highlightSearchResults = true,
  searchDebounceMs = 300,
}: StandardizedDataTableProps<TData>) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [focusedRowIndex, setFocusedRowIndex] = useState<number | null>(null);
  
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
      id: column.id || column.accessorKey.toString(),
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
        accessorKey: 'actions',
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
        enableSorting: false,
        meta: {
          className: 'actions-column',
          ariaLabel: 'Actions'
        }
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
      onSortChange(null, 'asc');
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

  // Handle keyboard navigation for rows
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLTableRowElement>, rowIndex: number) => {
    if (!keyboardNavigation?.enabled) return;

    const row = safeData[rowIndex];
    
    // Pass the event and row to the custom handler if provided
    if (keyboardNavigation.onKeyDown) {
      keyboardNavigation.onKeyDown(event, row);
    }

    // Built-in keyboard navigation
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (rowIndex < safeData.length - 1) {
          setFocusedRowIndex(rowIndex + 1);
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (rowIndex > 0) {
          setFocusedRowIndex(rowIndex - 1);
        }
        break;
      case 'Home':
        event.preventDefault();
        setFocusedRowIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setFocusedRowIndex(safeData.length - 1);
        break;
      default:
        // Other keys handled by custom onKeyDown
        break;
    }
  }, [keyboardNavigation, safeData]);

  // Focus the row when focusedRowIndex changes
  useEffect(() => {
    if (focusedRowIndex !== null) {
      const rowElement = document.querySelector(`[data-row-index="${focusedRowIndex}"]`) as HTMLElement;
      if (rowElement) {
        rowElement.focus();
      }
    }
  }, [focusedRowIndex]);

  // Set initial focus if enabled
  useEffect(() => {
    if (keyboardNavigation?.enabled && keyboardNavigation.focusOnLoad && safeData.length > 0) {
      setFocusedRowIndex(0);
    }
  }, [keyboardNavigation, safeData]);

  return (
    <DataTable
      id="data-table-ref"
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
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      getRowProps={(row, index) => ({
        onClick: onRowClick ? () => onRowClick(row) : undefined,
        tabIndex: keyboardNavigation?.enabled ? 0 : undefined,
        'data-row-index': index,
        onKeyDown: keyboardNavigation?.enabled 
          ? (e: KeyboardEvent<HTMLTableRowElement>) => handleKeyDown(e, index) 
          : undefined,
        'aria-label': getRowAriaLabel ? getRowAriaLabel(row) : undefined,
        role: 'row',
      })}
      getCellProps={(cell) => ({
        role: 'cell',
        'aria-label': cell.column.meta?.ariaLabel,
      })}
      getHeaderProps={(header) => ({
        'aria-label': header.column.meta?.ariaLabel,
      })}
      highlightSearchResults={highlightSearchResults}
      searchDebounceMs={searchDebounceMs}
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
  return formatNumberLocal(value, decimals);
};

export const createActionsColumn = <TData extends { id: string | number }>(
  onEdit?: (id: string | number) => void,
  onDelete?: (id: string | number) => void
) => {
  return {
    id: 'actions',
    accessorKey: 'actions',
    header: 'Actions',
    cell: (_value: any, row: TData) => {
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