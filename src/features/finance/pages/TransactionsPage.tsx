import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { PageHeader } from "@/core/components/ui/page-header";
import { Home, DollarSign } from "lucide-react";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";
import { FinanceManagerStandardized } from "@/features/finance/components/FinanceManagerStandardized";
import { apiNamespaces, getApiActionLabel } from "@/i18n/i18n";

export function TransactionsPage() {
  const { t } = useTranslation();

  // Memoize breadcrumb segments to prevent unnecessary re-renders
  const breadcrumbSegments = useMemo(
    () => [
      {
        name: t("common.dashboard"),
        href: "/",
        icon: <Home className="h-4 w-4" />,
      },
      {
        name: t("transactions.title") || t("common.transactions"),
        href: "/finance/transactions",
        isCurrent: true,
        icon: <DollarSign className="h-4 w-4" />,
      },
    ],
    [t]
  );

  // Configure breadcrumb navigation with icons
  usePageBreadcrumbs({
    segments: breadcrumbSegments,
    title: t("transactions.title") || t("common.transactions"),
  });

  // Get translated page title and description using the API translation helpers
  const pageTitle =
    t("transactions.title") ||
    t("common.transactions") ||
    getApiActionLabel(apiNamespaces.transactions, "list");
  const pageDescription =
    t("transactions.description") ||
    "Manage financial transactions and records";

  return (
    <div className="space-y-6">
      <PageHeader
        title={pageTitle}
        description={pageDescription}
      />

      <FinanceManagerStandardized />
    </div>
  );
} 