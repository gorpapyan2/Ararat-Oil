import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PageHeaderProps {
  title?: string;
  titleKey?: string;
  description?: string;
  descriptionKey?: string;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  titleKey,
  description,
  descriptionKey,
  actions,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  const { t } = useTranslation();
  const translatedTitle = titleKey ? t(titleKey) : title;
  const translatedDescription = descriptionKey
    ? t(descriptionKey)
    : description;

  return (
    <div className={cn("mb-8", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}

      {/* Title and actions row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-semibold tracking-tight">
            {translatedTitle}
          </h1>
          {translatedDescription && (
            <p className="mt-1 text-muted-foreground">
              {translatedDescription}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
    </div>
  );
}

interface PageHeaderActionProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
}

export function PageHeaderAction({
  children,
  onClick,
  disabled = false,
  className,
  variant = "default",
}: PageHeaderActionProps) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </Button>
  );
}

interface CreateButtonProps {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export function CreateButton({
  onClick,
  label = "Create New",
  disabled = false,
  icon,
}: CreateButtonProps) {
  return (
    <Button onClick={onClick} disabled={disabled}>
      {icon || <PlusIcon className="h-4 w-4 mr-2" />}
      {!icon && <span className="mr-2" />}
      {label}
    </Button>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="mb-8 animate-pulse">
      <div className="h-9 w-64 bg-muted rounded mb-2" />
      <div className="h-5 w-96 bg-muted rounded opacity-70" />
    </div>
  );
}
