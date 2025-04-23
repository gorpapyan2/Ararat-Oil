import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";

// Type for action handlers
export type ActionHandlers<T> = {
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
};

// Helper to format currency
export const formatCurrency = (value: number): string => {
  return value.toLocaleString() + " ֏";
};

// Helper to format date
export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), "PPP");
};

// Helper to create an actions column
export function createActionsColumn<T extends { id: string }>(
  handlers: ActionHandlers<T>
): ColumnDef<T> {
  return {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const item = row.original;
      
      return (
        <TooltipProvider>
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {handlers.onView && (
                  <DropdownMenuItem onClick={() => handlers.onView?.(item)}>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>View</span>
                  </DropdownMenuItem>
                )}
                {handlers.onEdit && (
                  <DropdownMenuItem onClick={() => handlers.onEdit?.(item)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                )}
                {handlers.onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => handlers.onDelete?.(item)}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TooltipProvider>
      );
    },
  };
}

// Helper to create a status badge column
export function createStatusColumn<T>(
  accessorKey: keyof T,
  header: string,
  statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }>
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ row }) => {
      const status = row.getValue(accessorKey as string) as string;
      const statusInfo = statusMap[status] || { label: status, variant: "outline" };
      
      return (
        <Badge variant={statusInfo.variant}>
          {statusInfo.label}
        </Badge>
      );
    },
  };
}

// Helper to create a currency column
export function createCurrencyColumn<T>(
  accessorKey: keyof T,
  header: string
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ row }) => {
      const value = parseFloat(row.getValue(accessorKey as string) as string);
      return <div className="text-right font-medium">{formatCurrency(value)}</div>;
    },
  };
}

// Helper to create a numeric column
export function createNumericColumn<T>(
  accessorKey: keyof T,
  header: string,
  format: (value: number) => string = (value) => value.toFixed(2)
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ row }) => {
      const value = parseFloat(row.getValue(accessorKey as string) as string);
      return <div className="text-right font-medium">{format(value)}</div>;
    },
  };
}

// Helper to create a date column
export function createDateColumn<T>(
  accessorKey: keyof T,
  header: string
): ColumnDef<T> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ row }) => {
      const dateString = row.getValue(accessorKey as string) as string;
      return <div>{formatDate(dateString)}</div>;
    },
  };
}
