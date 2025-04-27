import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { SidebarLogo } from "@/components/sidebar/SidebarLogo";
import { SidebarNavSection } from "@/components/sidebar/SidebarNavSection";
import { SidebarFooter } from "@/components/sidebar/SidebarFooter";
import { useSidebarNavConfig } from "@/config/sidebarNav";
import { useTranslation } from "react-i18next";

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
  const { signOut } = useAuth();
  const navConfig = useSidebarNavConfig();

  const collapsed = externalCollapsed !== undefined ? externalCollapsed : false;

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "fixed top-0 left-0 h-screen z-30 transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]",
        isMobile && "z-50 shadow-lg",
        isMobile && !isOpen && "transform -translate-x-full",
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <SidebarLogo collapsed={collapsed} />

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <SidebarNavSection
          title={t("common.overview")}
          items={navConfig.overview}
          collapsed={collapsed}
        />
        <SidebarNavSection
          title={t("common.salesFinance")}
          items={navConfig.salesFinance}
          collapsed={collapsed}
        />
        <SidebarNavSection
          title={t("common.management")}
          items={navConfig.management}
          collapsed={collapsed}
        />
      </div>

      <SidebarFooter
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse ?? (() => {})}
        onSignOut={signOut}
      />
    </aside>
  );
}
