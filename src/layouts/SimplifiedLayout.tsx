import React, { useState } from "react";
import { cn } from "@/shared/utils";
import { Button } from "@/core/components/ui/button";
import { Menu, X } from "lucide-react";
import { useMediaQuery } from "@/shared/hooks/useResponsive";
import { SimplifiedSidebar } from "./SimplifiedSidebar";

interface SimplifiedLayoutProps {
  children: React.ReactNode;
}

export function SimplifiedLayout({ children }: SimplifiedLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleToggleCollapse = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  const handleToggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      {/* Sidebar */}
      <SimplifiedSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
        isMobile={isMobile}
        isOpen={mobileSidebarOpen}
        onToggle={handleToggleMobileSidebar}
      />

      {/* Mobile overlay */}
      {isMobile && mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleToggleMobileSidebar}
        />
      )}

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-200 ease-in-out",
          isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {/* Top bar for mobile */}
        {isMobile && (
          <header className="h-16 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50 flex items-center px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleMobileSidebar}
              className="mr-4 text-gray-300 hover:text-white hover:bg-gray-800/50"
            >
              {mobileSidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <h1 className="text-lg font-semibold text-white">
              Ararat Oil
            </h1>
          </header>
        )}

        {/* Page content */}
        <main
          id="main-content"
          className={cn(
            "min-h-screen p-6",
            isMobile && "pt-0"
          )}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 