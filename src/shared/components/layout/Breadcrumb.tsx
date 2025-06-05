import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
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
      className={cn("breadcrumbs", className)}
      aria-label="Breadcrumb navigation"
    >
      {/* Home Link */}
      {showHome && (
        <>
          <Link to="/" className="flex items-center hover:text-blue-400 transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <span> &gt; </span>
        </>
      )}
      
      {/* Dynamic Items */}
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {item.href && !isLast ? (
              <>
                <Link to={item.href}>{item.label}</Link>
                <span> &gt; </span>
              </>
            ) : (
              <span>{item.label}</span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}; 