import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ 
  items, 
  className,
  showHome = true
}) => {
  return (
    <nav 
      className={cn(
        "flex items-center space-x-2 text-sm mb-6",
        "text-muted-foreground",
        className
      )}
      aria-label="Breadcrumb navigation"
    >
      <div className="flex items-center space-x-2">
        {/* Home Link */}
        {showHome && (
          <>
            <Link 
              to="/" 
              className="flex items-center hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1 py-1"
            >
              <Home className="w-4 h-4" />
            </Link>
            {items.length > 0 && (
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            )}
          </>
        )}
        
        {/* Dynamic Items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <React.Fragment key={`${item.label}-${index}`}>
              {item.href && !isLast ? (
                <>
                  <Link 
                    to={item.href}
                    className="hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1 py-1"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                </>
              ) : (
                <span className={cn(
                  isLast ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}; 