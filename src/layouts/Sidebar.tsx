import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/shared/utils";
import { 
  Compass, 
} from "lucide-react";

interface SidebarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  description?: string;
}

export function Sidebar({
  isMobile = false,
  isOpen = false,
  onToggle,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      id: 'navigation',
      label: 'Navigation',
      path: '/dashboard/navigation',
      icon: Compass,
      color: '#6366f1',
      description: 'Business modules'
    }
  ];

  // Handle navigation
  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && onToggle) {
      onToggle();
    }
  };

  // Check if current path is active
  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Don't show on mobile when closed
  if (isMobile && !isOpen) {
    return null;
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "h-screen z-50 transition-all duration-300 ease-in-out flex flex-col",
          "bg-gradient-to-b from-slate-800 via-slate-850 to-slate-900",
          "border-r border-slate-700/50 shadow-2xl",
          "backdrop-blur-sm bg-opacity-95",
          "w-20", // Always collapsed width
          // Mobile positioning
          isMobile && "fixed top-0 left-0",
          isMobile && !isOpen && "-translate-x-full"
        )}
        id="sidebar"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-center border-b border-slate-700/50 bg-slate-800/30 relative">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="text-white font-bold text-lg drop-shadow-sm">AO</span>
          </div>
          
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {navItems.map((item) => {
              const isActive = isActivePath(item.path);
              const Icon = item.icon;

              return (
                <div key={item.id} className="group">
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className={cn(
                      "w-full transition-all duration-500 ease-out",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-2xl"
                    )}
                    title={item.label}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-full rounded-2xl transition-all duration-500 transform",
                      "p-4 backdrop-blur-sm relative overflow-hidden",
                      "border border-slate-600/30",
                      isActive 
                        ? "bg-blue-500/20 border-blue-400/50 shadow-xl shadow-blue-500/20 scale-105"
                        : "bg-slate-700/20 hover:bg-slate-600/30 hover:border-slate-500/50 hover:shadow-lg hover:-translate-y-1 hover:scale-105",
                      "group-hover:backdrop-blur-md"
                    )}>
                      {/* Icon Container */}
                      <div className={cn(
                        "flex items-center justify-center rounded-xl w-8 h-8 transition-all duration-500",
                        "shadow-lg relative z-10",
                        isActive 
                          ? "bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-blue-500/40 scale-110"
                          : "bg-gradient-to-br from-slate-600 to-slate-700 text-slate-300 group-hover:from-slate-500 group-hover:to-slate-600 group-hover:scale-110"
                      )}>
                        <Icon className="w-4 h-4 drop-shadow-sm" />
                        
                        {/* Subtle inner glow */}
                        {isActive && (
                          <div className="absolute inset-0 rounded-xl bg-blue-300 opacity-20 blur-sm" />
                        )}
                      </div>

                      {/* Background glow effect */}
                      <div className={cn(
                        "absolute inset-0 rounded-2xl transition-opacity duration-500 blur-md",
                        isActive 
                          ? "bg-gradient-to-br from-blue-500/20 to-transparent opacity-100"
                          : "bg-gradient-to-br from-slate-500/10 to-transparent opacity-0 group-hover:opacity-100"
                      )} />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
