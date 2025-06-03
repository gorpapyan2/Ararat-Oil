import { LucideIcon } from "lucide-react";
import { BarChart3, Users, Settings, CreditCard, CalendarClock, Database, Bug, Grid3X3 } from "lucide-react";
import {
  IconGasStation,
  IconUser,
  IconReport,
  IconReceipt,
  IconCash,
  IconChartLine,
  IconCoin,
  IconTank,
  type Icon,
} from "@/core/components/ui/icons";
import { useTranslation } from "react-i18next";
import { featuresConfig } from "@/core/config/features";
import type { NavItemConfig } from "@/shared/components/sidebar/SidebarNavSection";
import type { NavigationFeature } from "@/core/types/navigation";
import type React from "react";

/**
 * Hook that provides navigation configuration for the sidebar
 *
 * @returns Object containing navigation sections with their routes
 */
export const useSidebarNavConfig = () => {
  const { t } = useTranslation();

  // Ensure some common sidebar translation keys are registered for extraction
  t("sidebar.expandSidebar", "Expand sidebar");
  t("sidebar.collapseSidebar", "Collapse sidebar");
  t("sidebar.collapse", "Collapse");
  t("sidebar.hasSubmenu", "Has submenu");

  // Helper: recursively build NavItemConfig from NavigationFeature
  const buildNavItem = (feature: NavigationFeature): NavItemConfig => {
    let iconComponent: React.ElementType;

    if (typeof feature.icon === "string") {
      // If the icon is a plain string (emoji), fall back to a default icon
      iconComponent = BarChart3;
    } else if (feature.icon) {
      iconComponent = feature.icon as unknown as React.ElementType;
    } else {
      iconComponent = BarChart3;
    }

    return {
      to: feature.path,
      icon: iconComponent,
      label: feature.title,
      children: feature.children?.map(buildNavItem),
    };
  };

  // Group features by category while preserving optional priority / alphabetical order
  const navSections: Record<string, NavItemConfig[]> = {};

  // Sort features by optional priority then title for consistency
  const sortedFeatures = [...featuresConfig.features].sort((a, b) => {
    const prioDiff = (a.priority ?? 0) - (b.priority ?? 0);
    if (prioDiff !== 0) return prioDiff;
    return a.title.localeCompare(b.title);
  });

  sortedFeatures.forEach((feature) => {
    const sectionKey = feature.category;
    if (!navSections[sectionKey]) navSections[sectionKey] = [];
    navSections[sectionKey].push(buildNavItem(feature));
  });

  // Return generated sections – caller (Sidebar) will iterate via Object.entries()
  return navSections;
};

export interface NavigationItem {
  to: string;
  icon: LucideIcon | Icon;
  label: string;
  children?: NavigationItem[];
}

export const navigationConfig: NavigationItem[] = [
  {
    to: "/dashboard",
    icon: BarChart3,
    label: "dashboard",
  },
  {
    to: "/employees",
    icon: Users,
    label: "employees",
  },
  {
    to: "/fuel-management",
    icon: IconGasStation,
    label: "fuel_management",
    children: [
      {
        to: "/fuel-management/dashboard",
        icon: BarChart3,
        label: "overview",
      },
      {
        to: "/fuel-management/tanks",
        icon: IconTank,
        label: "tanks",
      },
      {
        to: "/fuel-management/providers",
        icon: IconUser,
        label: "providers",
      },
      {
        to: "/fuel-management/filling-systems",
        icon: IconGasStation,
        label: "filling_systems",
      },
      {
        to: "/fuel-management/fuel-supplies",
        icon: IconReceipt,
        label: "fuel_supplies",
      },
    ],
  },
  {
    to: "/sales",
    icon: IconCash,
    label: "sales",
  },
  {
    to: "/finances",
    icon: CreditCard,
    label: "finances",
    children: [
      {
        to: "/finances/reports",
        icon: IconReport,
        label: "reports",
      },
      {
        to: "/finances/profit-loss",
        icon: IconChartLine,
        label: "profit_loss",
      },
      {
        to: "/finances/expenses",
        icon: IconCoin,
        label: "expenses",
      },
      {
        to: "/finances/transactions",
        icon: IconReceipt,
        label: "transactions",
      },
    ],
  },
  {
    to: "/settings",
    icon: Settings,
    label: "settings",
  },
];
