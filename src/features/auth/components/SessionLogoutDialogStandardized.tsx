
import { Button } from "@/core/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/core/components/ui/primitives/alert-dialog";

interface SessionLogoutDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
  confirmButtonProps?: React.ComponentProps<typeof Button>;
}

export function SessionLogoutDialogStandardized({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isLoading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonProps = {},
}: SessionLogoutDialogStandardizedProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isLoading}
            {...confirmButtonProps}
          >
            {isLoading ? "Loading..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
