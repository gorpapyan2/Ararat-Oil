import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FillingSystemManagerStandardized } from "@/components/filling-systems/FillingSystemManagerStandardized";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { IconGasStation } from "@tabler/icons-react";

export default function FillingSystemsPage() {
  const { t } = useTranslation();
  const [action, setAction] = useState<React.ReactNode>(null);

  // Configure breadcrumb navigation
  const breadcrumbSegments = [
    { name: t("common.dashboard"), href: "/" },
    { name: t("common.fuelManagement"), href: "/fuel-management" },
    { name: t("common.fillingSystems"), href: "/fuel-management/filling-systems", isCurrent: true }
  ];
  
  // Set document title programmatically
  React.useEffect(() => {
    document.title = `${t("common.fillingSystems")} | Ararat Oil`;
  }, [t]);

  return (
    <div className="space-y-6">
      <Breadcrumb segments={breadcrumbSegments} className="mb-2" />
      
      <PageHeader
        title={t("common.fillingSystems")}
        description={t("fillingSystems.description") || "Manage your fuel dispensers and pumps"}
        icon={<IconGasStation className="h-6 w-6 mr-2" />}
        actions={action}
      />
      
      <FillingSystemManagerStandardized onRenderAction={setAction} />
    </div>
  );
} 