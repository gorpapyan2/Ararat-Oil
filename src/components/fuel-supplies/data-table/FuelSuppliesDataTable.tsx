import React, { useState, useMemo } from "react";
import { DataTable } from "@/components/ui/composed/data-table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FuelSupply } from "@/types";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@/hooks/useResponsive";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
  const processedData = useMemo(() => {
    return data.map((supply) => ({
      ...supply,
      quantity_liters:
        typeof supply.quantity_liters === "number" ? supply.quantity_liters : 0,
      price_per_liter:
        typeof supply.price_per_liter === "number" ? supply.price_per_liter : 0,
      total_cost: typeof supply.total_cost === "number" ? supply.total_cost : 0,
    }));
  }, [data]);

  // Helper function to safely format numbers
  const formatNumber = (value: any, decimals = 2) => {
    if (value === undefined || value === null || value === "") return "0.00";
    const num = Number(value);
    if (isNaN(num)) return "0.00";
    return num.toFixed(decimals);
  };

  // Helper function to safely format currency
  const formatCurrency = (value: any) => {
    if (value === undefined || value === null || value === "") return "0";
    const num = Number(value);
    if (isNaN(num)) return "0";
    if (num === 0) return "0";
    return Math.round(num).toLocaleString();
  };

  // Define columns with type safety
  const columns: ColumnDef<FuelSupply>[] = [
    {
      id: "delivery_date",
      header: () => (
        <div className="text-left font-medium text-muted-foreground">
          {t("fuelSupplies.deliveryDate")}
        </div>
      ),
      accessorKey: "delivery_date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("delivery_date"));
        return (
          <div className="flex items-center gap-2 py-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {isNaN(date.getTime()) ? "N/A" : format(date, "PP")}
            </span>
          </div>
        );
      },
    },
    {
      id: "provider",
      header: () => (
        <div className="text-left font-medium text-muted-foreground">
          {t("fuelSupplies.provider")}
        </div>
      ),
      accessorKey: "provider.name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 py-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {row.original.provider?.name || "N/A"}
          </span>
        </div>
      ),
      filterFn: "nestedStringFilter",
    },
    {
      id: "tank",
      header: () => (
        <div className="text-left font-medium text-muted-foreground">
          {t("fuelSupplies.tank")}
        </div>
      ),
      accessorKey: "tank.name",
      cell: ({ row }) => {
        const tank = row.original.tank;
        return (
          <div className="flex items-center gap-2 py-2">
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
      header: () => (
        <div className="text-right font-medium text-muted-foreground">
          {t("fuelSupplies.quantity")}
        </div>
      ),
      accessorKey: "quantity_liters",
      cell: ({ row }) => {
        const value = row.getValue("quantity_liters");
        const displayValue = formatNumber(value);

        return (
          <div className="text-right font-medium tabular-nums py-2">
            <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">
              {displayValue} L
            </span>
          </div>
        );
      },
    },
    {
      id: "price_per_liter",
      header: () => (
        <div className="text-right font-medium text-muted-foreground">
          {t("fuelSupplies.pricePerLiter")}
        </div>
      ),
      accessorKey: "price_per_liter",
      cell: ({ row }) => {
        const value = row.getValue("price_per_liter");
        const displayValue = formatCurrency(value);

        return (
          <div className="text-right font-medium tabular-nums py-2">
            {displayValue} ֏
          </div>
        );
      },
    },
    {
      id: "total_cost",
      header: () => (
        <div className="text-right font-medium text-muted-foreground">
          {t("fuelSupplies.totalCost")}
        </div>
      ),
      accessorKey: "total_cost",
      cell: ({ row }) => {
        const value = row.getValue("total_cost");
        const displayValue = formatCurrency(value);

        return (
          <div className="text-right font-medium tabular-nums py-2">
            <span className="font-semibold text-primary">{displayValue} ֏</span>
          </div>
        );
      },
    },
    {
      id: "employee",
      header: () => (
        <div className="text-left font-medium text-muted-foreground">
          {t("fuelSupplies.employee")}
        </div>
      ),
      accessorKey: "employee.name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 py-2">
          <UserCircle2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {row.original.employee?.name || "N/A"}
          </span>
        </div>
      ),
    },
    {
      id: "comments",
      header: () => (
        <div className="text-left font-medium text-muted-foreground">
          {t("fuelSupplies.comments")}
        </div>
      ),
      accessorKey: "comments",
      cell: ({ row }) => (
        <div className="flex items-start gap-2 py-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
          <span
            className="max-w-[200px] truncate"
            title={row.original.comments || "N/A"}
          >
            {row.original.comments || "N/A"}
          </span>
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const supply = row.original;
        return (
          <div className="flex items-center justify-end py-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(supply);
                    }}
                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                  >
                    <span className="sr-only">
                      {t("fuelSupplies.editTooltip")}
                    </span>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{t("fuelSupplies.editTooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => e.stopPropagation()}
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <span className="sr-only">{t("common.openMenu")}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onEdit(supply)}
                  className="flex items-center"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>{t("common.edit")}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(supply)}
                  className="text-destructive focus:text-destructive flex items-center"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>{t("common.delete")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // Custom mobile card renderer
  const MobileCardRenderer = (supply: FuelSupply, index: number) => {
    const { t } = useTranslation();

    const deliveryDate = format(new Date(supply.delivery_date), "dd/MM/yyyy");
    const quantity = formatNumber(supply.quantity_liters);
    const pricePerLiter = formatCurrency(supply.price_per_liter);
    const totalCost = formatCurrency(supply.total_cost);

    return (
      <Card className="overflow-hidden shadow-sm border-muted hover:border-primary/20 transition-colors">
        <CardContent className="p-0">
          <div className="p-4 border-b bg-accent/50">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">{deliveryDate}</span>
              </div>
              <Badge className="font-medium bg-primary/10 text-primary hover:bg-primary/20 border-0">
                {supply.tank?.fuel_type || "N/A"}
              </Badge>
            </div>
          </div>

          <div>
            <div className="flex p-3 items-center">
              <span className="w-1/3 text-muted-foreground text-sm font-medium flex items-center gap-2">
                <Building className="h-3.5 w-3.5" />
                {t("fuelSupplies.provider")}
              </span>
              <span className="w-2/3 font-medium">
                {supply.provider?.name || "N/A"}
              </span>
            </div>

            <div className="flex p-3 items-center bg-muted/30">
              <span className="w-1/3 text-muted-foreground text-sm font-medium flex items-center gap-2">
                <Droplet className="h-3.5 w-3.5" />
                {t("fuelSupplies.tank")}
              </span>
              <span className="w-2/3 font-medium">
                {supply.tank?.name || "N/A"}
              </span>
            </div>

            <div className="flex p-3 items-center">
              <span className="w-1/3 text-muted-foreground text-sm font-medium flex items-center gap-2">
                <Tag className="h-3.5 w-3.5" />
                {t("fuelSupplies.quantity")}
              </span>
              <span className="w-2/3 font-medium tabular-nums">
                <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">
                  {quantity} L
                </span>
              </span>
            </div>

            <div className="flex p-3 items-center bg-muted/30">
              <span className="w-1/3 text-muted-foreground text-sm font-medium flex items-center gap-2">
                <Banknote className="h-3.5 w-3.5" />
                {t("fuelSupplies.pricePerLiter")}
              </span>
              <span className="w-2/3 font-medium tabular-nums">
                {pricePerLiter} ֏
              </span>
            </div>

            <div className="flex p-3 items-center">
              <span className="w-1/3 text-muted-foreground text-sm font-medium flex items-center gap-2">
                <Banknote className="h-3.5 w-3.5" />
                {t("fuelSupplies.totalCost")}
              </span>
              <span className="w-2/3 font-semibold text-primary tabular-nums">
                {totalCost} ֏
              </span>
            </div>

            {supply.comments && (
              <div className="flex p-3 items-start bg-muted/30">
                <span className="w-1/3 text-muted-foreground text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {t("fuelSupplies.comments")}
                </span>
                <span
                  className="w-2/3 text-sm truncate"
                  title={supply.comments}
                >
                  {supply.comments}
                </span>
              </div>
            )}
          </div>

          <div className="p-3 bg-accent/20 flex justify-between items-center border-t">
            <div className="flex items-center gap-1.5">
              <UserCircle2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {supply.employee?.name || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(supply);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(supply);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Use the new DataTable component
  return (
    <div
      className="rounded-lg bg-card text-card-foreground shadow-sm overflow-hidden border border-border/40 
      [&_tr:hover]:bg-primary/5 [&_tr]:transition-colors [&_tr]:group
      [&_th]:text-muted-foreground [&_th]:font-medium [&_th]:border-b [&_th]:border-border/50
      [&_td]:border-b [&_td]:border-border/10 [&_.pagination]:mt-2"
    >
      <DataTable
        columns={columns}
        data={processedData}
        isLoading={isLoading}
        mobileCardRenderer={MobileCardRenderer}
        onRowClick={(supply) => setSelectedSupply(supply)}
        emptyMessage={t("fuelSupplies.noSuppliesFound")}
        title={t("fuelSupplies.supplies")}
        subtitle={t("fuelSupplies.manageSupplies")}
        initialSorting={[{ id: "delivery_date", desc: true }]}
        initialColumnVisibility={{
          comments: false,
        }}
        enableColumnVisibility={true}
        enableFilters={true}
        enableGlobalFilter={true}
        enablePagination={true}
        enableSorting={true}
        defaultPageSize={10}
        className="w-full"
      />
    </div>
  );
}
