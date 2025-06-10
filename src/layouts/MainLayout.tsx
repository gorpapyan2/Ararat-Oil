import React, { useState, useEffect } from "react";
import { Sidebar } from "@/layouts/Sidebar";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "@/core/components/ui/toast-container";
import { cn } from "@/shared/utils";
import { Button } from "@/core/components/ui/button";
import { Menu, X } from "lucide-react";
import { SkipToContent } from "@/core/components/ui/skip-to-content";
import { useIsMobile } from "@/hooks";
import { Footer } from "@/layouts/Footer";

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
      <div className="min-h-screen bg-gradient-natural">
        <main
          id="main-content"
          className="flex min-h-screen flex-col items-center justify-center"
          tabIndex={-1}
        >
          {children}
        </main>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SkipToContent />

      {/* Fixed Sidebar */}
      {!isMobile && (
        <div className="fixed top-0 left-0 z-50 h-screen">
          <Sidebar
            isMobile={false}
            isOpen={false}
            onToggle={toggleMobileSidebar}
          />
        </div>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          {/* Mobile Overlay */}
          {mobileSidebarOpen && (
            <div 
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden="true"
            />
          )}
          
          {/* Mobile Sidebar */}
          <div 
            className={cn(
              "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out",
              mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <Sidebar
              isMobile={true}
              isOpen={mobileSidebarOpen}
              onToggle={toggleMobileSidebar}
            />
          </div>
        </>
      )}

      {/* Main Content Area */}
      <main
        id="main-content"
        className={cn(
          "relative z-0 flex flex-col min-h-screen",
          "bg-gradient-to-br from-background via-background to-secondary/5",
          "transition-all duration-300",
          // Add left margin for fixed sidebar on desktop
          !isMobile && `ml-[${sidebarWidth}px]`,
          isMobile && "col-span-1"
        )}
        style={{
          marginLeft: !isMobile ? `${sidebarWidth}px` : 0
        }}
        tabIndex={-1}
      >
        {/* Mobile menu toggle button - Positioned relative to main content */}
        {isMobile && (
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
            <div className="flex h-16 items-center px-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileSidebar}
                className="hover:bg-accent hover:text-accent-foreground"
                aria-label="Toggle navigation menu"
              >
                {mobileSidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              
              {/* Mobile header title */}
              <div className="ml-4 flex-1">
                <h1 className="text-lg font-semibold text-foreground">
                  Ararat Oil Management
                </h1>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 relative">
          {children}
        </div>
        
        {/* Toast Container */}
        <ToastContainer />
      </main>
      <Footer />
    </div>
  );
}
