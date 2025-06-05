import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Badge } from "@/core/components/ui/primitives/badge";
import {
  StandardizedDataTable,
  createBadgeCell,
  createDateCell,
  createCurrencyCell,
} from "@/shared/components/unified/StandardizedDataTable";
import { useSuppliesFilters } from "../store/useSuppliesFilters";
import { FuelSupply } from "../types";
import { exportToCsv, exportToPdf } from "../utils/export";
import type { Tank, PetrolProvider } from "@/core/api/types";

// Define the shape of filter data that comes from the data table
interface FiltersShape {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  [key: string]: unknown;
}

interface SuppliesTableStandardizedProps {
  supplies: FuelSupply[];
  isLoading?: boolean;
  tanks: Tank[];
  providers: PetrolProvider[];
  onEdit?: (supply: FuelSupply) => void;
  onDelete?: (supply: FuelSupply) => void;
}

export function SuppliesTableStandardized({
  supplies,
  isLoading = false,
  tanks,
  providers,
  onEdit,
  onDelete,
}: SuppliesTableStandardizedProps) {
  const { t } = useTranslation();
  const filters = useSuppliesFilters();

  // Map the edit/delete handlers to work with the StandardizedDataTable
  const handleEdit = onEdit
    ? (id: string | number) => {
        const supply = supplies.find((s) => s.id === id);
        if (supply) onEdit(supply);
      }
    : undefined;

  const handleDelete = onDelete
    ? (id: string | number) => {
        const supply = supplies.find((s) => s.id === id);
        if (supply) onDelete(supply);
      }
    : undefined;

  // Handle filter changes
  const handleFilterChange = (newFilters: FiltersShape) => {
    if (typeof filters.setDateRange === "function") {
      // Update date range if the function exists and dates are provided
      if (newFilters.startDate && newFilters.endDate) {
        filters.setDateRange({
          from: newFilters.startDate,
          to: newFilters.endDate,
        });
      }
    }

    // Apply search filter if needed
    if (typeof filters.setSearch === "function" && newFilters.search) {
      filters.setSearch(newFilters.search);
    }
  };

  // Define columns for the StandardizedDataTable
  const columns = useMemo(
    () => [
      {
        header: t("supplies.deliveryDate", "Delivery Date"),
        accessorKey: "delivery_date" as keyof FuelSupply,
        cell: (value: string) => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(value), "PP")}</span>
          </div>
        ),
      },
      {
        header: t("supplies.provider", "Provider"),
        accessorKey: "provider" as keyof FuelSupply,
        cell: (_value: unknown, row: FuelSupply) => {
          const provider = row.provider;
          return provider?.name || t("common.unknown");
        },
      },
      {
        header: t("supplies.tank", "Tank"),
        accessorKey: "tank" as keyof FuelSupply,
        cell: (_value: unknown, row: FuelSupply) => {
          const tank = row.tank;
          return (
            <div className="flex items-center gap-2">
              <Badge variant={getFuelTypeVariant(tank?.fuel_type)}>
                {tank?.fuel_type || t("common.unknown")}
              </Badge>
              <span>{tank?.name || t("common.unknown")}</span>
            </div>
          );
        },
      },
      {
        header: t("supplies.quantity", "Quantity"),
        accessorKey: "quantity_liters" as keyof FuelSupply,
        cell: (value: number) => (
          <div className="text-right font-medium">
            {value.toLocaleString()} L
          </div>
        ),
      },
      {
        header: t("supplies.pricePerLiter", "Price/L"),
        accessorKey: "price_per_liter" as keyof FuelSupply,
        cell: (value: number) => (
          <div className="text-right font-medium">${value.toFixed(2)}</div>
        ),
      },
      {
        header: t("supplies.totalCost", "Total Cost"),
        accessorKey: "total_cost" as keyof FuelSupply,
        cell: (value: number) => (
          <div className="text-right font-medium">
            ${value.toLocaleString()}
          </div>
        ),
      },
      {
        header: t("supplies.paymentStatus", "Status"),
        accessorKey: "payment_status" as keyof FuelSupply,
        cell: (value: string) => (
          <Badge variant={getPaymentStatusVariant(value)}>
            {value || t("common.pending")}
          </Badge>
        ),
      },
    ],
    [t]
  );

  return (
    <StandardizedDataTable
      title={t("supplies.title", "Fuel Supplies")}
      columns={columns}
      data={supplies}
      loading={isLoading}
      onEdit={handleEdit}
      onDelete={handleDelete}
      filters={filters}
      onFilterChange={handleFilterChange}
      exportOptions={{
        enabled: true,
        filename: "fuel-supplies",
        exportAll: true,
      }}
      className="motion-safe:animate-fadeIn"
    />
  );
}

function getFuelTypeVariant(
  type?: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (type?.toLowerCase()) {
    case "petrol":
    case "gasoline":
    case "regular":
      return "default";
    case "diesel":
      return "secondary";
    case "premium":
      return "destructive";
    default:
      return "outline";
  }
}

function getPaymentStatusVariant(
  status?: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (status?.toLowerCase()) {
    case "paid":
      return "default";
    case "partial":
      return "secondary";
    case "unpaid":
      return "destructive";
    default:
      return "outline";
  }
}
