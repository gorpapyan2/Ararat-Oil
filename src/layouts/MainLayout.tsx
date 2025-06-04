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

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile && mobileSidebarOpen) {
      setMobileSidebarOpen(false);
    }
  }, [pathname, isMobile, mobileSidebarOpen]);

  // Fixed sidebar width (always collapsed)
  const sidebarWidth = isMobile ? 0 : 80;

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

      {/* CSS Grid Layout Container */}
      <div 
        className={cn(
          "min-h-screen grid transition-all duration-300 ease-in-out",
          isMobile ? "grid-cols-1" : `grid-cols-[${sidebarWidth}px_1fr]`
        )}
        style={{
          gridTemplateColumns: isMobile ? "1fr" : `${sidebarWidth}px 1fr`
        }}
      >
        {/* Sidebar - Grid Area 1 */}
        <div 
          className={cn(
            "relative",
            isMobile ? "fixed inset-y-0 left-0 z-50" : "z-10"
          )}
        >
          <Sidebar
            isMobile={isMobile}
            isOpen={mobileSidebarOpen}
            onToggle={toggleMobileSidebar}
          />
        </div>

        {/* Main Content Area - Grid Area 2 */}
        <main
          id="main-content"
          className={cn(
            "relative z-0 flex flex-col min-h-screen overflow-hidden",
            // Ensure content is positioned correctly
            isMobile ? "col-span-1" : "col-start-2"
          )}
          tabIndex={-1}
        >
          {/* Mobile menu toggle button - Positioned relative to main content */}
          {isMobile && (
            <Button
              onClick={toggleMobileSidebar}
              className={cn(
                "absolute top-6 left-6 z-20 md:hidden",
                "flex items-center justify-center",
                "h-12 w-12 rounded-2xl",
                "bg-slate-900/90 backdrop-blur-xl",
                "text-white",
                "shadow-2xl shadow-black/30",
                "border border-slate-700/50",
                "transition-all duration-300 ease-in-out",
                "hover:bg-slate-800/90 hover:scale-105",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                mobileSidebarOpen && "rotate-180 bg-blue-600/90 border-blue-500/50"
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

          {/* Content wrapper with proper padding and overflow handling */}
          <div className={cn(
            "flex-1 w-full h-full relative",
            "p-6 sm:p-8 lg:p-10",
            // Add padding-top on mobile to account for menu button
            isMobile && "pt-20"
          )}>
            {/* Inner content container */}
            <div className="w-full h-full relative z-0">
              {children}
            </div>

            {/* Overlay elements container - Always visible, proper z-index */}
            <div className="absolute inset-0 pointer-events-none z-30">
              {/* This is where prompt cursors, tooltips, etc. would go */}
              {/* They will always be above content but below modals */}
            </div>
          </div>
        </main>
      </div>

      {/* Toast notifications - Highest z-index */}
      <Toaster />
    </div>
  );
}
