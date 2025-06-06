import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/shared/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/primitives/badge';

interface FeatureCardProps {
  feature: NavigationFeature;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showMetrics?: boolean;
  showDescription?: boolean;
}

export function FeatureCard({ 
  feature, 
  className,
  size = 'medium',
  showMetrics = true,
  showDescription = true
}: FeatureCardProps) {
  const Icon = feature.icon;
  
  const sizes = {
    small: {
      container: 'p-4',
      icon: 'w-8 h-8',
      title: 'text-sm font-semibold',
      description: 'text-xs',
      metrics: 'text-xs'
    },
    medium: {
      container: 'p-6',
      icon: 'w-10 h-10', 
      title: 'text-lg font-semibold',
      description: 'text-sm',
      metrics: 'text-sm'
    },
    large: {
      container: 'p-8',
      icon: 'w-12 h-12',
      title: 'text-xl font-bold',
      description: 'text-base',
      metrics: 'text-base'
    }
  };

  const currentSize = sizes[size];

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': { variant: 'default' as const, color: 'bg-green-100 text-green-800 border-green-200' },
      'beta': { variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800 border-blue-200' },
      'coming-soon': { variant: 'outline' as const, color: 'bg-orange-100 text-orange-800 border-orange-200' },
      'maintenance': { variant: 'destructive' as const, color: 'bg-red-100 text-red-800 border-red-200' }
    };

    const config = variants[status as keyof typeof variants] || variants.active;
    
    return (
      <Badge 
        variant={config.variant}
        className={cn("text-xs", config.color)}
      >
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  return (
    <Link to={feature.path} className="block">
      <motion.div
        className={cn(
          "group relative overflow-hidden rounded-xl border border-border/50",
          "bg-card/50 backdrop-blur-sm hover:bg-card/80",
          "shadow-sm hover:shadow-md transition-all duration-300",
          "hover:border-border hover:-translate-y-1",
          currentSize.container,
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background gradient */}
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity",
            feature.color
          )}
        />

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          {getStatusBadge(feature.status)}
        </div>

        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={cn(
            "flex items-center justify-center rounded-lg",
            `bg-gradient-to-br ${feature.color}`,
            "text-white shadow-sm group-hover:shadow-lg transition-shadow",
            currentSize.icon
          )}>
            <Icon size={size === 'small' ? 16 : size === 'medium' ? 20 : 24} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "text-foreground group-hover:text-primary transition-colors",
              "truncate",
              currentSize.title
            )}>
              {feature.title}
            </h3>
            
            {showDescription && (
              <p className={cn(
                "text-muted-foreground mt-1 line-clamp-2",
                currentSize.description
              )}>
                {feature.description}
              </p>
            )}
          </div>
        </div>

        {/* Metrics */}
        {showMetrics && feature.metrics && (
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className={cn("text-muted-foreground", currentSize.metrics)}>
                {feature.metrics.label}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "font-semibold",
                  feature.metrics.color || "text-foreground",
                  currentSize.metrics
                )}>
                  {feature.metrics.value}
                </span>
                {feature.metrics.trend && getTrendIcon(feature.metrics.trend)}
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {feature.tags && feature.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {feature.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Sub-features count */}
        {feature.children && feature.children.length > 0 && (
          <div className="flex items-center justify-between text-muted-foreground">
            <span className={currentSize.metrics}>
              {feature.children.length} modules
            </span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        )}

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%]" />
      </motion.div>
    </Link>
  );
} 