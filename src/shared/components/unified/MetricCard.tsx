/**
 * Standardized Metric Card Component
 * Consistent design across all pages
 */

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

import { Card, CardContent } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/primitives/badge';
import { cn } from '@/shared/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    period?: string;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';
  className?: string;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
}

const colorVariants = {
  blue: {
    light: 'from-blue-500/10 to-blue-600/5 border-blue-500/20',
    dark: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    icon: 'text-blue-400',
    accent: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
  },
  green: {
    light: 'from-green-500/10 to-green-600/5 border-green-500/20',
    dark: 'from-green-500/20 to-green-600/10 border-green-500/30',
    icon: 'text-green-400',
    accent: 'bg-green-500/20 text-green-300 border-green-500/40'
  },
  purple: {
    light: 'from-purple-500/10 to-purple-600/5 border-purple-500/20',
    dark: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    icon: 'text-purple-400',
    accent: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  },
  orange: {
    light: 'from-orange-500/10 to-orange-600/5 border-orange-500/20',
    dark: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
    icon: 'text-orange-400',
    accent: 'bg-orange-500/20 text-orange-300 border-orange-500/40'
  },
  red: {
    light: 'from-red-500/10 to-red-600/5 border-red-500/20',
    dark: 'from-red-500/20 to-red-600/10 border-red-500/30',
    icon: 'text-red-400',
    accent: 'bg-red-500/20 text-red-300 border-red-500/40'
  },
  gray: {
    light: 'from-gray-500/10 to-gray-600/5 border-gray-500/20',
    dark: 'from-gray-500/20 to-gray-600/10 border-gray-500/30',
    icon: 'text-gray-400',
    accent: 'bg-gray-500/20 text-gray-300 border-gray-500/40'
  }
};

const sizeVariants = {
  sm: {
    card: 'p-4',
    icon: 'w-8 h-8',
    iconContainer: 'w-10 h-10',
    iconSize: 'w-4 h-4',
    title: 'text-sm',
    value: 'text-xl',
    subtitle: 'text-xs',
  },
  md: {
    card: 'p-5',
    icon: 'w-10 h-10',
    iconContainer: 'w-12 h-12',
    iconSize: 'w-5 h-5',
    title: 'text-sm',
    value: 'text-2xl',
    subtitle: 'text-xs',
  },
  lg: {
    card: 'p-6',
    icon: 'w-12 h-12',
    iconContainer: 'w-14 h-14',
    iconSize: 'w-6 h-6',
    title: 'text-base',
    value: 'text-3xl',
    subtitle: 'text-sm',
  }
};

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
  className,
  delay = 0,
  size = 'md',
}) => {
  const colorScheme = colorVariants[color];
  const sizeScheme = sizeVariants[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className={className}
    >
      <Card className={cn(
        'relative overflow-hidden transition-all duration-300 hover:shadow-lg',
        'bg-gradient-to-br border backdrop-blur-sm',
        'dark:' + colorScheme.dark,
        'light:' + colorScheme.light
      )}>
        <CardContent className={cn('relative', sizeScheme.card)}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-current transform translate-x-8 -translate-y-8" />
            <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-current transform -translate-x-6 translate-y-6" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  'font-medium text-muted-foreground truncate',
                  sizeScheme.title
                )}>
                  {title}
                </h3>
              </div>
              <div className={cn(
                'flex items-center justify-center rounded-lg bg-background/50 backdrop-blur-sm flex-shrink-0',
                sizeScheme.iconContainer
              )}>
                <Icon className={cn(colorScheme.icon, sizeScheme.iconSize)} />
              </div>
            </div>

            {/* Value */}
            <div className="mb-2">
              <p className={cn(
                'font-bold text-foreground tabular-nums',
                sizeScheme.value
              )}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              {subtitle && (
                <p className={cn(
                  'text-muted-foreground truncate',
                  sizeScheme.subtitle
                )}>
                  {subtitle}
                </p>
              )}
              
              {trend && (
                <Badge 
                  variant="secondary"
                  className={cn(
                    'ml-auto text-xs font-medium',
                    trend.isPositive 
                      ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                      : 'bg-red-500/20 text-red-400 border-red-500/30'
                  )}
                >
                  {trend.isPositive ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(trend.value)}%
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Export variants for different use cases
export const SmallMetricCard: React.FC<Omit<MetricCardProps, 'size'>> = (props) => (
  <MetricCard {...props} size="sm" />
);

export const LargeMetricCard: React.FC<Omit<MetricCardProps, 'size'>> = (props) => (
  <MetricCard {...props} size="lg" />
);

export default MetricCard; 