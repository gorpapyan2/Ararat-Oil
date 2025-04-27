import { NavItem } from "@/components/ui/nav-item";
import { SidebarSection } from "@/components/ui/sidebar-section";
import { useLocation } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface NavItemConfig {
  to: string;
  icon: LucideIcon;
  label: string;
}

interface SidebarNavSectionProps {
  title?: string;
  items: NavItemConfig[];
  collapsed: boolean;
}

export function SidebarNavSection({
  title,
  items,
  collapsed,
}: SidebarNavSectionProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarSection title={collapsed ? undefined : title} collapsed={collapsed}>
      {items.map((item) => (
        <NavItem
          key={item.to}
          to={item.to}
          icon={<item.icon size={20} />}
          label={item.label}
          active={isActive(item.to)}
          collapsed={collapsed}
        />
      ))}
    </SidebarSection>
  );
}
