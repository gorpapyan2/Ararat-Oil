import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { Moon, Sun, Monitor } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

interface ThemeSwitcherProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function ThemeSwitcher({
  variant = "ghost", 
  size = "default",
  className
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  // Animation variants for the icon rotation
  const iconVariants = {
    initial: { scale: 0.6, rotate: 0 },
    animate: { scale: 1, rotate: 0 },
    exit: { scale: 0.6, rotate: 90 },
    hover: { scale: 1.1 }
  };

  const getCurrentIcon = () => {
    switch (theme) {
      case "dark":
        return (
          <motion.div
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover="hover"
            className="h-[1.2rem] w-[1.2rem]"
          >
            <Moon className="h-full w-full" />
          </motion.div>
        );
      case "light":
        return (
          <motion.div
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover="hover"
            className="h-[1.2rem] w-[1.2rem]"
          >
            <Sun className="h-full w-full" />
          </motion.div>
        );
      case "system":
        return (
          <motion.div
            variants={iconVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover="hover"
            className="h-[1.2rem] w-[1.2rem]"
          >
            <Monitor className="h-full w-full" />
          </motion.div>
        );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size === "lg" ? "default" : size}
          className={cn(
            "h-9 w-9 px-0 rounded-md",
            "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
            className
          )}
          aria-label={t("sidebar.toggleTheme")}
          title={t("sidebar.toggleTheme")}
        >
          <span className="sr-only">{t("sidebar.toggleTheme")}</span>
          {getCurrentIcon()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            theme === "light" && "bg-accent/20 text-accent font-medium"
          )}
        >
          <Sun className="h-4 w-4" />
          <span>{t("settings.light")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            theme === "dark" && "bg-accent/20 text-accent font-medium"
          )}
        >
          <Moon className="h-4 w-4" />
          <span>{t("settings.dark")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn(
            "flex items-center gap-2 cursor-pointer",
            theme === "system" && "bg-accent/20 text-accent font-medium"
          )}
        >
          <Monitor className="h-4 w-4" />
          <span>{t("settings.system")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
