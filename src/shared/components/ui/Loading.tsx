import React from 'react';
import { cn } from '@/shared/utils';
import { Loader2, Fuel, Zap, Activity } from 'lucide-react';

export type LoadingVariant = 'spinner' | 'dots' | 'pulse' | 'fuel' | 'energy';
export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl';

export interface LoadingProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeConfig = {
  sm: {
    spinner: 'h-4 w-4',
    dot: 'h-2 w-2',
    text: 'text-sm',
    gap: 'gap-2',
  },
  md: {
    spinner: 'h-6 w-6',
    dot: 'h-3 w-3',
    text: 'text-base',
    gap: 'gap-3',
  },
  lg: {
    spinner: 'h-8 w-8',
    dot: 'h-4 w-4',
    text: 'text-lg',
    gap: 'gap-4',
  },
  xl: {
    spinner: 'h-12 w-12',
    dot: 'h-6 w-6',
    text: 'text-xl',
    gap: 'gap-6',
  },
};

const SpinnerLoading: React.FC<{ size: LoadingSize }> = ({ size }) => {
  const config = sizeConfig[size];
  return (
    <Loader2 
      className={cn(
        'animate-spin text-primary',
        config.spinner
      )} 
    />
  );
};

const DotsLoading: React.FC<{ size: LoadingSize }> = ({ size }) => {
  const config = sizeConfig[size];
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-primary rounded-full',
            'animate-bounce',
            config.dot
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
};

const PulseLoading: React.FC<{ size: LoadingSize }> = ({ size }) => {
  const config = sizeConfig[size];
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-primary rounded-full animate-pulse',
            config.dot
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  );
};

const FuelLoadingIcon: React.FC<{ size: LoadingSize }> = ({ size }) => {
  const config = sizeConfig[size];
  return (
    <div className="relative">
      <Fuel 
        className={cn(
          'text-fuel-red animate-bounce',
          config.spinner
        )}
      />
      <div className="absolute inset-0 animate-ping">
        <Fuel 
          className={cn(
            'text-fuel-red opacity-30',
            config.spinner
          )}
        />
      </div>
    </div>
  );
};

const EnergyLoadingIcon: React.FC<{ size: LoadingSize }> = ({ size }) => {
  const config = sizeConfig[size];
  return (
    <div className="relative">
      <Zap 
        className={cn(
          'text-electric-blue animate-pulse',
          config.spinner
        )}
      />
      <Activity 
        className={cn(
          'text-energy-green animate-ping absolute inset-0 opacity-50',
          config.spinner
        )}
      />
    </div>
  );
};

const LoadingVariants = {
  spinner: SpinnerLoading,
  dots: DotsLoading,
  pulse: PulseLoading,
  fuel: FuelLoadingIcon,
  energy: EnergyLoadingIcon,
};

export const Loading: React.FC<LoadingProps> = ({
  variant = 'spinner',
  size = 'md',
  text,
  className,
  fullScreen = false,
}) => {
  const LoadingComponent = LoadingVariants[variant];
  const config = sizeConfig[size];

  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        config.gap,
        {
          'min-h-[200px]': !fullScreen,
        },
        className
      )}
    >
      <LoadingComponent size={size} />
      {text && (
        <div
          className={cn(
            'text-muted-foreground font-medium animate-fade-in',
            config.text
          )}
        >
          {text}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

// Skeleton Loading Components
export interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  width = 'w-full',
  height = 'h-4',
}) => {
  return (
    <div
      className={cn(
        'loading-shimmer rounded',
        width,
        height,
        className
      )}
    />
  );
};

// Card Skeleton
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-6 space-y-4',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton width="w-12" height="h-12" className="rounded-lg" />
        <Skeleton width="w-16" height="h-4" />
      </div>
      <div className="space-y-2">
        <Skeleton width="w-24" height="h-8" />
        <Skeleton width="w-32" height="h-4" />
      </div>
    </div>
  );
};

// Table Skeleton
export const TableSkeleton: React.FC<{ 
  rows?: number; 
  columns?: number; 
  className?: string;
}> = ({ 
  rows = 5, 
  columns = 4, 
  className 
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} width="flex-1" height="h-6" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} width="flex-1" height="h-8" />
          ))}
        </div>
      ))}
    </div>
  );
};

// List Skeleton
export const ListSkeleton: React.FC<{ 
  items?: number; 
  showAvatar?: boolean;
  className?: string;
}> = ({ 
  items = 5, 
  showAvatar = true,
  className 
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          {showAvatar && (
            <Skeleton width="w-10" height="h-10" className="rounded-full" />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton width="w-1/2" height="h-4" />
            <Skeleton width="w-3/4" height="h-3" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Predefined loading components for common use cases
export const FuelLoadingComponent: React.FC<Omit<LoadingProps, 'variant'>> = (props) => (
  <Loading variant="fuel" {...props} />
);

export const EnergyLoadingComponent: React.FC<Omit<LoadingProps, 'variant'>> = (props) => (
  <Loading variant="energy" {...props} />
);

export const DashboardLoading: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="space-y-2">
        <Skeleton width="w-64" height="h-8" />
        <Skeleton width="w-48" height="h-4" />
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardSkeleton className="h-64" />
        <CardSkeleton className="h-64" />
      </div>
    </div>
  );
}; 