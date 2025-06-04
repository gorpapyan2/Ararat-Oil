import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/shared/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'primary' | 'secondary' | 'muted';
}

export interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  avatar?: boolean;
  animated?: boolean;
}

const SPINNER_SIZES = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const SPINNER_COLORS = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  muted: 'text-gray-400',
};

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  color = 'primary' 
}: LoadingSpinnerProps) {
  return (
    <Loader2 
      className={cn(
        'animate-spin',
        SPINNER_SIZES[size],
        SPINNER_COLORS[color],
        className
      )} 
    />
  );
}

export function PulsingLoader({ 
  size = 'md', 
  className 
}: LoadingSpinnerProps) {
  return (
    <motion.div
      className={cn(
        'rounded-full bg-blue-600',
        SPINNER_SIZES[size],
        className
      )}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
}

export function BouncingDots({ className }: { className?: string }) {
  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-blue-600 rounded-full"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

export function LoadingSkeleton({ 
  className, 
  lines = 3, 
  avatar = false,
  animated = true 
}: LoadingSkeletonProps) {
  const pulseClass = animated ? 'animate-pulse' : '';
  
  return (
    <div className={cn('space-y-3', className)}>
      {avatar && (
        <div className="flex items-center space-x-4">
          <div className={cn('rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10', pulseClass)} />
          <div className="space-y-2 flex-1">
            <div className={cn('h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2', pulseClass)} />
            <div className={cn('h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4', pulseClass)} />
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 bg-gray-200 dark:bg-gray-700 rounded',
              pulseClass,
              i === lines - 1 ? 'w-3/4' : 'w-full'
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('border rounded-lg p-6 space-y-4 bg-white dark:bg-gray-900', className)}>
      <div className="flex items-center space-x-4">
        <div className="animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 h-12 w-12" />
        <div className="space-y-2 flex-1">
          <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="animate-pulse h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
        <div className="animate-pulse h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      
      <div className="space-y-3">
        <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4, className }: { 
  rows?: number; 
  columns?: number; 
  className?: string; 
}) {
  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b last:border-b-0">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, j) => (
              <div key={j} className="animate-pulse h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function RefreshButton({ 
  onRefresh, 
  loading = false, 
  className 
}: { 
  onRefresh: () => void; 
  loading?: boolean; 
  className?: string; 
}) {
  return (
    <motion.button
      onClick={onRefresh}
      disabled={loading}
      className={cn(
        'p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100',
        'dark:hover:text-gray-300 dark:hover:bg-gray-800',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-colors duration-200',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
    </motion.button>
  );
}

export function ProgressBar({ 
  value, 
  max = 100, 
  className,
  showValue = false,
  animated = true 
}: { 
  value: number; 
  max?: number; 
  className?: string;
  showValue?: boolean;
  animated?: boolean;
}) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={cn('space-y-1', className)}>
      {showValue && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium">{value}/{max}</span>
        </div>
      )}
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1 : 0, ease: "easeOut" }}
        />
      </div>
    </div>
  );
} 