import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { 
  ChevronDown, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface MobileCardRenderer<T> {
  (item: T, index: number): React.ReactNode;
}

interface MobileAwareDataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  mobileCardRenderer: MobileCardRenderer<T>;
  enableFiltering?: boolean;
  enableExport?: boolean;
  isLoading?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  loadingRows?: number;
  onExport?: () => void;
  initialSorting?: SortingState;
  title?: string;
  onRowClick?: (item: T) => void;
}

export function MobileAwareDataTable<T>({
  data,
  columns,
  mobileCardRenderer,
  enableFiltering = true,
  enableExport = true,
  isLoading = false,
  pageSize = 10,
  emptyMessage = "No records found",
  loadingRows = 5,
  onExport,
  initialSorting = [],
  title,
  onRowClick,
}: MobileAwareDataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // Build a map of column IDs to header names for mobile view
  const headerNames = React.useMemo(() => {
    const headerMap: Record<string, string> = {};
    columns.forEach(column => {
      if (typeof column.header === 'string') {
        headerMap[column.id] = column.header;
      }
    });
    return headerMap;
  }, [columns]);

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="hidden md:block">
          {/* Desktop skeleton */}
          <div className="rounded-md border">
            <div className="border-b px-4 py-3 bg-card">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full mt-2" />
              ))}
            </div>
            <div className="p-4">
              {[...Array(loadingRows)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full mt-2" />
              ))}
            </div>
          </div>
        </div>
        
        <div className="md:hidden space-y-3">
          {/* Mobile skeleton */}
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="w-full">
              <CardContent className="p-0">
                <div className="p-4 space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-2">
        <p className="text-lg font-medium text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  // Mobile view - Card based layout
  const MobileView = () => (
    <div className="space-y-4 md:hidden">
      {/* Add a descriptive heading for screen readers */}
      <div className="sr-only" aria-live="polite">
        {title ? `${title} - Showing ${table.getRowModel().rows.length} items in card format for mobile view` : "Table data in card format for mobile view"}
      </div>
      
      {/* Cards */}
      <div 
        className="space-y-4"
        // Add role for accessibility
        role="table"
        aria-label={title || "Data table"}
      >
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className={cn(
                "rounded-lg border p-4",
                onRowClick ? "cursor-pointer" : ""
              )}
              onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              data-state={row.getIsSelected() && "selected"}
              // Add role for accessibility
              role="row"
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={onRowClick ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onRowClick(row.original);
                }
              } : undefined}
            >
              {row.getVisibleCells().map((cell) => {
                // Get the header text for this cell
                const headerText = headerNames[cell.column.id] || cell.column.id;
                
                return (
                  <div key={cell.id} className="mb-2" role="cell">
                    <div className="font-medium text-muted-foreground">{headerText}</div>
                    <div>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <div className="text-center py-4 border rounded">
            {emptyMessage || "No results."}
          </div>
        )}
      </div>
      
      <div className="py-2">
        <MobilePagination table={table} />
      </div>
    </div>
  );

  // Desktop view - Table based layout
  const DesktopView = () => (
    <div className="hidden md:block rounded-md border">
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-1 items-center space-x-2">
          {enableExport && (
            <div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 ml-auto"
                onClick={onExport}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          )}
        </div>
        
        {enableFiltering && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto h-8">
                <Filter className="mr-2 h-4 w-4" />
                View
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                  className={onRowClick ? "cursor-pointer" : ""}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4 px-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing{" "}
          <strong>
            {table.getFilteredRowModel().rows.length 
              ? `${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-${Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}` 
              : 0}
          </strong>{" "}
          of{" "}
          <strong>{table.getFilteredRowModel().rows.length}</strong> records
        </div>
        
        <DesktopPagination table={table} />
      </div>
    </div>
  );

  const MobilePagination = ({ table }: { table: any }) => {
    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();
    
    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const DesktopPagination = ({ table }: { table: any }) => {
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                table.previousPage();
              }}
              disabled={!table.getCanPreviousPage()}
            />
          </PaginationItem>
          
          {[...Array(Math.min(5, table.getPageCount()))].map((_, i) => {
            const pageIndex = i;
            const isCurrentPage = table.getState().pagination.pageIndex === pageIndex;
            
            return (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    table.setPageIndex(pageIndex);
                  }}
                  isActive={isCurrentPage}
                >
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                table.nextPage();
              }}
              disabled={!table.getCanNextPage()}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="space-y-4">
      <MobileView />
      <DesktopView />
    </div>
  );
} 