import { ColumnDef } from "@tanstack/react-table";
import { Sale } from "@/types";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

export const getSalesColumns = (
  onView: (sale: Sale) => void,
  onEdit?: (sale: Sale) => void,
  onDelete?: (id: string) => void,
): ColumnDef<Sale>[] => [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const saleDate = row.getValue("date") as string;
      return <div>{format(new Date(saleDate), "PPP")}</div>;
    },
  },
  {
    accessorKey: "filling_system_name",
    header: "Filling System",
    cell: ({ row }) => {
      const system = row.getValue("filling_system_name") as string;
      const fuelType = row.original.fuel_type;
      return (
        <div className="flex flex-col">
          <span>{system}</span>
          <Badge variant="outline" className="mt-1 w-fit">
            {fuelType}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Total Liters",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("quantity"));
      return <div className="text-right font-medium">{amount.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "price_per_unit",
    header: "Price/Unit (֏)",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price_per_unit"));
      return (
        <div className="text-right font-medium">{price.toLocaleString()}</div>
      );
    },
  },
  {
    accessorKey: "total_sales",
    header: "Total Sales (֏)",
    cell: ({ row }) => {
      const totalSales = parseFloat(row.getValue("total_sales"));
      return (
        <div className="text-right font-medium">
          {totalSales.toLocaleString()}
        </div>
      );
    },
  },
  ...(onEdit || onDelete ? [
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const sale = row.original;
  
        return (
          <div className="flex items-center justify-end gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(sale)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
  
            {onEdit && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(sale)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit sale</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
  
            {(onEdit || onDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(sale)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View details
                  </DropdownMenuItem>
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(sale)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit sale
                    </DropdownMenuItem>
                  )}
                  {onEdit && onDelete && <DropdownMenuSeparator />}
                  {onDelete && (
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDelete(sale.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete sale
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        );
      },
    },
  ] : []),
];
