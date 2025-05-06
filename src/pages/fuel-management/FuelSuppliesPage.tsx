import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FuelSuppliesManagerStandardized } from "@/components/fuel-supplies/FuelSuppliesManagerStandardized";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { IconTruck } from "@tabler/icons-react";

export default function FuelSuppliesPage() {
  const { t } = useTranslation();
  const [action, setAction] = useState<React.ReactNode>(null);

  // Configure breadcrumb navigation
  const breadcrumbSegments = [
    { name: t("common.dashboard"), href: "/" },
    { name: t("common.fuelManagement"), href: "/fuel-management" },
    { name: t("common.fuelSupplies"), href: "/fuel-management/fuel-supplies", isCurrent: true }
  ];
  
  // Set document title programmatically
  React.useEffect(() => {
    document.title = `${t("common.fuelSupplies")} | Ararat Oil`;
  }, [t]);

  return (
    <div className="space-y-6">
      <Breadcrumb segments={breadcrumbSegments} className="mb-2" />
      
      <PageHeader
        title={t("common.fuelSupplies")}
        description={t("fuelSupplies.description") || "Track your fuel supply deliveries"}
        icon={<IconTruck className="h-6 w-6 mr-2" />}
        actions={action}
      />
      
      <FuelSuppliesManagerStandardized onRenderAction={setAction} />
    </div>
  );
} 