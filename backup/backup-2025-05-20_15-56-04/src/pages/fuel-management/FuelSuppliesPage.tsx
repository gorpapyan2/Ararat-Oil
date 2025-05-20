import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FuelSuppliesManagerStandardized } from "@/features/fuel-supplies";
import { PageHeader } from '@/core/components/ui/page-header';
import { IconTruck } from "@tabler/icons-react";
import { Home, Fuel, Truck } from "lucide-react";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import { apiNamespaces, getApiActionLabel } from "@/i18n/i18n";

export default function FuelSuppliesPage() {
  const { t } = useTranslation();
  const [action, setAction] = useState<React.ReactNode>(null);

  // Memoize breadcrumb segments to prevent unnecessary re-renders
  const breadcrumbSegments = useMemo(() => [
    { name: t("common.dashboard"), href: "/", icon: <Home className="h-4 w-4" /> },
    { name: t("common.fuelManagement"), href: "/fuel-management", icon: <Fuel className="h-4 w-4" /> },
    { 
      name: t("common.fuelSupplies"), 
      href: "/fuel-management/fuel-supplies", 
      isCurrent: true,
      icon: <Truck className="h-4 w-4" /> 
    }
  ], [t]);

  // Configure breadcrumb navigation with icons
  usePageBreadcrumbs({
    segments: breadcrumbSegments,
    title: t("common.fuelSupplies")
  });

  // Memoize the action setter to prevent unnecessary re-renders
  const handleRenderAction = useCallback((actionNode: React.ReactNode) => {
    setAction(actionNode);
  }, []);

  // Use the API translation helpers to get translated content
  const pageTitle = t("common.fuelSupplies");
  const pageDescription = t("fuelSupplies.description") || 
    getApiActionLabel(apiNamespaces.fuelSupplies, "list");

  return (
    <div className="space-y-6">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
        icon={<IconTruck className="h-6 w-6 mr-2" />}
        actions={action}
      />
      
      <FuelSuppliesManagerStandardized onRenderAction={handleRenderAction} />
    </div>
  );
} 