import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/core/components/ui/page-header";
import { Home, Fuel, Settings } from "lucide-react";
import { usePageBreadcrumbs } from "@/shared/hooks/usePageBreadcrumbs";
import { apiNamespaces, getApiActionLabel } from "@/i18n/i18n";
import { FillingSystemManagerStandardized } from "@/features/filling-systems";

export default function FillingSystemsPage() {
  const { t } = useTranslation();
  const [action, setAction] = useState<React.ReactNode>(null);

  // Memoize breadcrumb segments to prevent unnecessary re-renders
  const breadcrumbSegments = useMemo(
    () => [
      {
        name: t("common.dashboard"),
        href: "/",
        icon: <Home className="h-4 w-4" />,
      },
      {
        name: t("common.fuelManagement"),
        href: "/fuel-management",
        icon: <Fuel className="h-4 w-4" />,
      },
      {
        name: t("common.fillingSystems"),
        href: "/fuel-management/filling-systems",
        isCurrent: true,
        icon: <Settings className="h-4 w-4" />,
      },
    ],
    [t]
  );

  // Configure breadcrumb navigation with icons
  usePageBreadcrumbs({
    segments: breadcrumbSegments,
    title: t("common.fillingSystems"),
  });

  // Memoize the action setter to prevent unnecessary re-renders
  const handleRenderAction = useMemo(
    () => (actionNode: React.ReactNode) => {
      setAction(actionNode);
    },
    []
  );

  // Get translated page title and description using the API translation helpers
  const pageTitle =
    t("common.fillingSystems") ||
    getApiActionLabel(apiNamespaces.fillingSystems, "list");
  const pageDescription =
    t("fillingSystems.description") || "Manage your fuel dispensers and pumps";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader
          title={pageTitle}
          description={pageDescription}
          actions={action}
          className="text-white"
        />

        <FillingSystemManagerStandardized onRenderAction={handleRenderAction} />
      </div>
    </div>
  );
}
