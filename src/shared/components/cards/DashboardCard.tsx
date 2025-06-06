import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, ArrowRight, Activity } from 'lucide-react';
import { cn } from '@/shared/utils';
import { Card, CardContent, CardHeader } from '@/core/components/ui/card';
import { Badge } from '@/core/components/ui/badge';

interface DashboardCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'fuel' | 'finance' | 'management' | 'reports';
  status?: 'active' | 'warning' | 'inactive' | 'error';
  statusText?: string;
  value?: string | number;
  valueLabel?: string;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'neutral';
  };
  quickActions?: Array<{
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
  }>;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const variantStyles = {
  default: {
    gradient: 'from-slate-500/10 to-slate-600/5',
    iconBg: 'bg-slate-500/10',
    iconColor: 'text-slate-600',
    border: 'border-slate-200/50 hover:border-slate-300/70',
  },
  fuel: {
    gradient: 'from-fuel-red/10 to-fuel-orange/5',
    iconBg: 'bg-fuel-red/10',
    iconColor: 'text-fuel-red',
    border: 'border-fuel-red/20 hover:border-fuel-red/30',
  },
  finance: {
    gradient: 'from-energy-green/10 to-success/5',
    iconBg: 'bg-energy-green/10',
    iconColor: 'text-energy-green',
    border: 'border-energy-green/20 hover:border-energy-green/30',
  },
  management: {
    gradient: 'from-primary/10 to-secondary/5',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    border: 'border-primary/20 hover:border-primary/30',
  },
  reports: {
    gradient: 'from-electric-blue/10 to-info/5',
    iconBg: 'bg-electric-blue/10',
    iconColor: 'text-electric-blue',
    border: 'border-electric-blue/20 hover:border-electric-blue/30',
  },
};

const statusStyles = {
  active: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  inactive: 'bg-muted/10 text-muted-foreground border-muted/20',
  error: 'bg-destructive/10 text-destructive border-destructive/20',
};

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon: Icon,
  href,
  onClick,
  variant = 'default',
  status,
  statusText,
  value,
  valueLabel,
  trend,
  quickActions,
  className,
  disabled = false,
  loading = false,
}) => {
  const styles = variantStyles[variant];
  
  const cardContent = (
    <Card className={cn(
      'group relative overflow-hidden transition-all duration-300',
      'hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1',
      'border-2',
      styles.border,
      disabled && 'opacity-50 cursor-not-allowed',
      loading && 'animate-pulse',
      className
    )}>
      {/* Background Gradient */}
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-50',
        styles.gradient
      )} />
      
      {/* Status Indicator */}
      {status && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            <div className={cn(
              'h-2 w-2 rounded-full',
              status === 'active' && 'bg-success animate-pulse',
              status === 'warning' && 'bg-warning animate-pulse',
              status === 'inactive' && 'bg-muted-foreground',
              status === 'error' && 'bg-destructive animate-pulse'
            )} />
          </div>
        </div>
      )}
      
      <CardHeader className="relative pb-2">
        <div className="flex items-start justify-between">
          <div className={cn(
            'p-3 rounded-xl transition-all duration-300',
            'group-hover:scale-110 group-hover:rotate-3',
            styles.iconBg
          )}>
            <Icon className={cn('h-6 w-6', styles.iconColor)} />
          </div>
          
          {status && statusText && (
            <Badge 
              variant="outline" 
              className={cn('text-xs', statusStyles[status])}
            >
              {statusText}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        {/* Title and Description */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
        
        {/* Value and Trend */}
        {(value || trend) && (
          <div className="space-y-2">
            {value && (
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {value}
                </div>
                {valueLabel && (
                  <div className="text-xs text-muted-foreground">
                    {valueLabel}
                  </div>
                )}
              </div>
            )}
            
            {trend && (
              <div className="flex items-center gap-2 text-sm">
                <span className={cn(
                  'flex items-center gap-1 font-medium',
                  trend.direction === 'up' && 'text-success',
                  trend.direction === 'down' && 'text-destructive',
                  trend.direction === 'neutral' && 'text-muted-foreground'
                )}>
                  {trend.direction === 'up' && '↗'}
                  {trend.direction === 'down' && '↘'}
                  {trend.direction === 'neutral' && '→'}
                  {trend.value}%
                </span>
                <span className="text-muted-foreground">{trend.label}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Quick Actions */}
        {quickActions && quickActions.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                  className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-md',
                    'text-xs font-medium transition-colors',
                    'bg-background/50 hover:bg-background',
                    'text-muted-foreground hover:text-foreground',
                    'border border-border/50 hover:border-border'
                  )}
                >
                  {action.icon && <action.icon className="h-3 w-3" />}
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Navigation Arrow */}
        {(href || onClick) && (
          <div className="flex items-center justify-end pt-2">
            <ArrowRight className={cn(
              'h-4 w-4 transition-all duration-300',
              'group-hover:translate-x-1',
              styles.iconColor
            )} />
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (disabled || loading) {
    return cardContent;
  }

  if (href) {
    return (
      <Link to={href} className="block">
        {cardContent}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} className="block w-full text-left">
        {cardContent}
      </button>
    );
  }

  return cardContent;
};

export default DashboardCard; 