import React from "react";
import { LucideIcon } from "lucide-react";

interface PageLayoutProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({
  title,
  description,
  icon: Icon,
  action,
  children,
}: PageLayoutProps) {
  return (
    <div className="w-full px-2 sm:px-4 md:px-6 pb-16 pt-2 space-y-6 max-w-[1920px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card sm:bg-transparent p-4 sm:p-0 rounded-lg shadow-sm sm:shadow-none mb-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          {Icon && (
            <div className="hidden sm:flex justify-center items-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
          )}
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h2>
            {description && (
              <p className="text-xs sm:text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && (
          <div className="w-full sm:w-auto">{action}</div>
        )}
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
} 