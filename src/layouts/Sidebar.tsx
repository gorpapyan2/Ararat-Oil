import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/shared/utils";
import { useAuth } from "@/features/auth";
import { useSidebarNavConfig } from "@/core/config";
import { useLocalStorage } from "@/hooks";
import { Button } from "@/core/components/ui/button";
import { ThemeSwitcher } from "@/core/components/ui/ThemeSwitcher";
import { 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Home,
  Settings, 
  LogOut,
  User,
  Bell,
  HelpCircle,
  Search,
  Zap,
  Activity,
  BarChart3,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";
import type { NavItemConfig } from "@/shared/components/sidebar/SidebarNavSection";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({
  collapsed: externalCollapsed = false,
  onToggleCollapse,
  isMobile = false,
  isOpen = false,
  onToggle,
}: SidebarProps) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navConfig = useSidebarNavConfig();
  
  const [hovering, setHovering] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const sidebarRef = useRef<HTMLElement>(null);
  
  // Enhanced localStorage management
  const [expandedSections, setExpandedSections] = useLocalStorage<Record<string, boolean>>(
    "sidebar-expanded-sections", 
    {}
  );

  // Determine if sidebar should be expanded
  const isCollapsed = isMobile ? !isOpen : externalCollapsed;
  const shouldShowExpanded = isMobile ? isOpen : (!externalCollapsed || hovering);

  // Handle section toggle
  const handleToggleSection = (path: string) => {
    if (!shouldShowExpanded) return;
    setExpandedSections(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // Navigation handler
  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && onToggle) {
      onToggle();
    }
  };

  // Check if current path is active
  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Enhanced hover handlers
  const handleMouseEnter = () => {
    if (!isMobile) {
      setHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setHovering(false);
    }
  };

  // Update CSS variable for sidebar width so layout can respond dynamically
  useEffect(() => {
    const width = isMobile ? 0 : shouldShowExpanded ? 280 : 72;
    document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
  }, [shouldShowExpanded, isMobile]);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (isMobile && isOpen && onToggle) {
      onToggle();
    }
  }, [location.pathname]);

  // Animation variants
  const sidebarVariants = {
    expanded: {
      width: 280,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8
      }
    },
    collapsed: {
      width: isMobile ? 280 : 72,
      x: isMobile ? -280 : 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
        mass: 0.8
      }
    }
  };

  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1,
        duration: 0.2
      }
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.15
      }
    }
  };

  // Recursive navigation item renderer
  const renderNavItem = (item: NavItemConfig, level = 0) => {
    const isActive = isActivePath(item.to);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections[item.to];
    const Icon = item.icon;

    return (
      <div key={item.to} className="space-y-1">
        <motion.div
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "group relative flex items-center rounded-lg transition-all duration-200",
            level === 0 ? "mx-2" : "mx-2 ml-6",
            shouldShowExpanded ? "px-3 py-2.5" : "px-2 py-2.5 justify-center",
            isActive 
              ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-500/20" 
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100",
            "cursor-pointer select-none"
          )}
          onClick={() => {
            if (hasChildren) {
              handleToggleSection(item.to);
            } else if (item.to) {
              handleNavigate(item.to);
            }
          }}
        >
          {/* Icon */}
          <div className={cn(
            "flex-shrink-0 flex items-center justify-center",
            shouldShowExpanded ? "w-5 h-5" : "w-6 h-6"
          )}>
            {Icon && <Icon className="w-full h-full" />}
          </div>

          {/* Text and Expand Icon */}
          <AnimatePresence>
            {shouldShowExpanded && (
              <motion.div
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={contentVariants}
                className="flex items-center justify-between flex-1 min-w-0 ml-3"
              >
                <span className="font-medium text-sm truncate">
                  {item.label}
                </span>
                
                {hasChildren && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0 ml-2"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tooltip for collapsed state */}
          {!shouldShowExpanded && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {item.label}
              <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-r-4 border-r-slate-900 dark:border-r-slate-700 border-y-4 border-y-transparent" />
            </div>
          )}

          {/* Active indicator */}
          {isActive && (
            <motion.div
              layoutId="sidebar-active-indicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </motion.div>

        {/* Children */}
        <AnimatePresence>
          {hasChildren && isExpanded && shouldShowExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-1 pl-4">
                {item.children?.map(child => renderNavItem(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        ref={sidebarRef}
        className={cn(
          "fixed top-0 left-0 h-screen z-50",
          "bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg",
          "border-r border-slate-200/60 dark:border-slate-800/60",
          "shadow-xl shadow-slate-900/5 dark:shadow-black/20",
          "select-none"
        )}
        initial={false}
        animate={shouldShowExpanded ? "expanded" : "collapsed"}
        variants={sidebarVariants}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header */}
        <div className="relative h-16 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30">
          <AnimatePresence mode="wait">
            {shouldShowExpanded ? (
              <motion.div
                key="expanded-header"
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={contentVariants}
                className="flex items-center gap-3 px-4"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <span className="text-white font-bold text-lg">AO</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                    <Zap className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="font-bold text-slate-900 dark:text-white text-lg truncate">
                    Ararat Oil
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Management System
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-header"
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={contentVariants}
                className="flex items-center justify-center w-full"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <span className="text-white font-bold text-lg">AO</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                    <Zap className="w-2 h-2 text-white" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle button */}
          {!isMobile && shouldShowExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute top-1/2 -right-3 -translate-y-1/2"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleCollapse?.(!externalCollapsed)}
                className="w-6 h-6 p-0 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-200"
              >
                {externalCollapsed ? (
                  <PanelLeft className="w-3 h-3" />
                ) : (
                  <PanelLeftClose className="w-3 h-3" />
                )}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {shouldShowExpanded && (
            <motion.div
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              variants={contentVariants}
              className="p-3 border-b border-slate-200/60 dark:border-slate-800/60"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <div className="space-y-6">
            {Object.entries(navConfig).map(([sectionKey, items], index) => (
              <div key={sectionKey} className="space-y-2">
                {/* Section Header */}
                <AnimatePresence>
                  {shouldShowExpanded && (
                    <motion.div
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      variants={contentVariants}
                      className="px-4 py-1"
                    >
                      <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {t(`common.${sectionKey}`)}
                      </h2>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Section Items */}
                <div className="space-y-1">
                  {(items as NavItemConfig[]).map(item => renderNavItem(item))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="border-t border-slate-200/60 dark:border-slate-800/60 p-3 bg-slate-50/30 dark:bg-slate-800/20">
          <AnimatePresence mode="wait">
            {shouldShowExpanded ? (
              <motion.div
                key="expanded-user"
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={contentVariants}
                className="space-y-3"
              >
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group">
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white dark:border-slate-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                      John Doe
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Station Manager
                    </p>
                  </div>
                  <Bell className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 justify-start text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                    onClick={() => handleNavigate('/settings')}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-user"
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={contentVariants}
                className="flex flex-col items-center gap-2"
              >
                <div className="relative">
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-white dark:border-slate-900" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200/60 dark:border-slate-800/60 p-3 space-y-3">
          {/* Theme Switcher */}
          <div className={cn(
            "flex items-center transition-all duration-200",
            shouldShowExpanded ? "justify-between" : "justify-center"
          )}>
            <AnimatePresence>
              {shouldShowExpanded && (
                <motion.span
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  variants={contentVariants}
                  className="text-sm font-medium text-slate-600 dark:text-slate-400"
                >
                  Theme
                </motion.span>
              )}
            </AnimatePresence>
            <ThemeSwitcher variant="outline" size="sm" />
          </div>

          {/* Logout */}
          <Button
            onClick={logout}
            variant="ghost"
            size="sm"
            className={cn(
              "w-full transition-all duration-200",
              "text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-500/10",
              shouldShowExpanded ? "justify-start" : "justify-center px-0"
            )}
          >
            <LogOut className="w-4 h-4" />
            <AnimatePresence>
              {shouldShowExpanded && (
                <motion.span
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                  variants={contentVariants}
                  className="ml-2 font-medium"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </motion.aside>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgb(203 213 225) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(203 213 225);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(148 163 184);
        }
        
        .dark .custom-scrollbar {
          scrollbar-color: rgb(71 85 105) transparent;
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(71 85 105);
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgb(100 116 139);
        }
      `}</style>
    </>
  );
}
