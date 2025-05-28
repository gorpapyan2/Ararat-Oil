import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type PaginationState,
  type RowSelectionState,
  type Cell,
  type Header,
  type CellContext,
} from "@tanstack/react-table";
import {
  Download,
  ChevronDown,
  ChevronUp,
  Check,
  FilterX,
  Filter,
} from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/primitives/input";
import { Checkbox } from "@/core/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableFooter,
} from "@/core/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/primitives/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import { DebouncedSearch } from "@/shared/components/unified/DebouncedSearch";
import {
  SearchHighlighter,
  highlightCellContent,
} from "@/shared/components/unified/SearchHighlighter";

export type SortDirection = "asc" | "desc" | false;

export interface ServerSideOptions<TData> {
  enabled: boolean;
  totalRows: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  onSortingChange?: (sorting: SortingState) => void;
  onGlobalFilterChange?: (filter: string) => void;
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
}

export interface ExportOptions<TData> {
  enabled: boolean;
  filename?: string;
  exportFormatter?: (data: TData[]) => TData[];
  onExport?: (data: TData[]) => void;
}

export interface SelectionOptions<TData> {
  enabled: boolean;
  onSelectionChange?: (selection: RowSelectionState) => void;
  onBatchAction?: (action: string, selectedRows: TData[]) => void;
  batchActions?: { label: string; value: string }[];
}

export interface DataTableProps<TData, TValue> {
  title?: string;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  loading?: boolean;
  initialSorting?: SortingState;
  initialFilters?: ColumnFiltersState;
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  globalFilterPlaceholder?: string;
  noResultsMessage?: string;
  serverSide?: ServerSideOptions<TData>;
  export?: ExportOptions<TData>;
  selection?: SelectionOptions<TData>;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  getRowProps?: (row: TData, index: number) => Record<string, unknown>;
  getCellProps?: (cell: Cell<TData, unknown>) => Record<string, unknown>;
  getHeaderProps?: (header: Header<TData, unknown>) => Record<string, unknown>;
  highlightSearchResults?: boolean;
  searchDebounceMs?: number;
}

// IndeterminateCheckbox component
function IndeterminateCheckbox({
  checked = false,
  indeterminate = false,
  onChange,
}: {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <Checkbox
      checked={checked}
      indeterminate={indeterminate}
      onChange={(e) => onChange?.(e.target.checked)}
      aria-label="Select row"
    />
  );
}

