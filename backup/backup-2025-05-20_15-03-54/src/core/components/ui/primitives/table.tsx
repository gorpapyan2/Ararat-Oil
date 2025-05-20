import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Interface for TablePrimitive component props
 */
export interface TablePrimitiveProps
  extends React.HTMLAttributes<HTMLTableElement> {
  /**
   * Forward ref to the table element
   */
  ref?: React.ForwardedRef<HTMLTableElement>;
}

/**
 * Base primitive Table component
 * Handles layout and structure without styling
 */
export const TablePrimitive = React.forwardRef<
  HTMLTableElement,
  TablePrimitiveProps
>(({ className, ...props }, ref) => {
  return <table ref={ref} className={cn(className)} {...props} />;
});
TablePrimitive.displayName = "TablePrimitive";

/**
 * Interface for TableHeaderPrimitive component props
 */
export interface TableHeaderPrimitiveProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  /**
   * Forward ref to the thead element
   */
  ref?: React.ForwardedRef<HTMLTableSectionElement>;
}

/**
 * Base primitive TableHeader component
 */
export const TableHeaderPrimitive = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderPrimitiveProps
>(({ className, ...props }, ref) => {
  return <thead ref={ref} className={cn(className)} {...props} />;
});
TableHeaderPrimitive.displayName = "TableHeaderPrimitive";

/**
 * Interface for TableBodyPrimitive component props
 */
export interface TableBodyPrimitiveProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  /**
   * Forward ref to the tbody element
   */
  ref?: React.ForwardedRef<HTMLTableSectionElement>;
}

/**
 * Base primitive TableBody component
 */
export const TableBodyPrimitive = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyPrimitiveProps
>(({ className, ...props }, ref) => {
  return <tbody ref={ref} className={cn(className)} {...props} />;
});
TableBodyPrimitive.displayName = "TableBodyPrimitive";

/**
 * Interface for TableFooterPrimitive component props
 */
export interface TableFooterPrimitiveProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  /**
   * Forward ref to the tfoot element
   */
  ref?: React.ForwardedRef<HTMLTableSectionElement>;
}

/**
 * Base primitive TableFooter component
 */
export const TableFooterPrimitive = React.forwardRef<
  HTMLTableSectionElement,
  TableFooterPrimitiveProps
>(({ className, ...props }, ref) => {
  return <tfoot ref={ref} className={cn(className)} {...props} />;
});
TableFooterPrimitive.displayName = "TableFooterPrimitive";

/**
 * Interface for TableRowPrimitive component props
 */
export interface TableRowPrimitiveProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  /**
   * Forward ref to the tr element
   */
  ref?: React.ForwardedRef<HTMLTableRowElement>;
}

/**
 * Base primitive TableRow component
 */
export const TableRowPrimitive = React.forwardRef<
  HTMLTableRowElement,
  TableRowPrimitiveProps
>(({ className, ...props }, ref) => {
  return <tr ref={ref} className={cn(className)} {...props} />;
});
TableRowPrimitive.displayName = "TableRowPrimitive";

/**
 * Interface for TableHeadPrimitive component props
 */
export interface TableHeadPrimitiveProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /**
   * Forward ref to the th element
   */
  ref?: React.ForwardedRef<HTMLTableCellElement>;
}

/**
 * Base primitive TableHead component
 */
export const TableHeadPrimitive = React.forwardRef<
  HTMLTableCellElement,
  TableHeadPrimitiveProps
>(({ className, ...props }, ref) => {
  return <th ref={ref} className={cn(className)} {...props} />;
});
TableHeadPrimitive.displayName = "TableHeadPrimitive";

/**
 * Interface for TableCellPrimitive component props
 */
export interface TableCellPrimitiveProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /**
   * Forward ref to the td element
   */
  ref?: React.ForwardedRef<HTMLTableCellElement>;
}

/**
 * Base primitive TableCell component
 */
export const TableCellPrimitive = React.forwardRef<
  HTMLTableCellElement,
  TableCellPrimitiveProps
>(({ className, ...props }, ref) => {
  return <td ref={ref} className={cn(className)} {...props} />;
});
TableCellPrimitive.displayName = "TableCellPrimitive";

/**
 * Interface for TableCaptionPrimitive component props
 */
export interface TableCaptionPrimitiveProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {
  /**
   * Forward ref to the caption element
   */
  ref?: React.ForwardedRef<HTMLTableCaptionElement>;
}

/**
 * Base primitive TableCaption component
 */
export const TableCaptionPrimitive = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionPrimitiveProps
>(({ className, ...props }, ref) => {
  return <caption ref={ref} className={cn(className)} {...props} />;
});
TableCaptionPrimitive.displayName = "TableCaptionPrimitive"; 