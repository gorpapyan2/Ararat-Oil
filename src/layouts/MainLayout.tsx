import React, { useState, useEffect } from "react";
import { Sidebar } from "@/layouts/Sidebar";
import { useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { SkipToContent } from "@/components/ui/skip-to-content";
import { useIsMobile } from "@/hooks/useResponsive";

type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/auth";
  const isMobile = useIsMobile();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    return savedState ? JSON.parse(savedState) : false;
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(sidebarCollapsed));
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
  }, [pathname, isMobile]);

  // Use a different layout for the auth page
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-background">
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

  // Calculate sidebar width for main content margin
  const sidebarWidth = sidebarCollapsed ? 70 : 240;

  return (
    <>
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
            "fixed top-4 left-4 z-50 md:hidden",
            "flex items-center justify-center",
            "h-10 w-10 rounded-full",
            "bg-primary text-primary-foreground",
            "shadow-lg shadow-primary/20",
            "border-2 border-primary-foreground/10",
            "transition-all duration-200 ease-in-out",
            "hover:bg-primary/90 hover:scale-105",
            "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background",
            mobileSidebarOpen && "bg-background text-foreground rotate-90",
          )}
          aria-label={mobileSidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileSidebarOpen}
          aria-controls="sidebar"
          size="icon"
          variant="outline"
        >
          {mobileSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      )}

      {/* Overlay for mobile sidebar */}
      {isMobile && mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          aria-hidden="true"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main content area - updated to remove header padding */}
      <main
        id="main-content"
        className="min-h-screen overflow-auto transition-all duration-300"
        style={{
          marginLeft: !isMobile ? `${sidebarWidth}px` : "0px",
        }}
        role="main"
        tabIndex={-1}
      >
        <div className="container mx-auto py-6 px-4 md:px-6">{children}</div>
      </main>

      <Toaster />
    </>
  );
}
