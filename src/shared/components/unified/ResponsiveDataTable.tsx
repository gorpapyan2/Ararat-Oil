import React, { useState, useMemo } from "react";
import {
  StandardizedDataTable,
  type StandardizedDataTableProps,
} from "./StandardizedDataTable";
import { useIsMobile, useIsTablet } from "@/hooks/useResponsive";
import { ChevronRight, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/primitives/card";
import { Badge } from "@/core/components/ui/primitives/badge";
import { VisuallyHidden } from "@/core/components/ui/accessibility/visually-hidden";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
  DrawerHeader,
} from "@/core/components/ui/drawer";

/**
 * ResponsiveDataTable component that handles different views based on screen size.
 * On mobile, it displays a card-based layout instead of a traditional table.
 * On tablet, it optimizes the table for touch and reduces visible columns.
 */
export function ResponsiveDataTable<TData extends object>(
  props: StandardizedDataTableProps<TData>
) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  if (isMobile) {
    return <MobileDataView {...props} />;
  }

  if (isTablet) {
    return <TabletDataView {...props} />;
  }

  return <StandardizedDataTable {...props} />;
}

/**
 * Mobile-optimized view of the data table that displays data as cards
 */
function MobileDataView<TData extends object>({
  title,
  columns,
  data,
  loading,
  onRowClick,
  onEdit,
  onDelete,
  filters,
  onFilterChange,
  exportOptions,
  "aria-label": ariaLabel,
  getRowAriaLabel,
}: StandardizedDataTableProps<TData>) {
  const [expandedRows, setExpandedRows] = useState<
    Record<string | number, boolean>
  >({});

  // Handle row expansion
  const toggleRow = (id: string | number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Get the "id" from the row data - essential for expandable rows
  const getRowId = (row: TData): string | number => {
    return (row as TData & { id?: string | number }).id?.toString() || "";
  };

  // Get a display value for the column
  const getColumnValue = (row: TData, column: (typeof columns)[0]) => {
    const value = (row as Record<string, unknown>)[column.accessorKey];
    if (column.cell) {
      return column.cell(value, row);
    }
    return value;
  };

  // Determine primary and secondary columns for the card view
  const primaryColumn = columns[0]; // First column as primary
  const secondaryColumns = columns.slice(1, 3); // Next two columns for the card header
  const detailColumns = columns.slice(3, -1); // Remaining columns for details (excluding actions)

  // Find the actions column if it exists
  const actionsColumn = columns.find(
    (col) => col.accessorKey.toString() === "actions"
  );

  return (
    <div
      className="space-y-4"
      aria-label={ariaLabel || "Data table, card view for mobile devices"}
    >
      {title && <h2 className="text-lg font-semibold">{title}</h2>}

      {loading && (
        <div className="flex justify-center py-8">
          <div
            className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
            role="status"
            aria-label="Loading"
          ></div>
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No results found
        </div>
      )}

      <div className="space-y-3">
        {data.map((row, index) => {
          const rowId = getRowId(row);
          const isExpanded = expandedRows[rowId] || false;
          const rowLabel = getRowAriaLabel
            ? getRowAriaLabel(row)
            : `Row ${index + 1}`;

          return (
            <Card key={rowId} className="overflow-hidden">
              <CardHeader className="pb-0">
                <div className="flex justify-between items-start">
                  <div
                    className="cursor-pointer flex-1"
                    onClick={() => {
                      if (onRowClick) {
                        onRowClick(row);
                      } else {
                        toggleRow(rowId);
                      }
                    }}
                  >
                    <CardTitle className="text-base font-medium">
                      {getColumnValue(row, primaryColumn)}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
                      {secondaryColumns.map((col) => (
                        <div
                          key={col.accessorKey.toString()}
                          className="flex items-center gap-1"
                        >
                          <span className="font-medium">{col.header}:</span>
                          <span>{getColumnValue(row, col)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {actionsColumn && (
                      <div>{getColumnValue(row, actionsColumn)}</div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleRow(rowId)}
                      aria-expanded={isExpanded}
                      aria-label={
                        isExpanded ? "Collapse details" : "Expand details"
                      }
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <VisuallyHidden>
                        {isExpanded ? "Collapse" : "Expand"} details for{" "}
                        {rowLabel}
                      </VisuallyHidden>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent>
                  <dl className="grid grid-cols-1 gap-3 pt-3">
                    {detailColumns.map((col) => (
                      <div key={col.accessorKey.toString()}>
                        <dt className="text-sm font-medium text-muted-foreground">
                          {col.header}
                        </dt>
                        <dd className="mt-1">{getColumnValue(row, col)}</dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Mobile pagination could go here */}
      {/* For now, we'll keep it simple */}
      {data.length > 0 && (
        <div className="flex justify-center py-2">
          <Badge variant="outline" className="text-xs">
            Showing {data.length} items
          </Badge>
        </div>
      )}

      {/* Export button if enabled */}
      {exportOptions?.enabled && (
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              // Trigger export function from props
              const dataTableRef = document.getElementById("data-table-ref");
              if (dataTableRef) {
                const exportButton = dataTableRef.querySelector(
                  '[aria-label="Export data"]'
                );
                if (exportButton && exportButton instanceof HTMLElement) {
                  exportButton.click();
                }
              }
            }}
          >
            Export Data
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Tablet-optimized view of the data table
 * Reduces visible columns and adds drawer for filters
 */
function TabletDataView<TData extends object>(
  props: StandardizedDataTableProps<TData>
) {
  const { columns, filters, onFilterChange, ...restProps } = props;

  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);

  // Optimize columns for tablet view (show only the most important ones)
  const optimizedColumns = useMemo(() => {
    // Keep only the most essential columns (first 4 and actions if present)
    const essentialColumns = columns.slice(0, 4);

    // Check if there's an actions column and add it if present
    const actionsColumn = columns.find(
      (col) =>
        col.accessorKey.toString() === "actions" ||
        (typeof col.accessorKey === "string" &&
          col.accessorKey.includes("action"))
    );

    if (actionsColumn && !essentialColumns.includes(actionsColumn)) {
      return [...essentialColumns, actionsColumn];
    }

    return essentialColumns;
  }, [columns]);

  // Create a filter drawer for tablet view
  const renderFilterDrawer = () => {
    if (!filters || !onFilterChange) return null;

    return (
      <Drawer open={isFiltersDrawerOpen} onOpenChange={setIsFiltersDrawerOpen}>
        <DrawerTrigger as Child>
          <Button
            variant="outline"
            size="sm"
            className="mb-4"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" aria-hidden="true" />
            Filters
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 py-2">
            {/* Filter controls would go here */}
            <div className="space-y-4">
              {/* This is a placeholder for filter UI */}
              {/* In a real implementation, you'd render filter controls based on filters prop */}
              <p className="text-sm text-muted-foreground">
                Filter controls would be rendered here based on available
                filters
              </p>
            </div>
          </div>
          <DrawerFooter>
            <Button
              onClick={() => setIsFiltersDrawerOpen(false)}
              className="w-full"
            >
              Apply Filters
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  };

  return (
    <div className="tablet-data-view">
      {renderFilterDrawer()}
      <StandardizedDataTable
        {...restProps}
        columns={optimizedColumns}
        filters={filters}
        onFilterChange={onFilterChange}
        className="tablet-optimized"
      />

      {/* Show a hint about hidden columns */}
      {columns.length > optimizedColumns.length && (
        <div className="mt-2 text-xs text-center text-muted-foreground">
          <Badge variant="outline" className="font-normal">
            {columns.length - optimizedColumns.length} columns hidden in tablet
            view
          </Badge>
        </div>
      )}
    </div>
  );
}
