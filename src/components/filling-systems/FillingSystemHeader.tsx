import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FillingSystemHeaderProps {
  onAddNew: () => void;
}

export function FillingSystemHeader({ onAddNew }: FillingSystemHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">{t("fillingSystems.title")}</h1>
      <Button onClick={onAddNew}>
        <Plus className="w-4 h-4 mr-2" />
        {t("fillingSystems.addFillingSystem")}
      </Button>
    </div>
  );
}
