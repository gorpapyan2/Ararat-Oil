import { useState, useCallback } from "react";
import { useToast } from "./use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Sale } from "@/types";
import { createSale, updateSale, deleteSale } from "@/features/sales/services";
import type { CreateSaleRequest, UpdateSaleRequest } from "@/features/sales/types";

interface UseSalesDialogOptions {
  onCreateSuccess?: (sale: Sale) => void;
  onUpdateSuccess?: (sale: Sale) => void;
  onDeleteSuccess?: (id: string) => void;
}

export function useSalesDialog({
  onCreateSuccess,
  onUpdateSuccess,
  onDeleteSuccess,
}: UseSalesDialogOptions = {}) {
  // Dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reset selected sale when edit dialog closes
  const handleEditDialogOpenChange = useCallback((open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setSelectedSale(null);
    }
  }, []);

  // Open dialog for creating a new sale
  const openCreateDialog = useCallback(() => {
    setSelectedSale(null);
    setIsEditDialogOpen(true);
  }, []);

  // Open dialog for editing an existing sale
  const openEditDialog = useCallback((sale: Sale) => {
    setSelectedSale(sale);
    setIsEditDialogOpen(true);
  }, []);

  // Open dialog for confirming deletion
  const openDeleteDialog = useCallback((sale: Sale) => {
    setSelectedSale(sale);
    setIsDeleteDialogOpen(true);
  }, []);

  // Handle form submission (create or update)
  const handleSubmit = useCallback(
    async (data: CreateSaleRequest) => {
      setIsSubmitting(true);

      try {
        if (selectedSale?.id) {
          // Update existing sale
          const updateData: UpdateSaleRequest = { ...data, id: selectedSale.id };
          const updatedSale = await updateSale(selectedSale.id, updateData);

          queryClient.invalidateQueries({ queryKey: ["sales"] });
          queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
          queryClient.invalidateQueries({ queryKey: ["latest-sale"] });

          toast({
            title: "Success",
            description: "Sale updated successfully and tank level adjusted",
          });

          onUpdateSuccess?.(updatedSale);
        } else {
          // Create new sale
          const newSale = await createSale(data);

          queryClient.invalidateQueries({ queryKey: ["sales"] });
          queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });
          queryClient.invalidateQueries({ queryKey: ["latest-sale"] });

          toast({
            title: "Success",
            description: "Sale created successfully and tank level updated",
          });

          onCreateSuccess?.(newSale);
        }

        setIsEditDialogOpen(false);
      } catch (error: unknown) {
        console.error("Error submitting sale:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to save sale";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedSale, queryClient, toast, onUpdateSuccess, onCreateSuccess]
  );

  // Handle delete confirmation
  const handleDelete = useCallback(async () => {
    if (!selectedSale?.id) return;

    setIsSubmitting(true);

    try {
      await deleteSale(selectedSale.id);

      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["fuel-tanks"] });

      toast({
        title: "Success",
        description: "Sale deleted successfully and tank level restored",
      });

      onDeleteSuccess?.(selectedSale.id);
      setIsDeleteDialogOpen(false);
    } catch (error: unknown) {
      console.error("Error deleting sale:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete sale";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedSale, queryClient, toast, onDeleteSuccess]);

  return {
    // Dialog state
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedSale,
    isSubmitting,

    // Dialog actions
    handleEditDialogOpenChange,
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    handleSubmit,
    handleDelete,
  };
}
