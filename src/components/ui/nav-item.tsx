import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import React from "react";

export interface NavItemProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

export function NavItem({ 
  to, 
  label, 
  icon, 
  active = false, 
  onClick,
  collapsed = false
}: NavItemProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        active
          ? "bg-accent/15 text-accent hover:bg-accent/20"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        collapsed && "justify-center px-2 py-2 w-10 h-10"
      )}
    >
      <span className="text-muted-foreground/70">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
