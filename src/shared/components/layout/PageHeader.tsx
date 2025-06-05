import React from 'react';
import { cn } from '@/shared/utils';
import { SettingsDropdown } from '@/shared/components/navigation/SettingsDropdown';

// Simple breadcrumb component that doesn't depend on BreadcrumbProvider
function SimpleBreadcrumb() {
  // For now, we'll just show a simple title
  // In the future, this can be enhanced to show actual breadcrumbs
  return (
    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
      <span>Ararat Oil Management</span>
    </div>
  );
}

interface PageHeaderProps {
  className?: string;
  showBreadcrumbs?: boolean;
  showSettings?: boolean;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  className,
  showBreadcrumbs = true,
  showSettings = true,
  children,
}) => {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full',
        'bg-white/95 dark:bg-slate-900/95',
        'backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60',
        'border-b border-slate-200 dark:border-slate-800',
        'transition-colors duration-200',
        className
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Breadcrumbs and optional content */}
        <div className="flex items-center flex-1 min-w-0">
          {showBreadcrumbs && (
            <div className="flex-1 min-w-0">
              <SimpleBreadcrumb />
            </div>
          )}
          {children && (
            <div className="ml-4 flex items-center">
              {children}
            </div>
          )}
        </div>

        {/* Right side - Settings dropdown */}
        {showSettings && (
          <div className="flex items-center space-x-2 ml-4">
            <SettingsDropdown />
          </div>
        )}
      </div>
    </header>
  );
}; 