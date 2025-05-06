import {
  Home,
  Settings,
  Users,
  BarChart,
  Receipt,
  ListChecks,
  CalendarClock,
  Bug,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export const useSidebarNavConfig = () => {
  const { t } = useTranslation();

  return {
    overview: [
      { to: "/", icon: Home, label: t("common.dashboard") },
      { to: "/todo", icon: ListChecks, label: t("common.todo") },
    ],
    salesFinance: [
      { to: "/sales", icon: BarChart, label: t("common.sales") },
      { to: "/shifts", icon: CalendarClock, label: t("common.shifts") },
      { to: "/expenses", icon: Receipt, label: t("common.expenses") },
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
