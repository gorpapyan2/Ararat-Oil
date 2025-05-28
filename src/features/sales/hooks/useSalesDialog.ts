import { useCallback, useState } from "react";
import { useEntityDialog } from "@/shared/hooks/base";
import type { Sale, CreateSaleRequest, UpdateSaleRequest } from "../types";
import { createSale, updateSale, deleteSale } from "../services";
import { useToast } from "@/shared/hooks/ui";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Options for the sales dialog hook
 */
export interface UseSalesDialogOptions {
  /**
   * Callback when a sale is successfully created
   */
  onCreateSuccess?: (sale: Sale) => void;

  /**
   * Callback when a sale is successfully updated
   */
  onUpdateSuccess?: (sale: Sale) => void;

  /**
   * Callback when a sale is successfully deleted
   * @param id The ID of the deleted sale
   * @param sale The deleted sale entity
   */
  onDeleteSuccess?: (id: string | number, sale?: Sale) => void;
}

/**
 * Custom hook for managing sales dialog state and operations
 *
 * This hook builds on the base entity dialog hook to provide
 * sales-specific functionality while eliminating code duplication.
 */
export function useSalesDialog(options?: UseSalesDialogOptions) {
  // Use the shared toast hook - destructure it to get the toast function
  const { toast, success, error: showError } = useToast();
  // Use the base entity dialog hook for edit/create operations
  const editDialog = useEntityDialog<Sale>({
    entityName: "sale",
    onCreateSuccess: options?.onCreateSuccess,
    onUpdateSuccess: options?.onUpdateSuccess,
    onDeleteSuccess: options?.onDeleteSuccess,
  });

  // Use separate state for delete dialog (not part of the base dialog)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Use React Query for cache management
  const queryClient = useQueryClient();

  /**
   * Open dialog for confirming deletion
   */
  const openDeleteDialog = useCallback(
    (sale: Sale) => {
      editDialog.setEntity(sale);
      setIsDeleteDialogOpen(true);
    },
    [editDialog]
  );

  /**
   * Close delete dialog
   */
  const closeDeleteDialog = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setTimeout(() => {
      editDialog.setEntity(null);
    }, 300);
  }, [editDialog]);

  /**
   * Handle form submission for sale creation or update
   */
  const handleSubmit = useCallback(
    async (formData: CreateSaleRequest) => {
      try {
        editDialog.setIsSubmitting(true);

        if (editDialog.entity) {
          // Update existing sale
          const updateData: UpdateSaleRequest = {
            id: editDialog.entity.id,
            ...formData,
          };

          const updatedSale = await updateSale(updateData.id, updateData);

          success({
            title: "Sale updated",
            description: `Successfully updated sale for ${formData.amount.toFixed(2)}.`,
          });

          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ["sales"] });

          // Notify parent components of the update
          editDialog.handleUpdateSuccess(updatedSale as Sale);
        } else {
          // Create new sale
          const newSale = await createSale(formData);

          success({
            title: "Sale created",
            description: `Successfully created sale for ${formData.amount.toFixed(2)}.`,
          });

          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ["sales"] });

          // Notify parent components of the creation
          editDialog.handleCreateSuccess(newSale as Sale);
        }
      } catch (error) {
        console.error("Error submitting sale data:", error);
        showError({
          title: "Error",
          description: "Failed to save sale. Please try again.",
        });

        // Handle the error with the base hook
        editDialog.handleError(error as Error);
      } finally {
        editDialog.setIsSubmitting(false);
      }
    },
    [editDialog, queryClient, showError, success]
  );

  /**
   * Handle sale deletion
   */
  const handleDelete = useCallback(async () => {
    if (!editDialog.entity) return;

    try {
      editDialog.setIsSubmitting(true);

      await deleteSale(editDialog.entity.id);

      success({
        title: "Sale deleted",
        description: `Successfully deleted sale.`,
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["sales"] });

      // Use the base hook's handleDeleteSuccess method
      editDialog.handleDeleteSuccess(editDialog.entity.id);

      // Close the dialog
      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting sale:", error);
      showError({
        title: "Error",
        description: "Failed to delete sale. Please try again.",
      });

      // Handle the error with the base hook
      editDialog.handleError(error as Error);
    } finally {
      editDialog.setIsSubmitting(false);
    }
  }, [editDialog, queryClient, closeDeleteDialog, showError, success]);

  return {
    // Re-export everything from the edit dialog
    ...editDialog,

    // Delete dialog state
    isDeleteDialogOpen,

    // Additional methods
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
    handleSubmit,

    // For backwards compatibility
    isEditDialogOpen: editDialog.isOpen,
    handleEditDialogOpenChange: editDialog.onOpenChange,
    openCreateDialog: editDialog.openCreate,
    openEditDialog: editDialog.openEdit,
    selectedSale: editDialog.entity,
  };
}
