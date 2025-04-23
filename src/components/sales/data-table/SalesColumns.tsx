
import { ColumnDef } from "@tanstack/react-table";
import { Sale } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  createActionsColumn,
  createDateColumn,
  createCurrencyColumn,
  createNumericColumn,
  ActionHandlers
} from "@/components/ui/data-table/DataTableColumnHelpers";

export const getSalesColumns = (
  onView?: (sale: Sale) => void,
  onEdit?: (sale: Sale) => void,
  onDelete?: (id: string) => void
): ColumnDef<Sale>[] => [
  createDateColumn("date", "Date"),
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
  createNumericColumn("quantity", "Total Liters"),
  createCurrencyColumn("price_per_unit", "Price/Unit"),
  createCurrencyColumn("total_sales", "Total Sales"),
  createActionsColumn<Sale>({
    onView,
    onEdit,
    onDelete: onDelete ? (sale) => onDelete(sale.id) : undefined
  }),
];
