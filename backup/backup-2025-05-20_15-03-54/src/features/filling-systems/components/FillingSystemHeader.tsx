import { Button } from '@/core/components/ui/button';
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { apiNamespaces, getApiActionLabel } from "@/i18n/i18n";

interface FillingSystemHeaderProps {
  onAddNew: () => void;
  showAddButton?: boolean;
}

export function FillingSystemHeader({ onAddNew, showAddButton = true }: FillingSystemHeaderProps) {
  const { t } = useTranslation();

  // Get translated title using API helpers or fallback to direct translation
  const title = t("fillingSystems.title") || getApiActionLabel(apiNamespaces.fillingSystems, 'list');
  const addButtonText = t("fillingSystems.addFillingSystem") || getApiActionLabel(apiNamespaces.fillingSystems, 'create');

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">{title}</h1>
      {showAddButton && (
        <Button onClick={onAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          {addButtonText}
        </Button>
      )}
    </div>
  );
} 