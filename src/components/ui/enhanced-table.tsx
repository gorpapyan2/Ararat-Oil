import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface EnhancedTableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  containerClassName?: string;
}

export function EnhancedTable({
  children,
  className,
  containerClassName,
  ...props
}: EnhancedTableProps) {
  return (
    <div
      className={cn(
        "w-full overflow-auto rounded-lg border border-border/20 bg-card/30 backdrop-blur-sm",
        containerClassName,
      )}
      {...props}
    >
      <Table className={cn("w-full", className)}>{children}</Table>
    </div>
  );
}

export function EnhancedHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <TableHeader
      className={cn(
        "bg-muted/30 backdrop-blur-sm border-b border-border/20",
        className,
      )}
      {...props}
    >
      {children}
    </TableHeader>
  );
}

export function EnhancedRow({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <TableRow
      className={cn(
        "border-b border-border/10 transition-colors hover:bg-muted/20",
        className,
      )}
      {...props}
    >
      {children}
    </TableRow>
  );
}

export function EnhancedCell({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <TableCell
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        "text-sm lg:text-base",
        className,
      )}
      {...props}
    >
      {children}
    </TableCell>
  );
}

export function EnhancedHeaderCell({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCellElement>) {
  return (
    <TableHead
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground select-none",
        "text-sm lg:text-base whitespace-nowrap",
        className,
      )}
      {...props}
    >
      {children}
    </TableHead>
  );
}

export { TableBody, TableFooter };
