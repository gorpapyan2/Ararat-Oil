import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'large' | 'compact';
  className?: string;
  actions?: React.ReactNode;
}

const variantStyles = {
  default: {
    title: 'text-3xl font-bold',
    description: 'text-lg',
    spacing: 'mb-8',
    icon: 'w-8 h-8'
  },
  large: {
    title: 'text-4xl font-bold',
    description: 'text-xl',
    spacing: 'mb-10',
    icon: 'w-10 h-10'
  },
  compact: {
    title: 'text-2xl font-semibold',
    description: 'text-base',
    spacing: 'mb-6',
    icon: 'w-6 h-6'
  }
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  variant = 'default',
  className,
  actions
}) => {
  const styles = variantStyles[variant];

  return (
    <header className={cn(
      'flex flex-col space-y-4',
      styles.spacing,
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          {Icon && (
            <div className="flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 p-3">
              <Icon className={cn(
                styles.icon,
                'text-blue-600 dark:text-blue-400'
              )} />
            </div>
          )}
          
          <div>
            <h1 className={cn(
              styles.title,
              'text-slate-900 dark:text-slate-100',
              'tracking-tight'
            )}>
              {title}
            </h1>
            
            {description && (
              <p className={cn(
                styles.description,
                'text-slate-600 dark:text-slate-400',
                'mt-2 max-w-3xl'
              )}>
                {description}
              </p>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center space-x-3">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}; 