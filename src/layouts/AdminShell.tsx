import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronLeft, ChevronRight, CalendarClock } from "lucide-react";
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
import {
  IconDashboard,
  IconGasStation,
  IconTank,
  IconReportAnalytics,
  IconCurrencyDollar,
  IconUsers,
  IconTruck,
  IconSettings,
  IconLogout,
  IconReceipt2,
  IconChecklist,
} from "@tabler/icons-react";
type AdminShellProps = {
  children: React.ReactNode;
};
interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}
interface NavSection {
  title: string;
  items: NavItem[];
}
export function AdminShell({ children }: AdminShellProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/auth" || pathname === "/login";
  const isMobile = useIsMobile();
  const { signOut } = useAuth();

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

  // Organized navigation sections
  const navSections: NavSection[] = [
    {
      title: t("common.overview"),
      items: [
        {
          to: "/",
          label: t("common.dashboard"),
          icon: <IconDashboard size={20} />,
        },
        {
          to: "/todo",
          label: "Todo List",
          icon: <IconChecklist size={20} />,
        },
      ],
    },
    {
      title: t("common.fuelManagement"),
      items: [
        {
          to: "/fuel-management",
          label: t("common.fuelManagement"),
          icon: <IconGasStation size={20} />,
        },
      ],
    },
    {
      title: t("common.salesFinance"),
      items: [
        {
          to: "/sales",
          label: t("common.sales"),
          icon: <IconCurrencyDollar size={20} />,
        },
        {
          to: "/shifts",
          label: t("common.shifts"),
          icon: <CalendarClock size={20} />,
        },
        {
          to: "/expenses",
          label: t("common.expenses"),
          icon: <IconReceipt2 size={20} />,
        },
      ],
    },
    {
      title: t("common.management"),
      items: [
        {
          to: "/employees",
          label: t("common.employees"),
          icon: <IconUsers size={20} />,
        },
        {
          to: "/reports",
          label: t("common.reports"),
          icon: <IconReportAnalytics size={20} />,
        },
        {
          to: "/settings",
          label: t("common.settings"),
          icon: <IconSettings size={20} />,
        },
      ],
    },
  ];

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
  const renderNavItem = (item: NavItem) => {
    const isItemActive = isActive(item.to);

    // Common styling for the nav item
    const navItemClasses = cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
      "hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      isItemActive
        ? "bg-primary/15 text-primary font-medium"
        : "text-foreground/80 hover:text-foreground",
    );
    const label = sidebarCollapsed ? null : <span>{item.label}</span>;

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
                {item.icon}
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
      <Link
        key={item.to}
        to={item.to}
        className={navItemClasses}
        aria-current={isItemActive ? "page" : undefined}
      >
        {item.icon}
        {label}
      </Link>
    );
  };

  // Calculate sidebar width for main content margin
  const sidebarWidth = sidebarCollapsed ? 72 : 256;

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
          {navSections.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              {!sidebarCollapsed && (
                <h3 className="px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h3>
              )}
              <div className="flex flex-col gap-1">
                {section.items.map(renderNavItem)}
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
  return (
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
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <div className="flex-1 font-heading font-semibold text-xl">
            {/* Page title would go here */}
            Dashboard
          </div>

          <div className="flex items-center gap-2">
            {/* Right side header elements - removed ThemeToggle */}
            {/* User profile button placeholder */}
            <Button variant="ghost" size="icon" className="rounded-full">
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
}
