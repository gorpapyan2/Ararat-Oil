import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/shared/utils";
import { useAuth } from "@/features/auth";
import { 
  Compass, 
  LogOut,
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
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      id: 'navigation',
      label: 'Navigation',
      path: '/dashboard/navigation',
      icon: Compass,
      color: 'from-purple-500 to-purple-600',
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
          "bg-slate-900/98 backdrop-blur-xl border-r border-slate-700/50",
          "shadow-2xl shadow-black/20",
          "w-20", // Always collapsed width
          // Mobile positioning
          isMobile && "fixed top-0 left-0",
          isMobile && !isOpen && "-translate-x-full"
        )}
        id="sidebar"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="h-24 flex items-center px-6 border-b border-slate-700/50 bg-slate-800/30">
          <div className="w-full flex justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">AO</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {navItems.map((item, index) => {
              const isActive = isActivePath(item.path);
              const Icon = item.icon;

              return (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className="w-full group transition-all duration-300 ease-in-out flex items-center gap-4"
                    title={item.label}
                  >
                    <div className={cn(
                      "relative flex items-center w-full rounded-2xl transition-all duration-300 ease-in-out transform",
                      "p-3 justify-center",
                      "bg-slate-800/30 backdrop-blur-sm border border-slate-700/40",
                      "hover:bg-slate-700/40 hover:border-slate-600/60 hover:shadow-xl hover:shadow-purple-500/10",
                      "group-hover:scale-[1.02]",
                      isActive && "bg-gradient-to-r from-purple-500/20 to-purple-500/20 border-purple-500/50 shadow-xl shadow-purple-500/20"
                    )}>
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-400 to-purple-600 rounded-r-full"></div>
                      )}

                      {/* Icon */}
                      <div className={cn(
                        "relative flex items-center justify-center rounded-xl shadow-lg transition-all duration-300",
                        "w-8 h-8",
                        `bg-gradient-to-br ${item.color}`,
                        isActive && "scale-110 shadow-2xl",
                        "group-hover:scale-105"
                      )}>
                        <Icon className={cn(
                          "text-white transition-all duration-300",
                          "w-4 h-4",
                          isActive && "drop-shadow-sm"
                        )} />
                        
                        {/* Subtle glow effect */}
                        <div className={cn(
                          "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
                          `bg-gradient-to-br ${item.color}`,
                          "group-hover:opacity-20"
                        )}></div>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer - Logout */}
        <div className="border-t border-slate-700/50 p-6 bg-slate-800/20">
          <button
            onClick={logout}
            className="w-full group transition-all duration-300 flex items-center gap-4"
            title="Sign Out"
          >
            <div className={cn(
              "flex items-center w-full rounded-2xl transition-all duration-300 transform",
              "p-3 justify-center",
              "bg-red-500/10 backdrop-blur-sm border border-red-500/30",
              "hover:bg-red-500/20 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/20",
              "group-hover:scale-[1.02]"
            )}>
              {/* Icon */}
              <div className={cn(
                "flex items-center justify-center rounded-xl shadow-lg transition-all duration-300",
                "w-8 h-8",
                "bg-gradient-to-br from-red-500 to-red-600",
                "group-hover:scale-105"
              )}>
                <LogOut className="text-white w-4 h-4" />
              </div>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}
