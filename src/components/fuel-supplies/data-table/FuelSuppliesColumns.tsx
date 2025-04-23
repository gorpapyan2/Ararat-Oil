import { ColumnDef } from "@tanstack/react-table";
import { FuelSupply } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  createActionsColumn,
  createDateColumn,
  createCurrencyColumn,
  createNumericColumn,
} from "@/components/ui/data-table/DataTableColumnHelpers";

export const getFuelSuppliesColumns = (
  onEdit?: (supply: FuelSupply) => void,
  onDelete?: (supply: FuelSupply) => void,
  onView?: (supply: FuelSupply) => void
): ColumnDef<FuelSupply>[] => [
  createDateColumn("delivery_date", "Delivery Date"),
  {
    accessorKey: "provider.name",
    header: "Provider",
    cell: ({ row }) => row.original.provider?.name || 'N/A',
  },
  {
    accessorKey: "tank.name",
    header: "Tank",
    cell: ({ row }) => row.original.tank?.name || 'N/A',
  },
  {
    accessorKey: "payment_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.payment_status as 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';
      const statusMap = {
        'COMPLETED': { label: 'Completed', variant: 'default' as const },
        'PENDING': { label: 'Pending', variant: 'secondary' as const },
        'FAILED': { label: 'Failed', variant: 'destructive' as const },
        'CANCELLED': { label: 'Cancelled', variant: 'outline' as const }
      };
      
      const { label, variant } = statusMap[status] || { label: status, variant: 'outline' as const };
      
      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    accessorKey: "quantity_liters",
    header: "Quantity (Liters)",
    cell: ({ row }) => {
      const quantity = parseFloat(row.getValue("quantity_liters") as string);
      return <div className="text-right font-medium">{quantity.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "price_per_liter",
    header: "Price per Liter",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price_per_liter") as string);
      return <div className="text-right font-medium">{price.toLocaleString()} ֏</div>;
    },
  },
  {
    accessorKey: "total_cost",
    header: "Total Cost",
    cell: ({ row }) => {
      const total = parseFloat(row.getValue("total_cost") as string);
      return <div className="text-right font-medium">{total.toLocaleString()} ֏</div>;
    },
  },
  {
    accessorKey: "employee.name",
    header: "Employee",
    cell: ({ row }) => row.original.employee?.name || 'N/A',
  },
  {
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) => row.original.comments || 'N/A',
  },
  createActionsColumn<FuelSupply>({
    onView,
    onEdit,
    onDelete
  }),
];
