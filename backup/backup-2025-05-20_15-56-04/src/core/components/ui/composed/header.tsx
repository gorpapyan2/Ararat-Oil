import React from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from '@/core/components/ui/language-switcher';
import { useIsMobile } from "@/hooks/useResponsive";
import { Bell, HelpCircle, Settings } from "lucide-react";
import { cn } from "@/shared/utils";
import { Button } from "@/core/components/ui/primitives/button";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <header
      className={cn(
        "h-16 shrink-0 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
        "flex items-center justify-between px-4",
        className,
      )}
    >
      <div className="flex-1">
        {/* Placeholder for left section if needed */}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("common.help") || "Help"}
        >
          <HelpCircle className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label={t("common.notifications") || "Notifications"}
        >
          <Bell className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label={t("common.settings") || "Settings"}
        >
          <Settings className="h-5 w-5" />
        </Button>

        <LanguageSwitcher variant="icon" className="ml-2" />
      </div>
    </header>
  );
}
