import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/shared/utils";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  BarChart3,
  DollarSign,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/features/auth";
import { Button } from "@/core/components/ui/button";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

// Simplified navigation items
const navigationItems = [
  {
    title: "dashboard",
    icon: LayoutDashboard,
    href: "/",
    exactMatch: true,
  },
  {
    title: "analytics",
    icon: BarChart3,
    href: "/analytics",
  },
  {
    title: "finance",
    icon: DollarSign,
    href: "/finance",
  },
  {
    title: "users",
    icon: Users,
    href: "/users",
  },
  {
    title: "settings",
    icon: Settings,
    href: "/settings",
  },
];

export function SimplifiedSidebar({
  collapsed = false,
  onToggleCollapse,
  isMobile = false,
  isOpen = true,
}: SidebarProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (href: string, exactMatch?: boolean) => {
    if (exactMatch) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50",
        "fixed top-0 left-0 h-screen z-30 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        isMobile && "z-50 shadow-xl",
        isMobile && !isOpen && "transform -translate-x-full"
      )}
      role="navigation"
      aria-label={t("common.mainNavigation")}
    >
      {/* Logo */}
      <div className={cn(
        "h-16 flex items-center px-4 border-b border-gray-800/50 bg-gradient-to-r from-gray-900 to-gray-800",
        collapsed && "justify-center px-2"
      )}>
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">AO</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Ararat Oil</h1>
              <p className="text-xs text-gray-400">Management System</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">AO</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exactMatch);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-gray-800/50 hover:shadow-lg hover:shadow-gray-900/20",
                  active
                    ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30 shadow-md shadow-blue-500/10"
                    : "text-gray-300 hover:text-white",
                  collapsed && "justify-center px-2"
                )}
                title={collapsed ? t(`navigation.${item.title}`) : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <span>{t(`navigation.${item.title}`)}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800/50 p-4 bg-gray-900/50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleCollapse?.(!collapsed)}
          className="w-full justify-center bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>{t("sidebar.collapse")}</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
} 