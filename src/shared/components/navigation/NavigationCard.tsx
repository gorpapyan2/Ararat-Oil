import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon, MoreHorizontal } from 'lucide-react';
import { type Icon } from '@/core/components/ui/icons';
import { cn } from '../../utils/cn';

// Better type definition for icons that supports both systems
type IconType = LucideIcon | Icon | React.ComponentType<{ className?: string }>;

interface NavigationCardProps {
  title: string;
  description?: string;
  href: string;
  icon: IconType;
  color?: string;
  variant?: 'default' | 'compact' | 'detailed' | 'management';
  stats?: string;
  className?: string;
}

const variantStyles = {
  default: {
    card: 'p-6 h-40',
    title: 'text-lg font-semibold',
    description: 'text-sm mt-2',
    icon: 'w-8 h-8'
  },
  compact: {
    card: 'p-4 h-32',
    title: 'text-base font-semibold',
    description: 'text-xs mt-1',
    icon: 'w-6 h-6'
  },
  detailed: {
    card: 'p-6 h-48',
    title: 'text-xl font-bold',
    description: 'text-sm mt-3',
    icon: 'w-10 h-10'
  },
  management: {
    card: 'h-40 flex flex-col items-center justify-center',
    title: 'text-lg font-semibold text-white',
    description: 'text-sm mt-1',
    icon: 'w-6 h-6'
  }
};

export const NavigationCard: React.FC<NavigationCardProps> = ({
  title,
  description,
  href,
  icon: Icon,
  color,
  variant = 'default',
  stats,
  className
}) => {
  const styles = variantStyles[variant];
  
  // Enhanced icon handling with better type checking and error handling
  const renderIcon = React.useCallback((className: string) => {
    try {
      // Check if Icon is a valid React component
      if (Icon && (typeof Icon === 'function' || typeof Icon === 'object')) {
        const IconComponent = Icon as React.ComponentType<{ className?: string }>;
        return <IconComponent className={className} />;
      }
      
      // Fallback to default icon
      return <MoreHorizontal className={className} />;
    } catch (error) {
      console.warn('NavigationCard: Failed to render icon, using fallback:', error);
      return <MoreHorizontal className={className} />;
    }
  }, [Icon]);

  // Management variant with colored cards like the management page
  if (variant === 'management') {
    const cardColor = color || '#4F8CFF';
    
    return (
      <Link
        to={href}
        className={cn(
          'management-card',
          styles.card,
          className
        )}
        style={{ backgroundColor: cardColor }}
      >
        {renderIcon("management-card-icon")}
        <span className="management-card-title">{title}</span>
      </Link>
    );
  }

  return (
    <Link
      to={href}
      className={cn(
        'group relative block w-full',
        'rounded-lg border transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'dark:focus:ring-offset-slate-800',
        
        // Basic theme styles
        'bg-white dark:bg-slate-800',
        'border-slate-200 dark:border-slate-700',
        'hover:border-slate-300 dark:hover:border-slate-600',
        'shadow-sm hover:shadow-md',
        'hover:bg-slate-50 dark:hover:bg-slate-750',
        
        styles.card,
        className
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header with icon */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'flex items-center justify-center rounded-lg',
              'bg-slate-100 dark:bg-slate-700',
              'p-2'
            )}>
              {renderIcon(cn(
                styles.icon,
                'text-slate-600 dark:text-slate-300'
              ))}
            </div>
          </div>
          
          {stats && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
              {stats}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pt-4">
          <h3 className={cn(
            styles.title,
            'text-slate-900 dark:text-slate-100',
            'group-hover:text-blue-600 dark:group-hover:text-blue-400',
            'transition-colors duration-200'
          )}>
            {title}
          </h3>
          
          {description && (
            <p className={cn(
              styles.description,
              'text-slate-600 dark:text-slate-400',
              'leading-relaxed'
            )}>
              {description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};