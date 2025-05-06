import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TankManagerStandardized } from "@/components/tanks/TankManagerStandardized";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { IconTank } from "@tabler/icons-react";

export default function TanksPage() {
  const { t } = useTranslation();
  const [action, setAction] = useState<React.ReactNode>(null);

  // Configure breadcrumb navigation
  const breadcrumbSegments = [
    { name: t("common.dashboard"), href: "/" },
    { name: t("common.fuelManagement"), href: "/fuel-management" },
    { name: t("common.tanks"), href: "/fuel-management/tanks", isCurrent: true }
  ];
  
  // Set document title programmatically
  React.useEffect(() => {
    document.title = `${t("common.tanks")} | Ararat Oil`;
  }, [t]);

  return (
    <div className="space-y-6">
      <Breadcrumb segments={breadcrumbSegments} className="mb-2" />
      
      <PageHeader
        title={t("common.tanks")}
        description={t("tanks.description") || "Manage your fuel storage tanks"}
        icon={<IconTank className="h-6 w-6 mr-2" />}
        actions={action}
      />
      
      <TankManagerStandardized onRenderAction={setAction} />
    </div>
  );
} 