import { NavItem } from "@/core/components/ui/nav-item";
import { SidebarSection } from "@/core/components/ui/sidebar-section";
import { useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createFocusTrap } from "focus-trap";
import { motion } from "framer-motion";

export interface NavItemConfig {
  to: string;
  icon: React.ElementType;
  label: string;
  children?: NavItemConfig[];
}

interface SidebarNavSectionProps {
  title?: string;
  items: NavItemConfig[];
  collapsed: boolean;
  expandedSections?: Record<string, boolean>;
  onToggleSection?: (path: string) => void;
}

export function SidebarNavSection({
  title,
  items,
  collapsed,
  expandedSections = {},
  onToggleSection,
}: SidebarNavSectionProps) {
  const location = useLocation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [focusWithinSection, setFocusWithinSection] = useState(false);

  // Set up keyboard navigation for the section
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || collapsed) return;

    // Focus trap for keyboard navigation
    const trap = createFocusTrap(section, {
      allowOutsideClick: true,
      escapeDeactivates: true,
      returnFocusOnDeactivate: true,
      fallbackFocus: section,
      clickOutsideDeactivates: true,
      initialFocus: false,
    });

    if (focusWithinSection) {
      trap.activate();
    } else {
      trap.deactivate();
    }

    return () => {
      trap.deactivate();
    };
  }, [focusWithinSection, collapsed]);

  const isActive = (path: string) => location.pathname === path;
  const isActiveParent = (path: string) =>
    location.pathname.startsWith(path) && path !== "/";

  const handleSectionFocus = () => setFocusWithinSection(true);
  const handleSectionBlur = (e: React.FocusEvent) => {
    // Only unfocus if focus moved outside the section
    if (!sectionRef.current?.contains(e.relatedTarget as Node)) {
      setFocusWithinSection(false);
    }
  };

  // Stagger animation variants for menu items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.02,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -5 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <SidebarSection title={collapsed ? undefined : title} collapsed={collapsed}>
      <div
        ref={sectionRef}
        onFocus={handleSectionFocus}
        onBlur={handleSectionBlur}
        role="menu"
        tabIndex={-1}
        className="space-y-0.5"
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-0.5"
        >
          {items.map((item) => {
            const itemActive = isActive(item.to);
            const parentActive = item.children && isActiveParent(item.to);
            const isExpanded = item.children
              ? expandedSections[item.to] || parentActive
              : false;

            return (
              <motion.div
                key={item.to}
                variants={{
                  hidden: { opacity: 0, x: -5 },
                  show: { opacity: 1, x: 0 },
                }}
              >
                <NavItem
                  to={item.to}
                  icon={<item.icon size={20} />}
                  label={item.label}
                  active={itemActive}
                  hasActiveChild={parentActive}
                  collapsed={collapsed}
                  onClick={
                    item.children && onToggleSection
                      ? () => onToggleSection(item.to)
                      : undefined
                  }
                >
                  {item.children && !collapsed && (
                    <span className="ml-auto">
                      <motion.svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-muted-foreground"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M6 12l4-4-4-4"
                        />
                      </motion.svg>
                    </span>
                  )}
                </NavItem>

                {item.children && !collapsed && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pl-6 mt-1 ml-2 border-l space-y-1"
                  >
                    {item.children.map((child) => (
                      <NavItem
                        key={child.to}
                        to={child.to}
                        icon={<child.icon size={18} />}
                        label={child.label}
                        active={isActive(child.to)}
                        collapsed={collapsed}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </SidebarSection>
  );
}
