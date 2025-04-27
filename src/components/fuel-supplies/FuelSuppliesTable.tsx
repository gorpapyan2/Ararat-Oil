import { useMemo } from "react";
import { FuelSupply } from "@/types";
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
  Calendar,
  Fuel,
  Droplet,
  Banknote,
  Truck,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface FuelSuppliesTableProps {
  fuelSupplies: FuelSupply[];
  isLoading: boolean;
  onEdit: (supply: FuelSupply) => void;
  onDelete: (supply: FuelSupply) => void;
  providers?: { id: string; name: string }[];
  fuelTypes?: { id: string; name: string }[];
  onFiltersChange?: (filters: any) => void;
}

export function FuelSuppliesTable({
  fuelSupplies,
  isLoading,
  onEdit,
  onDelete,
  providers = [],
  fuelTypes = [],
  onFiltersChange = () => {},
}: FuelSuppliesTableProps) {
  const { t } = useTranslation();

  // Define columns for the UnifiedDataTable
  const columns = useMemo<ColumnDef<FuelSupply>[]>(
    () => [
      {
        id: "date",
        header: () => <div className="text-left font-medium">Date</div>,
        accessorKey: "delivery_date",
        cell: ({ row }) => {
          const date = row.getValue("delivery_date");
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
        id: "provider_name",
        header: () => <div className="text-left font-medium">Provider</div>,
        accessorKey: "provider.name",
        cell: ({ row }) => {
          const provider = row.getValue("provider.name") as string;
          return (
            <div className="flex items-center gap-2 py-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{provider || "N/A"}</span>
            </div>
          );
        },
      },
      {
        id: "tank_name",
        header: () => <div className="text-left font-medium">Tank</div>,
        accessorKey: "tank.name",
        cell: ({ row }) => {
          const tank = row.getValue("tank.name") as string;
          return (
            <div className="flex items-center gap-2 py-2">
              <Droplet className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{tank || "N/A"}</span>
            </div>
          );
        },
      },
      {
        id: "quantity_liters",
        header: () => (
          <div className="text-right font-medium">Quantity (Liters)</div>
        ),
        accessorKey: "quantity_liters",
        cell: ({ row }) => {
          const quantity = row.getValue("quantity_liters");
          const value =
            quantity !== undefined && quantity !== null
              ? Number(quantity).toFixed(2)
              : "0.00";

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
        id: "price_per_liter",
        header: () => (
          <div className="text-right font-medium">Price per Liter (֏)</div>
        ),
        accessorKey: "price_per_liter",
        cell: ({ row }) => {
          const price = row.getValue("price_per_liter");
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
        id: "total_cost",
        header: () => (
          <div className="text-right font-medium">Total Cost (֏)</div>
        ),
        accessorKey: "total_cost",
        cell: ({ row }) => {
          const totalCost = row.getValue("total_cost");
          const formattedValue =
            totalCost !== undefined && totalCost !== null
              ? Number(totalCost).toLocaleString()
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
        id: "employee_name",
        header: () => <div className="text-left font-medium">Employee</div>,
        accessorKey: "employee.name",
        cell: ({ row }) => {
          const employee = row.getValue("employee.name") as string;
          return (
            <div className="flex items-center gap-2 py-2">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{employee || "N/A"}</span>
            </div>
          );
        },
      },
      {
        id: "comments",
        header: () => <div className="text-left font-medium">Comments</div>,
        accessorKey: "comments",
        cell: ({ row }) => {
          const comments = row.getValue("comments") as string;
          return (
            <div className="flex items-center gap-2 py-2">
              <span className="font-medium">{comments || "N/A"}</span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-center font-medium">{t("common.actions")}</div>,
        cell: ({ row }) => {
          const supply = row.original;
          return (
            <div className="flex justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">{t("common.openMenu")}</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(supply)}>
                    <Edit className="mr-2 h-4 w-4" />
                    {t("fuelSupplies.editSupply")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onDelete(supply)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("common.delete")} {t("fuelSupplies.supplies").toLowerCase()}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete, t],
  );

  return (
    <UnifiedDataTable
      title={t("fuelSupplies.title")}
      columns={columns}
      data={fuelSupplies}
      isLoading={isLoading}
      providers={providers}
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
      searchColumn="provider.name"
      searchPlaceholder={t("fuelSupplies.searchProviderPlaceholder")}
    />
  );
}
