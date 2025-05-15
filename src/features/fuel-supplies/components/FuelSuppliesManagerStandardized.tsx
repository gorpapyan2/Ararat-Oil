import { useState } from "react";
import { useFuelSuppliesFilters } from "../hooks/useFuelSuppliesFilters";
import { ConfirmDeleteDialogStandardized } from "./ConfirmDeleteDialogStandardized";
import { ConfirmAddDialogStandardized } from "./ConfirmAddDialogStandardized";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createFuelSupply,
  updateFuelSupply,
  deleteFuelSupply,
} from "../services";
import { useToast } from "@/hooks";
import { useDialog } from "@/hooks/useDialog";
import { FuelSupply } from "../types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FuelSuppliesTable } from "./FuelSuppliesTable";
import { FuelSuppliesSummary } from "./summary/FuelSuppliesSummary";
import { FuelSuppliesFormStandardized } from "./FuelSuppliesFormStandardized";

export function FuelSuppliesManagerStandardized() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    filteredSupplies,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedProvider,
    setSelectedProvider,
    selectedFuelType,
    setSelectedFuelType,
  } = useFuelSuppliesFilters();

  const addDialog = useDialog();
  const editDialog = useDialog();
  const deleteDialog = useDialog();
  const [editingSupply, setEditingSupply] = useState<FuelSupply | null>(null);

  const { mutate: createMutate, isPending: createLoading } = useMutation({
    mutationFn: createFuelSupply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
      addDialog.onOpenChange(false);
      toast({
        title: "Success",
        description: "Fuel supply created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create fuel supply.",
        variant: "destructive",
      });
    },
  });

  const { mutate: updateMutate, isPending: updateLoading } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FuelSupply> }) =>
      updateFuelSupply(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
      editDialog.onOpenChange(false);
      toast({
        title: "Success",
        description: "Fuel supply updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update fuel supply.",
        variant: "destructive",
      });
    },
  });

  const { mutate: deleteMutate, isPending: deleteLoading } = useMutation({
    mutationFn: deleteFuelSupply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
      deleteDialog.onOpenChange(false);
      toast({
        title: "Success",
        description: "Fuel supply deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete fuel supply.",
        variant: "destructive",
      });
    },
  });

  const handleAdd = () => {
    addDialog.onOpenChange(true);
  };

  const handleEdit = (supply: FuelSupply) => {
    setEditingSupply(supply);
    editDialog.onOpenChange(true);
  };

  const handleDelete = (supply: FuelSupply) => {
    setEditingSupply(supply);
    deleteDialog.onOpenChange(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Fuel Supplies</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Supply
        </Button>
      </div>

      <FuelSuppliesSummary
        supplies={filteredSupplies}
        loading={isLoading}
        onFilteredSuppliesChange={(filtered) => {
          // Handle filtered supplies if needed
        }}
      />

      <FuelSuppliesTable
        fuelSupplies={filteredSupplies}
        isLoading={isLoading}
        onEdit={(supplyId) => {
          const supply = filteredSupplies.find((s) => s.id === supplyId);
          if (supply) handleEdit(supply);
        }}
        onDelete={(supplyId) => {
          const supply = filteredSupplies.find((s) => s.id === supplyId);
          if (supply) handleDelete(supply);
        }}
      />

      <ConfirmDeleteDialogStandardized
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.onOpenChange}
        onConfirm={() => {
          if (editingSupply) {
            deleteMutate(editingSupply.id);
          }
        }}
        isLoading={deleteLoading}
      />

      <ConfirmAddDialogStandardized
        open={addDialog.isOpen}
        onOpenChange={addDialog.onOpenChange}
        onConfirm={(data) => {
          createMutate(data);
        }}
        isLoading={createLoading}
      />

      <FuelSuppliesFormStandardized
        open={editDialog.isOpen}
        onOpenChange={editDialog.onOpenChange}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["fuel-supplies"] });
        }}
        initialData={editingSupply as FuelSupply}
      />
    </div>
  );
} 