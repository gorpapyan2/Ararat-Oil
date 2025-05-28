import React from "react";
import { Breadcrumb } from "@/core/components/ui/primitives/breadcrumb";
import { useBreadcrumbs } from "@/core/providers/BreadcrumbProvider";
import { cn } from "@/shared/utils";
import { useTranslation } from "react-i18next";

interface HeaderBreadcrumbProps {
  className?: string;
  showTitle?: boolean;
  maxItems?: number;
}

/**
 * A simplified version of the HeaderBreadcrumb component without animations
 */
export function HeaderBreadcrumb({
  className,
  showTitle = true,
  maxItems = 3,
}: HeaderBreadcrumbProps) {
  const { breadcrumbs } = useBreadcrumbs();
  const { t } = useTranslation();

  // Get the current page title (last breadcrumb or Dashboard)
  const pageTitle =
    breadcrumbs.length > 0
      ? breadcrumbs[breadcrumbs.length - 1].name
      : t("common.dashboard");

  // Filter out any invalid segments with missing required properties
  const validBreadcrumbs = breadcrumbs.filter(
    (segment) =>
      segment &&
      typeof segment.name === "string" &&
      typeof segment.href === "string"
  );

  return (
    <div className={cn("flex flex-col space-y-1 overflow-hidden", className)}>
      {validBreadcrumbs.length > 0 ? (
        <div>
          <Breadcrumb
            segments={validBreadcrumbs}
            className="py-1"
            maxItems={maxItems}
          />
        </div>
      ) : (
        showTitle && (
          <div className="flex items-center">
            <h1 className="font-heading font-semibold text-xl">{pageTitle}</h1>
          </div>
        )
      )}

      {/* Optional breadcrumb subtitle or metadata */}
      {validBreadcrumbs.length > 0 && showTitle && (
        <div className="flex items-center text-sm text-muted-foreground">
          <h1 className="font-heading font-semibold text-xl truncate max-w-[85%]">
            {pageTitle}
          </h1>
        </div>
      )}
    </div>
  );
}
