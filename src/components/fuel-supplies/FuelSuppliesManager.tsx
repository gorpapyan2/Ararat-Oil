
import { useEffect, useState } from "react";
import { useFuelSuppliesFilters } from "./hooks/useFuelSuppliesFilters";
import { FuelSuppliesHeader } from "./FuelSuppliesHeader";
import { FuelSuppliesTable } from "./FuelSuppliesTable";
import { FuelSuppliesForm } from "./FuelSuppliesForm";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFuelSupply, updateFuelSupply, deleteFuelSupply } from "@/services/fuel-supplies";
import { useToast } from "@/hooks/use-toast";
import { FuelSupply } from "@/types";
import { FuelSuppliesFilters } from "./FuelSuppliesFilters";

export function FuelSuppliesManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<FuelSupply | null>(null);
  const [deletingSupply, setDeletingSupply] = useState<FuelSupply | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Get everything from the filters hook, including filtered supplies and loading state
  const { 
    search, setSearch,
    date, setDate,
    providerId, setProviderId,
    quantityRange, setQuantityRange,
    priceRange, setPriceRange,
    totalCostRange, setTotalCostRange,
    providers,
    filteredSupplies,
    isLoading,
    refetchSupplies
  } = useFuelSuppliesFilters();

  const createMutation = useMutation({
    mutationFn: createFuelSupply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Fuel supply record created successfully and tank level updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create fuel supply record: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<FuelSupply> }) =>
      updateFuelSupply(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
      setIsDialogOpen(false);
      setEditingSupply(null);
      toast({
        title: "Success",
        description: "Fuel supply record updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update fuel supply record: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleAdd = () => {
    setEditingSupply(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (supply: FuelSupply) => {
    setEditingSupply(supply);
    setIsDialogOpen(true);
  };

  const handleDelete = (supply: FuelSupply) => {
    setDeletingSupply(supply);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) setEditingSupply(null);
  };

  const handleSubmit = (data: any) => {
    if (editingSupply) {
      const { id, created_at, ...rest } = editingSupply;
      updateMutation.mutate({
        id: editingSupply.id,
        updates: { ...data },
      });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDeleteDialogOpenChange = (open: boolean) => {
    if (!open) setDeletingSupply(null);
  };

  const confirmDelete = async () => {
    if (!deletingSupply) return;
    setDeleteLoading(true);
    try {
      await deleteFuelSupply(deletingSupply.id);
      queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
      toast({
        title: "Deleted",
        description: "Fuel supply record deleted successfully",
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete fuel supply: " + error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
      setDeletingSupply(null);
    }
  };

  return (
    <div className="space-y-6">
      <FuelSuppliesHeader onAdd={handleAdd} />
      <FuelSuppliesFilters
        search={search}
        onSearchChange={setSearch}
        date={date}
        onDateChange={setDate}
        providerId={providerId}
        onProviderChange={setProviderId}
        providers={providers}
        quantityRange={quantityRange}
        onQuantityRangeChange={setQuantityRange}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        totalCostRange={totalCostRange}
        onTotalCostRangeChange={setTotalCostRange}
      />
      <FuelSuppliesTable
        fuelSupplies={filteredSupplies}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <FuelSuppliesForm
        open={isDialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleSubmit}
        defaultValues={editingSupply}
      />
      <ConfirmDeleteDialog
        open={!!deletingSupply}
        onOpenChange={handleDeleteDialogOpenChange}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        recordInfo={
          deletingSupply
            ? `${deletingSupply.provider?.name ?? ""} (${deletingSupply.quantity_liters.toLocaleString()} L)`
            : undefined
        }
      />
    </div>
  );
}
