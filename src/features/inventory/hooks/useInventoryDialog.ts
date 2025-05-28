import { useCallback } from "react";
import { useEntityDialog } from "@/shared/hooks/base";
import { useToast } from "@/shared/hooks/ui";
import { useQueryClient } from "@tanstack/react-query";

// Define inventory item type
export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  minStockLevel: number;
  lastRestocked: string;
  category: string;
  location: string;
}

// Define form data for creating/updating inventory items
export interface InventoryItemFormData {
  name: string;
  quantity: number;
  minStockLevel: number;
  category: string;
  location: string;
}

// Mock service functions (replace with actual implementations)
const createInventoryItem = async (
  data: InventoryItemFormData
): Promise<InventoryItem> => {
  // Simulate API call
  return {
    id: Math.random().toString(36).substring(2, 9),
    ...data,
    lastRestocked: new Date().toISOString(),
  };
};

const updateInventoryItem = async (
  id: string,
  data: InventoryItemFormData
): Promise<InventoryItem> => {
  // Simulate API call
  return {
    id,
    ...data,
    lastRestocked: new Date().toISOString(),
  };
};

const deleteInventoryItem = async (id: string): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return;
};

/**
 * Options for the inventory dialog hook
 */
export interface UseInventoryDialogOptions {
  /**
   * Callback when an inventory item is successfully created
   */
  onCreateSuccess?: (item: InventoryItem) => void;

  /**
   * Callback when an inventory item is successfully updated
   */
  onUpdateSuccess?: (item: InventoryItem) => void;

  /**
   * Callback when an inventory item is successfully deleted
   * @param id The ID of the deleted item
   * @param item The deleted item entity
   */
  onDeleteSuccess?: (id: string | number, item?: InventoryItem) => void;
}

/**
 * Custom hook for managing inventory dialog state and operations
 *
 * This hook demonstrates how to build feature-specific functionality on top
 * of the base entity dialog hook.
 */
export function useInventoryDialog(options?: UseInventoryDialogOptions) {
  // Use the shared toast hook
  const { success, error: showError } = useToast();

  // Use the base entity dialog hook for edit/create operations
  const entityDialog = useEntityDialog<InventoryItem>({
    entityName: "inventory item",
    onCreateSuccess: options?.onCreateSuccess,
    onUpdateSuccess: options?.onUpdateSuccess,
    onDeleteSuccess: options?.onDeleteSuccess,
  });

  // Use React Query for cache management
  const queryClient = useQueryClient();

  /**
   * Handle form submission for inventory item creation or update
   */
  const handleSubmit = useCallback(
    async (formData: InventoryItemFormData) => {
      try {
        entityDialog.setIsSubmitting(true);

        if (entityDialog.entity) {
          // Update existing inventory item
          const updatedItem = await updateInventoryItem(
            entityDialog.entity.id,
            formData
          );

          success({
            title: "Inventory Updated",
            description: `Successfully updated ${updatedItem.name}.`,
          });

          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ["inventory"] });

          // Notify parent components of the update
          entityDialog.handleUpdateSuccess(updatedItem);
        } else {
          // Create new inventory item
          const newItem = await createInventoryItem(formData);

          success({
            title: "Inventory Item Added",
            description: `Successfully added ${newItem.name} to inventory.`,
          });

          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ["inventory"] });

          // Notify parent components of the creation
          entityDialog.handleCreateSuccess(newItem);
        }
      } catch (error) {
        console.error("Error submitting inventory data:", error);
        showError({
          title: "Error",
          description: "Failed to save inventory item. Please try again.",
        });

        // Handle the error with the base hook
        entityDialog.handleError(error as Error);
      } finally {
        entityDialog.setIsSubmitting(false);
      }
    },
    [entityDialog, success, showError, queryClient]
  );

  /**
   * Handle inventory item deletion
   */
  const handleDelete = useCallback(async () => {
    if (!entityDialog.entity) return;

    try {
      entityDialog.setIsSubmitting(true);

      await deleteInventoryItem(entityDialog.entity.id);

      success({
        title: "Item Removed",
        description: `Successfully removed ${entityDialog.entity.name} from inventory.`,
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["inventory"] });

      // Use the base hook's handleDeleteSuccess method
      entityDialog.handleDeleteSuccess(
        entityDialog.entity.id,
        entityDialog.entity
      );
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      showError({
        title: "Error",
        description: "Failed to delete inventory item. Please try again.",
      });

      // Handle the error with the base hook
      entityDialog.handleError(error as Error);
    } finally {
      entityDialog.setIsSubmitting(false);
    }
  }, [entityDialog, success, showError, queryClient]);

  /**
   * Special function to restock an inventory item
   */
  const handleRestock = useCallback(
    async (additionalQuantity: number) => {
      if (!entityDialog.entity) return;

      try {
        entityDialog.setIsSubmitting(true);

        const updatedItem = await updateInventoryItem(entityDialog.entity.id, {
          ...entityDialog.entity,
          quantity: entityDialog.entity.quantity + additionalQuantity,
        });

        success({
          title: "Inventory Restocked",
          description: `Successfully added ${additionalQuantity} units to ${updatedItem.name}.`,
        });

        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ["inventory"] });

        // Notify parent components of the update
        entityDialog.handleUpdateSuccess(updatedItem);
      } catch (error) {
        console.error("Error restocking inventory:", error);
        showError({
          title: "Error",
          description: "Failed to restock inventory. Please try again.",
        });

        // Handle the error with the base hook
        entityDialog.handleError(error as Error);
      } finally {
        entityDialog.setIsSubmitting(false);
      }
    },
    [entityDialog, success, showError, queryClient]
  );

  return {
    // Re-export everything from the entity dialog
    ...entityDialog,

    // Additional methods
    handleSubmit,
    handleDelete,
    handleRestock,
  };
}
