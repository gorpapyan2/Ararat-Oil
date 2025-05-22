import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { cn } from "@/shared/utils";
import { Button } from "@/core/components/ui/button";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { SkipToContent } from '@/core/components/ui/skip-to-content';
import { useIsMobile } from "@/hooks/useResponsive";
import { useAuth } from '@/features/auth';
import { Toaster } from "@/core/components/ui/toast";
import { Sheet, SheetContent, SheetTrigger } from "@/core/components/ui/primitives/sheet";
import { useTranslation } from "react-i18next";
import { ThemeSwitcher } from '@/core/components/ui/ThemeSwitcher';
import { IconLogout } from "@tabler/icons-react";
import { DevMenu } from '@/core/components/ui/composed/dev-menu';
import { useSidebarNavConfig } from "@/core/config";

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/auth" || pathname === "/login";
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const navConfig = useSidebarNavConfig();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sidebar state - get initial state from localStorage
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    return savedState ? JSON.parse(savedState) : false;
  });

  // Save sidebar state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile && isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const isActive = (path: string) => pathname === path;
  const isActiveChild = (path: string) => pathname.startsWith(path);

  // Simplified sidebar content rendering function
  const renderSidebarContent = () => (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Sidebar header */}
      <div className="flex h-14 items-center border-b px-4">
        <div className={cn(
          "flex items-center transition-all duration-300",
          sidebarCollapsed ? "justify-center w-full" : "gap-2",
        )}>
          {!sidebarCollapsed && (
            <span className="font-heading font-bold text-xl">Ararat Oil</span>
          )}
          {sidebarCollapsed && (
            <span className="font-heading font-bold text-accent text-lg">
              AO
            </span>
          )}
        </div>
      </div>

      {/* Simplified sidebar navigation */}
      <div className="flex-1 overflow-auto">
        <nav className="flex flex-col gap-4 p-4">
          {Object.entries(navConfig).map(([section, items]) => (
            <div key={section} className="flex flex-col gap-1">
              {!sidebarCollapsed && (
                <h3 className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t(`common.${section}`)}
                </h3>
              )}
              <div className="flex flex-col gap-1">
                {items.map((item: any) => {
                  const isItemActive = item.children 
                    ? isActiveChild(item.to)
                    : isActive(item.to);
                  
                  // Common styling for the nav item
                  const navItemClasses = cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
                    "hover:bg-primary/10",
                    isItemActive
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-foreground/80 hover:text-foreground",
                  );

                  // Render the icon
                  const IconComponent = item.icon;
                  const renderedIcon = IconComponent ? (
                    <div className={cn(
                      "flex items-center justify-center min-w-[24px]",
                      isItemActive && "text-primary"
                    )}>
                      <IconComponent size={20} />
                    </div>
                  ) : null;

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={navItemClasses}
                      aria-current={isItemActive ? "page" : undefined}
                    >
                      {renderedIcon}
                      {!sidebarCollapsed && <span>{item.label}</span>}
                      {sidebarCollapsed && <span className="sr-only">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Simplified footer */}
      <div className="border-t p-4 space-y-4">
        {/* Theme switcher */}
        <div className={cn(
          "flex items-center", 
          sidebarCollapsed ? "justify-center" : "justify-between"
        )}>
          {!sidebarCollapsed && (
            <span className="text-sm text-muted-foreground">
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
          className="w-full justify-center"
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
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={cn(
            "w-full",
            sidebarCollapsed ? "justify-center" : "justify-start",
            "text-muted-foreground"
          )}
        >
          <IconLogout className={cn("h-4 w-4", !sidebarCollapsed && "mr-2")} />
          {!sidebarCollapsed && <span>{t("common.signOut")}</span>}
        </Button>
      </div>
    </div>
  );

  // Main content with simplified layout
  const contentWithSidebar = (
    <div className="relative min-h-screen">
      <SkipToContent />
      
      {/* Sidebar - desktop version */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-30 hidden h-screen border-r bg-card/50  transition-all md:block md:flex-col",
          sidebarCollapsed ? "md:w-[70px]" : "md:w-[240px]",
        )}
      >
        {renderSidebarContent()}
      </aside>

      {/* Mobile sidebar - sheet component */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn("fixed left-4 top-3 z-40 md:hidden")}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          {renderSidebarContent()}
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main
        id="main-content"
        className={cn(
          "flex min-h-screen flex-col bg-gray-50 transition-all",
          sidebarCollapsed ? "md:pl-[70px]" : "md:pl-[240px]",
        )}
        tabIndex={-1}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-14 items-center border-b bg-gray-50/95  px-4 shadow-sm">
          <div className="flex-1 overflow-hidden flex items-center">
            {/* Page title placeholder */}
            <h1 className="text-xl font-bold truncate">
              {t("common.appName")}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Add DevMenu */}
            <DevMenu />
            
            {/* User profile button placeholder */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-primary/10 transition-colors"
            >
              <span className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-medium">
                AO
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
      <div className="min-h-screen bg-background">
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
