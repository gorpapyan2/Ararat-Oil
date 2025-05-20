import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/useResponsive";
import { Separator } from '@/core/components/ui/separator';

interface PageLayoutProps {
  children: React.ReactNode;
  titleKey: string;
  descriptionKey?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export function PageLayout({
  children,
  titleKey,
  descriptionKey,
  icon: Icon,
  action,
  className,
}: PageLayoutProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <Icon size={isMobile ? 18 : 24} />
              </div>
            )}
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                {t(titleKey)}
              </h1>
              {descriptionKey && (
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  {t(descriptionKey)}
                </p>
              )}
            </div>
          </div>

          {action && <div className="w-full sm:w-auto">{action}</div>}
        </div>
        <Separator className="mt-4" />
      </div>

      <div className="space-y-6">{children}</div>
    </div>
  );
}
