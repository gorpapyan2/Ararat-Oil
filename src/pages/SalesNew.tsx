import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IconCurrencyDollar,
  IconPlus,
  IconEye,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

// Import our custom UI components
import { PageHeader, CreateButton } from "@/components/ui-custom/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui-custom/card";
import { MetricCard } from "@/components/ui-custom/data-card";

// Import existing sales hooks and components
import { useSalesFilters } from "@/components/sales/hooks/useSalesFilters";
import { useSalesMutations } from "@/components/sales/hooks/useSalesMutations";
import { SalesDialogs } from "@/components/sales/SalesDialogs";
import { ShiftControl } from "@/components/sales/ShiftControl";

// Import unified components
import { UnifiedDataTable } from "@/components/unified/UnifiedDataTable";

// Import UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Sale } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSale } from "@/services/sales";
import { useToast } from "@/hooks/use-toast";

export default function SalesNew() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get sales data and filters from existing hooks
  const { systems, filteredSales, isLoading, refetchSales } = useSalesFilters();

  // Mutations & modals from existing hook
  const {
    selectedSale,
    setSelectedSale,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleEdit,
    handleDelete,
    confirmDelete,
    updateMutation,
    deleteMutation,
  } = useSalesMutations();

  // Add create sale mutation
  const createSaleMutation = useMutation({
    mutationFn: createSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
      queryClient.invalidateQueries({ queryKey: ["latest-sale"] });
      
      toast({
        title: "Success",
        description: "Sale created successfully and tank level updated",
      });
      
      setIsEditDialogOpen(false);
      setSelectedSale(null);
    },
    onError: (error: any) => {
      console.error("Create error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create sale",
        variant: "destructive",
      });
    },
  });

  // Calculate summary metrics
  const totalSalesAmount = filteredSales.reduce(
    (sum, sale) => sum + (sale.total_sales || 0),
    0,
  );

  const totalLiters = filteredSales.reduce(
    (sum, sale) => sum + (sale.quantity || 0),
    0,
  );

  const averagePrice = totalLiters > 0 ? totalSalesAmount / totalLiters : 0;

  // Format currency values
  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) return "0 ֏";
    return `${value.toLocaleString()} ֏`;
  };

  // Handle view sale details
  const handleViewSale = (sale: Sale) => {
    // If creating a new sale, initialize with an empty object (no ID)
    if (!sale.id) {
      setSelectedSale({} as Sale);
    } else {
      setSelectedSale(sale);
    }
    setIsEditDialogOpen(true);
  };

  // Define table columns
  const columns: ColumnDef<Sale, any>[] = [
    {
      accessorKey: "id",
      header: () => "Invoice #",
      cell: ({ row }) => (
        <span className="font-medium">#{row.getValue("id")}</span>
      ),
    },
    {
      accessorKey: "date",
      header: () => "Date",
      cell: ({ row }) => format(new Date(row.getValue("date")), "MMM dd, yyyy"),
    },
    {
      accessorKey: "filling_system_name",
      header: () => "Filling System",
      cell: ({ row }) => row.getValue("filling_system_name"),
    },
    {
      accessorKey: "fuel_type",
      header: () => "Fuel Type",
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className="bg-primary/10 text-primary border-primary/20"
        >
          {row.getValue("fuel_type")}
        </Badge>
      ),
    },
    {
      accessorKey: "quantity",
      header: () => "Liters",
      cell: ({ row }) => {
        const quantity = row.getValue("quantity");
        return quantity !== undefined && quantity !== null
          ? Number(quantity).toLocaleString()
          : "0";
      },
    },
    {
      accessorKey: "price_per_liter",
      header: () => "Price/L",
      cell: ({ row }) => {
        const price = row.getValue("price_per_liter");
        return formatCurrency(typeof price === "number" ? price : undefined);
      },
    },
    {
      accessorKey: "total_sales",
      header: () => "Total",
      cell: ({ row }) => {
        const total = row.getValue("total_sales");
        return formatCurrency(typeof total === "number" ? total : undefined);
      },
    },
    {
      accessorKey: "shift",
      header: () => "Shift",
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("shift")}</Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const sale = row.original;
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleViewSale(sale);
              }}
            >
              <IconEye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(sale);
              }}
            >
              <IconEdit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(sale.id);
              }}
            >
              <IconTrash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  // Initial filters state
  const [filters, setFilters] = useState({
    search: "",
    date: undefined,
    dateRange: [undefined, undefined] as [Date | undefined, Date | undefined],
    provider: "all",
    systemId: "all",
    salesFuelType: "all",
    quantityRange: [0, 10000] as [number, number],
    priceRange: [0, 10000] as [number, number],
    totalRange: [0, 10000000] as [number, number],
  });

  // Handle filter changes
  const handleFiltersChange = (updates: any) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  // Create fuel type categories
  const fuelTypeCategories = useMemo(() => {
    const uniqueFuelTypes = Array.from(
      new Set(filteredSales.map((sale) => sale.fuel_type)),
    )
      .filter(Boolean)
      .sort();

    return uniqueFuelTypes.map((type) => ({
      id: type,
      name: type,
    }));
  }, [filteredSales]);

  // Create filling systems data
  const systemsData = useMemo(() => {
    return systems.map((system) => ({
      id: system.id,
      name: system.name,
    }));
  }, [systems]);

  // Summary component
  const SalesSummaryComponent = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <MetricCard
        title={t("sales.totalSales")}
        value={formatCurrency(totalSalesAmount)}
        icon={<IconCurrencyDollar className="h-4 w-4" />}
        trend={{
          value: "+5.2%",
          positive: true,
          label: "vs last month",
        }}
      />
      <MetricCard
        title={t("sales.totalLiters")}
        value={`${totalLiters.toLocaleString()} L`}
        trend={{
          value: "+3.1%",
          positive: true,
          label: "vs last month",
        }}
      />
      <MetricCard
        title={t("sales.averagePrice")}
        value={formatCurrency(averagePrice)}
        trend={{
          value: "+0.8%",
          positive: true,
          label: "vs last month",
        }}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("sales.title")}
        description={t("sales.description")}
        actions={
          <CreateButton
            label={t("sales.newSale")}
            onClick={() => handleViewSale({} as Sale)}
          />
        }
      />

      {/* Shift Control Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("shifts.shiftControl")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ShiftControl />
        </CardContent>
      </Card>

      {/* Sales Data Table with Unified Components */}
      <UnifiedDataTable
        title={t("sales.title")}
        columns={columns}
        data={filteredSales}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(sale) => handleDelete(sale.id)}
        providers={[]}
        categories={fuelTypeCategories}
        systems={systemsData}
        onFiltersChange={handleFiltersChange}
        filters={filters}
        searchColumn="filling_system_name"
        searchPlaceholder={t("sales.searchPlaceholder")}
        summaryComponent={SalesSummaryComponent}
      />

      {/* Dialogs */}
      <SalesDialogs
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        selectedSale={selectedSale}
        updateSale={updateMutation.mutate}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        confirmDelete={confirmDelete}
        createSale={createSaleMutation.mutate}
      />
    </div>
  );
}
