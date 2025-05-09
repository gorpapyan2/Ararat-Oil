import React from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  collapsed?: boolean;
  id?: string;
}

export function SidebarSection({
  title,
  children,
  className,
  collapsed = false,
  id,
}: SidebarSectionProps) {
  const { t } = useTranslation();
  const sectionId = id || title?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div 
      className={cn(
        "py-2 transition-all duration-300 ease-in-out",
        className
      )}
      role="group"
      aria-labelledby={sectionId ? `sidebar-section-${sectionId}` : undefined}
    >
      {title && !collapsed && (
        <h3 
          id={sectionId ? `sidebar-section-${sectionId}` : undefined}
          className={cn(
            "px-4 mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider",
            "transition-colors duration-200 ease-in-out"
          )}
        >
          {t(title)}
        </h3>
      )}
      <div 
        className={cn(
          "space-y-1 px-2",
          "transition-all duration-300 ease-in-out",
          collapsed && "px-1"
        )}
      >
        {children}
      </div>
    </div>
  );
}
