import React from "react";
import { useTranslation } from "react-i18next";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import { Separator } from "@/core/components/ui/separator";
import { Breadcrumbs } from "@/shared/components/navigation/Breadcrumbs";

interface PageLayoutProps {
  children: React.ReactNode;
  titleKey: string;
  descriptionKey?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
  showBreadcrumbs?: boolean;
  breadcrumbItems?: Array<{
    key: string;
    path?: string;
    isActive?: boolean;
  }>;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  titleKey,
  descriptionKey,
  icon: Icon,
  action,
  className,
  showBreadcrumbs = true,
  breadcrumbItems,
}) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {/* Page Header Container */}
      <div className="page-header-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumbs */}
          {showBreadcrumbs && (
            <div className="mb-4">
              <Breadcrumbs 
                items={breadcrumbItems}
                className="animate-fade-in"
              />
            </div>
          )}
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              {Icon && (
                <div className={cn(
                  'flex-shrink-0 p-2 rounded-lg',
                  'bg-gradient-to-br from-primary/10 to-primary/5',
                  'border border-primary/20',
                  'animate-scale-in'
                )}>
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              )}
              
              <div className="space-y-1">
                <h1 className={cn(
                  'font-bold text-foreground animate-slide-up',
                  isMobile ? 'text-2xl' : 'text-3xl'
                )}>
                  {t(titleKey)}
                </h1>
                
                {descriptionKey && (
                  <p className="text-muted-foreground text-sm sm:text-base max-w-2xl animate-slide-up animation-delay-100">
                    {t(descriptionKey)}
                  </p>
                )}
              </div>
            </div>
            
            {action && (
              <div className="flex-shrink-0 animate-slide-up animation-delay-200">
                {action}
              </div>
            )}
          </div>
        </div>
        
        <Separator />
      </div>
      
      {/* Main Content */}
      <main className="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageLayout;