export function DataTable<TData, TValue>({
  title,
  data,
  columns,
  loading = false,
  initialSorting = [],
  initialFilters = [],
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  globalFilterPlaceholder = "Search all columns...",
  noResultsMessage = "No results found",
  serverSide,
  export: exportOptions,
  selection,
  className = "",
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedby,
  getRowProps = () => ({}),
  getCellProps = () => ({}),
  getHeaderProps = () => ({}),
  highlightSearchResults = true,
  searchDebounceMs = 300,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialFilters);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedBatchAction, setSelectedBatchAction] = useState<string>("");

  // Create selection column if enabled
  const selectionColumn: ColumnDef<TData, unknown> = useMemo(() => ({
    id: "select",
    header: ({ table }) => (
      <div className="w-12">
        <IndeterminateCheckbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() &&
            !table.getIsAllPageRowsSelected()
          }
          onChange={(checked) => table.toggleAllPageRowsSelected(!!checked)}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="w-12">
        <IndeterminateCheckbox
          checked={row.getIsSelected()}
          onChange={(checked) => row.toggleSelected(!!checked)}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  }), []);

  // Add selection column if selection is enabled
  const tableColumns = React.useMemo(() => {
    if (selection?.enabled) {
      return [selectionColumn, ...columns];
    }
    return columns;
  }, [columns, selection?.enabled, selectionColumn]);

  // Handle server-side pagination, sorting, and filtering
  useEffect(() => {
    if (serverSide?.enabled && serverSide.onPaginationChange) {
      serverSide.onPaginationChange(pagination);
    }
  }, [pagination, serverSide]);

  useEffect(() => {
    if (serverSide?.enabled && serverSide.onSortingChange) {
      serverSide.onSortingChange(sorting);
    }
  }, [sorting, serverSide]);

  useEffect(() => {
    if (serverSide?.enabled && serverSide.onGlobalFilterChange) {
      serverSide.onGlobalFilterChange(globalFilter);
    }
  }, [globalFilter, serverSide]);

  useEffect(() => {
    if (serverSide?.enabled && serverSide.onColumnFiltersChange) {
      serverSide.onColumnFiltersChange(columnFilters);
    }
  }, [columnFilters, serverSide]);

  // Handle selection changes
  useEffect(() => {
    if (selection?.enabled && selection.onSelectionChange) {
      selection.onSelectionChange(rowSelection);
    }
  }, [rowSelection, selection]);

  // Create a modified version of columns for search highlighting if enabled
  const processedColumns = useMemo(() => {
    if (!highlightSearchResults || !globalFilter) {
      return columns;
    }

    // Clone the columns and add search highlighting
    return columns.map((column) => {
      // Only modify columns that have cells we can highlight
      if (!column.cell || column.id === "actions" || column.id === "select") {
        return column;
      }

      // Create a new cell renderer that wraps the original with highlighting
      const originalCell = column.cell;
      const highlightedCell = (props: CellContext<TData, unknown>) => {
        const originalContent = originalCell?.(props);
        return highlightCellContent(originalContent, globalFilter);
      };

      // Return the modified column
      return {
        ...column,
        cell: highlightedCell,
      };
    });
  }, [columns, globalFilter, highlightSearchResults]);

  // Create table instance
  const table = useReactTable({
    data,
    columns: processedColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
      rowSelection: selection?.enabled ? rowSelection : {},
    },
    enableRowSelection: selection?.enabled,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: !serverSide?.enabled ? getSortedRowModel() : undefined,
    getFilteredRowModel: !serverSide?.enabled
      ? getFilteredRowModel()
      : undefined,
    getPaginationRowModel: !serverSide?.enabled
      ? getPaginationRowModel()
      : undefined,
    manualPagination: serverSide?.enabled,
    manualSorting: serverSide?.enabled,
    manualFiltering: serverSide?.enabled,
    pageCount: serverSide?.enabled
      ? Math.ceil(serverSide.totalRows / pagination.pageSize)
      : undefined,
  });

  // Debug table row models
  console.log("DataTable row models:", {
    dataLength: data.length,
    allRowsLength: table.getRowModel().rows.length,
    hasServerSide: Boolean(serverSide?.enabled),
    paginationState: pagination,
    sortingState: sorting,
  });

  // Handle export
  const handleExport = useCallback(() => {
    if (exportOptions?.enabled) {
      const exportData = exportOptions.exportFormatter
        ? exportOptions.exportFormatter(data)
        : data;

      if (exportOptions.onExport) {
        exportOptions.onExport(exportData);
      } else {
        // Default export to CSV
        const header = columns
          .filter((col) => "accessorKey" in col)
          .map((col) => {
            const accessorKey = "accessorKey" in col ? col.accessorKey : "";
            return typeof accessorKey === "string" ? accessorKey : "";
          })
          .join(",");

        const rows = exportData.map((row) => {
          return columns
            .filter((col) => "accessorKey" in col)
            .map((col) => {
              const accessorKey = "accessorKey" in col ? col.accessorKey : "";
              const key = typeof accessorKey === "string" ? accessorKey : "";
              let value = key ? (row as Record<string, unknown>)[key] : "";
              // Escape quotes and commas in the value
              if (typeof value === "string") {
                value = value.replace(/"/g, '""');
                if (
                  value.includes(",") ||
                  value.includes('"') ||
                  value.includes("\n")
                ) {
                  value = `"${value}"`;
                }
              }
              return value !== undefined && value !== null ? value : "";
            })
            .join(",");
        });

        const csv = [header, ...rows].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute(
          "download",
          `${exportOptions.filename || "export"}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }, [data, columns, exportOptions]);

  // Handle batch action
  const handleBatchAction = useCallback(() => {
    if (selection?.enabled && selection.onBatchAction && selectedBatchAction) {
      const selectedRows = table
        .getSelectedRowModel()
        .flatRows.map((row) => row.original);
      selection.onBatchAction(selectedBatchAction, selectedRows);
      // Reset the selection
      table.resetRowSelection();
      setSelectedBatchAction("");
    }
  }, [selectedBatchAction, selection, table]);

  // Reset pagination when filters change
  useEffect(() => {
    if (table.getState().columnFilters.length > 0 || globalFilter !== "") {
      table.resetPageIndex();
    }
  }, [table, globalFilter]);

  return (
    <div
      className={`space-y-4 ${className}`}
      aria-describedby={ariaDescribedby}
    >
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Global Filter - replaced with DebouncedSearch */}
          <div className="relative w-full sm:w-auto">
            <DebouncedSearch
              value={globalFilter}
              onSearch={(value) => setGlobalFilter(value)}
              placeholder={globalFilterPlaceholder}
              debounceMs={searchDebounceMs}
              screenReaderLabel="Search all columns"
              containerClassName="w-full"
              clearable={true}
            />
          </div>

          {/* Export Button */}
          {exportOptions?.enabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="ml-auto"
              aria-label="Export data"
            >
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Export
            </Button>
          )}
        </div>
      </div>

      {/* Selection Actions */}
      {selection?.enabled && Object.keys(rowSelection).length > 0 && (
        <div
          className="flex items-center gap-2 bg-muted p-2 rounded-md"
          role="region"
          aria-live="polite"
        >
          <span className="text-sm font-medium">
            {Object.keys(rowSelection).length} selected
          </span>
          {selection.batchActions && selection.batchActions.length > 0 && (
            <>
              <Select
                value={selectedBatchAction}
                onValueChange={setSelectedBatchAction}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  {selection.batchActions.map((action) => (
                    <SelectItem key={action.value} value={action.value}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleBatchAction}
                disabled={!selectedBatchAction}
              >
                Apply
              </Button>
            </>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border relative">
        {/* Loading Overlay */}
        {loading && (
          <div
            className="absolute inset-0 bg-gray-50/70 dark:bg-gray-950/70 z-10 flex items-center justify-center"
            aria-live="polite"
            aria-atomic="true"
          >
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
              role="status"
              aria-label="Loading"
            ></div>
          </div>
        )}

        <Table aria-label={ariaLabel} role="grid">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const customHeaderProps = getHeaderProps(header);

                  return (
                    <TableHead
                      key={header.id}
                      {...customHeaderProps}
                      sortDirection={
                        header.column.getIsSorted() as "asc" | "desc" | null
                      }
                      sortable={header.column.getCanSort()}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            header.column.getCanSort()
                              ? "flex items-center cursor-pointer select-none"
                              : ""
                          }
                          onClick={header.column.getToggleSortingHandler()}
                          role={
                            header.column.getCanSort() ? "button" : undefined
                          }
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                          aria-label={
                            header.column.getCanSort()
                              ? `${header.column.columnDef.header}, ${
                                  header.column.getIsSorted() === "asc"
                                    ? "sorted ascending"
                                    : header.column.getIsSorted() === "desc"
                                      ? "sorted descending"
                                      : "not sorted"
                                }`
                              : undefined
                          }
                          onKeyDown={(e) => {
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              header.column.toggleSorting();
                            }
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <span className="ml-1" aria-hidden="true">
                              {{
                                asc: <ChevronUp className="h-4 w-4" />,
                                desc: <ChevronDown className="h-4 w-4" />,
                              }[header.column.getIsSorted() as string] ?? (
                                <div className="h-4 w-4 opacity-0 group-hover:opacity-50">
                                  <ChevronUp className="h-2 w-2" />
                                  <ChevronDown className="h-2 w-2" />
                                </div>
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {(() => {
              const rows = table.getRowModel().rows;
              return rows?.length ? (
                rows.map((row, rowIndex) => {
                  const customRowProps = getRowProps(row.original, rowIndex);

                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      {...customRowProps}
                    >
                      {row.getVisibleCells().map((cell) => {
                        const customCellProps = getCellProps(cell);

                        return (
                          <TableCell key={cell.id} {...customCellProps}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (selection?.enabled ? 1 : 0)}
                    className="h-24 text-center"
                  >
                    {noResultsMessage}
                  </TableCell>
                </TableRow>
              );
            })()}
          </TableBody>
          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <TableCell key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500" aria-live="polite">
            Showing{" "}
            <strong>
              {pagination.pageIndex * pagination.pageSize + 1} to{" "}
              {Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                serverSide?.enabled
                  ? serverSide.totalRows
                  : table.getFilteredRowModel().rows.length
              )}
            </strong>{" "}
            of{" "}
            <strong>
              {serverSide?.enabled
                ? serverSide.totalRows
                : table.getFilteredRowModel().rows.length}
            </strong>{" "}
            entries
          </p>
        </div>
        <div
          className="flex items-center gap-2"
          role="navigation"
          aria-label="Table pagination"
        >
          <span className="text-sm">Page size:</span>
          <Select
            value={String(pagination.pageSize)}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue>{pagination.pageSize}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="First page"
            >
              {"<<"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            >
              {"<"}
            </Button>
            <span
              className="text-sm mx-2"
              aria-live="polite"
              aria-atomic="true"
            >
              Page{" "}
              <strong>
                {pagination.pageIndex + 1} of {table.getPageCount()}
              </strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            >
              {">"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Last page"
            >
              {">>"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
