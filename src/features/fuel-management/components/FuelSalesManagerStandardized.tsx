import React, { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks";
import { useDialog } from "@/core/hooks/useDialog";
import { tanksApi } from "@/core/api";
import { FuelSalesTable } from "./FuelSalesTable";
import { FuelSalesFormStandardized } from "./FuelSalesFormStandardized";
import { DeleteConfirmDialog } from "@/shared/components/common/dialog/DeleteConfirmDialog";
import { FuelSalesSummary } from "./summary/FuelSalesSummary";
import { FuelSalesFilter } from "./FuelSalesFilter";
import { useFuelSales } from "../hooks/useFuelSales";
import type { FuelSale, FuelSaleFilters } from "../types/fuel-sales.types";
import type { Tank } from "@/core/api/types";
import { useCreateFuelSale, useUpdateFuelSale, useDeleteFuelSale } from "../hooks/useFuelSales";

interface FuelSalesManagerStandardizedProps {
  onRenderAction?: (action: React.ReactNode) => void;
}

interface FuelTank {
  id: string;
  name: string;
  fuel_type?: string | { code?: string; name?: string };
}

async function fetchFuelTanks(): Promise<FuelTank[]> {
  const response = await tanksApi.getTanks();
  if (response.error) throw new Error(response.error.message || 'Failed to fetch tanks');
  
  const tanks = response.data || [];
  return tanks.map((tank: Tank) => ({
    id: tank.id,
    name: tank.name,
    fuel_type: tank.fuel_type?.name || 'Unknown',
  }));
}

export function FuelSalesManagerStandardized({
  onRenderAction,
}: FuelSalesManagerStandardizedProps) {
  const { toast } = useToast();
  const [editingSale, setEditingSale] = useState<FuelSale | undefined>();
  const [deletingSale, setDeletingSale] = useState<FuelSale | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<FuelSaleFilters>({});

  const { isOpen: isAddDialogOpen, onOpenChange: onAddDialogOpenChange } =
    useDialog();

  const { isOpen: isEditDialogOpen, onOpenChange: onEditDialogOpenChange } =
    useDialog();

  const { isOpen: isDeleteDialogOpen, onOpenChange: onDeleteDialogOpenChange } =
    useDialog();

  const { data: tanks = [] } = useQuery<FuelTank[]>({
    queryKey: ["fuel-tanks"],
    queryFn: fetchFuelTanks,
  });

  const {
    data: sales = [],
    isLoading: isSalesLoading,
  } = useFuelSales(filters);

  const createSale = useCreateFuelSale();
  const updateSale = useUpdateFuelSale();
  const deleteSale = useDeleteFuelSale();

  const handleAddSale = useCallback(() => {
    setEditingSale(undefined);
    onAddDialogOpenChange(true);
  }, [onAddDialogOpenChange]);

  const handleEditSale = useCallback(
    (id: string) => {
      const sale = sales.find((s: FuelSale) => s.id === id);
      if (sale) {
        setEditingSale(sale);
        onEditDialogOpenChange(true);
      }
    },
    [sales, onEditDialogOpenChange]
  );

  const handleDeleteSale = useCallback(
    (id: string) => {
      const sale = sales.find((s: FuelSale) => s.id === id);
      if (sale) {
        setDeletingSale(sale);
        onDeleteDialogOpenChange(true);
      }
    },
    [sales, onDeleteDialogOpenChange]
  );

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
    } catch (error: unknown) {
      console.error("Error deleting fuel sale:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete fuel sale.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [deletingSale, deleteSale, handleDeleteSuccess, toast]);

  const handleFiltersChange = useCallback((newFilters: FuelSaleFilters) => {
    setFilters(newFilters);
  }, []);

  const actionElement = useMemo(
    () => (
      <button
        onClick={handleAddSale}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        Add Sale
      </button>
    ),
    [handleAddSale]
  );

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

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteDialogOpenChange}
        onConfirm={handleDeleteConfirm}
        description="Are you sure you want to delete this fuel sale? This action cannot be undone."
        isLoading={isLoading}
      />
    </div>
  );
}
