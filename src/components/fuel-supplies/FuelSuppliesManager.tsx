import { useState, useEffect, useMemo } from "react";
import { useFuelSuppliesFilters } from "./hooks/useFuelSuppliesFilters";
import { FuelSuppliesForm } from "./FuelSuppliesForm";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { ConfirmAddDialog } from "./ConfirmAddDialog";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createFuelSupply, updateFuelSupply, deleteFuelSupply } from "@/services/fuel-supplies";
import { useToast } from "@/hooks/use-toast";
import { FuelSupply } from "@/types";
import { FilterBar } from "./filters/FilterBar";
import { FuelSuppliesDataTable } from "./data-table/FuelSuppliesDataTable";
import { FuelSuppliesSummary } from "./summary/FuelSuppliesSummary";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { fetchFuelTanks } from "@/services/tanks";

interface FuelSuppliesManagerProps {
  onRenderAction?: (actionNode: React.ReactNode) => void;
}

export function FuelSuppliesManager({ onRenderAction }: FuelSuppliesManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<FuelSupply | null>(null);
  const [deletingSupply, setDeletingSupply] = useState<FuelSupply | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Destructure individual setters instead of setFilters
  const {
    filters,
    setSearch,
    setDate,
    setProvider,
    setType,
    setMinQuantity,
    setMaxQuantity,
    setMinPrice,
    setMaxPrice,
    setMinTotal,
    setMaxTotal,
    providers,
    filteredSupplies,
    isLoading,
    refetchSupplies
  } = useFuelSuppliesFilters();

  // Add new state variables for confirmation
  const [confirmData, setConfirmData] = useState<any>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);

  const { data: tanks } = useQuery({
    queryKey: ['fuel-tanks'],
    queryFn: fetchFuelTanks
  });

  // Handler for updating filters in a modern, scalable way
  const handleFiltersChange = (updates: Partial<typeof filters>) => {
    if ("search" in updates && setSearch) setSearch(updates.search!);
    if ("date" in updates && setDate) setDate(updates.date!);
    if ("provider" in updates && setProvider) setProvider(updates.provider!);
    if ("type" in updates && setType) setType(updates.type!);
    if ("minQuantity" in updates && setMinQuantity) setMinQuantity(updates.minQuantity!);
    if ("maxQuantity" in updates && setMaxQuantity) setMaxQuantity(updates.maxQuantity!);
    if ("minPrice" in updates && setMinPrice) setMinPrice(updates.minPrice!);
    if ("maxPrice" in updates && setMaxPrice) setMaxPrice(updates.maxPrice!);
    if ("minTotal" in updates && setMinTotal) setMinTotal(updates.minTotal!);
    if ("maxTotal" in updates && setMaxTotal) setMaxTotal(updates.maxTotal!);
  };

  const createMutation = useMutation({
    mutationFn: createFuelSupply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
      setIsDialogOpen(false);
      setIsConfirmOpen(false);
      setPendingData(null);
      setConfirmData(null);
      toast({
        title: "Success",
        description: "Fuel supply record created successfully and tank level updated",
      });
    },
    onError: (error) => {
      setIsConfirmOpen(false);
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
    if (!open) {
      setEditingSupply(null);
      setPendingData(null);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingSupply) {
      // For editing, proceed without confirmation
      const { id, created_at, ...rest } = editingSupply;
      updateMutation.mutate({
        id: editingSupply.id,
        updates: { ...data },
      });
    } else {
      // For adding new supply, show confirmation dialog
      setPendingData(data);
      
      // Find the provider name
      const providerName = providers?.find(p => p.id === data.provider_id)?.name;
      
      // Find the tank details
      const selectedTank = tanks?.find(t => t.id === data.tank_id);
      
      // Prepare confirmation data
      setConfirmData({
        quantity: data.quantity_liters,
        price: data.price_per_liter,
        totalCost: data.total_cost,
        providerName,
        tankName: selectedTank?.name,
        tankCapacity: selectedTank?.capacity,
        tankLevel: selectedTank?.current_level
      });
      
      setIsConfirmOpen(true);
    }
  };

  const handleConfirmSubmit = () => {
    if (pendingData) {
      createMutation.mutate(pendingData);
    }
  };

  const handleConfirmCancel = () => {
    setIsConfirmOpen(false);
    // Keep the form open so the user can modify details
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
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
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

  // Memoize the add button to prevent recreation on every render
  const addButton = useMemo(() => (
    <Button 
      onClick={handleAdd} 
      className="gap-2 shadow-sm"
      size="sm"
      aria-label="Add new fuel supply"
    >
      <Plus className="h-4 w-4" />
      <span>Add Supply</span>
    </Button>
  ), []);

  // Use useEffect to handle action rendering to avoid state updates during render
  useEffect(() => {
    if (onRenderAction) {
      onRenderAction(addButton);
    }
  }, [onRenderAction, addButton]);

  return (
    <div className="space-y-6">      
      <section aria-label="Key metrics" className="mb-6">
        <FuelSuppliesSummary supplies={filteredSupplies} />
      </section>
      
      <section aria-label="Search and filters" className="mb-6">
        <FilterBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          providers={providers}
          isLoading={isLoading}
        />
      </section>
      
      <section aria-label="Fuel supplies data">
        <FuelSuppliesDataTable
          data={filteredSupplies}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>
      
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
      
      {confirmData && (
        <ConfirmAddDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          onConfirm={handleConfirmSubmit}
          onCancel={handleConfirmCancel}
          loading={createMutation.isPending}
          data={confirmData}
        />
      )}
    </div>
  );
}
