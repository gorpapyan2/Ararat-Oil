import { DeleteConfirmDialog } from "@/core/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { apiNamespaces, getApiActionLabel } from "@/i18n/i18n";

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
  const { t } = useTranslation();

  // Get translated title and description using API helpers or fallback to direct translation
  const title =
    t("fillingSystems.deleteSystem") ||
    getApiActionLabel(apiNamespaces.fillingSystems, "delete");

  const description =
    t("fillingSystems.deleteConfirmationText", { systemName }) ||
    `Are you sure you want to delete the "${systemName}" filling system? This action cannot be undone.`;

  return (
    <DeleteConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title={title}
      description={description}
      isLoading={isLoading}
    />
  );
}
