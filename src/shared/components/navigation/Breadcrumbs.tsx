import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/shared/utils';

interface BreadcrumbItem {
  key: string;
  path?: string;
  isActive?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  items: customItems, 
  className 
}) => {
  const { t } = useTranslation();
  const location = useLocation();

  // Generate breadcrumbs automatically from path if no custom items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { key: 'navigation.dashboard', path: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      // Map route segments to translation keys
      const segmentKey = getSegmentTranslationKey(segment);
      
      breadcrumbs.push({
        key: segmentKey,
        path: isLast ? undefined : currentPath,
        isActive: isLast
      });
    });

    return breadcrumbs;
  };

  const getSegmentTranslationKey = (segment: string): string => {
    const segmentMap: Record<string, string> = {
      // Management
      'management': 'navigation.management',
      'employees': 'modules.humanResources.employees',
      'shifts': 'modules.humanResources.shifts',
      
      // Finance
      'finance': 'navigation.finance',
      'sales': 'modules.finance.sales',
      'revenue': 'modules.finance.revenue',
      'expenses': 'modules.finance.expenses',
      'payment-methods': 'modules.finance.paymentMethods',
      
      // Fuel Management
      'fuel': 'navigation.fuel',
      'fuel-management': 'modules.fuel.title',
      'tanks': 'modules.fuel.tanks',
      'supplies': 'modules.fuel.supplies',
      'prices': 'modules.fuel.prices',
      'types': 'modules.fuel.types',
      'filling-systems': 'modules.fuel.fillingSystems',
      'providers': 'modules.fuel.providers',
      
      // Reports
      'reports': 'navigation.reports',
      'analytics': 'modules.reports.analytics',
      
      // Settings
      'settings': 'navigation.settings',
      
      // Auth
      'auth': 'common.login'
    };

    return segmentMap[segment] || segment;
  };

  const items = customItems || generateBreadcrumbs();

  if (items.length <= 1) {
    return null;
  }

  return (
    <nav 
      aria-label={t('common.breadcrumbs', 'Breadcrumbs')}
      className={cn('flex items-center space-x-1', className)}
    >
      <ol className="flex items-center space-x-1 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={`${item.key}-${index}`} className="flex items-center">
            {index > 0 && (
              <ChevronRight 
                className="h-4 w-4 mx-1 text-muted-foreground/60" 
                aria-hidden="true"
              />
            )}
            
            {index === 0 && (
              <Home 
                className="h-4 w-4 mr-2 text-muted-foreground/80" 
                aria-hidden="true"
              />
            )}
            
            {item.path && !item.isActive ? (
              <Link
                to={item.path}
                className={cn(
                  'inline-flex items-center font-medium transition-colors duration-200',
                  'hover:text-foreground focus:text-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2',
                  'rounded-sm px-1 py-0.5',
                  index === 0 && 'text-primary hover:text-primary/80'
                )}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {t(item.key)}
              </Link>
            ) : (
              <span 
                className={cn(
                  'inline-flex items-center font-medium px-1 py-0.5',
                  item.isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {t(item.key)}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Helper component for custom breadcrumb usage
export const BreadcrumbItem: React.FC<{
  children: React.ReactNode;
  href?: string;
  isActive?: boolean;
  className?: string;
}> = ({ children, href, isActive, className }) => {
  const baseClasses = cn(
    'inline-flex items-center font-medium transition-colors duration-200',
    'rounded-sm px-1 py-0.5',
    className
  );

  if (href && !isActive) {
    return (
      <Link
        to={href}
        className={cn(
          baseClasses,
          'text-muted-foreground hover:text-foreground focus:text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2'
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <span 
      className={cn(
        baseClasses,
        isActive ? 'text-foreground' : 'text-muted-foreground'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </span>
  );
};

export default Breadcrumbs; 