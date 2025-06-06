import React from 'react';
import { cn } from '@/shared/utils';
import { Breadcrumb } from './Breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  breadcrumbItems?: BreadcrumbItem[];
  action?: React.ReactNode;
  className?: string;
  showBreadcrumbs?: boolean;
}

export function PageContainer({
  children,
  title,
  description,
  breadcrumbItems = [],
  action,
  className,
  showBreadcrumbs = true,
}: PageContainerProps) {
  return (
    <div className={cn("page-container", className)}>
      {/* Breadcrumbs */}
      {showBreadcrumbs && breadcrumbItems.length > 0 && (
        <Breadcrumb items={breadcrumbItems} />
      )}

      {/* Page Header */}
      <header className="page-header">
        <div className="page-header-content">
          <div className="page-title-section">
            <h1 className="page-title">{title}</h1>
            {description && (
              <p className="page-description">{description}</p>
            )}
          </div>
          
          {action && (
            <div className="page-actions">
              {action}
            </div>
          )}
        </div>
      </header>

      {/* Page Content */}
      <div className="page-content">
        {children}
      </div>
    </div>
  );
} 