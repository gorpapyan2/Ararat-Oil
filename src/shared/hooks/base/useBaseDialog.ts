import { useState, useCallback } from 'react';
import type { BaseDialogOptions } from './types';

/**
 * Base hook for all dialog components
 * Provides common dialog functionality like open/close state management
 * 
 * @template T Type of entity being managed in the dialog
 */
export function useBaseDialog<T = any>(options?: BaseDialogOptions<T>) {
  // Dialog open state
  const [isOpen, setIsOpen] = useState(false);
  
  // Submission state for loading indicators
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Current entity being edited/viewed
  const [entity, setEntity] = useState<T | null>(null);
  
  /**
   * Open the dialog
   */
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);
  
  /**
   * Close the dialog
   */
  const close = useCallback(() => {
    if (!isSubmitting) {
      setIsOpen(false);
      
      // Notify parent component
      options?.onClose?.();
      
      // Reset entity after animation completes
      setTimeout(() => {
        setEntity(null);
      }, 300);
    }
  }, [isSubmitting, options]);
  
  /**
   * Handle dialog open state change 
   */
  const onOpenChange = useCallback((open: boolean) => {
    if (open) {
      setIsOpen(true);
    } else {
      close();
    }
  }, [close]);
  
  /**
   * Reset the dialog state
   */
  const reset = useCallback(() => {
    setEntity(null);
    setIsSubmitting(false);
  }, []);
  
  return {
    // State
    isOpen,
    isSubmitting,
    entity,
    
    // Setters
    setIsOpen,
    setIsSubmitting,
    setEntity,
    
    // Methods
    open,
    close,
    onOpenChange,
    reset,
  };
}
