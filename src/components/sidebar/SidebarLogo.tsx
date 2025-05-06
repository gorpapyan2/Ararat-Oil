import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface SidebarLogoProps {
  collapsed: boolean;
}

export function SidebarLogo({ collapsed }: SidebarLogoProps) {
  const { t } = useTranslation();
  
  return (
    <div
      className={cn(
        "h-16 flex items-center px-4 border-b",
        collapsed ? "justify-center" : "justify-between",
      )}
    >
      {!collapsed ? (
        <span className="font-heading font-bold text-xl">{t("common.appName")}</span>
      ) : (
        <span className="font-heading font-bold text-accent text-lg">{t("common.appShort")}</span>
      )}
    </div>
  );
}
