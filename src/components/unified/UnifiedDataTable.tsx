import React, {
  useState,
  useMemo,
  createContext,
  useContext,
  useTransition,
  useEffect,
} from "react";
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
import { TabSpecificFilters } from "@/components/unified/filters/TabSpecificFilters";
import { format } from "date-fns";
import { useTranslation } from "react-i18next"; // Import the useTranslation hook

// Filter context type definitions
interface FiltersShape {
  // Common filters
  search: string;
  date?: Date;
  dateRange?: [Date | undefined, Date | undefined];

  // Fuel Supplies specific filters
  provider: string;
  tankId?: string;
  fuelType?: string;

  // Sales specific filters
  systemId?: string;
  salesFuelType?: string;
  employeeId?: string;

  // Expenses specific filters
  expenseCategory?: string;
  paymentMethod?: string;
  paymentStatus?: string;

  // Range filters
  quantityRange: [number, number];
  priceRange: [number, number];
  totalRange: [number, number];

  // Backward compatibility
  category?: string;
  activeTab?: string;
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
  tanks?: {
    id: string;
    name: string;
    fuel_type: string;
    capacity: number;
    current_level: number;
  }[];
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
  tanks = [],
  onFiltersChange,
  filters: initialFilters,
  searchColumn = "name",
  searchPlaceholder = "Search...",
  initialState,
  summaryComponent,
}: UnifiedDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(
    initialState?.sorting || [],
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialState?.columnFilters || [],
  );
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialState?.columnVisibility || {},
  );
  const [rowSelection, setRowSelection] = useState({});
  const [filters, setFilters] = useState<FiltersShape>(initialFilters);
  const [filtersCollapsed, setFiltersCollapsed] = useState(true);
  const [, startTransition] = useTransition();
  const { t } = useTranslation(); // Add the useTranslation hook

  // Determine active tab based on title
  const activeTab = useMemo(() => {
    const normalizedTitle = title.toLowerCase();
    let tab: "fuel-supplies" | "sales" | "expenses" = "fuel-supplies";

    // Check for sales-related terms in various languages
    if (
      normalizedTitle.includes("sales") ||
      normalizedTitle.includes("վաճառք") ||
      normalizedTitle === "վաճառք"
    ) {
      tab = "sales";
    }
    // Check for expenses-related terms in various languages
    else if (
      normalizedTitle.includes("expenses") ||
      normalizedTitle.includes("ծախսեր")
    ) {
      tab = "expenses";
    }
    // Default to fuel supplies for other cases
    else if (
      normalizedTitle.includes("fuel") ||
      normalizedTitle.includes("supplies") ||
      normalizedTitle.includes("վառելիքի") ||
      normalizedTitle.includes("մատակարարումներ")
    ) {
      tab = "fuel-supplies";
    }

    return tab;
  }, [title]);

  // Set the active tab in filters
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      activeTab,
    }));
  }, [activeTab]);

  // Simplified filter setter that automatically updates both local state and parent
  const setPartial = (updates: Partial<FiltersShape>) => {
    setFilters((f) => ({ ...f, ...updates }));
    startTransition(() => onFiltersChange(updates));

    // If search is updated, also update the table's column filter
    if ("search" in updates && updates.search !== undefined) {
      const searchVal = updates.search;
      if (searchColumn) {
        setColumnFilters((prev) => {
          const existing = prev.filter((f) => f.id !== searchColumn);
          return searchVal
            ? [...existing, { id: searchColumn, value: searchVal }]
            : existing;
        });
      }
    }

    // Handle tab-specific filter updates
    if (activeTab === "sales" && "systemId" in updates) {
      // For sales tab, when system is changed, update the table's column filters
      const systemId = updates.systemId;
      if (systemId && systemId !== "all") {
        setColumnFilters((prev) => {
          const existing = prev.filter((f) => f.id !== "filling_system_id");
          return [...existing, { id: "filling_system_id", value: systemId }];
        });
      } else {
        setColumnFilters((prev) =>
          prev.filter((f) => f.id !== "filling_system_id"),
        );
      }
    }
  };

  // Detect if any filters are active
  const hasActiveFilters = useMemo(() => {
    // Check tab-specific filters first
    if (activeTab === "sales") {
      // For sales tab, check only relevant filters
      if (filters.systemId && filters.systemId !== "all") return true;
    } else if (activeTab === "fuel-supplies") {
      // For fuel supplies tab
      if (filters.provider && filters.provider !== "all") return true;
      if (filters.fuelType && filters.fuelType !== "all") return true;
      if (filters.tankId && filters.tankId !== "all") return true;
      // Backward compatibility
      if (filters.category && filters.category !== "all") return true;
    } else if (activeTab === "expenses") {
      // For expenses tab
      if (filters.expenseCategory && filters.expenseCategory !== "all")
        return true;
      if (filters.paymentMethod && filters.paymentMethod !== "all") return true;
      if (filters.paymentStatus && filters.paymentStatus !== "all") return true;
    }

    // Check common filters
    if (filters.search) return true;
    if (filters.date) return true;
    if (filters.dateRange && (filters.dateRange[0] || filters.dateRange[1]))
      return true;

    // Check range filters with appropriate defaults based on tab
    const quantityMax = activeTab === "expenses" ? 1000000 : 10000;
    if (
      filters.quantityRange &&
      (filters.quantityRange[0] > 0 ||
        (filters.quantityRange[1] > 0 &&
          filters.quantityRange[1] < quantityMax))
    )
      return true;

    if (
      filters.priceRange &&
      (filters.priceRange[0] > 0 ||
        (filters.priceRange[1] > 0 && filters.priceRange[1] < 10000))
    )
      return true;

    if (
      filters.totalRange &&
      (filters.totalRange[0] > 0 ||
        (filters.totalRange[1] > 0 && filters.totalRange[1] < 10000000))
    )
      return true;

    return false;
  }, [filters, activeTab]);

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters: FiltersShape = {
      search: "",
      date: undefined,
      dateRange: [undefined, undefined],
      provider: "all",
      tankId: "all",
      fuelType: "all",
      category: "all", // Backward compatibility
      systemId: "all",
      salesFuelType: "all", // Keeping for backward compatibility
      employeeId: "all", // Keeping for backward compatibility
      expenseCategory: "all",
      paymentMethod: "all",
      paymentStatus: "all",
      quantityRange: [0, activeTab === "expenses" ? 1000000 : 10000],
      priceRange: [0, 10000],
      totalRange: [0, 10000000],
      activeTab, // Preserve the active tab
    };
    setPartial(clearedFilters);
    setColumnFilters([]);
  };

  // Initialize table with tab-specific column filter handling
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
    onColumnFiltersChange: (newColumnFilters) => {
      // Ensure we have the actual column filters array
      const columnFiltersArray = Array.isArray(newColumnFilters)
        ? newColumnFilters
        : [];

      // Special handling for column filters from tab-specific actions
      const searchFilter = columnFiltersArray.find(
        (f) => f.id === searchColumn,
      );
      const systemFilter = columnFiltersArray.find(
        (f) => f.id === "filling_system_id",
      );

      // Update filters state based on column filters if they exist
      if (searchFilter && searchFilter.value) {
        setFilters((prev) => ({
          ...prev,
          search: searchFilter.value as string,
        }));
      }

      if (activeTab === "sales" && systemFilter && systemFilter.value) {
        setFilters((prev) => ({
          ...prev,
          systemId: systemFilter.value as string,
        }));
      }

      // Update column filters state
      setColumnFilters(newColumnFilters);
    },
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
              <span className="text-sm text-muted-foreground">
                {t("unifiedData.loading")}
              </span>
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

      <FiltersCtx.Provider
        value={{ filters, setPartial, providers, categories, systems }}
      >
        <Card className="border-none shadow-sm bg-card/60 backdrop-blur-sm">
          {/* FILTER BAR HEADER - Collapse/Expand Trigger */}
          <div className="flex flex-col space-y-4 p-4">
            {/* Left side - search and filter toggle */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1 md:w-80 md:flex-none">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={searchPlaceholder}
                  value={
                    (table
                      .getColumn(searchColumn)
                      ?.getFilterValue() as string) ?? ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn(searchColumn)
                      ?.setFilterValue(event.target.value)
                  }
                  className="w-full pl-8 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltersCollapsed(!filtersCollapsed)}
                className="flex items-center gap-1 bg-background/50 border-border/50 hover:bg-background/80 transition-colors"
              >
                <FilterIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline-block">
                  {t("common.filters")}
                </span>
                {filtersCollapsed ? (
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                ) : (
                  <ChevronUp className="h-3.5 w-3.5 ml-1" />
                )}
              </Button>
              {hasActiveFilters && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary-foreground"
                >
                  {hasActiveFilters ? "Active Filters" : ""}
                </Badge>
              )}
            </div>

            {/* FILTERS SECTION */}
            {!filtersCollapsed && (
              <TabSpecificFilters
                activeTab={activeTab}
                filters={filters}
                onFiltersChange={setPartial}
                providers={providers}
                categories={categories}
                systems={systems}
                tanks={tanks}
                expanded={!filtersCollapsed}
              />
            )}
          </div>
        </Card>
      </FiltersCtx.Provider>

      {/* Data Table */}
      <Card className="border-none shadow-sm">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">{title}</h3>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="ml-auto flex gap-1 items-center"
                  >
                    {t("common.columns")} <ChevronDown className="h-4 w-4" />
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
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
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
                              header.getContext(),
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
                            cell.getContext(),
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
                      {t("common.noData")}
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
                  {table.getFilteredSelectedRowModel().rows.length} {t("common.of")}{" "}
                  {table.getFilteredRowModel().rows.length} {t("common.rowsPerPage")}
                </span>
              )}
              {table.getFilteredSelectedRowModel().rows.length === 0 && (
                <span>
                  {table.getFilteredRowModel().rows.length} {t("common.total")}
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
                {t("common.previousPage")}
              </Button>
              <span className="text-sm text-muted-foreground">
                {t("common.pagination")} {table.getState().pagination.pageIndex + 1} {t("common.of")}{" "}
                {table.getPageCount()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                {t("common.nextPage")}
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
  const { filters, setPartial, providers, categories, systems } =
    useFiltersCtx();
  // Get activeTab from parent component context
  const activeTabCtx = useMemo(() => {
    if (filters.activeTab) {
      return filters.activeTab as "fuel-supplies" | "sales" | "expenses";
    }

    // Detect from available filters
    if (filters.systemId && filters.systemId !== "all") {
      return "sales";
    } else if (filters.provider && filters.provider !== "all") {
      return "fuel-supplies";
    } else if (filters.expenseCategory && filters.expenseCategory !== "all") {
      return "expenses";
    }

    return "fuel-supplies"; // Default
  }, [filters]);

  const chips: { id: string; label: string; clear: () => void }[] = [];

  // Common filters - always show regardless of tab
  if (filters.search) {
    chips.push({
      id: "search",
      label: `Search: ${filters.search}`,
      clear: () => setPartial({ search: "" }),
    });
  }

  if (filters.date) {
    chips.push({
      id: "date",
      label: format(filters.date, "PPP"),
      clear: () => setPartial({ date: undefined }),
    });
  }

  // Tab-specific filters
  if (activeTabCtx === "fuel-supplies") {
    // Provider filter - for fuel supplies
    if (filters.provider && filters.provider !== "all") {
      const selectedProvider = providers.find((p) => p.id === filters.provider);
      const providerName = selectedProvider?.name || filters.provider;

      chips.push({
        id: "provider",
        label: `Provider: ${providerName}`,
        clear: () => setPartial({ provider: "all" }),
      });
    }

    // Fuel Type filter - for fuel supplies (using category for backward compatibility)
    if (categories && filters.category && filters.category !== "all") {
      const selectedCategory = categories.find(
        (c) => c.id === filters.category,
      );
      const categoryName = selectedCategory?.name || filters.category;

      chips.push({
        id: "category",
        label: `Fuel Type: ${categoryName}`,
        clear: () => setPartial({ category: "all" }),
      });
    }

    // New fuelType property if used
    if (filters.fuelType && filters.fuelType !== "all") {
      const selectedFuelType = categories?.find(
        (c) => c.id === filters.fuelType,
      );
      const fuelTypeName = selectedFuelType?.name || filters.fuelType;

      chips.push({
        id: "fuelType",
        label: `Fuel Type: ${fuelTypeName}`,
        clear: () => setPartial({ fuelType: "all" }),
      });
    }
  } else if (activeTabCtx === "sales") {
    // System filter - for sales
    if (filters.systemId && filters.systemId !== "all" && systems) {
      const selectedSystem = systems.find((s) => s.id === filters.systemId);
      const systemName = selectedSystem?.name || filters.systemId;

      chips.push({
        id: "system",
        label: `Filling System: ${systemName}`,
        clear: () => setPartial({ systemId: "all" }),
      });
    }
  } else if (activeTabCtx === "expenses") {
    // Expense category filter
    if (filters.expenseCategory && filters.expenseCategory !== "all") {
      const selectedCategory = categories?.find(
        (c) => c.id === filters.expenseCategory,
      );
      const categoryName = selectedCategory?.name || filters.expenseCategory;

      chips.push({
        id: "expenseCategory",
        label: `Category: ${categoryName}`,
        clear: () => setPartial({ expenseCategory: "all" }),
      });
    }

    // Payment method filter
    if (filters.paymentMethod && filters.paymentMethod !== "all") {
      chips.push({
        id: "paymentMethod",
        label: `Payment: ${filters.paymentMethod}`,
        clear: () => setPartial({ paymentMethod: "all" }),
      });
    }
  }

  // Range filters helper
  const rangeChip = (
    range: [number, number],
    label: string,
    key: keyof FiltersShape,
    defaultMax: number,
  ) => {
    if (range[0] > 0 || (range[1] > 0 && range[1] < defaultMax)) {
      chips.push({
        id: key as string,
        label: `${label}: ${range[0]} — ${range[1]}`,
        clear: () =>
          setPartial({ [key]: [0, defaultMax] } as Partial<FiltersShape>),
      });
    }
  };

  // Add range filter chips with appropriate defaults based on tab
  const quantityMax = activeTabCtx === "expenses" ? 1000000 : 10000;
  rangeChip(filters.quantityRange, "Quantity", "quantityRange", quantityMax);
  rangeChip(filters.priceRange, "Price", "priceRange", 10000);
  rangeChip(filters.totalRange, "Total", "totalRange", 10000000);

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-border/10 bg-card/40">
      {chips.map((c) => (
        <Badge
          key={c.id}
          variant="outline"
          className="gap-1 text-xs cursor-pointer"
          onClick={c.clear}
        >
          {c.label} <ClearIcon className="h-3 w-3" />
        </Badge>
      ))}
    </div>
  );
}
