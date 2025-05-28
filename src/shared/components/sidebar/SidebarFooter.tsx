import React, { useState } from "react";
import { Button } from "@/core/components/ui/button";
import { useTranslation } from "react-i18next";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { SessionLogoutDialogStandardized } from "../settings/SessionLogoutDialogStandardized";
import { cn } from "@/shared/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/core/components/ui/tooltip";
import { SidebarShortcuts } from "@/core/components/ui/composed/sidebar-shortcuts";
import { useHotkeys } from "react-hotkeys-hook";

interface SidebarFooterProps {
  collapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  onSignOut?: () => void;
}

export function SidebarFooter({
  collapsed = false,
  onToggleCollapse,
  onSignOut,
}: SidebarFooterProps) {
  const { t } = useTranslation();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    if (onSignOut) {
      onSignOut();
    }
  };

  const toggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse(!collapsed);
    }
  };

  // Add keyboard shortcut for theme toggle
  useHotkeys(
    "alt+t",
    () => {
      // This triggers the theme toggle in the parent component
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "t", altKey: true })
      );
    },
    []
  );

  // Wrap with tooltip if collapsed
  const renderLogoutButton = () => {
    const button = (
      <Button
        variant="ghost"
        className={cn(
          "w-full font-normal transition-colors duration-200",
          "hover:bg-destructive/10 hover:text-destructive",
          "focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2",
          collapsed ? "justify-center px-0" : "justify-start"
        )}
        onClick={handleLogout}
        aria-label={t("settings.logout")}
      >
        <LogOut className={cn("h-4 w-4", collapsed ? "" : "mr-2")} />
        {!collapsed && t("settings.logout")}
      </Button>
    );

    if (collapsed) {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-destructive text-destructive-foreground"
            >
              {t("settings.logout")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  };

  const renderCollapseButton = () => {
    if (!onToggleCollapse) return null;

    const button = (
      <Button
        variant="outline"
        size="sm"
        onClick={toggleCollapse}
        className={cn(
          "transition-all duration-200 group",
          "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "hover:bg-primary/10 hover:text-primary",
          collapsed
            ? "w-10 h-10 rounded-full p-0 mx-auto"
            : "w-full justify-between"
        )}
        aria-label={
          collapsed ? t("sidebar.expandSidebar") : t("sidebar.collapseSidebar")
        }
        aria-pressed={collapsed}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        ) : (
          <>
            <span className="flex items-center gap-2">
              {t("sidebar.collapse")}
              <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                Alt + S
              </kbd>
            </span>
            <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          </>
        )}
      </Button>
    );

    if (collapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="right">
              {t("sidebar.expandSidebar")}
              <div className="text-xs mt-1 opacity-80">
                <kbd className="inline-flex h-4 select-none items-center gap-1 rounded border bg-gray-50 px-1 font-mono text-[10px] font-medium">
                  Alt + S
                </kbd>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  };

  return (
    <div
      className={cn(
        "sidebar-footer border-t p-3 space-y-3",
        "transition-all duration-300 ease-in-out"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <SidebarShortcuts collapsed={collapsed} />
        {!collapsed && (
          <span className="text-xs text-muted-foreground">
            {t("sidebar.keyboardShortcuts")}
          </span>
        )}
      </div>

      {renderCollapseButton()}
      {renderLogoutButton()}

      <SessionLogoutDialogStandardized
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
        onConfirm={handleConfirmLogout}
        isLoading={false}
        confirmText={t("settings.confirmLogout")}
        cancelText={t("common.cancel")}
        title={t("settings.logout")}
        description={t("settings.logoutConfirmation")}
        confirmButtonProps={{
          className:
            "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
        }}
      />
    </div>
  );
}
