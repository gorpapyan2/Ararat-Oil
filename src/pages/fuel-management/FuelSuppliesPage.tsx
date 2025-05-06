import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FuelSuppliesManagerStandardized } from "@/components/fuel-supplies/FuelSuppliesManagerStandardized";
import { PageHeader } from "@/components/ui/page-header";
import { IconTruck } from "@tabler/icons-react";
import { Home, Fuel, Truck } from "lucide-react";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";

export default function FuelSuppliesPage() {
  const { t } = useTranslation();
  const [action, setAction] = useState<React.ReactNode>(null);

  // Configure breadcrumb navigation with icons
  usePageBreadcrumbs({
    segments: [
      { name: t("common.dashboard"), href: "/", icon: <Home className="h-4 w-4" /> },
      { name: t("common.fuelManagement"), href: "/fuel-management", icon: <Fuel className="h-4 w-4" /> },
      { 
        name: t("common.fuelSupplies"), 
        href: "/fuel-management/fuel-supplies", 
        isCurrent: true,
        icon: <Truck className="h-4 w-4" /> 
      }
    ],
    title: t("common.fuelSupplies")
  });

  return (
    <div className="space-y-6">
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