import { StandardDialog } from "@/components/ui/composed/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface ConfirmDeleteDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ConfirmDeleteDialogStandardized({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: ConfirmDeleteDialogStandardizedProps) {
  const { t } = useTranslation();

  const dialogActions = (
    <div className="flex justify-end space-x-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => onOpenChange(false)}
        disabled={isLoading}
      >
        {t('common.cancel')}
      </Button>
      <Button
        type="button"
        variant="destructive"
        onClick={onConfirm}
        disabled={isLoading}
      >
        {isLoading ? t('common.deleting') : t('common.delete')}
      </Button>
    </div>
  );

  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('fuel.supplies.delete.title')}
      description={t('fuel.supplies.delete.description')}
      actions={dialogActions}
    >
      <div className="text-sm text-muted-foreground">
        {t('fuel.supplies.delete.confirmation')}
      </div>
    </StandardDialog>
  );
} 