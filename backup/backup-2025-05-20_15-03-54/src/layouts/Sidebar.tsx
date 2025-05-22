import { cn } from "@/lib/utils";
import { useAuth } from '@/features/auth';
import { SidebarLogo } from "@/shared/components/sidebar/SidebarLogo";
import { SidebarNavSection, type NavItemConfig } from "@/shared/components/sidebar/SidebarNavSection";
import { SidebarFooter } from "@/shared/components/sidebar/SidebarFooter";
import { useSidebarNavConfig } from "@/core/config";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeSwitcher } from '@/core/components/ui/ThemeSwitcher';
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  isMobile?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({
  collapsed: externalCollapsed,
  onToggleCollapse,
  isMobile = false,
  isOpen,
  onToggle,
}: SidebarProps) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navConfig = useSidebarNavConfig();

  const collapsed = externalCollapsed !== undefined ? externalCollapsed : false;
  
  // Store expanded sections to localStorage
  const [expandedSections, setExpandedSections] = useLocalStorage<Record<string, boolean>>(
    "sidebarExpandedSections", 
    {}
  );

  // Toggle expanded section
  const handleToggleSection = (path: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };
  
  // Reset expanded sections on mobile when sidebar closes
  useEffect(() => {
    if (isMobile && !isOpen) {
      // Wait for animation to complete
      const timer = setTimeout(() => {
        setExpandedSections({});
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isMobile, isOpen, setExpandedSections]);

  // Animation variants
  const sidebarVariants = {
    expanded: { width: "240px" },
    collapsed: { width: "70px" }
  };
  
  return (
    <motion.aside
      className={cn(
        "flex flex-col border-r bg-card/50 backdrop-blur supports-backdrop-filter:bg-background/60",
        "fixed top-0 left-0 h-screen z-30 transition-colors duration-300",
        isMobile && "z-50 shadow-lg",
        isMobile && !isOpen && "transform -translate-x-full",
      )}
      role="navigation"
      aria-label={t("common.mainNavigation")}
      initial={false}
      animate={collapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
    >
      <SidebarLogo collapsed={collapsed} />

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {Object.entries(navConfig).map(([section, items]) => (
            <motion.div
              key={section}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SidebarNavSection
                title={t(`common.${section}`)}
                items={items as NavItemConfig[]}
                collapsed={collapsed}
                expandedSections={expandedSections}
                onToggleSection={handleToggleSection}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="bg-card/50 backdrop-blur supports-backdrop-filter:bg-background/60 border-t">
        {/* Theme switcher */}
        <div className={cn(
          "flex items-center p-3", 
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <span className="text-sm text-muted-foreground">
              {t("common.theme")}
            </span>
          )}
          <ThemeSwitcher variant="outline" />
        </div>
      </div>

      <SidebarFooter
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse ?? (() => {})}
        onSignOut={logout}
      />
    </motion.aside>
  );
}
