/**
 * Base dialog options shared by all dialog hooks
 */
export interface BaseDialogOptions<T = unknown> {
  /**
   * Initial state for the dialog
   */
  initialOpen?: boolean;

  /**
   * Callback fired when the dialog opens
   */
  onOpen?: () => void;

  /**
   * Callback when dialog is closed
   */
  onClose?: () => void;

  /**
   * Callback when dialog operation succeeds
   */
  onSuccess?: (entity: T) => void;

  /**
   * Callback when dialog operation fails
   */
  onError?: (error: Error) => void;
}

/**
 * Options for entity dialogs (create/edit operations)
 */
export interface EntityDialogOptions<T = unknown> extends BaseDialogOptions<T> {
  /**
   * Callback when entity is successfully created
   */
  onCreateSuccess?: (entity: T) => void;

  /**
   * Callback when entity is successfully updated
   */
  onUpdateSuccess?: (entity: T) => void;

  /**
   * Callback when entity is successfully deleted
   * @param entityId The ID of the deleted entity
   */
  onDeleteSuccess?: (entityId: string | number) => void;

  /**
   * Entity display name (for toast messages)
   */
  entityName?: string;
}
