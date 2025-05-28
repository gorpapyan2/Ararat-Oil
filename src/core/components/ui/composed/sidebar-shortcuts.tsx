import React from "react";
import { cn } from "@/shared/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/primitives/popover";
import { Button } from "@/core/components/ui/button";
import { Keyboard } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ShortcutProps {
  keys: string[];
  description: string;
}

const Shortcut = ({ keys, description }: ShortcutProps) => (
  <div className="flex items-center justify-between text-sm mb-2">
    <span className="text-muted-foreground">{description}</span>
    <div className="flex gap-1 items-center">
      {keys.map((key, index) => (
        <React.Fragment key={index}>
          <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
            {key}
          </kbd>
          {index < keys.length - 1 && (
            <span className="text-muted-foreground">+</span>
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

interface SidebarShortcutsProps {
  collapsed?: boolean;
  className?: string;
}

export function SidebarShortcuts({
  collapsed = false,
  className,
}: SidebarShortcutsProps) {
  const { t } = useTranslation();

  const shortcuts = [
    { keys: ["Alt", "S"], description: t("sidebar.openMenu") },
    { keys: ["Enter"], description: t("sidebar.expandSection") },
    { keys: ["Tab"], description: t("common.navigateBetweenItems") },
    { keys: ["Escape"], description: t("common.closeMenu") },
    { keys: ["Alt", "T"], description: t("sidebar.toggleTheme") },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-md",
            "hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            className
          )}
          aria-label={t("sidebar.keyboardShortcuts")}
          title={t("sidebar.keyboardShortcuts")}
        >
          <Keyboard size={16} className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-4"
        side={collapsed ? "right" : "top"}
        align={collapsed ? "start" : "center"}
        sideOffset={10}
      >
        <div className="space-y-4">
          <h4 className="text-sm font-medium">
            {t("sidebar.keyboardShortcuts")}
          </h4>
          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <Shortcut
                key={index}
                keys={shortcut.keys}
                description={shortcut.description}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
