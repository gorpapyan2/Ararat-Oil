import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/core/components/ui/page-header';
import { usePageBreadcrumbs } from '@/shared/hooks/usePageBreadcrumbs';
import { FuelSalesManagerStandardized } from '@/features/fuel-sales/components/FuelSalesManagerStandardized';
import { Home, Fuel, TrendingUp } from 'lucide-react';

const FuelSalesPage: React.FC = () => {
  const { t } = useTranslation();

  // Configure breadcrumb segments
  const breadcrumbSegments = [
    { name: t("common.home"), href: "/" },
    { name: t("common.fuelManagement"), href: "/fuel-management" },
    { name: t("common.fuelSales"), href: "/fuel-management/sales", isCurrent: true },
  ];

  // Configure breadcrumb navigation with icons
  usePageBreadcrumbs({ segments: breadcrumbSegments });

  const pageTitle = t("common.fuelSales");
  const pageDescription = t("common.fuelSalesDescription");

  const handleRenderAction = () => {
    // Implementation of handleRenderAction
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="container mx-auto p-6 space-y-6">
        <PageHeader
          title={pageTitle}
          description={pageDescription}
          className="text-white"
        />

        <FuelSalesManagerStandardized onRenderAction={handleRenderAction} />
      </div>
    </div>
  );
};

export default FuelSalesPage; 