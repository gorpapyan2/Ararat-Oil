/**
 * This is a re-export file for the Dialog component.
 * It ensures backward compatibility by re-exporting the components from their primitive location.
 */

// Re-export all styled dialog components
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

// Re-export composed dialog components
export {
  StandardDialog,
  ConfirmDialog,
  AlertMessageDialog,
  DeleteConfirmDialog,
} from "@/core/components/ui/composed/dialog";

// Re-export types
export type {
  StandardDialogProps,
  ConfirmDialogProps,
  AlertMessageDialogProps,
  DeleteConfirmDialogProps,
} from "@/core/components/ui/composed/dialog";
