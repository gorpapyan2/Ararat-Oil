import { DeleteConfirmDialog } from "@/components/ui/composed/dialog";

interface ConfirmDeleteDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  recordInfo?: string;
}

export function ConfirmDeleteDialogStandardized({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  recordInfo,
}: ConfirmDeleteDialogStandardizedProps) {
  return (
    <DeleteConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title="Delete Fuel Supply"
      description={`Are you sure you want to delete this fuel supply${
        recordInfo ? ` – ${recordInfo}` : ""
      }? This action cannot be undone.`}
      isLoading={isLoading}
    />
  );
} 