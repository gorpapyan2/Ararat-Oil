import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
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
  Fuel,
  MessageSquare
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FuelSupply } from "@/types";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "@/hooks/use-media-query";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface DataTableProps {
  data: FuelSupply[];
  isLoading: boolean;
  onEdit: (supply: FuelSupply) => void;
  onDelete: (supply: FuelSupply) => void;
}

export function FuelSuppliesDataTable({ data, isLoading, onEdit, onDelete }: DataTableProps) {
  const { t } = useTranslation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedSupply, setSelectedSupply] = useState<FuelSupply | null>(null);

  // Helper function to safely format numbers
  const formatNumber = (value: any, decimals = 2) => {
    const num = Number(value);
    return !isNaN(num) ? num.toFixed(decimals) : "0.00";
  };

  // Helper function to safely format currency
  const formatCurrency = (value: any) => {
    const num = Number(value);
    return !isNaN(num) ? num.toLocaleString() : "0";
  };

  // Define columns with type safety
  const columns: ColumnDef<FuelSupply>[] = [
    {
      id: "delivery_date",
      header: () => (
        <div className="text-center font-semibold">
          {t("fuelSupplies.deliveryDate")}
        </div>
      ),
      accessorKey: "delivery_date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("delivery_date"));
        return (
          <div className="flex justify-center font-medium py-2">
            {isNaN(date.getTime()) ? "N/A" : format(date, "PPP")}
          </div>
        );
      },
    },
    {
      id: "provider",
      header: () => (
        <div className="text-left font-semibold">
          {t("fuelSupplies.provider")}
        </div>
      ),
      accessorKey: "provider.name",
      cell: ({ row }) => (
        <div className="flex justify-start items-center py-2">
          {row.original.provider?.name || "N/A"}
        </div>
      ),
    },
    {
      id: "tank",
      header: () => (
        <div className="text-left font-semibold">
          {t("fuelSupplies.tank")}
        </div>
      ),
      accessorKey: "tank.name",
      cell: ({ row }) => {
        const tank = row.original.tank;
        return (
          <div className="flex flex-col py-2">
            <span className="font-medium">{tank?.name || "N/A"}</span>
            <Badge variant="outline" className="mt-1 text-xs w-fit">
              {tank?.fuel_type || "N/A"}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "quantity",
      header: () => (
        <div className="text-right font-semibold">
          {t("fuelSupplies.quantity")}
        </div>
      ),
      accessorKey: "quantity_liters",
      cell: ({ row }) => (
        <div className="text-right font-medium tabular-nums py-2">
          {formatNumber(row.getValue("quantity_liters"))} L
        </div>
      ),
    },
    {
      id: "price",
      header: () => (
        <div className="text-right font-semibold">
          {t("fuelSupplies.pricePerLiter")}
        </div>
      ),
      accessorKey: "price_per_liter",
      cell: ({ row }) => (
        <div className="text-right font-medium tabular-nums py-2">
          {formatCurrency(row.getValue("price_per_liter"))} ֏
        </div>
      ),
    },
    {
      id: "total_cost",
      header: () => (
        <div className="text-right font-semibold">
          {t("fuelSupplies.totalCost")}
        </div>
      ),
      accessorKey: "total_cost",
      cell: ({ row }) => (
        <div className="text-right font-medium tabular-nums text-primary py-2">
          {formatCurrency(row.getValue("total_cost"))} ֏
        </div>
      ),
    },
    {
      id: "employee",
      header: () => (
        <div className="text-left font-semibold">
          {t("fuelSupplies.employee")}
        </div>
      ),
      accessorKey: "employee.name",
      cell: ({ row }) => (
        <div className="flex justify-start items-center py-2">
          {row.original.employee?.name || "N/A"}
        </div>
      ),
    },
    {
      id: "comments",
      header: () => (
        <div className="text-left font-semibold">
          {t("fuelSupplies.comments")}
        </div>
      ),
      accessorKey: "comments",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate py-2" title={row.original.comments || "N/A"}>
          {row.original.comments || "N/A"}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const supply = row.original;
        return (
          <div className="flex items-center justify-end py-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(supply)}
                    className="h-8 w-8 p-0 hover:bg-muted"
                  >
                    <span className="sr-only">{t("fuelSupplies.editTooltip")}</span>
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
                  className="h-8 w-8 p-0 hover:bg-muted"
                >
                  <span className="sr-only">{t("common.openMenu")}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(supply)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>{t("common.edit")}</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(supply)}
                  className="text-destructive focus:text-destructive"
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
  const mobileCardRenderer = (supply: FuelSupply) => (
    <Card className="overflow-hidden shadow-sm border-muted">
      <CardContent className="p-0">
        <div className="p-4 border-b bg-muted/20">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {isNaN(new Date(supply.delivery_date).getTime()) 
                  ? "N/A" 
                  : format(new Date(supply.delivery_date), "PP")}
              </span>
            </div>
            <Badge variant="outline" className="font-medium">
              {supply.tank?.fuel_type || "N/A"}
            </Badge>
          </div>
        </div>
        
        <div className="divide-y">
          <div className="flex p-3 items-center">
            <span className="w-1/3 text-muted-foreground text-sm font-medium">
              {t("fuelSupplies.provider")}
            </span>
            <span className="w-2/3 font-medium">{supply.provider?.name || "N/A"}</span>
          </div>
          
          <div className="flex p-3 items-center">
            <span className="w-1/3 text-muted-foreground text-sm font-medium">
              {t("fuelSupplies.tank")}
            </span>
            <span className="w-2/3 font-medium">{supply.tank?.name || "N/A"}</span>
          </div>
          
          <div className="flex p-3 items-center">
            <span className="w-1/3 text-muted-foreground text-sm font-medium">
              {t("fuelSupplies.quantity")}
            </span>
            <span className="w-2/3 font-medium tabular-nums">
              {formatNumber(supply.quantity_liters)} L
            </span>
          </div>
          
          <div className="flex p-3 items-center">
            <span className="w-1/3 text-muted-foreground text-sm font-medium">
              {t("fuelSupplies.pricePerLiter")}
            </span>
            <span className="w-2/3 font-medium tabular-nums">
              {formatCurrency(supply.price_per_liter)} ֏
            </span>
          </div>
          
          <div className="flex p-3 items-center">
            <span className="w-1/3 text-muted-foreground text-sm font-medium">
              {t("fuelSupplies.totalCost")}
            </span>
            <span className="w-2/3 font-medium text-primary tabular-nums">
              {formatCurrency(supply.total_cost)} ֏
            </span>
          </div>
          
          {supply.comments && (
            <div className="flex p-3 items-center">
              <span className="w-1/3 text-muted-foreground text-sm font-medium">
                {t("fuelSupplies.comments")}
              </span>
              <span className="w-2/3 truncate" title={supply.comments}>
                {supply.comments}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-3 bg-muted/10 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <UserCircle2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{supply.employee?.name || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 p-0"
              onClick={() => onEdit(supply)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 p-0 text-destructive"
              onClick={() => onDelete(supply)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Use the new DataTable component
  return (
    <div className="border rounded-lg shadow-sm overflow-hidden">
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        mobileCardRenderer={mobileCardRenderer}
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
