import { useTranslation } from 'react-i18next';
import { StandardDialog } from '@/shared/components/common/dialog/StandardDialog';
import { Button } from '@/components/ui/button';
import type { Employee } from '../types/employees.types';

interface DeleteConfirmDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  employee: Employee;
  isLoading?: boolean;
}

export function DeleteConfirmDialogStandardized({
  open,
  onOpenChange,
  onConfirm,
  employee,
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
      title={t('employees.delete_employee')}
      description={t('employees.delete_employee_confirmation', {
        name: `${employee.first_name} ${employee.last_name}`,
      })}
      actions={dialogActions}
    >
      <p className="text-sm text-muted-foreground">
        {t('employees.delete_employee_warning')}
      </p>
    </StandardDialog>
  );
} 