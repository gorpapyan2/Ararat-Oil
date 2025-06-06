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
  badge?: string;
  className?: string;
}

const variantStyles = {
  default: {
    card: 'p-6 min-h-[10rem] card-content-stretch',
    title: 'text-lg font-semibold',
    description: 'text-sm mt-2 leading-comfortable',
    icon: 'w-8 h-8'
  },
  compact: {
    card: 'p-4 min-h-[8rem] card-content-stretch',
    title: 'text-base font-semibold',
    description: 'text-xs mt-1 leading-comfortable',
    icon: 'w-6 h-6'
  },
  detailed: {
    card: 'p-6 min-h-[12rem] card-content-stretch',
    title: 'text-xl font-bold',
    description: 'text-sm mt-3 leading-comfortable',
    icon: 'w-10 h-10'
  },
  management: {
    card: 'min-h-[10rem] flex flex-col items-center justify-center card-content-stretch',
    title: 'text-xl font-semibold',
    description: 'text-sm mt-1 leading-comfortable text-center',
    icon: 'w-8 h-8'
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
  badge,
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

  // Helper function to render badge
  const renderBadge = () => {
    if (!badge) return null;
    
    const badgeStyles = {
      'New': 'bg-emerald-50/90 text-emerald-700 border-emerald-200/60 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700/40',
      'Important': 'bg-amber-50/90 text-amber-700 border-amber-200/60 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700/40',
    };
    
    const defaultStyle = 'bg-blue-50/90 text-blue-700 border-blue-200/60 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700/40';
    
    return (
      <span className={cn(
        'absolute top-2 right-2 px-2.5 py-1 text-xs font-semibold rounded-full border',
        badgeStyles[badge as keyof typeof badgeStyles] || defaultStyle,
        'backdrop-blur-sm shadow-sm',
        'transform transition-all duration-300 group-hover:scale-105'
      )}>
        {badge}
      </span>
    );
  };

  // Management variant with natural color palette
  if (variant === 'management') {
    return (
      <Link
        to={href}
        className={cn(
          'group relative block w-full transition-all duration-300',
          'bg-white/80 hover:bg-white/95 dark:bg-gray-900/80 dark:hover:bg-gray-900/95',
          'border border-gray-200/60 hover:border-gray-300/80 dark:border-gray-700/60 dark:hover:border-gray-600/80',
          'rounded-xl shadow-sm hover:shadow-lg dark:shadow-gray-900/10',
          'hover:scale-[1.03] active:scale-[0.98]',
          'backdrop-blur-sm',
          'overflow-hidden',
          styles.card,
          className
        )}
      >
        {/* Enhanced gradient overlay with navigation page styling */}
        <div className="absolute inset-0 opacity-20 dark:opacity-30 transition-opacity duration-300 group-hover:opacity-30 dark:group-hover:opacity-40">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-accent/10 to-transparent"></div>
        </div>

        {/* Badge */}
        {renderBadge()}
        
        {/* Accent bar that appears on hover */}
        <div className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-xl" style={{ backgroundColor: '#57575E' }} />
        
        <div className="relative z-10">
          {/* Icon with natural styling */}
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50/80 hover:bg-gray-100/90 dark:bg-gray-800/80 dark:hover:bg-gray-700/90 border border-gray-200/40 hover:border-gray-300/60 dark:border-gray-700/40 dark:hover:border-gray-600/60 transition-all duration-300 mb-4 backdrop-blur-sm">
            {renderIcon("w-6 h-6 text-gray-600 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-200 transition-colors duration-300")}
          </div>
          
          <div className="text-center space-y-2 px-2">
            <h3 className={cn(
              styles.title,
              'text-gray-900 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-gray-50 transition-colors duration-300',
              'leading-tight'
            )}>
              {title}
            </h3>
            {description && (
              <p className={cn(
                styles.description,
                'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300 break-words-safe',
                'line-clamp-3'
              )}>
                {description}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={href}
      className={cn(
        'group relative block w-full transition-all duration-300',
        'bg-white/80 hover:bg-white/95 dark:bg-gray-900/80 dark:hover:bg-gray-900/95',
        'border border-gray-200/60 hover:border-gray-300/80 dark:border-gray-700/60 dark:hover:border-gray-600/80',
        'rounded-xl shadow-sm hover:shadow-lg dark:shadow-gray-900/10',
        'hover:scale-[1.02] active:scale-[0.99]',
        'backdrop-blur-sm',
        'overflow-hidden',
        styles.card,
        className
      )}
    >
      {/* Enhanced gradient overlay with navigation page styling */}
      <div className="absolute inset-0 opacity-20 dark:opacity-30 transition-opacity duration-300 group-hover:opacity-30 dark:group-hover:opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-accent/10 to-transparent"></div>
      </div>

      {/* Badge */}
      {renderBadge()}
      
      <div className="relative z-10 flex h-full flex-col">
        {/* Header with icon */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'flex items-center justify-center rounded-lg transition-all duration-300',
              'bg-gray-50/80 hover:bg-gray-100/90 dark:bg-gray-800/80 dark:hover:bg-gray-700/90',
              'border border-gray-200/40 hover:border-gray-300/60 dark:border-gray-700/40 dark:hover:border-gray-600/60',
              'p-3 backdrop-blur-sm'
            )}>
              {renderIcon(cn(
                styles.icon,
                'text-gray-600 group-hover:text-gray-800 dark:text-gray-400 dark:group-hover:text-gray-200 transition-colors duration-300'
              ))}
            </div>
          </div>
          
          {stats && (
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/90 dark:hover:bg-gray-700/90 px-3 py-1.5 rounded-full transition-colors duration-300 backdrop-blur-sm border border-gray-200/40 dark:border-gray-700/40">
              {stats}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 pt-4 px-1">
          <h3 className={cn(
            styles.title,
            'text-gray-900 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-gray-50 transition-colors duration-300',
            'leading-tight mb-2'
          )}>
            {title}
          </h3>
          
          {description && (
            <p className={cn(
              styles.description,
              'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300',
              'leading-relaxed transition-colors duration-300 break-words-safe',
              'line-clamp-3'
            )}>
              {description}
            </p>
          )}
        </div>

        {/* Subtle bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: '#57575E' }} />
      </div>
    </Link>
  );
};