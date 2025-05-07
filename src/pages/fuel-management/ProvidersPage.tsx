import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/components/ui/page-header";
import { IconBuildingFactory } from "@tabler/icons-react";
import { Home, Fuel, Building } from "lucide-react";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import { ProviderManagerStandardized } from "@/components/petrol-providers/ProviderManagerStandardized";

export default function ProvidersPage() {
  const { t } = useTranslation();
  const [action, setAction] = useState<React.ReactNode>(null);

  // Memoize breadcrumb segments to prevent unnecessary re-renders
  const breadcrumbSegments = useMemo(() => [
    { name: t("common.dashboard"), href: "/", icon: <Home className="h-4 w-4" /> },
    { name: t("common.fuelManagement"), href: "/fuel-management", icon: <Fuel className="h-4 w-4" /> },
    { 
      name: t("common.providers"), 
      href: "/fuel-management/providers", 
      isCurrent: true,
      icon: <Building className="h-4 w-4" /> 
    }
  ], [t]);

  // Configure breadcrumb navigation with icons
  usePageBreadcrumbs({
    segments: breadcrumbSegments,
    title: t("common.providers")
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("common.providers")}
        description={t("providers.description") || "Manage your fuel suppliers"}
        icon={<IconBuildingFactory className="h-6 w-6 mr-2" />}
        actions={action}
      />
      
      <ProviderManagerStandardized onRenderAction={setAction} />
    </div>
  );
} 