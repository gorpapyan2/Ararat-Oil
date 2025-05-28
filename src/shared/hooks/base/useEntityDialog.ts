import { useCallback } from "react";
import { useBaseDialog } from "./useBaseDialog";
import type { EntityDialogOptions } from "./types";

/**
 * Extended hook for dialogs that manage entities (create/edit/delete)
 * Provides specialized methods for entity management
 *
 * @template T Type of entity being managed in the dialog
 */
export function useEntityDialog<T = unknown>(options?: EntityDialogOptions<T>) {
  // Use the base dialog hook for core functionality
  const baseDialog = useBaseDialog<T>(options);

  /**
   * Open dialog in create mode (no entity)
   */
  const openCreate = useCallback(() => {
    baseDialog.setEntity(null);
    baseDialog.open();
  }, [baseDialog]);

  /**
   * Open dialog in edit mode with the specified entity
   */
  const openEdit = useCallback(
    (entityToEdit: T) => {
      baseDialog.setEntity(entityToEdit);
      baseDialog.open();
    },
    [baseDialog]
  );

  /**
   * Handle successful entity creation
   */
  const handleCreateSuccess = useCallback(
    (createdEntity: T) => {
      options?.onCreateSuccess?.(createdEntity);
      options?.onSuccess?.(createdEntity);

      // Close the dialog after successful creation
      baseDialog.close();
    },
    [baseDialog, options]
  );

  /**
   * Handle successful entity update
   */
  const handleUpdateSuccess = useCallback(
    (updatedEntity: T) => {
      options?.onUpdateSuccess?.(updatedEntity);
      options?.onSuccess?.(updatedEntity);

      // Close the dialog after successful update
      baseDialog.close();
    },
    [baseDialog, options]
  );

  /**
   * Handle successful entity deletion
   *
   * @param entityId The ID of the deleted entity
   */
  const handleDeleteSuccess = useCallback(
    (entityId: string | number) => {
      options?.onDeleteSuccess?.(entityId);

      // Close the dialog after successful deletion
      baseDialog.close();
    },
    [baseDialog, options]
  );

  /**
   * Handle error in any entity operation
   */
  const handleError = useCallback(
    (error: Error) => {
      options?.onError?.(error);
    },
    [options]
  );

  return {
    ...baseDialog,
    // Entity state derived values
    isCreateMode: baseDialog.entity === null,
    isEditMode: baseDialog.entity !== null,

    // Entity-specific methods
    openCreate,
    openEdit,

    // Success handlers
    handleCreateSuccess,
    handleUpdateSuccess,
    handleDeleteSuccess,
    handleError,
  };
}
