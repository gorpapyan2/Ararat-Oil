import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { TankManager } from "@/features/tanks/components/TankManager";
import { PageHeader } from "@/core/components/ui/page-header";
import { usePageBreadcrumbs } from "@/shared/hooks/usePageBreadcrumbs";
import { apiNamespaces, getApiActionLabel } from "@/i18n/i18n";

export default function TanksPage() {
  const { t } = useTranslation();
  const [action, setAction] = useState<React.ReactNode>(null);

  // Configure breadcrumb segments
  const breadcrumbSegments = [
    { name: t("common.home"), href: "/" },
    { name: t("common.fuelManagement"), href: "/fuel-management" },
    { name: t("common.tanks"), href: "/fuel-management/tanks", isCurrent: true },
  ];

  // Configure breadcrumb navigation with icons
  usePageBreadcrumbs({ segments: breadcrumbSegments });

  // Get translated page title and description using the API translation helpers
  const pageTitle =
    t("common.tanks") || getApiActionLabel(apiNamespaces.tanks, "list");
  const pageDescription =
    t("tanks.description") || "Manage your fuel storage tanks";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader
          title={pageTitle}
          description={pageDescription}
          actions={action}
          className="text-white"
        />

        <TankManager onRenderAction={setAction} />
      </div>
    </div>
  );
}
