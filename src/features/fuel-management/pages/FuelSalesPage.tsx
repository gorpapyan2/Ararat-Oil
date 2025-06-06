import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePageBreadcrumbs } from '@/shared/hooks/usePageBreadcrumbs';
import { Fuel, BarChart3 } from 'lucide-react';
import { NavigationCard } from '@/shared/components/navigation/NavigationCard';
import { Breadcrumb } from '@/shared/components/layout/Breadcrumb';

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

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Fuel Operations', href: '/fuel' },
    { label: 'Sales', href: '/fuel/sales' }
  ];

  const salesModules = [
    {
      id: 'sales-overview',
      title: 'Sales Overview',
      description: 'Comprehensive sales analytics and performance monitoring',
      path: '/fuel/sales/overview',
      color: 'green',
      icon: BarChart3
    }
  ];

  return (
    <div className="subnav-container">
      <div className="subnav-card-window">
        {/* Header with Breadcrumb */}
        <div className="subnav-header">
          <div className="subnav-header-content">
            <div className="subnav-breadcrumb">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="subnav-body">
          <div className="subnav-content">
            {/* Page Title Section */}
            <div className="page-title-section">
              <h1 className="page-title">
                Fuel Sales Management
              </h1>
              <p className="page-description">
                Comprehensive sales analytics, transaction tracking, and revenue optimization tools.
              </p>
            </div>

            {/* Module Cards */}
            <div className="management-cards">
              {salesModules.map((module) => (
                <NavigationCard
                  key={module.id}
                  title={module.title}
                  description={module.description}
                  href={module.path}
                  color={module.color}
                  icon={module.icon}
                  variant="management"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelSalesPage; 