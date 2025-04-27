import { useState, useEffect } from "react";
import { Sale } from "@/types";
import { useSalesFilters } from "./hooks/useSalesFilters";
import { useSalesMutations } from "./hooks/useSalesMutations";
import { SalesDialogs } from "./SalesDialogs";
import { SalesFilterBar } from "./filters/SalesFilterBar";
import { getSalesColumns } from "./data-table/SalesColumns";
import { SalesDataTable } from "./data-table/SalesDataTable";
import { SalesSummary } from "./summary/SalesSummary";
import { NewSaleButton } from "./NewSaleButton";
import { useToast } from "@/hooks/use-toast";
import { ShiftControl } from "./ShiftControl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import React from "react";

export function SalesManager() {
  // Filters and data state
  const {
    search,
    setSearch,
    date,
    setDate,
    systemId,
    setSystemId,
    systems,
    litersRange,
    setLitersRange,
    priceRange,
    setPriceRange,
    totalSalesRange,
    setTotalSalesRange,
    filteredSales,
    isLoading,
    refetchSales,
  } = useSalesFilters();

  // Mutations & modals
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

  const { toast } = useToast();
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Refresh sales data when a mutation completes
  useEffect(() => {
    if (updateMutation.isSuccess || deleteMutation.isSuccess) {
      refetchSales();
    }
  }, [updateMutation.isSuccess, deleteMutation.isSuccess, refetchSales]);

  // Handle search changes with recent searches
  const handleSearchChange = (newSearch: string) => {
    if (newSearch && !recentSearches.includes(newSearch)) {
      setRecentSearches((prev) => [newSearch, ...prev.slice(0, 4)]);
    }
    setSearch(newSearch);
  };

  // Handle filter changes
  const handleFiltersChange = (updates: any) => {
    if (updates.date !== undefined) setDate(updates.date);
    if (updates.systemId !== undefined) setSystemId(updates.systemId);
    if (updates.litersRange !== undefined) setLitersRange(updates.litersRange);
    if (updates.priceRange !== undefined) setPriceRange(updates.priceRange);
    if (updates.totalSalesRange !== undefined)
      setTotalSalesRange(updates.totalSalesRange);
  };

  const handleViewSale = (sale: Sale) => {
    // Set the selected sale for viewing
    setSelectedSale(sale);
    // Show a toast with sale details
    toast({
      title: `Sale Details: ${sale.filling_system_name}`,
      description: (
        <div className="mt-2 text-sm">
          <p>Date: {new Date(sale.date).toLocaleDateString()}</p>
          <p>Fuel Type: {sale.fuel_type}</p>
          <p>Quantity: {sale.quantity.toFixed(2)} L</p>
          <p>Price: {sale.price_per_unit.toLocaleString()} ֏</p>
          <p>Total: {sale.total_sales.toLocaleString()} ֏</p>
        </div>
      ),
    });
  };

  // Get table columns with action handlers
  const columns = getSalesColumns(handleViewSale, handleEdit, handleDelete);

  // Ensure systems is always a valid array
  const safeSystemsList = React.useMemo(() => {
    return Array.isArray(systems) ? systems : [];
  }, [systems]);

  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Shift Control Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t("shifts.shiftControl")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ShiftControl />
        </CardContent>
      </Card>

      {/* Floating New Sale Button (Mobile) */}
      <div className="fixed bottom-4 right-4 md:hidden z-10">
        <NewSaleButton />
      </div>

      {/* Sales Summary Cards */}
      <SalesSummary sales={filteredSales} />

      {/* Filter Bar & Actions */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-medium">Sales Records</h2>
          <div className="hidden md:block">
            <NewSaleButton />
          </div>
        </div>

        <SalesFilterBar
          filters={{
            date,
            systemId,
            litersRange,
            priceRange,
            totalSalesRange,
          }}
          onFiltersChange={handleFiltersChange}
          systems={safeSystemsList}
          isLoading={isLoading}
        />
      </div>

      {/* Data Table */}
      <SalesDataTable
        columns={columns}
        data={filteredSales}
        isLoading={isLoading}
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
      />
    </div>
  );
}
