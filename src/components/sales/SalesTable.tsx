import { useMemo } from "react";
import { Sale } from "@/types";
import { format } from "date-fns";
import { UnifiedDataTable } from "@/components/unified/UnifiedDataTable";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit,
  MoreHorizontal,
  Trash2,
  Eye,
  Calendar,
  Fuel,
  Droplet,
  Banknote,
} from "lucide-react";

interface SalesTableProps {
  sales: Sale[];
  isLoading: boolean;
  onEdit?: (sale: Sale) => void;
  onDelete?: (id: string) => void;
  onView?: (sale: Sale) => void;
  systems?: { id: string; name: string }[];
  fuelTypes?: { id: string; name: string }[];
  onFiltersChange?: (filters: any) => void;
}

export function SalesTable({
  sales,
  isLoading,
  onEdit,
  onDelete,
  onView,
  systems = [],
  fuelTypes = [],
  onFiltersChange = () => {},
}: SalesTableProps) {
  // Define columns for the UnifiedDataTable
  const columns = useMemo<ColumnDef<Sale>[]>(
    () => [
      {
        id: "date",
        header: () => <div className="text-left font-medium">Date</div>,
        accessorKey: "date",
        cell: ({ row }) => {
          const date = row.getValue("date");
          return (
            <div className="flex items-center gap-2 py-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {date && typeof date === "string"
                  ? format(new Date(date), "PP")
                  : "N/A"}
              </span>
            </div>
          );
        },
      },
      {
        id: "filling_system_name",
        header: () => (
          <div className="text-left font-medium">Filling System</div>
        ),
        accessorKey: "filling_system_name",
        cell: ({ row }) => {
          const system = row.getValue("filling_system_name") as string;
          return (
            <div className="flex items-center gap-2 py-2">
              <Fuel className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{system || "N/A"}</span>
            </div>
          );
        },
      },
      {
        id: "quantity",
        header: () => (
          <div className="text-right font-medium">Total Liters</div>
        ),
        accessorKey: "quantity",
        cell: ({ row }) => {
          const quantity = row.getValue("quantity");
          const value =
            quantity !== undefined && quantity !== null
              ? Number(quantity).toFixed(2)
              : "0";

          return (
            <div className="text-right font-medium tabular-nums">
              <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">
                {value} L
              </span>
            </div>
          );
        },
      },
      {
        id: "price_per_unit",
        header: () => <div className="text-right font-medium">Price/Unit</div>,
        accessorKey: "price_per_unit",
        cell: ({ row }) => {
          const price = row.getValue("price_per_unit");
          const formattedPrice =
            price !== undefined && price !== null
              ? Number(price).toLocaleString()
              : "0";

          return (
            <div className="text-right font-medium tabular-nums">
              {formattedPrice} ֏
            </div>
          );
        },
      },
      {
        id: "total_sales",
        header: () => <div className="text-right font-medium">Total Sales</div>,
        accessorKey: "total_sales",
        cell: ({ row }) => {
          const totalSales = row.getValue("total_sales");
          const formattedValue =
            totalSales !== undefined && totalSales !== null
              ? Number(totalSales).toLocaleString()
              : "0";

          return (
            <div className="text-right font-medium tabular-nums">
              <span className="font-semibold text-primary">
                {formattedValue} ֏
              </span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-center font-medium">Actions</div>,
        cell: ({ row }) => {
          const sale = row.original;
          return (
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onView && (
                    <DropdownMenuItem onClick={() => onView(sale)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View details
                    </DropdownMenuItem>
                  )}
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(sale)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit sale
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDelete(sale.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete sale
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [onView, onEdit, onDelete],
  );

  return (
    <UnifiedDataTable
      title="Sales"
      columns={columns}
      data={sales}
      isLoading={isLoading}
      providers={[]}
      systems={systems}
      categories={fuelTypes}
      onFiltersChange={onFiltersChange}
      filters={{
        search: "",
        provider: "all",
        systemId: "all",
        salesFuelType: "all",
        quantityRange: [0, 10000],
        priceRange: [0, 10000],
        totalRange: [0, 10000000],
      }}
      searchColumn="filling_system_name"
      searchPlaceholder="Search by filling system..."
    />
  );
}
