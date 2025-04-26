import { useState, useEffect } from "react";
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
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  collapsed?: boolean;
  onNavItemClick?: () => void;
  onToggleCollapse?: (collapsed: boolean) => void;
  isMobile?: boolean;
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
  isMobile = false
}: SidebarProps = {}) {
  const { t } = useTranslation();
  
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

  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => {
    if (externalCollapsed !== undefined && onToggleCollapse) {
      // If external state is managed, call the parent's toggle function
      onToggleCollapse(!externalCollapsed);
    } else {
      // Otherwise use internal state
      setInternalCollapsed(!internalCollapsed);
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
      className={cn(
        "flex flex-col border-r bg-background h-screen transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed ? (
          <div className="text-xl font-bold text-foreground">Ararat Oil</div>
        ) : (
          <div className="w-full flex justify-center">
            <span className="text-accent font-bold text-lg">AO</span>
          </div>
        )}
      </div>
      
      <nav className="flex-1 py-4 overflow-y-auto">
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
              <div className={cn("mx-3 my-3 h-px bg-border/50", collapsed && "w-10 mx-auto")}></div>
            )}
          </div>
        ))}
      </nav>

      <div className={cn(
        "border-t",
        collapsed ? "py-4 px-2" : "p-4"
      )}>
        {/* When sidebar is collapsed */}
        {collapsed && !isMobile ? (
          <div className="flex flex-col items-center space-y-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={signOut}
                    className="w-10 h-10"
                  >
                    <IconLogout size={20} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {t("common.logout")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <LanguageSwitcher />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {t("common.changeLanguage")}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {!isMobile && externalCollapsed !== undefined && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleSidebar}
                className="rounded-full w-8 h-8"
              >
                <IconChevronRight size={16} />
              </Button>
            )}
          </div>
        ) : (
          /* When sidebar is expanded */
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <IconLogout size={20} className="mr-2" />
              {t("common.logout")}
            </Button>
            
            <div className="flex items-center justify-between">
              <LanguageSwitcher />
              
              {!isMobile && externalCollapsed !== undefined && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleSidebar}
                  className="rounded-full w-8 h-8"
                >
                  <IconChevronLeft size={16} />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
