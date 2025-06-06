import React from 'react';
import { cn } from '@/shared/utils';

interface DashboardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 6;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
  minItemWidth?: string;
  autoFit?: boolean;
}

const gridColumns = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
};

const gapSizes = {
  sm: 'gap-3',
  md: 'gap-4 lg:gap-6',
  lg: 'gap-6 lg:gap-8',
};

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  children,
  columns = 3,
  gap = 'md',
  className,
  minItemWidth = '280px',
  autoFit = false,
}) => {
  const gridStyle = autoFit 
    ? { gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))` }
    : undefined;

  return (
    <div 
      className={cn(
        'grid w-full',
        !autoFit && gridColumns[columns],
        gapSizes[gap],
        'animate-fade-in',
        className
      )}
      style={gridStyle}
    >
      {children}
    </div>
  );
};

// Quick Stats Grid Component
interface QuickStatsGridProps {
  children: React.ReactNode;
  className?: string;
}

export const QuickStatsGrid: React.FC<QuickStatsGridProps> = ({
  children,
  className,
}) => (
  <DashboardGrid
    columns={4}
    gap="md"
    autoFit
    minItemWidth="240px"
    className={cn('mb-8', className)}
  >
    {children}
  </DashboardGrid>
);

// Main Dashboard Grid Component
interface MainDashboardGridProps {
  children: React.ReactNode;
  className?: string;
}

export const MainDashboardGrid: React.FC<MainDashboardGridProps> = ({
  children,
  className,
}) => (
  <DashboardGrid
    columns={3}
    gap="lg"
    autoFit
    minItemWidth="320px"
    className={className}
  >
    {children}
  </DashboardGrid>
);

// Responsive Card Container
interface CardContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const CardContainer: React.FC<CardContainerProps> = ({
  children,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn('space-y-6', className)}>
      {(title || description || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            {title && (
              <h2 className="text-xl font-semibold text-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default DashboardGrid; 