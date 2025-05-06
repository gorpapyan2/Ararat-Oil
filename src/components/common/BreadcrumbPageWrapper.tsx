import React, { ReactNode } from "react";
import { usePageBreadcrumbs } from "@/hooks/usePageBreadcrumbs";

type BreadcrumbPageWrapperProps = {
  breadcrumbs: Parameters<typeof usePageBreadcrumbs>[0]["segments"];
  title: string;
  children: ReactNode;
  appName?: string;
};

/**
 * Wrapper component to make it even easier to add breadcrumbs to pages
 * 
 * @example
 * <BreadcrumbPageWrapper
 *   breadcrumbs={[
 *     { name: t("common.dashboard"), href: "/" },
 *     { name: t("common.settings"), href: "/settings", isCurrent: true }
 *   ]}
 *   title={t("common.settings")}
 * >
 *   <YourPageContent />
 * </BreadcrumbPageWrapper>
 */
export function BreadcrumbPageWrapper({
  breadcrumbs,
  title,
  children,
  appName
}: BreadcrumbPageWrapperProps) {
  // Set up breadcrumbs using the hook
  usePageBreadcrumbs({
    segments: breadcrumbs,
    title,
    appName
  });

  // Simply render the children
  return <>{children}</>;
} 