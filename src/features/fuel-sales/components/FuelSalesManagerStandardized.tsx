import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks";
import { useDialog } from "@/hooks/use-dialog";
import { supabase } from "@/core/api/supabase";
import { FuelSalesTable } from "./FuelSalesTable";
import { FuelSalesFormStandardized } from "./FuelSalesFormStandardized";
import { ConfirmDeleteDialogStandardized } from "./ConfirmDeleteDialogStandardized";
import { FuelSalesSummary } from "./summary/FuelSalesSummary";
import { FuelSalesFilter } from "./FuelSalesFilter";
import { useFuelSales } from "../hooks/useFuelSales";
import type { FuelSale, FuelSaleFilters } from "../types/fuel-sales.types";

interface FuelSalesManagerStandardizedProps {
  onRenderAction?: (action: React.ReactNode) => void;
}

interface FuelTank {
  id: string;
  name: string;
  fuel_type?: string | { code?: string; name?: string };
}

async function fetchFuelTanks(): Promise<FuelTank[]> {
  const { data, error } = await supabase
    .from('fuel_tanks')
    .select('id, name, fuel_type')
    .order('name');
  
  if (error) throw error;
  return data;
}

export function FuelSalesManagerStandardized({
  onRenderAction,
}: FuelSalesManagerStandardizedProps) {
  const { toast } = useToast();
  const [editingSale, setEditingSale] = useState<FuelSale | undefined>();
  const [deletingSale, setDeletingSale] = useState<FuelSale | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FuelSaleFilters>({});

  const {
    open: isAddDialogOpen,
    onOpenChange: onAddDialogOpenChange,
  } = useDialog();

  const {
    open: isEditDialogOpen,
    onOpenChange: onEditDialogOpenChange,
  } = useDialog();

  const {
    open: isDeleteDialogOpen,
    onOpenChange: onDeleteDialogOpenChange,
  } = useDialog();

  const { data: tanks = [] } = useQuery<FuelTank[]>({
    queryKey: ["fuel-tanks"],
    queryFn: fetchFuelTanks,
  });

  const { sales, isLoading: isSalesLoading, createSale, updateSale, deleteSale } = useFuelSales(filters);

  const handleAddSale = useCallback(() => {
    setEditingSale(undefined);
    onAddDialogOpenChange(true);
  }, [onAddDialogOpenChange]);

  const handleEditSale = useCallback((id: string) => {
    const sale = sales.find(s => s.id === id);
    if (sale) {
      setEditingSale(sale);
      onEditDialogOpenChange(true);
    }
  }, [sales, onEditDialogOpenChange]);

  const handleDeleteSale = useCallback((id: string) => {
    const sale = sales.find(s => s.id === id);
    if (sale) {
      setDeletingSale(sale);
      onDeleteDialogOpenChange(true);
    }
  }, [sales, onDeleteDialogOpenChange]);

  const handleCreateSuccess = useCallback(() => {
    onAddDialogOpenChange(false);
    toast({
      title: "Success",
      description: "Fuel sale has been created successfully.",
    });
  }, [onAddDialogOpenChange, toast]);

  const handleUpdateSuccess = useCallback(() => {
    onEditDialogOpenChange(false);
    setEditingSale(undefined);
    toast({
      title: "Success",
      description: "Fuel sale has been updated successfully.",
    });
  }, [onEditDialogOpenChange, toast]);

  const handleDeleteSuccess = useCallback(() => {
    onDeleteDialogOpenChange(false);
    setDeletingSale(undefined);
    toast({
      title: "Success",
      description: "Fuel sale has been deleted successfully.",
    });
  }, [onDeleteDialogOpenChange, toast]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!deletingSale) return;

    try {
      setIsLoading(true);
      await deleteSale.mutateAsync(deletingSale.id);
      handleDeleteSuccess();
    } catch (error: any) {
      console.error("Error deleting fuel sale:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete fuel sale.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [deletingSale, deleteSale, handleDeleteSuccess, toast]);

  const handleFiltersChange = useCallback((newFilters: FuelSaleFilters) => {
    setFilters(newFilters);
  }, []);

  const actionElement = useMemo(() => (
    <button
      onClick={handleAddSale}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
    >
      Add Sale
    </button>
  ), [handleAddSale]);

  if (onRenderAction) {
    onRenderAction(actionElement);
  }

  return (
    <div className="space-y-4">
      <FuelSalesFilter
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
      <FuelSalesSummary sales={sales} />
      <FuelSalesTable
        sales={sales}
        isLoading={isSalesLoading}
        onEdit={handleEditSale}
        onDelete={handleDeleteSale}
      />

      <FuelSalesFormStandardized
        open={isAddDialogOpen}
        onOpenChange={onAddDialogOpenChange}
        onSuccess={handleCreateSuccess}
      />

      <FuelSalesFormStandardized
        open={isEditDialogOpen}
        onOpenChange={onEditDialogOpenChange}
        onSuccess={handleUpdateSuccess}
        initialData={editingSale}
      />

      <ConfirmDeleteDialogStandardized
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteDialogOpenChange}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </div>
  );
} 