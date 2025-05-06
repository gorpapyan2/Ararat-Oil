import * as React from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import {
  PageHeaderPrimitive,
  PageHeaderTitlePrimitive,
  PageHeaderDescriptionPrimitive,
  PageHeaderActionsPrimitive,
} from "@/components/ui/primitives/page-header";

export interface PageHeaderProps extends React.ComponentPropsWithoutRef<typeof PageHeaderPrimitive> {
  /**
   * Title text to display
   */
  title?: string;
  
  /**
   * Translation key for title
   */
  titleKey?: string;
  
  /**
   * Description text to display
   */
  description?: string;
  
  /**
   * Translation key for description
   */
  descriptionKey?: string;
  
  /**
   * Actions to display in the header (buttons, etc.)
   */
  actions?: React.ReactNode;
  
  /**
   * Icon to display next to the title
   */
  icon?: React.ReactNode;
}

/**
 * Page header component with title, description, actions, and breadcrumbs
 */
export const PageHeader = React.forwardRef<
  React.ElementRef<typeof PageHeaderPrimitive>,
  PageHeaderProps
>(({ 
  className, 
  title,
  titleKey,
  description,
  descriptionKey,
  actions,
  icon,
  ...props 
}, ref) => {
  const { t } = useTranslation();
  
  const translatedTitle = titleKey ? t(titleKey) : title;
  const translatedDescription = descriptionKey ? t(descriptionKey) : description;

  return (
    <PageHeaderPrimitive
      ref={ref}
      className={cn("mb-8", className)}
      {...props}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {translatedTitle && (
            <PageHeaderTitle>
              {icon && <span className="inline-flex items-center">{icon}</span>}
              {translatedTitle}
            </PageHeaderTitle>
          )}
          
          {translatedDescription && (
            <PageHeaderDescription>
              {translatedDescription}
            </PageHeaderDescription>
          )}
        </div>

        {actions && (
          <PageHeaderActions>
            {actions}
          </PageHeaderActions>
        )}
      </div>
    </PageHeaderPrimitive>
  );
});
PageHeader.displayName = "PageHeader";

export interface PageHeaderTitleProps extends React.ComponentPropsWithoutRef<typeof PageHeaderTitlePrimitive> {
  /**
   * Size variant for the title
   * @default "default"
   */
  size?: "small" | "default" | "large";
}

/**
 * Title component for the page header
 */
export const PageHeaderTitle = React.forwardRef<
  React.ElementRef<typeof PageHeaderTitlePrimitive>,
  PageHeaderTitleProps
>(({ className, size = "default", ...props }, ref) => {
  const sizeClasses = {
    small: "text-xl md:text-2xl",
    default: "text-2xl md:text-3xl",
    large: "text-3xl md:text-4xl",
  };

  return (
    <PageHeaderTitlePrimitive
      ref={ref}
      className={cn(
        "font-heading font-semibold tracking-tight",
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
});
PageHeaderTitle.displayName = "PageHeaderTitle";

export interface PageHeaderDescriptionProps extends React.ComponentPropsWithoutRef<typeof PageHeaderDescriptionPrimitive> {}

/**
 * Description component for the page header
 */
export const PageHeaderDescription = React.forwardRef<
  React.ElementRef<typeof PageHeaderDescriptionPrimitive>,
  PageHeaderDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <PageHeaderDescriptionPrimitive
      ref={ref}
      className={cn("mt-1 text-muted-foreground", className)}
      {...props}
    />
  );
});
PageHeaderDescription.displayName = "PageHeaderDescription";

export interface PageHeaderActionsProps extends React.ComponentPropsWithoutRef<typeof PageHeaderActionsPrimitive> {}

/**
 * Actions container for the page header
 */
export const PageHeaderActions = React.forwardRef<
  React.ElementRef<typeof PageHeaderActionsPrimitive>,
  PageHeaderActionsProps
>(({ className, ...props }, ref) => {
  return (
    <PageHeaderActionsPrimitive
      ref={ref}
      className={cn("flex items-center gap-2 shrink-0", className)}
      {...props}
    />
  );
});
PageHeaderActions.displayName = "PageHeaderActions";

/**
 * Skeleton loading state for the page header
 */
export function PageHeaderSkeleton() {
  return (
    <div className="mb-8 animate-pulse">
      <div className="h-9 w-64 bg-muted rounded mb-2" />
      <div className="h-5 w-96 bg-muted rounded opacity-70" />
    </div>
  );
} 