import React from 'react';
import { cn } from '@/shared/utils';
import { SettingsDropdown } from '@/shared/components/navigation/SettingsDropdown';
import { ThemeToggle } from '@/shared/components/ui/theme-toggle';

// Simple breadcrumb component that doesn't depend on BreadcrumbProvider
function SimpleBreadcrumb() {
  // For now, we'll just show a simple title
  // In the future, this can be enhanced to show actual breadcrumbs
  return (
    <div className="flex items-center text-sm text-foreground/60">
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
        'bg-background/95 dark:bg-background/95',
        'backdrop-blur-md supports-[backdrop-filter]:bg-background/80',
        'border-b border-border',
        'transition-all duration-300',
        // Natural color enhancements
        'shadow-sm shadow-shadow/5',
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

        {/* Right side - Theme toggle and Settings dropdown */}
        {showSettings && (
          <div className="flex items-center space-x-1 ml-4">
            {/* Theme Toggle */}
            <ThemeToggle 
              variant="button" 
              size="default"
              className="mr-2"
            />
            
            {/* Settings Dropdown */}
            <SettingsDropdown />
          </div>
        )}
      </div>
    </header>
  );
}; 