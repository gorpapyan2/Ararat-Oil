import {
  Home,
  Settings,
  Users,
  BarChart,
  Receipt,
  ListChecks,
  CalendarClock,
  Bug,
  Fuel,
  Wallet,
} from "lucide-react";
import {
  IconGasStation,
  IconTank,
  IconTruck
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export const useSidebarNavConfig = () => {
  const { t } = useTranslation();

  // Add sidebar UI translation keys
  t("sidebar.expandSidebar", "Expand sidebar");
  t("sidebar.collapseSidebar", "Collapse sidebar");
  t("sidebar.collapse", "Collapse");
  t("sidebar.hasSubmenu", "Has submenu");

  return {
    overview: [
      { to: "/", icon: Home, label: t("common.dashboard") },
      { to: "/todo", icon: ListChecks, label: t("common.todo") },
    ],
    fuelManagement: [
      { 
        to: "/fuel-management", 
        icon: Fuel, 
        label: t("common.fuelManagement"),
        children: [
          { to: "/fuel-management/filling-systems", icon: IconGasStation, label: t("common.fillingSystems") },
          { to: "/fuel-management/tanks", icon: IconTank, label: t("common.tanks") },
          { to: "/fuel-management/fuel-supplies", icon: IconTruck, label: t("common.fuelSupplies") },
        ]
      },
    ],
    salesFinance: [
      { 
        to: "/finance", 
        icon: Wallet, 
        label: t("common.finance"),
        children: [
          { to: "/finance/sales", icon: BarChart, label: t("common.sales") },
          { to: "/finance/shifts", icon: CalendarClock, label: t("common.shifts") },
          { to: "/finance/expenses", icon: Receipt, label: t("common.expenses") },
        ]
      },
    ],
    management: [
      { to: "/employees", icon: Users, label: t("common.employees") },
      { to: "/settings", icon: Settings, label: t("common.settings") },
    ],
    development: [
      { to: "/debug", icon: Bug, label: t("common.debug") },
    ],
  };
};
