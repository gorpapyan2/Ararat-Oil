import React from 'react';
import { cn } from '@/shared/utils';
import { PageHeader } from '@/shared/components/layout/PageHeader';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  showHeader?: boolean;
  showBreadcrumbs?: boolean;
  showSettings?: boolean;
  headerContent?: React.ReactNode;
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl', 
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-[1200px]',
  full: 'max-w-full'
};

export const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className,
  maxWidth = '2xl',
  showHeader = true,
  showBreadcrumbs = true,
  showSettings = true,
  headerContent
}) => {
  return (
    <div className={cn(
      'w-full min-h-screen',
      'bg-background text-foreground',
      'transition-colors duration-200',
      className
    )}>
      {/* Page Header with Breadcrumbs and Settings */}
      {showHeader && (
        <PageHeader 
          showBreadcrumbs={showBreadcrumbs}
          showSettings={showSettings}
        >
          {headerContent}
        </PageHeader>
      )}
      
      {/* Main Content */}
      <div className={cn(
        'mx-auto py-8 px-4 sm:px-6 lg:px-8',
        maxWidthClasses[maxWidth]
      )}>
        {children}
      </div>
    </div>
  );
}; 