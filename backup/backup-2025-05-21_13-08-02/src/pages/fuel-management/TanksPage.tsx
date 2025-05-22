import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TankManager } from "@/features/tanks/components/TankManager";
import { PageHeader } from '@/core/components/ui/page-header';
import { IconTank } from "@tabler/icons-react";
import { Home, Fuel, Container } from "lucide-react";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import { apiNamespaces, getApiActionLabel } from "@/i18n/i18n";

export default function TanksPage() {
  const { t } = useTranslation();
  const [action, setAction] = useState<React.ReactNode>(null);

  // Memoize breadcrumb segments to prevent unnecessary re-renders
  const breadcrumbSegments = useMemo(() => [
    { name: t("common.dashboard"), href: "/", icon: <Home className="h-4 w-4" /> },
    { name: t("common.fuelManagement"), href: "/fuel-management", icon: <Fuel className="h-4 w-4" /> },
    { 
      name: t("common.tanks"), 
      href: "/fuel-management/tanks", 
      isCurrent: true,
      icon: <Container className="h-4 w-4" /> 
    }
  ], [t]);

  // Configure breadcrumb navigation with icons
  usePageBreadcrumbs({
    segments: breadcrumbSegments,
    title: t("common.tanks")
  });

  // Get translated page title and description using the API translation helpers
  const pageTitle = t("common.tanks") || 
    getApiActionLabel(apiNamespaces.tanks, 'list');
  const pageDescription = t("tanks.description") || 
    "Manage your fuel storage tanks";

  return (
    <div className="space-y-6">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        icon={<IconTank className="h-6 w-6 mr-2" />}
        actions={action}
      />
      
      <TankManager onRenderAction={setAction} />
    </div>
  );
} 