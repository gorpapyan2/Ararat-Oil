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
}

export const NavigationBreadcrumbs: React.FC<NavigationBreadcrumbsProps> = ({
  items,
  className,
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn(
        'flex items-center space-x-1 text-sm',
        'text-muted-foreground',
        className
      )}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {/* Separator */}
          {index > 0 && (
            <ChevronRight
              className="w-4 h-4 text-border"
              aria-hidden="true"
            />
          )}

          {/* Home icon for first item */}
          {index === 0 && (
            <Home
              className="w-4 h-4 text-muted-foreground mr-1"
              aria-hidden="true"
            />
          )}

          {/* Breadcrumb item */}
          {item.href && !item.isActive ? (
            <Link
              to={item.href}
              className={cn(
                'hover:text-accent transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
                'focus:ring-offset-background rounded-sm px-1 py-0.5'
              )}
            >
              <span
                className={cn(
                  'transition-colors duration-200',
                  'hover:text-accent'
                )}
              >
                {item.label}
              </span>
            </Link>
          ) : (
            <span
              className={cn(
                item.isActive
                  ? 'text-foreground font-semibold'
                  : 'text-muted-foreground'
              )}
              aria-current={item.isActive ? 'page' : undefined}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}; 