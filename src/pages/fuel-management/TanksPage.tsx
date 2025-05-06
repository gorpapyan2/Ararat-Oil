import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TankManagerStandardized } from "@/components/tanks/TankManagerStandardized";
import { PageHeader } from "@/components/ui/page-header";
import { IconTank } from "@tabler/icons-react";
import { Home, Fuel, Container } from "lucide-react";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";

export default function TanksPage() {
  const { t } = useTranslation();
  const [action, setAction] = useState<React.ReactNode>(null);

  // Configure breadcrumb navigation with icons
  usePageBreadcrumbs({
    segments: [
      { name: t("common.dashboard"), href: "/", icon: <Home className="h-4 w-4" /> },
      { name: t("common.fuelManagement"), href: "/fuel-management", icon: <Fuel className="h-4 w-4" /> },
      { 
        name: t("common.tanks"), 
        href: "/fuel-management/tanks", 
        isCurrent: true,
        icon: <Container className="h-4 w-4" /> 
      }
    ],
    title: t("common.tanks")
  });

  return (
    <div className="space-y-6">
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