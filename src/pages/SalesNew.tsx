import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  IconCurrencyDollar,
  IconPlus,
} from "@tabler/icons-react";

// Import our custom UI components
import { PageHeader } from "@/components/ui/page-header";
import { CreateButton } from "@/components/ui/create-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MetricCard } from "@/components/ui/composed/cards";

// Import existing sales hooks and components
import { useSalesFilters } from "@/components/sales/hooks/useSalesFilters";
import { useSalesMutations } from "@/components/sales/hooks/useSalesMutations";
import { SalesDialogs } from "@/components/sales/SalesDialogs";
import { ShiftControl } from "@/components/sales/ShiftControl";

// Import our standardized table component
import { SalesTable } from "@/components/sales/SalesTable";

// Import necessary services
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSale } from "@/services/sales";
import { useToast } from "@/hooks";
import { Sale } from "@/types";

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

  // Extract unique fuel types for filtering
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

  // Handle filters change
  const handleFiltersChange = (filters: any) => {
    // Handle filter changes here
    console.log("Filters changed:", filters);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader
        title="Sales Management"
        icon={<IconCurrencyDollar />}
        actions={
          <CreateButton onClick={() => handleViewSale({} as Sale)}>
            <IconPlus className="mr-2 h-4 w-4" />
            Add Sale
          </CreateButton>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title="Total Sales"
          value={formatCurrency(totalSalesAmount)}
          icon={<IconCurrencyDollar className="h-6 w-6" />}
          className="bg-primary/10"
        />
        <MetricCard
          title="Total Liters"
          value={`${Math.round(totalLiters).toLocaleString()} L`}
          icon={<IconCurrencyDollar className="h-6 w-6" />}
          className="bg-success/10"
        />
        <MetricCard
          title="Average Price"
          value={formatCurrency(averagePrice)}
          icon={<IconCurrencyDollar className="h-6 w-6" />}
          className="bg-warning/10"
        />
      </div>

      <ShiftControl />

      <Card>
        <CardHeader>
          <CardTitle>Sales Records</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesTable
            sales={filteredSales}
            isLoading={isLoading}
            onEdit={(id) => {
              const sale = filteredSales.find(s => s.id === id);
              if (sale) handleEdit(sale);
            }}
            onDelete={handleDelete}
            onView={handleViewSale}
            systems={systems}
            fuelTypes={fuelTypeCategories}
            onFiltersChange={handleFiltersChange}
          />
        </CardContent>
      </Card>

      {/* Dialogs for adding/editing/deleting sales */}
      <SalesDialogs
        selectedSale={selectedSale}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        updateMutation={updateMutation}
        createMutation={createSaleMutation}
        deleteMutation={deleteMutation}
        confirmDelete={confirmDelete}
      />
    </div>
  );
}
