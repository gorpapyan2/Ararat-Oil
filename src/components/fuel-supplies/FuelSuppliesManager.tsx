
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchFuelSupplies,
  createFuelSupply,
  updateFuelSupply,
  deleteFuelSupply,
} from "@/services/fuel-supplies";
import { FuelSuppliesHeader } from "./FuelSuppliesHeader";
import { FuelSuppliesTable } from "./FuelSuppliesTable";
import { FuelSuppliesForm } from "./FuelSuppliesForm";
import { FuelSupply } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

export function FuelSuppliesManager() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<FuelSupply | null>(null);
  const [deletingSupply, setDeletingSupply] = useState<FuelSupply | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: fuelSupplies, isLoading } = useQuery({
    queryKey: ["fuel-supplies"],
    queryFn: fetchFuelSupplies,
  });

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
      <FuelSuppliesTable
        fuelSupplies={fuelSupplies || []}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <FuelSuppliesForm
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingSupply(null);
        }}
        onSubmit={(data) => {
          if (editingSupply) {
            // Update mode
            const { id, created_at, ...rest } = editingSupply;
            updateMutation.mutate({
              id: editingSupply.id,
              updates: { ...data },
            });
          } else {
            // Create mode
            createMutation.mutate(data);
          }
        }}
        defaultValues={
          editingSupply
            ? {
                ...editingSupply,
                // Ensure any nested relations for provider/tank/employee are just IDs
                provider_id: editingSupply.provider_id || editingSupply.provider?.id || "",
                tank_id: editingSupply.tank_id || editingSupply.tank?.id || "",
                employee_id: editingSupply.employee_id || editingSupply.employee?.id || "",
                comments: editingSupply.comments || "",
              }
            : undefined
        }
      />
      <ConfirmDeleteDialog
        open={!!deletingSupply}
        onOpenChange={(open) => {
          if (!open) setDeletingSupply(null);
        }}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        recordInfo={
          deletingSupply
            ? `${deletingSupply.provider?.name ?? ""} (${deletingSupply.quantity_liters.toLocaleString()} ֏)`
            : undefined
        }
      />
    </div>
  );
}
