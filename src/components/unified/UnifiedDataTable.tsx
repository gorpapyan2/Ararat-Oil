import React, { useState, useMemo, createContext, useContext, useTransition } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  ChevronUp,
  Filter as FilterIcon,
  X as ClearIcon,
  SlidersHorizontal,
  Search,
} from "lucide-react";
import { RangeSliderFilter } from "@/components/fuel-supplies/filters/RangeSliderFilter";
import { DateRangeFilter } from "@/components/fuel-supplies/filters/DateRangeFilter";
import { format } from "date-fns";

// Filter context type definitions
interface FiltersShape {
  search: string;
  date?: Date;
  provider: string;
  category?: string;
  systemId?: string;
  quantityRange: [number, number];
  priceRange: [number, number];
  totalRange: [number, number];
  [key: string]: any;
}

interface ContextValue {
  filters: FiltersShape;
  setPartial: (u: Partial<FiltersShape>) => void;
  providers: { id: string; name: string }[];
  categories?: { id: string; name: string }[];
  systems?: { id: string; name: string }[];
}

const FiltersCtx = createContext<ContextValue | null>(null);

const useFiltersCtx = () => {
  const ctx = useContext(FiltersCtx);
  if (!ctx) throw new Error("FiltersCtx missing");
  return ctx;
};

// Prop types for the unified data table
interface UnifiedDataTableProps<TData, TValue> {
  title: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onEdit?: (item: TData) => void;
  onDelete?: (item: TData) => void;
  providers: { id: string; name: string }[];
  categories?: { id: string; name: string }[];
  systems?: { id: string; name: string }[];
  onFiltersChange: (filters: Partial<FiltersShape>) => void;
  filters: FiltersShape;
  searchColumn?: string;
  searchPlaceholder?: string;
  initialState?: {
    sorting?: SortingState;
    columnFilters?: ColumnFiltersState;
    columnVisibility?: VisibilityState;
  };
  summaryComponent?: React.ReactNode;
}

