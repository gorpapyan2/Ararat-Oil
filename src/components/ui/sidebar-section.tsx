
import React from "react";
import { cn } from "@/lib/utils";

interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  collapsed?: boolean;
}

export function SidebarSection({ 
  title, 
  children, 
  className,
  collapsed = false 
}: SidebarSectionProps) {
  return (
    <div className={cn("py-2", className)}>
      {title && !collapsed && (
        <h3 className="px-4 mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-1 px-2">
        {children}
      </div>
    </div>
  );
}
