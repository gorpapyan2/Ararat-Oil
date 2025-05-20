import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import React, { forwardRef, KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";

export interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
  className?: string;
  children?: React.ReactNode;
  hasActiveChild?: boolean;
}

export const NavItem = forwardRef<HTMLAnchorElement, NavItemProps>(({
  to,
  label,
  icon,
  active = false,
  onClick,
  collapsed = false,
  className,
  children,
  hasActiveChild = false,
  ...props
}, ref) => {
  const { t } = useTranslation();
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    // Add keyboard support for enter and space keys
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onClick) {
        onClick();
      }
    }
  };

  const isActive = active || hasActiveChild;

  return (
    <Link
      ref={ref}
      to={to}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex items-center gap-3 rounded-md text-sm font-medium transition-all relative",
        "hover:bg-accent/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2", 
        "active:scale-[0.98] duration-75",
        collapsed ? "justify-center px-2 py-2 w-10 h-10" : "px-3 py-2",
        isActive
          ? "bg-accent/15 text-accent hover:bg-accent/20"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      aria-current={active ? "page" : undefined}
      role="menuitem"
      tabIndex={0}
      {...props}
    >
      {/* Active indicator for collapsed sidebar */}
      {(collapsed && isActive) && (
        <span 
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full" 
          aria-hidden="true"
        />
      )}
      
      {/* Icon with consistent sizing */}
      <span 
        className={cn(
          "flex items-center justify-center",
          collapsed ? "text-foreground" : "text-muted-foreground/70",
          isActive && "text-accent"
        )}
        aria-hidden="true"
      >
        {icon}
      </span>
      
      {/* Label (hidden in collapsed mode) */}
      {!collapsed && (
        <span className={cn(
          "transition-opacity duration-200",
          "overflow-hidden text-ellipsis whitespace-nowrap"
        )}>
          {t(label)}
        </span>
      )}
      
      {/* Children content */}
      {children}
    </Link>
  );
});
