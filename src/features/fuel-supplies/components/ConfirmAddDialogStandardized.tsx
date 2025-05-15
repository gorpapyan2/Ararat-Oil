import { StandardDialog } from "@/components/ui/composed/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface ConfirmAddDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  data?: {
    quantity: number;
    price: number;
    totalCost: number;
    tankName?: string;
    tankCapacity?: number;
    tankLevel?: number;
  };
}

export function ConfirmAddDialogStandardized({
  open,
  onOpenChange,
  onConfirm,
  data,
}: ConfirmAddDialogStandardizedProps) {
  const { t } = useTranslation();

  const dialogActions = (
    <div className="flex justify-end space-x-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => onOpenChange(false)}
      >
        {t('common.cancel')}
      </Button>
      <Button
        type="button"
        onClick={onConfirm}
      >
        {t('common.confirm')}
      </Button>
    </div>
  );

  const newTankLevel = data?.tankLevel && data?.quantity
    ? data.tankLevel + data.quantity
    : undefined;

  const isOverCapacity = newTankLevel && data?.tankCapacity
    ? newTankLevel > data.tankCapacity
    : false;

  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('fuel.supplies.confirm.title')}
      description={t('fuel.supplies.confirm.description')}
      actions={dialogActions}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">{t('fuel.supplies.quantity')}</p>
            <p className="text-sm text-muted-foreground">{data?.quantity}L</p>
          </div>
          <div>
            <p className="text-sm font-medium">{t('fuel.supplies.price')}</p>
            <p className="text-sm text-muted-foreground">${data?.price.toFixed(2)}/L</p>
          </div>
          <div>
            <p className="text-sm font-medium">{t('fuel.supplies.total')}</p>
            <p className="text-sm text-muted-foreground">${data?.totalCost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">{t('fuel.supplies.tank')}</p>
            <p className="text-sm text-muted-foreground">{data?.tankName}</p>
          </div>
        </div>

        {data?.tankLevel !== undefined && (
          <div className="space-y-2">
            <p className="text-sm font-medium">{t('fuel.supplies.tankLevel')}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('fuel.supplies.currentLevel')}: {data.tankLevel}L
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('fuel.supplies.newLevel')}: {newTankLevel}L
                </p>
              </div>
            </div>
            {isOverCapacity && (
              <p className="text-sm text-destructive">
                {t('fuel.supplies.overCapacity')}
              </p>
            )}
          </div>
        )}
      </div>
    </StandardDialog>
  );
} 