export function UnifiedDataTable<TData, TValue>({
  title,
  columns,
  data,
  isLoading = false,
  onEdit,
  onDelete,
  providers,
  categories,
  systems = providers,
  onFiltersChange,
  filters: initialFilters,
  searchColumn = "name",
  searchPlaceholder = "Search...",
  initialState,
  summaryComponent,
}: UnifiedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(initialState?.sorting || []);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(initialState?.columnFilters || []);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialState?.columnVisibility || {});
  const [rowSelection, setRowSelection] = useState({});
  const [filters, setFilters] = useState<FiltersShape>(initialFilters);
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
  const [, startTransition] = useTransition();

  // Simplified filter setter that automatically updates both local state and parent
  const setPartial = (updates: Partial<FiltersShape>) => {
    setFilters(f => ({ ...f, ...updates }));
    startTransition(() => onFiltersChange(updates));
    
    // If search is updated, also update the table's column filter
    if ('search' in updates && updates.search !== undefined) {
      const searchVal = updates.search;
      if (searchColumn) {
        setColumnFilters(prev => {
          const existing = prev.filter(f => f.id !== searchColumn);
          return searchVal ? [...existing, { id: searchColumn, value: searchVal }] : existing;
        });
      }
    }
  };

  // Detect if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([k, v]) => {
      if (k === 'provider' || k === 'category') return v !== 'all' && v !== '';
      if (Array.isArray(v)) return v[0] > 0 || v[1] > 0;
      if (k === 'search') return Boolean(v);
      return Boolean(v);
    });
  }, [filters]);

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters: FiltersShape = {
      search: '',
      date: undefined,
      provider: 'all',
      category: 'all',
      systemId: 'all',
      quantityRange: [0, 0],
      priceRange: [0, 0],
      totalRange: [0, 0],
    };
    setPartial(clearedFilters);
    setColumnFilters([]);
  };

  // Initialize table
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // If in loading state, show loading indicator
  if (isLoading) {
    return (
      <div className="space-y-6">
        {summaryComponent && (
          <div aria-label="Key metrics" className="mb-6">
            {summaryComponent}
          </div>
        )}
        <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm">
          <div className="flex justify-center p-8">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <span className="text-sm text-muted-foreground">Loading data...</span>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {summaryComponent && (
        <div aria-label="Key metrics" className="mb-6">
          {summaryComponent}
        </div>
      )}
      
      <FiltersCtx.Provider value={{ filters, setPartial, providers, categories, systems }}>
        <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm">
          {/* Filter Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/10">
            <div className="flex items-center gap-2">
              <FilterIcon className="h-4 w-4 text-accent" />
              <h3 className="text-sm font-medium">{title} Filters</h3>
            </div>
            {hasActiveFilters && (
              <Button size="sm" variant="ghost" onClick={clearAllFilters} className="gap-1 text-xs">
                <ClearIcon className="h-3 w-3" /> Clear all
              </Button>
            )}
            <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2 h-8 w-8">
                  {isFiltersOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
          
          {/* Active Filters Chips */}
          {hasActiveFilters && <ActiveFilterChips />}
          
          {/* Filter Content */}
          <Collapsible open={isFiltersOpen}>
            <CollapsibleContent>
              <CardContent className="p-4">
                {/* Basic Search */}
                <div className="relative mb-4">
                  <Input
                    placeholder={searchPlaceholder}
                    value={filters.search}
                    onChange={(e) => setPartial({ search: e.target.value })}
                    className="pr-8"
                  />
                  <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>

                {/* Filter Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <DateRangeFilter
                    date={filters.date}
                    onDateChange={(date) => setPartial({ date })}
                  />
                  
                  <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium">Provider</label>
                    <select
                      value={filters.provider}
                      onChange={(e) => setPartial({ provider: e.target.value })}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="all">All Providers</option>
                      {providers.map((provider) => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Add System selector if we're on the sales tab */}
                  {title.toLowerCase().includes('sales') && (
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Filling System</label>
                      <select
                        value={filters.systemId}
                        onChange={(e) => setPartial({ systemId: e.target.value })}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="all">All Systems</option>
                        {systems.map((system) => (
                          <option key={system.id} value={system.id}>
                            {system.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {categories && (
                    <div className="flex flex-col space-y-2">
                      <label className="text-sm font-medium">Fuel Type</label>
                      <select
                        value={filters.category}
                        onChange={(e) => setPartial({ category: e.target.value })}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="all">All Fuel Types</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                
                <Separator className="opacity-50 mb-6" />
                
                {/* Range Filters */}
                <div className="grid md:grid-cols-3 gap-6">
                  <RangeSliderFilter
                    label="Quantity"
                    min={0}
                    max={10000}
                    step={100}
                    value={filters.quantityRange}
                    onChange={(quantityRange) => setPartial({ quantityRange })}
                    formatValue={(val) => `${val} L`}
                  />
                  <RangeSliderFilter
                    label="Price"
                    min={0}
                    max={2000}
                    step={10}
                    value={filters.priceRange}
                    onChange={(priceRange) => setPartial({ priceRange })}
                    formatValue={(val) => `${val} ֏`}
                  />
                  <RangeSliderFilter
                    label="Total"
                    min={0}
                    max={1000000}
                    step={1000}
                    value={filters.totalRange}
                    onChange={(totalRange) => setPartial({ totalRange })}
                    formatValue={(val) => `${val.toLocaleString()} ֏`}
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </FiltersCtx.Provider>

      {/* Data Table */}
      <Card className="border-none shadow-sm">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{title} Data</h3>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto flex gap-1 items-center">
                    Columns <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead 
                        key={header.id}
                        className={header.id === "actions" ? "w-[120px]" : ""}
                      >
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
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="group"
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
                      No data found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <span>
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected
                </span>
              )}
              {table.getFilteredSelectedRowModel().rows.length === 0 && (
                <span>
                  {table.getFilteredRowModel().rows.length} total items
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Active Filter Chips Component
function ActiveFilterChips() {
  const { filters, setPartial, providers, categories, systems } = useFiltersCtx();
  
  const chips: { id: string; label: string; clear: () => void }[] = [];

  // Search filter
  if (filters.search) {
    chips.push({
      id: "search",
      label: `Search: ${filters.search}`,
      clear: () => setPartial({ search: "" }),
    });
  }
  
  // Date filter
  if (filters.date) {
    chips.push({
      id: "date",
      label: format(filters.date, "PPP"),
      clear: () => setPartial({ date: undefined }),
    });
  }
  
  // Provider filter
  if (filters.provider && filters.provider !== "all") {
    const selectedProvider = providers.find(p => p.id === filters.provider);
    const providerName = selectedProvider?.name || filters.provider;
    
    chips.push({
      id: "provider",
      label: `Provider: ${providerName}`,
      clear: () => setPartial({ provider: "all" }),
    });
  }
  
  // System filter (for sales)
  if (filters.systemId && filters.systemId !== "all" && systems) {
    const selectedSystem = systems.find(s => s.id === filters.systemId);
    const systemName = selectedSystem?.name || filters.systemId;
    
    chips.push({
      id: "system",
      label: `System: ${systemName}`,
      clear: () => setPartial({ systemId: "all" }),
    });
  }
  
  // Category filter (if available)
  if (categories && filters.category && filters.category !== "all") {
    const selectedCategory = categories.find(c => c.id === filters.category);
    const categoryName = selectedCategory?.name || filters.category;
    
    chips.push({
      id: "category",
      label: `Fuel Type: ${categoryName}`,
      clear: () => setPartial({ category: "all" }),
    });
  }

  // Range filters helper
  const rangeChip = (range: [number, number], label: string, key: keyof FiltersShape) => {
    if (range[0] > 0 || range[1] > 0) {
      chips.push({
        id: key as string,
        label: `${label}: ${range[0]} — ${range[1]}`,
        clear: () => setPartial({ [key]: [0, 0] } as Partial<FiltersShape>),
      });
    }
  };

  // Add range filter chips
  rangeChip(filters.quantityRange, "Quantity", "quantityRange");
  rangeChip(filters.priceRange, "Price", "priceRange");
  rangeChip(filters.totalRange, "Total", "totalRange");

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-border/10 bg-card/40">
      {chips.map(c => (
        <Badge key={c.id} variant="outline" className="gap-1 text-xs cursor-pointer" onClick={c.clear}>
          {c.label} <ClearIcon className="h-3 w-3" />
        </Badge>
      ))}
    </div>
  );
} 