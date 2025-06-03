import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { cn } from "@/shared/utils";
import { Button } from "@/core/components/ui/button";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { SkipToContent } from "@/core/components/ui/skip-to-content";
import { useIsMobile } from "@/shared/hooks/useResponsive";
import { useAuth } from "@/features/auth";
import { Toaster } from "@/core/components/ui/toast";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/core/components/ui/primitives/sheet";
import { useTranslation } from "react-i18next";
import { ThemeSwitcher } from "@/core/components/ui/ThemeSwitcher";
import { IconLogout, type Icon } from "@/core/components/ui/icons";
import { DevMenu } from "@/core/components/ui/composed/dev-menu";
import { useSidebarNavConfig } from "@/core/config";
import { LucideIcon } from "lucide-react";
import { APP_ROUTES } from "@/core/config/routes";

// Define types for navigation items
interface NavigationItem {
  to: string;
  icon: LucideIcon | Icon;
  label: string;
  children?: NavigationItem[];
}

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("adminShellSidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navConfig = useSidebarNavConfig();

  // Check if current route is an auth page
  const isAuthPage = [
    APP_ROUTES.AUTH.path,
  ].includes(location.pathname);

  useEffect(() => {
    localStorage.setItem("adminShellSidebarCollapsed", JSON.stringify(sidebarCollapsed));
    // Hide sidebar on auth pages
    if (isAuthPage) {
      setSidebarCollapsed(true);
    }
  }, [sidebarCollapsed, isAuthPage]);

  // Keep CSS variable in sync so other layouts can use consistent spacing
  useEffect(() => {
    const width = isMobile ? 0 : sidebarCollapsed ? 70 : 240;
    document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
  }, [sidebarCollapsed, isMobile]);

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const handleSignOut = async () => {
    await logout();
    navigate(APP_ROUTES.AUTH.path);
  };

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const renderSidebarContent = () => (
    <div className="h-full flex flex-col bg-gray-900/95 backdrop-blur-xl border-r border-gray-800/50">
      {/* Logo section */}
      <div className={cn(
        "border-b border-gray-800/50 px-4 py-6 bg-gradient-to-r from-gray-900 to-gray-800",
        sidebarCollapsed ? "text-center" : ""
      )}>
        {sidebarCollapsed ? (
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto shadow-lg">
            <span className="text-white font-bold text-sm">AO</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">AO</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Ararat Oil</h1>
              <p className="text-xs text-gray-400">Management System</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {Object.entries(navConfig).map(([section, items]) => (
            <div key={section} className="flex flex-col gap-1">
              {/* Section header */}
              {!sidebarCollapsed && (
                <h3 className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {t(`common.${section}`)}
                </h3>
              )}

              {/* Navigation items */}
              {items.map((item: NavigationItem) => {
                const isItemActive = item.children
                  ? item.children.some((child) => isActive(child.to))
                  : isActive(item.to, true);

                const IconComponent = item.icon;
                const renderedIcon = React.isValidElement(IconComponent) ? (
                  IconComponent
                ) : (
                  <IconComponent className="h-5 w-5 flex-shrink-0" />
                );

                const navItemClasses = cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  "hover:bg-gray-800/50 hover:shadow-lg hover:shadow-gray-900/20",
                  isItemActive
                    ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 border border-blue-500/30 shadow-md shadow-blue-500/10"
                    : "text-gray-300 hover:text-white",
                  sidebarCollapsed && "justify-center px-2"
                );

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={navItemClasses}
                    aria-current={isItemActive ? "page" : undefined}
                  >
                    {renderedIcon}
                    {!sidebarCollapsed && <span>{item.label}</span>}
                    {sidebarCollapsed && (
                      <span className="sr-only">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800/50 p-4 space-y-4 bg-gray-900/50">
        {/* Theme switcher */}
        <div
          className={cn(
            "flex items-center",
            sidebarCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {!sidebarCollapsed && (
            <span className="text-sm text-gray-400">
              {t("common.theme")}
            </span>
          )}
          <ThemeSwitcher />
        </div>

        {/* Toggle collapse button */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSidebarCollapse}
          className="w-full justify-center bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>{t("sidebar.collapse")}</span>
            </>
          )}
        </Button>

        {/* Sign out button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className={cn(
            "w-full bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50",
            sidebarCollapsed ? "px-2" : "justify-start"
          )}
        >
          <IconLogout className="h-4 w-4" />
          {!sidebarCollapsed && <span className="ml-2">{t("auth.signOut")}</span>}
        </Button>
      </div>
    </div>
  );

  // Content with sidebar for authenticated pages
  const contentWithSidebar = (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <SkipToContent />

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-30 h-screen transition-all duration-300 ease-in-out hidden md:block",
          sidebarCollapsed ? "w-[70px]" : "w-[240px]"
        )}
      >
        {renderSidebarContent()}
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-40 md:hidden bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50"
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">{t("sidebar.openMenu")}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0 bg-gray-900 border-gray-800">
          {renderSidebarContent()}
        </SheetContent>
      </Sheet>

      <main
        id="main-content"
        className={cn(
          "flex min-h-screen flex-col bg-transparent transition-all duration-300"
        )}
        style={{ paddingLeft: isMobile ? 0 : "var(--sidebar-width, 72px)" }}
        tabIndex={-1}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-xl px-4 shadow-lg">
          <div className="flex-1 overflow-hidden flex items-center">
            <h1 className="text-xl font-bold text-white truncate">
              {t("common.appName")}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Add DevMenu */}
            <DevMenu />

            {/* User profile button */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-800/50 transition-colors"
            >
              <span className="size-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-medium text-sm shadow-lg">
                {user?.email?.charAt(0).toUpperCase() || "AO"}
              </span>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 px-4 py-6 md:px-6 md:py-8">{children}</div>
      </main>

      <Toaster />
    </div>
  );

  // Use different layouts for auth and main pages
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
        <main
          id="main-content"
          className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8"
          tabIndex={-1}
        >
          {children}
        </main>
        <Toaster />
      </div>
    );
  }

  // Return the main layout
  return contentWithSidebar;
}
