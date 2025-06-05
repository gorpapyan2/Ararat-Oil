import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils';
import { Card } from '@/core/components/ui/card';

interface ShiftMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  className?: string;
  delay?: number;
}

const colorVariants = {
  blue: {
    bg: 'from-blue-500/10 to-blue-600/5',
    border: 'border-blue-500/20',
    icon: 'text-blue-400',
    value: 'text-blue-300',
    trend: 'text-blue-300',
    ring: 'ring-blue-500/30'
  },
  green: {
    bg: 'from-green-500/10 to-green-600/5',
    border: 'border-green-500/20',
    icon: 'text-green-400',
    value: 'text-green-300',
    trend: 'text-green-300',
    ring: 'ring-green-500/30'
  },
  purple: {
    bg: 'from-purple-500/10 to-purple-600/5',
    border: 'border-purple-500/20',
    icon: 'text-purple-400',
    value: 'text-purple-300',
    trend: 'text-purple-300',
    ring: 'ring-purple-500/30'
  },
  orange: {
    bg: 'from-orange-500/10 to-orange-600/5',
    border: 'border-orange-500/20',
    icon: 'text-orange-400',
    value: 'text-orange-300',
    trend: 'text-orange-300',
    ring: 'ring-orange-500/30'
  },
  red: {
    bg: 'from-red-500/10 to-red-600/5',
    border: 'border-red-500/20',
    icon: 'text-red-400',
    value: 'text-red-300',
    trend: 'text-red-300',
    ring: 'ring-red-500/30'
  }
};

export const ShiftMetricCard: React.FC<ShiftMetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
  className,
  delay = 0
}) => {
  const colors = colorVariants[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.3,
        delay: delay * 0.1,
        ease: [0.4, 0.0, 0.2, 1]
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={cn(
        "group cursor-default",
        className
      )}
    >
      <Card 
        className={cn(
          "relative overflow-hidden border-0 shadow-md bg-gradient-to-br",
          "backdrop-blur-sm ring-1 transition-all duration-300",
          "hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1",
          colors.bg,
          colors.border,
          colors.ring,
          "bg-slate-800/50"
        )}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-white/[0.03] to-transparent transform translate-x-8 -translate-y-8" />
        
        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  "bg-gradient-to-br ring-1 transition-transform duration-300",
                  "group-hover:scale-110 group-hover:rotate-3",
                  colors.bg,
                  colors.ring
                )}>
                  <Icon className={cn("w-5 h-5", colors.icon)} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-slate-400 truncate">
                    {title}
                  </h3>
                  {subtitle && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className={cn(
                  "text-2xl font-bold tracking-tight transition-colors duration-300",
                  colors.value,
                  "group-hover:text-white"
                )}>
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                
                {trend && (
                  <div className="flex items-center gap-1">
                    <div className={cn(
                      "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                      trend.isPositive 
                        ? "bg-green-500/10 text-green-300 ring-1 ring-green-500/20" 
                        : "bg-red-500/10 text-red-300 ring-1 ring-red-500/20"
                    )}>
                      <span className={cn(
                        "w-1 h-1 rounded-full",
                        trend.isPositive ? "bg-green-400" : "bg-red-400"
                      )} />
                      {trend.isPositive ? '+' : ''}{trend.value}%
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Hover glow effect */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "bg-gradient-to-r from-transparent via-white/[0.02] to-transparent",
          "transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%]",
          "transition-transform duration-1000 ease-out"
        )} />
      </Card>
    </motion.div>
  );
}; 