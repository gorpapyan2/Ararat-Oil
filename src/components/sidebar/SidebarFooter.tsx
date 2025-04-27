import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/ui/ThemeSwitcher";
import { useTranslation } from "react-i18next";

interface SidebarFooterProps {
  collapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
  onSignOut: () => void;
}

export function SidebarFooter({
  collapsed,
  onToggleCollapse,
  onSignOut,
}: SidebarFooterProps) {
  const { t } = useTranslation();

  return (
    <div className="border-t p-4 space-y-4">
      {/* Theme toggle */}
      <div
        className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        {!collapsed && (
          <span className="text-sm text-muted-foreground">
            {t("common.theme")}
          </span>
        )}
        <ThemeSwitcher variant="ghost" />
      </div>

      {/* Collapse button */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-center"
        onClick={() => onToggleCollapse(!collapsed)}
        title={collapsed ? t("common.expand") : t("common.collapse")}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <>
            <ChevronLeft className="h-4 w-4 mr-2" />
            <span>{t("common.collapse")}</span>
          </>
        )}
      </Button>

      {/* Sign out button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onSignOut}
        className="w-full justify-center text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
      >
        {collapsed ? (
          <LogOut className="h-4 w-4" />
        ) : (
          <>
            <LogOut className="h-4 w-4 mr-2" />
            <span>{t("common.signOut")}</span>
          </>
        )}
      </Button>
    </div>
  );
}
