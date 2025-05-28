import * as React from "react";

import { cn } from "@/utils/cn";

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

/**
 * PageHeader component for consistent page layouts
 */
export function PageHeader({ 
  className, 
  title, 
  description, 
  actions, 
  children,
  ...props 
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between space-y-2", className)} {...props}>
      <div className="space-y-1">
        {title && (
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        )}
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
        {children}
      </div>
      {actions && (
        <div className="flex items-center space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
}
