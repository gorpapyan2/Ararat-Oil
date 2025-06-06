import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils';
import { Card, CardContent } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/primitives/badge';

export interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  actionable?: boolean;
  onClick?: () => void;
  description?: string;
  target?: string;
  className?: string;
}

const colorVariants = {
  blue: {
    background: 'bg-blue-50 dark:bg-blue-950/20',
    iconBackground: 'bg-blue-500',
    iconColor: 'text-white',
    trendUp: 'text-green-600 dark:text-green-400',
    trendDown: 'text-red-600 dark:text-red-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  green: {
    background: 'bg-green-50 dark:bg-green-950/20',
    iconBackground: 'bg-green-500',
    iconColor: 'text-white',
    trendUp: 'text-green-600 dark:text-green-400',
    trendDown: 'text-red-600 dark:text-red-400',
    border: 'border-green-200 dark:border-green-800',
  },
  orange: {
    background: 'bg-orange-50 dark:bg-orange-950/20',
    iconBackground: 'bg-orange-500',
    iconColor: 'text-white',
    trendUp: 'text-green-600 dark:text-green-400',
    trendDown: 'text-red-600 dark:text-red-400',
    border: 'border-orange-200 dark:border-orange-800',
  },
  purple: {
    background: 'bg-purple-50 dark:bg-purple-950/20',
    iconBackground: 'bg-purple-500',
    iconColor: 'text-white',
    trendUp: 'text-green-600 dark:text-green-400',
    trendDown: 'text-red-600 dark:text-red-400',
    border: 'border-purple-200 dark:border-purple-800',
  },
  red: {
    background: 'bg-red-50 dark:bg-red-950/20',
    iconBackground: 'bg-red-500',
    iconColor: 'text-white',
    trendUp: 'text-green-600 dark:text-green-400',
    trendDown: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
  gray: {
    background: 'bg-gray-50 dark:bg-gray-950/20',
    iconBackground: 'bg-gray-500',
    iconColor: 'text-white',
    trendUp: 'text-green-600 dark:text-green-400',
    trendDown: 'text-red-600 dark:text-red-400',
    border: 'border-gray-200 dark:border-gray-800',
  },
};

const sizeVariants = {
  sm: {
    card: 'p-4',
    icon: 'w-8 h-8 p-2',
    iconSize: 'w-4 h-4',
    title: 'text-sm',
    value: 'text-xl',
    change: 'text-xs',
  },
  md: {
    card: 'p-6',
    icon: 'w-10 h-10 p-2.5',
    iconSize: 'w-5 h-5',
    title: 'text-sm',
    value: 'text-2xl',
    change: 'text-sm',
  },
  lg: {
    card: 'p-8',
    icon: 'w-12 h-12 p-3',
    iconSize: 'w-6 h-6',
    title: 'text-base',
    value: 'text-3xl',
    change: 'text-base',
  },
};

export function MetricCard({
  title,
  value,
  change,
  changeLabel = 'vs. previous period',
  trend = 'neutral',
  icon: Icon,
  color = 'blue',
  size = 'md',
  loading = false,
  actionable = false,
  onClick,
  description,
  target,
  className,
}: MetricCardProps) {
  const colorConfig = colorVariants[color];
  const sizeConfig = sizeVariants[size];

  const cardContent = (
    <CardContent className={cn(sizeConfig.card, 'relative overflow-hidden')}>
      {/* Loading skeleton */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Header with icon and trend */}
      <div className="flex items-start justify-between mb-4">
        <motion.div
          className={cn(
            'rounded-xl flex items-center justify-center',
            colorConfig.iconBackground,
            sizeConfig.icon
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon className={cn(sizeConfig.iconSize, colorConfig.iconColor)} />
        </motion.div>

        {change !== undefined && (
          <motion.div
            className="flex items-center gap-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {trend === 'up' && (
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {trend === 'down' && (
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            <span className={cn(
              'font-medium',
              sizeConfig.change,
              trend === 'up' ? colorConfig.trendUp : 
              trend === 'down' ? colorConfig.trendDown : 
              'text-gray-500 dark:text-gray-400'
            )}>
              {change > 0 ? '+' : ''}{change}%
            </span>
          </motion.div>
        )}
      </div>

      {/* Main content */}
      <div className="space-y-2">
        <h3 className={cn(
          'font-medium text-gray-600 dark:text-gray-400',
          sizeConfig.title
        )}>
          {title}
        </h3>
        
        <motion.p
          className={cn(
            'font-bold text-gray-900 dark:text-white',
            sizeConfig.value
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {value}
        </motion.p>

        {/* Footer with description and target */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          {changeLabel && (
            <span>{changeLabel}</span>
          )}
          {target && (
            <Badge variant="outline" className="text-xs">
              {target}
            </Badge>
          )}
        </div>

        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {description}
          </p>
        )}
      </div>

      {/* Hover gradient overlay */}
      <div className={cn(
        'absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none',
        colorConfig.background,
        actionable && 'group-hover:opacity-30'
      )} />
    </CardContent>
  );

  if (actionable && onClick) {
    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card
          className={cn(
            'group cursor-pointer border-0 bg-white dark:bg-gray-900 shadow-sm hover:shadow-lg transition-all duration-300',
            colorConfig.border,
            'hover:border-opacity-50',
            className
          )}
          onClick={onClick}
        >
          {cardContent}
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className={cn(
          'border-0 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300',
          className
        )}
      >
        {cardContent}
      </Card>
    </motion.div>
  );
} 