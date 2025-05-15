import { useTranslation } from 'react-i18next';
import { StandardDialog } from '@/components/dialogs/StandardDialog';
import { Button } from '@/components/ui/button';
import type { PetrolProvider } from '../types/petrol-providers.types';

interface DeleteConfirmDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  provider: PetrolProvider;
  isLoading?: boolean;
}

export function DeleteConfirmDialogStandardized({
  open,
  onOpenChange,
  onConfirm,
  provider,
  isLoading,
}: DeleteConfirmDialogStandardizedProps) {
  const { t } = useTranslation();

  const dialogActions = (
    <>
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        {t('common.cancel')}
      </Button>
      <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
        {isLoading ? t('common.deleting') : t('common.delete')}
      </Button>
    </>
  );

  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('petrol-providers.delete_provider')}
      description={t('petrol-providers.delete_provider_confirmation', { name: provider.name })}
      actions={dialogActions}
    >
      <p className="text-sm text-muted-foreground">
        {t('petrol-providers.delete_provider_warning')}
      </p>
    </StandardDialog>
  );
} 