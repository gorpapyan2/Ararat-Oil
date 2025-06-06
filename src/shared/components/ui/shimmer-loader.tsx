import React from 'react';
import { cn } from '../../../utils/cn';

export interface ShimmerLoaderProps {
  /** Variant of shimmer animation */
  variant?: 'default' | 'pulse' | 'wave';
  /** Type of shimmer element */
  type?: 'card' | 'text' | 'title' | 'subtitle' | 'avatar' | 'button' | 'icon' | 'input' | 'textarea' | 'container';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Custom width */
  width?: string | number;
  /** Custom height */
  height?: string | number;
  /** Animation speed */
  speed?: 'fast' | 'normal' | 'slow';
  /** Animation delay */
  delay?: number;
  /** Custom className */
  className?: string;
  /** Number of items for repeated elements */
  count?: number;
  /** Custom children to render instead of shimmer */
  children?: React.ReactNode;
}

const ShimmerLoader: React.FC<ShimmerLoaderProps> = ({
  variant = 'default',
  type = 'card',
  size = 'md',
  width,
  height,
  speed = 'normal',
  delay = 0,
  className,
  count = 1,
  children,
}) => {
  // Base shimmer classes
  const baseClasses = {
    default: 'shimmer',
    pulse: 'shimmer-pulse',
    wave: 'shimmer-wave',
  };

  // Type-specific classes
  const typeClasses = {
    card: {
      sm: 'shimmer-card-sm',
      md: 'shimmer-card',
      lg: 'shimmer-card-lg',
      xl: 'shimmer-card-lg',
    },
    text: {
      sm: 'shimmer-text-sm',
      md: 'shimmer-text',
      lg: 'shimmer-text-lg',
      xl: 'shimmer-text-lg',
    },
    title: {
      sm: 'shimmer-subtitle',
      md: 'shimmer-title',
      lg: 'shimmer-title',
      xl: 'shimmer-title',
    },
    subtitle: {
      sm: 'shimmer-subtitle',
      md: 'shimmer-subtitle',
      lg: 'shimmer-subtitle',
      xl: 'shimmer-subtitle',
    },
    avatar: {
      sm: 'shimmer-avatar-sm',
      md: 'shimmer-avatar',
      lg: 'shimmer-avatar-lg',
      xl: 'shimmer-avatar-lg',
    },
    button: {
      sm: 'shimmer-button-sm',
      md: 'shimmer-button',
      lg: 'shimmer-button-lg',
      xl: 'shimmer-button-lg',
    },
    icon: {
      sm: 'shimmer-icon-sm',
      md: 'shimmer-icon',
      lg: 'shimmer-icon-lg',
      xl: 'shimmer-icon-lg',
    },
    input: {
      sm: 'shimmer-input',
      md: 'shimmer-input',
      lg: 'shimmer-input',
      xl: 'shimmer-input',
    },
    textarea: {
      sm: 'shimmer-textarea',
      md: 'shimmer-textarea',
      lg: 'shimmer-textarea',
      xl: 'shimmer-textarea',
    },
    container: {
      sm: 'shimmer-container',
      md: 'shimmer-container',
      lg: 'shimmer-container',
      xl: 'shimmer-container',
    },
  };

  // Speed classes
  const speedClasses = {
    fast: 'shimmer-fast',
    normal: '',
    slow: 'shimmer-slow',
  };

  // Delay classes
  const delayClasses = {
    100: 'shimmer-delay-100',
    200: 'shimmer-delay-200',
    300: 'shimmer-delay-300',
    400: 'shimmer-delay-400',
    500: 'shimmer-delay-500',
  };

  const getDelayClass = (delay: number): string => {
    if (delay <= 100) return delayClasses[100];
    if (delay <= 200) return delayClasses[200];
    if (delay <= 300) return delayClasses[300];
    if (delay <= 400) return delayClasses[400];
    return delayClasses[500];
  };

  const shimmerClasses = cn(
    baseClasses[variant],
    typeClasses[type]?.[size] || typeClasses.card[size],
    speedClasses[speed],
    delay > 0 && getDelayClass(delay),
    className
  );

  const style: React.CSSProperties = {
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
  };

  if (children) {
    return (
      <div className={cn('loading', className)} style={style}>
        {children}
      </div>
    );
  }

  if (count === 1) {
    return <div className={shimmerClasses} style={style} />;
  }

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={cn(
            shimmerClasses,
            index > 0 && `shimmer-delay-${Math.min(500, (index * 100))}`
          )}
          style={style}
        />
      ))}
    </>
  );
};

// Specialized components for common use cases
export const ShimmerCard: React.FC<Omit<ShimmerLoaderProps, 'type'>> = (props) => (
  <ShimmerLoader {...props} type="card" />
);

export const ShimmerText: React.FC<Omit<ShimmerLoaderProps, 'type'>> = (props) => (
  <ShimmerLoader {...props} type="text" />
);

export const ShimmerTitle: React.FC<Omit<ShimmerLoaderProps, 'type'>> = (props) => (
  <ShimmerLoader {...props} type="title" />
);

