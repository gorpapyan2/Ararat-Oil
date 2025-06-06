import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/shared/utils";
import { 
  Users, 
  DollarSign, 
  Fuel, 
  BarChart3, 
  Settings,
  Moon,
  Sun,
  LogOut,
  Home,
} from "lucide-react";
import { useTheme } from "@/shared/components/ui/theme-provider";
import { useAuth } from "@/core/hooks/useAuth";

const ThemeToggleButton: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  
  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };
  
  return (
    <button
      onClick={cycleTheme}
      className={cn(
        "w-full transition-all duration-200 ease-out group",
        "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card rounded-lg"
      )}
      title={`Theme: ${theme} (click to change)`}
    >
      <div className={cn(
        "flex items-center justify-center w-full rounded-lg transition-all duration-200",
        "p-3 relative hover:bg-gradient-natural-light"
      )}>
        {/* Icon Container */}
        <div className={cn(
          "flex items-center justify-center rounded-lg w-8 h-8 transition-all duration-200 relative",
          "bg-secondary hover:bg-gradient-accent group-hover:scale-105"
        )}>
          {resolvedTheme === 'dark' ? (
            <Moon className="w-4 h-4 text-foreground" />
          ) : (
            <Sun className="w-4 h-4 text-foreground" />
          )}
          {/* System indicator */}
          {theme === 'system' && (
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent animate-pulse" />
          )}
        </div>
      </div>
    </button>
  );
};

const SignOutButton: React.FC = () => {
  const { signOut, isLoading } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  return (
    <button
      onClick={handleSignOut}
      disabled={isLoading}
      className={cn(
        "w-full transition-all duration-200 ease-out group",
        "focus:outline-none focus:ring-2 focus:ring-status-critical focus:ring-offset-2 focus:ring-offset-card rounded-lg",
        "hover:bg-status-critical/10 text-status-critical",
        isLoading && "opacity-50 cursor-not-allowed"
      )}
      title="Sign Out"
    >
      <div className={cn(
        "flex items-center justify-center w-full rounded-lg transition-all duration-200",
        "p-3 relative"
      )}>
        {/* Icon Container */}
        <div className={cn(
          "flex items-center justify-center rounded-lg w-8 h-8 transition-all duration-200",
          "bg-status-critical/10 group-hover:bg-status-critical/20 group-hover:scale-105"
        )}>
          <LogOut className="w-4 h-4" />
        </div>
      </div>
    </button>
  );
};

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
  description?: string;
  color?: string;
}

export function Sidebar({
  isMobile = false,
  isOpen = false,
  onToggle,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items with natural color scheme
  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Dashboard',
      path: '/',
      icon: Home,
      description: 'Main Dashboard',
      color: 'primary'
    },
    {
      id: 'management',
      label: 'Management',
      path: '/management',
      icon: Users,
      description: 'HR & Operations',
      color: 'fuel-premium'
    },
    {
      id: 'finance',
      label: 'Finance',
      path: '/finance',
      icon: DollarSign,
      description: 'Financial Management',
      color: 'fuel-diesel'
    },
    {
      id: 'fuel',
      label: 'Fuel',
      path: '/fuel',
      icon: Fuel,
      description: 'Fuel Operations',
      color: 'status-operational'
    },
    {
      id: 'reports',
      label: 'Reports',
      path: '/reports',
      icon: BarChart3,
      description: 'Business Intelligence',
      color: 'accent'
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/settings',
      icon: Settings,
      description: 'System Configuration',
      color: 'secondary'
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
          "bg-card border-r border-border shadow-lg",
          "w-20", // Always collapsed width - 80px total
          // Mobile specific styles
          isMobile && [
            "fixed top-0 left-0",
            "shadow-2xl bg-card/95 backdrop-blur-md",
            isOpen ? "translate-x-0" : "-translate-x-full"
          ],
          // Desktop specific styles
          !isMobile && [
            "relative bg-card/80 backdrop-blur-sm"
          ]
        )}
        id="sidebar"
        aria-label="Main navigation"
        style={{
          minWidth: '80px',
          maxWidth: '80px',
          flexShrink: 0
        }}
      >
        {/* Logo Header */}
        <div className="h-16 flex items-center justify-center border-b border-border flex-shrink-0 bg-gradient-accent/5">
          <button
            onClick={() => handleNavigate('/')}
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group",
              "bg-gradient-accent hover:bg-gradient-primary",
              "shadow-md hover:shadow-lg hover:scale-105"
            )}
            title="Ararat Oil - Home Dashboard"
          >
            <span className="text-white dark:text-black font-bold text-lg group-hover:scale-110 transition-transform">
              AO
            </span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = isActivePath(item.path);
              const Icon = item.icon;

              return (
                <div key={item.id}>
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className={cn(
                      "w-full transition-all duration-200 ease-out group",
                      "focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card rounded-lg"
                    )}
                    title={`${item.label} - ${item.description}`}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-full rounded-lg transition-all duration-200 relative",
                      "p-3",
                      isActive 
                        ? "bg-gradient-accent shadow-md" 
                        : "hover:bg-gradient-natural-light group-hover:shadow-sm"
                    )}>
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full" />
                      )}
                      
                      {/* Icon Container */}
                      <div className={cn(
                        "flex items-center justify-center rounded-lg w-8 h-8 transition-all duration-200 relative",
                        isActive 
                          ? "bg-white/20 dark:bg-black/20 text-white dark:text-black" 
                          : "bg-secondary text-foreground group-hover:bg-accent/20 group-hover:text-accent group-hover:scale-105"
                      )}>
                        <Icon className="w-4 h-4" />
                        
                        {/* Hover glow effect */}
                        {!isActive && (
                          <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 rounded-lg blur-sm transition-opacity duration-300" />
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with Theme Toggle and Sign Out */}
        <div className="p-3 border-t border-border space-y-2 flex-shrink-0 bg-gradient-natural-light/5">
          <ThemeToggleButton />
          <SignOutButton />
        </div>
      </aside>
    </>
  );
}
