import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GradientCard } from "@/components/ui/gradient-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EnhancedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  description?: string;
  searchColumn?: string;
  filterableColumns?: {
    id: string;
    title: string;
  }[];
  gradientStyle?: "primary" | "accent" | "brand" | "error" | "subtle" | "none";
  borderStyle?: "accent" | "error" | "brand" | "primary" | "default" | "none";
  rounded?: boolean;
  animated?: boolean;
}

export function EnhancedDataTable<TData, TValue>({
  columns,
  data,
  title,
  description,
  searchColumn,
  filterableColumns,
  gradientStyle = "subtle",
  borderStyle = "default",
  rounded = true,
  animated = true,
}: EnhancedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchFilter, setSearchFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Apply search filter when searchColumn is defined
  React.useEffect(() => {
    if (searchColumn && searchFilter) {
      table.getColumn(searchColumn)?.setFilterValue(searchFilter);
    }
  }, [searchFilter, searchColumn, table]);

  const tableContent = (
    <>
      {(title || description || searchColumn) && (
        <div className="flex flex-col md:flex-row gap-2 md:gap-6 justify-between items-start md:items-center py-4 px-1">
          <div className="flex-1 space-y-1">
            {title && <h2 className="text-lg font-semibold tracking-tight">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          <div className="flex flex-col md:flex-row items-center gap-2">
            {searchColumn && (
              <div className="relative w-full md:w-auto">
                <Input
                  placeholder="Search..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full md:w-[200px] pl-8 rounded-full bg-card dark:bg-card/80 focus:ring-1 ring-accent/20"
                />
                <div className="absolute left-2.5 top-2.5 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
              </div>
            )}
            {filterableColumns && filterableColumns.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <AnimatedButton 
                    variant="outline" 
                    size="sm" 
                    shape="pill" 
                    animation="scale" 
                    iconAnimation="pulse"
                    className="h-8 w-8 p-0 md:h-8 md:w-auto md:px-3"
                  >
                    <SlidersHorizontal className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">View</span>
                  </AnimatedButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[150px]">
                  {filterableColumns.map((column) => {
                    const tableColumn = table.getColumn(column.id);
                    if (!tableColumn) return null;
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={tableColumn.getIsVisible()}
                        onCheckedChange={(value) => tableColumn.toggleVisibility(!!value)}
                      >
                        {column.title}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}

      <div className={cn("rounded-md border", rounded && "rounded-xl overflow-hidden")}>
        <Table>
          <TableHeader className="bg-muted/30">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "transition-colors hover:bg-accent/5 group",
                    animated && "hover:-translate-y-[2px] transition-transform duration-200"
                  )}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 pt-4">
        <AnimatedButton
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          shape="pill"
          animation="scale"
        >
          <ChevronsLeft className="h-4 w-4" />
        </AnimatedButton>
        <AnimatedButton
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          shape="pill"
          animation="scale"
        >
          <ChevronLeft className="h-4 w-4" />
        </AnimatedButton>
        <AnimatedButton
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          shape="pill"
          animation="scale"
        >
          <ChevronRight className="h-4 w-4" />
        </AnimatedButton>
        <AnimatedButton
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          shape="pill"
          animation="scale"
        >
          <ChevronsRight className="h-4 w-4" />
        </AnimatedButton>
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
      </div>
    </>
  );

  // If animated, wrap content in motion.div
  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      >
        <GradientCard 
          gradient={gradientStyle} 
          border={borderStyle}
          animation="none"
          className="p-4"
        >
          {tableContent}
        </GradientCard>
      </motion.div>
    );
  }

  // Otherwise return without animation
  return (
    <GradientCard 
      gradient={gradientStyle} 
      border={borderStyle}
      animation="none"
      className="p-4"
    >
      {tableContent}
    </GradientCard>
  );
}

export default EnhancedDataTable;
