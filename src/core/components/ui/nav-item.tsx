import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/shared/utils/cn";

interface NavItemProps {
  to?: string;
  icon?: React.ReactNode;
  label?: string;
  active?: boolean;
  hasActiveChild?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

/**
 * NavItem component with proper React Router navigation
 */
export function NavItem({ 
  className, 
  to, 
  icon, 
  label, 
  active, 
  hasActiveChild, 
  collapsed, 
  onClick,
  children,
}: NavItemProps) {
  const handleClick = (e: React.MouseEvent) => {
    // If there's a custom onClick and no 'to' prop, use custom onClick
    // (for expandable items with children)
    if (onClick && !to) {
      e.preventDefault();
      onClick();
    }
  };

  const content = (
    <>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {!collapsed && label && <span className="flex-1">{label}</span>}
      {children}
    </>
  );

  const baseClasses = cn(
    "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-muted/50",
    active && "bg-primary/10 text-primary font-medium",
    hasActiveChild && "bg-muted/50",
    className
  );

  // If 'to' prop is provided, use Link for navigation
  if (to) {
    return (
      <Link 
        to={to}
        className={baseClasses}
        onClick={handleClick}
      >
        {content}
      </Link>
    );
  }

  // Otherwise, use div with click handler (for expandable items)
  return (
    <div 
      className={baseClasses}
      onClick={handleClick}
    >
      {content}
    </div>
  );
}
