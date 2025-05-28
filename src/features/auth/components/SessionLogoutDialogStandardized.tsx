import { Button } from "@/core/components/ui/button";
import {
  ConfirmDialog,
  ConfirmDialogProps,
} from "@/core/components/ui/composed/dialog";

interface SessionLogoutDialogStandardizedProps
  extends Omit<ConfirmDialogProps, "children"> {
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
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      onConfirm={onConfirm}
      isLoading={isLoading}
      confirmText={confirmText}
      cancelText={cancelText}
      confirmButtonProps={confirmButtonProps}
    />
  );
}
