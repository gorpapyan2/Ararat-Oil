import React from "react";
import { cn } from "@/lib/utils";
import {
  Table as ShadcnTable,
  TableHeader as ShadcnTableHeader,
  TableBody as ShadcnTableBody,
  TableFooter as ShadcnTableFooter,
  TableHead as ShadcnTableHead,
  TableRow as ShadcnTableRow,
  TableCell as ShadcnTableCell,
  TableCaption as ShadcnTableCaption,
} from "@/components/ui/table";
import { Card } from "./card";

// Enhanced Table wrapper with sticky header and other improvements
const Table = React.forwardRef<
  React.ElementRef<typeof ShadcnTable>,
  React.ComponentPropsWithoutRef<typeof ShadcnTable> & {
    containerClassName?: string;
    isLoading?: boolean;
    stickyHeader?: boolean;
    noShadow?: boolean;
    maxHeight?: string;
  }
>(
  (
    {
      className,
      containerClassName,
      isLoading = false,
      stickyHeader = false,
      maxHeight = "none",
      noShadow = false,
      children,
      ...props
    },
    ref,
  ) => (
    <div
      className={cn(
        "relative rounded-xl border bg-card",
        !noShadow && "shadow-sm",
        containerClassName,
      )}
    >
      <div
        className={cn(
          "overflow-auto no-scrollbar",
          stickyHeader && "rounded-xl",
          maxHeight !== "none" && "max-h-[--max-height]",
        )}
        style={
          maxHeight !== "none"
            ? ({ "--max-height": maxHeight } as React.CSSProperties)
            : {}
        }
      >
        <ShadcnTable
          ref={ref}
          className={cn(
            "w-full caption-bottom text-sm",
            isLoading && "opacity-50",
            className,
          )}
          {...props}
        >
          {children}
        </ShadcnTable>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
            <div className="rounded-full h-8 w-8 border-4 border-primary/30 border-t-primary animate-spin" />
          </div>
        )}
      </div>
    </div>
  ),
);
Table.displayName = "Table";

// Custom Header with sticky option
const TableHeader = React.forwardRef<
  React.ElementRef<typeof ShadcnTableHeader>,
  React.ComponentPropsWithoutRef<typeof ShadcnTableHeader> & {
    sticky?: boolean;
  }
>(({ className, sticky = false, ...props }, ref) => (
  <ShadcnTableHeader
    ref={ref}
    className={cn(
      "[&_tr]:border-b",
      sticky &&
        "sticky top-0 z-10 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60",
      className,
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

// Customized Table Body
const TableBody = React.forwardRef<
  React.ElementRef<typeof ShadcnTableBody>,
  React.ComponentPropsWithoutRef<typeof ShadcnTableBody> & {
    empty?: boolean;
    emptyContent?: React.ReactNode;
  }
>(({ className, empty = false, emptyContent, ...props }, ref) => {
  if (empty) {
    return (
      <ShadcnTableBody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
      >
        <TableRow>
          <TableCell colSpan={100} className="h-64 text-center">
            {emptyContent || (
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground p-4">
                <p className="text-lg">No data to display</p>
                <p className="text-sm">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            )}
          </TableCell>
        </TableRow>
      </ShadcnTableBody>
    );
  }

  return (
    <ShadcnTableBody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
});
TableBody.displayName = "TableBody";

// Enhanced Table Head with sorting indicators
const TableHead = React.forwardRef<
  React.ElementRef<typeof ShadcnTableHead>,
  React.ComponentPropsWithoutRef<typeof ShadcnTableHead> & {
    sortable?: boolean;
    sortDirection?: "asc" | "desc" | null;
  }
>(({ className, sortable = false, sortDirection, children, ...props }, ref) => {
  const sortIcon =
    sortDirection === "asc" ? "↑" : sortDirection === "desc" ? "↓" : "↕";

  return (
    <ShadcnTableHead
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground",
        "[&:has([role=checkbox])]:pr-0",
        sortable && "cursor-pointer hover:text-foreground transition-colors",
        className,
      )}
      {...props}
    >
      {children}
      {sortable && sortDirection && (
        <span className="ml-2 text-xs font-normal">{sortIcon}</span>
      )}
    </ShadcnTableHead>
  );
});
TableHead.displayName = "TableHead";

// Enhanced TableRow with selectable state
const TableRow = React.forwardRef<
  React.ElementRef<typeof ShadcnTableRow>,
  React.ComponentPropsWithoutRef<typeof ShadcnTableRow> & {
    highlight?: boolean;
  }
>(({ className, highlight = false, ...props }, ref) => (
  <ShadcnTableRow
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      highlight && "bg-primary/5",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableCell = React.forwardRef<
  React.ElementRef<typeof ShadcnTableCell>,
  React.ComponentPropsWithoutRef<typeof ShadcnTableCell>
>(({ className, ...props }, ref) => (
  <ShadcnTableCell
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableFooter = React.forwardRef<
  React.ElementRef<typeof ShadcnTableFooter>,
  React.ComponentPropsWithoutRef<typeof ShadcnTableFooter>
>(({ className, ...props }, ref) => (
  <ShadcnTableFooter
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableCaption = React.forwardRef<
  React.ElementRef<typeof ShadcnTableCaption>,
  React.ComponentPropsWithoutRef<typeof ShadcnTableCaption>
>(({ className, ...props }, ref) => (
  <ShadcnTableCaption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

// Data table with filters, pagination etc.
type DataTableProps<T> = {
  data: T[];
  columns: {
    accessor: keyof T;
    header: string;
    cell?: (value: any, item: T) => React.ReactNode;
    sortable?: boolean;
  }[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  className?: string;
  stickyHeader?: boolean;
  maxHeight?: string;
  emptyContent?: React.ReactNode;
};

function DataTable<T>({
  data,
  columns,
  isLoading = false,
  onRowClick,
  className,
  stickyHeader = true,
  maxHeight = "none",
  emptyContent,
}: DataTableProps<T>) {
  return (
    <Table
      className={className}
      isLoading={isLoading}
      stickyHeader={stickyHeader}
      maxHeight={maxHeight}
    >
      <TableHeader sticky={stickyHeader}>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.accessor as string}
              sortable={column.sortable}
            >
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody empty={data.length === 0} emptyContent={emptyContent}>
        {data.map((item, i) => (
          <TableRow
            key={i}
            onClick={onRowClick ? () => onRowClick(item) : undefined}
            className={onRowClick ? "cursor-pointer" : undefined}
          >
            {columns.map((column) => (
              <TableCell key={column.accessor as string}>
                {column.cell
                  ? column.cell(item[column.accessor], item)
                  : (item[column.accessor] as React.ReactNode)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  DataTable,
};
