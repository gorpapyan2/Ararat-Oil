import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  RowSelectionState,
  FilterFn,
} from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import {
  ChevronDown,
  Filter,
  Download,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useResponsive";
import logger from "@/services/logger";

export interface DataTableProps<TData, TValue> {
  // Core props
  data: TData[];
  columns: ColumnDef<TData, TValue>[];

  // Feature flags
  enableFilters?: boolean;
  enableGlobalFilter?: boolean;
  enableColumnVisibility?: boolean;
  enableSorting?: boolean;
  enablePagination?: boolean;
  enableRowSelection?: boolean;
  enableExport?: boolean;

  // UI customization
  className?: string;
  title?: string;
  subtitle?: string;
  mobileCardRenderer?: (item: TData, index: number) => React.ReactNode;
  emptyMessage?: string;
  loadingMessage?: string;

  // Loading state
  isLoading?: boolean;
  loadingRows?: number;

  // Pagination options
  pageCount?: number;
  pageSizeOptions?: number[];
  defaultPageSize?: number;

  // Callback props
  onRowClick?: (item: TData) => void;
  onExport?: () => void;
  onRowSelectionChange?: (rowSelection: RowSelectionState) => void;

  // Initial states
  initialSorting?: SortingState;
  initialFilters?: ColumnFiltersState;
  initialColumnVisibility?: VisibilityState;

  // Custom filter function
  globalFilterFn?: FilterFn<TData>;
}

export function DataTable<TData, TValue>({
  // Core props
  data,
  columns,

  // Feature flags
  enableFilters = true,
  enableGlobalFilter = true,
  enableColumnVisibility = true,
  enableSorting = true,
  enablePagination = true,
  enableRowSelection = false,
  enableExport = false,

  // UI customization
  className,
  title,
  subtitle,
  mobileCardRenderer,
  emptyMessage,
  loadingMessage,

  // Loading state
  isLoading = false,
  loadingRows = 5,

  // Pagination options
  pageCount,
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,

  // Callback props
  onRowClick,
  onExport,
  onRowSelectionChange,

  // Initial states
  initialSorting = [],
  initialFilters = [],
  initialColumnVisibility = {},

  // Custom filter function
  globalFilterFn,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // State
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(initialFilters);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(initialColumnVisibility);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  // Handle row selection changes
  React.useEffect(() => {
    if (onRowSelectionChange) {
      onRowSelectionChange(rowSelection);
    }
  }, [rowSelection, onRowSelectionChange]);

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    enableSorting,
    enableFilters,
    enableRowSelection,
    enableMultiRowSelection: enableRowSelection,
    manualPagination: !!pageCount,
    pageCount,

    // Register core row model
    getCoreRowModel: getCoreRowModel(),

    // Feature models
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFilters ? getFilteredRowModel() : undefined,
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,

    // State handlers
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,

    // State
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
      pagination,
    },

    // Default options
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },

    // Custom filter function for global filter
    globalFilterFn: globalFilterFn,
  });

  // Calculate mapping of column IDs to header text for mobile view
  const headerMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    columns.forEach((column) => {
      if (typeof column.header === "string") {
        map[column.id] = column.header;
      } else if (column.header && typeof column.id === "string") {
        map[column.id] = column.id;
      }
    });
    return map;
  }, [columns]);

  // Handle errors gracefully
  React.useEffect(() => {
    if (isMobile && !mobileCardRenderer) {
      logger.warn(
        "DataTable: No mobileCardRenderer provided for mobile view. Using default cell rendering.",
        {
          component: "DataTable",
          table: title,
        },
      );
    }
  }, [isMobile, mobileCardRenderer, title]);

  // Loading state
  if (isLoading) {
    return (
      <div className={cn("w-full space-y-4", className)}>
        <div className="flex justify-between items-center">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          <div className="h-8" aria-hidden="true" />
        </div>

        <div className="hidden md:block">
          {/* Desktop skeleton */}
          <div className="rounded-md border">
            <div className="h-10 border-b bg-muted/50 px-4 py-2" />
            <div className="p-4 space-y-2">
              {Array.from({ length: loadingRows }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>

        <div className="md:hidden space-y-3">
          {/* Mobile skeleton */}
          {Array.from({ length: Math.min(loadingRows, 3) }).map((_, i) => (
            <Card key={i} className="w-full">
              <CardContent className="p-4 space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="h-10" aria-hidden="true" />
      </div>
    );
  }

  // Empty state
  if (!isLoading && data.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
        </div>

        <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-lg border border-dashed">
          <X
            className="h-10 w-10 text-muted-foreground mb-3"
            aria-hidden="true"
          />
          <h3 className="text-lg font-medium">
            {emptyMessage || t("common.noData")}
          </h3>
          <p className="text-muted-foreground mt-1">
            {t("common.noDataDescription")}
          </p>
        </div>
      </div>
    );
  }

  // Around line 278, find the ToolbarButton component
  const ToolbarButton = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }
  >(({ className, active, ...props }, ref) => (
    <Button
      ref={ref}
      variant={active ? "accent" : "outline"}
      size="sm"
      className={cn(
        "h-8 gap-1 text-xs",
        active && "bg-accent text-accent-foreground",
        className,
      )}
      {...props}
    />
  ));
  ToolbarButton.displayName = "ToolbarButton";

  // Toolbar components
  const Toolbar = () => (
    <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between py-4">
      {/* Left side: title and global search */}
      <div className="flex flex-col gap-2">
        {title && (
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}
      </div>

      {/* Right side: actions and filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {enableGlobalFilter && (
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("common.search")}
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="w-full sm:w-[200px] pl-8"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  {t("common.columns")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {enableExport && (
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={onExport}
            >
              <Download className="mr-2 h-4 w-4" />
              {t("common.export")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // Mobile view (Card layout)
  const MobileView = () => (
    <div className="space-y-4" role="table" aria-label={title || "Data table"}>
      {table.getRowModel().rows.map((row, index) => {
        // Use custom renderer if provided
        if (mobileCardRenderer) {
          return (
            <div
              key={row.id}
              className={cn(onRowClick && "cursor-pointer")}
              onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              role="row"
              onKeyDown={
                onRowClick
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowClick(row.original);
                      }
                    }
                  : undefined
              }
            >
              {mobileCardRenderer(row.original, index)}
            </div>
          );
        }

        // Default card layout
        return (
          <Card
            key={row.id}
            className={cn(
              "overflow-hidden transition-all",
              row.getIsSelected() && "ring-2 ring-primary",
              onRowClick && "cursor-pointer",
            )}
            onClick={onRowClick ? () => onRowClick(row.original) : undefined}
            tabIndex={onRowClick ? 0 : undefined}
            role="row"
            onKeyDown={
              onRowClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onRowClick(row.original);
                    }
                  }
                : undefined
            }
          >
            <CardContent className="p-0">
              <div className="divide-y">
                {row.getVisibleCells().map((cell) => {
                  const headerText =
                    headerMap[cell.column.id] || cell.column.id;

                  return (
                    <div key={cell.id} className="flex p-3 gap-2" role="cell">
                      <div className="w-1/3 font-medium text-muted-foreground text-sm">
                        {headerText}
                      </div>
                      <div className="w-2/3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  // Desktop view (Table layout)
  const DesktopView = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={cn(
                        header.column.getCanSort() &&
                          "cursor-pointer select-none flex items-center gap-1",
                        "relative", // For filter dropdown
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          header.column.getCanSort() && "hover:text-foreground",
                        )}
                        onClick={
                          header.column.getCanSort()
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}

                        {header.column.getCanSort() && (
                          <div className="text-muted-foreground">
                            {{
                              asc: (
                                <ChevronDown className="h-4 w-4 rotate-180" />
                              ),
                              desc: <ChevronDown className="h-4 w-4" />,
                            }[header.column.getIsSorted() as string] ?? (
                              <ChevronDown className="h-4 w-4 opacity-0 group-hover:opacity-50" />
                            )}
                          </div>
                        )}
                      </div>

                      {header.column.getCanFilter() && (
                        <div className="absolute right-0 top-0">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                              >
                                <Filter className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <Input
                                placeholder={`${t("common.filterBy")} ${header.column.id}`}
                                value={
                                  (header.column.getFilterValue() as string) ??
                                  ""
                                }
                                onChange={(e) =>
                                  header.column.setFilterValue(e.target.value)
                                }
                                className="w-36 px-2 py-1 text-sm"
                              />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn(
                  onRowClick && "cursor-pointer",
                  row.getIsSelected() && "bg-primary/5",
                )}
                data-state={row.getIsSelected() ? "selected" : undefined}
                onClick={
                  onRowClick ? () => onRowClick(row.original) : undefined
                }
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onRowClick(row.original);
                        }
                      }
                    : undefined
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {emptyMessage || t("common.noResults")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  // Add this function before the PaginationControls component
  // Utility function to get page range to display
  const getPageRange = (
    currentPage: number,
    totalPages: number,
    maxPagesToShow: number,
  ) => {
    // Calculate start and end page indices
    const halfPoint = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(currentPage - halfPoint, 0);
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages - 1);

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(endPage - maxPagesToShow + 1, 0);
    }

    // Create the page range array
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  };

  // PaginationControls component with fixed button props
  const PaginationControls = () => {
    const { pageSize, pageIndex } = table.getState().pagination;
    const totalRows = table.getFilteredRowModel().rows.length;

    return (
      <div className="flex items-center justify-between py-2">
        <div className="text-sm text-muted-foreground flex-1">
          {t("common.pagination", {
            showing: `${pageIndex * pageSize + 1} - ${Math.min(
              (pageIndex + 1) * pageSize,
              totalRows,
            )}`,
            of: totalRows,
          })}
        </div>

        {isMobile ? (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label={t("common.previousPage")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm mx-2">
              {t("common.pageNumber", {
                current: pageIndex + 1,
                total: table.getPageCount(),
              })}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label={t("common.nextPage")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Button
              variant="accent"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label={t("common.firstPage")}
            >
              <ChevronLeft className="h-4 w-4" />
              <ChevronLeft className="h-4 w-4 -ml-2" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label={t("common.previousPage")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page buttons */}
            <div className="flex items-center">
              {/* Create array of pages to show */}
              {Array.from({ length: Math.min(5, table.getPageCount()) }).map(
                (_, i) => {
                  // Show pages around current page
                  const currentPageIndex = getPageRange(
                    pageIndex,
                    table.getPageCount(),
                    5,
                  )[i];

                  return (
                    <Button
                      key={currentPageIndex}
                      variant={
                        pageIndex === currentPageIndex ? "accent" : "outline"
                      }
                      size="sm"
                      className={cn(
                        "h-8 w-8 p-0",
                        pageIndex === currentPageIndex
                          ? "bg-accent text-accent-foreground"
                          : "",
                      )}
                      onClick={() => table.setPageIndex(currentPageIndex)}
                      aria-label={t("common.goToPage", {
                        page: currentPageIndex + 1,
                      })}
                      aria-current={
                        pageIndex === currentPageIndex ? "page" : undefined
                      }
                    >
                      {currentPageIndex + 1}
                    </Button>
                  );
                },
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label={t("common.nextPage")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="accent"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
              aria-label={t("common.lastPage")}
            >
              <ChevronRight className="h-4 w-4" />
              <ChevronRight className="h-4 w-4 -ml-2" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Full table layout
  return (
    <div className={cn("w-full space-y-2", className)}>
      <Toolbar />

      {/* Accessibility announcement for screen readers */}
      <div className="sr-only" aria-live="polite">
        {t("common.dataTableAnnouncement", {
          title: title || t("common.dataTable"),
          count: table.getRowModel().rows.length,
          page: table.getState().pagination.pageIndex + 1,
          total: Math.ceil(data.length / table.getState().pagination.pageSize),
        })}
      </div>

      {/* Responsive layout */}
      <div>{isMobile ? <MobileView /> : <DesktopView />}</div>

      {/* Pagination controls */}
      {enablePagination && data.length > 0 && <PaginationControls />}
    </div>
  );
}
