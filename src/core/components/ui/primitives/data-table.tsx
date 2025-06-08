
import React, { useState, useMemo, useEffect } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  PaginationState,
  CellContext,
} from '@tanstack/react-table';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { Button } from '@/core/components/ui/primitives/button';
import { Input } from '@/core/components/ui/primitives/input';
import { Badge } from '@/core/components/ui/primitives/badge';

export type SortDirection = 'asc' | 'desc';

export interface ServerSideOptions<TData> {
  enabled: boolean;
  totalRows: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onGlobalFilterChange?: (filter: string) => void;
}

export interface ExportOptions<TData> {
  enabled: boolean;
  filename?: string;
  exportFormatter?: (data: TData[]) => any[];
}

export interface SelectionOptions<TData> {
  enabled: boolean;
  onSelectionChange?: (selectedRows: TData[]) => void;
}

export interface DataTableProps<TData, TValue = unknown> {
  title?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  initialSorting?: SortingState;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  globalFilterPlaceholder?: string;
  noResultsMessage?: string;
  serverSide?: ServerSideOptions<TData>;
  export?: ExportOptions<TData>;
  selection?: SelectionOptions<TData>;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  getRowProps?: (row: TData, index: number) => React.HTMLAttributes<HTMLTableRowElement>;
  getCellProps?: (cell: any) => React.HTMLAttributes<HTMLTableCellElement>;
  getHeaderProps?: (header: any) => React.HTMLAttributes<HTMLTableHeaderCellElement>;
  highlightSearchResults?: boolean;
  searchDebounceMs?: number;
}

export function DataTable<TData, TValue = unknown>({
  title,
  columns,
  data,
  loading = false,
  initialSorting = [],
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  globalFilterPlaceholder = "Search...",
  noResultsMessage = "No results found",
  serverSide,
  export: exportOptions,
  selection,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  getRowProps,
  getCellProps,
  getHeaderProps,
  highlightSearchResults = true,
  searchDebounceMs = 300,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
    manualPagination: serverSide?.enabled,
    manualSorting: serverSide?.enabled,
    manualFiltering: serverSide?.enabled,
    pageCount: serverSide?.enabled ? Math.ceil((serverSide.totalRows || 0) / pagination.pageSize) : undefined,
  });

  // Handle server-side operations
  useEffect(() => {
    if (serverSide?.enabled) {
      serverSide.onPaginationChange?.(pagination);
    }
  }, [pagination, serverSide]);

  useEffect(() => {
    if (serverSide?.enabled) {
      serverSide.onSortingChange?.(sorting);
    }
  }, [sorting, serverSide]);

  useEffect(() => {
    if (serverSide?.enabled) {
      serverSide.onGlobalFilterChange?.(globalFilter);
    }
  }, [globalFilter, serverSide]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded" />
        <div className="border rounded-lg">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border-b last:border-b-0">
              <div className="h-4 bg-gray-200 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Header */}
      {(title || exportOptions?.enabled) && (
        <div className="flex items-center justify-between">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {exportOptions?.enabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const dataToExport = exportOptions.exportFormatter 
                  ? exportOptions.exportFormatter(data)
                  : data;
                // Basic CSV export implementation
                const csv = [
                  columns.map(col => typeof col.header === 'string' ? col.header : '').join(','),
                  ...dataToExport.map(row => 
                    columns.map(col => {
                      const value = (row as any)[col.accessorKey as string];
                      return typeof value === 'string' ? `"${value}"` : value;
                    }).join(',')
                  )
                ].join('\n');
                
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = exportOptions.filename || 'export.csv';
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={globalFilterPlaceholder}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" aria-label={ariaLabel} aria-describedby={ariaDescribedby}>
            <thead className="bg-gray-50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      {...(getHeaderProps ? getHeaderProps(header) : {})}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            'flex items-center gap-2',
                            header.column.getCanSort() && 'cursor-pointer select-none hover:text-gray-700'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {typeof header.column.columnDef.header === 'function'
                            ? flexRender(header.column.columnDef.header, header.getContext())
                            : header.column.columnDef.header
                          }
                          {header.column.getCanSort() && (
                            <div className="flex items-center">
                              {header.column.getIsSorted() === 'asc' && <ArrowUp className="w-4 h-4" />}
                              {header.column.getIsSorted() === 'desc' && <ArrowDown className="w-4 h-4" />}
                              {!header.column.getIsSorted() && <ArrowUpDown className="w-4 h-4 opacity-50" />}
                            </div>
                          )}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                    {noResultsMessage}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50"
                    {...(getRowProps ? getRowProps(row.original, index) : {})}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-sm text-gray-900"
                        {...(getCellProps ? getCellProps(cell) : {})}
                      >
                        {typeof cell.column.columnDef.cell === 'function'
                          ? flexRender(cell.column.columnDef.cell, cell.getContext())
                          : String(cell.getValue() ?? '')
                        }
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{' '}
          of {table.getFilteredRowModel().rows.length} results
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-500">Page</span>
            <Badge variant="outline" className="px-2 py-1">
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
