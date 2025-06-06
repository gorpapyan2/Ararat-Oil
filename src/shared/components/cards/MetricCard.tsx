import React from 'react';
import { cn } from '@/shared/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    direction: TrendDirection;
    value: string | number;
    label?: string;
  };
  variant?: 'default' | 'fuel' | 'energy' | 'finance' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

const variantStyles = {
  default: {
    card: 'bg-gradient-to-br from-background to-background/80 border-border/50',
    icon: 'bg-primary/10 text-primary',
    value: 'text-foreground',
    trend: {
      up: 'text-energy-green',
      down: 'text-fuel-red',
      neutral: 'text-muted-foreground',
    },
  },
  fuel: {
    card: 'bg-gradient-to-br from-fuel-red/5 to-fuel-orange/5 border-fuel-red/20',
    icon: 'bg-fuel-red/10 text-fuel-red',
    value: 'text-fuel-red',
    trend: {
      up: 'text-energy-green',
      down: 'text-fuel-red',
      neutral: 'text-muted-foreground',
    },
  },
  energy: {
    card: 'bg-gradient-to-br from-energy-green/5 to-electric-blue/5 border-energy-green/20',
    icon: 'bg-energy-green/10 text-energy-green',
    value: 'text-energy-green',
    trend: {
      up: 'text-energy-green',
      down: 'text-fuel-red',
      neutral: 'text-muted-foreground',
    },
  },
  finance: {
    card: 'bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20',
    icon: 'bg-primary/10 text-primary',
    value: 'text-primary',
    trend: {
      up: 'text-energy-green',
      down: 'text-fuel-red',
      neutral: 'text-muted-foreground',
    },
  },
  warning: {
    card: 'bg-gradient-to-br from-warning-orange/5 to-fuel-orange/5 border-warning-orange/20',
    icon: 'bg-warning-orange/10 text-warning-orange',
    value: 'text-warning-orange',
    trend: {
      up: 'text-energy-green',
      down: 'text-fuel-red',
      neutral: 'text-muted-foreground',
    },
  },
};

const sizeConfig = {
  sm: {
    card: 'p-4',
    icon: 'h-8 w-8 p-1.5',
    iconSize: 'h-5 w-5',
    title: 'text-sm',
    value: 'text-lg font-semibold',
    subtitle: 'text-xs',
    trend: 'text-xs',
    trendIcon: 'h-3 w-3',
  },
  md: {
    card: 'p-6',
    icon: 'h-12 w-12 p-2.5',
    iconSize: 'h-7 w-7',
    title: 'text-base',
    value: 'text-2xl font-bold',
    subtitle: 'text-sm',
    trend: 'text-sm',
    trendIcon: 'h-4 w-4',
  },
  lg: {
    card: 'p-8',
    icon: 'h-16 w-16 p-3',
    iconSize: 'h-10 w-10',
    title: 'text-lg',
    value: 'text-3xl font-bold',
    subtitle: 'text-base',
    trend: 'text-base',
    trendIcon: 'h-5 w-5',
  },
};

const getTrendIcon = (direction: TrendDirection) => {
  switch (direction) {
    case 'up':
      return TrendingUp;
    case 'down':
      return TrendingDown;
    case 'neutral':
      return Minus;
    default:
      return Minus;
  }
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  size = 'md',
  animated = true,
  loading = false,
  className,
  onClick,
}) => {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeConfig[size];
  const TrendIcon = trend ? getTrendIcon(trend.direction) : null;

  if (loading) {
    return (
      <div
        className={cn(
          'rounded-xl border backdrop-blur-sm',
          'transition-all duration-300',
          variantStyle.card,
          sizeStyle.card,
          className
        )}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className={cn('rounded-lg loading-shimmer', sizeStyle.icon)} />
            <div className="h-4 w-16 loading-shimmer rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-8 w-24 loading-shimmer rounded" />
            <div className="h-4 w-20 loading-shimmer rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-xl border backdrop-blur-sm cursor-pointer',
        'transition-all duration-300 hover:shadow-lg',
        {
          'hover:scale-105': animated && onClick,
          'animate-fade-in': animated,
        },
        variantStyle.card,
        sizeStyle.card,
        className
      )}
      onClick={onClick}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          {Icon && (
            <div
              className={cn(
                'rounded-lg flex items-center justify-center',
                'transition-transform duration-300',
                {
                  'animate-pulse-gentle': animated,
                },
                variantStyle.icon,
                sizeStyle.icon
              )}
            >
              <Icon className={sizeStyle.iconSize} />
            </div>
          )}
          
          {trend && TrendIcon && (
            <div
              className={cn(
                'flex items-center gap-1 font-medium',
                sizeStyle.trend,
                variantStyle.trend[trend.direction]
              )}
            >
              <TrendIcon className={sizeStyle.trendIcon} />
              <span>{trend.value}</span>
              {trend.label && (
                <span className="text-muted-foreground">({trend.label})</span>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <div
            className={cn(
              'font-mono tracking-tight',
              {
                'animate-scale-in animation-delay-200': animated,
              },
              variantStyle.value,
              sizeStyle.value
            )}
          >
            {value}
          </div>
          
          <div
            className={cn(
              'text-muted-foreground font-medium',
              sizeStyle.title
            )}
          >
            {title}
          </div>
          
          {subtitle && (
            <div
              className={cn(
                'text-muted-foreground',
                sizeStyle.subtitle
              )}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Predefined metric cards for common use cases
export const FuelMetricCard: React.FC<Omit<MetricCardProps, 'variant'>> = (props) => (
  <MetricCard variant="fuel" {...props} />
);

export const EnergyMetricCard: React.FC<Omit<MetricCardProps, 'variant'>> = (props) => (
  <MetricCard variant="energy" {...props} />
);

export const FinanceMetricCard: React.FC<Omit<MetricCardProps, 'variant'>> = (props) => (
  <MetricCard variant="finance" {...props} />
);

export const WarningMetricCard: React.FC<Omit<MetricCardProps, 'variant'>> = (props) => (
  <MetricCard variant="warning" {...props} />
); 