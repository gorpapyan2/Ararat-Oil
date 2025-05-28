import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/shared/utils";
import { useTranslation } from "react-i18next";

interface SidebarLogoProps {
  collapsed?: boolean;
}

export function SidebarLogo({ collapsed = false }: SidebarLogoProps) {
  const { t } = useTranslation();
  const appName = "Ararat Oil";
  const shortAppName = "AO";

  return (
    <div
      className={cn(
        "h-14 flex items-center border-b px-4",
        "transition-all duration-300 ease-in-out"
      )}
    >
      <Link
        to="/"
        className={cn(
          "flex items-center gap-2 font-heading transition-all duration-300 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "rounded-md",
          collapsed ? "justify-center w-full" : "justify-start"
        )}
        aria-label={t("common.backToDashboard")}
      >
        <div
          className={cn(
            "flex items-center justify-center rounded-md bg-primary text-primary-foreground",
            "transition-all duration-300 ease-in-out transform",
            collapsed ? "w-10 h-10" : "w-8 h-8",
            "hover:scale-105 hover:shadow-md"
          )}
        >
          <span
            className={cn(
              "font-bold transition-all duration-300",
              collapsed ? "text-lg" : "text-sm"
            )}
          >
            {shortAppName}
          </span>
        </div>

        {!collapsed && (
          <div className="overflow-hidden">
            <span className="font-bold text-xl opacity-100 transition-opacity duration-300">
              {appName}
            </span>
          </div>
        )}
      </Link>
    </div>
  );
}
