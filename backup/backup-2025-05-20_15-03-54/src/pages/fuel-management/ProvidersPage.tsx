import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from '@/core/components/ui/page-header';
import { IconBuildingFactory } from "@tabler/icons-react";
import { Home, Fuel, Building } from "lucide-react";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import { ProviderManagerStandardized } from "@/features/petrol-providers/components/ProviderManagerStandardized";
import { apiNamespaces, getApiActionLabel } from "@/i18n/i18n";

export default function ProvidersPage() {
  const { t } = useTranslation();
  const [action, setAction] = useState<React.ReactNode>(null);

  // Memoize breadcrumb segments to prevent unnecessary re-renders
  const breadcrumbSegments = useMemo(() => [
    { name: t("common.dashboard"), href: "/", icon: <Home className="h-4 w-4" /> },
    { name: t("common.fuelManagement"), href: "/fuel-management", icon: <Fuel className="h-4 w-4" /> },
    { 
      name: t("providers.title") || t("common.providers"), 
      href: "/fuel-management/providers", 
      isCurrent: true,
      icon: <Building className="h-4 w-4" /> 
    }
  ], [t]);

  // Configure breadcrumb navigation with icons
  usePageBreadcrumbs({
    segments: breadcrumbSegments,
    title: t("providers.title") || t("common.providers")
  });

  // Get translated page title and description using the API translation helpers
  const pageTitle = t("providers.title") || t("common.providers") || 
    getApiActionLabel(apiNamespaces.petrolProviders, 'list');
  const pageDescription = t("providers.description") || 
    "Manage your fuel suppliers and their information";

  return (
    <div className="space-y-6">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        icon={<IconBuildingFactory className="h-6 w-6 mr-2" />}
        actions={action}
      />
      
      <ProviderManagerStandardized onRenderAction={setAction} />
    </div>
  );
} 