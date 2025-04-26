import React from "react";
import { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PageLayoutProps {
  title?: string;
  titleKey?: string;
  description?: string;
  descriptionKey?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function PageLayout({
  title,
  titleKey,
  description,
  descriptionKey,
  icon: Icon,
  action,
  children,
}: PageLayoutProps) {
  const { t } = useTranslation();

  const translatedTitle = titleKey ? t(titleKey) : title;
  const translatedDescription = descriptionKey ? t(descriptionKey) : description;

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 pb-16 pt-2 space-y-6 max-w-[1920px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-card sm:bg-transparent p-4 sm:p-0 rounded-lg shadow-sm sm:shadow-none mb-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          {Icon && (
            <div className="hidden sm:flex justify-center items-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
          )}
          <div className="space-y-1">
            {translatedTitle && (
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{translatedTitle}</h2>
            )}
            {translatedDescription && (
              <p className="text-xs sm:text-sm text-muted-foreground">
                {translatedDescription}
              </p>
            )}
          </div>
        </div>
        {action && (
          <div className="w-full sm:w-auto">{action}</div>
        )}
      </div>

      {/* Page Content */}
      {children}
    </div>
  );
} 