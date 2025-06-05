import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/shared/utils";
import { useAuth } from "@/features/auth";
import { useTheme } from "@/core/hooks/useTheme";
import { 
  Compass, 
  LogOut,
  Sun,
  Moon,
  Monitor,
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
  const { theme, setTheme } = useTheme();

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
          "bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700",
          "shadow-lg",
          "w-20", // Always collapsed width
          // Mobile positioning
          isMobile && "fixed top-0 left-0",
          isMobile && !isOpen && "-translate-x-full"
        )}
        id="sidebar"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">AO</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = isActivePath(item.path);
              const Icon = item.icon;

              return (
                <div key={item.id}>
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className={cn(
                      "w-full flex items-center justify-center p-3 rounded-lg transition-colors duration-200",
                      "hover:bg-slate-100 dark:hover:bg-slate-700",
                      isActive 
                        ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" 
                        : "text-slate-600 dark:text-slate-400"
                    )}
                    title={item.label}
                  >
                    <Icon className="w-5 h-5" />
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