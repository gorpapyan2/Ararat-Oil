import React, { useState, useMemo } from "react";
import {
  StandardizedDataTable,
  StandardizedDataTableColumn,
} from "@/shared/components/unified/StandardizedDataTable";
import { Card, CardContent } from "@/core/components/ui/card";
import { Badge } from "@/core/components/ui/primitives/badge";
import { Button } from "@/core/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
  Trash2,
  Pencil,
  MoreHorizontal,
  Calendar,
  UserCircle2,
  Droplet,
  Banknote,
  Info,
  Tag,
  Building,
  MessageSquare,
  ArrowUpDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/core/components/ui/dropdown-menu";
import { FuelSupply } from "@/types";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@/shared/hooks/useResponsive";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/core/components/ui/tooltip";
import { cn } from "@/shared/utils";

// Extended interface for data table with joined entities
interface FuelSupplyWithRelations extends FuelSupply {
  provider?: {
    id: string;
    name: string;
  };
  tank?: {
    id: string;
    name: string;
    fuel_type?: string;
  };
  employee?: {
    id: string;
    name: string;
  };
}

interface DataTableProps {
  data: FuelSupply[];
  isLoading: boolean;
  onEdit: (supply: FuelSupply) => void;
  onDelete: (supply: FuelSupply) => void;
}

export function FuelSuppliesDataTable({
  data,
  isLoading,
  onEdit,
  onDelete,
}: DataTableProps) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedSupply, setSelectedSupply] = useState<FuelSupply | null>(null);

  // Pre-process the data to ensure numbers are proper numbers
  const processedData: FuelSupplyWithRelations[] = useMemo(() => {
    return data.map((supply) => ({
      ...supply,
      quantity_liters:
        typeof supply.quantity_liters === "number" ? supply.quantity_liters : 0,
      price_per_liter:
        typeof supply.price_per_liter === "number" ? supply.price_per_liter : 0,
      total_cost: typeof supply.total_cost === "number" ? supply.total_cost : 0,
      // Add optional relation properties (these would be populated by joins in real scenarios)
      provider: undefined,
      tank: undefined,
      employee: undefined,
    }));
  }, [data]);

  // Helper function to safely format numbers
  const formatNumber = (value: unknown, decimals = 2) => {
    if (value === undefined || value === null || value === "") return "0.00";
    const num = Number(value);
    if (isNaN(num)) return "0.00";
    return num.toFixed(decimals);
  };

  // Helper function to safely format currency
  const formatCurrency = (value: unknown) => {
    if (value === undefined || value === null || value === "") return "0";
    const num = Number(value);
    if (isNaN(num)) return "0";
    if (num === 0) return "0";
    return Math.round(num).toLocaleString();
  };

  // Define columns with proper typing for StandardizedDataTable
  const columns: StandardizedDataTableColumn<FuelSupplyWithRelations>[] = [
    {
      id: "delivery_date",
      header: t("fuelSupplies.deliveryDate"),
      accessorKey: "delivery_date",
      cell: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{format(new Date(value), "PP")}</span>
        </div>
      ),
    },
    {
      id: "provider",
      header: t("fuelSupplies.provider"),
      accessorKey: "provider",
      cell: (_value: unknown, row: FuelSupplyWithRelations) => (
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {row.provider?.name || "N/A"}
          </span>
        </div>
      ),
    },
    {
      id: "tank",
      header: t("fuelSupplies.tank"),
      accessorKey: "tank",
      cell: (_value: unknown, row: FuelSupplyWithRelations) => {
        const tank = row.tank;
        return (
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Droplet className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{tank?.name || "N/A"}</span>
              </div>
              <Badge variant="outline" className="mt-1.5 text-xs w-fit">
                {tank?.fuel_type || "N/A"}
              </Badge>
            </div>
          </div>
        );
      },
    },
    {
      id: "quantity_liters",
      header: t("fuelSupplies.quantity"),
      accessorKey: "quantity_liters",
      cell: (value: number) => (
        <div className="text-right font-medium tabular-nums py-2">
          <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">
            {formatNumber(value)} L
          </span>
        </div>
      ),
    },
    {
      id: "price_per_liter",
      header: t("fuelSupplies.pricePerLiter"),
      accessorKey: "price_per_liter",
      cell: (value: number) => (
        <div className="text-right font-medium tabular-nums py-2">
          {formatCurrency(value)} ֏
        </div>
      ),
    },
    {
      id: "total_cost",
      header: t("fuelSupplies.totalCost"),
      accessorKey: "total_cost",
      cell: (value: number) => (
        <div className="text-right font-medium tabular-nums py-2">
          <span className="font-semibold text-primary">{formatCurrency(value)} ֏</span>
        </div>
      ),
    },
    {
      id: "employee",
      header: t("fuelSupplies.employee"),
      accessorKey: "employee",
      cell: (_value: unknown, row: FuelSupplyWithRelations) => (
        <div className="flex items-center gap-2 py-2">
          <UserCircle2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {row.employee?.name || "N/A"}
          </span>
        </div>
      ),
    },
    {
      id: "comments",
      header: t("fuelSupplies.comments"),
      accessorKey: "comments",
      cell: (_value: unknown, row: FuelSupplyWithRelations) => (
        <div className="flex items-start gap-2 py-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
          <span
            className="max-w-[200px] truncate"
            title={row.comments || "N/A"}
          >
            {row.comments || "N/A"}
          </span>
        </div>
      ),
    },
  ];

  // Custom mobile card renderer - removed as it's not supported

  // Use the StandardizedDataTable component with adjusted props
  return (
    <div
      className="rounded-lg bg-card text-card-foreground shadow-sm overflow-hidden border border-border/40 
      [&_tr:hover]:bg-primary/5 [&_tr]:transition-colors [&_tr]:group
      [&_th]:text-muted-foreground [&_th]:font-medium [&_th]:border-b [&_th]:border-border/50
      [&_td]:border-b [&_td]:border-border/10 [&_.pagination]:mt-2"
    >
      <StandardizedDataTable
        title={t("fuelSupplies.supplies")}
        columns={columns as StandardizedDataTableColumn<FuelSupplyWithRelations>[]}
        data={processedData}
        loading={isLoading}
        onEdit={(id: string | number) => {
          const supply = processedData.find((s) => s.id === id);
          if (supply) onEdit(supply);
        }}
        onDelete={(id: string | number) => {
          const supply = processedData.find((s) => s.id === id);
          if (supply) onDelete(supply);
        }}
        exportOptions={{
          enabled: true,
          filename: "fuel-supplies",
          exportAll: true,
        }}
        className="w-full"
      />
    </div>
  );
}
