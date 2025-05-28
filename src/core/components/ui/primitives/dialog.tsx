/**
 * This is a re-export file for the Dialog component primitives.
 * It ensures proper component structure by re-exporting the components from the styled layer.
 */

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/core/components/ui/styled/dialog";

// Export composed dialog types and components
export {
  ConfirmDialog,
  AlertMessageDialog,
  DeleteConfirmDialog,
} from "@/core/components/ui/composed/dialog";

// Export types using the 'export type' syntax
export type {
  StandardDialogProps,
  ConfirmDialogProps,
  AlertMessageDialogProps,
  DeleteConfirmDialogProps,
} from "@/core/components/ui/composed/dialog";
