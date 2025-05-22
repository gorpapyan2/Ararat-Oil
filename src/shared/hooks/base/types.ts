/**
 * Base dialog options shared by all dialog hooks
 */
export interface BaseDialogOptions<T = any> {
  /**
   * Callback when dialog is closed
   */
  onClose?: () => void;
  
  /**
   * Callback when dialog operation succeeds
   */
  onSuccess?: (result: T) => void;
  
  /**
   * Callback when dialog operation fails
   */
  onError?: (error: Error) => void;
}

/**
 * Options for entity dialogs (create/edit operations)
 */
export interface EntityDialogOptions<T = any> extends BaseDialogOptions<T> {
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
