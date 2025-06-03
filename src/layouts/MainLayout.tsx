import React, { useState, useEffect } from "react";
import { Sidebar } from "@/layouts/Sidebar";
import { useLocation } from "react-router-dom";
import { Toaster } from "@/core/components/ui/toast";
import { cn } from "@/shared/utils";
import { Button } from "@/core/components/ui/button";
import { Menu, X } from "lucide-react";
import { SkipToContent } from "@/core/components/ui/skip-to-content";
import { useIsMobile } from "@/hooks";

type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/auth";
  const isMobile = useIsMobile();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem("sidebarCollapsed");
      return savedState ? JSON.parse(savedState) : false;
    }
    return false;
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
    }
  }, [sidebarCollapsed]);

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile && mobileSidebarOpen) {
      setMobileSidebarOpen(false);
    }
  }, [pathname, isMobile, mobileSidebarOpen]);

  // Use a different layout for the auth page
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
        <main
          id="main-content"
          className="flex min-h-screen flex-col items-center justify-center"
          tabIndex={-1}
        >
          {children}
        </main>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <SkipToContent />

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
        isMobile={isMobile}
        isOpen={mobileSidebarOpen}
        onToggle={toggleMobileSidebar}
      />

      {/* Mobile menu toggle button */}
      {isMobile && (
        <Button
          onClick={toggleMobileSidebar}
          className={cn(
            "fixed top-4 left-4 z-40 md:hidden",
            "flex items-center justify-center",
            "h-12 w-12 rounded-xl",
            "bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg",
            "text-slate-700 dark:text-slate-300",
            "shadow-lg shadow-slate-900/10 dark:shadow-black/20",
            "border border-slate-200/60 dark:border-slate-700/60",
            "transition-all duration-200 ease-in-out",
            "hover:bg-white dark:hover:bg-slate-800 hover:scale-105",
            "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
            mobileSidebarOpen && "rotate-90 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
          )}
          aria-label={mobileSidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileSidebarOpen}
          aria-controls="sidebar"
          size="icon"
          variant="ghost"
        >
          {mobileSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      )}

      {/* Main content area */}
      <main
        id="main-content"
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out"
        )}
        // Use CSS variable injected by Sidebar for consistent spacing
        style={{ marginLeft: isMobile ? 0 : "var(--sidebar-width, 72px)" }}
        tabIndex={-1}
      >
        {/* Content wrapper with proper centering and responsive padding */}
        <div className={cn(
          "w-full min-h-screen",
          "p-4 sm:p-6 lg:p-8",
          // Ensure content doesn't get too wide on large screens
          "max-w-none"
        )}>
          {/* Inner content container for proper centering */}
          <div className="w-full h-full">
            {children}
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  );
}
