import { DeleteConfirmDialog } from "@/components/ui/composed/dialog";

interface ConfirmDeleteDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  systemName: string;
}

export function ConfirmDeleteDialogStandardized({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  systemName,
}: ConfirmDeleteDialogStandardizedProps) {
  return (
    <DeleteConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title="Delete Filling System"
      description={`Are you sure you want to delete the "${systemName}" filling system? This action cannot be undone.`}
      isLoading={isLoading}
    />
  );
} 