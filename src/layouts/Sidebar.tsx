import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavItem } from "@/components/ui/nav-item";
import {
  IconDashboard,
  IconGasStation,
  IconTank,
  IconReportAnalytics,
  IconTruckDelivery,
  IconSettings,
  IconLogout,
  IconChevronLeft,
  IconChevronRight,
  IconCurrencyDollar,
  IconUsers,
  IconTruck,
  IconChartBar,
  IconTools,
  IconReceipt2,
  IconChecklist,
  IconDatabase,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  collapsed?: boolean;
  onNavItemClick?: () => void;
  onToggleCollapse?: (collapsed: boolean) => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

// Interface for creating navigation sections
interface NavSection {
  title: string;
  items: NavItem[];
}

// Interface for navigation items
interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

export function Sidebar({ 
  collapsed: externalCollapsed, 
  onNavItemClick,
  onToggleCollapse,
  isMobile = false,
  isOpen,
  onToggle
}: SidebarProps = {}) {
  const { t } = useTranslation();
  const sidebarRef = useRef<HTMLElement>(null);
  
  // Initialize state from localStorage or default to false
  const [internalCollapsed, setInternalCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  
  const location = useLocation();
  const { signOut } = useAuth();
  
  // Use external collapsed state if provided, otherwise use internal state
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;

  // Save internal state to localStorage when it changes
  useEffect(() => {
    if (externalCollapsed === undefined) {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(internalCollapsed));
    }
  }, [internalCollapsed, externalCollapsed]);

  // Handle keyboard events for the sidebar toggle
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSidebar();
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => {
    if (externalCollapsed !== undefined && onToggleCollapse) {
      // If external state is managed, call the parent's toggle function
      onToggleCollapse(!externalCollapsed);
    } else {
      // Otherwise use internal state
      setInternalCollapsed(!internalCollapsed);
    }
    
    // For mobile compatibility
    if (onToggle) {
      onToggle();
    }
  };

  const handleNavItemClick = (to: string) => {
    if (onNavItemClick) {
      onNavItemClick();
    }
  };

  // Organized navigation sections
  const navSections: NavSection[] = [
    {
      title: t("common.overview"),
      items: [
        {
          to: "/",
          label: t("common.dashboard"),
          icon: <IconDashboard size={20} />,
        },
        {
          to: "/todo",
          label: "Todo List",
          icon: <IconChecklist size={20} />,
        },
      ]
    },
    {
      title: t("common.operations"),
      items: [
        {
          to: "/filling-systems",
          label: t("common.fillingSystems"),
          icon: <IconGasStation size={20} />,
        },
        {
          to: "/tanks",
          label: t("common.tanks"),
          icon: <IconTank size={20} />,
        },
        {
          to: "/fuel-supplies",
          label: t("common.fuelSupplies"),
          icon: <IconTruck size={20} />,
        },
      ]
    },
    {
      title: t("common.salesFinance"),
      items: [
        {
          to: "/sales",
          label: t("common.sales"),
          icon: <IconCurrencyDollar size={20} />,
        },
        {
          to: "/shifts",
          label: t("common.shifts"),
          icon: <IconChartBar size={20} />,
        },
        {
          to: "/expenses",
          label: t("common.expenses"),
          icon: <IconReceipt2 size={20} />,
        },
      ]
    },
    {
      title: t("common.management"),
      items: [
        {
          to: "/employees",
          label: t("common.employees"),
          icon: <IconUsers size={20} />,
        },
        {
          to: "/reports",
          label: t("common.reports"),
          icon: <IconReportAnalytics size={20} />,
        },
      ]
    },
    {
      title: t("common.system"),
      items: [
        {
          to: "/unified-data",
          label: t("common.unifiedData"),
          icon: <IconDatabase size={20} />,
        },
        {
          to: "/settings",
          label: t("common.settings"),
          icon: <IconSettings size={20} />,
        },
      ]
    }
  ];

  // Function to render a navigation item with tooltip if collapsed
  const renderNavItem = (item: NavItem) => {
    if (collapsed && !isMobile) {
      return (
        <TooltipProvider key={item.to}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div onClick={() => handleNavItemClick(item.to)}>
                <NavItem
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  active={isActive(item.to)}
                  collapsed={collapsed}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              {item.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return (
      <div key={item.to} onClick={() => handleNavItemClick(item.to)}>
        <NavItem
          to={item.to}
          icon={item.icon}
          label={item.label}
          active={isActive(item.to)}
          collapsed={collapsed}
        />
      </div>
    );
  };

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
        "h-screen fixed top-0 left-0", // Fixed position to viewport
        collapsed ? "w-[70px]" : "w-[240px]",
        isMobile && "z-50 shadow-lg",
        isMobile && !isOpen && "transform -translate-x-full"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Fixed header */}
      <div className="flex items-center justify-between p-4 border-b shrink-0 bg-muted/30">
        {!collapsed ? (
          <div className="text-xl font-bold text-foreground">Ararat Oil</div>
        ) : (
          <div className="w-full flex justify-center">
            <span className="text-accent font-bold text-lg">AO</span>
          </div>
        )}
        
        {/* Mobile close button in header */}
        {isMobile && isOpen && (
          <button
            onClick={onToggle}
            className="p-1 -mr-1 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="Close sidebar"
          >
            <IconChevronLeft className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {/* Scrollable navigation area */}
      <nav className="flex-1 overflow-y-auto py-4 no-scrollbar">
        {navSections.map((section, index) => (
          <div key={index} className="mb-4">
            {/* Section heading - only show when not collapsed */}
            {!collapsed && (
              <div className="px-4 mb-1">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
            )}
            
            {/* Section items */}
            <div className="space-y-1 px-2">
              {section.items.map(renderNavItem)}
            </div>
            
            {/* Divider - show for all sections except the last one */}
            {index < navSections.length - 1 && (
              <div className="h-px bg-border mx-2 my-2" />
            )}
          </div>
        ))}
      </nav>
      
      {/* Fixed footer with controls - always at bottom */}
      <div className="p-4 border-t shrink-0 bg-background">
        {/* Collapse/Expand button with keyboard support and improved touch target */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-center p-2 h-auto min-h-[44px]",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          )}
          onClick={toggleSidebar}
          onKeyDown={handleKeyDown}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          aria-controls={sidebarRef.current?.id || "sidebar-content"}
        >
          {collapsed ? (
            <IconChevronRight className="h-5 w-5" />
          ) : (
            <>
              <IconChevronLeft className="h-5 w-5 mr-2" />
              <span>{t("common.collapse")}</span>
            </>
          )}
        </Button>
        
        {/* Logout button */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-red-500 hover:text-red-700 hover:bg-red-50 mt-4 w-full justify-center p-2 h-auto min-h-[44px]",
            "focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          )}
          onClick={signOut}
          aria-label={t("auth.signOut")}
        >
          {collapsed ? (
            <IconLogout className="h-5 w-5" />
          ) : (
            <>
              <IconLogout className="h-5 w-5 mr-2" />
              <span>{t("auth.signOut")}</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
