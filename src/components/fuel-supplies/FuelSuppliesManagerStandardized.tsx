
import { useState, useEffect, useMemo, useCallback } from "react";
import { useFuelSuppliesFilters } from "./hooks/useFuelSuppliesFilters";
import { ConfirmDeleteDialogStandardized } from "./ConfirmDeleteDialogStandardized";
import { ConfirmAddDialogStandardized } from "./ConfirmAddDialogStandardized";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createFuelSupply,
  updateFuelSupply,
  deleteFuelSupply,
} from "@/services/fuel-supplies";
import { useToast } from "@/hooks";
import { useDialog } from "@/hooks/useDialog";
import { FuelSupply } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { fetchFuelTanks } from "@/services/tanks";
import { FuelSuppliesTable } from "./FuelSuppliesTable";
import { FuelSuppliesSummary } from "./summary/FuelSuppliesSummary";
import { useTranslation } from "react-i18next";
import { FuelSuppliesFormStandardized } from "./FuelSuppliesFormStandardized";
import { useNavigate } from "react-router-dom";

interface FuelSuppliesManagerStandardizedProps {
  onRenderAction?: (actionNode: React.ReactNode) => void;
}

export function FuelSuppliesManagerStandardized({
  onRenderAction,
}: FuelSuppliesManagerStandardizedProps) {
  // Use dialog hooks
  const formDialog = useDialog();
  const confirmAddDialog = useDialog();
  const confirmDeleteDialog = useDialog();

  const [editingSupply, setEditingSupply] = useState<FuelSupply | null>(null);
  const [deletingSupply, setDeletingSupply] = useState<FuelSupply | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pendingData, setPendingData] = useState<any>(null);
  const [confirmData, setConfirmData] = useState<any>(null);

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Use the filter hook
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
    refetchSupplies,
  } = useFuelSuppliesFilters();

  const { data: tanks } = useQuery({
    queryKey: ["fuel-tanks"],
    queryFn: fetchFuelTanks,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
  });

  // Memoize the filtered supplies for summary
  const summaryFilteredSupplies = useMemo(() => filteredSupplies || [], [filteredSupplies]);

  // Handler for updating filters in a modern, scalable way
  const handleFiltersChange = useCallback((updates: Partial<typeof filters>) => {
    if ("search" in updates) {
      const searchValue =
        typeof updates.search === "string" ? updates.search : "";
      setSearch(searchValue);
    }
    if ("date" in updates && setDate) setDate(updates.date!);
    if ("provider" in updates && setProvider) setProvider(updates.provider!);
    if ("fuelType" in updates && setType) setType(updates.fuelType! as string);
    if ("quantityRange" in updates) {
      setMinQuantity(updates.quantityRange![0]);
      setMaxQuantity(updates.quantityRange![1]);
    }
    if ("priceRange" in updates) {
      setMinPrice(updates.priceRange![0]);
      setMaxPrice(updates.priceRange![1]);
    }
    if ("totalRange" in updates) {
      setMinTotal(updates.totalRange![0]);
      setMaxTotal(updates.totalRange![1]);
    }
  }, [setSearch, setDate, setProvider, setType, setMinQuantity, setMaxQuantity, setMinPrice, setMaxPrice, setMinTotal, setMaxTotal]);

  const createMutation = useMutation({
    mutationFn: createFuelSupply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
      formDialog.close();
      confirmAddDialog.close();
      setPendingData(null);
      setConfirmData(null);
      toast({
        title: "Success",
        description:
          "Fuel supply record created successfully and tank level updated",
      });
    },
    onError: (error) => {
      confirmAddDialog.close();
      toast({
        title: "Error",
        description: "Failed to create fuel supply record: " + error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<FuelSupply>;
    }) => updateFuelSupply(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
      formDialog.close();
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

  const handleAdd = useCallback(() => {
    navigate('/fuel-management/fuel-supplies/create');
  }, [navigate]);

  const handleEdit = useCallback((supply: FuelSupply) => {
    setEditingSupply(supply);
    formDialog.open();
  }, [formDialog]);

  const handleDelete = useCallback((supply: FuelSupply) => {
    setDeletingSupply(supply);
    confirmDeleteDialog.open();
  }, [confirmDeleteDialog]);

  const handleDialogClose = useCallback(() => {
    setEditingSupply(null);
  }, []);

  const handleSubmit = useCallback((data: any) => {
    if (editingSupply) {
      updateMutation.mutate({
        id: editingSupply.id,
        updates: data,
      });
    } else {
      setPendingData(data);
      const providerName = providers?.find((p) => p.id === data.provider_id)?.name;
      const selectedTank = tanks?.find((t) => t.id === data.tank_id);
      setConfirmData({
        quantity: Number(data.quantity_liters) || 0,
        price: Number(data.price_per_liter) || 0,
        totalCost: Number(data.total_cost) || 0,
        providerName,
        tankName: selectedTank?.name,
        tankCapacity: Number(selectedTank?.capacity) || 0,
        tankLevel: Number(selectedTank?.current_level) || 0,
      });
      confirmAddDialog.open();
    }
  }, [editingSupply, updateMutation, providers, tanks, confirmAddDialog]);

  const handleConfirmSubmit = useCallback(() => {
    if (pendingData) {
      createMutation.mutate(pendingData);
    }
  }, [pendingData, createMutation]);

  const confirmDelete = useCallback(async () => {
    if (!deletingSupply) return;
    setDeleteLoading(true);
    try {
      await deleteFuelSupply(deletingSupply.id);
      queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
      confirmDeleteDialog.close();
      setDeletingSupply(null);
      toast({
        title: "Success",
        description: "Fuel supply record deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete fuel supply record: " + error.message,
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  }, [deletingSupply, queryClient, confirmDeleteDialog, toast]);

  // Memoize the action element
  const actionElement = useMemo(() => (
    <Button onClick={handleAdd}>
      <Plus className="mr-2 h-4 w-4" />
      Add New Supply
    </Button>
  ), [handleAdd]);

  // Call the onRenderAction prop with the memoized action element if provided
  useEffect(() => {
    if (onRenderAction) {
      onRenderAction(actionElement);
    }
  }, [onRenderAction, actionElement]);
  
  // Define the handleFormSuccess function
  const handleFormSuccess = useCallback(() => {
    refetchSupplies();
    formDialog.close();
  }, [refetchSupplies, formDialog]);

  return (
    <div className="space-y-6">
      <FuelSuppliesSummary supplies={summaryFilteredSupplies} />
      
      <FuelSuppliesTable
        fuelSupplies={filteredSupplies}
        isLoading={isLoading}
        onEdit={(supplyId) => {
          const supply = filteredSupplies.find(s => s.id === supplyId);
          if (supply) handleEdit(supply);
        }}
        onDelete={(supplyId) => {
          const supply = filteredSupplies.find(s => s.id === supplyId);
          if (supply) handleDelete(supply);
        }}
        onFiltersChange={handleFiltersChange}
        totalCount={filteredSupplies.length}
      />

      <FuelSuppliesFormStandardized
        open={formDialog.isOpen}
        onOpenChange={formDialog.onOpenChange}
        onSuccess={handleFormSuccess}
        initialData={editingSupply}
      />

      <ConfirmAddDialogStandardized
        open={confirmAddDialog.isOpen}
        onOpenChange={confirmAddDialog.onOpenChange}
        onConfirm={handleConfirmSubmit}
        onCancel={confirmAddDialog.close}
        isLoading={createMutation.isPending}
        data={confirmData || {}}
      />

      <ConfirmDeleteDialogStandardized
        open={confirmDeleteDialog.isOpen}
        onOpenChange={confirmDeleteDialog.onOpenChange}
        onConfirm={confirmDelete}
        isLoading={deleteLoading}
        recordInfo={deletingSupply?.id}
      />
    </div>
  );
}
