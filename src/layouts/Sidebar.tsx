
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavItem } from "@/components/ui/nav-item";
import { SidebarSection } from "@/components/ui/sidebar-section";
import {
  Home,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GasPump,
  BarChart,
  Users,
  Receipt,
  ListChecks
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "@/components/ThemeToggle";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ 
  collapsed: externalCollapsed, 
  onToggleCollapse,
  isMobile = false,
  isOpen,
  onToggle
}: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { signOut } = useAuth();
  
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : false;
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "fixed top-0 left-0 h-screen z-30 transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]",
        isMobile && "z-50 shadow-lg",
        isMobile && !isOpen && "transform -translate-x-full"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo section */}
      <div className={cn(
        "h-16 flex items-center px-4 border-b",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed ? (
          <span className="font-heading font-bold text-xl">Ararat Oil</span>
        ) : (
          <span className="font-heading font-bold text-accent text-lg">AO</span>
        )}
      </div>

      {/* Navigation sections */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <SidebarSection title={collapsed ? undefined : t("common.overview")} collapsed={collapsed}>
          <NavItem to="/" icon={<Home size={20} />} label={t("common.dashboard")} active={isActive("/")} collapsed={collapsed} />
          <NavItem to="/todo" icon={<ListChecks size={20} />} label={t("common.todo")} active={isActive("/todo")} collapsed={collapsed} />
        </SidebarSection>

        <SidebarSection title={collapsed ? undefined : t("common.fuelManagement")} collapsed={collapsed}>
          <NavItem 
            to="/fuel-management" 
            icon={<GasPump size={20} />} 
            label={t("common.fuelManagement")} 
            active={isActive("/fuel-management")} 
            collapsed={collapsed}
          />
        </SidebarSection>

        <SidebarSection title={collapsed ? undefined : t("common.salesFinance")} collapsed={collapsed}>
          <NavItem to="/sales" icon={<BarChart size={20} />} label={t("common.sales")} active={isActive("/sales")} collapsed={collapsed} />
          <NavItem to="/expenses" icon={<Receipt size={20} />} label={t("common.expenses")} active={isActive("/expenses")} collapsed={collapsed} />
        </SidebarSection>

        <SidebarSection title={collapsed ? undefined : t("common.management")} collapsed={collapsed}>
          <NavItem to="/employees" icon={<Users size={20} />} label={t("common.employees")} active={isActive("/employees")} collapsed={collapsed} />
          <NavItem to="/settings" icon={<Settings size={20} />} label={t("common.settings")} active={isActive("/settings")} collapsed={collapsed} />
        </SidebarSection>
      </div>

      {/* Footer section */}
      <div className="border-t p-4 space-y-4">
        {/* Theme toggle */}
        <div className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && <span className="text-sm text-muted-foreground">{t("common.theme")}</span>}
          <ThemeToggle variant="ghost" size="sm" />
        </div>

        {/* Collapse button */}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center"
          onClick={() => onToggleCollapse?.(!collapsed)}
          title={collapsed ? t("common.expand") : t("common.collapse")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>{t("common.collapse")}</span>
            </>
          )}
        </Button>

        {/* Sign out button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          {collapsed ? (
            <LogOut className="h-4 w-4" />
          ) : (
            <>
              <LogOut className="h-4 w-4 mr-2" />
              <span>{t("common.signOut")}</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
