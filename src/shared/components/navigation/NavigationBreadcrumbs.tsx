import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/shared/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface NavigationBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHomeIcon?: boolean;
}

export const NavigationBreadcrumbs: React.FC<NavigationBreadcrumbsProps> = ({
  items,
  className,
  showHomeIcon = true
}) => {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn(
        'flex items-center space-x-2 mb-6',
        'text-sm font-medium',
        'text-slate-600 dark:text-slate-400',
        className
      )}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            {index > 0 && (
              <ChevronRight 
                className="w-4 h-4 text-slate-400 dark:text-slate-500" 
                aria-hidden="true"
              />
            )}
            
            {index === 0 && showHomeIcon && (
              <Home 
                className="w-4 h-4 text-slate-500 dark:text-slate-400 mr-1" 
                aria-hidden="true"
              />
            )}
            
            {item.href && !item.isActive ? (
              <Link
                to={item.href}
                className={cn(
                  'hover:text-blue-600 dark:hover:text-blue-400',
                  'transition-colors duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  'dark:focus:ring-offset-slate-800 rounded-sm px-1 py-0.5'
                )}
              >
                {item.label}
              </Link>
            ) : (
              <span 
                className={cn(
                  item.isActive 
                    ? 'text-slate-900 dark:text-slate-100 font-semibold' 
                    : 'text-slate-600 dark:text-slate-400'
                )}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}; 