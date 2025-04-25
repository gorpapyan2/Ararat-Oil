import React, { useState, useEffect } from "react";
import { Sidebar } from "@/layouts/Sidebar";
import { useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/auth";
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Initialize state from localStorage or default values
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  
  const [sidebarHidden, setSidebarHidden] = useState(() => {
    const savedState = localStorage.getItem('sidebarHidden');
    return savedState ? JSON.parse(savedState) : false;
  });

  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);
  
  useEffect(() => {
    localStorage.setItem('sidebarHidden', JSON.stringify(sidebarHidden));
  }, [sidebarHidden]);

  const toggleSidebarCollapse = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  const toggleSidebarVisibility = () => {
    setSidebarHidden(!sidebarHidden);
  };

  // Use a different layout for the auth page
  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-background">
        <main className="flex min-h-screen flex-col items-center justify-center">
          {children}
        </main>
        <Toaster />
      </div>
    );
  }

  // Regular layout with sidebar for other pages
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out", 
          sidebarCollapsed ? "w-20" : "w-64",
          sidebarHidden ? "hidden" : "hidden md:block"
        )}
      >
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggleCollapse={toggleSidebarCollapse}
        />
      </div>
      
      {/* Mobile Sidebar - Sheet slides in from left */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[85%] max-w-[300px] md:hidden border-0">
          <Sidebar 
            onNavItemClick={() => setMobileSidebarOpen(false)} 
            collapsed={false}
            isMobile={true} 
          />
        </SheetContent>
      </Sheet>
      
      {/* Mobile Menu Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setMobileSidebarOpen(true)}
        className="fixed bottom-4 left-4 z-50 rounded-full shadow-lg md:hidden bg-accent hover:bg-accent/90 text-white"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex-1 overflow-x-hidden transition-all duration-300 ease-in-out">
        <main className="pt-4 container mx-auto px-4 md:py-6 md:px-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
