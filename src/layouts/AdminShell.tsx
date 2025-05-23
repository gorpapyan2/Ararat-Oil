import React, { useState, useEffect, createContext, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { SkipToContent } from "@/components/ui/skip-to-content";
import { useIsMobile } from "@/hooks/useResponsive";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/toaster";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { IconLogout } from "@tabler/icons-react";
import { DevMenu } from "@/components/ui/composed/dev-menu";
import { useSidebarNavConfig } from "@/config/sidebarNav";

// Define the BreadcrumbContext type
type BreadcrumbSegment = {
  name: string;
  href: string;
  isCurrent?: boolean;
};

type BreadcrumbContextType = {
  breadcrumbs: BreadcrumbSegment[];
  setBreadcrumbs: React.Dispatch<React.SetStateAction<BreadcrumbSegment[]>>;
};

// Create the BreadcrumbContext
const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

// Create a hook to use the BreadcrumbContext
export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumbs must be used within a BreadcrumbProvider");
  }
  return context;
};

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/auth" || pathname === "/login";
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  const navConfig = useSidebarNavConfig();

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

  // Add breadcrumb state
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbSegment[]>([]);

  // Use a different layout for the auth page
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))]">
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

  // Render a nav item with tooltip if sidebar is collapsed
  const renderNavItem = (item: any) => {
    const isItemActive = item.children 
      ? isActiveChild(item.to)
      : isActive(item.to);

    // Common styling for the nav item
    const navItemClasses = cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
      "hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      isItemActive
        ? "bg-primary/15 text-primary font-medium"
        : "text-foreground/80 hover:text-foreground",
    );

    const label = sidebarCollapsed ? null : <span>{item.label}</span>;
    
    // Properly render the icon component
    const IconComponent = item.icon;
    const renderedIcon = IconComponent ? <IconComponent size={20} /> : null;

    // If sidebar is collapsed, wrap in tooltip
    if (sidebarCollapsed && !isMobile) {
      return (
        <TooltipProvider key={item.to}>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link
                to={item.to}
                className={navItemClasses}
                aria-current={isItemActive ? "page" : undefined}
              >
                {renderedIcon}
                <span className="sr-only">{item.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-primary text-primary-foreground"
            >
              {item.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // Regular rendering
    return (
      <div key={item.to} className="flex flex-col gap-1">
        <Link
          to={item.to}
          className={navItemClasses}
          aria-current={isItemActive ? "page" : undefined}
        >
          {renderedIcon}
          {label}
        </Link>
        {item.children && !sidebarCollapsed && (
          <div className="ml-6 flex flex-col gap-1 border-l pl-4">
            {item.children.map((child: any) => {
              const ChildIconComponent = child.icon;
              const childRenderedIcon = ChildIconComponent ? <ChildIconComponent size={18} /> : null;
              
              return (
                <Link
                  key={child.to}
                  to={child.to}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
                    "hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive(child.to)
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-foreground/80 hover:text-foreground",
                  )}
                  aria-current={isActive(child.to) ? "page" : undefined}
                >
                  {childRenderedIcon}
                  <span>{child.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // Sidebar content rendering function used in both desktop and mobile views
  const renderSidebarContent = () => (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Sidebar header */}
      <div className="flex h-14 items-center border-b px-4">
        <div
          className={cn(
            "flex items-center transition-all duration-300",
            sidebarCollapsed ? "justify-center w-full" : "gap-2",
          )}
        >
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

      {/* Sidebar navigation */}
      <div className="flex-1 overflow-auto">
        <nav className="flex flex-col gap-6 p-4">
          {Object.entries(navConfig).map(([section, items]) => (
            <div key={section} className="flex flex-col gap-1">
              {!sidebarCollapsed && (
                <h3 className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t(`common.${section}`)}
                </h3>
              )}
              <div className="flex flex-col gap-1">
                {items.map(renderNavItem)}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Sidebar footer with theme switcher, collapse button and signout */}
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
          <ThemeSwitcher variant="default" />
        </div>

        {/* Toggle collapse button */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSidebarCollapse}
          className="w-full justify-center"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>

        {/* Sign out button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <IconLogout className="h-4 w-4 mr-2" />
          {!sidebarCollapsed && <span>Sign out</span>}
        </Button>
      </div>
    </div>
  );

  // Add styles for breadcrumb transitions
  const breadcrumbContainerStyles = "transition-all duration-300 ease-in-out";
  const breadcrumbAnimationStyles = "animate-in fade-in slide-in-from-left-5 duration-300";

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      <div className="relative min-h-screen">
        <SkipToContent />
        
        {/* Sidebar - desktop version */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-30 hidden h-screen border-r bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 md:block md:flex-col",
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
            "flex min-h-screen flex-col bg-background transition-all duration-300",
            sidebarCollapsed ? "md:pl-[70px]" : "md:pl-[240px]",
          )}
          tabIndex={-1}
        >
          {/* Header */}
          <header className="sticky top-0 z-20 flex h-14 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shadow-sm">
            <div className="flex-1 overflow-hidden flex items-center">
              {/* Display breadcrumbs in header with enhanced styling */}
              {breadcrumbs.length > 0 ? (
                <div className={breadcrumbContainerStyles}>
                  <Breadcrumb
                    segments={breadcrumbs}
                    className={`py-1 ${breadcrumbAnimationStyles}`}
                  />
                </div>
              ) : (
                <div className={`flex items-center ${breadcrumbAnimationStyles}`}>
                  <span className="font-heading font-semibold text-xl">Dashboard</span>
                </div>
              )}
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
    </BreadcrumbContext.Provider>
  );
}
