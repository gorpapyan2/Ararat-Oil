import * as React from "react";
import { cva } from 'class-variance-authority';
import { cn } from "@/shared/utils";

/**
 * Table container with variants
 */
const tableVariants = cva("w-full caption-bottom text-sm", {
  variants: {
    variant: {
      default: "border border-border rounded-md overflow-hidden",
      outline: "border border-border rounded-md overflow-hidden",
      minimal: "",
    },
    size: {
      sm: "[&_th]:py-2 [&_th]:px-2 [&_td]:py-2 [&_td]:px-2",
      md: "[&_th]:py-3 [&_th]:px-3 [&_td]:py-3 [&_td]:px-3",
      lg: "[&_th]:py-4 [&_th]:px-4 [&_td]:py-4 [&_td]:px-4",
    },
    density: {
      compact: "text-xs [&_th]:p-2 [&_td]:p-2",
      default: "",
      relaxed: "[&_th]:py-4 [&_td]:py-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    density: "default",
  },
});

export interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
    VariantProps<typeof tableVariants> {
  /**
   * Makes the table horizontally scrollable on smaller screens
   */
  responsive?: boolean;
}

/**
 * Table component for displaying data in rows and columns
 */
const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, variant, size, density, responsive = true, ...props }, ref) => {
    const table = (
      <table
        ref={ref}
        className={cn(tableVariants({ variant, size, density }), className)}
        {...props}
      />
    );

    if (responsive) {
      return <div className="relative w-full overflow-auto">{table}</div>;
    }

    return table;
  }
);
Table.displayName = "Table";

/**
 * Table header container
 */
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("bg-muted", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

/**
 * Table body container
 */
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

/**
 * Table footer container
 */
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("bg-muted font-medium", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

/**
 * Table row component with selection support
 */
export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  /**
   * Whether the row is selected
   */
  selected?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        selected && "bg-muted",
        className
      )}
      {...(selected ? { "data-state": "selected" } : {})}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

/**
 * Table header cell with sorting capability
 */
export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /**
   * Sort direction
   */
  sortDirection?: "asc" | "desc" | null;

  /**
   * Whether the column is sortable
   */
  sortable?: boolean;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, sortDirection, sortable, ...props }, ref) => {
    // ARIA sort attributes for accessibility
    const ariaSort =
      sortDirection === null
        ? undefined
        : sortDirection === "asc"
          ? "ascending"
          : "descending";

    return (
      <th
        ref={ref}
        className={cn(
          "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
          sortable && "cursor-pointer select-none",
          className
        )}
        aria-sort={ariaSort}
        tabIndex={sortable ? 0 : undefined}
        role={sortable ? "columnheader button" : "columnheader"}
        {...props}
      >
        <div className="flex items-center gap-1">
          {children}
          {sortable && (
            <div className="flex flex-col gap-0.5 ml-1">
              <span
                className={cn(
                  "h-0 w-0 border-x-4 border-x-transparent border-b-4 border-b-muted-foreground/40",
                  sortDirection === "asc" && "border-b-primary"
                )}
              />
              <span
                className={cn(
                  "h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-muted-foreground/40",
                  sortDirection === "desc" && "border-t-primary"
                )}
              />
            </div>
          )}
        </div>
      </th>
    );
  }
);
TableHead.displayName = "TableHead";

/**
 * Table cell component
 */
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

/**
 * Table caption component
 */
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
