import { DeleteConfirmDialog } from "@/components/ui/composed/dialog";
import { useTranslation } from "react-i18next";

interface DeleteConfirmDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  providerName?: string;
}

export function DeleteConfirmDialogStandardized({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  providerName,
}: DeleteConfirmDialogStandardizedProps) {
  const { t } = useTranslation();

  return (
    <DeleteConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title={t("petrolProviders.deleteConfirmTitle")}
      description={
        providerName
          ? `${t("petrolProviders.deleteConfirmDescription")} (${providerName})`
          : t("petrolProviders.deleteConfirmDescription")
      }
      isLoading={isLoading}
      deleteText={t("common.delete")}
      cancelText={t("common.cancel")}
    />
  );
} 