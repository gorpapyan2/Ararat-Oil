import { useMemo, useState } from "react";
import { Sale } from "@/types";
import { format } from "date-fns";
import { StandardizedDataTable, FiltersShape } from "@/components/unified/StandardizedDataTable";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Fuel,
  Droplet,
  Banknote,
} from "lucide-react";

interface SalesTableProps {
  sales: Sale[];
  isLoading: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onView?: (sale: Sale) => void;
  systems?: { id: string; name: string }[];
  fuelTypes?: { id: string; name: string }[];
  onFiltersChange?: (filters: any) => void;
  totalCount?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onSortChange?: (column: string | null, direction: 'asc' | 'desc') => void;
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
  totalCount = 0,
  onPageChange,
  onSortChange,
}: SalesTableProps) {
  const [filters, setFilters] = useState<FiltersShape>({
    searchTerm: "",
    product: "all",
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
      accessorKey: "date" as keyof Sale,
      header: "Date",
      cell: (value: any, row: Sale) => (
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
      accessorKey: "filling_system_name" as keyof Sale,
      header: "Filling System",
      cell: (value: any, row: Sale) => (
        <div className="flex items-center gap-2 py-2">
          <Fuel className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{value || "N/A"}</span>
        </div>
      ),
    },
    {
      accessorKey: "quantity" as keyof Sale,
      header: "Total Liters",
      cell: (value: any, row: Sale) => {
        const quantity = value !== undefined && value !== null
          ? Number(value).toFixed(2)
          : "0";

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
      accessorKey: "price_per_unit" as keyof Sale,
      header: "Price/Unit",
      cell: (value: any, row: Sale) => {
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
      accessorKey: "total_sales" as keyof Sale,
      header: "Total Sales",
      cell: (value: any, row: Sale) => {
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
  ], []);

  const isServerSide = Boolean(onPageChange && onSortChange);

  return (
    <StandardizedDataTable
      title="Sales"
      columns={columns}
      data={sales}
      loading={isLoading}
      onEdit={onEdit}
      onDelete={onDelete}
      onRowClick={onView}
      filters={filters}
      onFilterChange={handleFilterChange}
      totalRows={totalCount}
      serverSide={isServerSide}
      onPageChange={onPageChange}
      onSortChange={onSortChange}
      exportOptions={{
        enabled: true,
        filename: 'sales-export',
        exportAll: true
      }}
    />
  );
}
