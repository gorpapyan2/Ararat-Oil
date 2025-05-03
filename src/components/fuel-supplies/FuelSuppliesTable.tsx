import { useMemo, useState } from "react";
import { FuelSupply } from "@/types";
import { format } from "date-fns";
import { StandardizedDataTable, createBadgeCell, createCurrencyCell, FiltersShape } from "@/components/unified/StandardizedDataTable";
import { Badge } from "@/components/ui/badge";
import {
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
  onEdit: (supplyId: string | number) => void;
  onDelete: (supplyId: string | number) => void;
  providers?: { id: string; name: string }[];
  fuelTypes?: { id: string; name: string }[];
  onFiltersChange?: (filters: any) => void;
  totalCount?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onSortChange?: (column: string | null, direction: 'asc' | 'desc') => void;
}

export function FuelSuppliesTable({
  fuelSupplies,
  isLoading,
  onEdit,
  onDelete,
  providers = [],
  fuelTypes = [],
  onFiltersChange = () => {},
  totalCount = 0,
  onPageChange,
  onSortChange,
}: FuelSuppliesTableProps) {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FiltersShape>({
    searchTerm: "",
    supplier: "all",
    fuelType: "all",
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: FiltersShape) => {
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Define columns for the StandardizedDataTable
  const columns = useMemo(() => [
    {
      accessorKey: "delivery_date" as keyof FuelSupply,
      header: "Date",
      cell: (value: any, row: FuelSupply) => (
        <div className="flex items-center gap-2 py-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {value && typeof value === "string"
              ? format(new Date(value), "PP")
              : "N/A"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "provider" as keyof FuelSupply,
      header: t("fuel-supplies.provider"),
      cell: (value: any, row: FuelSupply) => {
        const provider = value && value.name ? value.name : t("common.unknown");
        return (
          <div className="flex items-center gap-2 py-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{provider}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "tank" as keyof FuelSupply,
      header: "Tank",
      cell: (value: any, row: FuelSupply) => {
        const tankName = value && value.name ? value.name : "N/A";
        return (
          <div className="flex items-center gap-2 py-2">
            <Droplet className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{tankName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "quantity_liters" as keyof FuelSupply,
      header: "Quantity (Liters)",
      cell: (value: any, row: FuelSupply) => {
        const quantity = value !== undefined && value !== null
          ? Number(value).toFixed(2)
          : "0.00";

        return (
          <div className="text-right font-medium tabular-nums">
            <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">
              {quantity} L
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "price_per_liter" as keyof FuelSupply,
      header: "Price per Liter (֏)",
      cell: (value: any, row: FuelSupply) => {
        const price = value !== undefined && value !== null
          ? Number(value).toLocaleString()
          : "0";

        return (
          <div className="text-right font-medium tabular-nums">
            {price} ֏
          </div>
        );
      },
    },
    {
      accessorKey: "total_cost" as keyof FuelSupply,
      header: "Total Cost (֏)",
      cell: (value: any, row: FuelSupply) => {
        const formattedValue = value !== undefined && value !== null
          ? Number(value).toLocaleString()
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
      accessorKey: "employee" as keyof FuelSupply,
      header: "Employee",
      cell: (value: any, row: FuelSupply) => {
        const employeeName = value && value.name ? value.name : "N/A";
        return (
          <div className="flex items-center gap-2 py-2">
            <Banknote className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{employeeName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "comments" as keyof FuelSupply,
      header: "Comments",
      cell: (value: any) => (
        <div className="flex items-center gap-2 py-2">
          <span className="font-medium">{value || "N/A"}</span>
        </div>
      ),
    },
  ], [t]);

  const isServerSide = Boolean(onPageChange && onSortChange);

  return (
    <StandardizedDataTable
      title={t("fuelSupplies.title")}
      columns={columns}
      data={fuelSupplies}
      loading={isLoading}
      onEdit={onEdit}
      onDelete={onDelete}
      filters={filters}
      onFilterChange={handleFilterChange}
      totalRows={totalCount}
      serverSide={isServerSide}
      onPageChange={onPageChange}
      onSortChange={onSortChange}
      exportOptions={{
        enabled: true,
        filename: 'fuel-supplies-export',
        exportAll: true
      }}
    />
  );
}
