import * as React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/core/components/ui/primitives/button";
import { cn } from "@/shared/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/core/components/ui/dropdown-menu';
import { Check, Globe } from "lucide-react";

interface LanguageSwitcherProps {
  collapsed?: boolean;
  variant?: "default" | "sidebar" | "icon";
  size?: "default" | "sm" | "lg";
  className?: string;
}

// The available languages in the application
const languages = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hy", label: "Armenian", nativeLabel: "Հայերեն" },
];

export function LanguageSwitcher({
  collapsed = false,
  variant = "sidebar",
  size = "default",
  className,
}: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    // Store language preference in localStorage for persistence
    localStorage.setItem("i18nextLng", code);
  };

  // Return different UI based on variant
  if (variant === "icon") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn("rounded-full", className)}
            aria-label={t("common.changeLanguage")}
          >
            <Globe className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                currentLanguage === lang.code && "font-medium",
              )}
            >
              {currentLanguage === lang.code && <Check className="h-4 w-4" />}
              <span className={currentLanguage === lang.code ? "ml-0" : "ml-6"}>
                {lang.nativeLabel}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Sidebar variant (original behavior with collapsed support)
  if (variant === "sidebar") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size={size === "default" ? "sm" : size}
            className={cn(
              "min-h-[36px] transition-all duration-200",
              collapsed ? "w-10 p-0" : "min-w-[80px]",
              className,
            )}
            aria-label={t("common.changeLanguage")}
          >
            {collapsed ? (
              <span className="font-medium">
                {currentLanguage === "en" ? "HY" : "EN"}
              </span>
            ) : (
              <span className="font-medium flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {currentLanguage === "en" ? "English" : "Հայերեն"}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={cn(
                "flex items-center gap-2 cursor-pointer",
                currentLanguage === lang.code && "font-medium",
              )}
            >
              {currentLanguage === lang.code && <Check className="h-4 w-4" />}
              <span className={currentLanguage === lang.code ? "ml-0" : "ml-6"}>
                {lang.nativeLabel}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Default variant - simple language toggler (no dropdown)
  return (
    <Button
      variant="outline"
      size={size === "default" ? "sm" : size}
      onClick={() => changeLanguage(currentLanguage === "en" ? "hy" : "en")}
      className={cn("min-h-[36px]", className)}
      aria-label={t("common.changeLanguage")}
    >
      <span className="font-medium flex items-center gap-2">
        <Globe className="h-4 w-4" />
        {currentLanguage === "en" ? "English" : "Հայերեն"}
      </span>
    </Button>
  );
}
