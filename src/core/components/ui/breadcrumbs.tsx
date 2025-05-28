import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

/**
 * BreadcrumbItem component - represents a single item in a breadcrumb navigation
 */
export function BreadcrumbItem({ 
  href, 
  children, 
  isCurrentPage = false,
  className,
  ...props 
}: {
  href?: string;
  children: React.ReactNode;
  isCurrentPage?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLElement>) {
  if (isCurrentPage || !href) {
    return (
      <span 
        className={cn(
          "text-sm font-medium text-foreground",
          isCurrentPage && "text-muted-foreground",
          className
        )} 
        aria-current={isCurrentPage ? "page" : undefined}
        {...props}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      to={href}
      className={cn(
        "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

/**
 * Breadcrumbs component
 *
 * @placeholder This is a placeholder component that needs proper implementation
 */
export function Breadcrumbs({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <nav className={cn("flex", className)} aria-label="Breadcrumb" {...props}>
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {props.children}
      </ol>
    </nav>
  );
}
