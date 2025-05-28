import { LucideIcon } from "lucide-react";
import { BarChart3, Users, Settings, CreditCard, CalendarClock, Database, Bug } from "lucide-react";
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

/**
 * Hook that provides navigation configuration for the sidebar
 *
 * @returns Object containing navigation sections with their routes
 */
export const useSidebarNavConfig = () => {
  const { t } = useTranslation();

  // Add sidebar UI translation keys
  t("sidebar.expandSidebar", "Expand sidebar");
  t("sidebar.collapseSidebar", "Collapse sidebar");
  t("sidebar.collapse", "Collapse");
  t("sidebar.hasSubmenu", "Has submenu");

  return {
    overview: [
      { to: "/", icon: BarChart3, label: t("common.dashboard") },
    ],
    fuelManagement: [
      {
        to: "/fuel-management",
        icon: IconGasStation,
        label: t("common.fuelManagement"),
        children: [
          {
            to: "/fuel-management/filling-systems",
            icon: IconGasStation,
            label: t("common.fillingSystems"),
          },
          {
            to: "/fuel-management/tanks",
            icon: IconTank,
            label: t("common.tanks"),
          },
          {
            to: "/fuel-management/fuel-supplies",
            icon: IconReceipt,
            label: t("common.fuelSupplies"),
          },
        ],
      },
    ],
    salesFinance: [
      {
        to: "/finance",
        icon: IconCash,
        label: t("common.finance"),
        children: [
          { to: "/finance/sales", icon: BarChart3, label: t("common.sales") },
          {
            to: "/finance/shifts",
            icon: CalendarClock,
            label: t("common.shifts"),
          },
          {
            to: "/finance/expenses",
            icon: IconCoin,
            label: t("common.expenses"),
          },
        ],
      },
    ],
    management: [
      { to: "/employees", icon: Users, label: t("common.employees") },
      { to: "/syncup", icon: Database, label: t("common.supabaseSync") },
      { to: "/settings", icon: Settings, label: t("common.settings") },
    ],
    development: [{ to: "/debug", icon: Bug, label: t("common.debug") }],
  };
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
