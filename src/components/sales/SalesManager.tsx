
import { SalesHeader } from "./SalesHeader";
import { SalesTable } from "./SalesTable";
import { useSalesFilters } from "./hooks/useSalesFilters";
import { useSalesMutations } from "./hooks/useSalesMutations";
import { SalesDialogs } from "./SalesDialogs";
import { Sale } from "@/types";
import { useEffect } from "react";

export function SalesManager() {
  // filter and data state
  const {
    search, setSearch, date, setDate, systemId, setSystemId,
    systems, litersRange, setLitersRange, priceRange, setPriceRange, totalSalesRange, setTotalSalesRange,
    filteredSales, isLoading, refetchSales
  } = useSalesFilters();

  // mutations & modals
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
    deleteMutation
  } = useSalesMutations();

  // Refresh sales data when a mutation completes
  useEffect(() => {
    if (updateMutation.isSuccess || deleteMutation.isSuccess) {
      refetchSales();
    }
  }, [updateMutation.isSuccess, deleteMutation.isSuccess, refetchSales]);

  const handleView = (sale: Sale) => {
    console.log("Viewing sale:", sale);
  };

  return (
    <div className="space-y-6">
      <SalesHeader 
        search={search}
        onSearchChange={setSearch}
        date={date}
        onDateChange={setDate}
        systemId={systemId}
        onSystemChange={setSystemId}
        systems={systems}
        litersRange={litersRange}
        onLitersRangeChange={setLitersRange}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        totalSalesRange={totalSalesRange}
        onTotalSalesRangeChange={setTotalSalesRange}
      />
      <SalesTable 
        sales={filteredSales}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
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