export const ShimmerAvatar: React.FC<Omit<ShimmerLoaderProps, 'type'>> = (props) => (
  <ShimmerLoader {...props} type="avatar" />
);

export const ShimmerButton: React.FC<Omit<ShimmerLoaderProps, 'type'>> = (props) => (
  <ShimmerLoader {...props} type="button" />
);

export const ShimmerIcon: React.FC<Omit<ShimmerLoaderProps, 'type'>> = (props) => (
  <ShimmerLoader {...props} type="icon" />
);

// Navigation-specific shimmer components for fuel management
export const ShimmerNavCard: React.FC<{
  className?: string;
  count?: number;
  variant?: 'default' | 'pulse' | 'wave';
}> = ({ className, count = 1, variant = 'wave' }) => (
  <div className={cn('shimmer-nav-grid', className)}>
    {Array.from({ length: count }, (_, index) => (
      <div
        key={index}
        className={cn(
          'shimmer-nav-card',
          variant !== 'default' && `shimmer-${variant}`,
          index > 0 && `shimmer-delay-${Math.min(500, (index * 100))}`
        )}
      />
    ))}
  </div>
);

// Grid layout shimmer
export const ShimmerGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
  columns?: number;
}> = ({ children, className, columns }) => (
  <div
    className={cn('shimmer-grid', className)}
    style={{
      ...(columns && {
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }),
    }}
  >
    {children}
  </div>
);

// List layout shimmer for fuel operations
export const ShimmerList: React.FC<{
  count: number;
  className?: string;
  itemClassName?: string;
  variant?: 'default' | 'pulse' | 'wave';
}> = ({ count, className, itemClassName, variant = 'default' }) => (
  <div className={cn('shimmer-list', className)}>
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className={cn('shimmer-list-item', itemClassName)}>
        <ShimmerAvatar size="sm" variant={variant} delay={index * 50} />
        <div className="flex-1 space-y-2">
          <ShimmerText width="60%" variant={variant} delay={index * 50 + 25} />
          <ShimmerText width="40%" size="sm" variant={variant} delay={index * 50 + 50} />
        </div>
      </div>
    ))}
  </div>
);

// Table shimmer for reports and analytics
export const ShimmerTable: React.FC<{
  rows: number;
  columns: number;
  className?: string;
  variant?: 'default' | 'pulse' | 'wave';
}> = ({ rows, columns, className, variant = 'default' }) => (
  <div className={cn('w-full', className)}>
    {/* Header */}
    <div className="shimmer-table-row">
      {Array.from({ length: columns }, (_, index) => (
        <ShimmerLoader
          key={`header-${index}`}
          type="text"
          height="2.5rem"
          variant={variant}
          delay={index * 25}
        />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="shimmer-table-row">
        {Array.from({ length: columns }, (_, colIndex) => (
          <ShimmerLoader
            key={`cell-${rowIndex}-${colIndex}`}
            type="text"
            height="1.25rem"
            variant={variant}
            delay={rowIndex * 50 + colIndex * 25}
          />
        ))}
      </div>
    ))}
  </div>
);

// Form shimmer for configuration and settings
export const ShimmerForm: React.FC<{
  fields: number;
  className?: string;
  variant?: 'default' | 'pulse' | 'wave';
}> = ({ fields, className, variant = 'default' }) => (
  <div className={cn('shimmer-form', className)}>
    {Array.from({ length: fields }, (_, index) => (
      <div key={index} className="space-y-2">
        <ShimmerText width="30%" variant={variant} delay={index * 50} />
        <ShimmerLoader
          type="input"
          variant={variant}
          delay={index * 50 + 25}
        />
      </div>
    ))}
  </div>
);

// Dashboard card shimmer for fuel management dashboard
export const ShimmerDashboardCard: React.FC<{
  className?: string;
  variant?: 'default' | 'pulse' | 'wave';
}> = ({ className, variant = 'wave' }) => (
  <div className={cn('shimmer-container', className)}>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <ShimmerTitle width="60%" variant={variant} />
        <ShimmerIcon variant={variant} delay={100} />
      </div>
      <div className="space-y-2">
        <ShimmerText width="40%" size="lg" variant={variant} delay={200} />
        <ShimmerText width="80%" size="sm" variant={variant} delay={300} />
      </div>
    </div>
  </div>
);

// Statistics shimmer for fuel analytics
export const ShimmerStats: React.FC<{
  count?: number;
  className?: string;
  variant?: 'default' | 'pulse' | 'wave';
}> = ({ count = 4, className, variant = 'wave' }) => (
  <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
    {Array.from({ length: count }, (_, index) => (
      <div key={index} className="shimmer-container">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <ShimmerIcon size="sm" variant={variant} delay={index * 100} />
            <ShimmerText width="30%" size="sm" variant={variant} delay={index * 100 + 50} />
          </div>
          <ShimmerText width="60%" size="lg" variant={variant} delay={index * 100 + 100} />
          <ShimmerText width="80%" size="sm" variant={variant} delay={index * 100 + 150} />
        </div>
      </div>
    ))}
  </div>
);

export default ShimmerLoader; 